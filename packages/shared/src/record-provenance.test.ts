import assert from "node:assert/strict";
import { test } from "node:test";
import { assembleReleaseRecord } from "./record-assembly.js";
import { createReleasePredicate } from "./record-provenance.js";

test("release predicate binds manifest digest and exact subjects", () => { const manifest = assembleReleaseRecord({ schemaId: "urn:verglos:schema:release-record-manifest", schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", generatedAt: "2026-01-01T00:00:00Z", generator: { id: "verglos", version: "2.0.0" }, members: [{ path: "decision.json", kind: "release-decision", mediaType: "application/json", digest: { algorithm: "sha256", value: "a".repeat(64) }, size: 2, required: true, redaction: "none", schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" } }], redaction: { status: "not-required" }, limitations: ["preparatory"] }); const predicate = createReleasePredicate(manifest, ["urn:verglos:subject:artifact:sha256:" + "b".repeat(64)]); assert.match(predicate.manifestDigest, /^sha256:/); assert.equal(predicate.subjectIds.length, 1); assert.throws(() => createReleasePredicate(manifest, [])); });
