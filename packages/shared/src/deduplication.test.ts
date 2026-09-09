import assert from "node:assert/strict";
import { test } from "node:test";
import { DeduplicationLimitError, deduplicateObservations } from "./deduplication.js";
const base = { subjectId: "urn:verglos:subject:artifact:sha256:" + "a".repeat(64), rule: "D1-1", evidenceClass: "native" as const };
test("deduplication collapses exact matches and retains fuzzy review", () => { const result = deduplicateObservations([{ ...base, location: "a:1", producerId: "native", payload: 1 }, { ...base, location: "a:1", producerId: "trivy", payload: 1 }, { ...base, location: "b:1", producerId: "import", payload: 1 }]); assert.equal(result.exact.length, 2); assert.equal(result.fuzzyReview.length, 2); });
test("deduplication output is permutation-independent and bounded", () => { const items = [{ ...base, producerId: "b", payload: { y: 2 } }, { ...base, producerId: "a", payload: { x: 1 } }]; assert.deepEqual(deduplicateObservations(items).exact, deduplicateObservations([...items].reverse()).exact); assert.throws(() => deduplicateObservations(Array.from({ length: 10_001 }, (_, index) => ({ ...base, producerId: `p${index}`, payload: index }))), DeduplicationLimitError); });
