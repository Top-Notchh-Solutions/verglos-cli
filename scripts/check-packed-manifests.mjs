import { execFile } from "node:child_process";
import { lstat, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);
const root = resolve(process.argv[2] ?? "");
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
}
console.log(`packed manifest audit passed for ${archives.length} npm archives`);
