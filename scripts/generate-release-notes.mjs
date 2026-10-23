import { constants } from "node:fs";
import { lstat, open, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { MAX_RELEASE_ARTIFACT_BYTES, readArchiveManifest } from "./release-artifact-files.mjs";
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

const root = resolve(process.argv[2] ?? "");
if (!process.argv[2]) throw new Error("release artifact directory is required");
const sourceCommit = option("--source-commit") ?? process.env.GITHUB_SHA;
const releaseTag = option("--release-tag") ?? process.env.GITHUB_REF_NAME;
if (!/^[0-9a-f]{40}$/u.test(sourceCommit ?? "")) throw new Error("release source commit must be a 40-character hexadecimal SHA");
if (typeof releaseTag !== "string") throw new Error("release tag is required (pass --release-tag or set GITHUB_REF_NAME)");
const releaseVersion = parseReleaseTag(releaseTag);

const rootEntry = await lstat(root);
if (!rootEntry.isDirectory() || rootEntry.isSymbolicLink()) throw new Error("release artifact directory must be a regular directory");
const archives = (await readdir(root)).filter((name) => name.endsWith(".tgz")).sort();
if (archives.length !== EXPECTED_PACKAGES.size) throw new Error(`release notes require exactly ${EXPECTED_PACKAGES.size} npm archives`);

const packages = [];
for (const archive of archives) {
  const { manifest } = await readArchiveManifest(join(root, archive), `release archive ${archive}`);
  if (!EXPECTED_PACKAGES.has(manifest.name)) throw new Error(`release notes contain an unexpected package: ${manifest.name}`);
  if (manifest.version !== releaseVersion) throw new Error(`release archive version does not match ${releaseTag}: ${archive}`);
  if (packages.some((entry) => entry.name === manifest.name)) throw new Error(`release notes contain a duplicate package: ${manifest.name}`);
  packages.push({ name: manifest.name, version: manifest.version });
}
if (new Set(packages.map((entry) => entry.name)).size !== EXPECTED_PACKAGES.size) throw new Error("release notes package set is incomplete");
packages.sort((left, right) => left.name.localeCompare(right.name));

const outputPath = join(root, "RELEASE_NOTES.md");
try {
  const outputEntry = await lstat(outputPath);
  if (!outputEntry.isFile() || outputEntry.isSymbolicLink()) throw new Error("release notes output must be a regular file");
} catch (error) {
  if (error?.code !== "ENOENT") throw error;
}

const notes = [
  `# Verglos ${releaseTag}`,
  "",
  `Release version: ${releaseVersion}`,
  `Release tag: ${releaseTag}`,
  `Source commit: ${sourceCommit}`,
  "",
  "## Package set",
  "",
  ...packages.map((entry) => `- \`${entry.name}@${entry.version}\``),
  "",
  "## Artifact and provenance boundary",
  "",
  "The protected publication workflow uses npm trusted publishing with GitHub OIDC provenance.",
  "This file describes the release candidate's source and package set; it is not a security certification, customer endorsement, or independent review.",
  "",
].join("\n");

const outputHandle = await open(
  outputPath,
  constants.O_WRONLY | constants.O_CREAT | constants.O_TRUNC | (constants.O_NOFOLLOW ?? 0),
  0o644,
);
try {
  const bytes = Buffer.byteLength(notes, "utf8");
  if (bytes > MAX_RELEASE_ARTIFACT_BYTES) throw new Error("release notes exceed the artifact size limit");
  await outputHandle.writeFile(notes, "utf8");
} finally {
  await outputHandle.close();
}
console.log(`wrote RELEASE_NOTES.md for ${releaseTag} at ${sourceCommit}`);

function option(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}
