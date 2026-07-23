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
 * PINNED PUBLIC KEY — replace when rotating.
 *
 * This is the base64url-encoded 32-byte raw Ed25519 public key.
 * Compiled into the CLI binary; ships with every download. The
 * private counterpart lives in KMS (arch §8).
 *
 * The zero placeholder below matches an all-zero Ed25519 pubkey
 * (which no real signature will ever pass) and will fail every
 * verify() call until the first real key is generated and pinned.
 * Regenerate with:
 *   node -e "const {generateEntitlementKeyPair}=require('@verglos/entitlement');console.log(generateEntitlementKeyPair().publicKeyBase64Url)"
 * and paste the output here.
 */
export const PINNED_PUBLIC_KEY_B64URL =
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

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

/**
 * Verify a signed entitlement token. Returns a VerifyResult that
 * distinguishes:
 *   - valid (signature ok, exp future) → treat as authoritative
 *   - inOfflineGrace (signature ok, exp past, within 7d) → treat
 *     as valid AND surface a renewal nudge to the user
 *   - invalid → free-tier caps apply
 */
export async function verifyEntitlement(
  token: SignedEntitlement,
  now: number = Date.now(),
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
  const publicKey = publicKeyFromBase64Url(PINNED_PUBLIC_KEY_B64URL);
  const sigOk = ed25519Verify(null, signingInput, publicKey, signature);
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
