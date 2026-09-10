import { createHash } from "node:crypto";
import { lstat, mkdir, readFile, rename, rm, writeFile, readdir } from "node:fs/promises";
import { join } from "node:path";

export class EngineCacheError extends Error {
  override readonly name = "EngineCacheError";
  constructor(readonly code: "DIGEST_MISMATCH" | "LOCKED" | "INSTALL_FAILED" | "INVALID_PATH", message: string) { super(message); }
}

function assertSafeSegment(value: string, label: string): void {
  if (!/^[A-Za-z0-9._@+-]{1,128}$/.test(value) || value === "." || value === "..") {
    throw new EngineCacheError("INVALID_PATH", label + " contains an unsafe path segment.");
  }
}

export async function installEngineArtifact(cacheRoot: string, engineId: string, version: string, bytes: Uint8Array, expectedDigest: string): Promise<string> {
  assertSafeSegment(engineId, "engine id");
  assertSafeSegment(version, "engine version");
  if (!/^sha256:[a-f0-9]{64}$/.test(expectedDigest)) throw new EngineCacheError("DIGEST_MISMATCH", "Engine artifact digest must be sha256.");
  const actual = `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
  if (actual !== expectedDigest) throw new EngineCacheError("DIGEST_MISMATCH", "Engine artifact bytes do not match the manifest digest.");
  const destination = join(cacheRoot, engineId, version, "engine.bin"); const lock = `${destination}.lock`; const staging = `${destination}.staging-${process.pid}`;
  try { await mkdir(join(cacheRoot, engineId, version), { recursive: true }); await mkdir(lock); } catch { throw new EngineCacheError("LOCKED", "Engine cache entry is locked by another installer."); }
  try { await writeFile(staging, bytes, { mode: 0o700 }); await rename(staging, destination); return destination; }
  catch { await rm(staging, { force: true }); throw new EngineCacheError("INSTALL_FAILED", "Engine cache installation failed before activation."); }
  finally { await rm(lock, { recursive: true, force: true }); }
}

const MAX_CACHED_ENGINE_BYTES = 256 * 1024 * 1024;

export async function readCachedEngine(cacheRoot: string, engineId: string, version: string): Promise<Buffer> {
  assertSafeSegment(engineId, "engine id"); assertSafeSegment(version, "engine version");
  const path = join(cacheRoot, engineId, version, "engine.bin");
  const entry = await lstat(path);
  if (!entry.isFile()) throw new EngineCacheError("INSTALL_FAILED", "Cached engine must be a regular file.");
  if (entry.size > MAX_CACHED_ENGINE_BYTES) throw new EngineCacheError("INSTALL_FAILED", "Cached engine exceeds the 256 MiB limit.");
  return readFile(path);
}

export async function listCachedEngines(cacheRoot: string): Promise<readonly { readonly engineId: string; readonly version: string; readonly digest: string }[]> {
  const result: { engineId: string; version: string; digest: string }[] = [];
  for (const engineId of (await readdir(cacheRoot, { withFileTypes: true }).catch(() => [])).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort()) {
    for (const version of (await readdir(join(cacheRoot, engineId), { withFileTypes: true }).catch(() => [])).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort()) {
      try { const bytes = await readCachedEngine(cacheRoot, engineId, version); result.push({ engineId, version, digest: `sha256:${createHash("sha256").update(bytes).digest("hex")}` }); } catch { /* incomplete cache entry is omitted from trusted status */ }
    }
  }
  return Object.freeze(result);
}
