import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { resolve } from "node:path";

const PUBLIC_PACKAGE_DIRS = [
  "packages/shared",
  "packages/scanner",
  "packages/reporter",
  "packages/mcp",
  "packages/entitlement",
  "packages/cli",
];

export function parseReleaseTag(value) {
  if (typeof value !== "string" || !/^v\d+\.\d+\.\d+(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/u.test(value)) {
    throw new Error("release tag must be an exact vMAJOR.MINOR.PATCH[(-prerelease)] tag");
  }
  return value.slice(1);
}

export async function verifyReleaseTag(root, tag) {
  const version = parseReleaseTag(tag);
  const versions = [];
  for (const directory of PUBLIC_PACKAGE_DIRS) {
    const packageJson = JSON.parse(await readFile(join(root, directory, "package.json"), "utf8"));
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
  const result = await verifyReleaseTag(process.cwd(), tag);
  console.log(`release tag ${result.tag} matches ${result.packages.length} public package versions (${result.version})`);
}
