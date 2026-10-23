import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { createLicenseInventory, parsePnpmLockPackageIds } from "./license-inventory-core.mjs";
import { LICENSE_REVIEW_DECISIONS } from "./license-review-decisions.mjs";
import { LICENSE_SOURCE_OVERRIDES } from "./license-source-overrides.mjs";
import { readBoundedFile, readBoundedJsonFile } from "./read-bounded-json.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const storeRoot = join(root, "node_modules", ".pnpm");
const workspaceRoot = join(root, "packages");

async function collectVirtualStoreManifests() {
  const manifests = [];
  const bundledManifests = [];
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
          const manifest = await readBoundedJsonFile(join(packageRoot, "package.json"), `${packageRoot} package.json`);
          if (typeof manifest.name !== "string" || typeof manifest.version !== "string") continue;
          manifests.push(manifest);
          // An installed dependency can itself ship nested package payloads
          // (for example, fast-uri's benchmark package). Keep these separate
          // from lockfile nodes, but include them in redistribution evidence.
          const nested = await readdir(packageRoot, { withFileTypes: true });
          for (const child of nested) {
            if (!child.isDirectory() || child.name === "node_modules" || child.name.startsWith(".")) continue;
            const nestedManifestPath = join(packageRoot, child.name, "package.json");
            try {
              const nestedManifest = await readBoundedJsonFile(nestedManifestPath, `${nestedManifestPath}`);
              if (typeof nestedManifest.name === "string" && typeof nestedManifest.version === "string") {
                bundledManifests.push({ manifest: nestedManifest, bundledBy: `${manifest.name}@${manifest.version}` });
              }
            } catch (error) {
              if (error?.code !== "ENOENT") throw new Error(`Cannot read bundled dependency manifest at '${nestedManifestPath}': ${error.message}`);
            }
          }
        } catch (error) {
          if (error?.code !== "ENOENT") throw new Error(`Cannot read dependency manifest at '${packageRoot}': ${error.message}`);
        }
      }
    }
  }
  return { manifests, bundledManifests };
}

const directDependencies = new Set();
const workspacePackageDirs = await readdir(workspaceRoot, { withFileTypes: true });
const workspaceManifests = [join(root, "package.json"), ...workspacePackageDirs.filter((entry) => entry.isDirectory()).map((entry) => join(workspaceRoot, entry.name, "package.json"))];
for (const manifestPath of workspaceManifests) {
  const manifest = await readBoundedJsonFile(manifestPath, `${manifestPath}`);
  for (const field of ["dependencies", "optionalDependencies", "devDependencies"]) {
    for (const name of Object.keys(manifest[field] ?? {})) directDependencies.add(name);
  }
}

const lockfile = decodeUtf8(await readBoundedFile(join(root, "pnpm-lock.yaml"), "pnpm lockfile"), "pnpm lockfile");
const lockedPackages = parsePnpmLockPackageIds(lockfile);
const { manifests, bundledManifests } = await collectVirtualStoreManifests();
const result = createLicenseInventory({ lockedPackages, manifests, bundledManifests, directDependencies, sourceOverrides: LICENSE_SOURCE_OVERRIDES, reviewDecisions: LICENSE_REVIEW_DECISIONS });
if (process.argv.includes("--require-clear") && result.reviewBlockers.length > 0) {
  console.error(`dependency license review required for ${result.reviewBlockers.length} package version(s)`);
  process.exitCode = 2;
}
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);

function decodeUtf8(bytes, label) {
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    throw new Error(`${label} must contain valid bounded UTF-8 text`);
  }
}
