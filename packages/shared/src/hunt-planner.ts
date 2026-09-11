import { parseHuntRecipe, type HuntRecipe } from "./hunt-recipe.js";

export interface HuntPlan {
  readonly supported: boolean;
  readonly reason: string;
  readonly recipeId: string;
  readonly command: readonly string[];
  readonly inputs: Readonly<Record<string, string>>;
  readonly isolation: HuntRecipe["isolation"];
  readonly limits: HuntRecipe["limits"];
  readonly network: HuntRecipe["network"];
  readonly executes: false;
}
export function planHunt(recipe: HuntRecipe, input: { readonly ruleId: string; readonly subjectId: string }): HuntPlan {
  const parsed = parseHuntRecipe(recipe);
  const supported = parsed.ruleId === input.ruleId && parsed.targetSubjectId === input.subjectId;
  return {
    supported,
    reason: supported ? "recipe matches exact rule and subject" : "recipe does not match the exact rule and subject",
    recipeId: parsed.recipeId,
    command: Object.freeze([...parsed.command]),
    inputs: Object.freeze({ ...(parsed.inputs ?? {}) }),
    isolation: parsed.isolation,
    limits: Object.freeze({ ...parsed.limits }),
    network: Object.freeze({ mode: parsed.network.mode, destinations: Object.freeze([...parsed.network.destinations]), reason: parsed.network.reason }),
    executes: false,
  };
}
