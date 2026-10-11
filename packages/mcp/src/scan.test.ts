import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
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
  await assert.rejects(() => scanProject({ projectRoot: process.cwd(), extra: true } as any), /unknown/);
});

test("scanProject preserves the scanner's exact coverage manifest", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-mcp-coverage-"));
  try {
    const result = await scanProject({ projectRoot: root, noProvenance: true });
    assert.equal(result.coverage?.status, "incomplete");
    assert.ok(result.coverage?.requestedDetectors.length);
    assert.ok(Array.isArray(result.coverage?.executedDetectors));
    assert.ok(result.coverage!.executedDetectors.length <= result.coverage!.requestedDetectors.length);
    assert.ok(result.coverage?.limitations.includes("provenance was explicitly skipped"));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
