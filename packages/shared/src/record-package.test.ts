import assert from "node:assert/strict";
import { test } from "node:test";
import { assembleReleaseRecord, createPolicyEvaluation, createReleaseDecision, createSubject, describeRecordMember, POLICY_EVALUATION_SCHEMA, RELEASE_DECISION_SCHEMA } from "./index.js";
import { createReleaseRecordPackageDescriptor, parseReleaseRecordPackageDescriptor, RELEASE_RECORD_PACKAGE_FILES, renderReleaseRecordViewer } from "./record-package.js";

function fixture() {
  const digest = (value: string) => ({ algorithm: "sha256" as const, value: value.repeat(64) });
  const subject = createSubject({ kind: "filesystem", treeDigest: digest("a"), ignorePolicyDigest: digest("b"), entryCount: 1 });
  const evaluation = createPolicyEvaluation({
    schemaId: POLICY_EVALUATION_SCHEMA.id, schemaVersion: POLICY_EVALUATION_SCHEMA.version,
    evaluationId: "urn:uuid:72345678-1234-4123-8123-123456789abc",
    subjectId: subject.subjectId, subjectMatch: { status: "matched", observedSubjectId: subject.subjectId },
    policy: { id: "verglos.policy.fixture", version: "1.0.0", digest: digest("c") }, evaluatedAt: "2026-01-01T00:00:00Z",
    checks: [{ id: "verglos.check.fixture", requirement: "required", onFailure: "BLOCK", status: "satisfied", evidenceDigests: [digest("d")], observationIds: [], freshness: { status: "current", checkedAt: "2026-01-01T00:00:00Z", validUntil: "2026-01-02T00:00:00Z" }, owner: "fixture-owner", reason: "Fixture evidence.", nextAction: "Retain fixture." }],
    limitations: ["PRIVATE-LIMITATION-CANARY <script>alert(1)</script>"],
  });
  const decision = createReleaseDecision({ decisionId: "urn:uuid:82345678-1234-4123-8123-123456789abc", evaluation, subjects: [{ subjectId: subject.subjectId, role: "primary" }], issuedBy: { kind: "person", id: "private-issuer-canary", authority: "release-decision" }, generatedAt: "2026-01-01T00:00:01Z", limitations: ["PRIVATE-LIMITATION-CANARY <script>alert(1)</script>"] });
  const decisionBytes = new TextEncoder().encode(JSON.stringify(decision));
  const member = { ...describeRecordMember({ path: "private/path/decision.json", kind: "release-decision", mediaType: "application/json", bytes: decisionBytes, required: true }), schema: RELEASE_DECISION_SCHEMA };
  const manifest = assembleReleaseRecord({ schemaId: "urn:verglos:schema:release-record-manifest", schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", generatedAt: "2026-01-01T00:00:02Z", generator: { id: "verglos", version: "1.0.0" }, members: [member], redaction: { status: "unknown" }, limitations: ["PRIVATE-LIMITATION-CANARY <script>alert(2)</script>"] });
  return { manifest, decision };
}

test("record package descriptor binds directory-v1 transport to the manifest and is strict", () => {
  const { manifest } = fixture();
  const descriptor = createReleaseRecordPackageDescriptor(manifest, true);
  assert.equal(descriptor.transport, "directory-v1");
  assert.match(descriptor.manifestDigest, /^sha256:[a-f0-9]{64}$/u);
  assert.deepEqual(parseReleaseRecordPackageDescriptor(descriptor), descriptor);
  assert.throws(() => parseReleaseRecordPackageDescriptor({ ...descriptor, transport: "zip" }));
  assert.throws(() => parseReleaseRecordPackageDescriptor({ ...descriptor, extra: true }));
  assert.deepEqual(RELEASE_RECORD_PACKAGE_FILES, { descriptor: ".vgl-package.json", viewer: ".vgl-viewer.html", export: ".vgl-release.intoto.json", signature: ".vgl-signature.json" });
});

test("offline viewer is script-free, privacy-limited, and excludes paths and free-form canaries", () => {
  const { manifest, decision } = fixture();
  const html = renderReleaseRecordViewer({ manifest, decision, signatureIncluded: true });
  assert.match(html, /Decision member digest/u);
  assert.match(html, /Included; signer identity is not verified/u);
  assert.match(html, /not independent proof of sanitization/u);
  assert.match(html, /default-src 'none'/u);
  for (const canary of ["PRIVATE-LIMITATION-CANARY", "private-issuer-canary", "private/path", "<script>", "alert(1)", "alert(2)"]) assert.equal(html.includes(canary), false, `viewer leaked ${canary}`);
  assert.doesNotMatch(html, /<script\b/iu);
  assert.doesNotMatch(html, /https?:\/\//iu);
});
