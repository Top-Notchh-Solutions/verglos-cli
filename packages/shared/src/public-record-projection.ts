import { createHash } from "node:crypto";
import { releaseRecordManifestDigest } from "./record-digest.js";
import { parseReleaseRecordManifest, type ReleaseRecordManifestDocument } from "./record-manifest.js";
import { parseReleaseDecisionJson, type ReleaseDecisionDocument } from "./release-decision.js";

export interface PublicRecordProjection { readonly manifestId: string; readonly manifestDigest: string; readonly generatedAt: string; readonly decisionMemberDigest: string; readonly redaction: ReleaseRecordManifestDocument["redaction"]; readonly limitations: readonly string[]; }
export function projectPublicRecord(manifest: ReleaseRecordManifestDocument): PublicRecordProjection {
  const parsed = parseReleaseRecordManifest(manifest); const decision = parsed.members.find((member) => member.kind === "release-decision");
  if (!decision) throw new Error("public projection requires a release-decision member");
  return { manifestId: parsed.manifestId, manifestDigest: releaseRecordManifestDigest(parsed), generatedAt: parsed.generatedAt, decisionMemberDigest: `${decision.digest.algorithm}:${decision.digest.value}`, redaction: parsed.redaction, limitations: Object.freeze([...parsed.limitations]) };
}

export interface VerifiedPublicRecordProjection extends PublicRecordProjection {
  readonly decision: ReleaseDecisionDocument["decision"];
  readonly subjects: readonly { readonly subjectId: string; readonly role: ReleaseDecisionDocument["subjects"][number]["role"] }[];
  readonly policy: Readonly<{ readonly id: string; readonly version: string; readonly digest: string }>;
  readonly signerStatus: "unsigned" | "unknown";
}

/**
 * Build the public release projection only from member bytes already verified by
 * the record reader. The decision payload is digest-checked again here so this
 * boundary cannot accidentally project data from an unrelated member.
 */
export function projectVerifiedPublicRecord(
  manifest: ReleaseRecordManifestDocument,
  members: ReadonlyMap<string, Uint8Array>,
): VerifiedPublicRecordProjection {
  const parsed = parseReleaseRecordManifest(manifest);
  const base = projectPublicRecord(parsed);
  const decisionMember = parsed.members.find((member) => member.kind === "release-decision");
  if (!decisionMember) throw new Error("public projection requires a release-decision member");
  const bytes = members.get(decisionMember.path);
  if (!bytes) throw new Error("verified record is missing the release-decision member");
  if (bytes.byteLength !== decisionMember.size) throw new Error("release-decision member size mismatch");
  const digest = createHash("sha256").update(bytes).digest("hex");
  if (decisionMember.digest.algorithm !== "sha256" || digest !== decisionMember.digest.value) throw new Error("release-decision member digest mismatch");
  const decision = parseReleaseDecisionJson(bytes);
  return {
    ...base,
    decision: decision.decision,
    subjects: Object.freeze(decision.subjects.map(({ subjectId, role }) => ({ subjectId, role }))),
    policy: Object.freeze({ id: decision.policy.id, version: decision.policy.version, digest: `${decision.policy.digest.algorithm}:${decision.policy.digest.value}` }),
    signerStatus: parsed.members.some((member) => member.kind === "signature" && member.redaction !== "omitted") ? "unknown" : "unsigned",
  };
}
