import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { runCliFixture } from "./cli-fixture.js";

const cliEntry = join(process.cwd(), "src", "index.ts");
const tsx = fileURLToPath(import.meta.resolve("tsx"));

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
