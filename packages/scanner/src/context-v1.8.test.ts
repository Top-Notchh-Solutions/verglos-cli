import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { runScan } from "./index.js";

// v1.8 false-positive-reduction assertions.
//
// Each test reproduces a concrete finding shape observed in the
// ICP-300 scan campaign (v1.5.x cached JSONs) that used to fire and
// should no longer fire — either because a new context tag catches
// the file, or because the detector's own precision filter now
// recognises the shape.

test("v1.8: skills-catalog.json under public/data/ tags as data-content", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-v18-datacontent-"));
  try {
    await mkdir(join(root, "marketplace", "public", "data"), { recursive: true });
    await mkdir(join(root, "src"), { recursive: true });

    // Reproduce the outlier repo shape: a big data JSON where prose
    // inside string values contains code-example fragments. Even one
    // such fragment used to fire D8-001 medium per line.
    await writeFile(
      join(root, "marketplace", "public", "data", "skills-catalog.json"),
      JSON.stringify(
        [
          {
            slug: "example-skill",
            content:
              "In your handler you might write console.log('api key:', apiKey) but never do so in production. Use bcrypt for password hashing.",
          },
          {
            slug: "postgres-tuning",
            content:
              "Connection string looks like postgres://user:pass@host:5432/db. Rotate credentials often.",
          },
        ],
        null,
        2,
      ),
      "utf8",
    );

    // A real prod finding stays untagged — proves the data-content
    // rule isn't over-broad.
    await writeFile(
      join(root, "src", "handler.ts"),
      "console.log('user password:', req.body.password);\n",
      "utf8",
    );

    const result = await runScan({
      projectRoot: root,
      unlocked: true,
      detectors: ["secrets", "misconfig"],
      noProvenance: true,
    });

    const catalogFindings = result.findings.filter((f) =>
      f.file?.endsWith("skills-catalog.json"),
    );
    assert.ok(
      catalogFindings.every((f) => f.contextTag === "data-content"),
      `every skills-catalog finding must tag as data-content; got ${[
        ...new Set(catalogFindings.map((f) => f.contextTag ?? "<none>")),
      ].join(",")}`,
    );
    assert.ok(
      catalogFindings.every((f) => f.severity === "info"),
      "data-content findings must be downgraded to info in non-strict mode",
    );

    const prod = result.findings.filter((f) => f.file?.endsWith("handler.ts"));
    assert.ok(
      prod.some((f) => f.rule === "D8-001" && f.severity !== "info"),
      "the production password-log finding must survive at full severity",
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("v1.8: D8-001 no longer fires on bare `key` / `token` prose", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-v18-d8-"));
  try {
    await mkdir(join(root, "src"), { recursive: true });

    // Concrete false positives from the campaign (webiny scripts):
    //   console.log('Updating key:', key)
    //   console.log('Failed to resolve', dependencies[key])
    //   console.log('token count:', n)
    await writeFile(
      join(root, "src", "iteration.ts"),
      [
        "for (const key of Object.keys(dependencies)) {",
        "  console.log('Updating key:', key);",
        "  console.log('Failed to resolve', dependencies[key]);",
        "}",
        "console.log('token count:', tokens.length);",
        "console.log('auth middleware attached');",
      ].join("\n"),
      "utf8",
    );

    // Real leaks that MUST still fire.
    await writeFile(
      join(root, "src", "leak.ts"),
      [
        "console.log('resetToken:', resetToken);",
        "console.log('api_key=', apiKey);",
        "console.log('user password:', req.body.password);",
        "console.log('private_key:', privateKey);",
      ].join("\n"),
      "utf8",
    );

    const result = await runScan({
      projectRoot: root,
      unlocked: true,
      detectors: ["misconfig"],
      noProvenance: true,
    });

    const iteration = result.findings.filter(
      (f) => f.rule === "D8-001" && f.file?.endsWith("iteration.ts"),
    );
    assert.equal(
      iteration.length,
      0,
      `D8-001 must not fire on bare key/token prose; got ${iteration.length} findings on iteration.ts`,
    );

    const leaks = result.findings.filter(
      (f) => f.rule === "D8-001" && f.file?.endsWith("leak.ts"),
    );
    assert.ok(
      leaks.length >= 4,
      `D8-001 must still fire on real credential-shaped logs; got ${leaks.length}`,
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("v1.8: misconfig line-scan skips .json / .xml / .svg / .html / .csv", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-v18-skipext-"));
  try {
    await mkdir(join(root, "content"), { recursive: true });

    // Every file below contains a would-fire pattern in prose.
    await writeFile(
      join(root, "content", "guide.json"),
      JSON.stringify({
        body: "Never do `origin: '*'` and always avoid `eval(userInput)`. Use crypto.randomBytes, not Math.random().",
      }),
      "utf8",
    );
    await writeFile(
      join(root, "content", "page.html"),
      "<pre>app.use(cors({ origin: '*' })); Math.random(); eval(x);</pre>",
      "utf8",
    );
    await writeFile(
      join(root, "content", "diagram.svg"),
      '<svg><text>Math.random() for OTP is unsafe</text></svg>',
      "utf8",
    );
    await writeFile(
      join(root, "content", "notes.csv"),
      "id,note\n1,use eval() carefully\n2,origin: '*' is bad\n",
      "utf8",
    );

    const result = await runScan({
      projectRoot: root,
      unlocked: true,
      detectors: ["misconfig"],
      noProvenance: true,
    });

    const misconfigFindings = result.findings.filter(
      (f) => f.detector === "misconfig" && f.rule !== "D5-004",
    );
    assert.equal(
      misconfigFindings.length,
      0,
      `misconfig must not scan data-shape file extensions for code patterns; got ${misconfigFindings
        .map((f) => `${f.rule}@${f.file}`)
        .join(", ")}`,
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("v1.8: vendored yarn binary tags as vendored-bundle under binaries/", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-v18-binaries-"));
  try {
    await mkdir(
      join(
        root,
        "packages",
        "create-webiny-project",
        "src",
        "services",
        "SetupYarn",
        "binaries",
      ),
      { recursive: true },
    );
    // A stub with the shape that used to fire D5-003 (eval) on the
    // real yarn.cjs blob. The point is the FILE PATH — binaries/ under
    // any package should tag as vendored-bundle.
    await writeFile(
      join(
        root,
        "packages",
        "create-webiny-project",
        "src",
        "services",
        "SetupYarn",
        "binaries",
        "yarn-4.17.1.cjs",
      ),
      "var json = eval('(' + r.responseText + ')');\n",
      "utf8",
    );

    const result = await runScan({
      projectRoot: root,
      unlocked: true,
      detectors: ["misconfig", "secrets"],
      noProvenance: true,
    });

    const inBinaries = result.findings.filter((f) =>
      f.file?.includes("/binaries/"),
    );
    assert.ok(inBinaries.length > 0, "expected at least one finding on the stubbed yarn.cjs");
    assert.ok(
      inBinaries.every((f) => f.contextTag === "vendored-bundle"),
      `binaries/*.cjs must tag as vendored-bundle; got ${inBinaries
        .map((f) => f.contextTag ?? "<none>")
        .join(",")}`,
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("v1.8: tutorial `book/` chapter code tags as test-fixture", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-v18-book-"));
  try {
    await mkdir(join(root, "book", "10-end", "api"), { recursive: true });
    // The exact shape async-labs-saas ships across 15 chapter dirs.
    await writeFile(
      join(root, "book", "10-end", "api", "index.ts"),
      [
        "app.use((err, req, res, next) => {",
        "  res.json({ error: err.message || err.toString() });",
        "});",
      ].join("\n"),
      "utf8",
    );

    const result = await runScan({
      projectRoot: root,
      unlocked: true,
      detectors: ["ai-patterns"],
      noProvenance: true,
    });

    const bookFindings = result.findings.filter((f) =>
      f.file?.startsWith("book/"),
    );
    assert.ok(bookFindings.length > 0, "expected AI-008 to still fire on the tutorial handler");
    assert.ok(
      bookFindings.every((f) => f.contextTag === "test-fixture"),
      `book/ files must tag as test-fixture; got ${bookFindings
        .map((f) => f.contextTag ?? "<none>")
        .join(",")}`,
    );
    assert.ok(
      bookFindings.every((f) => f.severity === "info"),
      "book/ findings must be downgraded to info",
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
