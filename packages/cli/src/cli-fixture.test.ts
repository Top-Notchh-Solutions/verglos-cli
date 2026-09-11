import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { runCliFixture } from "./cli-fixture.js";

test("CLI fixture captures process output and unexpected file creation", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-fixture-"));
  try { const result = await runCliFixture(process.execPath, ["-e", "process.stdout.write('ok'); process.stderr.write('warn');"], root); assert.equal(result.exitCode, 0); assert.equal(result.stdout, "ok"); assert.equal(result.stderr, "warn"); assert.equal(result.timedOut, false); assert.deepEqual(result.files, []); } finally { await rm(root, { recursive: true, force: true }); }
});

test("CLI fixture terminates bounded subprocesses and reports timeout", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-fixture-timeout-"));
  try {
    const result = await runCliFixture(process.execPath, ["-e", "setTimeout(() => {}, 10_000)"], root, { timeoutMs: 50 });
    assert.equal(result.timedOut, true);
    assert.notEqual(result.exitCode, 0);
    assert.deepEqual(result.files, []);
  } finally { await rm(root, { recursive: true, force: true }); }
});
