import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const run = promisify(execFile);
const root = fileURLToPath(new URL("..", import.meta.url));
function spdxDownloadLocation(source) {
  if (typeof source !== "string" || !source.trim()) return "NOASSERTION";
  const value = source.trim();
  // SPDX downloadLocation accepts a URI or NOASSERTION. npm manifests often
  // use GitHub's shorthand `owner/repository`; retaining that string would
  // produce an invalid SPDX document, so preserve only URI-shaped sources.
  return /^(?:[A-Za-z][A-Za-z0-9+.-]*):\/\//u.test(value) || value === "NOASSERTION" ? value : "NOASSERTION";
}
const { stdout } = await run("node", [join(root, "scripts/license-inventory.mjs")], { cwd: root, maxBuffer: 16 * 1024 * 1024 });
const inventory = JSON.parse(stdout);
const packages = [];
const packageIds = new Map();
for (const entry of inventory.packages ?? []) for (const version of entry.versions ?? []) {
  const id = `SPDXRef-Package-${Buffer.from(`${entry.name}@${version}`).toString("base64url")}`;
  packageIds.set(`${entry.name}@${version}`, id);
  packages.push({ SPDXID: id, name: entry.name, versionInfo: version, downloadLocation: spdxDownloadLocation(entry.source), licenseConcluded: "NOASSERTION", licenseDeclared: entry.declaredLicense, filesAnalyzed: false, primaryPackagePurpose: "LIBRARY", externalRefs: [{ referenceCategory: "PACKAGE-MANAGER", referenceType: "purl", referenceLocator: `pkg:npm/${entry.name}@${version}` }] });
}
const relationships = [];
for (const entry of inventory.bundledComponents ?? []) {
  const id = `SPDXRef-Package-${Buffer.from(`${entry.name}@${entry.version}-bundled-by-${entry.bundledBy}`).toString("base64url")}`;
  const parentId = packageIds.get(entry.bundledBy);
  if (!parentId) throw new Error(`Bundled SPDX component '${entry.name}@${entry.version}' references missing package '${entry.bundledBy}'`);
  packages.push({ SPDXID: id, name: entry.name, versionInfo: entry.version, downloadLocation: spdxDownloadLocation(entry.source), licenseConcluded: "NOASSERTION", licenseDeclared: entry.declaredLicense, filesAnalyzed: false, primaryPackagePurpose: "LIBRARY", externalRefs: [{ referenceCategory: "PACKAGE-MANAGER", referenceType: "purl", referenceLocator: `pkg:npm/${entry.name}@${entry.version}` }] });
  if (parentId) relationships.push({ spdxElementId: parentId, relationshipType: "CONTAINS", relatedSpdxElement: id });
}
for (const packageEntry of packages) relationships.push({ spdxElementId: "SPDXRef-DOCUMENT", relationshipType: "DESCRIBES", relatedSpdxElement: packageEntry.SPDXID });
packages.sort((a, b) => a.SPDXID.localeCompare(b.SPDXID));
relationships.sort((a, b) => a.spdxElementId.localeCompare(b.spdxElementId) || a.relatedSpdxElement.localeCompare(b.relatedSpdxElement));
const doc = { SPDXID: "SPDXRef-DOCUMENT", spdxVersion: "SPDX-2.3", dataLicense: "CC0-1.0", creationInfo: { created: "1970-01-01T00:00:00Z", creators: ["Tool: verglos-license-tools"] }, name: "verglos-monorepo", documentNamespace: "https://verglos.com/spdx/verglos-monorepo-2.0.0-alpha.1", packages, relationships };
const output = `${JSON.stringify(doc, null, 2)}\n`;
if (process.argv.includes("--write")) await writeFile(join(root, "SBOM.spdx.json"), output, { encoding: "utf8", mode: 0o644 });
process.stdout.write(output);
