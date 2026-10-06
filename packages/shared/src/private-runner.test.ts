import assert from "node:assert/strict";
import { test } from "node:test";
import { admitPrivateRunnerJob, privateRunnerResultDigest, projectPrivateRunnerResult, type PrivateRunnerJob } from "./private-runner.js";

const job: PrivateRunnerJob = {
  protocolVersion: "1.0.0", jobId: "job_1", tenantId: "org_acme", runnerId: "runner_1", recipeId: "recipe_cve", targetSubjectId: "subject_app", targetDigest: `sha256:${"a".repeat(64)}`,
  issuedAt: "2026-10-06T00:00:00.000Z", expiresAt: "2026-10-06T00:10:00.000Z", nonce: "nonce_123456789012", network: { mode: "denied", destinations: [] }, limits: { timeoutMs: 1_000, outputBytes: 10_000, memoryMb: 256, processes: 8 }, signature: "c2lnbmF0dXJl",
};

test("private runner admits a scoped short-lived outbound-only job", () => {
  const result = admitPrivateRunnerJob({ job, tenantId: "org_acme", runnerId: "runner_1", now: "2026-10-06T00:01:00.000Z", allowedTargets: new Set(["subject_app"]) });
  assert.equal(result.admitted, true);
});

test("private runner refuses tenant, replay, expiry, target, and network widening", () => {
  const reason = (value: ReturnType<typeof admitPrivateRunnerJob>) => value.admitted ? "admitted" : value.reason;
  assert.equal(reason(admitPrivateRunnerJob({ job, tenantId: "org_other", runnerId: "runner_1", now: "2026-10-06T00:01:00.000Z", allowedTargets: new Set(["subject_app"]) })), "tenant_mismatch");
  assert.equal(reason(admitPrivateRunnerJob({ job, tenantId: "org_acme", runnerId: "runner_1", now: "2026-10-06T00:01:00.000Z", replayedJobIds: new Set(["job_1"]), allowedTargets: new Set(["subject_app"]) })), "job_replayed");
  assert.equal(reason(admitPrivateRunnerJob({ job: { ...job, expiresAt: "2026-10-05T00:00:00.000Z" }, tenantId: "org_acme", runnerId: "runner_1", now: "2026-10-06T00:01:00.000Z", allowedTargets: new Set(["subject_app"]) })), "job_expired");
  assert.equal(reason(admitPrivateRunnerJob({ job, tenantId: "org_acme", runnerId: "runner_1", now: "2026-10-06T00:01:00.000Z", allowedTargets: new Set(["subject_other"]) })), "target_not_allowlisted");
  assert.equal(reason(admitPrivateRunnerJob({ job: { ...job, network: { mode: "denied", destinations: ["https://example.test"] } }, tenantId: "org_acme", runnerId: "runner_1", now: "2026-10-06T00:01:00.000Z", allowedTargets: new Set(["subject_app"]) })), "network_not_bounded");
});

test("private runner result is least-evidence and deterministically digestible", () => {
  const result = projectPrivateRunnerResult({ jobId: "job_1", tenantId: "org_acme", runnerId: "runner_1", state: "completed", startedAt: "2026-10-06T00:01:00.000Z", finishedAt: "2026-10-06T00:01:01.000Z", evidenceDigest: `sha256:${"b".repeat(64)}`, findingCount: 2, coverage: "complete" });
  assert.equal(Object.prototype.hasOwnProperty.call(result, "rawOutput"), false);
  assert.match(privateRunnerResultDigest(result), /^sha256:[a-f0-9]{64}$/u);
  assert.throws(() => projectPrivateRunnerResult({ ...result, evidenceDigest: null }), /requires evidence/);
});
