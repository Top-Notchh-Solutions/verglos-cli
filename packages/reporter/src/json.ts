import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { ScanResult } from "@verglos/shared";

export function serializeJsonReport(result: ScanResult): ScanResult & {
  schemaVersion: "2.0.0";
} {
  return {
    schemaVersion: "2.0.0",
    ...result,
    findings: result.findings.map((finding) => ({
      ...finding,
      verified: finding.verified ?? null,
    })),
  };
}

export async function writeJsonReport(
  result: ScanResult,
  projectRoot: string,
): Promise<string> {
  const path = join(projectRoot, "verglos-report.json");
  await writeFile(path, JSON.stringify(serializeJsonReport(result), null, 2), "utf8");
  return path;
}
