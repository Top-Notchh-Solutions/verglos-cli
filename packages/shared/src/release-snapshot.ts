import { createHash } from "node:crypto";
import { z } from "zod";
import { canonicalizeJson } from "./schema.js";
import { SubjectDocumentSchema, SubjectIdSchema, type Subject } from "./subject.js";
import { ObservationDocumentSchema } from "./observation.js";
import type { CorrelationGroup } from "./correlation.js";
import type { LineageGraph } from "./lineage-graph.js";
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
export interface SnapshotObservation {
  readonly fingerprint: string;
  readonly producerIds: readonly string[];
  readonly disagreement: boolean;
  readonly severity: { readonly status: "known"; readonly value: (typeof SEVERITIES)[number] } | { readonly status: "mixed" | "unavailable" };
  readonly remediationSummaries: readonly string[];
}
export interface ReleaseSnapshot extends Omit<LegacyReleaseSnapshot, "schemaVersion" | "observations"> {
  readonly schemaVersion: "1.2.0";
  readonly observations: readonly SnapshotObservation[];
  readonly coverage: InspectCoverageManifest;
}
export type AnyReleaseSnapshot = LegacyReleaseSnapshot | ReleaseSnapshotV11 | ReleaseSnapshot;

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

export class ReleaseSnapshotValidationError extends Error { override readonly name = "ReleaseSnapshotValidationError"; }

function deepFreeze<T>(value: T): T {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  for (const child of Object.values(value as Record<string, unknown>)) deepFreeze(child);
  return Object.freeze(value);
}

function riskProjection(group: CorrelationGroup): {
  readonly severity: { readonly status: "known"; readonly value: (typeof SEVERITIES)[number] } | { readonly status: "mixed" | "unavailable" };
  readonly remediationSummaries: readonly string[];
} {
  const parsed = group.payloads.map((payload) => ObservationDocumentSchema.safeParse(payload));
  const valid = parsed.flatMap((result) => result.success ? [result.data] : []);
  const severities = new Set(valid.map((observation) => observation.severity.normalized));
  const allPayloadsValidated = group.payloads.length > 0 && group.payloads.length <= 32 && valid.length === group.payloads.length;
  const severity = allPayloadsValidated && severities.size === 1 && !severities.has("unknown")
    ? { status: "known" as const, value: [...severities][0] as (typeof SEVERITIES)[number] }
    : allPayloadsValidated && severities.size > 1
      ? { status: "mixed" as const }
      : { status: "unavailable" as const };
  const remediationSummaries = [...new Set(valid.flatMap((observation) => observation.remediation ? [observation.remediation.summary] : []))].sort().slice(0, 8);
  return { severity, remediationSummaries };
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
      const risk = riskProjection(group);
      return { fingerprint: group.fingerprint, producerIds: [...new Set(group.producerIds)].sort(), disagreement: group.disagreement, ...risk };
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
  const unsigned = { schemaVersion: "1.2.0" as const, ...core, coverage };
  const snapshotDigest = `sha256:${createHash("sha256").update(canonicalizeJson(unsigned), "utf8").digest("hex")}`;
  return deepFreeze({ ...unsigned, snapshotDigest });
}

export function parseReleaseSnapshot(value: unknown): AnyReleaseSnapshot {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new ReleaseSnapshotValidationError("Release snapshot is invalid.");
  const record = value as Record<string, unknown>;
  const parsed = record.schemaVersion === "1.0.0" ? ReleaseSnapshotV10Schema.safeParse(value)
    : record.schemaVersion === "1.1.0" ? ReleaseSnapshotV11Schema.safeParse(value)
      : record.schemaVersion === "1.2.0" ? ReleaseSnapshotV12Schema.safeParse(value)
        : null;
  if (!parsed || !parsed.success) throw new ReleaseSnapshotValidationError("Release snapshot is invalid or uses an unsupported schema version.");
  const { snapshotDigest, ...unsigned } = parsed.data;
  const expected = `sha256:${createHash("sha256").update(canonicalizeJson(unsigned), "utf8").digest("hex")}`;
  if (snapshotDigest !== expected) throw new ReleaseSnapshotValidationError("Release snapshot digest does not match its contents.");
  return deepFreeze(parsed.data as AnyReleaseSnapshot);
}
