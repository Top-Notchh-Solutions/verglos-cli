import assert from "node:assert/strict";
import { test } from "node:test";
import { parseHuntRecipe } from "./hunt-recipe.js";

const validRecipe = {
  schemaId: "urn:verglos:schema:hunt-recipe",
  schemaVersion: "1.0.0",
  recipeId: "hunt-sql",
  ruleId: "d1-1",
  targetSubjectId: `urn:verglos:subject:artifact:sha256:${"a".repeat(64)}`,
  imageDigest: { algorithm: "sha256", value: "b".repeat(64) },
  command: ["node", "check.js"],
  assertions: ["exit code is 0"],
  inputs: { fixture: "synthetic" },
  isolation: "container",
  limits: { timeoutMs: 1000, cpuMs: 900, memoryMb: 256, diskMb: 128, outputBytes: 10_000, processes: 32, maxNetworkRequests: 0 },
  cleanup: "always",
  network: { mode: "denied", destinations: [], reason: "local reproduction" },
  redaction: "required",
  signature: { status: "verified", signer: "verglos-release" },
} as const;

test("Hunt recipe schema binds every declared recipe dimension", () => {
  const recipe = parseHuntRecipe(validRecipe);
  assert.equal(recipe.schemaId, "urn:verglos:schema:hunt-recipe");
  assert.equal(recipe.schemaVersion, "1.0.0");
  assert.equal(recipe.ruleId, "d1-1");
  assert.equal(recipe.targetSubjectId, validRecipe.targetSubjectId);
  assert.deepEqual(recipe.imageDigest, validRecipe.imageDigest);
  assert.deepEqual(recipe.command, ["node", "check.js"]);
  assert.deepEqual(recipe.assertions, ["exit code is 0"]);
  assert.deepEqual(recipe.inputs, { fixture: "synthetic" });
  assert.equal(recipe.isolation, "container");
  assert.deepEqual(recipe.limits, validRecipe.limits);
  assert.equal(recipe.cleanup, "always");
  assert.deepEqual(recipe.network, validRecipe.network);
  assert.equal(recipe.redaction, "required");
  assert.deepEqual(recipe.signature, validRecipe.signature);
});

test("Hunt recipe schema requires each top-level field and rejects unknown fields or versions", () => {
  const required = ["schemaId", "schemaVersion", "recipeId", "ruleId", "targetSubjectId", "imageDigest", "command", "assertions", "isolation", "limits", "cleanup", "network", "redaction", "signature"];
  for (const field of required) {
    const incomplete = { ...validRecipe } as Record<string, unknown>;
    delete incomplete[field];
    assert.throws(() => parseHuntRecipe(incomplete));
  }
  assert.throws(() => parseHuntRecipe({ ...validRecipe, schemaVersion: "2.0.0" }));
  assert.throws(() => parseHuntRecipe({ ...validRecipe, unrecognized: true }));
  assert.throws(() => parseHuntRecipe({ ...validRecipe, signature: { status: "verified" } }));
});

test("Hunt recipes are bounded and deny arbitrary network by default", () => {
  assert.throws(() => parseHuntRecipe({ ...validRecipe, imageDigest: { algorithm: "sha512", value: "b".repeat(128) } }));
  assert.throws(() => parseHuntRecipe({ ...validRecipe, command: ["node\u0000check.js"] }));
  assert.throws(() => parseHuntRecipe({ ...validRecipe, network: { ...validRecipe.network, destinations: ["https://example.com"] } }));
  assert.throws(() => parseHuntRecipe({ ...validRecipe, network: { ...validRecipe.network, reason: "bad\u001breason" } }));
  assert.throws(() => parseHuntRecipe({ ...validRecipe, isolation: "none", network: { mode: "allowlist", destinations: ["https://example.com"], reason: "explicit fixture" }, limits: { ...validRecipe.limits, maxNetworkRequests: 1 } }));
  assert.throws(() => parseHuntRecipe({ ...validRecipe, network: { mode: "allowlist", destinations: ["http://example.com"], reason: "explicit fixture" }, limits: { ...validRecipe.limits, maxNetworkRequests: 1 } }));
  assert.throws(() => parseHuntRecipe({ ...validRecipe, network: { mode: "allowlist", destinations: ["https://agent:secret@example.com"], reason: "explicit fixture" }, limits: { ...validRecipe.limits, maxNetworkRequests: 1 } }));
  assert.throws(() => parseHuntRecipe({ ...validRecipe, network: { mode: "allowlist", destinations: [], reason: "explicit fixture" }, limits: { ...validRecipe.limits, maxNetworkRequests: 1 } }));
  assert.throws(() => parseHuntRecipe({ ...validRecipe, network: { mode: "allowlist", destinations: ["https://example.com", "https://example.com"], reason: "explicit fixture" }, limits: { ...validRecipe.limits, maxNetworkRequests: 1 } }));
  assert.throws(() => parseHuntRecipe({ ...validRecipe, network: { mode: "allowlist", destinations: ["https://"], reason: "explicit fixture" }, limits: { ...validRecipe.limits, maxNetworkRequests: 1 } }), /Invalid Hunt recipe/);
});

test("allowlisted recipe destinations are HTTPS origins and require a positive request cap", () => {
  const allowlisted = { ...validRecipe, limits: { ...validRecipe.limits, maxNetworkRequests: 1 }, network: { mode: "allowlist", destinations: ["https://example.com"], reason: "approved fixture" } };
  assert.equal(parseHuntRecipe(allowlisted).limits.maxNetworkRequests, 1);
  for (const destination of ["https://example.com/path", "https://example.com?query=1", "https://example.com#fragment"]) {
    assert.throws(() => parseHuntRecipe({ ...allowlisted, network: { ...allowlisted.network, destinations: [destination] } }));
  }
  assert.throws(() => parseHuntRecipe({ ...allowlisted, limits: { ...allowlisted.limits, maxNetworkRequests: 0 } }));
  assert.throws(() => parseHuntRecipe({ ...validRecipe, limits: { ...validRecipe.limits, maxNetworkRequests: 1 } }));
});

test("Hunt resource limits reject inconsistent or over-cap budgets", () => {
  const recipe = parseHuntRecipe(validRecipe);
  assert.equal(recipe.limits.cpuMs, 900);
  assert.equal(recipe.limits.diskMb, 128);
  assert.equal(recipe.limits.maxNetworkRequests, 0);
  assert.throws(() => parseHuntRecipe({ ...recipe, limits: { ...recipe.limits, cpuMs: 1001 } }));
  assert.throws(() => parseHuntRecipe({ ...recipe, limits: { ...recipe.limits, diskMb: 16_385 } }));
  assert.throws(() => parseHuntRecipe({ ...recipe, limits: { ...recipe.limits, memoryMb: 16_385 } }));
  assert.throws(() => parseHuntRecipe({ ...recipe, limits: { ...recipe.limits, outputBytes: 10_000_001 } }));
  assert.throws(() => parseHuntRecipe({ ...recipe, limits: { ...recipe.limits, processes: 4097 } }));
  assert.throws(() => parseHuntRecipe({ ...recipe, limits: { ...recipe.limits, unknown: true } }));
});
