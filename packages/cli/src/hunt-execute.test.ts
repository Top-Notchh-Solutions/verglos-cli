import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { canonicalizeJson, createApprovalReceipt, parseHuntRecipe, type HuntRecipe } from "@verglos/shared";
import { createTestHuntTrustStore, TEST_HUNT_TRUST_KEY_ID } from "../../shared/src/hunt-trust-test-support.js";
import { executeHuntRecipe } from "./hunt-execute.js";
import type { HuntRuntimeLoader } from "./hunt-runtime.js";

const subjectId = `urn:verglos:subject:repository-tree:sha256:${"a".repeat(64)}`;
const localHuntRuntime: HuntRuntimeLoader = () => import("../../hunt/dist/index.js");

function recipe(inputs: Readonly<Record<string, string>> = { needle: "unsafe", value: "fixture contains unsafe" }): HuntRecipe {
  return parseHuntRecipe({
    schemaId: "urn:verglos:schema:hunt-recipe",
    schemaVersion: "1.0.0",
    recipeId: "a1-utf8-contains",
    ruleId: "hunt.a1.utf8-contains",
    targetSubjectId: subjectId,
    imageDigest: { algorithm: "sha256", value: "b".repeat(64) },
    command: ["verglos-probe", "utf8-contains"],
    assertions: ["probe result is true"],
    inputs,
    isolation: "restricted-process",
    limits: { timeoutMs: 2_000, cpuMs: 1_500, memoryMb: 64, diskMb: 16, outputBytes: 1_024, processes: 1, maxNetworkRequests: 0 },
    cleanup: "always",
    network: { mode: "denied", destinations: [], reason: "A1 pure probe" },
    redaction: "required",
    signature: { status: "verified", signer: TEST_HUNT_TRUST_KEY_ID },
  });
}

async function makeInputs(root: string, selected = recipe()): Promise<{ reportPath: string; recipePath: string; trustStorePath: string; approvalPath: string }> {
  const reportPath = join(root, "report.json");
  const recipePath = join(root, "recipe.json");
  const trustStorePath = join(root, "trust-store.json");
  const approvalPath = join(root, "approval.json");
  const at = new Date().toISOString();
  const approval = createApprovalReceipt({ requestId: "523e4567-e89b-12d3-a456-426614174000", action: "execute", actor: "human", target: subjectId, files: [], network: [], policyEffect: "hunt", requestedAt: "2026-01-01T00:00:00Z", expiresAt: "2099-01-01T00:00:00Z" }, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
  await writeFile(reportPath, `${canonicalizeJson({ projectRoot: root, projectType: "node", scannedAt: at, durationMs: 1, findings: [{ id: "critical-1", severity: "critical", title: "fixture", description: "fixture" }] })}\n`);
  await writeFile(recipePath, `${canonicalizeJson(selected)}\n`);
  await writeFile(trustStorePath, `${canonicalizeJson(createTestHuntTrustStore(selected, { at }))}\n`);
  await writeFile(approvalPath, `${canonicalizeJson(approval)}\n`);
  return { reportPath, recipePath, trustStorePath, approvalPath };
}

async function run(root: string, options: Partial<Parameters<typeof executeHuntRecipe>[0]> = {}): Promise<{ code: number; output: Record<string, unknown> }> {
  const inputs = await makeInputs(root);
  const logs: string[] = [];
  const originalLog = console.log;
  console.log = (...values: unknown[]) => logs.push(values.join(" "));
  try {
    const code = await executeHuntRecipe({ ...inputs, ruleId: "hunt.a1.utf8-contains", subjectId, observationId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", json: true, runtimeLoader: localHuntRuntime, ...options });
    return { code, output: JSON.parse(logs[0] ?? "{}") as Record<string, unknown> };
  } finally {
    console.log = originalLog;
  }
}

test("HUNT-009 executes the fixed A1 recipe with exact trust and approval bindings", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-hunt-execute-"));
  try {
    const result = await run(root);
    assert.equal(result.code, 1);
    assert.equal(result.output.status, "completed");
    assert.equal(result.output.executionAuthorized, true);
    assert.equal(result.output.recipeId, "a1-utf8-contains");
    const recipeTrust = result.output.recipeTrust as Record<string, unknown>;
    assert.equal(recipeTrust.verified, true);
    assert.equal(recipeTrust.legalClearance, false);
    assert.match(String(recipeTrust.feedDigest), /^sha256:[a-f0-9]{64}$/u);
    const license = recipeTrust.license as Record<string, unknown>;
    assert.match(String((license.textDigest as Record<string, unknown>).value), /^[a-f0-9]{64}$/u);
    assert.doesNotMatch(JSON.stringify(result.output), /licenseText|Fixture license text/u);
    assert.deepEqual((result.output.outcomes as Array<Record<string, unknown>>).map((outcome) => outcome.canonicalVerdict), ["confirmed"]);
    assert.doesNotMatch(JSON.stringify(result.output), /unsafe|fixture contains/u);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("HUNT-009 preserves a negative probe as not-reproduced without leaking input", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-hunt-execute-negative-"));
  try {
    const inputs = await makeInputs(root, recipe({ needle: "absent", value: "sensitive-synthetic-canary" }));
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...values: unknown[]) => logs.push(values.join(" "));
    try {
      const code = await executeHuntRecipe({ ...inputs, ruleId: "hunt.a1.utf8-contains", subjectId, observationId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", json: true, runtimeLoader: localHuntRuntime });
      assert.equal(code, 0);
    } finally { console.log = originalLog; }
    assert.equal(JSON.parse(logs[0] ?? "{}").outcomes[0].canonicalVerdict, "not-reproduced");
    assert.doesNotMatch(logs.join("\n"), /sensitive-synthetic-canary/u);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("HUNT-009 fails closed for binding drift and symlinked inputs", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-hunt-execute-denied-"));
  try {
    const drift = await run(root, { ruleId: "hunt.other-rule", runtimeLoader: localHuntRuntime });
    assert.equal(drift.code, 78);
    assert.deepEqual(drift.output, { status: "denied", reason: "hunt execution input or authorization is invalid" });

    const inputs = await makeInputs(root);
    const link = join(root, "report-link.json");
    await symlink(inputs.reportPath, link);
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...values: unknown[]) => logs.push(values.join(" "));
    try {
      const code = await executeHuntRecipe({ ...inputs, reportPath: link, ruleId: "hunt.a1.utf8-contains", subjectId, observationId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", json: true, runtimeLoader: localHuntRuntime });
      assert.equal(code, 78);
    } finally { console.log = originalLog; }
    assert.deepEqual(JSON.parse(logs[0] ?? "{}"), { status: "denied", reason: "hunt execution input or authorization is invalid" });
    assert.equal((await readFile(inputs.reportPath, "utf8")).includes("fixture"), true);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("HUNT-009 denies execution when the private runtime is unavailable", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-hunt-runtime-missing-"));
  try {
    const result = await run(root, { runtimeLoader: async () => { throw new Error("private runtime absent"); } });
    assert.equal(result.code, 78);
    assert.deepEqual(result.output, { status: "denied", reason: "hunt execution input or authorization is invalid" });
  } finally { await rm(root, { recursive: true, force: true }); }
});
