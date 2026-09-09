import { createHash } from "node:crypto";
import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

export class EngineCacheError extends Error {
  override readonly name = "EngineCacheError";
  constructor(readonly code: "DIGEST_MISMATCH" | "LOCKED" | "INSTALL_FAILED", message: string) { super(message); }
}

export async function installEngineArtifact(cacheRoot: string, engineId: string, version: string, bytes: Uint8Array, expectedDigest: string): Promise<string> {
  if (!/^sha256:[a-f0-9]{64}$/.test(expectedDigest)) throw new EngineCacheError("DIGEST_MISMATCH", "Engine artifact digest must be sha256.");
  const actual = `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
  if (actual !== expectedDigest) throw new EngineCacheError("DIGEST_MISMATCH", "Engine artifact bytes do not match the manifest digest.");
  const destination = join(cacheRoot, engineId, version, "engine.bin"); const lock = `${destination}.lock`; const staging = `${destination}.staging-${process.pid}`;
  try { await mkdir(join(cacheRoot, engineId, version), { recursive: true }); await mkdir(lock); } catch { throw new EngineCacheError("LOCKED", "Engine cache entry is locked by another installer."); }
  try { await writeFile(staging, bytes, { mode: 0o700 }); await rename(staging, destination); return destination; }
  catch { await rm(staging, { force: true }); throw new EngineCacheError("INSTALL_FAILED", "Engine cache installation failed before activation."); }
  finally { await rm(lock, { recursive: true, force: true }); }
}

export async function readCachedEngine(cacheRoot: string, engineId: string, version: string): Promise<Buffer> { return readFile(join(cacheRoot, engineId, version, "engine.bin")); }
