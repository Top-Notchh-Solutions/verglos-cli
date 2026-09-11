import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const mod = await import("./init.js");

test("init JSON refuses interactive mode and does not mutate", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-init-json-"));
  const logs: string[] = [];
  const origLog = console.log;
  console.log = (msg?: unknown) => { logs.push(String(msg)); };
  try {
    const code = await mod.executeInit({ cwd: root, json: true });
    assert.equal(code, 2);
    assert.deepEqual(JSON.parse(logs[0]!), { status: "error", code: "INIT_REQUIRES_YES", message: "init --json requires --yes to avoid interactive prompts" });
    await assert.rejects(() => readFile(join(root, ".verglos.config.js")));
  } finally {
    console.log = origLog;
    await rm(root, { recursive: true, force: true });
  }
});

test("init JSON with yes writes config and never installs a hook", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-init-json-"));
  const logs: string[] = [];
  const origLog = console.log;
  console.log = (msg?: unknown) => { logs.push(String(msg)); };
  try {
    const code = await mod.executeInit({ cwd: root, json: true, yes: true });
    assert.equal(code, 0);
    assert.deepEqual(JSON.parse(logs[0]!), { status: "ok", configPath: join(root, ".verglos.config.js"), configWritten: true, hookInstalled: false });
    await readFile(join(root, ".verglos.config.js"));
  } finally {
    console.log = origLog;
    await rm(root, { recursive: true, force: true });
  }
});

test("init quiet refuses interactive mode without mutation", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-init-quiet-"));
  try {
    const code = await mod.executeInit({ cwd: root, quiet: true });
    assert.equal(code, 2);
    await assert.rejects(() => readFile(join(root, ".verglos.config.js")));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("init quiet with yes writes config without output", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-init-quiet-"));
  const logs: string[] = [];
  const origLog = console.log;
  console.log = (msg?: unknown) => { logs.push(String(msg)); };
  try {
    const code = await mod.executeInit({ cwd: root, quiet: true, yes: true });
    assert.equal(code, 0);
    assert.deepEqual(logs, []);
    await readFile(join(root, ".verglos.config.js"));
  } finally {
    console.log = origLog;
    await rm(root, { recursive: true, force: true });
  }
});
