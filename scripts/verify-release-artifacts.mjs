import { createHash } from "node:crypto";
import { lstat, readdir } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import { validateExternalLicenseRecords } from "./external-license-records.mjs";
import { extractArchiveMemberFromBytes, MAX_RELEASE_ARTIFACT_BYTES, readArchiveManifest, readBoundedRegularFile } from "./release-artifact-files.mjs";

const root = resolve(process.argv[2] ?? "");
if (!process.argv[2]) throw new Error("release artifact directory is required");
const requireSevenPublicPackages = process.argv.includes("--require-seven");
const EXPECTED_PUBLIC_PACKAGES = new Set([
  "verglos",
  "@verglos/shared",
  "@verglos/scanner",
  "@verglos/reporter",
  "@verglos/mcp",
  "@verglos/entitlement",
  "@verglos/hunt",
]);

const checksumsPath = join(root, "SHA256SUMS");
if (!(await lstat(root)).isDirectory()) throw new Error("release artifact root must be a directory");
if (!(await lstat(checksumsPath)).isFile()) throw new Error("SHA256SUMS must be a regular file");
const checksums = (await readBoundedRegularFile(checksumsPath, MAX_RELEASE_ARTIFACT_BYTES, "SHA256SUMS")).toString("utf8");
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
if (requireSevenPublicPackages) {
  if (archives.length !== EXPECTED_PUBLIC_PACKAGES.size) throw new Error(`strict release requires exactly ${EXPECTED_PUBLIC_PACKAGES.size} public npm archives`);
  const archiveManifests = [];
  for (const archive of archives) {
    archiveManifests.push((await readArchiveManifest(join(root, archive), `release archive ${archive}`)).manifest);
  }
  const names = new Set(archiveManifests.map((manifest) => manifest.name));
  const missing = [...EXPECTED_PUBLIC_PACKAGES].filter((name) => !names.has(name));
  const unexpected = [...names].filter((name) => !EXPECTED_PUBLIC_PACKAGES.has(name));
  if (missing.length || unexpected.length) throw new Error(`strict release package set mismatch: missing=${missing.join(",") || "none"}; unexpected=${unexpected.join(",") || "none"}`);
  const versions = new Set(archiveManifests.map((manifest) => manifest.version));
  if (versions.size !== 1 || [...versions][0] === undefined) throw new Error("strict release packages must share one version");
}
const requiredSidecars = ["THIRD_PARTY_NOTICES", "SBOM.cdx.json", "SBOM.spdx.json", "dependency-license-inventory.json", "external-license-records.json", "clean-consumer-verification.txt", "RELEASE_METADATA.json"];
for (const name of requiredSidecars) if (!files.includes(name)) throw new Error(`release artifact directory is missing ${name}`);
if (files.some((name) => !name.endsWith(".tgz") && !requiredSidecars.includes(name))) throw new Error("release artifact directory contains an unexpected file");
for (const name of files) {
  if (!(await lstat(join(root, name))).isFile()) throw new Error(`release artifact is not a regular file: ${name}`);
}
if (expected.size !== files.length || files.some((name) => !expected.has(name))) {
  throw new Error("SHA256SUMS does not describe exactly the release artifacts");
}
for (const name of files) {
  const digest = createHash("sha256").update(await readBoundedRegularFile(join(root, name), MAX_RELEASE_ARTIFACT_BYTES, `release artifact ${name}`)).digest("hex");
  if (digest !== expected.get(name)) throw new Error(`checksum mismatch: ${basename(name)}`);
}
const originPath = join(root, "RELEASE_METADATA.json");
let origin;
try { origin = JSON.parse((await readBoundedRegularFile(originPath, MAX_RELEASE_ARTIFACT_BYTES, "RELEASE_METADATA.json")).toString("utf8")); }
catch (error) { if (error instanceof SyntaxError) throw new Error("RELEASE_METADATA.json is not valid JSON"); throw error; }
if (origin.schemaId !== "urn:verglos:artifact:release-origin" || origin.schemaVersion !== 1) throw new Error("RELEASE_METADATA.json has an invalid schema");
if (origin.repository !== "https://github.com/Top-Notchh-Solutions/verglos-cli") throw new Error("RELEASE_METADATA.json has an invalid repository origin");
if (!origin.source || !/^[0-9a-f]{40}$/u.test(origin.source.commit ?? "") || !/^v\d+\.\d+\.\d+(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/u.test(origin.source.tag ?? "")) throw new Error("RELEASE_METADATA.json has an invalid source binding");
if (origin.releaseVersion !== origin.source.tag.slice(1)) throw new Error("RELEASE_METADATA.json release version does not match its tag");
if (!Array.isArray(origin.artifacts) || origin.artifacts.length !== files.length - 1) throw new Error("RELEASE_METADATA.json does not describe the complete artifact set");
const originNames = new Set();
for (const artifact of origin.artifacts) {
  if (!artifact || typeof artifact !== "object" || typeof artifact.name !== "string" || !/^[a-f0-9]{64}$/u.test(artifact.sha256) || !["npm-archive", "release-sidecar"].includes(artifact.kind)) throw new Error("RELEASE_METADATA.json contains an invalid artifact entry");
  if (artifact.name === "RELEASE_METADATA.json" || originNames.has(artifact.name) || !files.includes(artifact.name)) throw new Error("RELEASE_METADATA.json contains an invalid artifact name");
  originNames.add(artifact.name);
  const artifactBytes = await readBoundedRegularFile(join(root, artifact.name), MAX_RELEASE_ARTIFACT_BYTES, `release artifact ${artifact.name}`);
  const digest = createHash("sha256").update(artifactBytes).digest("hex");
  if (digest !== artifact.sha256) throw new Error(`release origin digest mismatch: ${artifact.name}`);
  if (artifact.kind === "npm-archive") {
    const { manifest } = await readArchiveManifest(join(root, artifact.name), `release origin archive ${artifact.name}`);
    if (manifest.name !== artifact.packageName || manifest.version !== artifact.packageVersion || manifest.version !== origin.releaseVersion) throw new Error(`release origin package binding mismatch: ${artifact.name}`);
  }
}
if ([...files].filter((name) => name !== "RELEASE_METADATA.json").some((name) => !originNames.has(name))) throw new Error("RELEASE_METADATA.json omits a release artifact");
for (const name of requiredSidecars) {
  const path = join(root, name);
  try {
    if (!(await lstat(path)).isFile()) throw new Error(`${name} must be a regular file`);
    const content = (await readBoundedRegularFile(path, MAX_RELEASE_ARTIFACT_BYTES, name)).toString("utf8");
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
    if (name === "external-license-records.json") {
      const failures = validateExternalLicenseRecords(JSON.parse(content));
      if (failures.length > 0) throw new Error(`external-license-records.json is invalid: ${failures.join("; ")}`);
    }
    if (name === "clean-consumer-verification.txt" && !/^clean consumer installed 7 archives, imported all libraries, executed Verglos \d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?, confirmed no external engine installation(?:, and executed signed [A-Za-z0-9._-]+ through the bounded [A-Za-z0-9-]+ runtime with an isolated Pro capability fixture)?$/u.test(content.trim())) throw new Error("clean-consumer-verification.txt does not prove the seven-package consumer flow");
    if (name === "RELEASE_METADATA.json" && content.length === 0) throw new Error("RELEASE_METADATA.json must not be empty");
  } catch (error) {
    if (error instanceof SyntaxError) throw new Error(`${name} is not valid JSON`);
    throw error;
  }
}
const expectedNotices = await readBoundedRegularFile(join(root, "THIRD_PARTY_NOTICES"), MAX_RELEASE_ARTIFACT_BYTES, "THIRD_PARTY_NOTICES");
for (const archive of archives) {
  const archiveBytes = await readBoundedRegularFile(join(root, archive), MAX_RELEASE_ARTIFACT_BYTES, `release archive ${archive}`);
  const packagedNotices = await extractArchiveMemberFromBytes(archiveBytes, "package/THIRD_PARTY_NOTICES", `release archive ${archive}`, 16 * 1024 * 1024);
  if (!packagedNotices.equals(expectedNotices)) throw new Error(`THIRD_PARTY_NOTICES differs inside ${archive}`);
}
console.log(`verified ${files.length} release artifacts (${archives.length} npm archives, ${requiredSidecars.length} sidecars, and notices in every archive${requireSevenPublicPackages ? "; strict seven-package set" : ""})`);
