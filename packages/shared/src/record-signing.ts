import { createHash, sign, verify, createPublicKey } from "node:crypto";
import { z } from "zod";
import { canonicalizeJson } from "./schema.js";
import { parseReleaseRecordManifest, type ReleaseRecordManifestDocument } from "./record-manifest.js";
import { releaseRecordManifestDigest } from "./record-digest.js";

const SIGNING_SCHEMA = "urn:verglos:schema:record-signature" as const;
const EnvelopeSchema = z.object({
  schemaId: z.literal(SIGNING_SCHEMA), schemaVersion: z.literal("1.0.0"),
  manifestDigest: z.string().regex(/^sha256:[a-f0-9]{64}$/u),
  algorithm: z.literal("ed25519"),
  signer: z.object({ id: z.string().min(1).max(512), issuer: z.string().min(1).max(512) }).strict(),
  signedAt: z.string().datetime({ offset: true }),
  signature: z.string().min(1).max(8192),
}).strict();

export type RecordSignatureEnvelope = z.infer<typeof EnvelopeSchema>;
export type RecordSignatureVerification = { readonly verified: true; readonly signer: RecordSignatureEnvelope["signer"]; readonly manifestDigest: string } | { readonly verified: false; readonly reason: "manifest-digest-mismatch" | "invalid-key" | "invalid-signature" };

function signingBytes(manifest: ReleaseRecordManifestDocument): Buffer {
  return Buffer.from(canonicalizeJson(parseReleaseRecordManifest(manifest)), "utf8");
}

export function signReleaseRecordManifest(manifest: ReleaseRecordManifestDocument, privateKeyPem: string, signer: RecordSignatureEnvelope["signer"], signedAt: string): RecordSignatureEnvelope {
  const parsed = parseReleaseRecordManifest(manifest);
  const signedAtDate = Date.parse(signedAt);
  if (!Number.isFinite(signedAtDate)) throw new Error("record signature signedAt must be an ISO timestamp");
  const signature = sign(null, signingBytes(parsed), privateKeyPem).toString("base64");
  return EnvelopeSchema.parse({ schemaId: SIGNING_SCHEMA, schemaVersion: "1.0.0", manifestDigest: releaseRecordManifestDigest(parsed), algorithm: "ed25519", signer, signedAt, signature });
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
  return verify(null, signingBytes(parsed), key, signature) ? { verified: true, signer: candidate.data.signer, manifestDigest: candidate.data.manifestDigest } : { verified: false, reason: "invalid-signature" };
}
