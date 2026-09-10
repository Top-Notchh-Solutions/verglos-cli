import assert from "node:assert/strict";
import { test } from "node:test";
import { assertEngineRequestBound } from "./engine-adapter.js";

test("engine adapter requests enforce bounded timeout and network declarations", () => {
  assert.doesNotThrow(() => assertEngineRequestBound({ targetSubjectId: "urn:verglos:subject:artifact:sha256:" + "a".repeat(64), capabilities: ["scan"], timeoutMs: 1_000, network: "denied" }));
  assert.doesNotThrow(() => assertEngineRequestBound({ targetSubjectId: "subject", capabilities: [], timeoutMs: 1_000, network: "allowlisted", allowlist: ["https://registry.example"] }));
  assert.throws(() => assertEngineRequestBound({ targetSubjectId: "subject", capabilities: [], timeoutMs: 0, network: "denied" }));
  assert.throws(() => assertEngineRequestBound({ targetSubjectId: "subject", capabilities: [], timeoutMs: 1_000, network: "allowlisted" }));
});
