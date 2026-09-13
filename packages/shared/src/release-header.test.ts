import assert from "node:assert/strict";
import { test } from "node:test";
import { createPolicyEvaluation, createSubject, createReleaseDecision, projectReleaseHeader } from "./index.js";

test("release header projects decision-first signed-state-neutral fields", () => {
  const digest = (value: string) => ({ algorithm: "sha256" as const, value: value.repeat(64) });
  const subject = createSubject({ kind: "filesystem", treeDigest: digest("a"), ignorePolicyDigest: digest("b"), entryCount: 1 });
  const evaluation = createPolicyEvaluation({ schemaId: "urn:verglos:schema:policy-evaluation", schemaVersion: "1.0.0", evaluationId: "urn:uuid:72345678-1234-4123-8123-123456789abc", policy: { id: "verglos.policy.local-default", version: "1.0.0", digest: digest("c") }, subjectId: subject.subjectId, subjectMatch: { status: "matched", observedSubjectId: subject.subjectId }, evaluatedAt: "2026-09-09T02:00:00.000Z", checks: [{ id: "verglos.check.native-sast", requirement: "required", onFailure: "BLOCK", status: "satisfied", evidenceDigests: [digest("d")], observationIds: [], freshness: { status: "current", checkedAt: "2026-09-09T01:00:00.000Z", validUntil: "2026-09-10T02:00:00.000Z" }, owner: "security", reason: "Evidence is current.", nextAction: "Preserve evidence." }], limitations: ["Preparatory fixture."] });
  const decision = createReleaseDecision({ decisionId: "urn:uuid:82345678-1234-4123-8123-123456789abc", evaluation, subjects: [{ subjectId: subject.subjectId, role: "primary" }], approvals: [], issuedBy: { kind: "service", id: "local", authority: "release" }, generatedAt: "2026-09-09T03:00:00.000Z", limitations: ["Preparatory fixture."] });
  const header = projectReleaseHeader(decision, "unsigned", [{ subjectId: subject.subjectId, memberDigest: `sha256:${"d".repeat(64)}`, contentDigests: [{ purpose: "filesystem-tree", digest: `sha256:${"a".repeat(64)}` }] }]);
  assert.equal(header.decision, "PASS");
  assert.equal(header.subjectId, subject.subjectId);
  assert.equal(header.policy.digest, `sha256:${"c".repeat(64)}`);
  assert.equal(header.signerStatus, "unsigned");
  assert.equal(header.coverageStatus, "not-established");
  assert.deepEqual(header.subjects, [{ subjectId: subject.subjectId, role: "primary", identityDigest: `sha256:${subject.subjectId.split(":").at(-1)}`, memberDigest: `sha256:${"d".repeat(64)}`, contentDigests: [{ purpose: "filesystem-tree", digest: `sha256:${"a".repeat(64)}` }] }]);
  assert.equal("severity" in header, false);
});

test("release header keeps incomplete coverage explicit and never infers complete", () => {
  const digest = (value: string) => ({ algorithm: "sha256" as const, value: value.repeat(64) });
  const subject = createSubject({ kind: "filesystem", treeDigest: digest("a"), ignorePolicyDigest: digest("b"), entryCount: 0 });
  const evaluation = createPolicyEvaluation({ schemaId: "urn:verglos:schema:policy-evaluation", schemaVersion: "1.0.0", evaluationId: "urn:uuid:72345678-1234-4123-8123-123456789abc", policy: { id: "verglos.policy.local-default", version: "1.0.0", digest: digest("c") }, subjectId: subject.subjectId, subjectMatch: { status: "matched", observedSubjectId: subject.subjectId }, evaluatedAt: "2026-09-09T02:00:00.000Z", checks: [{ id: "verglos.check.native-sast", requirement: "required", onFailure: "BLOCK", status: "error", evidenceDigests: [], observationIds: [], freshness: { status: "unknown", checkedAt: "2026-09-09T01:00:00.000Z" }, owner: "security", reason: "Coverage unavailable.", nextAction: "Review coverage." }], limitations: ["Coverage unavailable."] });
  const decision = createReleaseDecision({ decisionId: "urn:uuid:82345678-1234-4123-8123-123456789abc", evaluation, subjects: [{ subjectId: subject.subjectId, role: "primary" }], approvals: [], issuedBy: { kind: "service", id: "local", authority: "release" }, generatedAt: "2026-09-09T03:00:00.000Z", limitations: ["Coverage unavailable."] });
  const header = projectReleaseHeader(decision, "unsigned", [], ["record manifest limitation"]);
  assert.equal(header.decision, "INCOMPLETE");
  assert.equal(header.coverageStatus, "incomplete");
  assert.match(header.limitations[0]!, /subject payload is unavailable/);
  assert.ok(header.limitations.includes("record manifest limitation"));
  assert.equal(header.limitations.includes("coverage complete"), false);
});
