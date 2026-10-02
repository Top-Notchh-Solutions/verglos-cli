import { test, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { createHash } from "node:crypto";
import { generateEntitlementKeyPair, privateKeyFromPem, signEntitlement } from "@verglos/entitlement";
import { saveCredentials } from "./credentials.js";

const tempHome = mkdtempSync(join(tmpdir(), "verglos-whoami-test-"));
process.env.HOME = tempHome;
const mod = await import("./whoami.js");

after(() => rmSync(tempHome, { recursive: true, force: true }));
beforeEach(() => rmSync(join(tempHome, ".verglos"), { recursive: true, force: true }));

async function capture(options: { json?: boolean; quiet?: boolean }) {
  const logs: string[] = [];
  const original = console.log;
  console.log = (message?: unknown) => { logs.push(String(message)); };
  try { return { code: await mod.executeWhoami(options), logs }; }
  finally { console.log = original; }
}

test("whoami emits machine-safe free-tier JSON without prose", async () => {
  const logs: string[] = [];
  const origLog = console.log;
  console.log = (msg?: unknown) => { logs.push(String(msg)); };
  try {
    const code = await mod.executeWhoami({ json: true });
    assert.equal(code, 0);
    assert.deepEqual(JSON.parse(logs[0]!), {
      status: "ok",
      signedIn: false,
      plan: "free",
      source: "free",
      stale: false,
      capabilityCount: 9,
    });
  } finally { console.log = origLog; }
});

test("whoami quiet mode suppresses free-tier output", async () => {
  const logs: string[] = [];
  const origLog = console.log;
  console.log = (msg?: unknown) => { logs.push(String(msg)); };
  try {
    const code = await mod.executeWhoami({ quiet: true });
    assert.equal(code, 0);
    assert.deepEqual(logs, []);
  } finally { console.log = origLog; }
});

test("offline whoami distinguishes effective Free from cached paid license and redacts short keys", async () => {
  await saveCredentials({ apiUrl: "https://verglos.test", licenseKey: "short-secret", plan: "pro" });
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => { throw new Error("offline"); };
  try {
    const json = await capture({ json: true });
    assert.equal(json.code, 0);
    const body = JSON.parse(json.logs.join("\n"));
    assert.equal(body.plan, "free");
    assert.equal(body.licensePlan, "pro");
    assert.equal(body.source, "free");
    assert.equal(body.status, "offline");
    const human = await capture({});
    assert.match(human.logs.join("\n"), /Plan:\s+FREE/);
    assert.match(human.logs.join("\n"), /License plan:\s+PRO \(cached\)/);
    assert.match(human.logs.join("\n"), /verglos login/);
    assert.equal([...json.logs, ...human.logs].join("\n").includes("short-secret"), false);
    assert.deepEqual((await capture({ quiet: true })).logs, []);
  } finally { globalThis.fetch = originalFetch; }
});

test("offline signed entitlement displays catalog, allowances and token expiry in both formats", async () => {
  const pair = generateEntitlementKeyPair();
  const originalKey = process.env.VERGLOS_TEST_PUBKEY_B64URL;
  const originalFetch = globalThis.fetch;
  process.env.VERGLOS_TEST_PUBKEY_B64URL = pair.publicKeyBase64Url;
  const token = signEntitlement({
    claims: {
      keyHash: createHash("sha256").update("synthetic-whoami-key").digest("hex"),
      tier: "pro", plan: "pro", projects: [], seats: 2, features: [], schemaVersion: 2,
      userId: "synthetic-user", tenantId: "synthetic-tenant", role: "owner",
      capabilities: ["scan", "opaque.capability"], allowances: { seats: 2, records: "unset" },
      catalogVersion: "2026-10-02.0", tokenId: "00000000-0000-4000-8000-000000000001",
    },
    privateKey: privateKeyFromPem(pair.privateKeyPem),
  });
  try {
    await saveCredentials({ apiUrl: "https://verglos.test", licenseKey: "synthetic-whoami-key", plan: "free", entitlementToken: token });
    globalThis.fetch = async () => { throw new Error("offline"); };
    const json = await capture({ json: true });
    const body = JSON.parse(json.logs.join("\n"));
    assert.equal(body.plan, "pro");
    assert.equal(body.licensePlan, "free");
    assert.equal(body.source, "signed-token");
    assert.equal(body.capabilityCount, 2);
    assert.equal(body.catalogVersion, "2026-10-02.0");
    assert.deepEqual(body.allowances, { seats: 2, records: "unset" });
    assert.equal(body.inOfflineGrace, false);
    assert.ok(Date.parse(body.entitlementExpiresAt) > Date.now());
    const human = (await capture({})).logs.join("\n");
    assert.match(human, /Catalog:\s+2026-10-02.0/);
    assert.match(human, /Allowances:\s+seats=2, records=unset/);
    assert.match(human, /Token expiry:/);
    assert.equal(human.includes(token), false);
    assert.equal(human.includes(pair.privateKeyPem), false);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.VERGLOS_TEST_PUBKEY_B64URL;
    else process.env.VERGLOS_TEST_PUBKEY_B64URL = originalKey;
  }
});

test("online whoami uses current capability plan when the license status reports a different plan", async () => {
  await saveCredentials({ apiUrl: "https://verglos.test", licenseKey: "synthetic-whoami-key", plan: "pro" });
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url) => String(url).endsWith("/status")
    ? Response.json({ ok: true, plan: "pro", active: true, machines: [] })
    : Response.json({ plan: "free", capabilities: ["scan"], active: true, simulated: false, cache_ttl_seconds: 60 });
  try {
    const body = JSON.parse((await capture({ json: true })).logs.join("\n"));
    assert.equal(body.plan, "free");
    assert.equal(body.licensePlan, "pro");
    assert.equal(body.source, "rest");
    assert.equal(body.capabilityCount, 1);
  } finally { globalThis.fetch = originalFetch; }
});
