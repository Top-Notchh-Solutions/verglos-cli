import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { serializeJsonReport, writeJsonReport } from "./json.js";

const result = {
  projectRoot: "/workspace/app", projectType: "node" as const, scannedAt: "2026-09-09T00:00:00.000Z", durationMs: 12,
  findings: [], score: { value: 100, riskLevel: "low" as const, counts: { critical: 0, high: 0, medium: 0, low: 0, info: 0 }, testFileFindings: { total: 0, included: false, note: "none" } }, unlocked: false,
};

test("legacy JSON report keeps the frozen top-level shape", () => {
  const report = serializeJsonReport(result);
  assert.deepEqual(Object.keys(report), ["schemaVersion", "projectRoot", "projectType", "scannedAt", "durationMs", "findings", "score", "unlocked"]);
  assert.equal(report.schemaVersion, "2.0.0");
  assert.equal("schemaId" in report, false);
});

test("JSON report output creates a directory and rejects symlink destinations", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-report-output-"));
  try {
    const output = join(root, "reports");
    const path = await writeJsonReport(result, root, output);
    assert.equal(path, join(output, "verglos-report.json"));
    assert.match(await readFile(path, "utf8"), /schemaVersion/);
    const target = join(root, "target");
    const link = join(root, "link");
    await mkdir(target);
    await symlink(target, link);
    await assert.rejects(() => writeJsonReport(result, root, link), /regular directory/);
  } finally { await rm(root, { recursive: true, force: true }); }
});
