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
import { has as hasCapability } from "./entitlement.js";
import {
  isTelemetryDisabled,
  printFirstRunDisclosureIfNeeded,
  sendScanEvent,
} from "./telemetry.js";

/**
 * Default detector set for a full `verglos scan`. Free-tier detectors
 * only. Pro rule packs are appended after an entitlement check.
 */
const FREE_DETECTORS: DetectorId[] = [
  "secrets",
  "dependencies",
  "misconfig",
  "injection",
  "ai-patterns",
  "slopsquat",
  "vendored-cves",
];

/**
 * Map of Pro detector ID → the capability string that gates it. When
 * a full scan runs, we check each capability and append the detector
 * only when the user is entitled. Free users see nothing changes;
 * paid users get the extra detector without needing a new flag.
 */
const PRO_DETECTOR_CAPABILITIES: Array<{
  detector: DetectorId;
  capability: string;
}> = [
  { detector: "agent-surface", capability: "rule_pack_agent_surface" },
  { detector: "api-hardening", capability: "rule_pack_api_hardening" },
];

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
  /**
   * Domain-focused scan (`verglos secrets`, `verglos deps`). Suppresses
   * baseline persistence and momentum output, and forces provenance off
   * — the composite score from a single detector is not comparable to a
   * full-scan baseline, so printing a delta would lie.
   */
  focused?: boolean;
  /**
   * Whether to include the git-history detector. Defaults to true. Set
   * false for `verglos deps`, where combing commits for leaked secrets
   * is unrelated to a dependency audit.
   */
  includeGitHistory?: boolean;
}

export async function executeScan(
  options: ScanCommandOptions = {},
): Promise<number> {
  const projectRoot = resolve(options.cwd ?? process.cwd());

  const spinner = options.quiet ? null : ora("Scanning project...").start();

  const previous = await loadLastScore(projectRoot);
  const startedAt = Date.now();

  // Tick the spinner text with elapsed seconds so the user can see
  // progress on big repos (a frozen "Scanning project..." message
  // reads as a hang after 60 seconds).
  const tickTimer = spinner
    ? setInterval(() => {
        const elapsed = Math.floor((Date.now() - startedAt) / 1000);
        const mm = Math.floor(elapsed / 60);
        const ss = String(elapsed % 60).padStart(2, "0");
        const label = mm > 0 ? `${mm}m ${ss}s` : `${elapsed}s`;
        spinner.text = `Scanning project... (${label})`;
        if (elapsed === 90) {
          spinner.text = `Scanning project... (${label}) — large repos may take a few minutes. --no-provenance skips the slowest step.`;
        }
      }, 1000)
    : null;

  // Resolve the detector list. Explicit --detectors (from `verglos
  // secrets` / `verglos deps`) wins. Otherwise, take the Free set and
  // append any Pro detectors the caller is entitled to. This is where
  // Pro rule packs (currently: agent-surface) light up automatically
  // for entitled users without changing the command signature.
  let detectors = options.detectors;
  if (!detectors) {
    detectors = [...FREE_DETECTORS];
    for (const { detector, capability } of PRO_DETECTOR_CAPABILITIES) {
      if (await hasCapability(capability)) {
        detectors.push(detector);
      }
    }
  }

  let result;
  try {
    result = await runScan({
      projectRoot,
      detectors,
      unlocked: true,
      includeGitHistory: options.includeGitHistory ?? true,
      minConfidence: options.all ? 0 : undefined,
      strict: options.strict,
      noProvenance: options.focused ? true : options.noProvenance,
      verifySecrets: options.verifySecrets,
    });
  } finally {
    if (tickTimer) clearInterval(tickTimer);
  }

  const durationMs = Date.now() - startedAt;
  spinner?.stop();
  await writeReports(result, projectRoot);

  if (!options.quiet) {
    printTerminalSummary(result);
    // A single-detector score is not comparable to a full-scan
    // baseline, so no momentum for focused runs.
    if (!options.focused) {
      printMomentum(
        previous?.score,
        result.score.value,
        result.score.counts.critical,
      );
    }
  }

  // Also skip persisting a focused-scan score as the new baseline —
  // it would poison the next full-scan's momentum.
  if (!options.focused) {
    await saveLastScore(
      projectRoot,
      result.score.value,
      result.score.counts.critical,
    );
  }

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
