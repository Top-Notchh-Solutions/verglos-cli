import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import test from "node:test";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { validateAuthorizedWorkflow, validateAuthorizedWorkflowFile } from "./validate-authorized-workflow.mjs";

const SHA = `sha256:${"a".repeat(64)}`;
const COMMIT = "2db1139337d60543fd59ec0b7e3130983d40e0a3";
const REPO = "https://github.com/example/authorized-repository";
const bytesDigest = (value) => `sha256:${createHash("sha256").update(value).digest("hex")}`;

function input(overrides = {}) {
  return {
    schema: "verglos.private.authorized-workflow.v1",
    consent: {
      subjectKind: "external-repository-owner",
      repositoryUrl: REPO,
      exactCommit: "b".repeat(40),
      ownerIdentityDigest: SHA,
      scopeDigest: SHA,
      permittedPaths: ["src", "README.md"],
      permittedCommands: ["verglos scan --json --quiet"],
      networkPolicy: { mode: "denied", destinations: [] },
      findingsMayBeStored: false,
      allowedEvidenceFields: ["digest", "count", "coverage", "exitCode"],
      approvedAt: "2026-10-22T10:00:00.000Z",
      founderApprovedAt: "2026-10-22T10:05:00.000Z",
      expiresAt: "2027-10-23T10:00:00.000Z",
      revocationChannel: "owner@example.invalid",
    },
    execution: {
      repositoryUrl: REPO,
      exactCommit: "b".repeat(40),
      completedAt: "2026-10-23T10:00:00.000Z",
      cliCommit: COMMIT,
      version: "2.0.0-alpha.1",
      cloneDigest: SHA,
      reportDigest: SHA,
      evidenceDigest: SHA,
      requestedPaths: ["src"],
      commands: ["verglos scan --json --quiet"],
      networkDestinations: [],
      sourceUpload: "none",
      retentionMode: "digest-only",
      outcome: "passed",
      exitCode: 0,
      coverage: "complete",
      limitations: [],
      findingCount: 3,
      filesWalked: 12,
      preflight: { secretScan: "passed", personalDataScan: "passed", scopeCheck: "passed", redactionCheck: "passed" },
      ownerSummaryDelivered: true,
    },
    deletion: { disposition: "deleted", status: "confirmed", recordedAt: "2026-10-23T10:30:00.000Z", evidenceDigest: SHA },
    ...overrides,
  };
}

test("authorized workflow accepts a bounded exact-commit run without claiming customer acceptance", () => {
  const report = validateAuthorizedWorkflow(input(), { now: "2026-10-23T12:00:00.000Z" });
  assert.equal(report.gate.workflowStatus, "accepted");
  assert.equal(report.gate.customerAcceptance, "not-claimed");
  assert.equal(report.summary.failureCount, 0);
  assert.equal(report.execution.sourceUpload, "none");
  assert.equal(report.execution.retentionMode, "digest-only");
});

test("authorized workflow reports failed execution and never upgrades it", () => {
  const source = input({ execution: { ...input().execution, outcome: "failed", exitCode: 3, coverage: "partial", limitations: ["provider unavailable"], ownerSummaryDelivered: false } });
  const report = validateAuthorizedWorkflow(source, { now: "2026-10-23T12:00:00.000Z" });
  assert.equal(report.gate.workflowStatus, "failed");
  assert.equal(report.summary.accepted, false);
  assert.ok(report.summary.failures.includes("workflow-outcome-failed"));
  assert.ok(report.summary.failures.includes("coverage-incomplete-or-limited"));
});

test("authorized workflow rejects scope, network, expiry, and raw retention violations", () => {
  const now = { now: "2026-10-23T12:00:00.000Z" };
  assert.throws(() => validateAuthorizedWorkflow(input({ execution: { ...input().execution, requestedPaths: ["private"] } }), now), /outside consent/u);
  assert.throws(() => validateAuthorizedWorkflow(input({ execution: { ...input().execution, networkDestinations: ["https://example.invalid"] } }), now), /outside denied/u);
  assert.throws(() => validateAuthorizedWorkflow(input({ execution: { ...input().execution, retentionMode: "raw" } }), now), /unsafe/u);
  assert.throws(() => validateAuthorizedWorkflow(input({ consent: { ...input().consent, expiresAt: "2026-10-23T09:00:00.000Z" } }), now), /consent window/u);
});

test("authorized workflow rejects secret-like records and mismatched commit", () => {
  const now = { now: "2026-10-23T12:00:00.000Z" };
  assert.throws(() => validateAuthorizedWorkflow(input({ execution: { ...input().execution, exactCommit: "f".repeat(40) } }), now), /not bound/u);
  assert.throws(() => validateAuthorizedWorkflow(input({ execution: { ...input().execution, commands: ["DATABASE_URL=secret"] } }), now), /secret-like/u);
});

test("authorized workflow rejects a malformed CLI version", () => {
  assert.throws(() => validateAuthorizedWorkflow(input({ execution: { ...input().execution, version: "latest" } }), { now: "2026-10-23T12:00:00.000Z" }), /version is invalid/u);
});

test("authorized workflow rejects non-string approval dates instead of coercing them", () => {
  assert.throws(() => validateAuthorizedWorkflow(input({ consent: { ...input().consent, approvedAt: null } }), { now: "2026-10-23T12:00:00.000Z" }), /owner approval time is invalid/u);
});

test("authorized workflow file binds execution and deletion evidence to actual bytes", async () => {
  const directory = await mkdtemp(join(tmpdir(), "verglos-workflow-bindings-"));
  const report = "workflow report\n";
  const evidence = "workflow evidence\n";
  const deletion = "deletion evidence\n";
  await writeFile(join(directory, "report.json"), report, "utf8");
  await writeFile(join(directory, "evidence.json"), evidence, "utf8");
  await writeFile(join(directory, "deletion.json"), deletion, "utf8");
  const source = input({
    execution: {
      ...input().execution,
      reportDigest: bytesDigest(report),
      evidenceDigest: bytesDigest(evidence),
      reportPath: "report.json",
      evidencePath: "evidence.json",
    },
    deletion: { ...input().deletion, evidenceDigest: bytesDigest(deletion), evidencePath: "deletion.json" },
  });
  const inputPath = join(directory, "input.json");
  const outputPath = join(directory, "output.json");
  await writeFile(inputPath, `${JSON.stringify(source)}\n`, "utf8");
  try {
    const result = await validateAuthorizedWorkflowFile(inputPath, outputPath, { now: "2026-10-23T12:00:00.000Z", evidenceRoot: directory, requireEvidenceFiles: true });
    assert.equal(result.summary.accepted, true);

    const mismatchInput = join(directory, "mismatch-input.json");
    const mismatchOutput = join(directory, "mismatch-output.json");
    await writeFile(mismatchInput, `${JSON.stringify({ ...source, execution: { ...source.execution, evidenceDigest: bytesDigest("wrong") } })}\n`, "utf8");
    await assert.rejects(
      validateAuthorizedWorkflowFile(mismatchInput, mismatchOutput, { now: "2026-10-23T12:00:00.000Z", evidenceRoot: directory, requireEvidenceFiles: true }),
      /workflow evidence digest does not match bytes/u,
    );

    const missingInput = join(directory, "missing-input.json");
    const missingOutput = join(directory, "missing-output.json");
    await writeFile(missingInput, `${JSON.stringify(input())}\n`, "utf8");
    await assert.rejects(
      validateAuthorizedWorkflowFile(missingInput, missingOutput, { now: "2026-10-23T12:00:00.000Z", evidenceRoot: directory, requireEvidenceFiles: true }),
      /workflow report path is required/u,
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
