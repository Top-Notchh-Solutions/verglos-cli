import assert from "node:assert/strict";
import { test } from "node:test";
import { composeCiCheckPayload, decideCiCheckDelivery } from "./ci-check-payload.js";
import { createReleaseDecision } from "./release-decision.js";
import { createPolicyEvaluation } from "./policy-evaluation.js";

const subjectId = `urn:verglos:subject:artifact:sha256:${"a".repeat(64)}`;
const policyDigest = { algorithm: "sha256" as const, value: "b".repeat(64) };
const evaluation = createPolicyEvaluation({
  schemaId: "urn:verglos:schema:policy-evaluation",
  schemaVersion: "1.0.0",
  evaluationId: "urn:uuid:12345678-1234-4123-8123-123456789abc",
  subjectId,
  policy: { id: "verglos.policy.team", version: "1.0.0", digest: policyDigest },
  subjectMatch: { status: "matched", observedSubjectId: subjectId },
  evaluatedAt: "2026-01-01T00:00:00.000Z",
  checks: [{ id: "verglos.check.release", requirement: "required", onFailure: "BLOCK", status: "satisfied", evidenceDigests: [{ algorithm: "sha256", value: "e".repeat(64) }], observationIds: [], freshness: { status: "current", checkedAt: "2026-01-01T00:00:00.000Z", validUntil: "2026-01-02T00:00:00.000Z" }, owner: "team-policy", reason: "All required checks passed.", nextAction: "Preserve the release evidence." }],
  limitations: ["Synthetic test fixture."],
});
const decision = createReleaseDecision({
  decisionId: "urn:uuid:22345678-1234-4123-8123-123456789abc",
  evaluation,
  subjects: [{ subjectId, role: "primary" }],
  issuedBy: { kind: "service", id: "ci", authority: "policy" },
  generatedAt: "2026-01-01T00:01:00.000Z",
  limitations: ["Synthetic test fixture."],
});
const base = { releaseDecision: decision, recordManifestDigest: `sha256:${"c".repeat(64)}`, recordUrl: "https://verglos.com/verify/record-123", commit: "d".repeat(40) } as const;

test("CI payload preserves exact decision, subject, policy, and record identity", () => {
  const result = composeCiCheckPayload(base);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.payload.decision, "PASS");
  assert.deepEqual(result.payload.subject, { subjectId, digest: `sha256:${"a".repeat(64)}` });
  assert.deepEqual(result.payload.policy, { id: "verglos.policy.team", version: "1.0.0", digest: `sha256:${"b".repeat(64)}` });
  assert.equal(result.payload.record.url, base.recordUrl);
  assert.match(result.payload.payloadDigest, /^sha256:[a-f0-9]{64}$/u);
  assert.doesNotMatch(JSON.stringify(result.payload), /source|finding|path|secret/i);
});

test("CI payload rejects malformed commit, manifest, and unsafe record links", () => {
  assert.deepEqual(composeCiCheckPayload({ ...base, commit: "not-a-commit" }), { ok: false, reason: "commit_invalid" });
  assert.deepEqual(composeCiCheckPayload({ ...base, recordManifestDigest: "sha256:bad" }), { ok: false, reason: "manifest_digest_invalid" });
  assert.deepEqual(composeCiCheckPayload({ ...base, recordUrl: "http://evil.example" }), { ok: false, reason: "record_url_invalid" });
  assert.deepEqual(composeCiCheckPayload({ ...base, recordUrl: "https://evil.example/#secret" }), { ok: false, reason: "record_url_invalid" });
});

test("CI delivery is idempotent by payload digest", () => {
  assert.equal(decideCiCheckDelivery({ currentPayloadDigest: "sha256:a", storedPayloadDigest: "sha256:a" }), "noop");
  assert.equal(decideCiCheckDelivery({ currentPayloadDigest: "sha256:a", storedPayloadDigest: "sha256:b" }), "update");
});
