import { verify as ed25519Verify } from "node:crypto";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { publicKeyFromBase64Url } from "./keys.js";
import type {
  EntitlementClaims,
  SignedEntitlement,
  VerifyResult,
} from "./types.js";

/**
 * Client-side entitlement verification. Pinned public key +
 * 7-day offline grace window.
 *
 * Boundaries:
 *   - CLI never trusts a client-side boolean — every feature gate
 *     runs verifyEntitlement() again, no memoized "is-paid" flag.
 *   - Offline grace: if the exp is up but the local cache says
 *     the token was last valid within the last 7 days, we let it
 *     through with inOfflineGrace=true so the CLI can render a
 *     "renew" warning. Free-tier callers never touch this path.
 */

/**
 * PINNED PUBLIC KEYS — two slots, current + successor.
 *
 * Base64url-encoded 32-byte raw Ed25519 public keys. Both are compiled
 * into the CLI binary and ship with every download. The private
 * counterparts live in KMS (arch §8).
 *
 * Rotation is a soft release:
 *   1. Generate a new keypair for the SUCCESSOR slot (index 1).
 *      Server keeps signing with the CURRENT key (index 0).
 *   2. Ship a CLI release that pins both keys.
 *   3. After enough CLIs upgrade, flip signing to the successor:
 *      move it into slot 0, add a new successor into slot 1.
 *   4. Ship again.
 *
 * The zero placeholders below match an all-zero Ed25519 pubkey (which
 * no real signature will ever pass) and will fail every verify() call
 * until the first real keys are generated and pinned. Generate with:
 *   node -e "const {generateEntitlementKeyPair}=require('@verglos/entitlement');console.log(generateEntitlementKeyPair().publicKeyBase64Url)"
 * and paste the output here.
 */
export const PINNED_PUBLIC_KEYS_B64URL: readonly [string, string] = [
  // current (v1, minted 2026-08-02) — server signs with the matching
  // private key stored in Vercel env as VERGLOS_ENTITLEMENT_PRIVATE_KEY.
  // Rotate by moving a new key into slot 0 and demoting the old one
  // to slot 1 (successor) for a release cycle.
  "YFa-Ut1bGFrv--OKfyP56Dg8riD4NJ8kR0oAclidtbE",
  // successor — reserved for the next rotation, safe to leave as
  // the placeholder until the first rotation happens
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
];

const OFFLINE_GRACE_MS = 7 * 24 * 60 * 60 * 1000;
const CACHE_FILE = join(homedir(), ".verglos", "entitlement.json");
const HEADER_B64 = base64UrlEncode(
  Buffer.from('{"alg":"EdDSA","typ":"JWT"}', "utf8"),
);
const V2_CLAIM_KEYS = ["userId", "tenantId", "role", "plan", "capabilities", "allowances", "catalogVersion", "tokenId"] as const;

/** Key IDs are immutable wire identities, not array positions. */
export const PINNED_PUBLIC_KEYS_BY_ID: Readonly<Record<string, string>> = Object.freeze({
  "legacy-v1": PINNED_PUBLIC_KEYS_B64URL[0],
  "successor-v1": PINNED_PUBLIC_KEYS_B64URL[1],
});

interface EntitlementCache {
  /** The most recent SignedEntitlement the CLI saw pass verify(). */
  token: SignedEntitlement;
  /** iso — when the CLI last verified this token successfully. */
  lastVerifiedAt: string;
}

export interface VerifyOptions {
  /**
   * Override the pinned public keys. Test-only — callers in production
   * should let this default to {@link PINNED_PUBLIC_KEYS_B64URL}.
   */
  pinnedKeys?: readonly string[];
  /** Test/rotation seam: override the immutable key-id map. */
  pinnedKeysById?: Readonly<Record<string, string>>;
}

/**
 * Verify a signed entitlement token. Returns a VerifyResult that
 * distinguishes:
 *   - valid (signature ok, exp future) → treat as authoritative
 *   - inOfflineGrace (signature ok, exp past, within 7d) → treat
 *     as valid AND surface a renewal nudge to the user
 *   - invalid → free-tier caps apply
 *
 * Signature is checked against every pinned key in order. This is what
 * makes the two-slot rotation policy work: the server can flip signing
 * keys and a CLI that ships both pinned keys keeps verifying.
 */
export async function verifyEntitlement(
  token: SignedEntitlement,
  now: number = Date.now(),
  options: VerifyOptions = {},
): Promise<VerifyResult> {
  const parts = token.split(".");
  if (parts.length !== 3) {
    return { valid: false, reason: "malformed token (expected 3 segments)" };
  }
  const [headerB64, claimsB64, sigB64] = parts as [string, string, string];

  let keyId: string | undefined;
  if (headerB64 !== HEADER_B64) {
    try {
      const headerText = base64UrlDecode(headerB64).toString("utf8");
      const header = JSON.parse(headerText) as Record<string, unknown>;
      if (header.alg !== "EdDSA" || header.typ !== "JWT" || typeof header.kid !== "string"
        || !/^[a-z0-9][a-z0-9._-]{0,63}$/u.test(header.kid)
        || Object.keys(header).sort().join(",") !== "alg,kid,typ"
        || JSON.stringify({ alg: "EdDSA", kid: header.kid, typ: "JWT" }) !== headerText) {
        return { valid: false, reason: "unexpected JWT header" };
      }
      keyId = header.kid;
    } catch {
      return { valid: false, reason: "unexpected JWT header" };
    }
  }

  let claims: EntitlementClaims;
  try {
    claims = JSON.parse(base64UrlDecode(claimsB64).toString("utf8"));
  } catch {
    return { valid: false, reason: "claims payload is not valid JSON" };
  }

  const signingInput = Buffer.from(`${headerB64}.${claimsB64}`, "utf8");
  const signature = base64UrlDecode(sigB64);
  // Precedence: explicit options > VERGLOS_TEST_PUBKEY_B64URL env
  // override (test-only) > compiled-in pin. The env override exists
  // so downstream packages can test the full sign→verify pipeline
  // without threading VerifyOptions through every call site.
  const envKey = process.env.VERGLOS_TEST_PUBKEY_B64URL;
  const pinned = keyId
    ? [options.pinnedKeysById?.[keyId] ?? PINNED_PUBLIC_KEYS_BY_ID[keyId]].filter((key): key is string => typeof key === "string")
    : options.pinnedKeys ?? (envKey ? [envKey] : PINNED_PUBLIC_KEYS_B64URL);
  const sigOk = pinned.some((keyB64) => {
    try {
      const key = publicKeyFromBase64Url(keyB64);
      return ed25519Verify(null, signingInput, key, signature);
    } catch {
      // Malformed key slot — skip it, but never let one bad slot poison
      // verification against the other.
      return false;
    }
  });
  if (!sigOk) {
    return { valid: false, reason: "signature failed to verify" };
  }

  const nowSec = Math.floor(now / 1000);
  const claimError = validateClaims(claims, nowSec);
  if (claimError) return { valid: false, reason: claimError };
  // `compliance` was an older wire value. Preserve signature validation
  // against the original bytes, but expose only the canonical Enterprise
  // tier to callers so legacy tokens cannot drift into a separate plan.
  const canonicalClaims: EntitlementClaims = (claims as { tier: string }).tier === "compliance"
    ? { ...claims, tier: "enterprise" }
    : claims;

  if (typeof claims.exp !== "number") {
    return { valid: false, reason: "claims are missing exp" };
  }

  if (claims.exp >= nowSec) {
    // Fresh — remember it for the offline-grace window.
    await writeCache({
      token,
      lastVerifiedAt: new Date(now).toISOString(),
    });
    return { valid: true, claims: canonicalClaims };
  }

  // Token is past exp. Check the offline-grace window using the
  // cache — the cache is only writable if the CLI has previously
  // verified this token online.
  const cache = await readCache();
  if (
    cache &&
    cache.token === token &&
    now - new Date(cache.lastVerifiedAt).getTime() < OFFLINE_GRACE_MS
  ) {
    return { valid: true, claims: canonicalClaims, inOfflineGrace: true };
  }

  return {
    valid: false,
    claims: canonicalClaims,
    reason: "token expired past the 7-day offline grace window",
  };
}

function validateClaims(value: unknown, nowSec: number): string | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return "claims must be an object";
  const claims = value as Record<string, unknown>;
  if (typeof claims.keyHash !== "string" || claims.keyHash.length === 0 || claims.keyHash.length > 256) return "claims have an invalid keyHash";
  if (claims.schemaVersion === undefined && V2_CLAIM_KEYS.some((key) => Object.hasOwn(claims, key))) return "claims include v2 fields without a schema version";
  if (!new Set(["free", "pro", "team", "studio", "enterprise", "compliance", "founder"]).has(claims.tier as string)) return "claims have an invalid tier";
  if (!Array.isArray(claims.projects) || claims.projects.some((project) => typeof project !== "string" || project.length > 4096)) return "claims have invalid projects";
  if (!Number.isInteger(claims.seats) || (claims.seats as number) < 0 || (claims.seats as number) > 100_000) return "claims have invalid seats";
  if (!Array.isArray(claims.features) || claims.features.some((feature) => typeof feature !== "string" || feature.length === 0 || feature.length > 256)) return "claims have invalid features";
  if (!Number.isInteger(claims.iat) || !Number.isInteger(claims.exp) || (claims.exp as number) <= (claims.iat as number)) return "claims have invalid timestamps";
  if ((claims.iat as number) > nowSec + 5 * 60) return "claims issued-at is too far in the future";
  if ((claims.exp as number) - nowSec > 90 * 24 * 60 * 60) return "claims expiry is too far in the future";
  if (claims.mid !== undefined && (typeof claims.mid !== "string" || claims.mid.length > 256)) return "claims have an invalid machine id";
  if (claims.ver !== undefined && (typeof claims.ver !== "string" || claims.ver.length > 128)) return "claims have an invalid client version";
  if (claims.schemaVersion !== undefined) {
    if (claims.schemaVersion !== 2) return "claims have an unsupported schema version";
    if (!/^[a-f0-9]{64}$/u.test(claims.keyHash as string)) return "claims have an invalid v2 key hash";
    if (typeof claims.userId !== "string" || claims.userId.length === 0 || claims.userId.length > 256 || /[\u0000-\u001f\u007f]/u.test(claims.userId)) return "claims have an invalid user id";
    if (typeof claims.tenantId !== "string" || claims.tenantId.length === 0 || claims.tenantId.length > 128 || /[\u0000-\u001f\u007f]/u.test(claims.tenantId)) return "claims have an invalid tenant id";
    if (!new Set(["owner", "admin", "approver", "member", "viewer"]).has(claims.role as string)) return "claims have an invalid tenant role";
    if (!new Set(["free", "pro", "team", "studio", "enterprise"]).has(claims.plan as string) || claims.plan !== claims.tier) return "claims plan and tier do not match";
    if (!Array.isArray(claims.capabilities) || claims.capabilities.length > 256 || new Set(claims.capabilities).size !== claims.capabilities.length || claims.capabilities.some((item) => typeof item !== "string" || item.length === 0 || item.length > 256 || /[\u0000-\u001f\u007f]/u.test(item))) return "claims have invalid capabilities";
    if (!claims.allowances || typeof claims.allowances !== "object" || Array.isArray(claims.allowances)) return "claims have invalid allowances";
    const allowances = claims.allowances as Record<string, unknown>;
    if (Object.keys(allowances).length > 64 || Object.entries(allowances).some(([key, amount]) => !/^[a-z][A-Za-z0-9_.-]{0,127}$/u.test(key) || !(Number.isSafeInteger(amount) && (amount as number) >= 0) && amount !== "unset" && amount !== "contracted")) return "claims have invalid allowances";
    if (typeof claims.catalogVersion !== "string" || !/^[0-9]{4}-[0-9]{2}-[0-9]{2}\.[0-9]+$/u.test(claims.catalogVersion)) return "claims have an invalid catalog version";
    if (typeof claims.tokenId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u.test(claims.tokenId)) return "claims have an invalid token id";
  }
  return undefined;
}

/** Ships as a helper so the CLI can inspect the cache for `verglos status`. */
export async function readCache(): Promise<EntitlementCache | null> {
  try {
    const raw = await readFile(CACHE_FILE, "utf8");
    return JSON.parse(raw) as EntitlementCache;
  } catch {
    return null;
  }
}

async function writeCache(cache: EntitlementCache): Promise<void> {
  try {
    await mkdir(join(homedir(), ".verglos"), { recursive: true });
    await writeFile(CACHE_FILE, JSON.stringify(cache, null, 2), "utf8");
  } catch {
    // Read-only home dir — the CLI still works, just no offline grace.
  }
}

function base64UrlEncode(buf: Buffer): string {
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlDecode(s: string): Buffer {
  const b64 =
    s.replace(/-/g, "+").replace(/_/g, "/") +
    "==".slice(0, (4 - (s.length % 4)) % 4);
  return Buffer.from(b64, "base64");
}
