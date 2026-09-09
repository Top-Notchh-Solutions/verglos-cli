import { importBoundedJson, type ImportedDocument } from "./importer-registry.js";

export interface ImportedSarif { readonly format: "sarif"; readonly version: "2.1.0"; readonly sourceDigest: ImportedDocument["sourceDigest"]; readonly runs: readonly Record<string, unknown>[]; readonly document: Record<string, unknown>; }
export class SarifImportError extends Error { override readonly name = "SarifImportError"; constructor(readonly code: "UNSUPPORTED_VERSION" | "MALFORMED_RUN" | "MALFORMED_URI", message: string) { super(message); } }

export function importSarif(bytes: Uint8Array): ImportedSarif {
  const imported = importBoundedJson(bytes); if (imported.format !== "sarif") throw new SarifImportError("MALFORMED_RUN", "Document is not SARIF."); if (imported.version !== "2.1.0") throw new SarifImportError("UNSUPPORTED_VERSION", "Only SARIF 2.1.0 is supported.");
  const document = imported.document as Record<string, unknown>; const runs = document.runs as unknown[];
  if (!Array.isArray(runs) || runs.some((run) => typeof run !== "object" || run === null)) throw new SarifImportError("MALFORMED_RUN", "SARIF runs must be objects.");
  for (const run of runs as Record<string, unknown>[]) { const results = run.results; if (results !== undefined && !Array.isArray(results)) throw new SarifImportError("MALFORMED_RUN", "SARIF results must be an array."); }
  return { format: "sarif", version: "2.1.0", sourceDigest: imported.sourceDigest, runs: runs as Record<string, unknown>[], document };
}
