import { lstat, readFile } from "node:fs/promises";
import { installEngineArtifact } from "@verglos/shared";
import { homedir } from "node:os";
import { join } from "node:path";

const MAX_ENGINE_ARTIFACT_BYTES = 256 * 1024 * 1024;

export async function executeEngineInstall(engineId: string, version: string, artifactPath: string, digest: string, options: { approve?: boolean; json?: boolean; quiet?: boolean } = {}): Promise<number> {
  try {
    if (typeof engineId !== "string" || !engineId || typeof version !== "string" || !version || typeof artifactPath !== "string" || !artifactPath || typeof digest !== "string") {
      throw new Error("Engine install requires engine id, version, artifact path, and digest.");
    }
    if (!options.approve) throw new Error("Engine installation requires explicit approval (--approve).");
    const entry = await lstat(artifactPath);
    if (!entry.isFile()) throw new Error("Engine artifact must be a regular file.");
    if (entry.size > MAX_ENGINE_ARTIFACT_BYTES) throw new Error("Engine artifact exceeds the 256 MiB limit.");
    const bytes = await readFile(artifactPath);
    const cacheRoot = process.env.VERGLOS_ENGINE_CACHE ?? join(homedir(), ".cache", "verglos", "engines");
    const installed = await installEngineArtifact(cacheRoot, engineId, version, bytes, digest);
    if (!options.quiet) {
      if (options.json) console.log(JSON.stringify({ engineId, version, path: installed, digest }));
      else console.log(`Installed ${engineId}@${version} at ${installed}`);
    }
    return 0;
  } catch (error) { console.error(error instanceof Error ? error.message : "Engine installation failed."); return 78; }
}
