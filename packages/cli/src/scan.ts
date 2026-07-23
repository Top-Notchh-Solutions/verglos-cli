import { resolve } from "node:path";
import { runScan } from "@verglos/scanner";
import {
  printMomentum,
  printScoreOnly,
  printTerminalSummary,
  writeReports,
} from "@verglos/reporter";
import type { DetectorId } from "@verglos/shared";
import ora from "ora";
import { loadLastScore, saveLastScore } from "./credentials.js";
import { ensureConfig } from "./config.js";

export interface ScanCommandOptions {
  cwd?: string;
  detectors?: DetectorId[];
  quiet?: boolean;
  watch?: boolean;
  all?: boolean;
  strict?: boolean;
  noProvenance?: boolean;
  verifySecrets?: boolean;
}

export async function executeScan(
  options: ScanCommandOptions = {},
): Promise<number> {
  const projectRoot = resolve(options.cwd ?? process.cwd());
  await ensureConfig(projectRoot);

  const spinner = options.quiet ? null : ora("Scanning project...").start();

  const previous = await loadLastScore(projectRoot);

  const result = await runScan({
    projectRoot,
    detectors: options.detectors,
    unlocked: true,
    includeGitHistory: true,
    minConfidence: options.all ? 0 : undefined,
    strict: options.strict,
    noProvenance: options.noProvenance,
    verifySecrets: options.verifySecrets,
  });

  spinner?.stop();
  await writeReports(result, projectRoot);

  if (!options.quiet) {
    printTerminalSummary(result);
    printMomentum(
      previous?.score,
      result.score.value,
      result.score.counts.critical,
    );
  }

  await saveLastScore(
    projectRoot,
    result.score.value,
    result.score.counts.critical,
  );

  return result.score.value;
}

export async function executeScore(cwd?: string, strict = false): Promise<void> {
  const projectRoot = resolve(cwd ?? process.cwd());

  const result = await runScan({
    projectRoot,
    unlocked: true,
    strict,
  });

  printScoreOnly(result);
}

export async function executeCi(options: {
  cwd?: string;
  threshold?: number;
  quiet?: boolean;
  strict?: boolean;
}): Promise<number> {
  const projectRoot = resolve(options.cwd ?? process.cwd());

  const result = await runScan({
    projectRoot,
    unlocked: true,
    strict: options.strict,
  });

  if (!options.quiet) {
    printTerminalSummary(result);
  }

  if (result.score.counts.critical > 0) {
    if (!options.quiet) {
      console.error("CI failed: critical security issues found.");
    }
    return 1;
  }

  const threshold = options.threshold ?? 60;
  if (result.score.value < threshold) {
    if (!options.quiet) {
      console.error(`CI failed: score ${result.score.value} below threshold ${threshold}.`);
    }
    return 1;
  }

  return 0;
}
