import { createHash } from "node:crypto";
import { lstat, mkdir, rename, writeFile, readFile } from "node:fs/promises";
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
export async function readRecordMember(root: string, memberDigest: string): Promise<Uint8Array> {
  if (!/^sha256:[a-f0-9]{64}$/.test(memberDigest)) throw new Error("record member digest is invalid");
  await assertStoreRoot(root);
  const path = join(root, memberDigest.replace(":", "-"));
  const entry = await lstat(path);
  if (!entry.isFile() || entry.size > 50_000_000) throw new Error("record member is not a bounded regular file");
  const bytes = await readFile(path);
  if (digest(bytes) !== memberDigest) throw new Error("record member digest mismatch");
  return bytes;
}
export function describeRecordMember(input: { readonly path: string; readonly kind: ReleaseRecordManifestDocument["members"][number]["kind"]; readonly mediaType: string; readonly bytes: Uint8Array; readonly required: boolean; readonly redaction?: "none" | "applied" | "omitted" }): ReleaseRecordManifestDocument["members"][number] { assertSafePath(input.path); return { path: input.path, kind: input.kind, mediaType: input.mediaType, digest: { algorithm: "sha256", value: digest(input.bytes).slice(7) }, size: input.redaction === "omitted" ? 0 : input.bytes.byteLength, required: input.required, redaction: input.redaction ?? "none" }; }
