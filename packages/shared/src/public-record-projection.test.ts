import assert from "node:assert/strict";
import { test } from "node:test";
import { assembleReleaseRecord } from "./record-assembly.js";
import { projectPublicRecord } from "./public-record-projection.js";

test("public record projection allowlists safe manifest fields", () => { const manifest = assembleReleaseRecord({ schemaId: "urn:verglos:schema:release-record-manifest", schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", generatedAt: "2026-01-01T00:00:00Z", generator: { id: "verglos", version: "2.0.0" }, members: [{ path: "decision.json", kind: "release-decision", mediaType: "application/json", digest: { algorithm: "sha256", value: "a".repeat(64) }, size: 2, required: true, redaction: "none", schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" } }], redaction: { status: "not-required" }, limitations: ["preparatory"] }); const projection = projectPublicRecord(manifest); assert.equal(projection.manifestId, manifest.manifestId); assert.equal("members" in projection, false); });
