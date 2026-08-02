import { test } from "node:test";
import assert from "node:assert/strict";

// Import via the same module boundary the CLI uses so the regression
// guard catches accidental removals or renames.
const mod = await import("./entitlement.js");

test("cli entitlement module: exposes the public helpers the CLI depends on", () => {
  // The CLI hooks into these three; renaming any of them silently would
  // break the paid gates without a compile-time error (the callers
  // are dynamic).
  assert.equal(typeof mod.loadCapabilities, "function");
  assert.equal(typeof mod.has, "function");
  assert.equal(typeof mod.requireCapability, "function");
  assert.equal(typeof mod.currentPlan, "function");
  assert.equal(typeof mod.printUpgradeCta, "function");
  assert.equal(typeof mod.clearCache, "function");
});

test("cli entitlement module: printUpgradeCta writes to stderr and does not throw", () => {
  // Regression guard: the CLI calls this from failed gates and expects
  // a plain print with no side effects other than stderr writes.
  const originalWrite = process.stderr.write.bind(process.stderr);
  const chunks: string[] = [];
  process.stderr.write = ((chunk: string | Uint8Array) => {
    chunks.push(typeof chunk === "string" ? chunk : Buffer.from(chunk).toString("utf8"));
    return true;
  }) as typeof process.stderr.write;
  try {
    mod.printUpgradeCta("`verglos fix`", "extra context line");
  } finally {
    process.stderr.write = originalWrite;
  }
  const combined = chunks.join("");
  assert.match(combined, /requires Pro/);
  assert.match(combined, /verglos\.com\/checkout/);
  assert.match(combined, /extra context line/);
});
