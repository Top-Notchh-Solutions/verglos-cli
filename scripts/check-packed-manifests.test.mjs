import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const run = promisify(execFile);
const script = fileURLToPath(new URL("./check-packed-manifests.mjs", import.meta.url));
const packages = [
  ["verglos", "verglos.tgz"],
  ["@verglos/shared", "verglos-shared.tgz"],
  ["@verglos/scanner", "verglos-scanner.tgz"],
  ["@verglos/reporter", "verglos-reporter.tgz"],
  ["@verglos/mcp", "verglos-mcp.tgz"],
  ["@verglos/entitlement", "verglos-entitlement.tgz"],
  ["@verglos/hunt", "verglos-hunt.tgz"],
];

async function writeFixture(root, { symlinked = false, missingDeclaredPath = false } = {}) {
  const license = await readFile(join(process.cwd(), "LICENSE"));
  for (const [name, archive] of packages) {
    const packageRoot = await mkdtemp(join(root, "package-"));
    const packageDir = join(packageRoot, "package");
    await mkdir(join(packageDir, "dist"), { recursive: true });
    await writeFile(join(packageDir, "package.json"), JSON.stringify({
      name,
      version: "2.0.0-alpha.1",
      license: "Apache-2.0",
      files: ["dist", ...(missingDeclaredPath ? ["fixtures"] : [])],
      ...(name === "verglos" ? { bin: { verglos: "./dist/index.js" }, main: "./dist/index.js" } : { main: "./dist/index.js" }),
    }));
    await writeFile(join(packageDir, "LICENSE"), license);
    await writeFile(join(packageDir, "dist", "index.js"), "export {};\n");
    if (symlinked && name === "verglos") await symlink("../../private.txt", join(packageDir, "dist", "private.js"));
    await run("tar", ["--format=ustar", "-czf", join(root, archive), "package"], { cwd: packageRoot });
    await rm(packageRoot, { recursive: true, force: true });
  }
}

test("packed manifest audit rejects symlink archive members", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-packed-manifests-"));
  try {
    await writeFixture(root, { symlinked: true });
    await assert.rejects(run(process.execPath, [script, root]), /archive contains a non-regular member package\/dist\/private\.js/u);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("packed manifest audit accepts the seven regular public archives", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-packed-manifests-"));
  try {
    await writeFixture(root);
    const result = await run(process.execPath, [script, root]);
    assert.match(result.stdout, /packed manifest audit passed for 7 npm archives/u);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("packed manifest audit rejects a declared path absent from the archive", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-packed-manifests-"));
  try {
    await writeFixture(root, { missingDeclaredPath: true });
    await assert.rejects(run(process.execPath, [script, root]), /missing from the packed archive: fixtures/u);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
