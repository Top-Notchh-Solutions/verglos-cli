import { DEFAULT_API_URL, getTrustedApiOrigin } from "./credentials.js";
import { fetchJsonResponse } from "./http-response.js";

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
    const { response: res, json: body } = await fetchJsonResponse(`${apiUrl}/api/v2/entitlement/token`, {
      method: "POST",
      headers: { authorization: `Bearer ${licenseKey}` },
    }, { timeoutMs: REQUEST_TIMEOUT_MS });
    if (!res.ok) return undefined;
    const typedBody = body as { ok?: unknown; token_version?: unknown; entitlement_token?: unknown } | null;
    if (typedBody?.ok !== true || typedBody.token_version !== 2 || typeof typedBody.entitlement_token !== "string"
      || typedBody.entitlement_token.length > MAX_ENTITLEMENT_TOKEN_CHARS
      || typedBody.entitlement_token.split(".").length !== 3) return undefined;
    return typedBody.entitlement_token;
  } catch {
    // V1 validation remains the compatibility path when v2 issuance is
    // unavailable (for example, before a tenant mapping is provisioned).
    return undefined;
  }
}

export async function validateLicense(
  licenseKey: string,
  apiUrl: string = DEFAULT_API_URL,
): Promise<ValidateResult> {
  const apiOrigin = getTrustedApiOrigin(apiUrl);
  if (!apiOrigin) return { valid: false, reason: "network" };

  try {
    const { response: res, json: body } = await fetchJsonResponse(`${apiOrigin}/api/v1/license/validate`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ license_key: licenseKey }),
    }, { timeoutMs: REQUEST_TIMEOUT_MS });
    const typedBody = (body ?? {}) as {
      valid?: boolean;
      reason?: ValidateResult extends { valid: false }
        ? ValidateResult["reason"]
        : string;
      plan?: string;
      expires_at?: string | null;
      entitlement_token?: string;
    };

    if (typedBody.valid === true && typedBody.plan) {
      const legacyToken = typeof typedBody.entitlement_token === "string"
        && typedBody.entitlement_token.length <= MAX_ENTITLEMENT_TOKEN_CHARS
        && typedBody.entitlement_token.split(".").length === 3
        ? typedBody.entitlement_token
        : undefined;
      const v2Token = await fetchV2EntitlementToken(licenseKey, apiUrl);
      return {
        valid: true,
        plan: typedBody.plan,
        expiresAt: typedBody.expires_at ?? null,
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
      typedBody.reason === "expired" || typedBody.reason === "inactive"
        ? typedBody.reason
        : "not_found";
    return {
      valid: false,
      reason: reason as "expired" | "inactive" | "not_found",
      plan: typedBody.plan,
      expiresAt: typedBody.expires_at ?? null,
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
  const apiOrigin = getTrustedApiOrigin(apiUrl);
  if (!apiOrigin) return { ok: false, reason: "network" };

  try {
    const { response: res, json: body } = await fetchJsonResponse(`${apiOrigin}/api/v1/license/status`, {
      method: "GET",
      headers: { authorization: `Bearer ${licenseKey}` },
    }, { timeoutMs: REQUEST_TIMEOUT_MS });
    if (!res.ok) {
      const typedBody = (body ?? {}) as {
        reason?: StatusError["reason"];
      };
      return {
        ok: false,
        reason: typedBody.reason ?? "unknown",
        httpStatus: res.status,
      };
    }
    const typedBody = body as {
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
    if (!typedBody || typeof typedBody !== "object") return { ok: false, reason: "unknown", httpStatus: res.status };
    return {
      ok: true,
      email: typedBody.email ?? null,
      plan: typedBody.plan ?? "pro",
      licenseKey: typedBody.license_key ?? licenseKey,
      expiresAt: typedBody.expires_at ?? null,
      active: typedBody.active !== false,
      machines: (typedBody.machines ?? []).map((m) => ({
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
