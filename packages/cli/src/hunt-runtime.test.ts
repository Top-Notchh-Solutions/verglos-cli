import assert from "node:assert/strict";
import { test } from "node:test";
import { loadHuntRuntime } from "./hunt-runtime.js";

test("public CLI Hunt runtime boundary fails closed when the private runtime is unavailable", async () => {
  await assert.rejects(
    () => loadHuntRuntime(async () => { throw new Error("private package absent"); }),
    /HUNT_RUNTIME_UNAVAILABLE/,
  );
});

test("public CLI Hunt runtime boundary rejects malformed private runtimes", async () => {
  await assert.rejects(
    () => loadHuntRuntime(async () => ({ runHunt() {} })),
    /HUNT_RUNTIME_INVALID/,
  );
});
