import assert from "node:assert/strict";
import { mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { DockerTrivyAdapter, TRIVY_CAPABILITIES, TRIVY_IMAGE, trivyDockerArguments } from "./trivy-adapter.js";

const subjectId = `urn:verglos:subject:filesystem:sha256:${"a".repeat(64)}`;
const trivyOutput = JSON.stringify({ Results: [{ Target: "main.tf", Misconfigurations: [{ ID: "AWS-0086", Title: "S3 public ACL", Severity: "HIGH", CauseMetadata: { StartLine: 3, Code: { Lines: [{ Content: "private source excerpt" }] } } }], Secrets: [{ RuleID: "generic-api-key", Title: "Generic API Key", Severity: "HIGH", StartLine: 8, Match: "fixture-secret-value" }] }] });

function mockDocker(runOutput = trivyOutput, stderr = "") {
  const calls: Array<{ args: readonly string[]; timeout: number; maxBuffer: number }> = [];
  const adapter = new DockerTrivyAdapter({
    now: () => new Date("2026-09-13T10:00:00.000Z"),
    run: async (_executable, args, options) => {
      calls.push({ args, timeout: options.timeout, maxBuffer: options.maxBuffer });
      if (args[0] === "image") return { stdout: JSON.stringify([TRIVY_IMAGE]) };
      if (args.includes("--version")) return { stdout: "Version: 0.74.0\n" };
      return { stdout: runOutput, stderr };
    },
  });
  return { adapter, calls };
}

test("Docker Trivy arguments pin the image and enforce offline, read-only, bounded execution", () => {
  const args = trivyDockerArguments("/workspace fixture", "/tmp/container-id");
  assert.equal(args.includes(TRIVY_IMAGE), true);
  assert.equal(args.includes("--pull=never"), true);
  assert.equal(args.includes("none"), true);
  assert.equal(args.includes("--read-only"), true);
  assert.equal(args.includes("ALL"), true);
  assert.equal(args.includes("no-new-privileges"), true);
  assert.equal(args.includes("128"), true);
  assert.equal(args.includes("1g"), true);
  assert.equal(args.includes("2"), true);
  assert.equal(args.some((arg) => arg.includes("source=/workspace fixture")), true);
  assert.throws(() => trivyDockerArguments("/workspace,unsafe", "/tmp/cid"), /absolute directory/u);
});

test("Docker Trivy health requires the exact pinned image and reports it as computed-only", async () => {
  const { adapter, calls } = mockDocker();
  const health = await adapter.health();
  assert.equal(health.state, "healthy");
  assert.equal(health.producer.version, "0.74.0");
  assert.equal(health.components[0]?.trust, "computed-only");
  assert.deepEqual(health.capabilities.map((item) => item.id), TRIVY_CAPABILITIES);
  assert.equal(calls.length, 2);
  assert.equal(calls[0]?.args.includes(TRIVY_IMAGE), true);
  assert.equal(calls[1]?.args.includes("--network"), true);
  assert.equal(calls[1]?.args.includes("none"), true);
});

test("Docker Trivy execution binds observations and returns explicit incomplete offline coverage", async () => {
  const { adapter, calls } = mockDocker();
  await adapter.health();
  const root = await mkdtemp(join(tmpdir(), "verglos-trivy-adapter-"));
  try {
    const result = await adapter.execute({ targetSubjectId: subjectId, targetPath: root, capabilities: [...TRIVY_CAPABILITIES], timeoutMs: 30_000, network: "denied" });
    assert.equal(result.run.subjectId, subjectId);
    assert.equal(result.run.executionClass, "container");
    assert.equal(result.run.networkAccess, "none");
    assert.equal(result.run.targetCodeExecuted, false);
    assert.deepEqual(result.run.executedCapabilities, TRIVY_CAPABILITIES);
    assert.equal(result.run.coverage, "incomplete");
    assert.equal(result.run.incompleteReasons.some((reason) => reason.code === "offline-data-missing"), true);
    assert.deepEqual(result.observations.map((entry) => entry.category), ["configuration.misconfiguration", "security.secret"]);
    assert.equal(result.observations.every((entry) => entry.subjectId === subjectId && entry.origin.runId === result.run.runId), true);
    assert.equal(JSON.stringify(result.observations).includes("fixture-secret-value"), false);
    assert.equal(JSON.stringify(result.observations).includes("private source excerpt"), false);
    assert.equal(result.rawOutput?.redacted, false);
    assert.equal(result.rawOutput?.digest.startsWith("sha256:"), true);
    assert.equal(calls.length, 3);
    const execution = calls[2]!;
    assert.equal(execution.timeout, 30_000);
    assert.equal(execution.args.includes("--network"), true);
    assert.equal(execution.args.includes("none"), true);
    assert.equal(execution.args.includes("--pull=never"), true);
    assert.equal(execution.args.includes("--mount"), true);
    assert.equal(execution.args.some((arg) => arg.includes("target=/workspace,readonly")), true);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("Docker Trivy refuses symlink targets and network-enabled requests", async () => {
  const { adapter } = mockDocker();
  await adapter.health();
  const root = await mkdtemp(join(tmpdir(), "verglos-trivy-symlink-"));
  const link = `${root}-link`;
  try {
    await symlink(root, link, "dir");
    await assert.rejects(() => adapter.execute({ targetSubjectId: subjectId, targetPath: link, capabilities: [...TRIVY_CAPABILITIES], timeoutMs: 30_000, network: "denied" }), /regular directory/u);
    await assert.rejects(() => adapter.execute({ targetSubjectId: subjectId, targetPath: root, capabilities: [...TRIVY_CAPABILITIES], timeoutMs: 30_000, network: "allowlisted", allowlist: ["https://example.test"] }), /denied network/u);
  } finally {
    await rm(link, { force: true });
    await rm(root, { recursive: true, force: true });
  }
});

test("Docker Trivy omits diagnostic content and marks result coverage incomplete", async () => {
  const { adapter } = mockDocker(trivyOutput, "permission denied: /private/source.tf fixture-secret-value");
  await adapter.health();
  const root = await mkdtemp(join(tmpdir(), "verglos-trivy-diagnostics-"));
  try {
    const result = await adapter.execute({ targetSubjectId: subjectId, targetPath: root, capabilities: [...TRIVY_CAPABILITIES], timeoutMs: 30_000, network: "denied" });
    assert.equal(result.run.coverage, "incomplete");
    assert.equal(result.run.incompleteReasons.some((reason) => reason.code === "partial-output" && reason.scope === "trivy.diagnostics"), true);
    assert.equal(JSON.stringify(result).includes("permission denied"), false);
    assert.equal(JSON.stringify(result).includes("fixture-secret-value"), false);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("Docker Trivy removes its container after process failure", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-trivy-cleanup-"));
  const calls: string[][] = [];
  const adapter = new DockerTrivyAdapter({
    run: async (_executable, args) => {
      calls.push([...args]);
      if (args[0] === "image") return { stdout: JSON.stringify([TRIVY_IMAGE]) };
      if (args.includes("--version")) return { stdout: "Version: 0.74.0" };
      if (args[0] === "run") {
        const cidFile = args[args.indexOf("--cidfile") + 1]!;
        await writeFile(cidFile, `${"a".repeat(64)}\n`);
        throw new Error("simulated execution failure");
      }
      return { stdout: "" };
    },
  });
  try {
    await adapter.health();
    await assert.rejects(() => adapter.execute({ targetSubjectId: subjectId, targetPath: root, capabilities: [...TRIVY_CAPABILITIES], timeoutMs: 30_000, network: "denied" }));
    assert.equal(calls.some((args) => args[0] === "rm" && args[1] === "--force" && args[2] === "a".repeat(64)), true);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("Docker Trivy fails closed when the exact image digest is unavailable", async () => {
  const adapter = new DockerTrivyAdapter({ run: async (_executable, args) => args[0] === "image" ? { stdout: "[]" } : { stdout: "Version: 0.74.0" } });
  const health = await adapter.health();
  assert.equal(health.state, "unavailable");
  assert.equal(health.capabilities.every((item) => item.status === "unsupported"), true);
  assert.equal(health.incompleteReasons[0]?.code, "engine-missing");
});
