import { createHash } from "node:crypto";

export interface TrivyObservation { readonly ruleId: string; readonly title: string; readonly severity: "critical" | "high" | "medium" | "low" | "info" | "unknown"; readonly target?: string; readonly packageName?: string; readonly installedVersion?: string; readonly fixedVersion?: string; readonly rawEvidenceDigest: `sha256:${string}`; }
export class TrivyParseError extends Error { override readonly name = "TrivyParseError"; constructor(readonly code: "TOO_LARGE" | "MALFORMED" | "UNSUPPORTED", message: string) { super(message); } }

export function parseTrivyJson(raw: Uint8Array, limits: { maxBytes?: number; maxResults?: number } = {}): readonly TrivyObservation[] {
  const maxBytes = limits.maxBytes ?? 32 * 1024 * 1024; const maxResults = limits.maxResults ?? 100_000;
  if (raw.byteLength > maxBytes) throw new TrivyParseError("TOO_LARGE", "Trivy output exceeds the parser limit.");
  let document: unknown; try { document = JSON.parse(new TextDecoder().decode(raw)); } catch { throw new TrivyParseError("MALFORMED", "Trivy output is not valid JSON."); }
  if (!document || typeof document !== "object" || !Array.isArray((document as { Results?: unknown }).Results)) throw new TrivyParseError("UNSUPPORTED", "Trivy output does not contain a supported Results array.");
  const outputDigest = `sha256:${createHash("sha256").update(raw).digest("hex")}` as const; const findings: TrivyObservation[] = [];
  for (const result of (document as { Results: unknown[] }).Results) {
    if (!result || typeof result !== "object") continue;
    const vulnerabilities = (result as { Vulnerabilities?: unknown }).Vulnerabilities;
    if (!Array.isArray(vulnerabilities)) continue;
    for (const item of vulnerabilities) {
      if (!item || typeof item !== "object") continue;
      const value = item as Record<string, unknown>; const ruleId = typeof value.VulnerabilityID === "string" ? value.VulnerabilityID : undefined;
      if (!ruleId) continue;
      const severity = typeof value.Severity === "string" ? value.Severity.toLowerCase() : "unknown";
      findings.push({ ruleId, title: typeof value.Title === "string" && value.Title ? value.Title.slice(0, 512) : ruleId, severity: (["critical", "high", "medium", "low", "info"] as const).includes(severity as never) ? severity as TrivyObservation["severity"] : "unknown", ...(typeof (result as Record<string, unknown>).Target === "string" ? { target: String((result as Record<string, unknown>).Target).slice(0, 1024) } : {}), ...(typeof value.PkgName === "string" ? { packageName: value.PkgName.slice(0, 512) } : {}), ...(typeof value.InstalledVersion === "string" ? { installedVersion: value.InstalledVersion.slice(0, 512) } : {}), ...(typeof value.FixedVersion === "string" ? { fixedVersion: value.FixedVersion.slice(0, 512) } : {}), rawEvidenceDigest: outputDigest });
      if (findings.length > maxResults) throw new TrivyParseError("TOO_LARGE", "Trivy output exceeds the finding limit.");
    }
  }
  return Object.freeze(findings);
}
