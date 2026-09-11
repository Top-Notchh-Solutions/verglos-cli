import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { bindHuntExecution, createApprovalReceipt, parseHuntRecipe } from "@verglos/shared";
import { DockerSandboxAdapter } from "./docker-sandbox-adapter.js";

const subjectId = `urn:verglos:subject:artifact:sha256:${"a".repeat(64)}`;
const imageDigest = `sha256:${"b".repeat(64)}`;
const finding = { id: "critical-1", severity: "critical", title: "critical", description: "x", detector: "deep-auth", confidence: "certain", category: "auth" } as never;

function binding() {
  const recipe = parseHuntRecipe({ schemaId: "urn:verglos:schema:hunt-recipe", schemaVersion: "1.0.0", recipeId: "docker-adapter", ruleId: "d1-1", targetSubjectId: subjectId, imageDigest: { algorithm: "sha256", value: "b".repeat(64) }, command: ["/probe"], assertions: ["exit code is 0"], isolation: "container", limits: { timeoutMs: 1000, memoryMb: 256, outputBytes: 10000 }, cleanup: "always", network: { mode: "denied", destinations: [], reason: "fixture" }, redaction: "required", signature: { status: "verified", signer: "verglos-release" } });
  const approval = createApprovalReceipt({ requestId: "623e4567-e89b-12d3-a456-426614174000", action: "execute", actor: "human", target: subjectId, files: [], network: [], policyEffect: "hunt", requestedAt: "2026-01-01T00:00:00Z", expiresAt: "2099-01-01T00:00:00Z" }, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
  return bindHuntExecution({ recipe, trust: { signers: ["verglos-release"] }, approval, ruleId: "d1-1", subjectId, observationId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", at: "2026-01-01T00:02:00Z" });
}

test("Docker sandbox adapter uses the bound digest and returns honest status", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-docker-adapter-"));
  try {
    let argv: readonly string[] = [];
    const adapter = new DockerSandboxAdapter({ image: "ghcr.io/verglos/probe", imageDigest, run: async (args) => { argv = args; return { stdout: "fixture", stderr: "" }; } });
    const result = await adapter.execute({ finding, projectRoot: root, timeoutMs: 1000, binding: binding() });
    assert.equal(result.verdict, "not_attemptable");
    assert.match(result.reason, /assertion evaluation/);
    assert.match(result.evidenceDigest ?? "", /^sha256:/);
    assert.equal(result.redacted, true);
    assert.equal(result.executionStatus, "completed");
    assert.ok(argv.includes("--network"));
    assert.ok(argv.includes("none"));
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
