import { DEFAULT_API_URL } from "./credentials.js";

/**
 * Thin fetch wrappers for the v1 license endpoints. Kept separate
 * from credentials.ts so `whoami` and `activate` can share error
 * shapes without pulling in disk I/O.
 */

export type ValidateResult =
  | {
      valid: true;
      plan: string;
      expiresAt: string | null;
      active: true;
    }
  | {
      valid: false;
      reason: "not_found" | "expired" | "inactive" | "bad_request" | "network";
      plan?: string;
      expiresAt?: string | null;
      httpStatus?: number;
    };

export interface StatusResult {
  ok: true;
  email: string | null;
  plan: string;
  licenseKey: string;
  expiresAt: string | null;
  active: boolean;
  machines: {
    fingerprint: string;
    machineId: string | null;
    projectName: string | null;
    lastSeenAt: string;
  }[];
}

export type StatusError = {
  ok: false;
  reason:
    | "missing_bearer_token"
    | "invalid_token"
    | "license_not_found"
    | "network"
    | "unknown";
  httpStatus?: number;
};

const REQUEST_TIMEOUT_MS = 5000;

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export async function validateLicense(
  licenseKey: string,
  apiUrl: string = DEFAULT_API_URL,
): Promise<ValidateResult> {
  try {
    const res = await fetchWithTimeout(`${apiUrl}/api/v1/license/validate`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ license_key: licenseKey }),
    });
    const body = (await res.json().catch(() => ({}))) as {
      valid?: boolean;
      reason?: ValidateResult extends { valid: false }
        ? ValidateResult["reason"]
        : string;
      plan?: string;
      expires_at?: string | null;
    };

    if (body.valid === true && body.plan) {
      return {
        valid: true,
        plan: body.plan,
        expiresAt: body.expires_at ?? null,
        active: true,
      };
    }

    if (res.status === 400) {
      return { valid: false, reason: "bad_request", httpStatus: 400 };
    }

    // Server can return valid:false with a reason (200) or 404 for
    // "no such key at all." Normalise both.
    if (res.status === 404) {
      return { valid: false, reason: "not_found", httpStatus: 404 };
    }

    const reason =
      body.reason === "expired" || body.reason === "inactive"
        ? body.reason
        : "not_found";
    return {
      valid: false,
      reason: reason as "expired" | "inactive" | "not_found",
      plan: body.plan,
      expiresAt: body.expires_at ?? null,
      httpStatus: res.status,
    };
  } catch {
    return { valid: false, reason: "network" };
  }
}

export async function fetchLicenseStatus(
  licenseKey: string,
  apiUrl: string = DEFAULT_API_URL,
): Promise<StatusResult | StatusError> {
  try {
    const res = await fetchWithTimeout(`${apiUrl}/api/v1/license/status`, {
      method: "GET",
      headers: { authorization: `Bearer ${licenseKey}` },
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as {
        reason?: StatusError["reason"];
      };
      return {
        ok: false,
        reason: body.reason ?? "unknown",
        httpStatus: res.status,
      };
    }
    const body = (await res.json()) as {
      ok: boolean;
      email?: string | null;
      plan?: string;
      license_key?: string;
      expires_at?: string | null;
      active?: boolean;
      machines?: {
        fingerprint: string;
        machine_id: string | null;
        project_name: string | null;
        last_seen_at: string;
      }[];
    };
    return {
      ok: true,
      email: body.email ?? null,
      plan: body.plan ?? "pro",
      licenseKey: body.license_key ?? licenseKey,
      expiresAt: body.expires_at ?? null,
      active: body.active !== false,
      machines: (body.machines ?? []).map((m) => ({
        fingerprint: m.fingerprint,
        machineId: m.machine_id,
        projectName: m.project_name,
        lastSeenAt: m.last_seen_at,
      })),
    };
  } catch {
    return { ok: false, reason: "network" };
  }
}
