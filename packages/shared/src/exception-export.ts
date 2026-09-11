import { digestPolicyException, parseExceptionApproval, parsePolicyException, type ExceptionApprovalDocument, type PolicyExceptionDocument } from "./exception.js";

export function projectExceptionExport(exceptionValue: PolicyExceptionDocument, approvalValue: ExceptionApprovalDocument, now = new Date().toISOString()) {
  const exception = parsePolicyException(exceptionValue); const approval = parseExceptionApproval(approvalValue);
  const expired = Date.parse(exception.expiresAt) <= Date.parse(now) || (approval.validUntil !== undefined && Date.parse(approval.validUntil) <= Date.parse(now));
  const controls = exception.compensatingControls.map((control) => Object.freeze({
    description: control.description,
    owner: Object.freeze({ ...control.owner }),
    evidence: Object.freeze({
      system: control.evidence.system,
      recordId: control.evidence.recordId,
      digest: Object.freeze({ ...control.evidence.digest }),
    }),
  }));
  return Object.freeze({
    exceptionId: exception.exceptionId,
    scope: Object.freeze({ subjectId: exception.scope.subjectId, observationIds: Object.freeze([...exception.scope.observationIds].sort()) }),
    owner: Object.freeze({ ...exception.owner }),
    reason: exception.reason,
    controls: Object.freeze(controls),
    reversalTriggers: Object.freeze([...exception.reversalTriggers]),
    limitations: Object.freeze([...exception.limitations]),
    effectiveFrom: exception.effectiveFrom,
    expiresAt: exception.expiresAt,
    approval: Object.freeze({ id: approval.approvalId, decision: approval.decision, approver: Object.freeze({ ...approval.approver }), requestDigest: `${digestPolicyException(exception).algorithm}:${digestPolicyException(exception).value}`, auditDigest: `${approval.auditReference.digest.algorithm}:${approval.auditReference.digest.value}`, expired }),
    availableExports: Object.freeze(["SARIF", "CycloneDX", "CycloneDX VEX", "SPDX"] as const),
  });
}
