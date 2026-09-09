import assert from "node:assert/strict";
import { test } from "node:test";
import { createApprovalReceipt } from "./approval-receipt.js";
import { canExecuteHunt } from "./hunt-execution-gate.js";
import { parseHuntRecipe } from "./hunt-recipe.js";

test("Hunt execution requires trusted exact recipe and execute approval", () => {
  const subjectId = "urn:verglos:subject:artifact:sha256:" + "a".repeat(64);
  const recipe = parseHuntRecipe({ schemaId: "urn:verglos:schema:hunt-recipe", schemaVersion: "1.0.0", recipeId: "hunt-sql", ruleId: "d1-1", targetSubjectId: subjectId, imageDigest: { algorithm: "sha256", value: "b".repeat(64) }, command: ["node", "check.js"], assertions: ["exit code is 0"], isolation: "container", limits: { timeoutMs: 1000, memoryMb: 256, outputBytes: 10000 }, cleanup: "always", network: { mode: "denied", destinations: [], reason: "local reproduction" }, redaction: "required", signature: { status: "verified", signer: "verglos-release" } });
  const approval = createApprovalReceipt({ requestId: "123e4567-e89b-12d3-a456-426614174000", action: "execute", actor: "agent", target: subjectId, files: [], network: [], policyEffect: "hunt", requestedAt: "2026-01-01T00:00:00Z", expiresAt: "2026-02-01T00:00:00Z" }, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
  assert.equal(canExecuteHunt(recipe, { ruleId: "d1-1", subjectId, at: "2026-01-02T00:00:00Z", approval }, { signers: ["verglos-release"] }), true);
  assert.equal(canExecuteHunt(recipe, { ruleId: "other", subjectId, at: "2026-01-02T00:00:00Z", approval }, { signers: ["verglos-release"] }), false);
});
