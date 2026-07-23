import { sign as ed25519Sign, type KeyObject } from "node:crypto";
import type { EntitlementClaims, SignedEntitlement } from "./types.js";

/**
 * Server-side entitlement signing. Runs in the /v1/entitlement API
 * route (Vercel Fluid Compute). The private key comes from KMS —
 * see design §8.
 *
 * Wire format is a compact JWT-shaped string:
 *   base64url(headerJSON) . base64url(claimsJSON) . base64url(sig)
 *
 * Where header = {"alg":"EdDSA","typ":"JWT"}. We hand-roll the
 * encoding instead of pulling in `jose` because the shape is tiny
 * (three fields), Ed25519 has no algorithm-confusion risk with
 * `alg:none` (the header is signed alongside the claims), and one
 * fewer dependency on the API route means one fewer thing to keep
 * patched.
 */

const HEADER = '{"alg":"EdDSA","typ":"JWT"}';
const HEADER_B64 = base64UrlEncode(Buffer.from(HEADER, "utf8"));

/** 24h token TTL. */
export const DEFAULT_TTL_SECONDS = 24 * 60 * 60;

export interface SignEntitlementInput {
  /** Claims minus iat / exp — the server sets those. */
  claims: Omit<EntitlementClaims, "iat" | "exp"> & {
    /** Optional override — mostly for tests. */
    iat?: number;
    /** Optional override — mostly for tests. */
    exp?: number;
  };
  privateKey: KeyObject;
  /** Override token lifetime; defaults to 24h. */
  ttlSeconds?: number;
}

export function signEntitlement(input: SignEntitlementInput): SignedEntitlement {
  const now = Math.floor(Date.now() / 1000);
  const iat = input.claims.iat ?? now;
  const exp =
    input.claims.exp ?? iat + (input.ttlSeconds ?? DEFAULT_TTL_SECONDS);

  const fullClaims: EntitlementClaims = {
    ...input.claims,
    iat,
    exp,
  };

  const claimsJson = JSON.stringify(fullClaims);
  const claimsB64 = base64UrlEncode(Buffer.from(claimsJson, "utf8"));

  const signingInput = Buffer.from(`${HEADER_B64}.${claimsB64}`, "utf8");
  // Ed25519 in Node's crypto — pass null for the hash algorithm
  // (Ed25519 has an implicit hash step per RFC 8032).
  const signature = ed25519Sign(null, signingInput, input.privateKey);
  const sigB64 = base64UrlEncode(signature);

  return `${HEADER_B64}.${claimsB64}.${sigB64}`;
}

function base64UrlEncode(buf: Buffer): string {
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}
