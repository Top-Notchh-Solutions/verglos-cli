import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { ScanResult } from "@verglos/shared";

export async function writeJsonReport(
  result: ScanResult,
  projectRoot: string,
): Promise<string> {
  const path = join(projectRoot, "verglos-report.json");
  await writeFile(path, JSON.stringify(result, null, 2), "utf8");
  return path;
}
