import { lstat, readFile } from "node:fs/promises";
import { parseReleaseDecisionJson, parseReleaseRecordManifestJson, projectReleaseHeader, readAndVerifyRecord } from "@verglos/shared";

const MAX_MANIFEST_BYTES = 8 * 1024 * 1024;

export async function executeRecordHeader(storeRoot: string, manifestPath: string, json = false, quiet = false): Promise<number> {
  try {
    const entry = await lstat(manifestPath);
    if (!entry.isFile() || entry.size > MAX_MANIFEST_BYTES) throw new Error("record manifest must be a bounded regular file");
    const manifest = parseReleaseRecordManifestJson(await readFile(manifestPath));
    const members = await readAndVerifyRecord(storeRoot, manifest);
    const decisionMember = manifest.members.find((member) => member.kind === "release-decision");
    if (!decisionMember) throw new Error("record header requires a release-decision member");
    const decisionBytes = members.get(decisionMember.path);
    if (!decisionBytes) throw new Error("record header is missing the verified release-decision member");
    const signerStatus = manifest.members.some((member) => member.kind === "signature" && member.redaction !== "omitted") ? "unknown" : "unsigned";
    const header = projectReleaseHeader(parseReleaseDecisionJson(decisionBytes), signerStatus);
    if (json) { if (!quiet) console.log(JSON.stringify(header)); }
    else if (!quiet) {
      console.log(`${header.decision} ${header.subjectId}`);
      console.log(`Policy: ${header.policy.id}@${header.policy.version} (${header.policy.digest})`);
      console.log(`Generated: ${header.generatedAt}`);
      console.log(`Signer: ${header.signerStatus}`);
      console.log(`Next: ${header.nextAction}`);
      for (const limitation of header.limitations) console.log(`Limitation: ${limitation}`);
    }
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to project record header";
    if (!quiet) {
      if (json) console.log(JSON.stringify({ status: "error", code: "RECORD_HEADER_INPUT", message }));
      else console.error(`[RECORD_HEADER_INPUT] ${message}`);
    }
    return 78;
  }
}
