import type { EngineHealthDocument, ToolRunDocument } from "./engine.js";
import type { ObservationDocument } from "./observation.js";

export interface AdapterCapability { readonly id: string; readonly description: string; readonly requiresNetwork: boolean; }
export interface EngineRequirements { readonly runtime: string; readonly executable: string; readonly configDigest?: string; readonly databaseDigest?: string; }
export interface EngineExecutionRequest { readonly targetSubjectId: string; readonly targetPath?: string; readonly capabilities: readonly string[]; readonly timeoutMs: number; readonly network: "denied" | "allowlisted"; readonly allowlist?: readonly string[]; readonly signal?: AbortSignal; }
export interface EngineRawOutput { readonly mediaType: string; readonly bytes: Uint8Array; readonly digest: string; readonly redacted: boolean; }
export interface EngineExecutionResult { readonly run: ToolRunDocument; readonly observations: readonly ObservationDocument[]; readonly rawOutput?: EngineRawOutput; }

export interface EngineAdapter {
  readonly id: string;
  readonly version: string;
  readonly capabilities: readonly AdapterCapability[];
  readonly requirements: EngineRequirements;
  health(): Promise<EngineHealthDocument>;
  execute(request: EngineExecutionRequest): Promise<EngineExecutionResult>;
  normalize(raw: EngineRawOutput): readonly ObservationDocument[];
  updateMetadata(): Readonly<{ readonly channel: "stable" | "beta" | "pinned"; readonly source?: string; readonly digest?: string }>;
}

export function assertEngineRequestBound(request: EngineExecutionRequest): void {
  if (request.timeoutMs <= 0 || request.timeoutMs > 86_400_000) throw new Error("Engine timeout must be bounded.");
  if (request.network === "allowlisted" && (!request.allowlist || request.allowlist.length === 0)) throw new Error("Allowlisted engine execution requires destinations.");
  if (request.network === "denied" && request.allowlist?.length) throw new Error("Denied engine execution cannot carry destinations.");
}
