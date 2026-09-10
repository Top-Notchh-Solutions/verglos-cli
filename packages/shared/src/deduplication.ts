import { correlateObservations, type CorrelationInput, type CorrelationGroup } from "./correlation.js";

export interface DedupProjection {
  readonly exact: readonly CorrelationGroup[];
  readonly fuzzyReview: readonly {
    readonly left: string;
    readonly right: string;
    readonly reason: string;
  }[];
}

export class DeduplicationLimitError extends Error { override readonly name = "DeduplicationLimitError"; }

export function deduplicateObservations(items: readonly CorrelationInput[]): DedupProjection {
  if (items.length > 10_000) throw new DeduplicationLimitError("Deduplication input exceeds the bounded 10000-item limit.");
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

  const unique = new Map(fuzzyReview.map((candidate) => [`${candidate.left}\0${candidate.right}\0${candidate.reason}`, candidate]));
  return { exact, fuzzyReview: Object.freeze([...unique.values()].sort((a, b) => a.left.localeCompare(b.left) || a.right.localeCompare(b.right) || a.reason.localeCompare(b.reason))) };
}
