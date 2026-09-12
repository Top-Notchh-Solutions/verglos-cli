import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { runCliFixture } from "./cli-fixture.js";

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

test("init JSON bounds filesystem failures", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-init-json-failure-"));
  const fileRoot = join(root, "not-a-directory");
  await writeFile(fileRoot, "fixture");
  const logs: string[] = [];
  const origLog = console.log;
  console.log = (msg?: unknown) => { logs.push(String(msg)); };
  try {
    const code = await mod.executeInit({ cwd: fileRoot, json: true, yes: true });
    assert.equal(code, 1);
    assert.deepEqual(JSON.parse(logs[0]!), { status: "error", message: "init failed" });
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

test("init quiet process mode has no stdout, stderr, or prompt", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-init-process-"));
  try {
    const result = await runCliFixture(
      process.execPath,
      ["--import", fileURLToPath(import.meta.resolve("tsx")), join(process.cwd(), "src", "index.ts"), "init", "--quiet"],
      root,
      { env: { VERGLOS_DEV_SKIP_UPDATE_CHECK: "1" } },
    );
    assert.equal(result.exitCode, 2);
    assert.equal(result.stdout, "");
    assert.equal(result.stderr, "");
    assert.deepEqual(result.files, []);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
