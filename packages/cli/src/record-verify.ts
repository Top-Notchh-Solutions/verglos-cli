import { lstat, readFile } from "node:fs/promises";
import { parseReleaseRecordManifestJson, readAndVerifyRecord, releaseRecordManifestDigest } from "@verglos/shared";

const MAX_MANIFEST_BYTES = 8 * 1024 * 1024;

export async function executeRecordVerify(root: string, manifestPath: string, json = false, quiet = false): Promise<number> {
  try {
    const entry = await lstat(manifestPath);
    if (!entry.isFile()) throw new Error("record manifest must be a regular file");
    if (entry.size > MAX_MANIFEST_BYTES) throw new Error("record manifest exceeds the 8 MiB limit");
    const bytes = await readFile(manifestPath);
    if (bytes.byteLength > MAX_MANIFEST_BYTES) throw new Error("record manifest exceeds the 8 MiB limit");
    const manifest = parseReleaseRecordManifestJson(bytes);
    const members = await readAndVerifyRecord(root, manifest);
    const result = { verified: true, manifestDigest: releaseRecordManifestDigest(manifest), members: members.size, paths: [...members.keys()].sort() };
    if (json) console.log(JSON.stringify(result));
    else if (!quiet) console.log(`Verified record ${result.manifestDigest} (${result.members} members).`);
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to verify record.";
    if (json) console.log(JSON.stringify({ status: "error", code: "RECORD_VERIFY_INPUT", message })); else console.error(`[RECORD_VERIFY_INPUT] ${message}`);
    return 78;
  }
}
