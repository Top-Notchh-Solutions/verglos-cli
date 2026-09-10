import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { parseTrivyJson, type TrivyObservation } from "./trivy-parser.js";

export interface TrivyEvidenceRef { readonly digest: `sha256:${string}`; readonly size: number; readonly mediaType: "application/json"; }
export class TrivyEvidenceError extends Error { override readonly name = "TrivyEvidenceError"; constructor(readonly code: "DIGEST_MISMATCH" | "MISSING", message: string) { super(message); } }

export async function retainTrivyEvidence(root: string, bytes: Uint8Array): Promise<TrivyEvidenceRef> {
  const digest = `sha256:${createHash("sha256").update(bytes).digest("hex")}` as const; const dir = join(root, digest.slice(7, 11));
  await mkdir(dir, { recursive: true }); await writeFile(join(dir, digest.slice("sha256:".length)), bytes, { flag: "wx" }).catch(() => undefined);
  return Object.freeze({ digest, size: bytes.byteLength, mediaType: "application/json" });
}

export async function replayTrivyEvidence(root: string, ref: TrivyEvidenceRef): Promise<readonly TrivyObservation[]> {
  const path = join(root, ref.digest.slice(7, 11), ref.digest.slice(7));
  let bytes: Buffer; try { bytes = await readFile(path); } catch { throw new TrivyEvidenceError("MISSING", "Retained Trivy evidence is unavailable."); }
  const actual = `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
  if (actual !== ref.digest || bytes.byteLength !== ref.size) throw new TrivyEvidenceError("DIGEST_MISMATCH", "Retained Trivy evidence failed integrity verification.");
  return parseTrivyJson(bytes);
}
