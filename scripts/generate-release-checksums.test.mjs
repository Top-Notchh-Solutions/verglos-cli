import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const run = promisify(execFile);
const script = fileURLToPath(new URL("./generate-release-checksums.mjs", import.meta.url));

async function withFixture(fn) {
  const root = await mkdtemp(join(tmpdir(), "verglos-release-checksums-"));
  try {
    await writeFile(join(root, "z-last.txt"), "last\n");
    await writeFile(join(root, "a-first.txt"), "first\n");
    await fn(root);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

test("release checksum generation is sorted, deterministic, and excludes its own output", async () => {
  await withFixture(async (root) => {
    const first = await run(process.execPath, [script, root]);
    assert.match(first.stdout, /wrote SHA256SUMS for 2 release artifacts/u);
    const checksums = await readFile(join(root, "SHA256SUMS"), "utf8");
    assert.deepEqual(checksums.split("\n").filter(Boolean).map((line) => line.split("  ")[1]), ["a-first.txt", "z-last.txt"]);
    const second = await run(process.execPath, [script, root]);
    assert.equal(second.stdout, first.stdout);
    assert.equal(await readFile(join(root, "SHA256SUMS"), "utf8"), checksums);
  });
});

test("release checksum generation rejects symlink artifacts", async () => {
  await withFixture(async (root) => {
    await symlink("a-first.txt", join(root, "linked.txt"));
    await assert.rejects(run(process.execPath, [script, root]), /not a regular file: linked\.txt/u);
  });
});

test("release checksum generation refuses a symlinked checksum output", async () => {
  await withFixture(async (root) => {
    const sentinel = join(root, "checksum-target.txt");
    await writeFile(sentinel, "do not overwrite\n");
    await symlink(sentinel, join(root, "SHA256SUMS"));
    await assert.rejects(run(process.execPath, [script, root]), /release checksum output must be a regular file/u);
    assert.equal(await readFile(sentinel, "utf8"), "do not overwrite\n");
  });
});

test("release checksum generation fails closed for an empty artifact directory", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-release-checksums-empty-"));
  try {
    await assert.rejects(run(process.execPath, [script, root]), /release artifact directory is empty/u);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("release checksum generation binds artifact reads to bounded regular-file handles", async () => {
  const source = await readFile("scripts/generate-release-checksums.mjs", "utf8");
  assert.match(source, /readBoundedRegularFile\(path, MAX_RELEASE_ARTIFACT_BYTES/u);
  assert.doesNotMatch(source, /readFile\(path\)/u);
});
