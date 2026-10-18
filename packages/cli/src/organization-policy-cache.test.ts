import assert from "node:assert/strict";
import { chmod, mkdir, mkdtemp, stat, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { policyDocumentDigest, type OrganizationPolicyCacheEntry, type PolicyDocument } from "@verglos/shared";
import { readOrganizationPolicyCache, writeOrganizationPolicyCache } from "./organization-policy-cache.js";

const policy: PolicyDocument = { schemaId: "urn:verglos:schema:policy-document", schemaVersion: "1.0.0", policyId: "verglos.policy.team", policyVersion: "1.0.0", checks: [{ id: "verglos.check.release", requirement: "required", onFailure: "BLOCK", severities: ["high"], minimumConfidence: 0.8, freshness: "current", coverage: "complete", artifactMatch: "required", hunt: "not-required" }], exceptions: { enabled: true, requireApproval: true }, approvals: { required: true, authorities: ["owner"] } };
const entry: OrganizationPolicyCacheEntry = { organizationId: "org_acme", repositoryId: "repo_app", policy, policyDigest: policyDocumentDigest(policy), keyId: `sha256:${"a".repeat(64)}`, signature: "c2lnbmF0dXJl", signer: { id: "policy-signer", issuer: "https://verglos.com" }, signedAt: "2026-10-03T00:00:00.000Z", cachedAt: "2026-10-03T00:00:00.000Z", expiresAt: "2026-10-04T00:00:00.000Z", source: "remote" };

test("organization policy cache writes atomically and reads a validated entry", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-policy-cache-"));
  const path = join(root, "org", "repo.json");
  await writeOrganizationPolicyCache(path, entry);
  assert.deepEqual(await readOrganizationPolicyCache(path, entry), entry);
  if (process.platform !== "win32") {
    const directory = await stat(join(root, "org"));
    const file = await stat(path);
    assert.equal(directory.mode & 0o777, 0o700);
    assert.equal(file.mode & 0o777, 0o600);
  }
});

test("organization policy cache repairs an existing parent directory before atomic replacement", async () => {
  if (process.platform === "win32") return;
  const root = await mkdtemp(join(tmpdir(), "verglos-policy-cache-parent-"));
  const directory = join(root, "org");
  const path = join(directory, "repo.json");
  await mkdir(directory, { mode: 0o755 });
  await chmod(directory, 0o755);
  await writeOrganizationPolicyCache(path, entry);
  assert.equal((await stat(directory)).mode & 0o777, 0o700);
});

test("organization policy cache refuses scope/digest tampering and symlink targets", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-policy-cache-boundary-"));
  const path = join(root, "cache.json");
  await writeFile(path, JSON.stringify({ ...entry, policyDigest: `sha256:${"f".repeat(64)}` }));
  await assert.rejects(() => readOrganizationPolicyCache(path, entry), /digest does not match/u);
  const link = join(root, "link.json");
  await symlink(path, link);
  await assert.rejects(() => readOrganizationPolicyCache(link, entry), /bounded regular file/u);
});
