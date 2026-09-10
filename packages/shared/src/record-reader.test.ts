import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { assembleReleaseRecord } from "./record-assembly.js";
import { describeRecordMember, putRecordMember } from "./record-store.js";
import { readAndVerifyRecord } from "./record-reader.js";

test("safe record reader verifies every stored member", async () => { const root = await mkdtemp(join(tmpdir(), "verglos-reader-")); try { const bytes = new TextEncoder().encode("{}"); const stored = await putRecordMember(root, "decision.json", bytes); const member = describeRecordMember({ path: "decision.json", kind: "release-decision", mediaType: "application/json", bytes, required: true }); const manifest = assembleReleaseRecord({ schemaId: "urn:verglos:schema:release-record-manifest", schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", generatedAt: "2026-01-01T00:00:00Z", generator: { id: "verglos", version: "2.0.0" }, members: [{ ...member, schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" }, digest: { algorithm: "sha256", value: stored.digest.slice(7) } }], redaction: { status: "not-required" }, limitations: ["preparatory"] }); assert.equal((await readAndVerifyRecord(root, manifest)).get("decision.json")?.byteLength, 2); } finally { await rm(root, { recursive: true, force: true }); } });

test("safe record reader skips optional omitted members", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-reader-omitted-"));
  try {
    const bytes = new TextEncoder().encode("{}"); const stored = await putRecordMember(root, "decision.json", bytes);
    const manifest = assembleReleaseRecord({ schemaId: "urn:verglos:schema:release-record-manifest", schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", generatedAt: "2026-01-01T00:00:00Z", generator: { id: "verglos", version: "2.0.0" }, members: [{ path: "decision.json", kind: "release-decision", mediaType: "application/json", digest: { algorithm: "sha256", value: stored.digest.slice(7) }, size: bytes.byteLength, required: true, redaction: "none", schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" } }, { path: "metadata.json", kind: "metadata", mediaType: "application/json", digest: { algorithm: "sha256", value: "a".repeat(64) }, size: 0, required: false, redaction: "omitted" }], redaction: { status: "partial", manifestDigest: { algorithm: "sha256", value: "b".repeat(64) } }, limitations: ["redacted"] });
    const result = await readAndVerifyRecord(root, manifest); assert.equal(result.has("metadata.json"), false); assert.equal(result.get("decision.json")?.byteLength, 2);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("safe record reader rejects duplicate member digests", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-reader-duplicate-"));
  try {
    const bytes = new TextEncoder().encode("{}"); const stored = await putRecordMember(root, "decision.json", bytes);
    const digest = { algorithm: "sha256" as const, value: stored.digest.slice(7) };
    const manifest = assembleReleaseRecord({ schemaId: "urn:verglos:schema:release-record-manifest", schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", generatedAt: "2026-01-01T00:00:00Z", generator: { id: "verglos", version: "2.0.0" }, members: [{ path: "decision.json", kind: "release-decision", mediaType: "application/json", digest, size: bytes.byteLength, required: true, redaction: "none", schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" } }, { path: "subject.json", kind: "subject", mediaType: "application/json", digest, size: bytes.byteLength, required: false, redaction: "none" }], redaction: { status: "not-required" }, limitations: ["fixture"] });
    await assert.rejects(() => readAndVerifyRecord(root, manifest), /digest is duplicated/);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("safe record reader rejects malformed required JSON and unknown required media", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-reader-media-"));
  try {
    const malformed = new TextEncoder().encode("not-json"); const malformedStored = await putRecordMember(root, "decision.json", malformed);
    const malformedManifest = assembleReleaseRecord({ schemaId: "urn:verglos:schema:release-record-manifest", schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", generatedAt: "2026-01-01T00:00:00Z", generator: { id: "verglos", version: "2.0.0" }, members: [{ path: "decision.json", kind: "release-decision", mediaType: "application/json", digest: { algorithm: "sha256", value: malformedStored.digest.slice(7) }, size: malformed.byteLength, required: true, redaction: "none", schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" } }], redaction: { status: "not-required" }, limitations: ["fixture"] });
    await assert.rejects(() => readAndVerifyRecord(root, malformedManifest), /JSON is malformed/);
    const bytes = new TextEncoder().encode("{}"); const stored = await putRecordMember(root, "decision.json", bytes);
    const unknownManifest = assembleReleaseRecord({ schemaId: "urn:verglos:schema:release-record-manifest", schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", generatedAt: "2026-01-01T00:00:00Z", generator: { id: "verglos", version: "2.0.0" }, members: [{ path: "decision.json", kind: "release-decision", mediaType: "application/x-custom", digest: { algorithm: "sha256", value: stored.digest.slice(7) }, size: bytes.byteLength, required: true, redaction: "none", schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" } }], redaction: { status: "not-required" }, limitations: ["fixture"] });
    await assert.rejects(() => readAndVerifyRecord(root, unknownManifest), /unsupported required record member media type/);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("safe record reader rejects unsupported member schema versions", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-reader-schema-"));
  try {
    const bytes = new TextEncoder().encode("{}"); const stored = await putRecordMember(root, "decision.json", bytes);
    const manifest = assembleReleaseRecord({ schemaId: "urn:verglos:schema:release-record-manifest", schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", generatedAt: "2026-01-01T00:00:00Z", generator: { id: "verglos", version: "2.0.0" }, members: [{ path: "decision.json", kind: "release-decision", mediaType: "application/json", digest: { algorithm: "sha256", value: stored.digest.slice(7) }, size: bytes.byteLength, required: true, redaction: "none", schema: { id: "urn:verglos:schema:release-decision", version: "2.0.0" } }], redaction: { status: "not-required" }, limitations: ["fixture"] });
    await assert.rejects(() => readAndVerifyRecord(root, manifest), /unsupported record member schema version/);
  } finally { await rm(root, { recursive: true, force: true }); }
});
