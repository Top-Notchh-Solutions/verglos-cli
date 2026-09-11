import assert from "node:assert/strict";
import { test } from "node:test";
import { parseAttestArgs, parseCheckBeforeWriteArgs, parseCheckPackageArgs, parseExplainFindingArgs, parseHuntBeforeWriteArgs, parseHuntExplainVerdictArgs, parseHuntFindingArgs, parseHuntReportArgs } from "./input-validation.js";
import { parseScanArgs } from "./input-validation.js";

test("MCP read-only input validators reject coercion and preserve bounds", () => {
  assert.deepEqual(parseCheckBeforeWriteArgs({ code: "const x = 1", targetPath: "src/x.ts" }), { code: "const x = 1", targetPath: "src/x.ts", language: undefined, context: undefined });
  assert.throws(() => parseCheckBeforeWriteArgs({ code: 42, targetPath: "x.ts" }), /requires string/);
  assert.throws(() => parseCheckBeforeWriteArgs({ code: "x", targetPath: "x.ts", extra: true }), /unknown/);
  assert.throws(() => parseExplainFindingArgs({ rule: 42 }), /requires a string/);
  assert.throws(() => parseExplainFindingArgs({ rule: "x".repeat(257) }), /exceeds bounds/);
  assert.deepEqual(parseCheckPackageArgs({ packageName: "react", version: "latest" }), { packageName: "react", version: "latest" });
  assert.throws(() => parseCheckPackageArgs({ packageName: 42 }), /requires a string/);
  assert.throws(() => parseCheckPackageArgs({ packageName: "react", extra: true }), /unknown/);
  assert.deepEqual(parseScanArgs({ limit: 0, noProvenance: true }), { limit: 0, noProvenance: true });
  assert.throws(() => parseScanArgs({ limit: 1.5 }), /integer/);
  assert.throws(() => parseScanArgs({ limit: 1001 }), /integer/);
  assert.throws(() => parseScanArgs({ projectRoot: "relative" }), /absolute/);
  assert.throws(() => parseScanArgs({ unknown: true }), /unknown/);
});

test("MCP alpha Hunt and Attest validators reject malformed or widened requests", () => {
  assert.deepEqual(parseHuntFindingArgs({ reportPath: "report.json", findingId: "F-1" }), { reportPath: "report.json", findingId: "F-1" });
  assert.throws(() => parseHuntFindingArgs({ reportPath: "report.json", findingId: "F-1", extra: true }), /unknown/);
  assert.deepEqual(parseHuntReportArgs({ reportPath: "report.json" }), { reportPath: "report.json" });
  assert.throws(() => parseHuntBeforeWriteArgs({ code: "x", filePath: "a.ts", language: "ts", extra: true }), /unknown/);
  assert.throws(() => parseHuntExplainVerdictArgs({ findingId: "F-1", verdict: "maybe" }), /verdict/);
  assert.deepEqual(parseAttestArgs({ reportPath: "report.json" }), { reportPath: "report.json", signingConfig: undefined });
  assert.throws(() => parseAttestArgs({ reportPath: "report.json", signingConfig: [] }), /signingConfig/);
});
