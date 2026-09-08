import { createHash } from "node:crypto";
import { lstat, readdir, readFile, readlink } from "node:fs/promises";
import { relative, resolve } from "node:path";
import { createSubject, type FilesystemSubject } from "./subject.js";
import { assertNoExecutionContext, type TargetResolution, type TargetResolver, type TargetResolverContext, type TargetSpec } from "./target-resolver.js";

const IGNORE_POLICY = Object.freeze([".git", "node_modules", "dist"]);

export class FilesystemResolutionError extends Error {
  override readonly name = "FilesystemResolutionError";
  constructor(readonly code: "INVALID_TARGET" | "MISSING_PATH", message: string) { super(message); }
}

function digestHash(hash: ReturnType<typeof createHash>) { return { algorithm: "sha256" as const, value: hash.digest("hex") }; }

export async function resolveFilesystemTarget(target: TargetSpec, context: TargetResolverContext): Promise<TargetResolution> {
  assertNoExecutionContext(context);
  if (target.kind !== "filesystem") throw new FilesystemResolutionError("INVALID_TARGET", "Filesystem resolver requires a filesystem target.");
  const root = resolve(context.cwd, target.value);
  try { if (!(await lstat(root)).isDirectory()) throw new Error("not directory"); } catch { throw new FilesystemResolutionError("MISSING_PATH", "Filesystem target is not a readable directory."); }
  const tree = createHash("sha256");
  const limitations: string[] = [];
  let entryCount = 0;
  async function visit(directory: string): Promise<void> {
    let entries;
    try { entries = (await readdir(directory, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name)); }
    catch { limitations.push(`unreadable:${relative(root, directory) || "."}`); return; }
    for (const entry of entries) {
      if (IGNORE_POLICY.includes(entry.name as (typeof IGNORE_POLICY)[number]) && directory === root) continue;
      const absolute = resolve(directory, entry.name);
      const path = relative(root, absolute).split("\\").join("/");
      try {
        const info = await lstat(absolute);
        entryCount += 1;
        tree.update(`${path}\0${info.mode}\0`, "utf8");
        if (info.isDirectory()) await visit(absolute);
        else if (info.isFile()) tree.update(await readFile(absolute));
        else if (info.isSymbolicLink()) tree.update(`symlink:${await readlink(absolute)}\0`, "utf8");
        else limitations.push(`unsupported:${path}`);
      } catch { limitations.push(`unreadable:${path}`); }
    }
  }
  await visit(root);
  const ignoreHash = createHash("sha256").update(JSON.stringify(IGNORE_POLICY), "utf8");
  const subject = createSubject({ kind: "filesystem", treeDigest: digestHash(tree), ignorePolicyDigest: digestHash(ignoreHash), entryCount });
  return { target, subject, coverage: limitations.length === 0 ? "complete" : "incomplete", limitations: Object.freeze(limitations.sort()) };
}

export const filesystemResolver: TargetResolver = { id: "verglos.filesystem-tree", capabilities: ["resolve-filesystem"], resolve: resolveFilesystemTarget };
export type ResolvedFilesystemSubject = FilesystemSubject;
