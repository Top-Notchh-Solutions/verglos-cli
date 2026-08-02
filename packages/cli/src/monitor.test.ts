import { test, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// Isolate HOME so we do not touch the developer's real credentials.
const tempHome = mkdtempSync(join(tmpdir(), "verglos-monitor-cmd-test-"));
process.env.HOME = tempHome;

const mod = await import("./monitor.js");

after(() => rmSync(tempHome, { recursive: true, force: true }));

function seedCredentials(licenseKey: string | undefined) {
  const dir = join(tempHome, ".verglos");
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    join(dir, "credentials.json"),
    JSON.stringify({
      apiUrl: "http://127.0.0.1:1",
      ...(licenseKey ? { licenseKey } : {}),
    }),
  );
}

type FetchCall = { url: string; init: RequestInit };
let calls: FetchCall[] = [];
const originalFetch = globalThis.fetch;

function mockFetch(handler: (call: FetchCall) => Response | Promise<Response>) {
  globalThis.fetch = (async (input: string | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : String(input);
    const call = { url, init: init ?? {} };
    calls.push(call);
    return handler(call);
  }) as typeof fetch;
}

beforeEach(() => {
  calls = [];
  globalThis.fetch = originalFetch;
});

after(() => {
  globalThis.fetch = originalFetch;
});

// ── status ────────────────────────────────────────────────────────────────

test("monitor status: bails with a helpful message when no license key is stored", async () => {
  seedCredentials(undefined);
  const errs: string[] = [];
  const origErr = console.error;
  console.error = (msg?: unknown) => { errs.push(String(msg)); };
  try {
    const code = await mod.executeMonitorStatus();
    assert.equal(code, 1);
    assert.match(errs.join("\n"), /no license key/i);
  } finally {
    console.error = origErr;
  }
});

test("monitor status: reports 'no projects' cleanly on an empty list", async () => {
  seedCredentials("vg_test_key");
  mockFetch(() => new Response(JSON.stringify({ registrations: [] }), { status: 200 }));
  const logs: string[] = [];
  const origLog = console.log;
  console.log = (msg?: unknown) => { logs.push(String(msg)); };
  try {
    const code = await mod.executeMonitorStatus();
    assert.equal(code, 0);
    assert.match(logs.join("\n"), /No projects registered/i);
  } finally {
    console.log = origLog;
  }
});

test("monitor status: prints each project with fingerprint prefix + channels", async () => {
  seedCredentials("vg_test_key");
  mockFetch(() =>
    new Response(
      JSON.stringify({
        registrations: [
          {
            projectFingerprint: "abcdef1234567890" + "0".repeat(48),
            projectLabel: "acme-api",
            dependencyCount: 42,
            snapshotAt: "2026-08-02T12:00:00Z",
            channels: { email: true, slack: false, webhook: true },
            lastCheckedAt: "2026-08-02T13:00:00Z",
            alertsFiredLast7d: 2,
          },
        ],
      }),
      { status: 200 },
    ),
  );
  const logs: string[] = [];
  const origLog = console.log;
  console.log = (msg?: unknown) => { logs.push(String(msg)); };
  try {
    await mod.executeMonitorStatus();
    const combined = logs.join("\n");
    assert.match(combined, /acme-api/);
    assert.match(combined, /abcdef123456/);
    assert.match(combined, /42 deps/);
    assert.match(combined, /email, webhook/);
    assert.match(combined, /2 alerts fired/);
  } finally {
    console.log = origLog;
  }
});

test("monitor status: reports 'not yet shipped' on server 501 without failing the command", async () => {
  seedCredentials("vg_test_key");
  mockFetch(() => new Response("{}", { status: 501 }));
  const errs: string[] = [];
  const origErr = console.error;
  console.error = (msg?: unknown) => { errs.push(String(msg)); };
  try {
    const code = await mod.executeMonitorStatus();
    assert.equal(code, 0);
    assert.match(errs.join("\n"), /not shipped this endpoint yet/i);
  } finally {
    console.error = origErr;
  }
});

// ── unregister ────────────────────────────────────────────────────────────

test("monitor unregister: sends DELETE to /api/v1/monitor/registration/:fp", async () => {
  seedCredentials("vg_test_key");
  mockFetch(() => new Response(JSON.stringify({ ok: true }), { status: 200 }));
  const origLog = console.log;
  console.log = () => {};
  try {
    const code = await mod.executeMonitorUnregister({
      projectFingerprint: "aabbccdd" + "0".repeat(56),
    });
    assert.equal(code, 0);
    assert.equal(calls.length, 1);
    assert.equal(calls[0]?.init.method, "DELETE");
    assert.match(calls[0]?.url ?? "", /\/api\/v1\/monitor\/registration\/aabbccdd/);
  } finally {
    console.log = origLog;
  }
});

test("monitor unregister: reports 401 as 'license required'", async () => {
  seedCredentials("vg_test_key");
  mockFetch(() => new Response("{}", { status: 401 }));
  const errs: string[] = [];
  const origErr = console.error;
  console.error = (msg?: unknown) => { errs.push(String(msg)); };
  try {
    const code = await mod.executeMonitorUnregister({
      projectFingerprint: "aabbccdd" + "0".repeat(56),
    });
    assert.equal(code, 1);
    assert.match(errs.join("\n"), /license required/i);
  } finally {
    console.error = origErr;
  }
});

// ── test-alert ────────────────────────────────────────────────────────────

test("monitor test-alert: POSTs { projectFingerprint } to /api/v1/monitor/test-alert", async () => {
  seedCredentials("vg_test_key");
  mockFetch(() =>
    new Response(JSON.stringify({ ok: true, sent: { email: true, slack: true } }), { status: 200 }),
  );
  const logs: string[] = [];
  const origLog = console.log;
  console.log = (msg?: unknown) => { logs.push(String(msg)); };
  try {
    const code = await mod.executeMonitorTestAlert({
      projectFingerprint: "deadbeef" + "0".repeat(56),
    });
    assert.equal(code, 0);
    assert.equal(calls.length, 1);
    assert.equal(calls[0]?.init.method, "POST");
    assert.match(calls[0]?.url ?? "", /\/api\/v1\/monitor\/test-alert$/);
    const body = JSON.parse(String(calls[0]?.init.body ?? ""));
    assert.match(body.projectFingerprint, /^deadbeef0+/);
    assert.match(logs.join("\n"), /Test alert dispatched/);
    assert.match(logs.join("\n"), /email delivered, slack delivered/);
  } finally {
    console.log = origLog;
  }
});
