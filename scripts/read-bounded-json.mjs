import { createHash } from "node:crypto";
import { constants } from "node:fs";
import { lstat, open } from "node:fs/promises";

const MAX_INPUT_BYTES = 16 * 1024 * 1024;

/**
 * Read a JSON manifest through the opened regular-file handle. The initial
 * lstat bounds the caller-visible path, while O_NOFOLLOW and the opened-handle
 * identity/size checks prevent a path swap from changing the bytes consumed by
 * an acceptance contract.
 */
export async function readBoundedJsonFile(inputPath, label, maxBytes = MAX_INPUT_BYTES) {
  const result = await readBoundedJsonFileWithDigest(inputPath, label, maxBytes);
  return result.value;
}

export async function readBoundedJsonFileWithDigest(inputPath, label, maxBytes = MAX_INPUT_BYTES) {
  const result = await readBoundedFileWithDigest(inputPath, label, maxBytes);
  let value;
  try {
    value = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(result.bytes));
  } catch {
    throw new Error(`${label} must contain valid bounded UTF-8 JSON`);
  }
  return Object.freeze({
    value,
    bytes: result.bytes.byteLength,
    sha256: result.sha256,
  });
}

export async function readBoundedFileWithDigest(inputPath, label, maxBytes = MAX_INPUT_BYTES) {
  const bytes = await readBoundedFile(inputPath, label, maxBytes);
  return Object.freeze({
    bytes,
    sha256: `sha256:${createHash("sha256").update(bytes).digest("hex")}`,
  });
}

export async function readBoundedFile(inputPath, label, maxBytes = MAX_INPUT_BYTES) {
  if (typeof inputPath !== "string" || inputPath.length === 0 || inputPath.length > 4096 || /[\u0000-\u001f\u007f]/u.test(inputPath)) {
    throw new Error(`${label} path is invalid`);
  }
  if (!Number.isInteger(maxBytes) || maxBytes <= 0 || maxBytes > MAX_INPUT_BYTES) throw new Error(`${label} size limit is invalid`);

  const before = await lstat(inputPath);
  if (!before.isFile() || before.size > maxBytes) throw new Error(`${label} must be a bounded regular file`);

  const handle = await open(inputPath, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
  try {
    const opened = await handle.stat();
    if (!opened.isFile() || opened.size > maxBytes || !sameIdentity(before, opened)) throw new Error(`${label} changed while being opened`);
    const bytes = await handle.readFile();
    const after = await handle.stat();
    if (bytes.byteLength > maxBytes || after.size !== bytes.byteLength || !sameIdentity(opened, after)) throw new Error(`${label} changed while being read`);
    return bytes;
  } finally {
    await handle.close();
  }
}

function sameIdentity(left, right) {
  return left.dev === right.dev && left.ino === right.ino;
}
