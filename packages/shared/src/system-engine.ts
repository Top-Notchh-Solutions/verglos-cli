import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { lstat, readFile } from "node:fs/promises";
import { isAbsolute } from "node:path";
import { tmpdir } from "node:os";
import { promisify } from "node:util";
const execFileAsync = promisify(execFile);
const MAX_SYSTEM_ENGINE_BYTES = 256 * 1024 * 1024;
const MAX_PROBE_OUTPUT_BYTES = 256 * 1024;
const PROBE_TIMEOUT_MS = 5_000;

const TRIVY_CAPABILITY_PROBES = [
  { id: "filesystem", args: ["fs", "--help"], outputNames: ["trivy fs", "trivy filesystem"] },
  { id: "repository", args: ["repo", "--help"], outputNames: ["trivy repo", "trivy repository"] },
  { id: "image", args: ["image", "--help"], outputNames: ["trivy image"] },
  { id: "configuration", args: ["config", "--help"], outputNames: ["trivy config"] },
  { id: "sbom", args: ["sbom", "--help"], outputNames: ["trivy sbom"] },
] as const;

export interface SystemEngineProbeResult { readonly stdout: string | Uint8Array; }
export type SystemEngineProbe = (path: string, args: readonly string[], options: { readonly timeoutMs: number; readonly maxOutputBytes: number }) => Promise<SystemEngineProbeResult>;
export interface SystemEngineInspectionOptions { readonly probe?: SystemEngineProbe; }

export interface SystemEngineInspection {
  readonly path: string;
  readonly version: string;
  readonly digest: { readonly algorithm: "sha256"; readonly value: string };
  readonly trust: "computed-only" | "unavailable";
  readonly capabilities: readonly string[];
  readonly unsupportedCapabilities: readonly string[];
  readonly state: "capabilities-confirmed" | "partial" | "unavailable";
  readonly limitations: readonly string[];
}
export class SystemEngineError extends Error { override readonly name = "SystemEngineError"; constructor(readonly code: "PATH_REQUIRED" | "NOT_EXECUTABLE" | "UNAVAILABLE" | "BINARY_CHANGED", message: string) { super(message); } }

const defaultProbe: SystemEngineProbe = async (path, args, options) => {
  const result = await execFileAsync(path, [...args], {
    encoding: "buffer",
    timeout: options.timeoutMs,
    maxBuffer: options.maxOutputBytes,
    cwd: tmpdir(),
    env: {},
  });
  return { stdout: result.stdout };
};

function outputBytes(result: SystemEngineProbeResult): Uint8Array {
  return typeof result.stdout === "string" ? Buffer.from(result.stdout, "utf8") : result.stdout;
}

function outputText(result: SystemEngineProbeResult): string {
  return new TextDecoder("utf-8", { fatal: true }).decode(outputBytes(result));
}

async function readSystemBinary(path: string): Promise<{ bytes: Buffer; identity: string }> {
  const stat = await lstat(path);
  if (!stat.isFile() || stat.size > MAX_SYSTEM_ENGINE_BYTES) throw new Error("not a bounded regular file");
  const bytes = await readFile(path);
  if (bytes.byteLength > MAX_SYSTEM_ENGINE_BYTES) throw new Error("not a bounded regular file");
  return { bytes, identity: `${stat.dev}:${stat.ino}:${stat.size}:${stat.mtimeMs}` };
}

export async function inspectSystemEngine(path: string, options: SystemEngineInspectionOptions = {}): Promise<SystemEngineInspection> {
  if (!path || !isAbsolute(path)) throw new SystemEngineError("PATH_REQUIRED", "System engine mode requires an explicit absolute executable path.");
  let initial: Awaited<ReturnType<typeof readSystemBinary>>;
  try { initial = await readSystemBinary(path); }
  catch { throw new SystemEngineError("NOT_EXECUTABLE", "Explicit system engine path is not a readable regular file."); }
  const digest = { algorithm: "sha256" as const, value: createHash("sha256").update(initial.bytes).digest("hex") };
  const probe = options.probe ?? defaultProbe;
  const limitations: string[] = [];
  let version = "unavailable";
  let identifiedAsTrivy = false;
  try {
    const rootHelpResult = await probe(path, ["--help"], { timeoutMs: PROBE_TIMEOUT_MS, maxOutputBytes: MAX_PROBE_OUTPUT_BYTES });
    if (outputBytes(rootHelpResult).byteLength > MAX_PROBE_OUTPUT_BYTES) throw new Error("probe output exceeds the limit");
    const rootHelp = outputText(rootHelpResult).toLowerCase();
    if (!/\busage\b/u.test(rootHelp) || !rootHelp.includes("trivy")) throw new Error("explicit binary is not identified as a Trivy CLI");
    identifiedAsTrivy = true;
  } catch {
    limitations.push("explicit binary did not identify as a Trivy CLI in bounded --help output");
  }
  if (identifiedAsTrivy) {
    try {
      const result = await probe(path, ["--version"], { timeoutMs: PROBE_TIMEOUT_MS, maxOutputBytes: MAX_PROBE_OUTPUT_BYTES });
      if (outputBytes(result).byteLength > MAX_PROBE_OUTPUT_BYTES) throw new Error("probe output exceeds the limit");
      const response = outputText(result).trim();
      const match = /(?:^|\s)v?(\d+\.\d+\.\d+)(?:\s|$)/u.exec(response);
      version = match?.[1] ?? "unknown";
    } catch {
      limitations.push("explicit engine did not return a bounded --version response");
    }
  }
  const capabilities: string[] = [];
  const unsupportedCapabilities: string[] = [];
  if (version !== "unavailable" && version !== "unknown") {
    for (const capability of TRIVY_CAPABILITY_PROBES) {
      try {
        const result = await probe(path, capability.args, { timeoutMs: PROBE_TIMEOUT_MS, maxOutputBytes: MAX_PROBE_OUTPUT_BYTES });
        const bytes = outputBytes(result);
        if (bytes.byteLength > MAX_PROBE_OUTPUT_BYTES) throw new Error("probe output exceeds the limit");
        const help = outputText(result);
        const normalizedHelp = help.toLowerCase();
        if (!/\busage\b/iu.test(help) || !capability.outputNames.some((name) => normalizedHelp.includes(name))) throw new Error("capability probe did not identify the expected Trivy command");
        capabilities.push(capability.id);
      } catch {
        unsupportedCapabilities.push(capability.id);
      }
    }
  } else {
    unsupportedCapabilities.push(...TRIVY_CAPABILITY_PROBES.map(({ id }) => id));
  }
  let final: Awaited<ReturnType<typeof readSystemBinary>>;
  try { final = await readSystemBinary(path); }
  catch { throw new SystemEngineError("BINARY_CHANGED", "Explicit system engine changed during capability inspection."); }
  if (final.identity !== initial.identity || createHash("sha256").update(final.bytes).digest("hex") !== digest.value) {
    throw new SystemEngineError("BINARY_CHANGED", "Explicit system engine changed during capability inspection.");
  }
  if (version === "unavailable" || version === "unknown") limitations.push("engine version is unavailable or unrecognized");
  if (unsupportedCapabilities.length > 0) limitations.push("one or more Trivy command capabilities were not confirmed by bounded help probes");
  limitations.push("system-engine trust is computed-only; content digest does not establish publisher identity or provenance");
  const state = version === "unavailable" || version === "unknown"
    ? "unavailable"
    : unsupportedCapabilities.length === 0 ? "capabilities-confirmed" : "partial";
  return Object.freeze({
    path,
    version,
    digest,
    trust: state === "unavailable" ? "unavailable" : "computed-only",
    capabilities: Object.freeze(capabilities),
    unsupportedCapabilities: Object.freeze(unsupportedCapabilities),
    state,
    limitations: Object.freeze(limitations),
  });
}
