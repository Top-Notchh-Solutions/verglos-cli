export type EngineSource = { readonly kind: "cache"; readonly location: string } | { readonly kind: "mirror"; readonly location: string } | { readonly kind: "unavailable"; readonly reason: "offline" | "no-source" };

export function selectEngineSource(options: { readonly cachedPath?: string; readonly mirrorUrl?: string; readonly offline?: boolean }): EngineSource {
  if (options.cachedPath) return { kind: "cache", location: options.cachedPath };
  if (options.mirrorUrl) {
    try { const url = new URL(options.mirrorUrl); if (url.protocol !== "https:") return { kind: "unavailable", reason: "no-source" }; return { kind: "mirror", location: url.toString() }; } catch { return { kind: "unavailable", reason: "no-source" }; }
  }
  return { kind: "unavailable", reason: options.offline ? "offline" : "no-source" };
}
