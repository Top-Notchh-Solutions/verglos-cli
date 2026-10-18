import { lstat, readFile } from "node:fs/promises";
import {
  admitClientProjectionUpload,
  type ClientProjectionDecision,
  type ClientUploadApproval,
} from "@verglos/shared";
import { DEFAULT_API_URL, getTrustedApiOrigin, loadCredentials } from "./credentials.js";

const MAX_FILE_BYTES = 256 * 1024;
const MAX_RESPONSE_BYTES = 64 * 1024;
const DEFAULT_TIMEOUT_MS = 8_000;
const ID = /^[A-Za-z0-9][A-Za-z0-9._:/-]{0,255}$/u;
type ClientProjectionRejection = Extract<ClientProjectionDecision, { readonly ok: false }>["reason"];

export type ClientProjectionUploadResult = Readonly<
  | {
      status: "uploaded";
      endpoint: string;
      projectionDigest: string;
      idempotent: boolean;
      id?: string;
    }
  | {
      status: "denied";
      endpoint?: string;
      reason: ClientProjectionRejection;
    }
  | {
      status: "error";
      endpoint?: string;
      reason: "no_license" | "invalid_input" | "network" | "http" | "response_too_large" | "invalid_json" | "invalid_response";
    }
>;

type UploadInput = Readonly<{
  projectionPath: string;
  approvalPath: string;
  organizationId: string;
  projectId: string;
  apiUrl?: string;
  licenseKey?: string;
  endpoint?: string;
  now?: string;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
}>;

async function readJsonFile(path: string): Promise<unknown> {
  const entry = await lstat(path);
  if (!entry.isFile() || entry.size > MAX_FILE_BYTES) throw new Error("client projection input must be a bounded regular file");
  const bytes = await readFile(path);
  if (bytes.byteLength > MAX_FILE_BYTES) throw new Error("client projection input exceeds the 256 KiB limit");
  try {
    return JSON.parse(bytes.toString("utf8"));
  } catch {
    throw new Error("client projection input must be valid JSON");
  }
}

function relativeEndpoint(apiUrl: string, organizationId: string, projectId: string, endpoint?: string): string {
  const path = endpoint ?? `/api/v1/organizations/${encodeURIComponent(organizationId)}/projects/${encodeURIComponent(projectId)}/client-projections`;
  if (!path.startsWith("/") || path.startsWith("//") || /[\u0000-\u001f\u007f]/u.test(path) || path.length > 2048) {
    throw new Error("client projection endpoint must be a bounded relative API path");
  }
  return `${apiUrl}${path}`;
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}

async function readResponse(response: Response): Promise<unknown> {
  const length = Number(response.headers.get("content-length") ?? "0");
  if (Number.isFinite(length) && length > MAX_RESPONSE_BYTES) throw new Error("response_too_large");
  const bytes = await response.arrayBuffer();
  if (bytes.byteLength > MAX_RESPONSE_BYTES) throw new Error("response_too_large");
  try {
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    throw new Error("invalid_json");
  }
}

/** Upload only the approved redacted projection; source and raw record bytes never cross this boundary. */
export async function uploadClientProjection(input: UploadInput): Promise<ClientProjectionUploadResult> {
  if (!ID.test(input.organizationId) || !ID.test(input.projectId)) return { status: "error", reason: "invalid_input" };
  let projection: unknown;
  let approval: unknown;
  try {
    [projection, approval] = await Promise.all([readJsonFile(input.projectionPath), readJsonFile(input.approvalPath)]);
  } catch {
    return { status: "error", reason: "invalid_input" };
  }

  const admission = admitClientProjectionUpload({
    actorOrganizationId: input.organizationId,
    projection,
    approval: approval as ClientUploadApproval,
    now: input.now ?? new Date().toISOString(),
  });
  if (!admission.ok) return { status: "denied", reason: admission.reason };

  const credentials = input.licenseKey === undefined || input.apiUrl === undefined ? await loadCredentials() : undefined;
  const licenseKey = input.licenseKey ?? credentials?.licenseKey;
  if (!licenseKey) return { status: "error", reason: "no_license" };
  const apiOrigin = getTrustedApiOrigin(input.apiUrl ?? credentials?.apiUrl ?? DEFAULT_API_URL);
  if (!apiOrigin) return { status: "error", reason: "invalid_input" };

  let endpoint: string;
  try {
    endpoint = relativeEndpoint(apiOrigin, input.organizationId, input.projectId, input.endpoint);
  } catch {
    return { status: "error", reason: "invalid_input" };
  }
  const timeoutMs = input.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs <= 0 || timeoutMs > DEFAULT_TIMEOUT_MS) return { status: "error", endpoint, reason: "invalid_input" };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    let response: Response;
    try {
      response = await (input.fetchImpl ?? fetch)(endpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${licenseKey}`,
        },
        body: JSON.stringify({ projection: admission.projection, approval }),
        redirect: "error",
        signal: controller.signal,
      });
    } catch {
      return { status: "error", endpoint, reason: "network" };
    }

    let value: unknown;
    try {
      value = await readResponse(response);
    } catch (error) {
      const reason = error instanceof Error ? error.message : "invalid_json";
      if (reason === "response_too_large") return { status: "error", endpoint, reason };
      return { status: "error", endpoint, reason: isAbortError(error) ? "network" : "invalid_json" };
    }
    if (!response.ok) return { status: "error", endpoint, reason: "http" };
    if (typeof value !== "object" || value === null || Array.isArray(value)) return { status: "error", endpoint, reason: "invalid_response" };
    const record = value as Record<string, unknown>;
    if (typeof record.projectionDigest !== "string" || record.projectionDigest !== admission.projectionDigest || typeof record.idempotent !== "boolean") {
      return { status: "error", endpoint, reason: "invalid_response" };
    }
    return {
      status: "uploaded",
      endpoint,
      projectionDigest: admission.projectionDigest,
      idempotent: record.idempotent,
      ...(typeof record.id === "string" ? { id: record.id } : {}),
    };
  } finally {
    clearTimeout(timer);
  }
}

export async function executeClientProjectionUpload(
  projectionPath: string,
  approvalPath: string,
  organizationId: string,
  projectId: string,
  json = false,
  quiet = false,
): Promise<number> {
  const result = await uploadClientProjection({ projectionPath, approvalPath, organizationId, projectId });
  if (json) {
    console.log(JSON.stringify(result));
  } else if (!quiet) {
    if (result.status === "uploaded") console.log(`Client projection uploaded: ${result.projectionDigest}${result.idempotent ? " (idempotent)" : ""}`);
    else if (result.status === "denied") console.error(`[STUDIO_CLIENT_PROJECTION_DENIED] ${result.reason}`);
    else console.error(`[STUDIO_CLIENT_PROJECTION_${result.reason.toUpperCase()}] client projection upload failed`);
  }
  return result.status === "uploaded" ? 0 : 78;
}
