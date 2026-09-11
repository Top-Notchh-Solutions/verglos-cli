import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";

const run = promisify(execFile);
const root = new URL("..", import.meta.url).pathname;
const { stdout } = await run("node", [join(root, "scripts/license-inventory.mjs")], { cwd: root, maxBuffer: 16 * 1024 * 1024 });
const inventory = JSON.parse(stdout);
const packages = [];
for (const entry of inventory.packages ?? []) for (const version of entry.versions ?? []) {
  const id = `SPDXRef-Package-${Buffer.from(`${entry.name}@${version}`).toString("base64url")}`;
  packages.push({ SPDXID: id, name: entry.name, versionInfo: version, downloadLocation: entry.source || "NOASSERTION", licenseConcluded: entry.declaredLicense, licenseDeclared: entry.declaredLicense, filesAnalyzed: false, primaryPackagePurpose: "LIBRARY", externalRefs: [{ referenceCategory: "PACKAGE-MANAGER", referenceType: "purl", referenceLocator: `pkg:npm/${entry.name}@${version}` }] });
}
packages.sort((a, b) => a.SPDXID.localeCompare(b.SPDXID));
const doc = { SPDXID: "SPDXRef-DOCUMENT", spdxVersion: "SPDX-2.3", creationInfo: { created: "1970-01-01T00:00:00Z", creators: ["Tool: verglos-license-tools"] }, name: "verglos-monorepo", documentNamespace: "https://verglos.com/spdx/verglos-monorepo-2.0.0-alpha.1", packages };
const output = `${JSON.stringify(doc, null, 2)}\n`;
if (process.argv.includes("--write")) await writeFile(join(root, "SBOM.spdx.json"), output, { encoding: "utf8", mode: 0o644 });
process.stdout.write(output);
