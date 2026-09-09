import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { executeDiff } from "./diff.js";

test("diff command rejects malformed snapshots with usage exit", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-diff-"));
  try {
    await writeFile(join(root, "base.json"), "{}", "utf8");
    await writeFile(join(root, "head.json"), "{}", "utf8");
    assert.equal(await executeDiff(join(root, "base.json"), join(root, "head.json"), true), 2);
  } finally { await rm(root, { recursive: true, force: true }); }
});
