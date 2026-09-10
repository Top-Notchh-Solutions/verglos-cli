import { parseReleaseRecordManifest, type ReleaseRecordManifestDocument } from "./record-manifest.js";
import { readRecordMember } from "./record-store.js";

export async function readAndVerifyRecord(root: string, manifest: ReleaseRecordManifestDocument): Promise<ReadonlyMap<string, Uint8Array>> {
  const parsed = parseReleaseRecordManifest(manifest);
  const members = new Map<string, Uint8Array>();
  const digests = new Set<string>();
  for (const member of parsed.members) {
    const memberDigest = `${member.digest.algorithm}:${member.digest.value}`;
    if (digests.has(memberDigest)) throw new Error(`record member digest is duplicated for ${member.path}`);
    digests.add(memberDigest);
    if (member.redaction === "omitted") {
      if (member.required) throw new Error(`required record member cannot be omitted: ${member.path}`);
      continue;
    }
    const bytes = await readRecordMember(root, memberDigest);
    if (bytes.byteLength !== member.size) throw new Error(`record member size mismatch for ${member.path}`);
    members.set(member.path, bytes);
  }
  return members;
}
