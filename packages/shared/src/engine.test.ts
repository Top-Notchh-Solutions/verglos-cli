import assert from "node:assert/strict";
import { test } from "node:test";
import {
  ENGINE_HEALTH_SCHEMA,
  EngineContractValidationError,
  JsonDocumentError,
  TOOL_RUN_SCHEMA,
  createSubject,
  parseEngineHealth,
  parseEngineHealthJson,
  parseToolRun,
  parseToolRunJson,
  type EngineHealthDocument,
  type IncompleteReason,
  type ToolRunDocument,
} from "./index.js";

const now = "2026-09-09T00:00:00.000Z";
const digest = { algorithm: "sha256" as const, value: "a".repeat(64) };
const reason = (code: IncompleteReason["code"]): IncompleteReason => ({
  code,
  scope: "repository.scan",
  message: `Coverage is incomplete: ${code}.`,
  action: "Restore the required engine state and rerun.",
});

function healthyEngine(): EngineHealthDocument {
  return {
    schemaId: ENGINE_HEALTH_SCHEMA.id,
    schemaVersion: ENGINE_HEALTH_SCHEMA.version,
    producer: {
      id: "verglos.native-scanner",
      kind: "native",
      name: "Verglos native scanner",
      version: "2.0.0-alpha.1",
    },
    observedAt: now,
    state: "healthy",
    components: [
      {
        id: "scanner.binary",
        kind: "binary",
        name: "Verglos scanner",
        version: "2.0.0-alpha.1",
        digest,
        source: "bundled",
        trust: "verified",
      },
      {
        id: "scanner.checks",
        kind: "checks",
        name: "Native detector set",
        digest: { algorithm: "sha256", value: "b".repeat(64) },
        source: "embedded",
        trust: "computed-only",
      },
    ],
    capabilities: [
      {
        id: "repository.scan",
        subjectKinds: ["repository-tree", "filesystem"],
        status: "supported",
      },
    ],
    freshness: [
      {
        componentId: "scanner.checks",
        status: "current",
        sourceUpdatedAt: "2026-09-08T00:00:00.000Z",
        checkedAt: now,
        maxAgeSeconds: 604800,
      },
    ],
    incompleteReasons: [],
  };
}

function validRun(): ToolRunDocument {
  const subject = createSubject({
    kind: "filesystem",
    treeDigest: { algorithm: "sha256", value: "c".repeat(64) },
    ignorePolicyDigest: { algorithm: "sha256", value: "d".repeat(64) },
    entryCount: 10,
  });
  const { schemaId: _schemaId, schemaVersion: _schemaVersion, ...engine } =
    healthyEngine();
  return {
    schemaId: TOOL_RUN_SCHEMA.id,
    schemaVersion: TOOL_RUN_SCHEMA.version,
    runId: "urn:uuid:12345678-1234-4123-8123-123456789abc",
    subjectId: subject.subjectId,
    engine,
    requestedCapabilities: ["repository.scan"],
    executedCapabilities: ["repository.scan"],
    executionClass: "in-process",
    networkAccess: "none",
    targetCodeExecuted: false,
    startedAt: "2026-09-09T00:00:00.000Z",
    completedAt: "2026-09-09T00:00:01.000Z",
    durationMs: 1000,
    timeoutMs: 30000,
    outcome: "succeeded",
    processResult: { kind: "exited", code: 0 },
    coverage: "complete",
    incompleteReasons: [],
  };
}

test("healthy engine health and complete tool runs round-trip", () => {
  const health = healthyEngine();
  const run = validRun();
  assert.deepEqual(parseEngineHealth(health), health);
  assert.deepEqual(parseEngineHealthJson(JSON.stringify(health)), health);
  assert.deepEqual(parseToolRun(run), run);
  assert.deepEqual(parseToolRunJson(JSON.stringify(run)), run);
});

test("unavailable and incompatible engines require explicit incomplete reasons", () => {
  for (const state of ["unavailable", "incompatible"] as const) {
    assertEngineError(
      () => parseEngineHealth({ ...healthyEngine(), state }),
      "incompleteReasons",
    );
    const code = state === "unavailable" ? "engine-missing" : "engine-incompatible";
    assert.equal(
      parseEngineHealth({
        ...healthyEngine(),
        state,
        incompleteReasons: [reason(code)],
      }).state,
      state,
    );
  }
});

test("healthy engines cannot hide an incomplete reason", () => {
  assertEngineError(
    () =>
      parseEngineHealth({
        ...healthyEngine(),
        incompleteReasons: [reason("partial-output")],
      }),
    "incompleteReasons",
  );
  assertEngineError(
    () => parseEngineHealth({ ...healthyEngine(), components: [] }),
    "components",
  );
  assertEngineError(
    () =>
      parseEngineHealth({
        ...healthyEngine(),
        freshness: [
          {
            componentId: "scanner.checks",
            status: "stale",
            sourceUpdatedAt: "2026-08-01T00:00:00.000Z",
            checkedAt: now,
          },
        ],
      }),
    "state",
  );
});

test("stale engine state requires dated stale component freshness", () => {
  const stale = {
    ...healthyEngine(),
    state: "stale" as const,
    incompleteReasons: [reason("checks-stale")],
  };
  assertEngineError(() => parseEngineHealth(stale), "freshness");
  assertEngineError(
    () =>
      parseEngineHealth({
        ...stale,
        freshness: [{ componentId: "scanner.checks", status: "stale", checkedAt: now }],
      }),
    "freshness.0.sourceUpdatedAt",
  );
  assert.equal(
    parseEngineHealth({
      ...stale,
      freshness: [
        {
          componentId: "scanner.checks",
          status: "stale",
          sourceUpdatedAt: "2026-08-01T00:00:00.000Z",
          checkedAt: now,
          maxAgeSeconds: 604800,
        },
      ],
    }).state,
    "stale",
  );
});

test("freshness references and component/capability IDs are consistent", () => {
  assertEngineError(
    () =>
      parseEngineHealth({
        ...healthyEngine(),
        freshness: [
          { componentId: "missing.database", status: "unknown", checkedAt: now },
        ],
      }),
    "freshness.0.componentId",
  );
  const engine = healthyEngine();
  assertEngineError(
    () =>
      parseEngineHealth({
        ...engine,
        components: [...engine.components, engine.components[0]],
      }),
    "components.2",
  );
});

test("a failed or non-healthy run cannot report complete coverage", () => {
  const run = validRun();
  assertEngineError(
    () => parseToolRun({ ...run, outcome: "failed" }),
    "coverage",
  );

  const degraded = {
    ...run.engine,
    state: "degraded" as const,
    incompleteReasons: [reason("partial-output")],
  };
  assertEngineError(
    () => parseToolRun({ ...run, engine: degraded }),
    "coverage",
  );
});

test("a successful process may still carry explicit incomplete coverage", () => {
  const run = validRun();
  const parsed = parseToolRun({
    ...run,
    coverage: "incomplete",
    incompleteReasons: [reason("unsupported-language")],
  });
  assert.equal(parsed.outcome, "succeeded");
  assert.equal(parsed.coverage, "incomplete");
});

test("process results cannot contradict run outcomes", () => {
  const run = validRun();
  assertEngineError(
    () => parseToolRun({ ...run, processResult: { kind: "exited", code: 1 } }),
    "processResult",
  );
  assertEngineError(
    () =>
      parseToolRun({
        ...run,
        outcome: "failed",
        processResult: { kind: "exited", code: 0 },
        coverage: "incomplete",
        incompleteReasons: [reason("execution-failed")],
      }),
    "processResult",
  );
  assertEngineError(
    () => parseToolRun({ ...run, processResult: { kind: "not-started" } }),
    "processResult",
  );
});

test("evidence producers cannot claim target-code execution", () => {
  assertEngineError(
    () => parseToolRun({ ...validRun(), targetCodeExecuted: true }),
    "targetCodeExecuted",
  );
});

test("timed-out runs require bounded timing and an incomplete reason", () => {
  const run = validRun();
  const timedOut = {
    ...run,
    outcome: "timed-out" as const,
    processResult: { kind: "signaled" as const, signal: "SIGKILL" },
    coverage: "incomplete" as const,
    incompleteReasons: [reason("timeout")],
  };
  assertEngineError(
    () => parseToolRun({ ...timedOut, durationMs: 29999 }),
    "durationMs",
  );
  assert.equal(parseToolRun({ ...timedOut, durationMs: 30000 }).outcome, "timed-out");
});

test("executed capabilities must be requested and IDs must be unique", () => {
  const run = validRun();
  assertEngineError(
    () => parseToolRun({ ...run, executedCapabilities: ["repository.other"] }),
    "executedCapabilities.0",
  );
  assertEngineError(
    () =>
      parseToolRun({
        ...run,
        requestedCapabilities: ["repository.scan", "repository.scan"],
      }),
    "requestedCapabilities.1",
  );
});

test("completion time cannot precede start time", () => {
  assertEngineError(
    () =>
      parseToolRun({
        ...validRun(),
        completedAt: "2026-09-08T23:59:59.000Z",
      }),
    "completedAt",
  );
});

test("future tool-run versions fail with an actionable upgrade error", () => {
  assert.throws(
    () =>
      parseToolRunJson(
        JSON.stringify({ ...validRun(), schemaVersion: "2.0.0" }),
      ),
    (error: unknown) => {
      assert.ok(error instanceof JsonDocumentError);
      assert.equal(error.code, "SCHEMA_UPGRADE_REQUIRED");
      assert.match(error.action, /Upgrade/);
      return true;
    },
  );
});

function assertEngineError(operation: () => unknown, path: string): void {
  assert.throws(operation, (error: unknown) => {
    assert.ok(error instanceof EngineContractValidationError);
    assert.ok(
      error.issues.some(
        (issue) => issue.path === path || issue.path.startsWith(`${path}.`),
      ),
      `expected an issue under ${path}`,
    );
    return true;
  });
}
