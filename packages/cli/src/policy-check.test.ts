import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { executePolicyCheck } from "./policy-check.js";

test("policy check returns usage exit for invalid input without mutation", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-policy-"));
  try {
    const path = join(root, "evaluation.json");
    await writeFile(path, "{}", "utf8");
    assert.equal(await executePolicyCheck(path, true, true), 2);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("policy check rejects record and snapshot inputs with a stable JSON error", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-policy-"));
  const original = console.log;
  const lines: string[] = [];
  console.log = (line?: unknown) => lines.push(String(line));
  try {
    const path = join(root, "release.vgl");
    await writeFile(path, "not-a-record", "utf8");
    assert.equal(await executePolicyCheck(path, true, true), 2);
    assert.deepEqual(JSON.parse(lines[0]!), {
      status: "error",
      code: "POLICY_CHECK_INPUT",
      message: "record and snapshot inputs are not supported by policy check",
    });
  } finally {
    console.log = original;
    await rm(root, { recursive: true, force: true });
  }
});

test("policy check rejects oversized inputs before parsing", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-policy-"));
  try {
    const path = join(root, "evaluation.json");
    await writeFile(path, Buffer.alloc(8 * 1024 * 1024 + 1));
    assert.equal(await executePolicyCheck(path, true, true), 2);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
