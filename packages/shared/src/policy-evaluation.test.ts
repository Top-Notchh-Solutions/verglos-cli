import assert from "node:assert/strict";
import { test } from "node:test";
import {
  JsonDocumentError,
  POLICY_DECISION_EXIT_CODES,
  POLICY_EVALUATION_SCHEMA,
  PolicyEvaluationValidationError,
  createPolicyEvaluation,
  createSubject,
  parsePolicyEvaluation,
  parsePolicyEvaluationJson,
  policyDecisionExitCode,
  type PolicyEvaluationInput,
} from "./index.js";

const digest = (char: string) => ({ algorithm: "sha256" as const, value: char.repeat(64) });

function input(): PolicyEvaluationInput {
  const subject = createSubject({
    kind: "filesystem",
    treeDigest: digest("a"),
    ignorePolicyDigest: digest("b"),
    entryCount: 4,
  });
  return {
    schemaId: POLICY_EVALUATION_SCHEMA.id,
    schemaVersion: POLICY_EVALUATION_SCHEMA.version,
    evaluationId: "urn:uuid:72345678-1234-4123-8123-123456789abc",
    policy: {
      id: "verglos.policy.local-default",
      version: "1.0.0",
      digest: digest("c"),
    },
    subjectId: subject.subjectId,
    subjectMatch: { status: "matched", observedSubjectId: subject.subjectId },
    evaluatedAt: "2026-09-09T02:00:00.000Z",
    checks: [
      {
        id: "verglos.check.native-sast",
        requirement: "required",
        onFailure: "BLOCK",
        status: "satisfied",
        evidenceDigests: [digest("d")],
        observationIds: [],
        freshness: {
          status: "current",
          checkedAt: "2026-09-09T01:00:00.000Z",
          sourceUpdatedAt: "2026-09-09T00:00:00.000Z",
          validUntil: "2026-09-10T02:00:00.000Z",
        },
        owner: "application-security",
        reason: "Required native analysis completed with current evidence.",
        nextAction: "Preserve the evidence digest with the release record.",
      },
    ],
    limitations: ["This evaluation covers only the exact recorded subject and policy."],
  };
}

test("satisfied current requirements deterministically produce PASS and exit 0", () => {
  const evaluation = createPolicyEvaluation(input());
  assert.equal(evaluation.decision, "PASS");
  assert.equal(evaluation.exitCode, 0);
  assert.equal(evaluation.reasons[0]?.code, "requirements-satisfied");
  assert.deepEqual(parsePolicyEvaluation(evaluation), evaluation);
  assert.deepEqual(parsePolicyEvaluationJson(JSON.stringify(evaluation)), evaluation);
});

test("failed checks produce BLOCK or REVIEW according to policy", () => {
  const base = input();
  const failed = { ...base.checks[0]!, status: "failed" as const };
  assert.equal(createPolicyEvaluation({ ...base, checks: [failed] }).decision, "BLOCK");
  assert.equal(
    createPolicyEvaluation({
      ...base,
      checks: [{ ...failed, requirement: "advisory", onFailure: "REVIEW" }],
    }).decision,
    "REVIEW",
  );
});

test("adversarial decision matrix preserves exact outcome exits", () => {
  const base = input();
  const cases = [
    ["required failed", { ...base.checks[0]!, status: "failed" as const }, "BLOCK", 1],
    ["advisory failed", { ...base.checks[0]!, requirement: "advisory" as const, onFailure: "REVIEW" as const, status: "failed" as const }, "REVIEW", 2],
    ["advisory missing", { ...base.checks[0]!, requirement: "advisory" as const, onFailure: "REVIEW" as const, status: "missing" as const, evidenceDigests: [], freshness: { status: "unknown" as const, checkedAt: base.evaluatedAt } }, "REVIEW", 2],
    ["required stale", { ...base.checks[0]!, status: "stale" as const, freshness: { status: "stale" as const, checkedAt: base.evaluatedAt, validUntil: base.evaluatedAt } }, "INCOMPLETE", 3],
  ] as const;
  for (const [, check, decision, exitCode] of cases) {
    const evaluation = createPolicyEvaluation({ ...base, checks: [check] });
    assert.equal(evaluation.decision, decision);
    assert.equal(evaluation.exitCode, exitCode);
  }
});

test("every unavailable required-evidence state produces INCOMPLETE", () => {
  const base = input();
  for (const status of ["missing", "unsupported", "error"] as const) {
    const check = {
      ...base.checks[0]!,
      status,
      evidenceDigests: status === "error" ? [digest("e")] : [],
      freshness: {
        status: "unknown" as const,
        checkedAt: "2026-09-09T01:00:00.000Z",
      },
    };
    const evaluation = createPolicyEvaluation({ ...base, checks: [check] });
    assert.equal(evaluation.decision, "INCOMPLETE");
    assert.equal(evaluation.exitCode, 3);
    assert.equal(evaluation.reasons[0]?.code, `required-check-${status}`);
  }
});

test("stale required evidence produces INCOMPLETE", () => {
  const base = input();
  const check = {
    ...base.checks[0]!,
    status: "stale" as const,
    freshness: {
      status: "stale" as const,
      checkedAt: "2026-09-09T01:00:00.000Z",
      validUntil: "2026-09-09T02:00:00.000Z",
    },
  };
  assert.equal(createPolicyEvaluation({ ...base, checks: [check] }).decision, "INCOMPLETE");
});

test("INCOMPLETE outranks a simultaneous blocking finding", () => {
  const base = input();
  const failed = { ...base.checks[0]!, id: "verglos.check.blocker", status: "failed" as const };
  const missing = {
    ...base.checks[0]!,
    id: "verglos.check.missing",
    status: "missing" as const,
    evidenceDigests: [],
    freshness: { status: "unknown" as const, checkedAt: "2026-09-09T01:00:00.000Z" },
  };
  const evaluation = createPolicyEvaluation({ ...base, checks: [failed, missing] });
  assert.equal(evaluation.decision, "INCOMPLETE");
  assert.deepEqual(
    evaluation.reasons.map((reason) => reason.code),
    ["check-failed-block", "required-check-missing"],
  );
});

test("identity mismatch or unresolved identity can never PASS", () => {
  const base = input();
  const different = base.subjectId.replace("filesystem", "artifact");
  assert.equal(
    createPolicyEvaluation({
      ...base,
      subjectMatch: {
        status: "mismatched",
        observedSubjectId: different,
        reason: "The built artifact does not match the requested source subject.",
      },
    }).decision,
    "INCOMPLETE",
  );
  assert.equal(
    createPolicyEvaluation({
      ...base,
      subjectMatch: {
        status: "unresolved",
        reason: "No immutable artifact identity was available.",
      },
    }).decision,
    "INCOMPLETE",
  );
});

test("freshness labels must agree with evidence status and evaluation time", () => {
  const base = input();
  assertEvaluationError(
    () =>
      createPolicyEvaluation({
        ...base,
        checks: [{ ...base.checks[0]!, freshness: { ...base.checks[0]!.freshness, validUntil: base.evaluatedAt } }],
      }),
    "checks.0.freshness.validUntil",
  );
  assertEvaluationError(
    () =>
      createPolicyEvaluation({
        ...base,
        checks: [{ ...base.checks[0]!, status: "missing", evidenceDigests: [] }],
      }),
    "checks.0.freshness.status",
  );
});

test("checks require evidence honestly and advisory checks cannot block", () => {
  const base = input();
  assertEvaluationError(
    () => createPolicyEvaluation({ ...base, checks: [{ ...base.checks[0]!, evidenceDigests: [] }] }),
    "checks.0.evidenceDigests",
  );
  assertEvaluationError(
    () => createPolicyEvaluation({ ...base, checks: [{ ...base.checks[0]!, requirement: "advisory" }] }),
    "checks.0.onFailure",
  );
});

test("check IDs are unique and reason ordering is stable by check ID", () => {
  const base = input();
  assertEvaluationError(
    () => createPolicyEvaluation({ ...base, checks: [base.checks[0]!, base.checks[0]!] }),
    "checks",
  );
  const review = {
    ...base.checks[0]!,
    id: "verglos.check.z-review",
    requirement: "advisory" as const,
    onFailure: "REVIEW" as const,
    status: "failed" as const,
  };
  const block = { ...base.checks[0]!, id: "verglos.check.a-block", status: "failed" as const };
  assert.deepEqual(
    createPolicyEvaluation({ ...base, checks: [review, block] }).reasons.map((reason) => reason.checkId),
    ["verglos.check.a-block", "verglos.check.z-review"],
  );
});

test("recorded decisions, exits, and reasons cannot contradict facts", () => {
  const evaluation = createPolicyEvaluation(input());
  assertEvaluationError(
    () => parsePolicyEvaluation({ ...evaluation, decision: "BLOCK" }),
    "decision",
  );
  assertEvaluationError(
    () => parsePolicyEvaluation({ ...evaluation, exitCode: 3 }),
    "exitCode",
  );
  assertEvaluationError(
    () => parsePolicyEvaluation({ ...evaluation, reasons: [{ ...evaluation.reasons[0]!, detail: "Altered." }] }),
    "reasons",
  );
  assert.deepEqual(POLICY_DECISION_EXIT_CODES, { PASS: 0, BLOCK: 1, REVIEW: 2, INCOMPLETE: 3 });
  assert.equal(policyDecisionExitCode("INCOMPLETE"), 3);
});

test("future policy-evaluation versions require an upgraded reader", () => {
  const evaluation = createPolicyEvaluation(input());
  assert.throws(
    () => parsePolicyEvaluationJson(JSON.stringify({ ...evaluation, schemaVersion: "2.0.0" })),
    (error: unknown) =>
      error instanceof JsonDocumentError && error.code === "SCHEMA_UPGRADE_REQUIRED",
  );
});

function assertEvaluationError(operation: () => unknown, path: string): void {
  assert.throws(operation, (error: unknown) => {
    assert.ok(error instanceof PolicyEvaluationValidationError);
    assert.ok(error.issues.some((entry) => entry.path === path || entry.path.startsWith(`${path}.`)));
    return true;
  });
}
