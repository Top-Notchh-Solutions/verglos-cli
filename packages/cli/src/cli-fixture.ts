import { spawn } from "node:child_process";
import { readdir } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";

const cliEntryPath = fileURLToPath(new URL("./index.ts", import.meta.url));

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
  // tsx's Windows resolver accepts forward-slash drive paths, while raw
  // backslash paths can be interpreted as URL schemes by Node's ESM loader.
  // Convert only loader/CLI entry arguments; fixture paths remain unchanged.
  const canonicalArgs = args.map((arg) => /[\\/]src[\\/]index\.ts$/.test(arg) ? cliEntryPath : arg);
  const normalizedArgs = process.platform === "win32"
    ? canonicalArgs.map((arg, index) => {
      const previous = canonicalArgs[index - 1];
      const isLoader = previous === "--import";
      const isCliEntry = /[\\/]src[\\/]index\.ts$/.test(arg);
      if (!/^[A-Za-z]:[\\/]/.test(arg)) return arg;
      // Node requires an URL for --import on Windows. The CLI entry is
      // consumed by tsx itself, which accepts a normalized drive path.
      if (isLoader) return pathToFileURL(arg).href;
      return isCliEntry ? arg.replaceAll("\\", "/") : arg;
    })
    : canonicalArgs;
  const result = await new Promise<{ exitCode: number; stdout: string; stderr: string; timedOut: boolean }>((resolve, reject) => {
    const child = spawn(command, normalizedArgs, { cwd, env: options.env ? { ...process.env, ...options.env } : process.env, stdio: ["ignore", "pipe", "pipe"] }); let stdout = ""; let stderr = ""; let timedOut = false;
    const timeout = options.timeoutMs === undefined ? undefined : setTimeout(() => { timedOut = true; child.kill("SIGTERM"); }, options.timeoutMs);
    child.stdout.on("data", (chunk) => { stdout += chunk; }); child.stderr.on("data", (chunk) => { stderr += chunk; }); child.once("error", reject); child.once("close", (code) => { if (timeout) clearTimeout(timeout); resolve({ exitCode: code ?? 1, stdout, stderr, timedOut }); });
  });
  const after = await readdir(cwd); return { ...result, files: after.filter((file) => !before.has(file)).sort() };
}
