import { gunzipSync } from "node:zlib";
import { lstat, readFile, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { posix } from "node:path";
import { auditPackageSurface, auditPublicPackageSet, isForbiddenPublicPackagePath } from "./package-surface-audit.mjs";

const root = resolve(process.argv[2] ?? "");
const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));

function readTarEntries(archiveBytes) {
  const tar = gunzipSync(archiveBytes);
  const entries = [];
  for (let offset = 0; offset + 512 <= tar.length;) {
    const header = tar.subarray(offset, offset + 512);
    if (header.every((byte) => byte === 0)) break;
    const name = header.subarray(0, 100).toString("utf8").replace(/\0.*$/u, "");
    const prefix = header.subarray(345, 500).toString("utf8").replace(/\0.*$/u, "");
    const fullName = prefix ? `${prefix}/${name}` : name;
    const sizeText = header.subarray(124, 136).toString("ascii").replace(/\0.*$/u, "").trim();
    const size = sizeText ? Number.parseInt(sizeText, 8) : 0;
    if (!Number.isSafeInteger(size) || size < 0) throw new Error(`invalid tar member size for ${fullName}`);
    const dataStart = offset + 512;
    const dataEnd = dataStart + size;
    if (dataEnd > tar.length) throw new Error(`truncated tar member ${fullName}`);
    entries.push({ name: fullName, type: String.fromCharCode(header[156] || 0), data: tar.subarray(dataStart, dataEnd) });
    offset = dataStart + Math.ceil(size / 512) * 512;
  }
  return entries;
}
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
  const entries = readTarEntries(await readFile(archive));
  let manifest;
  try {
    const packageManifest = entries.find((entry) => entry.name === "package/package.json");
    if (!packageManifest) throw new Error("package manifest missing");
    manifest = JSON.parse(packageManifest.data.toString("utf8").replace(/^\uFEFF/u, ""));
  } catch {
    throw new Error(`packed artifact has no valid package manifest: ${name}`);
  }
  manifests.push(manifest);
  const packageFiles = [];
  const seenMembers = new Set();
  for (const entry of entries) {
    const isDirectory = entry.type === "5" || entry.name.endsWith("/");
    const path = entry.name.replaceAll("\\", "/").replace(/\/$/u, "");
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
  const licenseEntry = entries.find((entry) => entry.name === "package/LICENSE");
  if (!licenseEntry) {
    throw new Error(`packed artifact has no LICENSE file: ${name}`);
  }
  if (!licenseEntry.data.equals(authoritativeLicense)) throw new Error(`packed artifact LICENSE differs from the repository license: ${name}`);
}
failures.push(...auditPublicPackageSet(manifests));
if (failures.length) throw new Error(failures.join("\n"));
console.log(`packed manifest audit passed for ${archives.length} npm archives`);
