import assert from "node:assert/strict";
import { test } from "node:test";
import { correlateObservations } from "./correlation.js";
const base = { subjectId: "urn:verglos:subject:artifact:sha256:" + "a".repeat(64), location: "src/a.ts:1", rule: "D1-1", evidenceClass: "native" as const };
test("correlation retains producers and disagreement", () => { const groups = correlateObservations([{ ...base, producerId: "native", payload: { severity: "high" } }, { ...base, producerId: "trivy", payload: { severity: "medium" } }]); assert.equal(groups.length, 1); assert.deepEqual(groups[0]?.producerIds, ["native", "trivy"]); assert.equal(groups[0]?.disagreement, true); });
test("correlation compares payloads canonically", () => { const groups = correlateObservations([{ ...base, producerId: "a", payload: { x: 1, y: 2 } }, { ...base, producerId: "b", payload: { y: 2, x: 1 } }]); assert.equal(groups[0]?.disagreement, false); });
