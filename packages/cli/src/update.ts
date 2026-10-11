import { spawn } from "node:child_process";
import chalk from "chalk";
import { readJsonResponse } from "./http-response.js";

const REGISTRY_LATEST_URL = "https://registry.npmjs.org/verglos/latest";

type LatestPackageMetadata = {
  version?: string;
};

export async function fetchLatestVersion(): Promise<string | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);

  try {
    const response = await fetch(REGISTRY_LATEST_URL, {
      signal: controller.signal,
      headers: {
        accept: "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }

    const metadata = (await readJsonResponse(response)) as LatestPackageMetadata | null;
    return metadata?.version ?? null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export function isNewerVersion(latest: string, current: string): boolean {
  const latestParts = latest.split(".").map((part) => parseInt(part, 10));
  const currentParts = current.split(".").map((part) => parseInt(part, 10));
  const length = Math.max(latestParts.length, currentParts.length);

  for (let index = 0; index < length; index += 1) {
    const latestPart = latestParts[index] ?? 0;
    const currentPart = currentParts[index] ?? 0;

    if (Number.isNaN(latestPart) || Number.isNaN(currentPart)) {
      return latest !== current;
    }

    if (latestPart > currentPart) {
      return true;
    }

    if (latestPart < currentPart) {
      return false;
    }
  }

  return false;
}

export async function enforceLatestVersion(currentVersion: string): Promise<void> {
  // Dev bypass. Set VERGLOS_DEV_SKIP_UPDATE_CHECK=1 when running a local
  // build during development so the gate doesn't block iteration whenever
  // npm is one release ahead. Never document this to end users — it exists
  // purely for the maintainers running an unpublished `packages/cli/dist`.
  if (process.env.VERGLOS_DEV_SKIP_UPDATE_CHECK === "1") return;

  const latestVersion = await fetchLatestVersion();

  if (!latestVersion || !isNewerVersion(latestVersion, currentVersion)) {
    return;
  }

  console.error(chalk.red("A newer Verglos CLI is required."));
  console.error(
    chalk.gray(`Installed: ${currentVersion}  Latest: ${latestVersion}`),
  );
  console.error(chalk.gray("Run `verglos update` and try again."));
  process.exit(1);
}

export type UpdateResult =
  | { readonly status: "ok"; readonly currentVersion: string; readonly latestVersion: string; readonly updated: boolean }
  | { readonly status: "error"; readonly code: "UPDATE_VERSION_CHECK" | "UPDATE_INSTALL_FAILED"; readonly message: string };

export interface UpdateDependencies {
  readonly fetchLatestVersion: () => Promise<string | null>;
  readonly installLatest: (quiet: boolean) => Promise<void>;
}

const defaultDependencies: UpdateDependencies = {
  fetchLatestVersion,
  installLatest: (quiet) => new Promise<void>((resolve, reject) => {
    const command = process.platform === "win32" ? "npm.cmd" : "npm";
    const child = spawn(command, ["install", "-g", "verglos@latest"], {
      stdio: quiet ? "ignore" : "inherit",
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`npm install exited with code ${code ?? "unknown"}`));
    });
  }),
};

/**
 * Resolve and optionally install the latest CLI. Output and process exits are
 * owned by the command boundary so JSON/quiet invocations stay deterministic.
 */
export async function updateCli(
  currentVersion: string,
  dependencies: UpdateDependencies = defaultDependencies,
  options: { readonly quiet?: boolean; readonly onInstallStart?: (latestVersion: string) => void } = {},
): Promise<UpdateResult> {
  let latestVersion: string | null;
  try {
    latestVersion = await dependencies.fetchLatestVersion();
  } catch {
    return { status: "error", code: "UPDATE_VERSION_CHECK", message: "could not check npm for the latest Verglos CLI" };
  }
  if (!latestVersion) return { status: "error", code: "UPDATE_VERSION_CHECK", message: "could not check npm for the latest Verglos CLI" };
  if (!isNewerVersion(latestVersion, currentVersion)) {
    return { status: "ok", currentVersion, latestVersion, updated: false };
  }
  try {
    options.onInstallStart?.(latestVersion);
    await dependencies.installLatest(options.quiet === true);
    return { status: "ok", currentVersion, latestVersion, updated: true };
  } catch {
    return { status: "error", code: "UPDATE_INSTALL_FAILED", message: "Verglos CLI update failed" };
  }
}
