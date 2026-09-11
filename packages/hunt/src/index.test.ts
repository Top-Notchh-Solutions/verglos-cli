import assert from "node:assert/strict";
import { test } from "node:test";
import { runHunt } from "./index.js";
import type { ScanResult } from "@verglos/shared";

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
