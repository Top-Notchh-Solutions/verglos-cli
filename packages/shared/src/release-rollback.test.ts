import assert from "node:assert/strict";
import { test } from "node:test";
import { decideReleaseRollback, RELEASE_ROLLBACK_KINDS, type ReleaseReference } from "./release-rollback.js";

const digest = (letter: string) => `sha256:${letter.repeat(64)}`;
const ref = (kind: ReleaseReference["kind"], identity: string, letter: string): ReleaseReference => ({ kind, identity, immutableRef: digest(letter) });

test("rollback kind surface is frozen and accepts each supported provider boundary", () => {
  assert.deepEqual(RELEASE_ROLLBACK_KINDS, ["npm-package", "engine-manifest", "hunt-feed", "signing-identity", "web-deployment"]);
  for (const kind of RELEASE_ROLLBACK_KINDS) {
    if (kind === "signing-identity") continue;
    const result = decideReleaseRollback({ current: ref(kind, `${kind}-current`, "a"), target: ref(kind, `${kind}-target`, "b"), approved: true, reason: "bounded incident response", preserveHistoricalRecords: true });
    assert.equal(result.allowed, true);
    assert.equal(result.action, "rollback");
  }
});

test("rollback requires explicit approval and immutable references", () => {
  const input = { current: ref("npm-package", "@verglos/cli@2.0.0-alpha.1", "a"), target: ref("npm-package", "@verglos/cli@1.8.3", "b"), reason: "bad release", preserveHistoricalRecords: true };
  assert.deepEqual(decideReleaseRollback({ ...input, approved: false }), { allowed: false, reason: "approval-required" });
  assert.deepEqual(decideReleaseRollback({ ...input, approved: true, target: { ...input.target, immutableRef: "latest" } }), { allowed: false, reason: "target-reference-invalid" });
});

test("rollback refuses same target and any request that invalidates historical records", () => {
  const current = ref("engine-manifest", "trivy", "a");
  assert.deepEqual(decideReleaseRollback({ current, target: current, approved: true, reason: "repair", preserveHistoricalRecords: true }), { allowed: false, reason: "same-reference" });
  assert.deepEqual(decideReleaseRollback({ current, target: ref("engine-manifest", "trivy", "b"), approved: true, reason: "repair", preserveHistoricalRecords: false }), { allowed: false, reason: "history-invalidation-requested" });
});

test("signing identity revocation requires a distinct replacement identity", () => {
  const current = ref("signing-identity", "org-key", "a");
  const target = ref("signing-identity", "org-key-revoked", "b");
  assert.deepEqual(decideReleaseRollback({ current, target, approved: true, reason: "key compromise", preserveHistoricalRecords: true }), { allowed: false, reason: "revocation-requires-replacement" });
  const replacement = ref("signing-identity", "org-key-successor", "c");
  const result = decideReleaseRollback({ current, target, replacementIdentity: replacement, approved: true, reason: "key compromise", preserveHistoricalRecords: true });
  assert.equal(result.allowed, true);
  if (result.allowed) assert.equal(result.action, "revoke");
});

test("non-signing rollback refuses an unrelated replacement identity", () => {
  const result = decideReleaseRollback({ current: ref("hunt-feed", "feed", "a"), target: ref("hunt-feed", "feed-old", "b"), replacementIdentity: ref("signing-identity", "key", "c"), approved: true, reason: "feed correction", preserveHistoricalRecords: true });
  assert.deepEqual(result, { allowed: false, reason: "revocation-not-applicable" });
});

test("tenant/source-like control text is bounded and never becomes an execution selector", () => {
  const result = decideReleaseRollback({ current: ref("web-deployment", "production", "a"), target: ref("web-deployment", "previous", "b"), approved: true, reason: "  bounded reason  ", preserveHistoricalRecords: true });
  assert.equal(result.allowed, true);
  if (result.allowed) assert.equal(result.reason, "bounded reason");
  assert.deepEqual(decideReleaseRollback({ current: ref("web-deployment", "production", "a"), target: ref("web-deployment", "previous", "b"), approved: true, reason: "\u0000", preserveHistoricalRecords: true }), { allowed: false, reason: "target-reference-invalid" });
});
