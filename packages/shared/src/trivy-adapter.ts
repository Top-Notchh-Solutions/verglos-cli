import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { parseEngineHealth, type EngineHealthDocument } from "./engine.js";
import type { EngineAdapter, EngineExecutionRequest, EngineExecutionResult, EngineRawOutput } from "./engine-adapter.js";
import { assertEngineRequestBound } from "./engine-adapter.js";

export type TrivyTargetKind = "repository-tree" | "filesystem" | "artifact" | "iac" | "sbom" | "oci-manifest" | "oci-index";
export interface TrivyExecutionProfile { readonly targetKind: TrivyTargetKind; readonly command: "fs" | "image" | "repo" | "config" | "sbom"; readonly args: readonly string[]; readonly executesTargetCode: false; }
export interface TrivyProcessResult { readonly stdout: string | Uint8Array; readonly stderr?: string | Uint8Array; }
export interface TrivyProcessOptions { readonly executable?: string; readonly timeoutMs?: number; readonly maxOutputBytes?: number; readonly run?: (executable: string, args: readonly string[], options: { readonly timeout: number; readonly maxBuffer: number }) => Promise<TrivyProcessResult>; }
export interface TrivyRawOutput { readonly mediaType: "application/json"; readonly bytes: Uint8Array; readonly digest: `sha256:${string}`; readonly redacted: false; }

export function trivyExecutionProfile(targetKind: TrivyTargetKind, subjectId: string): TrivyExecutionProfile {
  if (!subjectId || subjectId.length > 256 || /[\u0000\r\n]/u.test(subjectId)) throw new Error("Trivy subject identity is required and bounded.");
  const command = targetKind === "oci-manifest" || targetKind === "oci-index" ? "image" : targetKind === "repository-tree" ? "repo" : targetKind === "iac" ? "config" : targetKind === "sbom" ? "sbom" : "fs";
  const scanners = targetKind === "iac" ? "misconfig,secret" : targetKind === "sbom" ? "vuln" : "vuln,misconfig,secret";
  return Object.freeze({ targetKind, command, args: Object.freeze([command, "--format", "json", "--scanners", scanners, "--input", subjectId]), executesTargetCode: false as const });
}

const execFileAsync = promisify(execFile);
const digest = (value: string) => createHash("sha256").update(value, "utf8").digest("hex");
const digestBytes = (value: Uint8Array) => `sha256:${createHash("sha256").update(value).digest("hex")}` as `sha256:${string}`;

export async function executeTrivyProfile(targetKind: TrivyTargetKind, subjectId: string, options: TrivyProcessOptions = {}): Promise<TrivyRawOutput> {
  const profile = trivyExecutionProfile(targetKind, subjectId);
  const timeoutMs = options.timeoutMs ?? 90_000;
  const maxOutputBytes = options.maxOutputBytes ?? 16 * 1024 * 1024;
  if (!Number.isInteger(timeoutMs) || timeoutMs <= 0 || timeoutMs > 90_000) throw new Error("Trivy process timeout must be between 1 and 90000 ms.");
  if (!Number.isInteger(maxOutputBytes) || maxOutputBytes <= 0 || maxOutputBytes > 64 * 1024 * 1024) throw new Error("Trivy output limit must be between 1 and 67108864 bytes.");
  const run = options.run ?? (async (executable, args, processOptions) => {
    const result = await execFileAsync(executable, [...args], { encoding: "buffer", timeout: processOptions.timeout, maxBuffer: processOptions.maxBuffer });
    return { stdout: result.stdout, stderr: result.stderr };
  });
  const result = await run(options.executable ?? "trivy", profile.args, { timeout: timeoutMs, maxBuffer: maxOutputBytes });
  const bytes = typeof result.stdout === "string" ? Buffer.from(result.stdout, "utf8") : Uint8Array.from(result.stdout);
  if (bytes.byteLength > maxOutputBytes) throw new Error("Trivy output exceeds the configured limit.");
  return Object.freeze({ mediaType: "application/json" as const, bytes, digest: digestBytes(bytes), redacted: false as const });
}

export class TrivyAdapter implements EngineAdapter {
  readonly id = "trivy"; readonly version = "1";
  readonly capabilities = [{ id: "trivy.scan", description: "Trivy vulnerability and misconfiguration scan", requiresNetwork: false }] as const;
  readonly requirements = { runtime: "native", executable: "trivy" } as const;
  async health(): Promise<EngineHealthDocument> {
    const observedAt = new Date().toISOString(); let version = "unavailable"; let state: "healthy" | "unavailable" = "unavailable";
    try { const result = await execFileAsync("trivy", ["--version"], { encoding: "utf8", timeout: 5_000 }); version = result.stdout.trim().slice(0, 128) || "unknown"; state = "healthy"; } catch { /* explicit unavailable state below */ }
    return parseEngineHealth({ schemaId: "urn:verglos:schema:engine-health", schemaVersion: "1.0.0", producer: { id: "trivy", kind: "external", name: "Trivy", version }, observedAt, state, components: [{ id: "trivy.binary", kind: "binary", name: "trivy", version, digest: { algorithm: "sha256", value: digest(version) }, source: "system", trust: "computed-only" }], capabilities: [{ id: "trivy.scan", subjectKinds: ["repository-tree", "filesystem", "artifact", "oci-manifest", "oci-index"], status: state === "healthy" ? "supported" : "unsupported" }], freshness: [{ componentId: "trivy.binary", status: "unknown", checkedAt: observedAt }], incompleteReasons: state === "healthy" ? [] : [{ code: "engine-missing", scope: "trivy.binary", message: "Trivy executable is unavailable.", action: "Install or configure a managed Trivy engine." }] });
  }
  async execute(request: EngineExecutionRequest): Promise<EngineExecutionResult> { assertEngineRequestBound(request); throw new Error("Trivy execution is not enabled until the managed process boundary is qualified."); }
  normalize(_raw: EngineRawOutput) { return []; }
  updateMetadata() { return { channel: "managed" as "stable", source: "system", digest: undefined }; }
}

export const trivyAdapter = new TrivyAdapter();
