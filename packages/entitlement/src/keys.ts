import {
  generateKeyPairSync,
  createPublicKey,
  createPrivateKey,
  type KeyObject,
} from "node:crypto";

/**
 * Ed25519 key material handling for the entitlement service.
 *
 * The PUBLIC key is pinned in the CLI binary (a base64url string
 * baked into a compiled-in constant). Ships with every download.
 * The PRIVATE key lives in KMS in production — see design §8
 * ("Signing keys live in a KMS. Never on a developer machine,
 *  never in the repo, never in CI env vars.").
 *
 * This file exposes helpers to generate a keypair (dev / rotation),
 * to load a public key for verification, and to load a private key
 * for signing. Never persists the private key anywhere.
 */

export interface EntitlementKeyMaterial {
  /** PEM-encoded Ed25519 public key. */
  publicKeyPem: string;
  /** PEM-encoded Ed25519 private key (PKCS8). Sensitive — never log. */
  privateKeyPem: string;
  /** Base64url of the 32-byte raw public key. Pinned in the CLI. */
  publicKeyBase64Url: string;
}

/**
 * Generate a fresh Ed25519 keypair. Used to bootstrap the
 * entitlement server or rotate the pinned public key.
 *
 * Rotation policy: bump the CLI's PINNED_PUBLIC_KEY constant when
 * a new keypair is issued. Old tokens remain valid until their exp
 * because the previous public key stays valid on the server via a
 * "verify with any of these" list. Clients pin the current key
 * only.
 */
export function generateEntitlementKeyPair(): EntitlementKeyMaterial {
  const { publicKey, privateKey } = generateKeyPairSync("ed25519");

  const publicKeyPem = publicKey
    .export({ type: "spki", format: "pem" })
    .toString();
  const privateKeyPem = privateKey
    .export({ type: "pkcs8", format: "pem" })
    .toString();

  // Raw 32-byte public key extracted from the DER SPKI:
  //   the last 32 bytes of a SubjectPublicKeyInfo for Ed25519 are
  //   the raw key. This is what we pin in the CLI so verify has
  //   no PEM parsing dependency.
  const spkiDer = publicKey.export({ type: "spki", format: "der" });
  const rawPubKey = spkiDer.subarray(spkiDer.length - 32);
  const publicKeyBase64Url = rawPubKey
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

  return { publicKeyPem, privateKeyPem, publicKeyBase64Url };
}

/** Rebuild an Ed25519 public KeyObject from a base64url raw 32-byte key. */
export function publicKeyFromBase64Url(b64url: string): KeyObject {
  const b64 =
    b64url.replace(/-/g, "+").replace(/_/g, "/") +
    "==".slice(0, (4 - (b64url.length % 4)) % 4);
  const raw = Buffer.from(b64, "base64");
  if (raw.length !== 32) {
    throw new Error(
      `Expected 32-byte Ed25519 public key, got ${raw.length} bytes.`,
    );
  }
  // Wrap the raw key in a SubjectPublicKeyInfo. This 12-byte
  // prefix is the fixed Ed25519 DER header per RFC 8410 §4.
  const spkiHeader = Buffer.from([
    0x30, 0x2a, 0x30, 0x05, 0x06, 0x03, 0x2b, 0x65, 0x70, 0x03, 0x21, 0x00,
  ]);
  const spki = Buffer.concat([spkiHeader, raw]);
  return createPublicKey({ key: spki, format: "der", type: "spki" });
}

/** Load a private key from PEM (server-side signing). */
export function privateKeyFromPem(pem: string): KeyObject {
  return createPrivateKey(pem);
}

/** Load a public key from PEM (server-side verify or key rotation). */
export function publicKeyFromPem(pem: string): KeyObject {
  return createPublicKey(pem);
}
