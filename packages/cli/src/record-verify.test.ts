import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { assembleReleaseRecord, describeRecordMember, putRecordMember } from "@verglos/shared";
import { executeRecordVerify } from "./record-verify.js";

test("record verify checks content-addressed members and emits JSON", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-record-cli-"));
  const store = join(root, "store"); const manifestPath = join(root, "manifest.json");
  const bytes = new TextEncoder().encode("decision");
  try {
    const stored = await putRecordMember(store, "decision.json", bytes);
    const member = describeRecordMember({ path: "decision.json", kind: "release-decision", mediaType: "application/json", bytes, required: true });
    const manifest = assembleReleaseRecord({ schemaId: "urn:verglos:schema:release-record-manifest", schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", generatedAt: "2026-01-01T00:00:00Z", generator: { id: "verglos.record-builder", version: "1.0.0" }, members: [{ ...member, digest: { algorithm: "sha256", value: stored.digest.slice(7) }, schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" } }], redaction: { status: "not-required" }, limitations: ["fixture"] });
    await writeFile(manifestPath, JSON.stringify(manifest));
    const lines: string[] = []; const previous = console.log; console.log = (line?: unknown) => lines.push(String(line));
    try { assert.equal(await executeRecordVerify(store, manifestPath, true, true), 0); } finally { console.log = previous; }
    const result = JSON.parse(lines[0]!); assert.equal(result.verified, true); assert.deepEqual(result.paths, ["decision.json"]);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("record verify rejects a missing or tampered member", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-record-cli-invalid-"));
  try { assert.equal(await executeRecordVerify(root, join(root, "missing.json"), true, true), 78); }
  finally { await rm(root, { recursive: true, force: true }); }
});
