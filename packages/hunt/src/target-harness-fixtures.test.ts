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
