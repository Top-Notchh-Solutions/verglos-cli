import assert from "node:assert/strict";
import test from "node:test";
import { formatEngineStatus } from "./engines-status.js";

const engines = [
  { engineId: "trivy", version: "1.0.0", digest: "sha256:abc" },
] as const;

test("engine status formatting is deterministic for human and JSON output", () => {
  assert.equal(formatEngineStatus("/cache", engines), "trivy@1.0.0 sha256:abc (computed-only)");
  assert.equal(formatEngineStatus("/cache", [], false), "No cached engines found.");
  assert.equal(formatEngineStatus("/cache", engines, true), JSON.stringify({ cacheRoot: "/cache", engines: [{ ...engines[0], trust: "computed-only" }] }));
  assert.equal(formatEngineStatus("/cache", engines, false, true), "");
});
