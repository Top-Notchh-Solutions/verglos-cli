import assert from "node:assert/strict";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { retainTrivyEvidence, replayTrivyEvidence, TrivyEvidenceError } from "./trivy-evidence.js";

test("Trivy evidence is retained content-addressed and replayable", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-evidence-")); const bytes = new TextEncoder().encode('{"Results":[]}');
  const ref = await retainTrivyEvidence(root, bytes); assert.equal(ref.size, bytes.byteLength); assert.deepEqual(await replayTrivyEvidence(root, ref), []);
  await writeFile(join(root, ref.digest.slice(7, 11), ref.digest.slice(7)), "tampered");
  await assert.rejects(() => replayTrivyEvidence(root, ref), (e: unknown) => e instanceof TrivyEvidenceError && e.code === "DIGEST_MISMATCH");
});
