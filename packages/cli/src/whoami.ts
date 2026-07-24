import { createHash } from "node:crypto";
import { hostname, userInfo } from "node:os";
import chalk from "chalk";
import { loadCredentials, saveCredentials } from "./credentials.js";
import { fetchLicenseStatus } from "./license-api.js";

/**
 * `verglos whoami` — one-command truth telling.
 *
 * Falls through three tiers:
 *   1. No license key locally → Free tier, hint to `verglos login`.
 *   2. License key present, server reachable → live status from
 *      /api/v1/license/status (uses raw key as Bearer — no unlock
 *      token, no activation side-effect).
 *   3. License key present, server unreachable → cached info from
 *      the last successful validate/status call, flagged as
 *      offline.
 */

function machineFingerprint(): string {
  return createHash("sha256")
    .update(`${hostname()}-${userInfo().username}`)
    .digest("hex")
    .slice(0, 16);
}

function maskKey(key: string): string {
  if (key.length <= 12) return key;
  return `${key.slice(0, 6)}…${key.slice(-4)}`;
}

function daysUntil(iso: string | null): number | null {
  if (!iso) return null;
  const target = new Date(iso).getTime();
  const diff = target - Date.now();
  return Math.max(0, Math.round(diff / (24 * 60 * 60 * 1000)));
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export async function executeWhoami(): Promise<number> {
  const creds = await loadCredentials();

  if (!creds.licenseKey) {
    console.log(`  ${chalk.bold("You:")}      not signed in`);
    console.log(`  ${chalk.bold("Plan:")}     ${chalk.gray("FREE")}`);
    console.log("");
    console.log(
      chalk.gray("  Sign in with `verglos login` to activate Pro."),
    );
    return 0;
  }

  const status = await fetchLicenseStatus(creds.licenseKey, creds.apiUrl);
  const thisMachine = machineFingerprint();

  if (!status.ok) {
    // Offline / server error / bad key. Fall back to cached values.
    console.log(
      `  ${chalk.bold("You:")}      ${creds.email ?? chalk.gray("(unknown — server unreachable)")}`,
    );
    console.log(
      `  ${chalk.bold("Plan:")}     ${chalk.gray((creds.plan ?? "unknown").toUpperCase())} ${chalk.gray("(cached)")}`,
    );
    console.log(`  ${chalk.bold("License:")}  ${maskKey(creds.licenseKey)}`);
    if (creds.planExpiresAt) {
      console.log(
        `  ${chalk.bold("Renewal:")}  ${formatDate(creds.planExpiresAt)}`,
      );
    }
    console.log(`  ${chalk.bold("Machine:")}  ${thisMachine} (this machine)`);
    console.log("");
    if (status.reason === "network") {
      console.log(
        chalk.gray(
          "  Server unreachable — showing cached info from your last successful sync.",
        ),
      );
    } else if (
      status.reason === "invalid_token" ||
      status.reason === "license_not_found"
    ) {
      console.log(
        chalk.red(
          "  Server does not recognise your license key. Run `verglos login` to re-authenticate.",
        ),
      );
      return 1;
    } else {
      console.log(chalk.gray(`  Sync failed (${status.reason}).`));
    }
    return 0;
  }

  // Live data — refresh the cache too.
  await saveCredentials({
    ...creds,
    email: status.email ?? creds.email,
    plan: status.plan,
    planExpiresAt: status.expiresAt ?? undefined,
  });

  const planTag = status.plan.toUpperCase();
  const planStyle =
    status.plan === "founder"
      ? chalk.yellow(planTag)
      : status.plan === "pro" || status.plan === "studio"
        ? chalk.green(planTag)
        : chalk.gray(planTag);

  const days = daysUntil(status.expiresAt);

  console.log(`  ${chalk.bold("You:")}      ${status.email ?? "(no email on file)"}`);
  console.log(
    `  ${chalk.bold("Plan:")}     ${planStyle}${status.active ? "" : chalk.red(" (inactive)")}`,
  );
  console.log(`  ${chalk.bold("License:")}  ${maskKey(status.licenseKey)}`);
  if (status.expiresAt) {
    const dayLabel =
      days === null ? "" : chalk.gray(` (in ${days} day${days === 1 ? "" : "s"})`);
    console.log(
      `  ${chalk.bold("Renewal:")}  ${formatDate(status.expiresAt)}${dayLabel}`,
    );
  } else if (status.plan === "founder") {
    console.log(`  ${chalk.bold("Renewal:")}  ${chalk.gray("never (founder)")}`);
  }
  console.log(
    `  ${chalk.bold("Machine:")}  ${thisMachine} (this machine)`,
  );

  if (status.machines.length > 0) {
    console.log("");
    console.log(chalk.gray(`  Activated projects (${status.machines.length}):`));
    for (const m of status.machines) {
      const label = m.projectName ?? `${m.fingerprint.slice(0, 10)}…`;
      const isHere = m.machineId === thisMachine;
      console.log(
        `    - ${label}${isHere ? chalk.gray(" (this machine)") : ""}`,
      );
    }
  }

  return 0;
}
