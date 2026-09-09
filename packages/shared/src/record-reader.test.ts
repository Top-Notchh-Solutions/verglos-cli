import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { assembleReleaseRecord } from "./record-assembly.js";
import { describeRecordMember, putRecordMember } from "./record-store.js";
import { readAndVerifyRecord } from "./record-reader.js";

test("safe record reader verifies every stored member", async () => { const root = await mkdtemp(join(tmpdir(), "verglos-reader-")); try { const bytes = new TextEncoder().encode("{}"); const stored = await putRecordMember(root, "decision.json", bytes); const member = describeRecordMember({ path: "decision.json", kind: "release-decision", mediaType: "application/json", bytes, required: true }); const manifest = assembleReleaseRecord({ schemaId: "urn:verglos:schema:release-record-manifest", schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", generatedAt: "2026-01-01T00:00:00Z", generator: { id: "verglos", version: "2.0.0" }, members: [{ ...member, schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" }, digest: { algorithm: "sha256", value: stored.digest.slice(7) } }], redaction: { status: "not-required" }, limitations: ["preparatory"] }); assert.equal((await readAndVerifyRecord(root, manifest)).get("decision.json")?.byteLength, 2); } finally { await rm(root, { recursive: true, force: true }); } });
