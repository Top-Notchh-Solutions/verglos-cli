import assert from "node:assert/strict";
import { test } from "node:test";
import { assembleReleaseRecord } from "./record-assembly.js";
import { releaseRecordManifestDigest } from "./record-digest.js";
import { canonicalizeJson } from "./schema.js";

test("release record manifest digest is deterministic", () => { const manifest = assembleReleaseRecord({ schemaId: "urn:verglos:schema:release-record-manifest", schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", generatedAt: "2026-01-01T00:00:00Z", generator: { id: "verglos", version: "2.0.0" }, members: [{ path: "decision.json", kind: "release-decision", mediaType: "application/json", digest: { algorithm: "sha256", value: "a".repeat(64) }, size: 2, required: true, redaction: "none", schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" } }], redaction: { status: "not-required" }, limitations: ["preparatory"] }); assert.equal(releaseRecordManifestDigest(manifest), releaseRecordManifestDigest(manifest)); });

test("record assembly is reproducible regardless of member input order", () => {
  const decision = { path: "decision.json", kind: "release-decision" as const, mediaType: "application/json", digest: { algorithm: "sha256" as const, value: "a".repeat(64) }, size: 2, required: true, redaction: "none" as const, schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" } };
  const metadata = { path: "metadata.json", kind: "metadata" as const, mediaType: "application/json", digest: { algorithm: "sha256" as const, value: "b".repeat(64) }, size: 2, required: false, redaction: "none" as const };
  const base = { schemaId: "urn:verglos:schema:release-record-manifest" as const, schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", generatedAt: "2026-01-01T00:00:00Z", generator: { id: "verglos", version: "2.0.0" }, redaction: { status: "not-required" as const }, limitations: ["fixture"] };
  const first = assembleReleaseRecord({ ...base, members: [metadata, decision] });
  const second = assembleReleaseRecord({ ...base, members: [decision, metadata] });
  assert.equal(canonicalizeJson(first), canonicalizeJson(second));
  assert.equal(releaseRecordManifestDigest(first), releaseRecordManifestDigest(second));
});
