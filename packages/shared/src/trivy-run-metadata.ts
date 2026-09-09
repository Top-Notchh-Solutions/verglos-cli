import { createHash } from "node:crypto";

const sha256 = (bytes: Uint8Array | string) => `sha256:${createHash("sha256").update(bytes).digest("hex")}` as const;
export interface TrivyRunMetadata { readonly producerId: "trivy"; readonly version: string; readonly binaryDigest: `sha256:${string}`; readonly databaseDigest?: `sha256:${string}`; readonly checksDigest?: `sha256:${string}`; readonly configDigest?: `sha256:${string}`; readonly source: "managed" | "system" | "user" | "bundled"; readonly license: "Apache-2.0"; readonly capabilities: readonly string[]; readonly startedAt: string; readonly completedAt: string; }

export function createTrivyRunMetadata(input: { readonly version: string; readonly binary: Uint8Array | string; readonly database?: Uint8Array | string; readonly checks?: Uint8Array | string; readonly config?: Uint8Array | string; readonly source: TrivyRunMetadata["source"]; readonly capabilities: readonly string[]; readonly startedAt: string; readonly completedAt: string }): TrivyRunMetadata {
  const started = Date.parse(input.startedAt); const completed = Date.parse(input.completedAt);
  if (!input.version || !Number.isFinite(started) || !Number.isFinite(completed) || completed < started) throw new Error("Trivy run timestamps and version must be valid.");
  return Object.freeze({ producerId: "trivy", version: input.version.slice(0, 128), binaryDigest: sha256(input.binary), ...(input.database !== undefined ? { databaseDigest: sha256(input.database) } : {}), ...(input.checks !== undefined ? { checksDigest: sha256(input.checks) } : {}), ...(input.config !== undefined ? { configDigest: sha256(input.config) } : {}), source: input.source, license: "Apache-2.0", capabilities: Object.freeze([...new Set(input.capabilities)].sort()), startedAt: input.startedAt, completedAt: input.completedAt });
}
