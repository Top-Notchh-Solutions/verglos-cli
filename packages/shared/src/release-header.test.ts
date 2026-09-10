import assert from "node:assert/strict";
import { test } from "node:test";
import { createPolicyEvaluation, createSubject, createReleaseDecision, projectReleaseHeader } from "./index.js";

test("release header projects decision-first signed-state-neutral fields", () => {
  const digest = (value: string) => ({ algorithm: "sha256" as const, value: value.repeat(64) });
  const subject = createSubject({ kind: "filesystem", treeDigest: digest("a"), ignorePolicyDigest: digest("b"), entryCount: 1 });
  const evaluation = createPolicyEvaluation({ schemaId: "urn:verglos:schema:policy-evaluation", schemaVersion: "1.0.0", evaluationId: "urn:uuid:72345678-1234-4123-8123-123456789abc", policy: { id: "verglos.policy.local-default", version: "1.0.0", digest: digest("c") }, subjectId: subject.subjectId, subjectMatch: { status: "matched", observedSubjectId: subject.subjectId }, evaluatedAt: "2026-09-09T02:00:00.000Z", checks: [{ id: "verglos.check.native-sast", requirement: "required", onFailure: "BLOCK", status: "satisfied", evidenceDigests: [digest("d")], observationIds: [], freshness: { status: "current", checkedAt: "2026-09-09T01:00:00.000Z", validUntil: "2026-09-10T02:00:00.000Z" }, owner: "security", reason: "Evidence is current.", nextAction: "Preserve evidence." }], limitations: ["Preparatory fixture."] });
  const decision = createReleaseDecision({ decisionId: "urn:uuid:82345678-1234-4123-8123-123456789abc", evaluation, subjects: [{ subjectId: subject.subjectId, role: "primary" }], approvals: [], issuedBy: { kind: "service", id: "local", authority: "release" }, generatedAt: "2026-09-09T03:00:00.000Z", limitations: ["Preparatory fixture."] });
  const header = projectReleaseHeader(decision, "unsigned");
  assert.equal(header.decision, "PASS");
  assert.equal(header.subjectId, subject.subjectId);
  assert.equal(header.policy.digest, `sha256:${"c".repeat(64)}`);
  assert.equal(header.signerStatus, "unsigned");
  assert.equal("severity" in header, false);
});
