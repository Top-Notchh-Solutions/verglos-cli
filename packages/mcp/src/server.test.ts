import assert from "node:assert/strict";
import { test } from "node:test";
import { dispatchTool } from "./server.js";

function responseText(result: Awaited<ReturnType<typeof dispatchTool>>): Record<string, unknown> {
  return JSON.parse(result.content[0]!.text) as Record<string, unknown>;
}

test("MCP dispatch rejects non-object tool arguments", async () => {
  const result = await dispatchTool("verglos_scan", [] as unknown as Record<string, unknown>);
  assert.deepEqual(responseText(result), { ok: false, error: "usage", code: "MCP_ARGUMENTS_INPUT", message: "tool arguments must be an object" });
});

test("MCP dispatch rejects oversized tool arguments before handlers", async () => {
  const result = await dispatchTool("verglos_check_package", { packageName: "x".repeat(256 * 1024) });
  assert.deepEqual(responseText(result), { ok: false, error: "usage", code: "MCP_ARGUMENTS_INPUT", message: "tool arguments exceed the 256 KiB limit" });
});
