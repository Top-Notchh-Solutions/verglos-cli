import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { lstat, readFile } from "node:fs/promises";
import { isAbsolute, relative, resolve } from "node:path";
import { promisify } from "node:util";
import { createSubject, type RepositoryTreeSubject } from "./subject.js";
import { assertNoExecutionContext, type TargetResolution, type TargetResolver, type TargetResolverContext, type TargetSpec } from "./target-resolver.js";

const execFileAsync = promisify(execFile);

export class RepositoryResolutionError extends Error {
  override readonly name = "RepositoryResolutionError";
  constructor(readonly code: "NOT_REPOSITORY" | "INVALID_TARGET" | "GIT_ERROR", message: string) {
    super(message);
  }
}

async function git(cwd: string, args: readonly string[]): Promise<string> {
  try {
    const result = await execFileAsync("git", args, { cwd, encoding: "utf8", maxBuffer: 4 * 1024 * 1024 });
    return result.stdout.trim();
  } catch (error) {
    const exitCode = typeof error === "object" && error !== null && "code" in error ? error.code : undefined;
    if (args[0] === "rev-parse" && (exitCode === 128 || exitCode === 129)) {
      throw new RepositoryResolutionError("NOT_REPOSITORY", "Target is not inside a Git repository.");
    }
    throw new RepositoryResolutionError("GIT_ERROR", `Git could not resolve repository metadata for ${args[0]}.`);
  }
}

function inside(root: string, candidate: string): boolean {
  const rel = relative(root, candidate);
  return rel === "" || (!rel.startsWith("..") && !isAbsolute(rel));
}

export function classifySubmoduleState(output: string): "none" | "resolved" | "incomplete" {
  const lines = output.trim();
  if (lines === "") return "none";
  return lines.split("\n").some((line) => line.startsWith("-") || line.startsWith("+") || line.startsWith("U")) ? "incomplete" : "resolved";
}

async function dirtyDigest(root: string, status: string, diff: string): Promise<{ algorithm: "sha256"; value: string }> {
  const hash = createHash("sha256");
  hash.update("status\0", "utf8").update(status, "utf8").update("\0diff\0", "utf8").update(diff, "utf8");
  const paths = await git(root, ["ls-files", "--others", "--exclude-standard", "-z"]);
  for (const path of paths.split("\0").filter(Boolean).sort()) {
    const absolute = resolve(root, path);
    if (!inside(root, absolute)) continue;
    const info = await lstat(absolute);
    hash.update("path\0", "utf8").update(path, "utf8").update("\0mode\0", "utf8").update(String(info.mode), "utf8");
    if (info.isSymbolicLink()) hash.update("link\0", "utf8").update((await readFile(absolute, "utf8")).toString(), "utf8");
    else if (info.isFile()) hash.update("file\0", "utf8").update(await readFile(absolute));
  }
  return { algorithm: "sha256", value: hash.digest("hex") };
}

export async function resolveRepositoryTarget(target: TargetSpec, context: TargetResolverContext): Promise<TargetResolution> {
  assertNoExecutionContext(context);
  if (target.kind !== "repository") throw new RepositoryResolutionError("INVALID_TARGET", "Repository resolver requires a repository target.");
  const root = await git(resolve(context.cwd, target.value), ["rev-parse", "--show-toplevel"]);
  const commit = await git(root, ["rev-parse", "HEAD"]);
  const tree = await git(root, ["rev-parse", "HEAD^{tree}"]);
  const status = await git(root, ["status", "--porcelain=v1"]);
  const dirty = status.length > 0;
  const shallow = (await git(root, ["rev-parse", "--is-shallow-repository"])) === "true";
  const submoduleOutput = await git(root, ["submodule", "status", "--recursive"]);
  const submoduleState = classifySubmoduleState(submoduleOutput);
  const subject = createSubject({
    kind: "repository-tree",
    vcs: "git",
    commit: { algorithm: commit.length === 64 ? "sha256" : "sha1", value: commit },
    tree: { algorithm: tree.length === 64 ? "sha256" : "sha1", value: tree },
    dirty,
    ...(dirty ? { worktreeDigest: await dirtyDigest(root, status, await git(root, ["diff", "--binary", "HEAD"])) } : {}),
    submoduleState,
    shallow,
  });
  const limitations = [
    ...(shallow ? ["repository is shallow"] : []),
    ...(submoduleState === "incomplete" ? ["repository has unresolved submodules"] : []),
  ];
  return { target, subject, coverage: limitations.length > 0 ? "incomplete" : "complete", limitations };
}

export const repositoryResolver: TargetResolver = {
  id: "verglos.git-repository",
  capabilities: ["resolve-repository"],
  resolve: resolveRepositoryTarget,
};

export type ResolvedRepositorySubject = RepositoryTreeSubject;
