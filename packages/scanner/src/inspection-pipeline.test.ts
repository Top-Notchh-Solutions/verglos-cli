import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import {
  createSubject,
  parseEngineHealth,
  type EngineAdapter,
  type EngineExecutionRequest,
  type TargetResolution,
  type TargetSpec,
} from "@verglos/shared";
import { runInspectionPipeline } from "./inspection-pipeline.js";

const subject = createSubject({ kind: "artifact", digest: { algorithm: "sha256", value: "a".repeat(64) }, size: 42, mediaType: "application/octet-stream" });
const target: TargetSpec = { kind: "artifact", value: "sha256:" + "a".repeat(64) };

function resolution(value: TargetSpec = target): TargetResolution {
  return { target: value, subject, coverage: "complete", limitations: [] };
}

const sarifBytes = Buffer.from(JSON.stringify({ version: "2.1.0", runs: [{ tool: { driver: { name: "fixture" } }, results: [{ ruleId: "javascript.security.injection", level: "error", message: { text: "DO_NOT_ECHO_RAW_SARIF_TEXT" }, locations: [{ physicalLocation: { artifactLocation: { uri: "src/app.js" }, region: { startLine: 7 } } }] }] }] }));

function healthyEngine() {
  return parseEngineHealth({
    schemaId: "urn:verglos:schema:engine-health",
    schemaVersion: "1.0.0",
    producer: { id: "trivy", kind: "external", name: "Trivy fixture", version: "1.0.0" },
    observedAt: "2026-09-13T10:00:00.000Z",
    state: "healthy",
    components: [{ id: "trivy.binary", kind: "binary", name: "Trivy", version: "1.0.0", digest: { algorithm: "sha256", value: "c".repeat(64) }, source: "system", trust: "computed-only" }],
    capabilities: [{ id: "trivy.scan", subjectKinds: ["artifact"], status: "supported" }],
    freshness: [{ componentId: "trivy.binary", status: "current", checkedAt: "2026-09-13T10:00:00.000Z" }],
    incompleteReasons: [],
  });
}

function testEngine(options: { readonly fail?: boolean; readonly runId?: string } = {}) {
  const health = healthyEngine();
  let executeCount = 0;
  const adapter: EngineAdapter = {
    id: "trivy",
    version: "1.0.0",
    capabilities: [{ id: "trivy.scan", description: "Fixture scan", requiresNetwork: false }],
    requirements: { runtime: "test", executable: "fixture" },
    health: async () => health,
    execute: async (request: EngineExecutionRequest) => {
      executeCount++;
      assert.equal(request.network, "denied");
      if (options.fail) throw new Error("sensitive runtime path must not escape");
      const { schemaId: _schemaId, schemaVersion: _schemaVersion, ...engine } = health;
      const startedAt = "2026-09-13T10:00:00.000Z";
      const completedAt = "2026-09-13T10:00:00.010Z";
      const bytes = Buffer.from("{}", "utf8");
      const digest = "sha256:" + createHash("sha256").update(bytes).digest("hex") as `sha256:${string}`;
      return {
        run: {
          schemaId: "urn:verglos:schema:tool-run",
          schemaVersion: "1.0.0",
          runId: options.runId ?? "urn:uuid:123e4567-e89b-42d3-a456-426614174002",
          subjectId: request.targetSubjectId,
          engine,
          requestedCapabilities: ["trivy.scan"],
          executedCapabilities: ["trivy.scan"],
          executionClass: "local-process",
          networkAccess: "none",
          targetCodeExecuted: false,
          startedAt,
          completedAt,
          durationMs: 10,
          timeoutMs: request.timeoutMs,
          outcome: "succeeded",
          processResult: { kind: "exited", code: 0 },
          coverage: "complete",
          incompleteReasons: [],
        },
        observations: [],
        rawOutput: { mediaType: "application/json", bytes, digest, redacted: false },
      };
    },
    normalize: () => [],
    updateMetadata: () => ({ channel: "pinned" }),
  };
  return { adapter, executed: () => executeCount };
}

test("inspection composes an adapter and raw SARIF import into one coverage-bound snapshot", async () => {
  const engine = testEngine();
  const progress: Array<{ phase: string; producer?: string; status: string }> = [];
  const result = await runInspectionPipeline({
    target,
    cwd: "/tmp",
    resolveTarget: async (selected) => resolution(selected),
    producers: ["sarif", "trivy"],
    engines: [{ producer: "trivy", adapter: engine.adapter, request: { capabilities: ["trivy.scan"], timeoutMs: 10_000, network: "denied" } }],
    imports: [{ producer: "sarif", bytes: sarifBytes }],
    policyInputs: { profile: "free", checks: ["coverage"] },
    onProgress: (event) => progress.push({ phase: event.phase, ...("producer" in event && event.producer ? { producer: event.producer } : {}), status: event.status }),
  });
  assert.equal(engine.executed(), 1);
  assert.equal(result.snapshot.schemaVersion, "1.1.0");
  assert.equal(result.snapshot.coverage.status, "incomplete");
  assert.equal(result.snapshot.coverage.producers.length, 2);
  assert.equal(result.snapshot.coverage.producers.find((entry) => entry.producer === "sarif")?.sourceDigests[0], `sha256:${createHash("sha256").update(sarifBytes).digest("hex")}`);
  assert.equal(result.snapshot.observations.length, 1);
  assert.equal(result.observations[0]?.origin.producerId, "sarif.import");
  assert.equal(result.observations[0]?.severity.normalized, "unknown");
  assert.ok(progress.some((event) => event.phase === "snapshot" && event.status === "incomplete"));
  assert.ok(!JSON.stringify(progress).includes("src/app.js"));
  assert.ok(!JSON.stringify(result).includes("DO_NOT_ECHO_RAW_SARIF_TEXT"));
});

test("missing import and adapter failure remain explicit incomplete coverage without echoing errors", async () => {
  const engine = testEngine({ fail: true });
  const result = await runInspectionPipeline({
    target,
    cwd: "/tmp",
    resolveTarget: async (selected) => resolution(selected),
    producers: ["trivy", "spdx"],
    engines: [{ producer: "trivy", adapter: engine.adapter, request: { capabilities: ["trivy.scan"], timeoutMs: 10_000, network: "denied" } }],
    policyInputs: {},
  });
  assert.equal(result.coverage.status, "incomplete");
  assert.equal(result.coverage.producers.find((entry) => entry.producer === "trivy")?.state, "failed");
  assert.equal(result.coverage.producers.find((entry) => entry.producer === "spdx")?.state, "not-provided");
  assert.equal(JSON.stringify(result.coverage).includes("sensitive runtime path"), false);
  assert.equal(JSON.stringify(result.coverage).includes("/private"), false);
});

test("unsafe SARIF locations fail closed without creating observations", async () => {
  const unsafe = Buffer.from(JSON.stringify({ version: "2.1.0", runs: [{ tool: { driver: { name: "fixture" } }, results: [{ ruleId: "r1", locations: [{ physicalLocation: { artifactLocation: { uri: "../../outside.js" } } }] }] }] }));
  const result = await runInspectionPipeline({
    target,
    cwd: "/tmp",
    resolveTarget: async (selected) => resolution(selected),
    producers: ["sarif"],
    imports: [{ producer: "sarif", bytes: unsafe }],
    policyInputs: {},
  });
  assert.equal(result.coverage.status, "incomplete");
  assert.equal(result.coverage.producers[0]?.state, "failed");
  assert.deepEqual(result.observations, []);
});

test("native inspection runs without project scripts and marks opted-out provenance incomplete", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-inspect-native-"));
  try {
    const marker = join(root, "executed.txt");
    await writeFile(join(root, "package.json"), JSON.stringify({ name: "fixture", scripts: { prepare: `node -e \"require('node:fs').writeFileSync(${JSON.stringify(marker)}, 'ran')\"` } }));
    await writeFile(join(root, "app.ts"), "export const safe = true;\n");
    const fsSubject = createSubject({ kind: "filesystem", treeDigest: { algorithm: "sha256", value: "e".repeat(64) }, ignorePolicyDigest: { algorithm: "sha256", value: "f".repeat(64) }, entryCount: 2 });
    let resolutions = 0;
    const result = await runInspectionPipeline({
      target: { kind: "filesystem", value: root },
      cwd: root,
      resolveTarget: async (selected) => { resolutions++; return { target: selected, subject: fsSubject, coverage: "complete", limitations: [] }; },
      producers: ["native"],
      native: { projectRoot: root, options: { detectors: ["secrets"], noProvenance: true } },
      policyInputs: {},
    });
    assert.ok(result.nativeScan);
    assert.equal(resolutions, 2);
    assert.equal(result.coverage.status, "incomplete");
    assert.ok(result.coverage.producers[0]?.limitations.includes("provenance was explicitly skipped"));
    await assert.rejects(() => readFile(marker));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("inspection cancellation stops before target resolution and output creation", async () => {
  const controller = new AbortController();
  controller.abort();
  let resolved = false;
  await assert.rejects(() => runInspectionPipeline({ target, cwd: "/tmp", resolveTarget: async (selected) => { resolved = true; return resolution(selected); }, producers: ["trivy"], policyInputs: {}, signal: controller.signal }), /inspection cancelled/);
  assert.equal(resolved, false);
});
