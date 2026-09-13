import { createHash } from "node:crypto";
import { lstat, readFile } from "node:fs/promises";
import {
  explainPolicyEvaluation,
  canonicalizeJson,
  parseReleaseDecision,
  parseObservation,
  parsePolicyDocument,
  parsePolicyEvaluationJson,
  parseReleaseRecordManifestJson,
  parseSubject,
  policyDocumentDigest,
  readAndVerifyRecord,
  releaseRecordManifestDigest,
} from "@verglos/shared";

const MAX_MANIFEST_BYTES = 8 * 1024 * 1024;
const MAX_RECORD_MEMBERS = 256;
const MAX_RECORD_MEMBER_BYTES = 10 * 1024 * 1024;
const MAX_RECORD_TOTAL_BYTES = 32 * 1024 * 1024;

function decodeJson(bytes: Uint8Array): unknown {
  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
}

/**
 * Read and validate a stored policy evaluation through the same versioned
 * policy, subject, observation, and record contracts used by the CLI.
 * This verifies recorded references and deterministic decision consistency;
 * it does not rerun producers or claim that the recorded producer facts are true.
 */
export async function checkPolicyRecord(input: { manifestPath: string; recordStore: string }) {
  const manifestEntry = await lstat(input.manifestPath);
  if (!manifestEntry.isFile() || manifestEntry.size > MAX_MANIFEST_BYTES) throw new Error("policy manifest must be a bounded regular file");
  const manifestBytes = await readFile(input.manifestPath);
  if (manifestBytes.byteLength > MAX_MANIFEST_BYTES) throw new Error("policy manifest exceeds the 8 MiB limit");
  const manifest = parseReleaseRecordManifestJson(manifestBytes);
  if (manifest.members.length > MAX_RECORD_MEMBERS) throw new Error("policy record exceeds the 256-member limit");
  let totalBytes = 0;
  for (const member of manifest.members) {
    if (member.redaction === "omitted") continue;
    if (member.size > MAX_RECORD_MEMBER_BYTES) throw new Error("policy record member exceeds the 10 MiB limit");
    totalBytes += member.size;
    if (totalBytes > MAX_RECORD_TOTAL_BYTES) throw new Error("policy record exceeds the 32 MiB total limit");
  }

  const evaluationEntries = manifest.members.filter((member) => member.kind === "policy-evaluation" && member.redaction !== "omitted");
  const policyEntries = manifest.members.filter((member) => member.kind === "policy" && member.redaction !== "omitted");
  const decisionEntries = manifest.members.filter((member) => member.kind === "release-decision" && member.redaction !== "omitted");
  if (evaluationEntries.length !== 1 || policyEntries.length !== 1 || decisionEntries.length !== 1) throw new Error("policy record must contain exactly one policy, policy evaluation, and release decision");
  const members = await readAndVerifyRecord(input.recordStore, manifest);
  const policyBytes = members.get(policyEntries[0]!.path);
  const evaluationBytes = members.get(evaluationEntries[0]!.path);
  const decisionBytes = members.get(decisionEntries[0]!.path);
  if (!policyBytes || !evaluationBytes || !decisionBytes) throw new Error("policy record is missing a required verified member");
  const policy = parsePolicyDocument(decodeJson(policyBytes));
  const evaluation = parsePolicyEvaluationJson(evaluationBytes);
  const releaseDecision = parseReleaseDecision(decodeJson(decisionBytes));
  const policyDigest = policyDocumentDigest(policy);
  if (evaluation.policy.id !== policy.policyId || evaluation.policy.version !== policy.policyVersion || `${evaluation.policy.digest.algorithm}:${evaluation.policy.digest.value}` !== policyDigest) {
    throw new Error("policy evaluation does not bind the exact policy document");
  }
  if (evaluation.checks.length !== policy.checks.length) throw new Error("policy evaluation does not contain the policy's exact check set");
  const evaluatedChecks = new Map(evaluation.checks.map((check) => [check.id, check]));
  for (const configured of policy.checks) {
    const evaluated = evaluatedChecks.get(configured.id);
    if (!evaluated || evaluated.requirement !== configured.requirement || evaluated.onFailure !== configured.onFailure) {
      throw new Error("policy evaluation check contract does not match the exact policy document");
    }
  }
  const canonicalEvaluationDigest = `sha256:${createHash("sha256").update(canonicalizeJson(evaluation), "utf8").digest("hex")}`;
  if (releaseDecision.decision !== evaluation.decision || releaseDecision.evaluation.evaluationId !== evaluation.evaluationId || releaseDecision.evaluation.subjectId !== evaluation.subjectId || `${releaseDecision.evaluation.digest.algorithm}:${releaseDecision.evaluation.digest.value}` !== canonicalEvaluationDigest || canonicalizeJson(releaseDecision.policy) !== canonicalizeJson(evaluation.policy) || !releaseDecision.subjects.some((subject) => subject.role === "primary" && subject.subjectId === evaluation.subjectId)) {
    throw new Error("release decision does not bind the exact policy evaluation");
  }

  const subjectEntries = manifest.members.filter((member) => member.kind === "subject" && member.redaction !== "omitted");
  const subjects = subjectEntries.map((member) => {
    const bytes = members.get(member.path);
    if (!bytes) throw new Error("policy record subject member is unavailable");
    return parseSubject(decodeJson(bytes));
  });
  if (!subjects.some((subject) => subject.subjectId === evaluation.subjectId)) throw new Error("policy evaluation subject is not present in the verified record");

  const observationEntries = manifest.members.filter((member) => member.kind === "observation" && member.redaction !== "omitted");
  const observations = observationEntries.map((member) => {
    const bytes = members.get(member.path);
    if (!bytes) throw new Error("policy record observation member is unavailable");
    return parseObservation(decodeJson(bytes));
  });
  const observationsById = new Map(observations.map((observation) => [observation.observationId, observation]));
  if (observationsById.size !== observations.length) throw new Error("policy record contains duplicate observation identities");
  const verifiedDigests = new Set(manifest.members.filter((member) => member.redaction !== "omitted" && !["metadata", "subject", "policy", "policy-evaluation", "release-decision"].includes(member.kind)).map((member) => `${member.digest.algorithm}:${member.digest.value}`));
  for (const check of evaluation.checks) {
    for (const observationId of check.observationIds) {
      const observation = observationsById.get(observationId);
      if (!observation || observation.subjectId !== evaluation.subjectId) throw new Error("policy evaluation references an observation absent from the exact subject record");
    }
    for (const digest of check.evidenceDigests) {
      if (!verifiedDigests.has(`${digest.algorithm}:${digest.value}`)) throw new Error("policy evaluation references evidence absent from the verified record");
    }
  }

  const explanation = explainPolicyEvaluation(evaluation);
  const observationReferenceCount = evaluation.checks.reduce((count, check) => count + check.observationIds.length, 0);
  const evidenceReferenceCount = evaluation.checks.reduce((count, check) => count + check.evidenceDigests.length, 0);
  return {
    ...explanation,
    recordDigest: releaseRecordManifestDigest(manifest),
    coverage: {
      recordMembersVerified: members.size,
      policyChecks: evaluation.checks.length,
      observationReferencesVerified: observationReferenceCount,
      evidenceReferencesVerified: evidenceReferenceCount,
      policyPredicatesReevaluated: false,
    },
    verification: {
      policy: "canonical-digest-verified",
      subject: "immutable-subject-member-verified",
      observations: "referenced-observations-verified",
      evidence: "referenced-member-digests-verified",
      decision: "policy-evaluation-derived-fields-validated",
      limitation: "policy predicates are not rerun; producer execution and truth of source evidence are not re-established by this read-only check",
    },
  };
}
