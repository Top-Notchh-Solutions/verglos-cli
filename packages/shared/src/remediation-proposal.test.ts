import assert from "node:assert/strict";
import { test } from "node:test";
import { parseRemediationProposal } from "./remediation-proposal.js";

test("remediation proposals are bounded and never claim mutation or network", () => {
  const proposal = parseRemediationProposal({ proposalId: "123e4567-e89b-12d3-a456-426614174000", findingId: "ai-002", targetSubjectId: "urn:verglos:subject:artifact:sha256:" + "a".repeat(64), files: ["src/token.ts"], summary: "replace weak randomness", tests: ["npm test"], policyEffect: "clears critical finding", uncertainty: "requires review", networkRequired: false, applied: false });
  assert.equal(proposal.applied, false);
  assert.throws(() => parseRemediationProposal({ ...proposal, applied: true }));
});
