import { execFile } from "node:child_process";
import { constants } from "node:fs";
import { lstat, mkdtemp, open, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
export const DEFAULT_NPM_REGISTRY = "https://registry.npmjs.org";
const MAX_ARCHIVE_BYTES = 128 * 1024 * 1024;
const VERSION = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/u;
const PACKAGE_NAME = /^(?:@[a-z0-9][a-z0-9._~-]*\/[a-z0-9][a-z0-9._~-]*|[a-z0-9][a-z0-9._~-]*)$/u;
const TAG = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/u;

export function packageVersionUrl(registry, packageName, version) {
  const base = new URL(registry);
  if (base.protocol !== "https:" || base.hostname !== "registry.npmjs.org") {
    throw new Error("npm publication registry must be https://registry.npmjs.org");
  }
  if (!PACKAGE_NAME.test(packageName) || !VERSION.test(version)) {
    throw new Error("npm publication package identity is invalid");
  }
  const encodedName = encodeURIComponent(packageName);
  return new URL(`${encodedName}/${encodeURIComponent(version)}`, `${base.origin}/`).href;
}

export function publicationDecision(status) {
  if (status === 200) return "already-published";
  if (status === 404) return "publish";
  throw new Error(`npm registry preflight returned unexpected HTTP status ${status}`);
}

/**
 * A registry 200 is only authoritative when its body is bound to the exact
 * package/version represented by the archive being considered.  This keeps a
 * proxy, mirror, or malformed registry response from being mistaken for an
 * already-published release.
 */
export async function validatePublishedMetadata(response, expectedName, expectedVersion) {
  let metadata;
  try {
    metadata = JSON.parse(await response.text());
  } catch {
    throw new Error("npm registry preflight returned invalid package metadata");
  }
  if (
    metadata === null
    || typeof metadata !== "object"
    || Array.isArray(metadata)
    || metadata.name !== expectedName
    || metadata.version !== expectedVersion
  ) {
    throw new Error("npm registry preflight package identity does not match the release archive");
  }
  return metadata;
}

async function readBoundedArchive(archivePath) {
  const entry = await lstat(archivePath);
  if (!entry.isFile() || entry.size <= 0 || entry.size > MAX_ARCHIVE_BYTES) {
    throw new Error("npm publication archive must be a bounded regular file");
  }
  const handle = await open(archivePath, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
  try {
    const opened = await handle.stat();
    if (!opened.isFile() || !sameFile(entry, opened)) throw new Error("npm publication archive changed during validation");
    const bytes = await handle.readFile();
    const final = await handle.stat();
    if (!sameFile(opened, final) || final.size !== bytes.length || final.size > MAX_ARCHIVE_BYTES) {
      throw new Error("npm publication archive changed during read");
    }
    return bytes;
  } finally {
    await handle.close();
  }
}

async function readArchiveManifest(archivePath, injectedRun) {
  const archiveBytes = await readBoundedArchive(archivePath);
  let stdout;
  try {
    if (injectedRun) {
      ({ stdout } = await injectedRun("tar", ["-xOf", "-", "package/package.json"], {
        input: archiveBytes,
        encoding: "utf8",
        maxBuffer: 1024 * 1024,
      }));
    } else {
      stdout = await extractManifestFromBytes(archiveBytes);
    }
  } catch {
    throw new Error("npm publication archive has no readable package manifest");
  }
  let manifest;
  try { manifest = JSON.parse(String(stdout)); } catch { throw new Error("npm publication archive manifest is invalid JSON"); }
  if (typeof manifest !== "object" || manifest === null || Array.isArray(manifest) || !PACKAGE_NAME.test(manifest.name) || !VERSION.test(manifest.version)) {
    throw new Error("npm publication archive manifest has an invalid package identity");
  }
  return { archiveBytes, name: manifest.name, version: manifest.version };
}

export async function publishPublicPackage(options) {
  const injectedRun = options.run;
  const run = injectedRun ?? execFileAsync;
  const fetchImpl = options.fetchImpl ?? fetch;
  const tag = options.tag ?? "alpha";
  if (typeof options.archivePath !== "string" || !options.archivePath || !TAG.test(tag)) throw new Error("npm publication input is invalid");
  const manifest = await readArchiveManifest(options.archivePath, options.tarRun);
  const registry = options.registry ?? DEFAULT_NPM_REGISTRY;
  const endpoint = packageVersionUrl(registry, manifest.name, manifest.version);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs ?? 10_000);
  let response;
  try {
    try {
      response = await fetchImpl(endpoint, { method: "GET", headers: { Accept: "application/json" }, redirect: "error", signal: controller.signal });
    } catch {
      throw new Error("npm registry preflight failed");
    }
  } finally {
    clearTimeout(timer);
  }
  const decision = publicationDecision(response.status);
  if (decision === "already-published") {
    await validatePublishedMetadata(response, manifest.name, manifest.version);
    console.log(`::notice::${manifest.name}@${manifest.version} already published — skipping`);
    return Object.freeze({ status: decision, packageName: manifest.name, version: manifest.version, endpoint });
  }
  const snapshotDirectory = await mkdtemp(join(tmpdir(), "verglos-public-package-"));
  const snapshotPath = join(snapshotDirectory, `${basename(options.archivePath) || "release"}.tgz`);
  try {
    await writeFile(snapshotPath, manifest.archiveBytes, { mode: 0o600 });
    await run(process.platform === "win32" ? "npm.cmd" : "npm", ["publish", snapshotPath, "--access", "public", "--provenance", "--tag", tag], {
      encoding: "utf8",
      maxBuffer: 4 * 1024 * 1024,
    });
  } finally {
    await rm(snapshotDirectory, { recursive: true, force: true });
  }
  return Object.freeze({ status: "published", packageName: manifest.name, version: manifest.version, endpoint });
}

async function extractManifestFromBytes(bytes) {
  const snapshotDirectory = await mkdtemp(join(tmpdir(), "verglos-public-manifest-"));
  const snapshotPath = join(snapshotDirectory, "archive.tgz");
  try {
    await writeFile(snapshotPath, bytes, { mode: 0o600 });
    const { stdout } = await execFileAsync("tar", ["-xOf", snapshotPath, "package/package.json"], {
      encoding: "utf8",
      maxBuffer: 1024 * 1024,
    });
    return stdout;
  } finally {
    await rm(snapshotDirectory, { recursive: true, force: true });
  }
}

function sameFile(left, right) {
  return (left.dev === 0 || right.dev === 0 || left.dev === right.dev)
    && (left.ino === 0 || right.ino === 0 || left.ino === right.ino);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const archivePath = process.argv[2];
  const tag = process.argv[3] ?? "alpha";
  if (!archivePath) throw new Error("npm publication archive is required");
  await publishPublicPackage({ archivePath, tag });
}
