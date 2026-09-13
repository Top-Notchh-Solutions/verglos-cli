import assert from "node:assert/strict";
import { test } from "node:test";
import { diffReleaseSnapshots } from "./release-diff.js";
import { createReleaseSnapshot } from "./release-snapshot.js";
import { createSubject } from "./subject.js";

const subject = createSubject({ kind: "artifact", digest: { algorithm: "sha256", value: "e".repeat(64) }, size: 1, mediaType: "application/octet-stream" });
const snapshot = (fingerprints: string[], policyInputs = { mode: "free" }) => createReleaseSnapshot({ primarySubject: subject, subjects: [subject], observations: fingerprints.map((fingerprint) => ({ fingerprint, producerIds: ["native"], payloads: [], disagreement: false })), lineage: { edges: [], gaps: [] }, policyInputs });

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

test("release diff reports producer coverage changes in snapshot v1.1", () => {
  const coverage = { schemaVersion: "1.0.0" as const, status: "complete" as const, target: { state: "complete" as const, limitations: [] }, producers: [{ producer: "native" as const, state: "complete" as const, observationCount: 0, runIds: [], sourceDigests: [], limitations: [] }] };
  const base = createReleaseSnapshot({ primarySubject: subject, subjects: [subject], observations: [], lineage: { edges: [], gaps: [] }, policyInputs: {}, coverage });
  const head = createReleaseSnapshot({ primarySubject: subject, subjects: [subject], observations: [], lineage: { edges: [], gaps: [] }, policyInputs: {}, coverage: { ...coverage, producers: [{ ...coverage.producers[0]!, observationCount: 1 }] } });
  assert.equal(diffReleaseSnapshots(base, head).coverageChanged, true);
});
