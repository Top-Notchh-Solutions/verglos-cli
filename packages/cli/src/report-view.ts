import { lstat, readFile } from "node:fs/promises";
import { renderLocalViewer } from "./viewer-renderer.js";

export async function prepareReportView(path: string): Promise<string> {
  const lower = path.toLowerCase();
  if (lower.endsWith(".html") || lower.endsWith(".vgl")) throw new Error("report view accepts only validated JSON projections");
  const entry = await lstat(path);
  if (!entry.isFile()) throw new Error("report view input must be a regular file");
  if (entry.size > 8 * 1024 * 1024) throw new Error("report view input exceeds the 8 MiB limit");
  const bytes = await readFile(path);
  if (bytes.byteLength > 8 * 1024 * 1024) throw new Error("report view input exceeds the 8 MiB limit");
  let value: any;
  try { value = JSON.parse(bytes.toString("utf8")); } catch { throw new Error("report view input is not valid JSON"); }
  if (!value || typeof value !== "object" || !["PASS", "REVIEW", "BLOCK", "INCOMPLETE"].includes(value.decision) || typeof value.subjectId !== "string" || !value.policy || typeof value.policy.id !== "string" || typeof value.policy.version !== "string" || typeof value.policy.digest !== "string" || typeof value.generatedAt !== "string" || !Array.isArray(value.limitations) || typeof value.nextAction !== "string" || !["unknown", "unsigned", "verified", "unverified"].includes(value.signerStatus)) throw new Error("report view JSON is not a supported release header projection");
  if (value.coverageStatus !== undefined && !["incomplete", "not-established"].includes(value.coverageStatus)) throw new Error("report view JSON has an unsupported coverage state");
  if (value.lineage !== undefined && (!value.lineage || !["recorded", "not-recorded"].includes(value.lineage.status) || !["edgeCount", "matched", "mismatched", "unavailable", "unverifiable", "gapCount"].every((key) => Number.isSafeInteger(value.lineage[key]) && value.lineage[key] >= 0) || value.lineage.matched + value.lineage.mismatched + value.lineage.unavailable + value.lineage.unverifiable !== value.lineage.edgeCount)) throw new Error("report view JSON has unsupported lineage evidence");
  if (value.subjects !== undefined && (!Array.isArray(value.subjects) || value.subjects.some((subject: any) => !subject || typeof subject.subjectId !== "string" || typeof subject.identityDigest !== "string" || typeof subject.role !== "string" || !Array.isArray(subject.contentDigests) || subject.contentDigests.some((content: any) => !content || typeof content.purpose !== "string" || typeof content.digest !== "string")))) throw new Error("report view JSON has unsupported subject evidence");
  return renderLocalViewer(value);
}
