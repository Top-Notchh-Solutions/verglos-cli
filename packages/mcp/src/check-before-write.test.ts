import assert from "node:assert/strict";
import test from "node:test";
import { checkBeforeWrite } from "./tools/check-before-write.js";

test("check_before_write rejects malformed direct calls", async () => {
  await assert.rejects(() => checkBeforeWrite({} as any), /code and targetPath/);
  await assert.rejects(() => checkBeforeWrite({ code: "x", targetPath: "x.ts", language: 1 } as any), /language/);
  await assert.rejects(() => checkBeforeWrite({ code: "x", targetPath: "x.ts", context: 1 } as any), /context/);
  await assert.rejects(() => checkBeforeWrite({ code: "x", targetPath: "x.ts", language: "x".repeat(129) }), /128 UTF-8 bytes/);
  await assert.rejects(() => checkBeforeWrite({ code: "x", targetPath: "x.ts", extra: true } as any), /unknown/);
});

test("check_before_write preserves the requested finding path and reports partial fast-path coverage", async () => {
  const targetPath = "src/auth/session-token.ts";
  const result = await checkBeforeWrite({
    code: "const token = Math.random().toString(36).slice(2);",
    targetPath,
  });
  assert.equal(result.coverage.state, "partial");
  assert.deepEqual(result.coverage.includedDetectors, ["secrets", "injection", "ai-patterns"]);
  assert.ok(result.coverage.omittedDetectors.includes("dependencies"));
  assert.ok(result.findings.length > 0);
  assert.ok(result.findings.every((finding) => finding.file === targetPath));
  assert.ok(result.findings.some((finding) => finding.rule === "AI-002"));
});

test("check_before_write rejects control characters in target attribution", async () => {
  await assert.rejects(() => checkBeforeWrite({ code: "const value = 1", targetPath: "src/secret\u0000.ts" }), /control characters/);
});
