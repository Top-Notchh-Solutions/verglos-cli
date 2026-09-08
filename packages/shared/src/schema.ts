/**
 * Stable schema identifiers name meaning, not a particular representation
 * version. Keep the semantic version in a separate field so compatibility can
 * be evaluated without parsing an identifier.
 */
export const VERGLOS_SCHEMA_IDS = {
  scanReport: "urn:verglos:schema:scan-report",
  subject: "urn:verglos:schema:subject",
  engineHealth: "urn:verglos:schema:engine-health",
  toolRun: "urn:verglos:schema:tool-run",
  observation: "urn:verglos:schema:observation",
  aiChangeContext: "urn:verglos:schema:ai-change-context",
  verificationAttempt: "urn:verglos:schema:verification-attempt",
  policyException: "urn:verglos:schema:policy-exception",
  exceptionApproval: "urn:verglos:schema:exception-approval",
  policyEvaluation: "urn:verglos:schema:policy-evaluation",
} as const;

export interface SchemaDescriptor {
  readonly id: string;
  readonly version: string;
}

/** The report emitted by the existing 2.0.0 JSON reporter. */
export const LEGACY_SCAN_REPORT_SCHEMA = {
  id: VERGLOS_SCHEMA_IDS.scanReport,
  version: "2.0.0",
} as const satisfies SchemaDescriptor;

export interface ParsedSchemaVersion {
  readonly major: number;
  readonly minor: number;
  readonly patch: number;
}

export type SchemaCompatibility =
  | "exact"
  | "backward-compatible"
  | "upgrade-required"
  | "incompatible";

const SCHEMA_ID_PATTERN = /^urn:verglos:schema:[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const SCHEMA_VERSION_PATTERN = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
const MAX_SCHEMA_ID_LENGTH = 128;
const MAX_SCHEMA_VERSION_LENGTH = 64;

export function isSchemaId(value: string): boolean {
  return value.length <= MAX_SCHEMA_ID_LENGTH && SCHEMA_ID_PATTERN.test(value);
}

export function parseSchemaVersion(version: string): ParsedSchemaVersion | null {
  if (version.length > MAX_SCHEMA_VERSION_LENGTH) return null;
  const match = SCHEMA_VERSION_PATTERN.exec(version);
  if (!match) return null;

  const components = match.slice(1).map(Number);
  if (components.some((component) => !Number.isSafeInteger(component))) {
    return null;
  }

  return {
    major: components[0]!,
    minor: components[1]!,
    patch: components[2]!,
  };
}

/**
 * Schema compatibility policy:
 *
 * - patch releases do not change document shape;
 * - a reader accepts older minor releases in the same major;
 * - a newer document minor/major requires a newer reader;
 * - an older major needs an explicit migration rather than inferred support.
 */
export function classifySchemaCompatibility(
  documentVersion: string,
  readerVersion: string,
): SchemaCompatibility {
  const document = requireSchemaVersion(documentVersion, "document");
  const reader = requireSchemaVersion(readerVersion, "reader");

  if (documentVersion === readerVersion) return "exact";

  if (document.major === reader.major) {
    return document.minor <= reader.minor
      ? "backward-compatible"
      : "upgrade-required";
  }

  return document.major > reader.major
    ? "upgrade-required"
    : "incompatible";
}

function requireSchemaVersion(
  version: string,
  source: "document" | "reader",
): ParsedSchemaVersion {
  const parsed = parseSchemaVersion(version);
  if (!parsed) {
    throw new TypeError(
      `Invalid ${source} schema version "${version}"; expected MAJOR.MINOR.PATCH.`,
    );
  }
  return parsed;
}

export const DEFAULT_JSON_PARSE_LIMITS = Object.freeze({
  maxBytes: 16 * 1024 * 1024,
  maxDepth: 64,
  maxNodes: 250_000,
  maxObjectProperties: 200_000,
  maxArrayItems: 200_000,
});

export interface JsonParseLimits {
  readonly maxBytes: number;
  readonly maxDepth: number;
  readonly maxNodes: number;
  readonly maxObjectProperties: number;
  readonly maxArrayItems: number;
}

export type JsonParseErrorCode =
  | "DOCUMENT_TOO_LARGE"
  | "INVALID_UTF8"
  | "INVALID_JSON"
  | "MAX_DEPTH_EXCEEDED"
  | "MAX_NODES_EXCEEDED"
  | "MAX_OBJECT_PROPERTIES_EXCEEDED"
  | "MAX_ARRAY_ITEMS_EXCEEDED"
  | "ROOT_NOT_OBJECT"
  | "MISSING_SCHEMA_ID"
  | "INVALID_SCHEMA_ID"
  | "UNSUPPORTED_SCHEMA_ID"
  | "MISSING_SCHEMA_VERSION"
  | "INVALID_SCHEMA_VERSION"
  | "SCHEMA_UPGRADE_REQUIRED"
  | "SCHEMA_VERSION_INCOMPATIBLE";

export class JsonDocumentError extends Error {
  override readonly name = "JsonDocumentError";

  constructor(
    readonly code: JsonParseErrorCode,
    message: string,
    readonly action: string,
  ) {
    super(message);
  }
}

export interface ParseJsonOptions {
  readonly limits?: Partial<JsonParseLimits>;
}

export interface ParseVersionedJsonOptions extends ParseJsonOptions {
  readonly expectedSchema: SchemaDescriptor;
  /**
   * Maps an older envelope with only `schemaVersion` to its known schema ID.
   * Callers must opt into the mapping for the specific legacy format.
   */
  readonly legacySchemaId?: string;
}

export interface ParsedVersionedJson<T extends Record<string, unknown>> {
  readonly document: T;
  readonly schema: SchemaDescriptor;
  readonly compatibility: "exact" | "backward-compatible";
  readonly usedLegacySchemaId: boolean;
}

export function parseBoundedJson(
  input: string | Uint8Array,
  options: ParseJsonOptions = {},
): unknown {
  const limits = resolveLimits(options.limits);
  const byteLength =
    typeof input === "string" ? Buffer.byteLength(input, "utf8") : input.byteLength;

  if (byteLength > limits.maxBytes) {
    throw new JsonDocumentError(
      "DOCUMENT_TOO_LARGE",
      `JSON document is ${byteLength} bytes; the configured limit is ${limits.maxBytes} bytes.`,
      "Use a smaller document or explicitly raise the trusted-input limit.",
    );
  }

  let source: string;
  try {
    source =
      typeof input === "string"
        ? input
        : new TextDecoder("utf-8", { fatal: true }).decode(input);
  } catch {
    throw new JsonDocumentError(
      "INVALID_UTF8",
      "JSON document is not valid UTF-8.",
      "Re-export the document as UTF-8 and retry.",
    );
  }

  let value: unknown;
  try {
    value = JSON.parse(source) as unknown;
  } catch {
    // Do not include the engine's parse message: recent runtimes can echo input.
    throw new JsonDocumentError(
      "INVALID_JSON",
      "Input is not a valid JSON document.",
      "Correct the JSON syntax and retry.",
    );
  }

  enforceStructureLimits(value, limits);
  return value;
}

export function parseVersionedJson<T extends Record<string, unknown>>(
  input: string | Uint8Array,
  options: ParseVersionedJsonOptions,
): ParsedVersionedJson<T> {
  validateDescriptor(options.expectedSchema, "expected reader schema");
  if (options.legacySchemaId !== undefined && !isSchemaId(options.legacySchemaId)) {
    throw new TypeError(`Invalid legacy schema ID "${options.legacySchemaId}".`);
  }

  const value = parseBoundedJson(input, options);
  if (!isJsonObject(value)) {
    throw new JsonDocumentError(
      "ROOT_NOT_OBJECT",
      "Versioned JSON must have an object at the document root.",
      "Provide a JSON object containing schemaId and schemaVersion.",
    );
  }

  const rawSchemaId = value.schemaId;
  const usedLegacySchemaId = rawSchemaId === undefined;
  let schemaId: string;
  if (usedLegacySchemaId) {
    if (!options.legacySchemaId) {
      throw new JsonDocumentError(
        "MISSING_SCHEMA_ID",
        "Versioned JSON is missing schemaId.",
        "Add the stable schemaId or use a reader configured for this legacy format.",
      );
    }
    schemaId = options.legacySchemaId;
  } else if (typeof rawSchemaId !== "string" || !isSchemaId(rawSchemaId)) {
    throw new JsonDocumentError(
      "INVALID_SCHEMA_ID",
      "Versioned JSON has an invalid schemaId.",
      "Use a stable Verglos schema URN such as urn:verglos:schema:scan-report.",
    );
  } else {
    schemaId = rawSchemaId;
  }

  if (schemaId !== options.expectedSchema.id) {
    throw new JsonDocumentError(
      "UNSUPPORTED_SCHEMA_ID",
      `Reader supports ${options.expectedSchema.id}, but the document identifies ${schemaId}.`,
      "Use the reader for the document's schema ID or import it through a supported adapter.",
    );
  }

  const rawVersion = value.schemaVersion;
  if (rawVersion === undefined) {
    throw new JsonDocumentError(
      "MISSING_SCHEMA_VERSION",
      "Versioned JSON is missing schemaVersion.",
      "Add the schema version emitted by the producing tool.",
    );
  }
  if (typeof rawVersion !== "string" || !parseSchemaVersion(rawVersion)) {
    throw new JsonDocumentError(
      "INVALID_SCHEMA_VERSION",
      "Versioned JSON has an invalid schemaVersion.",
      "Use a stable MAJOR.MINOR.PATCH schema version such as 2.0.0.",
    );
  }

  const compatibility = classifySchemaCompatibility(
    rawVersion,
    options.expectedSchema.version,
  );
  if (compatibility === "upgrade-required") {
    throw new JsonDocumentError(
      "SCHEMA_UPGRADE_REQUIRED",
      `Document uses ${schemaId} ${rawVersion}; this reader supports ${options.expectedSchema.version}.`,
      `Upgrade to a Verglos reader that supports ${schemaId} ${rawVersion} or newer.`,
    );
  }
  if (compatibility === "incompatible") {
    throw new JsonDocumentError(
      "SCHEMA_VERSION_INCOMPATIBLE",
      `Document uses ${schemaId} ${rawVersion}; this reader supports ${options.expectedSchema.version}.`,
      "Use a reader or explicit migration that supports the document's schema major version.",
    );
  }

  return {
    document: value as T,
    schema: { id: schemaId, version: rawVersion },
    compatibility,
    usedLegacySchemaId,
  };
}

function validateDescriptor(descriptor: SchemaDescriptor, label: string): void {
  if (!isSchemaId(descriptor.id)) {
    throw new TypeError(`Invalid ${label} ID "${descriptor.id}".`);
  }
  requireSchemaVersion(descriptor.version, "reader");
}

function resolveLimits(overrides?: Partial<JsonParseLimits>): JsonParseLimits {
  const limits = { ...DEFAULT_JSON_PARSE_LIMITS, ...overrides };
  for (const [name, value] of Object.entries(limits)) {
    if (!Number.isSafeInteger(value) || value < 1) {
      throw new TypeError(`${name} must be a positive safe integer.`);
    }
  }
  return limits;
}

function enforceStructureLimits(value: unknown, limits: JsonParseLimits): void {
  const stack: Array<{ value: unknown; depth: number }> = [{ value, depth: 0 }];
  let nodes = 0;
  let objectProperties = 0;
  let arrayItems = 0;

  while (stack.length > 0) {
    const current = stack.pop()!;
    nodes++;
    if (nodes > limits.maxNodes) {
      throw new JsonDocumentError(
        "MAX_NODES_EXCEEDED",
        `JSON document exceeds the configured ${limits.maxNodes}-node limit.`,
        "Use a smaller document or explicitly raise the trusted-input limit.",
      );
    }

    if (current.depth > limits.maxDepth) {
      throw new JsonDocumentError(
        "MAX_DEPTH_EXCEEDED",
        `JSON document exceeds the configured depth limit of ${limits.maxDepth}.`,
        "Reduce nesting or explicitly raise the trusted-input limit.",
      );
    }

    if (Array.isArray(current.value)) {
      arrayItems += current.value.length;
      if (arrayItems > limits.maxArrayItems) {
        throw new JsonDocumentError(
          "MAX_ARRAY_ITEMS_EXCEEDED",
          `JSON document exceeds the configured ${limits.maxArrayItems}-item limit.`,
          "Split the document or explicitly raise the trusted-input limit.",
        );
      }
      for (const child of current.value) {
        stack.push({ value: child, depth: current.depth + 1 });
      }
      continue;
    }

    if (isJsonObject(current.value)) {
      const children = Object.values(current.value);
      objectProperties += children.length;
      if (objectProperties > limits.maxObjectProperties) {
        throw new JsonDocumentError(
          "MAX_OBJECT_PROPERTIES_EXCEEDED",
          `JSON document exceeds the configured ${limits.maxObjectProperties}-property limit.`,
          "Split the document or explicitly raise the trusted-input limit.",
        );
      }
      for (const child of children) {
        stack.push({ value: child, depth: current.depth + 1 });
      }
    }
  }
}

function isJsonObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export type CanonicalJsonErrorCode =
  | "NON_JSON_VALUE"
  | "NON_PLAIN_OBJECT"
  | "INVALID_UNICODE"
  | "SPARSE_ARRAY"
  | "CYCLIC_VALUE";

export class CanonicalJsonError extends Error {
  override readonly name = "CanonicalJsonError";

  constructor(readonly code: CanonicalJsonErrorCode, message: string) {
    super(message);
  }
}

/**
 * Verglos canonical JSON v1 uses UTF-8 JSON with no insignificant whitespace,
 * lexicographically sorted object keys, preserved array order, and no `toJSON`
 * coercion. It accepts only the JSON data model and normalizes negative zero to
 * zero through JSON number serialization.
 */
export function canonicalizeJson(value: unknown): string {
  return serializeCanonical(value, new Set<object>(), "$", 0);
}

export function canonicalJsonBytes(value: unknown): Uint8Array {
  return new TextEncoder().encode(canonicalizeJson(value));
}

function serializeCanonical(
  value: unknown,
  ancestors: Set<object>,
  path: string,
  depth: number,
): string {
  if (depth > DEFAULT_JSON_PARSE_LIMITS.maxDepth) {
    throw new CanonicalJsonError(
      "NON_JSON_VALUE",
      `Value at ${path} exceeds the canonical JSON depth limit.`,
    );
  }
  if (value === null || typeof value === "boolean") {
    return JSON.stringify(value);
  }
  if (typeof value === "string") {
    assertValidUnicode(value, path);
    return JSON.stringify(value);
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new CanonicalJsonError(
        "NON_JSON_VALUE",
        `Value at ${path} is not a finite JSON number.`,
      );
    }
    return JSON.stringify(value);
  }
  if (typeof value !== "object") {
    throw new CanonicalJsonError(
      "NON_JSON_VALUE",
      `Value at ${path} is not part of the JSON data model.`,
    );
  }
  if (ancestors.has(value)) {
    throw new CanonicalJsonError(
      "CYCLIC_VALUE",
      `Value at ${path} creates a cycle.`,
    );
  }

  ancestors.add(value);
  try {
    if (Array.isArray(value)) {
      for (let index = 0; index < value.length; index++) {
        if (!Object.hasOwn(value, index)) {
          throw new CanonicalJsonError(
            "SPARSE_ARRAY",
            `Array at ${path} contains a missing item at index ${index}.`,
          );
        }
      }
      return `[${value
        .map((item, index) =>
          serializeCanonical(item, ancestors, `${path}[${index}]`, depth + 1),
        )
        .join(",")}]`;
    }

    const prototype = Object.getPrototypeOf(value) as object | null;
    if (prototype !== Object.prototype && prototype !== null) {
      throw new CanonicalJsonError(
        "NON_PLAIN_OBJECT",
        `Value at ${path} is not a plain JSON object.`,
      );
    }

    const symbolCount = Object.getOwnPropertySymbols(value).length;
    const names = Object.getOwnPropertyNames(value);
    const keys = Object.keys(value as Record<string, unknown>);
    if (symbolCount > 0 || names.length !== keys.length) {
      throw new CanonicalJsonError(
        "NON_JSON_VALUE",
        `Object at ${path} contains non-enumerable or symbol properties.`,
      );
    }

    keys.sort();
    return `{${keys
      .map((key) => {
        assertValidUnicode(key, `${path} property name`);
        const descriptor = Object.getOwnPropertyDescriptor(value, key);
        if (!descriptor || !("value" in descriptor)) {
          throw new CanonicalJsonError(
            "NON_JSON_VALUE",
            `Object property ${path}.${key} is not a JSON data property.`,
          );
        }
        return `${JSON.stringify(key)}:${serializeCanonical(
          descriptor.value,
          ancestors,
          `${path}.${key}`,
          depth + 1,
        )}`;
      })
      .join(",")}}`;
  } finally {
    ancestors.delete(value);
  }
}

function assertValidUnicode(value: string, path: string): void {
  for (let index = 0; index < value.length; index++) {
    const code = value.charCodeAt(index);
    if (code >= 0xd800 && code <= 0xdbff) {
      const next = value.charCodeAt(index + 1);
      if (!(next >= 0xdc00 && next <= 0xdfff)) {
        throw new CanonicalJsonError(
          "INVALID_UNICODE",
          `String at ${path} contains an unpaired UTF-16 surrogate.`,
        );
      }
      index++;
    } else if (code >= 0xdc00 && code <= 0xdfff) {
      throw new CanonicalJsonError(
        "INVALID_UNICODE",
        `String at ${path} contains an unpaired UTF-16 surrogate.`,
      );
    }
  }
}
