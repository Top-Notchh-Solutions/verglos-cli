import { createHash } from "node:crypto";
import { canonicalizeJson } from "./schema.js";
import { digestPolicyException, parseExceptionApproval, parsePolicyException, type ExceptionApprovalDocument, type PolicyExceptionDocument } from "./exception.js";

export interface ExceptionAuditProjection { readonly exceptionId: string; readonly approvalId: string; readonly requestDigest: string; readonly decision: "approved" | "denied"; readonly subjectId: string; readonly observationIds: readonly string[]; readonly eventDigest: string; }
export function projectExceptionAudit(exceptionValue: PolicyExceptionDocument, approvalValue: ExceptionApprovalDocument): ExceptionAuditProjection {
  const exception = parsePolicyException(exceptionValue); const approval = parseExceptionApproval(approvalValue); const requestDigest = digestPolicyException(exception); const projection = { exceptionId: exception.exceptionId, approvalId: approval.approvalId, requestDigest: `${requestDigest.algorithm}:${requestDigest.value}`, decision: approval.decision, subjectId: exception.scope.subjectId, observationIds: [...exception.scope.observationIds].sort() } as const;
  return Object.freeze({ ...projection, eventDigest: `sha256:${createHash("sha256").update(canonicalizeJson(projection), "utf8").digest("hex")}` });
}
