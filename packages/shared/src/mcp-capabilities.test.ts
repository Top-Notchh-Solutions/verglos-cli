import assert from "node:assert/strict";
import { test } from "node:test";
import { listMcpCapabilities, reconcileMcpCapabilities } from "./mcp-capabilities.js";

test("MCP capability truth labels plan and maturity", () => {
  const capabilities = listMcpCapabilities();
  assert.equal(capabilities.find((item) => item.tool === "verglos_scan")?.maturity, "shipped");
  assert.equal(capabilities.find((item) => item.tool === "verglos_hunt_report")?.approvalRequired, true);
  assert.equal(new Set(capabilities.map((item) => item.tool)).size, capabilities.length);
  assert.equal(Object.isFrozen(capabilities[0]), true);
  assert.throws(() => (capabilities[0] as { plan: string }).plan = "enterprise", TypeError);
});

test("MCP capability reconciliation rejects drift and preserves deterministic output", () => {
  const names = listMcpCapabilities().map((item) => item.tool);
  assert.deepEqual(reconcileMcpCapabilities([...names].reverse()).map((item) => item.tool), names);
  assert.throws(() => reconcileMcpCapabilities(names.slice(1)), /out of sync/);
  assert.throws(() => reconcileMcpCapabilities([...names, names[0]!]), /out of sync/);
  assert.throws(() => reconcileMcpCapabilities(["verglos_scan", ""]), /out of sync/);
});
