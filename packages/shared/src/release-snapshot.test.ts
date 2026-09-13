import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { test } from "node:test";
import { createReleaseSnapshot, parseReleaseSnapshot } from "./release-snapshot.js";
import { canonicalizeJson } from "./schema.js";
import { createSubject } from "./subject.js";
import { TOOL_RUN_SCHEMA, parseToolRun } from "./engine.js";

const subject = createSubject({ kind: "artifact", digest: { algorithm: "sha256", value: "d".repeat(64) }, size: 1, mediaType: "application/octet-stream" });
const completeCoverage = { schemaVersion: "1.0.0" as const, status: "complete" as const, target: { state: "complete" as const, limitations: [] }, producers: ["native", "trivy"].map((producer) => ({ producer: producer as "native" | "trivy", state: "complete" as const, observationCount: 1, runIds: [], sourceDigests: [], limitations: [] })) };

test("release snapshots are deterministic and retain coverage gaps", () => {
  const args = { primarySubject: subject, subjects: [subject], observations: [{ fingerprint: "sha256:" + "a".repeat(64), producerIds: ["trivy", "native"], payloads: [], disagreement: true }], lineage: { edges: [], gaps: ["missing build evidence"] }, policyInputs: { checks: ["critical"], threshold: 1 }, coverage: completeCoverage };
  const first = createReleaseSnapshot(args);
  const second = createReleaseSnapshot({ ...args, policyInputs: { threshold: 1, checks: ["critical"] } });
  assert.equal(first.snapshotDigest, second.snapshotDigest);
  assert.deepEqual(first.observations[0]?.producerIds, ["native", "trivy"]);
  assert.deepEqual(first.lineage.gaps, ["missing build evidence"]);
});

test("release snapshot v1.1 binds producer coverage into the canonical digest", () => {
  const coverage = { schemaVersion: "1.0.0" as const, status: "incomplete" as const, target: { state: "complete" as const, limitations: [] }, producers: [{ producer: "sarif" as const, state: "not-provided" as const, observationCount: 0, runIds: [], sourceDigests: [], limitations: ["SARIF import was selected but no validated import batch was provided"] }] };
  const first = createReleaseSnapshot({ primarySubject: subject, subjects: [subject], observations: [], lineage: { edges: [], gaps: [] }, policyInputs: { profile: "free" }, coverage });
  const same = createReleaseSnapshot({ primarySubject: subject, subjects: [subject], observations: [], lineage: { edges: [], gaps: [] }, policyInputs: { profile: "free" }, coverage });
  const changed = createReleaseSnapshot({ primarySubject: subject, subjects: [subject], observations: [], lineage: { edges: [], gaps: [] }, policyInputs: { profile: "free" }, coverage: { ...coverage, producers: [{ ...coverage.producers[0]!, state: "failed" as const }] } });
  assert.equal(first.schemaVersion, "1.3.0");
  assert.deepEqual(first.coverage, coverage);
  assert.equal(first.snapshotDigest, same.snapshotDigest);
  assert.notEqual(first.snapshotDigest, changed.snapshotDigest);
  assert.equal(Object.isFrozen(first), true);
  assert.equal(Object.isFrozen(first.coverage), true);
  assert.equal(Object.isFrozen(first.coverage.producers), true);
  assert.throws(() => createReleaseSnapshot({ primarySubject: subject, subjects: [subject], observations: [], lineage: { edges: [], gaps: [] }, policyInputs: {}, coverage: { ...coverage, status: "complete" } }));
});

test("release snapshot v1.3 binds validated severity and remediation summaries", () => {
  const observation = (severity: "high" | "critical") => ({
    schemaId: "urn:verglos:schema:observation",
    schemaVersion: "1.0.0",
    observationId: "urn:uuid:12345678-1234-4123-8123-123456789abc",
    subjectId: subject.subjectId,
    origin: { kind: "native", producerId: "verglos.native-scanner", runId: "urn:uuid:22345678-1234-4123-8123-123456789abc", ruleId: "D1-001" },
    coverageClass: "native",
    category: "security.test",
    title: "Test observation",
    description: "Validated test observation.",
    locations: [{ kind: "artifact", path: "finding.json" }],
    severity: { original: { system: "test", value: severity }, normalized: severity, mapping: { id: "test.severity-map", version: "1.0.0" } },
    confidence: { level: "high", method: "test.confidence", mappingVersion: "1.0.0" },
    remediation: { summary: "Apply the documented fix." },
    evidence: [], references: [], extensions: {},
  });
  const make = (severity: "high" | "critical") => createReleaseSnapshot({
    primarySubject: subject,
    subjects: [subject],
    observations: [{ fingerprint: `sha256:${"a".repeat(64)}`, producerIds: ["verglos.native-scanner"], payloads: [observation(severity)], disagreement: false }],
    lineage: { edges: [], gaps: [] },
    policyInputs: { profile: "free" },
    coverage: { schemaVersion: "1.0.0", status: "complete", target: { state: "complete", limitations: [] }, producers: [{ producer: "native", state: "complete", observationCount: 1, runIds: [], sourceDigests: [], limitations: [] }] },
  });
  const snapshot = make("high");
  assert.equal(snapshot.observations[0]?.severity.status, "known");
  assert.equal(snapshot.observations[0]?.severity.status === "known" ? snapshot.observations[0].severity.value : undefined, "high");
  assert.deepEqual(snapshot.observations[0]?.remediationSummaries, ["Apply the documented fix."]);
  assert.deepEqual(parseReleaseSnapshot(snapshot), snapshot);
  const forged = { ...snapshot, observations: [{ ...snapshot.observations[0]!, severity: { status: "known" as const, value: "critical" as const } }] };
  assert.throws(() => parseReleaseSnapshot(forged), /digest does not match/);
  assert.notEqual(snapshot.snapshotDigest, make("critical").snapshotDigest);
});

test("release snapshot v1.3 retains safe attribution, evidence digest, confidence, run time, and engine health", () => {
  const runId = "urn:uuid:22345678-1234-4123-8123-123456789abc";
  const engine = {
    producer: { id: "verglos.native-scanner", kind: "native", name: "Verglos native scanner", version: "2.0.0" },
    observedAt: "2026-09-09T00:00:01.000Z",
    state: "healthy",
    components: [{ id: "scanner.binary", kind: "binary", name: "Verglos scanner", version: "2.0.0", digest: { algorithm: "sha256", value: "b".repeat(64) }, source: "bundled", trust: "verified" }],
    capabilities: [{ id: "repository.scan", subjectKinds: ["filesystem"], status: "supported" }],
    freshness: [],
    incompleteReasons: [],
  } as const;
  const toolRun = parseToolRun({
    schemaId: TOOL_RUN_SCHEMA.id, schemaVersion: TOOL_RUN_SCHEMA.version, runId, subjectId: subject.subjectId,
    engine, requestedCapabilities: ["repository.scan"], executedCapabilities: ["repository.scan"], executionClass: "in-process",
    networkAccess: "none", targetCodeExecuted: false, startedAt: "2026-09-09T00:00:00.000Z", completedAt: "2026-09-09T00:00:01.000Z",
    durationMs: 1000, timeoutMs: 30_000, outcome: "succeeded", processResult: { kind: "exited", code: 0 }, coverage: "complete", incompleteReasons: [],
  });
  const payload = {
    schemaId: "urn:verglos:schema:observation", schemaVersion: "1.0.0", observationId: "urn:uuid:12345678-1234-4123-8123-123456789abc",
    subjectId: subject.subjectId, origin: { kind: "native", producerId: "verglos.native-scanner", runId, ruleId: "D1-001", rawEvidenceDigest: { algorithm: "sha512", value: "c".repeat(128) } },
    coverageClass: "native", category: "security.test", title: "Test", description: "Validated test", locations: [{ kind: "artifact", path: "finding.json" }],
    severity: { original: { system: "test", value: "high" }, normalized: "high", mapping: { id: "test.severity", version: "1.0.0" } },
    confidence: { level: "high", score: 0.9, method: "test.confidence", mappingVersion: "1.0.0" },
    evidence: [{ kind: "excerpt", classification: "secret", handling: "omitted", description: "secret fixture marker" }], references: [], extensions: {},
  };
  const coverage = { schemaVersion: "1.1.0" as const, status: "complete" as const, target: { state: "complete" as const, limitations: [] }, producers: [{ producer: "native" as const, state: "complete" as const, observationCount: 1, runIds: [runId], sourceDigests: [], limitations: [], toolRuns: [toolRun] }] };
  const snapshot = createReleaseSnapshot({ primarySubject: subject, subjects: [subject], observations: [{ fingerprint: `sha256:${"a".repeat(64)}`, producerIds: ["verglos.native-scanner"], payloads: [payload], disagreement: false }], lineage: { edges: [], gaps: [] }, policyInputs: {}, coverage });
  const evidence = snapshot.observations[0]!.evidence[0]!;
  assert.deepEqual(evidence.rawEvidenceDigest, { algorithm: "sha512", value: "c".repeat(128) });
  assert.deepEqual(evidence.confidence, { level: "high", score: 0.9, method: "test.confidence", mappingVersion: "1.0.0" });
  assert.deepEqual(evidence.timestamp, { status: "available", startedAt: toolRun.startedAt, completedAt: toolRun.completedAt });
  assert.equal(evidence.engineHealth.state, "healthy");
  assert.doesNotMatch(JSON.stringify(snapshot), /secret fixture marker/);
  assert.deepEqual(parseReleaseSnapshot(snapshot), snapshot);
  const misbound = createReleaseSnapshot({ primarySubject: subject, subjects: [subject], observations: [{ fingerprint: `sha256:${"a".repeat(64)}`, producerIds: ["different.producer"], payloads: [payload], disagreement: false }], lineage: { edges: [], gaps: [] }, policyInputs: {}, coverage });
  assert.equal(misbound.observations[0]?.severity.status, "unavailable");
  assert.equal(misbound.observations[0]?.invalidEvidenceCount, 1);
  assert.deepEqual(misbound.observations[0]?.evidence, []);
});

test("release snapshot reader keeps v1.2 severity snapshots digest-verifiable", () => {
  const current = createReleaseSnapshot({ primarySubject: subject, subjects: [subject], observations: [], lineage: { edges: [], gaps: [] }, policyInputs: {}, coverage: completeCoverage });
  const { snapshotDigest: _discarded, ...currentUnsigned } = current;
  const unsigned = { ...currentUnsigned, schemaVersion: "1.2.0" as const, observations: [] };
  const snapshotDigest = `sha256:${createHash("sha256").update(canonicalizeJson(unsigned), "utf8").digest("hex")}`;
  assert.equal(parseReleaseSnapshot({ ...unsigned, snapshotDigest }).schemaVersion, "1.2.0");
});

test("release snapshot reader verifies legacy v1.0 digests", () => {
  const unsigned = { schemaVersion: "1.0.0", primarySubjectId: subject.subjectId, subjectIds: [subject.subjectId], observations: [], lineage: { edges: [], gaps: [] }, policyInputDigest: `sha256:${"b".repeat(64)}` };
  const snapshotDigest = `sha256:${createHash("sha256").update(canonicalizeJson(unsigned), "utf8").digest("hex")}`;
  assert.equal(parseReleaseSnapshot({ ...unsigned, snapshotDigest }).schemaVersion, "1.0.0");
});

test("release snapshot reader preserves verified v1.1 coverage snapshots", () => {
  const unsigned = {
    schemaVersion: "1.1.0",
    primarySubjectId: subject.subjectId,
    subjectIds: [subject.subjectId],
    observations: [],
    lineage: { edges: [], gaps: [] },
    policyInputDigest: `sha256:${"b".repeat(64)}`,
    coverage: { schemaVersion: "1.0.0", status: "complete", target: { state: "complete", limitations: [] }, producers: [{ producer: "native", state: "complete", observationCount: 0, runIds: [], sourceDigests: [], limitations: [] }] },
  };
  const snapshotDigest = `sha256:${createHash("sha256").update(canonicalizeJson(unsigned), "utf8").digest("hex")}`;
  const parsed = parseReleaseSnapshot({ ...unsigned, snapshotDigest });
  assert.equal(parsed.schemaVersion, "1.1.0");
  assert.equal("coverage" in parsed ? parsed.coverage?.status : undefined, "complete");
});
