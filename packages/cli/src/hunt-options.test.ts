import assert from "node:assert/strict";
import { test } from "node:test";
import { executeHunt } from "./hunt.js";
import { readFile } from "node:fs/promises";

test("hunt rejects malformed options before entitlement lookup", async () => {
  const logs: string[] = [];
  const original = console.log;
  console.log = (value?: unknown) => logs.push(String(value));
  try {
    assert.equal(await executeHunt({ severity: "critical,unknown", json: true }), 2);
    assert.deepEqual(JSON.parse(logs[0]!), { status: "error", code: "HUNT_INPUT", message: "hunt options are invalid" });
  } finally { console.log = original; }
});

test("hunt rejects unsupported sandbox and control-character finding values", async () => {
  assert.equal(await executeHunt({ sandbox: "node-vm", quiet: true }), 2);
  assert.equal(await executeHunt({ finding: "bad\u0000id", quiet: true }), 2);
});

test("hunt help advertises only supported sandbox adapters", async () => {
  const source = await readFile(new URL("./index.ts", import.meta.url), "utf8");
  assert.match(source, /\.option\("--sandbox <adapter>", "Sandbox adapter: auto, docker"\)/u);
  assert.doesNotMatch(source, /Sandbox adapter: auto, node-vm, docker, firecracker/u);
});
