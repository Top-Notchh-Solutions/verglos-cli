import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import test from "node:test";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { readBoundedJsonFile, readBoundedJsonFileWithDigest } from "./read-bounded-json.mjs";

test("bounded JSON reader accepts a regular file and rejects links or oversized input", async () => {
  const directory = await mkdtemp(join(tmpdir(), "verglos-bounded-json-"));
  const inputPath = join(directory, "input.json");
  const linkPath = join(directory, "input-link.json");
  const largePath = join(directory, "large.json");
  await writeFile(inputPath, '{"schema":"test"}\n', "utf8");
  await symlink(inputPath, linkPath);
  await writeFile(largePath, '{"payload":"too-large"}\n', "utf8");
  try {
    assert.deepEqual(await readBoundedJsonFile(inputPath, "test input"), { schema: "test" });
    const detailed = await readBoundedJsonFileWithDigest(inputPath, "test input");
    assert.deepEqual(detailed.value, { schema: "test" });
    assert.equal(detailed.bytes, 18);
    assert.match(detailed.sha256, /^sha256:[a-f0-9]{64}$/u);
    await assert.rejects(readBoundedJsonFile(linkPath, "linked input"), /bounded regular file/u);
    await assert.rejects(readBoundedJsonFile(largePath, "large input", 8), /bounded regular file/u);
    assert.equal(await readFile(inputPath, "utf8"), '{"schema":"test"}\n');
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
