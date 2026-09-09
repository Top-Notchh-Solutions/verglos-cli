import assert from "node:assert/strict";
import { test } from "node:test";
import { parseBaseline } from "./baseline.js";
import { BaselineComparisonError, compareToBaseline } from "./baseline-compare.js";

const subjectId = "urn:verglos:subject:artifact:sha256:" + "a".repeat(64);
const policyDigest = "sha256:" + "b".repeat(64);
const accepted = "sha256:" + "c".repeat(64);
const fresh = parseBaseline({ schemaId: "urn:verglos:schema:baseline", schemaVersion: "1.0.0", subjectId, policyId: "policy-free", policyVersion: "1.0.0", policyDigest, acceptedFingerprints: [accepted], createdAt: "2026-01-01T00:00:00Z" });

test("baseline comparison separates accepted debt from new observations", () => {
  const result = compareToBaseline({ baseline: fresh, currentFingerprints: [accepted, "sha256:" + "d".repeat(64), accepted], subjectId, policyDigest, evaluatedAt: "2026-09-01T00:00:00Z" });
  assert.equal(result.baselineStatus, "matched");
  assert.deepEqual(result.acceptedFingerprints, [accepted]);
  assert.deepEqual(result.newFingerprints, ["sha256:" + "d".repeat(64)]);
});
test("baseline comparison rejects malformed or oversized current evidence", () => { assert.throws(() => compareToBaseline({ baseline: fresh, currentFingerprints: ["sha256:bad"], subjectId, policyDigest, evaluatedAt: "2026-09-01T00:00:00Z" }), BaselineComparisonError); assert.throws(() => compareToBaseline({ baseline: fresh, currentFingerprints: [], subjectId, policyDigest, evaluatedAt: "not-a-date" }), BaselineComparisonError); });
