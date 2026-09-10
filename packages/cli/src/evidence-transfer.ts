import { lstat, readFile, writeFile } from "node:fs/promises";
import { importBoundedJson } from "@verglos/shared";
import { exportCycloneDx, exportSpdx } from "@verglos/shared";

async function readEvidenceInput(inputPath: string): Promise<Buffer> {
  if (inputPath === "-") return readFile(0 as any);
  const entry = await lstat(inputPath);
  if (!entry.isFile()) throw new Error("evidence input must be a regular file");
  if (entry.size > 8 * 1024 * 1024) throw new Error("evidence input exceeds the 8 MiB limit");
  return readFile(inputPath);
}

export async function transferEvidence(inputPath: string, outputPath: string): Promise<{ readonly format: string; readonly bytes: number }> {
  const bytes = await readEvidenceInput(inputPath); const imported = importBoundedJson(bytes); let output: string;
  if (imported.format === "cyclonedx") output = exportCycloneDx(imported.document as Record<string, unknown>);
  else if (imported.format === "spdx") output = exportSpdx(imported.document as Record<string, unknown>);
  else throw new Error(`Evidence export for ${imported.format} is not enabled in this preparatory command helper.`);
  if (outputPath === "-") process.stdout.write(output);
  else await writeFile(outputPath, output, { flag: "wx" });
  return { format: imported.format, bytes: Buffer.byteLength(output) };
}

export async function inspectEvidence(inputPath: string): Promise<{ readonly format: string; readonly version: string; readonly bytes: number; readonly sourceDigest: string }> {
  const bytes = await readEvidenceInput(inputPath);
  const imported = importBoundedJson(bytes);
  return { format: imported.format, version: imported.version, bytes: bytes.byteLength, sourceDigest: imported.sourceDigest.algorithm + ":" + imported.sourceDigest.value };
}
