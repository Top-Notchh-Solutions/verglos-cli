import type { LineageGraph } from "./lineage-graph.js";
import type { ObservationDocument } from "./observation.js";

export function projectEvidence(observations: readonly ObservationDocument[], lineage?: LineageGraph) {
  if (observations.length > 10_000) throw new Error("evidence projection exceeds observation bound");
  const items = observations.map((observation) => Object.freeze({ observationId: observation.observationId, subjectId: observation.subjectId, origin: Object.freeze({ ...observation.origin }), coverageClass: observation.coverageClass, confidence: Object.freeze({ ...observation.confidence }), evidence: Object.freeze(observation.evidence.map((entry) => Object.freeze({ kind: entry.kind, classification: entry.classification, handling: entry.handling, description: entry.description }))), references: Object.freeze(observation.references.map((reference) => reference.url).sort()) })).sort((a, b) => a.observationId.localeCompare(b.observationId));
  return Object.freeze({ observations: Object.freeze(items), lineage: lineage ? Object.freeze({ edges: Object.freeze([...lineage.edges].sort((a, b) => `${a.fromSubjectId}:${a.toSubjectId}`.localeCompare(`${b.fromSubjectId}:${b.toSubjectId}`)).map((edge) => Object.freeze({ ...edge }))), gaps: Object.freeze([...lineage.gaps].sort()) }) : undefined });
}
