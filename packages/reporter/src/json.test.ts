import assert from "node:assert/strict";
import { test } from "node:test";
import { serializeJsonReport } from "./json.js";

test("legacy JSON report keeps the frozen top-level shape", () => {
  const report = serializeJsonReport({
    projectRoot: "/workspace/app", projectType: "node", scannedAt: "2026-09-09T00:00:00.000Z", durationMs: 12,
    findings: [], score: { value: 100, riskLevel: "low", counts: { critical: 0, high: 0, medium: 0, low: 0, info: 0 }, testFileFindings: { total: 0, included: false, note: "none" } }, unlocked: false,
  });
  assert.deepEqual(Object.keys(report), ["schemaVersion", "projectRoot", "projectType", "scannedAt", "durationMs", "findings", "score", "unlocked"]);
  assert.equal(report.schemaVersion, "2.0.0");
  assert.equal("schemaId" in report, false);
});
