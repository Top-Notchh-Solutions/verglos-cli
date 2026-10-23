import assert from "node:assert/strict";
import test from "node:test";
import { runFinalRegression } from "./run-final-regression.mjs";

const SHA = `sha256:${"a".repeat(64)}`;
const CLI = "2db1139337d60543fd59ec0b7e3130983d40e0a3";
const WEB = "16ceddc9855e75e04f10ddd276fae16c7ef09e01";

function measurement(overrides = {}) {
  return { status: "passed", exitCode: 0, coverage: "complete", filesWalked: 100, findingCount: 4, durationMs: 100, limitations: [], ...overrides };
}

function input(overrides = {}) {
  const scenarios = [
    ["fixture-a", "free", "owner", "single"],
    ["fixture-a", "pro", "admin", "single"],
    ["fixture-a", "team", "member", "multi"],
    ["fixture-b", "studio", "approver", "multi"],
    ["fixture-b", "enterprise", "viewer", "multi"],
  ];
  return {
    schema: "verglos.private.final-regression.v1",
    candidate: { cliCommit: CLI, webCommit: WEB, version: "2.0.0-alpha.1" },
    corpus: {
      verificationSchema: "verglos.private.public-oss-corpus-verification.v1",
      manifestSha256: SHA,
      fixtureCount: 2,
      fixtures: [
        { name: "fixture-a", exactCommit: "a".repeat(40), reportSha256: SHA, architectureShapes: ["small", "multi-user"] },
        { name: "fixture-b", exactCommit: "b".repeat(40), reportSha256: SHA, architectureShapes: ["multi-tenant-team", "enterprise-like"] },
      ],
    },
    thresholds: { maxDurationIncreasePercent: 25 },
    gates: { truthRegistry: "open", riskReview: "open", heldOutCorrection: "open", providerLifecycle: "open", finalRelease: "open" },
    decision: "no-go",
    runs: scenarios.map(([fixture, plan, userRole, tenantMode]) => ({
      fixture,
      sourceCommit: CLI,
      webCommit: WEB,
      scenario: { plan, userRole, tenantMode },
      baseline: measurement(),
      candidate: measurement(),
      evidence: [{ path: `docs/shipping/evidence/regression-${plan}-${userRole}-${tenantMode}.json`, sha256: SHA }],
    })),
    ...overrides,
  };
}

test("final regression reports complete matrix and fails closed on open gates", () => {
  const report = runFinalRegression(input(), { now: "2026-10-23T12:00:00.000Z" });
  assert.equal(report.summary.runCount, 5);
  assert.equal(report.matrix.complete, true);
  assert.deepEqual(report.matrix.missingPlans, []);
  assert.deepEqual(report.matrix.missingUserRoles, []);
  assert.deepEqual(report.matrix.missingTenantModes, []);
  assert.equal(report.release.recommendation, "no-go");
  assert.equal(report.release.goEligible, false);
  assert.equal(report.summary.openGateCount, 5);
  assert.equal(report.generatedAt, "2026-10-23T12:00:00.000Z");
  assert.equal("sourcePath" in report.runs[0], false);
});

test("final regression produces a go recommendation only for clean evidence and passed gates", () => {
  const source = input({
    decision: "go",
    gates: { truthRegistry: "passed", riskReview: "passed", heldOutCorrection: "passed", providerLifecycle: "passed", finalRelease: "passed" },
  });
  const report = runFinalRegression(source);
  assert.equal(report.release.recommendation, "go");
  assert.equal(report.release.goEligible, true);
  assert.equal(report.release.status, "ready-for-signoff");
});

test("final regression rejects a malformed candidate version", () => {
  assert.throws(
    () => runFinalRegression(input({ candidate: { ...input().candidate, version: "candidate-latest" } })),
    /candidate version is invalid/u,
  );
});

test("final regression records performance and finding deltas without hiding them", () => {
  const source = input({
    runs: input().runs.map((run, index) => index === 0
      ? { ...run, candidate: measurement({ durationMs: 140, findingCount: 6 }) }
      : run),
  });
  const report = runFinalRegression(source);
  assert.equal(report.summary.performanceRegressionCount, 1);
  assert.equal(report.summary.findingRegressionCount, 1);
  assert.equal(report.runs[0].findingDelta, 2);
  assert.equal(report.runs[0].performanceDeltaPercent, 40);
  assert.equal(report.release.recommendation, "no-go");
});

test("final regression rejects unsafe or incomplete inputs", () => {
  const incomplete = runFinalRegression(input({ runs: input().runs.slice(0, 4) }));
  assert.equal(incomplete.matrix.complete, false);
  assert.deepEqual(incomplete.matrix.missingPlans, ["enterprise"]);
  assert.deepEqual(incomplete.matrix.missingUserRoles, ["viewer"]);
  assert.throws(() => runFinalRegression(input({ runs: input().runs.map((run, index) => index === 0 ? { ...run, sourceCommit: "f".repeat(40) } : run) })), /not bound/u);
  assert.throws(() => runFinalRegression(input({ runs: input().runs.map((run, index) => index === 0 ? { ...run, webCommit: "f".repeat(40) } : run) })), /not bound to candidate Web commit/u);
  assert.throws(() => runFinalRegression(input({ runs: input().runs.map((run, index) => index === 0 ? { ...run, evidence: [{ path: "../secret.json", sha256: SHA }] } : run) })), /evidence path/u);
  assert.throws(() => runFinalRegression(input({ decision: "go", gates: { truthRegistry: "open", riskReview: "open", heldOutCorrection: "open", providerLifecycle: "open", finalRelease: "open" } })), /GO cannot/u);
});
