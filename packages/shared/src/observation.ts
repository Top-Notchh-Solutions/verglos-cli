import { z } from "zod";
import { RunIdSchema, StableContractIdSchema } from "./engine.js";
import {
  VERGLOS_SCHEMA_IDS,
  canonicalizeJson,
  classifySchemaCompatibility,
  parseSchemaVersion,
  parseVersionedJson,
  type ParseJsonOptions,
  type SchemaDescriptor,
} from "./schema.js";
import {
  ContentDigestSchema,
  RelativeSubjectPathSchema,
  SubjectIdSchema,
} from "./subject.js";

export const OBSERVATION_SCHEMA = {
  id: VERGLOS_SCHEMA_IDS.observation,
  version: "1.0.0",
} as const satisfies SchemaDescriptor;

const UUID_URN = /^urn:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const EXTENSION_KEY = /^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)+$/;
const RULE_ID = /^[A-Za-z0-9][A-Za-z0-9._:/-]{0,255}$/;
const MEDIA_TYPE = /^[A-Za-z0-9!#$&^_.+-]+\/[A-Za-z0-9!#$&^_.+-]+(?:;[\x20-\x7e]+)?$/;

const TextSchema = z.string().min(1).max(4096).refine(safeText, "text contains unsafe control characters");
const ShortTextSchema = z.string().min(1).max(512).refine(safeText, "text contains unsafe control characters");
const HttpsUrlSchema = z
  .string()
  .max(2048)
  .url()
  .refine((value) => value.startsWith("https://"), "reference URL must use HTTPS");

const SourceLocationSchema = z
  .object({
    kind: z.literal("source"),
    path: RelativeSubjectPathSchema,
    startLine: z.number().int().positive().safe(),
    startColumn: z.number().int().positive().safe().optional(),
    endLine: z.number().int().positive().safe().optional(),
    endColumn: z.number().int().positive().safe().optional(),
  })
  .strict()
  .superRefine((value, context) => {
    if (value.endLine !== undefined && value.endLine < value.startLine) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["endLine"], message: "endLine precedes startLine" });
    }
    if (value.endColumn !== undefined && value.endLine === undefined) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["endColumn"], message: "endColumn requires endLine" });
    }
  });

const PackageLocationSchema = z
  .object({
    kind: z.literal("package"),
    ecosystem: StableContractIdSchema,
    name: ShortTextSchema,
    version: ShortTextSchema.optional(),
    purl: z.string().min(5).max(2048).refine((value) => value.startsWith("pkg:") && !/\s/.test(value), "invalid PURL").optional(),
    cpe: z.string().min(9).max(2048).refine((value) => value.startsWith("cpe:2.3:"), "invalid CPE 2.3 name").optional(),
    dependencyPath: z.array(ShortTextSchema).max(128).optional(),
  })
  .strict()
  .superRefine((value, context) => {
    if (!value.version && !value.purl && !value.cpe) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["version"], message: "package location requires version, PURL, or CPE identity" });
    }
  });

const OciLayerLocationSchema = z
  .object({
    kind: z.literal("oci-layer"),
    layerDigest: ContentDigestSchema,
    layerIndex: z.number().int().nonnegative().safe().optional(),
    path: RelativeSubjectPathSchema.optional(),
  })
  .strict();

const ArtifactLocationSchema = z
  .object({
    kind: z.literal("artifact"),
    offset: z.number().int().nonnegative().safe().optional(),
    length: z.number().int().positive().safe().optional(),
    path: RelativeSubjectPathSchema.optional(),
  })
  .strict()
  .refine((value) => value.offset !== undefined || value.path !== undefined, {
    message: "artifact location requires an offset or relative path",
  });

export const ObservationLocationSchema = z.union([
  SourceLocationSchema,
  PackageLocationSchema,
  OciLayerLocationSchema,
  ArtifactLocationSchema,
]);
export type ObservationLocation = z.infer<typeof ObservationLocationSchema>;

export const EvidenceExcerptSchema = z
  .object({
    kind: z.enum(["excerpt", "message", "metadata"]),
    classification: z.enum(["non-sensitive", "sensitive", "secret"]),
    handling: z.enum(["included", "redacted", "omitted"]),
    description: ShortTextSchema,
    content: z.string().max(4096).refine(safeText, "content contains unsafe control characters").optional(),
  })
  .strict()
  .superRefine((value, context) => {
    if (value.classification === "secret" && value.handling !== "omitted") {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["handling"], message: "secret evidence must be omitted" });
    }
    if (value.handling === "omitted" && value.content !== undefined) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["content"], message: "omitted evidence cannot contain content" });
    }
    if (value.handling !== "omitted" && value.content === undefined) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["content"], message: "included or redacted evidence requires content" });
    }
    if (value.classification === "sensitive" && value.handling === "included") {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["handling"], message: "sensitive evidence must be redacted or omitted" });
    }
  });

const OriginSchema = z
  .object({
    kind: z.enum(["native", "adapter", "imported"]),
    producerId: StableContractIdSchema,
    runId: RunIdSchema,
    ruleId: z.string().regex(RULE_ID),
    ruleVersion: ShortTextSchema.optional(),
    producerObservationId: ShortTextSchema.optional(),
    rawEvidenceDigest: ContentDigestSchema.optional(),
  })
  .strict()
  .superRefine((value, context) => {
    if (value.kind !== "native" && !value.rawEvidenceDigest) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["rawEvidenceDigest"], message: "adapter/imported observations require the raw evidence digest" });
    }
  });

const SeveritySchema = z
  .object({
    original: z.object({ system: StableContractIdSchema, value: ShortTextSchema }).strict(),
    normalized: z.enum(["critical", "high", "medium", "low", "info", "unknown"]),
    mapping: z.object({ id: StableContractIdSchema, version: z.string().refine((value) => parseSchemaVersion(value) !== null) }).strict(),
  })
  .strict();

const ConfidenceSchema = z
  .object({
    original: z.union([z.number().min(0).max(1), ShortTextSchema]).optional(),
    level: z.enum(["certain", "high", "medium", "low", "unknown"]),
    score: z.number().min(0).max(1).optional(),
    method: StableContractIdSchema,
    mappingVersion: z.string().refine((value) => parseSchemaVersion(value) !== null),
  })
  .strict();

const ExtensionRecordSchema = z.record(z.string().regex(EXTENSION_KEY), z.unknown()).superRefine((value, context) => {
  if (Object.keys(value).length > 64) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "extensions exceed 64 entries" });
  }
  for (const [key, extension] of Object.entries(value)) {
    try {
      const serialized = canonicalizeJson(extension);
      if (Buffer.byteLength(serialized, "utf8") > 65_536) {
        context.addIssue({ code: z.ZodIssueCode.custom, path: [key], message: "extension exceeds 65536 canonical bytes" });
      }
    } catch {
      context.addIssue({ code: z.ZodIssueCode.custom, path: [key], message: "extension is not canonical JSON data" });
    }
  }
});

const ObservationDocumentBaseSchema = z
  .object({
    schemaId: z.literal(OBSERVATION_SCHEMA.id),
    schemaVersion: z.string().refine((value) => parseSchemaVersion(value) !== null),
    observationId: z.string().regex(UUID_URN),
    subjectId: SubjectIdSchema,
    origin: OriginSchema,
    coverageClass: z.enum(["native", "external", "imported"]),
    category: StableContractIdSchema,
    title: ShortTextSchema,
    description: TextSchema,
    locations: z.array(ObservationLocationSchema).min(1).max(256),
    severity: SeveritySchema,
    confidence: ConfidenceSchema,
    remediation: z
      .object({
        summary: ShortTextSchema,
        guidance: TextSchema.optional(),
        fixedVersion: ShortTextSchema.optional(),
      })
      .strict()
      .optional(),
    evidence: z.array(EvidenceExcerptSchema).max(64),
    references: z
      .array(z.object({ id: ShortTextSchema.optional(), url: HttpsUrlSchema }).strict())
      .max(64),
    extensions: ExtensionRecordSchema,
  })
  .strict();

export type ObservationDocument = z.infer<typeof ObservationDocumentBaseSchema>;
export const ObservationDocumentSchema = ObservationDocumentBaseSchema.superRefine((value, context) => {
  const expectedCoverage = value.origin.kind === "native" ? "native" : value.origin.kind === "adapter" ? "external" : "imported";
  if (value.coverageClass !== expectedCoverage) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["coverageClass"], message: "coverageClass must match origin kind" });
  }
});

export class ObservationValidationError extends Error {
  override readonly name = "ObservationValidationError";
  constructor(readonly issues: readonly { path: string; code: string; message: string }[]) {
    super(`Observation validation failed with ${issues.length} issue${issues.length === 1 ? "" : "s"}.`);
  }
}

export function parseObservation(value: unknown): ObservationDocument {
  const parsed = ObservationDocumentSchema.safeParse(value);
  if (!parsed.success) {
    throw new ObservationValidationError(parsed.error.issues.map((issue) => ({
      path: issue.path.join("."),
      code: issue.code,
      message: issue.code === z.ZodIssueCode.unrecognized_keys ? "object contains unsupported properties" : issue.message,
    })));
  }
  const compatibility = classifySchemaCompatibility(parsed.data.schemaVersion, OBSERVATION_SCHEMA.version);
  if (compatibility === "upgrade-required" || compatibility === "incompatible") {
    throw new ObservationValidationError([{ path: "schemaVersion", code: compatibility, message: compatibility === "upgrade-required" ? `Upgrade to a reader supporting observation schema ${parsed.data.schemaVersion}.` : `Use an explicit reader or migration for observation schema ${parsed.data.schemaVersion}.` }]);
  }
  return parsed.data;
}

export function parseObservationJson(input: string | Uint8Array, options: ParseJsonOptions = {}): ObservationDocument {
  const parsed = parseVersionedJson<Record<string, unknown>>(input, { ...options, expectedSchema: OBSERVATION_SCHEMA });
  return parseObservation(parsed.document);
}

function safeText(value: string): boolean {
  return !/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value);
}
