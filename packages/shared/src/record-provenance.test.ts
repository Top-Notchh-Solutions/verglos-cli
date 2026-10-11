import assert from "node:assert/strict";
import { test } from "node:test";
import { assembleReleaseRecord } from "./record-assembly.js";
import { createReleasePredicate, createReleaseStatement } from "./record-provenance.js";
import { PUBLIC_LIMITATION_REDACTION } from "./public-record-projection.js";

test("release predicate and in-toto statement bind subjects while withholding free-form limitations", () => {
  const secretCanary = "CLIENT-SECRET-CANARY";
  const manifest = assembleReleaseRecord({ schemaId: "urn:verglos:schema:release-record-manifest", schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", generatedAt: "2026-01-01T00:00:00Z", generator: { id: "verglos", version: "2.0.0" }, members: [{ path: "decision.json", kind: "release-decision", mediaType: "application/json", digest: { algorithm: "sha256", value: "a".repeat(64) }, size: 2, required: true, redaction: "none", schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" } }], redaction: { status: "not-required" }, limitations: [`customer=acme client=${secretCanary} secret=private`] });
  const subjectId = "urn:verglos:subject:artifact:sha256:" + "b".repeat(64);
  const predicate = createReleasePredicate(manifest, [subjectId, subjectId]);
  assert.match(predicate.manifestDigest, /^sha256:/);
  assert.deepEqual(predicate.subjectIds, [subjectId]);
  assert.deepEqual(predicate.limitations, [PUBLIC_LIMITATION_REDACTION]);
  const statement = createReleaseStatement(manifest, [subjectId]);
  assert.equal(statement._type, "https://in-toto.io/Statement/v1");
  assert.equal(statement.predicateType, "https://verglos.dev/attestations/release/v1");
  assert.deepEqual(statement.subject, [{ name: subjectId, digest: { sha256: "b".repeat(64) } }]);
  assert.deepEqual(statement.predicate.limitations, [PUBLIC_LIMITATION_REDACTION]);
  assert.equal(JSON.stringify(statement).includes(secretCanary), false);
  assert.equal(JSON.stringify(statement).includes("customer=acme"), false);
  assert.throws(() => createReleasePredicate(manifest, []));
  assert.throws(() => createReleasePredicate(manifest, ["tenant/client"]));
});
