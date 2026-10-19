import { execFile } from "node:child_process";
import { lstat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
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

async function readArchiveManifest(archivePath, run) {
  const entry = await lstat(archivePath);
  if (!entry.isFile() || entry.size <= 0 || entry.size > MAX_ARCHIVE_BYTES) {
    throw new Error("npm publication archive must be a bounded regular file");
  }
  let stdout;
  try {
    ({ stdout } = await run("tar", ["-xOf", archivePath, "package/package.json"], {
      encoding: "utf8",
      maxBuffer: 1024 * 1024,
    }));
  } catch {
    throw new Error("npm publication archive has no readable package manifest");
  }
  let manifest;
  try { manifest = JSON.parse(String(stdout)); } catch { throw new Error("npm publication archive manifest is invalid JSON"); }
  if (typeof manifest !== "object" || manifest === null || Array.isArray(manifest) || !PACKAGE_NAME.test(manifest.name) || !VERSION.test(manifest.version)) {
    throw new Error("npm publication archive manifest has an invalid package identity");
  }
  return { name: manifest.name, version: manifest.version };
}

export async function publishPublicPackage(options) {
  const run = options.run ?? execFileAsync;
  const fetchImpl = options.fetchImpl ?? fetch;
  const tag = options.tag ?? "alpha";
  if (typeof options.archivePath !== "string" || !options.archivePath || !TAG.test(tag)) throw new Error("npm publication input is invalid");
  const manifest = await readArchiveManifest(options.archivePath, run);
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
    console.log(`::notice::${manifest.name}@${manifest.version} already published — skipping`);
    return Object.freeze({ status: decision, packageName: manifest.name, version: manifest.version, endpoint });
  }
  await run(process.platform === "win32" ? "npm.cmd" : "npm", ["publish", options.archivePath, "--access", "public", "--provenance", "--tag", tag], {
    encoding: "utf8",
    maxBuffer: 4 * 1024 * 1024,
  });
  return Object.freeze({ status: "published", packageName: manifest.name, version: manifest.version, endpoint });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const archivePath = process.argv[2];
  const tag = process.argv[3] ?? "alpha";
  if (!archivePath) throw new Error("npm publication archive is required");
  await publishPublicPackage({ archivePath, tag });
}
