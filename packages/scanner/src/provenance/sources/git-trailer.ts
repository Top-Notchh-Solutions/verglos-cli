import { execSync } from "node:child_process";
import type {
  ProvenanceSignal,
  ProvenanceSignalSource,
} from "../types.js";

/**
 * Certain-tier signal.
 *
 * Git trailers are the highest-precision AI-authorship evidence
 * we have: `Co-Authored-By: Claude`, `Co-authored-by: Copilot`,
 * `Co-Authored-By: Cursor`, etc. Explicitly stamped by the agent
 * (Claude Code adds one automatically) or the harness the human
 * committed through.
 *
 * Weight 1.0: this alone can flip a file to `ai-likely`.
 */

/**
 * Named agents Verglos recognizes when they appear in Co-Authored-By.
 * Matching is case-insensitive and allows arbitrary email in
 * `Name <email>` after the name. Regex kept simple deliberately —
 * this is a precision-first rule.
 */
const AI_AGENTS = [
  "Claude",
  "Claude Code",
  "Copilot",
  "GitHub Copilot",
  "Cursor",
  "Windsurf",
  "Aider",
  "Continue",
  "Cody",
  "Amazon Q Developer",
  "Devin",
  "OpenHands",
];

const AI_TRAILER_PATTERN = new RegExp(
  String.raw`^Co-Authored-By:\s*(${AI_AGENTS.map(escapeRegex).join("|")})\b`,
  "im",
);

/** Any `Name <bot@…>` trailer — GitHub bots commit as [bot] usernames. */
const BOT_TRAILER_PATTERN = /^Co-Authored-By:.+\[bot\]/im;

/** Explicit provenance headers some tools stamp. */
const AI_PROVENANCE_HEADER = /^(Generated-By|Generated-With|Assisted-By):\s*.+/im;

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function fileCommits(
  file: string,
  projectRoot: string,
  limit: number,
): Promise<string[]> {
  try {
    const out = execSync(
      `git log --follow --format=%H -n ${limit} -- ${JSON.stringify(file)}`,
      {
        cwd: projectRoot,
        encoding: "utf8",
        stdio: ["pipe", "pipe", "ignore"],
      },
    );
    return out.trim().split("\n").filter(Boolean);
  } catch {
    return [];
  }
}

async function commitBody(sha: string, projectRoot: string): Promise<string> {
  try {
    return execSync(`git log -1 --format=%B ${sha}`, {
      cwd: projectRoot,
      encoding: "utf8",
      stdio: ["pipe", "pipe", "ignore"],
    });
  } catch {
    return "";
  }
}

export const gitTrailerSource: ProvenanceSignalSource = {
  id: "git-trailer",
  async detectForFile(file, projectRoot) {
    const commits = await fileCommits(file, projectRoot, 20);
    if (commits.length === 0) return [];

    let aiCommits = 0;
    const agentsSeen = new Set<string>();
    let sawBot = false;
    let sawExplicitHeader = false;

    for (const sha of commits) {
      const body = await commitBody(sha, projectRoot);
      const trailerMatch = body.match(AI_TRAILER_PATTERN);
      if (trailerMatch?.[1]) {
        aiCommits++;
        agentsSeen.add(trailerMatch[1]);
        continue;
      }
      if (BOT_TRAILER_PATTERN.test(body)) {
        aiCommits++;
        sawBot = true;
        continue;
      }
      if (AI_PROVENANCE_HEADER.test(body)) {
        aiCommits++;
        sawExplicitHeader = true;
      }
    }

    if (aiCommits === 0) return [];

    const agents = agentsSeen.size > 0 ? [...agentsSeen].join(", ") : null;
    const badges: string[] = [];
    if (agents) badges.push(agents);
    if (sawBot) badges.push("[bot]");
    if (sawExplicitHeader) badges.push("explicit provenance header");

    const signal: ProvenanceSignal = {
      name: "git-trailer",
      weight: 1.0,
      fired: true,
      detail: `${aiCommits}/${commits.length} recent commits touching this file carry an AI co-authorship trailer (${badges.join(", ")})`,
    };
    return [signal];
  },
};
