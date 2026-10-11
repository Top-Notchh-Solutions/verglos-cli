import { createHash } from "node:crypto";
import { lstat, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { createProviderProvenanceRecordMember, MAX_PROVENANCE_SOURCE_BYTES, type ProvenanceProvider } from "@verglos/shared";

export async function executeRecordProvenanceImport(
  sourcePath: string,
  outputPath: string,
  provider: ProvenanceProvider,
  subjectId: string,
  expectedDigest: string,
  json = false,
  quiet = false,
): Promise<number> {
  try {
    const sourceEntry = await lstat(sourcePath);
    if (!sourceEntry.isFile()) throw new Error("provenance source must be a regular file");
    if (sourceEntry.size > MAX_PROVENANCE_SOURCE_BYTES) throw new Error("provenance source exceeds the 8 MiB limit");
    const sourceBytes = await readFile(sourcePath);
    if (sourceBytes.byteLength > MAX_PROVENANCE_SOURCE_BYTES) throw new Error("provenance source exceeds the 8 MiB limit");
    const member = createProviderProvenanceRecordMember({ path: "provenance.json", provider, subjectId, expectedDigest, sourceBytes, required: true });
    const parent = await lstat(dirname(outputPath));
    if (!parent.isDirectory()) throw new Error("provenance output parent must be a regular directory");
    await writeFile(outputPath, member.bytes, { flag: "wx", mode: 0o600 });
    const document = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(member.bytes)) as Record<string, unknown>;
    const match = document.match as Record<string, unknown>;
    const signature = document.signature as Record<string, unknown>;
    const result = {
      imported: true,
      recordMember: "provenance",
      sourceDigest: `sha256:${createHash("sha256").update(sourceBytes).digest("hex")}`,
      provider,
      subjectId,
      providerIdentityStatus: "caller-declared",
      match: match.state,
      subjectDigest: match.subjectDigest,
      expectedDigest: match.expectedDigest,
      signatureStatus: signature.status,
      envelopeSignatures: signature.envelopeSignatureCount,
      memberBytes: member.bytes.byteLength,
    };
    if (json) console.log(JSON.stringify(result));
    else if (!quiet) console.log(`Imported provenance member (${provider}, ${String(match.state)}; signature unverified). The member includes the original source envelope; keep the record private.`);
    return 0;
  } catch (error) {
    if (json) console.log(JSON.stringify({ status: "error", code: "RECORD_PROVENANCE_IMPORT", message: "provenance import failed" }));
    else if (!quiet) console.error(error instanceof Error ? error.message : "provenance import failed");
    return 78;
  }
}
