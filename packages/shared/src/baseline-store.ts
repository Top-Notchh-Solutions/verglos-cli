import { mkdir, readFile, rename, writeFile, stat, rm, lstat } from "node:fs/promises";
import { join } from "node:path";
import { baselineDigest, parseBaseline, type BaselineDocument } from "./baseline.js";

function fileName(baseline: BaselineDocument): string {
  return `${baselineDigest(baseline).replace(":", "-")}.json`;
}

export async function saveBaseline(root: string, baseline: BaselineDocument): Promise<string> {
  const parsed = parseBaseline(baseline);
  await mkdir(root, { recursive: true, mode: 0o700 });
  const destination = join(root, fileName(parsed));
  try { await readFile(destination); return destination; } catch { /* publish below */ }
  const temporary = `${destination}.${process.pid}.${Date.now()}.tmp`;
  try {
    await writeFile(temporary, `${JSON.stringify(parsed)}\n`, { encoding: "utf8", mode: 0o600 });
    await rename(temporary, destination);
  } catch (error) {
    await rm(temporary, { force: true });
    throw error;
  }
  return destination;
}

export async function loadBaseline(path: string): Promise<BaselineDocument> {
  const entry = await lstat(path);
  if (!entry.isFile()) throw new Error("Baseline path must be a regular file.");
  const info = await stat(path);
  if (info.size > 4 * 1024 * 1024) throw new Error("Baseline exceeds the 4 MiB size limit.");
  return parseBaseline(JSON.parse(await readFile(path, "utf8")));
}
