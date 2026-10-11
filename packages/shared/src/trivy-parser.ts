import { createHash } from "node:crypto";
import { RelativeSubjectPathSchema } from "./subject.js";

export interface TrivyObservation { readonly ruleId: string; readonly title: string; readonly severity: "critical" | "high" | "medium" | "low" | "info" | "unknown"; readonly target?: string; readonly packageName?: string; readonly installedVersion?: string; readonly fixedVersion?: string; readonly rawEvidenceDigest: `sha256:${string}`; }
export interface ParsedTrivyFinding {
  readonly kind: "vulnerability" | "misconfiguration" | "secret";
  readonly ruleId: string;
  readonly title: string;
  readonly severity: TrivyObservation["severity"];
  readonly target?: string;
  readonly startLine?: number;
  readonly packageName?: string;
  readonly installedVersion?: string;
  readonly fixedVersion?: string;
  readonly rawEvidenceDigest: `sha256:${string}`;
}
export interface ParsedTrivyOutput { readonly findings: readonly ParsedTrivyFinding[]; readonly omittedCount: number; }
export class TrivyParseError extends Error { override readonly name = "TrivyParseError"; constructor(readonly code: "TOO_LARGE" | "MALFORMED" | "UNSUPPORTED", message: string) { super(message); } }

const SEVERITIES = ["critical", "high", "medium", "low", "info"] as const;
const RULE_ID = /^[A-Za-z0-9][A-Za-z0-9._:/-]{0,255}$/u;

function boundedText(value: unknown, max: number): string | undefined {
  return typeof value === "string" && value.length > 0 && value.length <= max && !/[\u0000-\u001f\u007f]/u.test(value) ? value : undefined;
}

function severity(value: unknown): TrivyObservation["severity"] {
  const normalized = typeof value === "string" ? value.toLowerCase() : "";
  return (SEVERITIES as readonly string[]).includes(normalized) ? normalized as TrivyObservation["severity"] : "unknown";
}

function safeTarget(value: unknown): string | undefined {
  if (typeof value !== "string" || value === ".") return undefined;
  let decoded: string;
  try { decoded = decodeURIComponent(value); } catch { return undefined; }
  return RelativeSubjectPathSchema.safeParse(decoded).success ? decoded : undefined;
}

function object(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : undefined;
}

export function parseTrivyFindings(raw: Uint8Array, limits: { maxBytes?: number; maxResults?: number } = {}): ParsedTrivyOutput {
  const maxBytes = limits.maxBytes ?? 32 * 1024 * 1024;
  const maxResults = limits.maxResults ?? 100_000;
  if (raw.byteLength > maxBytes) throw new TrivyParseError("TOO_LARGE", "Trivy output exceeds the parser limit.");
  let document: unknown;
  try { document = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(raw)); }
  catch { throw new TrivyParseError("MALFORMED", "Trivy output is not valid UTF-8 JSON."); }
  const root = object(document);
  if (!root || !Array.isArray(root.Results)) throw new TrivyParseError("UNSUPPORTED", "Trivy output does not contain a supported Results array.");

  const outputDigest = `sha256:${createHash("sha256").update(raw).digest("hex")}` as const;
  const findings: ParsedTrivyFinding[] = [];
  let examined = 0;
  let omittedCount = 0;
  const add = (kind: ParsedTrivyFinding["kind"], resultValue: unknown, findingValue: unknown) => {
    if (++examined > maxResults) throw new TrivyParseError("TOO_LARGE", "Trivy output exceeds the finding limit.");
    const result = object(resultValue);
    const value = object(findingValue);
    if (!result || !value) { omittedCount++; return; }
    const ruleId = boundedText(kind === "vulnerability" ? value.VulnerabilityID : kind === "misconfiguration" ? value.ID : value.RuleID, 256);
    if (!ruleId || !RULE_ID.test(ruleId)) { omittedCount++; return; }
    const title = boundedText(value.Title, 512) ?? ruleId;
    const target = safeTarget(result.Target);
    let startLine: number | undefined;
    if (kind !== "vulnerability") {
      const cause = object(value.CauseMetadata);
      const line = cause?.StartLine ?? value.StartLine;
      if (Number.isSafeInteger(line) && Number(line) > 0) startLine = Number(line);
      if (!target || startLine === undefined) { omittedCount++; return; }
    }
    const packageName = kind === "vulnerability" ? boundedText(value.PkgName, 512) : undefined;
    if (kind === "vulnerability" && !packageName) { omittedCount++; return; }
    const installedVersion = kind === "vulnerability" ? boundedText(value.InstalledVersion, 512) : undefined;
    if (kind === "vulnerability" && !installedVersion) { omittedCount++; return; }
    findings.push(Object.freeze({
      kind,
      ruleId,
      title,
      severity: severity(value.Severity),
      ...(target ? { target } : {}),
      ...(startLine ? { startLine } : {}),
      ...(packageName ? { packageName } : {}),
      ...(installedVersion ? { installedVersion } : {}),
      ...(kind === "vulnerability" && boundedText(value.FixedVersion, 512) ? { fixedVersion: boundedText(value.FixedVersion, 512)! } : {}),
      rawEvidenceDigest: outputDigest,
    }));
  };

  for (const resultValue of root.Results) {
    const result = object(resultValue);
    if (!result) { omittedCount++; continue; }
    for (const [property, kind] of [["Vulnerabilities", "vulnerability"], ["Misconfigurations", "misconfiguration"], ["Secrets", "secret"]] as const) {
      const values = result[property];
      if (values === undefined || values === null) continue;
      if (!Array.isArray(values)) throw new TrivyParseError("UNSUPPORTED", `Trivy ${property} output is malformed.`);
      for (const value of values) add(kind, result, value);
    }
  }
  return Object.freeze({ findings: Object.freeze(findings), omittedCount });
}

export function parseTrivyJson(raw: Uint8Array, limits: { maxBytes?: number; maxResults?: number } = {}): readonly TrivyObservation[] {
  return Object.freeze(parseTrivyFindings(raw, limits).findings.filter((finding) => finding.kind === "vulnerability").map((finding) => ({
    ruleId: finding.ruleId,
    title: finding.title,
    severity: finding.severity,
    ...(finding.target ? { target: finding.target } : {}),
    ...(finding.packageName ? { packageName: finding.packageName } : {}),
    ...(finding.installedVersion ? { installedVersion: finding.installedVersion } : {}),
    ...(finding.fixedVersion ? { fixedVersion: finding.fixedVersion } : {}),
    rawEvidenceDigest: finding.rawEvidenceDigest,
  })));
}
