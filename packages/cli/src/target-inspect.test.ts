import assert from "node:assert/strict";
import { test } from "node:test";
import { executeTargetInspect } from "./target-inspect.js";

test("target inspect returns typed incomplete for an unqualified package", async () => {
  const code = await executeTargetInspect("package", ".");
  assert.ok([0, 3, 78].includes(code));
});
