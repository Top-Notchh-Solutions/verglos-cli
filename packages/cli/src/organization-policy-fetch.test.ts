import assert from "node:assert/strict";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { createHash, createPublicKey, generateKeyPairSync, sign } from "node:crypto";
import { canonicalizeJson, policyDocumentDigest, type OrganizationPolicyPublicKey, type PolicyDocument } from "@verglos/shared";
import { fetchOrganizationPolicy } from "./organization-policy-fetch.js";

const policy: PolicyDocument = { schemaId: "urn:verglos:schema:policy-document", schemaVersion: "1.0.0", policyId: "verglos.policy.team", policyVersion: "1.0.0", checks: [{ id: "verglos.check.release", requirement: "required", onFailure: "BLOCK", severities: ["high"], minimumConfidence: 0.8, freshness: "current", coverage: "complete", artifactMatch: "required", hunt: "not-required" }], exceptions: { enabled: true, requireApproval: true }, approvals: { required: true, authorities: ["owner"] } };
function fixture() {
  const keys = generateKeyPairSync("ed25519");
  const publicKeyPem = keys.publicKey.export({ type: "spki", format: "pem" }).toString();
  const keyId = `sha256:${createHash("sha256").update(createPublicKey(publicKeyPem).export({ format: "der", type: "spki" })).digest("hex")}`;
  const unsigned = { schemaId: "urn:verglos:schema:organization-policy", schemaVersion: "1.0.0", organizationId: "org_acme", repositoryId: "repo_app", policy, policyDigest: policyDocumentDigest(policy), keyId, signer: { id: "policy-signer", issuer: "https://verglos.com" }, signedAt: "2026-10-06T00:00:00.000Z" };
  return { envelope: { ...unsigned, signature: sign(null, Buffer.from(canonicalizeJson(unsigned)), keys.privateKey).toString("base64") }, trustedKeys: [{ keyId, publicKeyPem, status: "active" }] as OrganizationPolicyPublicKey[] };
}

test("fetches, verifies, and persists a remote policy without exposing credentials", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-org-policy-fetch-"));
  const fixtureData = fixture();
  const result = await fetchOrganizationPolicy({ organizationId: "org_acme", repositoryId: "repo_app", trustedKeys: fixtureData.trustedKeys, cachePath: join(root, "policy.json"), apiUrl: "https://example.test", licenseKey: "secret-not-output", fetchImpl: async () => new Response(JSON.stringify(fixtureData.envelope), { status: 200, headers: { "content-type": "application/json" } }) });
  assert.equal(result.resolved, true); assert.equal(result.source, "remote"); assert.equal(result.entry?.policyDigest, policyDocumentDigest(policy));
});

test("falls back to a verified cache when the remote is unavailable", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-org-policy-cache-"));
  const fixtureData = fixture();
  const first = await fetchOrganizationPolicy({ organizationId: "org_acme", repositoryId: "repo_app", trustedKeys: fixtureData.trustedKeys, cachePath: join(root, "policy.json"), apiUrl: "https://example.test", licenseKey: "secret", now: "2026-10-06T00:00:00.000Z", fetchImpl: async () => new Response(JSON.stringify(fixtureData.envelope), { status: 200 }) });
  assert.equal(first.resolved, true);
  const second = await fetchOrganizationPolicy({ organizationId: "org_acme", repositoryId: "repo_app", trustedKeys: fixtureData.trustedKeys, cachePath: join(root, "policy.json"), offline: true, now: "2026-10-06T01:00:00.000Z" });
  assert.equal(second.resolved, true); assert.equal(second.source, "cache");
});
