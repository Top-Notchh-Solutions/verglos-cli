import assert from "node:assert/strict";
import { test } from "node:test";
import { runScan } from "./index.js";

test("scan rejects invalid detector concurrency before execution", async () => {
  await assert.rejects(() => runScan({ projectRoot: "/path/that/must/not/be-read", detectorConcurrency: 0 }), /detector concurrency/);
});

test("scan honours an already-aborted signal without walking the target", async () => {
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(() => runScan({ projectRoot: "/path/that/must/not/be-read", signal: controller.signal }), /scan cancelled/);
});
