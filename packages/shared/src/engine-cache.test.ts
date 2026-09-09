import assert from "node:assert/strict";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { createHash } from "node:crypto";
import { EngineCacheError, installEngineArtifact, readCachedEngine, listCachedEngines } from "./engine-cache.js";

test("engine cache installs digest-verified bytes atomically", async () => { const root = await mkdtemp(join(tmpdir(), "verglos-cache-")); const bytes = new TextEncoder().encode("engine"); const digest = `sha256:${createHash("sha256").update(bytes).digest("hex")}`; const path = await installEngineArtifact(root, "trivy", "1.0.0", bytes, digest); assert.equal((await readCachedEngine(root, "trivy", "1.0.0")).toString(), "engine"); assert.match(path, /engine\.bin$/); });
test("engine cache rejects digest mismatch", async () => { const root = await mkdtemp(join(tmpdir(), "verglos-cache-")); await assert.rejects(() => installEngineArtifact(root, "trivy", "1.0.0", new TextEncoder().encode("x"), `sha256:${"a".repeat(64)}`), (error: unknown) => error instanceof EngineCacheError && error.code === "DIGEST_MISMATCH"); });
test("engine cache status lists only readable installed entries", async () => { const root = await mkdtemp(join(tmpdir(), "verglos-cache-")); const bytes = new TextEncoder().encode("engine"); const digest = `sha256:${createHash("sha256").update(bytes).digest("hex")}`; await installEngineArtifact(root, "trivy", "1.0.0", bytes, digest); assert.deepEqual((await listCachedEngines(root)).map((entry) => [entry.engineId, entry.version]), [["trivy", "1.0.0"]]); });
