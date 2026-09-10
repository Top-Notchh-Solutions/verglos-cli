import { parseReleaseRecordManifest, type ReleaseRecordManifestDocument } from "./record-manifest.js";
import { readRecordMember } from "./record-store.js";
import { classifySchemaCompatibility } from "./schema.js";

const REQUIRED_MEDIA_TYPES = new Set(["application/json", "application/sarif+json", "application/vnd.cyclonedx+json", "application/spdx+json", "application/vnd.in-toto+json"]);

function mediaTypeBase(mediaType: string): string { return mediaType.split(";", 1)[0]!.toLowerCase(); }
function validateMemberSchema(member: ReleaseRecordManifestDocument["members"][number]): void {
  if (member.schema) {
    const compatibility = classifySchemaCompatibility(member.schema.version, "1.0.0");
    if (compatibility !== "exact" && compatibility !== "backward-compatible") throw new Error(`unsupported record member schema version for ${member.path}`);
  }
}
function validateJsonBytes(member: ReleaseRecordManifestDocument["members"][number], bytes: Uint8Array): void {
  if (!mediaTypeBase(member.mediaType).endsWith("+json") && mediaTypeBase(member.mediaType) !== "application/json") return;
  try { JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)); } catch { throw new Error(`record member JSON is malformed for ${member.path}`); }
}

export async function readAndVerifyRecord(root: string, manifest: ReleaseRecordManifestDocument): Promise<ReadonlyMap<string, Uint8Array>> {
  const parsed = parseReleaseRecordManifest(manifest);
  const members = new Map<string, Uint8Array>();
  const digests = new Set<string>();
  for (const member of parsed.members) {
    validateMemberSchema(member);
    if (member.required && !REQUIRED_MEDIA_TYPES.has(mediaTypeBase(member.mediaType))) throw new Error(`unsupported required record member media type for ${member.path}`);
    const memberDigest = `${member.digest.algorithm}:${member.digest.value}`;
    if (digests.has(memberDigest)) throw new Error(`record member digest is duplicated for ${member.path}`);
    digests.add(memberDigest);
    if (member.redaction === "omitted") {
      if (member.required) throw new Error(`required record member cannot be omitted: ${member.path}`);
      continue;
    }
    const bytes = await readRecordMember(root, memberDigest);
    if (bytes.byteLength !== member.size) throw new Error(`record member size mismatch for ${member.path}`);
    validateJsonBytes(member, bytes);
    members.set(member.path, bytes);
  }
  return members;
}
