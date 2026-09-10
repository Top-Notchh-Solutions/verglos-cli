import type { LineageGraph } from "./lineage-graph.js";
import type { ObservationDocument } from "./observation.js";

export function projectEvidence(observations: readonly ObservationDocument[], lineage?: LineageGraph) {
  if (observations.length > 10_000) throw new Error("evidence projection exceeds observation bound");
  const items = observations.map((observation) => ({ observationId: observation.observationId, subjectId: observation.subjectId, origin: { ...observation.origin }, coverageClass: observation.coverageClass, confidence: { ...observation.confidence }, evidence: observation.evidence.map((entry) => ({ kind: entry.kind, classification: entry.classification, handling: entry.handling, description: entry.description })), references: observation.references.map((reference) => reference.url).sort() })).sort((a, b) => a.observationId.localeCompare(b.observationId));
  return Object.freeze({ observations: Object.freeze(items), lineage: lineage ? Object.freeze({ edges: Object.freeze([...lineage.edges].sort((a, b) => `${a.fromSubjectId}:${a.toSubjectId}`.localeCompare(`${b.fromSubjectId}:${b.toSubjectId}`))), gaps: Object.freeze([...lineage.gaps].sort()) }) : undefined });
}
