import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { test } from "node:test";
import { runCliFixture } from "./cli-fixture.js";

const cliEntry = join(process.cwd(), "src", "index.ts");
const tsx = fileURLToPath(import.meta.resolve("tsx"));

test("ordinary scan does not execute fixture install hooks or upload target material", async () => {
  const project = await mkdtemp(join(tmpdir(), "verglos-scan-privacy-PATH_SENTINEL-"));
  const home = await mkdtemp(join(tmpdir(), "verglos-scan-privacy-home-"));
  const networkLog = join(home, "network.jsonl");
  const processLog = join(home, "process.jsonl");
  const fileLog = join(home, "files.jsonl");
  const preload = join(home, "privacy-preload.mjs");
  const installMarker = join(project, "INSTALL_HOOK_EXECUTED");
  const sourceExecutionMarker = join(project, "TARGET_CODE_EXECUTED");
  const source = `// SOURCE_SENTINEL and FINDING_TEXT_SENTINEL\nrequire("node:fs").writeFileSync(${JSON.stringify(sourceExecutionMarker)}, "executed");\nconst aws = "AKIA1234567890ABCDEF";\n`;
  const manifest = JSON.stringify({
    name: "privacy-fixture",
    version: "1.0.0",
    scripts: { preinstall: `node -e \"require('node:fs').writeFileSync('${installMarker}', 'executed')\"` },
  });
  const sourcePath = join(project, "src-PATH_SENTINEL.js");
  const hook = `
    import { appendFileSync } from "node:fs";
    import { isAbsolute, relative, resolve, sep } from "node:path";
    import { fileURLToPath } from "node:url";
    import { syncBuiltinESMExports } from "node:module";
    import { createRequire } from "node:module";
    const require = createRequire(import.meta.url);
    const childProcess = require("node:child_process");
    const fs = require("node:fs");
    const fsp = require("node:fs/promises");
    const record = (path, value) => appendFileSync(path, JSON.stringify(value) + "\\n");
    const root = fs.realpathSync(process.env.VERGLOS_TEST_PROJECT_ROOT);
    const fileRecord = (operation, path) => {
      let value = String(path);
      if (value.startsWith("file:")) value = fileURLToPath(value);
      if (!isAbsolute(value)) value = resolve(process.cwd(), value);
      const inProject = Boolean(root && (value === root || value.startsWith(root + sep)));
      if (inProject) record(process.env.VERGLOS_TEST_FILE_LOG, { operation, relative: relative(root, value) });
    };
    globalThis.fetch = async (input, init = {}) => {
      const headers = new Headers(init.headers);
      record(process.env.VERGLOS_TEST_NETWORK_LOG, { url: String(input), method: init.method ?? "GET", body: typeof init.body === "string" ? init.body : null, authorization: headers.get("authorization") });
      return new Response(JSON.stringify({ vulns: [] }), { status: 200, headers: { "content-type": "application/json" } });
    };
    for (const name of ["readFile", "readFileSync", "open", "openSync", "createReadStream", "readdir", "readdirSync", "stat", "statSync", "lstat", "lstatSync", "access", "accessSync", "realpath", "realpathSync"]) {
      const original = fs[name];
      if (typeof original === "function") fs[name] = function (path, ...args) { fileRecord(name, path); return original.call(this, path, ...args); };
    }
    for (const name of ["readFile", "open", "readdir", "stat", "lstat", "access", "realpath"]) {
      const original = fsp[name];
      if (typeof original === "function") fsp[name] = function (path, ...args) { fileRecord(name, path); return original.call(this, path, ...args); };
    }
    for (const method of ["execSync", "execFileSync", "spawnSync", "exec", "execFile", "spawn", "fork"]) {
      const original = childProcess[method];
      if (typeof original !== "function") continue;
      childProcess[method] = function (...args) {
        record(process.env.VERGLOS_TEST_PROCESS_LOG, { method, command: String(args[0]), args: Array.isArray(args[1]) ? args[1] : [] });
        return original.apply(this, args);
      };
    }
    for (const [moduleName, methods] of [["node:http", ["request", "get"]], ["node:https", ["request", "get"]], ["node:net", ["connect", "createConnection"]], ["node:tls", ["connect"]], ["node:dgram", ["createSocket"]]]) {
      const module = require(moduleName);
      for (const method of methods) {
        const original = module[method];
        if (typeof original !== "function") continue;
        module[method] = function (...args) {
          record(process.env.VERGLOS_TEST_NETWORK_LOG, { transport: moduleName, method, target: String(args[0] ?? "") });
          throw new Error("direct network transport denied by privacy test harness");
        };
      }
    }
    syncBuiltinESMExports();
  `;

  try {
    await writeFile(join(project, "package.json"), manifest);
    await writeFile(sourcePath, source);
    await writeFile(preload, hook);

    const result = await runCliFixture(process.execPath, [
      "--import", pathToFileURL(preload).href,
      "--import", tsx,
      cliEntry,
      "scan",
      "--output", "reports-default",
    ], project, {
      timeoutMs: 30_000,
      env: {
        HOME: home,
        USERPROFILE: home,
        VERGLOS_DEV_SKIP_UPDATE_CHECK: "1",
        VERGLOS_TELEMETRY: "",
        VERGLOS_TEST_NETWORK_LOG: networkLog,
        VERGLOS_TEST_PROCESS_LOG: processLog,
        VERGLOS_TEST_FILE_LOG: fileLog,
        VERGLOS_TEST_PROJECT_ROOT: project,
      },
    });

    assert.equal(result.timedOut, false, result.stderr);
    assert.equal(result.exitCode, 0, result.stderr);
    assert.deepEqual(result.files, ["reports-default"], "scan may add report output, but must not mutate fixture inputs or create extra project files");
    assert.equal(await readFile(join(project, "package.json"), "utf8"), manifest);
    assert.equal(await readFile(sourcePath, "utf8"), source);
    await assert.rejects(readFile(installMarker, "utf8"), { code: "ENOENT" });
    await assert.rejects(readFile(sourceExecutionMarker, "utf8"), { code: "ENOENT" });

    const defaultNetwork = await readFile(networkLog, "utf8").catch(() => "");
    assert.equal(defaultNetwork.includes("/api/v1/telemetry/scan"), false, "ordinary scans do not send analytics without affirmative consent");
    const fileAccesses = (await readFile(fileLog, "utf8")).trim().split("\n").filter(Boolean).map((line) => JSON.parse(line) as { operation: string; relative: string });
    assert.ok(fileAccesses.some((entry) => entry.relative === "package.json"), `file instrumentation observes manifest access: ${JSON.stringify(fileAccesses.slice(0, 5))}`);
    assert.ok(fileAccesses.some((entry) => entry.relative === "src-PATH_SENTINEL.js"), "file instrumentation observes source access");

    await mkdir(join(home, ".verglos"), { recursive: true });
    await writeFile(join(home, ".verglos", "credentials.json"), JSON.stringify({ apiUrl: "https://verglos.com", licenseKey: "LICENSE_KEY_SENTINEL" }));

    const optedIn = await runCliFixture(process.execPath, [
      "--import", pathToFileURL(preload).href,
      "--import", tsx,
      cliEntry,
      "scan",
      "--output", "reports-opt-in",
    ], project, {
      timeoutMs: 30_000,
      env: {
        HOME: home,
        USERPROFILE: home,
        VERGLOS_DEV_SKIP_UPDATE_CHECK: "1",
        VERGLOS_TELEMETRY: "1",
        VERGLOS_TEST_NETWORK_LOG: networkLog,
        VERGLOS_TEST_PROCESS_LOG: processLog,
        VERGLOS_TEST_FILE_LOG: fileLog,
        VERGLOS_TEST_PROJECT_ROOT: project,
      },
    });
    assert.equal(optedIn.timedOut, false, optedIn.stderr);
    assert.equal(optedIn.exitCode, 0, optedIn.stderr);

    const network = (await readFile(networkLog, "utf8")).trim().split("\n").filter(Boolean).map((line) => JSON.parse(line) as { url?: string; method?: string; body?: string | null; authorization?: string | null; transport?: string });
    const telemetryRequests = network.filter((request) => request.url?.endsWith("/api/v1/telemetry/scan"));
    assert.equal(telemetryRequests.length, 0, "analytics remains disabled until hosted retention/deletion controls are qualified, even when local consent exists");
    const accountRequests = network.filter((request) => request.url?.endsWith("/api/v1/account/scan-sync"));
    assert.equal(accountRequests.length, 1, "paid score sync uses its separate account route");
    assert.equal(accountRequests[0]?.authorization, "Bearer LICENSE_KEY_SENTINEL");
    const accountPayload = JSON.parse(accountRequests[0]?.body ?? "{}") as Record<string, unknown>;
    assert.deepEqual(Object.keys(accountPayload).sort(), ["cli_version", "event_id", "finding_critical", "finding_high", "project_fingerprint", "score"]);
    const serializedRequests = JSON.stringify(network.map(({ body, url, method, transport }) => ({ body, url, method, transport })));
    for (const sentinel of ["SOURCE_SENTINEL", "FINDING_TEXT_SENTINEL", "AKIA1234567890ABCDEF", "src-PATH_SENTINEL", "LICENSE_KEY_SENTINEL", project]) {
      assert.equal(serializedRequests.includes(sentinel), false, `outbound request contained protected fixture value: ${sentinel}`);
    }
    assert.equal(serializedRequests.includes("privacy-fixture"), false, "package/project names do not leave through telemetry");

    const childProcesses = (await readFile(processLog, "utf8")).trim().split("\n").filter(Boolean).map((line) => JSON.parse(line) as { method: string; command: string; args: string[] });
    assert.ok(childProcesses.length > 0, "process instrumentation must observe the scanner's fixed Git metadata probes");
    const serializedProcesses = JSON.stringify(childProcesses);
    assert.equal(serializedProcesses.includes("TARGET_CODE_EXECUTED"), false, "scan must not pass target source paths to a child process");
    assert.equal(childProcesses.some((call) => /(?:npm|pnpm|yarn|bun)\s+(?:install|run)|INSTALL_HOOK_EXECUTED|node\s+-e/u.test(`${call.command} ${call.args.join(" ")}`)), false, "scan must not invoke package install hooks or project scripts");
  } finally {
    await rm(project, { recursive: true, force: true });
    await rm(home, { recursive: true, force: true });
  }
});
