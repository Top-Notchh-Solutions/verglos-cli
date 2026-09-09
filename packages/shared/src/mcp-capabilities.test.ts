import assert from "node:assert/strict";
import { test } from "node:test";
import { listMcpCapabilities } from "./mcp-capabilities.js";

test("MCP capability truth labels plan and maturity", () => {
  const capabilities = listMcpCapabilities();
  assert.equal(capabilities.find((item) => item.tool === "verglos_scan")?.maturity, "shipped");
  assert.equal(capabilities.find((item) => item.tool === "verglos_hunt_report")?.approvalRequired, true);
  assert.equal(new Set(capabilities.map((item) => item.tool)).size, capabilities.length);
});
