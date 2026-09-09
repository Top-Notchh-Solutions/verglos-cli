import assert from "node:assert/strict";
import { test } from "node:test";
import { authorizeAgentAction } from "./agent-authorization.js";
import { createApprovalReceipt } from "./approval-receipt.js";

const request = { requestId: "123e4567-e89b-12d3-a456-426614174000", action: "mutate" as const, actor: "agent", target: "workspace:app", files: ["src/a.ts"], network: [], policyEffect: "fix", requestedAt: "2026-01-01T00:00:00Z", expiresAt: "2026-02-01T00:00:00Z" };
test("agent authorization distinguishes receipt-free, missing, mismatched, denied, expired, and usable states", () => {
  assert.deepEqual(authorizeAgentAction("inspect", undefined, "2026-01-01T00:00:00Z"), { allowed: true, reason: "approval-not-required" });
  assert.deepEqual(authorizeAgentAction("mutate", undefined, "2026-01-01T00:00:00Z"), { allowed: false, reason: "approval-missing" });
  const denied = createApprovalReceipt(request, { decision: "denied", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
  assert.deepEqual(authorizeAgentAction("mutate", denied, "2026-01-02T00:00:00Z"), { allowed: false, reason: "denied" });
  const approved = createApprovalReceipt(request, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
  assert.deepEqual(authorizeAgentAction("execute", approved, "2026-01-02T00:00:00Z"), { allowed: false, reason: "action-mismatch" });
  assert.deepEqual(authorizeAgentAction("mutate", approved, "2026-02-01T05:30:00+05:30"), { allowed: false, reason: "expired" });
  assert.deepEqual(authorizeAgentAction("mutate", approved, "2026-01-02T00:00:00+05:30"), { allowed: true, reason: "usable" });
});
