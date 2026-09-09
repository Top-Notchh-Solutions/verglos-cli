import assert from "node:assert/strict";
import { test } from "node:test";
import { classifyTrivyFailure } from "./trivy-failure-policy.js";

test("Trivy failure policy distinguishes complete and incomplete coverage", () => {
  assert.deepEqual(classifyTrivyFailure(), { coverage: "complete", reason: null, message: "Trivy completed with supported evidence." });
  const result = classifyTrivyFailure("stale-database");
  assert.equal(result.coverage, "incomplete"); assert.equal(result.reason, "stale-database"); assert.match(result.message, /stale/);
});
