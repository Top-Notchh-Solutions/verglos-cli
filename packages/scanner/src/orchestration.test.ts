import assert from "node:assert/strict";
import { mkdtemp, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
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
    { phase: "provenance", status: "skipped" },
  ]);
});

test("ordinary scans never execute target package scripts", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-no-exec-"));
  try {
    await writeFile(join(root, "package.json"), JSON.stringify({ name: "fixture", scripts: { prepare: "node write-marker.js" } }));
    await writeFile(join(root, "write-marker.js"), `require("node:fs").writeFileSync(${JSON.stringify(join(root, "executed.txt"))}, "executed")`);
    await writeFile(join(root, "app.ts"), "export const safe = true;\n");
    await runScan({ projectRoot: root, detectors: ["secrets"], noProvenance: true });
    assert.deepEqual(await readdir(root), ["app.ts", "package.json", "write-marker.js"]);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("ordinary scans do not make outbound fetch requests", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async () => { throw new Error("unexpected outbound request"); }) as typeof fetch;
  try {
    const result = await runScan({ projectRoot: new URL("../fixtures/insecure-app", import.meta.url).pathname, detectors: ["secrets"], noProvenance: true });
    assert.equal(result.coverage?.status, "incomplete");
  } finally {
    globalThis.fetch = originalFetch;
  }
});
