import assert from "node:assert/strict";
import { test } from "node:test";
import { parseHuntRecipe } from "@verglos/shared";
import { SUPPORTED_HUNT_RECIPE_CATALOG, validateSupportedHuntRecipe } from "./supported-recipe-catalog.js";

const recipe = () => parseHuntRecipe({
  schemaId: "urn:verglos:schema:hunt-recipe",
  schemaVersion: "1.0.0",
  recipeId: "a1-utf8-contains",
  ruleId: "hunt.a1.utf8-contains",
  targetSubjectId: `urn:verglos:subject:repository-tree:sha256:${"a".repeat(64)}`,
  imageDigest: { algorithm: "sha256", value: "b".repeat(64) },
  command: ["verglos-probe", "utf8-contains"],
  assertions: ["probe result is true"],
  inputs: { needle: "unsafe", value: "fixture contains unsafe" },
  isolation: "restricted-process",
  limits: { timeoutMs: 1_000, cpuMs: 900, memoryMb: 64, diskMb: 16, outputBytes: 1_024, processes: 1, maxNetworkRequests: 0 },
  cleanup: "always",
  network: { mode: "denied", destinations: [], reason: "A1 pure probe" },
  redaction: "required",
  signature: { status: "verified", signer: "fixture-signer" },
});

test("catalog exposes explicit positive, negative, timeout, and failure fixtures", () => {
  const descriptor = SUPPORTED_HUNT_RECIPE_CATALOG[0];
  assert.deepEqual(descriptor.fixtures.map((fixture) => fixture.name), ["positive", "negative", "timeout", "adapter-failure"]);
  assert.deepEqual(descriptor.fixtures.map((fixture) => fixture.expected), ["confirmed", "not-reproduced", "inconclusive", "environment-error"]);
});

test("catalog accepts the exact bounded A1 recipe and returns its digest", () => {
  const result = validateSupportedHuntRecipe(recipe());
  assert.equal(result.supported, true);
  if (result.supported) assert.match(result.recipeDigest, /^sha256:[a-f0-9]{64}$/u);
});

for (const [name, patch, reason] of [
  ["unknown recipe", { recipeId: "a1-unknown" }, "recipe_not_in_catalog"],
  ["arbitrary command", { command: ["/bin/sh", "-c", "echo unsafe"] }, "command_mismatch"],
  ["allowlisted network", { network: { mode: "allowlist", destinations: ["https://example.test/"], reason: "unsafe" }, limits: { timeoutMs: 1_000, cpuMs: 900, memoryMb: 64, diskMb: 16, outputBytes: 1_024, processes: 1, maxNetworkRequests: 1 } }, "network_not_denied"],
] as const) {
  test(`catalog rejects ${name}`, () => {
    const value = recipe() as Record<string, unknown>;
    Object.assign(value, patch);
    const result = validateSupportedHuntRecipe(value);
    assert.equal(result.supported, false);
    if (!result.supported) assert.equal(result.reason, reason);
  });
}
