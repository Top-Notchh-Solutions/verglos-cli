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
  assert.equal(typeof runtime.planSupportedHuntAttack, "function");
  assert.equal(typeof runtime.validateSupportedHuntRecipe, "function");
  assert.equal(typeof runtime.RestrictedProcessAdapter, "function");
  assert.equal(typeof runtime.DockerSandboxAdapter, "function");
  assert.equal(runtime.HUNT_TARGET_HARNESS_IMAGE, "docker.io/library/node");
  assert.match(runtime.HUNT_TARGET_HARNESS_IMAGE_DIGEST, /^sha256:[a-f0-9]{64}$/u);
});

test("public CLI Hunt runtime boundary rejects malformed public runtimes", async () => {
  await assert.rejects(
    () => loadHuntRuntime(async () => ({ runHunt() {} })),
    /HUNT_RUNTIME_INVALID/,
  );
});
