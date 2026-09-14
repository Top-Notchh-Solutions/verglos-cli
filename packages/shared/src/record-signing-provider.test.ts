import assert from "node:assert/strict";
import { createHash, generateKeyPairSync, sign } from "node:crypto";
import { test } from "node:test";
import { assembleReleaseRecord } from "./record-assembly.js";
import { releaseRecordManifestDigest } from "./record-digest.js";
import { verifyReleaseRecordSignature } from "./record-signing.js";
import { canonicalizeJson } from "./schema.js";
import {
  parseRecordSigningTrustPolicy,
  recordSigningTrustPolicyDigest,
  signReleaseRecordManifestWithProvider,
  verifyReleaseRecordSignatureWithPolicy,
  type RecordSigningKeyDescriptor,
  type RecordSigningProvider,
  type RecordSigningTrustPolicy,
} from "./record-signing-provider.js";

const SIGNER = { id: "customer.release", issuer: "https://issuer.example.test" } as const;
const manifest = () => assembleReleaseRecord({
  schemaId: "urn:verglos:schema:release-record-manifest",
  schemaVersion: "1.0.0",
  bundleVersion: "1.0.0",
  manifestId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000",
  generatedAt: "2026-01-01T00:00:00Z",
  generator: { id: "verglos.record-builder", version: "1.0.0" },
  members: [{ path: "decision.json", kind: "release-decision", mediaType: "application/json", digest: { algorithm: "sha256", value: "a".repeat(64) }, size: 2, required: true, redaction: "none", schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" } }],
  redaction: { status: "not-required" },
  limitations: ["fixture"],
});

function fixtureKey(keyId: string) {
  const pair = generateKeyPairSync("ed25519");
  return {
    descriptor: { providerId: "fixture-ed25519", providerKind: "test-fixture", keyId, algorithm: "ed25519", signer: SIGNER, privateKeyExportable: true } as const,
    privateKey: pair.privateKey,
    publicKeyPem: pair.publicKey.export({ format: "pem", type: "spki" }).toString(),
  };
}

class FixtureSigningProvider implements RecordSigningProvider {
  readonly #keys: Map<string, ReturnType<typeof fixtureKey>>;
  constructor(keys: Array<{ reference: string; key: ReturnType<typeof fixtureKey> }>) {
    this.#keys = new Map(keys.map(({ reference, key }) => [reference, key]));
  }
  async describeKey(keyReference: string): Promise<RecordSigningKeyDescriptor> {
    const key = this.#keys.get(keyReference);
    if (!key) throw new Error("unknown fixture key reference");
    return key.descriptor;
  }
  async sign(input: { keyReference: string; algorithm: "ed25519"; payloadDigest: string; payload: Uint8Array }): Promise<Uint8Array> {
    const key = this.#keys.get(input.keyReference);
    if (!key) throw new Error("unknown fixture key reference");
    assert.equal(input.algorithm, "ed25519");
    assert.match(input.payloadDigest, /^sha256:[a-f0-9]{64}$/u);
    return sign(null, Buffer.from(input.payload), key.privateKey);
  }
}

function policy(active: ReturnType<typeof fixtureKey>, retired?: ReturnType<typeof fixtureKey>): RecordSigningTrustPolicy {
  return parseRecordSigningTrustPolicy({
    schemaId: "urn:verglos:schema:record-signing-trust-policy",
    schemaVersion: "1.0.0",
    signer: SIGNER,
    activeKeyId: active.descriptor.keyId,
    keys: [
      ...(retired ? [{ keyId: retired.descriptor.keyId, publicKeyPem: retired.publicKeyPem, status: "retired", validFrom: "2025-01-01T00:00:00Z", validUntil: "2027-01-01T00:00:00Z" }] : []),
      { keyId: active.descriptor.keyId, publicKeyPem: active.publicKeyPem, status: "active", validFrom: "2025-01-01T00:00:00Z" },
    ],
  });
}

test("provider contract signs exact canonical manifest bytes and does not expose private key material", async () => {
  const key = fixtureKey("customer-key-2026-01");
  const provider = new FixtureSigningProvider([{ reference: "opaque://fixture/key-version/1", key }]);
  const record = manifest();
  const trust = policy(key);
  const envelope = await signReleaseRecordManifestWithProvider({ manifest: record, keyReference: "opaque://fixture/key-version/1", provider, policy: trust, signedAt: "2026-01-02T00:00:00Z", allowTestFixture: true });

  assert.equal("keyId" in envelope ? envelope.keyId : undefined, key.descriptor.keyId);
  assert.equal(envelope.schemaVersion, "1.1.0");
  assert.equal(envelope.manifestDigest, releaseRecordManifestDigest(record));
  assert.deepEqual(verifyReleaseRecordSignatureWithPolicy(record, envelope, trust), {
    verified: true,
    identityBound: true,
    signer: SIGNER,
    keyId: key.descriptor.keyId,
    manifestDigest: envelope.manifestDigest,
  });
  const publicKeyPem = key.publicKeyPem;
  assert.deepEqual(verifyReleaseRecordSignature(record, { ...envelope, signer: { ...SIGNER, issuer: "https://changed.example.test" } }, publicKeyPem), { verified: false, reason: "invalid-signature" });
  assert.deepEqual(verifyReleaseRecordSignature(record, { ...envelope, signer: { ...SIGNER, id: "other-signer" } }, publicKeyPem), { verified: false, reason: "invalid-signature" });
  assert.equal(JSON.stringify({ envelope, descriptor: key.descriptor }).includes(key.privateKey.export({ format: "pem", type: "pkcs8" }).toString()), false);
  assert.equal((await signReleaseRecordManifestWithProvider({ manifest: record, keyReference: "opaque://fixture/key-version/1", provider, policy: trust, signedAt: "2026-01-02T00:00:00Z" }).catch((error: unknown) => (error as Error).message)), "test signing provider is not allowed for production signing");
});

test("rotation signs only with the active key while retired signatures remain verifiable", async () => {
  const oldKey = fixtureKey("customer-key-old");
  const currentKey = fixtureKey("customer-key-current");
  const provider = new FixtureSigningProvider([
    { reference: "opaque://old", key: oldKey },
    { reference: "opaque://current", key: currentKey },
  ]);
  const oldPolicy = policy(oldKey);
  const oldEnvelope = await signReleaseRecordManifestWithProvider({ manifest: manifest(), keyReference: "opaque://old", provider, policy: oldPolicy, signedAt: "2026-01-02T00:00:00Z", allowTestFixture: true });
  const rotatedPolicy = policy(currentKey, oldKey);

  assert.equal(verifyReleaseRecordSignatureWithPolicy(manifest(), oldEnvelope, rotatedPolicy).verified, true);
  assert.deepEqual(verifyReleaseRecordSignatureWithPolicy(manifest(), { ...oldEnvelope, keyId: currentKey.descriptor.keyId }, rotatedPolicy), { verified: false, reason: "invalid-signature" }, "key id must be cryptographically bound");
  const currentEnvelope = await signReleaseRecordManifestWithProvider({ manifest: manifest(), keyReference: "opaque://current", provider, policy: rotatedPolicy, signedAt: "2026-06-01T00:00:00Z", allowTestFixture: true });
  assert.equal("keyId" in currentEnvelope ? currentEnvelope.keyId : undefined, currentKey.descriptor.keyId);
  await assert.rejects(signReleaseRecordManifestWithProvider({ manifest: manifest(), keyReference: "opaque://old", provider, policy: rotatedPolicy, signedAt: "2026-06-01T00:00:00Z", allowTestFixture: true }), /does not match the active signing policy/u);
});

test("signing policy rejects revoked, unknown, mismatched, invalid, and out-of-window keys", async () => {
  const key = fixtureKey("customer-key-revoked");
  const provider = new FixtureSigningProvider([{ reference: "opaque://revoked", key }]);
  const trust = policy(key);
  const envelope = await signReleaseRecordManifestWithProvider({ manifest: manifest(), keyReference: "opaque://revoked", provider, policy: trust, signedAt: "2026-01-02T00:00:00Z", allowTestFixture: true });

  const revokedPolicy = { ...trust, activeKeyId: "customer-key-next", keys: [
    { ...trust.keys[0]!, status: "revoked" },
    { ...trust.keys[0]!, keyId: "customer-key-next", status: "active" },
  ] };
  assert.deepEqual(verifyReleaseRecordSignatureWithPolicy(manifest(), envelope, revokedPolicy), { verified: false, reason: "revoked-key" });
  assert.deepEqual(verifyReleaseRecordSignatureWithPolicy(manifest(), { ...envelope, keyId: "unknown-key" }, trust), { verified: false, reason: "untrusted-key" });
  assert.deepEqual(verifyReleaseRecordSignatureWithPolicy(manifest(), { ...envelope, signer: { ...SIGNER, issuer: "https://other.example.test" } }, trust), { verified: false, reason: "signer-policy-mismatch" });
  assert.deepEqual(verifyReleaseRecordSignatureWithPolicy(manifest(), { ...envelope, signedAt: "2026-01-03T00:00:00Z" }, trust), { verified: false, reason: "invalid-signature" }, "signedAt must be covered by the cryptographic signature");
  const expired = { ...trust, keys: [{ ...trust.keys[0]!, validUntil: "2025-12-31T23:59:59Z" }] };
  assert.deepEqual(verifyReleaseRecordSignatureWithPolicy(manifest(), envelope, expired), { verified: false, reason: "outside-key-validity" });
  assert.equal(verifyReleaseRecordSignatureWithPolicy(manifest(), envelope, { ...trust, activeKeyId: "bad space" }).verified, false);
  assert.match(recordSigningTrustPolicyDigest(trust), /^sha256:[a-f0-9]{64}$/u);
  assert.equal(recordSigningTrustPolicyDigest(trust), `sha256:${createHash("sha256").update(canonicalizeJson(trust), "utf8").digest("hex")}`);
});

test("production provider metadata fails closed if it declares an exportable private key", async () => {
  const key = fixtureKey("customer-key-exportable");
  const provider: RecordSigningProvider = {
    async describeKey() { return { ...key.descriptor, providerKind: "kms", privateKeyExportable: true }; },
    async sign() { assert.fail("sign must not be called for an exportable production key"); },
  };
  await assert.rejects(signReleaseRecordManifestWithProvider({
    manifest: manifest(),
    keyReference: "kms://account/key-version/1",
    provider,
    policy: policy(key),
    signedAt: "2026-01-02T00:00:00Z",
  }), /must keep private key material non-exportable/u);
  await assert.rejects(signReleaseRecordManifestWithProvider({
    manifest: manifest(),
    keyReference: "invalid\nreference",
    provider,
    policy: policy(key),
    signedAt: "2026-01-02T00:00:00Z",
  }), /signing key reference is invalid/u);
});

test("provider errors are bounded and never returned verbatim", async () => {
  const key = fixtureKey("customer-key-provider-error");
  const secretLikeDiagnostic = "provider diagnostic with credential=fixture-secret-do-not-leak";
  const provider: RecordSigningProvider = {
    async describeKey() { throw new Error(secretLikeDiagnostic); },
    async sign() { throw new Error(secretLikeDiagnostic); },
  };
  await assert.rejects(signReleaseRecordManifestWithProvider({
    manifest: manifest(),
    keyReference: "kms://opaque/key/1",
    provider,
    policy: policy(key),
    signedAt: "2026-01-02T00:00:00Z",
  }), (error: unknown) => error instanceof Error && error.message === "signing provider could not resolve the configured key metadata" && !error.message.includes("fixture-secret"));
});
