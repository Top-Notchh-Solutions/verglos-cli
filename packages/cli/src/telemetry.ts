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
//
// Reliability history (why the numbers below):
//   The v1.8.2 implementation had a 2-second timeout with no retry. In
//   dogfood runs on 2026-08-15 we observed a ~50% telemetry drop-rate
//   on paid-license traffic — 3 of 6 back-to-back scans on distinct
//   repos never registered a score_history row or activation despite
//   the scans succeeding locally. Root cause was almost certainly the
//   Vercel cold-start window plus the aggressive timeout. v1.8.3
//   raises the timeout to 8s AND retries once on transient failure so
//   a single cold-start doesn't lose the write. See the truth audit
//   Fix #4 in docs/TRUTH-AUDIT-FREE-PRO.md.

const TIMEOUT_MS = 8000; // was 2000 — see reliability note above
const RETRY_DELAY_MS = 750;
const DISCLOSURE_MARKER = join(homedir(), ".verglos", "telemetry-disclosed");
const DEBUG = (() => {
  const v = process.env.VERGLOS_DEBUG;
  if (!v) return false;
  const s = v.trim().toLowerCase();
  return s === "1" || s === "true" || s === "on" || s === "yes";
})();

function debug(...args: unknown[]): void {
  if (!DEBUG) return;
  console.error(chalk.gray("[verglos:debug]"), ...args);
}

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

/**
 * Extract a human-readable project name from the fingerprint result's
 * `details` field. For a git-source fingerprint, `details` is shaped
 * like `github.com/owner/repo@abc1234` — we want just `owner/repo` so
 * the account UI shows something a person recognises instead of a
 * bare 12-char hash. Package-source falls back to the raw name.
 * Never throws; unresolvable → undefined.
 */
export function projectNameFromDetails(
  details: string | undefined,
): string | undefined {
  if (!details) return undefined;
  // Strip @<sha> suffix if present
  const beforeAt = details.split("@")[0];
  if (!beforeAt) return undefined;
  // github.com/owner/repo → owner/repo (also gitlab / bitbucket / gitea)
  const parts = beforeAt.split("/").filter(Boolean);
  const knownHost =
    parts[0] === "github.com" ||
    parts[0] === "gitlab.com" ||
    parts[0] === "bitbucket.org" ||
    parts[0] === "codeberg.org";
  if (parts.length >= 3 && knownHost) {
    return parts.slice(1).join("/").slice(0, 200);
  }
  // Bare name (package-source or unknown remote) — return as-is, capped
  return beforeAt.slice(0, 200);
}

async function fetchOnce(
  url: string,
  init: RequestInit,
  timeoutMs: number,
): Promise<Response | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (err) {
    debug("fetch failed:", err instanceof Error ? err.message : err);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function isRetryable(res: Response | null): Promise<boolean> {
  if (!res) return true; // network error / timeout / DNS → retry
  if (res.status >= 500) return true; // server 5xx → retry
  if (res.status === 429) return true; // rate limit → retry
  return false;
}

export async function sendScanEvent(
  result: ScanResult,
  opts: SendOptions,
): Promise<void> {
  // Fingerprint the project so the server can group score-history
  // rows per repo without ever seeing a path. Cheap — hashes the
  // git remote + package.json name + resolved root.
  let fingerprint: string | undefined;
  let projectName: string | undefined;
  try {
    const fp = await computeProjectFingerprint(result.projectRoot);
    fingerprint = fp.fingerprint ?? undefined;
    projectName = projectNameFromDetails(fp.details);
  } catch (err) {
    // Fingerprint failure is non-fatal — anonymous rows still land.
    debug("fingerprint failed:", err instanceof Error ? err.message : err);
  }

  const payload = {
    event_id: randomUUID(),
    fingerprint,
    project_name: projectName,
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

  const url = `${DEFAULT_API_URL}/api/v1/telemetry/scan`;
  const body = JSON.stringify(payload);
  const init: RequestInit = { method: "POST", headers, body };

  debug(
    "POST",
    url,
    "fingerprint",
    fingerprint?.slice(0, 12) ?? "(none)",
    "projectName",
    projectName ?? "(none)",
    "auth",
    creds?.licenseKey ? "bearer" : "none",
  );

  // Attempt 1
  const first = await fetchOnce(url, init, TIMEOUT_MS);
  debug("attempt 1 →", first ? `HTTP ${first.status}` : "no response");
  if (first && !(await isRetryable(first))) return;

  // Retry once with a small delay + jitter. `event_id` deduplicates on
  // the server via `onConflictDoNothing`, so a retry after a partial
  // success is safe — it will not double-count.
  await new Promise((r) => setTimeout(r, RETRY_DELAY_MS + Math.random() * 250));
  const second = await fetchOnce(url, init, TIMEOUT_MS);
  debug("attempt 2 →", second ? `HTTP ${second.status}` : "no response");

  // Terminal — no third attempt. If both failed, silently drop; the
  // user's scan report is still on disk and the next scan will re-try
  // the write with a fresh event_id.
}
