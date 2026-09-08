import assert from "node:assert/strict";
import { mkdtemp, mkdir, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { resolveFilesystemTarget, FilesystemResolutionError } from "./filesystem-resolver.js";

const context = (cwd: string) => ({ cwd, allowNetwork: false, executeProjectCode: false as const });

test("filesystem resolver hashes sorted content and does not follow symlinks", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-filesystem-"));
  await mkdir(join(root, "src"));
  await writeFile(join(root, "src", "a.txt"), "alpha");
  await symlink("src", join(root, "link"));
  const first = await resolveFilesystemTarget({ kind: "filesystem", value: root }, context(root));
  const second = await resolveFilesystemTarget({ kind: "filesystem", value: root }, context(root));
  assert.equal(first.coverage, "complete");
  assert.deepEqual(first.subject, second.subject);
  assert.equal((first.subject as { entryCount: number }).entryCount, 3);
});

test("filesystem resolver rejects a non-directory target", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-filesystem-"));
  const file = join(root, "file.txt");
  await writeFile(file, "x");
  await assert.rejects(() => resolveFilesystemTarget({ kind: "filesystem", value: file }, context(root)), (error: unknown) => error instanceof FilesystemResolutionError && error.code === "MISSING_PATH");
});
