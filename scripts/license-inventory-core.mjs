const PERMISSIVE = /^(?:MIT|Apache-2\.0|BSD(?:-\d-Clause)?|ISC|0BSD|Unlicense|CC0-1\.0)$/i;
const COPYLEFT = /(?:GPL|AGPL|LGPL|MPL|EPL|CDDL|CPL|OSL)/i;

function parseYamlKey(value) {
  const key = value.trim();
  if (key.startsWith("'") && key.endsWith("'")) return key.slice(1, -1).replaceAll("''", "'");
  if (key.startsWith('"') && key.endsWith('"')) {
    try { return JSON.parse(key); }
    catch { throw new Error(`Invalid quoted package key '${value}' in pnpm lockfile`); }
  }
  return key;
}

export function parsePnpmLockPackageIds(lockfile) {
  const version = /^lockfileVersion:\s*['"]?([^'"\s]+)['"]?\s*$/m.exec(lockfile)?.[1];
  if (version !== "9.0") throw new Error(`Unsupported pnpm lockfile version: ${version ?? "missing"}`);
  const lines = lockfile.split(/\r?\n/);
  let inPackages = false;
  let sawPackages = false;
  const packages = [];
  for (const line of lines) {
    if (line === "packages:") { inPackages = true; sawPackages = true; continue; }
    if (line === "snapshots:") { inPackages = false; break; }
    if (!inPackages) continue;
    const match = /^  (\S.*):$/.exec(line);
    if (!match) continue;
    const id = parseYamlKey(match[1]);
    const splitAt = id.lastIndexOf("@");
    if (splitAt <= 0 || splitAt === id.length - 1) throw new Error(`Unsupported pnpm package ID '${id}'`);
    packages.push({ id, name: id.slice(0, splitAt), version: id.slice(splitAt + 1) });
  }
  if (!sawPackages || inPackages) throw new Error("pnpm lockfile is missing a complete packages section");
  const ids = new Set();
  const nameVersions = new Set();
  for (const item of packages) {
    const nameVersion = `${item.name}@${item.version}`;
    if (ids.has(item.id) || nameVersions.has(nameVersion)) throw new Error(`Duplicate pnpm package entry '${item.id}'`);
    ids.add(item.id);
    nameVersions.add(nameVersion);
  }
  return packages;
}

function getSource(manifest) {
  if (typeof manifest.homepage === "string" && manifest.homepage.trim()) return manifest.homepage.trim();
  if (typeof manifest.repository === "string" && manifest.repository.trim()) return manifest.repository.trim();
  if (manifest.repository && typeof manifest.repository.url === "string" && manifest.repository.url.trim()) return manifest.repository.url.trim();
  return "";
}

export function createLicenseInventory({ lockedPackages, manifests, bundledManifests = [], directDependencies }) {
  const byNameVersion = new Map();
  for (const manifest of manifests) {
    if (!manifest || typeof manifest.name !== "string" || typeof manifest.version !== "string") continue;
    const key = `${manifest.name}@${manifest.version}`;
    const previous = byNameVersion.get(key);
    const record = { name: manifest.name, version: manifest.version, license: typeof manifest.license === "string" ? manifest.license.trim() : "", source: getSource(manifest) };
    if (previous && JSON.stringify(previous) !== JSON.stringify(record)) throw new Error(`Conflicting package metadata for '${key}'`);
    byNameVersion.set(key, record);
  }

  const locked = new Set(lockedPackages.map((item) => `${item.name}@${item.version}`));
  const found = new Set(byNameVersion.keys());
  const missing = [...locked].filter((key) => !found.has(key)).sort();
  const unexpected = [...found].filter((key) => !locked.has(key)).sort();
  if (missing.length || unexpected.length) {
    const details = [
      missing.length ? `missing lockfile package metadata: ${missing.slice(0, 10).join(", ")}${missing.length > 10 ? ", …" : ""}` : "",
      unexpected.length ? `metadata absent from lockfile: ${unexpected.slice(0, 10).join(", ")}${unexpected.length > 10 ? ", …" : ""}` : "",
    ].filter(Boolean).join("; ");
    throw new Error(`Dependency license inventory is incomplete (${details})`);
  }

  const grouped = new Map();
  const blockers = [];
  for (const record of byNameVersion.values()) {
    const license = record.license || "UNKNOWN";
    const redistributionClass = PERMISSIVE.test(license) ? "permissive" : COPYLEFT.test(license) ? "copyleft" : "unknown";
    const scope = directDependencies.has(record.name) ? "direct" : "transitive";
    const reviewBlocker = redistributionClass !== "permissive" || !record.source;
    const groupKey = JSON.stringify([record.name, scope, license, record.source, redistributionClass]);
    const entry = grouped.get(groupKey) ?? {
      name: record.name,
      versions: [],
      scope,
      declaredLicense: license,
      detectedLicense: license,
      detectionMethod: "package-manifest-license-field",
      source: record.source || undefined,
      redistributionClass,
      noticeObligation: redistributionClass === "permissive" ? "retain-license-and-notice" : "review-required",
      reviewBlocker,
    };
    entry.versions.push(record.version);
    grouped.set(groupKey, entry);
    if (reviewBlocker) blockers.push({ name: record.name, version: record.version, license, reason: redistributionClass !== "permissive" ? "license-review-required" : "source-missing" });
  }

  const entries = [...grouped.values()].map((entry) => ({ ...entry, versions: entry.versions.sort() }))
    .sort((a, b) => a.name.localeCompare(b.name) || a.versions.join(",").localeCompare(b.versions.join(",")));
  const bundled = new Map();
  for (const item of bundledManifests) {
    const manifest = item?.manifest;
    if (!manifest || typeof manifest.name !== "string" || typeof manifest.version !== "string" || typeof item.bundledBy !== "string") continue;
    const key = `${item.bundledBy}\0${manifest.name}@${manifest.version}`;
    const parentName = item.bundledBy.slice(0, item.bundledBy.lastIndexOf("@"));
    const parentVersion = item.bundledBy.slice(item.bundledBy.lastIndexOf("@") + 1);
    const parent = byNameVersion.get(`${parentName}@${parentVersion}`);
    const ownSource = getSource(manifest);
    const source = ownSource || parent?.source || "";
    const license = typeof manifest.license === "string" && manifest.license.trim() ? manifest.license.trim() : "UNKNOWN";
    const redistributionClass = PERMISSIVE.test(license) ? "permissive" : COPYLEFT.test(license) ? "copyleft" : "unknown";
    const parentDeclaredLicense = parent?.license || "UNKNOWN";
    const licenseConflict = parentDeclaredLicense !== "UNKNOWN" && license !== parentDeclaredLicense;
    const reviewBlocker = redistributionClass !== "permissive" || !source || licenseConflict;
    const reviewReason = redistributionClass !== "permissive" ? "license-review-required" : !source ? "source-missing" : licenseConflict ? "nested-license-conflicts-with-container" : undefined;
    const record = {
      name: manifest.name,
      version: manifest.version,
      bundledBy: item.bundledBy,
      privatePackage: manifest.private === true,
      declaredLicense: license,
      parentDeclaredLicense,
      detectedLicense: license,
      detectionMethod: "nested-package-manifest-license-field",
      source: source || undefined,
      sourceBasis: ownSource ? "nested-package-manifest" : source ? "containing-package-repository" : "missing",
      redistributionClass,
      noticeObligation: reviewBlocker ? "review-required" : "retain-license-and-notice",
      reviewBlocker,
      ...(reviewReason ? { reviewReason } : {}),
    };
    const previous = bundled.get(key);
    if (previous && JSON.stringify(previous) !== JSON.stringify(record)) throw new Error(`Conflicting bundled package metadata for '${manifest.name}@${manifest.version}' in '${item.bundledBy}'`);
    bundled.set(key, record);
    if (!previous && reviewBlocker) blockers.push({
      name: manifest.name,
      version: manifest.version,
      bundledBy: item.bundledBy,
      license,
      reason: reviewReason,
    });
  }
  const bundledComponents = [...bundled.values()].sort((a, b) => a.bundledBy.localeCompare(b.bundledBy) || a.name.localeCompare(b.name) || a.version.localeCompare(b.version));
  blockers.sort((a, b) => a.name.localeCompare(b.name) || a.version.localeCompare(b.version) || (a.bundledBy ?? "").localeCompare(b.bundledBy ?? ""));
  return {
    schemaId: "urn:verglos:artifact:dependency-license-inventory",
    schemaVersion: "1.2.0",
    generatedBy: "verglos-cli",
    source: "pnpm-lock.yaml plus installed package manifests",
    lockfilePackageCount: lockedPackages.length,
    packages: entries,
    bundledComponents,
    reviewBlockers: blockers,
  };
}
