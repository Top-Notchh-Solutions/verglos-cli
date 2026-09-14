import { createHash } from "node:crypto";
import { canonicalizeJson } from "./schema.js";
import { importInTotoProvenance, type ImportedProvenance } from "./provenance-importer.js";
import { SubjectIdSchema } from "./subject.js";

export type ProvenanceProvider = "github" | "npm" | "buildkit" | "unknown";
export type ProvenanceMatchState = "matched" | "mismatched" | "unavailable";

export interface ProviderProvenanceResult {
  readonly provider: ProvenanceProvider;
  readonly providerIdentityStatus: "caller-declared";
  readonly subjectDigest: string;
  readonly expectedDigest: string;
  readonly state: ProvenanceMatchState;
  readonly signatureStatus: "unverified";
}

export interface ProviderProvenanceRecordMember {
  readonly path: string;
  readonly kind: "provenance";
  readonly mediaType: "application/json";
  readonly bytes: Uint8Array;
  readonly required: boolean;
  readonly redaction: "none";
  readonly schema: { readonly id: "urn:verglos:schema:provider-provenance"; readonly version: "1.0.0" };
}

export interface ProviderProvenanceDocument {
  readonly schemaId: "urn:verglos:schema:provider-provenance";
  readonly schemaVersion: "1.0.0";
  readonly provider: ProvenanceProvider;
  readonly subjectId: string;
  readonly providerIdentityStatus: "caller-declared";
  readonly source: {
    readonly digest: `sha256:${string}`;
    readonly envelopeType: ImportedProvenance["envelopeType"];
    readonly bytesBase64: string;
  };
  readonly statement: Record<string, unknown>;
  readonly subjects: readonly Record<string, unknown>[];
  readonly builder?: Record<string, unknown>;
  readonly invocation?: Record<string, unknown>;
  readonly match: {
    readonly state: ProvenanceMatchState;
    readonly subjectDigest: string;
    readonly expectedDigest: string;
  };
  readonly signature: {
    readonly status: "unverified";
    readonly envelopeSignatureCount: number;
  };
  readonly limitations: readonly string[];
}

const SHA256 = /^sha256:([0-9a-f]{64})$/u;

export function matchProviderProvenance(input: {
  readonly provider: ProvenanceProvider;
  readonly subjects?: readonly Record<string, unknown>[];
  readonly expectedDigest: string;
}): ProviderProvenanceResult {
  if (!["github", "npm", "buildkit", "unknown"].includes(input.provider)) throw new Error("provider must be github, npm, buildkit, or unknown");
  const expected = normalizeExpectedDigest(input.expectedDigest);
  const subjectDigests = (input.subjects ?? []).flatMap((entry) => {
    if (!entry.digest || typeof entry.digest !== "object" || Array.isArray(entry.digest)) return [];
    const digests = entry.digest as Record<string, unknown>;
    const digest = digests.sha256;
    if (typeof digest !== "string") return [];
    const normalized = normalizeSha256(digest);
    return normalized ? [normalized] : [];
  });
  const uniqueDigests = [...new Set(subjectDigests)].sort();
  const matched = uniqueDigests.includes(expected);
  const subjectDigest = matched ? expected : uniqueDigests[0] ?? "";
  const state = uniqueDigests.length === 0 ? "unavailable" : matched ? "matched" : "mismatched";
  return { provider: input.provider, providerIdentityStatus: "caller-declared", subjectDigest, expectedDigest: expected, state, signatureStatus: "unverified" };
}

/** Create a canonical provenance record member that retains the exact imported source envelope. */
export function createProviderProvenanceRecordMember(input: {
  readonly path: string;
  readonly expectedDigest: string;
  readonly provider: ProvenanceProvider;
  readonly subjectId: string;
  readonly sourceBytes: Uint8Array;
  readonly required?: boolean;
}): ProviderProvenanceRecordMember {
  const imported = importInTotoProvenance(input.sourceBytes);
  const result = matchProviderProvenance({ provider: input.provider, subjects: imported.subjects, expectedDigest: input.expectedDigest });
  const document = createProviderProvenanceDocument(input.sourceBytes, imported, result, input.subjectId);
  const bytes = new TextEncoder().encode(`${canonicalizeJson(document)}\n`);
  return { path: input.path, kind: "provenance", mediaType: "application/json", bytes, required: input.required ?? false, redaction: "none", schema: { id: "urn:verglos:schema:provider-provenance", version: "1.0.0" } };
}

export function createProviderProvenanceDocument(
  sourceBytes: Uint8Array,
  imported: ImportedProvenance,
  result: ProviderProvenanceResult,
  subjectId: string,
): ProviderProvenanceDocument {
  if (!["github", "npm", "buildkit", "unknown"].includes(result.provider)) throw new Error("provider must be github, npm, buildkit, or unknown");
  if (!SubjectIdSchema.safeParse(subjectId).success) throw new Error("provenance subjectId must be a canonical Verglos subject identity");
  const digest = `sha256:${createHash("sha256").update(sourceBytes).digest("hex")}` as const;
  if (`${imported.sourceDigest.algorithm}:${imported.sourceDigest.value}` !== digest) throw new Error("provenance importer source digest does not match source bytes");
  const limitations = [
    "Provider name is caller-declared and was not authenticated.",
    result.state === "matched"
      ? "An in-toto subject SHA-256 digest matched the expected artifact digest; this does not verify source lineage or provider identity."
      : result.state === "mismatched"
        ? "No in-toto subject SHA-256 digest matched the expected artifact digest; source-to-artifact identity is mismatched."
        : "No usable in-toto subject SHA-256 digest was available; source-to-artifact identity is unavailable.",
    "Provenance envelope signatures were not cryptographically verified.",
  ];
  return {
    schemaId: "urn:verglos:schema:provider-provenance",
    schemaVersion: "1.0.0",
    provider: result.provider,
    subjectId,
    providerIdentityStatus: "caller-declared",
    source: { digest, envelopeType: imported.envelopeType, bytesBase64: Buffer.from(sourceBytes).toString("base64") },
    statement: imported.statement,
    subjects: imported.subjects,
    ...(imported.builder ? { builder: imported.builder } : {}),
    ...(imported.invocation ? { invocation: imported.invocation } : {}),
    match: { state: result.state, subjectDigest: result.subjectDigest, expectedDigest: result.expectedDigest },
    signature: { status: "unverified", envelopeSignatureCount: imported.signatureCount },
    limitations,
  };
}

/** Validate provenance member semantics and recompute all digests/match states from retained source bytes. */
export function parseProviderProvenanceDocument(value: unknown): ProviderProvenanceDocument {
  if (!isObject(value) || value.schemaId !== "urn:verglos:schema:provider-provenance" || value.schemaVersion !== "1.0.0") throw new Error("provenance member schema is unsupported");
  const keys = ["schemaId", "schemaVersion", "provider", "subjectId", "providerIdentityStatus", "source", "statement", "subjects", "builder", "invocation", "match", "signature", "limitations"];
  if (Object.keys(value).some((key) => !keys.includes(key))) throw new Error("provenance member contains unsupported fields");
  if (!["github", "npm", "buildkit", "unknown"].includes(String(value.provider)) || typeof value.subjectId !== "string" || !SubjectIdSchema.safeParse(value.subjectId).success || value.providerIdentityStatus !== "caller-declared") throw new Error("provenance provider or subject attribution is invalid");
  if (!isObject(value.source) || typeof value.source.bytesBase64 !== "string" || typeof value.source.digest !== "string" || !["statement", "legacy-wrapper", "dsse"].includes(String(value.source.envelopeType))) throw new Error("provenance source binding is invalid");
  if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/u.test(value.source.bytesBase64) || value.source.bytesBase64.length > Math.ceil(8 * 1024 * 1024 * 4 / 3) + 4) throw new Error("provenance source bytes are invalid or oversized");
  const sourceBytes = Buffer.from(value.source.bytesBase64, "base64");
  if (sourceBytes.toString("base64") !== value.source.bytesBase64 || sourceBytes.byteLength > 8 * 1024 * 1024) throw new Error("provenance source bytes are invalid or oversized");
  const actualSourceDigest = `sha256:${createHash("sha256").update(sourceBytes).digest("hex")}`;
  if (value.source.digest !== actualSourceDigest) throw new Error("provenance source digest does not match retained source bytes");
  const imported = importInTotoProvenance(sourceBytes);
  if (imported.envelopeType !== value.source.envelopeType || canonicalizeJson(imported.statement) !== canonicalizeJson(value.statement) || canonicalizeJson(imported.subjects) !== canonicalizeJson(value.subjects)) throw new Error("provenance statement does not match retained source bytes");
  if ((value.builder !== undefined && canonicalizeJson(value.builder) !== canonicalizeJson(imported.builder)) || (value.invocation !== undefined && canonicalizeJson(value.invocation) !== canonicalizeJson(imported.invocation))) throw new Error("provenance builder or invocation does not match retained source bytes");
  if (!isObject(value.match) || typeof value.match.expectedDigest !== "string" || typeof value.match.subjectDigest !== "string" || !["matched", "mismatched", "unavailable"].includes(String(value.match.state))) throw new Error("provenance match state is invalid");
  const recomputed = matchProviderProvenance({ provider: value.provider as ProvenanceProvider, subjects: imported.subjects, expectedDigest: value.match.expectedDigest });
  if (value.match.state !== recomputed.state || value.match.subjectDigest !== recomputed.subjectDigest) throw new Error("provenance match state does not match retained source bytes");
  if (!isObject(value.signature) || value.signature.status !== "unverified" || value.signature.envelopeSignatureCount !== imported.signatureCount) throw new Error("provenance signature state is invalid");
  const expected = createProviderProvenanceDocument(sourceBytes, imported, recomputed, value.subjectId);
  if (canonicalizeJson(value) !== canonicalizeJson(expected)) throw new Error("provenance member is not the canonical projection of its retained source");
  return expected;
}

function normalizeExpectedDigest(value: string): string {
  const match = SHA256.exec(value);
  if (!match) throw new Error("expected artifact digest must be sha256:<64 lowercase hexadecimal characters>");
  return `sha256:${match[1]}`;
}

function normalizeSha256(value: string): string | undefined {
  const normalized = value.toLowerCase();
  if (/^[0-9a-f]{64}$/u.test(normalized)) return `sha256:${normalized}`;
  const match = SHA256.exec(normalized);
  return match ? `sha256:${match[1]}` : undefined;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
