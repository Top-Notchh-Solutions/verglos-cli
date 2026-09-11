import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtemp, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { runScan } from "./index.js";

test("scan rejects invalid detector concurrency before execution", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-scan-orchestration-"));
  await writeFile(join(root, "index.ts"), "export const value = 1;\n", "utf8");
  await assert.rejects(() => runScan({ projectRoot: root, detectorConcurrency: 0 }), /detector concurrency/);
});

test("scan honours an already-aborted signal without walking the target", async () => {
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(() => runScan({ projectRoot: "/path/that/must/not/be-read", signal: controller.signal }), /scan cancelled/);
});
