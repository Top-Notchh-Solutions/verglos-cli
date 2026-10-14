import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { bindHuntExecution, createApprovalReceipt, HuntExecutionBindingSchema, parseHuntRecipe } from "@verglos/shared";
import { DockerSandboxAdapter } from "./docker-sandbox-adapter.js";
import { createHuntTestTrustStore, HUNT_TEST_TRUST_KEY_ID } from "./hunt-trust-test-support.js";
import { SUPPORTED_HUNT_RECIPE_CATALOG } from "./supported-recipe-catalog.js";
import { TARGET_HARNESS_ASSERTION } from "./target-harness.js";

const subjectId = `urn:verglos:subject:artifact:sha256:${"a".repeat(64)}`;
const imageDigest = `sha256:${"b".repeat(64)}`;
const finding = { id: "critical-1", severity: "critical", title: "critical", description: "x", detector: "deep-auth", confidence: "certain", category: "auth" } as never;
const fixtures = {
  positive: { fixtureId: "positive", expectedVerdict: "confirmed" },
  negative: { fixtureId: "negative", expectedVerdict: "not-reproduced" },
  timeout: { fixtureId: "timeout", expectedVerdict: "environment-error" },
  infrastructureFailure: { fixtureId: "infrastructure-failure", expectedVerdict: "environment-error" },
  unsupported: { fixtureId: "unsupported", expectedVerdict: "not-supported" },
} as const;

function binding() {
  const recipe = parseHuntRecipe({ schemaId: "urn:verglos:schema:hunt-recipe", schemaVersion: "1.0.0", recipeId: "docker-adapter", ruleId: "d1-1", targetSubjectId: subjectId, imageDigest: { algorithm: "sha256", value: "b".repeat(64) }, command: ["/probe"], assertions: ["exit code is 0"], fixtures, isolation: "container", limits: { timeoutMs: 1000, cpuMs: 900, memoryMb: 256, diskMb: 128, outputBytes: 10000, processes: 32, maxNetworkRequests: 0 }, cleanup: "always", network: { mode: "denied", destinations: [], reason: "fixture" }, redaction: "required", signature: { status: "verified", signer: HUNT_TEST_TRUST_KEY_ID } });
  const approval = createApprovalReceipt({ requestId: "623e4567-e89b-12d3-a456-426614174000", action: "execute", actor: "human", target: subjectId, files: [], network: [], policyEffect: "hunt", requestedAt: "2026-01-01T00:00:00Z", expiresAt: "2099-01-01T00:00:00Z" }, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
  return bindHuntExecution({ recipe, trust: createHuntTestTrustStore(recipe), approval, ruleId: "d1-1", subjectId, observationId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", at: "2026-01-01T00:02:00Z" });
}

test("Docker sandbox adapter uses the bound digest and evaluates bounded exit assertions", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-docker-adapter-"));
  try {
    let argv: readonly string[] = [];
    let runnerTimeout = 0;
    const adapter = new DockerSandboxAdapter({ image: "ghcr.io/verglos/probe", imageDigest, run: async (args, options) => { argv = args; runnerTimeout = options.timeout; return { stdout: "fixture", stderr: "" }; } });
    const result = await adapter.execute({ finding, projectRoot: root, timeoutMs: 1000, binding: binding() });
    assert.equal(result.verdict, "true");
    assert.equal(result.canonicalVerdict, "confirmed");
    assert.match(result.reason, /satisfied/);
    assert.match(result.evidenceDigest ?? "", /^sha256:/);
    assert.equal(result.redacted, true);
    assert.equal(result.executionStatus, "completed");
    assert.deepEqual(result.assurance, {
      class: "A2",
      isolation: "container",
      securityBoundary: true,
      sourceAccess: "read-only",
      network: "denied",
      processLimit: 32,
      limitation: "A2 runs a signed recipe in a pinned Docker container with read-only project input, denied network, dropped capabilities, and bounded resources; host Docker daemon/VM policy and platform-specific kernel differences remain outside this result",
    });
    assert.equal(runnerTimeout, 900, "the shorter declared CPU budget must also cap host supervision");
    assert.ok(argv.includes("--network"));
    assert.ok(argv.includes("none"));
    assert.deepEqual(argv.slice(argv.indexOf("--pids-limit"), argv.indexOf("--pids-limit") + 2), ["--pids-limit", "32"]);
    assert.deepEqual(argv.slice(argv.indexOf("--cpus"), argv.indexOf("--cpus") + 2), ["--cpus", "1"]);
    assert.deepEqual(argv.slice(argv.indexOf("--tmpfs") + 1, argv.indexOf("--tmpfs") + 2), ["/tmp:rw,noexec,nosuid,nodev,size=128m"]);
    assert.ok(argv.includes("/probe"));
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("Docker sandbox adapter rejects digest or network drift", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-docker-adapter-"));
  try {
    const adapter = new DockerSandboxAdapter({ image: "ghcr.io/verglos/probe", imageDigest: `sha256:${"c".repeat(64)}`, run: async () => ({ stdout: "", stderr: "" }) });
    await assert.rejects(() => adapter.execute({ finding, projectRoot: root, timeoutMs: 1000, binding: binding() }), /digest/);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("Docker sandbox adapter rejects a declared isolation mismatch", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-docker-adapter-"));
  try {
    const adapter = new DockerSandboxAdapter({ image: "ghcr.io/verglos/probe", imageDigest, run: async () => ({ stdout: "", stderr: "" }) });
    const bound = binding();
    await assert.rejects(() => adapter.execute({ finding, projectRoot: root, timeoutMs: 1000, binding: { ...bound, isolation: "restricted-process" } }), /container isolation/);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("Docker sandbox adapter classifies a supported non-zero exit assertion as false", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-docker-adapter-"));
  try {
    const adapter = new DockerSandboxAdapter({ image: "ghcr.io/verglos/probe", imageDigest, run: async () => ({ stdout: "", stderr: "", exitCode: 7 }) });
    const result = await adapter.execute({ finding, projectRoot: root, timeoutMs: 1000, binding: binding() });
    assert.equal(result.verdict, "false");
    assert.equal(result.canonicalVerdict, "not-reproduced");
    assert.match(result.reason, /exit code 7/);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("Docker sandbox adapter classifies a bounded target-code harness result", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-docker-target-harness-"));
  try {
    const bound = binding();
    const targetBinding = { ...bound, command: ["node", "/workspace/.verglos/hunt/sql-nosql-injection.mjs"], assertions: [TARGET_HARNESS_ASSERTION] };
    const adapter = new DockerSandboxAdapter({ image: "docker.io/library/node", imageDigest, run: async () => ({ stdout: '{"verglos":"hunt-result","verdict":"confirmed","summary":"bounded local harness reproduced the approved condition"}', stderr: "", exitCode: 0 }) });
    const result = await adapter.execute({ finding, projectRoot: root, timeoutMs: 1000, binding: targetBinding });
    assert.equal(result.verdict, "true");
    assert.equal(result.canonicalVerdict, "confirmed");
    assert.match(result.reason, /bounded local harness/);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("Docker proof selects only the fixed target-harness negative fixture", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-docker-proof-control-"));
  try {
    const bound = binding();
    const targetBinding = { ...bound, command: ["node", "/workspace/.verglos/hunt/sql-nosql-injection.mjs"], assertions: [TARGET_HARNESS_ASSERTION] };
    let argv: readonly string[] = [];
    const adapter = new DockerSandboxAdapter({ image: "docker.io/library/node", imageDigest, fixtureCase: "negative", run: async (args) => { argv = args; return { stdout: '{"verglos":"hunt-result","verdict":"not-reproduced"}', stderr: "", exitCode: 0 }; } });
    const result = await adapter.execute({ finding, projectRoot: root, timeoutMs: 1000, binding: targetBinding });
    assert.equal(result.canonicalVerdict, "not-reproduced");
    assert.equal(argv.at(-1), "negative");
    const invalid = new DockerSandboxAdapter({ image: "docker.io/library/node", imageDigest, fixtureCase: "negative", run: async () => ({ stdout: "", stderr: "", exitCode: 0 }) });
    await assert.rejects(() => invalid.execute({ finding, projectRoot: root, timeoutMs: 1000, binding: bound }), /target harness command/);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("Docker sandbox adapter marks malformed target-code harness output unsupported", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-docker-target-harness-"));
  try {
    const bound = binding();
    const targetBinding = { ...bound, command: ["node", "/workspace/.verglos/hunt/sql-nosql-injection.mjs"], assertions: [TARGET_HARNESS_ASSERTION] };
    const adapter = new DockerSandboxAdapter({ image: "docker.io/library/node", imageDigest, run: async () => ({ stdout: "not-json", stderr: "", exitCode: 0 }) });
    const result = await adapter.execute({ finding, projectRoot: root, timeoutMs: 1000, binding: targetBinding });
    assert.equal(result.verdict, "not_attemptable");
    assert.equal(result.canonicalVerdict, "not-supported");
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("Docker sandbox adapter leaves unsupported assertion syntax not-attemptable", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-docker-adapter-"));
  try {
    const adapter = new DockerSandboxAdapter({ image: "ghcr.io/verglos/probe", imageDigest, run: async () => ({ stdout: "fixture", stderr: "" }) });
    const unsupported = HuntExecutionBindingSchema.parse({ ...binding(), assertions: ["stdout contains fixture"] });
    const result = await adapter.execute({ finding, projectRoot: root, timeoutMs: 1000, binding: unsupported });
    assert.equal(result.verdict, "not_attemptable");
    assert.equal(result.canonicalVerdict, "not-supported");
    assert.match(result.reason, /unsupported/);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("Docker sandbox adapter distinguishes timeout and environment failure canonically", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-docker-adapter-"));
  try {
    const timeoutAdapter = new DockerSandboxAdapter({ image: "ghcr.io/verglos/probe", imageDigest, run: async () => { const error = new Error("timeout") as Error & { killed?: boolean }; error.killed = true; throw error; } });
    const timedOut = await timeoutAdapter.execute({ finding, projectRoot: root, timeoutMs: 1000, binding: binding() });
    assert.equal(timedOut.canonicalVerdict, "inconclusive");
    const failedAdapter = new DockerSandboxAdapter({ image: "ghcr.io/verglos/probe", imageDigest, run: async () => { throw new Error("daemon unavailable"); } });
    const failed = await failedAdapter.execute({ finding, projectRoot: root, timeoutMs: 1000, binding: binding() });
    assert.equal(failed.canonicalVerdict, "environment-error");
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("Docker sandbox adapter classifies timeout and infrastructure failure for every A2 family", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-docker-a2-outcomes-"));
  try {
    const families = SUPPORTED_HUNT_RECIPE_CATALOG.filter((descriptor) => descriptor.adapter === "container");
    assert.equal(families.length, 10);
    for (const family of families) {
      const targetBinding = { ...binding(), command: [...family.command], assertions: [...family.assertions] };
      const timeoutAdapter = new DockerSandboxAdapter({
        image: "docker.io/library/node",
        imageDigest,
        run: async () => {
          const error = new Error(`${family.recipeId} timeout fixture`) as Error & { killed?: boolean };
          error.killed = true;
          throw error;
        },
      });
      const timedOut = await timeoutAdapter.execute({ finding, projectRoot: root, timeoutMs: 1000, binding: targetBinding });
      assert.equal(timedOut.canonicalVerdict, "inconclusive", `${family.recipeId} timeout classification`);
      assert.equal(timedOut.executionStatus, "timed-out", `${family.recipeId} timeout status`);
      assert.equal(timedOut.verdict, "not_attemptable", `${family.recipeId} timeout verdict`);

      const failedAdapter = new DockerSandboxAdapter({
        image: "docker.io/library/node",
        imageDigest,
        run: async () => { throw new Error(`${family.recipeId} daemon failure fixture`); },
      });
      const failed = await failedAdapter.execute({ finding, projectRoot: root, timeoutMs: 1000, binding: targetBinding });
      assert.equal(failed.canonicalVerdict, "environment-error", `${family.recipeId} failure classification`);
      assert.equal(failed.executionStatus, "failed", `${family.recipeId} failure status`);
      assert.equal(failed.verdict, "not_attemptable", `${family.recipeId} failure verdict`);
    }
  } finally { await rm(root, { recursive: true, force: true }); }
});
