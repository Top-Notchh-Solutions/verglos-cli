import assert from "node:assert/strict";
import test from "node:test";
import { reconcileReleaseGates } from "./reconcile-release-gates.mjs";

const digest = (value) => `sha256:${value.repeat(64).slice(0, 64)}`;

function run(overrides = {}) {
  return {
    schema: "verglos.private.release-gate-reconciliation.v1",
    completedAt: "2026-10-23T12:00:00.000Z",
    candidate: { cliCommit: "74c9b4ff79c4b8f80e022c8f25f1d321357f9cf5", webCommit: "16ceddc9855e75e04f10ddd276fae16c7ef09e01", version: "2.0.0-alpha.1" },
    rows: [
      { id: "FINAL-WEB-007", state: "partial", evidence: [{ path: "docs/shipping/evidence/web.md", sha256: digest("a") }] },
      { id: "FINAL-WEB-008", state: "planned", evidence: [] },
    ],
    gates: { providerLifecycle: "open", customerConsent: "open", independentReview: "open", authenticatedBrowser: "passed", fieldCwv: "open", accountDeletion: "open", finalRelease: "open" },
    corrections: [{ id: "FINAL-WEB-007", action: "obtain hosted and field evidence" }],
    rollback: [],
    decision: { result: "no-go", status: "open" },
    ...overrides,
  };
}

test("reconciler reports open gates and never upgrades partial/planned rows", () => {
  const report = reconcileReleaseGates(run());
  assert.equal(report.schema, "verglos.private.release-gate-reconciliation.v1");
  assert.equal(report.summary.rowCount, 2);
  assert.deepEqual(report.partialRows, ["FINAL-WEB-007"]);
  assert.deepEqual(report.plannedRows, ["FINAL-WEB-008"]);
  assert.equal(report.decision.recommendation, "no-go");
  assert.equal(report.gate.acceptanceStatus, "open");
});

test("recorded GO fails closed while any gate or correction remains", () => {
  assert.throws(() => reconcileReleaseGates(run({ decision: { result: "go", status: "recorded" } })), /recorded GO is not eligible/u);
});

test("a fully evidenced candidate can be marked ready for final sign-off", () => {
  const report = reconcileReleaseGates(run({
    rows: [{ id: "FINAL-WEB-007", state: "shipped", evidence: [{ path: "docs/shipping/evidence/web.md", sha256: digest("b") }] }],
    gates: { providerLifecycle: "passed", customerConsent: "passed", independentReview: "passed", authenticatedBrowser: "passed", fieldCwv: "passed", accountDeletion: "passed", finalRelease: "passed" },
    corrections: [],
    rollback: [],
    decision: { result: "no-go", status: "open" },
  }));
  assert.equal(report.decision.goEligible, true);
  assert.equal(report.decision.recommendation, "go");
  assert.equal(report.gate.acceptanceStatus, "ready-for-signoff");
});

test("unsafe evidence references and unsupported shipped rows are rejected", () => {
  assert.throws(() => reconcileReleaseGates(run({ rows: [{ id: "FINAL-WEB-007", state: "shipped", evidence: [] }] })), /shipped row has no evidence/u);
  assert.throws(() => reconcileReleaseGates(run({ rows: [{ id: "FINAL-WEB-007", state: "partial", evidence: [{ path: "../secret.md", sha256: digest("c") }] }] })), /unsafe or duplicated/u);
});
