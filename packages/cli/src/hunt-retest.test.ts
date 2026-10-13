import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { createApprovalReceipt, createSubjectId, parseHuntReleaseEvidence, parseHuntRecipe, type ScanResult } from "@verglos/shared";
import { createTestHuntTrustStore, TEST_HUNT_TRUST_KEY_ID } from "../../shared/src/hunt-trust-test-support.js";
import { planSupportedHuntAttack } from "@verglos/hunt";
import { executeHuntRetest } from "./hunt-retest.js";
import type { HuntRuntimeLoader } from "./hunt-runtime.js";

const beforeSubjectId = createSubjectId({ kind: "artifact", digest: { algorithm: "sha256", value: "a".repeat(64) }, size: 10, mediaType: "application/octet-stream" });
const afterSubjectId = createSubjectId({ kind: "artifact", digest: { algorithm: "sha256", value: "b".repeat(64) }, size: 11, mediaType: "application/octet-stream" });
const at = new Date().toISOString();
const finding = { id: "finding-cli-retest", ruleId: "hunt.a1.utf8-contains", location: "app.js", line: 1, severity: "high" as const };
const hypothesis = planSupportedHuntAttack({
  manifest: {
    schemaId: "urn:verglos:schema:hunt-target-manifest", schemaVersion: "1.0.0", targetSubjectId: afterSubjectId,
    frameworks: ["express"], entrypoints: [{ path: "app.js", kind: "source" }], routes: [], apis: [], dependencyBoundaries: [], agentMcpTools: [], candidateSinks: [],
    coverage: { status: "complete", filesInspected: 1, bytesInspected: 10, limitations: [] },
  },
  finding,
});
const recipe = parseHuntRecipe({
  schemaId: "urn:verglos:schema:hunt-recipe", schemaVersion: "1.0.0", recipeId: "a1-utf8-contains", ruleId: finding.ruleId, targetSubjectId: afterSubjectId,
  imageDigest: { algorithm: "sha256", value: "c".repeat(64) }, command: ["verglos-probe", "utf8-contains"], assertions: ["probe result is true"], inputs: { needle: "unsafe", value: "safe fixture after remediation" }, isolation: "restricted-process",
  limits: { timeoutMs: 2_000, cpuMs: 1_500, memoryMb: 64, diskMb: 16, outputBytes: 1_024, processes: 1, maxNetworkRequests: 0 }, cleanup: "always", network: { mode: "denied", destinations: [], reason: "A1 pure probe" }, redaction: "required", signature: { status: "verified", signer: TEST_HUNT_TRUST_KEY_ID },
});
const report: ScanResult = {
  projectRoot: "/tmp/cli-retest-after", projectType: "node", scannedAt: at, durationMs: 1,
  findings: [{ id: finding.id, detector: "injection", rule: finding.ruleId, severity: finding.severity, file: finding.location, line: finding.line, title: "fixture", description: "fixture", confidence: "high", category: "injection" }],
  score: { value: 10, riskLevel: "high", counts: { critical: 0, high: 1, medium: 0, low: 0, info: 0 }, testFileFindings: { total: 0, included: false, note: "fixture" } }, unlocked: true,
};
const remediation = {
  proposalId: "c2345678-e89b-12d3-a456-426614174000", findingId: finding.id, targetSubjectId: beforeSubjectId, files: ["app.js"], summary: "replace unsafe input handling", tests: ["Run the bounded security test"],
  policyEffect: "clear Hunt finding", uncertainty: "the post-remediation subject must be retested", networkRequired: false, applied: false,
};
const remediationApproval = createApprovalReceipt({ requestId: "c2345678-e89b-12d3-a456-426614174001", action: "mutate", actor: "human", target: beforeSubjectId, files: ["app.js"], network: [], policyEffect: remediation.policyEffect, requestedAt: "2026-01-01T00:00:00Z", expiresAt: "2099-01-01T00:00:00Z" }, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
const executeApproval = createApprovalReceipt({ requestId: "d2345678-e89b-12d3-a456-426614174000", action: "execute", actor: "human", target: afterSubjectId, files: [], network: [], policyEffect: "hunt", requestedAt: "2026-01-01T00:00:00Z", expiresAt: "2099-01-01T00:00:00Z" }, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });

test("public CLI retest binds mutate approval and reruns the same proof", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-cli-hunt-retest-"));
  const logs: string[] = [];
  const originalLog = console.log;
  try {
    const paths = {
      hypothesisPath: join(root, "hypothesis.json"), reportPath: join(root, "report.json"), recipePath: join(root, "recipe.json"), trustStorePath: join(root, "trust-store.json"), approvalPath: join(root, "approval.json"), remediationPath: join(root, "remediation.json"), remediationApprovalPath: join(root, "remediation-approval.json"),
    };
    await writeFile(paths.hypothesisPath, JSON.stringify(hypothesis));
    await writeFile(paths.reportPath, JSON.stringify(report));
    await writeFile(paths.recipePath, JSON.stringify(recipe));
    await writeFile(paths.trustStorePath, JSON.stringify(createTestHuntTrustStore(recipe, { at })));
    await writeFile(paths.approvalPath, JSON.stringify(executeApproval));
    await writeFile(paths.remediationPath, JSON.stringify(remediation));
    await writeFile(paths.remediationApprovalPath, JSON.stringify(remediationApproval));
    console.log = (line?: unknown) => logs.push(String(line));
    const runtimeLoader: HuntRuntimeLoader = () => import("../../hunt/dist/index.js");
    assert.equal(await executeHuntRetest({ ...paths, beforeSubjectId, observationId: "urn:uuid:e2345678-e89b-12d3-a456-426614174000", json: true, quiet: true, runtimeLoader }), 0);
    const output = JSON.parse(logs[0]!) as Record<string, unknown>;
    assert.equal(output.status, "completed");
    assert.equal((output.remediation as Record<string, unknown>).approved, true);
    assert.equal((output.remediation as Record<string, unknown>).applied, false);
    assert.equal((output.retest as Record<string, unknown>).status, "cleared");
    assert.equal((output.retest as Record<string, unknown>).sameProof, true);
    assert.equal((output.proof as Record<string, unknown>).proof && ((output.proof as Record<string, unknown>).proof as Record<string, unknown>).status, "not-reproduced");
    assert.equal(parseHuntReleaseEvidence(output).kind, "retest");
    assert.doesNotMatch(JSON.stringify(output), /safe fixture after remediation|tmp\/cli-retest-after/u);
  } finally {
    console.log = originalLog;
    await rm(root, { recursive: true, force: true });
  }
});
