import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const run = promisify(execFile);
const root = resolve(new URL("..", import.meta.url).pathname);
const packageNames = ["shared", "scanner", "reporter", "mcp", "entitlement", "cli"];
const manifests = new Map();
for (const name of packageNames) manifests.set(name, JSON.parse(await readFile(join(root, "packages", name, "package.json"), "utf8")));
const versions = new Map([...manifests.values()].map((manifest) => [manifest.name, manifest.version]));
const destination = resolve(process.argv[2] ?? "");
if (!process.argv[2]) throw new Error("pack output directory is required");
await mkdir(destination, { recursive: true });
const stagingRoot = await mkdtemp(join(root, ".pack-staging-"));
try {
  for (const name of packageNames) {
    const source = join(root, "packages", name);
    const stage = join(stagingRoot, name);
    await cp(join(source, "dist"), join(stage, "dist"), { recursive: true, filter: (path) => !/\.test\./u.test(path) });
    for (const file of ["README.md", "LICENSE", "NOTICE"]) {
      try { await cp(join(source, file), join(stage, file)); } catch { /* optional package metadata */ }
    }
    const manifest = manifests.get(name);
    for (const field of ["dependencies", "optionalDependencies", "devDependencies"]) {
      for (const [dependency, range] of Object.entries(manifest[field] ?? {})) {
        if (typeof range === "string" && range.startsWith("workspace:")) {
          const version = versions.get(dependency);
          if (!version) throw new Error(`workspace dependency ${dependency} has no known package version`);
          manifest[field][dependency] = `^${version}`;
        }
      }
    }
    await writeFile(join(stage, "package.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
    await run("npm", ["pack", stage, "--pack-destination", destination, "--ignore-scripts"], { cwd: root, maxBuffer: 4 * 1024 * 1024 });
  }
} finally {
  await rm(stagingRoot, { recursive: true, force: true });
}
