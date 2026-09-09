import { createHash } from "node:crypto";
import { z } from "zod";
import { ObservationIdSchema } from "./observation.js";
import {
  VERGLOS_SCHEMA_IDS,
  canonicalizeJson,
  classifySchemaCompatibility,
  parseSchemaVersion,
  parseVersionedJson,
  type ParseJsonOptions,
  type SchemaDescriptor,
} from "./schema.js";
import { ContentDigestSchema, SubjectIdSchema, type ContentDigest } from "./subject.js";

export const POLICY_EXCEPTION_SCHEMA = {
  id: VERGLOS_SCHEMA_IDS.policyException,
  version: "1.0.0",
} as const satisfies SchemaDescriptor;

export const EXCEPTION_APPROVAL_SCHEMA = {
  id: VERGLOS_SCHEMA_IDS.exceptionApproval,
  version: "1.0.0",
} as const satisfies SchemaDescriptor;

const UUID_URN = /^urn:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const SAFE_TEXT = /^[^\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]+$/;
const ShortTextSchema = z.string().min(1).max(512).regex(SAFE_TEXT);
const TextSchema = z.string().min(1).max(4096).regex(SAFE_TEXT);
const TimestampSchema = z.string().datetime({ offset: true });

const ActorSchema = z
  .object({
    kind: z.enum(["person", "service", "agent"]),
    id: ShortTextSchema,
  })
  .strict();

const OwnerSchema = z
  .object({
    kind: z.enum(["person", "team"]),
    id: ShortTextSchema,
  })
  .strict();

const HumanApproverSchema = z
  .object({
    kind: z.literal("person"),
    id: ShortTextSchema,
    authority: ShortTextSchema,
  })
  .strict();

const AuditReferenceSchema = z
  .object({
    system: ShortTextSchema,
    recordId: ShortTextSchema,
    digest: ContentDigestSchema,
  })
  .strict();

const ExceptionScopeSchema = z
  .object({
    subjectId: SubjectIdSchema,
    observationIds: z.array(ObservationIdSchema).min(1).max(100),
  })
  .strict()
  .superRefine((value, context) => {
    if (new Set(value.observationIds).size !== value.observationIds.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["observationIds"],
        message: "exception scope cannot repeat observation IDs",
      });
    }
  });

const CompensatingControlSchema = z
  .object({
    description: TextSchema,
    owner: OwnerSchema,
    evidence: AuditReferenceSchema,
  })
  .strict();

const PolicyExceptionBaseSchema = z
  .object({
    schemaId: z.literal(POLICY_EXCEPTION_SCHEMA.id),
    schemaVersion: z.string().refine((value) => parseSchemaVersion(value) !== null),
    exceptionId: z.string().regex(UUID_URN),
    scope: ExceptionScopeSchema,
    owner: OwnerSchema,
    requestedBy: ActorSchema,
    reason: TextSchema,
    compensatingControls: z.array(CompensatingControlSchema).min(1).max(16),
    reversalTriggers: z.array(TextSchema).min(1).max(16),
    requestedAt: TimestampSchema,
    effectiveFrom: TimestampSchema,
    expiresAt: TimestampSchema,
    limitations: z.array(TextSchema).min(1).max(32),
  })
  .strict();

export type PolicyExceptionDocument = z.infer<typeof PolicyExceptionBaseSchema>;
export const PolicyExceptionDocumentSchema = PolicyExceptionBaseSchema.superRefine(
  (value, context) => {
    if (Date.parse(value.effectiveFrom) < Date.parse(value.requestedAt)) {
      issue(context, ["effectiveFrom"], "effectiveFrom precedes requestedAt");
    }
    if (Date.parse(value.expiresAt) <= Date.parse(value.effectiveFrom)) {
      issue(context, ["expiresAt"], "expiresAt must be later than effectiveFrom");
    }
  },
);

const ExceptionApprovalBaseSchema = z
  .object({
    schemaId: z.literal(EXCEPTION_APPROVAL_SCHEMA.id),
    schemaVersion: z.string().refine((value) => parseSchemaVersion(value) !== null),
    approvalId: z.string().regex(UUID_URN),
    target: z
      .object({
        exceptionId: z.string().regex(UUID_URN),
        requestDigest: ContentDigestSchema,
      })
      .strict(),
    decision: z.enum(["approved", "denied"]),
    approver: HumanApproverSchema,
    rationale: TextSchema,
    decidedAt: TimestampSchema,
    validUntil: TimestampSchema.optional(),
    auditReference: AuditReferenceSchema,
  })
  .strict();

export type ExceptionApprovalDocument = z.infer<typeof ExceptionApprovalBaseSchema>;
export const ExceptionApprovalDocumentSchema = ExceptionApprovalBaseSchema.superRefine(
  (value, context) => {
    if (value.decision === "approved" && !value.validUntil) {
      issue(context, ["validUntil"], "approved exceptions require a bounded approval expiry");
    }
    if (value.decision === "denied" && value.validUntil) {
      issue(context, ["validUntil"], "denied approvals cannot grant a validity window");
    }
    if (value.validUntil && Date.parse(value.validUntil) <= Date.parse(value.decidedAt)) {
      issue(context, ["validUntil"], "validUntil must be later than decidedAt");
    }
  },
);

export interface PolicyExceptionValidationIssue {
  readonly path: string;
  readonly code: string;
  readonly message: string;
}

export class PolicyExceptionValidationError extends Error {
  override readonly name = "PolicyExceptionValidationError";

  constructor(readonly issues: readonly PolicyExceptionValidationIssue[]) {
    super(`Policy exception validation failed with ${issues.length} issue${issues.length === 1 ? "" : "s"}.`);
  }
}

export class ExceptionApprovalValidationError extends Error {
  override readonly name = "ExceptionApprovalValidationError";

  constructor(readonly issues: readonly PolicyExceptionValidationIssue[]) {
    super(`Exception approval validation failed with ${issues.length} issue${issues.length === 1 ? "" : "s"}.`);
  }
}

export function parsePolicyException(value: unknown): PolicyExceptionDocument {
  return parseContract(
    PolicyExceptionDocumentSchema,
    value,
    POLICY_EXCEPTION_SCHEMA,
    "policy exception",
    PolicyExceptionValidationError,
  );
}

export function parsePolicyExceptionJson(
  input: string | Uint8Array,
  options: ParseJsonOptions = {},
): PolicyExceptionDocument {
  const parsed = parseVersionedJson<Record<string, unknown>>(input, {
    ...options,
    expectedSchema: POLICY_EXCEPTION_SCHEMA,
  });
  return parsePolicyException(parsed.document);
}

export function parseExceptionApproval(value: unknown): ExceptionApprovalDocument {
  return parseContract(
    ExceptionApprovalDocumentSchema,
    value,
    EXCEPTION_APPROVAL_SCHEMA,
    "exception approval",
    ExceptionApprovalValidationError,
  );
}

export function parseExceptionApprovalJson(
  input: string | Uint8Array,
  options: ParseJsonOptions = {},
): ExceptionApprovalDocument {
  const parsed = parseVersionedJson<Record<string, unknown>>(input, {
    ...options,
    expectedSchema: EXCEPTION_APPROVAL_SCHEMA,
  });
  return parseExceptionApproval(parsed.document);
}

export function digestPolicyException(value: PolicyExceptionDocument): ContentDigest {
  const exception = parsePolicyException(value);
  return {
    algorithm: "sha256",
    value: createHash("sha256").update(canonicalizeJson(exception), "utf8").digest("hex"),
  };
}

export type PolicyExceptionApplicabilityReason =
  | "applicable"
  | "approval-denied"
  | "target-mismatch"
  | "decision-before-request"
  | "decision-after-exception-expiry"
  | "approval-outlives-exception"
  | "not-yet-effective"
  | "expired"
  | "approval-expired"
  | "subject-mismatch"
  | "observation-out-of-scope";

export interface PolicyExceptionApplicability {
  readonly applicable: boolean;
  readonly reason: PolicyExceptionApplicabilityReason;
}

export function evaluatePolicyException(
  exceptionValue: PolicyExceptionDocument,
  approvalValue: ExceptionApprovalDocument,
  input: { readonly subjectId: string; readonly observationId: string; readonly at: string },
): PolicyExceptionApplicability {
  const exception = parsePolicyException(exceptionValue);
  const approval = parseExceptionApproval(approvalValue);
  let at: string; try { SubjectIdSchema.parse(input.subjectId); ObservationIdSchema.parse(input.observationId); at = TimestampSchema.parse(input.at); } catch { throw new PolicyExceptionValidationError([{ path: "input", code: "invalid", message: "exception applicability input is invalid" }]); }
  const requestDigest = digestPolicyException(exception);

  if (
    approval.target.exceptionId !== exception.exceptionId ||
    approval.target.requestDigest.algorithm !== requestDigest.algorithm ||
    approval.target.requestDigest.value !== requestDigest.value
  ) {
    return { applicable: false, reason: "target-mismatch" };
  }
  if (Date.parse(approval.decidedAt) < Date.parse(exception.requestedAt)) {
    return { applicable: false, reason: "decision-before-request" };
  }
  if (Date.parse(approval.decidedAt) >= Date.parse(exception.expiresAt)) {
    return { applicable: false, reason: "decision-after-exception-expiry" };
  }
  if (approval.decision === "denied") {
    return { applicable: false, reason: "approval-denied" };
  }
  if (Date.parse(approval.validUntil!) > Date.parse(exception.expiresAt)) {
    return { applicable: false, reason: "approval-outlives-exception" };
  }
  if (Date.parse(at) < Date.parse(exception.effectiveFrom)) {
    return { applicable: false, reason: "not-yet-effective" };
  }
  if (Date.parse(at) >= Date.parse(exception.expiresAt)) {
    return { applicable: false, reason: "expired" };
  }
  if (Date.parse(at) >= Date.parse(approval.validUntil!)) {
    return { applicable: false, reason: "approval-expired" };
  }
  if (input.subjectId !== exception.scope.subjectId) {
    return { applicable: false, reason: "subject-mismatch" };
  }
  if (!exception.scope.observationIds.includes(input.observationId)) {
    return { applicable: false, reason: "observation-out-of-scope" };
  }
  return { applicable: true, reason: "applicable" };
}

function parseContract<T>(
  schema: z.ZodType<T>,
  value: unknown,
  descriptor: SchemaDescriptor,
  label: string,
  ErrorType: new (issues: readonly PolicyExceptionValidationIssue[]) => Error,
): T {
  const parsed = schema.safeParse(value);
  if (!parsed.success) {
    throw new ErrorType(
      parsed.error.issues.map((entry) => ({
        path: entry.path.join("."),
        code: entry.code,
        message:
          entry.code === z.ZodIssueCode.unrecognized_keys
            ? "object contains unsupported properties"
            : entry.message,
      })),
    );
  }
  const document = parsed.data as T & { schemaVersion: string };
  const compatibility = classifySchemaCompatibility(document.schemaVersion, descriptor.version);
  if (compatibility === "upgrade-required" || compatibility === "incompatible") {
    throw new ErrorType([
      {
        path: "schemaVersion",
        code: compatibility,
        message:
          compatibility === "upgrade-required"
            ? `Upgrade to a reader supporting ${label} schema ${document.schemaVersion}.`
            : `Use an explicit reader or migration for ${label} schema ${document.schemaVersion}.`,
      },
    ]);
  }
  return parsed.data;
}

function issue(context: z.RefinementCtx, path: Array<string | number>, message: string): void {
  context.addIssue({ code: z.ZodIssueCode.custom, path, message });
}
