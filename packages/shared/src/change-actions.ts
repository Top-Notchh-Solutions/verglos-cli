import { getSnapshotEvidence, getSnapshotRiskObservation, getSnapshotRiskSummary, type ReleaseDiff, type RiskObservation } from "./release-diff.js";
import type { AnyReleaseSnapshot } from "./release-snapshot.js";

export type ChangeAction = Readonly<{
  fingerprint: string;
  status: "added" | "fixed" | "worsened" | "improved";
  severity: Readonly<{ assessment: "known" | "mixed" | "unavailable"; before?: string; after?: string }>;
  remediation: readonly string[];
  evidence: ReturnType<typeof getSnapshotEvidence>;
  owner: Readonly<{ status: "unassigned"; nextAction: string }>;
  rescan: Readonly<{ status: "required" | "unknown"; reason: string }>;
  huntEligibility: Readonly<{ status: "not-evaluated"; reason: string }>;
}>;

export type ChangeActionProjection = Readonly<{
  added: readonly string[];
  fixed: readonly string[];
  worsened: readonly string[];
  improved: readonly string[];
  unchanged: readonly string[];
  severityUnassessed: readonly string[];
  deltas: Readonly<{ identity: boolean; coverage: boolean; policy: boolean }>;
  coverageDelta: ReleaseDiff["coverageDelta"];
  blockers: ReleaseDiff["comparisonBlockers"];
  changes: readonly ChangeAction[];
  nextActions: readonly string[];
}>;

function severityFor(snapshot: AnyReleaseSnapshot, fingerprint: string): RiskObservation["severity"] {
  return getSnapshotRiskObservation(snapshot, fingerprint)?.severity;
}

export function projectChangeActions(diff: ReleaseDiff, base: AnyReleaseSnapshot, head: AnyReleaseSnapshot): ChangeActionProjection {
  const nextActions: string[] = [];
  if (diff.added.length) nextActions.push("Review newly observed fingerprints before release.");
  if (diff.worsened.length) nextActions.push("Prioritize worsened severity observations and preserve their evidence.");
  if (diff.fixed.length) nextActions.push("Confirm missing fingerprints against comparable coverage; disappearance alone does not prove remediation.");
  if (diff.identityChanged) nextActions.push("Reconcile the changed subject identity before interpreting risk changes.");
  if (diff.coverageChanged) nextActions.push("Review the before/after producer coverage delta.");
  if (diff.lineageDelta.changed) nextActions.push("Review added/removed lineage edges and unresolved lineage gaps before relying on provenance.");
  if (diff.comparisonBlockers.some((blocker) => blocker.code === "lineage-unresolved")) nextActions.push("Resolve or explicitly accept the recorded lineage gaps; provenance is incomplete.");
  if (diff.policyChanged) nextActions.push("Confirm the effective policy-input change is intentional; this diff does not evaluate policy.");
  if (diff.comparisonBlockers.some((blocker) => blocker.code === "severity-unassessed")) nextActions.push("Refresh or import complete severity evidence before asserting that risk is unchanged.");
  if (!nextActions.length) nextActions.push("No recorded fingerprint change requires immediate follow-up; snapshot freshness is not established.");

  const fingerprints = [...new Set([...diff.added, ...diff.fixed, ...diff.worsened, ...diff.improved])].sort();
  const changes = fingerprints.map((fingerprint): ChangeAction => {
    const status: ChangeAction["status"] = diff.added.includes(fingerprint) ? "added"
      : diff.fixed.includes(fingerprint) ? "fixed"
        : diff.worsened.includes(fingerprint) ? "worsened" : "improved";
    const prior = severityFor(base, fingerprint);
    const current = severityFor(head, fingerprint);
    const severityState = [prior?.status, current?.status].some((state) => state === "mixed") ? "mixed" as const
      : prior?.status === "known" && current?.status === "known" ? "known" as const : "unavailable" as const;
    const summarySource = status === "fixed" ? base : head;
    const needsRescan = status === "added" || status === "worsened" || diff.coverageChanged || diff.identityChanged || diff.coverageDelta.before.status !== "complete" || diff.coverageDelta.after.status !== "complete" || diff.severityUnassessed.includes(fingerprint);
    const summary = getSnapshotRiskSummary(summarySource, fingerprint);
    return Object.freeze({
      fingerprint,
      status,
      severity: Object.freeze({ assessment: severityState, ...(prior?.value ? { before: prior.value } : {}), ...(current?.value ? { after: current.value } : {}) }),
      remediation: Object.freeze([...summary]),
      evidence: getSnapshotEvidence(summarySource, fingerprint),
      owner: Object.freeze({ status: "unassigned" as const, nextAction: "Assign an accountable owner; no owner assignment is present in these snapshots." }),
      rescan: Object.freeze({ status: needsRescan ? "required" as const : "unknown" as const, reason: needsRescan ? "Capture a new snapshot after addressing the change or coverage gap." : "Snapshot freshness is not encoded, so no-rescan cannot be asserted." }),
      huntEligibility: Object.freeze({ status: "not-evaluated" as const, reason: "A diff does not include trusted recipe or request-scoped approval evidence and never executes Hunt." }),
    });
  });

  if (changes.some((change) => change.owner.status === "unassigned")) nextActions.push("Assign accountable owners for changes before release review.");
  if (changes.some((change) => change.evidence.status === "unavailable")) nextActions.push("Capture or import validated producer evidence before relying on detailed provenance.");
  return Object.freeze({
    added: Object.freeze([...diff.added]),
    fixed: Object.freeze([...diff.fixed]),
    worsened: Object.freeze([...diff.worsened]),
    improved: Object.freeze([...diff.improved]),
    unchanged: Object.freeze([...diff.unchanged]),
    severityUnassessed: Object.freeze([...diff.severityUnassessed]),
    deltas: Object.freeze({ identity: diff.identityChanged, coverage: diff.coverageChanged, policy: diff.policyChanged }),
    coverageDelta: diff.coverageDelta,
    blockers: diff.comparisonBlockers,
    changes: Object.freeze(changes),
    nextActions: Object.freeze([...new Set(nextActions)].slice(0, 12)),
  });
}
