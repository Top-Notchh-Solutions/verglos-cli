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
