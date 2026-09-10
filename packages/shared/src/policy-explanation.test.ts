import assert from "node:assert/strict";
import { test } from "node:test";
import { createPolicyEvaluation } from "./policy-evaluation.js";
import { explainPolicyEvaluation } from "./policy-explanation.js";

test("policy explanation preserves decision-first evidence context", () => {
  const subjectId = "urn:verglos:subject:artifact:sha256:" + "a".repeat(64);
  const evaluation = createPolicyEvaluation({ schemaId: "urn:verglos:schema:policy-evaluation", schemaVersion: "1.0.0", evaluationId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", policy: { id: "policy-free", version: "1.0.0", digest: { algorithm: "sha256", value: "b".repeat(64) } }, subjectId, subjectMatch: { status: "matched", observedSubjectId: subjectId }, evaluatedAt: "2026-09-01T00:00:00Z", checks: [{ id: "critical", requirement: "required", onFailure: "BLOCK", status: "missing", evidenceDigests: [], observationIds: [], freshness: { status: "unknown", checkedAt: "2026-09-01T00:00:00Z" }, owner: "security", reason: "missing", nextAction: "run scan" }], limitations: ["engine unavailable"] });
  const explanation = explainPolicyEvaluation(evaluation);
  assert.equal(explanation.decision, "INCOMPLETE");
  assert.equal(explanation.policy.id, "policy-free");
  assert.equal(explanation.limitations[0], "engine unavailable");
  assert.equal(explanation.reasons[0]?.nextAction, "run scan");
});
