import { lstat, readFile } from "node:fs/promises";
import { installEngineArtifact, parseEngineManifest, type EngineManifest } from "@verglos/shared";
import { homedir } from "node:os";
import { join } from "node:path";

const MAX_ENGINE_ARTIFACT_BYTES = 256 * 1024 * 1024;

const MAX_MANIFEST_BYTES = 1 * 1024 * 1024;

async function readCompatibilityManifest(path: string, engineId: string, version: string, digest: string): Promise<EngineManifest> {
  const entry = await lstat(path);
  if (!entry.isFile()) throw new Error("Engine compatibility manifest must be a regular file.");
  if (entry.size > MAX_MANIFEST_BYTES) throw new Error("Engine compatibility manifest exceeds the 1 MiB limit.");
  let manifest: EngineManifest;
  try { manifest = parseEngineManifest(JSON.parse(await readFile(path, "utf8"))); }
  catch { throw new Error("Engine compatibility manifest is invalid JSON or schema."); }
  if (manifest.engineId !== engineId || manifest.version !== version) throw new Error("Engine compatibility manifest does not match the requested engine and version.");
  if (!manifest.artifacts.some((artifact) => artifact.digest === digest)) throw new Error("Engine compatibility manifest does not contain the requested artifact digest.");
  return manifest;
}

export async function executeEngineInstall(engineId: string, version: string, artifactPath: string, digest: string, options: { action?: "install" | "update" | "rollback"; approve?: boolean; json?: boolean; quiet?: boolean; manifestPath?: string } = {}): Promise<number> {
  try {
    if (typeof engineId !== "string" || !engineId || typeof version !== "string" || !version || typeof artifactPath !== "string" || !artifactPath || typeof digest !== "string") {
      throw new Error("Engine install requires engine id, version, artifact path, and digest.");
    }
    if (!options.approve) throw new Error("Engine installation requires explicit approval (--approve).");
    const entry = await lstat(artifactPath);
    if (!entry.isFile()) throw new Error("Engine artifact must be a regular file.");
    if (entry.size > MAX_ENGINE_ARTIFACT_BYTES) throw new Error("Engine artifact exceeds the 256 MiB limit.");
    const bytes = await readFile(artifactPath);
    const manifest = options.manifestPath ? await readCompatibilityManifest(options.manifestPath, engineId, version, digest) : undefined;
    const cacheRoot = process.env.VERGLOS_ENGINE_CACHE ?? join(homedir(), ".cache", "verglos", "engines");
    const installed = await installEngineArtifact(cacheRoot, engineId, version, bytes, digest);
    const action = options.action ?? "install";
    if (!options.quiet) {
      if (options.json) console.log(JSON.stringify({ ...(action === "install" ? {} : { action }), engineId, version, path: installed, digest, compatibility: manifest ? { status: "declared", compatibleCli: manifest.compatibleCli, signature: "not-verified" } : { status: "not-evaluated", reason: "signed engine manifest was not provided" } }));
      else {
        const verb = action === "rollback" ? "Rolled back" : action === "update" ? "Updated" : "Installed";
        console.log(`${verb} ${engineId}@${version} at ${installed}`);
        console.log(manifest ? `Compatibility: declared for ${manifest.compatibleCli}; signature not verified` : "Compatibility: not evaluated (signed engine manifest not provided)");
      }
    }
    return 0;
  } catch (error) { if (!options.quiet) console.error(error instanceof Error ? error.message : "Engine installation failed."); return 78; }
}
