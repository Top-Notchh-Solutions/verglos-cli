import { createHash } from "node:crypto";
import { z } from "zod";
import { canonicalizeJson } from "./schema.js";
import { ContentDigestSchema, SubjectDocumentSchema, SubjectIdSchema, type Subject } from "./subject.js";
import { parseObservation, type ObservationDocument } from "./observation.js";
import type { CorrelationGroup } from "./correlation.js";
import type { LineageGraph } from "./lineage-graph.js";
import type { ToolRunDocument } from "./engine.js";
import { InspectCoverageManifestSchema, type InspectCoverageManifest } from "./inspect-plan.js";

const DIGEST = /^sha256:[a-f0-9]{64}$/;
const SEVERITIES = ["critical", "high", "medium", "low", "info"] as const;
const LegacyObservationSchema = z.object({
  fingerprint: z.string().regex(DIGEST),
  producerIds: z.array(z.string().min(1).max(128)).max(32),
  disagreement: z.boolean(),
}).strict();
const SnapshotObservationSchema = LegacyObservationSchema.extend({
  severity: z.discriminatedUnion("status", [
    z.object({ status: z.literal("known"), value: z.enum(SEVERITIES) }).strict(),
    z.object({ status: z.enum(["mixed", "unavailable"]) }).strict(),
  ]),
  remediationSummaries: z.array(z.string().min(1).max(512)).max(8),
}).strict();
const EvidenceProjectionSchema = z.object({
  attribution: z.object({ kind: z.enum(["native", "adapter", "imported"]), producerId: z.string().min(1).max(128), runId: z.string().min(1).max(128), ruleId: z.string().min(1).max(256) }).strict(),
  rawEvidenceDigest: ContentDigestSchema.optional(),
  confidence: z.object({ level: z.enum(["certain", "high", "medium", "low", "unknown"]), score: z.number().min(0).max(1).optional(), method: z.string().min(1).max(128), mappingVersion: z.string().min(1).max(32) }).strict(),
  timestamp: z.object({ status: z.enum(["available", "unavailable"]), startedAt: z.string().datetime({ offset: true }).optional(), completedAt: z.string().datetime({ offset: true }).optional() }).strict(),
  engineHealth: z.object({ state: z.enum(["healthy", "degraded", "unavailable", "incompatible", "stale", "not-recorded"]), producerId: z.string().min(1).max(128).optional(), version: z.string().min(1).max(128).optional(), incompleteReasonCodes: z.array(z.string().min(1).max(64)).max(32) }).strict(),
  limitations: z.array(z.string().min(1).max(64)).max(32),
}).strict();
export type SnapshotEvidenceProjection = z.infer<typeof EvidenceProjectionSchema>;
const SnapshotObservationV13Schema = SnapshotObservationSchema.extend({
  evidence: z.array(EvidenceProjectionSchema).max(64),
  omittedEvidenceCount: z.number().int().min(0).max(20_000),
  invalidEvidenceCount: z.number().int().min(0).max(20_000),
}).strict();
const LineageSchema = z.object({
  edges: z.array(z.object({
    fromSubjectId: SubjectIdSchema,
    toSubjectId: SubjectIdSchema,
    relation: z.enum(["source-commit", "commit-tree", "build-input", "build-output", "sbom-subject", "image-artifact", "artifact-output"]),
    status: z.enum(["matched", "mismatched", "unavailable", "unverifiable"]),
    evidenceRef: z.string().regex(DIGEST).optional(),
  }).strict()).max(20_000),
  gaps: z.array(z.string().min(1).max(512)).max(20_000),
}).strict();
const CommonSnapshotSchema = z.object({
  primarySubjectId: SubjectIdSchema,
  subjectIds: z.array(SubjectIdSchema).min(1).max(10_000),
  lineage: LineageSchema,
  policyInputDigest: z.string().regex(DIGEST),
  snapshotDigest: z.string().regex(DIGEST),
});

export interface LegacyReleaseSnapshot {
  readonly schemaVersion: "1.0.0";
  readonly primarySubjectId: string;
  readonly subjectIds: readonly string[];
  readonly observations: readonly z.infer<typeof LegacyObservationSchema>[];
  readonly lineage: Pick<LineageGraph, "edges" | "gaps">;
  readonly policyInputDigest: string;
  readonly snapshotDigest: string;
}
export interface ReleaseSnapshotV11 extends Omit<LegacyReleaseSnapshot, "schemaVersion"> {
  readonly schemaVersion: "1.1.0";
  readonly coverage: InspectCoverageManifest;
}
export interface SnapshotObservationV12 {
  readonly fingerprint: string;
  readonly producerIds: readonly string[];
  readonly disagreement: boolean;
  readonly severity: { readonly status: "known"; readonly value: (typeof SEVERITIES)[number] } | { readonly status: "mixed" | "unavailable" };
  readonly remediationSummaries: readonly string[];
}
export interface SnapshotObservation extends SnapshotObservationV12 {
  readonly evidence: readonly SnapshotEvidenceProjection[];
  readonly omittedEvidenceCount: number;
  readonly invalidEvidenceCount: number;
}
export interface ReleaseSnapshotV12 extends Omit<LegacyReleaseSnapshot, "schemaVersion" | "observations"> {
  readonly schemaVersion: "1.2.0";
  readonly observations: readonly SnapshotObservationV12[];
  readonly coverage: InspectCoverageManifest;
}
export interface ReleaseSnapshot extends Omit<LegacyReleaseSnapshot, "schemaVersion" | "observations"> {
  readonly schemaVersion: "1.3.0";
  readonly observations: readonly SnapshotObservation[];
  readonly coverage: InspectCoverageManifest;
}
export type AnyReleaseSnapshot = LegacyReleaseSnapshot | ReleaseSnapshotV11 | ReleaseSnapshotV12 | ReleaseSnapshot;

const ReleaseSnapshotV10Schema = CommonSnapshotSchema.extend({
  schemaVersion: z.literal("1.0.0"),
  observations: z.array(LegacyObservationSchema).max(20_000),
}).strict();
const ReleaseSnapshotV11Schema = CommonSnapshotSchema.extend({
  schemaVersion: z.literal("1.1.0"),
  observations: z.array(LegacyObservationSchema).max(20_000),
  coverage: InspectCoverageManifestSchema,
}).strict();
const ReleaseSnapshotV12Schema = CommonSnapshotSchema.extend({
  schemaVersion: z.literal("1.2.0"),
  observations: z.array(SnapshotObservationSchema).max(20_000),
  coverage: InspectCoverageManifestSchema,
}).strict();
const ReleaseSnapshotV13Schema = CommonSnapshotSchema.extend({
  schemaVersion: z.literal("1.3.0"),
  observations: z.array(SnapshotObservationV13Schema).max(20_000),
  coverage: InspectCoverageManifestSchema,
}).strict();

export class ReleaseSnapshotValidationError extends Error { override readonly name = "ReleaseSnapshotValidationError"; }

function deepFreeze<T>(value: T): T {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  for (const child of Object.values(value as Record<string, unknown>)) deepFreeze(child);
  return Object.freeze(value);
}

function validatedObservations(group: CorrelationGroup, subjectIds: readonly string[]): { observations: readonly ObservationDocument[]; invalidCount: number } {
  const observations: ObservationDocument[] = [];
  let invalidCount = 0;
  for (const payload of group.payloads) {
    try {
      const observation = parseObservation(payload);
      if (!subjectIds.includes(observation.subjectId) || !group.producerIds.includes(observation.origin.producerId)) {
        invalidCount += 1;
        continue;
      }
      observations.push(observation);
    } catch {
      invalidCount += 1;
    }
  }
  return { observations, invalidCount };
}

function riskProjection(group: CorrelationGroup, validObservations: readonly ObservationDocument[]): {
  readonly severity: { readonly status: "known"; readonly value: (typeof SEVERITIES)[number] } | { readonly status: "mixed" | "unavailable" };
  readonly remediationSummaries: readonly string[];
} {
  const severities = new Set(validObservations.map((observation) => observation.severity.normalized));
  const allPayloadsValidated = group.payloads.length > 0 && group.payloads.length <= 32 && validObservations.length === group.payloads.length;
  const severity = allPayloadsValidated && severities.size === 1 && !severities.has("unknown")
    ? { status: "known" as const, value: [...severities][0] as (typeof SEVERITIES)[number] }
    : allPayloadsValidated && severities.size > 1
      ? { status: "mixed" as const }
      : { status: "unavailable" as const };
  const remediationSummaries = [...new Set(validObservations.flatMap((observation) => observation.remediation ? [observation.remediation.summary] : []))].sort().slice(0, 8);
  return { severity, remediationSummaries };
}

function evidenceProjection(validObservations: readonly ObservationDocument[], invalidEvidenceCount: number, coverage: InspectCoverageManifest): { evidence: readonly z.infer<typeof EvidenceProjectionSchema>[]; omittedEvidenceCount: number; invalidEvidenceCount: number } {
  const runs = coverage.producers.flatMap((producer) => {
    const toolRuns = (producer as { toolRuns?: unknown }).toolRuns;
    return Array.isArray(toolRuns) ? toolRuns as ToolRunDocument[] : [];
  });
  const runsById = new Map(runs.map((run) => [run.runId, run]));
  const records = validObservations.flatMap((observation) => {
    const run = runsById.get(observation.origin.runId);
    const reasons = run ? [...run.incompleteReasons, ...run.engine.incompleteReasons].map((reason) => reason.code) : [];
    const producerCoverage = coverage.producers.find((producer) => {
      const toolRuns = (producer as { toolRuns?: unknown }).toolRuns;
      return Array.isArray(toolRuns) && toolRuns.some((item: ToolRunDocument) => item.runId === observation.origin.runId);
    });
    const limitations = [...new Set([
      ...(run ? [] : ["tool-run-metadata-unavailable"]),
      ...(run && run.coverage !== "complete" ? ["tool-run-incomplete"] : []),
      ...(producerCoverage && producerCoverage.state !== "complete" ? ["producer-coverage-incomplete"] : []),
      ...reasons,
    ])].sort().slice(0, 32);
    return [{
      attribution: { kind: observation.origin.kind, producerId: observation.origin.producerId, runId: observation.origin.runId, ruleId: observation.origin.ruleId },
      ...(observation.origin.rawEvidenceDigest ? { rawEvidenceDigest: observation.origin.rawEvidenceDigest } : {}),
      confidence: { level: observation.confidence.level, ...(observation.confidence.score !== undefined ? { score: observation.confidence.score } : {}), method: observation.confidence.method, mappingVersion: observation.confidence.mappingVersion },
      timestamp: run ? { status: "available" as const, startedAt: run.startedAt, completedAt: run.completedAt } : { status: "unavailable" as const },
      engineHealth: run ? { state: run.engine.state, producerId: run.engine.producer.id, version: run.engine.producer.version, incompleteReasonCodes: [...new Set(reasons)].sort().slice(0, 32) } : { state: "not-recorded" as const, incompleteReasonCodes: [] },
      limitations,
    }];
  }).sort((a, b) => `${a.attribution.producerId}:${a.attribution.runId}:${a.attribution.ruleId}`.localeCompare(`${b.attribution.producerId}:${b.attribution.runId}:${b.attribution.ruleId}`));
  const evidence = records.slice(0, 64).map((record) => deepFreeze(record));
  return { evidence, omittedEvidenceCount: Math.max(0, records.length - evidence.length), invalidEvidenceCount };
}

export function createReleaseSnapshot(input: {
  readonly primarySubject: Subject;
  readonly subjects: readonly Subject[];
  readonly observations: readonly CorrelationGroup[];
  readonly lineage: Pick<LineageGraph, "edges" | "gaps">;
  readonly policyInputs: unknown;
  readonly coverage: InspectCoverageManifest;
}): ReleaseSnapshot {
  if (input.subjects.length > 10_000 || input.observations.length > 20_000 || input.lineage.edges.length > 20_000 || input.lineage.gaps.length > 20_000) throw new ReleaseSnapshotValidationError("Release snapshot exceeds bounded input limits.");
  const coverage = InspectCoverageManifestSchema.parse(input.coverage);
  const primary = SubjectDocumentSchema.parse(input.primarySubject);
  const subjects = input.subjects.map((subject) => SubjectDocumentSchema.parse(subject));
  const subjectIds = [...new Set([primary.subjectId, ...subjects.map((subject) => subject.subjectId)])].sort();
  const observations = [...input.observations]
    .map((group) => {
      if (!DIGEST.test(group.fingerprint) || group.producerIds.some((id) => !id || id.length > 128) || group.producerIds.length > 32 || group.payloads.length > 20_000) throw new ReleaseSnapshotValidationError("Release snapshot observation identity is invalid.");
      const validated = validatedObservations(group, subjectIds);
      const risk = riskProjection(group, validated.observations);
      const evidence = evidenceProjection(validated.observations, validated.invalidCount, coverage);
      return { fingerprint: group.fingerprint, producerIds: [...new Set(group.producerIds)].sort(), disagreement: group.disagreement, ...risk, ...evidence };
    })
    .sort((a, b) => a.fingerprint.localeCompare(b.fingerprint));
  const policyInputDigest = `sha256:${createHash("sha256").update(canonicalizeJson(input.policyInputs), "utf8").digest("hex")}`;
  const lineageGaps = [...input.lineage.gaps];
  const lineageEdges = input.lineage.edges.filter((edge) => { const valid = subjectIds.includes(edge.fromSubjectId) && subjectIds.includes(edge.toSubjectId); if (!valid) lineageGaps.push(`snapshot lineage endpoint unavailable for ${edge.fromSubjectId} -> ${edge.toSubjectId}`); return valid; });
  const core = {
    primarySubjectId: SubjectIdSchema.parse(primary.subjectId),
    subjectIds,
    observations,
    lineage: { edges: [...new Map(lineageEdges.map((edge) => [`${edge.fromSubjectId}:${edge.toSubjectId}:${edge.relation}:${edge.status}:${edge.evidenceRef ?? ""}`, edge])).values()].sort((a, b) => `${a.fromSubjectId}:${a.toSubjectId}:${a.relation}:${a.status}`.localeCompare(`${b.fromSubjectId}:${b.toSubjectId}:${b.relation}:${b.status}`)), gaps: [...new Set(lineageGaps)].sort() },
    policyInputDigest,
  };
  const unsigned = { schemaVersion: "1.3.0" as const, ...core, coverage };
  const snapshotDigest = `sha256:${createHash("sha256").update(canonicalizeJson(unsigned), "utf8").digest("hex")}`;
  return deepFreeze({ ...unsigned, snapshotDigest });
}

export function parseReleaseSnapshot(value: unknown): AnyReleaseSnapshot {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new ReleaseSnapshotValidationError("Release snapshot is invalid.");
  const record = value as Record<string, unknown>;
  const parsed = record.schemaVersion === "1.0.0" ? ReleaseSnapshotV10Schema.safeParse(value)
    : record.schemaVersion === "1.1.0" ? ReleaseSnapshotV11Schema.safeParse(value)
    : record.schemaVersion === "1.2.0" ? ReleaseSnapshotV12Schema.safeParse(value)
      : record.schemaVersion === "1.3.0" ? ReleaseSnapshotV13Schema.safeParse(value)
        : null;
  if (!parsed || !parsed.success) throw new ReleaseSnapshotValidationError("Release snapshot is invalid or uses an unsupported schema version.");
  const { snapshotDigest, ...unsigned } = parsed.data;
  const expected = `sha256:${createHash("sha256").update(canonicalizeJson(unsigned), "utf8").digest("hex")}`;
  if (snapshotDigest !== expected) throw new ReleaseSnapshotValidationError("Release snapshot digest does not match its contents.");
  return deepFreeze(parsed.data as AnyReleaseSnapshot);
}
