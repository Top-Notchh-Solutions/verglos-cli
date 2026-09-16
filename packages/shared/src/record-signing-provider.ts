import { createHash, createPublicKey, verify } from "node:crypto";
import { z } from "zod";
import { canonicalizeJson } from "./schema.js";
import { parseReleaseRecordManifest, type ReleaseRecordManifestDocument } from "./record-manifest.js";
import { releaseRecordManifestDigest } from "./record-digest.js";
import { createRecordSignatureEnvelope, providerRecordSigningBytes, verifyReleaseRecordSignature, type RecordSignatureEnvelope } from "./record-signing.js";

const KEY_ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/u;
const KeyReferenceSchema = z.string().min(1).max(1024).regex(/^[^\u0000-\u001f\u007f]+$/u);
const KeySchema = z.object({
  keyId: z.string().regex(KEY_ID),
  publicKeyPem: z.string().min(1).max(8192),
  status: z.enum(["active", "retired", "revoked"]),
  validFrom: z.string().datetime({ offset: true }),
  validUntil: z.string().datetime({ offset: true }).optional(),
}).strict().superRefine((key, context) => {
  if (key.validUntil && Date.parse(key.validUntil) <= Date.parse(key.validFrom)) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["validUntil"], message: "key validity interval must be positive" });
  }
});

const PolicySchema = z.object({
  schemaId: z.literal("urn:verglos:schema:record-signing-trust-policy"),
  schemaVersion: z.literal("1.0.0"),
  signer: z.object({ id: z.string().min(1).max(512), issuer: z.string().min(1).max(512) }).strict(),
  activeKeyId: z.string().regex(KEY_ID),
  keys: z.array(KeySchema).min(1).max(64),
}).strict().superRefine((policy, context) => {
  const ids = policy.keys.map((key) => key.keyId);
  if (new Set(ids).size !== ids.length) context.addIssue({ code: z.ZodIssueCode.custom, path: ["keys"], message: "key ids must be unique" });
  if (policy.keys.filter((key) => key.status === "active").length !== 1) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["keys"], message: "policy must have exactly one active signing key" });
  }
  if (!policy.keys.some((key) => key.keyId === policy.activeKeyId && key.status === "active")) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["activeKeyId"], message: "activeKeyId must identify the active key" });
  }
});

const DescriptorSchema = z.object({
  providerId: z.string().regex(/^[a-z][a-z0-9-]{0,62}$/u),
  providerKind: z.enum(["kms", "hsm", "test-fixture"]),
  keyId: z.string().regex(KEY_ID),
  algorithm: z.literal("ed25519"),
  signer: z.object({ id: z.string().min(1).max(512), issuer: z.string().min(1).max(512) }).strict(),
  /** Production KMS/HSM adapters must report false; the explicitly test-only fixture reports true. */
  privateKeyExportable: z.boolean(),
}).strict();

export type RecordSigningTrustPolicy = z.infer<typeof PolicySchema>;
export type RecordSigningKeyDescriptor = z.infer<typeof DescriptorSchema>;

/**
 * Provider contract for customer-controlled signing keys. Implementations receive exact canonical
 * manifest bytes and return only signature bytes; private key material is never part of this API.
 * Provider-specific authentication, authorization, durability, and hardware assurance remain the
 * responsibility of the adapter and its deployment qualification.
 */
export interface RecordSigningProvider {
  describeKey(keyReference: string): Promise<RecordSigningKeyDescriptor>;
  sign(input: {
    readonly keyReference: string;
    readonly algorithm: "ed25519";
    readonly payloadDigest: string;
    readonly payload: Uint8Array;
  }): Promise<Uint8Array>;
}

export type PolicyVerification =
  | { readonly verified: true; readonly identityBound: true; readonly signer: RecordSignatureEnvelope["signer"]; readonly keyId: string; readonly manifestDigest: string }
  | { readonly verified: false; readonly reason: "invalid-policy" | "untrusted-key" | "revoked-key" | "outside-key-validity" | "signer-policy-mismatch" | "manifest-digest-mismatch" | "invalid-key" | "invalid-signature" };

export function parseRecordSigningTrustPolicy(input: unknown): RecordSigningTrustPolicy {
  return PolicySchema.parse(input);
}

function keyIsValidAt(key: z.infer<typeof KeySchema>, at: string): boolean {
  const instant = Date.parse(at);
  return Number.isFinite(instant) && instant >= Date.parse(key.validFrom) && (key.validUntil === undefined || instant <= Date.parse(key.validUntil));
}

export function verifyReleaseRecordSignatureWithPolicy(
  manifest: ReleaseRecordManifestDocument,
  envelope: unknown,
  policyInput: unknown,
): PolicyVerification {
  const policyResult = PolicySchema.safeParse(policyInput);
  if (!policyResult.success) return { verified: false, reason: "invalid-policy" };
  const policy = policyResult.data;
  if (envelope === null || typeof envelope !== "object") return { verified: false, reason: "invalid-signature" };
  const candidate = envelope as Partial<RecordSignatureEnvelope>;
  if (candidate.schemaVersion !== "1.1.0") return { verified: false, reason: "invalid-signature" };
  if (candidate.keyId === undefined || !KEY_ID.test(candidate.keyId)) return { verified: false, reason: "untrusted-key" };
  if (candidate.signer?.id !== policy.signer.id || candidate.signer.issuer !== policy.signer.issuer) return { verified: false, reason: "signer-policy-mismatch" };
  const key = policy.keys.find((entry) => entry.keyId === candidate.keyId);
  if (!key) return { verified: false, reason: "untrusted-key" };
  if (key.status === "revoked") return { verified: false, reason: "revoked-key" };
  if (typeof candidate.signedAt !== "string" || !keyIsValidAt(key, candidate.signedAt)) return { verified: false, reason: "outside-key-validity" };
  const result = verifyReleaseRecordSignature(manifest, envelope, key.publicKeyPem);
  if (!result.verified) return result;
  if (!result.identityBound) return { verified: false, reason: "invalid-signature" };
  return { verified: true, identityBound: true, signer: result.signer, keyId: key.keyId, manifestDigest: result.manifestDigest };
}

export async function signReleaseRecordManifestWithProvider(input: {
  readonly manifest: ReleaseRecordManifestDocument;
  readonly keyReference: string;
  readonly provider: RecordSigningProvider;
  readonly policy: unknown;
  readonly signedAt: string;
  /** Test-only escape hatch for the explicitly exportable fixture adapter; never enable in production. */
  readonly allowTestFixture?: boolean;
}): Promise<RecordSignatureEnvelope> {
  const policy = PolicySchema.parse(input.policy);
  if (!KeyReferenceSchema.safeParse(input.keyReference).success) throw new Error("signing key reference is invalid");
  const keyReference = input.keyReference;
  let descriptor: RecordSigningKeyDescriptor;
  try {
    descriptor = DescriptorSchema.parse(await input.provider.describeKey(keyReference));
  } catch {
    throw new Error("signing provider could not resolve the configured key metadata");
  }
  if (descriptor.providerKind === "test-fixture" && input.allowTestFixture !== true) throw new Error("test signing provider is not allowed for production signing");
  if (descriptor.providerKind !== "test-fixture" && descriptor.privateKeyExportable) throw new Error("production signing provider must keep private key material non-exportable");
  if (descriptor.providerKind === "test-fixture" && descriptor.privateKeyExportable !== true) throw new Error("test fixture must disclose that its private key is exportable");
  if (descriptor.keyId !== policy.activeKeyId || descriptor.signer.id !== policy.signer.id || descriptor.signer.issuer !== policy.signer.issuer) {
    throw new Error("signing provider identity does not match the active signing policy");
  }
  const activeKey = policy.keys.find((key) => key.keyId === policy.activeKeyId);
  if (!activeKey || activeKey.status !== "active" || !keyIsValidAt(activeKey, input.signedAt)) throw new Error("active signing key is not valid at the requested signing time");
  const manifest = parseReleaseRecordManifest(input.manifest);
  const payload = providerRecordSigningBytes(manifest, { keyId: descriptor.keyId, signer: policy.signer, signedAt: input.signedAt });
  const payloadDigest = releaseRecordManifestDigest(manifest);
  let signature: Uint8Array;
  try {
    signature = await input.provider.sign({ keyReference, algorithm: "ed25519", payloadDigest, payload: new Uint8Array(payload) });
  } catch {
    throw new Error("signing provider could not sign the release record");
  }
  if (signature.byteLength !== 64) throw new Error("signing provider returned an invalid Ed25519 signature length");
  try {
    if (!verify(null, payload, createPublicKey(activeKey.publicKeyPem), Buffer.from(signature))) throw new Error("signing provider returned a signature that does not match the active policy key");
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("signing provider returned")) throw error;
    throw new Error("active signing policy contains an invalid public key");
  }
  return createRecordSignatureEnvelope({ manifest, signature, signer: policy.signer, keyId: descriptor.keyId, signedAt: input.signedAt });
}

/** Stable serialization for a policy digest; callers should store the digest, not provider credentials. */
export function recordSigningTrustPolicyDigest(policy: unknown): string {
  const parsed = PolicySchema.parse(policy);
  return `sha256:${createHash("sha256").update(canonicalizeJson(parsed), "utf8").digest("hex")}`;
}
