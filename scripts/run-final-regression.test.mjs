import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import test from "node:test";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { runFinalRegression, runFinalRegressionFile } from "./run-final-regression.mjs";

const SHA = `sha256:${"a".repeat(64)}`;
const bytesDigest = (value) => `sha256:${createHash("sha256").update(value).digest("hex")}`;
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

test("final regression file binds corpus reports and evidence to actual bytes", async () => {
  const directory = await mkdtemp(join(tmpdir(), "verglos-final-regression-bindings-"));
  const corpusRoot = join(directory, "corpus");
  await mkdir(corpusRoot, { recursive: true });
  const reportContents = "verified corpus report\n";
  const evidenceContents = "scenario evidence\n";
  await writeFile(join(corpusRoot, "report.json"), reportContents, "utf8");
  await writeFile(join(directory, "evidence.md"), evidenceContents, "utf8");
  const source = input({
    corpus: {
      ...input().corpus,
      fixtures: input().corpus.fixtures.map((fixture, index) => ({
        ...fixture,
        reportPath: "report.json",
        reportSha256: index === 0 ? bytesDigest(reportContents) : bytesDigest(reportContents),
      })),
    },
    runs: input().runs.map((entry) => ({
      ...entry,
      evidence: [{ path: "evidence.md", sha256: bytesDigest(evidenceContents) }],
    })),
  });
  const inputPath = join(directory, "input.json");
  const outputPath = join(directory, "output.json");
  await writeFile(inputPath, `${JSON.stringify(source)}\n`, "utf8");
  try {
    const missingReportInput = join(directory, "missing-report-input.json");
    const missingReportOutput = join(directory, "missing-report-output.json");
    await writeFile(missingReportInput, `${JSON.stringify(input())}\n`, "utf8");
    await assert.rejects(
      runFinalRegressionFile(missingReportInput, missingReportOutput, { corpusRoot, evidenceRoot: directory, requireCorpusReports: true }),
      /corpus report path is required/u,
    );
    const report = await runFinalRegressionFile(inputPath, outputPath, { corpusRoot, evidenceRoot: directory, requireCorpusReports: true });
    assert.equal(report.matrix.complete, true);

    const mismatchPath = join(directory, "mismatch.json");
    const mismatchOutput = join(directory, "mismatch-output.json");
    await writeFile(mismatchPath, `${JSON.stringify({ ...source, runs: source.runs.map((entry) => ({ ...entry, evidence: [{ path: "evidence.md", sha256: SHA }] })) })}\n`, "utf8");
    await assert.rejects(
      runFinalRegressionFile(mismatchPath, mismatchOutput, { corpusRoot, evidenceRoot: directory, requireCorpusReports: true }),
      /regression evidence digest does not match bytes/u,
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
