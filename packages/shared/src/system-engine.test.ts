import assert from "node:assert/strict";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { inspectSystemEngine, SystemEngineError } from "./system-engine.js";

test("system engine mode requires an explicit absolute path", async () => { await assert.rejects(() => inspectSystemEngine("trivy"), (e: unknown) => e instanceof SystemEngineError && e.code === "PATH_REQUIRED"); const root = await mkdtemp(join(tmpdir(), "verglos-engine-")); const path = join(root, "engine"); await writeFile(path, "not executable"); const result = await inspectSystemEngine(path); assert.equal(result.trust, "unavailable"); assert.equal(result.path, path); });
