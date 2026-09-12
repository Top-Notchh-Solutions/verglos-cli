import { execFile } from "node:child_process";
import { lstat, readFile, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { posix } from "node:path";
import { auditPackageSurface, auditPublicPackageSet, isForbiddenPublicPackagePath } from "./package-surface-audit.mjs";

const run = promisify(execFile);
const root = resolve(process.argv[2] ?? "");
const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
const authoritativeLicense = await readFile(join(repositoryRoot, "LICENSE"));
if (!process.argv[2]) throw new Error("packed artifact directory is required");
if (!(await lstat(root)).isDirectory()) throw new Error("packed artifact root must be a directory");
const archives = (await readdir(root)).filter((name) => name.endsWith(".tgz")).sort();
if (archives.length === 0) throw new Error("packed artifact directory contains no npm archives");
const manifests = [];
const failures = [];

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
  manifests.push(manifest);
  const { stdout: listing } = await run("tar", ["-tzf", archive], { maxBuffer: 8 * 1024 * 1024 });
  const packageFiles = [];
  const seenMembers = new Set();
  for (const rawPath of listing.split(/\r?\n/u).filter(Boolean)) {
    const isDirectory = rawPath.endsWith("/");
    const path = rawPath.replaceAll("\\", "/").replace(/\/$/u, "");
    if (path === "package") continue;
    if (!path.startsWith("package/")) {
      failures.push(`${name}: archive entry is outside package/: ${path}`);
      continue;
    }
    const member = path.slice("package/".length);
    if (!member || member.startsWith("/") || posix.normalize(member) !== member || member.split("/").includes("..")) {
      failures.push(`${name}: archive contains unsafe member path ${path}`);
      continue;
    }
    if (seenMembers.has(member)) failures.push(`${name}: archive repeats member path ${member}`);
    seenMembers.add(member);
    if (isForbiddenPublicPackagePath(member)) failures.push(`${name}: forbidden packaged path ${member}`);
    if (!isDirectory) packageFiles.push(member);
  }
  failures.push(...auditPackageSurface(manifest, packageFiles));
  if (Object.values({ ...manifest.dependencies, ...manifest.optionalDependencies }).some((value) => typeof value === "string" && value.startsWith("workspace:"))) {
    failures.push(`${name}: packed artifact contains an unresolved workspace dependency`);
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
failures.push(...auditPublicPackageSet(manifests));
if (failures.length) throw new Error(failures.join("\n"));
console.log(`packed manifest audit passed for ${archives.length} npm archives`);
