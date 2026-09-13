import { createHash } from "node:crypto";
import { createReleaseRecordManifest, type ReleaseRecordManifestDocument } from "./record-manifest.js";
import { describeRecordMember } from "./record-store.js";
import { SUBJECT_SCHEMA, parseSubject } from "./subject.js";
import { POLICY_DOCUMENT_SCHEMA, parsePolicyDocument, policyDocumentDigest } from "./policy-document.js";
import { POLICY_EVALUATION_SCHEMA, parsePolicyEvaluation } from "./policy-evaluation.js";
import { RELEASE_DECISION_SCHEMA, parseReleaseDecision } from "./release-decision.js";
import { canonicalizeJson } from "./schema.js";

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
  readonly schema?: ReleaseRecordManifestDocument["members"][number]["schema"];
}

/** Assemble a deterministic manifest and payload map from member bytes. */
export function assembleReleaseRecordBundle(input: Omit<ReleaseRecordManifestDocument, "members" | "extensions"> & { readonly payloads: readonly ReleaseRecordPayloadInput[]; readonly extensions?: ReleaseRecordManifestDocument["extensions"] }): { readonly manifest: ReleaseRecordManifestDocument; readonly payloads: ReadonlyMap<string, Uint8Array> } {
  const { payloads: payloadInputs, ...manifestInput } = input;
  if (payloadInputs.filter((payload) => payload.kind === "release-decision").length !== 1) throw new Error("Release Record assembly requires exactly one release-decision payload");
  const payloads = new Map<string, Uint8Array>();
  const digests = new Set<string>();
  const members = payloadInputs.map((payload) => {
    if (payloads.has(payload.path)) throw new Error(`Release Record payload path is duplicated: ${payload.path}`);
    if (payload.redaction === "omitted" && payload.bytes.byteLength !== 0) throw new Error(`omitted Release Record payload must be empty: ${payload.path}`);
    payloads.set(payload.path, payload.bytes);
    const member = describeRecordMember(payload);
    const memberDigest = `${member.digest.algorithm}:${member.digest.value}`;
    if (digests.has(memberDigest)) throw new Error(`Release Record payload digest is duplicated: ${payload.path}`);
    digests.add(memberDigest);
    return payload.schema ? { ...member, schema: payload.schema } : member;
  });
  return { manifest: createReleaseRecordManifest({ ...manifestInput, members }), payloads };
}

/** Apply the minimum complete Release Record graph gate before publication. */
export function assertCompleteReleaseRecord(manifest: ReleaseRecordManifestDocument): ReleaseRecordManifestDocument {
  const parsed = createReleaseRecordManifest(manifest);
  const kinds = new Set(parsed.members.map((member) => member.kind));
  for (const required of ["subject", "policy", "policy-evaluation", "release-decision"] as const) {
    if (!kinds.has(required)) throw new Error(`complete Release Record requires a ${required} member`);
  }
  if (["complete", "partial"].includes(parsed.redaction.status) && !kinds.has("redaction-manifest")) throw new Error("complete Release Record requires a redaction-manifest member");
  for (const singleton of ["policy-evaluation", "redaction-manifest"] as const) {
    if (parsed.members.filter((member) => member.kind === singleton).length > 1) throw new Error(`complete Release Record permits only one ${singleton} member`);
  }
  return parsed;
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

  const policies = payloadFor("policy");
  if (policies.length !== 1) throw new Error("complete Release Record requires exactly one policy payload");
  requireSchema(policies[0]!.member, POLICY_DOCUMENT_SCHEMA);
  const policy = parsePolicyDocument(policies[0]!.value);

  const evaluations = payloadFor("policy-evaluation");
  if (evaluations.length !== 1) throw new Error("complete Release Record requires exactly one policy-evaluation payload");
  requireSchema(evaluations[0]!.member, POLICY_EVALUATION_SCHEMA);
  const evaluation = parsePolicyEvaluation(evaluations[0]!.value);

  const decisions = payloadFor("release-decision");
  if (decisions.length !== 1) throw new Error("complete Release Record requires exactly one release-decision payload");
  requireSchema(decisions[0]!.member, RELEASE_DECISION_SCHEMA);
  const decision = parseReleaseDecision(decisions[0]!.value);

  if (!subjectIds.has(evaluation.subjectId) || decision.subjects.some((subject) => !subjectIds.has(subject.subjectId))) {
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
  if (["complete", "partial"].includes(parsed.redaction.status)) {
    const redactionMembers = payloadFor("redaction-manifest");
    if (redactionMembers.length !== 1) throw new Error("complete or partial redaction requires exactly one included redaction manifest payload");
    const redactionMemberDigest = `${redactionMembers[0]!.member.digest.algorithm}:${redactionMembers[0]!.member.digest.value}`;
    const declaredDigest = parsed.redaction.manifestDigest ? `${parsed.redaction.manifestDigest.algorithm}:${parsed.redaction.manifestDigest.value}` : "";
    if (redactionMemberDigest !== declaredDigest) throw new Error("Release Record redaction digest does not match the included redaction manifest");
  }

  return parsed;
}
