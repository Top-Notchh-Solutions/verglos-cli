import { lstat, readFile, readdir } from "node:fs/promises";
import { isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { auditPackageSurface, auditPublicPackageSet, isForbiddenPublicPackagePath } from "./package-surface-audit.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const packageDirs = ["shared", "scanner", "reporter", "mcp", "entitlement", "cli"].map((name) => join(root, "packages", name));
const PRIVATE_KEY_MARKER = /-----BEGIN (?:[A-Z0-9]+ )?PRIVATE KEY-----/u;
const MAX_AUDIT_FILE_BYTES = 8 * 1024 * 1024;

async function walk(path) {
  const entries = await readdir(path, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const child = join(path, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`symlink packaged path ${relative(root, child).replaceAll("\\", "/")}`);
    if (entry.isDirectory()) files.push(...await walk(child));
    else if (entry.isFile()) files.push(child);
  }
  return files;
}

const failures = [];
const manifests = [];
for (const packageDir of packageDirs) {
  const packageJson = JSON.parse(await readFile(join(packageDir, "package.json"), "utf8"));
  manifests.push(packageJson);
  const files = Array.isArray(packageJson.files) ? packageJson.files : [];
  const includedFiles = [];
  for (const included of files) {
    if (typeof included !== "string" || included.length === 0 || isAbsolute(included)) {
      failures.push(`${packageJson.name}: package path must be a non-empty relative string: ${String(included)}`);
      continue;
    }
    const includedPath = resolve(packageDir, included);
    if (includedPath !== packageDir && !includedPath.startsWith(`${resolve(packageDir)}${sep}`)) {
      failures.push(`${packageJson.name}: package path escapes package root: ${included}`);
      continue;
    }
    try {
      const entry = await lstat(includedPath);
      if (entry.isSymbolicLink()) throw new Error(`symlink packaged path ${included}`);
      if (entry.isDirectory()) {
        for (const file of await walk(includedPath)) {
          const packagePath = relative(packageDir, file).replaceAll("\\", "/");
          // The public packer excludes compiled unit-test files from dist;
          // audit the publishable view, not the build workspace.
          if (packagePath.startsWith("dist/") && /\.test\./u.test(packagePath)) continue;
          if (packagePath.startsWith("dist/") && /(?:^|\/)cli-fixture\.[^/]+$/u.test(packagePath)) continue;
          if (isForbiddenPublicPackagePath(packagePath)) failures.push(`${packageJson.name}: forbidden packaged path ${packagePath}`);
          includedFiles.push(packagePath);
          const fileStat = await lstat(file);
          if (fileStat.size > MAX_AUDIT_FILE_BYTES) failures.push(`${packageJson.name}: packaged file exceeds the ${MAX_AUDIT_FILE_BYTES}-byte private-key inspection bound: ${packagePath}`);
          else if (PRIVATE_KEY_MARKER.test(await readFile(file, "utf8"))) failures.push(`${packageJson.name}: private-key PEM marker found in ${packagePath}`);
        }
      } else {
        if (included.replaceAll("\\", "/").startsWith("dist/") && /\.test\./u.test(included)) continue;
        if (included.replaceAll("\\", "/").startsWith("dist/") && /(?:^|\/)cli-fixture\.[^/]+$/u.test(included)) continue;
        if (isForbiddenPublicPackagePath(included)) failures.push(`${packageJson.name}: forbidden packaged path ${included}`);
        includedFiles.push(included.replaceAll("\\", "/"));
        if (entry.size > MAX_AUDIT_FILE_BYTES) failures.push(`${packageJson.name}: packaged file exceeds the ${MAX_AUDIT_FILE_BYTES}-byte private-key inspection bound: ${included}`);
        else if (PRIVATE_KEY_MARKER.test(await readFile(includedPath, "utf8"))) failures.push(`${packageJson.name}: private-key PEM marker found in ${included}`);
      }
    } catch (error) {
      failures.push(`${packageJson.name}: ${error instanceof Error ? error.message : `declared package path is missing: ${included}`}`);
    }
  }
  failures.push(...auditPackageSurface(packageJson, includedFiles));
}
failures.push(...auditPublicPackageSet(manifests));

if (failures.length) {
  for (const failure of failures) console.error(`::error::${failure}`);
  process.exit(1);
}
console.log(`Package contents audit passed for ${packageDirs.length} public packages.`);
