import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);
const script = new URL("./verify-release-artifacts.mjs", import.meta.url).pathname;

async function withFixture(fn) {
  const root = await mkdtemp(join(tmpdir(), "verglos-release-check-"));
  try { await fn(root); } finally { await rm(root, { recursive: true, force: true }); }
}

test("release checksum verifier accepts a canonical manifest", async () => {
  await withFixture(async (root) => {
    await writeFile(join(root, "a.tgz"), "artifact");
    const { stdout } = await run("sha256sum", ["a.tgz"], { cwd: root });
    await writeFile(join(root, "SHA256SUMS"), stdout);
    const result = await run(process.execPath, [script, root]);
    assert.match(result.stdout, /verified 1 release artifact checksums/);
  });
});

test("release checksum verifier rejects duplicate entries and symlinks", async () => {
  await withFixture(async (root) => {
    await writeFile(join(root, "a.tgz"), "artifact");
    const { stdout } = await run("sha256sum", ["a.tgz"], { cwd: root });
    await writeFile(join(root, "SHA256SUMS"), `${stdout}${stdout}`);
    await assert.rejects(run(process.execPath, [script, root]), /duplicate checksum entry/);
    await writeFile(join(root, "SHA256SUMS"), stdout);
    await symlink("a.tgz", join(root, "b.tgz"));
    await assert.rejects(run(process.execPath, [script, root]), /not a regular file/);
    assert.equal((await readFile(join(root, "a.tgz"))).toString(), "artifact");
  });
});
