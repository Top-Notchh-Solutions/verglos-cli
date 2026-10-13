import type { HuntAttackHypothesis, HuntRecipe, ScanResult } from "@verglos/shared";
import type { HuntAttackProofResult, HuntAttackRetestResult, HuntAttackWorkerResult } from "@verglos/hunt";

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
  planSupportedHuntAttack(input: unknown): HuntAttackHypothesis;
  runSupportedHuntAttack(input: unknown): Promise<HuntAttackWorkerResult>;
  runSupportedHuntProof(input: unknown): Promise<HuntAttackProofResult>;
  runSupportedHuntRetest(input: unknown): Promise<HuntAttackRetestResult>;
  validateSupportedHuntRecipe(value: unknown): Readonly<{ supported: true; recipeDigest: string }> | Readonly<{ supported: false; reason: string }>;
  RestrictedProcessAdapter: new (recipe: HuntRecipe) => unknown;
  DockerSandboxAdapter: new (options: { readonly image: string; readonly imageDigest: string }) => unknown;
  HUNT_TARGET_HARNESS_IMAGE: string;
  HUNT_TARGET_HARNESS_IMAGE_DIGEST: string;
  runHunt(report: ScanResult, options: unknown): Promise<HuntRuntimeResult>;
}>;

export type HuntRuntimeLoader = () => Promise<unknown>;

/** Load the public bounded Hunt runtime shipped as a separately audited package. */
export async function loadHuntRuntime(loader: HuntRuntimeLoader = () => import(HUNT_RUNTIME_PACKAGE)): Promise<HuntRuntime> {
  let candidate: unknown;
  try {
    candidate = await loader();
  } catch {
    throw new Error("HUNT_RUNTIME_UNAVAILABLE");
  }
  if (!candidate || typeof candidate !== "object") throw new Error("HUNT_RUNTIME_INVALID");
  const runtime = candidate as Record<string, unknown>;
  if (typeof runtime.planSupportedHuntAttack !== "function" || typeof runtime.runSupportedHuntAttack !== "function" || typeof runtime.runSupportedHuntProof !== "function" || typeof runtime.runSupportedHuntRetest !== "function" || typeof runtime.validateSupportedHuntRecipe !== "function" || typeof runtime.RestrictedProcessAdapter !== "function" || typeof runtime.DockerSandboxAdapter !== "function" || typeof runtime.HUNT_TARGET_HARNESS_IMAGE !== "string" || typeof runtime.HUNT_TARGET_HARNESS_IMAGE_DIGEST !== "string" || typeof runtime.runHunt !== "function") {
    throw new Error("HUNT_RUNTIME_INVALID");
  }
  return runtime as unknown as HuntRuntime;
}
