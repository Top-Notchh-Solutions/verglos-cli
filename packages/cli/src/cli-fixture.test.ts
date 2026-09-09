import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { runCliFixture } from "./cli-fixture.js";

test("CLI fixture captures process output and unexpected file creation", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-fixture-"));
  try { const result = await runCliFixture(process.execPath, ["-e", "process.stdout.write('ok'); process.stderr.write('warn');"], root); assert.equal(result.exitCode, 0); assert.equal(result.stdout, "ok"); assert.equal(result.stderr, "warn"); assert.deepEqual(result.files, []); } finally { await rm(root, { recursive: true, force: true }); }
});
