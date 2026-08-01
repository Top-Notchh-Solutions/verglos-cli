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
  // current — server signs with the matching private key
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  // successor — reserved for the next rotation, safe to leave as
  // the placeholder until the first rotation happens
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
];

const OFFLINE_GRACE_MS = 7 * 24 * 60 * 60 * 1000;
const CACHE_FILE = join(homedir(), ".verglos", "entitlement.json");
const HEADER_B64 = base64UrlEncode(
  Buffer.from('{"alg":"EdDSA","typ":"JWT"}', "utf8"),
);

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

  if (headerB64 !== HEADER_B64) {
    return { valid: false, reason: "unexpected JWT header" };
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
  const pinned =
    options.pinnedKeys ?? (envKey ? [envKey] : PINNED_PUBLIC_KEYS_B64URL);
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
  if (typeof claims.exp !== "number") {
    return { valid: false, reason: "claims are missing exp" };
  }

  if (claims.exp >= nowSec) {
    // Fresh — remember it for the offline-grace window.
    await writeCache({
      token,
      lastVerifiedAt: new Date(now).toISOString(),
    });
    return { valid: true, claims };
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
    return { valid: true, claims, inOfflineGrace: true };
  }

  return {
    valid: false,
    claims,
    reason: "token expired past the 7-day offline grace window",
  };
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
