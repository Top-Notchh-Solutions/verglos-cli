import { createHash } from "node:crypto";
import { z } from "zod";
import { StableContractIdSchema } from "./engine.js";
import {
  POLICY_EVALUATION_SCHEMA,
  parsePolicyEvaluation,
  type PolicyEvaluationDocument,
} from "./policy-evaluation.js";
import {
  VERGLOS_SCHEMA_IDS,
  canonicalizeJson,
  classifySchemaCompatibility,
  parseSchemaVersion,
  parseVersionedJson,
  type ParseJsonOptions,
  type SchemaDescriptor,
} from "./schema.js";
import { ContentDigestSchema, SubjectIdSchema } from "./subject.js";

export const RELEASE_DECISION_SCHEMA = {
  id: VERGLOS_SCHEMA_IDS.releaseDecision,
  version: "1.0.0",
} as const satisfies SchemaDescriptor;

const UUID_URN = /^urn:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const SAFE_TEXT = /^[^\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]+$/;
const ShortTextSchema = z.string().min(1).max(512).regex(SAFE_TEXT);
const TextSchema = z.string().min(1).max(4096).regex(SAFE_TEXT);
const TimestampSchema = z.string().datetime({ offset: true });

const SubjectBindingSchema = z
  .object({
    subjectId: SubjectIdSchema,
    role: z.enum(["primary", "source", "artifact", "image", "sbom", "supporting"]),
  })
  .strict();

const ApprovalReferenceSchema = z
  .object({
    kind: z.enum(["exception", "release"]),
    approvalId: z.string().regex(UUID_URN),
    digest: ContentDigestSchema,
    approverId: ShortTextSchema,
    authority: ShortTextSchema,
    decidedAt: TimestampSchema,
    validUntil: TimestampSchema.optional(),
  })
  .strict();

const ReleaseDecisionBaseSchema = z
  .object({
    schemaId: z.literal(RELEASE_DECISION_SCHEMA.id),
    schemaVersion: z.string().refine((value) => parseSchemaVersion(value) !== null),
    decisionId: z.string().regex(UUID_URN),
    decision: z.enum(["PASS", "REVIEW", "BLOCK", "INCOMPLETE"]),
    subjects: z.array(SubjectBindingSchema).min(1).max(64),
    policy: z
      .object({
        id: StableContractIdSchema,
        version: z.string().refine((value) => parseSchemaVersion(value) !== null),
        digest: ContentDigestSchema,
      })
      .strict(),
    evaluation: z
      .object({
        schemaId: z.literal(POLICY_EVALUATION_SCHEMA.id),
        evaluationId: z.string().regex(UUID_URN),
        digest: ContentDigestSchema,
        subjectId: SubjectIdSchema,
        decision: z.enum(["PASS", "REVIEW", "BLOCK", "INCOMPLETE"]),
        policy: z
          .object({
            id: StableContractIdSchema,
            version: z.string().refine((value) => parseSchemaVersion(value) !== null),
            digest: ContentDigestSchema,
          })
          .strict(),
        evaluatedAt: TimestampSchema,
      })
      .strict(),
    approvals: z.array(ApprovalReferenceSchema).max(64),
    issuedBy: z
      .object({
        kind: z.enum(["person", "service"]),
        id: ShortTextSchema,
        authority: ShortTextSchema,
      })
      .strict(),
    generatedAt: TimestampSchema,
    limitations: z.array(TextSchema).min(1).max(32),
  })
  .strict();

export type ReleaseDecisionDocument = z.infer<typeof ReleaseDecisionBaseSchema>;
export const ReleaseDecisionDocumentSchema = ReleaseDecisionBaseSchema.superRefine(
  refineReleaseDecision,
);

export interface ReleaseDecisionValidationIssue {
  readonly path: string;
  readonly code: string;
  readonly message: string;
}

export class ReleaseDecisionValidationError extends Error {
  override readonly name = "ReleaseDecisionValidationError";

  constructor(readonly issues: readonly ReleaseDecisionValidationIssue[]) {
    super(`Release decision validation failed with ${issues.length} issue${issues.length === 1 ? "" : "s"}.`);
  }
}

export interface CreateReleaseDecisionInput {
  readonly decisionId: string;
  readonly evaluation: PolicyEvaluationDocument;
  readonly subjects: ReleaseDecisionDocument["subjects"];
  readonly approvals?: ReleaseDecisionDocument["approvals"];
  readonly issuedBy: ReleaseDecisionDocument["issuedBy"];
  readonly generatedAt: string;
  readonly limitations: string[];
}

export function createReleaseDecision(
  input: CreateReleaseDecisionInput,
): ReleaseDecisionDocument {
  const evaluation = parsePolicyEvaluation(input.evaluation);
  const digest = {
    algorithm: "sha256" as const,
    value: createHash("sha256")
      .update(canonicalizeJson(evaluation), "utf8")
      .digest("hex"),
  };
  return parseReleaseDecision({
    schemaId: RELEASE_DECISION_SCHEMA.id,
    schemaVersion: RELEASE_DECISION_SCHEMA.version,
    decisionId: input.decisionId,
    decision: evaluation.decision,
    subjects: input.subjects,
    policy: evaluation.policy,
    evaluation: {
      schemaId: POLICY_EVALUATION_SCHEMA.id,
      evaluationId: evaluation.evaluationId,
      digest,
      subjectId: evaluation.subjectId,
      decision: evaluation.decision,
      policy: evaluation.policy,
      evaluatedAt: evaluation.evaluatedAt,
    },
    approvals: input.approvals ?? [],
    issuedBy: input.issuedBy,
    generatedAt: input.generatedAt,
    limitations: input.limitations,
  });
}

export function parseReleaseDecision(value: unknown): ReleaseDecisionDocument {
  const parsed = ReleaseDecisionDocumentSchema.safeParse(value);
  if (!parsed.success) {
    throw new ReleaseDecisionValidationError(
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
  const compatibility = classifySchemaCompatibility(
    parsed.data.schemaVersion,
    RELEASE_DECISION_SCHEMA.version,
  );
  if (compatibility === "upgrade-required" || compatibility === "incompatible") {
    throw new ReleaseDecisionValidationError([
      {
        path: "schemaVersion",
        code: compatibility,
        message:
          compatibility === "upgrade-required"
            ? `Upgrade to a reader supporting release-decision schema ${parsed.data.schemaVersion}.`
            : `Use an explicit reader or migration for release-decision schema ${parsed.data.schemaVersion}.`,
      },
    ]);
  }
  return parsed.data;
}

export function parseReleaseDecisionJson(
  input: string | Uint8Array,
  options: ParseJsonOptions = {},
): ReleaseDecisionDocument {
  const parsed = parseVersionedJson<Record<string, unknown>>(input, {
    ...options,
    expectedSchema: RELEASE_DECISION_SCHEMA,
  });
  return parseReleaseDecision(parsed.document);
}

function refineReleaseDecision(
  value: ReleaseDecisionDocument,
  context: z.RefinementCtx,
): void {
  const primary = value.subjects.filter((subject) => subject.role === "primary");
  if (primary.length !== 1) {
    issue(context, ["subjects"], "release decisions require exactly one primary subject");
  } else if (primary[0]!.subjectId !== value.evaluation.subjectId) {
    issue(context, ["evaluation", "subjectId"], "evaluation subject must equal the primary release subject");
  }
  if (new Set(value.subjects.map((subject) => subject.subjectId)).size !== value.subjects.length) {
    issue(context, ["subjects"], "release subject IDs must be unique");
  }
  if (new Set(value.approvals.map((approval) => approval.approvalId)).size !== value.approvals.length) {
    issue(context, ["approvals"], "approval IDs must be unique");
  }
  if (value.decision !== value.evaluation.decision) {
    issue(context, ["decision"], "release decision must preserve the policy-evaluation decision");
  }
  if (JSON.stringify(value.policy) !== JSON.stringify(value.evaluation.policy)) {
    issue(context, ["policy"], "release policy must equal the policy bound by the evaluation");
  }
  if (Date.parse(value.generatedAt) < Date.parse(value.evaluation.evaluatedAt)) {
    issue(context, ["generatedAt"], "release decision cannot precede its evaluation");
  }
  value.approvals.forEach((approval, index) => {
    if (Date.parse(approval.decidedAt) > Date.parse(value.generatedAt)) {
      issue(context, ["approvals", index, "decidedAt"], "approval cannot occur after decision generation");
    }
    if (approval.validUntil && Date.parse(approval.validUntil) <= Date.parse(value.generatedAt)) {
      issue(context, ["approvals", index, "validUntil"], "expired approval cannot bind a release decision");
    }
  });
}

function issue(context: z.RefinementCtx, path: Array<string | number>, message: string): void {
  context.addIssue({ code: z.ZodIssueCode.custom, path, message });
}
