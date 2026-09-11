import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { lstat, mkdir, rename, writeFile, readFile, open, unlink } from "node:fs/promises";
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
  const temporary = `${destination}.${process.pid}.${Date.now()}.tmp`; await writeFile(temporary, bytes, { mode: 0o600 }); await rename(temporary, destination);
  return { digest: value, path, size: bytes.byteLength };
}

/** Stream a regular file into the content-addressed store without buffering its payload. */
export async function putRecordMemberFromFile(root: string, path: string, sourcePath: string): Promise<{ readonly digest: string; readonly path: string; readonly size: number }> {
  assertSafePath(path);
  const source = await lstat(sourcePath);
  if (!source.isFile()) throw new Error("record member source must be a regular file");
  if (source.size > 50_000_000) throw new Error("record member exceeds 50 MB");
  await assertStoreRoot(root, true);
  const temporary = join(root, `.member.${process.pid}.${Date.now()}.tmp`);
  const handle = await open(temporary, "wx", 0o600);
  const hash = createHash("sha256");
  let size = 0;
  try {
    for await (const chunk of createReadStream(sourcePath)) {
      const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      size += bytes.byteLength;
      if (size > 50_000_000) throw new Error("record member exceeds 50 MB");
      hash.update(bytes);
      await handle.write(bytes);
    }
    await handle.close();
    const digest = `sha256:${hash.digest("hex")}`;
    await rename(temporary, join(root, digest.replace(":", "-")));
    return { digest, path, size };
  } catch (error) {
    await handle.close().catch(() => undefined);
    await unlink(temporary).catch(() => undefined);
    throw error;
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
  const results = [];
  for (const member of [...members].sort((left, right) => left.path.localeCompare(right.path))) results.push(await putRecordMember(root, member.path, member.bytes));
  return Object.freeze(results);
}
export async function readRecordMember(root: string, memberDigest: string): Promise<Uint8Array> {
  if (!/^sha256:[a-f0-9]{64}$/.test(memberDigest)) throw new Error("record member digest is invalid");
  await assertStoreRoot(root);
  const path = join(root, memberDigest.replace(":", "-"));
  const entry = await lstat(path);
  if (!entry.isFile() || entry.size > 50_000_000) throw new Error("record member is not a bounded regular file");
  const bytes = await readFile(path);
  if (bytes.byteLength > 50_000_000) throw new Error("record member is not a bounded regular file");
  if (digest(bytes) !== memberDigest) throw new Error("record member digest mismatch");
  return bytes;
}
export function describeRecordMember(input: { readonly path: string; readonly kind: ReleaseRecordManifestDocument["members"][number]["kind"]; readonly mediaType: string; readonly bytes: Uint8Array; readonly required: boolean; readonly redaction?: "none" | "applied" | "omitted" }): ReleaseRecordManifestDocument["members"][number] { assertSafePath(input.path); return { path: input.path, kind: input.kind, mediaType: input.mediaType, digest: { algorithm: "sha256", value: digest(input.bytes).slice(7) }, size: input.redaction === "omitted" ? 0 : input.bytes.byteLength, required: input.required, redaction: input.redaction ?? "none" }; }
