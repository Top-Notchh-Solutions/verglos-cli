import assert from "node:assert/strict";
import { test } from "node:test";
import { assembleReleaseRecord } from "./record-assembly.js";
import { createSigstoreRecordBinding, parseSigstoreRecordBinding } from "./record-sigstore.js";

const manifest = () => assembleReleaseRecord({ schemaId: "urn:verglos:schema:release-record-manifest", schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", generatedAt: "2026-01-01T00:00:00Z", generator: { id: "verglos", version: "2.0.0" }, members: [{ path: "decision.json", kind: "release-decision", mediaType: "application/json", digest: { algorithm: "sha256", value: "a".repeat(64) }, size: 2, required: true, redaction: "none", schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" } }], redaction: { status: "not-required" }, limitations: ["fixture"] });

test("Sigstore binding pins manifest, bundle, and issuer identity", () => {
  const binding = createSigstoreRecordBinding(manifest(), { bundleDigest: `sha256:${"b".repeat(64)}`, signer: { identity: "build@example.test", issuer: "https://issuer.example.test" }, verification: "unverified", limitations: ["External Sigstore verification has not been performed."] });
  assert.match(binding.manifestDigest, /^sha256:/); assert.equal(parseSigstoreRecordBinding(binding).signer.issuer, "https://issuer.example.test");
  assert.throws(() => createSigstoreRecordBinding(manifest(), { bundleDigest: `sha256:${"b".repeat(64)}`, signer: { identity: "build", issuer: "issuer" }, verification: "verified", limitations: ["unverified evidence"] }), /unverified/);
});
