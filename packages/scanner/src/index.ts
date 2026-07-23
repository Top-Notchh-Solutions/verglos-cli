import {
  calculateScore,
  DEFAULT_MIN_CONFIDENCE,
  mergeConfig,
  redactFindings,
  toConfidenceNumeric,
  type DetectorId,
  type ScanOptions,
  type ScanResult,
  type VerglosConfig,
} from "@verglos/shared";
import { aiPatternsDetector } from "./detectors/ai-patterns.js";
import { dependenciesDetector } from "./detectors/dependencies.js";
import { gitHistoryDetector } from "./detectors/git-history.js";
import { injectionDetector } from "./detectors/injection.js";
import { misconfigDetector } from "./detectors/misconfig.js";
import { secretsDetector } from "./detectors/secrets.js";
import { slopsquatDetector } from "./detectors/slopsquat.js";
import type { Detector } from "./detectors/types.js";
import { detectProjectType } from "./project.js";
import { walkProject } from "./walker.js";
import { classifyFindings } from "./context.js";
import { computeProvenance } from "./provenance/index.js";

const ALL_DETECTORS: Detector[] = [
  secretsDetector,
  dependenciesDetector,
  misconfigDetector,
  injectionDetector,
  gitHistoryDetector,
  aiPatternsDetector,
  slopsquatDetector,
];

async function loadIgnoreFile(projectRoot: string): Promise<string[]> {
  try {
    const { readFile } = await import("node:fs/promises");
    const raw = await readFile(`${projectRoot}/.verglosignore`, "utf8");
    return raw
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.startsWith("#"));
  } catch {
    return [];
  }
}

export async function loadConfig(projectRoot: string): Promise<VerglosConfig> {
  let base: VerglosConfig;
  try {
    const { createRequire } = await import("node:module");
    const require = createRequire(import.meta.url);
    const configPath = `${projectRoot}/.verglos.config.js`;
    const mod = require(configPath);
    base = mergeConfig(mod.default ?? mod);
  } catch {
    base = mergeConfig({});
  }

  const extraIgnores = await loadIgnoreFile(projectRoot);
  if (extraIgnores.length === 0) return base;
  return { ...base, ignorePaths: [...base.ignorePaths, ...extraIgnores] };
}

export async function runScan(options: ScanOptions): Promise<ScanResult> {
  const start = Date.now();
  const config = await loadConfig(options.projectRoot);
  const { type: projectType } = await detectProjectType(options.projectRoot);
  const files = await walkProject(options.projectRoot, config);

  const detectorIds = options.detectors ?? [
    "secrets",
    "dependencies",
    "misconfig",
    "injection",
    "ai-patterns",
    "slopsquat",
  ];

  if (options.includeGitHistory) {
    detectorIds.push("git-history");
  }

  const activeDetectors = ALL_DETECTORS.filter((d) =>
    detectorIds.includes(d.id as DetectorId),
  );

  const detectorContext = {
    verifySecrets: options.verifySecrets,
  };
  const results = await Promise.all(
    activeDetectors.map((d) =>
      d.run(files, options.projectRoot, detectorContext),
    ),
  );

  const rawFindings = results.flat();
  const minConfidence = options.minConfidence ?? DEFAULT_MIN_CONFIDENCE;
  const filteredFindings = rawFindings.filter(
    (f) => toConfidenceNumeric(f.confidence) >= minConfidence,
  );
  const allFindings = classifyFindings(filteredFindings, options.strict ?? false);
  const score = calculateScore(allFindings, options.strict ?? false);
  const unlocked = options.unlocked ?? false;

  const provenance = options.noProvenance
    ? undefined
    : await computeProvenance(files, options.projectRoot, allFindings);

  return {
    projectRoot: options.projectRoot,
    projectType,
    scannedAt: new Date().toISOString(),
    durationMs: Date.now() - start,
    findings: redactFindings(allFindings, unlocked),
    score,
    unlocked,
    provenance,
  };
}

export { detectProjectType, getGitRemote } from "./project.js";
export { walkProject } from "./walker.js";

// Individual detectors — exported so the MCP fast path (check_before_write)
// can call a narrow subset without walking the whole project.
export { secretsDetector } from "./detectors/secrets.js";
export { injectionDetector } from "./detectors/injection.js";
export { aiPatternsDetector } from "./detectors/ai-patterns.js";
export { slopsquatDetector } from "./detectors/slopsquat.js";
export type { ScannedFile } from "./walker.js";
