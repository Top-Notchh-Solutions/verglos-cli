import assert from "node:assert/strict";
import { test } from "node:test";
import { assembleReleaseRecord, assertProviderProvenancePayloads } from "./record-assembly.js";
import { createProviderProvenanceRecordMember } from "./provenance-provider.js";
import { canonicalizeJson } from "./schema.js";
import { createSubject, SUBJECT_SCHEMA } from "./subject.js";
import { describeRecordMember } from "./record-store.js";
import { RELEASE_DECISION_SCHEMA } from "./release-decision.js";

test("record provenance cannot claim a matching digest for a different included subject", () => {
  const includedDigest = "a".repeat(64);
  const claimedDigest = "b".repeat(64);
  const subject = createSubject({ kind: "artifact", digest: { algorithm: "sha256", value: includedDigest }, size: 10, mediaType: "application/octet-stream", path: "release.bin" });
  const subjectBytes = new TextEncoder().encode(canonicalizeJson(subject));
  const statementBytes = new TextEncoder().encode(JSON.stringify({ _type: "https://in-toto.io/Statement/v1", subject: [{ name: "release.bin", digest: { sha256: claimedDigest } }] }));
  const provenance = createProviderProvenanceRecordMember({ path: "provenance.json", provider: "npm", subjectId: subject.subjectId, sourceBytes: statementBytes, expectedDigest: `sha256:${claimedDigest}`, required: true });
  const decisionBytes = new TextEncoder().encode("{}");
  const members = [
    { ...describeRecordMember({ path: "subject.json", kind: "subject", mediaType: "application/json", bytes: subjectBytes, required: true }), schema: SUBJECT_SCHEMA },
    { ...describeRecordMember({ path: provenance.path, kind: provenance.kind, mediaType: provenance.mediaType, bytes: provenance.bytes, required: provenance.required }), schema: provenance.schema },
    { ...describeRecordMember({ path: "release-decision.json", kind: "release-decision", mediaType: "application/json", bytes: decisionBytes, required: true }), schema: RELEASE_DECISION_SCHEMA },
  ];
  const manifest = assembleReleaseRecord({ schemaId: "urn:verglos:schema:release-record-manifest", schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", generatedAt: "2026-01-01T00:00:00Z", generator: { id: "verglos", version: "2.0.0" }, members, redaction: { status: "not-required" }, limitations: ["fixture"] });
  assert.throws(() => assertProviderProvenancePayloads(manifest, new Map([["subject.json", subjectBytes], ["provenance.json", provenance.bytes]])), /expected artifact digest does not match its included record subject/);
});
