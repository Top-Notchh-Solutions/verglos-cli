import { huntRecipeDigest, parseHuntRecipe, type HuntRecipe } from "@verglos/shared";
import { HUNT_TARGET_HARNESS_IMAGE_DIGEST, TARGET_HARNESS_ASSERTION } from "./target-harness.js";

/**
 * HUNT-008: deterministic first-party A1 fixtures and A2 target-harness
 * descriptors currently admitted by the bounded runtime.
 *
 * This is deliberately a catalog of contract metadata, not a remote recipe
 * feed and not permission to execute arbitrary commands. Callers still need
 * a trusted signed recipe, an approval receipt, and an exact execution
 * binding. Keeping the catalog here lets the command fail closed when a
 * detector has no evidence-backed recipe rather than guessing one.
 */
export const SUPPORTED_HUNT_RECIPE_CATALOG = Object.freeze([
  {
    recipeId: "a1-utf8-contains",
    ruleId: "hunt.a1.utf8-contains",
    adapter: "restricted-process",
    command: Object.freeze(["verglos-probe", "utf8-contains"]),
    assertions: Object.freeze(["probe result is true"]),
    requiredInputs: Object.freeze(["needle", "value"]),
    fixtures: Object.freeze([
      { name: "positive", expected: "confirmed" },
      { name: "negative", expected: "not-reproduced" },
      { name: "timeout", expected: "inconclusive" },
      { name: "adapter-failure", expected: "environment-error" },
    ]),
  },
  {
    recipeId: "a1-path-traversal",
    ruleId: "hunt.a1.path-traversal",
    adapter: "restricted-process",
    command: Object.freeze(["verglos-probe", "path-traversal"]),
    assertions: Object.freeze(["probe result is true"]),
    requiredInputs: Object.freeze(["path"]),
    fixtures: Object.freeze([
      { name: "positive", expected: "confirmed" },
      { name: "negative", expected: "not-reproduced" },
      { name: "timeout", expected: "inconclusive" },
      { name: "adapter-failure", expected: "environment-error" },
    ]),
  },
  {
    recipeId: "a1-command-injection",
    ruleId: "hunt.a1.command-injection",
    adapter: "restricted-process",
    command: Object.freeze(["verglos-probe", "command-injection"]),
    assertions: Object.freeze(["probe result is true"]),
    requiredInputs: Object.freeze(["input"]),
    fixtures: Object.freeze([
      { name: "positive", expected: "confirmed" },
      { name: "negative", expected: "not-reproduced" },
      { name: "timeout", expected: "inconclusive" },
      { name: "adapter-failure", expected: "environment-error" },
    ]),
  },
  {
    recipeId: "a1-ssrf-target",
    ruleId: "hunt.a1.ssrf-target",
    adapter: "restricted-process",
    command: Object.freeze(["verglos-probe", "ssrf-target"]),
    assertions: Object.freeze(["probe result is true"]),
    requiredInputs: Object.freeze(["url"]),
    fixtures: Object.freeze([
      { name: "positive", expected: "confirmed" },
      { name: "negative", expected: "not-reproduced" },
      { name: "timeout", expected: "inconclusive" },
      { name: "adapter-failure", expected: "environment-error" },
    ]),
  },
  {
    recipeId: "a1-tenant-boundary",
    ruleId: "hunt.a1.tenant-boundary",
    adapter: "restricted-process",
    command: Object.freeze(["verglos-probe", "tenant-boundary"]),
    assertions: Object.freeze(["probe result is true"]),
    requiredInputs: Object.freeze(["authorizedTenant", "requestedTenant"]),
    fixtures: Object.freeze([
      { name: "positive", expected: "confirmed" },
      { name: "negative", expected: "not-reproduced" },
      { name: "timeout", expected: "inconclusive" },
      { name: "adapter-failure", expected: "environment-error" },
    ]),
  },
  {
    recipeId: "a1-sql-injection",
    ruleId: "hunt.a1.sql-injection",
    adapter: "restricted-process",
    command: Object.freeze(["verglos-probe", "sql-injection"]),
    assertions: Object.freeze(["probe result is true"]),
    requiredInputs: Object.freeze(["input"]),
    fixtures: Object.freeze([
      { name: "positive", expected: "confirmed" },
      { name: "negative", expected: "not-reproduced" },
      { name: "timeout", expected: "inconclusive" },
      { name: "adapter-failure", expected: "environment-error" },
    ]),
  },
  {
    recipeId: "a1-xss-safe",
    ruleId: "hunt.a1.xss-safe",
    adapter: "restricted-process",
    command: Object.freeze(["verglos-probe", "xss-safe"]),
    assertions: Object.freeze(["probe result is true"]),
    requiredInputs: Object.freeze(["html"]),
    fixtures: Object.freeze([
      { name: "positive", expected: "confirmed" },
      { name: "negative", expected: "not-reproduced" },
      { name: "timeout", expected: "inconclusive" },
      { name: "adapter-failure", expected: "environment-error" },
    ]),
  },
  {
    recipeId: "a1-agent-boundary",
    ruleId: "hunt.a1.agent-boundary",
    adapter: "restricted-process",
    command: Object.freeze(["verglos-probe", "agent-boundary"]),
    assertions: Object.freeze(["probe result is true"]),
    requiredInputs: Object.freeze(["allowlist", "tool"]),
    fixtures: Object.freeze([
      { name: "positive", expected: "confirmed" },
      { name: "negative", expected: "not-reproduced" },
      { name: "timeout", expected: "inconclusive" },
      { name: "adapter-failure", expected: "environment-error" },
    ]),
  },
  ...([
    ["a2-sql-nosql-injection-harness", "D1-001", "/workspace/.verglos/hunt/sql-nosql-injection.mjs"],
    ["a2-command-injection-harness", "D1-003", "/workspace/.verglos/hunt/command-injection.mjs"],
    ["a2-path-traversal-harness", "D1-006", "/workspace/.verglos/hunt/path-traversal.mjs"],
    ["a2-ssrf-harness", "D9-002", "/workspace/.verglos/hunt/ssrf.mjs"],
    ["a2-agent-mcp-harness", "AGENT-001", "/workspace/.verglos/hunt/agent-mcp.mjs"],
    ["a2-xss-harness", "D1-004", "/workspace/.verglos/hunt/xss.mjs"],
    ["a2-authorization-harness", "D3-001", "/workspace/.verglos/hunt/authorization.mjs"],
    ["a2-prototype-pollution-harness", "D1-008", "/workspace/.verglos/hunt/prototype-pollution.mjs"],
    ["a2-secrets-credential-use-harness", "D4-001", "/workspace/.verglos/hunt/secret-credential-use.mjs"],
    ["a2-supply-chain-harness", "D6-001", "/workspace/.verglos/hunt/supply-chain.mjs"],
  ] as const).map(([recipeId, ruleId, harnessPath]) => ({
    recipeId,
    ruleId,
    adapter: "container" as const,
    command: Object.freeze(["node", harnessPath]),
    assertions: Object.freeze([TARGET_HARNESS_ASSERTION]),
    requiredInputs: Object.freeze([] as string[]),
    fixtures: Object.freeze([
      { name: "positive", expected: "confirmed" },
      { name: "negative", expected: "not-reproduced" },
      { name: "timeout", expected: "inconclusive" },
      { name: "adapter-failure", expected: "environment-error" },
    ]),
    imageDigest: HUNT_TARGET_HARNESS_IMAGE_DIGEST,
  })),
] as const);

export type SupportedHuntRecipe = (typeof SUPPORTED_HUNT_RECIPE_CATALOG)[number];

export type SupportedRecipeValidation = Readonly<{
  supported: true;
  descriptor: SupportedHuntRecipe;
  recipeDigest: string;
}> | Readonly<{
  supported: false;
  reason:
    | "recipe_not_in_catalog"
    | "adapter_mismatch"
    | "command_mismatch"
    | "assertion_mismatch"
    | "inputs_mismatch"
    | "network_not_denied"
    | "cleanup_not_unconditional"
    | "redaction_not_required"
    | "image_mismatch";
}>;

/** Validate a parsed/signed recipe against the fixed public catalog. */
export function validateSupportedHuntRecipe(value: unknown): SupportedRecipeValidation {
  let recipe: HuntRecipe;
  try {
    recipe = parseHuntRecipe(value);
  } catch {
    return { supported: false, reason: "recipe_not_in_catalog" };
  }
  const descriptor = SUPPORTED_HUNT_RECIPE_CATALOG.find((candidate) => candidate.recipeId === recipe.recipeId);
  if (!descriptor || descriptor.ruleId !== recipe.ruleId) return { supported: false, reason: "recipe_not_in_catalog" };
  if (recipe.isolation !== descriptor.adapter) return { supported: false, reason: "adapter_mismatch" };
  if (!same(descriptor.command, recipe.command)) return { supported: false, reason: "command_mismatch" };
  if (!same(descriptor.assertions, recipe.assertions)) return { supported: false, reason: "assertion_mismatch" };
  if (Object.keys(recipe.inputs ?? {}).sort().join(",") !== descriptor.requiredInputs.join(",")) return { supported: false, reason: "inputs_mismatch" };
  if (recipe.network.mode !== "denied" || recipe.network.destinations.length !== 0 || recipe.limits.maxNetworkRequests !== 0) return { supported: false, reason: "network_not_denied" };
  if (recipe.cleanup !== "always") return { supported: false, reason: "cleanup_not_unconditional" };
  if (recipe.redaction !== "required") return { supported: false, reason: "redaction_not_required" };
  if (descriptor.adapter === "container" && `${recipe.imageDigest.algorithm}:${recipe.imageDigest.value}` !== descriptor.imageDigest) return { supported: false, reason: "image_mismatch" };
  return { supported: true, descriptor, recipeDigest: huntRecipeDigest(recipe) };
}

function same(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}
