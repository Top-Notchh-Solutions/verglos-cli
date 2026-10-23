import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { triagePublicOssCorpus, triagePublicOssCorpusFile } from "./triage-public-oss-corpus.mjs";

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
  const reportBytes = readFileSync(reportPath);
  return {
    schema: "verglos.private.public-oss-corpus-verification.v1",
    verifiedAt: "2026-10-23T12:00:00.000Z",
    cliCommit: "78251d1ba47e505380b25ee146f1ca420f1e61a6",
    fixtureCount: 1,
    fixtures: [{ name: "fixture", commit: "abc1234", reportJson: { path: reportPath, bytes: reportBytes.byteLength, sha256: createHash("sha256").update(reportBytes).digest("hex") } }],
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

test("triage rejects a report whose verified digest or size changed", async () => {
  const { root, reportPath } = await fixtureReport();
  try {
    const source = input(reportPath);
    source.fixtures[0].reportJson.sha256 = "f".repeat(64);
    await assert.rejects(triagePublicOssCorpus(source), /integrity mismatch/u);

    const resized = input(reportPath);
    resized.fixtures[0].reportJson.bytes += 1;
    await assert.rejects(triagePublicOssCorpus(resized), /integrity mismatch/u);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("triage rejects a manifest fixture-count mismatch", async () => {
  const { root, reportPath } = await fixtureReport();
  try {
    await assert.rejects(triagePublicOssCorpus(input(reportPath, { fixtureCount: 2 })), /fixture count is invalid/u);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("triage file wrapper reads the manifest and writes a bounded report", async () => {
  const { root, reportPath } = await fixtureReport();
  const inputPath = join(root, "verification.json");
  const outputPath = join(root, "triage.json");
  try {
    await writeFile(inputPath, `${JSON.stringify(input(reportPath))}\n`, "utf8");
    const report = await triagePublicOssCorpusFile(inputPath, outputPath);
    assert.equal(report.schema, "verglos.private.public-oss-corpus-triage.v1");
    assert.equal(JSON.parse(readFileSync(outputPath, "utf8")).summary.findingCount, 2);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
