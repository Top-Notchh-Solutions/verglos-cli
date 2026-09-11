import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const run = promisify(execFile);
const root = new URL("..", import.meta.url).pathname;
const { stdout } = await run("pnpm", ["licenses", "list", "--json"], { cwd: root, maxBuffer: 16 * 1024 * 1024 });
const grouped = JSON.parse(stdout);
const entries = [];
for (const [license, packages] of Object.entries(grouped ?? {})) {
  if (!Array.isArray(packages)) continue;
  for (const item of packages) {
    if (!item || typeof item !== "object" || typeof item.name !== "string") continue;
    const versions = Array.isArray(item.versions) ? item.versions.filter((v) => typeof v === "string").sort() : [];
    const packagePath = typeof item.paths?.[0] === "string" ? item.paths[0] : undefined;
    if (packagePath) {
      try {
        const manifest = JSON.parse(await readFile(join(packagePath, "package.json"), "utf8"));
        if (Array.isArray(manifest.os) || Array.isArray(manifest.cpu)) continue;
      } catch {
        // Missing package metadata remains visible through the license entry.
      }
    }
    let text = "";
    if (packagePath) {
      for (const candidate of ["LICENSE", "LICENSE.md", "LICENSE.txt", "NOTICE", "NOTICE.txt"]) {
        try {
          const candidatePath = join(packagePath, candidate);
          const stat = await readFile(candidatePath, "utf8");
          if (Buffer.byteLength(stat, "utf8") <= 512 * 1024) {
            text = stat.trim();
            if (text) break;
          }
        } catch {
          // A package may declare a license without shipping a text file.
        }
      }
    }
    entries.push({ name: item.name, versions, license: typeof license === "string" ? license : "UNKNOWN", homepage: typeof item.homepage === "string" ? item.homepage : "", text });
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
  lines.push(entry.text || "License text was not present in the installed package; consult the upstream source before redistribution.");
  lines.push("");
}
const output = `${lines.join("\n").replaceAll(/[ \t]+\n/g, "\n").trimEnd()}\n`;
if (process.argv.includes("--write")) await writeFile(join(root, "THIRD_PARTY_NOTICES"), output, { encoding: "utf8", mode: 0o644 });
process.stdout.write(output);
