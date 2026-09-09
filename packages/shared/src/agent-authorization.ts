import { actionAuthority, parseAgentAction, type AgentAction } from "./action-authority.js";
import { ApprovalReceiptSchema, type ApprovalReceipt } from "./approval-receipt.js";

export type AgentAuthorization = Readonly<{ allowed: boolean; reason: "approval-not-required" | "approval-missing" | "action-mismatch" | "receipt-invalid" | "denied" | "expired" | "usable" }>;

export function authorizeAgentAction(actionValue: unknown, receiptValue: ApprovalReceipt | undefined, at: string): AgentAuthorization {
  let action: AgentAction;
  try { action = parseAgentAction(actionValue); } catch { return { allowed: false, reason: "receipt-invalid" }; }
  if (!actionAuthority(action).approvalRequired) return { allowed: true, reason: "approval-not-required" };
  if (!receiptValue) return { allowed: false, reason: "approval-missing" };
  let receipt: ApprovalReceipt;
  try { receipt = ApprovalReceiptSchema.parse(receiptValue); } catch { return { allowed: false, reason: "receipt-invalid" }; }
  if (receipt.action !== action) return { allowed: false, reason: "action-mismatch" };
  const now = Date.parse(at); const start = Date.parse(receipt.requestedAt); const expiry = Date.parse(receipt.expiresAt); const decided = Date.parse(receipt.decidedAt);
  if (!Number.isFinite(now) || now < start || now >= expiry || now < decided) return { allowed: false, reason: "expired" };
  if (receipt.decision !== "approved") return { allowed: false, reason: "denied" };
  return { allowed: true, reason: "usable" };
}
