import assert from "node:assert/strict";
import { test } from "node:test";
import { executeExplain } from "./explain.js";

test("explain rejects bounded-invalid rule IDs in JSON mode", () => {
  const logs: string[] = [];
  const original = console.log;
  console.log = (value?: unknown) => logs.push(String(value));
  try {
    assert.equal(executeExplain({ rule: `bad\u0000rule`, json: true }), 2);
    assert.deepEqual(JSON.parse(logs[0]!), { status: "error", code: "EXPLAIN_INPUT", message: "explain rule is invalid" });
  } finally { console.log = original; }
});

test("explain rejects oversized rule IDs without output in quiet mode", () => {
  assert.equal(executeExplain({ rule: "x".repeat(257), quiet: true }), 2);
});
