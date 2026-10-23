import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { verifyAcceptanceEvidenceBundle } from "./verify-acceptance-evidence-bundle.mjs";

function manifestFor(files) {
  return `sha256:${createHash("sha256").update(JSON.stringify(files)).digest("hex")}`;
}

async function writeBundle(root, entries, name = "bundle.json") {
  const files = entries.map(({ path, content }) => {
    const bytes = Buffer.from(content);
    return { path, sha256: createHash("sha256").update(bytes).digest("hex"), bytes: bytes.byteLength };
  }).sort((left, right) => left.path.localeCompare(right.path));
  for (const { path, content } of entries) await writeFile(join(root, path), content);
  const bundle = {
    schema: "verglos.private.acceptance-evidence-bundle.v1",
    manifestSha256: manifestFor(files),
    files,
    gateBoundary: { providerLifecycle: "open", accountDeletion: "open" },
  };
  const bundlePath = join(root, name);
  await writeFile(bundlePath, `${JSON.stringify(bundle)}\n`);
  return bundlePath;
}

test("verifier passes a canonical untampered bundle", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-acceptance-verify-"));
  try {
    const bundlePath = await writeBundle(root, [{ path: "b.md", content: "b\n" }, { path: "a.md", content: "a\n" }]);
    const report = verifyAcceptanceEvidenceBundle({ bundlePath, bundleRoot: root });
    assert.equal(report.status, "passed");
    assert.equal(report.fileCount, 2);
    assert.equal(report.mismatchCount, 0);
    assert.equal(report.manifestMatches, true);
    assert.equal(report.secretScan, "passed");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("verifier reports byte and manifest tampering", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-acceptance-verify-"));
  try {
    const bundlePath = await writeBundle(root, [{ path: "a.md", content: "original\n" }]);
    await writeFile(join(root, "a.md"), "tampered\n");
    const report = verifyAcceptanceEvidenceBundle({ bundlePath, bundleRoot: root });
    assert.equal(report.status, "failed");
    assert.equal(report.mismatchCount, 1);
    assert.equal(report.manifestMatches, true);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("verifier rejects symlinked and secret-like evidence", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-acceptance-verify-"));
  try {
    const bundlePath = await writeBundle(root, [{ path: "secret.md", content: "safe\n" }]);
    await rm(join(root, "secret.md"));
    await writeFile(join(root, "real.md"), "DATABASE_URL=secret-like\n");
    await symlink(join(root, "real.md"), join(root, "secret.md"));
    const report = verifyAcceptanceEvidenceBundle({ bundlePath, bundleRoot: root });
    assert.equal(report.status, "failed");
    assert.equal(report.mismatchCount, 1);
    assert.deepEqual(report.secretLikePaths, []);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("verifier rejects unsafe manifest paths", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-acceptance-verify-"));
  try {
    const files = [{ path: "../escape.md", sha256: "0".repeat(64), bytes: 0 }];
    const bundlePath = join(root, "bundle.json");
    await writeFile(bundlePath, JSON.stringify({ schema: "verglos.private.acceptance-evidence-bundle.v1", manifestSha256: manifestFor(files), files }));
    assert.throws(() => verifyAcceptanceEvidenceBundle({ bundlePath, bundleRoot: root }), /evidence path is unsafe/u);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
