import assert from "node:assert/strict";
import { mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { loadConfig } from "./index.js";

test("scanner loads an explicit bounded JSON config without executing code", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-config-"));
  try {
    const path = join(root, "config.json");
    await writeFile(path, JSON.stringify({ failThreshold: 42, ignorePaths: ["**/generated/**"] }), "utf8");
    const config = await loadConfig(root, "config.json");
    assert.equal(config.failThreshold, 42);
    assert.deepEqual(config.ignorePaths, ["**/generated/**"]);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("scanner rejects symlink and malformed explicit configs", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-config-invalid-"));
  try {
    const target = join(root, "target.json");
    const link = join(root, "link.json");
    await writeFile(target, "{}", "utf8");
    await symlink(target, link);
    await assert.rejects(() => loadConfig(root, link), /bounded regular file/);
    await writeFile(target, "not-json", "utf8");
    await assert.rejects(() => loadConfig(root, target), /valid JSON/);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("scanner ignores symlinked implicit JavaScript config", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-config-implicit-link-"));
  try {
    const target = join(root, "outside.js");
    await writeFile(target, "module.exports = { failThreshold: 1 };", "utf8");
    await symlink(target, join(root, ".verglos.config.js"));
    const config = await loadConfig(root);
    assert.equal(config.failThreshold, 60);
  } finally { await rm(root, { recursive: true, force: true }); }
});
