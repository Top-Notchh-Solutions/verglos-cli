import { readFile } from "node:fs/promises";
import { installEngineArtifact } from "@verglos/shared";
import { homedir } from "node:os";
import { join } from "node:path";

export async function executeEngineInstall(engineId: string, version: string, artifactPath: string, digest: string): Promise<number> {
  try {
    const bytes = await readFile(artifactPath);
    const cacheRoot = process.env.VERGLOS_ENGINE_CACHE ?? join(homedir(), ".cache", "verglos", "engines");
    const installed = await installEngineArtifact(cacheRoot, engineId, version, bytes, digest);
    console.log(`Installed ${engineId}@${version} at ${installed}`);
    return 0;
  } catch (error) { console.error(error instanceof Error ? error.message : "Engine installation failed."); return 78; }
}
