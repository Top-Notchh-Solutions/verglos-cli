export const HUNT_TARGET_HARNESS_IMAGE = "docker.io/library/node";
export const HUNT_TARGET_HARNESS_IMAGE_DIGEST = "sha256:0a7108bf6c7bf5de370ffb1a3ed6be93d405b43ff159f681a8d18c0e2bc2e402";
export const TARGET_HARNESS_ASSERTION = "target harness emits a supported verdict";

export type TargetHarnessVerdict = "confirmed" | "not-reproduced" | "unsupported";

export type TargetHarnessResult = Readonly<{
  readonly verdict: TargetHarnessVerdict;
  readonly summary?: string;
}>;

/**
 * Parse the one-line result emitted by a customer-owned Hunt harness.
 * Harnesses execute only inside the pinned, network-denied Docker boundary;
 * their output is evidence input, never a command or a verdict by itself.
 */
export function parseTargetHarnessOutput(stdout: string): TargetHarnessResult | undefined {
  const lastLine = stdout.trim().split(/\r?\n/u).filter(Boolean).at(-1);
  if (!lastLine || Buffer.byteLength(lastLine, "utf8") > 4096) return undefined;
  let value: unknown;
  try { value = JSON.parse(lastLine) as unknown; } catch { return undefined; }
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const candidate = value as Record<string, unknown>;
  if (candidate.verglos !== "hunt-result" || !["confirmed", "not-reproduced", "unsupported"].includes(String(candidate.verdict))) return undefined;
  const summary = candidate.summary;
  if (summary !== undefined && (typeof summary !== "string" || summary.length > 256 || /[\u0000-\u001f\u007f]/u.test(summary))) return undefined;
  return Object.freeze({ verdict: candidate.verdict as TargetHarnessVerdict, ...(summary === undefined ? {} : { summary }) });
}
