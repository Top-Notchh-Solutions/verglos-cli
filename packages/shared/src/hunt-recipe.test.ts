import assert from "node:assert/strict";
import { test } from "node:test";
import { parseHuntRecipe } from "./hunt-recipe.js";

test("Hunt recipes are declarative, bounded, and deny arbitrary network by default", () => {
  const recipe = parseHuntRecipe({ schemaId: "urn:verglos:schema:hunt-recipe", schemaVersion: "1.0.0", recipeId: "hunt-sql", ruleId: "d1-1", targetSubjectId: "urn:verglos:subject:artifact:sha256:" + "a".repeat(64), imageDigest: { algorithm: "sha256", value: "b".repeat(64) }, command: ["node", "check.js"], assertions: ["exit code is 0"], isolation: "container", limits: { timeoutMs: 1000, memoryMb: 256, outputBytes: 10000, processes: 32 }, cleanup: "always", network: { mode: "denied", destinations: [], reason: "local reproduction" }, redaction: "required", signature: { status: "verified", signer: "verglos-release" } });
  assert.equal(recipe.network.mode, "denied");
  assert.throws(() => parseHuntRecipe({ ...recipe, network: { ...recipe.network, destinations: ["https://example.com"] } }));
  assert.throws(() => parseHuntRecipe({ ...recipe, imageDigest: { algorithm: "sha512", value: "b".repeat(128) } }));
  assert.throws(() => parseHuntRecipe({ ...recipe, isolation: "none", network: { mode: "allowlist", destinations: ["https://example.com"], reason: "explicit fixture" } }));
  assert.throws(() => parseHuntRecipe({ ...recipe, isolation: "container", network: { mode: "allowlist", destinations: ["http://example.com"], reason: "explicit fixture" } }));
  assert.throws(() => parseHuntRecipe({ ...recipe, isolation: "container", network: { mode: "allowlist", destinations: ["https://agent:secret@example.com"], reason: "explicit fixture" } }));
  assert.throws(() => parseHuntRecipe({ ...recipe, command: ["node\u0000probe.js"] }));
  assert.throws(() => parseHuntRecipe({ ...recipe, network: { ...recipe.network, reason: "reason\u001b" } }));
});

test("Hunt allowlist destinations are origins only", () => {
  const base = { ...parseHuntRecipe({ schemaId: "urn:verglos:schema:hunt-recipe", schemaVersion: "1.0.0", recipeId: "hunt-origin", ruleId: "d1-1", targetSubjectId: "urn:verglos:subject:artifact:sha256:" + "a".repeat(64), imageDigest: { algorithm: "sha256", value: "b".repeat(64) }, command: ["node"], assertions: ["exit code is 0"], isolation: "container", limits: { timeoutMs: 1000, memoryMb: 256, outputBytes: 10000, processes: 32 }, cleanup: "always", network: { mode: "denied", destinations: [], reason: "local reproduction" }, redaction: "required", signature: { status: "verified", signer: "verglos-release" } }) } as const;
  for (const destination of ["https://example.com/path", "https://example.com?query=1", "https://example.com#fragment"]) {
    assert.throws(() => parseHuntRecipe({ ...base, network: { mode: "allowlist", destinations: [destination], reason: "fixture" } }));
  }
});
