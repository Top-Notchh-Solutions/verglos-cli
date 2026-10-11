export const PUBLIC_PACKAGE_NAMES = Object.freeze([
  "verglos",
  "@verglos/shared",
  "@verglos/scanner",
  "@verglos/reporter",
  "@verglos/mcp",
  "@verglos/entitlement",
]);

const EXTERNAL_ENGINE_PACKAGES = /^(?:@aquasecurity\/)?trivy(?:-bin)?$/iu;
const INSTALL_HOOKS = new Set(["preinstall", "install", "postinstall"]);
const FORBIDDEN_PUBLIC_PATH = /(?:^|\/)(?:docs\/shipping|\.env(?:\.|$)|.*\.(?:pem|key|p12|pfx)|(?:id_rsa|id_ed25519)|__tests__|tests?|cli-fixture\.[^/]+)(?:$|\/)|\.(?:test|spec)\.[cm]?[jt]sx?$/iu;

export function isForbiddenPublicPackagePath(path) {
  return FORBIDDEN_PUBLIC_PATH.test(path.replaceAll("\\", "/"));
}

function addTarget(target, field, files, failures) {
  if (typeof target !== "string" || !target.startsWith("./")) {
    failures.push(`${field} must be a package-relative file path`);
    return;
  }
  const path = target.slice(2);
  const segments = path.replaceAll("\\", "/").split("/");
  if (!path || path.startsWith("/") || segments.includes("..") || segments.includes(".")) {
    failures.push(`${field} escapes the package root`);
    return;
  }
  if (!files.has(path)) failures.push(`${field} points to a file missing from the packed archive: ${path}`);
}

function visitExports(value, field, files, failures) {
  if (typeof value === "string") {
    addTarget(value, field, files, failures);
    return;
  }
  if (value === null || typeof value !== "object") return;
  if (Array.isArray(value)) {
    value.forEach((entry, index) => visitExports(entry, `${field}[${index}]`, files, failures));
    return;
  }
  for (const [key, entry] of Object.entries(value)) {
    visitExports(entry, `${field}.${key}`, files, failures);
  }
}

/** Validate that public package entrypoints resolve inside the exact archive. */
export function auditPackageSurface(manifest, fileNames) {
  const failures = [];
  const files = new Set(fileNames.map((name) => name.replaceAll("\\", "/").replace(/^package\//u, "").replace(/\/$/u, "")));
  if (!PUBLIC_PACKAGE_NAMES.includes(manifest?.name)) failures.push(`unexpected public package name: ${String(manifest?.name)}`);
  if (!Array.isArray(manifest?.files) || !manifest.files.includes("dist")) failures.push(`${manifest?.name}: package files must include dist`);
  for (const hook of INSTALL_HOOKS) {
    if (manifest?.scripts?.[hook]) failures.push(`${manifest.name}: install-time hook '${hook}' is not allowed`);
  }

  const dependencies = {
    ...manifest?.dependencies,
    ...manifest?.optionalDependencies,
  };
  for (const packageName of Object.keys(dependencies)) {
    if (EXTERNAL_ENGINE_PACKAGES.test(packageName)) failures.push(`${manifest.name}: optional external engine must not be installed as a package dependency (${packageName})`);
  }

  for (const field of ["main", "types"]) {
    if (manifest?.[field] !== undefined) addTarget(manifest[field], `${manifest.name}.${field}`, files, failures);
  }
  if (manifest?.bin !== undefined) {
    const bins = typeof manifest.bin === "string" ? { [manifest.name]: manifest.bin } : manifest.bin;
    if (!bins || typeof bins !== "object" || Array.isArray(bins)) failures.push(`${manifest.name}: bin must be a path or name-to-path object`);
    else for (const [name, target] of Object.entries(bins)) addTarget(target, `${manifest.name}.bin.${name}`, files, failures);
  }
  if (manifest?.name === "verglos" && (manifest.bin?.verglos !== "./dist/index.js" || Object.keys(manifest.bin ?? {}).length !== 1)) {
    failures.push("verglos: exactly one CLI bin must point to ./dist/index.js");
  }
  if (manifest?.exports !== undefined) visitExports(manifest.exports, `${manifest.name}.exports`, files, failures);
  return Object.freeze(failures);
}

export function auditPublicPackageSet(manifests) {
  const names = manifests.map((manifest) => manifest?.name);
  const failures = [];
  for (const name of PUBLIC_PACKAGE_NAMES) {
    const count = names.filter((candidate) => candidate === name).length;
    if (count !== 1) failures.push(`release must contain exactly one ${name} package (found ${count})`);
  }
  for (const name of names) {
    if (!PUBLIC_PACKAGE_NAMES.includes(name)) failures.push(`unexpected public package: ${String(name)}`);
  }
  return Object.freeze(failures);
}
