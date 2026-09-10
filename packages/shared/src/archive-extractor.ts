import { mkdir, rm, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { dirname, resolve } from "node:path";
import { validateArchiveMembers, ArchiveSafetyError, type ArchiveMember } from "./archive-safety.js";

export interface ArchivePayload extends ArchiveMember { readonly data?: Uint8Array; }

export class ArchiveExtractionError extends Error {
  override readonly name = "ArchiveExtractionError";
  constructor(readonly code: "UNSUPPORTED_LINK" | "MISSING_DATA" | "WRITE_FAILED", message: string) { super(message); }
}

/** Extracts an already-decoded archive into a fresh directory with bounded, fail-closed writes. */
export async function extractArchiveMembers(root: string, members: readonly ArchivePayload[], limits?: { maxMembers?: number; maxBytes?: number }): Promise<void> {
  validateArchiveMembers(members, limits);
  const destination = resolve(root);
  await rm(destination, { recursive: true, force: true });
  await mkdir(destination, { recursive: true });
  try {
    for (const member of members) {
      const target = resolve(destination, member.path);
      if (target !== destination && !target.startsWith(`${destination}/`)) throw new ArchiveSafetyError("TRAVERSAL", "Archive member path escapes the extraction root.");
      if (member.kind === "directory") { await mkdir(target, { recursive: true }); continue; }
      if (member.kind === "symlink" || member.kind === "hardlink") throw new ArchiveExtractionError("UNSUPPORTED_LINK", "Archive links are not materialized during safe extraction.");
      if (!member.data) throw new ArchiveExtractionError("MISSING_DATA", `Archive member ${member.path} has no payload.`);
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, member.data, { flag: "wx" });
    }
  } catch (error) {
    await rm(destination, { recursive: true, force: true });
    if (error instanceof ArchiveSafetyError || error instanceof ArchiveExtractionError) throw error;
    throw new ArchiveExtractionError("WRITE_FAILED", error instanceof Error ? error.message : "Archive extraction failed.");
  }
}

export async function downloadArchive(url: string, options: { fetchImpl?: typeof fetch; maxBytes?: number; signal?: AbortSignal } = {}): Promise<Uint8Array> {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" || parsed.username || parsed.password || parsed.hash) {
      throw new Error("Archive URL must be an HTTPS URL without credentials or fragments.");
    }
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Archive URL")) throw error;
    throw new Error("Archive URL must be a valid HTTPS URL.");
  }
  const maxBytes = options.maxBytes ?? 256 * 1024 * 1024;
  if (!Number.isSafeInteger(maxBytes) || maxBytes <= 0) throw new Error("Archive download size limit must be a positive safe integer.");
  const response = await (options.fetchImpl ?? fetch)(url, { signal: options.signal });
  if (!response.ok) throw new Error(`Archive download failed with HTTP ${response.status}.`);
  const declared = Number(response.headers.get("content-length") ?? 0);
  if (declared > maxBytes) throw new Error("Archive exceeds the download size limit.");
  if (!response.body) {
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (bytes.byteLength > maxBytes) throw new Error("Archive exceeds the download size limit.");
    return bytes;
  }
  const reader = response.body.getReader(); const chunks: Uint8Array[] = []; let total = 0;
  try {
    for (;;) { const next = await reader.read(); if (next.done) break; total += next.value.byteLength; if (total > maxBytes) throw new Error("Archive exceeds the download size limit."); chunks.push(next.value); }
  } finally {
    await reader.cancel().catch(() => undefined);
    reader.releaseLock();
  }
  const output = new Uint8Array(total); let offset = 0; for (const chunk of chunks) { output.set(chunk, offset); offset += chunk.byteLength; }
  return output;
}

export function verifyArchiveDigest(bytes: Uint8Array, expectedSha256: string): void {
  if (!/^[a-f0-9]{64}$/.test(expectedSha256)) throw new Error("Expected archive digest must be a lowercase SHA-256 value.");
  const actual = createHash("sha256").update(bytes).digest("hex");
  if (actual !== expectedSha256) throw new Error("Archive checksum does not match the pinned digest.");
}
