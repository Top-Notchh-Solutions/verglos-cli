import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { createApprovalReceipt, parseHuntRecipe, type HuntTargetManifest } from "@verglos/shared";
import { createTestHuntTrustStore, TEST_HUNT_TRUST_KEY_ID } from "../../shared/src/hunt-trust-test-support.js";
import { HUNT_TARGET_HARNESS_IMAGE_DIGEST, TARGET_HARNESS_ASSERTION, planSupportedHuntAttack } from "@verglos/hunt";
import type { ScanResult } from "@verglos/shared";
import { executeHuntProof } from "./hunt-proof.js";
import type { HuntRuntimeLoader } from "./hunt-runtime.js";

const subjectId = `urn:verglos:subject:artifact:sha256:${"f".repeat(64)}`;
const at = new Date().toISOString();
const fixtures = {
  positive: { fixtureId: "positive", expectedVerdict: "confirmed" },
  negative: { fixtureId: "negative", expectedVerdict: "not-reproduced" },
  timeout: { fixtureId: "timeout", expectedVerdict: "inconclusive" },
  infrastructureFailure: { fixtureId: "infrastructure-failure", expectedVerdict: "environment-error" },
  unsupported: { fixtureId: "unsupported", expectedVerdict: "not-supported" },
} as const;
const finding = { id: "finding-proof-a2", ruleId: "D1-001", location: "app.js", line: 1, severity: "high" as const };
const manifest: HuntTargetManifest = {
  schemaId: "urn:verglos:schema:hunt-target-manifest",
  schemaVersion: "1.0.0",
  targetSubjectId: subjectId,
  frameworks: ["express"],
  entrypoints: [{ path: "app.js", kind: "source" }],
  routes: [{ method: "GET", path: "/fixture", file: "app.js" }],
  apis: [], dependencyBoundaries: [], agentMcpTools: [], candidateSinks: [],
  coverage: { status: "complete", filesInspected: 1, bytesInspected: 10, limitations: [] },
};
const hypothesis = planSupportedHuntAttack({ manifest, finding });
const recipe = parseHuntRecipe({
  schemaId: "urn:verglos:schema:hunt-recipe", schemaVersion: "1.0.0", recipeId: "a2-sql-nosql-injection-harness", ruleId: finding.ruleId, targetSubjectId: subjectId,
  imageDigest: { algorithm: "sha256", value: HUNT_TARGET_HARNESS_IMAGE_DIGEST.slice("sha256:".length) }, command: ["node", "/workspace/.verglos/hunt/sql-nosql-injection.mjs"], assertions: [TARGET_HARNESS_ASSERTION],
  fixtures,
  isolation: "container", limits: { timeoutMs: 10_000, cpuMs: 9_000, memoryMb: 256, diskMb: 128, outputBytes: 16_384, processes: 8, maxNetworkRequests: 0 }, cleanup: "always",
  network: { mode: "denied", destinations: [], reason: "A2 local reference harness" }, redaction: "required", signature: { status: "verified", signer: TEST_HUNT_TRUST_KEY_ID },
});
const report: ScanResult = {
  projectRoot: fileURLToPath(new URL("../../hunt/fixtures/target-code/", import.meta.url)), projectType: "node", scannedAt: at, durationMs: 1,
  findings: [{ id: finding.id, detector: "injection", rule: finding.ruleId, severity: finding.severity, file: finding.location, line: finding.line, title: "fixture", description: "fixture", confidence: "high", category: "injection" }],
  score: { value: 10, riskLevel: "high", counts: { critical: 0, high: 1, medium: 0, low: 0, info: 0 }, testFileFindings: { total: 0, included: false, note: "fixture" } }, unlocked: true,
};

test("hunt proof reaches the pinned A2 target harness through the public CLI surface", { skip: process.env.VERGLOS_HUNT_DOCKER_TARGET_INTEGRATION !== "1" ? "set VERGLOS_HUNT_DOCKER_TARGET_INTEGRATION=1 to run the public CLI A2 proof qualification" : false }, async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-cli-hunt-proof-a2-"));
  const logs: string[] = [];
  const originalLog = console.log;
  try {
    const paths = {
      hypothesisPath: join(root, "hypothesis.json"), reportPath: join(root, "report.json"), recipePath: join(root, "recipe.json"), trustStorePath: join(root, "trust-store.json"), approvalPath: join(root, "approval.json"),
    };
    await writeFile(paths.hypothesisPath, JSON.stringify(hypothesis));
    await writeFile(paths.reportPath, JSON.stringify(report));
    await writeFile(paths.recipePath, JSON.stringify(recipe));
    await writeFile(paths.trustStorePath, JSON.stringify(createTestHuntTrustStore(recipe, { at })));
    await writeFile(paths.approvalPath, JSON.stringify(createApprovalReceipt({ requestId: "923e4567-e89b-12d3-a456-426614174000", action: "execute", actor: "human", target: subjectId, files: [], network: [], policyEffect: "hunt", requestedAt: "2026-01-01T00:00:00Z", expiresAt: "2099-01-01T00:00:00Z" }, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" })));
    console.log = (line?: unknown) => logs.push(String(line));
    const runtimeLoader: HuntRuntimeLoader = () => import("../../hunt/dist/index.js");
    assert.equal(await executeHuntProof({ ...paths, observationId: "urn:uuid:a2345678-1234-4123-8123-123456789abc", json: true, quiet: true, runtimeLoader }), 1);
    const output = JSON.parse(logs[0]!) as Record<string, unknown>;
    assert.equal(output.status, "completed");
    assert.equal(output.sandbox, "docker");
    assert.equal((output.proof as Record<string, unknown>).status, "confirmed");
    assert.equal((output.proof as Record<string, unknown>).negativeControl, "passed");
    assert.equal((output.counterexample as Record<string, unknown>).canonicalVerdict, "not-reproduced");
    assert.doesNotMatch(JSON.stringify(output), /OR 1=1|\/tmp\/|fixtures\/target-code/u);
  } finally {
    console.log = originalLog;
    await rm(root, { recursive: true, force: true });
  }
});
