import { correlateObservations, type CorrelationInput, type CorrelationGroup } from "./correlation.js";

export interface DedupProjection {
  readonly exact: readonly CorrelationGroup[];
  readonly fuzzyReview: readonly {
    readonly left: string;
    readonly right: string;
    readonly reason: string;
  }[];
}

export function deduplicateObservations(items: readonly CorrelationInput[]): DedupProjection {
  const exact = correlateObservations(items);
  const fuzzyReview: { left: string; right: string; reason: string }[] = [];

  for (let i = 0; i < items.length; i += 1) {
    for (let j = i + 1; j < items.length; j += 1) {
      const a = items[i]!;
      const b = items[j]!;
      if (a.subjectId === b.subjectId && a.rule === b.rule && a.location !== b.location) {
        fuzzyReview.push({
          left: a.producerId,
          right: b.producerId,
          reason: "same subject and rule with different locations",
        });
      }
    }
  }

  return { exact, fuzzyReview: Object.freeze(fuzzyReview) };
}
