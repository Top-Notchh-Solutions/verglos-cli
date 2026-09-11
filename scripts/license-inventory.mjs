import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const run = promisify(execFile);
const root = new URL("..", import.meta.url).pathname;
const workspaceRoot = join(root, "packages");

const direct = new Set();
for (const packageDir of await readdir(workspaceRoot, { withFileTypes: true })) {
  if (!packageDir.isDirectory()) continue;
  try {
    const manifest = JSON.parse(await readFile(join(workspaceRoot, packageDir.name, "package.json"), "utf8"));
    for (const field of ["dependencies", "optionalDependencies", "devDependencies"]) {
      for (const name of Object.keys(manifest[field] ?? {})) direct.add(name);
    }
  } catch {
    // Non-package directories are ignored; package manifests are validated elsewhere.
  }
}

const { stdout } = await run("pnpm", ["licenses", "list", "--json"], { cwd: root, maxBuffer: 16 * 1024 * 1024 });
const grouped = JSON.parse(stdout);
if (!grouped || typeof grouped !== "object" || Array.isArray(grouped)) throw new Error("pnpm license output is not an object");

const permissive = /^(?:MIT|Apache-2\.0|BSD(?:-\d-Clause)?|ISC|0BSD|Unlicense|CC0-1\.0)$/i;
const copyleft = /(?:GPL|AGPL|LGPL|MPL|EPL|CDDL|CPL|OSL)/i;
const entries = [];
for (const [declaredKey, packages] of Object.entries(grouped)) {
  if (!Array.isArray(packages)) throw new Error(`pnpm license output group '${declaredKey}' is not an array`);
  for (const item of packages) {
    if (!item || typeof item !== "object" || typeof item.name !== "string" || typeof item.license !== "string") continue;
    if (typeof item.paths?.[0] === "string") {
      try {
        const manifest = JSON.parse(await readFile(join(item.paths[0], "package.json"), "utf8"));
        if (Array.isArray(manifest.os) || Array.isArray(manifest.cpu)) continue;
      } catch {
        // Missing package metadata remains visible for review rather than silently dropping it.
      }
    }
    const license = item.license.trim();
    const redistributionClass = permissive.test(license) ? "permissive" : copyleft.test(license) ? "copyleft" : "unknown";
    entries.push({
      name: item.name,
      versions: Array.isArray(item.versions) ? [...item.versions].filter((v) => typeof v === "string").sort() : [],
      scope: direct.has(item.name) ? "direct" : "transitive",
      declaredLicense: license,
      detectedLicense: typeof declaredKey === "string" && declaredKey !== license ? declaredKey : license,
      source: typeof item.homepage === "string" ? item.homepage : undefined,
      redistributionClass,
      noticeObligation: redistributionClass === "permissive" ? "retain-license-and-notice" : "review-required",
      reviewBlocker: redistributionClass !== "permissive",
    });
  }
}
entries.sort((a, b) => a.name.localeCompare(b.name) || a.versions.join(",").localeCompare(b.versions.join(",")));
const result = {
  schemaId: "urn:verglos:artifact:dependency-license-inventory",
  schemaVersion: "1.0.0",
  generatedBy: "verglos-cli",
  packages: entries,
  reviewBlockers: entries.filter((entry) => entry.reviewBlocker).map((entry) => ({ name: entry.name, license: entry.declaredLicense })),
};
if (process.argv.includes("--check") && result.reviewBlockers.length > 0) {
  console.error(`dependency license review required for ${result.reviewBlockers.length} package(s)`);
  process.exitCode = 2;
}
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
