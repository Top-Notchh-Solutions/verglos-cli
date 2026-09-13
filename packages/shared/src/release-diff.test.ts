import assert from "node:assert/strict";
import { test } from "node:test";
import { diffReleaseSnapshots } from "./release-diff.js";
import { createReleaseSnapshot } from "./release-snapshot.js";
import { createSubject } from "./subject.js";

const subject = createSubject({ kind: "artifact", digest: { algorithm: "sha256", value: "e".repeat(64) }, size: 1, mediaType: "application/octet-stream" });
const coverageFor = (observationCount: number) => ({ schemaVersion: "1.0.0" as const, status: "complete" as const, target: { state: "complete" as const, limitations: [] }, producers: [{ producer: "native" as const, state: "complete" as const, observationCount, runIds: [], sourceDigests: [], limitations: [] }] });
const snapshot = (fingerprints: string[], policyInputs = { mode: "free" }) => createReleaseSnapshot({ primarySubject: subject, subjects: [subject], observations: fingerprints.map((fingerprint) => ({ fingerprint, producerIds: ["native"], payloads: [], disagreement: false })), lineage: { edges: [], gaps: [] }, policyInputs, coverage: coverageFor(fingerprints.length) });

test("release diff classifies observations and explicit state changes", () => {
  const result = diffReleaseSnapshots(snapshot([`sha256:${"a".repeat(64)}`, `sha256:${"b".repeat(64)}`]), snapshot([`sha256:${"b".repeat(64)}`, `sha256:${"c".repeat(64)}`], { mode: "team" }));
  assert.deepEqual(result.added, [`sha256:${"c".repeat(64)}`]);
  assert.deepEqual(result.fixed, [`sha256:${"a".repeat(64)}`]);
  assert.deepEqual(result.unchanged, [`sha256:${"b".repeat(64)}`]);
  assert.equal(result.policyChanged, true);
  assert.equal(result.identityChanged, false);
  assert.equal(result.coverageChanged, false);
});
test("release diff compares identity and coverage canonically", () => {
  const base = snapshot([]); const head = { ...base, subjectIds: [...base.subjectIds].reverse(), lineage: { edges: [...base.lineage.edges].reverse(), gaps: [...base.lineage.gaps].reverse() } } as typeof base;
  const result = diffReleaseSnapshots(base, head); assert.equal(result.identityChanged, false); assert.equal(result.coverageChanged, false);
});

test("release diff reports producer coverage changes in snapshot v1.2", () => {
  const baseCoverage = coverageFor(0);
  const headCoverage = coverageFor(1);
  const base = createReleaseSnapshot({ primarySubject: subject, subjects: [subject], observations: [], lineage: { edges: [], gaps: [] }, policyInputs: {}, coverage: baseCoverage });
  const head = createReleaseSnapshot({ primarySubject: subject, subjects: [subject], observations: [], lineage: { edges: [], gaps: [] }, policyInputs: {}, coverage: headCoverage });
  const result = diffReleaseSnapshots(base, head);
  assert.equal(base.schemaVersion, "1.2.0");
  assert.equal(result.coverageChanged, true);
  assert.equal(result.coverageDelta.before.producers[0]?.observationCount, 0);
  assert.equal(result.coverageDelta.after.producers[0]?.observationCount, 1);
});

test("release diff reports target coverage state and limitations", () => {
  const baseCoverage = coverageFor(0);
  const headCoverage = { ...baseCoverage, status: "incomplete" as const, target: { state: "incomplete" as const, limitations: ["target inspection timed out"] }, producers: [{ ...baseCoverage.producers[0]!, state: "incomplete" as const, limitations: ["target inspection timed out"] }] };
  const base = createReleaseSnapshot({ primarySubject: subject, subjects: [subject], observations: [], lineage: { edges: [], gaps: [] }, policyInputs: {}, coverage: baseCoverage });
  const head = createReleaseSnapshot({ primarySubject: subject, subjects: [subject], observations: [], lineage: { edges: [], gaps: [] }, policyInputs: {}, coverage: headCoverage });
  const result = diffReleaseSnapshots(base, head);
  assert.equal(result.coverageChanged, true);
  assert.deepEqual(result.coverageDelta.before.target, { state: "complete", limitations: [] });
  assert.deepEqual(result.coverageDelta.after.target, { state: "incomplete", limitations: ["target inspection timed out"] });
});

test("release diff reports severity worsening only from validated matching-fingerprint evidence", () => {
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
    evidence: [], references: [], extensions: {},
  });
  const make = (severity: "high" | "critical") => createReleaseSnapshot({ primarySubject: subject, subjects: [subject], observations: [{ fingerprint: `sha256:${"a".repeat(64)}`, producerIds: ["verglos.native-scanner"], payloads: [observation(severity)], disagreement: false }], lineage: { edges: [], gaps: [] }, policyInputs: {}, coverage: coverageFor(1) });
  const result = diffReleaseSnapshots(make("high"), make("critical"));
  assert.deepEqual(result.worsened, [`sha256:${"a".repeat(64)}`]);
  assert.deepEqual(result.improved, []);
  assert.deepEqual(result.severityUnassessed, []);
  const improvement = diffReleaseSnapshots(make("critical"), make("high"));
  assert.deepEqual(improvement.worsened, []);
  assert.deepEqual(improvement.improved, [`sha256:${"a".repeat(64)}`]);
});
