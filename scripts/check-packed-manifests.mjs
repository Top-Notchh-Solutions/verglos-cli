import { execFile } from "node:child_process";
import { lstat, readFile, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const run = promisify(execFile);
const root = resolve(process.argv[2] ?? "");
const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
const authoritativeLicense = await readFile(join(repositoryRoot, "LICENSE"));
if (!process.argv[2]) throw new Error("packed artifact directory is required");
if (!(await lstat(root)).isDirectory()) throw new Error("packed artifact root must be a directory");
const archives = (await readdir(root)).filter((name) => name.endsWith(".tgz")).sort();
if (archives.length === 0) throw new Error("packed artifact directory contains no npm archives");

for (const name of archives) {
  const archive = join(root, name);
  if (!(await lstat(archive)).isFile()) throw new Error(`packed artifact is not a regular file: ${name}`);
  let manifest;
  try {
    const { stdout } = await run("tar", ["-xOf", archive, "package/package.json"]);
    manifest = JSON.parse(stdout);
  } catch {
    throw new Error(`packed artifact has no valid package manifest: ${name}`);
  }
  const dependencies = { ...manifest.dependencies, ...manifest.optionalDependencies };
  if (Object.values(dependencies).some((value) => typeof value === "string" && value.startsWith("workspace:"))) {
    throw new Error(`packed artifact contains unresolved workspace dependency: ${name}`);
  }
  if (manifest.name === "verglos" && (manifest.bin?.verglos !== "./dist/index.js" || Object.keys(manifest.bin ?? {}).length !== 1)) {
    throw new Error("packed CLI manifest must expose exactly one verglos bin at ./dist/index.js");
  }
  if (!manifest.license) throw new Error(`packed artifact has no license declaration: ${name}`);
  let packedLicense;
  try {
    const { stdout } = await run("tar", ["-xOf", archive, "package/LICENSE"], { encoding: "buffer", maxBuffer: 1024 * 1024 });
    packedLicense = stdout;
  } catch {
    throw new Error(`packed artifact has no LICENSE file: ${name}`);
  }
  if (!Buffer.from(packedLicense).equals(authoritativeLicense)) throw new Error(`packed artifact LICENSE differs from the repository license: ${name}`);
}
console.log(`packed manifest audit passed for ${archives.length} npm archives`);
