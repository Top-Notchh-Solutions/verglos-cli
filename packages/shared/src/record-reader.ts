import { parseReleaseRecordManifest, type ReleaseRecordManifestDocument } from "./record-manifest.js";
import { readRecordMember } from "./record-store.js";

export async function readAndVerifyRecord(root: string, manifest: ReleaseRecordManifestDocument): Promise<ReadonlyMap<string, Uint8Array>> {
  const parsed = parseReleaseRecordManifest(manifest);
  const members = new Map<string, Uint8Array>();
  for (const member of parsed.members) {
    const bytes = await readRecordMember(root, `${member.digest.algorithm}:${member.digest.value}`);
    if (bytes.byteLength !== member.size && member.redaction !== "omitted") throw new Error(`record member size mismatch for ${member.path}`);
    members.set(member.path, bytes);
  }
  return members;
}
