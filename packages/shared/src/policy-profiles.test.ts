import assert from "node:assert/strict";
import { test } from "node:test";
import { createFreePolicyProfile, createProPolicyProfile } from "./policy-profiles.js";
import { policyDocumentDigest } from "./policy-document.js";

test("Free policy blocks critical findings but allows incomplete coverage", () => {
  const policy = createFreePolicyProfile();
  assert.equal(policy.policyId, "policy-free");
  assert.equal(policy.checks[0]?.onFailure, "BLOCK");
  assert.equal(policy.checks[0]?.coverage, "allow-incomplete");
  assert.equal(policy.approvals.required, false);
  assert.deepEqual(policy.checks[0]?.severities, ["critical"]);
  assert.equal(policy.checks[0]?.freshness, "current"); assert.equal(policy.checks[0]?.artifactMatch, "not-required"); assert.equal(policy.checks[0]?.hunt, "not-required");
  assert.equal(policy.exceptions.enabled, false); assert.equal(policyDocumentDigest(policy), policyDocumentDigest(createFreePolicyProfile()));
});

test("Pro policy exposes configurable confidence, freshness, coverage, and Hunt", () => {
  const policy = createProPolicyProfile({ minimumConfidence: 0.9, requireHunt: true });
  const check = policy.checks[0]!;
  assert.equal(policy.policyId, "policy-pro");
  assert.equal(check.minimumConfidence, 0.9);
  assert.equal(check.freshness, "current");
  assert.equal(check.coverage, "complete");
  assert.equal(check.hunt, "required");
  assert.equal(policy.exceptions.requireApproval, true);
});
test("Pro policy rejects invalid confidence bounds", () => { assert.throws(() => createProPolicyProfile({ minimumConfidence: 2 }), /between 0 and 1/); assert.throws(() => createProPolicyProfile({ minimumConfidence: Number.NaN }), /finite/); });
