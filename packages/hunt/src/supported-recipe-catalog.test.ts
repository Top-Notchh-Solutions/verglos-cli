import assert from "node:assert/strict";
import { test } from "node:test";
import { parseHuntRecipe } from "@verglos/shared";
import { SUPPORTED_HUNT_RECIPE_CATALOG, validateSupportedHuntRecipe } from "./supported-recipe-catalog.js";
import { HUNT_TARGET_HARNESS_IMAGE_DIGEST } from "./target-harness.js";

const fixtures = {
  positive: { fixtureId: "positive", expectedVerdict: "confirmed" },
  negative: { fixtureId: "negative", expectedVerdict: "not-reproduced" },
  timeout: { fixtureId: "timeout", expectedVerdict: "environment-error" },
  infrastructureFailure: { fixtureId: "infrastructure-failure", expectedVerdict: "environment-error" },
  unsupported: { fixtureId: "unsupported", expectedVerdict: "not-supported" },
} as const;

const recipe = () => parseHuntRecipe({
  schemaId: "urn:verglos:schema:hunt-recipe",
  schemaVersion: "1.0.0",
  recipeId: "a1-utf8-contains",
  ruleId: "hunt.a1.utf8-contains",
  targetSubjectId: `urn:verglos:subject:repository-tree:sha256:${"a".repeat(64)}`,
  imageDigest: { algorithm: "sha256", value: "b".repeat(64) },
  command: ["verglos-probe", "utf8-contains"],
  assertions: ["probe result is true"],
  fixtures,
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

for (const descriptor of SUPPORTED_HUNT_RECIPE_CATALOG.slice(1)) {
  test(`catalog accepts bounded ${descriptor.recipeId}`, () => {
    const inputs = Object.fromEntries(descriptor.requiredInputs.map((name) => [name,
      name === "path" ? "safe/file.txt" :
        name === "input" && descriptor.recipeId === "a1-sql-injection" ? "parameterized query" :
          name === "input" ? "echo-safe" :
          name === "url" ? "https://public.example.test/" :
            name === "authorizedTenant" ? "tenant-a" :
              name === "requestedTenant" ? "tenant-b" :
                name === "allowlist" ? "read,write" :
                  name === "tool" ? "read" :
                      name === "html" ? "safe text" : "safe",
    ]));
    const value = parseHuntRecipe({
      ...recipe(),
      recipeId: descriptor.recipeId,
      ruleId: descriptor.ruleId,
      command: [...descriptor.command],
      assertions: [...descriptor.assertions],
      fixtures,
      isolation: descriptor.adapter,
      imageDigest: descriptor.adapter === "container" ? { algorithm: "sha256", value: HUNT_TARGET_HARNESS_IMAGE_DIGEST.slice("sha256:".length) } : recipe().imageDigest,
      inputs,
    });
    const result = validateSupportedHuntRecipe(value);
    assert.equal(result.supported, true);
    if (result.supported) assert.match(result.recipeDigest, /^sha256:[a-f0-9]{64}$/u);
  });
}

test("catalog includes the ten approved target-code recipe families", () => {
  assert.deepEqual(
    SUPPORTED_HUNT_RECIPE_CATALOG.filter((descriptor) => descriptor.adapter === "container").map((descriptor) => descriptor.recipeId),
    ["a2-sql-nosql-injection-harness", "a2-command-injection-harness", "a2-path-traversal-harness", "a2-ssrf-harness", "a2-agent-mcp-harness", "a2-xss-harness", "a2-authorization-harness", "a2-prototype-pollution-harness", "a2-secrets-credential-use-harness", "a2-supply-chain-harness"],
  );
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
