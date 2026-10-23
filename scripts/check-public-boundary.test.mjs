import assert from "node:assert/strict";
import { test } from "node:test";
import { auditPublicBoundary } from "./check-public-boundary.mjs";

test("public-boundary audit handles history output larger than the default child-process buffer", () => {
  const historyOutput = `${"a".repeat(2_000_000)}\n${"b".repeat(2_000_000)}\n${"c".repeat(2_000_000)} path.js\n`;
  assert.deepEqual(auditPublicBoundary({ trackedOutput: "src/index.ts\0", historyOutput }), []);
});

test("public-boundary audit reports forbidden tracked and historical paths", () => {
  const violations = auditPublicBoundary({
    trackedOutput: "src/index.ts\0docs/shipping/STATUS.md\0",
    historyOutput: "abc123 docs/VERGLOS_FINAL_DATA_FLOW_MAP.md\n",
  });
  assert.deepEqual(violations.sort(), [
    "docs/VERGLOS_FINAL_DATA_FLOW_MAP.md",
    "docs/shipping/STATUS.md",
  ]);
});
