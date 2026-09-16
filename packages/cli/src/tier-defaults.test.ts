import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizeTier } from "./tier-defaults.js";

test("normalizeTier: canonicalizes known plan names and preserves legacy aliases", () => {
  assert.equal(normalizeTier("PRO"), "pro");
  assert.equal(normalizeTier("compliance"), "enterprise");
  assert.equal(normalizeTier("bogus"), "free");
  assert.equal(normalizeTier(undefined), "free");
  assert.equal(normalizeTier(null), "free");
});
