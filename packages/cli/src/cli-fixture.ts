import { spawn } from "node:child_process";
import { readdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";

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
  // Node's Windows ESM loader requires file URLs for TypeScript entrypoints
  // when the tsx loader is injected. Convert only the repository CLI entry;
  // user-supplied fixture paths must remain ordinary filesystem arguments.
  const normalizedArgs = process.platform === "win32"
    ? args.map((arg, index) => {
      const previous = args[index - 1];
      const isLoader = previous === "--import";
      const isCliEntry = /[\\/]src[\\/]index\.ts$/.test(arg);
      return (isLoader || isCliEntry) && /^[A-Za-z]:[\\/]/.test(arg) ? pathToFileURL(arg).href : arg;
    })
    : [...args];
  const result = await new Promise<{ exitCode: number; stdout: string; stderr: string; timedOut: boolean }>((resolve, reject) => {
    const child = spawn(command, normalizedArgs, { cwd, env: options.env ? { ...process.env, ...options.env } : process.env, stdio: ["ignore", "pipe", "pipe"] }); let stdout = ""; let stderr = ""; let timedOut = false;
    const timeout = options.timeoutMs === undefined ? undefined : setTimeout(() => { timedOut = true; child.kill("SIGTERM"); }, options.timeoutMs);
    child.stdout.on("data", (chunk) => { stdout += chunk; }); child.stderr.on("data", (chunk) => { stderr += chunk; }); child.once("error", reject); child.once("close", (code) => { if (timeout) clearTimeout(timeout); resolve({ exitCode: code ?? 1, stdout, stderr, timedOut }); });
  });
  const after = await readdir(cwd); return { ...result, files: after.filter((file) => !before.has(file)).sort() };
}
