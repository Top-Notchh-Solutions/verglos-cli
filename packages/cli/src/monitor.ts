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
