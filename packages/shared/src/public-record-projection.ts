import { releaseRecordManifestDigest } from "./record-digest.js";
import { parseReleaseRecordManifest, type ReleaseRecordManifestDocument } from "./record-manifest.js";

export interface PublicRecordProjection { readonly manifestId: string; readonly manifestDigest: string; readonly generatedAt: string; readonly decisionMemberDigest: string; readonly redaction: ReleaseRecordManifestDocument["redaction"]; readonly limitations: readonly string[]; }
export function projectPublicRecord(manifest: ReleaseRecordManifestDocument): PublicRecordProjection {
  const parsed = parseReleaseRecordManifest(manifest); const decision = parsed.members.find((member) => member.kind === "release-decision");
  if (!decision) throw new Error("public projection requires a release-decision member");
  return { manifestId: parsed.manifestId, manifestDigest: releaseRecordManifestDigest(parsed), generatedAt: parsed.generatedAt, decisionMemberDigest: `${decision.digest.algorithm}:${decision.digest.value}`, redaction: parsed.redaction, limitations: Object.freeze([...parsed.limitations]) };
}
