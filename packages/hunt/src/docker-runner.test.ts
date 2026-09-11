import assert from "node:assert/strict";
import { test } from "node:test";
import { runDockerInvocation } from "./docker-runner.js";

test("Docker runner applies timeout and output bounds to the injected process", async () => {
  let received: { timeout: number; maxBuffer: number } | undefined;
  const result = await runDockerInvocation(["run", "--rm"], {
    timeoutMs: 500,
    maxOutputBytes: 8,
    run: async (_args, options) => { received = options; return { stdout: "123456789", stderr: "err" }; },
  });
  assert.deepEqual(received, { timeout: 500, maxBuffer: 8 });
  assert.equal(result.status, "completed");
  assert.equal(result.outputBytes, 8);
  assert.equal(result.truncated, true);
});

test("Docker runner turns timeout and process failures into explicit non-success states", async () => {
  const timedOut = await runDockerInvocation(["run"], { timeoutMs: 500, maxOutputBytes: 128, run: async () => { const error = new Error("timeout") as Error & { killed?: boolean }; error.killed = true; throw error; } });
  assert.equal(timedOut.status, "timed-out");
  const failed = await runDockerInvocation(["run"], { timeoutMs: 500, maxOutputBytes: 128, run: async () => { throw new Error("docker unavailable"); } });
  assert.equal(failed.status, "failed");
});

test("Docker runner rejects unsafe bounds before invoking the process", async () => {
  await assert.rejects(() => runDockerInvocation([], { timeoutMs: 1, maxOutputBytes: 1 }), /invocation/);
  await assert.rejects(() => runDockerInvocation(["run"], { timeoutMs: 0, maxOutputBytes: 1 }), /timeout/);
  await assert.rejects(() => runDockerInvocation(["run"], { timeoutMs: 1, maxOutputBytes: 10_000_001 }), /output/);
});
