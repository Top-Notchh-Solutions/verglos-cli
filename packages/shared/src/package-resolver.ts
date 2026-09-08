import { createHash } from "node:crypto";
import { lstat, readFile } from "node:fs/promises";
import { resolve, join } from "node:path";
import { createSubject, type PackageSubject } from "./subject.js";
import { assertNoExecutionContext, type TargetResolution, type TargetResolver, type TargetResolverContext, type TargetSpec } from "./target-resolver.js";

const LOCKFILES = ["package-lock.json", "npm-shrinkwrap.json", "pnpm-lock.yaml", "yarn.lock"] as const;

export class PackageResolutionError extends Error {
  override readonly name = "PackageResolutionError";
  constructor(readonly code: "INVALID_TARGET" | "MISSING_METADATA" | "INVALID_METADATA", message: string) { super(message); }
}

function packageDigest(bytes: Uint8Array): { algorithm: "sha256"; value: string } {
  return { algorithm: "sha256", value: createHash("sha256").update(bytes).digest("hex") };
}

export async function resolvePackageTarget(target: TargetSpec, context: TargetResolverContext): Promise<TargetResolution> {
  assertNoExecutionContext(context);
  if (target.kind !== "package") throw new PackageResolutionError("INVALID_TARGET", "Package resolver requires a package target.");
  const packageRoot = resolve(context.cwd, target.value);
  let packageBytes: Buffer;
  try {
    const stat = await lstat(join(packageRoot, "package.json"));
    if (!stat.isFile()) throw new Error("not a file");
    packageBytes = await readFile(join(packageRoot, "package.json"));
  } catch {
    throw new PackageResolutionError("MISSING_METADATA", "Package target has no readable package.json.");
  }
  let metadata: unknown;
  try { metadata = JSON.parse(packageBytes.toString("utf8")); } catch { throw new PackageResolutionError("INVALID_METADATA", "Package metadata is not valid JSON."); }
  if (typeof metadata !== "object" || metadata === null || typeof (metadata as { name?: unknown }).name !== "string" || typeof (metadata as { version?: unknown }).version !== "string") {
    throw new PackageResolutionError("INVALID_METADATA", "Package metadata requires string name and version fields.");
  }
  const name = (metadata as { name: string }).name;
  const version = (metadata as { version: string }).version;
  let lockfileName: string | undefined;
  for (const candidate of LOCKFILES) { try { if ((await lstat(join(packageRoot, candidate))).isFile()) { lockfileName = candidate; break; } } catch { /* absent */ } }
  const limitations = lockfileName ? [] : ["no supported lockfile was found"]; 
  const subject = createSubject({ kind: "package", ecosystem: "npm", name, version, digest: packageDigest(packageBytes), purl: `pkg:npm/${name}@${version}` });
  return { target, subject, coverage: limitations.length === 0 ? "complete" : "incomplete", limitations };
}

export const packageResolver: TargetResolver = { id: "verglos.package-metadata", capabilities: ["resolve-package"], resolve: resolvePackageTarget };
export type ResolvedPackageSubject = PackageSubject;
