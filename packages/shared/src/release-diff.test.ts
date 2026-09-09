import assert from "node:assert/strict";
import { test } from "node:test";
import { diffReleaseSnapshots } from "./release-diff.js";
import { createReleaseSnapshot } from "./release-snapshot.js";
import { createSubject } from "./subject.js";

const subject = createSubject({ kind: "artifact", digest: { algorithm: "sha256", value: "e".repeat(64) }, size: 1, mediaType: "application/octet-stream" });
const snapshot = (fingerprints: string[], policyInputs = { mode: "free" }) => createReleaseSnapshot({ primarySubject: subject, subjects: [subject], observations: fingerprints.map((fingerprint) => ({ fingerprint, producerIds: ["native"], payloads: [], disagreement: false })), lineage: { edges: [], gaps: [] }, policyInputs });

test("release diff classifies observations and explicit state changes", () => {
  const result = diffReleaseSnapshots(snapshot(["sha256:a", "sha256:b"]), snapshot(["sha256:b", "sha256:c"], { mode: "team" }));
  assert.deepEqual(result.added, ["sha256:c"]);
  assert.deepEqual(result.fixed, ["sha256:a"]);
  assert.deepEqual(result.unchanged, ["sha256:b"]);
  assert.equal(result.policyChanged, true);
  assert.equal(result.identityChanged, false);
  assert.equal(result.coverageChanged, false);
});
