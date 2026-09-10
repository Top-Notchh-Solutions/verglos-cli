import assert from "node:assert/strict";
import { test } from "node:test";
import { startViewerSession } from "./viewer-session.js";

test("viewer session binds loopback, uses an unpredictable token, and denies other routes", async (t) => {
  let first;
  try { first = await startViewerSession("<main>fixture</main>"); } catch (error) { if ((error as NodeJS.ErrnoException).code === "EPERM") { t.skip("sandbox forbids loopback listeners"); return; } throw error; }
  const second = await startViewerSession("<main>fixture</main>");
  try { assert.match(first.url, /^http:\/\/127\.0\.0\.1:\d+\/__verglos\/[A-Za-z0-9_-]{32}\/$/); assert.notEqual(first.token, second.token); const ok = await fetch(first.url); assert.equal(ok.status, 200); assert.equal(ok.headers.get("content-security-policy"), "default-src 'none'; style-src 'unsafe-inline'; script-src 'none'; base-uri 'none'; frame-ancestors 'none'"); const denied = await fetch(`${first.url}%2e%2e/secret`); assert.equal(denied.status, 404); } finally { await first.close(); await second.close(); }
});
