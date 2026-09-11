import assert from "node:assert/strict";
import { test } from "node:test";
import { runHunt } from "./index.js";
import { createApprovalReceipt, parseHuntRecipe, type ScanResult } from "@verglos/shared";

const report = {
  projectRoot: "/tmp/project",
  projectType: "node",
  scannedAt: "2026-01-01T00:00:00.000Z",
  durationMs: 1,
  findings: [
    { id: "critical-1", severity: "critical", title: "critical", description: "x", detector: "deep-auth", confidence: "certain", category: "auth" },
    { id: "medium-1", severity: "medium", title: "medium", description: "x", detector: "deep-auth", confidence: "certain", category: "auth" },
  ],
  score: { value: 10, riskLevel: "critical", counts: { critical: 1, high: 0, medium: 1, low: 0, info: 0 }, testFileFindings: { total: 0, included: false, note: "none" } },
  unlocked: true,
} as unknown as ScanResult;

const subjectId = `urn:verglos:subject:artifact:sha256:${"a".repeat(64)}`;
const execution = {
  recipe: parseHuntRecipe({ schemaId: "urn:verglos:schema:hunt-recipe", schemaVersion: "1.0.0", recipeId: "hunt-runner", ruleId: "d1-1", targetSubjectId: subjectId, imageDigest: { algorithm: "sha256", value: "b".repeat(64) }, command: ["/probe"], assertions: ["exit code is 0"], isolation: "container", limits: { timeoutMs: 1000, memoryMb: 256, outputBytes: 10000 }, cleanup: "always", network: { mode: "denied", destinations: [], reason: "fixture" }, redaction: "required", signature: { status: "verified", signer: "verglos-release" } }),
  trust: { signers: ["verglos-release"] },
  approval: createApprovalReceipt({ requestId: "523e4567-e89b-12d3-a456-426614174000", action: "execute", actor: "human", target: subjectId, files: [], network: [], policyEffect: "hunt", requestedAt: "2026-01-01T00:00:00Z", expiresAt: "2099-01-01T00:00:00Z" }, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" }),
  ruleId: "d1-1", subjectId, observationId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", at: "2026-01-01T00:02:00Z",
};

test("Hunt dry run filters eligible severities and never executes", async () => {
  const result = await runHunt(report, { dryRun: true });
  assert.deepEqual(result.outcomes.map((outcome) => outcome.findingId), ["critical-1"]);
  assert.equal(result.outcomes[0]?.verdict, "not_attemptable");
  assert.match(result.outcomes[0]?.reason ?? "", /no probe|dry run/);
  assert.equal(result.outcomes[0]?.durationMs, 0);
});

test("Hunt returns an honest non-execution result without an adapter", async () => {
  const result = await runHunt(report, { severity: ["medium"], findingId: "medium-1", sandbox: "auto" });
  assert.equal(result.outcomes.length, 1);
  assert.equal(result.outcomes[0]?.verdict, "not_attemptable");
  assert.match(result.outcomes[0]?.reason ?? "", /not attempted/);
});

test("Hunt rejects unbounded duration and project-root inputs", async () => {
  await assert.rejects(() => runHunt(report, { maxDurationMs: 0 }), /max duration/);
  await assert.rejects(() => runHunt(report, { projectRoot: "x".repeat(4097) }), /project root/);
});

test("Hunt executes only through an explicitly injected adapter and always cleans up", async () => {
  const calls: string[] = [];
  const adapter = {
    id: "test-probe",
    async prepare() { calls.push("prepare"); },
    async execute(input: { finding: typeof report.findings[number]; projectRoot: string; timeoutMs: number; binding: unknown }) {
      calls.push(`execute:${input.finding.id}`);
      assert.equal(input.projectRoot, report.projectRoot);
      assert.ok(input.timeoutMs > 0);
      assert.ok(input.binding);
      return { findingId: input.finding.id, verdict: "false" as const, reason: "fixture probe completed", durationMs: 1 };
    },
    async cleanup() { calls.push("cleanup"); },
  };
  const result = await runHunt(report, { adapter, sandbox: "test-probe", execution });
  assert.deepEqual(calls, ["prepare", "execute:critical-1", "cleanup"]);
  assert.equal(result.outcomes[0]?.verdict, "false");
  assert.equal(result.sandbox, "test-probe");
});

test("Hunt refuses an adapter during dry run or when sandbox identity mismatches", async () => {
  const adapter = { id: "test-probe", async prepare() {}, async execute() { return { findingId: "critical-1", verdict: "false" as const, reason: "fixture", durationMs: 1 }; }, async cleanup() {} };
  await assert.rejects(() => runHunt(report, { adapter, dryRun: true }), /dry run/);
  await assert.rejects(() => runHunt(report, { adapter, sandbox: "docker" }), /does not match/);
});

test("Hunt cleans up when adapter preparation fails", async () => {
  let cleaned = false;
  const adapter = {
    id: "test-probe",
    async prepare() { throw new Error("fixture preparation failure"); },
    async execute() { throw new Error("must not execute"); },
    async cleanup() { cleaned = true; },
  };
  await assert.rejects(() => runHunt(report, { adapter, execution }), /fixture preparation failure/);
  assert.equal(cleaned, true);
});

test("Hunt refuses adapter execution without an exact trust and approval binding", async () => {
  const adapter = { id: "test-probe", async prepare() {}, async execute() { throw new Error("must not execute"); }, async cleanup() {} };
  await assert.rejects(() => runHunt(report, { adapter }), /execution requires/);
});

test("Hunt rejects an adapter result that widens the finding identity", async () => {
  const adapter = {
    id: "test-probe",
    async prepare() {},
    async execute() { return { findingId: "different-finding", verdict: "false" as const, reason: "fixture", durationMs: 1 }; },
    async cleanup() {},
  };
  const result = await runHunt(report, { adapter, execution });
  assert.equal(result.outcomes[0]?.findingId, "critical-1");
  assert.equal(result.outcomes[0]?.verdict, "not_attemptable");
  assert.match(result.outcomes[0]?.reason ?? "", /mismatched finding/);
});

test("Hunt preserves the report finding instead of adapter-supplied mutable evidence", async () => {
  const adapter = {
    id: "test-probe",
    async prepare() {},
    async execute() { return { findingId: "critical-1", verdict: "false" as const, finding: { ...(report.findings[0] as unknown as Record<string, unknown>), title: "tampered", id: "critical-1" } as never, reason: "fixture", durationMs: 1 }; },
    async cleanup() {},
  };
  const result = await runHunt(report, { adapter, execution });
  assert.equal(result.outcomes[0]?.finding?.title, "critical");
});

test("Hunt rejects malformed adapter outcome fields", async () => {
  const adapter = {
    id: "test-probe",
    async prepare() {},
    async execute() { return { findingId: "critical-1", verdict: "unexpected", reason: "fixture", durationMs: 1 } as never; },
    async cleanup() {},
  };
  const result = await runHunt(report, { adapter, execution });
  assert.equal(result.outcomes[0]?.verdict, "not_attemptable");
  assert.match(result.outcomes[0]?.reason ?? "", /mismatched finding/);
});

test("Hunt rejects unbounded adapter reasons and durations", async () => {
  const adapter = {
    id: "test-probe",
    async prepare() {},
    async execute() { return { findingId: "critical-1", verdict: "false" as const, reason: "x".repeat(4097), durationMs: -1 }; },
    async cleanup() {},
  };
  const result = await runHunt(report, { adapter, execution });
  assert.equal(result.outcomes[0]?.verdict, "not_attemptable");
});
