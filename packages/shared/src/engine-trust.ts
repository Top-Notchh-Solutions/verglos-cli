import { createPublicKey, verify } from "node:crypto";
import { canonicalEngineManifest, type EngineManifest } from "./engine-manifest.js";
import { canonicalizeJson } from "./schema.js";

export type EngineTrustResult = { readonly trusted: true; readonly keyId: string } | { readonly trusted: false; readonly reason: "invalid-key" | "invalid-signature" | "unsupported-algorithm" };

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
