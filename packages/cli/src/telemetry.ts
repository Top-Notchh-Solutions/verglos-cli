import { randomUUID } from "node:crypto";
import { mkdir, access, writeFile } from "node:fs/promises";
import { homedir, platform } from "node:os";
import { join } from "node:path";
import chalk from "chalk";
import type { ScanResult } from "@verglos/shared";
import { computeProjectFingerprint } from "@verglos/shared";
import { DEFAULT_API_URL, loadCredentials } from "./credentials.js";

// Anonymous scan telemetry. One event per `verglos scan`. Users can opt
// out with `VERGLOS_TELEMETRY=0`. What we send is documented in the
// project FAQ and in this file's payload builder. Nothing here touches
// source code, file paths, finding titles, or user identity.
//
// If this fails for any reason — network offline, DNS block, server
// down, JSON serialisation error — we swallow it. Scans are never
// interrupted by telemetry.

const TIMEOUT_MS = 2000;
const DISCLOSURE_MARKER = join(homedir(), ".verglos", "telemetry-disclosed");

export function isTelemetryDisabled(explicitFlag?: boolean): boolean {
  if (explicitFlag === true) return true;
  const raw = process.env.VERGLOS_TELEMETRY;
  if (raw == null) return false;
  const v = raw.trim().toLowerCase();
  return v === "0" || v === "false" || v === "off" || v === "no";
}

export async function printFirstRunDisclosureIfNeeded(): Promise<void> {
  try {
    await access(DISCLOSURE_MARKER);
    return;
  } catch {
    // marker missing → first run
  }

  console.log("");
  console.log(
    chalk.gray(
      "Verglos sends one anonymous event per scan (version, duration, counts).",
    ),
  );
  console.log(
    chalk.gray(
      "  No code, no findings text, no identity. Opt out: VERGLOS_TELEMETRY=0",
    ),
  );
  console.log("");

  try {
    await mkdir(join(homedir(), ".verglos"), { recursive: true });
    await writeFile(DISCLOSURE_MARKER, new Date().toISOString(), "utf8");
  } catch {
    // Non-fatal — worst case we show it again next run.
  }
}

interface SendOptions {
  cliVersion: string;
  durationMs: number;
  detectorsRun?: string[];
  verifySecrets?: boolean;
}

export async function sendScanEvent(
  result: ScanResult,
  opts: SendOptions,
): Promise<void> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  // Fingerprint the project so the server can group score-history
  // rows per repo without ever seeing a path. Cheap — hashes the
  // git remote + package.json name + resolved root.
  let fingerprint: string | undefined;
  try {
    const fp = await computeProjectFingerprint(result.projectRoot);
    fingerprint = fp.fingerprint ?? undefined;
  } catch {
    // Fingerprint failure is non-fatal — anonymous rows still land.
  }

  const payload = {
    event_id: randomUUID(),
    fingerprint,
    cli_version: opts.cliVersion,
    node_version: process.version,
    platform: platform(),
    score: result.score.value,
    finding_critical: result.score.counts.critical,
    finding_high: result.score.counts.high,
    finding_medium: result.score.counts.medium,
    finding_low: result.score.counts.low,
    finding_info: result.score.counts.info,
    ai_authored_percent: result.provenance?.aiAuthoredPercent,
    has_provenance: !!result.provenance,
    verify_secrets: opts.verifySecrets,
    duration_ms: opts.durationMs,
    detectors: opts.detectorsRun,
  };

  // Attach the license key when we have one, so the server can also
  // write a score_history row keyed on the license for the Pro
  // dashboard's 30/365/1095-day trend. Free users never send this
  // header — telemetry stays anonymous.
  const creds = await loadCredentials().catch(() => null);
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (creds?.licenseKey) {
    headers.authorization = `Bearer ${creds.licenseKey}`;
  }

  try {
    await fetch(`${DEFAULT_API_URL}/api/v1/telemetry/scan`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal,
      // No keep-alive; one-shot request.
    });
  } catch {
    // Swallow every possible failure. Silent by design.
  } finally {
    clearTimeout(timer);
  }
}
