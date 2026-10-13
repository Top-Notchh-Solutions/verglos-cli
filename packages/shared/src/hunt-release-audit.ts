import { z } from "zod";
import { HuntRuleIdSchema } from "./hunt-recipe.js";
import { ObservationIdSchema, parseObservation } from "./observation.js";
import {
  VERGLOS_SCHEMA_IDS,
  classifySchemaCompatibility,
  parseSchemaVersion,
  parseVersionedJson,
  type ParseJsonOptions,
  type SchemaDescriptor,
} from "./schema.js";
import { assertCompleteReleaseRecord, assertCompleteReleaseRecordPayloads } from "./record-assembly.js";
import { releaseRecordManifestDigest } from "./record-digest.js";
import { parseReleaseDecision, type ReleaseDecisionDocument } from "./release-decision.js";
import { parseSubject } from "./subject.js";
import { parseVerificationAttempt, type VerificationAttemptDocument } from "./verification.js";
import { ContentDigestSchema, SubjectIdSchema } from "./subject.js";
import type { ReleaseRecordManifestDocument } from "./record-manifest.js";

export const HUNT_RELEASE_EVIDENCE_SCHEMA = {
  id: VERGLOS_SCHEMA_IDS.huntReleaseEvidence,
  version: "1.0.0",
} as const satisfies SchemaDescriptor;

const DigestStringSchema = z.string().regex(/^sha256:[a-f0-9]{64}$|^sha512:[a-f0-9]{128}$/);
const SafeTextSchema = z.string().min(1).max(4096).refine((value) => !/[\u0000-\u001f\u007f]/u.test(value), "text contains a control character");

const HuntOutcomeSchema = z.object({
  findingId: SafeTextSchema,
  verdict: z.enum(["true", "false", "not_attemptable"]),
  canonicalVerdict: z.enum(["confirmed", "not-reproduced", "inconclusive", "not-supported", "environment-error", "policy-denied"]).optional(),
  reason: SafeTextSchema,
  durationMs: z.number().int().nonnegative().safe(),
  evidenceDigest: DigestStringSchema.optional(),
  executionStatus: z.enum(["completed", "timed-out", "failed"]).optional(),
  assurance: z.object({
    class: z.enum(["A1", "A2", "A3", "A4"]),
    isolation: z.enum(["restricted-process", "container", "gvisor", "microvm"]),
    securityBoundary: z.boolean(),
    sourceAccess: z.enum(["none", "read-only"]),
    network: z.enum(["denied", "allowlisted"]),
    processLimit: z.number().int().positive().safe(),
    limitation: SafeTextSchema,
  }).strict().optional(),
}).strict();

const HuntProofPayloadSchema = z.object({
  status: z.enum(["completed", "not-attemptable"]),
  executes: z.boolean(),
  hypothesisDigest: ContentDigestSchema,
  targetSubjectId: SubjectIdSchema,
  findingId: SafeTextSchema,
  ruleId: HuntRuleIdSchema,
  observationId: ObservationIdSchema,
  execution: z.object({
    recipeDigest: DigestStringSchema,
    trustPolicyDigest: DigestStringSchema,
    approvalRequestDigest: DigestStringSchema,
  }).strict(),
  sandbox: SafeTextSchema,
  outcome: HuntOutcomeSchema.optional(),
  counterexample: HuntOutcomeSchema.optional(),
  proof: z.object({
    status: z.enum(["confirmed", "not-reproduced", "inconclusive", "not-attemptable"]),
    negativeControl: z.enum(["passed", "failed", "not-run"]),
    limitation: SafeTextSchema,
  }).strict(),
}).strict();

const ProofEvidenceSchema = HuntProofPayloadSchema.extend({
  schemaId: z.literal(HUNT_RELEASE_EVIDENCE_SCHEMA.id),
  schemaVersion: z.string().refine((value) => parseSchemaVersion(value) !== null),
  kind: z.literal("proof"),
}).strict();

const RetestEvidenceSchema = z.object({
  schemaId: z.literal(HUNT_RELEASE_EVIDENCE_SCHEMA.id),
  schemaVersion: z.string().refine((value) => parseSchemaVersion(value) !== null),
  kind: z.literal("retest"),
  status: z.literal("completed"),
  executes: z.literal(true),
  beforeSubjectId: SubjectIdSchema,
  afterSubjectId: SubjectIdSchema,
  findingId: SafeTextSchema,
  ruleId: HuntRuleIdSchema,
  remediation: z.object({
    proposalDigest: DigestStringSchema,
    approvalRequestDigest: DigestStringSchema,
    approved: z.literal(true),
    applied: z.literal(false),
    limitation: SafeTextSchema,
  }).strict(),
  proof: ProofEvidenceSchema,
  retest: z.object({
    status: z.enum(["cleared", "still-reproduced", "inconclusive", "not-attemptable"]),
    sameProof: z.literal(true),
    limitation: SafeTextSchema,
  }).strict(),
}).strict();

export const HuntReleaseEvidenceSchema = z.union([ProofEvidenceSchema, RetestEvidenceSchema]);
export type HuntReleaseEvidenceDocument = z.infer<typeof HuntReleaseEvidenceSchema>;
export type HuntProofEvidenceDocument = z.infer<typeof ProofEvidenceSchema>;
export type HuntProofPayloadDocument = z.infer<typeof HuntProofPayloadSchema>;
export type HuntRetestEvidenceDocument = z.infer<typeof RetestEvidenceSchema>;

export class HuntReleaseEvidenceValidationError extends Error {
  override readonly name = "HuntReleaseEvidenceValidationError";

  constructor(readonly issues: readonly { path: string; code: string; message: string }[]) {
    super(`Hunt release evidence validation failed with ${issues.length} issue${issues.length === 1 ? "" : "s"}.`);
  }
}

export function parseHuntReleaseEvidence(value: unknown): HuntReleaseEvidenceDocument {
  const parsed = HuntReleaseEvidenceSchema.safeParse(value);
  if (!parsed.success) {
    throw new HuntReleaseEvidenceValidationError(parsed.error.issues.map((issue) => ({
      path: issue.path.join("."),
      code: issue.code,
      message: issue.code === z.ZodIssueCode.unrecognized_keys ? "object contains unsupported properties" : issue.message,
    })));
  }
  const compatibility = classifySchemaCompatibility(parsed.data.schemaVersion, HUNT_RELEASE_EVIDENCE_SCHEMA.version);
  if (compatibility === "upgrade-required" || compatibility === "incompatible") {
    throw new HuntReleaseEvidenceValidationError([{
      path: "schemaVersion",
      code: compatibility,
      message: compatibility === "upgrade-required"
        ? `Upgrade to a reader supporting Hunt release evidence schema ${parsed.data.schemaVersion}.`
        : `Use an explicit reader or migration for Hunt release evidence schema ${parsed.data.schemaVersion}.`,
    }]);
  }
  if (parsed.data.kind === "retest") {
    const issues: string[] = [];
    if (parsed.data.beforeSubjectId === parsed.data.afterSubjectId) issues.push("retest subjects must be distinct");
    if (parsed.data.findingId !== parsed.data.proof.findingId) issues.push("retest finding must match its proof");
    if (parsed.data.ruleId !== parsed.data.proof.ruleId) issues.push("retest rule must match its proof");
    if (parsed.data.afterSubjectId !== parsed.data.proof.targetSubjectId) issues.push("retest after subject must match its proof target");
    if (issues.length > 0) throw new HuntReleaseEvidenceValidationError(issues.map((message) => ({ path: "retest", code: "custom", message })));
  }
  return parsed.data;
}

export function parseHuntReleaseEvidenceJson(input: string | Uint8Array, options: ParseJsonOptions = {}): HuntReleaseEvidenceDocument {
  const parsed = parseVersionedJson<Record<string, unknown>>(input, { ...options, expectedSchema: HUNT_RELEASE_EVIDENCE_SCHEMA });
  return parseHuntReleaseEvidence(parsed.document);
}

export interface HuntReleaseAuditResult {
  readonly status: "auditable" | "not-auditable";
  readonly manifestDigest: string;
  readonly subjectId: string;
  readonly observationId: string;
  readonly findingId: string;
  readonly ruleId: string;
  readonly matchedVerificationAttemptPaths: readonly string[];
  readonly decision: ReleaseDecisionDocument["decision"];
  readonly reasons: readonly string[];
  readonly limitations: readonly string[];
}

/**
 * Bind a bounded Hunt proof/retest to the exact complete Release Record graph.
 * This is an audit-only gate: it never changes the record decision or grants
 * release eligibility.
 */
export function auditHuntReleaseEvidence(input: {
  readonly evidence: unknown;
  readonly manifest: ReleaseRecordManifestDocument;
  readonly payloads: ReadonlyMap<string, Uint8Array>;
}): HuntReleaseAuditResult {
  const evidence = parseHuntReleaseEvidence(input.evidence);
  const manifest = assertCompleteReleaseRecord(input.manifest);
  const verifiedManifest = assertCompleteReleaseRecordPayloads(manifest, input.payloads);
  const manifestDigest = releaseRecordManifestDigest(verifiedManifest);
  const subjectId = evidence.kind === "proof" ? evidence.targetSubjectId : evidence.afterSubjectId;
  const observationId = evidence.kind === "proof" ? evidence.observationId : evidence.proof.observationId;
  const findingId = evidence.kind === "proof" ? evidence.findingId : evidence.findingId;
  const ruleId = evidence.kind === "proof" ? evidence.ruleId : evidence.ruleId;
  const decision = parseReleaseDecision(readMemberJson(verifiedManifest, input.payloads, "release-decision"));
  const reasons: string[] = [];

  const subjects = readMembers(verifiedManifest, input.payloads, "subject", parseSubject);
  const subjectIds = new Set(subjects.map((subject) => subject.subjectId));
  if (!subjectIds.has(subjectId)) reasons.push("Hunt proof target subject is not included in the complete Release Record");
  if (evidence.kind === "retest" && !subjectIds.has(evidence.beforeSubjectId)) reasons.push("Hunt retest before subject is not included in the complete Release Record");

  const observations = readMembers(verifiedManifest, input.payloads, "observation", parseObservation);
  const observation = observations.find((candidate) => candidate.observationId === observationId);
  if (!observation) reasons.push("Hunt proof observation is not included in the complete Release Record");
  else {
    if (observation.subjectId !== subjectId) reasons.push("Hunt proof observation does not bind the exact target subject");
    if (observation.origin.ruleId !== ruleId) reasons.push("Hunt proof rule does not match the observation rule identity");
  }

  const proof = evidence.kind === "proof" ? evidence : evidence.proof;
  if (!proof.executes || proof.status !== "completed") reasons.push("Hunt proof was not executed to completion");
  if (proof.proof.negativeControl !== "passed") reasons.push("Hunt proof negative control did not pass");
  if (!["confirmed", "not-reproduced"].includes(proof.proof.status)) reasons.push("Hunt proof is not a release-grade confirmed or not-reproduced result");
  if (!proof.outcome || proof.outcome.findingId !== findingId) reasons.push("Hunt proof primary outcome does not bind the finding identity");
  if (proof.outcome?.canonicalVerdict !== proof.proof.status) reasons.push("Hunt proof primary outcome does not match the proof verdict");
  if (!proof.counterexample || proof.counterexample.canonicalVerdict !== "not-reproduced") reasons.push("Hunt proof is missing its passing negative-control outcome");
  if (!proof.outcome?.evidenceDigest || !proof.counterexample?.evidenceDigest) reasons.push("Hunt proof is missing bounded evidence digests for both controls");
  if (evidence.kind === "retest") {
    if (evidence.retest.status === "inconclusive" || evidence.retest.status === "not-attemptable") reasons.push("Hunt retest is not a release-grade outcome");
    if (evidence.retest.status === "cleared" && proof.proof.status !== "not-reproduced") reasons.push("cleared Hunt retest must bind a not-reproduced proof");
    if (evidence.retest.status === "still-reproduced" && proof.proof.status !== "confirmed") reasons.push("still-reproduced Hunt retest must bind a confirmed proof");
  }

  const attempts = readMembers(verifiedManifest, input.payloads, "verification-attempt", parseVerificationAttempt);
  const matchedAttempts = attempts.filter((attempt) => matchesExecutionBinding(attempt, proof, subjectId, observationId, findingId, ruleId));
  if (matchedAttempts.length === 0) reasons.push("complete Release Record has no verification attempt with the exact Hunt recipe, trust policy, approval, finding, rule, subject, and observation binding");
  if (matchedAttempts.length > 1) reasons.push("complete Release Record has multiple verification attempts with the exact Hunt binding");

  const limitations = [
    ...verifiedManifest.limitations,
    "Hunt release audit verifies evidence binding only; it does not change or approve the Release Record decision.",
  ];
  return {
    status: reasons.length === 0 ? "auditable" : "not-auditable",
    manifestDigest,
    subjectId,
    observationId,
    findingId,
    ruleId,
    matchedVerificationAttemptPaths: matchedAttempts.map((attempt) => findMemberPath(verifiedManifest, input.payloads, attempt.attemptId)).filter((path): path is string => path !== undefined),
    decision: decision.decision,
    reasons,
    limitations,
  };
}

function matchesExecutionBinding(
  attempt: VerificationAttemptDocument,
  proof: HuntProofPayloadDocument,
  subjectId: string,
  observationId: string,
  findingId: string,
  ruleId: string,
): boolean {
  if (attempt.subjectId !== subjectId || attempt.observationId !== observationId) return false;
  if (attempt.findingId !== findingId || attempt.ruleId !== ruleId) return false;
  if (!attempt.executed || attempt.recipe.signatureStatus !== "verified" || attempt.approval.status !== "approved") return false;
  if (!attempt.recipe.trustPolicyDigest || !attempt.approval.requestDigest) return false;
  if (digestString(attempt.recipe.digest) !== proof.execution.recipeDigest) return false;
  if (digestString(attempt.recipe.trustPolicyDigest) !== proof.execution.trustPolicyDigest) return false;
  if (digestString(attempt.approval.requestDigest) !== proof.execution.approvalRequestDigest) return false;
  const expectedVerdict = proof.proof.status === "confirmed" ? "confirmed" : proof.proof.status === "not-reproduced" ? "not_reproduced" : undefined;
  if (!expectedVerdict || attempt.verdict !== expectedVerdict) return false;
  return proof.outcome?.evidenceDigest !== undefined && attempt.output.evidenceDigest !== undefined && digestString(attempt.output.evidenceDigest) === proof.outcome.evidenceDigest;
}

function digestString(value: { readonly algorithm: string; readonly value: string }): string {
  return `${value.algorithm}:${value.value}`;
}

function readMemberJson(manifest: ReleaseRecordManifestDocument, payloads: ReadonlyMap<string, Uint8Array>, kind: ReleaseRecordManifestDocument["members"][number]["kind"]): unknown {
  const member = manifest.members.find((candidate) => candidate.kind === kind && candidate.redaction !== "omitted");
  if (!member) throw new Error(`complete Release Record is missing its ${kind} member`);
  const bytes = payloads.get(member.path);
  if (!bytes) throw new Error(`complete Release Record payload is missing: ${member.path}`);
  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)) as unknown;
}

function readMembers<T>(
  manifest: ReleaseRecordManifestDocument,
  payloads: ReadonlyMap<string, Uint8Array>,
  kind: ReleaseRecordManifestDocument["members"][number]["kind"],
  parser: (value: unknown) => T,
): T[] {
  return manifest.members.filter((member) => member.kind === kind && member.redaction !== "omitted").map((member) => {
    const bytes = payloads.get(member.path);
    if (!bytes) throw new Error(`complete Release Record payload is missing: ${member.path}`);
    return parser(JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)) as unknown);
  });
}

function findMemberPath(manifest: ReleaseRecordManifestDocument, payloads: ReadonlyMap<string, Uint8Array>, attemptId: string): string | undefined {
  return manifest.members.find((member) => {
    if (member.kind !== "verification-attempt" || member.redaction === "omitted") return false;
    const bytes = payloads.get(member.path);
    if (!bytes) return false;
    try { return parseVerificationAttempt(JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)) as unknown).attemptId === attemptId; }
    catch { return false; }
  })?.path;
}
