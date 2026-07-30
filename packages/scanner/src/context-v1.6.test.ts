import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { runScan } from "./index.js";
import { calculateScore, type Finding } from "@verglos/shared";

// v1.6 noise-reduction assertions.
//
// The scanner already runs a full post-detection context-tag pass (see
// context-tags.ts — vendored-bundle, generated, test-fixture,
// dev-fixture, ci-workflow, build-config, api-spec-example, docs) that
// stamps `contextTag` + `originalSeverity` and downgrades severity to
// info. What v1.6 adds is:
//
// - calculateScore actually EXCLUDES those tagged findings from the
//   score in non-strict mode. Before v1.6 the tag was set but the
//   finding still tanked the score.
// - AI-005 / AI-006 / D6-001 emit `file: "package.json"` /
//   "package-lock.json" so downstream reporters stop showing
//   `undefined:undefined`.
// - AI-003 IDOR fires at medium severity, not high, because Verglos
//   can't see upstream middleware and marking every hit "high"
//   overstates certainty.
// - When a repo has zero criticals, total penalty is capped at 90 so
//   the score doesn't zero out over stacked high findings.

test("v1.6: context-tagged findings are excluded from the score in non-strict mode", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-v16-ctx-"));
  try {
    // eval() inside a vendored bundle — the exact pattern the ICP top
    // 300 v1.5.2 campaign showed firing 463× on third-party JS the
    // maintainer didn't write (rapidoc-min.js, UEditor bundles).
    await mkdir(join(root, "public", "libraries"), { recursive: true });
    await writeFile(
      join(root, "public", "libraries", "rapidoc-min.js"),
      "var json = eval('(' + r.responseText + ')');\n",
      "utf8",
    );

    // A real prod file with a real problem so we can confirm the
    // classifier isn't accidentally downgrading everything.
    await mkdir(join(root, "src"), { recursive: true });
    await writeFile(
      join(root, "src", "handler.ts"),
      "app.use(cors({ origin: '*', credentials: true }));\n",
      "utf8",
    );

    const result = await runScan({
      projectRoot: root,
      unlocked: true,
      detectors: ["secrets", "misconfig", "injection", "ai-patterns"],
      noProvenance: true,
    });

    const tagged = result.findings.filter((f) => f.contextTag != null);
    assert.ok(
      tagged.length > 0,
      "expected the vendored-bundle path to receive a context tag from applyContextTags",
    );
    assert.ok(
      tagged.every((f) => f.severity === "info"),
      `all context-tagged findings should be downgraded to info-tier; got severities ${[...new Set(tagged.map((f) => f.severity))].join(",")}`,
    );
    assert.ok(
      tagged.every((f) => f.originalSeverity != null),
      "originalSeverity must be preserved so the reporter can explain the downgrade",
    );

    // The prod file's wildcard CORS survives untagged and at full severity.
    const prod = result.findings.filter((f) => f.contextTag == null);
    assert.ok(
      prod.some((f) => f.file?.endsWith("handler.ts") && f.severity !== "info"),
      "the production wildcard-CORS finding should survive at full severity",
    );

    // Score is not tanked by the vendored eval — that's the whole
    // point of the v1.6 calculateScore change. Confirm by synthesising
    // the same findings against calculateScore directly.
    const scoreWithTag = calculateScore(
      [
        {
          id: "t-1",
          detector: "misconfig",
          rule: "D5-003",
          domain: "D5",
          severity: "info",
          title: "eval in vendored bundle",
          description: "test",
          confidence: "high",
          contextTag: "vendored-bundle",
          originalSeverity: "high",
          category: "Security Misconfiguration",
        },
      ],
      false,
    );
    assert.equal(
      scoreWithTag.value,
      100,
      "a repo with only context-tagged findings should score 100 in non-strict mode",
    );

    // Strict mode counts them (same policy as the pre-existing
    // context: "test" behavior).
    const strictScoreWithTag = calculateScore(
      [
        {
          id: "t-1",
          detector: "misconfig",
          rule: "D5-003",
          domain: "D5",
          severity: "info",
          title: "eval in vendored bundle",
          description: "test",
          confidence: "high",
          contextTag: "vendored-bundle",
          originalSeverity: "high",
          category: "Security Misconfiguration",
        },
      ],
      true,
    );
    // Info severity finding still doesn't score even in strict, because
    // info findings themselves don't add penalty — the downgrade
    // already happened. This asserts the strict path isn't broken.
    assert.equal(strictScoreWithTag.value, 100);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

// Fix 3 — score floor at 10 when there are zero criticals in scope.
test("v1.6: score floor at 10 when there are zero criticals", () => {
  const highs: Finding[] = [];
  const domains = ["D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9"] as const;
  for (const d of domains) {
    for (let i = 0; i < 30; i++) {
      highs.push({
        id: `h-${d}-${i}`,
        detector: "injection",
        rule: `${d}-high-${i}`,
        domain: d,
        severity: "high",
        title: "synthesised high",
        description: "test",
        confidence: "high",
        context: "production",
        category: "Input Validation & Injection",
      });
    }
  }

  const score = calculateScore(highs, false);
  assert.equal(score.counts.critical, 0);
  assert.ok(
    score.value >= 10,
    `score with 0 crit + 270 high across 9 domains should be >= 10; got ${score.value}`,
  );

  const withCrit: Finding[] = [
    ...highs,
    {
      id: "c-1",
      detector: "injection",
      rule: "D1-001",
      domain: "D1",
      severity: "critical",
      title: "SQL injection",
      description: "test",
      confidence: "certain",
      context: "production",
      category: "Input Validation & Injection",
    },
  ];
  const scoreWithCrit = calculateScore(withCrit, false);
  assert.equal(scoreWithCrit.counts.critical, 1);
  assert.ok(scoreWithCrit.value <= score.value);

  assert.equal(calculateScore([], false).value, 100);
});

// Fix 4 — AI-003 IDOR emits at severity: medium by default.
test("v1.6: AI-003 IDOR fires at medium severity, not high", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-v16-ai003-"));
  try {
    await mkdir(join(root, "src", "routes"), { recursive: true });
    await writeFile(
      join(root, "src", "routes", "invoice.ts"),
      [
        "import { Router } from 'express';",
        "import { db } from '../db';",
        "const router = Router();",
        "router.get('/invoice/:id', async (req, res) => {",
        "  const invoice = await db.invoice.findUnique({ where: { id: req.params.id } });",
        "  res.json(invoice);",
        "});",
        "export default router;",
      ].join("\n"),
      "utf8",
    );

    await writeFile(
      join(root, "package.json"),
      JSON.stringify({ name: "test", version: "0.0.0" }),
      "utf8",
    );

    const result = await runScan({
      projectRoot: root,
      unlocked: true,
      detectors: ["ai-patterns"],
      noProvenance: true,
    });

    const idor = result.findings.filter((f) => f.rule === "AI-003");
    assert.ok(idor.length >= 1, "expected AI-003 to fire on the un-scoped findUnique pattern");
    assert.ok(
      idor.every((f) => f.severity === "medium"),
      `AI-003 should emit at medium severity in v1.6; got ${idor.map((f) => f.severity).join(",")}`,
    );
    assert.ok(
      idor.every((f) => f.confidence === "high"),
      "AI-003 pattern-match confidence stays high — the pattern IS in the code",
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
