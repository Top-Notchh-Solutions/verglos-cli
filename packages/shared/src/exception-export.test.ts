import assert from "node:assert/strict";
import { test } from "node:test";
import { digestPolicyException, parseExceptionApproval, parsePolicyException } from "./exception.js";
import { projectExceptionExport } from "./exception-export.js";

function exceptionFixture() {
  return parsePolicyException({
    schemaId: "urn:verglos:schema:policy-exception",
    schemaVersion: "1.0.0",
    exceptionId: "urn:uuid:12345678-1234-4123-8123-123456789abc",
    scope: { subjectId: `urn:verglos:subject:artifact:sha256:${"a".repeat(64)}`, observationIds: ["urn:uuid:22345678-1234-4123-8123-123456789abc"] },
    owner: { kind: "person", id: "owner" },
    requestedBy: { kind: "person", id: "requester" },
    reason: "temporary risk acceptance",
    compensatingControls: [{ description: "monitor", owner: { kind: "person", id: "owner" }, evidence: { system: "local", recordId: "r1", digest: { algorithm: "sha256", value: "b".repeat(64) } } }],
    reversalTriggers: ["fix shipped"],
    requestedAt: "2026-09-01T00:00:00.000Z",
    effectiveFrom: "2026-09-01T00:00:00.000Z",
    expiresAt: "2026-09-30T00:00:00.000Z",
    limitations: ["preparatory"],
  });
}

function approvalFixture(exception: ReturnType<typeof exceptionFixture>, decision: "approved" | "denied" = "denied") {
  const requestDigest = digestPolicyException(exception);
  return parseExceptionApproval({
    schemaId: "urn:verglos:schema:exception-approval",
    schemaVersion: "1.0.0",
    approvalId: "urn:uuid:32345678-1234-4123-8123-123456789abc",
    target: { exceptionId: exception.exceptionId, requestDigest },
    decision,
    approver: { kind: "person", id: "approver", authority: "release" },
    rationale: decision === "denied" ? "insufficient evidence" : "approved for bounded test",
    decidedAt: "2026-09-02T00:00:00.000Z",
    ...(decision === "approved" ? { validUntil: "2026-09-20T00:00:00.000Z" } : {}),
    auditReference: { system: "local", recordId: "audit-1", digest: { algorithm: "sha256", value: "d".repeat(64) } },
  });
}

test("exception export projection preserves scope/control and classifies every requested format honestly", () => {
  const exception = exceptionFixture();
  const approval = approvalFixture(exception);
  const projection = projectExceptionExport(exception, approval, "2026-09-03T00:00:00.000Z");
  assert.deepEqual(projection.scope.observationIds, ["urn:uuid:22345678-1234-4123-8123-123456789abc"]);
  assert.equal(projection.controls[0]?.description, "monitor");
  assert.deepEqual(projection.reversalTriggers, ["fix shipped"]);
  assert.equal(projection.effectiveFrom, "2026-09-01T00:00:00.000Z");
  assert.equal(projection.expiresAt, "2026-09-30T00:00:00.000Z");
  assert.equal(projection.approval.binding, "matched");
  assert.equal(projection.approval.timeState, "denied");
  assert.equal(projection.approval.applicability.status, "not-evaluated");
  assert.equal(projection.approval.expired, false);
  assert.deepEqual(projection.exportChoices.map(({ format, status }) => [format, status]), [
    [".vgl", "not-integrated"], ["JSON", "not-integrated"], ["SARIF", "not-mapped"],
    ["CycloneDX", "not-mapped"], ["SPDX", "not-mapped"], ["VEX", "not-mapped"],
    ["HTML", "not-implemented"], ["PDF", "not-implemented"],
  ]);
  assert.equal(Object.isFrozen(projection), true);
  assert.equal(Object.isFrozen(projection.controls[0]), true);
  assert.equal(Object.isFrozen(projection.controls[0]?.evidence), true);
  assert.equal(Object.isFrozen(projection.exportChoices), true);
  assert.equal(Object.isFrozen(projection.exportChoices[0]), true);
});

test("exception export never treats a mismatched approval target as applicable", () => {
  const exception = exceptionFixture();
  const approval = approvalFixture(exception, "approved");
  const projection = projectExceptionExport(exception, parseExceptionApproval({
    ...approval,
    target: { ...approval.target, requestDigest: { algorithm: "sha256", value: "c".repeat(64) } },
  }), "2026-09-03T00:00:00.000Z");
  assert.equal(projection.approval.binding, "mismatched");
  assert.equal(projection.approval.timeState, "target-mismatch");
  assert.equal(projection.approval.decision, "approved");
});

test("exception export reports bounded effective-time state and rejects invalid projection times", () => {
  const exception = exceptionFixture();
  const approval = approvalFixture(exception, "approved");
  assert.equal(projectExceptionExport(exception, approval, "2026-08-31T23:59:59.000Z").approval.timeState, "not-yet-effective");
  assert.equal(projectExceptionExport(exception, approval, "2026-09-20T00:00:00.000Z").approval.timeState, "approval-expired");
  assert.equal(projectExceptionExport(exception, approval, "2026-09-30T00:00:00.000Z").approval.timeState, "expired");
  assert.throws(() => projectExceptionExport(exception, approval, "not-a-timestamp"));
});

test("exception export refuses approvals whose decision window violates the exception window", () => {
  const exception = exceptionFixture();
  const approval = approvalFixture(exception, "approved");
  const widened = parseExceptionApproval({ ...approval, validUntil: "2026-10-01T00:00:00.000Z" });
  assert.equal(projectExceptionExport(exception, widened, "2026-09-03T00:00:00.000Z").approval.timeState, "approval-outlives-exception");
});
