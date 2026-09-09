import { execFile } from "node:child_process";
import { promisify } from "node:util";
const execFileAsync = promisify(execFile);
export interface DetectSecretsProbe { readonly executable: string; readonly version: string; readonly status: "available" | "unsupported"; readonly limitation?: string; }
export async function probeDetectSecrets(executablePath: string): Promise<DetectSecretsProbe> { if (!executablePath.startsWith("/")) return { executable: executablePath, version: "unknown", status: "unsupported", limitation: "runner requires an explicit absolute executable path" }; try { const result = await execFileAsync(executablePath, ["--version"], { encoding: "utf8", timeout: 5_000 }); return { executable: executablePath, version: result.stdout.trim().slice(0, 128) || "unknown", status: "available" }; } catch { return { executable: executablePath, version: "unavailable", status: "unsupported", limitation: "explicit detect-secrets executable is unavailable" }; } }
