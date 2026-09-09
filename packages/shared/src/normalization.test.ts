import assert from "node:assert/strict";
import { test } from "node:test";
import { normalizeConfidence, normalizeSeverity } from "./normalization.js";
test("normalization preserves originals and mapping version", () => { assert.deepEqual(normalizeSeverity("Severe"), { original: "Severe", normalized: "critical", mappingVersion: "v1", uncertain: false }); assert.deepEqual(normalizeConfidence(0.8).normalized, "high"); });
test("normalization exposes unknown severities", () => { const result = normalizeSeverity("vendor-future"); assert.equal(result.normalized, "unknown"); assert.equal(result.uncertain, true); });
test("normalization rejects invalid numeric confidence", () => { assert.throws(() => normalizeConfidence(Number.NaN), /finite/); assert.throws(() => normalizeConfidence(2), /between 0 and 1/); });
