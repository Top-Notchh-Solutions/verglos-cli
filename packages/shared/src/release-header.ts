import type { ReleaseDecisionDocument } from "./release-decision.js";

export type ReleaseSignerStatus = "unknown" | "unsigned" | "verified" | "unverified";
export type ReleaseHeader = Readonly<{
  decision: ReleaseDecisionDocument["decision"];
  subjectId: string;
  policy: Readonly<{ id: string; version: string; digest: string }>;
  generatedAt: string;
  signerStatus: ReleaseSignerStatus;
  limitations: readonly string[];
  nextAction: string;
}>;

export function projectReleaseHeader(decision: ReleaseDecisionDocument, signerStatus: ReleaseSignerStatus = "unknown"): ReleaseHeader {
  const primary = decision.subjects.find((subject) => subject.role === "primary");
  if (!primary) throw new Error("release decision is missing a primary subject");
  return Object.freeze({
    decision: decision.decision,
    subjectId: primary.subjectId,
    policy: Object.freeze({ id: decision.policy.id, version: decision.policy.version, digest: `${decision.policy.digest.algorithm}:${decision.policy.digest.value}` }),
    generatedAt: decision.generatedAt,
    signerStatus,
    limitations: Object.freeze([...decision.limitations]),
    nextAction: decision.decision === "PASS" ? "Preserve the decision and its evidence bindings." : "Review the listed limitations and policy evidence before release.",
  });
}
