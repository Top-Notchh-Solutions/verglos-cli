import assert from "node:assert/strict";
import { test } from "node:test";
import { listMcpToolAuthority, mcpToolAuthority } from "./mcp-authority.js";

test("MCP authority metadata preserves legacy names and marks side effects", () => {
  assert.equal(mcpToolAuthority("verglos_scan")?.approvalRequired, false);
  assert.equal(mcpToolAuthority("verglos_hunt_finding")?.approvalRequired, true);
  assert.equal(mcpToolAuthority("unknown"), undefined);
  const tools = listMcpToolAuthority();
  assert.equal(tools.length, 9);
  assert.equal(Object.isFrozen(tools[0]), true);
  assert.throws(() => (tools[0] as { action: string }).action = "billing", TypeError);
});
