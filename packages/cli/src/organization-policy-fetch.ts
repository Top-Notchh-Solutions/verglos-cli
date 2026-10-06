import { DEFAULT_API_URL, loadCredentials } from "./credentials.js";
import { readOrganizationPolicyCache, writeOrganizationPolicyCache } from "./organization-policy-cache.js";
import { resolveOrganizationPolicy, type OrganizationPolicyCacheEntry, type OrganizationPolicyPublicKey } from "@verglos/shared";

const MAX_RESPONSE_BYTES = 1 * 1024 * 1024;
const DEFAULT_TIMEOUT_MS = 8_000;

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
  const now = input.now ?? new Date().toISOString();
  const scope = { organizationId: input.organizationId, repositoryId: input.repositoryId };
  let cached: OrganizationPolicyCacheEntry | undefined;
  try { cached = (await readOrganizationPolicyCache(input.cachePath, scope)) ?? undefined; }
  catch (error) { return { resolved: false, reason: error instanceof Error ? error.message : "cache-invalid" }; }

  let remote: unknown;
  let status: number | undefined;
  if (!input.offline) {
    const creds = await loadCredentials();
    const apiUrl = input.apiUrl ?? creds.apiUrl ?? DEFAULT_API_URL;
    const licenseKey = input.licenseKey ?? creds.licenseKey;
    if (!licenseKey) return { resolved: false, reason: "no-license" };
    const endpoint = input.endpoint ?? `/api/v1/organizations/${encodeURIComponent(input.organizationId)}/repositories/${encodeURIComponent(input.repositoryId)}/policy`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), input.timeoutMs ?? DEFAULT_TIMEOUT_MS);
    try {
      const response = await (input.fetchImpl ?? fetch)(`${apiUrl}${endpoint}`, {
        method: "GET",
        headers: { Accept: "application/json", Authorization: `Bearer ${licenseKey}` },
        signal: controller.signal,
      });
      status = response.status;
      const length = Number(response.headers.get("content-length") ?? "0");
      if (Number.isFinite(length) && length > MAX_RESPONSE_BYTES) return { resolved: false, reason: "response-too-large", status };
      const bytes = await response.arrayBuffer();
      if (bytes.byteLength > MAX_RESPONSE_BYTES) return { resolved: false, reason: "response-too-large", status };
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
