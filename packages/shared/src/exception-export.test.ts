import assert from "node:assert/strict";
import { test } from "node:test";
import { projectExceptionExport } from "./exception-export.js";

test("exception export projection preserves scope and only lists implemented formats", () => {
  const exception = { schemaId: "urn:verglos:schema:policy-exception", schemaVersion: "1.0.0", exceptionId: "urn:uuid:12345678-1234-4123-8123-123456789abc", scope: { subjectId: `urn:verglos:subject:artifact:sha256:${"a".repeat(64)}`, observationIds: ["urn:uuid:22345678-1234-4123-8123-123456789abc"] }, owner: { kind: "person", id: "owner" }, requestedBy: { kind: "person", id: "requester" }, reason: "temporary risk acceptance", compensatingControls: [{ description: "monitor", owner: { kind: "person", id: "owner" }, evidence: { system: "local", recordId: "r1", digest: { algorithm: "sha256", value: "b".repeat(64) } } }], reversalTriggers: ["fix shipped"], requestedAt: "2026-09-01T00:00:00.000Z", effectiveFrom: "2026-09-01T00:00:00.000Z", expiresAt: "2026-09-30T00:00:00.000Z", limitations: ["preparatory"] } as const;
  const approval = { schemaId: "urn:verglos:schema:exception-approval", schemaVersion: "1.0.0", approvalId: "urn:uuid:32345678-1234-4123-8123-123456789abc", target: { exceptionId: exception.exceptionId, requestDigest: { algorithm: "sha256", value: "c".repeat(64) } }, decision: "denied", approver: { kind: "person", id: "approver", authority: "release" }, rationale: "insufficient evidence", decidedAt: "2026-09-02T00:00:00.000Z", auditReference: { system: "local", recordId: "audit-1", digest: { algorithm: "sha256", value: "d".repeat(64) } } } as const;
  const projection = projectExceptionExport(exception as any, approval as any, "2026-09-03T00:00:00.000Z");
  assert.deepEqual(projection.scope.observationIds, ["urn:uuid:22345678-1234-4123-8123-123456789abc"]);
  assert.equal(projection.controls[0]?.description, "monitor");
  assert.deepEqual(projection.reversalTriggers, ["fix shipped"]);
  assert.equal(projection.effectiveFrom, "2026-09-01T00:00:00.000Z");
  assert.deepEqual(projection.availableExports, ["SARIF", "CycloneDX", "CycloneDX VEX", "SPDX"]);
  assert.equal(projection.approval.expired, false);
  assert.equal(Object.isFrozen(projection), true);
  assert.equal(Object.isFrozen(projection.controls[0]), true);
  assert.equal(Object.isFrozen(projection.controls[0]?.evidence), true);
});
