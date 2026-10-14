import assert from "node:assert/strict";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { runHunt } from "./index.js";
import { createApprovalReceipt, parseHuntRecipe, type HuntTargetManifest, type ScanResult } from "@verglos/shared";
import { createHuntTestTrustStore, HUNT_TEST_TRUST_KEY_ID } from "./hunt-trust-test-support.js";
import { planSupportedHuntAttack } from "./attack-hypothesis.js";
import { runSupportedHuntAttack, runSupportedHuntProof, runSupportedHuntRetest } from "./attack-worker.js";
import { SUPPORTED_HUNT_RECIPE_CATALOG } from "./supported-recipe-catalog.js";

const report = {
  projectRoot: "/tmp/project",
  projectType: "node",
  scannedAt: "2026-01-01T00:00:00.000Z",
  durationMs: 1,
  findings: [
    { id: "critical-1", severity: "critical", title: "critical", description: "x", detector: "deep-auth", confidence: "certain", category: "auth" },
    { id: "medium-1", severity: "medium", title: "medium", description: "x", detector: "deep-auth", confidence: "certain", category: "auth" },
  ],
  score: { value: 10, riskLevel: "critical", counts: { critical: 1, high: 0, medium: 1, low: 0, info: 0 }, testFileFindings: { total: 0, included: false, note: "none" } },
  unlocked: true,
} as unknown as ScanResult;

const subjectId = `urn:verglos:subject:artifact:sha256:${"a".repeat(64)}`;
const fixtures = {
  positive: { fixtureId: "positive", expectedVerdict: "confirmed" },
  negative: { fixtureId: "negative", expectedVerdict: "not-reproduced" },
  timeout: { fixtureId: "timeout", expectedVerdict: "inconclusive" },
  infrastructureFailure: { fixtureId: "infrastructure-failure", expectedVerdict: "environment-error" },
  unsupported: { fixtureId: "unsupported", expectedVerdict: "not-supported" },
} as const;
const recipe = parseHuntRecipe({ schemaId: "urn:verglos:schema:hunt-recipe", schemaVersion: "1.0.0", recipeId: "hunt-runner", ruleId: "d1-1", targetSubjectId: subjectId, imageDigest: { algorithm: "sha256", value: "b".repeat(64) }, command: ["/probe"], assertions: ["exit code is 0"], fixtures, isolation: "container", limits: { timeoutMs: 1000, cpuMs: 900, memoryMb: 256, diskMb: 128, outputBytes: 10000, processes: 32, maxNetworkRequests: 0 }, cleanup: "always", network: { mode: "denied", destinations: [], reason: "fixture" }, redaction: "required", signature: { status: "verified", signer: HUNT_TEST_TRUST_KEY_ID } });
const execution = {
  recipe,
  trust: createHuntTestTrustStore(recipe),
  approval: createApprovalReceipt({ requestId: "523e4567-e89b-12d3-a456-426614174000", action: "execute", actor: "human", target: subjectId, files: [], network: [], policyEffect: "hunt", requestedAt: "2026-01-01T00:00:00Z", expiresAt: "2099-01-01T00:00:00Z" }, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" }),
  ruleId: "d1-1", subjectId, observationId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", at: "2026-01-01T00:02:00Z",
};

test("Hunt dry run filters eligible severities and never executes", async () => {
  const result = await runHunt(report, { dryRun: true });
  assert.deepEqual(result.outcomes.map((outcome) => outcome.findingId), ["critical-1"]);
  assert.equal(result.outcomes[0]?.verdict, "not_attemptable");
  assert.match(result.outcomes[0]?.reason ?? "", /no probe|dry run/);
  assert.equal(result.outcomes[0]?.durationMs, 0);
});

test("Hunt returns an honest non-execution result without an adapter", async () => {
  const result = await runHunt(report, { severity: ["medium"], findingId: "medium-1", sandbox: "auto" });
  assert.equal(result.outcomes.length, 1);
  assert.equal(result.outcomes[0]?.verdict, "not_attemptable");
  assert.match(result.outcomes[0]?.reason ?? "", /not attempted/);
});

test("Hunt rejects unbounded duration and project-root inputs", async () => {
  await assert.rejects(() => runHunt(report, { maxDurationMs: 0 }), /max duration/);
  await assert.rejects(() => runHunt(report, { projectRoot: "x".repeat(4097) }), /project root/);
});

test("Hunt executes only through an explicitly injected adapter and always cleans up", async () => {
  const calls: string[] = [];
  const adapter = {
    id: "test-probe",
    async prepare() { calls.push("prepare"); },
    async execute(input: { finding: typeof report.findings[number]; projectRoot: string; timeoutMs: number; binding: unknown }) {
      calls.push(`execute:${input.finding.id}`);
      assert.equal(input.projectRoot, report.projectRoot);
      assert.ok(input.timeoutMs > 0);
      assert.ok(input.binding);
      return { findingId: input.finding.id, verdict: "false" as const, reason: "fixture probe completed", durationMs: 1 };
    },
    async cleanup() { calls.push("cleanup"); },
  };
  const result = await runHunt(report, { adapter, sandbox: "test-probe", execution });
  assert.deepEqual(calls, ["prepare", "execute:critical-1", "cleanup"]);
  assert.equal(result.outcomes[0]?.verdict, "false");
  assert.equal(result.sandbox, "test-probe");
});

test("Hunt refuses an adapter during dry run or when sandbox identity mismatches", async () => {
  const adapter = { id: "test-probe", async prepare() {}, async execute() { return { findingId: "critical-1", verdict: "false" as const, reason: "fixture", durationMs: 1 }; }, async cleanup() {} };
  await assert.rejects(() => runHunt(report, { adapter, dryRun: true }), /dry run/);
  await assert.rejects(() => runHunt(report, { adapter, sandbox: "docker" }), /does not match/);
});

test("Hunt cleans up when adapter preparation fails", async () => {
  let cleaned = false;
  const adapter = {
    id: "test-probe",
    async prepare() { throw new Error("fixture preparation failure"); },
    async execute() { throw new Error("must not execute"); },
    async cleanup() { cleaned = true; },
  };
  await assert.rejects(() => runHunt(report, { adapter, execution }), /fixture preparation failure/);
  assert.equal(cleaned, true);
});

test("Hunt adapter execution failures do not echo runtime error details", async () => {
  const adapter = {
    id: "test-probe",
    async prepare() {},
    async execute() { throw new Error("secret host path /private/customer"); },
    async cleanup() {},
  };
  const result = await runHunt(report, { adapter, execution });
  assert.equal(result.outcomes[0]?.canonicalVerdict, "environment-error");
  assert.equal(result.outcomes[0]?.reason, "Hunt adapter failed before a supported verdict could be evaluated");
  assert.doesNotMatch(result.outcomes[0]?.reason ?? "", /customer|private/);
});

test("Hunt converts cleanup failure into an environment-error outcome", async () => {
  const adapter = {
    id: "test-probe",
    async prepare() {},
    async execute() { return { findingId: "critical-1", verdict: "true" as const, canonicalVerdict: "confirmed" as const, reason: "fixture", durationMs: 1 }; },
    async cleanup() { throw new Error("secret cleanup path"); },
  };
  const result = await runHunt(report, { adapter, execution });
  assert.equal(result.outcomes[0]?.verdict, "not_attemptable");
  assert.equal(result.outcomes[0]?.canonicalVerdict, "environment-error");
  assert.equal(result.outcomes[0]?.reason, "Hunt sandbox cleanup failed; verdict was not retained");
});

test("Hunt refuses adapter execution without an exact trust and approval binding", async () => {
  const adapter = { id: "test-probe", async prepare() {}, async execute() { throw new Error("must not execute"); }, async cleanup() {} };
  await assert.rejects(() => runHunt(report, { adapter }), /execution requires/);
});

test("Attack Worker consumes the exact hypothesis and preserves proof/counterexample as not-run", async () => {
  const workerSubjectId = `urn:verglos:subject:artifact:sha256:${"b".repeat(64)}`;
  const manifest = {
    schemaId: "urn:verglos:schema:hunt-target-manifest",
    schemaVersion: "1.0.0",
    targetSubjectId: workerSubjectId,
    frameworks: ["express"],
    entrypoints: [{ path: "app.js", kind: "source" }],
    routes: [],
    apis: [],
    dependencyBoundaries: ["express"],
    agentMcpTools: [],
    candidateSinks: [],
    coverage: { status: "complete", filesInspected: 1, bytesInspected: 10, limitations: [] },
  } as const;
  const finding = { id: "finding-worker", ruleId: "hunt.a1.utf8-contains", location: "app.js", severity: "high" as const };
  const hypothesis = planSupportedHuntAttack({ manifest: manifest as unknown as HuntTargetManifest, finding });
  const recipe = parseHuntRecipe({
    schemaId: "urn:verglos:schema:hunt-recipe",
    schemaVersion: "1.0.0",
    recipeId: "a1-utf8-contains",
    ruleId: finding.ruleId,
    targetSubjectId: workerSubjectId,
    imageDigest: { algorithm: "sha256", value: "c".repeat(64) },
    command: ["verglos-probe", "utf8-contains"],
    assertions: ["probe result is true"],
    fixtures,
    inputs: { needle: "unsafe", value: "fixture contains unsafe" },
    isolation: "restricted-process",
    limits: { timeoutMs: 2_000, cpuMs: 1_500, memoryMb: 64, diskMb: 16, outputBytes: 1_024, processes: 1, maxNetworkRequests: 0 },
    cleanup: "always",
    network: { mode: "denied", destinations: [], reason: "A1 pure probe" },
    redaction: "required",
    signature: { status: "verified", signer: HUNT_TEST_TRUST_KEY_ID },
  });
  const at = "2026-01-01T00:02:00Z";
  const approval = createApprovalReceipt({ requestId: "623e4567-e89b-12d3-a456-426614174000", action: "execute", actor: "human", target: workerSubjectId, files: [], network: [], policyEffect: "hunt", requestedAt: "2026-01-01T00:00:00Z", expiresAt: "2026-01-01T01:00:00Z" }, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
  const worker = await runSupportedHuntAttack({
    hypothesis,
    report: {
      ...report,
      projectRoot: "/tmp/fixture-target",
      findings: [{ id: finding.id, detector: "injection", rule: finding.ruleId, severity: finding.severity, file: finding.location, line: 1, title: "fixture", description: "fixture", confidence: "high", category: "injection" }],
    },
    recipe,
    trust: createHuntTestTrustStore(recipe),
    approval,
    entitlement: "hunt.critical",
    observationId: "urn:uuid:22345678-1234-4123-8123-123456789abc",
    at,
  });
  assert.equal(worker.status, "completed");
  assert.equal(worker.executes, true);
  assert.equal(worker.targetSubjectId, workerSubjectId);
  assert.equal(worker.outcome.canonicalVerdict, "confirmed");
  assert.equal(worker.proof.status, "not-run");
  assert.equal(worker.proof.negativeControl, "not-run");
  assert.match(worker.execution.recipeDigest, /^sha256:/u);
  assert.doesNotMatch(JSON.stringify(worker), /fixture contains unsafe|tmp\/fixture-target/u);

  const proof = await runSupportedHuntProof({
    hypothesis,
    report: {
      ...report,
      projectRoot: "/tmp/fixture-target",
      findings: [{ id: finding.id, detector: "injection", rule: finding.ruleId, severity: finding.severity, file: finding.location, line: 1, title: "fixture", description: "fixture", confidence: "high", category: "injection" }],
    },
    recipe,
    trust: createHuntTestTrustStore(recipe),
    approval,
    entitlement: "hunt.critical",
    observationId: "urn:uuid:22345678-1234-4123-8123-123456789abc",
    at,
  });
  assert.equal(proof.status, "completed");
  assert.equal(proof.executes, true);
  assert.equal(proof.outcome?.canonicalVerdict, "confirmed");
  assert.equal(proof.counterexample?.canonicalVerdict, "not-reproduced");
  assert.equal(proof.proof.status, "confirmed");
  assert.equal(proof.proof.negativeControl, "passed");
  assert.equal(proof.verificationAttempt?.subjectId, workerSubjectId);
  assert.equal(proof.verificationAttempt?.observationId, "urn:uuid:22345678-1234-4123-8123-123456789abc");
  assert.equal(proof.verificationAttempt?.findingId, finding.id);
  assert.equal(proof.verificationAttempt?.verdict, "confirmed");
  assert.equal(proof.verificationAttempt?.output.evidenceDigest?.value, proof.outcome?.evidenceDigest?.slice("sha256:".length));
  assert.doesNotMatch(JSON.stringify(proof), /fixture contains unsafe|tmp\/fixture-target/u);
});

test("Attack Worker refuses a report without the exact hypothesis finding", async () => {
  const workerSubjectId = `urn:verglos:subject:artifact:sha256:${"d".repeat(64)}`;
  const manifest = {
    schemaId: "urn:verglos:schema:hunt-target-manifest",
    schemaVersion: "1.0.0",
    targetSubjectId: workerSubjectId,
    frameworks: ["express"],
    entrypoints: [{ path: "app.js", kind: "source" }],
    routes: [], apis: [], dependencyBoundaries: [], agentMcpTools: [], candidateSinks: [],
    coverage: { status: "complete", filesInspected: 1, bytesInspected: 1, limitations: [] },
  } as const;
  const hypothesis = planSupportedHuntAttack({ manifest: manifest as unknown as HuntTargetManifest, finding: { id: "finding-worker", ruleId: "hunt.a1.utf8-contains" } });
  const recipe = parseHuntRecipe({
    schemaId: "urn:verglos:schema:hunt-recipe", schemaVersion: "1.0.0", recipeId: "a1-utf8-contains", ruleId: "hunt.a1.utf8-contains", targetSubjectId: workerSubjectId,
  imageDigest: { algorithm: "sha256", value: "e".repeat(64) }, command: ["verglos-probe", "utf8-contains"], assertions: ["probe result is true"], fixtures, inputs: { needle: "x", value: "x" }, isolation: "restricted-process",
    limits: { timeoutMs: 2_000, cpuMs: 1_500, memoryMb: 64, diskMb: 16, outputBytes: 1_024, processes: 1, maxNetworkRequests: 0 }, cleanup: "always", network: { mode: "denied", destinations: [], reason: "fixture" }, redaction: "required", signature: { status: "verified", signer: HUNT_TEST_TRUST_KEY_ID },
  });
  const at = "2026-01-01T00:02:00Z";
  const approval = createApprovalReceipt({ requestId: "723e4567-e89b-12d3-a456-426614174000", action: "execute", actor: "human", target: workerSubjectId, files: [], network: [], policyEffect: "hunt", requestedAt: "2026-01-01T00:00:00Z", expiresAt: "2026-01-01T01:00:00Z" }, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
  await assert.rejects(() => runSupportedHuntAttack({ hypothesis, report, recipe, trust: createHuntTestTrustStore(recipe), approval, entitlement: "hunt.critical", observationId: "urn:uuid:32345678-1234-4123-8123-123456789abc", at }), /report does not contain/);
});

test("Hunt retest binds an approved remediation scope and clears a fixed A1 subject", async () => {
  const beforeSubjectId = `urn:verglos:subject:artifact:sha256:${"c".repeat(64)}`;
  const afterSubjectId = `urn:verglos:subject:artifact:sha256:${"d".repeat(64)}`;
  const at = "2026-01-01T00:02:00Z";
  const finding = { id: "finding-retest", ruleId: "hunt.a1.utf8-contains", location: "app.js", line: 1, severity: "high" as const };
  const hypothesis = planSupportedHuntAttack({
    manifest: {
      schemaId: "urn:verglos:schema:hunt-target-manifest", schemaVersion: "1.0.0", targetSubjectId: afterSubjectId,
      frameworks: ["express"], entrypoints: [{ path: "app.js", kind: "source" }], routes: [], apis: [], dependencyBoundaries: [], agentMcpTools: [], candidateSinks: [],
      coverage: { status: "complete", filesInspected: 1, bytesInspected: 10, limitations: [] },
    } as unknown as HuntTargetManifest,
    finding,
  });
  const afterRecipe = parseHuntRecipe({
    schemaId: "urn:verglos:schema:hunt-recipe", schemaVersion: "1.0.0", recipeId: "a1-utf8-contains", ruleId: finding.ruleId, targetSubjectId: afterSubjectId,
  imageDigest: { algorithm: "sha256", value: "f".repeat(64) }, command: ["verglos-probe", "utf8-contains"], assertions: ["probe result is true"], fixtures, inputs: { needle: "unsafe", value: "safe fixture after remediation" }, isolation: "restricted-process",
    limits: { timeoutMs: 2_000, cpuMs: 1_500, memoryMb: 64, diskMb: 16, outputBytes: 1_024, processes: 1, maxNetworkRequests: 0 }, cleanup: "always", network: { mode: "denied", destinations: [], reason: "A1 pure probe" }, redaction: "required", signature: { status: "verified", signer: HUNT_TEST_TRUST_KEY_ID },
  });
  const remediation = {
    proposalId: "923e4567-e89b-12d3-a456-426614174000", findingId: finding.id, targetSubjectId: beforeSubjectId, files: ["app.js"], summary: "replace the unsafe input path", tests: ["Run the bounded security test"],
    policyEffect: "clear hunt finding", uncertainty: "post-remediation subject must be retested", networkRequired: false, applied: false,
  };
  const remediationApproval = createApprovalReceipt({ requestId: "923e4567-e89b-12d3-a456-426614174001", action: "mutate", actor: "human", target: beforeSubjectId, files: ["app.js"], network: [], policyEffect: remediation.policyEffect, requestedAt: "2026-01-01T00:00:00Z", expiresAt: "2099-01-01T00:00:00Z" }, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
  const executeApproval = createApprovalReceipt({ requestId: "a2345678-e89b-12d3-a456-426614174000", action: "execute", actor: "human", target: afterSubjectId, files: [], network: [], policyEffect: "hunt", requestedAt: "2026-01-01T00:00:00Z", expiresAt: "2099-01-01T00:00:00Z" }, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
  const result = await runSupportedHuntRetest({
    hypothesis,
    report: { ...report, projectRoot: "/tmp/fixture-target-after", findings: [{ id: finding.id, detector: "injection", rule: finding.ruleId, severity: finding.severity, file: finding.location, line: finding.line, title: "fixture", description: "fixture", confidence: "high", category: "injection" }] },
    recipe: afterRecipe,
    trust: createHuntTestTrustStore(afterRecipe),
    approval: executeApproval,
    entitlement: "hunt.critical",
    observationId: "urn:uuid:b2345678-1234-4123-8123-123456789abc",
    at,
    beforeSubjectId,
    remediation,
    remediationApproval,
  });
  assert.equal(result.status, "completed");
  assert.equal(result.remediation.approved, true);
  assert.equal(result.remediation.applied, false);
  assert.equal(result.proof.proof.status, "not-reproduced");
  assert.equal(result.retest.status, "cleared");
  assert.equal(result.retest.sameProof, true);
  assert.doesNotMatch(JSON.stringify(result), /safe fixture after remediation|tmp\/fixture-target-after/u);
});

test("Proof replays a pinned container harness and its negative control", { skip: process.env.VERGLOS_HUNT_DOCKER_TARGET_INTEGRATION !== "1" ? "set VERGLOS_HUNT_DOCKER_TARGET_INTEGRATION=1 to run container proof qualification" : false }, async () => {
  const descriptor = SUPPORTED_HUNT_RECIPE_CATALOG.find((candidate) => candidate.recipeId === "a2-sql-nosql-injection-harness");
  assert.ok(descriptor && descriptor.adapter === "container" && descriptor.imageDigest);
  const proofSubjectId = `urn:verglos:subject:artifact:sha256:${"e".repeat(64)}`;
  const finding = { id: "finding-container-proof", ruleId: descriptor.ruleId, location: "app.js", line: 1, severity: "high" as const };
  const hypothesis = planSupportedHuntAttack({
    manifest: {
      schemaId: "urn:verglos:schema:hunt-target-manifest",
      schemaVersion: "1.0.0",
      targetSubjectId: proofSubjectId,
      frameworks: ["express"],
      entrypoints: [{ path: "app.js", kind: "source" }],
      routes: [{ method: "GET", path: "/fixture", file: "app.js" }], apis: [], dependencyBoundaries: [], agentMcpTools: [], candidateSinks: [],
      coverage: { status: "complete", filesInspected: 1, bytesInspected: 1, limitations: [] },
    } as unknown as HuntTargetManifest,
    finding,
  });
  const recipe = parseHuntRecipe({
    schemaId: "urn:verglos:schema:hunt-recipe", schemaVersion: "1.0.0", recipeId: descriptor.recipeId, ruleId: descriptor.ruleId, targetSubjectId: proofSubjectId,
    imageDigest: { algorithm: "sha256", value: descriptor.imageDigest.slice("sha256:".length) }, command: [...descriptor.command], assertions: [...descriptor.assertions], fixtures,
    isolation: "container", limits: { timeoutMs: 10_000, cpuMs: 9_000, memoryMb: 256, diskMb: 128, outputBytes: 16_384, processes: 8, maxNetworkRequests: 0 }, cleanup: "always",
    network: { mode: "denied", destinations: [], reason: "target harness proof" }, redaction: "required", signature: { status: "verified", signer: HUNT_TEST_TRUST_KEY_ID },
  });
  const proof = await runSupportedHuntProof({
    hypothesis,
    report: { ...report, projectRoot: fileURLToPath(new URL("../fixtures/target-code/", import.meta.url)), findings: [{ id: finding.id, detector: "injection", rule: finding.ruleId, severity: finding.severity, file: finding.location, line: finding.line, title: "fixture", description: "fixture", confidence: "high", category: "injection" }] },
    recipe,
    trust: createHuntTestTrustStore(recipe),
    approval: createApprovalReceipt({ requestId: "823e4567-e89b-12d3-a456-426614174000", action: "execute", actor: "human", target: proofSubjectId, files: [], network: [], policyEffect: "hunt", requestedAt: "2026-01-01T00:00:00Z", expiresAt: "2099-01-01T00:00:00Z" }, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" }),
    entitlement: "hunt.critical", observationId: "urn:uuid:42345678-1234-4123-8123-123456789abc", at: "2026-01-01T00:02:00Z",
  });
  assert.equal(proof.status, "completed");
  assert.equal(proof.executes, true);
  assert.equal(proof.sandbox, "docker");
  assert.equal(proof.outcome?.canonicalVerdict, "confirmed");
  assert.equal(proof.counterexample?.canonicalVerdict, "not-reproduced");
  assert.equal(proof.proof.status, "confirmed");
  assert.equal(proof.proof.negativeControl, "passed");
  assert.match(proof.proof.limitation, /pinned Docker|synthetic/u);
});

test("Hunt rejects an adapter result that widens the finding identity", async () => {
  const adapter = {
    id: "test-probe",
    async prepare() {},
    async execute() { return { findingId: "different-finding", verdict: "false" as const, reason: "fixture", durationMs: 1 }; },
    async cleanup() {},
  };
  const result = await runHunt(report, { adapter, execution });
  assert.equal(result.outcomes[0]?.findingId, "critical-1");
  assert.equal(result.outcomes[0]?.verdict, "not_attemptable");
  assert.match(result.outcomes[0]?.reason ?? "", /mismatched finding/);
});

test("Hunt preserves the report finding instead of adapter-supplied mutable evidence", async () => {
  const adapter = {
    id: "test-probe",
    async prepare() {},
    async execute() { return { findingId: "critical-1", verdict: "false" as const, finding: { ...(report.findings[0] as unknown as Record<string, unknown>), title: "tampered", id: "critical-1" } as never, reason: "fixture", durationMs: 1 }; },
    async cleanup() {},
  };
  const result = await runHunt(report, { adapter, execution });
  assert.equal(result.outcomes[0]?.finding?.title, "critical");
});

test("Hunt rejects malformed adapter outcome fields", async () => {
  const adapter = {
    id: "test-probe",
    async prepare() {},
    async execute() { return { findingId: "critical-1", verdict: "unexpected", reason: "fixture", durationMs: 1 } as never; },
    async cleanup() {},
  };
  const result = await runHunt(report, { adapter, execution });
  assert.equal(result.outcomes[0]?.verdict, "not_attemptable");
  assert.match(result.outcomes[0]?.reason ?? "", /mismatched finding/);
});

test("Hunt rejects contradictory canonical verdicts", async () => {
  const adapter = {
    id: "test-probe",
    async prepare() {},
    async execute() { return { findingId: "critical-1", verdict: "true" as const, canonicalVerdict: "policy-denied" as const, reason: "fixture", durationMs: 1 }; },
    async cleanup() {},
  };
  const result = await runHunt(report, { adapter, execution });
  assert.equal(result.outcomes[0]?.verdict, "not_attemptable");
  assert.match(result.outcomes[0]?.reason ?? "", /mismatched finding/);
});

test("Hunt rejects unbounded adapter reasons and durations", async () => {
  const adapter = {
    id: "test-probe",
    async prepare() {},
    async execute() { return { findingId: "critical-1", verdict: "false" as const, reason: "x".repeat(4097), durationMs: -1 }; },
    async cleanup() {},
  };
  const result = await runHunt(report, { adapter, execution });
  assert.equal(result.outcomes[0]?.verdict, "not_attemptable");
});

test("Hunt rejects malformed evidence metadata from adapters", async () => {
  const adapter = {
    id: "test-probe",
    async prepare() {},
    async execute() { return { findingId: "critical-1", verdict: "false" as const, reason: "fixture", durationMs: 1, evidenceDigest: "not-a-digest", redacted: false } as never; },
    async cleanup() {},
  };
  const result = await runHunt(report, { adapter, execution });
  assert.equal(result.outcomes[0]?.verdict, "not_attemptable");
});

test("Hunt preserves only a strict bounded assurance disclosure", async () => {
  const assurance = { class: "A1" as const, isolation: "restricted-process" as const, securityBoundary: false, sourceAccess: "none" as const, network: "denied" as const, processLimit: 1, limitation: "trusted built-in harness; not an OS isolation boundary" };
  const adapter = { id: "test-probe", async prepare() {}, async execute() { return { findingId: "critical-1", verdict: "false" as const, canonicalVerdict: "not-reproduced" as const, reason: "fixture", durationMs: 1, assurance }; }, async cleanup() {} };
  const result = await runHunt(report, { adapter, execution });
  assert.deepEqual(result.outcomes[0]?.assurance, assurance);
  assert.ok(Object.isFrozen(result.outcomes[0]?.assurance));

  const malformed = { ...adapter, async execute() { return { findingId: "critical-1", verdict: "false" as const, canonicalVerdict: "not-reproduced" as const, reason: "fixture", durationMs: 1, assurance: { ...assurance, securityBoundary: "no" } } as never; } };
  const rejected = await runHunt(report, { adapter: malformed, execution });
  assert.equal(rejected.outcomes[0]?.verdict, "not_attemptable");
});

test("Hunt freezes projected outcomes before returning them", async () => {
  const dryRun = await runHunt(report, { dryRun: true });
  assert.ok(Object.isFrozen(dryRun.outcomes));
  assert.ok(Object.isFrozen(dryRun.outcomes[0]));
  const adapter = { id: "test-probe", async prepare() {}, async execute() { return { findingId: "critical-1", verdict: "false" as const, reason: "fixture", durationMs: 1 }; }, async cleanup() {} };
  const executed = await runHunt(report, { adapter, execution });
  assert.ok(Object.isFrozen(executed.outcomes));
  assert.ok(Object.isFrozen(executed.outcomes[0]));
});

test("Hunt outcome findings are cloned and immutable", async () => {
  const adapter = { id: "test-probe", async prepare() {}, async execute() { return { findingId: "critical-1", verdict: "false" as const, reason: "fixture", durationMs: 1 }; }, async cleanup() {} };
  const result = await runHunt(report, { adapter, execution });
  assert.notEqual(result.outcomes[0]?.finding, report.findings[0]);
  assert.ok(Object.isFrozen(result.outcomes[0]?.finding));
  assert.equal(result.outcomes[0]?.finding?.title, "critical");
  (report.findings[0] as { title: string }).title = "changed after run";
  assert.equal(result.outcomes[0]?.finding?.title, "critical");
});
