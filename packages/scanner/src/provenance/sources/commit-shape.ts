import { execSync } from "node:child_process";
import type {
  ProvenanceSignal,
  ProvenanceSignalSource,
} from "../types.js";

/**
 * Strong-tier signal from design §4, weight 0.7.
 *
 * AI-authored commits have a characteristic shape a human working
 * alone rarely produces:
 *   - >400 lines added in a single commit
 *   - <5 minutes after the previous commit
 *   - across >3 files
 *
 * When all three fire at once, that's an agent flushing a
 * multi-file plan in one shot. Fires per file: if any recent
 * commit touching a file has the AI shape, the file gets flagged.
 *
 * Computation is batched: on the first per-file call we walk the
 * last 200 commits repo-wide, identify AI-shape commits, and
 * build a `file → shapeCommitCount` map. Subsequent calls hit
 * the cache. This keeps the per-file contract clean while doing
 * the expensive work exactly once.
 */

const RECENT_COMMIT_LIMIT = 200;
const AI_SHAPE_LINES_ADDED = 400;
const AI_SHAPE_MAX_SECONDS_SINCE_PREV = 300; // 5 minutes
const AI_SHAPE_MIN_FILES = 3;

interface CommitShapeMeta {
  sha: string;
  linesAdded: number;
  files: string[];
  secondsSincePrev: number | null;
}

let cache: Map<string, number> | null = null;
let cacheProjectRoot: string | null = null;

function resetCache(projectRoot: string): void {
  cache = new Map();
  cacheProjectRoot = projectRoot;
}

async function loadCommitShapes(
  projectRoot: string,
): Promise<CommitShapeMeta[]> {
  let raw: string;
  try {
    raw = execSync(
      `git log --format='<<%H %at>>' --numstat -n ${RECENT_COMMIT_LIMIT}`,
      {
        cwd: projectRoot,
        encoding: "utf8",
        maxBuffer: 20 * 1024 * 1024,
        stdio: ["pipe", "pipe", "ignore"],
      },
    );
  } catch {
    return [];
  }

  const commits: CommitShapeMeta[] = [];
  let current: CommitShapeMeta | null = null;

  const lines = raw.split("\n");
  for (const line of lines) {
    const header = line.match(/^<<([0-9a-f]{7,40})\s+(\d+)>>$/);
    if (header) {
      if (current) commits.push(current);
      current = {
        sha: header[1]!,
        linesAdded: 0,
        files: [],
        secondsSincePrev: null,
      };
      // Timestamp stored on the "next" iteration below via the map.
      // We store epoch seconds on secondsSincePrev temporarily and
      // convert in a second pass.
      current.secondsSincePrev = Number(header[2]);
      continue;
    }
    if (!current || !line.trim()) continue;
    // numstat: <added>\t<removed>\t<path> (added may be "-" for binary)
    const parts = line.split("\t");
    if (parts.length < 3) continue;
    const added = parts[0] === "-" ? 0 : Number(parts[0]) || 0;
    const file = parts[2] ?? "";
    current.linesAdded += added;
    if (file) current.files.push(file);
  }
  if (current) commits.push(current);

  // Second pass: convert stored timestamp into secondsSincePrev
  // (commits[] is newest→oldest; "prev" is the commit AFTER in the array).
  for (let i = 0; i < commits.length - 1; i++) {
    const now = commits[i]!.secondsSincePrev ?? 0;
    const prev = commits[i + 1]!.secondsSincePrev ?? 0;
    commits[i]!.secondsSincePrev = now - prev;
  }
  // Oldest commit has no predecessor in our window.
  if (commits.length > 0) {
    commits[commits.length - 1]!.secondsSincePrev = null;
  }

  return commits;
}

function isAiShape(commit: CommitShapeMeta): boolean {
  if (commit.linesAdded < AI_SHAPE_LINES_ADDED) return false;
  if (commit.files.length < AI_SHAPE_MIN_FILES) return false;
  if (commit.secondsSincePrev === null) return false;
  if (commit.secondsSincePrev > AI_SHAPE_MAX_SECONDS_SINCE_PREV) return false;
  return true;
}

async function ensureCache(projectRoot: string): Promise<void> {
  if (cache && cacheProjectRoot === projectRoot) return;
  resetCache(projectRoot);
  const commits = await loadCommitShapes(projectRoot);
  for (const commit of commits) {
    if (!isAiShape(commit)) continue;
    for (const file of commit.files) {
      cache!.set(file, (cache!.get(file) ?? 0) + 1);
    }
  }
}

/** Test hook — clears the module-level cache between runs. */
export function _resetCommitShapeCache(): void {
  cache = null;
  cacheProjectRoot = null;
}

export const commitShapeSource: ProvenanceSignalSource = {
  id: "commit-shape",
  async detectForFile(file, projectRoot) {
    await ensureCache(projectRoot);
    const shapeCount = cache!.get(file) ?? 0;
    if (shapeCount === 0) return [];
    const signal: ProvenanceSignal = {
      name: "commit-shape",
      weight: 0.7,
      fired: true,
      detail: `Touched by ${shapeCount} recent commit${shapeCount === 1 ? "" : "s"} with AI shape (>400 LOC, <5min after previous, >3 files)`,
    };
    return [signal];
  },
};
