import { createHash } from "node:crypto";
import { homedir, hostname, userInfo } from "node:os";
import { join } from "node:path";
import { mkdir, readFile, writeFile, access } from "node:fs/promises";

export interface Credentials {
  licenseKey?: string;
  unlockToken?: string;
  unlockTokenExpires?: string;
  apiUrl: string;
  // Cached from the most recent /api/v1/license/validate or
  // /api/v1/license/status call. Used by `verglos whoami` to render
  // an accurate view offline. Never trusted for gating — that check
  // still hits the server.
  plan?: string;
  planExpiresAt?: string;
  email?: string;
  /**
   * Ed25519-signed entitlement JWT issued by the server at activation.
   * Verified locally via @verglos/entitlement so paid gates can pass
   * offline. Absence is not fatal — the REST capabilities path keeps
   * working. See docs/architecture/entitlement.md for the flow.
   */
  entitlementToken?: string;
}

const CREDENTIALS_DIR = join(homedir(), ".verglos");
const CREDENTIALS_FILE = join(CREDENTIALS_DIR, "credentials.json");
const SCORE_CACHE_FILE = join(CREDENTIALS_DIR, "last-score.json");

export const DEFAULT_API_URL =
  process.env.VERGLOS_API_URL ?? "https://verglos.com";

export async function loadCredentials(): Promise<Credentials> {
  try {
    const raw = await readFile(CREDENTIALS_FILE, "utf8");
    return { apiUrl: DEFAULT_API_URL, ...JSON.parse(raw) };
  } catch {
    return { apiUrl: DEFAULT_API_URL };
  }
}

export async function saveCredentials(creds: Credentials): Promise<void> {
  try {
    await mkdir(CREDENTIALS_DIR, { recursive: true });
    await writeFile(CREDENTIALS_FILE, JSON.stringify(creds, null, 2), "utf8");
  } catch {
    // Non-fatal if home dir is not writable
  }
}

export async function isUnlocked(): Promise<boolean> {
  const creds = await loadCredentials();
  if (!creds.unlockToken) return false;
  if (creds.unlockTokenExpires) {
    return new Date(creds.unlockTokenExpires) > new Date();
  }
  return !!creds.licenseKey;
}

export async function refreshUnlockToken(
  projectRoot: string,
): Promise<boolean> {
  const creds = await loadCredentials();
  if (!creds.licenseKey) return false;

  const { detectProjectType, getGitRemote } = await import(
    "@verglos/scanner"
  );
  const { computeFingerprint } = await import("@verglos/shared");

  const { packageName } = await detectProjectType(projectRoot);
  const gitRemote = await getGitRemote(projectRoot);
  const fingerprint = computeFingerprint({
    packageName,
    gitRemote,
    projectRoot,
  });

  try {
    const res = await fetch(`${creds.apiUrl}/api/license/unlock`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        licenseKey: creds.licenseKey,
        fingerprint,
        machineId: getMachineId(),
      }),
    });

    if (!res.ok) return false;

    const data = (await res.json()) as {
      token: string;
      expiresAt: string;
    };

    await saveCredentials({
      ...creds,
      unlockToken: data.token,
      unlockTokenExpires: data.expiresAt,
    });

    return true;
  } catch {
    return false;
  }
}

function getMachineId(): string {
  return createHash("sha256")
    .update(`${hostname()}-${userInfo().username}`)
    .digest("hex")
    .slice(0, 16);
}

export async function saveLastScore(
  projectRoot: string,
  score: number,
  criticals: number,
): Promise<void> {
  try {
    await mkdir(CREDENTIALS_DIR, { recursive: true });
    const key = projectRoot.replace(/\//g, "_");
    let cache: Record<string, { score: number; criticals: number }> = {};
    try {
      const raw = await readFile(SCORE_CACHE_FILE, "utf8");
      cache = JSON.parse(raw) as typeof cache;
    } catch {
      // fresh
    }
    cache[key] = { score, criticals };
    await writeFile(SCORE_CACHE_FILE, JSON.stringify(cache, null, 2), "utf8");
  } catch {
    // Non-fatal
  }
}

export async function loadLastScore(
  projectRoot: string,
): Promise<{ score: number; criticals: number } | undefined> {
  try {
    const raw = await readFile(SCORE_CACHE_FILE, "utf8");
    const cache = JSON.parse(raw) as Record<
      string,
      { score: number; criticals: number }
    >;
    return cache[projectRoot.replace(/\//g, "_")];
  } catch {
    return undefined;
  }
}

export async function credentialsExist(): Promise<boolean> {
  try {
    await access(CREDENTIALS_FILE);
    return true;
  } catch {
    return false;
  }
}
