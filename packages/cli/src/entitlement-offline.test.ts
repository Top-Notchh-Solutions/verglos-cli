import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test, after } from "node:test";
import assert from "node:assert/strict";

// Isolate this test file's home so we do not touch the developer's real
// ~/.verglos state. HOME must be set BEFORE the module import so the
// module-level CACHE_DIR const captures the temp directory.
const tempHome = mkdtempSync(join(tmpdir(), "verglos-entitlement-test-"));
process.env.HOME = tempHome;

const mod = await import("./entitlement.js");
const protocol = await import("@verglos/entitlement");

after(() => {
  rmSync(tempHome, { recursive: true, force: true });
});

function seedCache(fetchedAt: Date, plan: string, capabilities: string[]) {
  const dir = join(tempHome, ".verglos");
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    join(dir, "capabilities.json"),
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

function withOfflineFetch<T>(fn: () => Promise<T>): Promise<T> {
  const original = globalThis.fetch;
  globalThis.fetch = (async () => {
    throw new Error("offline");
  }) as typeof fetch;
  return fn().finally(() => {
    globalThis.fetch = original;
  });
}

test("loadCapabilities: honours a paid cache within 7-day grace when server is unreachable", async () => {
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
  seedCache(threeDaysAgo, "pro", ["scan", "fix", "monitor_register"]);

  const caps = await withOfflineFetch(() =>
    mod.loadCapabilities({ forceRefresh: true }),
  );

  assert.equal(caps.plan, "pro");
  assert.equal(caps.stale, true);
  assert.ok(caps.capabilities.includes("fix"));
});

test("resolveEntitlement: normalizes a legacy compliance cache to enterprise", async () => {
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
  seedCache(threeDaysAgo, "compliance", ["scan", "audit_trail"]);
  const resolved = await withOfflineFetch(() => mod.resolveEntitlement({ forceRefresh: true }));
  assert.equal(resolved.plan, "enterprise");
  assert.equal(resolved.realPlan, "enterprise");
  assert.equal(resolved.source, "cache");
});

test("resolveEntitlement: current server plan overrides a still-valid signed plan", () => {
  assert.equal(
    mod.effectivePlanFromServer({ plan: "free", active: false }),
    "free",
  );
  assert.equal(
    mod.effectivePlanFromServer({ plan: "free", active: true }),
    "free",
  );
  assert.equal(mod.effectivePlanFromServer({ plan: "pro", active: true }), "pro");
});

test("resolveEntitlement: online revocation response defeats a still-valid signed Pro token", async () => {
  const previousPublicKey = process.env.VERGLOS_TEST_PUBKEY_B64URL;
  const pair = protocol.generateEntitlementKeyPair();
  process.env.VERGLOS_TEST_PUBKEY_B64URL = pair.publicKeyBase64Url;
  const nowSeconds = Math.floor(Date.now() / 1000);
  const token = protocol.signEntitlement({
    claims: {
      keyHash: createHash("sha256").update("vg_test_license").digest("hex"), tier: "pro", projects: [], seats: 2,
      features: ["fix", "monitor"], iat: nowSeconds, exp: nowSeconds + 3600,
    },
    privateKey: protocol.privateKeyFromPem(pair.privateKeyPem),
  });
  writeFileSync(join(tempHome, ".verglos", "credentials.json"), JSON.stringify({
    licenseKey: "vg_test_license", entitlementToken: token, apiUrl: "https://verglos.test",
  }));

  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async () => Response.json({
    plan: "free", real_plan: "free", capabilities: ["scan"], cache_ttl_seconds: 60,
    simulated: false, active: false, reason: "expired",
  })) as typeof fetch;
  try {
    const resolved = await mod.resolveEntitlement({ forceRefresh: true });
    assert.equal(resolved.plan, "free");
    assert.ok(resolved.capabilities.includes("scan"));
    assert.equal(resolved.capabilities.includes("fix.auto"), false);
    assert.equal(resolved.source, "rest");
    assert.equal(resolved.license, undefined, "a server-revoked license is not projected as active from the cached JWT");
  } finally {
    globalThis.fetch = originalFetch;
    if (previousPublicKey === undefined) delete process.env.VERGLOS_TEST_PUBKEY_B64URL;
    else process.env.VERGLOS_TEST_PUBKEY_B64URL = previousPublicKey;
  }
});

test("loadCapabilities: rejects malformed cached capability shapes", async () => {
  const dir = join(tempHome, ".verglos");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "capabilities.json"), JSON.stringify({ plan: "pro", capabilities: ["fix", 42], cache_ttl_seconds: 60, simulated: false, active: true, fetchedAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 60_000).toISOString() }));
  const caps = await withOfflineFetch(() => mod.loadCapabilities({ forceRefresh: true }));
  assert.equal(caps.plan, "free");
  assert.equal(caps.capabilities.includes("fix"), false);
});

test("loadCapabilities: rejects unknown plans before accepting capabilities", async () => {
  const dir = join(tempHome, ".verglos");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "capabilities.json"), JSON.stringify({ plan: "future-paid", capabilities: ["fix"], cache_ttl_seconds: 60, simulated: false, active: true, fetchedAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 60_000).toISOString() }));
  const caps = await withOfflineFetch(() => mod.loadCapabilities({ forceRefresh: true }));
  assert.equal(caps.plan, "free");
  assert.equal(caps.capabilities.includes("fix"), false);
});

test("loadCapabilities: rejects unknown real_plan metadata before accepting capabilities", async () => {
  const dir = join(tempHome, ".verglos");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "capabilities.json"), JSON.stringify({ plan: "pro", real_plan: "future-paid", capabilities: ["fix"], cache_ttl_seconds: 60, simulated: true, active: true, fetchedAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 60_000).toISOString() }));
  const caps = await withOfflineFetch(() => mod.loadCapabilities({ forceRefresh: true }));
  assert.equal(caps.plan, "free");
  assert.equal(caps.capabilities.includes("fix"), false);
});

test("loadCapabilities: rejects control characters in capability names", async () => {
  const dir = join(tempHome, ".verglos");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "capabilities.json"), JSON.stringify({ plan: "pro", capabilities: ["fix\nESCAPE"], cache_ttl_seconds: 60, simulated: false, active: true, fetchedAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 60_000).toISOString() }));
  const caps = await withOfflineFetch(() => mod.loadCapabilities({ forceRefresh: true }));
  assert.equal(caps.plan, "free");
  assert.equal(caps.capabilities.includes("fix\nESCAPE"), false);
});

test("loadCapabilities: drops to Free when cache is past the 7-day absolute-stale window", async () => {
  const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
  seedCache(tenDaysAgo, "pro", ["scan", "fix", "monitor_register"]);

  const caps = await withOfflineFetch(() =>
    mod.loadCapabilities({ forceRefresh: true }),
  );

  assert.equal(caps.plan, "free");
  assert.ok(!caps.capabilities.includes("fix"));
});

test("loadCapabilities: drops to Free when no cache exists and server is unreachable", async () => {
  // Wipe any prior cache written by earlier tests in this file.
  rmSync(join(tempHome, ".verglos", "capabilities.json"), { force: true });

  const caps = await withOfflineFetch(() =>
    mod.loadCapabilities({ forceRefresh: true }),
  );

  assert.equal(caps.plan, "free");
  assert.equal(caps.stale, undefined);
});

test("_absoluteMaxStaleMs: matches the 7-day JWT offline grace window", () => {
  assert.equal(mod._absoluteMaxStaleMs(), 7 * 24 * 60 * 60 * 1000);
});
