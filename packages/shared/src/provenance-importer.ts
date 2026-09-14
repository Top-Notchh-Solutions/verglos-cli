import { importBoundedJson, ImporterError, type ImportedDocument } from "./importer-registry.js";

export const MAX_PROVENANCE_SOURCE_BYTES = 8 * 1024 * 1024;

export interface ImportedProvenance {
  readonly format: "in-toto";
  readonly sourceDigest: ImportedDocument["sourceDigest"];
  readonly envelopeType: "statement" | "legacy-wrapper" | "dsse";
  readonly signatureCount: number;
  readonly subjects: readonly Record<string, unknown>[];
  readonly builder?: Record<string, unknown>;
  readonly invocation?: Record<string, unknown>;
  readonly signatureStatus: "unverified";
  readonly statement: Record<string, unknown>;
}

export class ProvenanceImportError extends Error {
  override readonly name = "ProvenanceImportError";
  constructor(readonly code: "INVALID_ENVELOPE" | "INVALID_STATEMENT" | "MISSING_SUBJECT", message: string) { super(message); }
}

export function importInTotoProvenance(bytes: Uint8Array): ImportedProvenance {
  if (bytes.byteLength === 0) throw new ProvenanceImportError("INVALID_ENVELOPE", "Provenance envelope is empty.");
  let imported: ImportedDocument;
  try { imported = importBoundedJson(bytes, MAX_PROVENANCE_SOURCE_BYTES); }
  catch (error) {
    if (error instanceof ImporterError) throw new ProvenanceImportError("INVALID_ENVELOPE", error.message);
    throw error;
  }
  if (imported.format !== "in-toto") throw new ProvenanceImportError("INVALID_ENVELOPE", "Evidence is not an in-toto provenance statement or DSSE envelope.");

  const envelope = imported.document as Record<string, unknown>;
  let statement: Record<string, unknown>;
  let envelopeType: ImportedProvenance["envelopeType"];
  let signatureCount = 0;

  if (imported.version === "dsse") {
    if (envelope.payloadType !== "application/vnd.in-toto+json" || typeof envelope.payload !== "string") {
      throw new ProvenanceImportError("INVALID_ENVELOPE", "DSSE payload type must be application/vnd.in-toto+json.");
    }
    if (!Array.isArray(envelope.signatures) || envelope.signatures.length === 0 || envelope.signatures.length > 64) {
      throw new ProvenanceImportError("INVALID_ENVELOPE", "DSSE envelope requires a bounded non-empty signature list.");
    }
    for (const signature of envelope.signatures) {
      if (!signature || typeof signature !== "object" || Array.isArray(signature) || typeof (signature as Record<string, unknown>).sig !== "string" || !(signature as Record<string, unknown>).sig) {
        throw new ProvenanceImportError("INVALID_ENVELOPE", "DSSE signatures must contain a non-empty signature value.");
      }
    }
    signatureCount = envelope.signatures.length;
    const encoded = envelope.payload;
    const payloadBytes = decodeCanonicalBase64(encoded);
    let decoded: unknown;
    try { decoded = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(payloadBytes)); }
    catch { throw new ProvenanceImportError("INVALID_STATEMENT", "DSSE payload is not valid UTF-8 JSON."); }
    if (!decoded || typeof decoded !== "object" || Array.isArray(decoded)) throw new ProvenanceImportError("INVALID_STATEMENT", "DSSE payload must be an in-toto statement object.");
    statement = decoded as Record<string, unknown>;
    envelopeType = "dsse";
  } else if (envelope.payload !== undefined) {
    if (!envelope.payload || typeof envelope.payload !== "object" || Array.isArray(envelope.payload)) {
      throw new ProvenanceImportError("INVALID_ENVELOPE", "Provenance payload must be an object.");
    }
    statement = envelope.payload as Record<string, unknown>;
    envelopeType = "legacy-wrapper";
  } else {
    statement = envelope;
    envelopeType = "statement";
  }

  const subjects = statement.subject;
  if (!Array.isArray(subjects) || subjects.length === 0 || subjects.length > 4096 || subjects.some((entry) => typeof entry !== "object" || entry === null || Array.isArray(entry))) {
    throw new ProvenanceImportError("MISSING_SUBJECT", "Provenance statement requires bounded subject digests.");
  }
  for (const subject of subjects as Record<string, unknown>[]) {
    if (typeof subject.name !== "string" || subject.name.length === 0 || subject.name.length > 1024 || /[\u0000-\u001f\u007f]/u.test(subject.name) || typeof subject.digest !== "object" || subject.digest === null || Array.isArray(subject.digest)) {
      throw new ProvenanceImportError("INVALID_STATEMENT", "Provenance subjects require a bounded name and digest map.");
    }
    const digests = Object.entries(subject.digest as Record<string, unknown>);
    if (digests.length === 0 || digests.length > 32 || digests.some(([algorithm, value]) => !/^[a-z0-9][a-z0-9+.-]{0,63}$/u.test(algorithm) || typeof value !== "string" || value.length === 0 || value.length > 512 || /[\u0000-\u001f\u007f]/u.test(value))) {
      throw new ProvenanceImportError("INVALID_STATEMENT", "Provenance subjects require valid bounded digest maps.");
    }
  }
  const predicate = statement.predicate;
  if (predicate !== undefined && (!predicate || typeof predicate !== "object" || Array.isArray(predicate))) {
    throw new ProvenanceImportError("INVALID_STATEMENT", "Provenance predicate must be an object.");
  }
  const predicateObject = predicate as Record<string, unknown> | undefined;
  return {
    format: "in-toto",
    sourceDigest: imported.sourceDigest,
    envelopeType,
    signatureCount,
    subjects: subjects as Record<string, unknown>[],
    ...(predicateObject?.builder && typeof predicateObject.builder === "object" && !Array.isArray(predicateObject.builder) ? { builder: predicateObject.builder as Record<string, unknown> } : {}),
    ...(predicateObject?.invocation && typeof predicateObject.invocation === "object" && !Array.isArray(predicateObject.invocation) ? { invocation: predicateObject.invocation as Record<string, unknown> } : {}),
    signatureStatus: "unverified",
    statement,
  };
}

function decodeCanonicalBase64(value: string): Buffer {
  if (value.length === 0 || value.length > Math.ceil(MAX_PROVENANCE_SOURCE_BYTES * 4 / 3) + 4 || value.length % 4 !== 0 || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/u.test(value)) {
    throw new ProvenanceImportError("INVALID_ENVELOPE", "DSSE payload is not bounded canonical Base64.");
  }
  const bytes = Buffer.from(value, "base64");
  if (bytes.byteLength === 0 || bytes.byteLength > MAX_PROVENANCE_SOURCE_BYTES || bytes.toString("base64") !== value) {
    throw new ProvenanceImportError("INVALID_ENVELOPE", "DSSE payload is not bounded canonical Base64.");
  }
  return bytes;
}
