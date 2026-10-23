import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const run = promisify(execFile);
const root = fileURLToPath(new URL("..", import.meta.url));
const cliManifest = JSON.parse(await readFile(join(root, "packages/cli/package.json"), "utf8"));
if (typeof cliManifest.version !== "string" || cliManifest.version.length === 0) throw new Error("CLI package version is required for SBOM metadata");
const { stdout } = await run("node", [join(root, "scripts/license-inventory.mjs")], { cwd: root, maxBuffer: 16 * 1024 * 1024 });
const inventory = JSON.parse(stdout);
const components = [];
for (const entry of inventory.packages ?? []) {
  for (const version of entry.versions ?? []) {
    components.push({
      type: "library",
      "bom-ref": `pkg:npm/${entry.name}@${version}`,
      name: entry.name,
      version,
      scope: entry.scope === "direct" ? "required" : "optional",
      licenses: [{ license: { id: entry.declaredLicense } }],
      ...(entry.source ? { externalReferences: [{ type: "distribution", url: entry.source }] } : {}),
      properties: [{ name: "verglos:redistribution-class", value: entry.redistributionClass }],
    });
  }
}
for (const entry of inventory.bundledComponents ?? []) {
  components.push({
    type: "library",
    "bom-ref": `pkg:npm/${entry.name}@${entry.version}?verglos-bundled-by=${encodeURIComponent(entry.bundledBy)}`,
    name: entry.name,
    version: entry.version,
    scope: "optional",
    licenses: [{ license: { id: entry.declaredLicense } }],
    ...(entry.source ? { externalReferences: [{ type: "distribution", url: entry.source }] } : {}),
    properties: [
      { name: "verglos:scope", value: "bundled" },
      { name: "verglos:bundled-by", value: entry.bundledBy },
      { name: "verglos:redistribution-class", value: entry.redistributionClass },
    ],
  });
}
components.sort((a, b) => a["bom-ref"].localeCompare(b["bom-ref"]));
const bom = {
  bomFormat: "CycloneDX",
  specVersion: "1.5",
  version: 1,
  metadata: { component: { type: "application", name: "verglos-monorepo", version: cliManifest.version } },
  components,
};
const output = `${JSON.stringify(bom, null, 2)}\n`;
if (process.argv.includes("--write")) await writeFile(join(root, "SBOM.cdx.json"), output, { encoding: "utf8", mode: 0o644 });
process.stdout.write(output);
