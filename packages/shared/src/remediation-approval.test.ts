import assert from "node:assert/strict";
import { test } from "node:test";
import { createApprovalReceipt } from "./approval-receipt.js";
import { canApplyRemediation } from "./remediation-approval.js";
import { parseRemediationProposal } from "./remediation-proposal.js";

test("remediation application requires exact mutate approval and file scope", () => {
  const target = "urn:verglos:subject:artifact:sha256:" + "a".repeat(64);
  const proposal = parseRemediationProposal({ proposalId: "123e4567-e89b-12d3-a456-426614174000", findingId: "ai-002", targetSubjectId: target, files: ["src/a.ts"], summary: "fix", tests: [], policyEffect: "clears finding", uncertainty: "review", networkRequired: false, applied: false });
  const receipt = createApprovalReceipt({ requestId: "123e4567-e89b-12d3-a456-426614174001", action: "mutate", actor: "agent", target, files: ["src/a.ts"], network: [], policyEffect: "clears finding", requestedAt: "2026-01-01T00:00:00Z", expiresAt: "2026-02-01T00:00:00Z" }, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
  assert.equal(canApplyRemediation(proposal, receipt, "2026-01-02T00:00:00Z"), true);
  assert.equal(canApplyRemediation({ ...proposal, files: ["src/other.ts"] }, receipt, "2026-01-02T00:00:00Z"), false);

  const wrongPolicy = createApprovalReceipt({ requestId: "223e4567-e89b-12d3-a456-426614174001", action: "mutate", actor: "agent", target, files: ["src/a.ts"], network: [], policyEffect: "different effect", requestedAt: "2026-01-01T00:00:00Z", expiresAt: "2026-02-01T00:00:00Z" }, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
  assert.equal(canApplyRemediation(proposal, wrongPolicy, "2026-01-02T00:00:00Z"), false);

  const networkApproval = createApprovalReceipt({ requestId: "323e4567-e89b-12d3-a456-426614174001", action: "mutate", actor: "agent", target, files: ["src/a.ts"], network: ["https://example.com"], policyEffect: "clears finding", requestedAt: "2026-01-01T00:00:00Z", expiresAt: "2026-02-01T00:00:00Z" }, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
  assert.equal(canApplyRemediation(proposal, networkApproval, "2026-01-02T00:00:00Z"), false);
});
