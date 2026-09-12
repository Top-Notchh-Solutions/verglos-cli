import { isApprovalUsable, type ApprovalReceipt } from "./approval-receipt.js";
import { isExecutableHuntRecipe, type HuntRecipeTrustPolicy } from "./hunt-recipe-trust.js";
import type { HuntRecipe } from "./hunt-recipe.js";

export function canExecuteHunt(recipe: HuntRecipe, input: { readonly ruleId: string; readonly subjectId: string; readonly at: string; readonly approval: ApprovalReceipt }, trust: HuntRecipeTrustPolicy): boolean {
  try {
    const networkMatches = input.approval.network.length === recipe.network.destinations.length
      && recipe.network.destinations.every((destination) => input.approval.network.includes(destination));
    return recipe.ruleId === input.ruleId
      && recipe.targetSubjectId === input.subjectId
      && isExecutableHuntRecipe(recipe, trust)
      && input.approval.action === "execute"
      && input.approval.policyEffect === "hunt"
      && input.approval.target === input.subjectId
      && networkMatches
      && isApprovalUsable(input.approval, input.at);
  } catch {
    return false;
  }
}
