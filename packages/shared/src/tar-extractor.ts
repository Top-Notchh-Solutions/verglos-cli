import { mkdir, mkdtemp, rename, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { gunzipSync } from "node:zlib";
import { validateArchiveMembers, type ArchiveMember } from "./archive-safety.js";

export async function extractTarArchive(bytes: Uint8Array, destination: string): Promise<void> {
  const members: Array<ArchiveMember & { data: Uint8Array }> = []; let offset = 0;
  while (offset + 512 <= bytes.byteLength) {
    const header = bytes.slice(offset, offset + 512); offset += 512;
    if (header.every((value) => value === 0)) break;
    const name = new TextDecoder().decode(header.slice(0, 100)).replace(/\0.*$/, ""); const sizeText = new TextDecoder().decode(header.slice(124, 136)).replace(/\0.*$/, "").trim(); const size = Number.parseInt(sizeText || "0", 8); const type = header[156] === 53 ? "directory" : header[156] === 50 ? "symlink" : header[156] === 49 ? "hardlink" : "file";
    if (!name || !Number.isSafeInteger(size) || size < 0 || offset + size > bytes.byteLength) throw new Error("Invalid tar member.");
    const data = bytes.slice(offset, offset + size); offset += Math.ceil(size / 512) * 512;
    if (type === "symlink" || type === "hardlink") throw new Error("Tar links are not supported by the atomic extractor.");
    members.push({ path: name, kind: type, size, data });
  }
  validateArchiveMembers(members);
  const parent = await mkdtemp(`${destination}.staging-`);
  try { for (const member of members) { const path = join(parent, member.path); if (member.kind === "directory") await mkdir(path, { recursive: true }); else { await mkdir(join(path, ".."), { recursive: true }); await writeFile(path, member.data); } } await rename(parent, destination); }
  catch (error) { await rm(parent, { recursive: true, force: true }); throw error; }
}

export async function extractTarGzipArchive(bytes: Uint8Array, destination: string, maxDecompressedBytes = 1_073_741_824): Promise<void> {
  let decompressed: Buffer;
  try { decompressed = gunzipSync(bytes, { maxOutputLength: maxDecompressedBytes }); }
  catch { throw new Error("Gzip archive could not be safely decompressed within the configured limit."); }
  await extractTarArchive(decompressed, destination);
}
