import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { lstat, readFile, readdir } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);

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
const files = (await readdir(root)).filter((name) => name !== "SHA256SUMS").sort();
const archives = files.filter((name) => name.endsWith(".tgz"));
if (archives.length === 0) throw new Error("release artifact directory contains no npm archives");
const requiredSidecars = ["THIRD_PARTY_NOTICES", "SBOM.cdx.json", "SBOM.spdx.json", "dependency-license-inventory.json", "clean-consumer-verification.txt"];
for (const name of requiredSidecars) if (!files.includes(name)) throw new Error(`release artifact directory is missing ${name}`);
if (files.some((name) => !name.endsWith(".tgz") && !requiredSidecars.includes(name))) throw new Error("release artifact directory contains an unexpected file");
for (const name of files) {
  if (!(await lstat(join(root, name))).isFile()) throw new Error(`release artifact is not a regular file: ${name}`);
}
if (expected.size !== files.length || files.some((name) => !expected.has(name))) {
  throw new Error("SHA256SUMS does not describe exactly the release artifacts");
}
for (const name of files) {
  const digest = createHash("sha256").update(await readFile(join(root, name))).digest("hex");
  if (digest !== expected.get(name)) throw new Error(`checksum mismatch: ${basename(name)}`);
}
for (const name of requiredSidecars) {
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
    if (name === "dependency-license-inventory.json") {
      const inventory = JSON.parse(content);
      if (inventory.schemaId !== "urn:verglos:artifact:dependency-license-inventory" || !Array.isArray(inventory.packages) || !Array.isArray(inventory.bundledComponents)) throw new Error("dependency-license-inventory.json has an invalid shape");
      if (!Array.isArray(inventory.reviewBlockers) || inventory.reviewBlockers.length > 0) throw new Error("dependency-license-inventory.json contains unresolved redistribution blockers");
    }
    if (name === "clean-consumer-verification.txt" && !/^clean consumer installed 6 archives and executed Verglos \d+\.\d+\.\d+/u.test(content.trim())) throw new Error("clean-consumer-verification.txt does not prove the six-package consumer flow");
  } catch (error) {
    if (error instanceof SyntaxError) throw new Error(`${name} is not valid JSON`);
    throw error;
  }
}
const expectedNotices = await readFile(join(root, "THIRD_PARTY_NOTICES"));
for (const archive of archives) {
  const { stdout: packagedNotices } = await run("tar", ["-xOf", join(root, archive), "package/THIRD_PARTY_NOTICES"], { encoding: "buffer", maxBuffer: 16 * 1024 * 1024 });
  if (!packagedNotices.equals(expectedNotices)) throw new Error(`THIRD_PARTY_NOTICES differs inside ${archive}`);
}
console.log(`verified ${files.length} release artifacts (${archives.length} npm archives, ${requiredSidecars.length} sidecars, and notices in every archive)`);
