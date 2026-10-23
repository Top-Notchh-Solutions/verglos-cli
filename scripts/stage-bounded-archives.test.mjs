import assert from "node:assert/strict";
import { test } from "node:test";
import { lstat, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { stageBoundedArchives } from "./stage-bounded-archives.mjs";

async function withFixture(fn) {
  const root = await mkdtemp(join(tmpdir(), "verglos-stage-archives-"));
  try { await fn(root); } finally { await rm(root, { recursive: true, force: true }); }
}

test("stages exact archive bytes into regular temporary files", async () => {
  await withFixture(async (root) => {
    const source = join(root, "release.tgz");
    const stage = join(root, "stage");
    await writeFile(source, Buffer.from("archive-bytes"));
    const [staged] = await stageBoundedArchives([source], stage);
    assert.deepEqual(await readFile(staged), Buffer.from("archive-bytes"));
    assert.ok((await lstat(staged)).isFile());
  });
});

test("rejects symlinked source archives before staging", async () => {
  await withFixture(async (root) => {
    const target = join(root, "target.tgz");
    const link = join(root, "release.tgz");
    await writeFile(target, "archive-bytes");
    await symlink(target, link);
    await assert.rejects(stageBoundedArchives([link], join(root, "stage")), /bounded regular file/);
  });
});
