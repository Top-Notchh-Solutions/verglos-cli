import { isApprovalUsable, type ApprovalReceipt } from "./approval-receipt.js";
import { isTrustedHuntRecipe, type HuntRecipeTrustPolicy } from "./hunt-recipe-trust.js";
import type { HuntRecipe } from "./hunt-recipe.js";

export function canExecuteHunt(recipe: HuntRecipe, input: { readonly ruleId: string; readonly subjectId: string; readonly at: string; readonly approval: ApprovalReceipt }, trust: HuntRecipeTrustPolicy): boolean {
  return recipe.ruleId === input.ruleId && recipe.targetSubjectId === input.subjectId && isTrustedHuntRecipe(recipe, trust) && input.approval.action === "execute" && input.approval.target === input.subjectId && isApprovalUsable(input.approval, input.at);
}
