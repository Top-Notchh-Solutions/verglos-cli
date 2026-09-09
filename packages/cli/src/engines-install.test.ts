import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { executeEngineInstall } from "./engines-install.js";

test("engine install rejects an incorrect digest", async () => { const root = await mkdtemp(join(tmpdir(), "verglos-install-")); const artifact = join(root, "engine"); await writeFile(artifact, "bytes"); const previous = process.env.VERGLOS_ENGINE_CACHE; process.env.VERGLOS_ENGINE_CACHE = join(root, "cache"); try { assert.equal(await executeEngineInstall("trivy", "1.0.0", artifact, `sha256:${"a".repeat(64)}`), 78); } finally { if (previous === undefined) delete process.env.VERGLOS_ENGINE_CACHE; else process.env.VERGLOS_ENGINE_CACHE = previous; } void createHash; });
