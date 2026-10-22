import assert from "node:assert/strict";
import test from "node:test";
import { freezeReleaseCandidate } from "./freeze-release-candidate.mjs";

const digest = (value) => `sha256:${value.repeat(64).slice(0, 64)}`;
const gates = { providerLifecycle: "open", customerConsent: "open", independentReview: "open", authenticatedBrowser: "passed", fieldCwv: "open", accountDeletion: "open", finalRelease: "open" };

function run(overrides = {}) {
  return {
    schema: "verglos.private.release-candidate-freeze.v1",
    candidate: { cliCommit: "74c9b4ff79c4b8f80e022c8f25f1d321357f9cf5", webCommit: "16ceddc9855e75e04f10ddd276fae16c7ef09e01", version: "2.0.0-alpha.1" },
    artifacts: [{ path: "release/SHA256SUMS", kind: "checksum", sha256: digest("a"), required: true, present: true }, { path: "release/provenance.json", kind: "provenance", sha256: digest("b"), required: true, present: false }],
    gates,
    decision: "open",
    ...overrides,
  };
}

test("freeze stays blocked and lists open gates and missing artifacts", () => {
  const report = freezeReleaseCandidate(run());
  assert.equal(report.freeze.status, "blocked");
  assert.equal(report.summary.openGateCount, 6);
  assert.deepEqual(report.missingArtifacts, ["release/provenance.json"]);
});

test("recorded GO fails closed while the candidate is incomplete", () => {
  assert.throws(() => freezeReleaseCandidate(run({ decision: "go" })), /GO cannot freeze/u);
});

test("all artifacts and gates passed produce a ready-for-signoff manifest", () => {
  const report = freezeReleaseCandidate(run({
    artifacts: [{ path: "release/SHA256SUMS", kind: "checksum", sha256: digest("c"), required: true, present: true }],
    gates: Object.fromEntries(Object.keys(gates).map((name) => [name, "passed"])),
  }));
  assert.equal(report.freeze.status, "ready-for-signoff");
  assert.equal(report.freeze.goEligible, true);
});

test("unsafe paths and invalid digests are rejected", () => {
  assert.throws(() => freezeReleaseCandidate(run({ artifacts: [{ path: "../secrets", kind: "other", sha256: digest("d"), required: false, present: true }] })), /unsafe freeze artifact path/u);
  assert.throws(() => freezeReleaseCandidate(run({ artifacts: [{ path: "release/out", kind: "other", sha256: "sha256:not-a-digest", required: false, present: true }] })), /digest is invalid/u);
});
