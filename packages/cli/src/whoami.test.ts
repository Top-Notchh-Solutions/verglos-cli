import { test, after } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const tempHome = mkdtempSync(join(tmpdir(), "verglos-whoami-test-"));
process.env.HOME = tempHome;
const mod = await import("./whoami.js");

after(() => rmSync(tempHome, { recursive: true, force: true }));

test("whoami emits machine-safe free-tier JSON without prose", async () => {
  const logs: string[] = [];
  const origLog = console.log;
  console.log = (msg?: unknown) => { logs.push(String(msg)); };
  try {
    const code = await mod.executeWhoami({ json: true });
    assert.equal(code, 0);
    assert.deepEqual(JSON.parse(logs[0]!), { status: "ok", signedIn: false, plan: "free" });
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
