import assert from "node:assert/strict";
import { test } from "node:test";
import { createApprovalReceipt, isApprovalUsable } from "./approval-receipt.js";

const request = { requestId: "123e4567-e89b-12d3-a456-426614174000", action: "mutate" as const, actor: "agent", target: "workspace:file", files: ["src/a.ts"], network: [], policyEffect: "policy-free", requestedAt: "2026-01-01T00:00:00Z", expiresAt: "2026-02-01T00:00:00Z" };
test("approval receipt binds exact request and expires safely", () => { const receipt = createApprovalReceipt(request, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" }); assert.equal(isApprovalUsable(receipt, "2026-01-02T00:00:00Z"), true); assert.equal(isApprovalUsable(receipt, "2026-02-01T00:00:00Z"), false); assert.equal(isApprovalUsable({ ...receipt, target: "workspace:other" }, "2026-01-02T00:00:00Z"), false); assert.throws(() => createApprovalReceipt(request, { decision: "approved", decidedBy: "human", decidedAt: "2026-02-01T00:00:00Z" })); });
