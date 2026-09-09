import { createHash } from "node:crypto";

export type ImportFormat = "sarif" | "cyclonedx" | "spdx";
export interface ImportedDocument { readonly format: ImportFormat; readonly version: string; readonly sourceDigest: { readonly algorithm: "sha256"; readonly value: string }; readonly document: unknown; }
export class ImporterError extends Error { override readonly name = "ImporterError"; constructor(readonly code: "TOO_LARGE" | "INVALID_JSON" | "UNKNOWN_FORMAT" | "AMBIGUOUS_FORMAT", message: string) { super(message); } }

export function importBoundedJson(bytes: Uint8Array, maxBytes = 64 * 1024 * 1024): ImportedDocument {
  if (bytes.byteLength > maxBytes) throw new ImporterError("TOO_LARGE", "Imported evidence exceeds the configured byte limit.");
  let value: unknown; try { value = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)); } catch { throw new ImporterError("INVALID_JSON", "Imported evidence is not valid UTF-8 JSON."); }
  if (typeof value !== "object" || value === null) throw new ImporterError("UNKNOWN_FORMAT", "Imported evidence must be a JSON object.");
  const doc = value as Record<string, unknown>; const matches: Array<{ format: ImportFormat; version: string }> = [];
  if (doc.version !== undefined && typeof doc.version === "string" && Array.isArray(doc.runs)) matches.push({ format: "sarif", version: doc.version });
  if (doc.bomFormat === "CycloneDX" && typeof doc.specVersion === "string") matches.push({ format: "cyclonedx", version: doc.specVersion });
  if (typeof doc.spdxVersion === "string") matches.push({ format: "spdx", version: doc.spdxVersion });
  if (matches.length === 0) throw new ImporterError("UNKNOWN_FORMAT", "Imported evidence format is unsupported.");
  if (matches.length > 1) throw new ImporterError("AMBIGUOUS_FORMAT", "Imported evidence matches multiple formats.");
  const match = matches[0]!;
  return { ...match, sourceDigest: { algorithm: "sha256", value: createHash("sha256").update(bytes).digest("hex") }, document: value };
}
