import type { ReleaseSnapshot } from "./release-snapshot.js";

export interface ReleaseDiff {
  readonly added: readonly string[];
  readonly fixed: readonly string[];
  readonly unchanged: readonly string[];
  readonly identityChanged: boolean;
  readonly coverageChanged: boolean;
  readonly policyChanged: boolean;
}

export function diffReleaseSnapshots(base: ReleaseSnapshot, head: ReleaseSnapshot): ReleaseDiff {
  const before = new Set(base.observations.map((observation) => observation.fingerprint));
  const after = new Set(head.observations.map((observation) => observation.fingerprint));
  const added = [...after].filter((fingerprint) => !before.has(fingerprint)).sort();
  const fixed = [...before].filter((fingerprint) => !after.has(fingerprint)).sort();
  const unchanged = [...after].filter((fingerprint) => before.has(fingerprint)).sort();
  return {
    added,
    fixed,
    unchanged,
    identityChanged: base.primarySubjectId !== head.primarySubjectId || base.subjectIds.join("\n") !== head.subjectIds.join("\n"),
    coverageChanged: JSON.stringify(base.lineage) !== JSON.stringify(head.lineage),
    policyChanged: base.policyInputDigest !== head.policyInputDigest,
  };
}
