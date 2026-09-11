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
import { lstat, readFile } from "node:fs/promises";
import { isAbsolute, resolve } from "node:path";
import { agentSurfaceDetector } from "./detectors/agent-surface.js";
import { aiPatternsDetector } from "./detectors/ai-patterns.js";
import { apiHardeningDetector } from "./detectors/api-hardening.js";
import { deepAuthDetector } from "./detectors/deep-auth.js";
import { dependenciesDetector } from "./detectors/dependencies.js";
import { gitHistoryDetector } from "./detectors/git-history.js";
import { injectionDetector } from "./detectors/injection.js";
import { misconfigDetector } from "./detectors/misconfig.js";
import { secretsDetector } from "./detectors/secrets.js";
import { slopsquatDetector } from "./detectors/slopsquat.js";
import { vendoredCvesDetector } from "./detectors/vendored-cves.js";
import type { Detector } from "./detectors/types.js";
import { detectProjectType } from "./project.js";
import { walkProject } from "./walker.js";
import { classifyFindings } from "./context.js";
import { applyContextTags } from "./context-tags.js";
import { computeProvenance } from "./provenance/index.js";

const ALL_DETECTORS: Detector[] = [
  secretsDetector,
  dependenciesDetector,
  misconfigDetector,
  injectionDetector,
  gitHistoryDetector,
  aiPatternsDetector,
  slopsquatDetector,
  vendoredCvesDetector,
  // Pro-gated (`rule_pack_agent_surface`). Included in the detector
  // pipeline unconditionally; the CLI layer decides whether to pass
  // "agent-surface" in ScanOptions.detectors based on entitlement.
  agentSurfaceDetector,
  // Pro-gated (`rule_pack_api_hardening`). Same wiring — the CLI
  // decides whether to include "api-hardening" in ScanOptions.detectors.
  apiHardeningDetector,
  // Pro-gated (`rule_pack_deep_auth`). Same wiring.
  deepAuthDetector,
];

const MAX_CONFIG_BYTES = 1 * 1024 * 1024;
const MAX_IGNORE_BYTES = 256 * 1024;
const MAX_IGNORE_LINES = 4096;
const MAX_IGNORE_LINE_BYTES = 512;
const MAX_TOTAL_IGNORE_PATHS = 256;
const DEFAULT_DETECTOR_CONCURRENCY = 2;

async function runDetectorsBounded<T>(items: readonly Detector[], concurrency: number, run: (detector: Detector) => Promise<readonly T[]>, signal?: AbortSignal): Promise<T[]> {
  const results: T[][] = Array.from({ length: items.length }, () => []);
  let next = 0;
  const worker = async () => {
    while (true) {
      if (signal?.aborted) throw new Error("scan cancelled");
      const index = next++;
      if (index >= items.length) return;
      results[index] = [...await run(items[index]!)];
    }
  };
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => worker()));
  return results.flat();
}

async function loadIgnoreFile(projectRoot: string): Promise<string[]> {
  try {
    const ignorePath = `${projectRoot}/.verglosignore`;
    const entry = await lstat(ignorePath);
    if (!entry.isFile() || entry.size > MAX_IGNORE_BYTES) return [];
    const { readFile } = await import("node:fs/promises");
    const bytes = await readFile(ignorePath);
    if (bytes.byteLength > MAX_IGNORE_BYTES) return [];
    const raw = bytes.toString("utf8");
    const lines = raw.split("\n");
    if (lines.length > MAX_IGNORE_LINES || lines.some((line) => Buffer.byteLength(line, "utf8") > MAX_IGNORE_LINE_BYTES)) return [];
    return lines
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.startsWith("#"));
  } catch {
    return [];
  }
}

export async function loadConfig(projectRoot: string, explicitConfigPath?: string): Promise<VerglosConfig> {
  let base: VerglosConfig;
  if (explicitConfigPath) {
    const configPath = isAbsolute(explicitConfigPath) ? explicitConfigPath : resolve(projectRoot, explicitConfigPath);
    const entry = await lstat(configPath);
    if (!entry.isFile() || entry.size > MAX_CONFIG_BYTES) throw new Error("Verglos config must be a bounded regular file.");
    const bytes = await readFile(configPath);
    if (bytes.byteLength > MAX_CONFIG_BYTES) throw new Error("Verglos config must be a bounded regular file.");
    let parsed: unknown;
    try { parsed = JSON.parse(bytes.toString("utf8")); } catch { throw new Error("Verglos config must be valid JSON."); }
    base = mergeConfig(parsed as Partial<VerglosConfig>);
  } else try {
    const { createRequire } = await import("node:module");
    const require = createRequire(import.meta.url);
    const configPath = `${projectRoot}/.verglos.config.js`;
    const entry = await lstat(configPath);
    if (!entry.isFile() || entry.size > MAX_CONFIG_BYTES) throw new Error("implicit config is not a bounded regular file");
    const mod = require(configPath);
    base = mergeConfig(mod.default ?? mod);
  } catch {
    base = mergeConfig({});
  }

  const extraIgnores = await loadIgnoreFile(projectRoot);
  if (extraIgnores.length === 0) return base;
  if (base.ignorePaths.length + extraIgnores.length > MAX_TOTAL_IGNORE_PATHS) return base;
  return { ...base, ignorePaths: [...base.ignorePaths, ...extraIgnores] };
}

export async function runScan(options: ScanOptions): Promise<ScanResult> {
  if (options.signal?.aborted) throw new Error("scan cancelled");
  const detectorConcurrency = options.detectorConcurrency ?? DEFAULT_DETECTOR_CONCURRENCY;
  if (!Number.isInteger(detectorConcurrency) || detectorConcurrency < 1 || detectorConcurrency > 8) throw new Error("detector concurrency must be between 1 and 8");
  const start = Date.now();
  const config = await loadConfig(options.projectRoot, options.configPath);
  const { type: projectType } = await detectProjectType(options.projectRoot);
  const files = await walkProject(options.projectRoot, config);

  const detectorIds = [...(options.detectors ?? [
    "secrets",
    "dependencies",
    "misconfig",
    "injection",
    "ai-patterns",
    "slopsquat",
    "vendored-cves",
  ])];

  if (detectorIds.length > ALL_DETECTORS.length) throw new Error("scan detector selection exceeds the supported bound");
  if (new Set(detectorIds).size !== detectorIds.length) throw new Error("scan detector selection cannot repeat detectors");
  const knownDetectorIds = new Set(ALL_DETECTORS.map((detector) => detector.id));
  if (detectorIds.some((id) => !knownDetectorIds.has(id))) throw new Error("scan detector selection contains an unsupported detector");

  if (options.includeGitHistory && !detectorIds.includes("git-history")) {
    detectorIds.push("git-history");
  }

  const activeDetectors = ALL_DETECTORS.filter((d) =>
    detectorIds.includes(d.id as DetectorId),
  );

  const detectorContext = {
    verifySecrets: options.verifySecrets,
  };
  const rawFindings = await runDetectorsBounded(activeDetectors, detectorConcurrency, (detector) => detector.run(files, options.projectRoot, detectorContext), options.signal);
  if (options.signal?.aborted) throw new Error("scan cancelled");
  const minConfidence = options.minConfidence ?? DEFAULT_MIN_CONFIDENCE;
  const filteredFindings = rawFindings.filter(
    (f) => toConfidenceNumeric(f.confidence) >= minConfidence,
  );
  const classifiedFindings = classifyFindings(filteredFindings, options.strict ?? false);
  // Post-classify pass: downgrade findings in non-production contexts
  // (docs, dev-fixture, ci-workflow, vendored-bundle, test-fixture,
  // etc.). Preserves the raw severity on originalSeverity so reports
  // can show *why* a downgrade happened. See context-tags.ts.
  const allFindings = applyContextTags(classifiedFindings, options.strict ?? false);
  const rawScore = calculateScore(allFindings, options.strict ?? false);
  // Detect unsupported-language repos so we stop reporting 100/100
  // for Python/Ruby/Go/Elixir/PHP where the scanner produced almost
  // nothing. Threshold: fewer than 5 JS/TS files walked AND no
  // findings emitted at all. In that case the "100" is a lie —
  // there was nothing to scan.
  const jsTsFileCount = files.filter((f) =>
    /\.(m?[jt]sx?|mts|cts)$/.test(f.relativePath),
  ).length;
  const isUnsupported =
    jsTsFileCount < 5 && allFindings.length === 0 && rawScore.value === 100;
  const score = isUnsupported
    ? {
        ...rawScore,
        riskLevel: "unsupported" as const,
        unsupportedLanguage: {
          reason:
            "This repo has fewer than 5 JS/TS files and produced no findings. Verglos scans JavaScript/TypeScript; a 100/100 score here would be misleading. Full multi-language support ships in v2.",
          jsTsFileCount,
        },
      }
    : rawScore;
  const unlocked = options.unlocked ?? false;

  const provenance = options.noProvenance
    ? undefined
    : await computeProvenance(files, options.projectRoot, allFindings);
  if (options.signal?.aborted) throw new Error("scan cancelled");

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
