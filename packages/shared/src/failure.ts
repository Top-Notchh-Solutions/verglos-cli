import { z } from "zod";
import {
  VERGLOS_SCHEMA_IDS,
  classifySchemaCompatibility,
  parseSchemaVersion,
  parseVersionedJson,
  type ParseJsonOptions,
  type SchemaDescriptor,
} from "./schema.js";

export const FAILURE_SCHEMA = {
  id: VERGLOS_SCHEMA_IDS.failure,
  version: "1.0.0",
} as const satisfies SchemaDescriptor;

export const FAILURE_CATEGORIES = [
  "usage",
  "unsupported",
  "incomplete",
  "policy-block",
  "infrastructure",
  "authorization",
  "quota",
  "integrity",
  "internal",
] as const;

export type FailureCategory = (typeof FAILURE_CATEGORIES)[number];

export const FAILURE_EXIT_CODES = Object.freeze({
  usage: 2,
  unsupported: 78,
  incomplete: 3,
  "policy-block": 1,
  infrastructure: 4,
  authorization: 4,
  quota: 4,
  integrity: 70,
  internal: 70,
} as const);

const UUID_URN = /^urn:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const SAFE_TEXT = /^[^\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]+$/;
const ShortTextSchema = z.string().min(1).max(512).regex(SAFE_TEXT);
const TextSchema = z.string().min(1).max(4096).regex(SAFE_TEXT);
const FailureBaseSchema = z
  .object({
    schemaId: z.literal(FAILURE_SCHEMA.id),
    schemaVersion: z.string().refine((value) => parseSchemaVersion(value) !== null),
    failureId: z.string().regex(UUID_URN),
    category: z.enum(FAILURE_CATEGORIES),
    code: z.string().regex(/^verglos\.failure\.[a-z0-9]+(?:-[a-z0-9]+)*\.[a-z0-9]+(?:-[a-z0-9]+)*$/),
    exitCode: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(70), z.literal(78)]),
    retry: z.enum(["never", "safe", "after-action", "after-window"]),
    operation: ShortTextSchema,
    target: ShortTextSchema.optional(),
    message: TextSchema,
    limitation: TextSchema,
    action: TextSchema,
    occurredAt: z.string().datetime({ offset: true }),
  })
  .strict()
  .superRefine((value, context) => {
    const categoryToken = value.category.replace("-", "-");
    if (!value.code.startsWith(`verglos.failure.${categoryToken}.`)) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["code"], message: "failure code must use its category namespace" });
    }
    if (value.exitCode !== FAILURE_EXIT_CODES[value.category]) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["exitCode"], message: `exitCode must be ${FAILURE_EXIT_CODES[value.category]} for ${value.category}` });
    }
    if (value.category === "usage" && value.retry === "safe") {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["retry"], message: "usage failures require correction before retry" });
    }
    if (["policy-block", "authorization", "integrity"].includes(value.category) && value.retry === "safe") {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["retry"], message: `${value.category} failures cannot be retried blindly` });
    }
  });

export type FailureDocument = z.infer<typeof FailureBaseSchema>;
export const FailureDocumentSchema = FailureBaseSchema;

export class FailureValidationError extends Error {
  override readonly name = "FailureValidationError";
  constructor(readonly issues: readonly { path: string; code: string; message: string }[]) {
    super(`Failure validation failed with ${issues.length} issue${issues.length === 1 ? "" : "s"}.`);
  }
}

export function createFailure(input: Omit<FailureDocument, "schemaId" | "schemaVersion" | "exitCode">): FailureDocument {
  return parseFailure({
    schemaId: FAILURE_SCHEMA.id,
    schemaVersion: FAILURE_SCHEMA.version,
    ...input,
    exitCode: FAILURE_EXIT_CODES[input.category],
  });
}

export function parseFailure(value: unknown): FailureDocument {
  const parsed = FailureDocumentSchema.safeParse(value);
  if (!parsed.success) {
    throw new FailureValidationError(parsed.error.issues.map((entry) => ({
      path: entry.path.join("."),
      code: entry.code,
      message: entry.code === z.ZodIssueCode.unrecognized_keys ? "object contains unsupported properties" : entry.message,
    })));
  }
  const compatibility = classifySchemaCompatibility(parsed.data.schemaVersion, FAILURE_SCHEMA.version);
  if (compatibility === "upgrade-required" || compatibility === "incompatible") {
    throw new FailureValidationError([{ path: "schemaVersion", code: compatibility, message: `Use a reader compatible with failure schema ${parsed.data.schemaVersion}.` }]);
  }
  return parsed.data;
}

export function parseFailureJson(input: string | Uint8Array, options: ParseJsonOptions = {}): FailureDocument {
  const parsed = parseVersionedJson<Record<string, unknown>>(input, { ...options, expectedSchema: FAILURE_SCHEMA });
  return parseFailure(parsed.document);
}
