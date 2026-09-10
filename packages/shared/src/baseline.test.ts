import assert from "node:assert/strict";
import { test } from "node:test";
import { baselineDigest, classifyBaseline, parseBaseline } from "./baseline.js";

const subjectId = "urn:verglos:subject:artifact:sha256:" + "a".repeat(64);
const policyDigest = "sha256:" + "b".repeat(64);
const baseline = parseBaseline({ schemaId: "urn:verglos:schema:baseline", schemaVersion: "1.0.0", subjectId, policyId: "policy-free", policyVersion: "1.0.0", policyDigest, acceptedFingerprints: ["sha256:" + "c".repeat(64)], createdAt: "2026-01-01T00:00:00Z", expiresAt: "2026-02-01T00:00:00Z" });

test("baseline is subject/policy bound and classifies stale state", () => {
  assert.match(baselineDigest(baseline), /^sha256:[a-f0-9]{64}$/);
  assert.equal(classifyBaseline(baseline, subjectId, policyDigest, "2026-01-15T00:00:00Z"), "matched");
  assert.equal(classifyBaseline(baseline, subjectId, policyDigest, "2026-03-01T00:00:00Z"), "stale");
  assert.equal(classifyBaseline(baseline, subjectId, "sha256:" + "d".repeat(64), "2026-01-15T00:00:00Z"), "mismatched");
  assert.throws(() => parseBaseline({ ...baseline, acceptedFingerprints: [...baseline.acceptedFingerprints, baseline.acceptedFingerprints[0]!] }));
});
