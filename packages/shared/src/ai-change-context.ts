import { z } from "zod";
import { StableContractIdSchema } from "./engine.js";
import {
  VERGLOS_SCHEMA_IDS,
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

export const AI_CHANGE_CONTEXT_SCHEMA = {
  id: VERGLOS_SCHEMA_IDS.aiChangeContext,
  version: "1.0.0",
} as const satisfies SchemaDescriptor;

const UUID_URN = /^urn:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const SAFE_TEXT = /^[^\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]+$/;
const ShortTextSchema = z.string().min(1).max(512).regex(SAFE_TEXT);
const TextSchema = z.string().min(1).max(4096).regex(SAFE_TEXT);
const TimestampSchema = z.string().datetime({ offset: true });
const ClassificationSchema = z.enum([
  "ai-assisted",
  "human-authored",
  "mixed",
  "unknown",
  "not-asserted",
]);

const ScopeSchema = z
  .union([
    z.object({ kind: z.literal("subject") }).strict(),
    z.object({ kind: z.literal("path"), path: RelativeSubjectPathSchema }).strict(),
    z
      .object({
        kind: z.literal("range"),
        path: RelativeSubjectPathSchema,
        startLine: z.number().int().positive().safe(),
        endLine: z.number().int().positive().safe(),
      })
      .strict()
      .refine((value) => value.endLine >= value.startLine, {
        path: ["endLine"],
        message: "endLine precedes startLine",
      }),
  ]);

const MethodSchema = z
  .object({
    id: StableContractIdSchema,
    version: z.string().refine((value) => parseSchemaVersion(value) !== null),
    configurationDigest: ContentDigestSchema,
  })
  .strict();

const HeuristicSignalSchema = z
  .object({
    id: StableContractIdSchema,
    direction: z.enum(["ai-assisted", "human-authored", "neutral"]),
    strength: z.number().min(0).max(1),
    detail: ShortTextSchema,
  })
  .strict();

const HeuristicEvidenceSchema = z
  .object({
    basis: z.literal("heuristic"),
    presentation: z.literal("estimate"),
    classification: ClassificationSchema.exclude(["not-asserted"]),
    likelihood: z.number().min(0).max(1),
    confidence: z.enum(["high", "medium", "low"]),
    method: MethodSchema,
    inputDigest: ContentDigestSchema,
    signals: z.array(HeuristicSignalSchema).min(1).max(128),
    limitations: z.array(TextSchema).min(1).max(32),
  })
  .strict();

const DeclaredEvidenceSchema = z
  .object({
    basis: z.literal("declared"),
    presentation: z.literal("declared-claim"),
    classification: ClassificationSchema,
    declarationKind: z.enum([
      "git-trailer",
      "commit-message",
      "tool-metadata",
      "user-attestation",
      "provenance-statement",
      "other",
    ]),
    declarer: z
      .object({
        kind: z.enum(["person", "tool", "organization", "unknown"]),
        id: ShortTextSchema.optional(),
      })
      .strict(),
    declaredAt: TimestampSchema.optional(),
    declarationDigest: ContentDigestSchema,
    method: MethodSchema,
    authenticity: z.literal("not-cryptographically-verified"),
    limitations: z.array(TextSchema).min(1).max(32),
  })
  .strict();

const CryptographicEvidenceSchema = z
  .object({
    basis: z.literal("cryptographic"),
    presentation: z.enum(["verified-declaration", "unverified-declaration"]),
    claimKind: z.enum([
      "ai-change",
      "change-authorship",
      "build-provenance",
      "artifact-provenance",
      "other",
    ]),
    classification: ClassificationSchema,
    statementFormat: z.enum([
      "in-toto",
      "slsa",
      "sigstore-bundle",
      "signed-commit",
      "other",
    ]),
    statementDigest: ContentDigestSchema,
    verificationBundleDigest: ContentDigestSchema.optional(),
    signatureStatus: z.enum(["verified", "invalid", "unverified"]),
    signer: z
      .object({
        identity: ShortTextSchema,
        issuer: ShortTextSchema.optional(),
      })
      .strict(),
    trustPolicy: z
      .object({
        id: StableContractIdSchema,
        version: z.string().refine((value) => parseSchemaVersion(value) !== null),
        digest: ContentDigestSchema,
      })
      .strict(),
    signedAt: TimestampSchema.optional(),
    verifiedAt: TimestampSchema.optional(),
    limitations: z.array(TextSchema).min(1).max(32),
  })
  .strict()
  .superRefine((value, context) => {
    const verified = value.signatureStatus === "verified";
    if (verified !== (value.presentation === "verified-declaration")) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["presentation"],
        message: "presentation must match signature verification status",
      });
    }
    if (verified && (!value.verifiedAt || !value.verificationBundleDigest)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["verifiedAt"],
        message: "verified declarations require verification time and bundle digest",
      });
    }
    if (value.claimKind !== "ai-change" && value.classification !== "not-asserted") {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["classification"],
        message: "non-AI provenance cannot assert AI-change classification",
      });
    }
  });

export const AIChangeEvidenceSchema = z.union([
  HeuristicEvidenceSchema,
  DeclaredEvidenceSchema,
  CryptographicEvidenceSchema,
]);

const DocumentBaseSchema = z
  .object({
    schemaId: z.literal(AI_CHANGE_CONTEXT_SCHEMA.id),
    schemaVersion: z.string().refine((value) => parseSchemaVersion(value) !== null),
    contextId: z.string().regex(UUID_URN),
    subjectId: SubjectIdSchema,
    scope: ScopeSchema,
    evidence: AIChangeEvidenceSchema,
    observedAt: TimestampSchema,
  })
  .strict();

export type AIChangeContextDocument = z.infer<typeof DocumentBaseSchema>;
export const AIChangeContextDocumentSchema = DocumentBaseSchema;

export class AIChangeContextValidationError extends Error {
  override readonly name = "AIChangeContextValidationError";
  constructor(readonly issues: readonly { path: string; code: string; message: string }[]) {
    super(`AI-change context validation failed with ${issues.length} issue${issues.length === 1 ? "" : "s"}.`);
  }
}

export function parseAIChangeContext(value: unknown): AIChangeContextDocument {
  const parsed = AIChangeContextDocumentSchema.safeParse(value);
  if (!parsed.success) {
    throw new AIChangeContextValidationError(
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
    AI_CHANGE_CONTEXT_SCHEMA.version,
  );
  if (compatibility === "upgrade-required" || compatibility === "incompatible") {
    throw new AIChangeContextValidationError([
      {
        path: "schemaVersion",
        code: compatibility,
        message:
          compatibility === "upgrade-required"
            ? `Upgrade to a reader supporting AI-change context schema ${parsed.data.schemaVersion}.`
            : `Use an explicit reader or migration for AI-change context schema ${parsed.data.schemaVersion}.`,
      },
    ]);
  }
  return parsed.data;
}

export function parseAIChangeContextJson(
  input: string | Uint8Array,
  options: ParseJsonOptions = {},
): AIChangeContextDocument {
  const parsed = parseVersionedJson<Record<string, unknown>>(input, {
    ...options,
    expectedSchema: AI_CHANGE_CONTEXT_SCHEMA,
  });
  return parseAIChangeContext(parsed.document);
}
