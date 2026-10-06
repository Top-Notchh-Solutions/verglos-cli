import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  generateEntitlementKeyPair,
  privateKeyFromPem,
  signEntitlement,
} from "@verglos/entitlement";
import { validateLicense } from "./license-api.js";

// One temp HOME + one keypair for the whole file. Tests seed
// credentials.json / capabilities.json fresh in each beforeEach.
const tempHome = mkdtempSync(join(tmpdir(), "verglos-jwt-test-"));
process.env.HOME = tempHome;
const kp = generateEntitlementKeyPair();
process.env.VERGLOS_TEST_PUBKEY_B64URL = kp.publicKeyBase64Url;

const mod = await import("./entitlement.js");

after(() => {
  rmSync(tempHome, { recursive: true, force: true });
  delete process.env.VERGLOS_TEST_PUBKEY_B64URL;
});

const verglosDir = join(tempHome, ".verglos");

function seedCredentials(entitlementToken?: string, licenseKey = "vg_test_key") {
  mkdirSync(verglosDir, { recursive: true });
  writeFileSync(
    join(verglosDir, "credentials.json"),
    JSON.stringify({
      apiUrl: "http://127.0.0.1:1",
      licenseKey,
      entitlementToken,
    }),
  );
}

function seedCache(fetchedAt: Date, plan: string, capabilities: string[]) {
  mkdirSync(verglosDir, { recursive: true });
  writeFileSync(
    join(verglosDir, "capabilities.json"),
    JSON.stringify({
      plan,
      real_plan: plan,
      capabilities,
      cache_ttl_seconds: 60,
      simulated: false,
      active: true,
      fetchedAt: fetchedAt.toISOString(),
      expiresAt: fetchedAt.toISOString(),
    }),
  );
}

function signProToken(overrides: Partial<{ tier: string; ttlSeconds: number }> = {}) {
  const tier = (overrides.tier as "pro") ?? "pro";
  return signEntitlement({
    claims: {
      keyHash: createHash("sha256").update("vg_test_key").digest("hex"),
      tier,
      projects: [],
      seats: 1,
      features: ["fix", "ci", "monitor"],
      schemaVersion: 2,
      userId: "user-test",
      tenantId: "tenant-test",
      role: "owner",
      plan: tier,
      capabilities: ["scan", "signed.catalog.capability"],
      allowances: { seats: 2, recordsPerMonth: 100 },
      catalogVersion: "2026-09-14.1",
      tokenId: "00000000-0000-4000-8000-000000000001",
    },
    privateKey: privateKeyFromPem(kp.privateKeyPem),
    ttlSeconds: overrides.ttlSeconds ?? 24 * 60 * 60,
  });
}

function signLegacyProToken() {
  return signEntitlement({
    claims: {
      keyHash: createHash("sha256").update("vg_test_key").digest("hex"),
      tier: "pro",
      projects: [],
      seats: 1,
      features: ["fix", "ci", "monitor"],
    },
    privateKey: privateKeyFromPem(kp.privateKeyPem),
  });
}

function withOfflineFetch<T>(fn: () => Promise<T>): Promise<T> {
  const original = globalThis.fetch;
  globalThis.fetch = (async () => {
    throw new Error("offline");
  }) as typeof fetch;
  return fn().finally(() => {
    globalThis.fetch = original;
  });
}

/** Frozen wire fixtures for PLAN-CLI-004. These are server-shaped payloads,
 * not a second client-side plan catalog: capabilities and allowance keys are
 * intentionally opaque to the CLI. */
const PLAN_CATALOG_FIXTURES = Object.freeze([
  { plan: "free", capabilities: ["scan", "server.scan"], cache_ttl_seconds: 60, simulated: false, active: true, catalog_version: "2026-10-02.0" },
  { plan: "pro", real_plan: "pro", capabilities: ["scan", "server.fix", "vendor.future_capability"], cache_ttl_seconds: 900, simulated: false, active: true, catalog_version: "2026-10-02.0" },
  { plan: "team", real_plan: "team", capabilities: ["scan", "team.policy"], cache_ttl_seconds: 3600, simulated: false, active: true, catalog_version: "2026-10-02.0" },
  { plan: "studio", real_plan: "studio", capabilities: ["scan", "studio.attest"], cache_ttl_seconds: 86_400, simulated: false, active: true, catalog_version: "2026-10-02.0" },
  { plan: "enterprise", real_plan: "enterprise", capabilities: ["scan", "enterprise.sso"], cache_ttl_seconds: 86_400, simulated: false, active: true, catalog_version: "2026-10-02.0" },
] as const);

const SUPPORTED_VERSION_COMPATIBILITY_FIXTURES = Object.freeze([
  { clientVersion: "1.8.3", tokenKind: "legacy-v1", expectedOfflinePlan: "free" },
  { clientVersion: "2.0.0-alpha.1", tokenKind: "signed-v2", expectedOfflinePlan: "pro" },
] as const);

beforeEach(() => {
  rmSync(join(verglosDir, "credentials.json"), { force: true });
  rmSync(join(verglosDir, "capabilities.json"), { force: true });
});

test("resolveEntitlement: signed v2 catalog is the only paid fallback when REST and cache are unavailable", async () => {
  seedCredentials(signProToken());
  const result = await withOfflineFetch(() =>
    mod.resolveEntitlement({ forceRefresh: true }),
  );
  assert.equal(result.plan, "pro");
  assert.equal(result.source, "signed-token");
  assert.deepEqual(result.capabilities, ["scan", "signed.catalog.capability"]);
  assert.equal(result.allowances?.recordsPerMonth, 100);
  assert.equal(result.catalogVersion, "2026-09-14.1");
  assert.equal(result.capabilities.includes("fix.auto"), false, "no locally duplicated paid plan capabilities are added");
  assert.equal(result.license?.tier, "pro");
});

test("resolveEntitlement: newer signed v2 catalog supersedes an older stale cache", async () => {
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
  seedCache(threeDaysAgo, "pro", ["scan", "fix", "custom_cap_from_cache"]);
  seedCredentials(signProToken());
  const result = await withOfflineFetch(() =>
    mod.resolveEntitlement({ forceRefresh: true }),
  );
  assert.equal(result.plan, "pro");
  assert.equal(result.source, "signed-token");
  assert.equal(result.stale, true);
  assert.deepEqual(result.capabilities, ["scan", "signed.catalog.capability"]);
});

test("resolveEntitlement: fresh Free server response overrides a valid paid v2 token", async () => {
  seedCredentials(signProToken());
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async () => Response.json({
    plan: "free",
    real_plan: "free",
    capabilities: ["scan", "server.free.capability"],
    cache_ttl_seconds: 60,
    simulated: false,
    active: true,
  })) as typeof fetch;
  try {
    const result = await mod.resolveEntitlement({ forceRefresh: true });
    assert.equal(result.plan, "free");
    assert.equal(result.source, "rest");
    assert.deepEqual(result.capabilities, ["scan", "server.free.capability"]);
    assert.equal(result.license, undefined);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("PLAN-CLI-004: frozen server catalog fixtures remain opaque and round-trip across supported plans", async () => {
  const originalFetch = globalThis.fetch;
  try {
    for (const fixture of PLAN_CATALOG_FIXTURES) {
      seedCredentials(undefined);
      globalThis.fetch = (async () => Response.json({ ...fixture, allowance_future_dimension: "opaque" })) as typeof fetch;
      const result = await mod.loadCapabilities({ forceRefresh: true });
      assert.equal(result.plan, fixture.plan);
      assert.deepEqual(result.capabilities, fixture.capabilities);
      assert.equal(result.cache_ttl_seconds, fixture.cache_ttl_seconds);
      assert.equal(result.catalog_version, fixture.catalog_version);
      assert.equal(result.source, "rest");
    }
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("PLAN-CLI-001: stale cache from another founder simulation is not reused offline", async () => {
  seedCache(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), "pro", ["scan", "stale.simulation"]);
  seedCredentials(undefined);
  const result = await withOfflineFetch(() => mod.loadCapabilities({ forceRefresh: true, asPlan: "studio" }));
  assert.equal(result.plan, "free");
  assert.equal(result.source, "free");
  assert.equal(result.capabilities.includes("stale.simulation"), false);
});

test("PLAN-CLI-001: malformed catalog version fails closed without accepting paid capabilities", async () => {
  seedCredentials(undefined);
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async () => Response.json({
    plan: "pro",
    capabilities: ["paid.from.invalid.catalog"],
    cache_ttl_seconds: 60,
    simulated: false,
    active: true,
    catalog_version: "future-catalog",
  })) as typeof fetch;
  try {
    const result = await mod.loadCapabilities({ forceRefresh: true });
    assert.equal(result.plan, "free");
    assert.equal(result.source, "free");
    assert.equal(result.capabilities.includes("paid.from.invalid.catalog"), false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("PLAN-CLI-004: malformed catalog fixtures fail safely to Free without stale paid reuse", async () => {
  const originalFetch = globalThis.fetch;
  try {
    for (const fixture of [
      { plan: "gold", capabilities: ["paid"], cache_ttl_seconds: 60, simulated: false, active: true },
      { plan: "pro", capabilities: ["paid"], cache_ttl_seconds: Number.NaN, simulated: false, active: true },
      { plan: "pro", capabilities: [""], cache_ttl_seconds: 60, simulated: false, active: true },
      { plan: "pro", capabilities: Array.from({ length: 4097 }, () => "x"), cache_ttl_seconds: 60, simulated: false, active: true },
    ]) {
      seedCredentials(undefined);
      globalThis.fetch = (async () => Response.json(fixture)) as typeof fetch;
      const result = await mod.loadCapabilities({ forceRefresh: true });
      assert.equal(result.plan, "free");
      assert.equal(result.source, "free");
      assert.equal(result.capabilities.includes("fix"), false);
    }
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("PLAN-CLI-004: supported-version fixture matrix migrates v1 validation to v2 and keeps legacy offline state safe", async () => {
  const originalFetch = globalThis.fetch;
  try {
    globalThis.fetch = (async (input: string | URL | Request) => {
      const url = String(input);
      if (url.endsWith("/api/v1/license/validate")) {
        return Response.json({ valid: true, plan: "pro", entitlement_token: "legacy.v1.token" });
      }
      return Response.json({ ok: true, token_version: 2, entitlement_token: "v2.opaque.token" });
    }) as typeof fetch;
    const validation = await validateLicense("vg_test_key", "https://verglos.test");
    assert.equal(validation.valid, true);
    if (!validation.valid) return;
    assert.equal(validation.entitlementToken, "v2.opaque.token", "a supported client prefers the v2 issuance path");

    for (const fixture of SUPPORTED_VERSION_COMPATIBILITY_FIXTURES) {
      seedCredentials(fixture.tokenKind === "legacy-v1" ? signLegacyProToken() : signProToken());
      const resolved = await withOfflineFetch(() => mod.resolveEntitlement({ forceRefresh: true }));
      assert.equal(resolved.plan, fixture.expectedOfflinePlan, fixture.clientVersion);
      assert.equal(resolved.source, fixture.tokenKind === "legacy-v1" ? "free" : "signed-token", fixture.clientVersion);
    }
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("resolveEntitlement: no JWT + REST unreachable + no cache → Free", async () => {
  seedCredentials(undefined);
  const result = await withOfflineFetch(() =>
    mod.resolveEntitlement({ forceRefresh: true }),
  );
  assert.equal(result.plan, "free");
  assert.equal(result.source, "free");
  assert.equal(result.capabilities.includes("fix"), false);
});

test("resolveEntitlement: legacy paid tier token without server catalog fails safely to Free", async () => {
  seedCredentials(signLegacyProToken());
  const result = await withOfflineFetch(() => mod.resolveEntitlement({ forceRefresh: true }));
  assert.equal(result.plan, "free");
  assert.equal(result.source, "free");
  assert.equal(result.capabilities.includes("fix.auto"), false);
  assert.equal(result.license?.tier, "free", "legacy tier alone is not offline authorization");
});

test("resolveEntitlement: JWT tier overrides REST cache plan (Studio JWT + Pro cache → plan=studio)", async () => {
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  seedCache(yesterday, "pro", ["scan", "fix"]);
  seedCredentials(signProToken({ tier: "studio" }));
  const result = await withOfflineFetch(() =>
    mod.resolveEntitlement({ forceRefresh: true }),
  );
  // Plan surfaces the JWT tier — that is what the customer paid for
  // and what we can prove cryptographically.
  assert.equal(result.plan, "studio");
  // Capabilities still come from the cache in this branch (REST
  // response, even if stale). Fence changes take server precedence.
  assert.equal(result.source, "signed-token");
});

test("resolveEntitlement: JWT with unpinned signing key → treated as no JWT (falls to Free)", async () => {
  const stranger = generateEntitlementKeyPair();
  const forged = signEntitlement({
    claims: {
      keyHash: "hash",
      tier: "pro",
      projects: [],
      seats: 1,
      features: [],
    },
    privateKey: privateKeyFromPem(stranger.privateKeyPem),
  });
  seedCredentials(forged);
  const result = await withOfflineFetch(() =>
    mod.resolveEntitlement({ forceRefresh: true }),
  );
  assert.equal(result.plan, "free");
  assert.equal(result.source, "free");
  assert.equal(result.license, undefined);
});

test("getVerifiedLicense: returns null when no JWT is stored", async () => {
  seedCredentials(undefined);
  const license = await mod.getVerifiedLicense();
  assert.equal(license, null);
});

test("getVerifiedLicense: returns tier + expiresAt for a valid JWT", async () => {
  seedCredentials(signProToken());
  const license = await mod.getVerifiedLicense();
  assert.ok(license);
  assert.equal(license?.tier, "pro");
  assert.ok((license?.expiresAt ?? 0) > Date.now());
  assert.deepEqual(license?.capabilities, ["scan", "signed.catalog.capability"]);
  assert.equal(license?.allowances?.recordsPerMonth, 100);
  assert.equal(license?.catalogVersion, "2026-09-14.1");
});

test("getVerifiedLicense: rejects a signed token bound to a different local license key", async () => {
  seedCredentials(signProToken(), "vg_another_key");
  assert.equal(await mod.getVerifiedLicense(), null);
});
