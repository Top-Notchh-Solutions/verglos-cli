import assert from "node:assert/strict";
import { test } from "node:test";
import { createApprovalReceipt } from "./approval-receipt.js";
import { canExecuteHunt } from "./hunt-execution-gate.js";
import { parseHuntRecipe } from "./hunt-recipe.js";
import { huntRecipeDigest } from "./hunt-recipe-trust.js";

test("Hunt execution requires trusted exact recipe and execute approval", () => {
  const subjectId = "urn:verglos:subject:artifact:sha256:" + "a".repeat(64);
  const recipe = parseHuntRecipe({ schemaId: "urn:verglos:schema:hunt-recipe", schemaVersion: "1.0.0", recipeId: "hunt-sql", ruleId: "d1-1", targetSubjectId: subjectId, imageDigest: { algorithm: "sha256", value: "b".repeat(64) }, command: ["node", "check.js"], assertions: ["exit code is 0"], isolation: "container", limits: { timeoutMs: 1000, memoryMb: 256, outputBytes: 10000, processes: 32 }, cleanup: "always", network: { mode: "denied", destinations: [], reason: "local reproduction" }, redaction: "required", signature: { status: "verified", signer: "verglos-release" } });
  const approval = createApprovalReceipt({ requestId: "123e4567-e89b-12d3-a456-426614174000", action: "execute", actor: "agent", target: subjectId, files: [], network: [], policyEffect: "hunt", requestedAt: "2026-01-01T00:00:00Z", expiresAt: "2026-02-01T00:00:00Z" }, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
  const trust = { signers: ["verglos-release"], recipeDigests: [huntRecipeDigest(recipe)] };
  assert.equal(canExecuteHunt(recipe, { ruleId: "d1-1", subjectId, at: "2026-01-02T00:00:00Z", approval }, trust), true);
  assert.equal(canExecuteHunt(recipe, { ruleId: "other", subjectId, at: "2026-01-02T00:00:00Z", approval }, trust), false);
  assert.equal(canExecuteHunt(recipe, { ruleId: "d1-1", subjectId, at: "2026-01-02T00:00:00Z", approval }, { signers: ["verglos-release"], recipeDigests: ["sha256:" + "0".repeat(64)] }), false);
  const wrongEffect = createApprovalReceipt({ requestId: "123e4567-e89b-12d3-a456-426614174001", action: "execute", actor: "agent", target: subjectId, files: [], network: [], policyEffect: "mutate", requestedAt: "2026-01-01T00:00:00Z", expiresAt: "2026-02-01T00:00:00Z" }, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
  assert.equal(canExecuteHunt(recipe, { ruleId: "d1-1", subjectId, at: "2026-01-02T00:00:00Z", approval: wrongEffect }, trust), false);
  assert.equal(canExecuteHunt(recipe, { ruleId: "d1-1", subjectId, at: "2026-01-02T00:00:00Z", approval }, { signers: [] } as never), false);
  const allowlistedRecipe = parseHuntRecipe({ ...recipe, network: { mode: "allowlist", destinations: ["https://example.com"], reason: "fixture" }, isolation: "container" });
  const allowlistedApproval = createApprovalReceipt({ requestId: "123e4567-e89b-12d3-a456-426614174002", action: "execute", actor: "agent", target: subjectId, files: [], network: ["https://example.com"], policyEffect: "hunt", requestedAt: "2026-01-01T00:00:00Z", expiresAt: "2026-02-01T00:00:00Z" }, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
  assert.equal(canExecuteHunt(allowlistedRecipe, { ruleId: "d1-1", subjectId, at: "2026-01-02T00:00:00Z", approval: allowlistedApproval }, { signers: ["verglos-release"], recipeDigests: [huntRecipeDigest(allowlistedRecipe)] }), true);
  const widenedApproval = createApprovalReceipt({ requestId: "123e4567-e89b-12d3-a456-426614174003", action: "execute", actor: "agent", target: subjectId, files: [], network: ["https://example.com", "https://other.example"], policyEffect: "hunt", requestedAt: "2026-01-01T00:00:00Z", expiresAt: "2026-02-01T00:00:00Z" }, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
  assert.equal(canExecuteHunt(allowlistedRecipe, { ruleId: "d1-1", subjectId, at: "2026-01-02T00:00:00Z", approval: widenedApproval }, { signers: ["verglos-release"] }), false);
});
