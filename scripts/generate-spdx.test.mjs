import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { test } from "node:test";
const run = promisify(execFile);
test("SPDX SBOM is deterministic with unique package identifiers", async () => {
  const args = ["scripts/generate-spdx.mjs"];
  const a = JSON.parse((await run("node", args, { maxBuffer: 16 * 1024 * 1024 })).stdout);
  const b = JSON.parse((await run("node", args, { maxBuffer: 16 * 1024 * 1024 })).stdout);
  assert.deepEqual(a, b);
  assert.equal(a.spdxVersion, "SPDX-2.3");
  assert.equal(new Set(a.packages.map((p) => p.SPDXID)).size, a.packages.length);
  assert.ok(a.packages.length > 0);
});
