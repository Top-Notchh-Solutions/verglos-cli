import { createHash } from "node:crypto";
import { hostname, userInfo } from "node:os";
import chalk from "chalk";
import { loadCredentials, saveCredentials } from "./credentials.js";
import { fetchLicenseStatus } from "./license-api.js";
import { normalizeTier } from "./tier-defaults.js";
import { resolveEntitlement, type ResolvedEntitlement } from "./entitlement.js";

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
  if (key.length <= 12) return "[redacted]";
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

export interface WhoamiOptions {
  json?: boolean;
  quiet?: boolean;
}

type EntitlementSummary = Pick<ResolvedEntitlement, "plan" | "source" | "stale" | "catalogVersion" | "allowances"> & {
  capabilityCount: number;
  entitlementExpiresAt?: string;
  inOfflineGrace?: boolean;
};

async function entitlementSummary(): Promise<EntitlementSummary> {
  try {
    const resolved = await resolveEntitlement({ forceRefresh: true });
    return {
      plan: resolved.plan,
      source: resolved.source,
      stale: resolved.stale,
      capabilityCount: resolved.capabilities.length,
      ...(resolved.catalogVersion ? { catalogVersion: resolved.catalogVersion } : {}),
      ...(resolved.allowances ? { allowances: resolved.allowances } : {}),
      ...(resolved.license ? {
        entitlementExpiresAt: new Date(resolved.license.expiresAt).toISOString(),
        inOfflineGrace: resolved.license.inOfflineGrace,
      } : {}),
    };
  } catch {
    return { plan: "free", source: "free", stale: false, capabilityCount: 9 };
  }
}

function printEntitlement(entitlement: Awaited<ReturnType<typeof entitlementSummary>>) {
  console.log(`  ${chalk.bold("Authority:")} ${entitlement.source}${entitlement.stale ? chalk.yellow(" (stale)") : ""}`);
  console.log(`  ${chalk.bold("Access:")}    ${entitlement.capabilityCount} capabilities`);
  if (entitlement.catalogVersion) console.log(`  ${chalk.bold("Catalog:")}   ${entitlement.catalogVersion}`);
  if (entitlement.allowances) {
    const summary = Object.entries(entitlement.allowances).map(([key, value]) => `${key}=${value}`).join(", ");
    if (summary) console.log(`  ${chalk.bold("Allowances:")} ${summary}`);
  }
  if (entitlement.entitlementExpiresAt) console.log(`  ${chalk.bold("Token expiry:")} ${formatDate(entitlement.entitlementExpiresAt)}${entitlement.inOfflineGrace ? " (offline grace)" : ""}`);
}

export async function executeWhoami(options: WhoamiOptions = {}): Promise<number> {
  const creds = await loadCredentials();

  if (!creds.licenseKey) {
    if (options.json) {
      console.log(JSON.stringify({ status: "ok", signedIn: false, plan: "free", source: "free", stale: false, capabilityCount: 9 }));
      return 0;
    }
    if (options.quiet) return 0;
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
    const cachedPlan = normalizeTier(creds.plan);
    const entitlement = await entitlementSummary();
    if (options.json) {
      console.log(JSON.stringify({
        status: status.reason === "network" ? "offline" : "error",
        signedIn: true,
        licensePlan: cachedPlan,
        license: maskKey(creds.licenseKey),
        ...(creds.email ? { email: creds.email } : {}),
        ...(creds.planExpiresAt ? { expiresAt: creds.planExpiresAt } : {}),
        ...entitlement,
        reason: status.reason,
      }));
      return status.reason === "invalid_token" || status.reason === "license_not_found" ? 1 : 0;
    }
    if (options.quiet) return status.reason === "invalid_token" || status.reason === "license_not_found" ? 1 : 0;
    console.log(
      `  ${chalk.bold("You:")}      ${creds.email ?? chalk.gray("(unknown — server unreachable)")}`,
    );
    console.log(`  ${chalk.bold("Plan:")}     ${chalk.gray(entitlement.plan.toUpperCase())}`);
    console.log(`  ${chalk.bold("License plan:")} ${cachedPlan.toUpperCase()} (cached)`);
    printEntitlement(entitlement);
    if (entitlement.source === "free") console.log(chalk.gray("  Paid access could not be verified. Run `verglos login` when online to refresh your entitlement."));
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
  const canonicalPlan = normalizeTier(status.plan);
  const entitlement = await entitlementSummary();
  await saveCredentials({
    ...creds,
    email: status.email ?? creds.email,
    plan: canonicalPlan,
    planExpiresAt: status.expiresAt ?? undefined,
  });

  const planTag = entitlement.plan.toUpperCase();
  const planStyle =
    entitlement.plan === "founder"
      ? chalk.yellow(planTag)
      : entitlement.plan !== "free"
        ? chalk.green(planTag)
        : chalk.gray(planTag);

  const days = daysUntil(status.expiresAt);

  if (options.json) {
    console.log(JSON.stringify({
      status: status.active ? "ok" : "inactive",
      signedIn: true,
      email: status.email,
      licensePlan: canonicalPlan,
      license: maskKey(status.licenseKey),
      expiresAt: status.expiresAt,
      machine: thisMachine,
      machines: status.machines,
      ...entitlement,
    }));
    return status.active ? 0 : 1;
  }
  if (options.quiet) return status.active ? 0 : 1;

  console.log(`  ${chalk.bold("You:")}      ${status.email ?? "(no email on file)"}`);
  console.log(
    `  ${chalk.bold("Plan:")}     ${planStyle}${status.active ? "" : chalk.red(" (inactive)")}`,
  );
  console.log(`  ${chalk.bold("License plan:")} ${canonicalPlan.toUpperCase()}`);
  printEntitlement(entitlement);
  console.log(`  ${chalk.bold("License:")}  ${maskKey(status.licenseKey)}`);
  if (status.expiresAt) {
    const dayLabel =
      days === null ? "" : chalk.gray(` (in ${days} day${days === 1 ? "" : "s"})`);
    console.log(
      `  ${chalk.bold("Renewal:")}  ${formatDate(status.expiresAt)}${dayLabel}`,
    );
  } else if (canonicalPlan === "founder") {
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
