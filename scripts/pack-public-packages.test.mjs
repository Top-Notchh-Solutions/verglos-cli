import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

const run = promisify(execFile);
test("clean public pack contains six archives without compiled tests or CLI process fixtures", async () => {
  const output = await mkdtemp(join(tmpdir(), "verglos-public-pack-"));
  try {
    const { stdout: expectedNotices } = await run(process.execPath, ["scripts/generate-third-party-notices.mjs"], { maxBuffer: 16 * 1024 * 1024 });
    await run(process.execPath, ["scripts/pack-public-packages.mjs", output], { maxBuffer: 8 * 1024 * 1024 });
    const archives = (await readdir(output)).filter((name) => name.endsWith(".tgz"));
    assert.equal(archives.length, 6);
    for (const archive of archives) {
      const { stdout } = await run("tar", ["-tzf", join(output, archive)]);
      assert.doesNotMatch(stdout, /(^|\/)[^/]*\.test\./u);
      assert.doesNotMatch(stdout, /(^|\/)cli-fixture\./u);
      assert.doesNotMatch(stdout, /workspace:/);
      const { stdout: license } = await run("tar", ["-xOf", join(output, archive), "package/LICENSE"], { encoding: "buffer" });
      assert.deepEqual(license, await readFile("LICENSE"), `${archive} must carry the repository license byte-for-byte`);
      const { stdout: notices } = await run("tar", ["-xOf", join(output, archive), "package/THIRD_PARTY_NOTICES"], { encoding: "buffer", maxBuffer: 16 * 1024 * 1024 });
      assert.deepEqual(notices, Buffer.from(expectedNotices), `${archive} must carry the generated third-party notices`);
      assert.match(notices.toString("utf8"), /benchmark \(1\.0\.0\)[\s\S]*?Bundled by: fast-uri@3\.1\.4/u);
    }
  } finally { await rm(output, { recursive: true, force: true }); }
});
