import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { resolve } from "node:path";
import { MAX_RELEASE_ARTIFACT_BYTES, readBoundedRegularFile } from "./release-artifact-files.mjs";

const PUBLIC_PACKAGE_DIRS = [
  "packages/shared",
  "packages/scanner",
  "packages/reporter",
  "packages/mcp",
  "packages/entitlement",
  "packages/hunt",
  "packages/cli",
];
const COMMIT = /^[a-f0-9]{40}$/iu;

export function parseReleaseTag(value) {
  if (typeof value !== "string" || !/^v\d+\.\d+\.\d+(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/u.test(value)) {
    throw new Error("release tag must be an exact vMAJOR.MINOR.PATCH[(-prerelease)] tag");
  }
  return value.slice(1);
}

/** Bind the GitHub tag event to the exact commit resolved by checkout. */
export function verifyReleaseCommitBinding(sourceCommit, resolvedTagCommit) {
  if (typeof sourceCommit !== "string" || typeof resolvedTagCommit !== "string" || !COMMIT.test(sourceCommit) || !COMMIT.test(resolvedTagCommit)) {
    throw new Error("release source and tag commits must be 40-character hexadecimal SHAs");
  }
  const source = sourceCommit.toLowerCase();
  const tag = resolvedTagCommit.toLowerCase();
  if (source !== tag) throw new Error(`release tag resolves to ${tag}, but GitHub dispatched ${source}`);
  return Object.freeze({ sourceCommit: source, resolvedTagCommit: tag });
}

async function readPackageManifest(root, directory) {
  const bytes = await readBoundedRegularFile(
    join(root, directory, "package.json"),
    MAX_RELEASE_ARTIFACT_BYTES,
    `${directory} package manifest`,
  );
  return JSON.parse(bytes.toString("utf8"));
}

export async function verifyReleaseTag(root, tag) {
  const version = parseReleaseTag(tag);
  const versions = [];
  for (const directory of PUBLIC_PACKAGE_DIRS) {
    const packageJson = await readPackageManifest(root, directory);
    if (typeof packageJson.version !== "string") throw new Error(`${directory} has no package version`);
    versions.push({ directory, version: packageJson.version });
  }
  const mismatches = versions.filter((entry) => entry.version !== version);
  if (mismatches.length > 0) {
    throw new Error(`release tag ${tag} does not match package versions: ${mismatches.map((entry) => `${entry.directory}=${entry.version}`).join(", ")}`);
  }
  return Object.freeze({ tag, version, packages: Object.freeze(versions) });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const tag = process.argv[2] ?? process.env.GITHUB_REF_NAME;
  if (!tag) throw new Error("release tag is required (pass it or set GITHUB_REF_NAME)");
  const sourceCommit = process.argv[3] ?? process.env.GITHUB_SHA;
  const resolvedTagCommit = process.argv[4] ?? process.env.GITHUB_TAG_COMMIT;
  if (sourceCommit !== undefined || resolvedTagCommit !== undefined) {
    if (sourceCommit === undefined || resolvedTagCommit === undefined) throw new Error("release source and tag commits are both required");
    verifyReleaseCommitBinding(sourceCommit, resolvedTagCommit);
  }
  const result = await verifyReleaseTag(process.cwd(), tag);
  console.log(`release tag ${result.tag} matches ${result.packages.length} public package versions (${result.version})`);
}
