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

export const VERIFICATION_ATTEMPT_SCHEMA = {
  id: VERGLOS_SCHEMA_IDS.verificationAttempt,
  version: "1.0.0",
} as const satisfies SchemaDescriptor;

const UUID_URN = /^urn:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const SAFE_TEXT = /^[^\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]+$/;
const ShortTextSchema = z.string().min(1).max(512).regex(SAFE_TEXT);
const TextSchema = z.string().min(1).max(4096).regex(SAFE_TEXT);
const TimestampSchema = z.string().datetime({ offset: true });
const NetworkDestinationSchema = z
  .string()
  .url()
  .max(2048)
  .refine(
    isSafeNetworkOrigin,
    "network destination must be an HTTPS origin without credentials, path, query, or fragment",
  );

const RecipeSchema = z
  .object({
    id: StableContractIdSchema,
    version: z.string().refine((value) => parseSchemaVersion(value) !== null),
    digest: ContentDigestSchema,
    signatureStatus: z.enum(["verified", "invalid", "unverified"]),
    signer: ShortTextSchema.optional(),
    trustPolicyDigest: ContentDigestSchema.optional(),
  })
  .strict()
  .superRefine((value, context) => {
    if (
      value.signatureStatus === "verified" &&
      (!value.signer || !value.trustPolicyDigest)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["signatureStatus"],
        message: "verified recipes require signer and trust-policy digest",
      });
    }
  });

const ApprovalSchema = z
  .object({
    required: z.boolean(),
    status: z.enum(["not-required", "approved", "denied", "not-requested"]),
    actor: ShortTextSchema.optional(),
    approvedAt: TimestampSchema.optional(),
  })
  .strict()
  .superRefine((value, context) => {
    if (value.status === "approved" && (!value.actor || !value.approvedAt)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["status"],
        message: "approved execution requires actor and timestamp",
      });
    }
    if (!value.required && value.status !== "not-required") {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["status"],
        message: "approval status must be not-required when approval is not required",
      });
    }
  });

const SandboxSchema = z
  .object({
    isolation: z.enum([
      "none",
      "restricted-process",
      "container",
      "gvisor",
      "microvm",
    ]),
    runtime: ShortTextSchema,
    runtimeDigest: ContentDigestSchema.optional(),
    filesystem: z.enum(["read-only", "ephemeral-write"]),
    network: z
      .object({
        mode: z.enum(["denied", "allowlist"]),
        destinations: z.array(NetworkDestinationSchema).max(64),
      })
      .strict()
      .superRefine((value, context) => {
        if (value.mode === "denied" && value.destinations.length > 0) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["destinations"],
            message: "denied network mode cannot include destinations",
          });
        }
        if (value.mode === "allowlist" && value.destinations.length === 0) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["destinations"],
            message: "allowlist network mode requires destinations",
          });
        }
      }),
    nonRoot: z.boolean(),
    cleanup: z.enum(["not-started", "succeeded", "failed"]),
  })
  .strict();

export const VerificationLimitsSchema = z
  .object({
    timeoutMs: z.number().int().positive().safe(),
    cpuMs: z.number().int().positive().safe(),
    memoryBytes: z.number().int().positive().safe(),
    diskBytes: z.number().int().nonnegative().safe(),
    maxProcesses: z.number().int().positive().safe(),
    maxOutputBytes: z.number().int().positive().safe(),
    maxNetworkRequests: z.number().int().nonnegative().safe(),
  })
  .strict();

const ResourceUsageSchema = z
  .object({
    durationMs: z.number().int().nonnegative().safe(),
    cpuMs: z.number().int().nonnegative().safe(),
    peakMemoryBytes: z.number().int().nonnegative().safe(),
    diskBytes: z.number().int().nonnegative().safe(),
    processes: z.number().int().nonnegative().safe(),
    outputBytes: z.number().int().nonnegative().safe(),
    networkRequests: z.number().int().nonnegative().safe(),
  })
  .strict();

const OutputStreamSchema = z
  .object({
    digest: ContentDigestSchema,
    size: z.number().int().nonnegative().safe(),
    truncated: z.boolean(),
    redaction: z.enum(["not-needed", "applied"]),
  })
  .strict();

const OutputSchema = z
  .object({
    evidenceDigest: ContentDigestSchema.optional(),
    stdout: OutputStreamSchema.optional(),
    stderr: OutputStreamSchema.optional(),
    artifacts: z
      .array(
        z
          .object({
            name: ShortTextSchema,
            digest: ContentDigestSchema,
            size: z.number().int().nonnegative().safe(),
            mediaType: ShortTextSchema,
            redaction: z.enum(["not-needed", "applied"]),
          })
          .strict(),
      )
      .max(64),
  })
  .strict();

const AttemptBaseSchema = z
  .object({
    schemaId: z.literal(VERIFICATION_ATTEMPT_SCHEMA.id),
    schemaVersion: z.string().refine((value) => parseSchemaVersion(value) !== null),
    attemptId: z.string().regex(UUID_URN),
    subjectId: SubjectIdSchema,
    observationId: ObservationIdSchema,
    recipe: RecipeSchema,
    approval: ApprovalSchema,
    sandbox: SandboxSchema,
    inputDigest: ContentDigestSchema,
    parameterDigest: ContentDigestSchema,
    secretInputs: z.enum(["none", "ephemeral"]),
    limits: VerificationLimitsSchema,
    executed: z.boolean(),
    startedAt: TimestampSchema.optional(),
    completedAt: TimestampSchema,
    usage: ResourceUsageSchema,
    output: OutputSchema,
    verdict: z.enum([
      "confirmed",
      "not_reproduced",
      "inconclusive",
      "not_supported",
      "environment_error",
      "policy_denied",
    ]),
    reason: TextSchema,
    limitations: z.array(TextSchema).min(1).max(32),
  })
  .strict();

export type VerificationAttemptDocument = z.infer<typeof AttemptBaseSchema>;
export const VerificationAttemptDocumentSchema = AttemptBaseSchema.superRefine(
  refineAttempt,
);

export class VerificationAttemptValidationError extends Error {
  override readonly name = "VerificationAttemptValidationError";

  constructor(readonly issues: readonly { path: string; code: string; message: string }[]) {
    super(`Verification attempt validation failed with ${issues.length} issue${issues.length === 1 ? "" : "s"}.`);
  }
}

export function parseVerificationAttempt(value: unknown): VerificationAttemptDocument {
  const parsed = VerificationAttemptDocumentSchema.safeParse(value);
  if (!parsed.success) {
    throw new VerificationAttemptValidationError(
      parsed.error.issues.map((issue) => ({
        path: issue.path.join("."),
        code: issue.code,
        message:
          issue.code === z.ZodIssueCode.unrecognized_keys
            ? "object contains unsupported properties"
            : issue.message,
      })),
    );
  }
  const compatibility = classifySchemaCompatibility(
    parsed.data.schemaVersion,
    VERIFICATION_ATTEMPT_SCHEMA.version,
  );
  if (compatibility === "upgrade-required" || compatibility === "incompatible") {
    throw new VerificationAttemptValidationError([
      {
        path: "schemaVersion",
        code: compatibility,
        message:
          compatibility === "upgrade-required"
            ? `Upgrade to a reader supporting verification-attempt schema ${parsed.data.schemaVersion}.`
            : `Use an explicit reader or migration for verification-attempt schema ${parsed.data.schemaVersion}.`,
      },
    ]);
  }
  return parsed.data;
}

export function parseVerificationAttemptJson(
  input: string | Uint8Array,
  options: ParseJsonOptions = {},
): VerificationAttemptDocument {
  const parsed = parseVersionedJson<Record<string, unknown>>(input, {
    ...options,
    expectedSchema: VERIFICATION_ATTEMPT_SCHEMA,
  });
  return parseVerificationAttempt(parsed.document);
}

function refineAttempt(
  value: VerificationAttemptDocument,
  context: z.RefinementCtx,
): void {
  const zeroUsage = Object.values(value.usage).every((item) => item === 0);
  const hasOutput =
    value.output.evidenceDigest !== undefined ||
    value.output.stdout !== undefined ||
    value.output.stderr !== undefined ||
    value.output.artifacts.length > 0;

  if (value.executed) {
    if (!value.startedAt) {
      issue(context, ["startedAt"], "executed attempts require startedAt");
    }
    if (!(["approved", "not-required"] as const).includes(value.approval.status as "approved" | "not-required")) {
      issue(context, ["approval", "status"], "executed attempts require approval or an explicit not-required policy");
    }
    if (value.sandbox.isolation === "none") {
      issue(context, ["sandbox", "isolation"], "executed attempts require declared isolation");
    }
    if (!value.sandbox.nonRoot) {
      issue(context, ["sandbox", "nonRoot"], "executed attempts require a non-root sandbox identity");
    }
    if (value.sandbox.cleanup === "not-started") {
      issue(context, ["sandbox", "cleanup"], "executed attempts require a recorded cleanup outcome");
    }
    if (
      ["container", "gvisor", "microvm"].includes(value.sandbox.isolation) &&
      !value.sandbox.runtimeDigest
    ) {
      issue(context, ["sandbox", "runtimeDigest"], "managed isolation requires an immutable runtime digest");
    }
  } else {
    if (value.startedAt) issue(context, ["startedAt"], "non-executed attempts cannot have startedAt");
    if (!zeroUsage) issue(context, ["usage"], "non-executed attempts require zero resource usage");
    if (hasOutput) issue(context, ["output"], "non-executed attempts cannot contain execution output");
    if (value.sandbox.cleanup !== "not-started") {
      issue(context, ["sandbox", "cleanup"], "non-executed attempts require not-started cleanup state");
    }
    if (value.secretInputs !== "none") {
      issue(context, ["secretInputs"], "non-executed attempts cannot receive secret inputs");
    }
  }

  if (["confirmed", "not_reproduced"].includes(value.verdict)) {
    if (!value.executed) issue(context, ["executed"], `${value.verdict} requires execution`);
    if (!value.output.evidenceDigest) {
      issue(context, ["output", "evidenceDigest"], `${value.verdict} requires an evidence digest`);
    }
  }
  if (["not_supported", "policy_denied"].includes(value.verdict) && value.executed) {
    issue(context, ["executed"], `${value.verdict} must not execute`);
  }
  if (value.verdict === "policy_denied" && !["denied", "not-requested"].includes(value.approval.status)) {
    issue(context, ["approval", "status"], "policy_denied requires denied or not-requested approval state");
  }
  if (value.recipe.signatureStatus !== "verified" && value.executed) {
    issue(context, ["recipe", "signatureStatus"], "unverified or invalid recipes must not execute");
  }
  if (value.sandbox.network.mode === "denied" && value.usage.networkRequests !== 0) {
    issue(context, ["usage", "networkRequests"], "denied network mode requires zero network requests");
  }

  const limitPairs: Array<[number, number, string]> = [
    [value.usage.durationMs, value.limits.timeoutMs, "durationMs"],
    [value.usage.cpuMs, value.limits.cpuMs, "cpuMs"],
    [value.usage.peakMemoryBytes, value.limits.memoryBytes, "peakMemoryBytes"],
    [value.usage.diskBytes, value.limits.diskBytes, "diskBytes"],
    [value.usage.processes, value.limits.maxProcesses, "processes"],
    [value.usage.outputBytes, value.limits.maxOutputBytes, "outputBytes"],
    [value.usage.networkRequests, value.limits.maxNetworkRequests, "networkRequests"],
  ];
  for (const [actual, limit, path] of limitPairs) {
    if (actual > limit) issue(context, ["usage", path], "resource usage exceeds the declared limit");
  }

  if (value.startedAt && Date.parse(value.completedAt) < Date.parse(value.startedAt)) {
    issue(context, ["completedAt"], "completedAt precedes startedAt");
  }
}

function issue(context: z.RefinementCtx, path: Array<string | number>, message: string): void {
  context.addIssue({ code: z.ZodIssueCode.custom, path, message });
}

function isSafeNetworkOrigin(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.username === "" &&
      url.password === "" &&
      url.pathname === "/" &&
      url.search === "" &&
      url.hash === ""
    );
  } catch {
    return false;
  }
}
