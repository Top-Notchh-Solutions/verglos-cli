import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { lstat, readFile } from "node:fs/promises";
import { promisify } from "node:util";
const execFileAsync = promisify(execFile);
const MAX_SYSTEM_ENGINE_BYTES = 256 * 1024 * 1024;

export interface SystemEngineInspection { readonly path: string; readonly version: string; readonly digest: { readonly algorithm: "sha256"; readonly value: string }; readonly trust: "computed-only" | "unavailable"; readonly limitation?: string; }
export class SystemEngineError extends Error { override readonly name = "SystemEngineError"; constructor(readonly code: "PATH_REQUIRED" | "NOT_EXECUTABLE" | "UNAVAILABLE", message: string) { super(message); } }

export async function inspectSystemEngine(path: string): Promise<SystemEngineInspection> {
  if (!path || !path.startsWith("/")) throw new SystemEngineError("PATH_REQUIRED", "System engine mode requires an explicit absolute executable path.");
  let bytes: Buffer; try { const stat = await lstat(path); if (!stat.isFile() || stat.size > MAX_SYSTEM_ENGINE_BYTES) throw new Error(); bytes = await readFile(path); if (bytes.byteLength > MAX_SYSTEM_ENGINE_BYTES) throw new Error(); } catch { throw new SystemEngineError("NOT_EXECUTABLE", "Explicit system engine path is not a readable file."); }
  const digest = { algorithm: "sha256" as const, value: createHash("sha256").update(bytes).digest("hex") };
  try { const result = await execFileAsync(path, ["--version"], { encoding: "utf8", timeout: 5_000 }); return { path, version: result.stdout.trim().slice(0, 128) || "unknown", digest, trust: "computed-only" }; }
  catch { return { path, version: "unavailable", digest, trust: "unavailable", limitation: "explicit engine did not answer --version" }; }
}
