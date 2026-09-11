import { chmod, copyFile, lstat, readFile, open } from "node:fs/promises";
import { constants } from "node:fs";
import { join } from "node:path";

export async function installPreCommitHook(
  projectRoot: string,
): Promise<boolean> {
  const hookPath = join(projectRoot, ".git", "hooks", "pre-commit");
  const originalPath = join(projectRoot, ".git", "hooks", "pre-commit.verglos-original");
  // Uses `verglos precommit` — the fast path that skips CVE/OSV
  // network calls, git-history sweeps, and the provenance engine.
  // Keep this fast; timeouts pass so the
  // hook never blocks on a slow scanner.
  let existing: Awaited<ReturnType<typeof lstat>> | undefined;
  try { existing = await lstat(hookPath); } catch { /* hook does not exist */ }
  if (existing?.isSymbolicLink()) throw new Error("refusing to replace a symlinked Git pre-commit hook");
  if (existing && !existing.isFile()) throw new Error("existing Git pre-commit hook is not a regular file");
  if (existing) {
    const current = await readFile(hookPath, "utf8");
    if (current.includes("# Verglos pre-commit hook")) return true;
    // Preserve the user's hook exactly; never overwrite an existing backup.
    try { await lstat(originalPath); } catch {
      try { await copyFile(hookPath, originalPath, constants.COPYFILE_EXCL); await chmod(originalPath, 0o755); }
      catch (error) { if (!(error instanceof Error && "code" in error && error.code === "EEXIST")) throw error; }
    }
  }
  const hook = `#!/bin/sh
# Verglos pre-commit hook — secrets + criticals only, <2s budget
# Bypass with: git commit --no-verify
HOOK_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
if [ -x "$HOOK_DIR/pre-commit.verglos-original" ]; then
  "$HOOK_DIR/pre-commit.verglos-original" || exit $?
fi
npx verglos precommit
`;
  try {
    const handle = await open(hookPath, constants.O_WRONLY | constants.O_CREAT | constants.O_TRUNC | constants.O_NOFOLLOW, 0o755);
    try { await handle.writeFile(hook, "utf8"); }
    finally { await handle.close(); }
    return true;
  } catch {
    // no git repo — report the no-op so callers do not claim a false success
    return false;
  }
}
