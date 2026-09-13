import { randomUUID } from "node:crypto";
import { lstat, mkdir, open, readFile, rename, unlink } from "node:fs/promises";
import { homedir, platform } from "node:os";
import { join } from "node:path";
import chalk from "chalk";
import type { ScanResult } from "@verglos/shared";

// Scan analytics are separate from account synchronization. Events are sent
// only after affirmative, versioned local consent and contain coarse fields
// only. Never attach project identity, credentials, source, paths, findings,
// detector names, or matched secrets to this request.
//
const configuredHome = () => process.env.HOME || process.env.USERPROFILE || homedir();
const consentPath = () => join(configuredHome(), ".verglos", "telemetry-consent.json");
const CONSENT_POLICY_VERSION = "2026-09-08";
const MAX_CONSENT_BYTES = 4096;
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

export interface TelemetryConsent {
  readonly schemaVersion: 1;
  readonly policyVersion: string;
  readonly enabled: boolean;
  readonly updatedAt: string;
}

export async function readTelemetryConsent(): Promise<TelemetryConsent | null> {
  try {
    const path = consentPath();
    const entry = await lstat(path);
    if (!entry.isFile() || entry.size > MAX_CONSENT_BYTES) return null;
    const raw = await readFile(path, "utf8");
    if (Buffer.byteLength(raw, "utf8") > MAX_CONSENT_BYTES) return null;
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;
    const consent = value as Record<string, unknown>;
    if (consent.schemaVersion !== 1 || consent.policyVersion !== CONSENT_POLICY_VERSION || typeof consent.enabled !== "boolean" || typeof consent.updatedAt !== "string" || !Number.isFinite(Date.parse(consent.updatedAt))) return null;
    return consent as unknown as TelemetryConsent;
  } catch {
    return null;
  }
}

export async function writeTelemetryConsent(enabled: boolean): Promise<TelemetryConsent> {
  const path = consentPath();
  const directory = join(configuredHome(), ".verglos");
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const directoryEntry = await lstat(directory);
  if (!directoryEntry.isDirectory()) throw new Error("Verglos state path must be a regular directory");
  try {
    const existing = await lstat(path);
    if (!existing.isFile()) throw new Error("telemetry consent must be a regular file");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  const consent: TelemetryConsent = { schemaVersion: 1, policyVersion: CONSENT_POLICY_VERSION, enabled, updatedAt: new Date().toISOString() };
  const temporary = `${path}.${process.pid}.${randomUUID()}.tmp`;
  const handle = await open(temporary, "wx", 0o600);
  try {
    await handle.writeFile(`${JSON.stringify(consent)}\n`, "utf8");
    await handle.sync();
  } finally {
    await handle.close();
  }
  try {
    await rename(temporary, path);
  } catch (error) {
    await unlink(temporary).catch(() => undefined);
    throw error;
  }
  return consent;
}

export async function isTelemetryDisabled(explicitFlag?: boolean, nonInteractive = false): Promise<boolean> {
  if (explicitFlag === true) return true;
  const override = process.env.VERGLOS_TELEMETRY?.trim().toLowerCase();
  if (["0", "false", "off", "no"].includes(override ?? "")) return true;
  if (["1", "true", "on", "yes"].includes(override ?? "")) return false;
  if (nonInteractive) return true;
  return (await readTelemetryConsent())?.enabled !== true;
}

export function isExplicitTelemetryOptOut(explicitFlag?: boolean): boolean {
  if (explicitFlag === true) return true;
  return ["0", "false", "off", "no"].includes(process.env.VERGLOS_TELEMETRY?.trim().toLowerCase() ?? "");
}

export function printTelemetryConsentPreview(): void {
  console.log("Verglos scan analytics consent preview");
  console.log("Purpose: improve CLI reliability using aggregate scan metadata.");
  console.log("Fields: CLI major.minor, Node major, OS family, score band, finding-count bands, duration band, coarse result band.");
  console.log("Excluded: project/repository identity, license/account credentials, source, paths, finding text, detector names, and matched secret values.");
  console.log("Consent is stored locally and can be revoked with `verglos privacy telemetry disable`.");
  console.log("Transmission is disabled until hosted retention and deletion controls are qualified.");
}

interface SendOptions {
  cliVersion: string;
  durationMs: number;
}

export async function sendScanEvent(
  _result: ScanResult,
  _opts: SendOptions,
): Promise<void> {
  debug("scan analytics collection is disabled pending hosted retention/deletion qualification");
}

type CountBand = "0" | "1-4" | "5-19" | "20+";
type DurationBand = "lt-1s" | "1-5s" | "5-15s" | "15-60s" | "60s-plus";

function countBand(value: number): CountBand {
  if (value <= 0) return "0";
  if (value < 5) return "1-4";
  if (value < 20) return "5-19";
  return "20+";
}

function durationBand(value: number): DurationBand {
  if (value < 1000) return "lt-1s";
  if (value < 5000) return "1-5s";
  if (value < 15000) return "5-15s";
  if (value < 60000) return "15-60s";
  return "60s-plus";
}

function platformFamily(value: string): "windows" | "macos" | "linux" | "other" {
  if (value === "win32") return "windows";
  if (value === "darwin") return "macos";
  if (value === "linux") return "linux";
  return "other";
}

function majorMinor(version: string): string {
  const match = version.match(/^(\d+)\.(\d+)/u);
  return match ? `${match[1]}.${match[2]}` : "unknown";
}

export function buildCoarseTelemetryEvent(
  result: ScanResult,
  opts: SendOptions,
  environment: { cliVersion?: string; nodeVersion?: string; platform?: string } = {},
) {
  const countTotal = Object.values(result.score.counts).reduce((total, count) => total + count, 0);
  return {
    schema_version: 2,
    event_id: randomUUID(),
    cli_version: majorMinor(environment.cliVersion ?? opts.cliVersion),
    node_major: (environment.nodeVersion ?? process.version).match(/^v?(\d+)/u)?.[1] ?? "unknown",
    platform_family: platformFamily(environment.platform ?? platform()),
    score_band: Math.floor(result.score.value / 20) * 20,
    finding_count_band: countBand(countTotal),
    critical_count_band: countBand(result.score.counts.critical),
    duration_band: durationBand(Math.max(0, opts.durationMs)),
    result_band: result.score.counts.critical > 0 ? "critical-present" : countTotal > 0 ? "findings-present" : "no-findings",
  };
}
