import assert from "node:assert/strict";
import { test } from "node:test";
import { parsePolicyDocument, policyDocumentDigest } from "./policy-document.js";

const policy = { schemaId: "urn:verglos:schema:policy-document", schemaVersion: "1.0.0", policyId: "policy-free", policyVersion: "1.0.0", checks: [{ id: "check-critical", requirement: "required", onFailure: "BLOCK", severities: ["critical"], minimumConfidence: 0.8, freshness: "current", coverage: "complete", artifactMatch: "required", hunt: "not-required" }], exceptions: { enabled: true, requireApproval: true }, approvals: { required: true, authorities: ["release-owner"] } } as const;

test("policy documents validate strict gates and produce stable digests", () => {
  const parsed = parsePolicyDocument(policy);
  assert.equal(policyDocumentDigest(parsed), policyDocumentDigest({ ...parsed, checks: [...parsed.checks].reverse() }));
  assert.throws(() => parsePolicyDocument({ ...policy, unsafe: true }));
});
