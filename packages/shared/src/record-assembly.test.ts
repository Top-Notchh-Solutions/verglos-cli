import assert from "node:assert/strict";
import { test } from "node:test";
import { assembleReleaseRecord, assembleReleaseRecordBundle, assertCompleteReleaseRecord, assertCompleteReleaseRecordPayloads } from "./record-assembly.js";
import { canonicalizeJson } from "./schema.js";
import { createSubject, SUBJECT_SCHEMA } from "./subject.js";
import { POLICY_DOCUMENT_SCHEMA, parsePolicyDocument, policyDocumentDigest } from "./policy-document.js";
import { createPolicyEvaluation, POLICY_EVALUATION_SCHEMA } from "./policy-evaluation.js";
import { createReleaseDecision, RELEASE_DECISION_SCHEMA } from "./release-decision.js";

const digest = (char: string) => ({ algorithm: "sha256" as const, value: char.repeat(64) });
const bytes = (value: unknown) => new TextEncoder().encode(canonicalizeJson(value));

function completeBundle(policyVersion = "1.0.0") {
  const subject = createSubject({ kind: "filesystem", treeDigest: digest("a"), ignorePolicyDigest: digest("b"), entryCount: 1 });
  const policy = parsePolicyDocument({
    schemaId: POLICY_DOCUMENT_SCHEMA.id, schemaVersion: POLICY_DOCUMENT_SCHEMA.version,
    policyId: "verglos.policy.release", policyVersion,
    checks: [{ id: "verglos.check.native-sast", requirement: "required", onFailure: "BLOCK", severities: ["critical"], minimumConfidence: 0, freshness: "current", coverage: "complete", artifactMatch: "not-required", hunt: "not-required" }],
    exceptions: { enabled: false, requireApproval: false }, approvals: { required: false, authorities: [] },
  });
  const policyDigest = policyDocumentDigest(policy).slice("sha256:".length);
  const evaluatedAt = "2026-09-10T02:00:00.000Z";
  const evaluation = createPolicyEvaluation({
    schemaId: POLICY_EVALUATION_SCHEMA.id, schemaVersion: POLICY_EVALUATION_SCHEMA.version,
    evaluationId: "urn:uuid:72345678-1234-4123-8123-123456789abc",
    policy: { id: policy.policyId, version: "1.0.0", digest: { algorithm: "sha256", value: policyDigest } },
    subjectId: subject.subjectId, subjectMatch: { status: "matched", observedSubjectId: subject.subjectId }, evaluatedAt,
    checks: [{ id: "verglos.check.native-sast", requirement: "required", onFailure: "BLOCK", status: "satisfied", evidenceDigests: [digest("c")], observationIds: [], freshness: { status: "current", checkedAt: "2026-09-10T01:00:00.000Z", sourceUpdatedAt: "2026-09-10T00:00:00.000Z", validUntil: "2026-09-11T02:00:00.000Z" }, owner: "appsec", reason: "Current evidence is available.", nextAction: "Retain the evidence." }],
    limitations: ["Fixture covers one exact subject."],
  });
  const decision = createReleaseDecision({ decisionId: "urn:uuid:82345678-1234-4123-8123-123456789abc", evaluation, subjects: [{ subjectId: subject.subjectId, role: "primary" }], issuedBy: { kind: "person", id: "release-owner", authority: "release-decision" }, generatedAt: "2026-09-10T03:00:00.000Z", limitations: ["Fixture decision only."] });
  const bundle = assembleReleaseRecordBundle({
    schemaId: "urn:verglos:schema:release-record-manifest", schemaVersion: "1.0.0", bundleVersion: "1.0.0",
    manifestId: "urn:uuid:92345678-1234-4123-8123-123456789abc", generatedAt: "2026-09-10T04:00:00.000Z",
    generator: { id: "verglos.record-builder", version: "1.0.0" }, redaction: { status: "not-required" }, limitations: ["Fixture only."],
    payloads: [
      { path: "subjects/0001.json", kind: "subject", mediaType: "application/json", bytes: bytes(subject), required: true, schema: SUBJECT_SCHEMA },
      { path: "policy.json", kind: "policy", mediaType: "application/json", bytes: bytes(policy), required: true, schema: POLICY_DOCUMENT_SCHEMA },
      { path: "policy-evaluation.json", kind: "policy-evaluation", mediaType: "application/json", bytes: bytes(evaluation), required: true, schema: POLICY_EVALUATION_SCHEMA },
      { path: "release-decision.json", kind: "release-decision", mediaType: "application/json", bytes: bytes(decision), required: true, schema: RELEASE_DECISION_SCHEMA },
    ],
  });
  return { bundle, policy, subject, evaluation, decision };
}

test("record assembly requires one release decision member", () => {
  const base = { schemaId: "urn:verglos:schema:release-record-manifest" as const, schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", generatedAt: "2026-01-01T00:00:00Z", generator: { id: "verglos", version: "2.0.0" }, redaction: { status: "not-required" as const }, limitations: ["preparatory"] };
  const member = { path: "decision.json", kind: "release-decision" as const, mediaType: "application/json", digest: { algorithm: "sha256" as const, value: "a".repeat(64) }, size: 2, required: true, redaction: "none" as const, schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" } };
  assert.equal(assembleReleaseRecord({ ...base, members: [member] }).members.length, 1);
  assert.throws(() => assembleReleaseRecord({ ...base, members: [] }));
});

test("record bundle assembly derives bindings and preserves payloads", () => {
  const base = { schemaId: "urn:verglos:schema:release-record-manifest" as const, schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", generatedAt: "2026-01-01T00:00:00Z", generator: { id: "verglos", version: "2.0.0" }, redaction: { status: "not-required" as const }, limitations: ["fixture"] };
  const bytes = new TextEncoder().encode("{}");
  const result = assembleReleaseRecordBundle({ ...base, payloads: [{ path: "decision.json", kind: "release-decision", mediaType: "application/json", bytes, required: true, schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" } }, { path: "metadata.json", kind: "metadata", mediaType: "application/json", bytes: new TextEncoder().encode("{\"metadata\":true}"), required: false }] });
  assert.equal(result.manifest.members.length, 2); assert.equal(result.manifest.members[0]?.path, "decision.json"); assert.equal(result.manifest.members[0]?.size, bytes.byteLength); assert.equal(result.payloads.get("decision.json"), bytes);
  assert.throws(() => assembleReleaseRecordBundle({ ...base, payloads: [{ path: "decision.json", kind: "release-decision", mediaType: "application/json", bytes, required: true, schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" } }, { path: "decision.json", kind: "metadata", mediaType: "application/json", bytes, required: false }] }), /duplicated/);
  assert.throws(() => assembleReleaseRecordBundle({ ...base, payloads: [{ path: "decision.json", kind: "release-decision", mediaType: "application/json", bytes, required: true, schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" } }, { path: "metadata.json", kind: "metadata", mediaType: "application/json", bytes, required: false }] }), /digest is duplicated/);
  assert.throws(() => assembleReleaseRecordBundle({ ...base, payloads: [{ path: "decision.json", kind: "release-decision", mediaType: "application/json", bytes, required: true, schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" } }, { path: "metadata.json", kind: "metadata", mediaType: "application/json", bytes, required: false, redaction: "omitted" }] }), /omitted.*must be empty/);
});

test("complete record gate requires subject, policy evaluation, and decision members", () => {
  const base = { schemaId: "urn:verglos:schema:release-record-manifest" as const, schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", generatedAt: "2026-01-01T00:00:00Z", generator: { id: "verglos", version: "2.0.0" }, redaction: { status: "not-required" as const }, limitations: ["fixture"] };
  const member = (path: string, kind: "subject" | "policy" | "policy-evaluation" | "release-decision") => ({ path, kind, mediaType: "application/json", digest: { algorithm: "sha256" as const, value: path.charCodeAt(0).toString(16).padStart(64, "0") }, size: 2, required: kind === "release-decision", redaction: "none" as const, ...(kind === "release-decision" ? { schema: RELEASE_DECISION_SCHEMA } : kind === "policy-evaluation" ? { schema: POLICY_EVALUATION_SCHEMA } : kind === "policy" ? { schema: POLICY_DOCUMENT_SCHEMA } : {}) });
  const manifest = assembleReleaseRecord({ ...base, members: [member("decision.json", "release-decision"), member("policy.json", "policy"), member("policy-eval.json", "policy-evaluation"), member("subject.json", "subject")] });
  assert.equal(assertCompleteReleaseRecord(manifest).members.length, 4);
  assert.throws(() => assertCompleteReleaseRecord(assembleReleaseRecord({ ...base, members: [member("decision.json", "release-decision")] })), /subject member/);
  assert.throws(() => assertCompleteReleaseRecord(assembleReleaseRecord({ ...base, members: [member("decision.json", "release-decision"), member("policy.json", "policy"), member("policy-a.json", "policy-evaluation"), member("policy-b.json", "policy-evaluation"), member("subject.json", "subject")] })), /only one policy-evaluation/);
});

test("complete payload assembly binds policy, evaluation, decision, and exact subjects", () => {
  const { bundle } = completeBundle();
  assert.equal(assertCompleteReleaseRecordPayloads(bundle.manifest, bundle.payloads).members.length, 4);
  const tampered = new Map(bundle.payloads);
  tampered.set("policy.json", new TextEncoder().encode("{}"));
  assert.throws(() => assertCompleteReleaseRecordPayloads(bundle.manifest, tampered), /digest or size/);
});

test("complete payload assembly rejects a policy whose identity/digest differs from the evaluation", () => {
  const { bundle } = completeBundle("9.9.9");
  assert.throws(() => assertCompleteReleaseRecordPayloads(bundle.manifest, bundle.payloads), /policy payload does not match/);
});
