import { createHash } from "node:crypto";
import { canonicalizeJson } from "./schema.js";
import { SubjectDocumentSchema, SubjectIdSchema, type Subject } from "./subject.js";
import type { CorrelationGroup } from "./correlation.js";
import type { LineageGraph } from "./lineage-graph.js";

export interface ReleaseSnapshot {
  readonly schemaVersion: "1.0.0";
  readonly primarySubjectId: string;
  readonly subjectIds: readonly string[];
  readonly observations: readonly Pick<CorrelationGroup, "fingerprint" | "producerIds" | "disagreement">[];
  readonly lineage: Pick<LineageGraph, "edges" | "gaps">;
  readonly policyInputDigest: string;
  readonly snapshotDigest: string;
}

export function createReleaseSnapshot(input: {
  readonly primarySubject: Subject;
  readonly subjects: readonly Subject[];
  readonly observations: readonly CorrelationGroup[];
  readonly lineage: Pick<LineageGraph, "edges" | "gaps">;
  readonly policyInputs: unknown;
}): ReleaseSnapshot {
  const primary = SubjectDocumentSchema.parse(input.primarySubject);
  const subjects = input.subjects.map((subject) => SubjectDocumentSchema.parse(subject));
  const subjectIds = [...new Set([primary.subjectId, ...subjects.map((subject) => subject.subjectId)])].sort();
  const observations = [...input.observations]
    .map((group) => ({ fingerprint: group.fingerprint, producerIds: [...group.producerIds].sort(), disagreement: group.disagreement }))
    .sort((a, b) => a.fingerprint.localeCompare(b.fingerprint));
  const policyInputDigest = `sha256:${createHash("sha256").update(canonicalizeJson(input.policyInputs), "utf8").digest("hex")}`;
  const unsigned = {
    schemaVersion: "1.0.0" as const,
    primarySubjectId: SubjectIdSchema.parse(primary.subjectId),
    subjectIds,
    observations,
    lineage: { edges: input.lineage.edges, gaps: [...input.lineage.gaps].sort() },
    policyInputDigest,
  };
  const snapshotDigest = `sha256:${createHash("sha256").update(canonicalizeJson(unsigned), "utf8").digest("hex")}`;
  return { ...unsigned, snapshotDigest };
}
