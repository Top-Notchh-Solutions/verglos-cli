import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { test } from "node:test";
import { buildDockerInvocation } from "./docker-adapter.js";
import { runDockerInvocation } from "./docker-runner.js";
import { parseTargetHarnessOutput } from "./target-harness.js";
import { HUNT_TARGET_HARNESS_IMAGE, HUNT_TARGET_HARNESS_IMAGE_DIGEST } from "./target-harness.js";

const execFileAsync = promisify(execFile);
const fixtureNames = [
  "sql-nosql-injection",
  "command-injection",
  "path-traversal",
  "ssrf",
  "agent-mcp",
  "xss",
  "authorization",
  "prototype-pollution",
  "secret-credential-use",
  "supply-chain",
] as const;

const expectedSummaries = {
  "sql-nosql-injection": "deterministic SQL injection fixture",
  "command-injection": "deterministic command-injection fixture",
  "path-traversal": "deterministic path-traversal fixture",
  ssrf: "deterministic SSRF fixture",
  "agent-mcp": "deterministic Agent/MCP boundary fixture",
  xss: "deterministic safe-XSS fixture",
  authorization: "deterministic authorization and mass-assignment fixture",
  "prototype-pollution": "deterministic prototype-pollution fixture",
  "secret-credential-use": "deterministic synthetic credential-use fixture",
  "supply-chain": "deterministic disposable supply-chain fixture",
} as const;

type FixtureProcessResult = Readonly<{
  readonly status: "completed" | "timed-out" | "failed";
  readonly exitCode?: number;
  readonly stdout: string;
  readonly stderr: string;
}>;

function runFixtureProcess(fixture: string, fixtureCase: string, timeoutMs?: number): Promise<FixtureProcessResult> {
  return new Promise((resolve, reject) => {
    execFile(process.execPath, [fixture, fixtureCase], { encoding: "utf8", timeout: timeoutMs }, (error, stdout, stderr) => {
      if (!error) return resolve({ status: "completed", stdout, stderr });
      const processError = error as NodeJS.ErrnoException & { readonly killed?: boolean };
      if (processError.killed === true || processError.code === "ETIMEDOUT") return resolve({ status: "timed-out", stdout, stderr });
      resolve({
        status: "failed",
        ...(typeof processError.code === "number" ? { exitCode: processError.code } : {}),
        stdout,
        stderr,
      });
    }).on("error", reject);
  });
}

test("each public A2 reference harness emits positive, negative, and unsupported results", async () => {
  for (const name of fixtureNames) {
    const fixture = fileURLToPath(new URL(`../fixtures/target-code/.verglos/hunt/${name}.mjs`, import.meta.url));
    for (const [fixtureCase, expectedVerdict] of [["positive", "confirmed"], ["negative", "not-reproduced"], ["unsupported", "unsupported"]] as const) {
      const result = await execFileAsync(process.execPath, [fixture, fixtureCase], { encoding: "utf8" });
      assert.equal(result.stderr, "", `${name}/${fixtureCase} emitted stderr`);
      const parsed = parseTargetHarnessOutput(result.stdout);
      assert.deepEqual(parsed, { verdict: expectedVerdict, summary: expectedSummaries[name] }, `${name}/${fixtureCase}`);
    }
  }
});

test("each public A2 reference harness exposes timeout and adapter-failure process outcomes", async () => {
  for (const name of fixtureNames) {
    const fixture = fileURLToPath(new URL(`../fixtures/target-code/.verglos/hunt/${name}.mjs`, import.meta.url));
    const timedOut = await runFixtureProcess(fixture, "timeout", 100);
    assert.equal(timedOut.status, "timed-out", `${name}/timeout`);
    const failed = await runFixtureProcess(fixture, "adapter-failure");
    assert.equal(failed.status, "failed", `${name}/adapter-failure`);
    assert.equal(failed.exitCode, 17, `${name}/adapter-failure exit code`);
    assert.match(failed.stderr, /intentional adapter failure fixture/u, `${name}/adapter-failure stderr`);
  }
});

test("Agent/MCP harness binds an explicit capability receipt and rejects replay", async () => {
  const fixture = fileURLToPath(new URL("../fixtures/target-code/.verglos/hunt/agent-mcp.mjs", import.meta.url));
  const result = await execFileAsync(process.execPath, [fixture, "negative"], { encoding: "utf8" });
  const output = JSON.parse(result.stdout.trim()) as { capabilityReceipt?: Record<string, unknown> };
  assert.deepEqual(output.capabilityReceipt, {
    version: 1,
    receiptId: "fixture-receipt:get:user-input",
    capability: "agent.tool.invoke",
    action: "tool.call",
    tool: "get",
    target: "synthetic-fixture",
    inputDigest: "fixture-input:get:user-input",
    decision: "approved",
    replayPolicy: "single-use",
    firstApprovedCall: "get:user-input",
    replay: "rejected",
  });
});

test("each public A2 reference harness executes local target code in the pinned Docker boundary", { skip: process.env.VERGLOS_HUNT_DOCKER_TARGET_INTEGRATION !== "1" ? "set VERGLOS_HUNT_DOCKER_TARGET_INTEGRATION=1 to run target-code Docker qualification" : false }, async () => {
  const projectRoot = fileURLToPath(new URL("../fixtures/target-code/", import.meta.url));
  for (const name of fixtureNames) {
    const commandPath = `/workspace/.verglos/hunt/${name}.mjs`;
    for (const [fixtureCase, expectedVerdict] of [["positive", "confirmed"], ["negative", "not-reproduced"], ["unsupported", "unsupported"]] as const) {
      const args = buildDockerInvocation({
        projectRoot,
        image: HUNT_TARGET_HARNESS_IMAGE,
        imageDigest: HUNT_TARGET_HARNESS_IMAGE_DIGEST,
        command: ["node", commandPath, fixtureCase],
        timeoutMs: 5_000,
        memoryMb: 256,
        maxProcesses: 16,
        cpus: 1,
        diskMb: 128,
      });
      const result = await runDockerInvocation(args, { timeoutMs: 5_000, maxOutputBytes: 4_096, sensitivePaths: [projectRoot] });
      assert.equal(result.status, "completed", `${name}/${fixtureCase} Docker status`);
      assert.equal(result.exitCode, 0, `${name}/${fixtureCase} Docker exit code`);
      assert.deepEqual(parseTargetHarnessOutput(result.stdout), { verdict: expectedVerdict, summary: expectedSummaries[name] }, `${name}/${fixtureCase} Docker result`);
    }
  }
});
