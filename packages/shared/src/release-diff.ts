import type { AnyReleaseSnapshot } from "./release-snapshot.js";
import { canonicalizeJson } from "./schema.js";

export type CoverageProjection = Readonly<{
  status: "complete" | "incomplete" | "unavailable";
  target: Readonly<{ state: "complete" | "incomplete" | "unavailable"; limitations: readonly string[] }>;
  producers: readonly Readonly<{ producer: string; state: string; observationCount: number; limitations: readonly string[] }>[];
}>;
export type ComparisonBlocker = Readonly<{
  code: "identity-changed" | "coverage-unavailable" | "coverage-incomplete" | "severity-unassessed";
  count?: number;
  reason: string;
}>;
export interface ReleaseDiff {
  readonly added: readonly string[];
  readonly fixed: readonly string[];
  readonly worsened: readonly string[];
  readonly improved: readonly string[];
  /** Stable fingerprint presence only; check severityAssessment before interpreting risk as unchanged. */
  readonly unchanged: readonly string[];
  readonly severityUnassessed: readonly string[];
  readonly identityChanged: boolean;
  readonly coverageChanged: boolean;
  readonly policyChanged: boolean;
  readonly coverageDelta: Readonly<{ before: CoverageProjection; after: CoverageProjection; changed: boolean }>;
  readonly comparisonBlockers: readonly ComparisonBlocker[];
}

type Severity = "critical" | "high" | "medium" | "low" | "info";
export type RiskObservation = { readonly fingerprint: string; readonly severity?: { readonly status: string; readonly value?: Severity } };
const SEVERITY_ORDER: Readonly<Record<Severity, number>> = Object.freeze({ info: 1, low: 2, medium: 3, high: 4, critical: 5 });

function coverageProjection(snapshot: AnyReleaseSnapshot): CoverageProjection {
  if (!("coverage" in snapshot) || !snapshot.coverage) return Object.freeze({ status: "unavailable", target: Object.freeze({ state: "unavailable", limitations: Object.freeze(["Snapshot predates target coverage evidence."]) }), producers: Object.freeze([]) });
  return Object.freeze({
    status: snapshot.coverage.status,
    target: Object.freeze({ state: snapshot.coverage.target.state, limitations: Object.freeze([...snapshot.coverage.target.limitations]) }),
    producers: Object.freeze(snapshot.coverage.producers.map((producer) => Object.freeze({ producer: producer.producer, state: producer.state, observationCount: producer.observationCount, limitations: Object.freeze([...producer.limitations]) })).sort((a, b) => a.producer.localeCompare(b.producer))),
  });
}

function riskMap(snapshot: AnyReleaseSnapshot): ReadonlyMap<string, RiskObservation> {
  return new Map(snapshot.observations.map((observation) => [observation.fingerprint, observation as RiskObservation]));
}

export function diffReleaseSnapshots(base: AnyReleaseSnapshot, head: AnyReleaseSnapshot): ReleaseDiff {
  const before = new Set(base.observations.map((observation) => observation.fingerprint));
  const after = new Set(head.observations.map((observation) => observation.fingerprint));
  const added = [...after].filter((fingerprint) => !before.has(fingerprint)).sort();
  const fixed = [...before].filter((fingerprint) => !after.has(fingerprint)).sort();
  const unchanged = [...after].filter((fingerprint) => before.has(fingerprint)).sort();
  const baseRisk = riskMap(base);
  const headRisk = riskMap(head);
  const worsened: string[] = [];
  const improved: string[] = [];
  const severityUnassessed: string[] = [];
  for (const fingerprint of unchanged) {
    const prior = baseRisk.get(fingerprint)?.severity;
    const current = headRisk.get(fingerprint)?.severity;
    if (prior?.status !== "known" || current?.status !== "known" || !prior.value || !current.value) {
      severityUnassessed.push(fingerprint);
      continue;
    }
    if (SEVERITY_ORDER[current.value] > SEVERITY_ORDER[prior.value]) worsened.push(fingerprint);
    else if (SEVERITY_ORDER[current.value] < SEVERITY_ORDER[prior.value]) improved.push(fingerprint);
  }
  const identityChanged = base.primarySubjectId !== head.primarySubjectId || canonicalizeJson([...base.subjectIds].sort()) !== canonicalizeJson([...head.subjectIds].sort());
  const baseCoverage = coverageProjection(base);
  const headCoverage = coverageProjection(head);
  const baseHasCoverage = "coverage" in base && !!base.coverage;
  const headHasCoverage = "coverage" in head && !!head.coverage;
  const coverageChanged = !baseHasCoverage && !headHasCoverage
    ? canonicalizeJson(base.lineage) !== canonicalizeJson(head.lineage)
    : baseCoverage.status !== headCoverage.status || canonicalizeJson(baseCoverage.target) !== canonicalizeJson(headCoverage.target) || canonicalizeJson(baseCoverage.producers) !== canonicalizeJson(headCoverage.producers);
  const policyChanged = base.policyInputDigest !== head.policyInputDigest;
  const comparisonBlockers: ComparisonBlocker[] = [];
  if (identityChanged) comparisonBlockers.push({ code: "identity-changed", reason: "The subject set changed; findings are not directly comparable until identity is reconciled." });
  if (baseCoverage.status === "unavailable" || headCoverage.status === "unavailable") comparisonBlockers.push({ code: "coverage-unavailable", reason: "At least one snapshot predates producer coverage evidence; coverage completeness cannot be established." });
  if (baseCoverage.status === "incomplete" || headCoverage.status === "incomplete") comparisonBlockers.push({ code: "coverage-incomplete", reason: "At least one snapshot has incomplete producer or target coverage." });
  if (severityUnassessed.length) comparisonBlockers.push({ code: "severity-unassessed", count: severityUnassessed.length, reason: "Severity evidence is unavailable or mixed for shared fingerprints; risk change cannot be inferred." });
  return Object.freeze({
    added: Object.freeze(added), fixed: Object.freeze(fixed), worsened: Object.freeze(worsened.sort()), improved: Object.freeze(improved.sort()), unchanged: Object.freeze(unchanged), severityUnassessed: Object.freeze(severityUnassessed.sort()),
    identityChanged,
    coverageChanged,
    policyChanged,
    coverageDelta: Object.freeze({ before: baseCoverage, after: headCoverage, changed: coverageChanged }),
    comparisonBlockers: Object.freeze(comparisonBlockers),
  });
}

export function getSnapshotRiskObservation(snapshot: AnyReleaseSnapshot, fingerprint: string): RiskObservation | undefined {
  return riskMap(snapshot).get(fingerprint);
}

export function getSnapshotRiskSummary(snapshot: AnyReleaseSnapshot, fingerprint: string): readonly string[] {
  const observation = snapshot.observations.find((item) => item.fingerprint === fingerprint);
  return observation && "remediationSummaries" in observation ? observation.remediationSummaries as readonly string[] : Object.freeze([]);
}
