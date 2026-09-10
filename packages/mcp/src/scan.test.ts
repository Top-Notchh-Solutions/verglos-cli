import assert from "node:assert/strict";
import test from "node:test";
import { scanProject, sortFindings } from "./tools/scan.js";

test("scan findings use deterministic severity and location ordering", () => {
  const findings = [
    { severity: "low", rule: "D4-001", file: "z.ts", line: 1 },
    { severity: "high", rule: "AI-002", file: "b.ts", line: 4 },
    { severity: "high", rule: "AI-001", file: "z.ts", line: 2 },
  ] as any;
  assert.deepEqual(sortFindings(findings).map((f: any) => f.rule), ["AI-001", "AI-002", "D4-001"]);
});

test("scanProject enforces absolute root and bounded options before execution", async () => {
  await assert.rejects(() => scanProject({ projectRoot: "relative" }), /absolute path/);
  await assert.rejects(() => scanProject({ projectRoot: process.cwd(), limit: 1001 }), /0 to 1000/);
  await assert.rejects(() => scanProject({ projectRoot: process.cwd(), noProvenance: "yes" as any }), /boolean/);
});
