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
