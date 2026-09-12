import assert from "node:assert/strict";
import { test } from "node:test";
import { createApprovalReceipt } from "./approval-receipt.js";
import { bindHuntExecution, HuntExecutionBindingSchema } from "./hunt-execution-binding.js";
import { parseHuntRecipe } from "./hunt-recipe.js";
import { huntRecipeDigest } from "./hunt-recipe-trust.js";

const subjectId = `urn:verglos:subject:artifact:sha256:${"a".repeat(64)}`;
const recipe = parseHuntRecipe({ schemaId: "urn:verglos:schema:hunt-recipe", schemaVersion: "1.0.0", recipeId: "hunt-binding", ruleId: "d1-1", targetSubjectId: subjectId, imageDigest: { algorithm: "sha256", value: "b".repeat(64) }, command: ["/probe"], assertions: ["exit code is 0"], isolation: "container", limits: { timeoutMs: 1000, cpuMs: 900, memoryMb: 256, diskMb: 128, outputBytes: 10000, processes: 32, maxNetworkRequests: 0 }, cleanup: "always", network: { mode: "denied", destinations: [], reason: "fixture" }, redaction: "required", signature: { status: "verified", signer: "verglos-release" } });
const request = { requestId: "423e4567-e89b-12d3-a456-426614174000", action: "execute" as const, actor: "human", target: subjectId, files: [], network: [], policyEffect: "hunt", requestedAt: "2026-01-01T00:00:00Z", expiresAt: "2026-01-01T01:00:00Z" };
const approval = createApprovalReceipt(request, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });

test("Hunt execution binding pins recipe, trust, approval, and observation identities", () => {
  const binding = bindHuntExecution({ recipe, trust: { signers: ["verglos-release"], recipeDigests: [huntRecipeDigest(recipe)], at: "2026-01-01T00:02:00Z" }, approval, ruleId: "d1-1", subjectId, observationId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", at: "2026-01-01T00:02:00Z" });
  assert.match(binding.recipeDigest, /^sha256:/);
  assert.match(binding.trustPolicyDigest, /^sha256:/);
  assert.match(binding.approvalRequestDigest, /^sha256:/);
  assert.equal(binding.network.mode, "denied");
  assert.deepEqual(binding.limits, recipe.limits);
  assert.ok(Object.isFrozen(binding));
  assert.ok(Object.isFrozen(binding.network));
});

test("Hunt execution binding refuses widened or unusable approval", () => {
  assert.throws(() => bindHuntExecution({ recipe, trust: { signers: ["verglos-release"] }, approval, ruleId: "other-rule", subjectId, observationId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", at: "2026-01-01T00:02:00Z" }), /exact trusted/);
});

test("Hunt execution binding rejects resource limits that contradict the recipe contract", () => {
  const binding = bindHuntExecution({ recipe, trust: { signers: ["verglos-release"], recipeDigests: [huntRecipeDigest(recipe)] }, approval, ruleId: "d1-1", subjectId, observationId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", at: "2026-01-01T00:02:00Z" });
  assert.throws(() => HuntExecutionBindingSchema.parse({ ...binding, limits: { ...binding.limits, cpuMs: binding.limits.timeoutMs + 1 } }));
});
