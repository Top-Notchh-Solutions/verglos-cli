import { isApprovalUsable, type ApprovalReceipt } from "./approval-receipt.js";
import type { RemediationProposal } from "./remediation-proposal.js";

export function canApplyRemediation(proposal: RemediationProposal, receipt: ApprovalReceipt, at: string): boolean {
  if (!isApprovalUsable(receipt, at) || receipt.action !== "mutate" || receipt.target !== proposal.targetSubjectId) return false;
  const approvedFiles = new Set(receipt.files);
  return proposal.files.every((file) => approvedFiles.has(file));
}
