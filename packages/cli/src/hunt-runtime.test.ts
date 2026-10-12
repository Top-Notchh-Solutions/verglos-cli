import assert from "node:assert/strict";
import { test } from "node:test";
import { loadHuntRuntime } from "./hunt-runtime.js";

test("public CLI Hunt runtime boundary fails closed when the public runtime is unavailable", async () => {
  await assert.rejects(
    () => loadHuntRuntime(async () => { throw new Error("public package absent"); }),
    /HUNT_RUNTIME_UNAVAILABLE/,
  );
});

test("public CLI loads the shipped bounded Hunt runtime", async () => {
  const runtime = await loadHuntRuntime();
  assert.equal(typeof runtime.runHunt, "function");
  assert.equal(typeof runtime.validateSupportedHuntRecipe, "function");
  assert.equal(typeof runtime.RestrictedProcessAdapter, "function");
});

test("public CLI Hunt runtime boundary rejects malformed public runtimes", async () => {
  await assert.rejects(
    () => loadHuntRuntime(async () => ({ runHunt() {} })),
    /HUNT_RUNTIME_INVALID/,
  );
});
