import assert from "node:assert/strict";
import { generateKeyPairSync } from "node:crypto";
import { test } from "node:test";
import { assembleReleaseRecord } from "./record-assembly.js";
import { signReleaseRecordManifest, verifyReleaseRecordSignature } from "./record-signing.js";

const manifest = () => assembleReleaseRecord({ schemaId: "urn:verglos:schema:release-record-manifest", schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", generatedAt: "2026-01-01T00:00:00Z", generator: { id: "verglos.record-builder", version: "1.0.0" }, members: [{ path: "decision.json", kind: "release-decision", mediaType: "application/json", digest: { algorithm: "sha256", value: "a".repeat(64) }, size: 2, required: true, redaction: "none", schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" } }], redaction: { status: "not-required" }, limitations: ["fixture"] });

test("offline record signature verifies the canonical manifest", () => {
  const { privateKey, publicKey } = generateKeyPairSync("ed25519");
  const envelope = signReleaseRecordManifest(manifest(), privateKey.export({ format: "pem", type: "pkcs8" }).toString(), { id: "fixture-signer", issuer: "https://issuer.example.test" }, "2026-01-01T01:00:00Z");
  const result = verifyReleaseRecordSignature(manifest(), envelope, publicKey.export({ format: "pem", type: "spki" }).toString());
  assert.equal(result.verified, true); if (result.verified) assert.equal(result.signer.id, "fixture-signer");
});

test("offline record signature rejects manifest changes and invalid keys", () => {
  const { privateKey, publicKey } = generateKeyPairSync("ed25519");
  const original = manifest(); const envelope = signReleaseRecordManifest(original, privateKey.export({ format: "pem", type: "pkcs8" }).toString(), { id: "fixture-signer", issuer: "fixture" }, "2026-01-01T01:00:00Z");
  const changed = { ...original, limitations: ["changed"] };
  assert.deepEqual(verifyReleaseRecordSignature(changed, envelope, publicKey.export({ format: "pem", type: "spki" }).toString()), { verified: false, reason: "manifest-digest-mismatch" });
  assert.deepEqual(verifyReleaseRecordSignature(original, envelope, "not-a-key"), { verified: false, reason: "invalid-key" });
});
