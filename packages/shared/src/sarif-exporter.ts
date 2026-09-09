import { canonicalizeJson } from "./schema.js";

export interface SarifExportFinding { readonly ruleId: string; readonly message: string; readonly level?: "error" | "warning" | "note"; readonly uri?: string; readonly startLine?: number; readonly subjectId: string; readonly decision?: string; }
export function exportSarif(findings: readonly SarifExportFinding[], toolVersion = "1.0.0"): string {
  const results = findings.map((finding) => ({ ruleId: finding.ruleId, level: finding.level ?? "warning", message: { text: finding.message.slice(0, 4096) }, ...(finding.uri ? { locations: [{ physicalLocation: { artifactLocation: { uri: finding.uri }, ...(finding.startLine ? { region: { startLine: finding.startLine } } : {}) } }] } : {}), properties: { "verglos.subjectId": finding.subjectId, ...(finding.decision ? { "verglos.decision": finding.decision } : {}) } }));
  return canonicalizeJson({ version: "2.1.0", $schema: "https://json.schemastore.org/sarif-2.1.0.json", runs: [{ tool: { driver: { name: "Verglos", version: toolVersion } }, results }] });
}
