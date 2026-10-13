import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { parseHuntAttackHypothesis } from "@verglos/shared";
import type { HuntRuntimeLoader } from "./hunt-runtime.js";
import { executeHuntHypothesis } from "./hunt-hypothesis.js";

const subjectId = `urn:verglos:subject:repository-tree:sha256:${"d".repeat(64)}`;
const manifest = {
  schemaId: "urn:verglos:schema:hunt-target-manifest",
  schemaVersion: "1.0.0",
  targetSubjectId: subjectId,
  frameworks: ["express"],
  entrypoints: [{ path: "app.js", kind: "source" }],
  routes: [{ method: "POST", path: "/run", file: "app.js" }],
  apis: [{ method: "POST", path: "/run", file: "app.js" }],
  dependencyBoundaries: ["express"],
  agentMcpTools: [],
  candidateSinks: [{ kind: "command-execution", path: "app.js", line: 4, confidence: "candidate" }],
  coverage: { status: "complete", filesInspected: 2, bytesInspected: 120, limitations: [] },
} as const;

const localHuntRuntime: HuntRuntimeLoader = () => import("../../hunt/dist/index.js");

test("hunt hypothesis consumes a Scout envelope and emits a bounded execution-free plan", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-cli-hunt-hypothesis-"));
  const manifestPath = join(root, "scout.json");
  const logs: string[] = [];
  const originalLog = console.log;
  try {
    await writeFile(manifestPath, JSON.stringify({ status: "ok", manifest, privateRoot: "/private/customer/source" }));
    console.log = (line?: unknown) => logs.push(String(line));
    assert.equal(await executeHuntHypothesis({ manifestPath, findingId: "finding-command", ruleId: "D1-003", subjectId, location: "app.js", line: "4", severity: "high", json: true, quiet: true, runtimeLoader: localHuntRuntime }), 0);
    const hypothesis = parseHuntAttackHypothesis(JSON.parse(logs[0]!));
    assert.equal(hypothesis.status, "supported");
    assert.equal(hypothesis.playbook?.recipeId, "a2-command-injection-harness");
    assert.equal(hypothesis.executes, false);
    assert.equal(JSON.stringify(hypothesis).includes("/private/customer"), false);
  } finally {
    console.log = originalLog;
    await rm(root, { recursive: true, force: true });
  }
});

test("hunt hypothesis returns a typed not-attemptable result when target context is absent", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-cli-hunt-hypothesis-empty-"));
  const manifestPath = join(root, "manifest.json");
  const logs: string[] = [];
  const originalLog = console.log;
  try {
    await writeFile(manifestPath, JSON.stringify({ ...manifest, routes: [], apis: [], candidateSinks: [] }));
    console.log = (line?: unknown) => logs.push(String(line));
    assert.equal(await executeHuntHypothesis({ manifestPath, findingId: "finding-command", ruleId: "D1-003", subjectId, json: true, quiet: true, runtimeLoader: localHuntRuntime }), 3);
    assert.equal(parseHuntAttackHypothesis(JSON.parse(logs[0]!)).status, "not_attemptable");
  } finally {
    console.log = originalLog;
    await rm(root, { recursive: true, force: true });
  }
});

test("hunt hypothesis rejects invalid or mismatched inputs before loading the runtime", async () => {
  const logs: string[] = [];
  const originalLog = console.log;
  let loaded = false;
  try {
    console.log = (line?: unknown) => logs.push(String(line));
    const runtimeLoader: HuntRuntimeLoader = async () => { loaded = true; return {}; };
    assert.equal(await executeHuntHypothesis({ manifestPath: "bad\u0000manifest", findingId: "finding", ruleId: "D1-003", subjectId, json: true, quiet: true, runtimeLoader }), 2);
    assert.equal(loaded, false);
    assert.deepEqual(JSON.parse(logs[0]!), { status: "error", code: "HUNT_HYPOTHESIS_INPUT", message: "hunt hypothesis input is invalid" });
  } finally { console.log = originalLog; }
});
