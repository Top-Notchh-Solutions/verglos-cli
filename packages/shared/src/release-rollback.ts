/**
 * DIST-006 · release rollback/revocation decision contract.
 *
 * This is deliberately a decision boundary, not an npm/registry/deployment
 * client. Callers must supply immutable references and an explicit approval;
 * the contract refuses ambiguous targets and never treats rollback as a
 * request to rewrite or invalidate historical records.
 */

export const RELEASE_ROLLBACK_KINDS = [
  "npm-package",
  "engine-manifest",
  "hunt-feed",
  "signing-identity",
  "web-deployment",
] as const;
export type ReleaseRollbackKind = (typeof RELEASE_ROLLBACK_KINDS)[number];

export const RELEASE_ROLLBACK_FAILURES = [
  "approval-required",
  "kind-invalid",
  "current-reference-invalid",
  "target-reference-invalid",
  "same-reference",
  "target-not-immutable",
  "history-invalidation-requested",
  "revocation-requires-replacement",
  "revocation-not-applicable",
] as const;
export type ReleaseRollbackFailure = (typeof RELEASE_ROLLBACK_FAILURES)[number];

export type ReleaseReference = Readonly<{
  kind: ReleaseRollbackKind;
  /** Human-readable identity, never used as an immutable selector alone. */
  identity: string;
  /** Content/deployment digest or another immutable provider reference. */
  immutableRef: string;
}>;

export type ReleaseRollbackRequest = Readonly<{
  current: ReleaseReference;
  target: ReleaseReference;
  approved: boolean;
  /** A rollback/revocation may explain the incident without accepting arbitrary source text. */
  reason: string;
  /** Historical records must remain verifiable after this operation. */
  preserveHistoricalRecords: boolean;
  /** Revoking a signing identity requires a replacement for future signatures. */
  replacementIdentity?: ReleaseReference;
}>;

export type ReleaseRollbackDecision =
  | Readonly<{
      allowed: true;
      action: "rollback" | "revoke";
      kind: ReleaseRollbackKind;
      current: ReleaseReference;
      target: ReleaseReference;
      preserveHistoricalRecords: true;
      reason: string;
    }>
  | Readonly<{ allowed: false; reason: ReleaseRollbackFailure }>;

const SAFE_TEXT = /^[^\u0000-\u001f\u007f]{1,512}$/u;
const IMMUTABLE_REF = /^(?:sha256:[a-f0-9]{64}|https:\/\/[^\s#?]+|v\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)$/u;

function validReference(value: ReleaseReference): boolean {
  return RELEASE_ROLLBACK_KINDS.includes(value.kind)
    && SAFE_TEXT.test(value.identity)
    && IMMUTABLE_REF.test(value.immutableRef);
}

/**
 * Decide whether a provider-specific rollback/revocation may proceed.
 *
 * Provider adapters still need their own authenticated execution, audit,
 * retry, and recovery evidence. This function only makes unsafe intent
 * impossible to represent at the shared boundary.
 */
export function decideReleaseRollback(input: ReleaseRollbackRequest): ReleaseRollbackDecision {
  if (!input.approved) return { allowed: false, reason: "approval-required" };
  if (!RELEASE_ROLLBACK_KINDS.includes(input.current.kind) || input.current.kind !== input.target.kind) return { allowed: false, reason: "kind-invalid" };
  if (!validReference(input.current)) return { allowed: false, reason: "current-reference-invalid" };
  if (!validReference(input.target)) return { allowed: false, reason: "target-reference-invalid" };
  if (input.current.identity === input.target.identity && input.current.immutableRef === input.target.immutableRef) return { allowed: false, reason: "same-reference" };
  if (!input.preserveHistoricalRecords) return { allowed: false, reason: "history-invalidation-requested" };
  if (!SAFE_TEXT.test(input.reason.trim())) return { allowed: false, reason: "target-reference-invalid" };

  if (input.current.kind === "signing-identity") {
    if (!input.replacementIdentity || input.replacementIdentity.kind !== "signing-identity" || !validReference(input.replacementIdentity)) {
      return { allowed: false, reason: "revocation-requires-replacement" };
    }
    if (input.replacementIdentity.immutableRef === input.current.immutableRef) return { allowed: false, reason: "same-reference" };
    return { allowed: true, action: "revoke", kind: input.current.kind, current: input.current, target: input.target, preserveHistoricalRecords: true, reason: input.reason.trim() };
  }

  if (input.replacementIdentity !== undefined) return { allowed: false, reason: "revocation-not-applicable" };
  return { allowed: true, action: "rollback", kind: input.current.kind, current: input.current, target: input.target, preserveHistoricalRecords: true, reason: input.reason.trim() };
}

