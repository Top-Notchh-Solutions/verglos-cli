import { createHash } from "node:crypto";
import { execSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Project fingerprint:
 *
 *   fingerprint = sha256(firstCommitSHA + normalizedRemoteOrigin)
 *
 * Stable across clones, machines, and directory moves. Contains no
 * personal data. Fallback:
 *   - no git → sha256(packageName + packageVersion)
 *   - no package.json either → ephemeral (returns null, caller
 *     falls back to free-tier caps)
 */

export type FingerprintSource = "git" | "package" | "ephemeral";

export interface FingerprintResult {
  fingerprint: string | null;
  source: FingerprintSource;
  details: string;
}

function normalizeGitRemote(url: string): string {
  // Strip protocol, whitespace, .git suffix, and trailing slashes.
  // git@github.com:owner/repo.git  → github.com/owner/repo
  // https://github.com/owner/repo/ → github.com/owner/repo
  return url
    .trim()
    .replace(/^\s*git@/i, "")
    .replace(/^\s*https?:\/\//i, "")
    .replace(/^\s*ssh:\/\/git@/i, "")
    .replace(/:/g, "/") // git@host:path → host/path
    .replace(/\/{2,}/g, "/") // dedupe slashes introduced above
    .replace(/\.git\/?$/i, "")
    .replace(/\/$/, "")
    .toLowerCase();
}

function tryReadGit(projectRoot: string): {
  firstCommitSHA?: string;
  remote?: string;
} {
  const out: { firstCommitSHA?: string; remote?: string } = {};
  try {
    out.firstCommitSHA = execSync(
      "git rev-list --max-parents=0 HEAD | tail -1",
      {
        cwd: projectRoot,
        encoding: "utf8",
        stdio: ["pipe", "pipe", "ignore"],
        shell: "/bin/sh",
      },
    ).trim();
  } catch {
    // no git or empty history
  }
  try {
    out.remote = execSync("git config --get remote.origin.url", {
      cwd: projectRoot,
      encoding: "utf8",
      stdio: ["pipe", "pipe", "ignore"],
    }).trim();
  } catch {
    // no origin configured
  }
  return out;
}

async function tryReadPackageJson(projectRoot: string): Promise<{
  name?: string;
  version?: string;
}> {
  try {
    const raw = await readFile(join(projectRoot, "package.json"), "utf8");
    const pkg = JSON.parse(raw) as { name?: string; version?: string };
    return { name: pkg.name, version: pkg.version };
  } catch {
    return {};
  }
}

/**
 * Compute the project fingerprint. Never throws — free-tier
 * callers get `source: 'ephemeral'` and can decide whether to
 * treat that as a fresh scan or refuse to activate a license.
 */
export async function computeProjectFingerprint(
  projectRoot: string,
): Promise<FingerprintResult> {
  const git = tryReadGit(projectRoot);
  if (git.firstCommitSHA && git.remote) {
    const normalized = normalizeGitRemote(git.remote);
    const fingerprint = createHash("sha256")
      .update(git.firstCommitSHA)
      .update("|")
      .update(normalized)
      .digest("hex");
    return {
      fingerprint,
      source: "git",
      details: `${normalized}@${git.firstCommitSHA.slice(0, 7)}`,
    };
  }

  const pkg = await tryReadPackageJson(projectRoot);
  if (pkg.name && pkg.version) {
    const fingerprint = createHash("sha256")
      .update(pkg.name)
      .update("|")
      .update(pkg.version)
      .digest("hex");
    return {
      fingerprint,
      source: "package",
      details: `${pkg.name}@${pkg.version}`,
    };
  }

  return {
    fingerprint: null,
    source: "ephemeral",
    details: "no git remote, no package.json — free-tier scan only",
  };
}

/**
 * Legacy synchronous helper kept for backward compatibility with
 * callers that construct the payload themselves. New code should use
 * computeProjectFingerprint.
 */
export function computeFingerprint(input: {
  packageName: string;
  gitRemote?: string;
  projectRoot: string;
}): string {
  const payload = [
    input.packageName,
    input.gitRemote ? normalizeGitRemote(input.gitRemote) : "no-remote",
    input.projectRoot,
  ].join("|");
  return createHash("sha256").update(payload).digest("hex").slice(0, 32);
}

/**
 * Generate a fresh license key for the activation flow.
 */
export function generateLicenseKey(): string {
  const bytes = createHash("sha256")
    .update(`${Date.now()}-${Math.random()}`)
    .digest("hex");
  return `vg_${bytes.slice(0, 8)}_${bytes.slice(8, 16)}_${bytes.slice(16, 24)}`;
}
