/**
 * Types shared between the entitlement client (CLI-side, verifies
 * tokens with the pinned public key) and the entitlement server
 * (API-side, signs tokens with the private key that lives in KMS).
 *
 * Design invariants:
 *   - Ed25519 signatures — 32-byte public key, 64-byte signature
 *   - 24h TTL on activation tokens
 *   - 7-day offline grace once the token expires
 *   - CLI never trusts a client-side boolean; every feature gate
 *     verifies the signature and the exp claim
 */

export type Tier = "free" | "pro" | "studio" | "compliance";

/**
 * Feature flag names that the CLI checks. Additive — new flags
 * ship as string literals here; old ones stay for backward compat.
 */
export type FeatureFlag =
  | "fix"
  | "ci"
  | "monitor"
  | "dashboard"
  | "attest"
  | "rotate"
  | "sbom"
  | "compliance-report";

export interface EntitlementClaims {
  /** License key hash — never the raw key. Used for revocation lookup. */
  keyHash: string;
  /** Tier the license was issued for. */
  tier: Tier;
  /** Project fingerprints this token is valid for. */
  projects: string[];
  /** Seat count. Studio/Compliance may exceed with $15/seat overage. */
  seats: number;
  /** Feature flags active for this tier. */
  features: FeatureFlag[];
  /** Issued-at (epoch seconds). */
  iat: number;
  /** Expiration (epoch seconds). 24h after iat. */
  exp: number;
  /** Machine id fingerprint (soft-cap tracking, not enforcement). */
  mid?: string;
  /** Verglos CLI version that requested this token. */
  ver?: string;
}

/**
 * The signed token as issued by the entitlement server. Format:
 *   base64url(headerJSON) . base64url(claimsJSON) . base64url(signature)
 * where header is `{"alg":"EdDSA","typ":"JWT"}`.
 *
 * We use Ed25519 rather than RS256 because the pinned public key
 * is 32 bytes — trivial to embed in the CLI binary — and verify
 * is <1ms without any WebCrypto polyfill.
 */
export type SignedEntitlement = string;

export interface VerifyResult {
  valid: boolean;
  claims?: EntitlementClaims;
  /** Human-readable reason when valid=false. */
  reason?: string;
  /**
   * True when the token's exp has passed but the local cache
   * (see client.ts) allows a 7-day grace window. Callers should
   * treat this as valid AND surface a "renew" warning to the user.
   */
  inOfflineGrace?: boolean;
}
