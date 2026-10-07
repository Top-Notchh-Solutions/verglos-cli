import assert from "node:assert/strict";
import { test } from "node:test";
import { admitClientProjectionUpload, clientProjectionDigest } from "./client-projection.js";

const base = { organizationId: "org_acme", clientWorkspaceId: "client_zenith", recordDigest: `sha256:${"a".repeat(64)}`, decision: "PASS", subjectDigest: `sha256:${"b".repeat(64)}` } as const;
const approvedProjection = { ...base, schemaId: "urn:verglos:schema:client-projection", schemaVersion: "1.0.0" } as const;
const approval = { action: "client-projection-upload" as const, approvalId: "approval_1", organizationId: "org_acme", clientWorkspaceId: "client_zenith", recordDigest: base.recordDigest, projectionDigest: clientProjectionDigest(approvedProjection), approvedBy: "owner_1", issuedAt: "2026-10-06T00:00:00.000Z", expiresAt: "2026-10-07T00:00:00.000Z" };

test("admits a bounded tenant/workspace/record-bound redacted projection", () => {
  const result = admitClientProjectionUpload({ actorOrganizationId: "org_acme", projection: base, approval, now: "2026-10-06T01:00:00.000Z" });
  assert.equal(result.ok, true);
  if (result.ok) { assert.match(result.projectionDigest, /^sha256:[a-f0-9]{64}$/u); assert.equal(result.projection.schemaId, "urn:verglos:schema:client-projection"); }
});

test("refuses cross-tenant, private-field, and missing-approval projections", () => {
  assert.deepEqual(admitClientProjectionUpload({ actorOrganizationId: "org_other", projection: base, approval, now: "2026-10-06T01:00:00.000Z" }), { ok: false, reason: "cross_tenant" });
  assert.deepEqual(admitClientProjectionUpload({ actorOrganizationId: "org_acme", projection: { ...base, source: "private" }, approval, now: "2026-10-06T01:00:00.000Z" }), { ok: false, reason: "private_field" });
  assert.deepEqual(admitClientProjectionUpload({ actorOrganizationId: "org_acme", projection: base, now: "2026-10-06T01:00:00.000Z" }), { ok: false, reason: "approval_required" });
});

test("refuses unknown or nested fields and approval for different preview bytes", () => {
  assert.deepEqual(admitClientProjectionUpload({ actorOrganizationId: "org_acme", projection: { ...base, arbitrary: { secret: "value" } }, approval, now: "2026-10-06T01:00:00.000Z" }), { ok: false, reason: "unsupported_field" });
  assert.deepEqual(admitClientProjectionUpload({ actorOrganizationId: "org_acme", projection: { ...base, limitations: ["private limitation"] }, approval, now: "2026-10-06T01:00:00.000Z" }), { ok: false, reason: "private_field" });
  assert.deepEqual(admitClientProjectionUpload({ actorOrganizationId: "org_acme", projection: { ...base, decision: "BLOCK" }, approval, now: "2026-10-06T01:00:00.000Z" }), { ok: false, reason: "approval_mismatch" });
});

test("refuses workspace/record drift and expired approvals", () => {
  assert.deepEqual(admitClientProjectionUpload({ actorOrganizationId: "org_acme", projection: { ...base, clientWorkspaceId: "client_other" }, approval, now: "2026-10-06T01:00:00.000Z" }), { ok: false, reason: "workspace_mismatch" });
  assert.deepEqual(admitClientProjectionUpload({ actorOrganizationId: "org_acme", projection: { ...base, recordDigest: `sha256:${"c".repeat(64)}` }, approval, now: "2026-10-06T01:00:00.000Z" }), { ok: false, reason: "record_mismatch" });
  assert.deepEqual(admitClientProjectionUpload({ actorOrganizationId: "org_acme", projection: base, approval, now: "2026-10-07T00:00:00.000Z" }), { ok: false, reason: "approval_expired" });
});
