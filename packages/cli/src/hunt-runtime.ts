import type { HuntRecipe, ScanResult } from "@verglos/shared";

const HUNT_RUNTIME_PACKAGE = "@verglos/hunt";

export type HuntRuntimeOutcome = Readonly<{
  findingId: string;
  verdict: string;
  canonicalVerdict?: string;
  reason: string;
  durationMs: number;
  evidenceDigest?: string;
  executionStatus?: string;
  assurance?: unknown;
}>;

export type HuntRuntimeResult = Readonly<{
  sandbox: string;
  outcomes: readonly HuntRuntimeOutcome[];
}>;

export type HuntRuntime = Readonly<{
  validateSupportedHuntRecipe(value: unknown): Readonly<{ supported: true; recipeDigest: string }> | Readonly<{ supported: false; reason: string }>;
  RestrictedProcessAdapter: new (recipe: HuntRecipe) => unknown;
  runHunt(report: ScanResult, options: unknown): Promise<HuntRuntimeResult>;
}>;

export type HuntRuntimeLoader = () => Promise<unknown>;

/**
 * The public CLI has a protocol boundary to the separately provisioned
 * private Hunt runtime. It must not package, import, or require that runtime
 * as a public workspace dependency.
 */
export async function loadHuntRuntime(loader: HuntRuntimeLoader = () => import(HUNT_RUNTIME_PACKAGE)): Promise<HuntRuntime> {
  let candidate: unknown;
  try {
    candidate = await loader();
  } catch {
    throw new Error("HUNT_RUNTIME_UNAVAILABLE");
  }
  if (!candidate || typeof candidate !== "object") throw new Error("HUNT_RUNTIME_INVALID");
  const runtime = candidate as Record<string, unknown>;
  if (typeof runtime.validateSupportedHuntRecipe !== "function" || typeof runtime.RestrictedProcessAdapter !== "function" || typeof runtime.runHunt !== "function") {
    throw new Error("HUNT_RUNTIME_INVALID");
  }
  return runtime as unknown as HuntRuntime;
}
