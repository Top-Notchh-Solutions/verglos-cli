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
export class ReleaseSnapshotValidationError extends Error { override readonly name = "ReleaseSnapshotValidationError"; }

export function createReleaseSnapshot(input: {
  readonly primarySubject: Subject;
  readonly subjects: readonly Subject[];
  readonly observations: readonly CorrelationGroup[];
  readonly lineage: Pick<LineageGraph, "edges" | "gaps">;
  readonly policyInputs: unknown;
}): ReleaseSnapshot {
  if (input.subjects.length > 10_000 || input.observations.length > 20_000 || input.lineage.edges.length > 20_000 || input.lineage.gaps.length > 20_000) throw new ReleaseSnapshotValidationError("Release snapshot exceeds bounded input limits.");
  const primary = SubjectDocumentSchema.parse(input.primarySubject);
  const subjects = input.subjects.map((subject) => SubjectDocumentSchema.parse(subject));
  const subjectIds = [...new Set([primary.subjectId, ...subjects.map((subject) => subject.subjectId)])].sort();
  const observations = [...input.observations]
    .map((group) => { if (!/^sha256:[a-f0-9]{64}$/.test(group.fingerprint) || group.producerIds.some((id) => !id || id.length > 128)) throw new ReleaseSnapshotValidationError("Release snapshot observation identity is invalid."); return { fingerprint: group.fingerprint, producerIds: [...new Set(group.producerIds)].sort(), disagreement: group.disagreement }; })
    .sort((a, b) => a.fingerprint.localeCompare(b.fingerprint));
  const policyInputDigest = `sha256:${createHash("sha256").update(canonicalizeJson(input.policyInputs), "utf8").digest("hex")}`;
  const lineageGaps = [...input.lineage.gaps];
  const lineageEdges = input.lineage.edges.filter((edge) => { const valid = subjectIds.includes(edge.fromSubjectId) && subjectIds.includes(edge.toSubjectId); if (!valid) lineageGaps.push(`snapshot lineage endpoint unavailable for ${edge.fromSubjectId} -> ${edge.toSubjectId}`); return valid; });
  const unsigned = {
    schemaVersion: "1.0.0" as const,
    primarySubjectId: SubjectIdSchema.parse(primary.subjectId),
    subjectIds,
    observations,
    lineage: { edges: [...new Map(lineageEdges.map((edge) => [`${edge.fromSubjectId}:${edge.toSubjectId}:${edge.relation}:${edge.status}:${edge.evidenceRef ?? ""}`, edge])).values()].sort((a, b) => `${a.fromSubjectId}:${a.toSubjectId}:${a.relation}:${a.status}`.localeCompare(`${b.fromSubjectId}:${b.toSubjectId}:${b.relation}:${b.status}`)), gaps: [...new Set(lineageGaps)].sort() },
    policyInputDigest,
  };
  const snapshotDigest = `sha256:${createHash("sha256").update(canonicalizeJson(unsigned), "utf8").digest("hex")}`;
  return { ...unsigned, snapshotDigest };
}
