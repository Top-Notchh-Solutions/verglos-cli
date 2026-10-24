import { constants } from "node:fs";
import { createHash, randomUUID } from "node:crypto";
import { lstat, mkdir, rename, writeFile, open, unlink } from "node:fs/promises";
import { join } from "node:path";
import type { ReleaseRecordManifestDocument } from "./record-manifest.js";

function digest(bytes: Uint8Array): string { return `sha256:${createHash("sha256").update(bytes).digest("hex")}`; }
function assertSafePath(path: string): void { if (!path || path.startsWith("/") || path.includes("\\") || path.split("/").some((segment) => !segment || segment === "." || segment === "..")) throw new Error("record member path must be relative and traversal-free"); }
async function assertStoreRoot(root: string, create = false): Promise<void> {
  if (create) await mkdir(root, { recursive: true, mode: 0o700 });
  const entry = await lstat(root);
  if (!entry.isDirectory()) throw new Error("record store root must be a regular directory");
}
export async function putRecordMember(root: string, path: string, bytes: Uint8Array): Promise<{ readonly digest: string; readonly path: string; readonly size: number }> {
  assertSafePath(path); if (bytes.byteLength > 50_000_000) throw new Error("record member exceeds 50 MB");
  const value = digest(bytes); const destination = join(root, value.replace(":", "-")); await assertStoreRoot(root, true);
  const temporary = `${destination}.${process.pid}.${randomUUID()}.tmp`; await writeFile(temporary, bytes, { mode: 0o600, flag: "wx" });
  try { await rename(temporary, destination); } catch (error) { await unlink(temporary).catch(() => undefined); throw error; }
  return { digest: value, path, size: bytes.byteLength };
}

/** Stream a regular file into the content-addressed store without buffering its payload. */
export async function putRecordMemberFromFile(root: string, path: string, sourcePath: string): Promise<{ readonly digest: string; readonly path: string; readonly size: number }> {
  assertSafePath(path);
  const source = await lstat(sourcePath);
  if (!source.isFile()) throw new Error("record member source must be a regular file");
  if (source.size > 50_000_000) throw new Error("record member exceeds 50 MB");
  await assertStoreRoot(root, true);
  const temporary = join(root, `.member.${process.pid}.${randomUUID()}.tmp`);
  const handle = await open(temporary, "wx", 0o600);
  let sourceHandle: Awaited<ReturnType<typeof open>> | undefined;
  const hash = createHash("sha256");
  let size = 0;
  try {
    try {
      sourceHandle = await open(sourcePath, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
    } catch {
      throw new Error("record member source must be a regular file");
    }
    const openedSource = await sourceHandle.stat();
    if (!openedSource.isFile() || openedSource.size > 50_000_000 || !sameFile(source, openedSource)) {
      throw new Error("record member source must be a regular file");
    }
    const chunk = Buffer.allocUnsafe(64 * 1024);
    while (true) {
      const { bytesRead } = await sourceHandle.read(chunk, 0, chunk.byteLength, null);
      if (bytesRead === 0) break;
      const bytes = chunk.subarray(0, bytesRead);
      size += bytesRead;
      if (size > 50_000_000) throw new Error("record member exceeds 50 MB");
      hash.update(bytes);
      await handle.write(bytes);
    }
    const finalSource = await sourceHandle.stat();
    if (!finalSource.isFile() || finalSource.size !== openedSource.size || size !== finalSource.size || !sameFile(openedSource, finalSource)) {
      throw new Error("record member source changed during read");
    }
    await handle.close();
    const digest = `sha256:${hash.digest("hex")}`;
    await rename(temporary, join(root, digest.replace(":", "-")));
    return { digest, path, size };
  } catch (error) {
    await handle.close().catch(() => undefined);
    await unlink(temporary).catch(() => undefined);
    throw error;
  } finally {
    await sourceHandle?.close().catch(() => undefined);
  }
}

/** Publish a complete bounded member set, rejecting duplicate logical paths before any write. */
export async function putRecordMembers(root: string, members: readonly { readonly path: string; readonly bytes: Uint8Array }[], maxMembers = 4096): Promise<readonly { readonly digest: string; readonly path: string; readonly size: number }[]> {
  if (!Number.isInteger(maxMembers) || maxMembers < 1 || maxMembers > 4096) throw new Error("record member count limit is invalid");
  if (members.length > maxMembers) throw new Error("record member count exceeds limit");
  const paths = new Set<string>();
  for (const member of members) {
    assertSafePath(member.path);
    if (paths.has(member.path)) throw new Error(`record member path is duplicated: ${member.path}`);
    paths.add(member.path);
  }
  const digests = new Set<string>();
  for (const member of members) {
    const memberDigest = digest(member.bytes);
    if (digests.has(memberDigest)) throw new Error(`record member digest is duplicated: ${member.path}`);
    digests.add(memberDigest);
  }
  const results = [];
  for (const member of [...members].sort((left, right) => left.path.localeCompare(right.path))) results.push(await putRecordMember(root, member.path, member.bytes));
  return Object.freeze(results);
}
export async function readRecordMember(root: string, memberDigest: string): Promise<Uint8Array> {
  if (!/^sha256:[a-f0-9]{64}$/.test(memberDigest)) throw new Error("record member digest is invalid");
  await assertStoreRoot(root);
  const path = join(root, memberDigest.replace(":", "-"));
  const bytes = await readBoundedStoredMember(path);
  if (digest(bytes) !== memberDigest) throw new Error("record member digest mismatch");
  return bytes;
}

/** Read one member through an opened handle so pathname swaps cannot redirect the read. */
async function readBoundedStoredMember(path: string): Promise<Uint8Array> {
  const message = "record member is not a bounded regular file";
  let handle: Awaited<ReturnType<typeof open>> | undefined;
  try {
    const expected = await lstat(path);
    if (!expected.isFile() || expected.size > 50_000_000) throw new Error(message);
    handle = await open(path, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
    const opened = await handle.stat();
    if (!opened.isFile() || opened.size > 50_000_000 || !sameFile(expected, opened)) throw new Error(message);
    const bytes = await handle.readFile();
    const final = await handle.stat();
    if (!final.isFile() || final.size > 50_000_000 || final.size !== opened.size || !sameFile(opened, final) || bytes.byteLength !== final.size) throw new Error(message);
    return bytes;
  } catch (error) {
    if (error instanceof Error && error.message === message) throw error;
    throw new Error(message);
  } finally {
    await handle?.close().catch(() => undefined);
  }
}

function sameFile(left: { readonly dev: number; readonly ino: number }, right: { readonly dev: number; readonly ino: number }): boolean {
  return left.ino === 0 || right.ino === 0 || (left.dev === right.dev && left.ino === right.ino);
}

export function describeRecordMember(input: { readonly path: string; readonly kind: ReleaseRecordManifestDocument["members"][number]["kind"]; readonly mediaType: string; readonly bytes: Uint8Array; readonly required: boolean; readonly redaction?: "none" | "applied" | "omitted" }): ReleaseRecordManifestDocument["members"][number] { assertSafePath(input.path); return { path: input.path, kind: input.kind, mediaType: input.mediaType, digest: { algorithm: "sha256", value: digest(input.bytes).slice(7) }, size: input.redaction === "omitted" ? 0 : input.bytes.byteLength, required: input.required, redaction: input.redaction ?? "none" }; }
