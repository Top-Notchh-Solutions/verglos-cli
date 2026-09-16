// DIST-004 · Cross-platform install invariants.
//
// The Platform Matrix workflow already exercises Ubuntu/macOS/Windows on
// Node 20/22/24. This test freezes the invariants a real end user relies on
// when they run `npm install verglos`:
//
//   1. No package in the CLI graph declares a postinstall/install/preinstall
//      script that could fetch binaries or run code during install.
//   2. Every public package declares an explicit `files` allowlist so
//      unrelated fixtures cannot leak into the published tarball.
//   3. The CLI package declares a single `bin` mapping (`verglos`) pointing
//      at a real file relative to the package root.
//   4. Every public package has explicit `engines.node` so `npm install`
//      surfaces incompatible Node versions instead of silently succeeding.
//
// These properties travel with the source and hold on every platform the
// Platform Matrix runs on. Any regression here surfaces on all nine cells
// simultaneously.

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const CLI_ROOT = resolve(HERE, "..", "..", "..");

const PACKAGES = [
  "cli",
  "shared",
  "scanner",
  "reporter",
  "mcp",
  "entitlement",
  "hunt",
  "attest",
] as const;

type PackageManifest = {
  name?: string;
  version?: string;
  bin?: string | Record<string, string>;
  files?: string[];
  scripts?: Record<string, string>;
  engines?: Record<string, string>;
};

async function readManifest(pkg: string): Promise<PackageManifest> {
  const path = join(CLI_ROOT, "packages", pkg, "package.json");
  return JSON.parse(await readFile(path, "utf8")) as PackageManifest;
}

const INSTALL_HOOKS = new Set([
  "preinstall",
  "install",
  "postinstall",
  "prepare",
  "prepublish",
  "prepublishOnly",
]);

for (const pkg of PACKAGES) {
  test(`${pkg} package declares no npm install hook that could fetch binaries`, async () => {
    const manifest = await readManifest(pkg);
    const scripts = manifest.scripts ?? {};
    for (const hook of INSTALL_HOOKS) {
      assert.equal(
        scripts[hook],
        undefined,
        `${pkg} declares '${hook}' script (${scripts[hook]}); npm install would run it and fetch binaries or execute code`,
      );
    }
  });
}

for (const pkg of PACKAGES) {
  test(`${pkg} package publishes only its explicitly declared files`, async () => {
    const manifest = await readManifest(pkg);
    assert.ok(Array.isArray(manifest.files) && manifest.files.length > 0, `${pkg} package.json must declare an explicit 'files' allowlist`);
    for (const entry of manifest.files!) {
      assert.ok(typeof entry === "string" && entry.length > 0, `${pkg} 'files' entries must be non-empty strings`);
      assert.ok(!entry.includes(".."), `${pkg} 'files' must never traverse above the package root`);
    }
  });
}

for (const pkg of PACKAGES) {
  test(`${pkg} package pins engines.node so install-time Node mismatch is surfaced`, async () => {
    const manifest = await readManifest(pkg);
    const nodeRange = manifest.engines?.node;
    assert.ok(typeof nodeRange === "string" && nodeRange.length > 0, `${pkg} package.json must declare engines.node`);
    assert.match(nodeRange, /[<>=^~0-9.x*]/u, `${pkg} engines.node must be a semver range, not free-form text`);
  });
}

test("verglos CLI package declares exactly one bin mapping pointing at a real file", async () => {
  const manifest = await readManifest("cli");
  assert.equal(manifest.name, "verglos", "the CLI is published as the `verglos` package");
  const bin = manifest.bin;
  assert.ok(typeof bin === "object" && bin !== null && !Array.isArray(bin), "cli bin must be a mapping so npm can create exactly one launcher");
  const entries = Object.entries(bin as Record<string, string>);
  assert.equal(entries.length, 1, `cli bin must declare exactly one mapping; found ${entries.length}`);
  const firstEntry = entries[0];
  assert.ok(firstEntry, "cli bin mapping must not be empty");
  const [name, relativePath] = firstEntry;
  assert.equal(name, "verglos", `bin mapping key must be 'verglos'; got '${name}'`);
  const cliRoot = join(CLI_ROOT, "packages", "cli");
  const absolutePath = resolve(cliRoot, relativePath);
  assert.ok(absolutePath.startsWith(cliRoot), "cli bin path must stay inside the package root");
  assert.ok(existsSync(absolutePath), `cli bin target file '${relativePath}' must exist at ${absolutePath}`);
});

test("no public package declares a wildcard 'files' entry", async () => {
  for (const pkg of PACKAGES) {
    const manifest = await readManifest(pkg);
    for (const entry of manifest.files ?? []) {
      assert.notEqual(entry, "*", `${pkg} package must not publish '*' — the tarball would leak everything in the package root`);
      assert.notEqual(entry, "**", `${pkg} package must not publish '**' either`);
      assert.notEqual(entry, ".", `${pkg} package must not publish '.'`);
    }
  }
});
