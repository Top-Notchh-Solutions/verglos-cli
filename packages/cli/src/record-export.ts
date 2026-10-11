import { open, lstat, readFile, unlink } from "node:fs/promises";
import { resolve } from "node:path";
import { canonicalizeJson, createReleaseStatement, assertCompleteReleaseRecord, assertCompleteReleaseRecordPayloads, parseReleaseDecisionJson, parseReleaseRecordManifestJson, readAndVerifyRecord } from "@verglos/shared";

const MAX_MANIFEST_BYTES = 8 * 1024 * 1024;
const MAX_STATEMENT_BYTES = 1024 * 1024;

async function readManifest(path: string): Promise<Buffer> {
  const entry = await lstat(path);
  if (!entry.isFile()) throw new Error("record manifest must be a regular file");
  if (entry.size > MAX_MANIFEST_BYTES) throw new Error("record manifest exceeds the 8 MiB limit");
  const bytes = await readFile(path);
  if (bytes.byteLength > MAX_MANIFEST_BYTES) throw new Error("record manifest exceeds the 8 MiB limit");
  return bytes;
}

/** Export an in-toto statement derived only from a complete, locally verified record. */
export async function executeRecordExport(
  storeRoot: string,
  manifestPath: string,
  outputPath: string,
  json = false,
  quiet = false,
): Promise<number> {
  let createdOutput = false;
  let handle: Awaited<ReturnType<typeof open>> | undefined;
  const destination = resolve(outputPath);
  try {
    const manifest = assertCompleteReleaseRecord(parseReleaseRecordManifestJson(await readManifest(manifestPath)));
    const members = await readAndVerifyRecord(storeRoot, manifest);
    assertCompleteReleaseRecordPayloads(manifest, members);
    const decisionMember = manifest.members.find((member) => member.kind === "release-decision");
    if (!decisionMember) throw new Error("complete record is missing its release-decision member");
    const decisionBytes = members.get(decisionMember.path);
    if (!decisionBytes) throw new Error("complete record release decision is missing");
    const decision = parseReleaseDecisionJson(decisionBytes);
    const statement = createReleaseStatement(manifest, decision.subjects.map(({ subjectId }) => subjectId));
    const output = `${canonicalizeJson(statement)}\n`;
    if (Buffer.byteLength(output, "utf8") > MAX_STATEMENT_BYTES) throw new Error("in-toto statement exceeds the 1 MiB limit");

    // Exclusive creation prevents overwriting an existing file or following a symlink.
    handle = await open(destination, "wx", 0o600);
    createdOutput = true;
    await handle.writeFile(output, "utf8");
    await handle.sync();
    await handle.close();
    handle = undefined;

    const result = { exported: true, format: "in-toto-statement-v1", manifestDigest: statement.manifestDigest, subjects: statement.subject.length, bytes: Buffer.byteLength(output, "utf8") };
    if (json) console.log(JSON.stringify(result));
    else if (!quiet) console.log(`Exported verified in-toto statement ${result.manifestDigest} (${result.subjects} subjects).`);
    return 0;
  } catch (error) {
    if (handle) await handle.close().catch(() => undefined);
    if (createdOutput) await unlink(destination).catch(() => undefined);
    if (json) console.log(JSON.stringify({ status: "error", code: "RECORD_EXPORT_INPUT", message: "record export failed" }));
    else if (!quiet) console.error(`[RECORD_EXPORT_INPUT] ${error instanceof Error ? error.message : "record export failed"}`);
    return 78;
  }
}
