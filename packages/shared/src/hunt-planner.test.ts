import assert from "node:assert/strict";
import { test } from "node:test";
import { planHunt } from "./hunt-planner.js";
import { parseHuntRecipe } from "./hunt-recipe.js";

const recipe = parseHuntRecipe({ schemaId: "urn:verglos:schema:hunt-recipe", schemaVersion: "1.0.0", recipeId: "hunt-sql", ruleId: "d1-1", targetSubjectId: "urn:verglos:subject:artifact:sha256:" + "a".repeat(64), imageDigest: { algorithm: "sha256", value: "b".repeat(64) }, command: ["node", "check.js"], assertions: ["exit code is 0"], isolation: "container", limits: { timeoutMs: 1000, memoryMb: 256, outputBytes: 10000 }, cleanup: "always", network: { mode: "denied", destinations: [], reason: "local reproduction" }, redaction: "required", signature: { status: "verified", signer: "verglos-release" } });

test("Hunt planner is exact-match, immutable, and execution-free", () => {
  const withInputs = parseHuntRecipe({ ...recipe, inputs: { fixture: "safe" } });
  const plan = planHunt(withInputs, { ruleId: "d1-1", subjectId: recipe.targetSubjectId });
  assert.equal(plan.supported, true);
  assert.equal(plan.trusted, undefined);
  assert.equal(plan.executes, false);
  assert.equal(plan.ruleId, recipe.ruleId);
  assert.equal(plan.targetSubjectId, recipe.targetSubjectId);
  assert.deepEqual(plan.command, ["node", "check.js"]);
  assert.deepEqual(plan.inputs, { fixture: "safe" });
  assert.equal(plan.cleanup, "always");
  assert.equal(plan.redaction, "required");
  assert.equal(plan.signature.status, "verified");
  assert.ok(Object.isFrozen(plan.inputs));
  assert.ok(Object.isFrozen(plan.network));
  assert.ok(Object.isFrozen(plan.network.destinations));
  assert.ok(Object.isFrozen(plan.signature));
  assert.equal(planHunt(recipe, { ruleId: "other", subjectId: recipe.targetSubjectId }).supported, false);
  assert.equal(planHunt(recipe, { ruleId: "d1-1", subjectId: recipe.targetSubjectId }, { trust: { signers: ["other"] } }).supported, false);
  assert.equal(planHunt(recipe, { ruleId: "d1-1", subjectId: recipe.targetSubjectId }, { trust: { signers: ["verglos-release"] } }).trusted, true);
});
