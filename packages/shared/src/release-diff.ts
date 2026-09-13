import type { AnyReleaseSnapshot } from "./release-snapshot.js";
import { canonicalizeJson } from "./schema.js";

export interface ReleaseDiff {
  readonly added: readonly string[];
  readonly fixed: readonly string[];
  readonly unchanged: readonly string[];
  readonly identityChanged: boolean;
  readonly coverageChanged: boolean;
  readonly policyChanged: boolean;
}

export function diffReleaseSnapshots(base: AnyReleaseSnapshot, head: AnyReleaseSnapshot): ReleaseDiff {
  const before = new Set(base.observations.map((observation) => observation.fingerprint));
  const after = new Set(head.observations.map((observation) => observation.fingerprint));
  const added = [...after].filter((fingerprint) => !before.has(fingerprint)).sort();
  const fixed = [...before].filter((fingerprint) => !after.has(fingerprint)).sort();
  const unchanged = [...after].filter((fingerprint) => before.has(fingerprint)).sort();
  return {
    added,
    fixed,
    unchanged,
    identityChanged: base.primarySubjectId !== head.primarySubjectId || canonicalizeJson([...base.subjectIds].sort()) !== canonicalizeJson([...head.subjectIds].sort()),
    coverageChanged: "coverage" in base || "coverage" in head
      ? !("coverage" in base && "coverage" in head) || canonicalizeJson(base.coverage) !== canonicalizeJson(head.coverage)
      : canonicalizeJson(base.lineage) !== canonicalizeJson(head.lineage),
    policyChanged: base.policyInputDigest !== head.policyInputDigest,
  };
}
