import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  generateEntitlementKeyPair,
  privateKeyFromPem,
  signEntitlement,
} from "@verglos/entitlement";

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
  return signEntitlement({
    claims: {
      keyHash: "hash",
      tier: (overrides.tier as "pro") ?? "pro",
      projects: [],
      seats: 1,
      features: ["fix", "ci", "monitor"],
    },
    privateKey: privateKeyFromPem(kp.privateKeyPem),
    ttlSeconds: overrides.ttlSeconds ?? 24 * 60 * 60,
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

beforeEach(() => {
  rmSync(join(verglosDir, "credentials.json"), { force: true });
  rmSync(join(verglosDir, "capabilities.json"), { force: true });
});

test("resolveEntitlement: valid Pro JWT + REST unreachable + no cache → baked-in Pro caps", async () => {
  seedCredentials(signProToken());
  const result = await withOfflineFetch(() =>
    mod.resolveEntitlement({ forceRefresh: true }),
  );
  assert.equal(result.plan, "pro");
  assert.equal(result.source, "baked-in");
  assert.ok(result.capabilities.includes("fix"));
  assert.ok(result.capabilities.includes("rule_pack_agent_surface"));
  assert.ok(result.capabilities.includes("monitor_register"));
  assert.equal(result.license?.tier, "pro");
});

test("resolveEntitlement: valid Pro JWT + stale cache within grace → source=cache, tier from JWT", async () => {
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
  seedCache(threeDaysAgo, "pro", ["scan", "fix", "custom_cap_from_cache"]);
  seedCredentials(signProToken());
  const result = await withOfflineFetch(() =>
    mod.resolveEntitlement({ forceRefresh: true }),
  );
  assert.equal(result.plan, "pro");
  assert.equal(result.source, "cache");
  assert.equal(result.stale, true);
  // Capabilities come from the REST cache, not the baked-in map, so
  // any server-side tweak persists across the offline path.
  assert.ok(result.capabilities.includes("custom_cap_from_cache"));
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
  assert.equal(result.source, "cache");
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
});
