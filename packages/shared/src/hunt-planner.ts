import { parseHuntRecipe, type HuntRecipe } from "./hunt-recipe.js";
import { huntRecipeDigest, isTrustedHuntRecipe, type HuntRecipeTrustPolicy } from "./hunt-recipe-trust.js";

export interface HuntPlan {
  readonly supported: boolean;
  readonly trusted: boolean | undefined;
  readonly reason: string;
  readonly recipeId: string;
  readonly recipeDigest: string;
  readonly ruleId: string;
  readonly targetSubjectId: string;
  readonly imageDigest: HuntRecipe["imageDigest"];
  readonly command: readonly string[];
  readonly inputs: Readonly<Record<string, string>>;
  readonly isolation: HuntRecipe["isolation"];
  readonly limits: HuntRecipe["limits"];
  readonly cleanup: HuntRecipe["cleanup"];
  readonly network: Readonly<{
    readonly mode: HuntRecipe["network"]["mode"];
    readonly destinations: readonly string[];
    readonly reason: string;
  }>;
  readonly redaction: HuntRecipe["redaction"];
  readonly signature: HuntRecipe["signature"];
  readonly executes: false;
}
export function planHunt(recipe: HuntRecipe, input: { readonly ruleId: string; readonly subjectId: string }, options: { readonly trust?: HuntRecipeTrustPolicy } = {}): HuntPlan {
  const parsed = parseHuntRecipe(recipe);
  const matches = parsed.ruleId === input.ruleId && parsed.targetSubjectId === input.subjectId;
  const trusted = options.trust ? isTrustedHuntRecipe(parsed, options.trust) : undefined;
  const supported = matches && trusted !== false;
  return {
    supported,
    reason: !matches ? "recipe does not match the exact rule and subject" : trusted === false ? "recipe is not trusted by the supplied trust policy" : "recipe matches exact rule and subject",
    trusted,
    recipeId: parsed.recipeId,
    recipeDigest: huntRecipeDigest(parsed),
    ruleId: parsed.ruleId,
    targetSubjectId: parsed.targetSubjectId,
    imageDigest: Object.freeze({ ...parsed.imageDigest }),
    command: Object.freeze([...parsed.command]),
    inputs: Object.freeze({ ...(parsed.inputs ?? {}) }),
    isolation: parsed.isolation,
    limits: Object.freeze({ ...parsed.limits }),
    cleanup: parsed.cleanup,
    network: Object.freeze({ mode: parsed.network.mode, destinations: Object.freeze([...parsed.network.destinations]), reason: parsed.network.reason }),
    redaction: parsed.redaction,
    signature: Object.freeze({ ...parsed.signature }),
    executes: false,
  };
}
