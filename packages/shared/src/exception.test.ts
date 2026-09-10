import assert from "node:assert/strict";
import { test } from "node:test";
import {
  EXCEPTION_APPROVAL_SCHEMA,
  ExceptionApprovalValidationError,
  JsonDocumentError,
  POLICY_EXCEPTION_SCHEMA,
  PolicyExceptionValidationError,
  createSubject,
  digestPolicyException,
  evaluatePolicyException,
  parseExceptionApproval,
  parseExceptionApprovalJson,
  parsePolicyException,
  parsePolicyExceptionJson,
  type ExceptionApprovalDocument,
  type PolicyExceptionDocument,
} from "./index.js";

const digest = (char: string) => ({
  algorithm: "sha256" as const,
  value: char.repeat(64),
});

function exceptionDocument(): PolicyExceptionDocument {
  const subject = createSubject({
    kind: "filesystem",
    treeDigest: digest("a"),
    ignorePolicyDigest: digest("b"),
    entryCount: 2,
  });
  return {
    schemaId: POLICY_EXCEPTION_SCHEMA.id,
    schemaVersion: POLICY_EXCEPTION_SCHEMA.version,
    exceptionId: "urn:uuid:32345678-1234-4123-8123-123456789abc",
    scope: {
      subjectId: subject.subjectId,
      observationIds: ["urn:uuid:42345678-1234-4123-8123-123456789abc"],
    },
    owner: { kind: "team", id: "application-security" },
    requestedBy: { kind: "agent", id: "verglos.local-agent" },
    reason: "The exact observation is accepted temporarily while the bounded mitigation is deployed.",
    compensatingControls: [
      {
        description: "The affected route is disabled at the gateway.",
        owner: { kind: "person", id: "security-owner" },
        evidence: {
          system: "local-audit",
          recordId: "control-2026-09-09-001",
          digest: digest("c"),
        },
      },
    ],
    reversalTriggers: ["The gateway control is removed or its evidence becomes stale."],
    requestedAt: "2026-09-09T00:00:00.000Z",
    effectiveFrom: "2026-09-09T01:00:00.000Z",
    expiresAt: "2026-09-16T01:00:00.000Z",
    limitations: ["This exception applies only to the named subject and observation."],
  };
}

function approvalDocument(
  exception = exceptionDocument(),
  decision: "approved" | "denied" = "approved",
): ExceptionApprovalDocument {
  return {
    schemaId: EXCEPTION_APPROVAL_SCHEMA.id,
    schemaVersion: EXCEPTION_APPROVAL_SCHEMA.version,
    approvalId: "urn:uuid:52345678-1234-4123-8123-123456789abc",
    target: {
      exceptionId: exception.exceptionId,
      requestDigest: digestPolicyException(exception),
    },
    decision,
    approver: {
      kind: "person",
      id: "founder",
      authority: "risk-owner",
    },
    rationale:
      decision === "approved"
        ? "The bounded mitigation and seven-day expiry are accepted."
        : "The proposed control does not reduce the risk sufficiently.",
    decidedAt: "2026-09-09T00:30:00.000Z",
    validUntil: decision === "approved" ? "2026-09-15T01:00:00.000Z" : undefined,
    auditReference: {
      system: "local-audit",
      recordId: "approval-2026-09-09-001",
      digest: digest("d"),
    },
  };
}

test("an approved exact exception round-trips and becomes applicable", () => {
  const exception = exceptionDocument();
  const approval = approvalDocument(exception);
  assert.deepEqual(parsePolicyException(exception), exception);
  assert.deepEqual(parsePolicyExceptionJson(JSON.stringify(exception)), exception);
  assert.deepEqual(parseExceptionApproval(approval), approval);
  assert.deepEqual(parseExceptionApprovalJson(JSON.stringify(approval)), approval);
  assert.deepEqual(
    evaluatePolicyException(exception, approval, {
      subjectId: exception.scope.subjectId,
      observationId: exception.scope.observationIds[0]!,
      at: "2026-09-10T00:00:00.000Z",
    }),
    { applicable: true, reason: "applicable" },
  );
});

test("exception scope requires exact bounded observation IDs", () => {
  const exception = exceptionDocument();
  assertExceptionError(
    () => parsePolicyException({ ...exception, scope: { ...exception.scope, observationIds: [] } }),
    "scope.observationIds",
  );
  assertExceptionError(
    () =>
      parsePolicyException({
        ...exception,
        scope: { ...exception.scope, observationIds: ["*"] },
      }),
    "scope.observationIds.0",
  );
  assertExceptionError(
    () =>
      parsePolicyException({
        ...exception,
        scope: {
          ...exception.scope,
          observationIds: Array.from(
            { length: 101 },
            (_, index) => `urn:uuid:${(index + 1).toString(16).padStart(8, "0")}-1234-4123-8123-123456789abc`,
          ),
        },
      }),
    "scope.observationIds",
  );
});

test("exception scope cannot contain duplicate observations", () => {
  const exception = exceptionDocument();
  assertExceptionError(
    () =>
      parsePolicyException({
        ...exception,
        scope: {
          ...exception.scope,
          observationIds: [
            exception.scope.observationIds[0]!,
            exception.scope.observationIds[0]!,
          ],
        },
      }),
    "scope.observationIds",
  );
});

test("exceptions require controls, reversal triggers, and finite ordered validity", () => {
  const exception = exceptionDocument();
  assertExceptionError(
    () => parsePolicyException({ ...exception, compensatingControls: [] }),
    "compensatingControls",
  );
  assertExceptionError(
    () => parsePolicyException({ ...exception, reversalTriggers: [] }),
    "reversalTriggers",
  );
  assertExceptionError(
    () => parsePolicyException({ ...exception, expiresAt: exception.effectiveFrom }),
    "expiresAt",
  );
});

test("an approval is bound to exact canonical exception bytes", () => {
  const exception = exceptionDocument();
  const approval = approvalDocument(exception);
  const changed = { ...exception, reason: `${exception.reason} Changed.` };
  assert.deepEqual(
    evaluatePolicyException(changed, approval, {
      subjectId: changed.scope.subjectId,
      observationId: changed.scope.observationIds[0]!,
      at: "2026-09-10T00:00:00.000Z",
    }),
    { applicable: false, reason: "target-mismatch" },
  );
});

test("denied and expired approvals never make an exception applicable", () => {
  const exception = exceptionDocument();
  assert.equal(
    evaluatePolicyException(exception, approvalDocument(exception, "denied"), {
      subjectId: exception.scope.subjectId,
      observationId: exception.scope.observationIds[0]!,
      at: "2026-09-10T00:00:00.000Z",
    }).reason,
    "approval-denied",
  );
  assert.equal(
    evaluatePolicyException(exception, approvalDocument(exception), {
      subjectId: exception.scope.subjectId,
      observationId: exception.scope.observationIds[0]!,
      at: "2026-09-15T01:00:00.000Z",
    }).reason,
    "approval-expired",
  );
});

test("expired exceptions and early use remain explicit", () => {
  const exception = exceptionDocument();
  const approval = approvalDocument(exception);
  assert.equal(
    evaluatePolicyException(exception, approval, {
      subjectId: exception.scope.subjectId,
      observationId: exception.scope.observationIds[0]!,
      at: "2026-09-09T00:45:00.000Z",
    }).reason,
    "not-yet-effective",
  );
  assert.equal(
    evaluatePolicyException(exception, approval, {
      subjectId: exception.scope.subjectId,
      observationId: exception.scope.observationIds[0]!,
      at: exception.expiresAt,
    }).reason,
    "expired",
  );
});

test("exceptions cannot widen to another subject or observation", () => {
  const exception = exceptionDocument();
  const approval = approvalDocument(exception);
  assert.equal(
    evaluatePolicyException(exception, approval, {
      subjectId: exception.scope.subjectId.replace("filesystem", "artifact"),
      observationId: exception.scope.observationIds[0]!,
      at: "2026-09-10T00:00:00.000Z",
    }).reason,
    "subject-mismatch",
  );
  assert.equal(
    evaluatePolicyException(exception, approval, {
      subjectId: exception.scope.subjectId,
      observationId: "urn:uuid:62345678-1234-4123-8123-123456789abc",
      at: "2026-09-10T00:00:00.000Z",
    }).reason,
    "observation-out-of-scope",
  );
});

test("only a named human authority can approve an exception", () => {
  const approval = approvalDocument();
  assertApprovalError(
    () =>
      parseExceptionApproval({
        ...approval,
        approver: { kind: "agent", id: "verglos.local-agent", authority: "self" },
      }),
    "approver.kind",
  );
  assertApprovalError(
    () => parseExceptionApproval({ ...approval, validUntil: undefined }),
    "validUntil",
  );
});

test("approval time and validity cannot widen the exception window", () => {
  const exception = exceptionDocument();
  const beforeRequest = {
    ...approvalDocument(exception),
    decidedAt: "2026-09-08T23:59:59.000Z",
  };
  assert.equal(
    evaluatePolicyException(exception, beforeRequest, {
      subjectId: exception.scope.subjectId,
      observationId: exception.scope.observationIds[0]!,
      at: "2026-09-10T00:00:00.000Z",
    }).reason,
    "decision-before-request",
  );
  const outlives = {
    ...approvalDocument(exception),
    validUntil: "2026-09-17T01:00:00.000Z",
  };
  assert.equal(
    evaluatePolicyException(exception, outlives, {
      subjectId: exception.scope.subjectId,
      observationId: exception.scope.observationIds[0]!,
      at: "2026-09-10T00:00:00.000Z",
    }).reason,
    "approval-outlives-exception",
  );
});

test("future exception and approval versions require upgraded readers", () => {
  assert.throws(
    () =>
      parsePolicyExceptionJson(
        JSON.stringify({ ...exceptionDocument(), schemaVersion: "2.0.0" }),
      ),
    (error: unknown) =>
      error instanceof JsonDocumentError && error.code === "SCHEMA_UPGRADE_REQUIRED",
  );
  assert.throws(
    () =>
      parseExceptionApprovalJson(
        JSON.stringify({ ...approvalDocument(), schemaVersion: "2.0.0" }),
      ),
    (error: unknown) =>
      error instanceof JsonDocumentError && error.code === "SCHEMA_UPGRADE_REQUIRED",
  );
});

function assertExceptionError(operation: () => unknown, path: string): void {
  assert.throws(operation, (error: unknown) => {
    assert.ok(error instanceof PolicyExceptionValidationError);
    assert.ok(error.issues.some((entry) => entry.path === path || entry.path.startsWith(`${path}.`)));
    return true;
  });
}

function assertApprovalError(operation: () => unknown, path: string): void {
  assert.throws(operation, (error: unknown) => {
    assert.ok(error instanceof ExceptionApprovalValidationError);
    assert.ok(error.issues.some((entry) => entry.path === path || entry.path.startsWith(`${path}.`)));
    return true;
  });
}
