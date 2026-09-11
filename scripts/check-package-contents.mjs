import { readFile, readdir, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const packageDirs = ["shared", "scanner", "reporter", "mcp", "entitlement", "cli"].map((name) => join(root, "packages", name));
const forbidden = /(?:^|\/)(?:docs\/shipping|\.env(?:\.|$)|.*\.(?:pem|key|p12|pfx)|(?:id_rsa|id_ed25519))(?:$|\/)/i;

async function walk(path) {
  const entries = await readdir(path, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const child = join(path, entry.name);
    if (entry.isDirectory()) files.push(...await walk(child));
    else if (entry.isFile()) files.push(child);
  }
  return files;
}

const failures = [];
for (const packageDir of packageDirs) {
  const packageJson = JSON.parse(await readFile(join(packageDir, "package.json"), "utf8"));
  const files = Array.isArray(packageJson.files) ? packageJson.files : [];
  if (!files.includes("dist")) failures.push(`${packageJson.name}: package files must include dist`);
  if (packageJson.name === "verglos" && packageJson.bin?.verglos !== "./dist/index.js") failures.push("verglos: bin.verglos must point to ./dist/index.js");
  for (const included of files) {
    const includedPath = join(packageDir, included);
    try {
      if ((await stat(includedPath)).isDirectory()) {
        for (const file of await walk(includedPath)) {
          const packagePath = relative(packageDir, file).replaceAll("\\", "/");
          if (forbidden.test(packagePath)) failures.push(`${packageJson.name}: forbidden packaged path ${packagePath}`);
        }
      } else if (forbidden.test(included)) failures.push(`${packageJson.name}: forbidden packaged path ${included}`);
    } catch {
      failures.push(`${packageJson.name}: declared package path is missing: ${included}`);
    }
  }
}

if (failures.length) {
  for (const failure of failures) console.error(`::error::${failure}`);
  process.exit(1);
}
console.log(`Package contents audit passed for ${packageDirs.length} public packages.`);
