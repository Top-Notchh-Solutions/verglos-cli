import assert from "node:assert/strict";
import { test } from "node:test";
import { renderHtmlReport } from "./html.js";

test("HTML report renders escaped scan coverage and limitations", () => {
  const html = renderHtmlReport({
    projectRoot: "/workspace/app", projectType: "node", scannedAt: "2026-09-11T00:00:00.000Z", durationMs: 4,
    findings: [], score: { value: 100, riskLevel: "low", counts: { critical: 0, high: 0, medium: 0, low: 0, info: 0 }, testFileFindings: { total: 0, included: false, note: "none" } }, unlocked: false,
    coverage: { status: "incomplete", filesWalked: 2, requestedDetectors: ["secrets"], executedDetectors: ["secrets"], limitations: ["unsafe <input>"] },
  });
  assert.match(html, /Scan coverage/);
  assert.match(html, /2 files walked/);
  assert.match(html, /unsafe &lt;input&gt;/);
  assert.doesNotMatch(html, /unsafe <input>/);
});
