import { lstat, open, writeFile } from "node:fs/promises";
import { importBoundedJson } from "@verglos/shared";
import { exportCycloneDx, exportSpdx } from "@verglos/shared";

const MAX_EVIDENCE_BYTES = 8 * 1024 * 1024;

async function readBoundedStdin(maxBytes: number): Promise<Buffer> {
  const chunks: Buffer[] = [];
  let total = 0;
  for await (const chunk of process.stdin) {
    const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as string);
    total += bytes.byteLength;
    if (total > maxBytes) throw new Error(maxBytes === MAX_EVIDENCE_BYTES ? "evidence input exceeds the 8 MiB limit" : "evidence input exceeds the configured byte limit");
    chunks.push(bytes);
  }
  return Buffer.concat(chunks, total);
}

export async function readEvidenceBytes(inputPath: string, maxBytes = MAX_EVIDENCE_BYTES): Promise<Buffer> {
  if (!Number.isSafeInteger(maxBytes) || maxBytes <= 0 || maxBytes > 64 * 1024 * 1024) throw new Error("evidence input limit is invalid");
  if (inputPath === "-") return readBoundedStdin(maxBytes);
  const entry = await lstat(inputPath);
  if (!entry.isFile()) throw new Error("evidence input must be a regular file");
  const limitMessage = maxBytes === MAX_EVIDENCE_BYTES ? "evidence input exceeds the 8 MiB limit" : "evidence input exceeds the configured byte limit";
  if (entry.size > maxBytes) throw new Error(limitMessage);
  const handle = await open(inputPath, "r");
  try {
    const opened = await handle.stat();
    if (!opened.isFile() || (entry.ino !== 0 && opened.ino !== 0 && (entry.dev !== opened.dev || entry.ino !== opened.ino))) throw new Error("evidence input changed during validation");
    if (opened.size > maxBytes) throw new Error(limitMessage);
    const bytes = await handle.readFile();
    if (bytes.byteLength > maxBytes) throw new Error(limitMessage);
    return bytes;
  } finally {
    await handle.close();
  }
}

async function readEvidenceInput(inputPath: string): Promise<Buffer> { return readEvidenceBytes(inputPath); }

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
