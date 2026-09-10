import type { ScanResult } from "@verglos/shared";
import { writeHtmlReport } from "./html.js";
import { writeJsonReport } from "./json.js";
import { printTerminalSummary } from "./terminal.js";

export async function writeReports(
  result: ScanResult,
  projectRoot: string,
  outputDir = projectRoot,
): Promise<{ json?: string; html?: string }> {
  const paths: { json?: string; html?: string } = {};
  paths.json = await writeJsonReport(result, projectRoot, outputDir);
  paths.html = await writeHtmlReport(result, projectRoot, outputDir);
  return paths;
}

export * from "./terminal.js";
export * from "./json.js";
export * from "./html.js";
