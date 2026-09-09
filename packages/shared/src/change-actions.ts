import type { ReleaseDiff } from "./release-diff.js";

export type ChangeActionProjection = Readonly<{
  added: readonly string[];
  fixed: readonly string[];
  unchanged: readonly string[];
  deltas: Readonly<{ identity: boolean; coverage: boolean; policy: boolean }>;
  nextActions: readonly string[];
}>;

export function projectChangeActions(diff: ReleaseDiff): ChangeActionProjection {
  const nextActions: string[] = [];
  if (diff.added.length) nextActions.push("Review newly observed fingerprints before release.");
  if (diff.identityChanged) nextActions.push("Reconcile the changed subject identity before comparing release risk.");
  if (diff.coverageChanged) nextActions.push("Review coverage changes and any newly exposed evidence gaps.");
  if (diff.policyChanged) nextActions.push("Confirm the effective policy change is intentional.");
  if (!nextActions.length) nextActions.push("No recorded release changes require follow-up.");
  return Object.freeze({ added: Object.freeze([...diff.added]), fixed: Object.freeze([...diff.fixed]), unchanged: Object.freeze([...diff.unchanged]), deltas: Object.freeze({ identity: diff.identityChanged, coverage: diff.coverageChanged, policy: diff.policyChanged }), nextActions: Object.freeze(nextActions.slice(0, 8)) });
}
