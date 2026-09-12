import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { readPackageLicenseTexts } from "./package-license-text.mjs";

const run = promisify(execFile);
const root = fileURLToPath(new URL("..", import.meta.url));
const { stdout } = await run("pnpm", ["licenses", "list", "--json"], { cwd: root, maxBuffer: 16 * 1024 * 1024, timeout: 120_000, killSignal: "SIGKILL" });
const grouped = JSON.parse(stdout);
const entries = [];
for (const [license, packages] of Object.entries(grouped ?? {})) {
  if (!Array.isArray(packages)) continue;
  for (const item of packages) {
    if (!item || typeof item !== "object" || typeof item.name !== "string") continue;
    const versions = Array.isArray(item.versions) ? item.versions.filter((v) => typeof v === "string").sort() : [];
    const packagePaths = Array.isArray(item.paths) ? item.paths.filter((path) => typeof path === "string") : [];
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
entries.sort((a, b) => a.name.localeCompare(b.name) || a.versions.join(",").localeCompare(b.versions.join(",")));
const lines = [
  "THIRD-PARTY NOTICES",
  "",
  "This file is generated from the installed dependency graph. It preserves upstream identity and available license text; it does not imply endorsement or alter upstream terms.",
  "",
];
for (const entry of entries) {
  lines.push(`================================================================================`);
  lines.push(`${entry.name}${entry.versions.length ? ` (${entry.versions.join(", ")})` : ""}`);
  lines.push(`License: ${entry.license}`);
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
