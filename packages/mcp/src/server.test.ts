import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { test } from "node:test";
import { createApprovalReceipt, readApprovalReceipt } from "@verglos/shared";
import { dispatchTool, jsonResponse, listAdvertisedTools } from "./server.js";

function responseText(result: Awaited<ReturnType<typeof dispatchTool>>): Record<string, unknown> {
  return JSON.parse(result.content[0]!.text) as Record<string, unknown>;
}

test("MCP tools/list publishes shared capability metadata for every tool", () => {
  const tools = listAdvertisedTools();
  assert.equal(tools.length, 9);
  assert.equal(new Set(tools.map((tool) => tool.name)).size, tools.length);
  for (const tool of tools) {
    const capability = tool._meta?.["verglos/capability"] as unknown as Record<string, unknown> | undefined;
    assert.ok(capability, `${tool.name} must publish capability metadata`);
    assert.equal(typeof capability.action, "string");
    assert.equal(typeof capability.plan, "string");
    assert.equal(typeof capability.maturity, "string");
    assert.equal(typeof capability.approvalRequired, "boolean");
    assert.ok(Array.isArray(capability.inputFields));
    assert.ok(Array.isArray(capability.outputFields));
  }
  const scan = tools.find((tool) => tool.name === "verglos_scan");
  assert.deepEqual(scan?._meta, { "verglos/capability": { tool: "verglos_scan", action: "inspect", plan: "free", maturity: "shipped", approvalRequired: false, sideEffect: "none", inputFields: ["projectRoot", "limit", "noProvenance"], outputFields: ["projectRoot", "scannedAt", "durationMs", "score", "provenance", "findingCount", "findings", "truncated", "headline"] } });
  const hunt = tools.find((tool) => tool.name === "verglos_hunt_report");
  assert.equal((hunt?._meta["verglos/capability"] as { sideEffect: string }).sideEffect, "process");
});

test("MCP dispatch rejects non-object tool arguments", async () => {
  const result = await dispatchTool("verglos_scan", [] as unknown as Record<string, unknown>);
  assert.deepEqual(responseText(result), { ok: false, error: "usage", code: "MCP_ARGUMENTS_INPUT", message: "tool arguments must be an object" });
});

test("MCP dispatch rejects oversized tool arguments before handlers", async () => {
  const result = await dispatchTool("verglos_check_package", { packageName: "x".repeat(256 * 1024) });
  assert.deepEqual(responseText(result), { ok: false, error: "usage", code: "MCP_ARGUMENTS_INPUT", message: "tool arguments exceed the 256 KiB limit" });
});

test("MCP response encoder fails closed on oversized payloads", () => {
  const result = jsonResponse({ evidence: "x".repeat(512 * 1024) });
  assert.deepEqual(responseText(result), { ok: false, error: "output", code: "MCP_OUTPUT_LIMIT", message: "tool response exceeds the 512 KiB limit" });
});

test("MCP dispatch rejects unknown tools with a stable structured error", async () => {
  assert.deepEqual(responseText(await dispatchTool("verglos_unknown", {})), { ok: false, error: "usage", code: "MCP_UNKNOWN_TOOL", message: "unknown MCP tool" });
});

test("MCP dispatch denies approval-required tools before their handler or stub", async () => {
  const result = responseText(await dispatchTool("verglos_hunt_report", { reportPath: "/tmp/report.json" }));
  assert.equal(result.code, "MCP_APPROVAL_REQUIRED");
  assert.equal(result.error, "usage");
});

test("MCP dispatch enforces the explicitly supplied entitlement plan", async () => {
  const denied = responseText(await dispatchTool("verglos_hunt_report", {}, { plan: "free" }));
  assert.deepEqual(denied, { ok: false, error: "usage", code: "MCP_ENTITLEMENT_REQUIRED", message: "MCP tool requires the pro plan" });
  const allowed = responseText(await dispatchTool("verglos_hunt_report", {}, { plan: "pro" }));
  assert.equal(allowed.code, "MCP_APPROVAL_REQUIRED");
  const team = responseText(await dispatchTool("verglos_hunt_report", {}, { plan: "team" }));
  assert.equal(team.code, "MCP_APPROVAL_REQUIRED");
  const enterprise = responseText(await dispatchTool("verglos_attest", {}, { plan: "enterprise" }));
  assert.equal(enterprise.code, "MCP_APPROVAL_REQUIRED");
});

test("MCP read-only tools keep strict unknown-field validation", async () => {
  const result = responseText(await dispatchTool("verglos_scan", { approvalReceipt: {} }));
  assert.equal(result.code, "MCP_SCAN_INPUT");
  assert.equal(result.error, "usage");
});

test("MCP dispatch accepts an exact approved receipt and preserves the alpha stub state", async () => {
  const request = {
    requestId: "123e4567-e89b-12d3-a456-426614174000",
    action: "execute" as const,
    actor: "agent",
    target: "report:/tmp/report.json",
    files: ["/tmp/report.json"],
    network: [],
    policyEffect: "hunt finding",
    requestedAt: "2026-01-01T00:00:00Z",
    expiresAt: "2099-01-01T00:00:00Z",
  };
  const approvalReceipt = createApprovalReceipt(request, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
  const result = responseText(await dispatchTool("verglos_hunt_report", { reportPath: "/tmp/report.json", approvalReceipt }));
  assert.equal(result.error, "not_implemented_in_alpha");
  assert.equal(result.tool, "verglos_hunt_report");
});

test("MCP dispatch rejects a valid receipt widened to another target", async () => {
  const request = {
    requestId: "223e4567-e89b-12d3-a456-426614174000",
    action: "execute" as const,
    actor: "agent",
    target: "report:/tmp/approved.json",
    files: ["/tmp/approved.json"],
    network: [],
    policyEffect: "hunt report",
    requestedAt: "2026-01-01T00:00:00Z",
    expiresAt: "2099-01-01T00:00:00Z",
  };
  const approvalReceipt = createApprovalReceipt(request, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
  const result = responseText(await dispatchTool("verglos_hunt_report", { reportPath: "/tmp/other.json", approvalReceipt }));
  assert.equal(result.code, "MCP_APPROVAL_SCOPE");
  assert.equal(result.error, "usage");
});

test("MCP dispatch rejects an approval receipt that omits the requested file scope", async () => {
  const request = {
    requestId: "323e4567-e89b-12d3-a456-426614174000",
    action: "execute" as const,
    actor: "agent",
    target: "report:/tmp/report.json",
    files: ["/tmp/other.json"],
    network: [],
    policyEffect: "hunt report",
    requestedAt: "2026-01-01T00:00:00Z",
    expiresAt: "2099-01-01T00:00:00Z",
  };
  const approvalReceipt = createApprovalReceipt(request, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
  const result = responseText(await dispatchTool("verglos_hunt_report", { reportPath: "/tmp/report.json", approvalReceipt }));
  assert.equal(result.code, "MCP_APPROVAL_SCOPE");
});

test("MCP dispatch persists an approved receipt when an audit store is configured", async () => {
  const root = await mkdtemp("/tmp/verglos-mcp-audit-");
  try {
    const request = { requestId: "423e4567-e89b-12d3-a456-426614174000", action: "execute" as const, actor: "agent", target: "report:/tmp/audit.json", files: ["/tmp/audit.json"], network: [], policyEffect: "hunt report", requestedAt: "2026-01-01T00:00:00Z", expiresAt: "2099-01-01T00:00:00Z" };
    const approvalReceipt = createApprovalReceipt(request, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
    const result = responseText(await dispatchTool("verglos_hunt_report", { reportPath: "/tmp/audit.json", approvalReceipt }, { approvalStoreRoot: root }));
    assert.equal(result.error, "not_implemented_in_alpha");
    assert.equal((await readApprovalReceipt(root, approvalReceipt.requestDigest)).requestId, request.requestId);
  } finally { await rm(root, { recursive: true, force: true }); }
});
