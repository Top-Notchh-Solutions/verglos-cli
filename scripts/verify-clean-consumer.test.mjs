import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { cleanConsumerInstallTimeoutMs } from "./clean-consumer-runtime.mjs";

const run = promisify(execFile);
const script = fileURLToPath(new URL("./verify-clean-consumer.mjs", import.meta.url));

test("clean consumer verifier requires an explicit directory and all seven package archives", async () => {
  await assert.rejects(run(process.execPath, [script]), /release archive directory is required/);
  const root = await mkdtemp(join(tmpdir(), "verglos-clean-consumer-test-"));
  try {
    await assert.rejects(run(process.execPath, [script, root]), /expected 7 package archives/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("clean consumer install keeps a bounded but platform-appropriate timeout", () => {
  assert.equal(cleanConsumerInstallTimeoutMs("linux"), 180_000);
  assert.equal(cleanConsumerInstallTimeoutMs("darwin"), 180_000);
  assert.equal(cleanConsumerInstallTimeoutMs("win32"), 300_000);
});
