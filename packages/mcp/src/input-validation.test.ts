import assert from "node:assert/strict";
import { test } from "node:test";
import { parseCheckBeforeWriteArgs, parseExplainFindingArgs } from "./input-validation.js";

test("MCP read-only input validators reject coercion and preserve bounds", () => {
  assert.deepEqual(parseCheckBeforeWriteArgs({ code: "const x = 1", targetPath: "src/x.ts" }), { code: "const x = 1", targetPath: "src/x.ts", language: undefined, context: undefined });
  assert.throws(() => parseCheckBeforeWriteArgs({ code: 42, targetPath: "x.ts" }), /requires string/);
  assert.throws(() => parseExplainFindingArgs({ rule: 42 }), /requires a string/);
  assert.throws(() => parseExplainFindingArgs({ rule: "x".repeat(257) }), /exceeds bounds/);
});
