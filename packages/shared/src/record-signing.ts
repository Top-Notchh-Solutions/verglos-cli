import { createHash, sign, verify, createPublicKey } from "node:crypto";
import { z } from "zod";
import { canonicalizeJson } from "./schema.js";
import { parseReleaseRecordManifest, type ReleaseRecordManifestDocument } from "./record-manifest.js";
import { releaseRecordManifestDigest } from "./record-digest.js";

const SIGNING_SCHEMA = "urn:verglos:schema:record-signature" as const;
const LegacyEnvelopeSchema = z.object({
  schemaId: z.literal(SIGNING_SCHEMA), schemaVersion: z.literal("1.0.0"),
  manifestDigest: z.string().regex(/^sha256:[a-f0-9]{64}$/u),
  algorithm: z.literal("ed25519"),
  signer: z.object({ id: z.string().min(1).max(512), issuer: z.string().min(1).max(512) }).strict(),
  signedAt: z.string().datetime({ offset: true }),
  signature: z.string().min(1).max(8192),
}).strict();
const BoundEnvelopeSchema = z.object({
  schemaId: z.literal(SIGNING_SCHEMA), schemaVersion: z.literal("1.1.0"),
  manifestDigest: z.string().regex(/^sha256:[a-f0-9]{64}$/u),
  algorithm: z.literal("ed25519"),
  keyId: z.string().regex(/^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/u),
  signer: z.object({ id: z.string().min(1).max(512), issuer: z.string().min(1).max(512) }).strict(),
  signedAt: z.string().datetime({ offset: true }),
  signature: z.string().min(1).max(8192),
}).strict();
const EnvelopeSchema = z.discriminatedUnion("schemaVersion", [LegacyEnvelopeSchema, BoundEnvelopeSchema]);

export type RecordSignatureEnvelope = z.infer<typeof EnvelopeSchema>;
export type RecordSignatureVerification =
  | { readonly verified: true; readonly identityBound: true; readonly signer: RecordSignatureEnvelope["signer"]; readonly manifestDigest: string; readonly keyId: string }
  | { readonly verified: true; readonly identityBound: false; readonly signer: RecordSignatureEnvelope["signer"]; readonly manifestDigest: string }
  | { readonly verified: false; readonly reason: "manifest-digest-mismatch" | "invalid-key" | "invalid-signature" };

function signingBytes(manifest: ReleaseRecordManifestDocument): Buffer {
  return Buffer.from(canonicalizeJson(parseReleaseRecordManifest(manifest)), "utf8");
}

export function providerRecordSigningBytes(manifest: ReleaseRecordManifestDocument, metadata: {
  readonly keyId: string;
  readonly signer: RecordSignatureEnvelope["signer"];
  readonly signedAt: string;
}): Buffer {
  const parsed = parseReleaseRecordManifest(manifest);
  return Buffer.from(canonicalizeJson({
    schemaId: SIGNING_SCHEMA,
    schemaVersion: "1.1.0",
    manifestDigest: releaseRecordManifestDigest(parsed),
    algorithm: "ed25519",
    keyId: metadata.keyId,
    signer: metadata.signer,
    signedAt: metadata.signedAt,
  }), "utf8");
}

export function signReleaseRecordManifest(manifest: ReleaseRecordManifestDocument, privateKeyPem: string, signer: RecordSignatureEnvelope["signer"], signedAt: string): RecordSignatureEnvelope {
  const parsed = parseReleaseRecordManifest(manifest);
  const signedAtDate = Date.parse(signedAt);
  if (!Number.isFinite(signedAtDate)) throw new Error("record signature signedAt must be an ISO timestamp");
  const publicKey = createPublicKey(privateKeyPem);
  const keyId = `sha256:${createHash("sha256").update(publicKey.export({ format: "der", type: "spki" })).digest("hex")}`;
  const signature = sign(null, providerRecordSigningBytes(parsed, { keyId, signer, signedAt }), privateKeyPem).toString("base64");
  return EnvelopeSchema.parse({ schemaId: SIGNING_SCHEMA, schemaVersion: "1.1.0", manifestDigest: releaseRecordManifestDigest(parsed), algorithm: "ed25519", keyId, signer, signedAt, signature });
}

export function verifyReleaseRecordSignature(manifest: ReleaseRecordManifestDocument, envelope: unknown, publicKeyPem: string): RecordSignatureVerification {
  const parsed = parseReleaseRecordManifest(manifest);
  const candidate = EnvelopeSchema.safeParse(envelope);
  if (!candidate.success) return { verified: false, reason: "invalid-signature" };
  if (candidate.data.manifestDigest !== releaseRecordManifestDigest(parsed)) return { verified: false, reason: "manifest-digest-mismatch" };
  let key: ReturnType<typeof createPublicKey>;
  let signature: Buffer;
  try { key = createPublicKey(publicKeyPem); signature = Buffer.from(candidate.data.signature, "base64"); }
  catch { return { verified: false, reason: "invalid-key" }; }
  const bytes = candidate.data.schemaVersion === "1.0.0" ? signingBytes(parsed) : providerRecordSigningBytes(parsed, candidate.data);
  const verified = verify(null, bytes, key, signature);
  if (!verified) return { verified: false, reason: "invalid-signature" };
  if (candidate.data.schemaVersion === "1.0.0") return { verified: true, identityBound: false, signer: candidate.data.signer, manifestDigest: candidate.data.manifestDigest };
  return { verified: true, identityBound: true, signer: candidate.data.signer, manifestDigest: candidate.data.manifestDigest, keyId: candidate.data.keyId };
}

export function releaseRecordSigningBytes(manifest: ReleaseRecordManifestDocument): Buffer {
  return signingBytes(parseReleaseRecordManifest(manifest));
}

export function createRecordSignatureEnvelope(input: {
  readonly manifest: ReleaseRecordManifestDocument;
  readonly signature: Uint8Array;
  readonly signer: RecordSignatureEnvelope["signer"];
  readonly keyId: string;
  readonly signedAt: string;
}): RecordSignatureEnvelope {
  if (input.signature.byteLength !== 64) throw new Error("Ed25519 record signatures must contain exactly 64 bytes");
  return EnvelopeSchema.parse({
    schemaId: SIGNING_SCHEMA,
    schemaVersion: "1.1.0",
    manifestDigest: releaseRecordManifestDigest(parseReleaseRecordManifest(input.manifest)),
    algorithm: "ed25519",
    keyId: input.keyId,
    signer: input.signer,
    signedAt: input.signedAt,
    signature: Buffer.from(input.signature).toString("base64"),
  });
}
