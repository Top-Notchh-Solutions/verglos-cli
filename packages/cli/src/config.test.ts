import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, symlink, writeFile, lstat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { installPreCommitHook } from "./config.js";

async function gitHooks() {
  const root = await mkdtemp(join(tmpdir(), "verglos-hook-"));
  const hooks = join(root, ".git", "hooks");
  await mkdir(hooks, { recursive: true });
  return { root, hooks };
}

test("pre-commit installation preserves and chains an existing hook", async () => {
  const { root, hooks } = await gitHooks();
  const original = "#!/bin/sh\necho existing\n";
  await writeFile(join(hooks, "pre-commit"), original, { mode: 0o755 });
  await installPreCommitHook(root);
  assert.equal(await readFile(join(hooks, "pre-commit.verglos-original"), "utf8"), original);
  const installed = await readFile(join(hooks, "pre-commit"), "utf8");
  assert.match(installed, /pre-commit\.verglos-original/);
  assert.match(installed, /npx verglos precommit/);
  await installPreCommitHook(root);
  assert.equal(await readFile(join(hooks, "pre-commit.verglos-original"), "utf8"), original);
});

test("pre-commit installation refuses symlink hooks", async () => {
  const { root, hooks } = await gitHooks();
  await writeFile(join(hooks, "real-hook"), "#!/bin/sh\n", { mode: 0o755 });
  await symlink("real-hook", join(hooks, "pre-commit"));
  await assert.rejects(() => installPreCommitHook(root), /symlinked/);
  assert.equal((await lstat(join(hooks, "pre-commit"))).isSymbolicLink(), true);
});
