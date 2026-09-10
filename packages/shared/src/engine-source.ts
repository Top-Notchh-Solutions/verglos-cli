export type EngineSource = { readonly kind: "cache"; readonly location: string } | { readonly kind: "mirror"; readonly location: string } | { readonly kind: "unavailable"; readonly reason: "offline" | "no-source" | "untrusted" | "stale" };

export function selectEngineSource(options: { readonly cachedPath?: string; readonly mirrorUrl?: string; readonly offline?: boolean }): EngineSource {
  if (options.cachedPath) return { kind: "cache", location: options.cachedPath };
  if (options.mirrorUrl) {
    try { const url = new URL(options.mirrorUrl); if (url.protocol !== "https:") return { kind: "unavailable", reason: "no-source" }; return { kind: "mirror", location: url.toString() }; } catch { return { kind: "unavailable", reason: "no-source" }; }
  }
  return { kind: "unavailable", reason: options.offline ? "offline" : "no-source" };
}

export interface EngineSourceMetadata { readonly manifestDigest: `sha256:${string}`; readonly databaseDigest: `sha256:${string}`; readonly checkedAt: string; readonly signatureVerified: boolean; }

/** Selects a cache or mirror only when its metadata is signed, pinned, and fresh. */
export function selectVerifiedEngineSource(options: {
  readonly cachedPath?: string;
  readonly mirrorUrl?: string;
  readonly offline?: boolean;
  readonly allowedOrigins: readonly string[];
  readonly metadata?: EngineSourceMetadata;
  readonly now?: Date;
  readonly maxAgeMs?: number;
}): EngineSource {
  const base = selectEngineSource(options);
  if (base.kind === "unavailable") return base;
  if (!options.metadata?.signatureVerified || !/^sha256:[a-f0-9]{64}$/.test(options.metadata.manifestDigest) || !/^sha256:[a-f0-9]{64}$/.test(options.metadata.databaseDigest)) return { kind: "unavailable", reason: "untrusted" };
  const checked = Date.parse(options.metadata.checkedAt); const age = (options.now ?? new Date()).getTime() - checked;
  if (!Number.isFinite(checked) || age < 0 || age > (options.maxAgeMs ?? 24 * 60 * 60 * 1000)) return { kind: "unavailable", reason: "stale" };
  if (base.kind === "mirror") {
    try { const url = new URL(base.location); const allowed = options.allowedOrigins.some((origin) => new URL(origin).origin === url.origin); if (!allowed) return { kind: "unavailable", reason: "untrusted" }; } catch { return { kind: "unavailable", reason: "untrusted" }; }
  }
  return base;
}
