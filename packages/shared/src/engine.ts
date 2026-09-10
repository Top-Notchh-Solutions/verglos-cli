import { z } from "zod";
import {
  VERGLOS_SCHEMA_IDS,
  classifySchemaCompatibility,
  parseSchemaVersion,
  parseVersionedJson,
  type ParseJsonOptions,
  type SchemaDescriptor,
} from "./schema.js";
import { ContentDigestSchema, SubjectIdSchema } from "./subject.js";

export const ENGINE_HEALTH_SCHEMA = {
  id: VERGLOS_SCHEMA_IDS.engineHealth,
  version: "1.0.0",
} as const satisfies SchemaDescriptor;

export const TOOL_RUN_SCHEMA = {
  id: VERGLOS_SCHEMA_IDS.toolRun,
  version: "1.0.0",
} as const satisfies SchemaDescriptor;

const STABLE_ID = /^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)*$/;
const UUID_URN = /^urn:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/;

export const StableContractIdSchema = z.string().min(1).max(128).regex(STABLE_ID);
export const RunIdSchema = z.string().regex(UUID_URN);
const BoundedTextSchema = z
  .string()
  .min(1)
  .max(1024)
  .refine((value) => !CONTROL_CHARACTERS.test(value), "text contains a control character");
const TimestampSchema = z.string().datetime({ offset: true });
const EnvelopeVersionSchema = z.string().refine((value) => parseSchemaVersion(value) !== null, {
  message: "schemaVersion must be MAJOR.MINOR.PATCH",
});

export const ProducerIdentitySchema = z
  .object({
    id: StableContractIdSchema,
    kind: z.enum(["native", "external", "importer", "fixture"]),
    name: z.string().min(1).max(128).refine(noControls, "name contains a control character"),
    version: z.string().min(1).max(128).refine(noControls, "version contains a control character"),
  })
  .strict();

export type ProducerIdentity = z.infer<typeof ProducerIdentitySchema>;

export const EngineComponentSchema = z
  .object({
    id: StableContractIdSchema,
    kind: z.enum(["binary", "configuration", "database", "checks"]),
    name: z.string().min(1).max(128).refine(noControls, "name contains a control character"),
    version: z.string().min(1).max(128).refine(noControls, "version contains a control character").optional(),
    digest: ContentDigestSchema,
    source: z.enum(["bundled", "managed", "system", "user", "remote", "embedded"]),
    trust: z.enum(["verified", "computed-only", "unverified"]),
  })
  .strict();

export type EngineComponent = z.infer<typeof EngineComponentSchema>;

export const EngineCapabilitySchema = z
  .object({
    id: StableContractIdSchema,
    subjectKinds: z
      .array(
        z.enum([
          "repository-tree",
          "package",
          "filesystem",
          "sbom",
          "artifact",
          "oci-manifest",
          "oci-index",
        ]),
      )
      .min(1)
      .max(7),
    status: z.enum(["supported", "degraded", "unsupported"]),
  })
  .strict();

export type EngineCapability = z.infer<typeof EngineCapabilitySchema>;

export const FreshnessSchema = z
  .object({
    componentId: StableContractIdSchema,
    status: z.enum(["current", "stale", "unknown", "not-applicable"]),
    sourceUpdatedAt: TimestampSchema.optional(),
    checkedAt: TimestampSchema,
    maxAgeSeconds: z.number().int().positive().safe().optional(),
  })
  .strict()
  .superRefine((value, context) => {
    if (value.status === "stale" && !value.sourceUpdatedAt) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["sourceUpdatedAt"],
        message: "stale freshness requires sourceUpdatedAt",
      });
    }
  });

export type Freshness = z.infer<typeof FreshnessSchema>;

export const IncompleteReasonSchema = z
  .object({
    code: z.enum([
      "engine-missing",
      "engine-incompatible",
      "database-missing",
      "database-stale",
      "checks-missing",
      "checks-stale",
      "configuration-invalid",
      "unsupported-subject",
      "unsupported-language",
      "permission-denied",
      "timeout",
      "execution-failed",
      "parse-failed",
      "partial-output",
      "offline-data-missing",
      "cancelled",
    ]),
    scope: StableContractIdSchema,
    message: BoundedTextSchema,
    action: BoundedTextSchema,
  })
  .strict();

export type IncompleteReason = z.infer<typeof IncompleteReasonSchema>;

const engineHealthFields = {
  producer: ProducerIdentitySchema,
  observedAt: TimestampSchema,
  state: z.enum(["healthy", "degraded", "unavailable", "incompatible", "stale"]),
  components: z.array(EngineComponentSchema).max(256),
  capabilities: z.array(EngineCapabilitySchema).min(1).max(256),
  freshness: z.array(FreshnessSchema).max(256),
  incompleteReasons: z.array(IncompleteReasonSchema).max(256),
} as const;

export const EngineHealthSnapshotSchema = z
  .object(engineHealthFields)
  .strict()
  .superRefine(refineEngineHealth);

export type EngineHealthSnapshot = z.infer<typeof EngineHealthSnapshotSchema>;

export const EngineHealthDocumentSchema = z
  .object({
    schemaId: z.literal(ENGINE_HEALTH_SCHEMA.id),
    schemaVersion: EnvelopeVersionSchema,
    ...engineHealthFields,
  })
  .strict()
  .superRefine(refineEngineHealth);

export type EngineHealthDocument = z.infer<typeof EngineHealthDocumentSchema>;

const ExecutionResultSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("exited"), code: z.number().int().min(0).max(255) }).strict(),
  z.object({ kind: z.literal("signaled"), signal: z.string().min(1).max(32).regex(/^SIG[A-Z0-9]+$/) }).strict(),
  z.object({ kind: z.literal("not-started") }).strict(),
]);

const ToolRunDocumentBaseSchema = z
  .object({
    schemaId: z.literal(TOOL_RUN_SCHEMA.id),
    schemaVersion: EnvelopeVersionSchema,
    runId: RunIdSchema,
    subjectId: SubjectIdSchema,
    engine: EngineHealthSnapshotSchema,
    requestedCapabilities: z.array(StableContractIdSchema).min(1).max(256),
    executedCapabilities: z.array(StableContractIdSchema).max(256),
    executionClass: z.enum(["in-process", "local-process", "container", "microvm", "import"]),
    networkAccess: z.enum(["none", "restricted", "unrestricted"]),
    targetCodeExecuted: z.literal(false),
    startedAt: TimestampSchema,
    completedAt: TimestampSchema,
    durationMs: z.number().int().nonnegative().safe(),
    timeoutMs: z.number().int().positive().safe(),
    outcome: z.enum(["succeeded", "failed", "timed-out", "cancelled", "not-run"]),
    processResult: ExecutionResultSchema,
    coverage: z.enum(["complete", "incomplete"]),
    incompleteReasons: z.array(IncompleteReasonSchema).max(256),
  })
  .strict();

export type ToolRunDocument = z.infer<typeof ToolRunDocumentBaseSchema>;

export const ToolRunDocumentSchema = ToolRunDocumentBaseSchema.superRefine(
  refineToolRun,
);

export class EngineContractValidationError extends Error {
  override readonly name = "EngineContractValidationError";

  constructor(
    readonly issues: readonly { path: string; code: string; message: string }[],
  ) {
    super(`Engine contract validation failed with ${issues.length} issue${issues.length === 1 ? "" : "s"}.`);
  }
}

export function parseEngineHealth(value: unknown): EngineHealthDocument {
  const health = parseContract(EngineHealthDocumentSchema, value);
  requireCompatibleVersion(health.schemaVersion, ENGINE_HEALTH_SCHEMA.version);
  return health;
}

export function parseEngineHealthJson(
  input: string | Uint8Array,
  options: ParseJsonOptions = {},
): EngineHealthDocument {
  const parsed = parseVersionedJson<Record<string, unknown>>(input, {
    ...options,
    expectedSchema: ENGINE_HEALTH_SCHEMA,
  });
  return parseEngineHealth(parsed.document);
}

export function parseToolRun(value: unknown): ToolRunDocument {
  const run = parseContract(ToolRunDocumentSchema, value);
  requireCompatibleVersion(run.schemaVersion, TOOL_RUN_SCHEMA.version);
  return run;
}

export function parseToolRunJson(
  input: string | Uint8Array,
  options: ParseJsonOptions = {},
): ToolRunDocument {
  const parsed = parseVersionedJson<Record<string, unknown>>(input, {
    ...options,
    expectedSchema: TOOL_RUN_SCHEMA,
  });
  return parseToolRun(parsed.document);
}

function refineEngineHealth(
  value: {
    state: "healthy" | "degraded" | "unavailable" | "incompatible" | "stale";
    components: EngineComponent[];
    capabilities: EngineCapability[];
    freshness: Freshness[];
    incompleteReasons: IncompleteReason[];
  },
  context: z.RefinementCtx,
): void {
  requireUnique(value.components.map((item) => item.id), "components", context);
  requireUnique(value.capabilities.map((item) => item.id), "capabilities", context);
  requireUnique(value.freshness.map((item) => item.componentId), "freshness", context);

  const componentIds = new Set(value.components.map((item) => item.id));
  value.freshness.forEach((item, index) => {
    if (!componentIds.has(item.componentId)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["freshness", index, "componentId"],
        message: "freshness must reference a declared component",
      });
    }
  });

  if (value.state === "healthy" && value.incompleteReasons.length > 0) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["incompleteReasons"],
      message: "healthy engines cannot carry incomplete reasons",
    });
  }
  if (
    value.state === "healthy" &&
    !value.components.some((component) => component.kind === "binary")
  ) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["components"],
      message: "healthy engines require an identified binary/runtime component",
    });
  }
  if (
    value.state === "healthy" &&
    value.freshness.some((item) => item.status === "stale")
  ) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["state"],
      message: "healthy engine state cannot contain stale component freshness",
    });
  }
  if (value.state !== "healthy" && value.incompleteReasons.length === 0) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["incompleteReasons"],
      message: "non-healthy engines require an incomplete reason",
    });
  }
  if (
    value.state === "stale" &&
    !value.freshness.some((item) => item.status === "stale")
  ) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["freshness"],
      message: "stale engine state requires a stale component freshness entry",
    });
  }
}

function refineToolRun(value: ToolRunDocument, context: z.RefinementCtx): void {
  const started = Date.parse(value.startedAt);
  const completed = Date.parse(value.completedAt);
  if (completed < started) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["completedAt"],
      message: "completedAt must not precede startedAt",
    });
  }

  requireUnique(value.requestedCapabilities, "requestedCapabilities", context);
  requireUnique(value.executedCapabilities, "executedCapabilities", context);
  const requested = new Set(value.requestedCapabilities);
  value.executedCapabilities.forEach((capability, index) => {
    if (!requested.has(capability)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["executedCapabilities", index],
        message: "executed capability was not requested",
      });
    }
  });

  if (value.coverage === "complete" && value.incompleteReasons.length > 0) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["incompleteReasons"],
      message: "complete coverage cannot carry incomplete reasons",
    });
  }
  if (value.coverage === "incomplete" && value.incompleteReasons.length === 0) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["incompleteReasons"],
      message: "incomplete coverage requires a reason",
    });
  }
  if (value.outcome !== "succeeded" && value.coverage !== "incomplete") {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["coverage"],
      message: "non-successful runs must have incomplete coverage",
    });
  }
  if (value.outcome === "timed-out" && value.durationMs < value.timeoutMs) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["durationMs"],
      message: "timed-out run duration cannot be below timeoutMs",
    });
  }
  if (value.outcome === "not-run" && value.processResult.kind !== "not-started") {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["processResult"],
      message: "not-run outcome requires a not-started process result",
    });
  }
  if (value.outcome !== "not-run" && value.processResult.kind === "not-started") {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["processResult"],
      message: "a started run cannot have a not-started process result",
    });
  }
  if (
    value.outcome === "succeeded" &&
    (value.processResult.kind !== "exited" || value.processResult.code !== 0)
  ) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["processResult"],
      message: "succeeded outcome requires exit code zero",
    });
  }
  if (
    value.outcome === "failed" &&
    value.processResult.kind === "exited" &&
    value.processResult.code === 0
  ) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["processResult"],
      message: "failed outcome cannot carry exit code zero",
    });
  }
  if (value.engine.state !== "healthy" && value.coverage !== "incomplete") {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["coverage"],
      message: "a non-healthy engine cannot produce complete coverage",
    });
  }
}

function requireUnique(
  values: readonly string[],
  path: string,
  context: z.RefinementCtx,
): void {
  const seen = new Set<string>();
  values.forEach((value, index) => {
    if (seen.has(value)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: [path, index],
        message: "identifier must be unique",
      });
    }
    seen.add(value);
  });
}

function parseContract<T>(schema: z.ZodType<T>, value: unknown): T {
  const parsed = schema.safeParse(value);
  if (parsed.success) return parsed.data;
  throw new EngineContractValidationError(
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

function requireCompatibleVersion(documentVersion: string, readerVersion: string): void {
  const compatibility = classifySchemaCompatibility(documentVersion, readerVersion);
  if (compatibility === "upgrade-required" || compatibility === "incompatible") {
    throw new EngineContractValidationError([
      {
        path: "schemaVersion",
        code: compatibility,
        message:
          compatibility === "upgrade-required"
            ? `Upgrade to a reader that supports schema ${documentVersion}.`
            : `Use an explicit reader or migration for schema ${documentVersion}.`,
      },
    ]);
  }
}

function noControls(value: string): boolean {
  return !CONTROL_CHARACTERS.test(value);
}
