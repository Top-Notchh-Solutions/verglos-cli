import { createHash } from "node:crypto";
import { lstat, readFile, readdir } from "node:fs/promises";
import { basename, join, resolve } from "node:path";

const root = resolve(process.argv[2] ?? "");
if (!process.argv[2]) throw new Error("release artifact directory is required");

const checksumsPath = join(root, "SHA256SUMS");
if (!(await lstat(root)).isDirectory()) throw new Error("release artifact root must be a directory");
if (!(await lstat(checksumsPath)).isFile()) throw new Error("SHA256SUMS must be a regular file");
const checksums = await readFile(checksumsPath, "utf8");
const expected = new Map();
for (const line of checksums.split(/\r?\n/).filter(Boolean)) {
  const match = /^(?<digest>[a-f0-9]{64})  \*?(?:\.\/)?(?<name>[A-Za-z0-9._-]+)$/.exec(line);
  if (!match) throw new Error(`invalid checksum entry: ${line}`);
  if (expected.has(match.groups.name)) throw new Error(`duplicate checksum entry: ${match.groups.name}`);
  expected.set(match.groups.name, match.groups.digest);
}
const archives = (await readdir(root)).filter((name) => name.endsWith(".tgz")).sort();
if (archives.length === 0) throw new Error("release artifact directory contains no npm archives");
for (const name of archives) {
  if (!(await lstat(join(root, name))).isFile()) throw new Error(`release artifact is not a regular file: ${name}`);
}
if (expected.size !== archives.length || archives.some((name) => !expected.has(name))) {
  throw new Error("SHA256SUMS does not describe exactly the archived release artifacts");
}
for (const name of archives) {
  const digest = createHash("sha256").update(await readFile(join(root, name))).digest("hex");
  if (digest !== expected.get(name)) throw new Error(`checksum mismatch: ${basename(name)}`);
}
for (const name of ["THIRD_PARTY_NOTICES", "SBOM.cdx.json", "SBOM.spdx.json"]) {
  const path = join(root, name);
  try {
    if (!(await lstat(path)).isFile()) throw new Error(`${name} must be a regular file`);
    const content = await readFile(path, "utf8");
    if (content.length === 0) throw new Error(`${name} must not be empty`);
    if (name === "THIRD_PARTY_NOTICES" && !content.startsWith("THIRD-PARTY NOTICES\n")) throw new Error("THIRD_PARTY_NOTICES has an invalid header");
    if (name === "SBOM.cdx.json") {
      const bom = JSON.parse(content);
      if (bom.bomFormat !== "CycloneDX" || !Array.isArray(bom.components) || bom.components.length === 0) throw new Error("SBOM.cdx.json has an invalid CycloneDX shape");
    }
    if (name === "SBOM.spdx.json") {
      const doc = JSON.parse(content);
      if (doc.spdxVersion !== "SPDX-2.3" || !Array.isArray(doc.packages) || doc.packages.length === 0) throw new Error("SBOM.spdx.json has an invalid SPDX shape");
    }
  } catch (error) {
    if (error instanceof SyntaxError) throw new Error(`${name} is not valid JSON`);
    if (error instanceof Error && /must be|invalid|not be empty/.test(error.message)) throw error;
  }
}
console.log(`verified ${archives.length} release artifact checksums`);
