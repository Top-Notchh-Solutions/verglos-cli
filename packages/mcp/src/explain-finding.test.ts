import assert from "node:assert/strict";
import test from "node:test";
import { explainFinding } from "./tools/explain-finding.js";

test("explain_finding rejects malformed direct calls", () => {
  assert.throws(() => explainFinding({} as any), /string rule/);
  assert.throws(() => explainFinding({ rule: "" }), /exceeds bounds/);
  assert.throws(() => explainFinding({ rule: "x".repeat(257) }), /exceeds bounds/);
});

test("explain_finding preserves unknown-rule result", () => {
  const result = explainFinding({ rule: "UNKNOWN-999" });
  assert.equal(result.found, false);
  assert.equal(result.rule, "UNKNOWN-999");
});

test("explain_finding can emit a bounded non-mutating remediation proposal", () => {
  const result = explainFinding({ rule: "D4-001", targetSubjectId: "urn:verglos:subject:artifact:sha256:" + "a".repeat(64), files: ["src/config.ts"] });
  assert.equal(result.proposal?.applied, false);
  assert.equal(result.proposal?.networkRequired, false);
  assert.deepEqual(result.proposal?.files, ["src/config.ts"]);
  assert.throws(() => explainFinding({ rule: "D4-001", targetSubjectId: "subject" }), /requires targetSubjectId and files together/);
  assert.throws(() => explainFinding({ rule: "D4-001", targetSubjectId: "subject", files: ["../secret"] }), /bounded relative paths/);
});
