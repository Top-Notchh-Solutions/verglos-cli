import { createHash, createPublicKey, verify } from "node:crypto";
import { z } from "zod";
import { canonicalizeJson } from "./schema.js";
import { parsePolicyDocument, policyDocumentDigest, type PolicyDocument } from "./policy-document.js";

/** TEAM-CLI-001 · signed, tenant/repository-bound organization policy cache. */
export const ORGANIZATION_POLICY_SCHEMA = { id: "urn:verglos:schema:organization-policy", version: "1.0.0" } as const;

const SafeText = z.string().min(1).max(512).refine((value) => !/[\u0000-\u001f\u007f]/u.test(value), "text contains unsafe control characters");
const Digest = z.string().regex(/^sha256:[a-f0-9]{64}$/u);
const ScopeId = z.string().regex(/^[A-Za-z0-9][A-Za-z0-9._:/-]{0,255}$/u);
const Signer = z.object({ id: SafeText, issuer: z.string().url().max(512) }).strict();

const UnsignedEnvelopeSchema = z.object({
  schemaId: z.literal(ORGANIZATION_POLICY_SCHEMA.id),
  schemaVersion: z.literal(ORGANIZATION_POLICY_SCHEMA.version),
  organizationId: ScopeId,
  repositoryId: ScopeId,
  policy: z.unknown(),
  policyDigest: Digest,
  keyId: Digest,
  signer: Signer,
  signedAt: z.string().datetime({ offset: true }),
}).strict();

const EnvelopeSchema = UnsignedEnvelopeSchema.extend({ signature: z.string().regex(/^[A-Za-z0-9+/]+={0,2}$/u).max(8192) }).strict();
export type OrganizationPolicyEnvelope = z.infer<typeof EnvelopeSchema> & { readonly policy: PolicyDocument };
export type OrganizationPolicyPublicKey = Readonly<{ keyId: string; publicKeyPem: string; status: "active" | "retired" | "revoked" }>;

export type OrganizationPolicyFailure =
  | "invalid-envelope" | "organization-mismatch" | "repository-mismatch" | "policy-digest-mismatch"
  | "unknown-key" | "key-not-active" | "key-id-mismatch" | "invalid-signature" | "cache-expired" | "offline-unavailable";

export type OrganizationPolicyVerification =
  | Readonly<{ verified: true; envelope: OrganizationPolicyEnvelope; policyDigest: string }>
  | Readonly<{ verified: false; reason: OrganizationPolicyFailure }>;

export type OrganizationPolicyCacheEntry = Readonly<{
  organizationId: string;
  repositoryId: string;
  policy: PolicyDocument;
  policyDigest: string;
  cachedAt: string;
  expiresAt: string;
  source: "remote" | "cache";
}>;

function unsignedBytes(envelope: z.infer<typeof UnsignedEnvelopeSchema>): Buffer {
  return Buffer.from(canonicalizeJson(envelope), "utf8");
}

function keyIdFor(publicKeyPem: string): string {
  const key = createPublicKey(publicKeyPem);
  return `sha256:${createHash("sha256").update(key.export({ format: "der", type: "spki" })).digest("hex")}`;
}

/** Verify the exact policy bytes, tenant/repository binding, and active signer. */
export function verifyOrganizationPolicy(
  value: unknown,
  scope: Readonly<{ organizationId: string; repositoryId: string }>,
  trustedKeys: readonly OrganizationPolicyPublicKey[],
): OrganizationPolicyVerification {
  const parsed = EnvelopeSchema.safeParse(value);
  if (!parsed.success) return { verified: false, reason: "invalid-envelope" };
  if (parsed.data.organizationId !== scope.organizationId) return { verified: false, reason: "organization-mismatch" };
  if (parsed.data.repositoryId !== scope.repositoryId) return { verified: false, reason: "repository-mismatch" };
  let policy: PolicyDocument;
  try { policy = parsePolicyDocument(parsed.data.policy); } catch { return { verified: false, reason: "invalid-envelope" }; }
  const digest = policyDocumentDigest(policy);
  if (digest !== parsed.data.policyDigest) return { verified: false, reason: "policy-digest-mismatch" };
  const key = trustedKeys.find((candidate) => candidate.keyId === parsed.data.keyId);
  if (!key) return { verified: false, reason: "unknown-key" };
  if (key.status !== "active") return { verified: false, reason: "key-not-active" };
  try {
    if (keyIdFor(key.publicKeyPem) !== key.keyId) return { verified: false, reason: "key-id-mismatch" };
    const unsigned = { ...parsed.data } as Record<string, unknown>;
    delete unsigned.signature;
    if (!verify(null, unsignedBytes(UnsignedEnvelopeSchema.parse(unsigned)), createPublicKey(key.publicKeyPem), Buffer.from(parsed.data.signature, "base64"))) {
      return { verified: false, reason: "invalid-signature" };
    }
  } catch { return { verified: false, reason: "invalid-signature" }; }
  const envelope = Object.freeze({ ...parsed.data, policy }) as OrganizationPolicyEnvelope;
  return { verified: true, envelope, policyDigest: digest };
}

/** Resolve a verified remote policy or a still-valid verified cache entry. */
export function resolveOrganizationPolicy(input: Readonly<{
  organizationId: string;
  repositoryId: string;
  now: string;
  offline: boolean;
  remote?: unknown;
  cached?: OrganizationPolicyCacheEntry;
  trustedKeys: readonly OrganizationPolicyPublicKey[];
  cacheTtlMs: number;
}>): Readonly<{ resolved: true; entry: OrganizationPolicyCacheEntry }> | Readonly<{ resolved: false; reason: OrganizationPolicyFailure }> {
  const nowMs = Date.parse(input.now);
  if (!Number.isFinite(nowMs) || input.cacheTtlMs <= 0 || !Number.isSafeInteger(input.cacheTtlMs)) return { resolved: false, reason: "invalid-envelope" };
  if (!input.offline && input.remote !== undefined) {
    const verified = verifyOrganizationPolicy(input.remote, input, input.trustedKeys);
    if (!verified.verified) return { resolved: false, reason: verified.reason };
    const cachedAt = new Date(nowMs).toISOString();
    return { resolved: true, entry: Object.freeze({ organizationId: input.organizationId, repositoryId: input.repositoryId, policy: verified.envelope.policy, policyDigest: verified.policyDigest, cachedAt, expiresAt: new Date(nowMs + input.cacheTtlMs).toISOString(), source: "remote" }) };
  }
  const cached = input.cached;
  if (!cached) return { resolved: false, reason: input.offline ? "offline-unavailable" : "invalid-envelope" };
  if (cached.organizationId !== input.organizationId) return { resolved: false, reason: "organization-mismatch" };
  if (cached.repositoryId !== input.repositoryId) return { resolved: false, reason: "repository-mismatch" };
  if (cached.policyDigest !== policyDocumentDigest(cached.policy)) return { resolved: false, reason: "policy-digest-mismatch" };
  if (Date.parse(cached.expiresAt) <= nowMs) return { resolved: false, reason: "cache-expired" };
  return { resolved: true, entry: Object.freeze({ ...cached, source: "cache" }) };
}
