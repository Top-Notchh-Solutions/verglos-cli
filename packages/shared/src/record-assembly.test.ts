import assert from "node:assert/strict";
import { test } from "node:test";
import { assembleReleaseRecord } from "./record-assembly.js";

test("record assembly requires one release decision member", () => {
  const base = { schemaId: "urn:verglos:schema:release-record-manifest" as const, schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", generatedAt: "2026-01-01T00:00:00Z", generator: { id: "verglos", version: "2.0.0" }, redaction: { status: "not-required" as const }, limitations: ["preparatory"] };
  const member = { path: "decision.json", kind: "release-decision" as const, mediaType: "application/json", digest: { algorithm: "sha256" as const, value: "a".repeat(64) }, size: 2, required: true, redaction: "none" as const, schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" } };
  assert.equal(assembleReleaseRecord({ ...base, members: [member] }).members.length, 1);
  assert.throws(() => assembleReleaseRecord({ ...base, members: [] }));
});
