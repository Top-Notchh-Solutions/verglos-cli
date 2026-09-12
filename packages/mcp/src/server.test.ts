import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { createApprovalReceipt, parseFailure, readApprovalReceipt } from "@verglos/shared";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createVerglosMcpServer } from "./server.js";
import { dispatchTool, jsonResponse, listAdvertisedTools } from "./server.js";

function responseText(result: Awaited<ReturnType<typeof dispatchTool>>): Record<string, unknown> {
  return JSON.parse(result.content[0]!.text) as Record<string, unknown>;
}

function assertMcpError(result: Awaited<ReturnType<typeof dispatchTool>>, expected: { error: string; code: string; message: string; category: string }): void {
  const payload = responseText(result);
  const { error, code, message, category } = expected;
  assert.deepEqual({ ok: payload.ok, error: payload.error, code: payload.code, message: payload.message }, { ok: false, error, code, message });
  assert.deepEqual(Object.keys(payload).sort(), ["code", "error", "failure", "message", "ok"]);
  assert.equal(parseFailure(payload.failure).category, category);
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
  assert.deepEqual(scan?._meta, { "verglos/capability": { tool: "verglos_scan", action: "network", plan: "free", maturity: "shipped", approvalRequired: true, sideEffect: "network", networkTargets: ["https://api.osv.dev", "https://registry.npmjs.org"], inputFields: ["projectRoot", "limit", "noProvenance", "approvalReceipt"], outputFields: ["projectRoot", "scannedAt", "durationMs", "score", "provenance", "findingCount", "findings", "truncated", "headline", "failure"] } });
  const hunt = tools.find((tool) => tool.name === "verglos_hunt_report");
  assert.equal((hunt?._meta["verglos/capability"] as { sideEffect: string }).sideEffect, "process");
});

test("MCP dispatch rejects non-object tool arguments", async () => {
  const result = await dispatchTool("verglos_scan", [] as unknown as Record<string, unknown>);
  assertMcpError(result, { error: "usage", code: "MCP_ARGUMENTS_INPUT", message: "tool arguments must be an object", category: "usage" });
});

test("MCP dispatch rejects oversized tool arguments before handlers", async () => {
  const result = await dispatchTool("verglos_check_package", { packageName: "x".repeat(256 * 1024) });
  assertMcpError(result, { error: "usage", code: "MCP_ARGUMENTS_INPUT", message: "tool arguments exceed the 256 KiB limit", category: "usage" });
});

test("MCP response encoder fails closed on oversized payloads", () => {
  const result = jsonResponse({ evidence: "x".repeat(512 * 1024) });
  assertMcpError(result, { error: "output", code: "MCP_OUTPUT_LIMIT", message: "tool response exceeds the 512 KiB limit", category: "infrastructure" });
});

test("MCP dispatch rejects unknown tools with a stable structured error", async () => {
  assertMcpError(await dispatchTool("verglos_unknown", {}), { error: "usage", code: "MCP_UNKNOWN_TOOL", message: "unknown MCP tool", category: "unsupported" });
});

test("MCP dispatch denies approval-required tools before their handler or stub", async () => {
  const result = responseText(await dispatchTool("verglos_hunt_report", { reportPath: "/tmp/report.json" }, { plan: "pro" }));
  assert.equal(result.code, "MCP_APPROVAL_REQUIRED");
  assert.equal(result.error, "usage");
});

test("network MCP tools require exact target and recipient approval before lookup", async () => {
  const priorFetch = globalThis.fetch;
  let fetchCalls = 0;
  globalThis.fetch = async (input, init) => {
    fetchCalls++;
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    assert.equal(init?.redirect, "error", "approved network scopes must not be widened by redirects");
    if (url.startsWith("https://registry.npmjs.org/")) return new Response(null, { status: 200 });
    if (url === "https://api.osv.dev/v1/query") return new Response(JSON.stringify({ vulns: [] }), { status: 200 });
    throw new Error("unexpected network recipient");
  };
  try {
    const scanWithoutApproval = responseText(await dispatchTool("verglos_scan", { projectRoot: "/does-not-need-to-exist-for-denial" }));
    assert.equal(scanWithoutApproval.code, "MCP_APPROVAL_REQUIRED");
    assert.equal(fetchCalls, 0);

    const noReceipt = responseText(await dispatchTool("verglos_check_package", { packageName: "safe-package", version: "1.0.0" }));
    assert.equal(noReceipt.code, "MCP_APPROVAL_REQUIRED");
    assert.equal(fetchCalls, 0);

    const receipt = createApprovalReceipt({
      requestId: "623e4567-e89b-12d3-a456-426614174000",
      action: "network",
      actor: "agent",
      target: "npm:safe-package@1.0.0",
      files: [],
      network: ["https://api.osv.dev", "https://registry.npmjs.org"],
      policyEffect: "verify one npm package against npm and OSV",
      requestedAt: "2026-01-01T00:00:00Z",
      expiresAt: "2099-01-01T00:00:00Z",
    }, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });

    const wrongTarget = createApprovalReceipt({
      requestId: "723e4567-e89b-12d3-a456-426614174000",
      action: "network",
      actor: "agent",
      target: "npm:other-package@1.0.0",
      files: [],
      network: ["https://api.osv.dev", "https://registry.npmjs.org"],
      policyEffect: "verify one npm package against npm and OSV",
      requestedAt: "2026-01-01T00:00:00Z",
      expiresAt: "2099-01-01T00:00:00Z",
    }, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
    const mismatched = responseText(await dispatchTool("verglos_check_package", { packageName: "safe-package", version: "1.0.0", approvalReceipt: wrongTarget }, { now: "2026-01-02T00:00:00Z" }));
    assert.equal(mismatched.code, "MCP_APPROVAL_SCOPE");
    assert.equal(fetchCalls, 0);

    const missingOrigin = createApprovalReceipt({
      requestId: "823e4567-e89b-12d3-a456-426614174000",
      action: "network",
      actor: "agent",
      target: "npm:safe-package@1.0.0",
      files: [],
      network: ["https://registry.npmjs.org"],
      policyEffect: "verify one npm package against npm and OSV",
      requestedAt: "2026-01-01T00:00:00Z",
      expiresAt: "2099-01-01T00:00:00Z",
    }, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
    const insufficient = responseText(await dispatchTool("verglos_check_package", { packageName: "safe-package", version: "1.0.0", approvalReceipt: missingOrigin }, { now: "2026-01-02T00:00:00Z" }));
    assert.equal(insufficient.code, "MCP_APPROVAL_SCOPE");
    assert.equal(fetchCalls, 0);

    const exact = responseText(await dispatchTool("verglos_check_package", { packageName: "safe-package", version: "1.0.0", approvalReceipt: receipt }, { now: "2026-01-02T00:00:00Z" }));
    assert.equal(exact.verdict, "safe");
    assert.equal(exact.coverage, "complete");
    assert.equal(fetchCalls, 2);
  } finally {
    globalThis.fetch = priorFetch;
  }
});

test("MCP dispatch enforces the explicitly supplied entitlement plan", async () => {
  const denied = await dispatchTool("verglos_hunt_report", {}, { plan: "free" });
  assertMcpError(denied, { error: "usage", code: "MCP_ENTITLEMENT_REQUIRED", message: "MCP tool requires the pro plan", category: "authorization" });
  const allowed = responseText(await dispatchTool("verglos_hunt_report", {}, { plan: "pro" }));
  assert.equal(allowed.code, "MCP_APPROVAL_REQUIRED");
  const team = responseText(await dispatchTool("verglos_hunt_report", {}, { plan: "team" }));
  assert.equal(team.code, "MCP_APPROVAL_REQUIRED");
  const enterprise = responseText(await dispatchTool("verglos_attest", {}, { plan: "enterprise" }));
  assert.equal(enterprise.code, "MCP_APPROVAL_REQUIRED");
});

test("MCP dispatch treats missing host entitlement as Free, never as an upgrade grant", async () => {
  const denied = await dispatchTool("verglos_hunt_report", { reportPath: "/tmp/report.json" });
  assertMcpError(denied, { error: "usage", code: "MCP_ENTITLEMENT_REQUIRED", message: "MCP tool requires the pro plan", category: "authorization" });
  const freeTool = responseText(await dispatchTool("verglos_check_before_write", { code: "const x = 1", targetPath: "x.ts" }));
  assert.equal(freeTool.verdict, "allow");
});

test("MCP dispatch rejects unknown runtime entitlement plans", async () => {
  for (const plan of ["gold", "", 1]) assertMcpError(await dispatchTool("verglos_scan", {}, { plan: plan as never }), { error: "usage", code: "MCP_ENTITLEMENT_INVALID", message: "invalid entitlement plan", category: "usage" });
});

test("MCP dispatch fails closed for non-serializable arguments", async () => {
  const cyclic: Record<string, unknown> = {};
  cyclic.self = cyclic;
  assertMcpError(await dispatchTool("verglos_scan", cyclic), { error: "usage", code: "MCP_ARGUMENTS_INPUT", message: "tool arguments must be serializable JSON", category: "usage" });
  const undefinedJson = { toJSON: () => undefined } as unknown as Record<string, unknown>;
  assertMcpError(await dispatchTool("verglos_scan", undefinedJson), { error: "usage", code: "MCP_ARGUMENTS_INPUT", message: "tool arguments must be serializable JSON", category: "usage" });
});

test("MCP response encoder fails closed for non-serializable payloads", () => {
  const cyclic: Record<string, unknown> = {};
  cyclic.self = cyclic;
  assertMcpError(jsonResponse(cyclic), { error: "output", code: "MCP_OUTPUT_INVALID", message: "tool response is not serializable JSON", category: "infrastructure" });
});

test("MCP SDK interoperability preserves discovery and entitlement errors", async () => {
  const server = createVerglosMcpServer({ plan: "free" });
  const client = new Client({ name: "verglos-test-client", version: "1.0.0" }, { capabilities: {} });
  const [clientTransport, serverTransport] = await InMemoryTransport.createLinkedPair();
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  try {
    const discovered = await client.listTools();
    assert.equal(discovered.tools.length, 9);
    assert.ok(discovered.tools.every((tool) => tool.name.startsWith("verglos_")));
    const denied = await client.callTool({ name: "verglos_hunt_report", arguments: {} }) as { content?: Array<{ type?: string; text?: string }> };
    const payload = JSON.parse(String(denied.content?.[0]?.type === "text" ? denied.content[0].text : "{}")) as { code?: string };
    assert.equal(payload.code, "MCP_ENTITLEMENT_REQUIRED");
  } finally {
    await client.close();
    await server.close();
  }
});

test("approval-free MCP tools keep strict unknown-field validation", async () => {
  const result = responseText(await dispatchTool("verglos_check_before_write", { code: "const value = 1", unknown: true }));
  assert.equal(result.code, "MCP_CHECK_BEFORE_WRITE_INPUT");
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
  const result = responseText(await dispatchTool("verglos_hunt_report", { reportPath: "/tmp/report.json", approvalReceipt }, { plan: "pro" }));
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
  const result = responseText(await dispatchTool("verglos_hunt_report", { reportPath: "/tmp/other.json", approvalReceipt }, { plan: "pro" }));
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
  const result = responseText(await dispatchTool("verglos_hunt_report", { reportPath: "/tmp/report.json", approvalReceipt }, { plan: "pro" }));
  assert.equal(result.code, "MCP_APPROVAL_SCOPE");
});

test("MCP dispatch persists an approved receipt when an audit store is configured", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-mcp-audit-"));
  try {
    const request = { requestId: "423e4567-e89b-12d3-a456-426614174000", action: "execute" as const, actor: "agent", target: "report:/tmp/audit.json", files: ["/tmp/audit.json"], network: [], policyEffect: "hunt report", requestedAt: "2026-01-01T00:00:00Z", expiresAt: "2099-01-01T00:00:00Z" };
    const approvalReceipt = createApprovalReceipt(request, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
    const result = responseText(await dispatchTool("verglos_hunt_report", { reportPath: "/tmp/audit.json", approvalReceipt }, { approvalStoreRoot: root, plan: "pro" }));
    assert.equal(result.error, "not_implemented_in_alpha");
    assert.equal((await readApprovalReceipt(root, approvalReceipt.requestDigest)).requestId, request.requestId);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("MCP approval audit failures are bounded", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-mcp-audit-failure-"));
  const auditPath = `${root}/not-a-directory`;
  await writeFile(auditPath, "fixture");
  try {
    const request = { requestId: "523e4567-e89b-12d3-a456-426614174000", action: "execute" as const, actor: "agent", target: "report:/tmp/audit.json", files: ["/tmp/audit.json"], network: [], policyEffect: "hunt report", requestedAt: "2026-01-01T00:00:00Z", expiresAt: "2099-01-01T00:00:00Z" };
    const approvalReceipt = createApprovalReceipt(request, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
    const result = responseText(await dispatchTool("verglos_hunt_report", { reportPath: "/tmp/audit.json", approvalReceipt }, { approvalStoreRoot: auditPath, plan: "pro" }));
    assertMcpError({ content: [{ type: "text", text: JSON.stringify(result) }] }, { error: "usage", code: "MCP_APPROVAL_AUDIT", message: "approval receipt could not be persisted", category: "infrastructure" });
  } finally { await rm(root, { recursive: true, force: true }); }
});
