import { spawn } from "node:child_process";
import chalk from "chalk";

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

    const metadata = (await response.json()) as LatestPackageMetadata;
    return metadata.version ?? null;
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

export async function updateCli(currentVersion: string): Promise<void> {
  const latestVersion = await fetchLatestVersion();

  if (!latestVersion) {
    console.error(chalk.red("Could not check npm for the latest Verglos CLI."));
    process.exit(1);
  }

  if (!isNewerVersion(latestVersion, currentVersion)) {
    console.log(chalk.green(`Verglos CLI is already up to date (${currentVersion}).`));
    return;
  }

  console.log(
    chalk.gray(`Updating Verglos CLI from ${currentVersion} to ${latestVersion}...`),
  );

  await new Promise<void>((resolve, reject) => {
    const command = process.platform === "win32" ? "npm.cmd" : "npm";
    const child = spawn(command, ["install", "-g", "verglos@latest"], {
      stdio: "inherit",
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`npm install exited with code ${code ?? "unknown"}`));
    });
  }).catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(chalk.red(`Update failed: ${message}`));
    process.exit(1);
  });
}
