import type { ReleaseDecisionDocument } from "./release-decision.js";

export type ReleaseSignerStatus = "unknown" | "unsigned" | "verified" | "unverified";
export type ReleaseHeaderSubjectEvidence = Readonly<{
  subjectId: string;
  memberDigest: string;
  contentDigests: readonly Readonly<{ purpose: string; digest: string }>[];
}>;
export type ReleaseHeaderLineage = Readonly<{
  status: "recorded" | "not-recorded";
  edgeCount: number;
  matched: number;
  mismatched: number;
  unavailable: number;
  unverifiable: number;
  gapCount: number;
}>;
export type ReleaseHeader = Readonly<{
  decision: ReleaseDecisionDocument["decision"];
  subjectId: string;
  subjects?: readonly Readonly<{
    subjectId: string;
    role: ReleaseDecisionDocument["subjects"][number]["role"];
    identityDigest: string;
    memberDigest?: string;
    contentDigests: readonly Readonly<{ purpose: string; digest: string }>[];
  }>[];
  policy: Readonly<{ id: string; version: string; digest: string }>;
  generatedAt: string;
  signerStatus: ReleaseSignerStatus;
  coverageStatus?: "incomplete" | "not-established";
  lineage?: ReleaseHeaderLineage;
  limitations: readonly string[];
  nextAction: string;
}>;

export function projectReleaseHeader(
  decision: ReleaseDecisionDocument,
  signerStatus: ReleaseSignerStatus = "unknown",
  subjectEvidence: readonly ReleaseHeaderSubjectEvidence[] = [],
  recordLimitations: readonly string[] = [],
  lineage?: ReleaseHeaderLineage,
): ReleaseHeader {
  const primary = decision.subjects.find((subject) => subject.role === "primary");
  if (!primary) throw new Error("release decision is missing a primary subject");
  const evidenceById = new Map<string, ReleaseHeaderSubjectEvidence>();
  for (const evidence of subjectEvidence) {
    if (evidenceById.has(evidence.subjectId)) throw new Error("release header subject evidence is ambiguous");
    evidenceById.set(evidence.subjectId, evidence);
  }
  const subjects = decision.subjects.map((subject) => {
    const identity = subject.subjectId.match(/:sha256:([a-f0-9]{64})$/);
    if (!identity) throw new Error("release decision contains an unsupported subject digest");
    const evidence = evidenceById.get(subject.subjectId);
    return Object.freeze({
      subjectId: subject.subjectId,
      role: subject.role,
      identityDigest: `sha256:${identity[1]}`,
      ...(evidence ? { memberDigest: evidence.memberDigest } : {}),
      contentDigests: Object.freeze([...(evidence?.contentDigests ?? [])].map((entry) => Object.freeze({ ...entry }))),
    });
  });
  const missingSubjectPayloads = subjects.filter((subject) => !subject.memberDigest).map((subject) => `Verified subject payload is unavailable for ${subject.subjectId}.`);
  const limitations = [...new Set([...missingSubjectPayloads, ...recordLimitations, ...decision.limitations])];
  return Object.freeze({
    decision: decision.decision,
    subjectId: primary.subjectId,
    subjects: Object.freeze(subjects),
    policy: Object.freeze({ id: decision.policy.id, version: decision.policy.version, digest: `${decision.policy.digest.algorithm}:${decision.policy.digest.value}` }),
    generatedAt: decision.generatedAt,
    signerStatus,
    coverageStatus: decision.decision === "INCOMPLETE" || missingSubjectPayloads.length > 0 ? "incomplete" : "not-established",
    ...(lineage ? { lineage: Object.freeze({ ...lineage }) } : {}),
    limitations: Object.freeze(limitations),
    nextAction: decision.decision === "PASS" ? "Preserve the decision and its evidence bindings." : "Review the listed limitations and policy evidence before release.",
  });
}
