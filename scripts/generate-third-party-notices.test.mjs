import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { test } from "node:test";

const run = promisify(execFile);

test("third-party notices are deterministic and contain provenance disclaimers", async () => {
  const first = (await run("node", ["scripts/generate-third-party-notices.mjs"], { maxBuffer: 16 * 1024 * 1024 })).stdout;
  const second = (await run("node", ["scripts/generate-third-party-notices.mjs"], { maxBuffer: 16 * 1024 * 1024 })).stdout;
  assert.equal(first, second);
  assert.match(first, /^THIRD-PARTY NOTICES\n/);
  assert.match(first, /preserves upstream identity/);
  assert.match(first, /License:/);
  assert.doesNotMatch(first, /node_modules[\\/]/);
});
