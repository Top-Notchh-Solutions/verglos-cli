import { z } from "zod";
import { StableContractIdSchema } from "./engine.js";
import { ObservationIdSchema } from "./observation.js";
import {
  VERGLOS_SCHEMA_IDS,
  classifySchemaCompatibility,
  parseSchemaVersion,
  parseVersionedJson,
  type ParseJsonOptions,
  type SchemaDescriptor,
} from "./schema.js";
import { ContentDigestSchema, SubjectIdSchema } from "./subject.js";

export const POLICY_EVALUATION_SCHEMA = {
  id: VERGLOS_SCHEMA_IDS.policyEvaluation,
  version: "1.0.0",
} as const satisfies SchemaDescriptor;

export const POLICY_DECISION_EXIT_CODES = Object.freeze({
  PASS: 0,
  BLOCK: 1,
  REVIEW: 2,
  INCOMPLETE: 3,
} as const);

const UUID_URN = /^urn:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const SAFE_TEXT = /^[^\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]+$/;
const ShortTextSchema = z.string().min(1).max(512).regex(SAFE_TEXT);
const TextSchema = z.string().min(1).max(4096).regex(SAFE_TEXT);
const TimestampSchema = z.string().datetime({ offset: true });

const SubjectMatchSchema = z
  .object({
    status: z.enum(["matched", "mismatched", "unresolved"]),
    observedSubjectId: SubjectIdSchema.optional(),
    reason: TextSchema.optional(),
  })
  .strict();

const FreshnessSchema = z
  .object({
    status: z.enum(["current", "stale", "unknown"]),
    checkedAt: TimestampSchema,
    sourceUpdatedAt: TimestampSchema.optional(),
    validUntil: TimestampSchema.optional(),
  })
  .strict();

const PolicyCheckSchema = z
  .object({
    id: StableContractIdSchema,
    requirement: z.enum(["required", "advisory"]),
    onFailure: z.enum(["BLOCK", "REVIEW"]),
    status: z.enum(["satisfied", "failed", "missing", "stale", "unsupported", "error"]),
    evidenceDigests: z.array(ContentDigestSchema).max(64),
    observationIds: z.array(ObservationIdSchema).max(100),
    freshness: FreshnessSchema,
    owner: ShortTextSchema,
    reason: TextSchema,
    nextAction: TextSchema,
  })
  .strict()
  .superRefine((value, context) => {
    if (value.requirement === "advisory" && value.onFailure !== "REVIEW") {
      issue(context, ["onFailure"], "advisory checks cannot directly block a decision");
    }
    if (new Set(value.observationIds).size !== value.observationIds.length) {
      issue(context, ["observationIds"], "check cannot repeat observation IDs");
    }
    const hasEvidence = value.evidenceDigests.length > 0;
    if (["satisfied", "failed", "stale"].includes(value.status) && !hasEvidence) {
      issue(context, ["evidenceDigests"], `${value.status} checks require evidence`);
    }
    if (["missing", "unsupported"].includes(value.status) && hasEvidence) {
      issue(context, ["evidenceDigests"], `${value.status} checks cannot claim evidence`);
    }
    if (["satisfied", "failed"].includes(value.status) && value.freshness.status !== "current") {
      issue(context, ["freshness", "status"], `${value.status} checks require current evidence`);
    }
    if (value.status === "stale" && value.freshness.status !== "stale") {
      issue(context, ["freshness", "status"], "stale checks require stale freshness");
    }
    if (["missing", "unsupported", "error"].includes(value.status) && value.freshness.status !== "unknown") {
      issue(context, ["freshness", "status"], `${value.status} checks require unknown freshness`);
    }
  });

const EvaluationReasonSchema = z
  .object({
    code: z.enum([
      "identity-mismatch",
      "identity-unresolved",
      "required-check-missing",
      "required-check-stale",
      "required-check-unsupported",
      "required-check-error",
      "check-failed-block",
      "check-failed-review",
      "advisory-check-unavailable",
      "requirements-satisfied",
    ]),
    checkId: StableContractIdSchema.optional(),
    detail: TextSchema,
    owner: ShortTextSchema,
    nextAction: TextSchema,
  })
  .strict();

const PolicyEvaluationInputBaseSchema = z
  .object({
    schemaId: z.literal(POLICY_EVALUATION_SCHEMA.id),
    schemaVersion: z.string().refine((value) => parseSchemaVersion(value) !== null),
    evaluationId: z.string().regex(UUID_URN),
    policy: z
      .object({
        id: StableContractIdSchema,
        version: z.string().refine((value) => parseSchemaVersion(value) !== null),
        digest: ContentDigestSchema,
      })
      .strict(),
    subjectId: SubjectIdSchema,
    subjectMatch: SubjectMatchSchema,
    evaluatedAt: TimestampSchema,
    checks: z.array(PolicyCheckSchema).min(1).max(256),
    limitations: z.array(TextSchema).min(1).max(32),
  })
  .strict();

export type PolicyEvaluationInput = z.infer<typeof PolicyEvaluationInputBaseSchema>;
const PolicyEvaluationInputSchema = PolicyEvaluationInputBaseSchema.superRefine(
  refineEvaluationInput,
);

const PolicyEvaluationBaseSchema = PolicyEvaluationInputBaseSchema.extend({
  decision: z.enum(["PASS", "REVIEW", "BLOCK", "INCOMPLETE"]),
  exitCode: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
  reasons: z.array(EvaluationReasonSchema).min(1).max(257),
}).strict();

export type PolicyEvaluationDocument = z.infer<typeof PolicyEvaluationBaseSchema>;
export const PolicyEvaluationDocumentSchema = PolicyEvaluationBaseSchema.superRefine(
  (value, context) => {
    refineEvaluationInput(value, context);
    const expected = deriveDecision(value);
    if (value.decision !== expected.decision) {
      issue(context, ["decision"], `decision must be ${expected.decision} for the recorded facts`);
    }
    if (value.exitCode !== expected.exitCode) {
      issue(context, ["exitCode"], `exitCode must be ${expected.exitCode} for ${expected.decision}`);
    }
    if (JSON.stringify(value.reasons) !== JSON.stringify(expected.reasons)) {
      issue(context, ["reasons"], "reasons must equal the deterministic ordered reasons for the recorded facts");
    }
  },
);

export interface PolicyEvaluationValidationIssue {
  readonly path: string;
  readonly code: string;
  readonly message: string;
}

export class PolicyEvaluationValidationError extends Error {
  override readonly name = "PolicyEvaluationValidationError";

  constructor(readonly issues: readonly PolicyEvaluationValidationIssue[]) {
    super(`Policy evaluation validation failed with ${issues.length} issue${issues.length === 1 ? "" : "s"}.`);
  }
}

export function createPolicyEvaluation(input: PolicyEvaluationInput): PolicyEvaluationDocument {
  const parsed = parseInput(input);
  const derived = deriveDecision(parsed);
  return parsePolicyEvaluation({ ...parsed, ...derived });
}

export function parsePolicyEvaluation(value: unknown): PolicyEvaluationDocument {
  const parsed = PolicyEvaluationDocumentSchema.safeParse(value);
  if (!parsed.success) throwValidation(parsed.error.issues);
  assertCompatible(parsed.data.schemaVersion);
  return parsed.data;
}

export function parsePolicyEvaluationJson(
  input: string | Uint8Array,
  options: ParseJsonOptions = {},
): PolicyEvaluationDocument {
  const parsed = parseVersionedJson<Record<string, unknown>>(input, {
    ...options,
    expectedSchema: POLICY_EVALUATION_SCHEMA,
  });
  return parsePolicyEvaluation(parsed.document);
}

export function policyDecisionExitCode(
  decision: keyof typeof POLICY_DECISION_EXIT_CODES,
): 0 | 1 | 2 | 3 {
  return POLICY_DECISION_EXIT_CODES[decision];
}

function parseInput(value: unknown): PolicyEvaluationInput {
  const parsed = PolicyEvaluationInputSchema.safeParse(value);
  if (!parsed.success) throwValidation(parsed.error.issues);
  assertCompatible(parsed.data.schemaVersion);
  return parsed.data;
}

function refineEvaluationInput(
  value: PolicyEvaluationInput,
  context: z.RefinementCtx,
): void {
  const observed = value.subjectMatch.observedSubjectId;
  if (value.subjectMatch.status === "matched" && observed !== value.subjectId) {
    issue(context, ["subjectMatch", "observedSubjectId"], "matched identity must equal subjectId");
  }
  if (value.subjectMatch.status === "mismatched" && (!observed || observed === value.subjectId)) {
    issue(context, ["subjectMatch", "observedSubjectId"], "mismatched identity requires a different observed subject");
  }
  if (value.subjectMatch.status === "unresolved" && observed) {
    issue(context, ["subjectMatch", "observedSubjectId"], "unresolved identity cannot claim an observed subject");
  }
  if (value.subjectMatch.status !== "matched" && !value.subjectMatch.reason) {
    issue(context, ["subjectMatch", "reason"], "non-matching identity requires a reason");
  }
  if (new Set(value.checks.map((check) => check.id)).size !== value.checks.length) {
    issue(context, ["checks"], "policy check IDs must be unique");
  }
  value.checks.forEach((check, index) => {
    const evaluatedAt = Date.parse(value.evaluatedAt);
    const checkedAt = Date.parse(check.freshness.checkedAt);
    const validUntil = check.freshness.validUntil
      ? Date.parse(check.freshness.validUntil)
      : undefined;
    if (checkedAt > evaluatedAt) {
      issue(context, ["checks", index, "freshness", "checkedAt"], "freshness check occurs after evaluation");
    }
    if (
      check.freshness.sourceUpdatedAt &&
      Date.parse(check.freshness.sourceUpdatedAt) > checkedAt
    ) {
      issue(context, ["checks", index, "freshness", "sourceUpdatedAt"], "source update occurs after freshness check");
    }
    if (check.freshness.status === "current" && (validUntil === undefined || validUntil <= evaluatedAt)) {
      issue(context, ["checks", index, "freshness", "validUntil"], "current evidence requires a future validity boundary");
    }
    if (check.freshness.status === "stale" && (validUntil === undefined || validUntil > evaluatedAt)) {
      issue(context, ["checks", index, "freshness", "validUntil"], "stale evidence requires an elapsed validity boundary");
    }
    if (check.freshness.status === "unknown" && validUntil !== undefined) {
      issue(context, ["checks", index, "freshness", "validUntil"], "unknown freshness cannot claim a validity boundary");
    }
  });
}

function deriveDecision(value: PolicyEvaluationInput): Pick<PolicyEvaluationDocument, "decision" | "exitCode" | "reasons"> {
  const reasons: PolicyEvaluationDocument["reasons"] = [];
  let incomplete = false;
  let block = false;
  let review = false;

  if (value.subjectMatch.status === "mismatched") {
    incomplete = true;
    reasons.push(identityReason("identity-mismatch", value.subjectMatch.reason!));
  } else if (value.subjectMatch.status === "unresolved") {
    incomplete = true;
    reasons.push(identityReason("identity-unresolved", value.subjectMatch.reason!));
  }

  const checks = [...value.checks].sort((left, right) =>
    left.id < right.id ? -1 : left.id > right.id ? 1 : 0,
  );
  for (const check of checks) {
    if (check.status === "failed") {
      if (check.onFailure === "BLOCK") block = true;
      else review = true;
      reasons.push(checkReason(check.onFailure === "BLOCK" ? "check-failed-block" : "check-failed-review", check));
      continue;
    }
    if (["missing", "stale", "unsupported", "error"].includes(check.status)) {
      if (check.requirement === "required") {
        incomplete = true;
        reasons.push(checkReason(`required-check-${check.status}` as Extract<PolicyEvaluationDocument["reasons"][number]["code"], `required-check-${string}`>, check));
      } else {
        review = true;
        reasons.push(checkReason("advisory-check-unavailable", check));
      }
    }
  }

  if (reasons.length === 0) {
    reasons.push({
      code: "requirements-satisfied",
      detail: "All recorded policy checks are satisfied with current evidence for the exact subject.",
      owner: "policy-owner",
      nextAction: "Preserve the evaluation and its evidence bindings.",
    });
  }

  const decision = incomplete ? "INCOMPLETE" : block ? "BLOCK" : review ? "REVIEW" : "PASS";
  return { decision, exitCode: policyDecisionExitCode(decision), reasons };
}

function identityReason(
  code: "identity-mismatch" | "identity-unresolved",
  detail: string,
): PolicyEvaluationDocument["reasons"][number] {
  return {
    code,
    detail,
    owner: "target-owner",
    nextAction: "Resolve and evaluate the exact immutable subject before making a release decision.",
  };
}

function checkReason(
  code: PolicyEvaluationDocument["reasons"][number]["code"],
  check: PolicyEvaluationInput["checks"][number],
): PolicyEvaluationDocument["reasons"][number] {
  return {
    code,
    checkId: check.id,
    detail: check.reason,
    owner: check.owner,
    nextAction: check.nextAction,
  };
}

function assertCompatible(version: string): void {
  const compatibility = classifySchemaCompatibility(version, POLICY_EVALUATION_SCHEMA.version);
  if (compatibility === "upgrade-required" || compatibility === "incompatible") {
    throw new PolicyEvaluationValidationError([
      {
        path: "schemaVersion",
        code: compatibility,
        message:
          compatibility === "upgrade-required"
            ? `Upgrade to a reader supporting policy-evaluation schema ${version}.`
            : `Use an explicit reader or migration for policy-evaluation schema ${version}.`,
      },
    ]);
  }
}

function throwValidation(entries: readonly z.ZodIssue[]): never {
  throw new PolicyEvaluationValidationError(
    entries.map((entry) => ({
      path: entry.path.join("."),
      code: entry.code,
      message:
        entry.code === z.ZodIssueCode.unrecognized_keys
          ? "object contains unsupported properties"
          : entry.message,
    })),
  );
}

function issue(context: z.RefinementCtx, path: Array<string | number>, message: string): void {
  context.addIssue({ code: z.ZodIssueCode.custom, path, message });
}
