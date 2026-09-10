import assert from "node:assert/strict";
import { test } from "node:test";
import {
  JsonDocumentError,
  POLICY_EVALUATION_SCHEMA,
  RELEASE_DECISION_SCHEMA,
  ReleaseDecisionValidationError,
  createPolicyEvaluation,
  createReleaseDecision,
  createSubject,
  parseReleaseDecision,
  parseReleaseDecisionJson,
  type PolicyEvaluationInput,
  type ReleaseDecisionDocument,
} from "./index.js";

const digest = (char: string) => ({ algorithm: "sha256" as const, value: char.repeat(64) });

function evaluationInput(): PolicyEvaluationInput {
  const subject = createSubject({
    kind: "filesystem",
    treeDigest: digest("a"),
    ignorePolicyDigest: digest("b"),
    entryCount: 1,
  });
  return {
    schemaId: POLICY_EVALUATION_SCHEMA.id,
    schemaVersion: POLICY_EVALUATION_SCHEMA.version,
    evaluationId: "urn:uuid:82345678-1234-4123-8123-123456789abc",
    policy: { id: "verglos.policy.release", version: "1.0.0", digest: digest("c") },
    subjectId: subject.subjectId,
    subjectMatch: { status: "matched", observedSubjectId: subject.subjectId },
    evaluatedAt: "2026-09-09T02:00:00.000Z",
    checks: [
      {
        id: "verglos.check.release-evidence",
        requirement: "required",
        onFailure: "BLOCK",
        status: "satisfied",
        evidenceDigests: [digest("d")],
        observationIds: [],
        freshness: {
          status: "current",
          checkedAt: "2026-09-09T01:00:00.000Z",
          validUntil: "2026-09-10T02:00:00.000Z",
        },
        owner: "release-owner",
        reason: "Release evidence is current.",
        nextAction: "Preserve the bound evidence.",
      },
    ],
    limitations: ["The evaluation covers only the exact subject."],
  };
}

function releaseDecision(): ReleaseDecisionDocument {
  const evaluation = createPolicyEvaluation(evaluationInput());
  return createReleaseDecision({
    decisionId: "urn:uuid:92345678-1234-4123-8123-123456789abc",
    evaluation,
    subjects: [{ subjectId: evaluation.subjectId, role: "primary" }],
    issuedBy: { kind: "person", id: "release-owner", authority: "release-decision" },
    generatedAt: "2026-09-09T03:00:00.000Z",
    limitations: ["This decision applies only to the listed immutable subjects."],
  });
}

test("a release decision binds and round-trips its exact evaluation", () => {
  const decision = releaseDecision();
  assert.equal(decision.schemaId, RELEASE_DECISION_SCHEMA.id);
  assert.equal(decision.decision, "PASS");
  assert.equal(decision.evaluation.subjectId, decision.subjects[0]?.subjectId);
  assert.deepEqual(parseReleaseDecision(decision), decision);
  assert.deepEqual(parseReleaseDecisionJson(JSON.stringify(decision)), decision);
});

test("INCOMPLETE policy evaluations remain INCOMPLETE release decisions", () => {
  const input = evaluationInput();
  const evaluation = createPolicyEvaluation({
    ...input,
    subjectMatch: { status: "unresolved", reason: "Artifact identity is unavailable." },
  });
  const decision = createReleaseDecision({
    decisionId: "urn:uuid:a2345678-1234-4123-8123-123456789abc",
    evaluation,
    subjects: [{ subjectId: evaluation.subjectId, role: "primary" }],
    issuedBy: { kind: "service", id: "ci", authority: "policy-projection" },
    generatedAt: "2026-09-09T03:00:00.000Z",
    limitations: ["Identity remains unresolved."],
  });
  assert.equal(decision.decision, "INCOMPLETE");
  assertDecisionError(
    () => parseReleaseDecision({ ...decision, decision: "PASS" }),
    "decision",
  );
});

test("evaluation identity must equal exactly one primary subject", () => {
  const decision = releaseDecision();
  assertDecisionError(
    () => parseReleaseDecision({ ...decision, subjects: [{ ...decision.subjects[0]!, role: "source" }] }),
    "subjects",
  );
  assertDecisionError(
    () =>
      parseReleaseDecision({
        ...decision,
        subjects: [
          { ...decision.subjects[0]!, subjectId: decision.subjects[0]!.subjectId.replace("filesystem", "artifact") },
        ],
      }),
    "evaluation.subjectId",
  );
});

test("release subject and approval identities cannot repeat", () => {
  const decision = releaseDecision();
  assertDecisionError(
    () => parseReleaseDecision({ ...decision, subjects: [decision.subjects[0]!, decision.subjects[0]!] }),
    "subjects",
  );
  const approval = {
    kind: "release" as const,
    approvalId: "urn:uuid:b2345678-1234-4123-8123-123456789abc",
    digest: digest("e"),
    approverId: "founder",
    authority: "release-approval",
    decidedAt: "2026-09-09T02:30:00.000Z",
    validUntil: "2026-09-10T03:00:00.000Z",
  };
  assertDecisionError(
    () => parseReleaseDecision({ ...decision, approvals: [approval, approval] }),
    "approvals",
  );
});

test("generation and approval times cannot contradict the decision", () => {
  const decision = releaseDecision();
  assertDecisionError(
    () => parseReleaseDecision({ ...decision, generatedAt: "2026-09-09T01:59:59.000Z" }),
    "generatedAt",
  );
  const expiredApproval = {
    kind: "release" as const,
    approvalId: "urn:uuid:c2345678-1234-4123-8123-123456789abc",
    digest: digest("f"),
    approverId: "founder",
    authority: "release-approval",
    decidedAt: "2026-09-09T02:30:00.000Z",
    validUntil: decision.generatedAt,
  };
  assertDecisionError(
    () => parseReleaseDecision({ ...decision, approvals: [expiredApproval] }),
    "approvals.0.validUntil",
  );
});

test("policy and evaluation references remain strict and digest-bound", () => {
  const decision = releaseDecision();
  assertDecisionError(
    () => parseReleaseDecision({ ...decision, evaluation: { ...decision.evaluation, extra: true } }),
    "evaluation",
  );
  assertDecisionError(
    () => parseReleaseDecision({ ...decision, policy: { ...decision.policy, id: "Not Stable" } }),
    "policy.id",
  );
  assertDecisionError(
    () =>
      parseReleaseDecision({
        ...decision,
        policy: { ...decision.policy, digest: digest("0") },
      }),
    "policy",
  );
});

test("future release-decision versions require an upgraded reader", () => {
  assert.throws(
    () => parseReleaseDecisionJson(JSON.stringify({ ...releaseDecision(), schemaVersion: "2.0.0" })),
    (error: unknown) =>
      error instanceof JsonDocumentError && error.code === "SCHEMA_UPGRADE_REQUIRED",
  );
});

function assertDecisionError(operation: () => unknown, path: string): void {
  assert.throws(operation, (error: unknown) => {
    assert.ok(error instanceof ReleaseDecisionValidationError);
    assert.ok(error.issues.some((entry) => entry.path === path || entry.path.startsWith(`${path}.`)));
    return true;
  });
}
