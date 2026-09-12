import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

const run = promisify(execFile);
test("clean public pack contains six archives without compiled tests", async () => {
  const output = await mkdtemp(join(tmpdir(), "verglos-public-pack-"));
  try {
    await run(process.execPath, ["scripts/pack-public-packages.mjs", output], { maxBuffer: 8 * 1024 * 1024 });
    const archives = (await readdir(output)).filter((name) => name.endsWith(".tgz"));
    assert.equal(archives.length, 6);
    for (const archive of archives) {
      const { stdout } = await run("tar", ["-tzf", join(output, archive)]);
      assert.doesNotMatch(stdout, /(^|\/)[^/]*\.test\./u);
      assert.doesNotMatch(stdout, /workspace:/);
      const { stdout: license } = await run("tar", ["-xOf", join(output, archive), "package/LICENSE"], { encoding: "buffer" });
      assert.deepEqual(license, await readFile("LICENSE"), `${archive} must carry the repository license byte-for-byte`);
    }
  } finally { await rm(output, { recursive: true, force: true }); }
});
