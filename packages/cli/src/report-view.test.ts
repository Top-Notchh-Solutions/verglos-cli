import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { prepareReportView } from "./report-view.js";

test("report view preparation validates JSON projections and escapes content", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-view-"));
  try { const path = join(root, "header.json"); await writeFile(path, JSON.stringify({ decision: "INCOMPLETE", subjectId: "<subject>", policy: { id: "p", version: "1.0.0", digest: "sha256:a" }, generatedAt: "2026-09-09T00:00:00Z", signerStatus: "unknown", limitations: ["missing"], nextAction: "review" })); const html = await prepareReportView(path); assert.match(html, /&lt;subject&gt;/); } finally { await rm(root, { recursive: true, force: true }); }
});

test("report view preparation rejects HTML, records, malformed, and oversized inputs", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-view-"));
  try { const html = join(root, "report.html"); await writeFile(html, "<html>"); await assert.rejects(() => prepareReportView(html), /only validated JSON/); const bad = join(root, "bad.json"); await writeFile(bad, "{}"); await assert.rejects(() => prepareReportView(bad), /supported release header/); } finally { await rm(root, { recursive: true, force: true }); }
});
