import { classifyBaseline, type BaselineDocument } from "./baseline.js";

export interface BaselineComparison {
  readonly baselineStatus: "matched" | "mismatched" | "stale";
  readonly newFingerprints: readonly string[];
  readonly acceptedFingerprints: readonly string[];
}
export class BaselineComparisonError extends Error { override readonly name = "BaselineComparisonError"; }

export function compareToBaseline(input: {
  readonly baseline: BaselineDocument;
  readonly currentFingerprints: readonly string[];
  readonly subjectId: string;
  readonly policyDigest: string;
  readonly evaluatedAt: string;
}): BaselineComparison {
  if (input.currentFingerprints.length > 20_000) throw new BaselineComparisonError("Current fingerprint set exceeds the bounded 20000-item limit.");
  if (input.currentFingerprints.some((fingerprint) => !/^sha256:[a-f0-9]{64}$/.test(fingerprint))) throw new BaselineComparisonError("Current fingerprints must be SHA-256 values.");
  if (!/^\d{4}-\d{2}-\d{2}T/.test(input.evaluatedAt) || !Number.isFinite(Date.parse(input.evaluatedAt))) throw new BaselineComparisonError("evaluatedAt must be a valid timestamp.");
  const baselineStatus = classifyBaseline(input.baseline, input.subjectId, input.policyDigest, input.evaluatedAt);
  const accepted = new Set(input.baseline.acceptedFingerprints);
  const current = [...new Set(input.currentFingerprints)].sort();
  return {
    baselineStatus,
    newFingerprints: current.filter((fingerprint) => !accepted.has(fingerprint)),
    acceptedFingerprints: current.filter((fingerprint) => accepted.has(fingerprint)),
  };
}
