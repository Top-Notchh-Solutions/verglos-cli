import { createHash } from "node:crypto";
import { isIP } from "node:net";
import { z } from "zod";
import {
  VERGLOS_SCHEMA_IDS,
  canonicalizeJson,
  classifySchemaCompatibility,
  parseSchemaVersion,
  parseVersionedJson,
  type ParseJsonOptions,
  type SchemaDescriptor,
} from "./schema.js";

export const SUBJECT_SCHEMA = {
  id: VERGLOS_SCHEMA_IDS.subject,
  version: "1.0.0",
} as const satisfies SchemaDescriptor;

const SHA256 = /^[a-f0-9]{64}$/;
const SHA512 = /^[a-f0-9]{128}$/;
const GIT_SHA1 = /^[a-f0-9]{40}$/;
const GIT_SHA256 = /^[a-f0-9]{64}$/;
const SUBJECT_ID = /^urn:verglos:subject:(repository-tree|package|filesystem|sbom|artifact|oci-manifest|oci-index):sha256:[a-f0-9]{64}$/;
const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/;
const OCI_REPOSITORY = /^[a-z0-9]+(?:(?:[._-]|\/)[a-z0-9]+)*$/;
const OCI_TAG = /^[\w][\w.-]{0,127}$/;
const PLATFORM_TOKEN = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/;
const ECOSYSTEM = /^[a-z][a-z0-9-]{0,31}$/;
const MEDIA_TYPE = /^[A-Za-z0-9!#$&^_.+-]+\/[A-Za-z0-9!#$&^_.+-]+(?:;[\x20-\x7e]+)?$/;

export const ContentDigestSchema = z.discriminatedUnion("algorithm", [
  z.object({ algorithm: z.literal("sha256"), value: z.string().regex(SHA256) }).strict(),
  z.object({ algorithm: z.literal("sha512"), value: z.string().regex(SHA512) }).strict(),
]);

export type ContentDigest = z.infer<typeof ContentDigestSchema>;

export const GitObjectIdSchema = z.discriminatedUnion("algorithm", [
  z.object({ algorithm: z.literal("sha1"), value: z.string().regex(GIT_SHA1) }).strict(),
  z.object({ algorithm: z.literal("sha256"), value: z.string().regex(GIT_SHA256) }).strict(),
]);

export type GitObjectId = z.infer<typeof GitObjectIdSchema>;

export const RelativeSubjectPathSchema = z
  .string()
  .min(1)
  .max(4096)
  .refine((path) => Buffer.byteLength(path, "utf8") <= 4096, "path exceeds 4096 UTF-8 bytes")
  .refine(hasValidUnicode, "path contains an unpaired UTF-16 surrogate")
  .refine((path) => !CONTROL_CHARACTERS.test(path), "path contains a control character")
  .refine((path) => !path.includes("\\"), "path must use forward slashes")
  .refine((path) => !path.startsWith("/"), "path must be relative")
  .refine((path) => !/^[A-Za-z]:/.test(path), "path must not use a drive prefix")
  .refine(
    (path) => path.split("/").every((segment) => segment !== "" && segment !== "." && segment !== ".."),
    "path contains an empty, current, or parent segment",
  )
  .refine(
    (path) => path.split("/").every((segment) => Buffer.byteLength(segment, "utf8") <= 255),
    "path segment exceeds 255 UTF-8 bytes",
  );

export type RelativeSubjectPath = z.infer<typeof RelativeSubjectPathSchema>;

export const OciPlatformSchema = z
  .object({
    os: z.string().regex(PLATFORM_TOKEN),
    architecture: z.string().regex(PLATFORM_TOKEN),
    variant: z.string().regex(PLATFORM_TOKEN).optional(),
    osVersion: z.string().min(1).max(128).refine(noControls, "osVersion contains a control character").optional(),
    osFeatures: z.array(z.string().regex(PLATFORM_TOKEN)).max(64).optional(),
  })
  .strict();

export type OciPlatform = z.infer<typeof OciPlatformSchema>;

const commonSubjectFields = {
  schemaId: z.literal(SUBJECT_SCHEMA.id),
  schemaVersion: z.string().refine((value) => parseSchemaVersion(value) !== null, {
    message: "schemaVersion must be MAJOR.MINOR.PATCH",
  }),
  subjectId: z.string().max(180).regex(SUBJECT_ID),
};

const repositoryTreeFields = {
  kind: z.literal("repository-tree"),
  vcs: z.literal("git"),
  commit: GitObjectIdSchema,
  tree: GitObjectIdSchema,
  dirty: z.boolean(),
  worktreeDigest: ContentDigestSchema.optional(),
  submoduleState: z.enum(["none", "resolved", "incomplete"]),
  shallow: z.boolean(),
} as const;

const packageFields = {
  kind: z.literal("package"),
  ecosystem: z.string().regex(ECOSYSTEM),
  name: boundedText(512),
  version: boundedText(256),
  digest: ContentDigestSchema,
  purl: z
    .string()
    .min(5)
    .max(2048)
    .refine((value) => value.startsWith("pkg:") && !/\s/.test(value), "purl must be a compact pkg: URI")
    .optional(),
} as const;

const filesystemFields = {
  kind: z.literal("filesystem"),
  treeDigest: ContentDigestSchema,
  ignorePolicyDigest: ContentDigestSchema,
  entryCount: z.number().int().nonnegative().safe(),
  scopePath: RelativeSubjectPathSchema.optional(),
} as const;

const sbomFields = {
  kind: z.literal("sbom"),
  format: z.enum([
    "cyclonedx-json",
    "cyclonedx-xml",
    "spdx-json",
    "spdx-tag-value",
  ]),
  documentDigest: ContentDigestSchema,
  serialNumber: boundedText(2048).optional(),
} as const;

const artifactFields = {
  kind: z.literal("artifact"),
  digest: ContentDigestSchema,
  size: z.number().int().nonnegative().safe(),
  mediaType: z.string().min(3).max(255).regex(MEDIA_TYPE),
  path: RelativeSubjectPathSchema.optional(),
} as const;

const ociReferenceFields = {
  registry: z
    .string()
    .min(1)
    .max(255)
    .refine(isRegistry, "registry must be a lowercase host[:port] without credentials or path"),
  repository: z.string().min(1).max(255).regex(OCI_REPOSITORY),
  tag: z.string().regex(OCI_TAG).optional(),
} as const;

const ociManifestFields = {
  kind: z.literal("oci-manifest"),
  ...ociReferenceFields,
  digest: ContentDigestSchema,
  size: z.number().int().nonnegative().safe().optional(),
  platform: OciPlatformSchema,
} as const;

const ociIndexFields = {
  kind: z.literal("oci-index"),
  ...ociReferenceFields,
  digest: ContentDigestSchema,
  size: z.number().int().nonnegative().safe().optional(),
  manifests: z
    .array(
      z
        .object({
          digest: ContentDigestSchema,
          size: z.number().int().nonnegative().safe().optional(),
          platform: OciPlatformSchema,
        })
        .strict(),
    )
    .min(1)
    .max(512),
} as const;

const RepositoryTreePayloadSchema = z.object(repositoryTreeFields).strict();
const PackagePayloadSchema = z.object(packageFields).strict();
const FilesystemPayloadSchema = z.object(filesystemFields).strict();
const SbomPayloadSchema = z.object(sbomFields).strict();
const ArtifactPayloadSchema = z.object(artifactFields).strict();
const OciManifestPayloadSchema = z.object(ociManifestFields).strict();
const OciIndexPayloadSchema = z.object(ociIndexFields).strict();

const SubjectPayloadUnionSchema = z.discriminatedUnion("kind", [
  RepositoryTreePayloadSchema,
  PackagePayloadSchema,
  FilesystemPayloadSchema,
  SbomPayloadSchema,
  ArtifactPayloadSchema,
  OciManifestPayloadSchema,
  OciIndexPayloadSchema,
]);

export type SubjectPayload = z.infer<typeof SubjectPayloadUnionSchema>;

export const SubjectPayloadSchema = SubjectPayloadUnionSchema.superRefine(
  refineSubjectPayload,
);

const RepositoryTreeSubjectSchema = z
  .object({ ...commonSubjectFields, ...repositoryTreeFields })
  .strict();
const PackageSubjectSchema = z.object({ ...commonSubjectFields, ...packageFields }).strict();
const FilesystemSubjectSchema = z.object({ ...commonSubjectFields, ...filesystemFields }).strict();
const SbomSubjectSchema = z.object({ ...commonSubjectFields, ...sbomFields }).strict();
const ArtifactSubjectSchema = z.object({ ...commonSubjectFields, ...artifactFields }).strict();
const OciManifestSubjectSchema = z.object({ ...commonSubjectFields, ...ociManifestFields }).strict();
const OciIndexSubjectSchema = z
  .object({ ...commonSubjectFields, ...ociIndexFields })
  .strict();

export const SubjectDocumentSchema = z
  .discriminatedUnion("kind", [
    RepositoryTreeSubjectSchema,
    PackageSubjectSchema,
    FilesystemSubjectSchema,
    SbomSubjectSchema,
    ArtifactSubjectSchema,
    OciManifestSubjectSchema,
    OciIndexSubjectSchema,
  ])
  .superRefine(refineSubjectPayload);

export type Subject = z.infer<typeof SubjectDocumentSchema>;
export type RepositoryTreeSubject = Extract<Subject, { kind: "repository-tree" }>;
export type PackageSubject = Extract<Subject, { kind: "package" }>;
export type FilesystemSubject = Extract<Subject, { kind: "filesystem" }>;
export type SbomSubject = Extract<Subject, { kind: "sbom" }>;
export type ArtifactSubject = Extract<Subject, { kind: "artifact" }>;
export type OciManifestSubject = Extract<Subject, { kind: "oci-manifest" }>;
export type OciIndexSubject = Extract<Subject, { kind: "oci-index" }>;

export interface SubjectValidationIssue {
  readonly path: string;
  readonly code: string;
  readonly message: string;
}

export class SubjectValidationError extends Error {
  override readonly name = "SubjectValidationError";

  constructor(readonly issues: readonly SubjectValidationIssue[]) {
    super(`Subject validation failed with ${issues.length} issue${issues.length === 1 ? "" : "s"}.`);
  }
}

export function createSubject(payload: SubjectPayload): Subject {
  const parsedPayload = parseWithSubjectError(SubjectPayloadSchema, payload);
  const subjectId = createSubjectId(parsedPayload);
  return parseSubject({
    schemaId: SUBJECT_SCHEMA.id,
    schemaVersion: SUBJECT_SCHEMA.version,
    subjectId,
    ...parsedPayload,
  });
}

export function createSubjectId(payload: SubjectPayload): string {
  const parsedPayload = parseWithSubjectError(SubjectPayloadSchema, payload);
  const identity = subjectIdentityProjection(parsedPayload);
  const digest = createHash("sha256").update(canonicalizeJson(identity), "utf8").digest("hex");
  return `urn:verglos:subject:${parsedPayload.kind}:sha256:${digest}`;
}

export function parseSubject(value: unknown): Subject {
  const subject = parseWithSubjectError(SubjectDocumentSchema, value);
  const compatibility = classifySchemaCompatibility(
    subject.schemaVersion,
    SUBJECT_SCHEMA.version,
  );
  if (compatibility === "upgrade-required" || compatibility === "incompatible") {
    throw new SubjectValidationError([
      {
        path: "schemaVersion",
        code: compatibility,
        message:
          compatibility === "upgrade-required"
            ? `Upgrade to a reader that supports subject schema ${subject.schemaVersion}.`
            : `Use an explicit reader or migration for subject schema ${subject.schemaVersion}.`,
      },
    ]);
  }

  const expectedId = createSubjectId(subjectPayload(subject));
  if (subject.subjectId !== expectedId) {
    throw new SubjectValidationError([
      {
        path: "subjectId",
        code: "identity-mismatch",
        message: "subjectId does not match the canonical immutable identity fields.",
      },
    ]);
  }
  return subject;
}

export function parseSubjectJson(
  input: string | Uint8Array,
  options: ParseJsonOptions = {},
): Subject {
  const parsed = parseVersionedJson<Record<string, unknown>>(input, {
    ...options,
    expectedSchema: SUBJECT_SCHEMA,
  });
  return parseSubject(parsed.document);
}

function subjectPayload(subject: Subject): SubjectPayload {
  const { schemaId: _schemaId, schemaVersion: _schemaVersion, subjectId: _subjectId, ...payload } = subject;
  return payload;
}

function subjectIdentityProjection(payload: SubjectPayload): Record<string, unknown> {
  switch (payload.kind) {
    case "repository-tree":
      return compact({
        kind: payload.kind,
        vcs: payload.vcs,
        commit: payload.commit,
        tree: payload.tree,
        dirty: payload.dirty,
        worktreeDigest: payload.worktreeDigest,
      });
    case "package":
      return compact({
        kind: payload.kind,
        ecosystem: payload.ecosystem,
        name: payload.name,
        version: payload.version,
        digest: payload.digest,
      });
    case "filesystem":
      return {
        kind: payload.kind,
        treeDigest: payload.treeDigest,
        ignorePolicyDigest: payload.ignorePolicyDigest,
      };
    case "sbom":
      return {
        kind: payload.kind,
        format: payload.format,
        documentDigest: payload.documentDigest,
      };
    case "artifact":
      return { kind: payload.kind, digest: payload.digest };
    case "oci-manifest":
      return {
        kind: payload.kind,
        digest: payload.digest,
        platform: payload.platform,
      };
    case "oci-index":
      return { kind: payload.kind, digest: payload.digest };
    default:
      return assertNever(payload);
  }
}

function compact(value: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined));
}

function parseWithSubjectError<T>(schema: z.ZodType<T>, value: unknown): T {
  const parsed = schema.safeParse(value);
  if (parsed.success) return parsed.data;
  throw new SubjectValidationError(
    parsed.error.issues.map((issue) => ({
      path: issue.path.join("."),
      code: issue.code,
      message: safeIssueMessage(issue),
    })),
  );
}

function boundedText(max: number) {
  return z
    .string()
    .min(1)
    .max(max)
    .refine(noControls, "value contains a control character")
    .refine(hasValidUnicode, "value contains an unpaired UTF-16 surrogate");
}

function refineSubjectPayload(
  value: SubjectPayload,
  context: z.RefinementCtx,
): void {
  if (value.kind === "repository-tree") requireDirtyDigest(value, context);
  if (value.kind === "oci-index") requireDistinctPlatforms(value, context);
}

function noControls(value: string): boolean {
  return !CONTROL_CHARACTERS.test(value);
}

function hasValidUnicode(value: string): boolean {
  for (let index = 0; index < value.length; index++) {
    const code = value.charCodeAt(index);
    if (code >= 0xd800 && code <= 0xdbff) {
      const next = value.charCodeAt(index + 1);
      if (!(next >= 0xdc00 && next <= 0xdfff)) return false;
      index++;
    } else if (code >= 0xdc00 && code <= 0xdfff) {
      return false;
    }
  }
  return true;
}

function isRegistry(value: string): boolean {
  if (
    value !== value.toLowerCase() ||
    /[\s/@]/.test(value) ||
    CONTROL_CHARACTERS.test(value)
  ) {
    return false;
  }

  let host = value;
  let port: string | undefined;
  if (value.startsWith("[")) {
    const match = /^\[([^\]]+)\](?::(\d+))?$/.exec(value);
    if (!match || isIP(match[1]!) !== 6) return false;
    host = match[1]!;
    port = match[2];
  } else {
    const colon = value.lastIndexOf(":");
    if (colon !== -1) {
      host = value.slice(0, colon);
      port = value.slice(colon + 1);
    }
    if (
      host !== "localhost" &&
      isIP(host) !== 4 &&
      !host.split(".").every(isDnsLabel)
    ) {
      return false;
    }
  }

  if (port !== undefined) {
    if (!/^\d{1,5}$/.test(port)) return false;
    const numericPort = Number(port);
    if (numericPort < 1 || numericPort > 65_535) return false;
  }
  return host.length > 0;
}

function isDnsLabel(label: string): boolean {
  return (
    label.length >= 1 &&
    label.length <= 63 &&
    /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(label)
  );
}

function requireDirtyDigest(
  value: { dirty: boolean; worktreeDigest?: ContentDigest },
  context: z.RefinementCtx,
): void {
  if (value.dirty && !value.worktreeDigest) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["worktreeDigest"],
      message: "dirty repository trees require a worktreeDigest",
    });
  } else if (!value.dirty && value.worktreeDigest) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["worktreeDigest"],
      message: "clean repository trees must not include a worktreeDigest",
    });
  }
}

function requireDistinctPlatforms(
  value: { manifests: Array<{ platform: OciPlatform }> },
  context: z.RefinementCtx,
): void {
  const seen = new Set<string>();
  value.manifests.forEach((manifest, index) => {
    const key = canonicalizeJson(manifest.platform);
    if (seen.has(key)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["manifests", index, "platform"],
        message: "OCI index platforms must be unique",
      });
    }
    seen.add(key);
  });
}

function assertNever(value: never): never {
  throw new TypeError(`Unsupported subject kind: ${String(value)}`);
}

function safeIssueMessage(issue: z.ZodIssue): string {
  if (issue.code === z.ZodIssueCode.unrecognized_keys) {
    return "object contains unsupported properties";
  }
  if (issue.code === z.ZodIssueCode.invalid_enum_value) {
    return "value is not one of the supported values";
  }
  return issue.message;
}
