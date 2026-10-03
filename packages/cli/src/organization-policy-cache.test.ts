import assert from "node:assert/strict";
import { mkdtemp, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { policyDocumentDigest, type OrganizationPolicyCacheEntry, type PolicyDocument } from "@verglos/shared";
import { readOrganizationPolicyCache, writeOrganizationPolicyCache } from "./organization-policy-cache.js";

const policy: PolicyDocument = { schemaId: "urn:verglos:schema:policy-document", schemaVersion: "1.0.0", policyId: "verglos.policy.team", policyVersion: "1.0.0", checks: [{ id: "verglos.check.release", requirement: "required", onFailure: "BLOCK", severities: ["high"], minimumConfidence: 0.8, freshness: "current", coverage: "complete", artifactMatch: "required", hunt: "not-required" }], exceptions: { enabled: true, requireApproval: true }, approvals: { required: true, authorities: ["owner"] } };
const entry: OrganizationPolicyCacheEntry = { organizationId: "org_acme", repositoryId: "repo_app", policy, policyDigest: policyDocumentDigest(policy), cachedAt: "2026-10-03T00:00:00.000Z", expiresAt: "2026-10-04T00:00:00.000Z", source: "remote" };

test("organization policy cache writes atomically and reads a validated entry", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-policy-cache-"));
  const path = join(root, "org", "repo.json");
  await writeOrganizationPolicyCache(path, entry);
  assert.deepEqual(await readOrganizationPolicyCache(path, entry), entry);
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
