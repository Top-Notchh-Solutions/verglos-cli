import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);
const script = fileURLToPath(new URL("./verify-clean-consumer.mjs", import.meta.url));

test("clean consumer verifier requires an explicit directory and all six package archives", async () => {
  await assert.rejects(run(process.execPath, [script]), /release archive directory is required/);
  const root = await mkdtemp(join(tmpdir(), "verglos-clean-consumer-test-"));
  try {
    await assert.rejects(run(process.execPath, [script, root]), /expected 6 package archives/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
