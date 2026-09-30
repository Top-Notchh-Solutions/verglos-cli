import { execFile } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);
const archiveRoot = resolve(process.argv[2] ?? "");
if (!process.argv[2]) throw new Error("release archive directory is required");
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const npmOptions = { shell: process.platform === "win32", timeout: 180_000, maxBuffer: 8 * 1024 * 1024 };
const archiveNames = ["verglos-shared-2.0.0-alpha.1.tgz", "verglos-scanner-2.0.0-alpha.1.tgz", "verglos-reporter-2.0.0-alpha.1.tgz", "verglos-mcp-2.0.0-alpha.1.tgz", "verglos-entitlement-2.0.0-alpha.1.tgz", "verglos-2.0.0-alpha.1.tgz"];
const archives = archiveNames.map((name) => join(archiveRoot, name));
const consumer = await mkdtemp(join(tmpdir(), "verglos-upgrade-rollback-"));
const cli = () => join(consumer, "node_modules", ".bin", process.platform === "win32" ? "verglos.cmd" : "verglos");
async function install(...packages) {
  await run(npmCommand, ["install", "--ignore-scripts", "--no-audit", "--no-fund", ...packages], { ...npmOptions, cwd: consumer });
}
async function version() {
  const result = await run(cli(), ["--version"], { ...npmOptions, cwd: consumer, timeout: 15_000, maxBuffer: 1024 * 1024 });
  return result.stdout.trim();
}
try {
  await writeFile(join(consumer, "package.json"), JSON.stringify({ name: "verglos-transition-consumer", private: true, version: "1.0.0" }));
  await install("verglos@1.8.3");
  const before = await version();
  await install(...archives);
  const upgraded = await version();
  await install("verglos@1.8.3");
  const rolledBack = await version();
  if (before !== "1.8.3" || upgraded !== "2.0.0-alpha.1" || rolledBack !== "1.8.3") {
    throw new Error(`unexpected transition versions: ${before} -> ${upgraded} -> ${rolledBack}`);
  }
  console.log(`upgrade/rollback transition passed: ${before} -> ${upgraded} -> ${rolledBack}`);
} finally {
  await rm(consumer, { recursive: true, force: true });
}
