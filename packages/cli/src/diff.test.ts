import assert from "node:assert/strict";
import { mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { createReleaseSnapshot, createSubject } from "@verglos/shared";
import { executeDiff } from "./diff.js";

test("diff command rejects malformed snapshots with usage exit", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-diff-"));
  try {
    await writeFile(join(root, "base.json"), "{}", "utf8");
    await writeFile(join(root, "head.json"), "{}", "utf8");
    assert.equal(await executeDiff(join(root, "base.json"), join(root, "head.json"), true), 2);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("diff command rejects snapshots with excessive observation collections", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-diff-large-"));
  try {
    const observation = { fingerprint: "sha256:" + "a".repeat(64), producerIds: ["native"], disagreement: false };
    const snapshot = { schemaVersion: "1.0.0", primarySubjectId: "subject", subjectIds: [], observations: Array.from({ length: 20_001 }, () => observation), lineage: { edges: [], gaps: [] }, policyInputDigest: "sha256:" + "b".repeat(64) };
    await writeFile(join(root, "base.json"), JSON.stringify(snapshot), "utf8");
    await writeFile(join(root, "head.json"), JSON.stringify(snapshot), "utf8");
    assert.equal(await executeDiff(join(root, "base.json"), join(root, "head.json"), true), 2);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("diff command rejects symlink snapshot inputs before parsing", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-diff-link-"));
  try {
    await writeFile(join(root, "base.json"), "{}", "utf8");
    await writeFile(join(root, "head.json"), "{}", "utf8");
    await symlink(join(root, "base.json"), join(root, "base-link.json"));
    assert.equal(await executeDiff(join(root, "base-link.json"), join(root, "head.json"), true), 2);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("diff command exposes digest-verified change and action projections in JSON", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-diff-actions-"));
  const subject = createSubject({ kind: "artifact", digest: { algorithm: "sha256", value: "e".repeat(64) }, size: 1, mediaType: "application/octet-stream" });
  const coverage = (observationCount: number) => ({ schemaVersion: "1.0.0" as const, status: "complete" as const, target: { state: "complete" as const, limitations: [] }, producers: [{ producer: "native" as const, state: "complete" as const, observationCount, runIds: [], sourceDigests: [], limitations: [] }] });
  const makeSnapshot = (fingerprints: string[]) => createReleaseSnapshot({
    primarySubject: subject,
    subjects: [subject],
    observations: fingerprints.map((fingerprint) => ({ fingerprint, producerIds: ["native"], payloads: [], disagreement: false })),
    lineage: { edges: [], gaps: [] },
    policyInputs: {},
    coverage: coverage(fingerprints.length),
  });
  const outputLines: string[] = [];
  const originalLog = console.log;
  console.log = (message?: unknown) => { outputLines.push(String(message)); };
  try {
    const existing = `sha256:${"b".repeat(64)}`;
    const added = `sha256:${"a".repeat(64)}`;
    await writeFile(join(root, "base.json"), JSON.stringify(makeSnapshot([existing])));
    await writeFile(join(root, "head.json"), JSON.stringify(makeSnapshot([existing, added])));
    assert.equal(await executeDiff(join(root, "base.json"), join(root, "head.json"), true, true), 3);
    const report = JSON.parse(outputLines[0]!);
    assert.deepEqual(report.added, [added]);
    assert.equal(report.coverageDelta.before.producers[0].observationCount, 1);
    assert.equal(report.coverageDelta.after.producers[0].observationCount, 2);
    const action = report.actions.changes.find((change: { fingerprint: string }) => change.fingerprint === added);
    assert.equal(action.status, "added");
    assert.equal(action.owner.status, "unassigned");
    assert.equal(action.rescan.status, "required");
    assert.equal(action.huntEligibility.status, "not-evaluated");
    assert.equal(action.evidence.status, "unavailable");
    assert.equal(report.lineageDelta.changed, false);
    assert.ok(report.actions.blockers.some((blocker: { code: string }) => blocker.code === "severity-unassessed"));
    outputLines.length = 0;
    assert.equal(await executeDiff(join(root, "base.json"), join(root, "head.json")), 3);
    assert.ok(outputLines.some((line) => line === "Added: 1"));
    assert.ok(outputLines.some((line) => line.startsWith("Worsened: ")));
    assert.ok(outputLines.some((line) => line.startsWith("Unchanged fingerprints: ")));
    assert.ok(outputLines.some((line) => line.includes("Owner: unassigned")));
    assert.ok(outputLines.some((line) => line.includes("Evidence: unavailable")));
    assert.ok(outputLines.some((line) => line.includes("Rescan: required")));
    assert.ok(outputLines.some((line) => line.includes("Hunt: not-evaluated")));
  } finally { console.log = originalLog; await rm(root, { recursive: true, force: true }); }
});

test("diff command renders validated evidence attribution, digest, confidence, run time, and engine health", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-diff-evidence-"));
  const subject = createSubject({ kind: "artifact", digest: { algorithm: "sha256", value: "f".repeat(64) }, size: 1, mediaType: "application/octet-stream" });
  const fingerprint = `sha256:${"a".repeat(64)}`;
  const makeSnapshot = (severity: "high" | "critical", runId: string, startedAt: string) => {
    const completedAt = new Date(Date.parse(startedAt) + 1_000).toISOString();
    const run = {
      schemaId: "urn:verglos:schema:tool-run", schemaVersion: "1.0.0", runId, subjectId: subject.subjectId,
      engine: {
        producer: { id: "verglos.native-scanner", kind: "native", name: "Verglos native scanner", version: "2.0.0" },
        observedAt: completedAt, state: "healthy",
        components: [{ id: "scanner.binary", kind: "binary", name: "Verglos scanner", version: "2.0.0", digest: { algorithm: "sha256", value: "b".repeat(64) }, source: "bundled", trust: "verified" }],
        capabilities: [{ id: "artifact.scan", subjectKinds: ["artifact"], status: "supported" }], freshness: [], incompleteReasons: [],
      },
      requestedCapabilities: ["artifact.scan"], executedCapabilities: ["artifact.scan"], executionClass: "in-process", networkAccess: "none", targetCodeExecuted: false,
      startedAt, completedAt, durationMs: 1_000, timeoutMs: 30_000, outcome: "succeeded", processResult: { kind: "exited", code: 0 }, coverage: "complete", incompleteReasons: [],
    };
    const observation = {
      schemaId: "urn:verglos:schema:observation", schemaVersion: "1.0.0", observationId: "urn:uuid:12345678-1234-4123-8123-123456789abc", subjectId: subject.subjectId,
      origin: { kind: "native", producerId: "verglos.native-scanner", runId, ruleId: "D1-001", rawEvidenceDigest: { algorithm: "sha256", value: "c".repeat(64) } },
      coverageClass: "native", category: "security.test", title: "Test observation", description: "Validated test observation.", locations: [{ kind: "artifact", path: "finding.json" }],
      severity: { original: { system: "test.severity", value: severity }, normalized: severity, mapping: { id: "test.severity-map", version: "1.0.0" } },
      confidence: { level: "high", score: 0.9, method: "test.confidence", mappingVersion: "1.0.0" },
      remediation: { summary: "Apply the documented fix." }, evidence: [], references: [], extensions: {},
    };
    const coverage = { schemaVersion: "1.1.0" as const, status: "complete" as const, target: { state: "complete" as const, limitations: [] }, producers: [{ producer: "native" as const, state: "complete" as const, observationCount: 1, runIds: [runId], sourceDigests: [], limitations: [], toolRuns: [run] }] };
    return createReleaseSnapshot({ primarySubject: subject, subjects: [subject], observations: [{ fingerprint, producerIds: ["verglos.native-scanner"], payloads: [observation], disagreement: false }], lineage: { edges: [], gaps: [] }, policyInputs: {}, coverage });
  };
  const originalLog = console.log;
  const outputLines: string[] = [];
  console.log = (message?: unknown) => { outputLines.push(String(message)); };
  try {
    const base = makeSnapshot("high", "urn:uuid:22345678-1234-4123-8123-123456789abc", "2026-09-11T00:00:00.000Z");
    const head = makeSnapshot("critical", "urn:uuid:32345678-1234-4123-8123-123456789abc", "2026-09-12T00:00:00.000Z");
    await writeFile(join(root, "base.json"), JSON.stringify(base));
    await writeFile(join(root, "head.json"), JSON.stringify(head));
    assert.equal(await executeDiff(join(root, "base.json"), join(root, "head.json"), true), 1);
    const report = JSON.parse(outputLines.pop()!);
    const evidence = report.actions.changes[0].evidence.observations[0];
    assert.equal(report.worsened[0], fingerprint);
    assert.equal(evidence.attribution.producerId, "verglos.native-scanner");
    assert.deepEqual(evidence.rawEvidenceDigest, { algorithm: "sha256", value: "c".repeat(64) });
    assert.equal(evidence.confidence.score, 0.9);
    assert.equal(evidence.timestamp.startedAt, "2026-09-12T00:00:00.000Z");
    assert.equal(evidence.engineHealth.state, "healthy");
    assert.equal(await executeDiff(join(root, "base.json"), join(root, "head.json")), 1);
    assert.ok(outputLines.some((line) => line.includes("raw reference sha256:" + "c".repeat(64))));
    assert.ok(outputLines.some((line) => line.includes("confidence high (0.9)/test.confidence")));
    assert.ok(outputLines.some((line) => line.includes("engine healthy")));
  } finally { console.log = originalLog; await rm(root, { recursive: true, force: true }); }
});
