import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { baselineDigest, parseBaseline, type BaselineDocument } from "./baseline.js";

function fileName(baseline: BaselineDocument): string {
  return `${baselineDigest(baseline).replace(":", "-")}.json`;
}

export async function saveBaseline(root: string, baseline: BaselineDocument): Promise<string> {
  const parsed = parseBaseline(baseline);
  await mkdir(root, { recursive: true, mode: 0o700 });
  const destination = join(root, fileName(parsed));
  const temporary = `${destination}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(temporary, `${JSON.stringify(parsed)}\n`, { encoding: "utf8", mode: 0o600 });
  await rename(temporary, destination);
  return destination;
}

export async function loadBaseline(path: string): Promise<BaselineDocument> {
  return parseBaseline(JSON.parse(await readFile(path, "utf8")));
}
