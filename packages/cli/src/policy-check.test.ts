import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { executePolicyCheck } from "./policy-check.js";

test("policy check returns usage exit for invalid input without mutation", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-policy-"));
  try { const path = join(root, "evaluation.json"); await writeFile(path, "{}", "utf8"); assert.equal(await executePolicyCheck(path, true, true), 78); } finally { await rm(root, { recursive: true, force: true }); }
});
