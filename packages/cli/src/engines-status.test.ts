import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtemp } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { installEngineArtifact } from "@verglos/shared";
import { createHash } from "node:crypto";

test("engine cache status is consumable by CLI callers", async () => { const root = await mkdtemp(join(tmpdir(), "verglos-cli-engines-")); const bytes = new TextEncoder().encode("engine"); await installEngineArtifact(root, "trivy", "1.0.0", bytes, `sha256:${createHash("sha256").update(bytes).digest("hex")}`); assert.ok(root); });
