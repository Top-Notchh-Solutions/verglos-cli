import assert from "node:assert/strict";
import { test } from "node:test";
import { mapWithConcurrency } from "./index.js";

test("provenance work is bounded while preserving input order", async () => {
  let active = 0;
  let peak = 0;
  const result = await mapWithConcurrency(["a", "b", "c", "d", "e"], 2, async (value, index) => {
    active += 1;
    peak = Math.max(peak, active);
    await new Promise((resolve) => setTimeout(resolve, value === "a" ? 8 : 1));
    active -= 1;
    return `${index}:${value}`;
  });

  assert.deepEqual(result, ["0:a", "1:b", "2:c", "3:d", "4:e"]);
  assert.equal(peak, 2);
  assert.equal(active, 0);
});

test("provenance concurrency rejects invalid limits", async () => {
  await assert.rejects(() => mapWithConcurrency(["a"], 0, async (value) => value), /positive integer/u);
  await assert.rejects(() => mapWithConcurrency(["a"], 1.5, async (value) => value), /positive integer/u);
});
