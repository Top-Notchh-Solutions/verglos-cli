import assert from "node:assert/strict";
import { generateKeyPairSync } from "node:crypto";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { assembleReleaseRecord, createApprovalReceipt, readApprovalReceipt } from "@verglos/shared";
import { executeRecordSign } from "./record-sign.js";

test("record sign requires explicit approval before reading the key", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-record-sign-"));
  try { assert.equal(await executeRecordSign(join(root, "manifest.json"), join(root, "sig.json"), join(root, "key.pem"), "signer", "issuer", false, true, true), 78); }
  finally { await rm(root, { recursive: true, force: true }); }
});

test("record sign requires a scoped receipt before reading the manifest", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-record-sign-receipt-"));
  try { assert.equal(await executeRecordSign(join(root, "missing.json"), join(root, "sig.json"), join(root, "key.pem"), "signer", "issuer", true, true, true), 78); }
  finally { await rm(root, { recursive: true, force: true }); }
});

test("record sign writes a bounded envelope", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-record-sign-valid-"));
  try {
    const { privateKey } = generateKeyPairSync("ed25519");
    const manifest = assembleReleaseRecord({ schemaId: "urn:verglos:schema:release-record-manifest", schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", generatedAt: "2026-01-01T00:00:00Z", generator: { id: "verglos.record-builder", version: "1.0.0" }, members: [{ path: "decision.json", kind: "release-decision", mediaType: "application/json", digest: { algorithm: "sha256", value: "a".repeat(64) }, size: 2, required: true, redaction: "none", schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" } }], redaction: { status: "not-required" }, limitations: ["fixture"] });
    await writeFile(join(root, "manifest.json"), JSON.stringify(manifest)); await writeFile(join(root, "key.pem"), privateKey.export({ format: "pem", type: "pkcs8" }));
    const manifestPath = join(root, "manifest.json");
    const approval = createApprovalReceipt({ requestId: "123e4567-e89b-12d3-a456-426614174000", action: "sign", actor: "agent", target: `manifest:${manifestPath}`, files: [manifestPath], network: [], policyEffect: "record-sign", requestedAt: "2026-01-01T00:00:00Z", expiresAt: "2026-02-01T00:00:00Z" }, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
    assert.equal(await executeRecordSign(manifestPath, join(root, "sig.json"), join(root, "key.pem"), "signer", "issuer", true, true, true, approval, "2026-01-01T00:02:00Z"), 0);
    assert.match(await readFile(join(root, "sig.json"), "utf8"), /record-signature|manifestDigest/);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("record sign persists the approved receipt when an audit store is configured", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-record-sign-audit-"));
  try {
    const { privateKey } = generateKeyPairSync("ed25519");
    const manifestPath = join(root, "manifest.json");
    const manifest = assembleReleaseRecord({ schemaId: "urn:verglos:schema:release-record-manifest", schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", generatedAt: "2026-01-01T00:00:00Z", generator: { id: "verglos.record-builder", version: "1.0.0" }, members: [{ path: "decision.json", kind: "release-decision", mediaType: "application/json", digest: { algorithm: "sha256", value: "a".repeat(64) }, size: 2, required: true, redaction: "none", schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" } }], redaction: { status: "not-required" }, limitations: ["fixture"] });
    await writeFile(manifestPath, JSON.stringify(manifest));
    const approval = createApprovalReceipt({ requestId: "123e4567-e89b-12d3-a456-426614174000", action: "sign", actor: "agent", target: `manifest:${manifestPath}`, files: [manifestPath], network: [], policyEffect: "record-sign", requestedAt: "2026-01-01T00:00:00Z", expiresAt: "2099-01-01T00:00:00Z" }, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
    const keyPath = join(root, "key.pem"); await writeFile(keyPath, privateKey.export({ format: "pem", type: "pkcs8" }));
    assert.equal(await executeRecordSign(manifestPath, join(root, "sig.json"), keyPath, "signer", "issuer", true, true, true, approval, "2026-01-01T00:02:00Z", join(root, "approvals")), 0);
    assert.equal((await readApprovalReceipt(join(root, "approvals"), approval.requestDigest)).requestId, approval.requestId);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("record sign rejects invalid keys and refuses to overwrite an envelope", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-record-sign-negative-"));
  try {
    const manifest = assembleReleaseRecord({ schemaId: "urn:verglos:schema:release-record-manifest", schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", generatedAt: "2026-01-01T00:00:00Z", generator: { id: "verglos.record-builder", version: "1.0.0" }, members: [{ path: "decision.json", kind: "release-decision", mediaType: "application/json", digest: { algorithm: "sha256", value: "a".repeat(64) }, size: 2, required: true, redaction: "none", schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" } }], redaction: { status: "not-required" }, limitations: ["fixture"] });
    const manifestPath = join(root, "manifest.json"); const keyPath = join(root, "key.pem"); const signaturePath = join(root, "sig.json");
    await writeFile(manifestPath, JSON.stringify(manifest)); await writeFile(keyPath, "not-a-private-key");
    const approval = createApprovalReceipt({ requestId: "123e4567-e89b-12d3-a456-426614174000", action: "sign", actor: "agent", target: `manifest:${manifestPath}`, files: [manifestPath], network: [], policyEffect: "record-sign", requestedAt: "2026-01-01T00:00:00Z", expiresAt: "2026-02-01T00:00:00Z" }, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
    assert.equal(await executeRecordSign(manifestPath, signaturePath, keyPath, "signer", "issuer", true, true, true, approval, "2026-01-01T00:02:00Z"), 78);
    const { privateKey } = generateKeyPairSync("ed25519"); await writeFile(keyPath, privateKey.export({ format: "pem", type: "pkcs8" }));
    assert.equal(await executeRecordSign(manifestPath, signaturePath, keyPath, "signer", "issuer", true, true, true, approval, "2026-01-01T00:02:00Z"), 0);
    assert.equal(await executeRecordSign(manifestPath, signaturePath, keyPath, "signer", "issuer", true, true, true, approval, "2026-01-01T00:02:00Z"), 78);
  } finally { await rm(root, { recursive: true, force: true }); }
});
