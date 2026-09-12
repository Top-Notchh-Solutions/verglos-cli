import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const run = promisify(execFile);
const root = fileURLToPath(new URL("..", import.meta.url));
const { stdout } = await run("node", [join(root, "scripts/license-inventory.mjs")], { cwd: root, maxBuffer: 16 * 1024 * 1024 });
const inventory = JSON.parse(stdout);
const packages = [];
const packageIds = new Map();
for (const entry of inventory.packages ?? []) for (const version of entry.versions ?? []) {
  const id = `SPDXRef-Package-${Buffer.from(`${entry.name}@${version}`).toString("base64url")}`;
  packageIds.set(`${entry.name}@${version}`, id);
  packages.push({ SPDXID: id, name: entry.name, versionInfo: version, downloadLocation: entry.source || "NOASSERTION", licenseConcluded: "NOASSERTION", licenseDeclared: entry.declaredLicense, filesAnalyzed: false, primaryPackagePurpose: "LIBRARY", externalRefs: [{ referenceCategory: "PACKAGE-MANAGER", referenceType: "purl", referenceLocator: `pkg:npm/${entry.name}@${version}` }] });
}
const relationships = [];
for (const entry of inventory.bundledComponents ?? []) {
  const id = `SPDXRef-Package-${Buffer.from(`${entry.name}@${entry.version}-bundled-by-${entry.bundledBy}`).toString("base64url")}`;
  const parentId = packageIds.get(entry.bundledBy);
  if (!parentId) throw new Error(`Bundled SPDX component '${entry.name}@${entry.version}' references missing package '${entry.bundledBy}'`);
  packages.push({ SPDXID: id, name: entry.name, versionInfo: entry.version, downloadLocation: entry.source || "NOASSERTION", licenseConcluded: "NOASSERTION", licenseDeclared: entry.declaredLicense, filesAnalyzed: false, primaryPackagePurpose: "LIBRARY", externalRefs: [{ referenceCategory: "PACKAGE-MANAGER", referenceType: "purl", referenceLocator: `pkg:npm/${entry.name}@${entry.version}` }] });
  if (parentId) relationships.push({ spdxElementId: parentId, relationshipType: "CONTAINS", relatedSpdxElement: id });
}
packages.sort((a, b) => a.SPDXID.localeCompare(b.SPDXID));
relationships.sort((a, b) => a.spdxElementId.localeCompare(b.spdxElementId) || a.relatedSpdxElement.localeCompare(b.relatedSpdxElement));
const doc = { SPDXID: "SPDXRef-DOCUMENT", spdxVersion: "SPDX-2.3", creationInfo: { created: "1970-01-01T00:00:00Z", creators: ["Tool: verglos-license-tools"] }, name: "verglos-monorepo", documentNamespace: "https://verglos.com/spdx/verglos-monorepo-2.0.0-alpha.1", packages, relationships };
const output = `${JSON.stringify(doc, null, 2)}\n`;
if (process.argv.includes("--write")) await writeFile(join(root, "SBOM.spdx.json"), output, { encoding: "utf8", mode: 0o644 });
process.stdout.write(output);
