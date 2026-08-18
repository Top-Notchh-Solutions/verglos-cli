import { DEFAULT_API_URL, loadCredentials } from "./credentials.js";

/**
 * Shared license-authenticated fetch used by every CLI command that
 * hits a paid endpoint (`monitor`, `attest`, and any future rotate/
 * sbom commands).
 *
 * Extracted from `monitor.ts` when the second caller (`attest`) came
 * online — same shape, same reason strings, same status-code
 * conventions so every command's error-explain block can pattern-
 * match identically.
 *
 * `reason` values map to the HTTP status the server returns and the
 * copy `explainFetchFailure()` should print:
 *   no_license          — no license in the credentials file
 *   unauthorized        — 401/402 (bad token or wrong tier)
 *   not_found           — 404
 *   not_implemented     — 501 (endpoint not shipped in this deploy)
 *   network             — fetch itself threw (DNS/TLS/offline)
 *   other               — non-OK response we don't specifically flag
 */

export interface AuthorizedFetchResult {
  ok: boolean;
  status: number;
  json: unknown;
  reason?:
    | "no_license"
    | "unauthorized"
    | "not_implemented"
    | "not_found"
    | "network"
    | "other";
}

export async function authorizedFetch(
  path: string,
  init: { method: string; body?: unknown } = { method: "GET" },
): Promise<AuthorizedFetchResult> {
  const creds = await loadCredentials();
  if (!creds.licenseKey) {
    return { ok: false, status: 0, json: null, reason: "no_license" };
  }
  const url = `${creds.apiUrl ?? DEFAULT_API_URL}${path}`;
  try {
    const res = await fetch(url, {
      method: init.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${creds.licenseKey}`,
      },
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
    });
    const json = await res.json().catch(() => null);
    if (res.status === 401 || res.status === 402) {
      return { ok: false, status: res.status, json, reason: "unauthorized" };
    }
    if (res.status === 404) {
      return { ok: false, status: 404, json, reason: "not_found" };
    }
    if (res.status === 501) {
      return { ok: false, status: 501, json, reason: "not_implemented" };
    }
    if (!res.ok) {
      return { ok: false, status: res.status, json, reason: "other" };
    }
    return { ok: true, status: res.status, json };
  } catch {
    return { ok: false, status: 0, json: null, reason: "network" };
  }
}
