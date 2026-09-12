import { execFile } from "node:child_process";
import { mkdtemp, readdir, rm, writeFile, lstat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);
const archiveRoot = resolve(process.argv[2] ?? "");
if (!process.argv[2]) throw new Error("release archive directory is required");
const rootStat = await lstat(archiveRoot);
if (!rootStat.isDirectory()) throw new Error("release archive path must be a directory");

const expectedPackages = [
  { name: "verglos", matches: (archive) => /^verglos-\d+\.\d+\.\d+[^/]*\.tgz$/.test(archive) },
  ...["shared", "scanner", "reporter", "mcp", "entitlement"].map((name) => ({ name: `@verglos/${name}`, matches: (archive) => archive.startsWith(`verglos-${name}-`) })),
];
const archives = (await readdir(archiveRoot)).filter((name) => name.endsWith(".tgz")).sort();
if (archives.length !== expectedPackages.length) throw new Error(`expected ${expectedPackages.length} package archives, received ${archives.length}`);
for (const packageInfo of expectedPackages) {
  if (archives.filter(packageInfo.matches).length !== 1) throw new Error(`release must contain exactly one ${packageInfo.name} archive`);
}
for (const name of archives) {
  if (!(await lstat(join(archiveRoot, name))).isFile()) throw new Error(`package archive must be a regular file: ${name}`);
}

const consumer = await mkdtemp(join(tmpdir(), "verglos-clean-consumer-"));
try {
  await writeFile(join(consumer, "package.json"), JSON.stringify({ name: "verglos-release-consumer", private: true, version: "1.0.0" }));
  const paths = archives.map((name) => join(archiveRoot, name));
  await run("npm", ["install", "--ignore-scripts", "--no-audit", "--no-fund", "--no-package-lock", ...paths], { cwd: consumer, timeout: 180_000, maxBuffer: 8 * 1024 * 1024 });
  const cli = join(consumer, "node_modules", "verglos", "dist", "index.js");
  const result = await run(process.execPath, [cli, "--version"], { cwd: consumer, timeout: 15_000, maxBuffer: 1024 * 1024 });
  if (!/^\d+\.\d+\.\d+[^\r\n]*\r?\n?$/.test(result.stdout.trim())) throw new Error("clean consumer CLI did not emit a version");
  await run(process.execPath, ["--input-type=module", "-e", "await Promise.all(['@verglos/shared','@verglos/scanner','@verglos/reporter','@verglos/mcp','@verglos/entitlement'].map((name) => import(name)))"], { cwd: consumer, timeout: 15_000, maxBuffer: 1024 * 1024 });
  const engineCache = join(consumer, "engine-cache");
  const home = join(consumer, "home");
  const isolatedEnv = { ...process.env, VERGLOS_ENGINE_CACHE: engineCache, VERGLOS_DEV_SKIP_UPDATE_CHECK: "1", HOME: home, USERPROFILE: home };
  const engineStatus = await run(process.execPath, [cli, "engines", "status", "--json"], { cwd: consumer, env: isolatedEnv, timeout: 15_000, maxBuffer: 1024 * 1024 });
  const status = JSON.parse(engineStatus.stdout);
  if (!Array.isArray(status.engines) || status.engines.length !== 0) throw new Error("clean consumer unexpectedly discovered an installed external engine");
  try {
    await lstat(engineCache);
    throw new Error("clean consumer created an external-engine cache without an explicit install request");
  } catch (error) {
    if (!(error instanceof Error && "code" in error && error.code === "ENOENT")) throw error;
  }
  console.log(`clean consumer installed ${archives.length} archives, imported all libraries, executed Verglos ${result.stdout.trim()}, and confirmed no external engine installation`);
} finally {
  await rm(consumer, { recursive: true, force: true });
}
