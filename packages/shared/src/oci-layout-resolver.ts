import { createHash } from "node:crypto";
import { lstat, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { resolveOciDocument } from "./oci-resolver.js";
import type { OciIndexSubject, OciManifestSubject } from "./subject.js";

export class OciLayoutResolutionError extends Error {
  override readonly name = "OciLayoutResolutionError";
  constructor(readonly code: "INVALID_LAYOUT" | "MISSING_BLOB" | "DIGEST_MISMATCH" | "AMBIGUOUS_INDEX", message: string) { super(message); }
}

const MAX_OCI_INDEX_BYTES = 8 * 1024 * 1024;
const MAX_OCI_MANIFEST_BYTES = 50 * 1024 * 1024;

export async function resolveOciLayout(rootInput: string, platform?: string): Promise<OciManifestSubject | OciIndexSubject> {
  const root = resolve(rootInput);
  try { if (!(await lstat(join(root, "oci-layout.json"))).isFile() || !(await lstat(join(root, "index.json"))).isFile()) throw new Error(); } catch { throw new OciLayoutResolutionError("INVALID_LAYOUT", "OCI layout requires oci-layout.json and index.json."); }
  let index: { manifests?: Array<{ digest?: string; annotations?: Record<string, string>; platform?: { os: string; architecture: string; variant?: string } }> };
  try {
    const indexPath = join(root, "index.json");
    if ((await lstat(indexPath)).size > MAX_OCI_INDEX_BYTES) throw new Error("oversized");
    const indexBytes = await readFile(indexPath);
    if (indexBytes.byteLength > MAX_OCI_INDEX_BYTES) throw new Error("oversized");
    index = JSON.parse(indexBytes.toString("utf8"));
  } catch { throw new OciLayoutResolutionError("INVALID_LAYOUT", "OCI layout index is invalid JSON."); }
  if (!Array.isArray(index.manifests) || index.manifests.length !== 1 || typeof index.manifests[0]?.digest !== "string") throw new OciLayoutResolutionError("AMBIGUOUS_INDEX", "OCI layout must contain exactly one manifest descriptor.");
  const descriptor = index.manifests[0];
  const descriptorDigest = descriptor.digest as string;
  if (!descriptorDigest.startsWith("sha256:") || !/^sha256:[a-f0-9]{64}$/.test(descriptorDigest)) throw new OciLayoutResolutionError("INVALID_LAYOUT", "OCI layout descriptor must use a SHA-256 digest.");
  const blobPath = join(root, "blobs", "sha256", descriptorDigest.slice(7));
  let blobEntry;
  try { blobEntry = await lstat(blobPath); } catch { throw new OciLayoutResolutionError("MISSING_BLOB", "OCI layout manifest blob is missing."); }
  if (!blobEntry.isFile()) throw new OciLayoutResolutionError("MISSING_BLOB", "OCI layout manifest blob is missing.");
  if (blobEntry.size > MAX_OCI_MANIFEST_BYTES) throw new OciLayoutResolutionError("INVALID_LAYOUT", "OCI layout manifest exceeds the 50 MiB limit.");
  const bytes = await readFile(blobPath).catch(() => { throw new OciLayoutResolutionError("MISSING_BLOB", "OCI layout manifest blob is missing."); });
  if (bytes.byteLength > MAX_OCI_MANIFEST_BYTES) throw new OciLayoutResolutionError("INVALID_LAYOUT", "OCI layout manifest exceeds the 50 MiB limit.");
  const actual = createHash("sha256").update(bytes).digest("hex");
  if (actual !== descriptorDigest.slice(7)) throw new OciLayoutResolutionError("DIGEST_MISMATCH", "OCI layout manifest blob digest does not match its descriptor.");
  const ref = `localhost/layout@${descriptorDigest}`;
  return resolveOciDocument(ref, bytes);
}
