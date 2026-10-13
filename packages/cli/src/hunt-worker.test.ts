import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { createApprovalReceipt, createSubjectId, planHuntAttackHypothesis, parseHuntRecipe, type HuntTargetManifest, type ScanResult } from "@verglos/shared";
import { createTestHuntTrustStore, TEST_HUNT_TRUST_KEY_ID } from "../../shared/src/hunt-trust-test-support.js";
import type { HuntRuntimeLoader } from "./hunt-runtime.js";
import { executeHuntWorker } from "./hunt-worker.js";

const subjectId = createSubjectId({ kind: "artifact", digest: { algorithm: "sha256", value: "f".repeat(64) }, size: 10, mediaType: "application/octet-stream" });
const at = new Date().toISOString();
const localHuntRuntime: HuntRuntimeLoader = () => import("../../hunt/dist/index.js");
const manifest: HuntTargetManifest = {
  schemaId: "urn:verglos:schema:hunt-target-manifest",
  schemaVersion: "1.0.0",
  targetSubjectId: subjectId,
  frameworks: ["express"],
  entrypoints: [{ path: "app.js", kind: "source" }],
  routes: [],
  apis: [],
  dependencyBoundaries: ["express"],
  agentMcpTools: [],
  candidateSinks: [],
  coverage: { status: "complete", filesInspected: 1, bytesInspected: 10, limitations: [] },
};
const finding = { id: "finding-worker", ruleId: "hunt.a1.utf8-contains", location: "app.js", line: 1, severity: "high" as const };
const hypothesis = planHuntAttackHypothesis({ manifest, finding, playbooks: [{
  recipeId: "a1-utf8-contains",
  ruleId: "hunt.a1.utf8-contains",
  adapter: "restricted-process",
  command: ["verglos-probe", "utf8-contains"],
  assertions: ["probe result is true"],
  requiredInputs: ["needle", "value"],
  fixtures: [
    { name: "positive", expected: "confirmed" },
    { name: "negative", expected: "not-reproduced" },
    { name: "timeout", expected: "inconclusive" },
    { name: "adapter-failure", expected: "environment-error" },
  ],
}] });
const recipe = parseHuntRecipe({
  schemaId: "urn:verglos:schema:hunt-recipe",
  schemaVersion: "1.0.0",
  recipeId: "a1-utf8-contains",
  ruleId: finding.ruleId,
  targetSubjectId: subjectId,
  imageDigest: { algorithm: "sha256", value: "a".repeat(64) },
  command: ["verglos-probe", "utf8-contains"],
  assertions: ["probe result is true"],
  inputs: { needle: "unsafe", value: "fixture contains unsafe" },
  isolation: "restricted-process",
  limits: { timeoutMs: 2_000, cpuMs: 1_500, memoryMb: 64, diskMb: 16, outputBytes: 1_024, processes: 1, maxNetworkRequests: 0 },
  cleanup: "always",
  network: { mode: "denied", destinations: [], reason: "A1 pure probe" },
  redaction: "required",
  signature: { status: "verified", signer: TEST_HUNT_TRUST_KEY_ID },
});
const approval = createApprovalReceipt({ requestId: "823e4567-e89b-12d3-a456-426614174000", action: "execute", actor: "human", target: subjectId, files: [], network: [], policyEffect: "hunt", requestedAt: "2026-01-01T00:00:00Z", expiresAt: "2099-01-01T00:00:00Z" }, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
const report: ScanResult = {
  projectRoot: "/tmp/fixture-target",
  projectType: "node",
  scannedAt: at,
  durationMs: 1,
  findings: [{ id: finding.id, detector: "injection", rule: finding.ruleId, severity: finding.severity, file: finding.location, line: finding.line, title: "fixture", description: "fixture", confidence: "high", category: "injection" }],
  score: { value: 10, riskLevel: "high", counts: { critical: 0, high: 1, medium: 0, low: 0, info: 0 }, testFileFindings: { total: 0, included: false, note: "fixture" } },
  unlocked: true,
};

async function writeInputs(root: string, reportValue: ScanResult = report): Promise<{ hypothesisPath: string; reportPath: string; recipePath: string; trustStorePath: string; approvalPath: string }> {
  const paths = {
    hypothesisPath: join(root, "hypothesis.json"),
    reportPath: join(root, "report.json"),
    recipePath: join(root, "recipe.json"),
    trustStorePath: join(root, "trust-store.json"),
    approvalPath: join(root, "approval.json"),
  };
  await writeFile(paths.hypothesisPath, JSON.stringify(hypothesis));
  await writeFile(paths.reportPath, JSON.stringify(reportValue));
  await writeFile(paths.recipePath, JSON.stringify(recipe));
  await writeFile(paths.trustStorePath, JSON.stringify(createTestHuntTrustStore(recipe, { at })));
  await writeFile(paths.approvalPath, JSON.stringify(approval));
  return paths;
}

test("hunt worker executes a supported hypothesis and emits only bounded candidate evidence", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-cli-hunt-worker-"));
  const logs: string[] = [];
  const originalLog = console.log;
  try {
    const paths = await writeInputs(root);
    console.log = (line?: unknown) => logs.push(String(line));
    assert.equal(await executeHuntWorker({ ...paths, observationId: "urn:uuid:92345678-1234-4123-8123-123456789abc", json: true, quiet: true, runtimeLoader: localHuntRuntime }), 1);
    const output = JSON.parse(logs[0]!) as Record<string, unknown>;
    assert.equal(output.status, "completed");
    assert.equal(output.executes, true);
    assert.equal((output.proof as Record<string, unknown>).status, "not-run");
    assert.equal((output.outcome as Record<string, unknown>).canonicalVerdict, "confirmed");
    assert.doesNotMatch(JSON.stringify(output), /fixture contains unsafe|tmp\/fixture-target/u);
  } finally {
    console.log = originalLog;
    await rm(root, { recursive: true, force: true });
  }
});

test("hunt worker fails closed on a report that does not contain the planned finding", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-cli-hunt-worker-denied-"));
  const logs: string[] = [];
  const originalLog = console.log;
  let loaded = false;
  try {
    const paths = await writeInputs(root, { ...report, findings: [] });
    console.log = (line?: unknown) => logs.push(String(line));
    const runtimeLoader: HuntRuntimeLoader = async () => { loaded = true; return import("../../hunt/dist/index.js"); };
    assert.equal(await executeHuntWorker({ ...paths, observationId: "urn:uuid:a2345678-1234-4123-8123-123456789abc", json: true, quiet: true, runtimeLoader }), 78);
    assert.equal(loaded, true);
    assert.deepEqual(JSON.parse(logs[0]!), { status: "denied", code: "HUNT_WORKER_DENIED", message: "hypothesis execution was not authorized or its bounded input was invalid" });
  } finally {
    console.log = originalLog;
    await rm(root, { recursive: true, force: true });
  }
});
