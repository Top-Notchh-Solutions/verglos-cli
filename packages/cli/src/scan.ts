import { createRequire } from "node:module";
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
import {
  isTelemetryDisabled,
  printFirstRunDisclosureIfNeeded,
  sendScanEvent,
} from "./telemetry.js";

const require = createRequire(import.meta.url);
const { version: CLI_VERSION } = require("../package.json") as {
  version: string;
};

export interface ScanCommandOptions {
  cwd?: string;
  detectors?: DetectorId[];
  quiet?: boolean;
  watch?: boolean;
  all?: boolean;
  strict?: boolean;
  noProvenance?: boolean;
  verifySecrets?: boolean;
  noTelemetry?: boolean;
}

export async function executeScan(
  options: ScanCommandOptions = {},
): Promise<number> {
  const projectRoot = resolve(options.cwd ?? process.cwd());
  await ensureConfig(projectRoot);

  const spinner = options.quiet ? null : ora("Scanning project...").start();

  const previous = await loadLastScore(projectRoot);
  const startedAt = Date.now();

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

  const durationMs = Date.now() - startedAt;
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

  if (!isTelemetryDisabled(options.noTelemetry)) {
    if (!options.quiet) await printFirstRunDisclosureIfNeeded();
    // Fire-and-forget. Awaited so the CLI stays around long enough to
    // send in short-lived processes (npx one-shots), but errors are
    // swallowed inside sendScanEvent. 2s timeout inside.
    await sendScanEvent(result, {
      cliVersion: CLI_VERSION,
      durationMs,
      detectorsRun: options.detectors,
      verifySecrets: options.verifySecrets,
    });
  }

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
  noTelemetry?: boolean;
}): Promise<number> {
  const projectRoot = resolve(options.cwd ?? process.cwd());
  const startedAt = Date.now();

  const result = await runScan({
    projectRoot,
    unlocked: true,
    strict: options.strict,
  });

  const durationMs = Date.now() - startedAt;
  if (!options.quiet) {
    printTerminalSummary(result);
  }

  if (!isTelemetryDisabled(options.noTelemetry)) {
    await sendScanEvent(result, {
      cliVersion: CLI_VERSION,
      durationMs,
    });
  }

  if (result.score.counts.critical > 0) {
    if (!options.quiet) {
      console.error("CI failed: critical security issues found.");
    }
    return 1;
  }

  // Undefined threshold = free-tier CI (skip threshold enforcement).
  // Caller upstream in index.ts prints the upgrade hint. Free still
  // fails on criticals above, so `verglos ci` is genuinely useful on
  // Free — it just doesn't gate on the composite score.
  if (options.threshold === undefined) return 0;

  if (result.score.value < options.threshold) {
    if (!options.quiet) {
      console.error(
        `CI failed: score ${result.score.value} below threshold ${options.threshold}.`,
      );
    }
    return 1;
  }

  return 0;
}
