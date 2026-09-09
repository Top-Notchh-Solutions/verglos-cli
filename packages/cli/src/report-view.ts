import { readFile } from "node:fs/promises";
import { renderLocalViewer } from "./viewer-renderer.js";

export async function prepareReportView(path: string): Promise<string> {
  const lower = path.toLowerCase();
  if (lower.endsWith(".html") || lower.endsWith(".vgl")) throw new Error("report view accepts only validated JSON projections");
  const bytes = await readFile(path);
  if (bytes.byteLength > 8 * 1024 * 1024) throw new Error("report view input exceeds the 8 MiB limit");
  let value: any;
  try { value = JSON.parse(bytes.toString("utf8")); } catch { throw new Error("report view input is not valid JSON"); }
  if (!value || typeof value !== "object" || !["PASS", "REVIEW", "BLOCK", "INCOMPLETE"].includes(value.decision) || typeof value.subjectId !== "string" || !value.policy || typeof value.policy.id !== "string" || typeof value.policy.version !== "string" || typeof value.policy.digest !== "string" || typeof value.generatedAt !== "string" || !Array.isArray(value.limitations) || typeof value.nextAction !== "string" || !["unknown", "unsigned", "verified", "unverified"].includes(value.signerStatus)) throw new Error("report view JSON is not a supported release header projection");
  return renderLocalViewer(value);
}
