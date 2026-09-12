import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { createLicenseInventory, parsePnpmLockPackageIds } from "./license-inventory-core.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const storeRoot = join(root, "node_modules", ".pnpm");
const workspaceRoot = join(root, "packages");

async function collectVirtualStoreManifests() {
  const manifests = [];
  const stores = await readdir(storeRoot, { withFileTypes: true });
  for (const store of stores) {
    if (!store.isDirectory()) continue;
    const moduleRoot = join(storeRoot, store.name, "node_modules");
    const children = await readdir(moduleRoot, { withFileTypes: true }).catch((error) => {
      if (error?.code === "ENOENT") return [];
      throw error;
    });
    for (const child of children) {
      if (child.name.startsWith(".")) continue;
      const packageRoots = child.name.startsWith("@")
        ? (await readdir(join(moduleRoot, child.name))).map((name) => join(moduleRoot, child.name, name))
        : [join(moduleRoot, child.name)];
      for (const packageRoot of packageRoots) {
        try {
          const manifest = JSON.parse(await readFile(join(packageRoot, "package.json"), "utf8"));
          if (typeof manifest.name === "string" && typeof manifest.version === "string") manifests.push(manifest);
        } catch (error) {
          if (error?.code !== "ENOENT") throw new Error(`Cannot read dependency manifest at '${packageRoot}': ${error.message}`);
        }
      }
    }
  }
  return manifests;
}

const directDependencies = new Set();
const workspacePackageDirs = await readdir(workspaceRoot, { withFileTypes: true });
const workspaceManifests = [join(root, "package.json"), ...workspacePackageDirs.filter((entry) => entry.isDirectory()).map((entry) => join(workspaceRoot, entry.name, "package.json"))];
for (const manifestPath of workspaceManifests) {
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  for (const field of ["dependencies", "optionalDependencies", "devDependencies"]) {
    for (const name of Object.keys(manifest[field] ?? {})) directDependencies.add(name);
  }
}

const lockfile = await readFile(join(root, "pnpm-lock.yaml"), "utf8");
const lockedPackages = parsePnpmLockPackageIds(lockfile);
const manifests = await collectVirtualStoreManifests();
const result = createLicenseInventory({ lockedPackages, manifests, directDependencies });
if (process.argv.includes("--check") && result.reviewBlockers.length > 0) {
  console.error(`dependency license review required for ${result.reviewBlockers.length} package version(s)`);
  process.exitCode = 2;
}
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
