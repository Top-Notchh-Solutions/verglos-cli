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
    // Offline. Return stale cache if we have it; else free fallback.
    return cached ?? FREE_FALLBACK;
  }

  const ttlMs = Math.max(60, server.cache_ttl_seconds) * 1000;
  const entry: CachedCapabilities = {
    ...server,
    fetchedAt: new Date(now).toISOString(),
    expiresAt: new Date(now + ttlMs).toISOString(),
    simulatedAsPlan: opts.asPlan,
  };
  await writeCache(entry);
  return entry;
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
): Promise<{ plan: string; simulated: boolean; realPlan?: string }> {
  const caps = await loadCapabilities(opts);
  return {
    plan: caps.plan,
    simulated: caps.simulated,
    realPlan: caps.real_plan,
  };
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
  const ok = await has(capability, opts);
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
