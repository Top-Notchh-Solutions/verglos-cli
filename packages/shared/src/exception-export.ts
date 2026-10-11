import { z } from "zod";
import { digestPolicyException, parseExceptionApproval, parsePolicyException } from "./exception.js";

const TimestampSchema = z.string().datetime({ offset: true });

const EXPORT_CHOICES = Object.freeze([
  Object.freeze({ format: ".vgl", status: "not-integrated", reason: "Release Records can contain exception members, but an exception-specific record export flow is not wired." }),
  Object.freeze({ format: "JSON", status: "not-integrated", reason: "Exception and approval JSON schemas exist, but a dedicated exception export flow is not wired." }),
  Object.freeze({ format: "SARIF", status: "not-mapped", reason: "The SARIF exporter does not encode Verglos exception and approval records." }),
  Object.freeze({ format: "CycloneDX", status: "not-mapped", reason: "The CycloneDX exporter does not encode Verglos exception and approval records." }),
  Object.freeze({ format: "SPDX", status: "not-mapped", reason: "The SPDX exporter does not encode Verglos exception and approval records." }),
  Object.freeze({ format: "VEX", status: "not-mapped", reason: "The VEX exporter does not encode Verglos exception and approval records." }),
  Object.freeze({ format: "HTML", status: "not-implemented", reason: "No exception-specific HTML export is implemented." }),
  Object.freeze({ format: "PDF", status: "not-implemented", reason: "No exception-specific PDF export is implemented." }),
] as const);

export function projectExceptionExport(exceptionValue: unknown, approvalValue: unknown, now = new Date().toISOString()) {
  const exception = parsePolicyException(exceptionValue); const approval = parseExceptionApproval(approvalValue);
  const nowValue = TimestampSchema.parse(now);
  const nowMs = Date.parse(nowValue);
  const requestDigest = digestPolicyException(exception);
  const targetMatches = approval.target.exceptionId === exception.exceptionId
    && approval.target.requestDigest.algorithm === requestDigest.algorithm
    && approval.target.requestDigest.value === requestDigest.value;
  const expired = Date.parse(exception.expiresAt) <= nowMs || (approval.validUntil !== undefined && Date.parse(approval.validUntil) <= nowMs);
  const approvalTimeState = !targetMatches ? "target-mismatch"
    : approval.decision === "denied" ? "denied"
      : Date.parse(approval.decidedAt) < Date.parse(exception.requestedAt) ? "decision-before-request"
        : Date.parse(approval.decidedAt) >= Date.parse(exception.expiresAt) ? "decision-after-exception-expiry"
          : Date.parse(approval.validUntil!) > Date.parse(exception.expiresAt) ? "approval-outlives-exception"
            : nowMs < Date.parse(exception.effectiveFrom) ? "not-yet-effective"
              : nowMs >= Date.parse(exception.expiresAt) ? "expired"
                : nowMs >= Date.parse(approval.validUntil!) ? "approval-expired" : "within-time-window";
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
    approval: Object.freeze({ id: approval.approvalId, decision: approval.decision, approver: Object.freeze({ ...approval.approver }), binding: targetMatches ? "matched" as const : "mismatched" as const, timeState: approvalTimeState, applicability: Object.freeze({ status: "not-evaluated" as const, reason: "Applicability requires evaluating an exact subject and observation at use time." }), requestDigest: `${requestDigest.algorithm}:${requestDigest.value}`, auditDigest: `${approval.auditReference.digest.algorithm}:${approval.auditReference.digest.value}`, expired }),
    exportChoices: EXPORT_CHOICES,
  });
}
