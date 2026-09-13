import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
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
    import { syncBuiltinESMExports } from "node:module";
    import childProcess from "node:child_process";
    const record = (path, value) => appendFileSync(path, JSON.stringify(value) + "\\n");
    globalThis.fetch = async (input, init = {}) => {
      record(process.env.VERGLOS_TEST_NETWORK_LOG, { url: String(input), method: init.method ?? "GET", body: typeof init.body === "string" ? init.body : null });
      return new Response(JSON.stringify({ vulns: [] }), { status: 200, headers: { "content-type": "application/json" } });
    };
    for (const method of ["execSync", "execFileSync", "spawnSync", "exec", "execFile", "spawn", "fork"]) {
      const original = childProcess[method];
      if (typeof original !== "function") continue;
      childProcess[method] = function (...args) {
        record(process.env.VERGLOS_TEST_PROCESS_LOG, { method, command: String(args[0]), args: Array.isArray(args[1]) ? args[1] : [] });
        return original.apply(this, args);
      };
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
      "--output", "reports",
    ], project, {
      timeoutMs: 30_000,
      env: {
        HOME: home,
        USERPROFILE: home,
        VERGLOS_DEV_SKIP_UPDATE_CHECK: "1",
        VERGLOS_TEST_NETWORK_LOG: networkLog,
        VERGLOS_TEST_PROCESS_LOG: processLog,
      },
    });

    assert.equal(result.timedOut, false, result.stderr);
    assert.equal(result.exitCode, 0, result.stderr);
    assert.deepEqual(result.files, ["reports"], "scan may add report output, but must not mutate fixture inputs or create extra project files");
    assert.equal(await readFile(join(project, "package.json"), "utf8"), manifest);
    assert.equal(await readFile(sourcePath, "utf8"), source);
    await assert.rejects(readFile(installMarker, "utf8"), { code: "ENOENT" });
    await assert.rejects(readFile(sourceExecutionMarker, "utf8"), { code: "ENOENT" });

    const network = (await readFile(networkLog, "utf8")).trim().split("\n").filter(Boolean).map((line) => JSON.parse(line) as { url: string; body: string | null });
    assert.ok(network.some((request) => request.url.endsWith("/api/v1/telemetry/scan")), "normal interactive scan should exercise its documented telemetry boundary");
    const serializedRequests = JSON.stringify(network);
    for (const sentinel of ["SOURCE_SENTINEL", "FINDING_TEXT_SENTINEL", "AKIA1234567890ABCDEF", "src-PATH_SENTINEL", project]) {
      assert.equal(serializedRequests.includes(sentinel), false, `outbound request contained protected fixture value: ${sentinel}`);
    }

    const childProcesses = (await readFile(processLog, "utf8")).trim().split("\n").filter(Boolean).map((line) => JSON.parse(line) as { method: string; command: string; args: string[] });
    assert.ok(childProcesses.length > 0, "process instrumentation must observe the scanner's fixed Git metadata probes");
    const serializedProcesses = JSON.stringify(childProcesses);
    assert.equal(serializedProcesses.includes("TARGET_CODE_EXECUTED"), false, "scan must not pass target source paths to a child process");
    assert.equal(childProcesses.some((call) => /(?:npm|pnpm|yarn|bun)\s+(?:install|run)|INSTALL_HOOK_EXECUTED|node\s+-e/u.test(`${call.command} ${call.args.join(" ")}`)), false, "scan must not invoke package install hooks or project scripts");
    assert.match(result.stdout, /derived project fingerprint\/name/u);
    assert.match(result.stdout, /Paid scans send a license bearer/u);
  } finally {
    await rm(project, { recursive: true, force: true });
    await rm(home, { recursive: true, force: true });
  }
});
