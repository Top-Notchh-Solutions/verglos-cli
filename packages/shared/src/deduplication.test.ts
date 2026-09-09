import assert from "node:assert/strict";
import { test } from "node:test";
import { deduplicateObservations } from "./deduplication.js";
const base = { subjectId: "urn:verglos:subject:artifact:sha256:" + "a".repeat(64), rule: "D1-1", evidenceClass: "native" as const };
test("deduplication collapses exact matches and retains fuzzy review", () => { const result = deduplicateObservations([{ ...base, location: "a:1", producerId: "native", payload: 1 }, { ...base, location: "a:1", producerId: "trivy", payload: 1 }, { ...base, location: "b:1", producerId: "import", payload: 1 }]); assert.equal(result.exact.length, 2); assert.equal(result.fuzzyReview.length, 2); });
