import { mkdir, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { readBoundedFile } from "./read-bounded-json.mjs";

/**
 * Snapshot release archives from bounded opened regular-file handles before a
 * downstream installer or auditor receives any pathname. The staging root is
 * caller-owned temporary state, so later consumers cannot observe a source
 * archive being replaced during verification.
 */
export async function stageBoundedArchives(archivePaths, stageRoot, label = "release archive") {
  if (!Array.isArray(archivePaths) || archivePaths.length === 0) throw new Error("release archive paths are required");
  if (typeof stageRoot !== "string" || stageRoot.length === 0) throw new Error("release archive staging root is required");
  await mkdir(stageRoot, { recursive: true });
  return Promise.all(archivePaths.map(async (archivePath) => {
    const name = basename(archivePath);
    if (!name || name === "." || name === "..") throw new Error(`${label} name is invalid`);
    const bytes = await readBoundedFile(archivePath, `${label} ${name}`);
    const stagedPath = join(stageRoot, name);
    await writeFile(stagedPath, bytes, { flag: "wx", mode: 0o600 });
    return stagedPath;
  }));
}
