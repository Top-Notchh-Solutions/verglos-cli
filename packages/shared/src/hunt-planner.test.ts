import assert from "node:assert/strict";
import { test } from "node:test";
import { planHunt } from "./hunt-planner.js";
import { parseHuntRecipe } from "./hunt-recipe.js";
import { createTestHuntTrustStore, TEST_HUNT_TRUST_KEY_ID } from "./hunt-trust-test-support.js";

const recipe = parseHuntRecipe({ schemaId: "urn:verglos:schema:hunt-recipe", schemaVersion: "1.0.0", recipeId: "hunt-sql", ruleId: "d1-1", targetSubjectId: "urn:verglos:subject:artifact:sha256:" + "a".repeat(64), imageDigest: { algorithm: "sha256", value: "b".repeat(64) }, command: ["node", "check.js"], assertions: ["exit code is 0"], isolation: "container", limits: { timeoutMs: 1000, cpuMs: 900, memoryMb: 256, diskMb: 128, outputBytes: 10000, processes: 32, maxNetworkRequests: 0 }, cleanup: "always", network: { mode: "denied", destinations: [], reason: "local reproduction" }, redaction: "required", signature: { status: "verified", signer: TEST_HUNT_TRUST_KEY_ID } });
const finding = { id: "finding-1", detector: "deep-auth" as const, rule: "d1-1" };

test("Hunt planner is exact-match, immutable, and execution-free", () => {
  const withInputs = parseHuntRecipe({ ...recipe, inputs: { fixture: "safe" } });
  const plan = planHunt(withInputs, { finding, subjectId: recipe.targetSubjectId });
  assert.equal(plan.supported, false);
  assert.equal(plan.trusted, undefined);
  assert.equal(plan.executes, false);
  assert.match(plan.reason, /trust policy is required/);
  assert.equal(plan.findingId, finding.id);
  assert.equal(plan.ruleId, recipe.ruleId);
  assert.equal(plan.targetSubjectId, recipe.targetSubjectId);
  assert.match(plan.recipeDigest, /^sha256:[a-f0-9]{64}$/);
  assert.deepEqual(plan.imageDigest, recipe.imageDigest);
  assert.ok(Object.isFrozen(plan.imageDigest));
  assert.deepEqual(plan.command, ["node", "check.js"]);
  assert.deepEqual(plan.inputs, { fixture: "safe" });
  assert.deepEqual(plan.filesystem, { source: "project-root-read-only", scratch: "bounded-temporary" });
  assert.equal(plan.cleanup, "always");
  assert.equal(plan.redaction, "required");
  assert.equal(plan.signature.status, "verified");
  assert.ok(Object.isFrozen(plan.inputs));
  assert.ok(Object.isFrozen(plan.network));
  assert.ok(Object.isFrozen(plan.network.destinations));
  assert.ok(Object.isFrozen(plan.signature));
  assert.ok(Object.isFrozen(plan.filesystem));
  assert.ok(Object.isFrozen(plan));
  assert.equal(planHunt(recipe, { finding: { ...finding, rule: "other" }, subjectId: recipe.targetSubjectId }).supported, false);
  const trust = createTestHuntTrustStore(recipe);
  assert.equal(planHunt(recipe, { finding, subjectId: recipe.targetSubjectId }, { trust: { ...trust, signedFeeds: [] }, at: "2026-01-02T00:00:00Z" }).trusted, false);
  const trustedPlan = planHunt(recipe, { finding, subjectId: recipe.targetSubjectId }, { trust, at: "2026-01-02T00:00:00Z" });
  assert.equal(trustedPlan.trusted, true);
  assert.equal(trustedPlan.supported, true);
});

test("restricted-process plans declare no source access and still require trust", () => {
  const restricted = parseHuntRecipe({
    ...recipe,
    command: ["verglos-probe", "utf8-contains"],
    inputs: { value: "synthetic value", needle: "value" },
    isolation: "restricted-process",
    limits: { ...recipe.limits, processes: 1 },
  });
  const plan = planHunt(restricted, { finding, subjectId: restricted.targetSubjectId });
  assert.equal(plan.supported, false);
  assert.deepEqual(plan.filesystem, { source: "none", scratch: "bounded-temporary" });
  assert.deepEqual(plan.command, ["verglos-probe", "utf8-contains"]);
  assert.deepEqual(plan.network, { mode: "denied", destinations: [], reason: "local reproduction" });
});
