import { createHash, randomUUID } from "node:crypto";
import { lstat, mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { ApprovalReceiptSchema, approvalRequestDigest, type ApprovalReceipt } from "./approval-receipt.js";
import { canonicalizeJson } from "./schema.js";

const MAX_RECEIPT_BYTES = 256 * 1024;

function receiptPath(root: string, digest: string): string {
  if (!/^sha256:[a-f0-9]{64}$/.test(digest)) throw new Error("approval request digest is invalid");
  return join(root, `${digest.slice(7)}.json`);
}

async function assertRoot(root: string, create = false): Promise<void> {
  if (create) await mkdir(root, { recursive: true, mode: 0o700 });
  const entry = await lstat(root);
  if (!entry.isDirectory()) throw new Error("approval store root must be a regular directory");
}

function validateReceipt(receipt: ApprovalReceipt): ApprovalReceipt {
  const parsed = ApprovalReceiptSchema.parse(receipt);
  const { decision: _decision, decidedBy: _decidedBy, decidedAt: _decidedAt, requestDigest, ...request } = parsed;
  if (requestDigest !== approvalRequestDigest(request)) throw new Error("approval receipt request digest mismatch");
  return parsed;
}

/** Persist an exact approval receipt using an atomic, content-addressed file. */
export async function putApprovalReceipt(root: string, receipt: ApprovalReceipt): Promise<{ readonly requestDigest: string; readonly path: string }> {
  const parsed = validateReceipt(receipt);
  const requestDigest = parsed.requestDigest;
  const destination = receiptPath(root, requestDigest);
  await assertRoot(root, true);
  const bytes = Buffer.from(`${canonicalizeJson(parsed)}\n`, "utf8");
  if (bytes.byteLength > MAX_RECEIPT_BYTES) throw new Error("approval receipt exceeds its size limit");
  const temporary = join(root, `.receipt.${process.pid}.${randomUUID()}.tmp`);
  await writeFile(temporary, bytes, { flag: "wx", mode: 0o600 });
  try {
    await rename(temporary, destination);
  } catch (error) {
    await unlink(temporary).catch(() => undefined);
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
    const existing = await readApprovalReceipt(root, requestDigest);
    if (canonicalizeJson(existing) !== canonicalizeJson(parsed)) throw new Error("approval receipt already exists with different content");
  }
  return { requestDigest, path: destination };
}

/** Read and revalidate a receipt, refusing symlinks, oversized files, and tampering. */
export async function readApprovalReceipt(root: string, requestDigest: string): Promise<ApprovalReceipt> {
  await assertRoot(root);
  const path = receiptPath(root, requestDigest);
  const entry = await lstat(path);
  if (!entry.isFile() || entry.size > MAX_RECEIPT_BYTES) throw new Error("approval receipt must be a bounded regular file");
  const bytes = await readFile(path);
  if (bytes.byteLength > MAX_RECEIPT_BYTES) throw new Error("approval receipt must be a bounded regular file");
  let parsed: unknown;
  try { parsed = JSON.parse(bytes.toString("utf8")); } catch { throw new Error("approval receipt is not valid JSON"); }
  const receipt = validateReceipt(ApprovalReceiptSchema.parse(parsed));
  if (receipt.requestDigest !== requestDigest) throw new Error("approval receipt digest does not match its requested key");
  return receipt;
}
