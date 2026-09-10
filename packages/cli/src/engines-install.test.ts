import assert from "node:assert/strict";
import { createHash, generateKeyPairSync } from "node:crypto";
import { mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { executeEngineInstall } from "./engines-install.js";

test("engine install rejects malformed arguments before reading artifacts", async () => {
  assert.equal(await executeEngineInstall("", "1.0.0", "/does/not/exist", "bad"), 78);
});

test("engine install rejects an incorrect digest", async () => { const root = await mkdtemp(join(tmpdir(), "verglos-install-")); const artifact = join(root, "engine"); await writeFile(artifact, "bytes"); const previous = process.env.VERGLOS_ENGINE_CACHE; process.env.VERGLOS_ENGINE_CACHE = join(root, "cache"); try { assert.equal(await executeEngineInstall("trivy", "1.0.0", artifact, `sha256:${"a".repeat(64)}`), 78); } finally { if (previous === undefined) delete process.env.VERGLOS_ENGINE_CACHE; else process.env.VERGLOS_ENGINE_CACHE = previous; } void createHash; });

test("engine install requires approval and emits bounded JSON after approval", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-install-approved-"));
  const artifact = join(root, "engine");
  await writeFile(artifact, "bytes");
  const digest = `sha256:${createHash("sha256").update("bytes").digest("hex")}`;
  const previousCache = process.env.VERGLOS_ENGINE_CACHE;
  const previousLog = console.log;
  const lines: string[] = [];
  process.env.VERGLOS_ENGINE_CACHE = join(root, "cache");
  console.log = (line?: unknown) => lines.push(String(line));
  try {
    assert.equal(await executeEngineInstall("trivy", "1.0.0", artifact, digest, { approve: true, json: true }), 0);
    assert.deepEqual(JSON.parse(lines[0]!), { engineId: "trivy", version: "1.0.0", path: join(root, "cache", "trivy", "1.0.0", "engine.bin"), digest, compatibility: { status: "not-evaluated", reason: "signed engine manifest was not provided" } });
  } finally {
    console.log = previousLog;
    if (previousCache === undefined) delete process.env.VERGLOS_ENGINE_CACHE; else process.env.VERGLOS_ENGINE_CACHE = previousCache;
  }
});

test("quiet engine failures do not write diagnostics", async () => {
  const previousError = console.error;
  const lines: string[] = [];
  console.error = (line?: unknown) => lines.push(String(line));
  try { assert.equal(await executeEngineInstall("trivy", "1.0.0", "/does/not/exist", "bad", { quiet: true }), 78); assert.deepEqual(lines, []); }
  finally { console.error = previousError; }
});

test("engine update and rollback label approved JSON mutations", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-engine-actions-"));
  const artifact = join(root, "engine");
  await writeFile(artifact, "bytes");
  const digest = `sha256:${createHash("sha256").update("bytes").digest("hex")}`;
  const previousCache = process.env.VERGLOS_ENGINE_CACHE;
  const previousLog = console.log;
  const lines: string[] = [];
  process.env.VERGLOS_ENGINE_CACHE = join(root, "cache");
  console.log = (line?: unknown) => lines.push(String(line));
  try {
    assert.equal(await executeEngineInstall("trivy", "2.0.0", artifact, digest, { action: "update", approve: true, json: true }), 0);
    assert.equal(JSON.parse(lines[0]!).action, "update");
    assert.equal(await executeEngineInstall("trivy", "1.0.0", artifact, digest, { action: "rollback", approve: true, json: true }), 0);
    assert.equal(JSON.parse(lines[1]!).action, "rollback");
  } finally {
    console.log = previousLog;
    if (previousCache === undefined) delete process.env.VERGLOS_ENGINE_CACHE; else process.env.VERGLOS_ENGINE_CACHE = previousCache;
    await rm(root, { recursive: true, force: true });
  }
});

test("engine install validates a matching compatibility manifest", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-engine-manifest-"));
  const artifact = join(root, "engine");
  const manifestPath = join(root, "manifest.json");
  await writeFile(artifact, "bytes");
  const digest = `sha256:${createHash("sha256").update("bytes").digest("hex")}`;
  await writeFile(manifestPath, JSON.stringify({ schemaId: "urn:verglos:schema:engine-manifest", schemaVersion: "1.0.0", engineId: "trivy", version: "1.0.0", artifacts: [{ platform: "darwin/arm64", digest, size: 5, source: "https://mirror.example.test/trivy", license: "Apache-2.0" }], compatibleCli: ">=2.0.0", signature: { algorithm: "ed25519", keyId: "test", value: "unsigned-fixture" } }));
  const previousCache = process.env.VERGLOS_ENGINE_CACHE;
  const previousLog = console.log;
  const lines: string[] = [];
  process.env.VERGLOS_ENGINE_CACHE = join(root, "cache");
  console.log = (line?: unknown) => lines.push(String(line));
  try {
    assert.equal(await executeEngineInstall("trivy", "1.0.0", artifact, digest, { manifestPath, approve: true, json: true }), 0);
    assert.equal(JSON.parse(lines[0]!).compatibility.signature, "not-verified");
  } finally {
    console.log = previousLog;
    if (previousCache === undefined) delete process.env.VERGLOS_ENGINE_CACHE; else process.env.VERGLOS_ENGINE_CACHE = previousCache;
    await rm(root, { recursive: true, force: true });
  }
});

test("engine install fails closed when a supplied manifest signature is invalid", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-engine-bad-signature-"));
  const artifact = join(root, "engine"); const manifestPath = join(root, "manifest.json"); const keyPath = join(root, "key.pem");
  await writeFile(artifact, "bytes");
  const digest = `sha256:${createHash("sha256").update("bytes").digest("hex")}`;
  await writeFile(manifestPath, JSON.stringify({ schemaId: "urn:verglos:schema:engine-manifest", schemaVersion: "1.0.0", engineId: "trivy", version: "1.0.0", artifacts: [{ platform: "darwin/arm64", digest, size: 5, source: "https://mirror.example.test/trivy", license: "Apache-2.0" }], compatibleCli: ">=2.0.0", signature: { algorithm: "ed25519", keyId: "test", value: Buffer.from("bad").toString("base64") } }));
  const { publicKey } = generateKeyPairSync("ed25519"); await writeFile(keyPath, publicKey.export({ type: "spki", format: "pem" }));
  try { assert.equal(await executeEngineInstall("trivy", "1.0.0", artifact, digest, { manifestPath, manifestPublicKeyPath: keyPath, approve: true, quiet: true }), 78); }
  finally { await rm(root, { recursive: true, force: true }); }
});

test("engine install rejects a manifest key without a manifest", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-engine-key-without-manifest-"));
  const artifact = join(root, "engine"); const keyPath = join(root, "key.pem");
  await writeFile(artifact, "bytes"); await writeFile(keyPath, "not-a-key");
  const digest = `sha256:${createHash("sha256").update("bytes").digest("hex")}`;
  try { assert.equal(await executeEngineInstall("trivy", "1.0.0", artifact, digest, { manifestPublicKeyPath: keyPath, approve: true, quiet: true }), 78); }
  finally { await rm(root, { recursive: true, force: true }); }
});

test("engine install rejects symlink artifacts before reading", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-install-link-"));
  const target = join(root, "engine.bin");
  const link = join(root, "engine-link.bin");
  await writeFile(target, "bytes");
  await symlink(target, link);
  try {
    assert.equal(await executeEngineInstall("trivy", "1.0.0", link, `sha256:${"a".repeat(64)}`, { approve: true }), 78);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
