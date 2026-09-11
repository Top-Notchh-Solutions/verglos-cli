import assert from "node:assert/strict";
import { test } from "node:test";
import { runDockerInvocation } from "./docker-runner.js";

test("Docker runner applies timeout and output bounds to the injected process", async () => {
  let received: { timeout: number; maxBuffer: number } | undefined;
  const result = await runDockerInvocation(["run", "--rm"], {
    timeoutMs: 500,
    maxOutputBytes: 8,
    sensitivePaths: ["/private/project"],
    run: async (_args, options) => { received = options; return { stdout: "token=123456789 /private/project", stderr: "err" }; },
  });
  assert.deepEqual(received, { timeout: 500, maxBuffer: 8 });
  assert.equal(result.status, "completed");
  assert.equal(result.outputBytes, 8);
  assert.equal(result.truncated, true);
  assert.equal(result.redacted, true);
  assert.match(result.evidenceDigest, /^sha256:[a-f0-9]{64}$/);
  assert.doesNotMatch(result.stdout, /123456789/);
  assert.doesNotMatch(result.stdout, /\/private\/project/);
  const pathResult = await runDockerInvocation(["run"], { timeoutMs: 500, maxOutputBytes: 1_000, sensitivePaths: ["/private/project"], run: async () => ({ stdout: "/private/project/src/app.ts", stderr: "" }) });
  assert.doesNotMatch(pathResult.stdout, /\/private\/project/);
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

test("Docker runner rejects malformed argv before invoking the process", async () => {
  await assert.rejects(() => runDockerInvocation(["run", "x\u0000y"], { timeoutMs: 1000, maxOutputBytes: 1000 }), /arguments/);
  await assert.rejects(() => runDockerInvocation(["run", undefined as never], { timeoutMs: 1000, maxOutputBytes: 1000 }), /arguments/);
});

test("Docker runner keeps returned UTF-8 output within the byte cap", async () => {
  const result = await runDockerInvocation(["run"], {
    timeoutMs: 1000,
    maxOutputBytes: 4,
    run: async () => ({ stdout: "🙂🙂", stderr: "" }),
  });
  assert.ok(Buffer.byteLength(result.stdout, "utf8") <= 4);
  assert.equal(result.truncated, true);
});
