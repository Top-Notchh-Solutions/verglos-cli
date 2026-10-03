import { lstat, mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import { dirname } from "node:path";
import { randomUUID } from "node:crypto";
import { canonicalizeJson, parsePolicyDocument, policyDocumentDigest, type OrganizationPolicyCacheEntry, type PolicyDocument } from "@verglos/shared";

const MAX_CACHE_BYTES = 1 * 1024 * 1024;
const ID = /^[A-Za-z0-9][A-Za-z0-9._:/-]{0,255}$/u;

function validScope(value: string): boolean { return ID.test(value); }

function parseCache(value: unknown, scope: Readonly<{ organizationId: string; repositoryId: string }>): OrganizationPolicyCacheEntry {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("organization policy cache is not an object");
  const candidate = value as Record<string, unknown>;
  if (candidate.organizationId !== scope.organizationId || candidate.repositoryId !== scope.repositoryId) throw new Error("organization policy cache scope mismatch");
  if (typeof candidate.organizationId !== "string" || !validScope(candidate.organizationId) || typeof candidate.repositoryId !== "string" || !validScope(candidate.repositoryId)) throw new Error("organization policy cache scope is invalid");
  if (candidate.source !== "remote" && candidate.source !== "cache") throw new Error("organization policy cache source is invalid");
  if (typeof candidate.policyDigest !== "string" || !/^sha256:[a-f0-9]{64}$/u.test(candidate.policyDigest)) throw new Error("organization policy cache digest is invalid");
  if (typeof candidate.cachedAt !== "string" || !Number.isFinite(Date.parse(candidate.cachedAt)) || typeof candidate.expiresAt !== "string" || !Number.isFinite(Date.parse(candidate.expiresAt))) throw new Error("organization policy cache timestamps are invalid");
  const policy = parsePolicyDocument(candidate.policy) as PolicyDocument;
  if (policyDocumentDigest(policy) !== candidate.policyDigest) throw new Error("organization policy cache digest does not match policy");
  return Object.freeze({ organizationId: candidate.organizationId, repositoryId: candidate.repositoryId, policy, policyDigest: candidate.policyDigest, cachedAt: candidate.cachedAt, expiresAt: candidate.expiresAt, source: candidate.source });
}

export async function readOrganizationPolicyCache(path: string, scope: Readonly<{ organizationId: string; repositoryId: string }>): Promise<OrganizationPolicyCacheEntry | null> {
  let entry;
  try { entry = await lstat(path); } catch (error) { if (error instanceof Error && "code" in error && error.code === "ENOENT") return null; throw error; }
  if (!entry.isFile() || entry.isSymbolicLink() || entry.size > MAX_CACHE_BYTES) throw new Error("organization policy cache must be a bounded regular file");
  const bytes = await readFile(path);
  if (bytes.byteLength > MAX_CACHE_BYTES) throw new Error("organization policy cache must be a bounded regular file");
  let value: unknown;
  try { value = JSON.parse(bytes.toString("utf8")); } catch { throw new Error("organization policy cache must be valid JSON"); }
  return parseCache(value, scope);
}

export async function writeOrganizationPolicyCache(path: string, entry: OrganizationPolicyCacheEntry): Promise<void> {
  const parsed = parseCache(entry, entry);
  const bytes = Buffer.from(`${canonicalizeJson(parsed)}\n`, "utf8");
  if (bytes.byteLength > MAX_CACHE_BYTES) throw new Error("organization policy cache exceeds the size limit");
  await mkdir(dirname(path), { recursive: true, mode: 0o700 });
  try {
    const existing = await lstat(path);
    if (existing.isSymbolicLink() || !existing.isFile()) throw new Error("organization policy cache target must be a regular file");
  } catch (error) { if (!(error instanceof Error && "code" in error && error.code === "ENOENT")) throw error; }
  const temporary = `${path}.${randomUUID()}.tmp`;
  try {
    await writeFile(temporary, bytes, { encoding: "utf8", mode: 0o600, flag: constants.O_CREAT | constants.O_EXCL | constants.O_WRONLY });
    await rename(temporary, path);
  } finally {
    try { await unlink(temporary); } catch { /* already renamed or absent */ }
  }
}
