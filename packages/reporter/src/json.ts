import { lstat, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  LEGACY_SCAN_REPORT_SCHEMA,
  type ScanResult,
} from "@verglos/shared";

export function serializeJsonReport(result: ScanResult): ScanResult & {
  schemaVersion: "2.0.0";
} {
  return {
    schemaVersion: LEGACY_SCAN_REPORT_SCHEMA.version,
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
  outputDir = projectRoot,
): Promise<string> {
  try {
    const entry = await lstat(outputDir);
    if (!entry.isDirectory()) throw new Error("report output path must be a regular directory");
  } catch (error) {
    if (!(error instanceof Error && "code" in error && error.code === "ENOENT")) throw error;
    await mkdir(outputDir, { recursive: true, mode: 0o700 });
  }
  const path = join(outputDir, "verglos-report.json");
  await writeFile(path, JSON.stringify(serializeJsonReport(result), null, 2), "utf8");
  return path;
}
