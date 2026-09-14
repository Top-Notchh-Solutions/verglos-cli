import { DEFAULT_API_URL } from "./credentials.js";
import { readJsonResponse } from "./http-response.js";

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
      /**
       * Ed25519-signed entitlement JWT issued by the server. When
       * present, the CLI stores it in Credentials.entitlementToken so
       * paid gates can pass offline via @verglos/entitlement's local
       * verify path. Older server builds may not return this; the CLI
       * degrades gracefully to REST-only when it is absent.
       */
      entitlementToken?: string;
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
const MAX_ENTITLEMENT_TOKEN_CHARS = 128_000;

async function fetchV2EntitlementToken(licenseKey: string, apiUrl: string): Promise<string | undefined> {
  try {
    const res = await fetchWithTimeout(`${apiUrl}/api/v2/entitlement/token`, {
      method: "POST",
      headers: { authorization: `Bearer ${licenseKey}` },
    });
    if (!res.ok) return undefined;
    const body = await readJsonResponse(res) as { ok?: unknown; token_version?: unknown; entitlement_token?: unknown } | null;
    if (body?.ok !== true || body.token_version !== 2 || typeof body.entitlement_token !== "string"
      || body.entitlement_token.length > MAX_ENTITLEMENT_TOKEN_CHARS
      || body.entitlement_token.split(".").length !== 3) return undefined;
    return body.entitlement_token;
  } catch {
    // V1 validation remains the compatibility path when v2 issuance is
    // unavailable (for example, before a tenant mapping is provisioned).
    return undefined;
  }
}

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
    const body = ((await readJsonResponse(res)) ?? {}) as {
      valid?: boolean;
      reason?: ValidateResult extends { valid: false }
        ? ValidateResult["reason"]
        : string;
      plan?: string;
      expires_at?: string | null;
      entitlement_token?: string;
    };

    if (body.valid === true && body.plan) {
      const legacyToken = typeof body.entitlement_token === "string"
        && body.entitlement_token.length <= MAX_ENTITLEMENT_TOKEN_CHARS
        && body.entitlement_token.split(".").length === 3
        ? body.entitlement_token
        : undefined;
      const v2Token = await fetchV2EntitlementToken(licenseKey, apiUrl);
      return {
        valid: true,
        plan: body.plan,
        expiresAt: body.expires_at ?? null,
        active: true,
        entitlementToken: v2Token ?? legacyToken,
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
      const body = ((await readJsonResponse(res)) ?? {}) as {
        reason?: StatusError["reason"];
      };
      return {
        ok: false,
        reason: body.reason ?? "unknown",
        httpStatus: res.status,
      };
    }
    const body = (await readJsonResponse(res)) as {
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
    if (!body || typeof body !== "object") return { ok: false, reason: "unknown", httpStatus: res.status };
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
