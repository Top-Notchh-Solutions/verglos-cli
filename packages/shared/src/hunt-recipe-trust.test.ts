import assert from "node:assert/strict";
import { test } from "node:test";
import { isTrustedHuntRecipe, huntRecipeDigest, huntRecipeTrustPolicyDigest, parseHuntRecipeTrustPolicy } from "./hunt-recipe-trust.js";
import { parseHuntRecipe } from "./hunt-recipe.js";

const recipe = parseHuntRecipe({ schemaId: "urn:verglos:schema:hunt-recipe", schemaVersion: "1.0.0", recipeId: "hunt-sql", ruleId: "d1-1", targetSubjectId: "urn:verglos:subject:artifact:sha256:" + "a".repeat(64), imageDigest: { algorithm: "sha256", value: "b".repeat(64) }, command: ["node", "check.js"], assertions: ["exit code is 0"], isolation: "container", limits: { timeoutMs: 1000, memoryMb: 256, outputBytes: 10000 }, cleanup: "always", network: { mode: "denied", destinations: [], reason: "local reproduction" }, redaction: "required", signature: { status: "verified", signer: "verglos-release" } });

test("Hunt trust requires verified allowlisted non-revoked recipes", () => { assert.match(huntRecipeDigest(recipe), /^sha256:[a-f0-9]{64}$/); assert.equal(isTrustedHuntRecipe(recipe, { signers: ["verglos-release"] }), true); assert.equal(isTrustedHuntRecipe(recipe, { signers: ["other"] }), false); assert.equal(isTrustedHuntRecipe(recipe, { signers: ["verglos-release"], revokedRecipeIds: ["hunt-sql"] }), false); });

test("Hunt trust can pin an exact recipe content digest", () => {
  const digest = huntRecipeDigest(recipe);
  assert.equal(isTrustedHuntRecipe(recipe, { signers: ["verglos-release"], recipeDigests: [digest] }), true);
  assert.equal(isTrustedHuntRecipe(recipe, { signers: ["verglos-release"], recipeDigests: ["sha256:" + "0".repeat(64)] }), false);
});

test("Hunt trust policy rejects malformed, unknown, and duplicate entries", () => {
  assert.throws(() => parseHuntRecipeTrustPolicy({ signers: [] }));
  assert.throws(() => parseHuntRecipeTrustPolicy({ signers: ["verglos-release", "verglos-release"] }));
  assert.throws(() => parseHuntRecipeTrustPolicy({ signers: ["verglos-release"], recipeDigests: ["sha512:" + "0".repeat(128)] }));
  assert.throws(() => parseHuntRecipeTrustPolicy({ signers: ["verglos-release"], unknown: true }));
});

test("Hunt trust policy digest is canonical and stable", () => {
  const first = { signers: ["verglos-release"], recipeDigests: [huntRecipeDigest(recipe)] };
  const second = { recipeDigests: [...first.recipeDigests], signers: [...first.signers] };
  assert.equal(huntRecipeTrustPolicyDigest(first), huntRecipeTrustPolicyDigest(second));
  assert.match(huntRecipeTrustPolicyDigest(first), /^sha256:[a-f0-9]{64}$/);
});
