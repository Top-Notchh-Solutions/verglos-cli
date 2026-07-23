import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { DEFAULT_CONFIG } from "@verglos/shared";

const CONFIG_TEMPLATE = `/** @type {import('@verglos/shared').VerglosConfig} */
module.exports = ${JSON.stringify(DEFAULT_CONFIG, null, 2)};
`;

export async function ensureConfig(projectRoot: string): Promise<void> {
  const configPath = join(projectRoot, ".verglos.config.js");
  try {
    const { createRequire } = await import("node:module");
    const require = createRequire(import.meta.url);
    require(configPath);
  } catch {
    await writeFile(configPath, CONFIG_TEMPLATE, "utf8");
  }
}

export async function installPreCommitHook(
  projectRoot: string,
): Promise<void> {
  const hookPath = join(projectRoot, ".git", "hooks", "pre-commit");
  // Uses `verglos precommit` — the fast path that skips CVE/OSV
  // network calls, git-history sweeps, and the provenance engine.
  // Keep this fast; timeouts pass so the
  // hook never blocks on a slow scanner.
  const hook = `#!/bin/sh
# Verglos pre-commit hook — secrets + criticals only, <2s budget
# Bypass with: git commit --no-verify
npx verglos precommit
`;
  try {
    await writeFile(hookPath, hook, { mode: 0o755 });
  } catch {
    // no git repo — installPreCommitHook is a no-op
  }
}
