import { createHash } from "node:crypto";
import { constants } from "node:fs";
import { lstat, open, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { MAX_RELEASE_ARTIFACT_BYTES, readArchiveManifest, readBoundedRegularFile } from "./release-artifact-files.mjs";
import { parseReleaseTag } from "./verify-release-tag.mjs";

const EXPECTED_PACKAGES = new Set([
  "verglos",
  "@verglos/shared",
  "@verglos/scanner",
  "@verglos/reporter",
  "@verglos/mcp",
  "@verglos/entitlement",
  "@verglos/hunt",
]);
const REQUIRED_SIDECARS = [
  "THIRD_PARTY_NOTICES",
  "SBOM.cdx.json",
  "SBOM.spdx.json",
  "dependency-license-inventory.json",
  "external-license-records.json",
  "clean-consumer-verification.txt",
  "RELEASE_NOTES.md",
];
const MANIFEST_NAME = "RELEASE_METADATA.json";

const root = resolve(process.argv[2] ?? "");
if (!process.argv[2]) throw new Error("release artifact directory is required");
const sourceCommit = option("--source-commit") ?? process.env.GITHUB_SHA;
const releaseTag = option("--release-tag") ?? process.env.GITHUB_REF_NAME;
if (!/^[0-9a-f]{40}$/u.test(sourceCommit ?? "")) throw new Error("release source commit must be a 40-character hexadecimal SHA");
if (typeof releaseTag !== "string") throw new Error("release tag is required (pass --release-tag or set GITHUB_REF_NAME)");
const releaseVersion = parseReleaseTag(releaseTag);

const entry = await lstat(root);
if (!entry.isDirectory()) throw new Error("release artifact root must be a directory");
const manifestPath = join(root, MANIFEST_NAME);
try {
  const manifestEntry = await lstat(manifestPath);
  if (!manifestEntry.isFile() || manifestEntry.isSymbolicLink()) throw new Error("release origin manifest output must be a regular file");
} catch (error) {
  if (error?.code !== "ENOENT") throw error;
}
const files = (await readdir(root)).sort();
const archives = files.filter((name) => name.endsWith(".tgz"));
if (archives.length !== EXPECTED_PACKAGES.size) throw new Error(`release origin requires exactly ${EXPECTED_PACKAGES.size} npm archives`);
for (const sidecar of REQUIRED_SIDECARS) {
  if (!files.includes(sidecar)) throw new Error(`release origin is missing ${sidecar}`);
}
const unexpected = files.filter((name) => !name.endsWith(".tgz") && !REQUIRED_SIDECARS.includes(name) && name !== MANIFEST_NAME && name !== "SHA256SUMS");
if (unexpected.length > 0) throw new Error(`release origin contains unexpected files: ${unexpected.join(", ")}`);
for (const name of [...archives, ...REQUIRED_SIDECARS]) {
  if (!(await lstat(join(root, name))).isFile()) throw new Error(`release artifact is not a regular file: ${name}`);
}

const archiveEntries = [];
for (const archive of archives) {
  const { manifest } = await readArchiveManifest(join(root, archive), `release archive ${archive}`);
  if (typeof manifest.name !== "string" || !EXPECTED_PACKAGES.has(manifest.name)) throw new Error(`release archive contains an unexpected package: ${archive}`);
  if (manifest.version !== releaseVersion) throw new Error(`release archive version does not match ${releaseTag}: ${archive}`);
  if (archiveEntries.some((entry) => entry.packageName === manifest.name)) throw new Error(`release contains a duplicate package archive: ${manifest.name}`);
  archiveEntries.push({
    kind: "npm-archive",
    name: archive,
    packageName: manifest.name,
    packageVersion: manifest.version,
    sha256: await sha256(join(root, archive)),
  });
}
if (new Set(archiveEntries.map((entry) => entry.packageName)).size !== EXPECTED_PACKAGES.size) throw new Error("release archive package set is incomplete");

const sidecarEntries = await Promise.all(REQUIRED_SIDECARS.map(async (name) => ({
  kind: "release-sidecar",
  name,
  sha256: await sha256(join(root, name)),
})));
const metadata = {
  schemaId: "urn:verglos:artifact:release-origin",
  schemaVersion: 1,
  repository: "https://github.com/Top-Notchh-Solutions/verglos-cli",
  source: { commit: sourceCommit, tag: releaseTag },
  releaseVersion,
  artifacts: [...archiveEntries, ...sidecarEntries].sort((left, right) => left.name.localeCompare(right.name)),
  ...(process.env.GITHUB_RUN_ID && /^\d+$/u.test(process.env.GITHUB_RUN_ID) ? { workflowRunId: process.env.GITHUB_RUN_ID } : {}),
};
const outputHandle = await open(manifestPath, constants.O_WRONLY | constants.O_CREAT | constants.O_TRUNC | (constants.O_NOFOLLOW ?? 0), 0o644);
try {
  await outputHandle.writeFile(`${JSON.stringify(metadata, null, 2)}\n`, "utf8");
} finally {
  await outputHandle.close();
}
console.log(`wrote ${MANIFEST_NAME} for ${releaseTag} at ${sourceCommit}`);

function option(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

async function sha256(path) {
  return createHash("sha256").update(await readBoundedRegularFile(path, MAX_RELEASE_ARTIFACT_BYTES, `release artifact ${path}`)).digest("hex");
}
