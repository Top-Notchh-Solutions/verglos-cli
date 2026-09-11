import assert from "node:assert/strict";
import { test } from "node:test";
import { projectEvidence } from "./evidence-projection.js";

test("evidence projection is bounded, sorted, and immutable", () => {
  const result = projectEvidence([]);
  assert.deepEqual(result.observations, []);
  assert.equal(result.lineage, undefined);
  assert.ok(Object.isFrozen(result));
  assert.throws(() => projectEvidence(Array.from({ length: 10_001 }, () => null as never)), /observation bound/);
});

test("evidence projection freezes nested attribution and evidence fields", () => {
  const result = projectEvidence([{
    observationId: "urn:uuid:12345678-1234-4123-8123-123456789abc",
    subjectId: "urn:verglos:subject:artifact:sha256:" + "a".repeat(64),
    origin: { kind: "native", producerId: "verglos", runId: "run-1", ruleId: "D1-001" },
    coverageClass: "native",
    confidence: { level: "high", method: "fixture" },
    evidence: [{ kind: "excerpt", classification: "non-sensitive", handling: "included", description: "fixture" }],
    references: [{ url: "https://example.test/ref" }],
  } as never]);
  const item = result.observations[0]!;
  assert.ok(Object.isFrozen(item));
  assert.ok(Object.isFrozen(item.origin));
  assert.ok(Object.isFrozen(item.confidence));
  assert.ok(Object.isFrozen(item.evidence));
  assert.ok(Object.isFrozen(item.evidence[0]));
  assert.ok(Object.isFrozen(item.references));
});
