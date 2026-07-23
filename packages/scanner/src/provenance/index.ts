import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type {
  Finding,
  ProvenanceBucket,
  ProvenanceConfidence,
  RepoProvenance,
} from "@verglos/shared";
import type { ScannedFile } from "../walker.js";
import { agentArtifactSource } from "./sources/agent-artifacts.js";
import { codeShapeSource } from "./sources/code-shape.js";
import { commitShapeSource } from "./sources/commit-shape.js";
import { gitTrailerSource } from "./sources/git-trailer.js";
import type {
  FileProvenance,
  ProvenanceSignal,
  ProvenanceSignalSource,
  RepoLevelSignal,
  RepoLevelSignalSource,
} from "./types.js";

export type {
  FileProvenance,
  ProvenanceSignal,
  RepoLevelSignal,
} from "./types.js";

/**
 * Per-file signal sources, ordered by strength:
 * certain → strong → medium → weak. Aggregation short-circuits on
 * certain-tier evidence (weight 1.0 sets aiLikelihood to 1.0).
 */
export const SIGNAL_SOURCES: ProvenanceSignalSource[] = [
  gitTrailerSource,
  commitShapeSource,
  codeShapeSource,
];

/**
 * Repo-level signal sources — evidence about the whole codebase
 * rather than a single file. Fire once per scan and contribute
 * a prior boost that raises every file's aiLikelihood.
 */
export const REPO_LEVEL_SOURCES: RepoLevelSignalSource[] = [
  agentArtifactSource,
];

const SUPPORTED_EXT = /\.(?:m?[jt]sx?|mts|cts)$/;

/** Bucket thresholds discussion. */
const AI_LIKELY_THRESHOLD = 0.7;
const MIXED_THRESHOLD = 0.4;

/** Ratio guardrail that prevents unstable density ratios. */
const RATIO_MIN_LOC_PER_BUCKET = 200;

async function fileLineCount(
  projectRoot: string,
  file: string,
): Promise<number> {
  try {
    const content = await readFile(join(projectRoot, file), "utf8");
    return content.split("\n").length;
  } catch {
    return 0;
  }
}

/**
 * Combine independent signal weights into an aiLikelihood using
 * probabilistic OR: 1 - Π(1 - w). A single certain signal (w=1.0)
 * short-circuits to 1.0. Adds a repo-level prior boost afterward
 * and clamps to [0, 1].
 */
function combineSignals(
  signals: ProvenanceSignal[],
  priorBoost: number,
): number {
  const fired = signals.filter((s) => s.fired);
  if (fired.some((s) => s.weight >= 1.0)) return 1.0;
  let negProb = 1;
  for (const sig of fired) {
    negProb *= 1 - sig.weight;
  }
  const raw = 1 - negProb;
  return Math.max(0, Math.min(1, raw + priorBoost));
}

function bucketFor(
  likelihood: number,
  hasAnyEvidence: boolean,
): ProvenanceBucket {
  if (!hasAnyEvidence) return "unknown";
  if (likelihood >= AI_LIKELY_THRESHOLD) return "ai-likely";
  if (likelihood >= MIXED_THRESHOLD) return "mixed";
  return "human-likely";
}

function confidenceFor(signals: ProvenanceSignal[]): ProvenanceConfidence {
  const fired = signals.filter((s) => s.fired);
  if (fired.some((s) => s.weight >= 1.0)) return "high";
  if (fired.some((s) => s.weight >= 0.7)) return "medium";
  if (fired.length > 0) return "low";
  return "low";
}

async function detectFileProvenance(
  file: string,
  projectRoot: string,
  priorBoost: number,
  priorDetail: string | null,
): Promise<FileProvenance> {
  const allSignals: ProvenanceSignal[] = [];
  for (const source of SIGNAL_SOURCES) {
    const sigs = await source.detectForFile(file, projectRoot);
    allSignals.push(...sigs);
  }

  const likelihood = combineSignals(allSignals, priorBoost);
  const hasAnyEvidence = allSignals.length > 0 || priorBoost > 0;
  const bucket = bucketFor(likelihood, hasAnyEvidence);
  const confidence = confidenceFor(allSignals);
  const lineCount = await fileLineCount(projectRoot, file);

  const signalDetails: string[] = [];
  for (const sig of allSignals) {
    if (!sig.fired) continue;
    signalDetails.push(
      sig.detail ? `${sig.name}: ${sig.detail}` : sig.name,
    );
  }
  if (priorDetail && priorBoost > 0) signalDetails.push(priorDetail);

  return {
    file,
    aiLikelihood: likelihood,
    bucket,
    signals: signalDetails,
    confidence,
    lineCount,
  };
}

async function collectRepoSignals(
  projectRoot: string,
): Promise<{ priorBoost: number; signals: RepoLevelSignal[] }> {
  const signals: RepoLevelSignal[] = [];
  for (const source of REPO_LEVEL_SOURCES) {
    signals.push(...(await source.detectForRepo(projectRoot)));
  }
  const priorBoost = signals
    .filter((s) => s.fired)
    .reduce((acc, s) => acc + s.priorBoost, 0);
  return { priorBoost, signals };
}

function pickRepoConfidence(
  fileProvenance: FileProvenance[],
): ProvenanceConfidence {
  if (fileProvenance.some((f) => f.confidence === "high")) return "high";
  if (fileProvenance.some((f) => f.confidence === "medium")) return "medium";
  return "low";
}

export async function computeProvenance(
  files: ScannedFile[],
  projectRoot: string,
  findings: Finding[],
): Promise<RepoProvenance> {
  const candidates = files.filter((f) => SUPPORTED_EXT.test(f.relativePath));
  if (candidates.length === 0) {
    return {
      aiAuthoredPercent: 0,
      findingDensityAI: 0,
      findingDensityHuman: 0,
      densityRatio: null,
      criticalsInAIFiles: 0,
      criticalsTotal: findings.filter((f) => f.severity === "critical").length,
      confidence: "low",
      method: "no JS/TS files to analyze",
    };
  }

  const { priorBoost, signals: repoSignals } = await collectRepoSignals(
    projectRoot,
  );
  const priorDetail =
    repoSignals.length > 0
      ? repoSignals
          .filter((s) => s.fired && s.detail)
          .map((s) => `${s.name}: ${s.detail}`)
          .join(" · ")
      : null;

  const fileProvenance = await Promise.all(
    candidates.map((f) =>
      detectFileProvenance(
        f.relativePath,
        projectRoot,
        priorBoost,
        priorDetail || null,
      ),
    ),
  );

  const fileMap = new Map<string, FileProvenance>();
  for (const fp of fileProvenance) fileMap.set(fp.file, fp);

  let totalLoc = 0;
  let aiLoc = 0;
  let humanLoc = 0;
  let weightedAiLoc = 0;
  for (const fp of fileProvenance) {
    totalLoc += fp.lineCount;
    weightedAiLoc += fp.lineCount * fp.aiLikelihood;
    if (fp.bucket === "ai-likely") aiLoc += fp.lineCount;
    else if (fp.bucket === "human-likely") humanLoc += fp.lineCount;
  }

  let findingsAI = 0;
  let findingsHuman = 0;
  let criticalsInAIFiles = 0;
  let criticalsTotal = 0;
  for (const finding of findings) {
    if (finding.severity === "critical") criticalsTotal++;
    if (!finding.file) continue;
    const fp = fileMap.get(finding.file);
    if (!fp) continue;
    if (fp.bucket === "ai-likely") {
      findingsAI++;
      if (finding.severity === "critical") criticalsInAIFiles++;
    } else if (fp.bucket === "human-likely") {
      findingsHuman++;
    }
  }

  const aiAuthoredPercent =
    totalLoc === 0
      ? 0
      : Math.round((weightedAiLoc / totalLoc) * 1000) / 10; // 0.1% precision
  const findingDensityAI =
    aiLoc === 0 ? 0 : (findingsAI / aiLoc) * 1000;
  const findingDensityHuman =
    humanLoc === 0 ? 0 : (findingsHuman / humanLoc) * 1000;

  const repoConfidence = pickRepoConfidence(fileProvenance);

  /**
   * Guardrails:
   *   Both buckets ≥200 LOC AND repo confidence ≥ medium AND
   *   human-density > 0. Otherwise the ratio is undefined or
   *   embarrassing — print the percentage alone instead.
   */
  const guardrailsPass =
    aiLoc >= RATIO_MIN_LOC_PER_BUCKET &&
    humanLoc >= RATIO_MIN_LOC_PER_BUCKET &&
    (repoConfidence === "high" || repoConfidence === "medium") &&
    findingDensityHuman > 0;

  const densityRatio = guardrailsPass
    ? Math.round((findingDensityAI / findingDensityHuman) * 10) / 10
    : null;

  const firedRepoSignals = repoSignals
    .filter((s) => s.fired)
    .map((s) => s.name);
  const firedFileSources = new Set<string>();
  for (const fp of fileProvenance) {
    for (const detail of fp.signals) {
      const name = detail.split(":")[0]?.trim();
      if (name) firedFileSources.add(name);
    }
  }
  const method =
    firedRepoSignals.length + firedFileSources.size === 0
      ? "no signals fired"
      : [...firedRepoSignals, ...firedFileSources].join(", ");

  return {
    aiAuthoredPercent,
    findingDensityAI: Math.round(findingDensityAI * 10) / 10,
    findingDensityHuman: Math.round(findingDensityHuman * 10) / 10,
    densityRatio,
    criticalsInAIFiles,
    criticalsTotal,
    confidence: repoConfidence,
    method,
  };
}
