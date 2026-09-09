import assert from "node:assert/strict";
import { test } from "node:test";
import { parseCheckBeforeWriteArgs, parseCheckPackageArgs, parseExplainFindingArgs } from "./input-validation.js";
import { parseScanArgs } from "./input-validation.js";

test("MCP read-only input validators reject coercion and preserve bounds", () => {
  assert.deepEqual(parseCheckBeforeWriteArgs({ code: "const x = 1", targetPath: "src/x.ts" }), { code: "const x = 1", targetPath: "src/x.ts", language: undefined, context: undefined });
  assert.throws(() => parseCheckBeforeWriteArgs({ code: 42, targetPath: "x.ts" }), /requires string/);
  assert.throws(() => parseExplainFindingArgs({ rule: 42 }), /requires a string/);
  assert.throws(() => parseExplainFindingArgs({ rule: "x".repeat(257) }), /exceeds bounds/);
  assert.deepEqual(parseCheckPackageArgs({ packageName: "react", version: "latest" }), { packageName: "react", version: "latest" });
  assert.throws(() => parseCheckPackageArgs({ packageName: 42 }), /requires a string/);
  assert.deepEqual(parseScanArgs({ limit: 0, noProvenance: true }), { limit: 0, noProvenance: true });
  assert.throws(() => parseScanArgs({ limit: 1.5 }), /integer/);
  assert.throws(() => parseScanArgs({ limit: 1001 }), /integer/);
  assert.throws(() => parseScanArgs({ projectRoot: "relative" }), /absolute/);
  assert.throws(() => parseScanArgs({ unknown: true }), /unknown/);
});
