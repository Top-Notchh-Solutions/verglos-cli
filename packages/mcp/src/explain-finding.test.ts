import assert from "node:assert/strict";
import test from "node:test";
import { explainFinding } from "./tools/explain-finding.js";

test("explain_finding rejects malformed direct calls", () => {
  assert.throws(() => explainFinding({} as any), /string rule/);
  assert.throws(() => explainFinding({ rule: "" }), /exceeds bounds/);
  assert.throws(() => explainFinding({ rule: "x".repeat(257) }), /exceeds bounds/);
});

test("explain_finding preserves unknown-rule result", () => {
  const result = explainFinding({ rule: "UNKNOWN-999" });
  assert.equal(result.found, false);
  assert.equal(result.rule, "UNKNOWN-999");
});
