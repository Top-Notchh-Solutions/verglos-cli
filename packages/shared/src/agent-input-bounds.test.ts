import assert from "node:assert/strict";
import { test } from "node:test";
import { validateAgentInputBounds } from "./agent-input-bounds.js";

test("agent input bounds reject oversized fields before execution", () => {
  assert.throws(() => validateAgentInputBounds({ code: "😀".repeat(300_000) }));
  assert.throws(() => validateAgentInputBounds({ targetPath: "a".repeat(4097) }));
  assert.doesNotThrow(() => validateAgentInputBounds({ code: "ok", packageName: "zod" }));
});
