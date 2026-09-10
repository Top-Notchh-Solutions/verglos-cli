import { SubjectDocumentSchema, type Subject } from "./subject.js";

export const LINKAGE_STATUSES = ["matched", "mismatched", "unavailable", "unverifiable"] as const;
export type LinkageStatus = (typeof LINKAGE_STATUSES)[number];
export interface SourceArtifactLinkage { readonly status: LinkageStatus; readonly sourceSubjectId?: string; readonly artifactSubjectId?: string; readonly limitations: readonly string[]; }

export function evaluateSourceArtifactLinkage(source: Subject, artifact: Subject, declaration?: { sourceSubjectId?: string; artifactSubjectId?: string; verifiable?: boolean }): SourceArtifactLinkage {
  const sourceId = SubjectDocumentSchema.parse(source).subjectId;
  const artifactId = SubjectDocumentSchema.parse(artifact).subjectId;
  if (!declaration) return { status: "unavailable", sourceSubjectId: sourceId, artifactSubjectId: artifactId, limitations: ["no source-to-artifact declaration was supplied"] };
  if (!declaration.verifiable) return { status: "unverifiable", sourceSubjectId: sourceId, artifactSubjectId: artifactId, limitations: ["linkage declaration lacks verifiable evidence"] };
  if (declaration.sourceSubjectId !== sourceId || declaration.artifactSubjectId !== artifactId) return { status: "mismatched", sourceSubjectId: sourceId, artifactSubjectId: artifactId, limitations: ["declared source or artifact identity does not match"] };
  return { status: "matched", sourceSubjectId: sourceId, artifactSubjectId: artifactId, limitations: [] };
}
