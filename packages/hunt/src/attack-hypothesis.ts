import {
  planHuntAttackHypothesis,
  type HuntAttackFindingContext,
  type HuntAttackHypothesis,
  type HuntTargetManifest,
} from "@verglos/shared";
import { SUPPORTED_HUNT_RECIPE_CATALOG } from "./supported-recipe-catalog.js";

/**
 * Select only a public catalog playbook for an exact finding and Scout
 * manifest. This is planning metadata; it never signs, approves, or executes.
 */
export function planSupportedHuntAttack(input: {
  readonly manifest: HuntTargetManifest;
  readonly finding: HuntAttackFindingContext;
}): HuntAttackHypothesis {
  return planHuntAttackHypothesis({
    manifest: input.manifest,
    finding: input.finding,
    playbooks: SUPPORTED_HUNT_RECIPE_CATALOG,
  });
}
