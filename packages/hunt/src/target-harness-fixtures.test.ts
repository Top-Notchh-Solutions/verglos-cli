import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { test } from "node:test";
import { parseTargetHarnessOutput } from "./target-harness.js";

const execFileAsync = promisify(execFile);
const fixtureNames = [
  "sql-nosql-injection",
  "command-injection",
  "path-traversal",
  "ssrf",
  "agent-mcp",
  "xss",
  "authorization",
] as const;

const expectedSummaries = {
  "sql-nosql-injection": "deterministic SQL injection fixture",
  "command-injection": "deterministic command-injection fixture",
  "path-traversal": "deterministic path-traversal fixture",
  ssrf: "deterministic SSRF fixture",
  "agent-mcp": "deterministic Agent/MCP boundary fixture",
  xss: "deterministic safe-XSS fixture",
  authorization: "deterministic authorization and mass-assignment fixture",
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
