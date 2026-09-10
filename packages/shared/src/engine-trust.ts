import { createPublicKey, verify } from "node:crypto";
import { canonicalEngineManifest, type EngineManifest } from "./engine-manifest.js";
import { canonicalizeJson } from "./schema.js";
import { verifyArchiveDigest } from "./archive-extractor.js";

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

export type EngineArtifactTrustResult =
  | { readonly trusted: true; readonly engineId: string; readonly version: string; readonly platform: string; readonly keyId: string; readonly digest: string }
  | { readonly trusted: false; readonly reason: "untrusted-source" | "manifest-artifact-mismatch" | "invalid-digest" | "invalid-manifest-signature" };

/** Binds downloaded bytes to a signed manifest entry and an explicitly allowlisted origin. */
export function verifyEngineArtifact(options: {
  readonly manifest: EngineManifest;
  readonly platform: string;
  readonly source: string;
  readonly bytes: Uint8Array;
  readonly allowedOrigins: readonly string[];
  readonly publicKeyPem: string;
}): EngineArtifactTrustResult {
  const { manifest, platform, source, bytes, allowedOrigins, publicKeyPem } = options;
  if (!isTrustedEngineSource(source, allowedOrigins)) return { trusted: false, reason: "untrusted-source" };
  const artifact = manifest.artifacts.find((entry) => entry.platform === platform);
  if (!artifact || artifact.source !== source || artifact.size !== bytes.byteLength) return { trusted: false, reason: "manifest-artifact-mismatch" };
  const signature = verifyEngineManifestSignature(manifest, publicKeyPem);
  if (!signature.trusted) return { trusted: false, reason: "invalid-manifest-signature" };
  try { verifyArchiveDigest(bytes, artifact.digest.slice("sha256:".length)); }
  catch { return { trusted: false, reason: "invalid-digest" }; }
  return { trusted: true, engineId: manifest.engineId, version: manifest.version, platform, keyId: signature.keyId, digest: artifact.digest };
}
