import { createPublicKey, verify } from "node:crypto";
import { canonicalEngineManifest, type EngineManifest } from "./engine-manifest.js";
import { canonicalizeJson } from "./schema.js";

export type EngineTrustResult = { readonly trusted: true; readonly keyId: string } | { readonly trusted: false; readonly reason: "invalid-key" | "invalid-signature" | "unsupported-algorithm" };

export function isTrustedEngineSource(source: string, allowedOrigins: readonly string[]): boolean {
  try { const url = new URL(source); if (url.protocol !== "https:" || url.username || url.password || url.hash) return false; return allowedOrigins.some((origin) => { try { const allowed = new URL(origin); return allowed.protocol === "https:" && !allowed.username && !allowed.password && url.origin === allowed.origin; } catch { return false; } }); } catch { return false; }
}

export function verifyEngineManifestSignature(manifest: EngineManifest, publicKeyPem: string): EngineTrustResult {
  if (manifest.signature.algorithm !== "ed25519") return { trusted: false, reason: "unsupported-algorithm" };
  try {
    const key = createPublicKey(publicKeyPem);
    const signature = Buffer.from(manifest.signature.value, "base64");
    const { signature: _signature, ...unsigned } = manifest;
    return verify(null, Buffer.from(canonicalizeJson(unsigned), "utf8"), key, signature)
      ? { trusted: true, keyId: manifest.signature.keyId } : { trusted: false, reason: "invalid-signature" };
  } catch { return { trusted: false, reason: "invalid-key" }; }
}
