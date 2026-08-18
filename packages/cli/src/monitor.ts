import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import chalk from "chalk";
import { computeProjectFingerprint } from "@verglos/shared";
import {
  validateChannels,
  type MonitorChannels,
  type MonitorRegistration,
  type MonitorDependency,
} from "@verglos/entitlement";
import { loadCredentials, DEFAULT_API_URL } from "./credentials.js";
import {
  authorizedFetch,
  type AuthorizedFetchResult,
} from "./authorized-fetch.js";

/**
 * `verglos monitor register` — Pro-only.
 *
 * Reads the project's lockfile / package.json, builds a
 * MonitorRegistration payload, and POSTs to /v1/monitor/register.
 * The server persists the dep tree keyed on the project fingerprint;
 * the Vercel Cron hourly job pulls OSV and fires alerts on
 * critical/high, batches medium/low into a Sunday digest.
 *
 * The command intentionally does NOT verify the entitlement token
 * itself — the server does, so the CLI can support a
 * "register with a license key but from a machine that hasn't
 * activated yet" flow.
 */

export interface MonitorRegisterOptions {
  cwd?: string;
  email?: string;
  slack?: string;
  webhook?: string;
  label?: string;
}

interface LockPackage {
  name: string;
  version: string;
}

async function collectDeps(projectRoot: string): Promise<MonitorDependency[]> {
  const seen = new Map<string, string>();
  try {
    const lock = JSON.parse(
      await readFile(`${projectRoot}/package-lock.json`, "utf8"),
    ) as {
      packages?: Record<string, { version?: string }>;
      dependencies?: Record<string, { version?: string }>;
    };
    if (lock.packages) {
      for (const [path, info] of Object.entries(lock.packages)) {
        if (!info.version) continue;
        const name = path.replace("node_modules/", "").split("node_modules/").pop();
        if (!name) continue;
        seen.set(name, info.version);
      }
    } else if (lock.dependencies) {
      for (const [name, info] of Object.entries(lock.dependencies)) {
        if (info.version) seen.set(name, info.version);
      }
    }
  } catch {
    // no lockfile → fall back to package.json
  }
  if (seen.size === 0) {
    try {
      const pkg = JSON.parse(
        await readFile(`${projectRoot}/package.json`, "utf8"),
      ) as {
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
      };
      for (const [name, version] of Object.entries(pkg.dependencies ?? {})) {
        seen.set(name, version);
      }
      for (const [name, version] of Object.entries(pkg.devDependencies ?? {})) {
        seen.set(name, version);
      }
    } catch {
      // no package.json
    }
  }
  return [...seen.entries()].map(([name, version]) => ({ name, version }));
}

export async function executeMonitorRegister(
  options: MonitorRegisterOptions,
  cliVersion: string,
): Promise<number> {
  const projectRoot = resolve(options.cwd ?? process.cwd());
  const channels: MonitorChannels = {
    email: options.email,
    slackWebhookUrl: options.slack,
    webhookUrl: options.webhook,
  };
  const check = validateChannels(channels);
  if (!check.ok) {
    console.error(chalk.red(`verglos monitor: ${check.reason}`));
    console.error(
      chalk.gray(
        "  Pass at least one of --email, --slack, --webhook. Example:",
      ),
    );
    console.error(
      chalk.gray("  $ verglos monitor register --email me@example.com"),
    );
    return 1;
  }

  const fingerprint = await computeProjectFingerprint(projectRoot);
  if (!fingerprint.fingerprint) {
    console.error(chalk.red("verglos monitor: cannot compute a stable project fingerprint."));
    console.error(chalk.gray("  Init a git repo or add a package.json first."));
    return 1;
  }

  const dependencies = await collectDeps(projectRoot);
  if (dependencies.length === 0) {
    console.error(chalk.red("verglos monitor: no dependencies found."));
    return 1;
  }

  const label = options.label ?? fingerprint.details;

  const registration: MonitorRegistration = {
    projectFingerprint: fingerprint.fingerprint,
    projectLabel: label,
    dependencies,
    channels,
    cliVersion,
  };

  const creds = await loadCredentials();
  const apiUrl = creds.apiUrl ?? DEFAULT_API_URL;
  const url = `${apiUrl}/api/v1/monitor/register`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(creds.licenseKey
        ? { Authorization: `Bearer ${creds.licenseKey}` }
        : {}),
    },
    body: JSON.stringify(registration),
  });

  if (res.status === 401 || res.status === 402) {
    console.error(
      chalk.red(
        `verglos monitor: license required (HTTP ${res.status}). Run \`verglos login\` first.`,
      ),
    );
    return 1;
  }
  if (!res.ok) {
    console.error(
      chalk.red(
        `verglos monitor: registration failed with HTTP ${res.status}.`,
      ),
    );
    return 1;
  }

  console.log(chalk.green(`✓ Registered ${dependencies.length} dependencies for continuous CVE monitoring.`));
  console.log(chalk.gray(`  Project: ${label}`));
  console.log(
    chalk.gray(
      `  Alerts on new criticals/highs fire immediately. Medium/low batch into a weekly digest (Sunday 09:00 UTC).`,
    ),
  );
  const channelSummary = [
    channels.email ? `email → ${channels.email}` : "",
    channels.slackWebhookUrl ? "Slack webhook" : "",
    channels.webhookUrl ? "generic webhook" : "",
  ]
    .filter(Boolean)
    .join(", ");
  console.log(chalk.gray(`  Channels: ${channelSummary}`));
  return 0;
}

// ─────────────────────────────────────────────────────────────────────────
//
//  `verglos monitor status` / `unregister` / `test-alert`
//
//  Phase 6 CLI ergonomics. Every command below POSTs / GETs / DELETEs
//  a stable contract that Phase 7 (verglos-web repo) is responsible
//  for implementing. Until that ships, the CLI degrades gracefully:
//  a 404 or a 501 is reported as "server does not implement this yet
//  — coming soon" rather than a crash.
//
// ─────────────────────────────────────────────────────────────────────────

function explainFetchFailure(op: string, reason: AuthorizedFetchResult["reason"], status: number): void {
  switch (reason) {
    case "no_license":
      console.error(chalk.red(`verglos monitor ${op}: no license key.`));
      console.error(chalk.gray("  Run `verglos login` or `verglos activate <key>` first."));
      break;
    case "unauthorized":
      console.error(chalk.red(`verglos monitor ${op}: license required (HTTP ${status}).`));
      console.error(chalk.gray("  Continuous monitoring is a Pro feature. Upgrade at verglos.com/checkout."));
      break;
    case "not_implemented":
      console.error(chalk.yellow(`verglos monitor ${op}: the server has not shipped this endpoint yet.`));
      console.error(chalk.gray("  Track progress at github.com/Top-Notchh-Solutions/verglos-cli."));
      break;
    case "not_found":
      console.error(chalk.red(`verglos monitor ${op}: not found (HTTP 404).`));
      break;
    case "network":
      console.error(chalk.red(`verglos monitor ${op}: could not reach the server. Check your connection.`));
      break;
    default:
      console.error(chalk.red(`verglos monitor ${op}: request failed (HTTP ${status}).`));
  }
}

// ── verglos monitor status ────────────────────────────────────────────────

interface MonitorStatusEntry {
  projectFingerprint: string;
  projectLabel: string;
  cliVersion?: string;
  snapshotAt?: string;
  dependencyCount?: number;
  channels?: {
    email?: boolean | string;
    slack?: boolean;
    webhook?: boolean;
  };
  lastCheckedAt?: string | null;
  alertsFiredLast7d?: number;
}

export async function executeMonitorStatus(): Promise<number> {
  const result = await authorizedFetch("/api/v1/monitor/registrations", { method: "GET" });
  if (!result.ok) {
    explainFetchFailure("status", result.reason, result.status);
    return result.reason === "not_implemented" ? 0 : 1;
  }
  const body = result.json as { registrations?: MonitorStatusEntry[] };
  const entries = body.registrations ?? [];
  if (entries.length === 0) {
    console.log(chalk.gray("No projects registered for continuous monitoring."));
    console.log(chalk.gray("  Run `verglos monitor register --email you@example.com` from a project directory."));
    return 0;
  }
  console.log(chalk.bold(`Registered projects (${entries.length}):`));
  for (const entry of entries) {
    console.log("");
    console.log(`  ${chalk.bold(entry.projectLabel)}   ${chalk.gray(entry.projectFingerprint.slice(0, 12))}`);
    if (entry.dependencyCount !== undefined) {
      console.log(chalk.gray(`    ${entry.dependencyCount} deps · registered ${entry.snapshotAt ?? "unknown"}`));
    }
    const chanBits = [
      entry.channels?.email ? "email" : "",
      entry.channels?.slack ? "slack" : "",
      entry.channels?.webhook ? "webhook" : "",
    ].filter(Boolean);
    if (chanBits.length > 0) {
      console.log(chalk.gray(`    channels: ${chanBits.join(", ")}`));
    }
    if (entry.lastCheckedAt) {
      console.log(chalk.gray(`    last check: ${entry.lastCheckedAt}`));
    }
    if (entry.alertsFiredLast7d !== undefined && entry.alertsFiredLast7d > 0) {
      console.log(chalk.yellow(`    ${entry.alertsFiredLast7d} alerts fired in the last 7 days`));
    }
  }
  return 0;
}

// ── verglos monitor unregister ────────────────────────────────────────────

export interface MonitorUnregisterOptions {
  cwd?: string;
  projectFingerprint?: string;
}

export async function executeMonitorUnregister(
  options: MonitorUnregisterOptions,
): Promise<number> {
  let fingerprint = options.projectFingerprint;
  if (!fingerprint) {
    const projectRoot = resolve(options.cwd ?? process.cwd());
    const fp = await computeProjectFingerprint(projectRoot);
    if (!fp.fingerprint) {
      console.error(chalk.red("verglos monitor unregister: cannot compute a project fingerprint here."));
      console.error(chalk.gray("  cd into a project directory or pass --project-fingerprint <fp>."));
      return 1;
    }
    fingerprint = fp.fingerprint;
  }
  const result = await authorizedFetch(
    `/api/v1/monitor/registration/${encodeURIComponent(fingerprint)}`,
    { method: "DELETE" },
  );
  if (!result.ok) {
    explainFetchFailure("unregister", result.reason, result.status);
    return result.reason === "not_implemented" || result.reason === "not_found" ? 0 : 1;
  }
  console.log(chalk.green(`✓ Unregistered ${fingerprint.slice(0, 12)} — no further alerts for this project.`));
  return 0;
}

// ── verglos monitor test-alert ────────────────────────────────────────────

export interface MonitorTestAlertOptions {
  cwd?: string;
  projectFingerprint?: string;
}

export async function executeMonitorTestAlert(
  options: MonitorTestAlertOptions,
): Promise<number> {
  let fingerprint = options.projectFingerprint;
  if (!fingerprint) {
    const projectRoot = resolve(options.cwd ?? process.cwd());
    const fp = await computeProjectFingerprint(projectRoot);
    if (!fp.fingerprint) {
      console.error(chalk.red("verglos monitor test-alert: cannot compute a project fingerprint here."));
      console.error(chalk.gray("  cd into a registered project or pass --project-fingerprint <fp>."));
      return 1;
    }
    fingerprint = fp.fingerprint;
  }
  const result = await authorizedFetch("/api/v1/monitor/test-alert", {
    method: "POST",
    body: { projectFingerprint: fingerprint },
  });
  if (!result.ok) {
    explainFetchFailure("test-alert", result.reason, result.status);
    return result.reason === "not_implemented" ? 0 : 1;
  }
  const body = result.json as { sent?: { email?: boolean; slack?: boolean; webhook?: boolean } };
  const sent = body.sent ?? {};
  console.log(chalk.green("✓ Test alert dispatched."));
  const details = [
    sent.email ? "email delivered" : "",
    sent.slack ? "slack delivered" : "",
    sent.webhook ? "webhook delivered" : "",
  ].filter(Boolean);
  if (details.length > 0) {
    console.log(chalk.gray(`  ${details.join(", ")}`));
  }
  console.log(chalk.gray("  If a channel is missing above, re-run `verglos monitor register` with the flag you want."));
  return 0;
}
