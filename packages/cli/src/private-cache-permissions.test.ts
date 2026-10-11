import { lstatSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, test } from "node:test";
import assert from "node:assert/strict";

const tempHome = mkdtempSync(join(tmpdir(), "verglos-private-cache-test-"));
process.env.HOME = tempHome;

const credentials = await import("./credentials.js");
const entitlement = await import("./entitlement.js");

after(() => rmSync(tempHome, { recursive: true, force: true }));

function mode(path: string): number {
  return lstatSync(path).mode & 0o777;
}

function assertPrivateMode(path: string, expected: number): void {
  const actual = mode(path);
  if (process.platform === "win32") {
    // Windows ACLs are not represented by POSIX group/other mode bits.
    assert.notEqual(actual & 0o200, 0, `${path} must remain owner-writable`);
    return;
  }
  assert.equal(actual, expected, `${path} must have mode ${expected.toString(8)}`);
}

test("credential and score caches are private and atomically readable", async () => {
  await credentials.saveCredentials({ apiUrl: "https://example.test", licenseKey: "secret-sentinel" });
  await credentials.saveLastScore("/workspace/project", 91, 0);

  const directory = join(tempHome, ".verglos");
  const credentialsPath = join(directory, "credentials.json");
  const scorePath = join(directory, "last-score.json");
  assertPrivateMode(directory, 0o700);
  assertPrivateMode(credentialsPath, 0o600);
  assertPrivateMode(scorePath, 0o600);
  assert.equal(JSON.parse(readFileSync(credentialsPath, "utf8")).licenseKey, "secret-sentinel");
  assert.equal(JSON.parse(readFileSync(scorePath, "utf8"))._workspace_project.score, 91);
});

test("capability cache is private after a successful server refresh", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async () => Response.json({
    plan: "pro",
    capabilities: ["scan", "server.fix"],
    cache_ttl_seconds: 60,
    simulated: false,
    active: true,
    catalog_version: "2026-10-02.0",
  })) as typeof fetch;
  try {
    await entitlement.loadCapabilities({ forceRefresh: true });
  } finally {
    globalThis.fetch = originalFetch;
  }
  assertPrivateMode(join(tempHome, ".verglos", "capabilities.json"), 0o600);
});
