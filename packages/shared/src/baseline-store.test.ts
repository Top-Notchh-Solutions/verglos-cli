import assert from "node:assert/strict";
import { mkdtemp, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { parseBaseline } from "./baseline.js";
import { loadBaseline, saveBaseline } from "./baseline-store.js";

const baseline = parseBaseline({ schemaId: "urn:verglos:schema:baseline", schemaVersion: "1.0.0", subjectId: "urn:verglos:subject:artifact:sha256:" + "a".repeat(64), policyId: "policy-free", policyVersion: "1.0.0", policyDigest: "sha256:" + "b".repeat(64), acceptedFingerprints: [], createdAt: "2026-01-01T00:00:00Z" });

test("baseline store publishes atomically and validates read-back", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-baseline-"));
  try {
    const path = await saveBaseline(root, baseline);
    assert.equal((await readdir(root)).length, 1);
    assert.deepEqual(await loadBaseline(path), baseline);
  } finally { await rm(root, { recursive: true, force: true }); }
});
