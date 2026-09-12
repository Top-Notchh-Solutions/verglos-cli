import assert from "node:assert/strict";
import { access, mkdir, mkdtemp, realpath, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { runCliFixture } from "./cli-fixture.js";

const cliEntry = join(process.cwd(), "src", "index.ts");
const tsx = fileURLToPath(import.meta.resolve("tsx"));

async function assertSameDirectory(actualPath: string | undefined, expectedPath: string): Promise<void> {
  assert.equal(typeof actualPath, "string");
  const [actual, expected] = await Promise.all([stat(actualPath!), stat(expectedPath)]);
  assert.equal(actual.isDirectory(), true);
  assert.equal(actual.dev, expected.dev);
  assert.equal(actual.ino, expected.ino);
}

async function assertSameFile(actualPath: string | undefined, expectedPath: string): Promise<void> {
  assert.equal(typeof actualPath, "string");
  const [actual, expected] = await Promise.all([stat(actualPath!), stat(expectedPath)]);
  assert.equal(actual.isFile(), true);
  assert.equal(actual.dev, expected.dev);
  assert.equal(actual.ino, expected.ino);
}

test("record sign approval preflight is one bounded JSON response", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-process-sign-"));
  try {
    const result = await runCliFixture(process.execPath, ["--import", tsx, cliEntry, "record", "sign", "manifest.json", "signature.json", "--key", "key.pem", "--signer", "fixture", "--issuer", "fixture", "--approve", "--json", "--quiet"], root, { env: { VERGLOS_DEV_SKIP_UPDATE_CHECK: "1" } });
    assert.equal(result.exitCode, 78);
    assert.equal(result.stderr, "");
    assert.deepEqual(JSON.parse(result.stdout), { status: "error", code: "RECORD_SIGN_INPUT", message: "record signing failed" });
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("engine install approval preflight is one bounded JSON response", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-process-engine-"));
  try {
    const result = await runCliFixture(process.execPath, ["--import", tsx, cliEntry, "engines", "install", "trivy", "1.0.0", "artifact.bin", "--digest", `sha256:${"a".repeat(64)}`, "--approve", "--json", "--quiet"], root, { env: { VERGLOS_DEV_SKIP_UPDATE_CHECK: "1" } });
    assert.equal(result.exitCode, 78);
    assert.equal(result.stderr, "");
    assert.deepEqual(JSON.parse(result.stdout), { status: "error", code: "ENGINE_INSTALL_INPUT", message: "engine installation failed" });
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("evidence import failure is one bounded JSON response", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-process-evidence-"));
  try {
    const result = await runCliFixture(process.execPath, ["--import", tsx, cliEntry, "evidence", "import", "missing.json", "--json", "--quiet"], root, { env: { VERGLOS_DEV_SKIP_UPDATE_CHECK: "1" } });
    assert.equal(result.exitCode, 78);
    assert.equal(result.stderr, "");
    assert.deepEqual(JSON.parse(result.stdout), { status: "error", code: "EVIDENCE_IMPORT_INPUT", message: "evidence import failed" });
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("target inspect preflight is one bounded JSON response", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-process-target-"));
  try {
    const result = await runCliFixture(process.execPath, ["--import", tsx, cliEntry, "target", "inspect", "unsupported", "value", "--json", "--quiet"], root, { env: { VERGLOS_DEV_SKIP_UPDATE_CHECK: "1" } });
    assert.equal(result.exitCode, 78);
    assert.equal(result.stderr, "");
    assert.deepEqual(JSON.parse(result.stdout), { status: "error", code: "TARGET_INSPECT_INPUT", message: "target inspection failed" });
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("config inspect failure is one bounded JSON response", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-process-config-"));
  try {
    const result = await runCliFixture(process.execPath, ["--import", tsx, cliEntry, "config", "inspect", "missing.json", "--json", "--quiet"], root, { env: { VERGLOS_DEV_SKIP_UPDATE_CHECK: "1" } });
    assert.equal(result.exitCode, 78);
    assert.equal(result.stderr, "");
    assert.deepEqual(JSON.parse(result.stdout), { status: "invalid", warnings: [{ id: "invalid-config", message: "config inspection failed" }] });
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("record header failure is one bounded JSON response", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-process-header-"));
  try {
    const result = await runCliFixture(process.execPath, ["--import", tsx, cliEntry, "record", "header", join(root, "store"), join(root, "missing.json"), "--json", "--quiet"], root, { env: { VERGLOS_DEV_SKIP_UPDATE_CHECK: "1" } });
    assert.equal(result.exitCode, 78);
    assert.equal(result.stderr, "");
    assert.deepEqual(JSON.parse(result.stdout), { status: "error", code: "RECORD_HEADER_INPUT", message: "record header projection failed" });
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("MCP print-config quiet mode emits JSON without setup prose", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-process-mcp-config-"));
  try {
    const result = await runCliFixture(process.execPath, ["--import", tsx, cliEntry, "mcp", "--print-config", "--quiet"], root, { env: { VERGLOS_DEV_SKIP_UPDATE_CHECK: "1" } });
    assert.equal(result.exitCode, 0);
    assert.equal(result.stderr, "");
    assert.deepEqual(JSON.parse(result.stdout), { mcpServers: { verglos: { command: "npx", args: ["-y", "verglos", "mcp"] } } });
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("Hunt denied plan emits one bounded JSON response", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-process-hunt-"));
  try {
    const result = await runCliFixture(process.execPath, ["--import", tsx, cliEntry, "--as-plan", "free", "hunt", "--json", "--quiet"], root, { env: { VERGLOS_DEV_SKIP_UPDATE_CHECK: "1" } });
    assert.equal(result.exitCode, 3);
    assert.equal(result.stderr, "");
    assert.deepEqual(JSON.parse(result.stdout), { status: "denied", reason: "plan_required", requiredPlan: "pro" });
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("Attest denied plan emits one bounded JSON response", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-process-attest-"));
  try {
    const result = await runCliFixture(process.execPath, ["--import", tsx, cliEntry, "--as-plan", "free", "attest", "--json", "--quiet"], root, { env: { VERGLOS_DEV_SKIP_UPDATE_CHECK: "1" } });
    assert.equal(result.exitCode, 3);
    assert.equal(result.stderr, "");
    assert.deepEqual(JSON.parse(result.stdout), { status: "denied", reason: "plan_required", requiredPlan: "studio" });
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("Explain JSON mode emits one parseable document", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-process-explain-"));
  try {
    const result = await runCliFixture(process.execPath, ["--import", tsx, cliEntry, "explain", "AI-001", "--json", "--quiet"], root, { env: { VERGLOS_DEV_SKIP_UPDATE_CHECK: "1" } });
    assert.equal(result.exitCode, 0);
    assert.equal(result.stderr, "");
    const payload = JSON.parse(result.stdout) as { status?: string; entry?: { rule?: string } };
    assert.equal(payload.status, "ok");
    assert.equal(payload.entry?.rule, "AI-001");
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("Score configuration failure emits one bounded JSON response", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-process-score-"));
  try {
    const result = await runCliFixture(process.execPath, ["--import", tsx, cliEntry, "--as-plan", "free", "score", "--config", "missing.json", "--json", "--quiet"], root, { env: { VERGLOS_DEV_SKIP_UPDATE_CHECK: "1" } });
    assert.equal(result.exitCode, 2);
    assert.equal(result.stderr, "");
    assert.deepEqual(JSON.parse(result.stdout), { status: "error", code: "SCORE_INPUT", message: "score generation failed" });
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("Secrets JSON mode emits one parseable scan document", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-process-secrets-"));
  try {
    const result = await runCliFixture(process.execPath, ["--import", tsx, cliEntry, "secrets", "--json", "--quiet"], root, { env: { VERGLOS_DEV_SKIP_UPDATE_CHECK: "1", VERGLOS_TELEMETRY: "0" } });
    assert.equal(result.exitCode, 0);
    assert.equal(result.stderr, "");
    const payload = JSON.parse(result.stdout) as { projectRoot?: string; findings?: unknown };
    await assertSameDirectory(payload.projectRoot, await realpath(root));
    assert.ok(Array.isArray(payload.findings));
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("Dependency JSON mode emits one parseable scan document", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-process-deps-"));
  try {
    const result = await runCliFixture(process.execPath, ["--import", tsx, cliEntry, "deps", "--json", "--quiet"], root, { env: { VERGLOS_DEV_SKIP_UPDATE_CHECK: "1", VERGLOS_TELEMETRY: "0" } });
    assert.equal(result.exitCode, 0);
    assert.equal(result.stderr, "");
    const payload = JSON.parse(result.stdout) as { projectRoot?: string; findings?: unknown };
    await assertSameDirectory(payload.projectRoot, await realpath(root));
    assert.ok(Array.isArray(payload.findings));
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("CI JSON mode emits one bounded decision document", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-process-ci-"));
  try {
    const result = await runCliFixture(process.execPath, ["--import", tsx, cliEntry, "--as-plan", "free", "ci", "--json", "--quiet", "--threshold", "0", "--no-telemetry"], root, { env: { VERGLOS_DEV_SKIP_UPDATE_CHECK: "1", VERGLOS_TELEMETRY: "0" } });
    assert.equal(result.exitCode, 0);
    assert.equal(result.stderr, "");
    const payload = JSON.parse(result.stdout) as { score?: { value?: number }; findings?: unknown };
    assert.equal(payload.score?.value, 100);
    assert.ok(Array.isArray(payload.findings));
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("precommit configuration failure is one bounded JSON response", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-process-precommit-error-"));
  try {
    await writeFile(join(root, "invalid-config.json"), "{\"failThreshold\":101}");
    const result = await runCliFixture(process.execPath, ["--import", tsx, cliEntry, "precommit", "--config", "invalid-config.json", "--json", "--quiet"], root, { env: { VERGLOS_DEV_SKIP_UPDATE_CHECK: "1" } });
    assert.equal(result.exitCode, 2);
    assert.equal(result.stderr, "");
    assert.deepEqual(JSON.parse(result.stdout), { status: "error", code: "PRECOMMIT_INPUT", message: "pre-commit scan failed" });
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("diff input failure is one bounded JSON response", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-process-diff-error-"));
  try {
    const result = await runCliFixture(process.execPath, ["--import", tsx, cliEntry, "diff", "missing-base.json", "missing-head.json", "--json", "--quiet"], root, { env: { VERGLOS_DEV_SKIP_UPDATE_CHECK: "1" } });
    assert.equal(result.exitCode, 2);
    assert.equal(result.stderr, "");
    assert.deepEqual(JSON.parse(result.stdout), { status: "error", message: "snapshot diff failed" });
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("policy check input failure is one bounded JSON response", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-process-policy-error-"));
  try {
    const result = await runCliFixture(process.execPath, ["--import", tsx, cliEntry, "policy", "check", "missing.json", "--json", "--quiet"], root, { env: { VERGLOS_DEV_SKIP_UPDATE_CHECK: "1" } });
    assert.equal(result.exitCode, 2);
    assert.equal(result.stderr, "");
    assert.deepEqual(JSON.parse(result.stdout), { status: "error", code: "POLICY_CHECK_INPUT", message: "policy check failed" });
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("engine status JSON is one bounded document", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-process-engine-status-"));
  try {
    const result = await runCliFixture(process.execPath, ["--import", tsx, cliEntry, "engines", "status", "--json", "--quiet"], root, { env: { VERGLOS_DEV_SKIP_UPDATE_CHECK: "1", HOME: root } });
    assert.equal(result.exitCode, 0);
    assert.equal(result.stderr, "");
    const payload = JSON.parse(result.stdout) as { engines?: unknown };
    assert.ok(Array.isArray(payload.engines));
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("precommit success is one bounded JSON response", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-process-precommit-ok-"));
  try {
    const result = await runCliFixture(process.execPath, ["--import", tsx, cliEntry, "precommit", "--json", "--quiet", "--timeout", "5000"], root, { env: { VERGLOS_DEV_SKIP_UPDATE_CHECK: "1" } });
    assert.equal(result.exitCode, 0);
    assert.equal(result.stderr, "");
    const payload = JSON.parse(result.stdout) as { status?: string; blocking?: number; elapsedMs?: number; timedOut?: boolean };
    assert.ok(payload.status === "PASS" || payload.status === "INCOMPLETE");
    if (payload.status === "PASS") assert.equal(payload.blocking, 0);
    assert.equal(typeof payload.elapsedMs === "number" || payload.timedOut === true, true);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("Scan JSON mode emits one parseable scan document", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-process-scan-"));
  try {
    const result = await runCliFixture(process.execPath, ["--import", tsx, cliEntry, "scan", "--json", "--quiet", "--no-telemetry"], root, { env: { VERGLOS_DEV_SKIP_UPDATE_CHECK: "1", VERGLOS_TELEMETRY: "0" } });
    assert.equal(result.exitCode, 0);
    assert.equal(result.stderr, "");
    const payload = JSON.parse(result.stdout) as { projectRoot?: string; findings?: unknown };
    await assertSameDirectory(payload.projectRoot, await realpath(root));
    assert.ok(Array.isArray(payload.findings));
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("Badge JSON mode emits one bounded document", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-process-badge-"));
  try {
    const result = await runCliFixture(process.execPath, ["--import", tsx, cliEntry, "badge", "--json", "--quiet"], root, { env: { VERGLOS_DEV_SKIP_UPDATE_CHECK: "1", VERGLOS_TELEMETRY: "0" } });
    assert.equal(result.exitCode, 0);
    assert.equal(result.stderr, "");
    const payload = JSON.parse(result.stdout) as { status?: string; score?: number; markdown?: string };
    assert.equal(payload.status, "ok");
    assert.equal(payload.score, 100);
    assert.match(payload.markdown ?? "", /img\.shields\.io/);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("Whoami JSON mode emits the offline Free contract", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-process-whoami-"));
  try {
    const result = await runCliFixture(process.execPath, ["--import", tsx, cliEntry, "whoami", "--json", "--quiet"], root, { env: { VERGLOS_DEV_SKIP_UPDATE_CHECK: "1", HOME: root } });
    assert.equal(result.exitCode, 0);
    assert.equal(result.stderr, "");
    assert.deepEqual(JSON.parse(result.stdout), { status: "ok", signedIn: false, plan: "free" });
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("activate network failure is one bounded JSON response", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-process-activate-error-"));
  const home = await mkdtemp(join(tmpdir(), "verglos-process-activate-home-"));
  try {
    const result = await runCliFixture(process.execPath, ["--import", tsx, cliEntry, "activate", "vg_invalid_key", "--ci", "--json", "--quiet"], root, { env: { HOME: home, VERGLOS_API_URL: "http://127.0.0.1:1", VERGLOS_DEV_SKIP_UPDATE_CHECK: "1" } });
    assert.equal(result.exitCode, 2);
    assert.equal(result.stderr, "");
    const payload = JSON.parse(result.stdout) as { status?: string; reason?: string; httpStatus?: unknown };
    assert.equal(payload.status, "error");
    assert.equal(payload.reason, "network");
    assert.equal(payload.httpStatus, undefined);
  } finally { await rm(root, { recursive: true, force: true }); await rm(home, { recursive: true, force: true }); }
});

test("monitor status without credentials is one bounded JSON response", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-process-monitor-status-"));
  const home = await mkdtemp(join(tmpdir(), "verglos-process-monitor-home-"));
  try {
    const result = await runCliFixture(process.execPath, ["--import", tsx, cliEntry, "monitor", "status", "--json", "--quiet"], root, { env: { HOME: home, VERGLOS_DEV_SKIP_UPDATE_CHECK: "1" } });
    assert.equal(result.exitCode, 1);
    assert.equal(result.stderr, "");
    assert.deepEqual(JSON.parse(result.stdout), { status: "error", code: "CAPABILITY_REQUIRED", capability: "monitor_register", message: "Continuous CVE monitoring requires a paid capability" });
  } finally { await rm(root, { recursive: true, force: true }); await rm(home, { recursive: true, force: true }); }
});

test("hook outside Git reports a bounded skipped result", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-process-hook-no-git-"));
  try {
    const result = await runCliFixture(process.execPath, ["--import", tsx, cliEntry, "hook", "--json", "--quiet"], root, { env: { VERGLOS_DEV_SKIP_UPDATE_CHECK: "1" } });
    assert.equal(result.exitCode, 0);
    assert.equal(result.stderr, "");
    assert.deepEqual(JSON.parse(result.stdout), { status: "skipped", installed: false, reason: "not_a_git_repository" });
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("hook inside Git reports an installed bounded result", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-process-hook-git-"));
  try {
    await mkdir(join(root, ".git", "hooks"), { recursive: true });
    const result = await runCliFixture(process.execPath, ["--import", tsx, cliEntry, "hook", "--json", "--quiet"], root, { env: { VERGLOS_DEV_SKIP_UPDATE_CHECK: "1" } });
    assert.equal(result.exitCode, 0);
    assert.equal(result.stderr, "");
    assert.deepEqual(JSON.parse(result.stdout), { status: "ok", installed: true });
    await access(join(root, ".git", "hooks", "pre-commit"));
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("CLI version is deterministic and side-effect free", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-process-version-"));
  try {
    const result = await runCliFixture(process.execPath, ["--import", tsx, cliEntry, "--version"], root, { env: { VERGLOS_DEV_SKIP_UPDATE_CHECK: "1" } });
    assert.equal(result.exitCode, 0);
    assert.equal(result.stderr, "");
    assert.match(result.stdout.trim(), /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/);
    assert.deepEqual(result.files, []);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("CLI help is deterministic and side-effect free", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-process-help-"));
  try {
    const result = await runCliFixture(process.execPath, ["--import", tsx, cliEntry, "--help"], root, { env: { VERGLOS_DEV_SKIP_UPDATE_CHECK: "1" } });
    assert.equal(result.exitCode, 0);
    assert.equal(result.stderr, "");
    assert.match(result.stdout, /Usage: verglos/);
    assert.match(result.stdout, /Command groups:/);
    assert.deepEqual(result.files, []);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("init JSON mode writes only the bounded project config", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-process-init-"));
  try {
    const result = await runCliFixture(process.execPath, ["--import", tsx, cliEntry, "init", "--yes", "--json", "--quiet"], root, { env: { VERGLOS_DEV_SKIP_UPDATE_CHECK: "1" } });
    assert.equal(result.exitCode, 0);
    assert.equal(result.stderr, "");
    const payload = JSON.parse(result.stdout) as { status?: string; configPath?: string; configWritten?: boolean; hookInstalled?: boolean };
    assert.equal(payload.status, "ok");
    assert.equal(payload.configWritten, true);
    assert.equal(payload.hookInstalled, false);
    await assertSameFile(payload.configPath, join(root, ".verglos.config.js"));
    assert.deepEqual(result.files, [".verglos.config.js"]);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("fix JSON mode refuses mutation without explicit approval", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-process-fix-"));
  try {
    await mkdir(join(root, ".verglos"), { recursive: true });
    const now = Date.now();
    await writeFile(join(root, ".verglos", "capabilities.json"), JSON.stringify({
      plan: "pro", capabilities: ["fix"], cache_ttl_seconds: 3600, simulated: false, active: true,
      fetchedAt: new Date(now).toISOString(), expiresAt: new Date(now + 3600_000).toISOString(),
    }));
    const result = await runCliFixture(process.execPath, ["--import", tsx, cliEntry, "fix", "--json", "--quiet"], root, { env: { HOME: root, VERGLOS_DEV_SKIP_UPDATE_CHECK: "1" } });
    assert.equal(result.exitCode, 78);
    assert.equal(result.stderr, "");
    assert.deepEqual(JSON.parse(result.stdout), { status: "error", code: "FIX_APPROVAL_REQUIRED", message: "fix requires explicit approval (--approve)" });
    assert.deepEqual(result.files, []);
  } finally { await rm(root, { recursive: true, force: true }); }
});
