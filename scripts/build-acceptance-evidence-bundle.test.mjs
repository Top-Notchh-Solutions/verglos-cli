import assert from "node:assert/strict";
import { mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { buildAcceptanceEvidenceBundle } from "./build-acceptance-evidence-bundle.mjs";

test("bundle builder sorts entries and emits a deterministic content manifest digest", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-acceptance-bundle-"));
  try {
    await writeFile(join(root, "b.md"), "b\n");
    await writeFile(join(root, "a.md"), "a\n");
    const first = buildAcceptanceEvidenceBundle({ bundleRoot: root, bundlePaths: ["b.md", "a.md"], generatedAt: "2026-10-23T12:00:00.000Z" });
    const second = buildAcceptanceEvidenceBundle({ bundleRoot: root, bundlePaths: ["a.md", "b.md"], generatedAt: "2026-10-23T12:00:00.000Z" });
    assert.deepEqual(first.files, second.files);
    assert.equal(first.manifestSha256, second.manifestSha256);
    assert.deepEqual(first.files.map((entry) => entry.path), ["a.md", "b.md"]);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("bundle builder rejects duplicate and escaping paths", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-acceptance-bundle-"));
  try {
    await writeFile(join(root, "safe.md"), "safe\n");
    assert.throws(() => buildAcceptanceEvidenceBundle({ bundleRoot: root, bundlePaths: ["safe.md", "safe.md"] }), /duplicate evidence path/u);
    assert.throws(() => buildAcceptanceEvidenceBundle({ bundleRoot: root, bundlePaths: ["../safe.md"] }), /evidence path is unsafe/u);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("bundle builder fails closed on secret-like evidence material", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-acceptance-bundle-"));
  try {
    await writeFile(join(root, "secret.md"), "DATABASE_URL=not-a-real-value\n");
    assert.throws(() => buildAcceptanceEvidenceBundle({ bundleRoot: root, bundlePaths: ["secret.md"] }), /secret-like material/u);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("bundle builder rejects symlinked evidence paths", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-acceptance-bundle-"));
  try {
    await writeFile(join(root, "real.md"), "safe\n");
    await symlink(join(root, "real.md"), join(root, "link.md"));
    assert.throws(
      () => buildAcceptanceEvidenceBundle({ bundleRoot: root, bundlePaths: ["link.md"] }),
      /regular file|changed while opening/u,
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
