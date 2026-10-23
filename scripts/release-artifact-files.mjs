import { constants } from "node:fs";
import { lstat, mkdtemp, open, rm, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { promisify } from "node:util";

const run = promisify(execFile);
export const MAX_RELEASE_ARTIFACT_BYTES = 128 * 1024 * 1024;
const MAX_ARCHIVE_MEMBER_BYTES = 1024 * 1024;

export async function readBoundedRegularFile(path, maxBytes = MAX_RELEASE_ARTIFACT_BYTES, label = path) {
  const expected = await lstat(path);
  if (!expected.isFile() || expected.isSymbolicLink() || expected.size > maxBytes) {
    throw new Error(`${label} must be a bounded regular file`);
  }

  const flags = constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0);
  const handle = await open(path, flags);
  try {
    const opened = await handle.stat();
    if (!sameFile(expected, opened) || !opened.isFile() || opened.size > maxBytes) {
      throw new Error(`${label} changed during validation/read`);
    }
    const bytes = await handle.readFile();
    const final = await handle.stat();
    if (!sameFile(opened, final) || final.size !== opened.size || bytes.length !== final.size || bytes.length > maxBytes) {
      throw new Error(`${label} changed during validation/read`);
    }
    return bytes;
  } finally {
    await handle.close();
  }
}

export async function extractArchiveMemberFromBytes(bytes, member, label, maxBytes = MAX_ARCHIVE_MEMBER_BYTES) {
  if (!Buffer.isBuffer(bytes) || bytes.length > MAX_RELEASE_ARTIFACT_BYTES) {
    throw new Error(`${label} must be a bounded archive buffer`);
  }
  const directory = await mkdtemp(join(tmpdir(), "verglos-release-archive-"));
  const archivePath = join(directory, "archive.tgz");
  try {
    await writeFile(archivePath, bytes, { mode: 0o600 });
    const { stdout } = await run("tar", ["-xOf", archivePath, member], {
      encoding: "buffer",
      maxBuffer: maxBytes,
    });
    const extracted = Buffer.from(stdout);
    if (extracted.length > maxBytes) throw new Error(`${label} archive member is too large`);
    return extracted;
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

export async function readArchiveManifest(path, label = `release archive ${path}`) {
  const bytes = await readBoundedRegularFile(path, MAX_RELEASE_ARTIFACT_BYTES, label);
  try {
    const manifestBytes = await extractArchiveMemberFromBytes(bytes, "package/package.json", label);
    return { bytes, manifest: JSON.parse(manifestBytes.toString("utf8")) };
  } catch {
    throw new Error(`${label} has no valid package manifest`);
  }
}

function sameFile(left, right) {
  return left.dev === right.dev && left.ino === right.ino;
}
