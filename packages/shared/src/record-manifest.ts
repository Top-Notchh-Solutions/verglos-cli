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
import { ContentDigestSchema, RelativeSubjectPathSchema } from "./subject.js";

export const RELEASE_RECORD_MANIFEST_SCHEMA = {
  id: VERGLOS_SCHEMA_IDS.releaseRecordManifest,
  version: "1.0.0",
} as const satisfies SchemaDescriptor;

const SAFE_TEXT = /^[^\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]+$/;
const ShortTextSchema = z.string().min(1).max(512).regex(SAFE_TEXT);
const TextSchema = z.string().min(1).max(4096).regex(SAFE_TEXT);
const TimestampSchema = z.string().datetime({ offset: true });
const MEDIA_TYPE = /^[A-Za-z0-9!#$&^_.+-]+\/[A-Za-z0-9!#$&^_.+-]+(?:;[\x20-\x7e]+)?$/;
const EXTENSION_ID = /^urn:verglos:extension:[a-z][a-z0-9]*(?:-[a-z0-9]+)*:[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const MEMBER_KINDS = [
  "metadata",
  "subject",
  "tool-run",
  "observation",
  "verification-attempt",
  "policy-exception",
  "exception-approval",
  "policy",
  "policy-evaluation",
  "release-decision",
  "provenance",
  "signature",
  "export",
  "viewer",
  "redaction-manifest",
  "extension",
] as const;

const SchemaReferenceSchema = z
  .object({
    id: z.string().regex(/^urn:verglos:schema:[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/),
    version: z.string().refine((value) => parseSchemaVersion(value) !== null),
  })
  .strict();

const RecordMemberSchema = z
  .object({
    path: RelativeSubjectPathSchema,
    kind: z.enum(MEMBER_KINDS),
    mediaType: z.string().min(3).max(255).regex(MEDIA_TYPE),
    digest: ContentDigestSchema,
    size: z.number().int().nonnegative().safe(),
    required: z.boolean(),
    redaction: z.enum(["none", "applied", "omitted"]),
    schema: SchemaReferenceSchema.optional(),
  })
  .strict()
  .superRefine((value, context) => {
    if (value.kind === "release-decision" && (!value.required || !value.schema)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["schema"],
        message: "release-decision members are required and must identify their schema",
      });
    }
    if (value.kind === "redaction-manifest" && value.redaction === "omitted") {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["redaction"],
        message: "a redaction manifest cannot itself be omitted",
      });
    }
    if (value.redaction === "omitted" && value.size !== 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["size"],
        message: "omitted members must record zero payload size",
      });
    }
  });

const ExtensionSchema = z
  .object({
    id: z.string().regex(EXTENSION_ID),
    version: z.string().refine((value) => parseSchemaVersion(value) !== null),
    mediaType: z.string().min(3).max(255).regex(MEDIA_TYPE),
    digest: ContentDigestSchema,
    size: z.number().int().nonnegative().safe(),
    redaction: z.enum(["none", "applied", "omitted"]),
  })
  .strict()
  .superRefine((value, context) => {
    if (value.redaction === "omitted" && value.size !== 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["size"],
        message: "omitted extensions must record zero payload size",
      });
    }
  });

const RedactionSchema = z
  .object({
    status: z.enum(["not-required", "complete", "partial", "unknown"]),
    manifestDigest: ContentDigestSchema.optional(),
  })
  .strict()
  .superRefine((value, context) => {
    if (["complete", "partial"].includes(value.status) && !value.manifestDigest) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["manifestDigest"],
        message: `${value.status} redaction state requires the redaction-manifest digest`,
      });
    }
    if (["not-required", "unknown"].includes(value.status) && value.manifestDigest) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["manifestDigest"],
        message: `${value.status} redaction state cannot claim a manifest digest`,
      });
    }
  });

const ManifestBaseSchema = z
  .object({
    schemaId: z.literal(RELEASE_RECORD_MANIFEST_SCHEMA.id),
    schemaVersion: z.string().refine((value) => parseSchemaVersion(value) !== null),
    bundleVersion: z.string().refine((value) => parseSchemaVersion(value) !== null),
    manifestId: z.string().regex(/^urn:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/),
    generatedAt: TimestampSchema,
    generator: z
      .object({ id: StableContractIdSchema, version: z.string().refine((value) => parseSchemaVersion(value) !== null) })
      .strict(),
    members: z.array(RecordMemberSchema).min(1).max(4096),
    extensions: z.array(ExtensionSchema).max(256),
    redaction: RedactionSchema,
    limitations: z.array(TextSchema).min(1).max(32),
  })
  .strict();

export type ReleaseRecordManifestDocument = z.infer<typeof ManifestBaseSchema>;
export const ReleaseRecordManifestDocumentSchema = ManifestBaseSchema.superRefine(
  (value, context) => {
    const releaseDecisions = value.members.filter((member) => member.kind === "release-decision");
    if (releaseDecisions.length !== 1) {
      issue(context, ["members"], "a manifest requires exactly one release-decision member");
    }
    const paths = value.members.map((member) => member.path);
    if (new Set(paths).size !== paths.length) issue(context, ["members"], "member paths must be unique");
    if (!isSorted(paths)) issue(context, ["members"], "members must be ordered by path for deterministic layout");
    const extensionIds = value.extensions.map((extension) => extension.id);
    if (new Set(extensionIds).size !== extensionIds.length) issue(context, ["extensions"], "extension IDs must be unique");
    if (!isSorted(extensionIds)) issue(context, ["extensions"], "extensions must be ordered by ID for deterministic layout");
    if (value.redaction.status === "complete" && !value.members.some((member) => member.kind === "redaction-manifest")) {
      issue(context, ["redaction"], "complete redaction state requires a redaction-manifest member");
    }
  },
);

export interface ReleaseRecordManifestValidationIssue {
  readonly path: string;
  readonly code: string;
  readonly message: string;
}

export class ReleaseRecordManifestValidationError extends Error {
  override readonly name = "ReleaseRecordManifestValidationError";
  constructor(readonly issues: readonly ReleaseRecordManifestValidationIssue[]) {
    super(`Release Record manifest validation failed with ${issues.length} issue${issues.length === 1 ? "" : "s"}.`);
  }
}

export function createReleaseRecordManifest(
  input: Omit<ReleaseRecordManifestDocument, "members" | "extensions"> & {
    members: ReleaseRecordManifestDocument["members"];
    extensions?: ReleaseRecordManifestDocument["extensions"];
  },
): ReleaseRecordManifestDocument {
  return parseReleaseRecordManifest({
    ...input,
    members: [...input.members].sort((left, right) => compareCodeUnits(left.path, right.path)),
    extensions: [...(input.extensions ?? [])].sort((left, right) => compareCodeUnits(left.id, right.id)),
  });
}

export function parseReleaseRecordManifest(value: unknown): ReleaseRecordManifestDocument {
  const parsed = ReleaseRecordManifestDocumentSchema.safeParse(value);
  if (!parsed.success) {
    throw new ReleaseRecordManifestValidationError(
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
    RELEASE_RECORD_MANIFEST_SCHEMA.version,
  );
  if (compatibility === "upgrade-required" || compatibility === "incompatible") {
    throw new ReleaseRecordManifestValidationError([
      {
        path: "schemaVersion",
        code: compatibility,
        message:
          compatibility === "upgrade-required"
            ? `Upgrade to a reader supporting release-record-manifest schema ${parsed.data.schemaVersion}.`
            : `Use an explicit reader or migration for release-record-manifest schema ${parsed.data.schemaVersion}.`,
      },
    ]);
  }
  return parsed.data;
}

export function parseReleaseRecordManifestJson(
  input: string | Uint8Array,
  options: ParseJsonOptions = {},
): ReleaseRecordManifestDocument {
  const parsed = parseVersionedJson<Record<string, unknown>>(input, {
    ...options,
    expectedSchema: RELEASE_RECORD_MANIFEST_SCHEMA,
  });
  return parseReleaseRecordManifest(parsed.document);
}

function compareCodeUnits(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function isSorted(values: string[]): boolean {
  return values.every((value, index) => index === 0 || compareCodeUnits(values[index - 1]!, value) <= 0);
}

function issue(context: z.RefinementCtx, path: Array<string | number>, message: string): void {
  context.addIssue({ code: z.ZodIssueCode.custom, path, message });
}
