import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { lstat, mkdir, readFile, writeFile } from "node:fs/promises";
import { isAbsolute, join, resolve } from "node:path";
import {
  canonicalizeJson,
  parseReleaseRecordManifestJson,
  assertCompleteReleaseRecord,
  putRecordMemberFromFile,
  type ReleaseRecordManifestDocument,
} from "@verglos/shared";

const MAX_MANIFEST_BYTES = 8 * 1024 * 1024;
const MAX_MEMBER_BYTES = 50 * 1024 * 1024;

async function readRegular(path: string, maxBytes: number, label: string): Promise<Uint8Array> {
  const entry = await lstat(path);
  if (!entry.isFile()) throw new Error(`${label} must be a regular file`);
  if (entry.size > maxBytes) throw new Error(`${label} exceeds its size limit`);
  const bytes = await readFile(path);
  if (bytes.byteLength > maxBytes) throw new Error(`${label} exceeds its size limit`);
  return bytes;
}

async function digestRegular(path: string, maxBytes: number, label: string): Promise<{ readonly size: number; readonly digest: string }> {
  const entry = await lstat(path);
  if (!entry.isFile()) throw new Error(`${label} must be a regular file`);
  if (entry.size > maxBytes) throw new Error(`${label} exceeds its size limit`);
  const hash = createHash("sha256");
  let size = 0;
  for await (const chunk of createReadStream(path)) {
    const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += bytes.byteLength;
    if (size > maxBytes) throw new Error(`${label} exceeds its size limit`);
    hash.update(bytes);
  }
  return { size, digest: `sha256:${hash.digest("hex")}` };
}

/** Materialize a validated manifest and its payload members into a local store. */
export async function executeRecordCreate(
  membersRoot: string,
  manifestPath: string,
  outputRoot: string,
  json = false,
  quiet = false,
  complete = false,
): Promise<number> {
  try {
    const manifestBytes = await readRegular(manifestPath, MAX_MANIFEST_BYTES, "record manifest");
    const parsedManifest = parseReleaseRecordManifestJson(manifestBytes);
    const manifest = complete ? assertCompleteReleaseRecord(parsedManifest) : parsedManifest;
    const sourceRoot = resolve(membersRoot);
    const destination = resolve(outputRoot);
    try {
      const existing = await lstat(destination);
      if (!existing.isDirectory()) throw new Error("record output root must be a regular directory");
    } catch (error) {
      if (!(error instanceof Error) || (error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
    await mkdir(destination, { recursive: true, mode: 0o700 });
    const writtenManifest = join(destination, "manifest.json");
    try {
      await lstat(writtenManifest);
      throw new Error("record output already contains manifest.json");
    } catch (error) {
      if (!(error instanceof Error) || (error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
    const inputs: { readonly path: string; readonly sourcePath: string; readonly size: number; readonly digest: string }[] = [];
    const digests = new Set<string>();
    for (const member of manifest.members) {
      if (member.redaction === "omitted") continue;
      const memberPath = isAbsolute(member.path) ? member.path : join(sourceRoot, member.path);
      const inspected = await digestRegular(memberPath, MAX_MEMBER_BYTES, `record member ${member.path}`);
      const expected = `${member.digest.algorithm}:${member.digest.value}`;
      if (inspected.digest !== expected || inspected.size !== member.size) throw new Error(`record member ${member.path} does not match manifest digest or size`);
      if (digests.has(inspected.digest)) throw new Error(`record member digest is duplicated: ${member.path}`);
      digests.add(inspected.digest);
      inputs.push({ path: member.path, sourcePath: memberPath, size: inspected.size, digest: inspected.digest });
    }
    const stored = [];
    for (const input of [...inputs].sort((left, right) => left.path.localeCompare(right.path))) {
      const published = await putRecordMemberFromFile(destination, input.path, input.sourcePath);
      if (published.digest !== input.digest || published.size !== input.size) throw new Error(`record member ${input.path} changed during publication`);
      stored.push(published);
    }
    await writeFile(writtenManifest, `${canonicalizeJson(manifest)}\n`, { flag: "wx", mode: 0o600 });
    const result = { outputRoot: destination, manifestPath: writtenManifest, members: stored.length, paths: stored.map((member) => member.path).sort() };
    if (json) console.log(JSON.stringify(result));
    else if (!quiet) console.log(`Created record store ${destination} (${result.members} members).`);
    return 0;
  } catch (error) {
    if (!quiet) console.error(error instanceof Error ? error.message : "record create failed");
    return 78;
  }
}
