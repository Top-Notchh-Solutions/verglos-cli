import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { test } from "node:test";

const run = promisify(execFile);

test("CycloneDX SBOM is deterministic and package refs are unique", async () => {
  const args = ["scripts/generate-sbom.mjs"];
  const first = JSON.parse((await run("node", args, { maxBuffer: 16 * 1024 * 1024 })).stdout);
  const second = JSON.parse((await run("node", args, { maxBuffer: 16 * 1024 * 1024 })).stdout);
  assert.deepEqual(first, second);
  assert.equal(first.bomFormat, "CycloneDX");
  assert.equal(first.specVersion, "1.5");
  const refs = first.components.map((component) => component["bom-ref"]);
  assert.equal(new Set(refs).size, refs.length);
  assert.ok(refs.length > 0);
});
