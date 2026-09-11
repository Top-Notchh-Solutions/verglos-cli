import { spawn } from "node:child_process";
import { readdir } from "node:fs/promises";

export interface CliFixtureOptions {
  readonly timeoutMs?: number;
  readonly env?: NodeJS.ProcessEnv;
}

export async function runCliFixture(
  command: string,
  args: readonly string[],
  cwd: string,
  options: CliFixtureOptions = {},
): Promise<{ exitCode: number; stdout: string; stderr: string; files: readonly string[]; timedOut: boolean }> {
  const before = new Set(await readdir(cwd));
  const result = await new Promise<{ exitCode: number; stdout: string; stderr: string; timedOut: boolean }>((resolve, reject) => {
    const child = spawn(command, [...args], { cwd, env: options.env ? { ...process.env, ...options.env } : process.env, stdio: ["ignore", "pipe", "pipe"] }); let stdout = ""; let stderr = ""; let timedOut = false;
    const timeout = options.timeoutMs === undefined ? undefined : setTimeout(() => { timedOut = true; child.kill("SIGTERM"); }, options.timeoutMs);
    child.stdout.on("data", (chunk) => { stdout += chunk; }); child.stderr.on("data", (chunk) => { stderr += chunk; }); child.once("error", reject); child.once("close", (code) => { if (timeout) clearTimeout(timeout); resolve({ exitCode: code ?? 1, stdout, stderr, timedOut }); });
  });
  const after = await readdir(cwd); return { ...result, files: after.filter((file) => !before.has(file)).sort() };
}
