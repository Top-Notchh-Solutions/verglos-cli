import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { readPackageLicenseTexts } from "./package-license-text.mjs";

const run = promisify(execFile);
const root = fileURLToPath(new URL("..", import.meta.url));
const { stdout } = await run("pnpm", ["licenses", "list", "--json"], { cwd: root, maxBuffer: 16 * 1024 * 1024, timeout: 120_000, killSignal: "SIGKILL" });
const grouped = JSON.parse(stdout);
const entries = [];
const packageLocations = new Map();
for (const [license, packages] of Object.entries(grouped ?? {})) {
  if (!Array.isArray(packages)) continue;
  for (const item of packages) {
    if (!item || typeof item !== "object" || typeof item.name !== "string") continue;
    const versions = Array.isArray(item.versions) ? item.versions.filter((v) => typeof v === "string").sort() : [];
    const packagePaths = Array.isArray(item.paths) ? item.paths.filter((path) => typeof path === "string") : [];
    for (const version of versions) packageLocations.set(`${item.name}@${version}`, packagePaths);
    // OS/CPU-specific packages are retained: they are part of the supported
    // installation matrix and require notices when selected by a consumer.
    let texts = [];
    if (packagePaths.length > 0) {
      try { texts = await readPackageLicenseTexts(packagePaths); }
      catch { texts = [{ kind: "License", file: "", text: "[not included: package license metadata could not be read; review required]" }]; }
    }
    entries.push({ name: item.name, versions, license: typeof license === "string" ? license : "UNKNOWN", homepage: typeof item.homepage === "string" ? item.homepage : "", texts });
  }
}
const { stdout: inventoryOutput } = await run(process.execPath, [join(root, "scripts/license-inventory.mjs")], { cwd: root, maxBuffer: 16 * 1024 * 1024 });
const inventory = JSON.parse(inventoryOutput);
for (const item of inventory.bundledComponents ?? []) {
  const parentPaths = packageLocations.get(item.bundledBy) ?? [];
  const nestedPaths = [];
  for (const parentPath of parentPaths) {
    let children;
    try { children = await readdir(parentPath, { withFileTypes: true }); }
    catch { continue; }
    for (const child of children) {
      if (!child.isDirectory() || child.name === "node_modules" || child.name.startsWith(".")) continue;
      const packagePath = join(parentPath, child.name);
      try {
        const manifest = JSON.parse(await readFile(join(packagePath, "package.json"), "utf8"));
        if (manifest.name === item.name && manifest.version === item.version) nestedPaths.push(packagePath);
      } catch (error) {
        if (error?.code !== "ENOENT") throw new Error(`Cannot inspect nested notice package at '${packagePath}': ${error.message}`);
      }
    }
  }
  const texts = nestedPaths.length > 0
    ? await readPackageLicenseTexts(nestedPaths)
    : [{ kind: "License", file: "", text: "[not included: bundled component path could not be located; review required]" }];
  entries.push({
    name: item.name,
    versions: [item.version],
    license: item.declaredLicense,
    homepage: item.source ?? "",
    texts,
    bundledBy: item.bundledBy,
    parentLicense: item.parentDeclaredLicense,
    reviewBlocker: item.reviewBlocker,
    reviewReason: item.reviewReason,
  });
}
entries.sort((a, b) => a.name.localeCompare(b.name) || a.versions.join(",").localeCompare(b.versions.join(",")));
const lines = [
  "THIRD-PARTY NOTICES",
  "",
  "This file is generated from the installed dependency graph and includes nested package manifests found in installed dependencies. It preserves upstream identity and available license text; it does not imply endorsement or alter upstream terms.",
  "",
];
for (const entry of entries) {
  lines.push(`================================================================================`);
  lines.push(`${entry.name}${entry.versions.length ? ` (${entry.versions.join(", ")})` : ""}`);
  if (entry.bundledBy) lines.push(`Bundled by: ${entry.bundledBy}`);
  lines.push(`License: ${entry.license}`);
  if (entry.bundledBy && entry.parentLicense) lines.push(`Containing package declares: ${entry.parentLicense}`);
  if (entry.reviewBlocker) lines.push(`Review blocker: ${entry.reviewReason ?? "explicit license/provenance review required"}.`);
  if (entry.homepage) lines.push(`Source: ${entry.homepage}`);
  lines.push("");
  if (entry.texts.length === 0) lines.push("License text was not present in the installed package; consult the upstream source before redistribution.");
  else for (const text of entry.texts) {
    lines.push(`${text.kind} file: ${text.file || "unavailable"}`);
    lines.push(text.text);
    lines.push("");
  }
  lines.push("");
}
const output = `${lines.join("\n").replaceAll(/[ \t]+\n/g, "\n").trimEnd()}\n`;
if (process.argv.includes("--write")) await writeFile(join(root, "THIRD_PARTY_NOTICES"), output, { encoding: "utf8", mode: 0o644 });
process.stdout.write(output);
