import assert from "node:assert/strict";
import { test } from "node:test";
import { createReleaseSnapshot } from "./release-snapshot.js";
import { createSubject } from "./subject.js";

const subject = createSubject({ kind: "artifact", digest: { algorithm: "sha256", value: "d".repeat(64) }, size: 1, mediaType: "application/octet-stream" });

test("release snapshots are deterministic and retain coverage gaps", () => {
  const args = { primarySubject: subject, subjects: [subject], observations: [{ fingerprint: "sha256:" + "a".repeat(64), producerIds: ["trivy", "native"], payloads: [], disagreement: true }], lineage: { edges: [], gaps: ["missing build evidence"] }, policyInputs: { checks: ["critical"], threshold: 1 } };
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
  assert.equal(first.schemaVersion, "1.1.0");
  assert.deepEqual(first.coverage, coverage);
  assert.equal(first.snapshotDigest, same.snapshotDigest);
  assert.notEqual(first.snapshotDigest, changed.snapshotDigest);
  assert.equal(Object.isFrozen(first), true);
  assert.equal(Object.isFrozen(first.coverage), true);
  assert.equal(Object.isFrozen(first.coverage.producers), true);
  assert.throws(() => createReleaseSnapshot({ primarySubject: subject, subjects: [subject], observations: [], lineage: { edges: [], gaps: [] }, policyInputs: {}, coverage: { ...coverage, status: "complete" } }));
});
