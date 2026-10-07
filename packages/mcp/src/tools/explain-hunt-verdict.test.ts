import assert from "node:assert/strict";
import { test } from "node:test";
import { explainHuntVerdict } from "./explain-hunt-verdict.js";

test("explains each bounded Hunt verdict without executing Hunt", () => {
  for (const verdict of ["true", "false", "not_attemptable"] as const) {
    const result = explainHuntVerdict({ findingId: "finding-1", verdict });
    assert.equal(result.ok, true);
    assert.equal(result.tool, "verglos_hunt_explain_verdict");
    assert.equal(result.findingId, "finding-1");
    assert.equal(result.verdict, verdict);
    assert.ok(result.meaning.length > 0);
    assert.equal(result.limitations.length, 3);
    assert.ok(result.limitations.some((limitation) => limitation.includes("does not rerun Hunt")));
  }
});

test("rejects unsafe or unbounded Hunt finding identifiers", () => {
  assert.throws(() => explainHuntVerdict({ findingId: "finding\n1", verdict: "true" }), /control characters/);
  assert.throws(() => explainHuntVerdict({ findingId: "x".repeat(513), verdict: "true" }), /exceeds bounds/);
  assert.throws(() => explainHuntVerdict({ findingId: "finding-1", verdict: "maybe" as "true" }), /invalid/);
});
