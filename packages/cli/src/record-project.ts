import { lstat, readFile } from "node:fs/promises";
import { parseReleaseRecordManifestJson, projectVerifiedPublicRecord, readAndVerifyRecord } from "@verglos/shared";

const MAX_MANIFEST_BYTES = 8 * 1024 * 1024;

export async function executeRecordProject(storeRoot: string, manifestPath: string, json = false, quiet = false): Promise<number> {
  try {
    const entry = await lstat(manifestPath);
    if (!entry.isFile()) throw new Error("record manifest must be a regular file");
    if (entry.size > MAX_MANIFEST_BYTES) throw new Error("record manifest exceeds the 8 MiB limit");
    const bytes = await readFile(manifestPath);
    if (bytes.byteLength > MAX_MANIFEST_BYTES) throw new Error("record manifest exceeds the 8 MiB limit");
    const manifest = parseReleaseRecordManifestJson(bytes);
    const members = await readAndVerifyRecord(storeRoot, manifest);
    const projection = projectVerifiedPublicRecord(manifest, members);
    if (json) console.log(JSON.stringify(projection));
    else if (!quiet) console.log(`${projection.decision} ${projection.manifestDigest} (${projection.signerStatus})`);
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to project record.";
    if (json) console.log(JSON.stringify({ status: "error", code: "RECORD_PROJECT_INPUT", message }));
    else if (!quiet) console.error(`[RECORD_PROJECT_INPUT] ${message}`);
    return 78;
  }
}
