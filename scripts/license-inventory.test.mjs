import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { test } from "node:test";

const run = promisify(execFile);

test("dependency license inventory is deterministic and review-safe", async () => {
  const first = JSON.parse((await run("node", ["scripts/license-inventory.mjs"], { maxBuffer: 16 * 1024 * 1024 })).stdout);
  const second = JSON.parse((await run("node", ["scripts/license-inventory.mjs"], { maxBuffer: 16 * 1024 * 1024 })).stdout);
  assert.equal(first.schemaId, "urn:verglos:artifact:dependency-license-inventory");
  assert.deepEqual(first, second);
  assert.ok(first.packages.length > 0);
  assert.ok(first.packages.every((entry) => ["direct", "transitive"].includes(entry.scope)));
  assert.ok(first.packages.every((entry) => typeof entry.declaredLicense === "string" && typeof entry.reviewBlocker === "boolean"));
  assert.deepEqual(first.reviewBlockers, first.packages.filter((entry) => entry.reviewBlocker).map((entry) => ({ name: entry.name, license: entry.declaredLicense })));
});
