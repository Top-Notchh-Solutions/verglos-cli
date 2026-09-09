import assert from "node:assert/strict";
import { test } from "node:test";
import { classifyHuntOutcome } from "./hunt-verdict.js";

test("Hunt verdict classifier preserves infrastructure and policy outcomes", () => {
  assert.equal(classifyHuntOutcome({ policyAllowed: false, supported: true }), "policy-denied");
  assert.equal(classifyHuntOutcome({ policyAllowed: true, supported: false }), "not-supported");
  assert.equal(classifyHuntOutcome({ policyAllowed: true, supported: true, environmentError: true }), "environment-error");
  assert.equal(classifyHuntOutcome({ policyAllowed: true, supported: true, assertionMatched: false }), "not-reproduced");
});
