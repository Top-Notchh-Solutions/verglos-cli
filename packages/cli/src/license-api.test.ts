import assert from "node:assert/strict";
import { test } from "node:test";
import { validateLicense } from "./license-api.js";

test("license validation prefers a bounded v2 token and keeps v1 validation compatibility", async () => {
  const originalFetch = globalThis.fetch;
  const calls: Array<{ url: string; method: string; authorization?: string }> = [];
  globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    const url = String(input);
    const headers = new Headers(init?.headers);
    calls.push({ url, method: init?.method ?? "GET", authorization: headers.get("authorization") ?? undefined });
    if (url.endsWith("/api/v1/license/validate")) {
      return Response.json({ valid: true, plan: "pro", entitlement_token: "legacy.header.signature" });
    }
    return Response.json({ ok: true, token_version: 2, entitlement_token: "v2.header.signature" });
  }) as typeof fetch;
  try {
    const result = await validateLicense("vg_test_license", "https://verglos.test");
    assert.equal(result.valid, true);
    if (!result.valid) return;
    assert.equal(result.entitlementToken, "v2.header.signature");
    assert.deepEqual(calls.map(({ url, method }) => [url, method]), [
      ["https://verglos.test/api/v1/license/validate", "POST"],
      ["https://verglos.test/api/v2/entitlement/token", "POST"],
    ]);
    assert.equal(calls[1]?.authorization, "Bearer vg_test_license");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("license validation retains the legacy token when v2 issuance is unavailable or malformed", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async (input: string | URL | Request) => {
    const url = String(input);
    if (url.endsWith("/api/v1/license/validate")) {
      return Response.json({ valid: true, plan: "pro", entitlement_token: "legacy.header.signature" });
    }
    return Response.json({ ok: true, token_version: 3, entitlement_token: "unsupported.header.signature" });
  }) as typeof fetch;
  try {
    const result = await validateLicense("vg_test_license", "https://verglos.test");
    assert.equal(result.valid, true);
    if (result.valid) assert.equal(result.entitlementToken, "legacy.header.signature");
  } finally {
    globalThis.fetch = originalFetch;
  }
});
