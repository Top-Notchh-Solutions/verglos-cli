import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { validateExternalLicenseRecordsFile } from "./external-license-records.mjs";
import { readPackageLicenseTexts } from "./package-license-text.mjs";

const run = promisify(execFile);
const root = fileURLToPath(new URL("..", import.meta.url));
const externalLicenseRecords = await validateExternalLicenseRecordsFile(process.env.VERGLOS_EXTERNAL_LICENSE_RECORDS_PATH);
// Windows exposes pnpm through a .cmd shim; Node's direct child-process
// launcher does not resolve that shim when given the bare command name.
// Keep the invocation explicit so release packaging works on every supported
// platform, including the Windows consumer matrix.
const pnpmCommand = process.platform === "win32" ? "pnpm.cmd" : "pnpm";

function packageSource(manifest) {
  if (typeof manifest.homepage === "string" && manifest.homepage.trim()) return manifest.homepage.trim();
  if (typeof manifest.repository === "string" && manifest.repository.trim()) return manifest.repository.trim();
  if (manifest.repository && typeof manifest.repository.url === "string" && manifest.repository.url.trim()) return manifest.repository.url.trim();
  return "";
}

async function collectLocalLicenseGroups() {
  const virtualStore = join(root, "node_modules", ".pnpm");
  const records = new Map();
  const stores = await readdir(virtualStore, { withFileTypes: true });
  for (const store of stores) {
    if (!store.isDirectory()) continue;
    const moduleRoot = join(virtualStore, store.name, "node_modules");
    const children = await readdir(moduleRoot, { withFileTypes: true }).catch((error) => {
      if (error?.code === "ENOENT") return [];
      throw error;
    });
    for (const child of children) {
      if (child.name.startsWith(".")) continue;
      const packageRoots = child.name.startsWith("@")
        ? (await readdir(join(moduleRoot, child.name), { withFileTypes: true }))
          .filter((entry) => entry.isDirectory())
          .map((entry) => join(moduleRoot, child.name, entry.name))
        : [join(moduleRoot, child.name)];
      for (const packagePath of packageRoots) {
        let manifest;
        try { manifest = JSON.parse(await readFile(join(packagePath, "package.json"), "utf8")); }
        catch (error) {
          if (error?.code === "ENOENT") continue;
          throw new Error(`Cannot read installed package manifest at '${packagePath}': ${error.message}`);
        }
        if (typeof manifest.name !== "string" || typeof manifest.version !== "string") continue;
        const key = `${manifest.name}@${manifest.version}`;
        const record = records.get(key) ?? {
          name: manifest.name,
          version: manifest.version,
          license: typeof manifest.license === "string" ? manifest.license.trim() : "UNKNOWN",
          homepage: packageSource(manifest),
          paths: [],
        };
        if (record.license !== (typeof manifest.license === "string" ? manifest.license.trim() : "UNKNOWN") || record.homepage !== packageSource(manifest)) {
          throw new Error(`Conflicting installed license metadata for '${key}'`);
        }
        if (!record.paths.includes(packagePath)) record.paths.push(packagePath);
        records.set(key, record);
      }
    }
  }
  const grouped = new Map();
  const byLicense = new Map();
  for (const record of records.values()) {
    const license = record.license || "UNKNOWN";
    const key = `${license}\0${record.name}\0${record.homepage}`;
    const item = grouped.get(key) ?? { name: record.name, versions: [], paths: [], homepage: record.homepage };
    item.versions.push(record.version);
    item.paths.push(...record.paths);
    grouped.set(key, item);
    const licenseItems = byLicense.get(license) ?? [];
    if (!licenseItems.includes(item)) licenseItems.push(item);
    byLicense.set(license, licenseItems);
  }
  return Object.fromEntries(byLicense);
}

let grouped;
if (process.env.VERGLOS_NOTICE_FORCE_LOCAL_SCAN === "1") {
  grouped = await collectLocalLicenseGroups();
} else {
  try {
    const { stdout } = await run(pnpmCommand, ["licenses", "list", "--json"], {
      cwd: root,
      maxBuffer: 16 * 1024 * 1024,
      timeout: 120_000,
      killSignal: "SIGKILL",
      shell: process.platform === "win32",
    });
    grouped = JSON.parse(stdout);
  } catch {
    // pnpm's license command depends on a package-index file in its global
    // store. The installed virtual store already contains the exact package
    // manifests and paths needed for notices, so fall back to that local
    // evidence while preserving the same fail-closed license text handling.
    grouped = await collectLocalLicenseGroups();
  }
}
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
lines.push("EXTERNAL ENGINE AND CONTENT RECORDS");
lines.push("");
lines.push("This section records bounded provenance and public-distribution facts for external engines, imported formats, fixtures, and signed recipe content. It does not assert legal clearance or reproduce upstream license text.");
lines.push(`Legal clearance: ${externalLicenseRecords.legalClearance}`);
lines.push(`External engines bundled: ${externalLicenseRecords.distributionPolicy.externalEnginesBundled ? "yes" : "no"}`);
lines.push(`Runtime downloads: ${externalLicenseRecords.distributionPolicy.runtimeDownloads ? "yes" : "no"}`);
lines.push(`Recipe content bundled in npm: ${externalLicenseRecords.distributionPolicy.recipeContentBundledInNpm ? "yes" : "no"}`);
lines.push("");
for (const record of externalLicenseRecords.records) {
  lines.push("================================================================================");
  lines.push(`${record.id} — ${record.identity}`);
  lines.push(`Kind: ${record.kind}`);
  lines.push(`Version policy: ${record.versionPolicy}`);
  lines.push(`License: ${record.license.spdxId}`);
  lines.push(`License source: ${record.license.licenseUrl}`);
  lines.push(`Source: ${record.sourceUrl}`);
  if (record.sourcePath) lines.push(`Source path: ${record.sourcePath}`);
  if (record.immutableReference) lines.push(`Immutable reference: ${record.immutableReference}`);
  lines.push(`Modification: ${record.modification}`);
  lines.push(`Public distribution: ${record.publicDistribution}`);
  lines.push(`Trademark: ${record.trademarkNotice}`);
  lines.push(`Legal review: ${record.legalReview}`);
  lines.push("");
}
const output = `${lines.join("\n").replaceAll(/[ \t]+\n/g, "\n").trimEnd()}\n`;
if (process.argv.includes("--write")) await writeFile(join(root, "THIRD_PARTY_NOTICES"), output, { encoding: "utf8", mode: 0o644 });
process.stdout.write(output);
