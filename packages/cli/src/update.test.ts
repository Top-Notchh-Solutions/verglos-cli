import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { test } from "node:test";
import { updateCli } from "./update.js";
import { runCliFixture } from "./cli-fixture.js";

const cliEntry = join(process.cwd(), "src", "index.ts");
const tsx = fileURLToPath(import.meta.resolve("tsx"));

async function runUpdateProcess(mode: "current" | "newer" | "offline" | "install-fail", args: readonly string[]) {
  const root = await mkdtemp(join(tmpdir(), "verglos-update-process-"));
  const home = await mkdtemp(join(tmpdir(), "verglos-update-home-"));
  const preload = join(home, "update-preload.mjs");
  const spawnLog = join(home, "spawn.json");
  const source = `
    import { EventEmitter } from "node:events";
    import { writeFileSync } from "node:fs";
    import { syncBuiltinESMExports } from "node:module";
    import childProcess from "node:child_process";
    const mode = process.env.VERGLOS_TEST_UPDATE_MODE;
    globalThis.fetch = async () => {
      if (mode === "offline") throw new Error("offline fixture");
      const version = mode === "current" ? "2.0.0-alpha.1" : "99.0.0";
      return new Response(JSON.stringify({ version }), { status: 200, headers: { "content-type": "application/json" } });
    };
    childProcess.spawn = (command, spawnArgs, options) => {
      writeFileSync(process.env.VERGLOS_TEST_UPDATE_SPAWN_LOG, JSON.stringify({ command, args: spawnArgs, stdio: options.stdio }));
      const child = new EventEmitter();
      queueMicrotask(() => child.emit("close", mode === "install-fail" ? 1 : 0));
      return child;
    };
    syncBuiltinESMExports();
  `;
  try {
    await writeFile(preload, source);
    const result = await runCliFixture(process.execPath, ["--import", pathToFileURL(preload).href, "--import", tsx, cliEntry, ...args], root, {
      env: {
        HOME: home,
        VERGLOS_DEV_SKIP_UPDATE_CHECK: "1",
        VERGLOS_TEST_UPDATE_MODE: mode,
        VERGLOS_TEST_UPDATE_SPAWN_LOG: spawnLog,
      },
    });
    let spawn: unknown;
    try { spawn = JSON.parse(await readFile(spawnLog, "utf8")); } catch { /* no install expected */ }
    return { ...result, spawn };
  } finally {
    await rm(root, { recursive: true, force: true });
    await rm(home, { recursive: true, force: true });
  }
}

test("update reports the current and latest versions without installing when current", async () => {
  let installs = 0;
  const result = await updateCli("2.0.0", {
    fetchLatestVersion: async () => "2.0.0",
    installLatest: async () => { installs += 1; },
  });
  assert.deepEqual(result, { status: "ok", currentVersion: "2.0.0", latestVersion: "2.0.0", updated: false });
  assert.equal(installs, 0);
});

test("update reports a successful installation without leaking progress prose into the result", async () => {
  let installs = 0;
  const result = await updateCli("2.0.0", {
    fetchLatestVersion: async () => "2.1.0",
    installLatest: async () => { installs += 1; },
  });
  assert.deepEqual(result, { status: "ok", currentVersion: "2.0.0", latestVersion: "2.1.0", updated: true });
  assert.equal(installs, 1);
});

test("update fails closed on registry and installer failures with stable error codes", async () => {
  assert.deepEqual(await updateCli("2.0.0", {
    fetchLatestVersion: async () => null,
    installLatest: async () => assert.fail("must not install when latest version is unknown"),
  }), { status: "error", code: "UPDATE_VERSION_CHECK", message: "could not check npm for the latest Verglos CLI" });

  assert.deepEqual(await updateCli("2.0.0", {
    fetchLatestVersion: async () => { throw new Error("registry details must not escape"); },
    installLatest: async () => assert.fail("must not install when latest version lookup throws"),
  }), { status: "error", code: "UPDATE_VERSION_CHECK", message: "could not check npm for the latest Verglos CLI" });

  assert.deepEqual(await updateCli("2.0.0", {
    fetchLatestVersion: async () => "2.1.0",
    installLatest: async () => { throw new Error("untrusted installer output must not escape"); },
  }), { status: "error", code: "UPDATE_INSTALL_FAILED", message: "Verglos CLI update failed" });
});

test("update JSON process uses the injected registry and installer without leaking subprocess output", async () => {
  const current = await runUpdateProcess("current", ["update", "--json", "--quiet"]);
  assert.equal(current.exitCode, 0);
  assert.equal(current.stderr, "");
  assert.deepEqual(JSON.parse(current.stdout), { status: "ok", currentVersion: "2.0.0-alpha.1", latestVersion: "2.0.0-alpha.1", updated: false });
  assert.equal(current.spawn, undefined);

  const newer = await runUpdateProcess("newer", ["--update", "--json"]);
  assert.equal(newer.exitCode, 0);
  assert.equal(newer.stderr, "");
  assert.deepEqual(JSON.parse(newer.stdout), { status: "ok", currentVersion: "2.0.0-alpha.1", latestVersion: "99.0.0", updated: true });
  assert.deepEqual(newer.spawn, { command: process.platform === "win32" ? "npm.cmd" : "npm", args: ["install", "-g", "verglos@latest"], stdio: "ignore" });
});

test("historic update alias preserves human output and quiet suppression", async () => {
  const human = await runUpdateProcess("current", ["--update"]);
  assert.equal(human.exitCode, 0);
  assert.equal(human.stderr, "");
  assert.equal(human.stdout.trim(), "Verglos CLI is already up to date (2.0.0-alpha.1).");
  assert.equal(human.spawn, undefined);

  const quiet = await runUpdateProcess("current", ["--update", "--quiet"]);
  assert.equal(quiet.exitCode, 0);
  assert.equal(quiet.stdout, "");
  assert.equal(quiet.stderr, "");
});

test("update JSON and quiet process failures have stable exits and bounded output", async () => {
  const offline = await runUpdateProcess("offline", ["update", "--json"]);
  assert.equal(offline.exitCode, 1);
  assert.equal(offline.stderr, "");
  assert.deepEqual(JSON.parse(offline.stdout), { status: "error", code: "UPDATE_VERSION_CHECK", message: "could not check npm for the latest Verglos CLI" });
  assert.equal(offline.spawn, undefined);

  const failedInstall = await runUpdateProcess("install-fail", ["update", "--json", "--quiet"]);
  assert.equal(failedInstall.exitCode, 1);
  assert.equal(failedInstall.stderr, "");
  assert.deepEqual(JSON.parse(failedInstall.stdout), { status: "error", code: "UPDATE_INSTALL_FAILED", message: "Verglos CLI update failed" });
});
