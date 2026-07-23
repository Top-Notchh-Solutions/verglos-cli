import { access } from "node:fs/promises";
import { join } from "node:path";
import { readdir } from "node:fs/promises";
import type {
  RepoLevelSignal,
  RepoLevelSignalSource,
} from "../types.js";

/**
 * Strong-tier repo-level signal.
 *
 * Presence of an agent's rules/config files in the repo shows the
 * developer *used* an AI agent at some point. It doesn't prove
 * every file is AI-authored, but it meaningfully raises the prior
 * — so we add a modest boost to every file's aiLikelihood before
 * per-file signals apply.
 *
 * Raises the prior; never conclusive alone.
 */

interface Artifact {
  path: string;
  agent: string;
  /** true if `path` is a directory to check for existence. */
  isDir?: boolean;
  /** true if `path` is a filename glob (e.g. `.aider*`) — match by prefix. */
  isPrefix?: boolean;
}

const ARTIFACTS: Artifact[] = [
  { path: ".cursor", agent: "Cursor", isDir: true },
  { path: ".cursorrules", agent: "Cursor" },
  { path: ".claude", agent: "Claude Code", isDir: true },
  { path: "CLAUDE.md", agent: "Claude Code" },
  { path: ".windsurfrules", agent: "Windsurf" },
  { path: ".windsurf", agent: "Windsurf", isDir: true },
  { path: ".aider", agent: "Aider", isPrefix: true },
  { path: ".github/copilot-instructions.md", agent: "GitHub Copilot" },
  { path: ".continue", agent: "Continue", isDir: true },
  { path: ".continuerc", agent: "Continue" },
  { path: ".codyrules", agent: "Sourcegraph Cody" },
];

/**
 * Per-artifact boost. Whole-repo boost is min(sum, cap) so a repo
 * that ships every rule file doesn't get pushed to 1.0 on artifact
 * evidence alone — that requires per-file signals too.
 */
const PER_ARTIFACT_BOOST = 0.1;
const REPO_PRIOR_CAP = 0.35;

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function anyPrefixMatch(
  root: string,
  prefix: string,
): Promise<boolean> {
  try {
    const entries = await readdir(root);
    return entries.some((e) => e.startsWith(prefix));
  } catch {
    return false;
  }
}

export const agentArtifactSource: RepoLevelSignalSource = {
  id: "agent-artifacts",
  async detectForRepo(projectRoot) {
    const found: { path: string; agent: string }[] = [];

    for (const artifact of ARTIFACTS) {
      if (artifact.isPrefix) {
        if (await anyPrefixMatch(projectRoot, artifact.path)) {
          found.push({ path: `${artifact.path}*`, agent: artifact.agent });
        }
      } else if (await exists(join(projectRoot, artifact.path))) {
        found.push({ path: artifact.path, agent: artifact.agent });
      }
    }

    if (found.length === 0) return [];

    // Dedup agent names for the human-readable detail line.
    const agents = new Set(found.map((f) => f.agent));
    const paths = found.map((f) => f.path).join(", ");

    const priorBoost = Math.min(
      found.length * PER_ARTIFACT_BOOST,
      REPO_PRIOR_CAP,
    );

    const signal: RepoLevelSignal = {
      name: "agent-artifacts",
      fired: true,
      priorBoost,
      detail: `Repo ships agent config for ${[...agents].join(", ")} (${paths}) — raises the prior on every file`,
    };
    return [signal];
  },
};
