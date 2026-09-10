import assert from "node:assert/strict";
import { test } from "node:test";
import { mcpToolAuthority } from "@verglos/shared";

test("MCP tools expose shared authority metadata for discovery", () => {
  assert.equal(mcpToolAuthority("verglos_scan")?.sideEffect, "none");
  assert.equal(mcpToolAuthority("verglos_attest")?.approvalRequired, true);
});
