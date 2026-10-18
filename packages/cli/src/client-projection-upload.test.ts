import assert from "node:assert/strict";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { clientProjectionDigest } from "@verglos/shared";
import { uploadClientProjection } from "./client-projection-upload.js";

const projection = {
  organizationId: "org_acme",
  clientWorkspaceId: "client_zenith",
  recordDigest: `sha256:${"a".repeat(64)}`,
  decision: "PASS" as const,
  coverageStatus: "not-established" as const,
  signerStatus: "unverified" as const,
  limitations: ["Limitation details withheld from this public projection."],
};
const approvedProjection = {
  ...projection,
  schemaId: "urn:verglos:schema:client-projection",
  schemaVersion: "1.0.0",
} as const;
const approval = {
  action: "client-projection-upload" as const,
  approvalId: "approval_1",
  organizationId: projection.organizationId,
  clientWorkspaceId: projection.clientWorkspaceId,
  recordDigest: projection.recordDigest,
  projectionDigest: clientProjectionDigest(approvedProjection),
  approvedBy: "owner_1",
  issuedAt: "2026-10-06T00:00:00.000Z",
  expiresAt: "2099-10-07T00:00:00.000Z",
};

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), "verglos-client-projection-upload-"));
  await writeFile(join(root, "projection.json"), JSON.stringify(projection));
  await writeFile(join(root, "approval.json"), JSON.stringify(approval));
  return { root, projectionPath: join(root, "projection.json"), approvalPath: join(root, "approval.json") };
}

test("client projection upload sends only the exact approved redacted projection", async () => {
  const files = await fixture();
  let seenUrl = "";
  let seenInit: RequestInit | undefined;
  try {
    const result = await uploadClientProjection({
      projectionPath: files.projectionPath,
      approvalPath: files.approvalPath,
      organizationId: projection.organizationId,
      projectId: "project_1",
      apiUrl: "https://verglos.test",
      licenseKey: "license-sentinel",
      now: "2026-10-06T01:00:00.000Z",
      fetchImpl: async (input, init) => {
        seenUrl = String(input);
        seenInit = init;
        return new Response(JSON.stringify({ id: "custody_1", projectionDigest: approval.projectionDigest, idempotent: false }), { status: 201 });
      },
    });
    assert.deepEqual(result, { status: "uploaded", endpoint: "https://verglos.test/api/v1/organizations/org_acme/projects/project_1/client-projections", projectionDigest: approval.projectionDigest, idempotent: false, id: "custody_1" });
    assert.equal(seenUrl, result.endpoint);
    assert.equal(seenInit?.method, "POST");
    assert.equal(new Headers(seenInit?.headers).get("authorization"), "Bearer license-sentinel");
    const body = JSON.parse(String(seenInit?.body)) as { projection: Record<string, unknown>; approval: Record<string, unknown> };
    assert.deepEqual(body.projection, approvedProjection);
    assert.deepEqual(body.approval, approval);
    assert.equal("source" in body.projection, false);
  } finally {
    await import("node:fs/promises").then(({ rm }) => rm(files.root, { recursive: true, force: true }));
  }
});

test("client projection upload refuses private fields before network access", async () => {
  const files = await fixture();
  await writeFile(files.projectionPath, JSON.stringify({ ...projection, source: "private-source-canary" }));
  let called = false;
  try {
    const result = await uploadClientProjection({
      projectionPath: files.projectionPath,
      approvalPath: files.approvalPath,
      organizationId: projection.organizationId,
      projectId: "project_1",
      apiUrl: "https://verglos.test",
      licenseKey: "license-sentinel",
      fetchImpl: async () => { called = true; return new Response(); },
    });
    assert.deepEqual(result, { status: "denied", reason: "private_field" });
    assert.equal(called, false);
  } finally {
    await import("node:fs/promises").then(({ rm }) => rm(files.root, { recursive: true, force: true }));
  }
});

test("client projection upload rejects a server digest that does not match the preview", async () => {
  const files = await fixture();
  try {
    const result = await uploadClientProjection({
      projectionPath: files.projectionPath,
      approvalPath: files.approvalPath,
      organizationId: projection.organizationId,
      projectId: "project_1",
      apiUrl: "https://verglos.test",
      licenseKey: "license-sentinel",
      fetchImpl: async () => new Response(JSON.stringify({ id: "custody_1", projectionDigest: `sha256:${"f".repeat(64)}`, idempotent: false }), { status: 201 }),
    });
    assert.deepEqual(result, { status: "error", endpoint: "https://verglos.test/api/v1/organizations/org_acme/projects/project_1/client-projections", reason: "invalid_response" });
  } finally {
    await import("node:fs/promises").then(({ rm }) => rm(files.root, { recursive: true, force: true }));
  }
});

test("client projection upload binds a caller-supplied endpoint to the organization project route", async () => {
  const files = await fixture();
  let called = false;
  try {
    const result = await uploadClientProjection({
      projectionPath: files.projectionPath,
      approvalPath: files.approvalPath,
      organizationId: projection.organizationId,
      projectId: "project_1",
      apiUrl: "https://verglos.test",
      licenseKey: "license-sentinel",
      endpoint: "/api/v1/organizations/org_acme/projects/project_1/client-projections?redirect=https://attacker.test",
      fetchImpl: async () => {
        called = true;
        return new Response(JSON.stringify({ projectionDigest: approval.projectionDigest, idempotent: false }), { status: 201 });
      },
    });
    assert.deepEqual(result, { status: "error", reason: "invalid_input" });
    assert.equal(called, false);
  } finally {
    await import("node:fs/promises").then(({ rm }) => rm(files.root, { recursive: true, force: true }));
  }
});

test("client projection upload rejects an unsafe or unbounded server identifier", async () => {
  const files = await fixture();
  try {
    const result = await uploadClientProjection({
      projectionPath: files.projectionPath,
      approvalPath: files.approvalPath,
      organizationId: projection.organizationId,
      projectId: "project_1",
      apiUrl: "https://verglos.test",
      licenseKey: "license-sentinel",
      fetchImpl: async () => new Response(JSON.stringify({ id: "custody_1\nleak", projectionDigest: approval.projectionDigest, idempotent: false }), { status: 201 }),
    });
    assert.deepEqual(result, { status: "error", endpoint: "https://verglos.test/api/v1/organizations/org_acme/projects/project_1/client-projections", reason: "invalid_response" });
  } finally {
    await import("node:fs/promises").then(({ rm }) => rm(files.root, { recursive: true, force: true }));
  }
});

test("client projection upload cancels an oversized streamed response", async () => {
  const files = await fixture();
  let cancelled = false;
  try {
    const result = await uploadClientProjection({
      projectionPath: files.projectionPath,
      approvalPath: files.approvalPath,
      organizationId: projection.organizationId,
      projectId: "project_1",
      apiUrl: "https://verglos.test",
      licenseKey: "license-sentinel",
      fetchImpl: async () => new Response(new ReadableStream<Uint8Array>({
        pull(controller) { controller.enqueue(new Uint8Array(64 * 1024 + 1)); },
        cancel() { cancelled = true; },
      }), { status: 201 }),
    });
    assert.deepEqual(result, { status: "error", endpoint: "https://verglos.test/api/v1/organizations/org_acme/projects/project_1/client-projections", reason: "response_too_large" });
    assert.equal(cancelled, true);
  } finally {
    await import("node:fs/promises").then(({ rm }) => rm(files.root, { recursive: true, force: true }));
  }
});
