import assert from "node:assert/strict";
import { generateKeyPairSync, sign } from "node:crypto";
import { test } from "node:test";
import { canonicalizeJson } from "./schema.js";
import { policyDocumentDigest, type PolicyDocument } from "./policy-document.js";
import { resolveOrganizationPolicy, verifyOrganizationPolicy } from "./organization-policy.js";

const policy: PolicyDocument = { schemaId: "urn:verglos:schema:policy-document", schemaVersion: "1.0.0", policyId: "verglos.policy.team", policyVersion: "1.0.0", checks: [{ id: "verglos.check.release", requirement: "required", onFailure: "BLOCK", severities: ["high"], minimumConfidence: 0.8, freshness: "current", coverage: "complete", artifactMatch: "required", hunt: "not-required" }], exceptions: { enabled: true, requireApproval: true }, approvals: { required: true, authorities: ["owner"] } };
const { privateKey, publicKey } = generateKeyPairSync("ed25519");
const publicKeyPem = publicKey.export({ format: "pem", type: "spki" }).toString();
import { createHash } from "node:crypto";
const activeKeyId = `sha256:${createHash("sha256").update(publicKey.export({ format: "der", type: "spki" })).digest("hex")}`;

function envelope() {
  const base = { schemaId: "urn:verglos:schema:organization-policy", schemaVersion: "1.0.0", organizationId: "org_acme", repositoryId: "repo_acme_app", policy, policyDigest: policyDocumentDigest(policy), keyId: activeKeyId, signer: { id: "policy-owner", issuer: "https://verglos.com" }, signedAt: "2026-10-03T00:00:00.000Z" } as const;
  return { ...base, signature: sign(null, Buffer.from(canonicalizeJson(base)), privateKey).toString("base64") };
}

test("organization policy verifies exact scope, digest, and active signer", () => {
  const result = verifyOrganizationPolicy(envelope(), { organizationId: "org_acme", repositoryId: "repo_acme_app" }, [{ keyId: activeKeyId, publicKeyPem, status: "active" }]);
  assert.equal(result.verified, true);
  if (result.verified) assert.equal(result.policyDigest, policyDocumentDigest(policy));
});

test("organization policy refuses cross-tenant, revoked, and tampered envelopes", () => {
  const value = envelope();
  assert.deepEqual(verifyOrganizationPolicy(value, { organizationId: "org_other", repositoryId: "repo_acme_app" }, [{ keyId: activeKeyId, publicKeyPem, status: "active" }]), { verified: false, reason: "organization-mismatch" });
  assert.deepEqual(verifyOrganizationPolicy(value, { organizationId: "org_acme", repositoryId: "repo_acme_app" }, [{ keyId: activeKeyId, publicKeyPem, status: "revoked" }]), { verified: false, reason: "key-not-active" });
  assert.deepEqual(verifyOrganizationPolicy({ ...value, policyDigest: `sha256:${"f".repeat(64)}` }, { organizationId: "org_acme", repositoryId: "repo_acme_app" }, [{ keyId: activeKeyId, publicKeyPem, status: "active" }]), { verified: false, reason: "policy-digest-mismatch" });
});

test("remote resolution returns a bounded cache entry and offline mode uses only unexpired matching cache", () => {
  const value = envelope();
  const keys = [{ keyId: activeKeyId, publicKeyPem, status: "active" as const }];
  const remote = resolveOrganizationPolicy({ organizationId: "org_acme", repositoryId: "repo_acme_app", now: "2026-10-03T00:00:00.000Z", offline: false, remote: value, trustedKeys: keys, cacheTtlMs: 86_400_000 });
  assert.equal(remote.resolved, true);
  if (!remote.resolved) return;
  assert.equal(remote.entry.source, "remote");
  const offline = resolveOrganizationPolicy({ organizationId: "org_acme", repositoryId: "repo_acme_app", now: "2026-10-03T12:00:00.000Z", offline: true, cached: remote.entry, trustedKeys: keys, cacheTtlMs: 86_400_000 });
  assert.equal(offline.resolved, true);
  const expired = resolveOrganizationPolicy({ organizationId: "org_acme", repositoryId: "repo_acme_app", now: "2026-10-04T00:00:00.001Z", offline: true, cached: remote.entry, trustedKeys: keys, cacheTtlMs: 86_400_000 });
  assert.deepEqual(expired, { resolved: false, reason: "cache-expired" });
});
