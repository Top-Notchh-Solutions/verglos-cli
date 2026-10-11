import { createHash } from "node:crypto";
import { createReleaseRecordManifest, type ReleaseRecordManifestDocument } from "./record-manifest.js";
import { describeRecordMember } from "./record-store.js";
import { TOOL_RUN_SCHEMA, parseToolRun } from "./engine.js";
import { OBSERVATION_SCHEMA, parseObservation } from "./observation.js";
import { VERIFICATION_ATTEMPT_SCHEMA, parseVerificationAttempt } from "./verification.js";
import { EXCEPTION_APPROVAL_SCHEMA, POLICY_EXCEPTION_SCHEMA, parseExceptionApproval, parsePolicyException, digestPolicyException } from "./exception.js";
import { SUBJECT_SCHEMA, parseSubject } from "./subject.js";
import { POLICY_DOCUMENT_SCHEMA, parsePolicyDocument, policyDocumentDigest } from "./policy-document.js";
import { POLICY_EVALUATION_SCHEMA, parsePolicyEvaluation } from "./policy-evaluation.js";
import { RELEASE_DECISION_SCHEMA, parseReleaseDecision } from "./release-decision.js";
import { canonicalizeJson } from "./schema.js";
import { LINEAGE_GRAPH_SCHEMA, parseLineageGraphDocument } from "./lineage-graph.js";
import { createRedactionManifest, parseRedactionManifest, REDACTION_MANIFEST_SCHEMA, type RedactionCategory } from "./redaction-manifest.js";
import { parseProviderProvenanceDocument } from "./provenance-provider.js";

export function assembleReleaseRecord(input: Omit<ReleaseRecordManifestDocument, "members" | "extensions"> & { readonly members: ReleaseRecordManifestDocument["members"]; readonly extensions?: ReleaseRecordManifestDocument["extensions"] }): ReleaseRecordManifestDocument {
  if (input.members.filter((member) => member.kind === "release-decision").length !== 1) throw new Error("Release Record assembly requires exactly one release-decision member");
  return createReleaseRecordManifest(input);
}

export interface ReleaseRecordPayloadInput {
  readonly path: string;
  readonly kind: ReleaseRecordManifestDocument["members"][number]["kind"];
  readonly mediaType: string;
  readonly bytes: Uint8Array;
  readonly required: boolean;
  readonly redaction?: "none" | "applied" | "omitted";
  readonly redactionCategories?: readonly RedactionCategory[];
  readonly schema?: ReleaseRecordManifestDocument["members"][number]["schema"];
}

type ReleaseRecordBundleRedactionInput =
  | { readonly status: "not-required" | "unknown"; readonly manifestDigest?: never }
  | { readonly status: "complete" | "partial"; readonly manifestDigest?: never };

/** Assemble a deterministic manifest and payload map from member bytes. */
export function assembleReleaseRecordBundle(input: Omit<ReleaseRecordManifestDocument, "members" | "extensions" | "redaction"> & { readonly redaction: ReleaseRecordBundleRedactionInput; readonly payloads: readonly ReleaseRecordPayloadInput[]; readonly extensions?: ReleaseRecordManifestDocument["extensions"] }): { readonly manifest: ReleaseRecordManifestDocument; readonly payloads: ReadonlyMap<string, Uint8Array> } {
  const { payloads: payloadInputs, ...manifestInput } = input;
  if (payloadInputs.filter((payload) => payload.kind === "release-decision").length !== 1) throw new Error("Release Record assembly requires exactly one release-decision payload");
  const generatedRedactionManifest = ["complete", "partial"].includes(input.redaction.status);
  if (generatedRedactionManifest && payloadInputs.some((payload) => payload.kind === "redaction-manifest")) throw new Error("redaction-manifest payload is generated from declared member dispositions");
  const payloads = new Map<string, Uint8Array>();
  const digests = new Set<string>();
  const members = payloadInputs.map((payload) => {
    if (payloads.has(payload.path)) throw new Error(`Release Record payload path is duplicated: ${payload.path}`);
    if (payload.redactionCategories && payload.redactionCategories.length > 0 && (payload.redaction ?? "none") === "none") throw new Error(`unredacted Release Record payload cannot declare redaction categories: ${payload.path}`);
    if (payload.redaction === "omitted" && payload.bytes.byteLength !== 0) throw new Error(`omitted Release Record payload must be empty: ${payload.path}`);
    // Omitted members stay in the manifest/redaction inventory, but their
    // empty placeholder bytes are not part of the publishable member store.
    if (payload.redaction !== "omitted") payloads.set(payload.path, payload.bytes);
    const member = describeRecordMember(payload);
    const memberDigest = `${member.digest.algorithm}:${member.digest.value}`;
    if (digests.has(memberDigest)) throw new Error(`Release Record payload digest is duplicated: ${payload.path}`);
    digests.add(memberDigest);
    return payload.schema ? { ...member, schema: payload.schema } : member;
  });
  // The bundle API derives the digest for complete/partial manifests below;
  // final strict manifest validation verifies the resulting discriminated union.
  let redaction = input.redaction as ReleaseRecordManifestDocument["redaction"];
  if (generatedRedactionManifest) {
    const redactionPath = "redaction-manifest.json";
    if (payloads.has(redactionPath)) throw new Error(`Release Record payload path is reserved for generated redaction evidence: ${redactionPath}`);
    const redactionManifest = createRedactionManifest({
      status: input.redaction.status as "complete" | "partial",
      members: members.map((member, index) => ({
        memberDigest: member.digest,
        disposition: member.redaction,
        categories: [...(payloadInputs[index]!.redactionCategories ?? [])],
      })),
    });
    const redactionBytes = new TextEncoder().encode(canonicalizeJson(redactionManifest));
    const redactionMember = {
      ...describeRecordMember({ path: redactionPath, kind: "redaction-manifest", mediaType: "application/json", bytes: redactionBytes, required: true }),
      schema: REDACTION_MANIFEST_SCHEMA,
    };
    members.push(redactionMember);
    payloads.set(redactionPath, redactionBytes);
    redaction = {
      status: redactionManifest.status,
      manifestDigest: { algorithm: "sha256", value: createHash("sha256").update(redactionBytes).digest("hex") },
    };
  }
  return { manifest: createReleaseRecordManifest({ ...manifestInput, redaction, members }), payloads };
}

/** Apply the minimum complete Release Record graph gate before publication. */
export function assertCompleteReleaseRecord(manifest: ReleaseRecordManifestDocument): ReleaseRecordManifestDocument {
  const parsed = createReleaseRecordManifest(manifest);
  const kinds = new Set(parsed.members.map((member) => member.kind));
  for (const required of ["subject", "lineage", "policy", "policy-evaluation", "release-decision"] as const) {
    if (!kinds.has(required)) throw new Error(`complete Release Record requires a ${required} member`);
  }
  if (["complete", "partial"].includes(parsed.redaction.status) && !kinds.has("redaction-manifest")) throw new Error("complete Release Record requires a redaction-manifest member");
  for (const singleton of ["policy-evaluation", "redaction-manifest"] as const) {
    if (parsed.members.filter((member) => member.kind === singleton).length > 1) throw new Error(`complete Release Record permits only one ${singleton} member`);
  }
  return parsed;
}

/** Verify a declared redaction manifest against the record's member descriptors and bytes. */
export function assertReleaseRecordRedactionPayloads(
  manifest: ReleaseRecordManifestDocument,
  payloads: ReadonlyMap<string, Uint8Array>,
): ReleaseRecordManifestDocument {
  const parsed = createReleaseRecordManifest(manifest);
  if (!["complete", "partial"].includes(parsed.redaction.status)) return parsed;
  const members = parsed.members.filter((member) => member.kind === "redaction-manifest");
  if (members.length !== 1 || members[0]!.redaction === "omitted") throw new Error("complete or partial redaction requires exactly one included redaction manifest member");
  const member = members[0]!;
  if (!member.schema || member.schema.id !== REDACTION_MANIFEST_SCHEMA.id || member.schema.version !== REDACTION_MANIFEST_SCHEMA.version) {
    throw new Error(`complete Release Record member schema does not match its payload: ${member.path}`);
  }
  const bytes = payloads.get(member.path);
  if (!bytes) throw new Error(`complete or partial redaction manifest payload is missing: ${member.path}`);
  const actualDigest = createHash(member.digest.algorithm).update(bytes).digest("hex");
  if (bytes.byteLength !== member.size || actualDigest !== member.digest.value) throw new Error(`Release Record redaction manifest payload does not match its declared digest or size: ${member.path}`);
  let value: unknown;
  try { value = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)); }
  catch { throw new Error(`complete or partial redaction manifest JSON payload is invalid: ${member.path}`); }
  const redactionManifest = parseRedactionManifest(value);
  if (redactionManifest.status !== parsed.redaction.status) throw new Error("Release Record redaction status does not match its redaction manifest");
  const declaredDigest = parsed.redaction.manifestDigest ? `${parsed.redaction.manifestDigest.algorithm}:${parsed.redaction.manifestDigest.value}` : "";
  if (`${member.digest.algorithm}:${member.digest.value}` !== declaredDigest) throw new Error("Release Record redaction digest does not match the included redaction manifest");
  const expectedEntries = parsed.members.filter((candidate) => candidate.kind !== "redaction-manifest").map((candidate) => `${candidate.digest.algorithm}:${candidate.digest.value}:${candidate.redaction}`).sort();
  const actualEntries = redactionManifest.members.map((entry) => `${entry.memberDigest.algorithm}:${entry.memberDigest.value}:${entry.disposition}`).sort();
  if (expectedEntries.length !== actualEntries.length || expectedEntries.some((entry, index) => entry !== actualEntries[index])) {
    throw new Error("Release Record redaction manifest does not cover the exact declared member digests and dispositions");
  }
  return parsed;
}

/** Validate retained source bytes and recompute provider provenance state for every included provenance member. */
export function assertProviderProvenancePayloads(
  manifest: ReleaseRecordManifestDocument,
  payloads: ReadonlyMap<string, Uint8Array>,
): void {
  const members = manifest.members.filter((member) => member.kind === "provenance" && member.redaction !== "omitted");
  if (members.length === 0) return;
  const declaredSubjects = manifest.members.filter((member) => member.kind === "subject" && member.redaction !== "omitted");
  const subjects = new Map<string, ReturnType<typeof parseSubject>>();
  for (const member of declaredSubjects) {
    if (!member.schema || member.schema.id !== SUBJECT_SCHEMA.id || member.schema.version !== SUBJECT_SCHEMA.version) throw new Error(`Release Record subject schema reference is invalid: ${member.path}`);
    const bytes = payloads.get(member.path);
    if (!bytes) throw new Error(`Release Record subject payload is missing: ${member.path}`);
    let value: unknown;
    try { value = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)); }
    catch { throw new Error(`Release Record subject payload is invalid JSON: ${member.path}`); }
    const subject = parseSubject(value);
    if (subjects.has(subject.subjectId)) throw new Error("Release Record provenance subject identities must be unique");
    subjects.set(subject.subjectId, subject);
  }
  if (members.length > 0 && subjects.size === 0) throw new Error("Release Record provenance requires at least one included subject payload");
  for (const member of members) {
    if (member.schema?.id !== "urn:verglos:schema:provider-provenance" || member.schema.version !== "1.0.0") throw new Error(`Release Record provenance member schema reference is invalid: ${member.path}`);
    const bytes = payloads.get(member.path);
    if (!bytes) throw new Error(`Release Record provenance payload is missing: ${member.path}`);
    let value: unknown;
    try { value = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)); }
    catch { throw new Error(`Release Record provenance payload is invalid JSON: ${member.path}`); }
    try {
      const provenance = parseProviderProvenanceDocument(value);
      const subject = subjects.get(provenance.subjectId);
      if (!subject) throw new Error("provenance references a subject not included in the record");
      if (!subjectSha256Digests(subject).includes(provenance.match.expectedDigest)) throw new Error("provenance expected artifact digest does not match its included record subject");
    }
    catch (error) { throw new Error(`Release Record provenance payload is invalid: ${member.path}: ${error instanceof Error ? error.message : "invalid payload"}`); }
  }
}

function subjectSha256Digests(subject: ReturnType<typeof parseSubject>): string[] {
  switch (subject.kind) {
    case "repository-tree": return subject.worktreeDigest?.algorithm === "sha256" ? [`sha256:${subject.worktreeDigest.value}`] : [];
    case "filesystem": return subject.treeDigest.algorithm === "sha256" ? [`sha256:${subject.treeDigest.value}`] : [];
    case "package":
    case "artifact":
    case "oci-manifest":
    case "oci-index": return subject.digest.algorithm === "sha256" ? [`sha256:${subject.digest.value}`] : [];
    case "sbom": return subject.documentDigest.algorithm === "sha256" ? [`sha256:${subject.documentDigest.value}`] : [];
  }
}

/** Validate the canonical graph bindings using the actual member payloads. */
export function assertCompleteReleaseRecordPayloads(
  manifest: ReleaseRecordManifestDocument,
  payloads: ReadonlyMap<string, Uint8Array>,
): ReleaseRecordManifestDocument {
  const parsed = assertCompleteReleaseRecord(manifest);
  const byPath = new Map(parsed.members.map((member) => [member.path, member]));
  for (const path of payloads.keys()) {
    const member = byPath.get(path);
    if (!member || member.redaction === "omitted") throw new Error(`Release Record payload is not declared as an included member: ${path}`);
  }
  for (const [path, bytes] of payloads) {
    const member = byPath.get(path)!;
    const actualDigest = createHash(member.digest.algorithm).update(bytes).digest("hex");
    if (bytes.byteLength !== member.size || actualDigest !== member.digest.value) throw new Error(`Release Record payload does not match its declared digest or size: ${path}`);
  }
  const payloadFor = (kind: ReleaseRecordManifestDocument["members"][number]["kind"]): Array<{ member: ReleaseRecordManifestDocument["members"][number]; value: unknown }> =>
    parsed.members.filter((member) => member.kind === kind && member.redaction !== "omitted").map((member) => {
      const bytes = payloads.get(member.path);
      if (!bytes) throw new Error(`complete Release Record payload is missing: ${member.path}`);
      let value: unknown;
      try { value = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)); }
      catch { throw new Error(`complete Release Record JSON payload is invalid: ${member.path}`); }
      return { member, value };
    });
  const requireSchema = (member: ReleaseRecordManifestDocument["members"][number], schema: { readonly id: string; readonly version: string }): void => {
    if (!member.schema || member.schema.id !== schema.id || member.schema.version !== schema.version) {
      throw new Error(`complete Release Record member schema does not match its payload: ${member.path}`);
    }
  };

  const subjectMembers = payloadFor("subject");
  if (subjectMembers.length === 0) throw new Error("complete Release Record requires at least one included subject payload");
  const subjects = subjectMembers.map(({ member, value }) => {
    requireSchema(member, SUBJECT_SCHEMA);
    return parseSubject(value);
  });
  const subjectIds = new Set(subjects.map((subject) => subject.subjectId));
  if (subjectIds.size !== subjects.length) throw new Error("complete Release Record subject identities must be unique");

  const lineages = payloadFor("lineage");
  if (lineages.length !== 1) throw new Error("complete Release Record requires exactly one lineage graph payload");
  requireSchema(lineages[0]!.member, LINEAGE_GRAPH_SCHEMA);
  const lineage = parseLineageGraphDocument(lineages[0]!.value);
  if (lineage.subjectIds.length !== subjectIds.size || lineage.subjectIds.some((subjectId) => !subjectIds.has(subjectId))) {
    throw new Error("complete Release Record lineage subject set must exactly match included subject payloads");
  }

  const runs = payloadFor("tool-run").map(({ member, value }) => {
    requireSchema(member, TOOL_RUN_SCHEMA);
    return parseToolRun(value);
  });
  const runById = new Map(runs.map((run) => [run.runId, run]));
  if (runById.size !== runs.length) throw new Error("complete Release Record tool-run identities must be unique");
  for (const run of runs) {
    if (!subjectIds.has(run.subjectId)) throw new Error("complete Release Record tool-run references a subject not included in the record");
  }

  const observations = payloadFor("observation").map(({ member, value }) => {
    requireSchema(member, OBSERVATION_SCHEMA);
    return parseObservation(value);
  });
  const observationById = new Map(observations.map((observation) => [observation.observationId, observation]));
  if (observationById.size !== observations.length) throw new Error("complete Release Record observation identities must be unique");
  for (const observation of observations) {
    if (!subjectIds.has(observation.subjectId)) throw new Error("complete Release Record observation references a subject not included in the record");
    const run = runById.get(observation.origin.runId);
    if (!run || run.subjectId !== observation.subjectId) throw new Error("complete Release Record observation must reference an included tool run for the same subject");
  }

  const verificationAttempts = payloadFor("verification-attempt").map(({ member, value }) => {
    requireSchema(member, VERIFICATION_ATTEMPT_SCHEMA);
    return parseVerificationAttempt(value);
  });
  const verificationIds = new Set(verificationAttempts.map((attempt) => attempt.attemptId));
  if (verificationIds.size !== verificationAttempts.length) throw new Error("complete Release Record verification-attempt identities must be unique");
  for (const attempt of verificationAttempts) {
    const observation = observationById.get(attempt.observationId);
    if (!observation || observation.subjectId !== attempt.subjectId || !subjectIds.has(attempt.subjectId)) {
      throw new Error("complete Release Record verification attempt must reference an included observation for the same subject");
    }
  }

  const exceptions = payloadFor("policy-exception").map(({ member, value }) => {
    requireSchema(member, POLICY_EXCEPTION_SCHEMA);
    return parsePolicyException(value);
  });
  const exceptionById = new Map(exceptions.map((exception) => [exception.exceptionId, exception]));
  if (exceptionById.size !== exceptions.length) throw new Error("complete Release Record policy-exception identities must be unique");
  for (const exception of exceptions) {
    if (!subjectIds.has(exception.scope.subjectId)) throw new Error("complete Release Record policy exception references a subject not included in the record");
    for (const observationId of exception.scope.observationIds) {
      const observation = observationById.get(observationId);
      if (!observation || observation.subjectId !== exception.scope.subjectId) {
        throw new Error("complete Release Record policy exception must reference included observations for its exact subject");
      }
    }
  }

  const approvals = payloadFor("exception-approval").map(({ member, value }) => {
    requireSchema(member, EXCEPTION_APPROVAL_SCHEMA);
    return parseExceptionApproval(value);
  });
  const approvalIds = new Set<string>();
  for (const approval of approvals) {
    if (approvalIds.has(approval.approvalId)) throw new Error("complete Release Record exception-approval identities must be unique");
    approvalIds.add(approval.approvalId);
    const exception = exceptionById.get(approval.target.exceptionId);
    if (!exception) throw new Error("complete Release Record exception approval must reference an included policy exception");
    const expected = digestPolicyException(exception);
    if (approval.target.requestDigest.algorithm !== expected.algorithm || approval.target.requestDigest.value !== expected.value) {
      throw new Error("complete Release Record exception approval does not bind the included policy exception digest");
    }
  }

  const policies = payloadFor("policy");
  if (policies.length !== 1) throw new Error("complete Release Record requires exactly one policy payload");
  requireSchema(policies[0]!.member, POLICY_DOCUMENT_SCHEMA);
  const policy = parsePolicyDocument(policies[0]!.value);

  const evaluations = payloadFor("policy-evaluation");
  if (evaluations.length !== 1) throw new Error("complete Release Record requires exactly one policy-evaluation payload");
  requireSchema(evaluations[0]!.member, POLICY_EVALUATION_SCHEMA);
  const evaluation = parsePolicyEvaluation(evaluations[0]!.value);
  for (const check of evaluation.checks) {
    for (const observationId of check.observationIds) {
      const observation = observationById.get(observationId);
      if (!observation || observation.subjectId !== evaluation.subjectId) {
        throw new Error("complete Release Record policy evaluation references an observation not included for its exact subject");
      }
    }
  }

  const decisions = payloadFor("release-decision");
  if (decisions.length !== 1) throw new Error("complete Release Record requires exactly one release-decision payload");
  requireSchema(decisions[0]!.member, RELEASE_DECISION_SCHEMA);
  const decision = parseReleaseDecision(decisions[0]!.value);

  if (!subjectIds.has(evaluation.subjectId) || decision.subjects.length !== subjectIds.size || decision.subjects.some((subject) => !subjectIds.has(subject.subjectId))) {
    throw new Error("complete Release Record decision and evaluation must reference included subject payloads");
  }
  const evaluationPolicy = `${evaluation.policy.digest.algorithm}:${evaluation.policy.digest.value}`;
  if (policy.policyId !== evaluation.policy.id || policy.policyVersion !== evaluation.policy.version || policyDocumentDigest(policy) !== evaluationPolicy) {
    throw new Error("complete Release Record policy payload does not match the evaluation policy identity and digest");
  }
  const evaluationDigest = `sha256:${createHash("sha256").update(canonicalizeJson(evaluation), "utf8").digest("hex")}`;
  if (decision.evaluation.digest.algorithm !== "sha256" || decision.evaluation.digest.value !== evaluationDigest.slice("sha256:".length)) {
    throw new Error("complete Release Record decision does not bind the included policy evaluation payload");
  }
  if (Date.parse(decision.generatedAt) > Date.parse(parsed.generatedAt)) throw new Error("complete Release Record decision timestamp is after manifest generation");
  assertReleaseRecordRedactionPayloads(parsed, payloads);
  assertProviderProvenancePayloads(parsed, payloads);
  return parsed;
}
