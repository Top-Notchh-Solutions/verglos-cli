import { parseHuntRecipe, type HuntRecipe } from "./hunt-recipe.js";
import { huntRecipeDigest, isTrustedHuntRecipe, type HuntRecipeTrustPolicy } from "./hunt-recipe-trust.js";
import type { Finding } from "./types.js";

export interface HuntPlan {
  readonly supported: boolean;
  readonly trusted: boolean | undefined;
  readonly reason: string;
  readonly recipeId: string;
  readonly recipeDigest: string;
  readonly findingId: string;
  readonly ruleId: string;
  readonly targetSubjectId: string;
  readonly imageDigest: HuntRecipe["imageDigest"];
  readonly command: readonly string[];
  readonly inputs: Readonly<Record<string, string>>;
  readonly filesystem: Readonly<{
    readonly source: "none" | "project-root-read-only";
    readonly scratch: "bounded-temporary";
  }>;
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
export function planHunt(recipe: HuntRecipe, input: { readonly finding: Pick<Finding, "id" | "detector" | "rule">; readonly subjectId: string }, options: { readonly trust?: HuntRecipeTrustPolicy; readonly at?: string } = {}): HuntPlan {
  const parsed = parseHuntRecipe(recipe);
  const selectedRuleId = input.finding.rule ?? input.finding.detector;
  const matches = parsed.ruleId === selectedRuleId && parsed.targetSubjectId === input.subjectId;
  const trusted = options.trust ? isTrustedHuntRecipe(parsed, options.trust, options.at) : undefined;
  // A dry-run plan is useful without a trust store, but it is never marked
  // supported/executable until the selected recipe is trusted. This prevents
  // model- or caller-supplied command text from being presented as runnable.
  const supported = matches && trusted === true;
  const plan: HuntPlan = {
    supported,
    reason: !matches
      ? "recipe does not match the selected finding's exact rule and subject"
      : trusted === true
        ? "trusted recipe matches the selected finding's exact rule and subject"
        : options.trust
          ? "recipe is not trusted by the supplied trust policy"
          : "a trust policy is required before this plan can be supported",
    trusted,
    recipeId: parsed.recipeId,
    recipeDigest: huntRecipeDigest(parsed),
    findingId: input.finding.id,
    ruleId: parsed.ruleId,
    targetSubjectId: parsed.targetSubjectId,
    imageDigest: Object.freeze({ ...parsed.imageDigest }),
    command: Object.freeze([...parsed.command]),
    inputs: Object.freeze({ ...(parsed.inputs ?? {}) }),
    filesystem: Object.freeze({
      source: parsed.isolation === "restricted-process" ? "none" : "project-root-read-only",
      scratch: "bounded-temporary",
    }),
    isolation: parsed.isolation,
    limits: Object.freeze({ ...parsed.limits }),
    cleanup: parsed.cleanup,
    network: Object.freeze({ mode: parsed.network.mode, destinations: Object.freeze([...parsed.network.destinations]), reason: parsed.network.reason }),
    redaction: parsed.redaction,
    signature: Object.freeze({ ...parsed.signature }),
    executes: false,
  };
  return Object.freeze(plan);
}
