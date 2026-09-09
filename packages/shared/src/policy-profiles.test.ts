import assert from "node:assert/strict";
import { test } from "node:test";
import { createFreePolicyProfile } from "./policy-profiles.js";

test("Free policy blocks critical findings but allows incomplete coverage", () => {
  const policy = createFreePolicyProfile();
  assert.equal(policy.policyId, "policy-free");
  assert.equal(policy.checks[0]?.onFailure, "BLOCK");
  assert.equal(policy.checks[0]?.coverage, "allow-incomplete");
  assert.equal(policy.approvals.required, false);
});
