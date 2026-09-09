import { classifyBaseline, type BaselineDocument } from "./baseline.js";

export interface BaselineComparison {
  readonly baselineStatus: "matched" | "mismatched" | "stale";
  readonly newFingerprints: readonly string[];
  readonly acceptedFingerprints: readonly string[];
}

export function compareToBaseline(input: {
  readonly baseline: BaselineDocument;
  readonly currentFingerprints: readonly string[];
  readonly subjectId: string;
  readonly policyDigest: string;
  readonly evaluatedAt: string;
}): BaselineComparison {
  const baselineStatus = classifyBaseline(input.baseline, input.subjectId, input.policyDigest, input.evaluatedAt);
  const accepted = new Set(input.baseline.acceptedFingerprints);
  const current = [...new Set(input.currentFingerprints)].sort();
  return {
    baselineStatus,
    newFingerprints: current.filter((fingerprint) => !accepted.has(fingerprint)),
    acceptedFingerprints: current.filter((fingerprint) => accepted.has(fingerprint)),
  };
}
