import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { triagePublicOssCorpus } from "./triage-public-oss-corpus.mjs";

async function fixtureReport(coverage = { status: "complete", limitations: [], filesWalked: 3 }) {
  const root = await mkdtemp(join(tmpdir(), "verglos-public-oss-triage-"));
  const reportPath = join(root, "report.json");
  await writeFile(reportPath, JSON.stringify({ coverage, findings: [
    { id: "finding-1", rule: "D1-001", severity: "high", category: "Injection", file: "secret/path.ts", snippet: "must not be copied" },
    { id: "finding-2", rule: "D1-001", severity: "medium", category: "Injection", file: "other.ts" },
  ] }));
  return { root, reportPath };
}

function input(reportPath, overrides = {}) {
  return {
    schema: "verglos.private.public-oss-corpus-verification.v1",
    verifiedAt: "2026-10-23T12:00:00.000Z",
    cliCommit: "78251d1ba47e505380b25ee146f1ca420f1e61a6",
    fixtureCount: 1,
    fixtures: [{ name: "fixture", commit: "abc1234", reportJson: { path: reportPath } }],
    ...overrides,
  };
}

test("triage emits bounded rule feedback and no raw finding fields", async () => {
  const { root, reportPath } = await fixtureReport();
  try {
    const report = await triagePublicOssCorpus(input(reportPath));
    assert.equal(report.summary.findingCount, 2);
    assert.equal(report.summary.ruleCount, 1);
    assert.equal(report.summary.coverageGapCount, 0);
    assert.equal(report.gate.adjudicationStatus, "open");
    assert.equal(report.fixtures[0].findings[0].customerClaim, false);
    assert.equal("snippet" in report.fixtures[0].findings[0], false);
    assert.equal("file" in report.fixtures[0].findings[0], false);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("triage records incomplete coverage as a coverage gap", async () => {
  const { root, reportPath } = await fixtureReport({ status: "partial", limitations: ["tool timeout"], filesWalked: 1 });
  try {
    const report = await triagePublicOssCorpus(input(reportPath));
    assert.equal(report.summary.coverageGapCount, 1);
    assert.equal(report.fixtures[0].coverage.triage, "coverage-gap-requires-review");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("triage rejects an invalid verification manifest", async () => {
  await assert.rejects(triagePublicOssCorpus({ schema: "wrong", fixtures: [] }), /unsupported public-corpus verification schema/u);
});
