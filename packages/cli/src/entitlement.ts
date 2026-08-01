import { mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import chalk from "chalk";
import { DEFAULT_API_URL, loadCredentials } from "./credentials.js";

/**
 * Client-side entitlement checker.
 *
 * The server is the source of truth. This module fetches, caches
 * (24h TTL), and answers `has(capability)` / `requirePro(cmdName)`.
 *
 * Design notes:
 *   - Offline within TTL: cached "yes" still counts. Plane-friendly.
 *   - Offline past TTL: fall back to free capabilities. Downgrades
 *     gracefully instead of failing closed.
 *   - Founder simulation: --as-plan=<plan> sends ?as_plan= to the
 *     server, which ignores it unless the caller is on founder.
 */

const CACHE_DIR = join(homedir(), ".verglos");
const CACHE_FILE = join(CACHE_DIR, "capabilities.json");
const REQUEST_TIMEOUT_MS = 5000;

/**
 * Hard cap on how long a stale cache can survive without a server
 * round-trip. Past this, we drop to Free with an explicit warning
 * instead of silently letting a cancelled or revoked license keep
 * Pro forever offline. Seven days matches the JWT offline-grace
 * window in @verglos/entitlement.
 */
const ABSOLUTE_MAX_STALE_MS = 7 * 24 * 60 * 60 * 1000;

interface CapabilitiesResponse {
  plan: string;
  real_plan?: string;
  capabilities: string[];
  cache_ttl_seconds: number;
  simulated: boolean;
  active: boolean;
  reason?: string;
}

interface CachedCapabilities extends CapabilitiesResponse {
  fetchedAt: string;
  expiresAt: string;
  simulatedAsPlan?: string;
  /**
   * True when this response came from cache after the server was
   * unreachable. Callers can surface a renewal warning.
   */
  stale?: boolean;
}

const FREE_FALLBACK: CachedCapabilities = {
  plan: "free",
  capabilities: [
    "scan",
    "scan_ai_provenance",
    "scan_slopsquat",
    "scan_secrets_local",
    "scan_deps",
    "scan_git_history",
    "mcp_server",
    "pre_commit_hook",
    "html_json_report",
  ],
  cache_ttl_seconds: 60,
  simulated: false,
  active: true,
  fetchedAt: new Date(0).toISOString(),
  expiresAt: new Date(0).toISOString(),
};

async function readCache(): Promise<CachedCapabilities | null> {
  try {
    const raw = await readFile(CACHE_FILE, "utf8");
    return JSON.parse(raw) as CachedCapabilities;
  } catch {
    return null;
  }
}

async function writeCache(entry: CachedCapabilities): Promise<void> {
  try {
    await mkdir(CACHE_DIR, { recursive: true });
    await writeFile(CACHE_FILE, JSON.stringify(entry, null, 2), "utf8");
  } catch {
    // non-fatal — next call will just re-fetch.
  }
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchFromServer(
  apiUrl: string,
  licenseKey: string | undefined,
  asPlan: string | undefined,
): Promise<CapabilitiesResponse | null> {
  const url = new URL(`${apiUrl}/api/v1/entitlement/capabilities`);
  if (asPlan) url.searchParams.set("as_plan", asPlan);

  try {
    const res = await fetchWithTimeout(url.toString(), {
      method: "GET",
      headers: licenseKey
        ? { authorization: `Bearer ${licenseKey}` }
        : {},
    });
    if (!res.ok) return null;
    return (await res.json()) as CapabilitiesResponse;
  } catch {
    return null;
  }
}

export interface LoadCapabilitiesOptions {
  /** Bypass cache, always hit server. */
  forceRefresh?: boolean;
  /** Founder-only: ask server to simulate this plan. */
  asPlan?: string;
}

export async function loadCapabilities(
  opts: LoadCapabilitiesOptions = {},
): Promise<CachedCapabilities> {
  const now = Date.now();
  const cached = await readCache();

  const cacheIsFresh =
    cached &&
    new Date(cached.expiresAt).getTime() > now &&
    cached.simulatedAsPlan === opts.asPlan;

  if (!opts.forceRefresh && cacheIsFresh && cached) return cached;

  const creds = await loadCredentials();
  const server = await fetchFromServer(
    creds.apiUrl ?? DEFAULT_API_URL,
    creds.licenseKey,
    opts.asPlan,
  );

  if (!server) {
    // Offline. If we have a cache within the 7-day absolute-stale
    // window, honour it (bounded offline grace — same window as the
    // JWT-based flow in @verglos/entitlement). If the cache is older,
    // fail closed to Free and let the caller warn — better than
    // silently letting a cancelled license keep Pro forever.
    if (cached) {
      const cachedFetchedAt = new Date(cached.fetchedAt).getTime();
      const ageMs = now - cachedFetchedAt;
      if (ageMs < ABSOLUTE_MAX_STALE_MS) {
        return { ...cached, stale: true };
      }
    }
    return FREE_FALLBACK;
  }

  const ttlMs = Math.max(60, server.cache_ttl_seconds) * 1000;
  const entry: CachedCapabilities = {
    ...server,
    fetchedAt: new Date(now).toISOString(),
    expiresAt: new Date(now + ttlMs).toISOString(),
    simulatedAsPlan: opts.asPlan,
    stale: false,
  };
  await writeCache(entry);
  return entry;
}

/**
 * Exposed for tests only. Returns the hard cap on how long a stale
 * cache can be honoured without a fresh server round-trip.
 */
export function _absoluteMaxStaleMs(): number {
  return ABSOLUTE_MAX_STALE_MS;
}

export async function has(
  capability: string,
  opts: LoadCapabilitiesOptions = {},
): Promise<boolean> {
  const caps = await loadCapabilities(opts);
  return caps.capabilities.includes(capability);
}

export async function currentPlan(
  opts: LoadCapabilitiesOptions = {},
): Promise<{
  plan: string;
  simulated: boolean;
  realPlan?: string;
  stale: boolean;
}> {
  const caps = await loadCapabilities(opts);
  return {
    plan: caps.plan,
    simulated: caps.simulated,
    realPlan: caps.real_plan,
    stale: caps.stale === true,
  };
}

/**
 * Print a one-line renewal warning to stderr when the caller is
 * running on a stale-but-honoured cache (server unreachable, cache
 * within the 7-day grace window). Idempotent within a process — safe
 * to call from every gate.
 */
let stalePrinted = false;
export function warnIfStale(caps: {
  stale?: boolean;
  plan?: string;
}): void {
  if (!caps.stale || stalePrinted || caps.plan === "free") return;
  stalePrinted = true;
  console.error("");
  console.error(
    `  ${chalk.yellow("!")} Using cached ${caps.plan?.toUpperCase() ?? "PAID"} entitlement (server unreachable).`,
  );
  console.error(
    chalk.gray(
      "    Re-check with `verglos whoami` when you are back online.",
    ),
  );
  console.error("");
}

export function printUpgradeCta(
  featureLabel: string,
  extraLine?: string,
): void {
  console.error("");
  console.error(chalk.bold(`${featureLabel} requires Pro.`));
  console.error("");
  console.error(`  Upgrade at  →  ${chalk.cyan("https://verglos.com/checkout")}`);
  console.error(`  Or activate →  ${chalk.cyan("verglos login")}`);
  if (extraLine) {
    console.error("");
    console.error(chalk.gray(`  ${extraLine}`));
  }
  console.error("");
}

/**
 * Assert a capability is present. On miss, prints the upgrade CTA
 * and returns false. Caller decides whether to hard-exit or downgrade
 * gracefully.
 */
export async function requireCapability(
  capability: string,
  featureLabel: string,
  opts: LoadCapabilitiesOptions & { extraLine?: string } = {},
): Promise<boolean> {
  const caps = await loadCapabilities(opts);
  warnIfStale(caps);
  const ok = caps.capabilities.includes(capability);
  if (!ok) {
    printUpgradeCta(featureLabel, opts.extraLine);
  }
  return ok;
}

export async function clearCache(): Promise<void> {
  try {
    await writeFile(CACHE_FILE, "{}", "utf8");
  } catch {
    // ignore
  }
}
