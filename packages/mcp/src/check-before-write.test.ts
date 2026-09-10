import assert from "node:assert/strict";
import test from "node:test";
import { checkBeforeWrite } from "./tools/check-before-write.js";

test("check_before_write rejects malformed direct calls", async () => {
  await assert.rejects(() => checkBeforeWrite({} as any), /code and targetPath/);
  await assert.rejects(() => checkBeforeWrite({ code: "x", targetPath: "x.ts", language: 1 } as any), /language/);
  await assert.rejects(() => checkBeforeWrite({ code: "x", targetPath: "x.ts", context: 1 } as any), /context/);
  await assert.rejects(() => checkBeforeWrite({ code: "x", targetPath: "x.ts", extra: true } as any), /unknown/);
});
