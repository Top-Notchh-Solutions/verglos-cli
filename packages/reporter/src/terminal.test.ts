import assert from "node:assert/strict";
import { test } from "node:test";
import { printTerminalSummary } from "./terminal.js";

test("terminal summary renders bounded coverage and sanitizes limitations", () => {
  const lines: string[] = [];
  const original = console.log;
  console.log = (...args: unknown[]) => lines.push(args.join(" "));
  try {
    printTerminalSummary({
      projectRoot: "/workspace/app", projectType: "node", scannedAt: "2026-09-11T00:00:00.000Z", durationMs: 4,
      findings: [], score: { value: 100, riskLevel: "low", counts: { critical: 0, high: 0, medium: 0, low: 0, info: 0 }, testFileFindings: { total: 0, included: false, note: "none" } }, unlocked: false,
      coverage: { status: "incomplete", filesWalked: 2, requestedDetectors: ["secrets"], executedDetectors: ["secrets"], limitations: ["unsafe\u001b[31m input"] },
    });
  } finally { console.log = original; }
  const output = lines.join("\n");
  assert.match(output, /Coverage\s+incomplete/);
  assert.match(output, /2 files/);
  assert.match(output, /unsafe\s+\[31m input/);
  assert.doesNotMatch(output, /\u001b/);
});
