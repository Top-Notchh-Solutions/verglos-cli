import { huntRecipeDigest, parseHuntRecipe, type HuntRecipe } from "@verglos/shared";

/**
 * HUNT-008: the only recipe surface currently eligible for the A1 adapter.
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
    | "redaction_not_required";
}>;

/** Validate a parsed/signed recipe against the fixed A1 catalog. */
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
  return { supported: true, descriptor, recipeDigest: huntRecipeDigest(recipe) };
}

function same(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}
