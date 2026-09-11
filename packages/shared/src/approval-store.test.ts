import assert from "node:assert/strict";
import { lstat, mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { createApprovalReceipt } from "./approval-receipt.js";
import { putApprovalReceipt, readApprovalReceipt } from "./approval-store.js";

const request = { requestId: "123e4567-e89b-12d3-a456-426614174000", action: "mutate" as const, actor: "agent", target: "workspace:app", files: ["src/a.ts"], network: [], policyEffect: "fix", requestedAt: "2026-01-01T00:00:00Z", expiresAt: "2099-01-01T00:00:00Z" };

test("approval store publishes and reads an exact receipt", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-approvals-"));
  try {
    const receipt = createApprovalReceipt(request, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
    const published = await putApprovalReceipt(root, receipt);
    assert.equal((await readApprovalReceipt(root, published.requestDigest)).requestId, request.requestId);
    assert.equal((await putApprovalReceipt(root, receipt)).requestDigest, published.requestDigest);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("approval store rejects altered receipts and tampered files", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-approvals-tamper-"));
  try {
    const receipt = createApprovalReceipt(request, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
    const published = await putApprovalReceipt(root, receipt);
    await assert.rejects(() => putApprovalReceipt(root, { ...receipt, target: "workspace:other" }), /digest mismatch/);
    await writeFile(published.path, JSON.stringify({ ...receipt, target: "workspace:other" }));
    await assert.rejects(() => readApprovalReceipt(root, published.requestDigest), /digest mismatch/);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("approval store rejects symlink receipt entries", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-approvals-link-"));
  try {
    const receipt = createApprovalReceipt(request, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
    const digest = receipt.requestDigest;
    await writeFile(join(root, "target.json"), JSON.stringify(receipt));
    await symlink("target.json", join(root, `${digest.slice(7)}.json`));
    await assert.rejects(() => readApprovalReceipt(root, digest), /regular file/);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("approval store reads do not create a missing root", async () => {
  const parent = await mkdtemp(join(tmpdir(), "verglos-approvals-read-"));
  const root = join(parent, "missing");
  try {
    await assert.rejects(() => readApprovalReceipt(root, `sha256:${"a".repeat(64)}`));
    await assert.rejects(() => lstat(root), { code: "ENOENT" });
  } finally { await rm(parent, { recursive: true, force: true }); }
});
