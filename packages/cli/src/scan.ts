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
  { detector: "deep-auth", capability: "rule_pack_deep_auth" },
];

const require = createRequire(import.meta.url);
const { version: CLI_VERSION } = require("../package.json") as {
  version: string;
};

export interface ScanCommandOptions {
  cwd?: string;
  configPath?: string;
  outputDir?: string;
  json?: boolean;
  detectors?: DetectorId[];
  quiet?: boolean;
  watch?: boolean;
  all?: boolean;
  strict?: boolean;
  noProvenance?: boolean;
  verifySecrets?: boolean;
  noTelemetry?: boolean;
  hunt?: boolean;
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

  const spinner = options.quiet || options.json ? null : ora("Scanning project...").start();

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
      configPath: options.configPath,
      detectors,
      unlocked: true,
      includeGitHistory: options.includeGitHistory ?? true,
      minConfidence: options.all ? 0 : undefined,
      strict: options.strict,
      noProvenance: options.focused ? true : options.noProvenance,
      verifySecrets: options.verifySecrets,
      onProgress: (event) => {
        if (!spinner) return;
        const label = event.detector ? `${event.phase} ${event.detector}` : event.phase;
        const verb = event.status === "started" ? "Scanning" : event.status === "skipped" ? "Skipped" : "Completed";
        spinner.text = `${verb} ${label}...`;
      },
    });
  } finally {
    if (tickTimer) clearInterval(tickTimer);
  }

  const durationMs = Date.now() - startedAt;
  spinner?.stop();
  await writeReports(result, projectRoot, options.outputDir ? resolve(projectRoot, options.outputDir) : projectRoot);

  if (options.json) {
    console.log(JSON.stringify(result));
  } else if (!options.quiet) {
    printTerminalSummary(result);
    if (options.hunt) {
      console.log("  Hunt integration shipping in v2.0.0-beta");
      console.log("");
    }
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

  // Machine/non-interactive output must not silently attach project or paid
  // identity telemetry; interactive scans retain the documented opt-out model.
  if (!isTelemetryDisabled(options.noTelemetry, Boolean(options.quiet || options.json))) {
    if (!options.quiet) await printFirstRunDisclosureIfNeeded();
    // Fire-and-forget. Awaited so the CLI stays around long enough to
    // send in short-lived processes (npx one-shots), but errors are
    // swallowed inside sendScanEvent. 2s timeout inside.
    await sendScanEvent(result, {
      cliVersion: CLI_VERSION,
      durationMs,
      detectorsRun: detectors,
      verifySecrets: options.verifySecrets,
    });
  }

  return result.score.value;
}

export async function executeScore(cwd?: string, strict = false, quiet = false, configPath?: string, json = false): Promise<void> {
  const projectRoot = resolve(cwd ?? process.cwd());

  const result = await runScan({
    projectRoot,
    configPath,
    unlocked: true,
    strict,
  });

  if (json) console.log(JSON.stringify(result.score));
  else if (!quiet) printScoreOnly(result);
}

export async function executeCi(options: {
  cwd?: string;
  threshold?: number;
  quiet?: boolean;
  strict?: boolean;
  noTelemetry?: boolean;
  hunt?: boolean;
  configPath?: string;
  json?: boolean;
}): Promise<number> {
  const projectRoot = resolve(options.cwd ?? process.cwd());
  const startedAt = Date.now();

  const result = await runScan({
    projectRoot,
    configPath: options.configPath,
    unlocked: true,
    strict: options.strict,
  });

  const durationMs = Date.now() - startedAt;
  if (options.json) console.log(JSON.stringify({ score: result.score, findings: result.findings }));
  else if (!options.quiet) {
    printTerminalSummary(result);
    if (options.hunt) {
      console.log("Verified-only CI gating shipping in v2.0.0-beta");
      console.log("Falling back to standard CI gating for this alpha run.");
      console.log("");
    }
  }

  // CI is non-interactive: telemetry is opt-in via an explicit standalone
  // telemetry integration, never an implicit bearer-associated scan write.
  if (!isTelemetryDisabled(options.noTelemetry, true)) {
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
