import chalk from "chalk";
import open from "open";
import ora from "ora";
import {
  DEFAULT_API_URL,
  loadCredentials,
  saveCredentials,
} from "./credentials.js";
import { readJsonResponse } from "./http-response.js";

/**
 * `verglos login` — device-code flow.
 *
 * The pattern used by `gh auth login`, `flyctl auth login`,
 * `vercel login`, `aws sso login`. No custom URL scheme, no manual
 * key paste.
 *
 *   1. CLI POSTs /api/v1/cli-auth/start
 *   2. CLI prints the short verify URL + the 8-char user_code
 *   3. CLI best-effort-opens the URL in a browser
 *   4. CLI polls /status every N seconds until authorized or
 *      15-minute timeout
 *   5. On authorized: saves licenseKey + plan + expires_at
 */

interface StartResponse {
  user_code: string;
  device_code: string;
  verify_url: string;
  verify_url_short: string;
  expires_at: string;
  poll_interval_seconds: number;
}

type StatusResponse =
  | { status: "pending" }
  | {
      status: "authorized";
      license_key: string;
      plan: string;
      expires_at: string | null;
    }
  | { status: "expired"; reason?: string };

const LOGIN_TIMEOUT_MS = 15 * 60 * 1000;
const DEFAULT_POLL_MS = 3000;
const REQUEST_TIMEOUT_MS = 8000;

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs = REQUEST_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function startDeviceFlow(apiUrl: string): Promise<StartResponse> {
  const res = await fetchWithTimeout(`${apiUrl}/api/v1/cli-auth/start`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  if (!res.ok) {
    throw new Error(
      `Could not start device-code flow (HTTP ${res.status}). Try again in a moment.`,
    );
  }
  const body = await readJsonResponse(res);
  if (!body || typeof body !== "object") throw new Error("Device-code response was invalid.");
  return body as StartResponse;
}

async function pollOnce(
  apiUrl: string,
  deviceCode: string,
): Promise<StatusResponse | null> {
  try {
    const res = await fetchWithTimeout(
      `${apiUrl}/api/v1/cli-auth/status?device_code=${encodeURIComponent(deviceCode)}`,
      { method: "GET" },
      REQUEST_TIMEOUT_MS,
    );
    if (!res.ok) return null;
    const body = await readJsonResponse(res);
    return body && typeof body === "object" ? body as StatusResponse : null;
  } catch {
    return null;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface LoginOptions {
  timeoutMs?: number;
  json?: boolean;
  quiet?: boolean;
}

export async function executeLogin(opts: LoginOptions = {}): Promise<number> {
  const creds = await loadCredentials();
  const apiUrl = creds.apiUrl ?? DEFAULT_API_URL;

  let start: StartResponse;
  try {
    start = await startDeviceFlow(apiUrl);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not start login.";
    if (opts.json) console.log(JSON.stringify({ status: "error", code: "LOGIN_START", message }));
    else if (!opts.quiet) console.error(chalk.red(message));
    return 1;
  }

  if (opts.json) {
    console.log(JSON.stringify({
      status: "pending",
      verifyUrl: start.verify_url,
      verifyUrlShort: start.verify_url_short,
      userCode: start.user_code,
      expiresAt: start.expires_at,
    }));
  } else if (!opts.quiet) {
    console.log(chalk.bold("Verglos sign-in"));
    console.log("");
    console.log("  Visit:");
    console.log(`    ${chalk.cyan(start.verify_url_short)}`);
    console.log("");
    console.log("  And enter the code:");
    console.log(`    ${chalk.bold(start.user_code)}`);
    console.log("");
    console.log(chalk.gray("  Or open this URL directly:"));
    console.log(chalk.gray(`    ${start.verify_url}`));
    console.log("");
  }

  // Best-effort open — swallow errors, don't block the user.
  open(start.verify_url).catch(() => {});

  const spinner = opts.json || opts.quiet
    ? undefined
    : ora({ text: "Waiting for confirmation in your browser...", color: "gray" }).start();

  const pollIntervalMs = Math.max(
    1000,
    (start.poll_interval_seconds ?? 3) * 1000,
  );
  const deadline = Date.now() + (opts.timeoutMs ?? LOGIN_TIMEOUT_MS);

  try {
    while (Date.now() < deadline) {
      await sleep(pollIntervalMs);
      const status = await pollOnce(apiUrl, start.device_code);
      if (!status) continue;

      if (status.status === "authorized") {
        spinner?.stop();
        await saveCredentials({
          ...creds,
          licenseKey: status.license_key,
          plan: status.plan,
          planExpiresAt: status.expires_at ?? undefined,
        });
        const renewal = status.expires_at
          ? ` · renews ${new Date(status.expires_at).toLocaleDateString(
              undefined,
              { year: "numeric", month: "short", day: "numeric" },
            )}`
          : status.plan === "founder"
            ? " · unlimited"
            : "";
        if (opts.json) console.log(JSON.stringify({ status: "ok", plan: status.plan, expiresAt: status.expires_at }));
        else if (!opts.quiet) {
          console.log(chalk.green(`✓ ${status.plan.toUpperCase()} activated${renewal}`));
          console.log(chalk.gray("  Run `verglos whoami` to double-check."));
        }
        return 0;
      }

      if (status.status === "expired") {
        spinner?.stop();
        if (opts.json) console.log(JSON.stringify({ status: "error", code: "LOGIN_EXPIRED", message: "Login code expired before confirmation." }));
        else if (!opts.quiet) console.error(chalk.red("Login code expired before you confirmed. Run `verglos login` again."));
        return 1;
      }
      // status === "pending" → keep spinning.
    }

    spinner?.stop();
    if (opts.json) console.log(JSON.stringify({ status: "error", code: "LOGIN_TIMEOUT", message: "Timed out waiting for browser confirmation." }));
    else if (!opts.quiet) console.error(chalk.red("Timed out waiting for browser confirmation (15 minutes). Run `verglos login` again when you're ready."));
    return 1;
  } catch (err) {
    spinner?.stop();
    const message = `Login failed: ${err instanceof Error ? err.message : "unknown error"}`;
    if (opts.json) console.log(JSON.stringify({ status: "error", code: "LOGIN_FAILED", message: "login failed" }));
    else if (!opts.quiet) console.error(chalk.red(message));
    return 1;
  }
}
