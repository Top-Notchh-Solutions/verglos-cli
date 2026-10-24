import { spawn } from "node:child_process";
import chalk from "chalk";
import { readJsonResponse } from "./http-response.js";

const REGISTRY_METADATA_URL = "https://registry.npmjs.org/verglos";
const VERSION_PATTERN = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/u;

type ParsedVersion = Readonly<{
  major: number;
  minor: number;
  patch: number;
  prerelease: readonly (number | string)[];
}>;

type PackageMetadata = Readonly<{
  versions?: Record<string, unknown>;
}>;

function parseVersion(value: string): ParsedVersion | null {
  const match = VERSION_PATTERN.exec(value);
  if (!match) return null;
  const prerelease = match[4]?.split(".").map((part) => /^\d+$/u.test(part) ? Number(part) : part) ?? [];
  if (prerelease.some((part) => typeof part === "number" && (!Number.isSafeInteger(part) || part < 0))) return null;
  return { major: Number(match[1]), minor: Number(match[2]), patch: Number(match[3]), prerelease };
}

function comparePrerelease(left: ParsedVersion["prerelease"], right: ParsedVersion["prerelease"]): number {
  if (left.length === 0 && right.length === 0) return 0;
  if (left.length === 0) return 1;
  if (right.length === 0) return -1;
  const length = Math.max(left.length, right.length);
  for (let index = 0; index < length; index += 1) {
    const leftPart = left[index];
    const rightPart = right[index];
    if (leftPart === undefined) return -1;
    if (rightPart === undefined) return 1;
    if (leftPart === rightPart) continue;
    if (typeof leftPart === "number" && typeof rightPart === "number") return leftPart < rightPart ? -1 : 1;
    if (typeof leftPart === "number") return -1;
    if (typeof rightPart === "number") return 1;
    return leftPart < rightPart ? -1 : 1;
  }
  return 0;
}

export function compareVersions(left: string, right: string): number {
  const leftParsed = parseVersion(left);
  const rightParsed = parseVersion(right);
  if (!leftParsed || !rightParsed) return 0;
  for (const key of ["major", "minor", "patch"] as const) {
    if (leftParsed[key] !== rightParsed[key]) return leftParsed[key] < rightParsed[key] ? -1 : 1;
  }
  return comparePrerelease(leftParsed.prerelease, rightParsed.prerelease);
}

/** Select the newest stable release, independent of npm's mutable dist-tags. */
export function selectLatestStableVersion(metadata: unknown): string | null {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return null;
  const versions = (metadata as PackageMetadata).versions;
  if (!versions || typeof versions !== "object" || Array.isArray(versions)) return null;
  return Object.keys(versions)
    .filter((version) => {
      const parsed = parseVersion(version);
      return parsed !== null && parsed.prerelease.length === 0;
    })
    .sort((left, right) => compareVersions(right, left))[0] ?? null;
}

export async function fetchLatestVersion(): Promise<string | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);

  try {
    const response = await fetch(REGISTRY_METADATA_URL, {
      signal: controller.signal,
      redirect: "error",
      headers: {
        accept: "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }

    return selectLatestStableVersion(await readJsonResponse(response));
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export function isNewerVersion(latest: string, current: string): boolean {
  return compareVersions(latest, current) > 0;
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
  readonly installLatest: (version: string, quiet: boolean) => Promise<void>;
}

const defaultDependencies: UpdateDependencies = {
  fetchLatestVersion,
  installLatest: (version, quiet) => new Promise<void>((resolve, reject) => {
    const command = process.platform === "win32" ? "npm.cmd" : "npm";
    const child = spawn(command, ["install", "-g", `verglos@${version}`], {
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
    return { status: "error", code: "UPDATE_VERSION_CHECK", message: "could not check npm for the latest stable Verglos CLI" };
  }
  if (!latestVersion) return { status: "error", code: "UPDATE_VERSION_CHECK", message: "could not check npm for the latest stable Verglos CLI" };
  if (!isNewerVersion(latestVersion, currentVersion)) {
    return { status: "ok", currentVersion, latestVersion, updated: false };
  }
  try {
    options.onInstallStart?.(latestVersion);
    await dependencies.installLatest(latestVersion, options.quiet === true);
    return { status: "ok", currentVersion, latestVersion, updated: true };
  } catch {
    return { status: "error", code: "UPDATE_INSTALL_FAILED", message: "Verglos CLI update failed" };
  }
}
