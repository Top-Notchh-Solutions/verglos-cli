import { createHash } from "node:crypto";
import { z } from "zod";
import { AGENT_ACTIONS } from "./action-authority.js";
import { canonicalizeJson } from "./schema.js";

const Id = z.string().min(1).max(512);
const Time = z.string().datetime({ offset: true });
const ApprovalRequestBaseSchema = z.object({
  requestId: z.string().uuid(),
  action: z.enum(AGENT_ACTIONS),
  actor: Id,
  target: Id,
  files: z.array(Id).max(256),
  network: z.array(z.string().url().max(2048)).max(64),
  policyEffect: Id,
  requestedAt: Time,
  expiresAt: Time,
}).strict();
export const ApprovalRequestSchema = ApprovalRequestBaseSchema.superRefine((value, ctx) => { if (value.expiresAt <= value.requestedAt) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["expiresAt"], message: "approval expiry must follow request time" }); });
export type ApprovalRequest = z.infer<typeof ApprovalRequestSchema>;
export const ApprovalReceiptSchema = ApprovalRequestBaseSchema.extend({ decision: z.enum(["approved", "denied"]), decidedBy: Id, decidedAt: Time, requestDigest: z.string().regex(/^sha256:[a-f0-9]{64}$/) }).strict();
export type ApprovalReceipt = z.infer<typeof ApprovalReceiptSchema>;
export function approvalRequestDigest(request: ApprovalRequest): string { return `sha256:${createHash("sha256").update(canonicalizeJson(ApprovalRequestSchema.parse(request)), "utf8").digest("hex")}`; }
export function createApprovalReceipt(request: ApprovalRequest, input: { decision: "approved" | "denied"; decidedBy: string; decidedAt: string }): ApprovalReceipt { const parsed = ApprovalRequestSchema.parse(request); const receipt = { ...parsed, ...input, requestDigest: approvalRequestDigest(parsed) }; return ApprovalReceiptSchema.parse(receipt); }
export function isApprovalUsable(receipt: ApprovalReceipt, at: string): boolean { const parsed = ApprovalReceiptSchema.parse(receipt); const { decision: _decision, decidedBy: _decidedBy, decidedAt: _decidedAt, requestDigest: _requestDigest, ...request } = parsed; return parsed.decision === "approved" && parsed.requestDigest === approvalRequestDigest(request) && at >= parsed.requestedAt && at < parsed.expiresAt && at >= parsed.decidedAt; }
