import { SubjectDocumentSchema, SubjectIdSchema, type Subject } from "./subject.js";
import { z } from "zod";
import { VERGLOS_SCHEMA_IDS, classifySchemaCompatibility, parseSchemaVersion, type SchemaDescriptor } from "./schema.js";

export const LINEAGE_GRAPH_SCHEMA = {
  id: VERGLOS_SCHEMA_IDS.lineageGraph,
  version: "1.0.0",
} as const satisfies SchemaDescriptor;

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

const LineageGraphDocumentSchema = z.object({
  schemaId: z.literal(LINEAGE_GRAPH_SCHEMA.id),
  schemaVersion: z.string().refine((value) => parseSchemaVersion(value) !== null),
  subjectIds: z.array(SubjectIdSchema).min(1).max(10_000),
  edges: z.array(z.object({
    fromSubjectId: SubjectIdSchema,
    toSubjectId: SubjectIdSchema,
    relation: z.enum(LINEAGE_RELATIONS),
    status: z.enum(LINEAGE_STATUSES),
    evidenceRef: z.string().regex(/^sha256:[a-f0-9]{64}$/).optional(),
  }).strict()).max(20_000),
  gaps: z.array(z.string().min(1).max(512)).max(20_000),
}).strict();

export type LineageGraphDocument = z.infer<typeof LineageGraphDocumentSchema>;
const compareCodeUnits = (left: string, right: string) => left < right ? -1 : left > right ? 1 : 0;

export function createLineageGraphDocument(input: Omit<LineageGraphDocument, "schemaId" | "schemaVersion">): LineageGraphDocument {
  return parseLineageGraphDocument({
    schemaId: LINEAGE_GRAPH_SCHEMA.id,
    schemaVersion: LINEAGE_GRAPH_SCHEMA.version,
    subjectIds: [...input.subjectIds].sort(),
    edges: [...input.edges].sort((a, b) => compareCodeUnits(`${a.fromSubjectId}:${a.toSubjectId}:${a.relation}:${a.status}:${a.evidenceRef ?? ""}`, `${b.fromSubjectId}:${b.toSubjectId}:${b.relation}:${b.status}:${b.evidenceRef ?? ""}`)),
    gaps: [...input.gaps].sort(),
  });
}

export function parseLineageGraphDocument(value: unknown): LineageGraphDocument {
  const parsed = LineageGraphDocumentSchema.parse(value);
  const compatibility = classifySchemaCompatibility(parsed.schemaVersion, LINEAGE_GRAPH_SCHEMA.version);
  if (compatibility === "upgrade-required" || compatibility === "incompatible") throw new LineageValidationError(`Lineage graph schema ${parsed.schemaVersion} requires a compatible reader.`);
  if (new Set(parsed.subjectIds).size !== parsed.subjectIds.length || parsed.subjectIds.some((id, index) => index > 0 && parsed.subjectIds[index - 1]! > id)) throw new LineageValidationError("Lineage graph subject IDs must be unique and sorted.");
  const edgeKeys = parsed.edges.map((edge) => `${edge.fromSubjectId}:${edge.toSubjectId}:${edge.relation}:${edge.status}:${edge.evidenceRef ?? ""}`);
  if (new Set(edgeKeys).size !== edgeKeys.length || edgeKeys.some((key, index) => index > 0 && compareCodeUnits(edgeKeys[index - 1]!, key) > 0)) throw new LineageValidationError("Lineage graph edges must be unique and sorted.");
  if (new Set(parsed.gaps).size !== parsed.gaps.length || parsed.gaps.some((gap, index) => index > 0 && parsed.gaps[index - 1]! > gap)) throw new LineageValidationError("Lineage graph gaps must be unique and sorted.");
  const subjects = new Set(parsed.subjectIds);
  if (parsed.edges.some((edge) => !subjects.has(edge.fromSubjectId) || !subjects.has(edge.toSubjectId))) throw new LineageValidationError("Lineage graph edges must reference subjects included in the record.");
  return parsed;
}
export class LineageValidationError extends Error { override readonly name = "LineageValidationError"; }

export function buildLineageGraph(
  subjects: readonly Subject[],
  declarations: readonly LineageDeclaration[],
): LineageGraph {
  if (subjects.length > 10_000 || declarations.length > 20_000) throw new LineageValidationError("Lineage graph exceeds bounded subject or declaration limits.");
  const nodes = subjects.map((subject) => SubjectDocumentSchema.parse(subject));
  const nodeIds = new Set(nodes.map((subject) => subject.subjectId));
  const gaps: string[] = [];
  const edges = declarations.map((declaration) => {
    if (!(LINEAGE_RELATIONS as readonly string[]).includes(declaration.relation)) throw new LineageValidationError("Lineage relation is unsupported.");
    if (declaration.status !== undefined && !(LINEAGE_STATUSES as readonly string[]).includes(declaration.status)) throw new LineageValidationError("Lineage status is unsupported.");
    if (declaration.evidenceRef !== undefined && (!/^sha256:[a-f0-9]{64}$/.test(declaration.evidenceRef) || declaration.evidenceRef.length > 256)) throw new LineageValidationError("Lineage evidence reference is invalid.");
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
  const sortedEdges = [...new Map(edges.map((edge) => [`${edge.fromSubjectId}:${edge.toSubjectId}:${edge.relation}:${edge.status}:${edge.evidenceRef ?? ""}`, edge])).values()].sort((a, b) => `${a.fromSubjectId}:${a.toSubjectId}:${a.relation}:${a.status}`.localeCompare(`${b.fromSubjectId}:${b.toSubjectId}:${b.relation}:${b.status}`));
  return { nodes: Object.freeze(sortedNodes), edges: Object.freeze(sortedEdges), gaps: Object.freeze([...new Set(gaps)].sort()) };
}
