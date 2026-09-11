import { createHash } from "node:crypto";
import { canonicalizeJson } from "./schema.js";
import { parseHuntRecipe, type HuntRecipe } from "./hunt-recipe.js";
import { StableContractIdSchema } from "./engine.js";
import { z } from "zod";

export function huntRecipeDigest(recipe: HuntRecipe): string { return `sha256:${createHash("sha256").update(canonicalizeJson(parseHuntRecipe(recipe)), "utf8").digest("hex")}`; }
const DigestSchema = z.string().regex(/^sha256:[a-f0-9]{64}$/);
export const HuntRecipeTrustPolicySchema = z.object({
  signers: z.array(z.string().min(1).max(512)).min(1).max(128),
  revokedRecipeIds: z.array(StableContractIdSchema).max(4096).optional(),
  recipeDigests: z.array(DigestSchema).max(4096).optional(),
  at: z.string().datetime({ offset: true }).optional(),
}).strict().superRefine((value, ctx) => {
  for (const [name, values] of [["signers", value.signers], ["revokedRecipeIds", value.revokedRecipeIds ?? []], ["recipeDigests", value.recipeDigests ?? []]] as const) {
    if (new Set(values).size !== values.length) ctx.addIssue({ code: z.ZodIssueCode.custom, path: [name], message: `${name} must not contain duplicates` });
  }
});
export type HuntRecipeTrustPolicy = z.infer<typeof HuntRecipeTrustPolicySchema>;
export function parseHuntRecipeTrustPolicy(value: unknown): HuntRecipeTrustPolicy {
  const parsed = HuntRecipeTrustPolicySchema.safeParse(value);
  if (!parsed.success) throw new Error(`Invalid Hunt trust policy: ${parsed.error.issues.map((issue) => issue.message).join("; ")}`);
  return parsed.data;
}

export function huntRecipeTrustPolicyDigest(policy: HuntRecipeTrustPolicy): string {
  return `sha256:${createHash("sha256").update(canonicalizeJson(parseHuntRecipeTrustPolicy(policy)), "utf8").digest("hex")}`;
}

export function isTrustedHuntRecipe(recipe: HuntRecipe, trust: HuntRecipeTrustPolicy): boolean {
  const policy = parseHuntRecipeTrustPolicy(trust);
  const parsed = parseHuntRecipe(recipe);
  const digest = huntRecipeDigest(parsed);
  return parsed.signature.status === "verified"
    && !!parsed.signature.signer
    && policy.signers.includes(parsed.signature.signer)
    && !(policy.revokedRecipeIds ?? []).includes(parsed.recipeId)
    && (!parsed.signature.expiresAt || Date.parse(parsed.signature.expiresAt) > Date.parse(policy.at ?? new Date().toISOString()))
    && (!policy.recipeDigests || policy.recipeDigests.includes(digest));
}
