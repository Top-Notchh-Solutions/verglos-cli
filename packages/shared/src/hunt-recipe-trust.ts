import { createHash } from "node:crypto";
import { canonicalizeJson } from "./schema.js";
import { parseHuntRecipe, type HuntRecipe } from "./hunt-recipe.js";

export function huntRecipeDigest(recipe: HuntRecipe): string { return `sha256:${createHash("sha256").update(canonicalizeJson(parseHuntRecipe(recipe)), "utf8").digest("hex")}`; }
export function isTrustedHuntRecipe(recipe: HuntRecipe, trust: { readonly signers: readonly string[]; readonly revokedRecipeIds?: readonly string[] }): boolean {
  const parsed = parseHuntRecipe(recipe);
  return parsed.signature.status === "verified" && !!parsed.signature.signer && trust.signers.includes(parsed.signature.signer) && !(trust.revokedRecipeIds ?? []).includes(parsed.recipeId);
}
