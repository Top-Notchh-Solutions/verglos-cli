import { DEFAULT_API_URL, getTrustedApiOrigin, loadCredentials } from "./credentials.js";
import { readOrganizationPolicyCache, writeOrganizationPolicyCache } from "./organization-policy-cache.js";
import { resolveOrganizationPolicy, type OrganizationPolicyCacheEntry, type OrganizationPolicyPublicKey } from "@verglos/shared";

const MAX_RESPONSE_BYTES = 1 * 1024 * 1024;
const DEFAULT_TIMEOUT_MS = 8_000;
const MAX_TIMEOUT_MS = 10_000;

function isSafePolicyEndpoint(value: string): boolean {
  return value.length > 0
    && value.length <= 2048
    && value.startsWith("/")
    && !value.startsWith("//")
    && !value.includes("\\")
    && !value.includes("?")
    && !value.includes("#")
    && !/[\u0000-\u001f\u007f]/u.test(value);
}

export type OrganizationPolicyFetchResult = Readonly<{
  resolved: boolean;
  source?: "remote" | "cache";
  entry?: OrganizationPolicyCacheEntry;
  reason?: string;
  status?: number;
}>;

export async function fetchOrganizationPolicy(input: Readonly<{
  organizationId: string;
  repositoryId: string;
  trustedKeys: readonly OrganizationPolicyPublicKey[];
  cachePath: string;
  offline?: boolean;
  apiUrl?: string;
  licenseKey?: string;
  endpoint?: string;
  now?: string;
  cacheTtlMs?: number;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
}>): Promise<OrganizationPolicyFetchResult> {
  const timeoutMs = input.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs <= 0 || timeoutMs > MAX_TIMEOUT_MS) {
    return { resolved: false, reason: "timeout-out-of-bounds" };
  }
  const now = input.now ?? new Date().toISOString();
  const scope = { organizationId: input.organizationId, repositoryId: input.repositoryId };
  let cached: OrganizationPolicyCacheEntry | undefined;
  try { cached = (await readOrganizationPolicyCache(input.cachePath, scope)) ?? undefined; }
  catch (error) { return { resolved: false, reason: error instanceof Error ? error.message : "cache-invalid" }; }

  let remote: unknown;
  let status: number | undefined;
  if (!input.offline) {
    const creds = await loadCredentials();
    const apiUrl = getTrustedApiOrigin(input.apiUrl ?? creds.apiUrl ?? DEFAULT_API_URL);
    if (!apiUrl) return { resolved: false, reason: "unsafe-api-url" };
    const licenseKey = input.licenseKey ?? creds.licenseKey;
    if (!licenseKey) return { resolved: false, reason: "no-license" };
    const endpoint = input.endpoint ?? `/api/v1/organizations/${encodeURIComponent(input.organizationId)}/repositories/${encodeURIComponent(input.repositoryId)}/policy`;
    if (!isSafePolicyEndpoint(endpoint)) return { resolved: false, reason: "unsafe-policy-endpoint" };
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await (input.fetchImpl ?? fetch)(`${apiUrl}${endpoint}`, {
        method: "GET",
        headers: { Accept: "application/json", Authorization: `Bearer ${licenseKey}` },
        signal: controller.signal,
      });
      status = response.status;
      const length = Number(response.headers.get("content-length") ?? "0");
      if (Number.isFinite(length) && length > MAX_RESPONSE_BYTES) return { resolved: false, reason: "response-too-large", status };
      const bytes = await readBoundedResponse(response);
      if (bytes === undefined) return { resolved: false, reason: "response-too-large", status };
      if (response.ok) {
        try { remote = JSON.parse(new TextDecoder().decode(bytes)); }
        catch { return { resolved: false, reason: "response-invalid-json", status }; }
      } else if (!cached) return { resolved: false, reason: `http-${response.status}`, status };
    } catch {
      if (!cached && !input.offline) return { resolved: false, reason: "network", status };
    } finally { clearTimeout(timeout); }
  }

  const resolution = resolveOrganizationPolicy({
    ...scope,
    now,
    offline: Boolean(input.offline),
    remote,
    cached,
    trustedKeys: input.trustedKeys,
    cacheTtlMs: input.cacheTtlMs ?? 24 * 60 * 60 * 1000,
  });
  if (!resolution.resolved) return { resolved: false, reason: resolution.reason, status };
  if (resolution.entry.source === "remote") {
    try { await writeOrganizationPolicyCache(input.cachePath, resolution.entry); }
    catch (error) { return { resolved: false, reason: error instanceof Error ? error.message : "cache-write-failed", status }; }
  }
  return { resolved: true, source: resolution.entry.source, entry: resolution.entry, status };
}

/** Read a provider response without materializing more than the policy cap. */
async function readBoundedResponse(response: Response): Promise<Uint8Array | undefined> {
  if (response.body === null) return new Uint8Array();
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const next = await reader.read();
      if (next.done) break;
      const chunk = next.value;
      if (!(chunk instanceof Uint8Array)) return undefined;
      total += chunk.byteLength;
      if (total > MAX_RESPONSE_BYTES) {
        await reader.cancel();
        return undefined;
      }
      chunks.push(chunk);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}
