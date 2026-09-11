import { z } from "zod";
import { parseReleaseRecordManifest, type ReleaseRecordManifestDocument } from "./record-manifest.js";
import { releaseRecordManifestDigest } from "./record-digest.js";

const digest = z.string().regex(/^sha256:[a-f0-9]{64}$/u);
const identity = z.string().min(1).max(512);
export const SigstoreRecordBindingSchema = z.object({ schemaId: z.literal("urn:verglos:schema:record-sigstore-binding"), schemaVersion: z.literal("1.0.0"), manifestDigest: digest, bundleDigest: digest, signer: z.object({ identity, issuer: identity }).strict(), verification: z.enum(["verified", "unverified", "invalid"]), limitations: z.array(z.string().min(1).max(512)).min(1).max(32) }).strict().superRefine((value, context) => { if (value.verification === "verified" && value.limitations.some((item) => /unverified|not verified|invalid/u.test(item))) context.addIssue({ code: z.ZodIssueCode.custom, path: ["limitations"], message: "verified bindings cannot claim unverified or invalid limitations" }); });
export type SigstoreRecordBinding = z.infer<typeof SigstoreRecordBindingSchema>;
/** Bind external Sigstore evidence to a manifest without performing network or keyless verification. */
export function createSigstoreRecordBinding(manifest: ReleaseRecordManifestDocument, input: Omit<SigstoreRecordBinding, "manifestDigest" | "schemaId" | "schemaVersion">): SigstoreRecordBinding { const parsed = parseReleaseRecordManifest(manifest); return SigstoreRecordBindingSchema.parse({ ...input, schemaId: "urn:verglos:schema:record-sigstore-binding", schemaVersion: "1.0.0", manifestDigest: releaseRecordManifestDigest(parsed) }); }
export function parseSigstoreRecordBinding(value: unknown): SigstoreRecordBinding { return SigstoreRecordBindingSchema.parse(value); }
