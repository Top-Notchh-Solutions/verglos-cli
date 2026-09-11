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

test("scan rejects unknown and repeated detector selections", async () => {
  await assert.rejects(() => runScan({ projectRoot: "/path/that/must/not/be-read", detectors: ["unknown-detector" as never] }), /unsupported detector/);
  await assert.rejects(() => runScan({ projectRoot: "/path/that/must/not/be-read", detectors: ["secrets", "secrets"] }), /cannot repeat/);
});

test("scan exposes a deterministic coverage manifest", async () => {
  const result = await runScan({ projectRoot: new URL("../fixtures/insecure-app", import.meta.url).pathname, detectors: ["secrets"], noProvenance: true });
  assert.equal(result.coverage?.status, "incomplete");
  assert.deepEqual(result.coverage?.requestedDetectors, ["secrets"]);
  assert.deepEqual(result.coverage?.executedDetectors, ["secrets"]);
  assert.deepEqual(result.coverage?.limitations, ["provenance was explicitly skipped"]);
  assert.ok((result.coverage?.filesWalked ?? 0) > 0);
});

test("scan progress reports bounded lifecycle events without content", async () => {
  const events: Array<{ phase: string; status: string; detector?: string }> = [];
  await runScan({ projectRoot: new URL("../fixtures/insecure-app", import.meta.url).pathname, detectors: ["secrets"], noProvenance: true, onProgress: (event) => events.push(event) });
  assert.deepEqual(events.map(({ phase, status, detector }) => ({ phase, status, ...(detector ? { detector } : {}) })), [
    { phase: "config", status: "started" }, { phase: "config", status: "completed" },
    { phase: "target", status: "started" }, { phase: "target", status: "completed" },
    { phase: "walk", status: "started" }, { phase: "walk", status: "completed" },
    { phase: "detector", status: "started", detector: "secrets" }, { phase: "detector", status: "completed", detector: "secrets" },
    { phase: "provenance", status: "started" }, { phase: "provenance", status: "completed" },
  ]);
});
