import { createHash } from "node:crypto";
import { lstat, readdir, readFile } from "node:fs/promises";
import { extname, relative, resolve } from "node:path";
import { createSubject, type ArtifactSubject } from "./subject.js";
import { assertNoExecutionContext, type TargetResolution, type TargetResolver, type TargetResolverContext, type TargetSpec } from "./target-resolver.js";

const MAX_ARTIFACT_BYTES = 256 * 1024 * 1024;
const MEDIA_TYPES: Record<string, string> = { ".json": "application/json", ".xml": "application/xml", ".html": "text/html", ".txt": "text/plain", ".js": "text/javascript", ".ts": "text/typescript", ".tar": "application/x-tar", ".gz": "application/gzip", ".zip": "application/zip" };

export class ArtifactResolutionError extends Error {
  override readonly name = "ArtifactResolutionError";
  constructor(readonly code: "INVALID_TARGET" | "MISSING_PATH" | "SPECIAL_FILE" | "TOO_LARGE", message: string) { super(message); }
}

export async function resolveArtifactTarget(target: TargetSpec, context: TargetResolverContext): Promise<TargetResolution> {
  assertNoExecutionContext(context);
  if (target.kind !== "artifact") throw new ArtifactResolutionError("INVALID_TARGET", "Artifact resolver requires an artifact target.");
  const root = resolve(context.cwd, target.value);
  let stat;
  try { stat = await lstat(root); } catch { throw new ArtifactResolutionError("MISSING_PATH", "Artifact target does not exist."); }
  if (!stat.isFile() && !stat.isDirectory()) throw new ArtifactResolutionError("SPECIAL_FILE", "Special filesystem objects cannot be artifact subjects.");
  const hash = createHash("sha256"); let size = 0;
  async function consume(path: string): Promise<void> {
    const info = await lstat(path);
    if (info.isDirectory()) {
      hash.update(`dir:${relative(root, path)}\0`, "utf8");
      for (const entry of (await readdir(path, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) await consume(resolve(path, entry.name));
    } else if (info.isFile()) {
      const bytes = await readFile(path); size += bytes.byteLength;
      if (size > MAX_ARTIFACT_BYTES) throw new ArtifactResolutionError("TOO_LARGE", `Artifact exceeds the ${MAX_ARTIFACT_BYTES}-byte limit.`);
      hash.update(`file:${relative(root, path)}:${bytes.byteLength}\0`, "utf8").update(bytes);
    } else throw new ArtifactResolutionError("SPECIAL_FILE", "Special filesystem objects cannot be artifact subjects.");
  }
  await consume(root);
  const relativePath = relative(context.cwd, root).split("\\").join("/") || undefined;
  const mediaType = stat.isDirectory() ? "application/x-directory" : (MEDIA_TYPES[extname(root).toLowerCase()] ?? "application/octet-stream");
  const subject = createSubject({ kind: "artifact", digest: { algorithm: "sha256", value: hash.digest("hex") }, size, mediaType, ...(relativePath ? { path: relativePath } : {}) });
  return { target, subject, coverage: "complete", limitations: [] };
}

export const artifactResolver: TargetResolver = { id: "verglos.generic-artifact", capabilities: ["resolve-artifact"], resolve: resolveArtifactTarget };
export type ResolvedArtifactSubject = ArtifactSubject;
