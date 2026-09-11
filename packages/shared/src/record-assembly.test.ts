import assert from "node:assert/strict";
import { test } from "node:test";
import { assembleReleaseRecord, assembleReleaseRecordBundle, assertCompleteReleaseRecord } from "./record-assembly.js";

test("record assembly requires one release decision member", () => {
  const base = { schemaId: "urn:verglos:schema:release-record-manifest" as const, schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", generatedAt: "2026-01-01T00:00:00Z", generator: { id: "verglos", version: "2.0.0" }, redaction: { status: "not-required" as const }, limitations: ["preparatory"] };
  const member = { path: "decision.json", kind: "release-decision" as const, mediaType: "application/json", digest: { algorithm: "sha256" as const, value: "a".repeat(64) }, size: 2, required: true, redaction: "none" as const, schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" } };
  assert.equal(assembleReleaseRecord({ ...base, members: [member] }).members.length, 1);
  assert.throws(() => assembleReleaseRecord({ ...base, members: [] }));
});

test("record bundle assembly derives bindings and preserves payloads", () => {
  const base = { schemaId: "urn:verglos:schema:release-record-manifest" as const, schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", generatedAt: "2026-01-01T00:00:00Z", generator: { id: "verglos", version: "2.0.0" }, redaction: { status: "not-required" as const }, limitations: ["fixture"] };
  const bytes = new TextEncoder().encode("{}");
  const result = assembleReleaseRecordBundle({ ...base, payloads: [{ path: "decision.json", kind: "release-decision", mediaType: "application/json", bytes, required: true, schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" } }, { path: "metadata.json", kind: "metadata", mediaType: "application/json", bytes, required: false }] });
  assert.equal(result.manifest.members.length, 2); assert.equal(result.manifest.members[0]?.path, "decision.json"); assert.equal(result.manifest.members[0]?.size, bytes.byteLength); assert.equal(result.payloads.get("decision.json"), bytes);
  assert.throws(() => assembleReleaseRecordBundle({ ...base, payloads: [{ path: "decision.json", kind: "release-decision", mediaType: "application/json", bytes, required: true, schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" } }, { path: "decision.json", kind: "metadata", mediaType: "application/json", bytes, required: false }] }), /duplicated/);
});

test("complete record gate requires subject, policy evaluation, and decision members", () => {
  const base = { schemaId: "urn:verglos:schema:release-record-manifest" as const, schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", generatedAt: "2026-01-01T00:00:00Z", generator: { id: "verglos", version: "2.0.0" }, redaction: { status: "not-required" as const }, limitations: ["fixture"] };
  const member = (path: string, kind: "subject" | "policy-evaluation" | "release-decision") => ({ path, kind, mediaType: "application/json", digest: { algorithm: "sha256" as const, value: path.charCodeAt(0).toString(16).padStart(64, "0") }, size: 2, required: kind === "release-decision", redaction: "none" as const, ...(kind === "release-decision" || kind === "policy-evaluation" ? { schema: { id: `urn:verglos:schema:${kind}`, version: "1.0.0" } } : {}) });
  const manifest = assembleReleaseRecord({ ...base, members: [member("decision.json", "release-decision"), member("policy.json", "policy-evaluation"), member("subject.json", "subject")] });
  assert.equal(assertCompleteReleaseRecord(manifest).members.length, 3);
  assert.throws(() => assertCompleteReleaseRecord(assembleReleaseRecord({ ...base, members: [member("decision.json", "release-decision")] })), /subject member/);
  assert.throws(() => assertCompleteReleaseRecord(assembleReleaseRecord({ ...base, members: [member("decision.json", "release-decision"), member("policy-a.json", "policy-evaluation"), member("policy-b.json", "policy-evaluation"), member("subject.json", "subject")] })), /only one policy-evaluation/);
});
