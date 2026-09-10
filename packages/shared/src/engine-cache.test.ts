import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { createHash } from "node:crypto";
import { EngineCacheError, installEngineArtifact, readCachedEngine, listCachedEngines } from "./engine-cache.js";

test("engine cache rejects traversal path segments", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-cache-"));
  await assert.rejects(() => installEngineArtifact(root, "../escape", "1.0.0", new Uint8Array(), "sha256:" + "a".repeat(64)), (error: unknown) => error instanceof EngineCacheError && error.code === "INVALID_PATH");
  await assert.rejects(() => readCachedEngine(root, "trivy", "../escape"), (error: unknown) => error instanceof EngineCacheError && error.code === "INVALID_PATH");
});

test("engine cache installs digest-verified bytes atomically", async () => { const root = await mkdtemp(join(tmpdir(), "verglos-cache-")); const bytes = new TextEncoder().encode("engine"); const digest = `sha256:${createHash("sha256").update(bytes).digest("hex")}`; const path = await installEngineArtifact(root, "trivy", "1.0.0", bytes, digest); assert.equal((await readCachedEngine(root, "trivy", "1.0.0")).toString(), "engine"); assert.match(path, /engine\.bin$/); });
test("engine cache rejects digest mismatch", async () => { const root = await mkdtemp(join(tmpdir(), "verglos-cache-")); await assert.rejects(() => installEngineArtifact(root, "trivy", "1.0.0", new TextEncoder().encode("x"), `sha256:${"a".repeat(64)}`), (error: unknown) => error instanceof EngineCacheError && error.code === "DIGEST_MISMATCH"); });
test("engine cache status lists only readable installed entries", async () => { const root = await mkdtemp(join(tmpdir(), "verglos-cache-")); const bytes = new TextEncoder().encode("engine"); const digest = `sha256:${createHash("sha256").update(bytes).digest("hex")}`; await installEngineArtifact(root, "trivy", "1.0.0", bytes, digest); assert.deepEqual((await listCachedEngines(root)).map((entry) => [entry.engineId, entry.version]), [["trivy", "1.0.0"]]); });
test("engine cache rejects symlinked payloads", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-cache-link-"));
  const target = join(root, "outside"); const payload = join(root, "trivy", "1.0.0", "engine.bin");
  await writeFile(target, "engine"); await mkdir(join(root, "trivy", "1.0.0"), { recursive: true }); await symlink(target, payload);
  try { await assert.rejects(() => readCachedEngine(root, "trivy", "1.0.0"), (error: unknown) => error instanceof EngineCacheError && error.code === "INSTALL_FAILED"); }
  finally { await rm(root, { recursive: true, force: true }); }
});
