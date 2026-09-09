import { importBoundedJson, type ImportedDocument } from "./importer-registry.js";

export interface ImportedSarif { readonly format: "sarif"; readonly version: "2.1.0"; readonly sourceDigest: ImportedDocument["sourceDigest"]; readonly runs: readonly Record<string, unknown>[]; readonly document: Record<string, unknown>; }
export class SarifImportError extends Error { override readonly name = "SarifImportError"; constructor(readonly code: "UNSUPPORTED_VERSION" | "MALFORMED_RUN" | "MALFORMED_URI", message: string) { super(message); } }

export function importSarif(bytes: Uint8Array): ImportedSarif {
  const imported = importBoundedJson(bytes); if (imported.format !== "sarif") throw new SarifImportError("MALFORMED_RUN", "Document is not SARIF."); if (imported.version !== "2.1.0") throw new SarifImportError("UNSUPPORTED_VERSION", "Only SARIF 2.1.0 is supported.");
  const document = imported.document as Record<string, unknown>; const runs = document.runs as unknown[];
  if (!Array.isArray(runs) || runs.some((run) => typeof run !== "object" || run === null)) throw new SarifImportError("MALFORMED_RUN", "SARIF runs must be objects.");
  for (const run of runs as Record<string, unknown>[]) {
    const results = run.results;
    if (results !== undefined && !Array.isArray(results)) throw new SarifImportError("MALFORMED_RUN", "SARIF results must be an array.");
    if (!Array.isArray(results)) continue;
    for (const result of results) {
      if (!result || typeof result !== "object" || Array.isArray(result)) throw new SarifImportError("MALFORMED_RUN", "SARIF results must be objects.");
      const locations = (result as Record<string, unknown>).locations;
      if (locations !== undefined && !Array.isArray(locations)) throw new SarifImportError("MALFORMED_RUN", "SARIF locations must be an array.");
      if (!Array.isArray(locations)) continue;
      for (const location of locations) {
        if (!location || typeof location !== "object" || Array.isArray(location)) throw new SarifImportError("MALFORMED_RUN", "SARIF locations must be objects.");
        const physical = (location as Record<string, unknown>).physicalLocation;
        if (physical === undefined) continue;
        if (!physical || typeof physical !== "object" || Array.isArray(physical)) throw new SarifImportError("MALFORMED_RUN", "SARIF physicalLocation must be an object.");
        const artifact = (physical as Record<string, unknown>).artifactLocation;
        if (artifact === undefined) continue;
        if (!artifact || typeof artifact !== "object" || Array.isArray(artifact)) throw new SarifImportError("MALFORMED_RUN", "SARIF artifactLocation must be an object.");
        const uri = (artifact as Record<string, unknown>).uri;
        if (uri === undefined) continue;
        if (typeof uri !== "string" || !uri) throw new SarifImportError("MALFORMED_URI", "SARIF artifact URI must be a non-empty string.");
        try { const parsed = new URL(uri); if (parsed.protocol !== "https:" || parsed.username || parsed.password) throw new Error(); }
        catch { if (uri.startsWith("/") || uri.split("/").includes("..") || /^[A-Za-z]:[\\/]/.test(uri)) throw new SarifImportError("MALFORMED_URI", "SARIF artifact URI is unsafe."); }
      }
    }
  }
  return { format: "sarif", version: "2.1.0", sourceDigest: imported.sourceDigest, runs: runs as Record<string, unknown>[], document };
}
