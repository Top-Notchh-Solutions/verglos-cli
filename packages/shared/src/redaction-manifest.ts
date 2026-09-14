import { z } from "zod";
import { ContentDigestSchema } from "./subject.js";
import { VERGLOS_SCHEMA_IDS, classifySchemaCompatibility, parseSchemaVersion, parseVersionedJson, type ParseJsonOptions, type SchemaDescriptor } from "./schema.js";

export const REDACTION_MANIFEST_SCHEMA = {
  id: VERGLOS_SCHEMA_IDS.redactionManifest,
  version: "1.0.0",
} as const satisfies SchemaDescriptor;

export const REDACTION_CATEGORIES = [
  "source-content",
  "paths",
  "finding-details",
  "secrets",
  "tenant-identifiers",
  "client-identifiers",
  "signing-material",
  "other-sensitive-data",
] as const;
export type RedactionCategory = typeof REDACTION_CATEGORIES[number];

const RedactionEntrySchema = z.object({
  memberDigest: ContentDigestSchema,
  disposition: z.enum(["none", "applied", "omitted"]),
  categories: z.array(z.enum(REDACTION_CATEGORIES)).max(REDACTION_CATEGORIES.length),
}).strict().superRefine((entry, context) => {
  const sorted = [...entry.categories].sort(compareCodeUnits);
  if (new Set(entry.categories).size !== entry.categories.length || entry.categories.some((category, index) => category !== sorted[index])) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["categories"], message: "redaction categories must be unique and sorted" });
  }
  if (entry.disposition === "none" && entry.categories.length !== 0) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["categories"], message: "unredacted members cannot declare removed data categories" });
  }
  if (entry.disposition !== "none" && entry.categories.length === 0) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["categories"], message: "redacted or omitted members must declare at least one closed redaction category" });
  }
});

const RedactionManifestSchema = z.object({
  schemaId: z.literal(REDACTION_MANIFEST_SCHEMA.id),
  schemaVersion: z.string().refine((value) => parseSchemaVersion(value) !== null),
  status: z.enum(["complete", "partial"]),
  assurance: z.literal("producer-declared-only"),
  members: z.array(RedactionEntrySchema).min(1).max(4095),
}).strict().superRefine((manifest, context) => {
  const keys = manifest.members.map((member) => `${member.memberDigest.algorithm}:${member.memberDigest.value}`);
  if (new Set(keys).size !== keys.length) context.addIssue({ code: z.ZodIssueCode.custom, path: ["members"], message: "redaction manifest member digests must be unique" });
  if (keys.some((key, index) => index > 0 && compareCodeUnits(keys[index - 1]!, key) > 0)) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["members"], message: "redaction manifest members must be sorted by digest" });
  }
});

export type RedactionManifestDocument = z.infer<typeof RedactionManifestSchema>;
export type RedactionManifestEntry = z.infer<typeof RedactionEntrySchema>;

export function createRedactionManifest(input: Omit<RedactionManifestDocument, "members" | "assurance" | "schemaId" | "schemaVersion"> & {
  readonly schemaVersion?: string;
  readonly members: readonly RedactionManifestEntry[];
}): RedactionManifestDocument {
  return parseRedactionManifest({
    schemaId: REDACTION_MANIFEST_SCHEMA.id,
    schemaVersion: input.schemaVersion ?? REDACTION_MANIFEST_SCHEMA.version,
    status: input.status,
    assurance: "producer-declared-only",
    members: [...input.members]
      .map((member) => ({ ...member, categories: [...member.categories].sort(compareCodeUnits) }))
      .sort((left, right) => compareCodeUnits(digestKey(left.memberDigest), digestKey(right.memberDigest))),
  });
}

export function parseRedactionManifest(value: unknown): RedactionManifestDocument {
  const parsed = RedactionManifestSchema.safeParse(value);
  if (!parsed.success) throw new Error(`Invalid redaction manifest: ${parsed.error.issues.map((issue) => issue.message).join("; ")}`);
  const compatibility = classifySchemaCompatibility(parsed.data.schemaVersion, REDACTION_MANIFEST_SCHEMA.version);
  if (compatibility === "upgrade-required" || compatibility === "incompatible") throw new Error(`Redaction manifest schema ${parsed.data.schemaVersion} requires an explicit reader upgrade or migration.`);
  return parsed.data;
}

export function parseRedactionManifestJson(input: string | Uint8Array, options: ParseJsonOptions = {}): RedactionManifestDocument {
  const parsed = parseVersionedJson<Record<string, unknown>>(input, { ...options, expectedSchema: REDACTION_MANIFEST_SCHEMA });
  return parseRedactionManifest(parsed.document);
}

function digestKey(digest: RedactionManifestEntry["memberDigest"]): string {
  return `${digest.algorithm}:${digest.value}`;
}

function compareCodeUnits(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}
