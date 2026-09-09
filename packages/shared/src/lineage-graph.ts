import { SubjectDocumentSchema, SubjectIdSchema, type Subject } from "./subject.js";

export const LINEAGE_RELATIONS = [
  "source-commit",
  "commit-tree",
  "build-input",
  "build-output",
  "sbom-subject",
  "image-artifact",
  "artifact-output",
] as const;
export type LineageRelation = (typeof LINEAGE_RELATIONS)[number];
export const LINEAGE_STATUSES = ["matched", "mismatched", "unavailable", "unverifiable"] as const;
export type LineageStatus = (typeof LINEAGE_STATUSES)[number];

export interface LineageDeclaration {
  readonly fromSubjectId: string;
  readonly toSubjectId: string;
  readonly relation: LineageRelation;
  readonly status?: LineageStatus;
  readonly evidenceRef?: string;
}

export interface LineageEdge {
  readonly fromSubjectId: string;
  readonly toSubjectId: string;
  readonly relation: LineageRelation;
  readonly status: LineageStatus;
  readonly evidenceRef?: string;
}

export interface LineageGraph {
  readonly nodes: readonly Subject[];
  readonly edges: readonly LineageEdge[];
  readonly gaps: readonly string[];
}

export function buildLineageGraph(
  subjects: readonly Subject[],
  declarations: readonly LineageDeclaration[],
): LineageGraph {
  const nodes = subjects.map((subject) => SubjectDocumentSchema.parse(subject));
  const nodeIds = new Set(nodes.map((subject) => subject.subjectId));
  const gaps: string[] = [];
  const edges = declarations.map((declaration) => {
    const fromSubjectId = SubjectIdSchema.parse(declaration.fromSubjectId);
    const toSubjectId = SubjectIdSchema.parse(declaration.toSubjectId);
    if (!nodeIds.has(fromSubjectId) || !nodeIds.has(toSubjectId)) {
      gaps.push(`lineage endpoint is unavailable for ${fromSubjectId} -> ${toSubjectId}`);
    }
    const status = declaration.status ?? (nodeIds.has(fromSubjectId) && nodeIds.has(toSubjectId) ? "matched" : "unavailable");
    if (status === "mismatched") gaps.push(`lineage declaration mismatches ${fromSubjectId} -> ${toSubjectId}`);
    if (status === "unverifiable") gaps.push(`lineage declaration is unverifiable for ${fromSubjectId} -> ${toSubjectId}`);
    return {
      fromSubjectId,
      toSubjectId,
      relation: declaration.relation,
      status,
      ...(declaration.evidenceRef ? { evidenceRef: declaration.evidenceRef } : {}),
    };
  });
  const sortedNodes = [...nodes].sort((a, b) => a.subjectId.localeCompare(b.subjectId));
  const sortedEdges = [...edges].sort((a, b) => `${a.fromSubjectId}:${a.toSubjectId}:${a.relation}`.localeCompare(`${b.fromSubjectId}:${b.toSubjectId}:${b.relation}`));
  return { nodes: Object.freeze(sortedNodes), edges: Object.freeze(sortedEdges), gaps: Object.freeze([...new Set(gaps)].sort()) };
}
