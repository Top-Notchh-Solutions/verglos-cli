import { spawn } from "node:child_process";
import { readdir } from "node:fs/promises";

export async function runCliFixture(command: string, args: readonly string[], cwd: string): Promise<{ exitCode: number; stdout: string; stderr: string; files: readonly string[] }> {
  const before = new Set(await readdir(cwd));
  const result = await new Promise<{ exitCode: number; stdout: string; stderr: string }>((resolve, reject) => {
    const child = spawn(command, [...args], { cwd, stdio: ["ignore", "pipe", "pipe"] }); let stdout = ""; let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; }); child.stderr.on("data", (chunk) => { stderr += chunk; }); child.once("error", reject); child.once("close", (code) => resolve({ exitCode: code ?? 1, stdout, stderr }));
  });
  const after = await readdir(cwd); return { ...result, files: after.filter((file) => !before.has(file)).sort() };
}
