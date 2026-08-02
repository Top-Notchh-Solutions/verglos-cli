import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
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
