import { createHash } from "node:crypto";
import { createSubject, type OciIndexSubject, type OciManifestSubject } from "./subject.js";
import { parseOciReference } from "./oci-reference.js";

export class OciResolutionError extends Error {
  override readonly name = "OciResolutionError";
  constructor(readonly code: "INVALID_DOCUMENT" | "TAG_NOT_IMMUTABLE" | "PLATFORM_REQUIRED" | "UNSUPPORTED_MEDIA", message: string) { super(message); }
}

function digest(bytes: Uint8Array) { return { algorithm: "sha256" as const, value: createHash("sha256").update(bytes).digest("hex") }; }
function platform(value: unknown) {
  if (typeof value !== "object" || value === null || typeof (value as { os?: unknown }).os !== "string" || typeof (value as { architecture?: unknown }).architecture !== "string") throw new OciResolutionError("INVALID_DOCUMENT", "OCI platform entries require os and architecture.");
  const p = value as { os: string; architecture: string; variant?: string };
  return { os: p.os, architecture: p.architecture, ...(p.variant ? { variant: p.variant } : {}) };
}

export function resolveOciDocument(reference: string, bytes: Uint8Array): OciManifestSubject | OciIndexSubject {
  const ref = parseOciReference(reference);
  if (!ref.digest) throw new OciResolutionError("TAG_NOT_IMMUTABLE", "OCI resolution requires a digest-pinned reference.");
  const referenceDigest = { algorithm: "sha256" as const, value: ref.digest.slice(7) };
  let document: Record<string, unknown>;
  try { const value: unknown = JSON.parse(new TextDecoder().decode(bytes)); if (typeof value !== "object" || value === null) throw new Error(); document = value as Record<string, unknown>; } catch { throw new OciResolutionError("INVALID_DOCUMENT", "OCI document is not valid JSON."); }
  const mediaType = typeof document.mediaType === "string" ? document.mediaType : "";
  if (mediaType.includes("image.index") || Array.isArray(document.manifests)) {
    const manifests = document.manifests as unknown[];
    if (manifests.length === 0) throw new OciResolutionError("INVALID_DOCUMENT", "OCI index must contain manifests.");
    return createSubject({ kind: "oci-index", registry: ref.registry, repository: ref.repository, digest: referenceDigest, size: bytes.byteLength, manifests: manifests.map((entry) => { const item = entry as { digest?: unknown; size?: unknown; platform?: unknown }; if (typeof item.digest !== "string" || !item.digest.startsWith("sha256:")) throw new OciResolutionError("INVALID_DOCUMENT", "OCI index child digest must be sha256."); return { digest: { algorithm: "sha256", value: item.digest.slice(7) }, ...(typeof item.size === "number" ? { size: item.size } : {}), platform: platform(item.platform) }; }) }) as OciIndexSubject;
  }
  if (!mediaType.includes("image.manifest") && document.config === undefined) throw new OciResolutionError("UNSUPPORTED_MEDIA", "OCI document is neither an image manifest nor index.");
  const p = document.platform ? platform(document.platform) : { os: "unknown", architecture: "unknown" };
  return createSubject({ kind: "oci-manifest", registry: ref.registry, repository: ref.repository, digest: referenceDigest, size: bytes.byteLength, platform: p }) as OciManifestSubject;
}
