import assert from "node:assert/strict";
import { test } from "node:test";
import { bindHuntExecution, createApprovalReceipt, parseHuntRecipe, type HuntRecipe } from "@verglos/shared";
import { RestrictedProcessAdapter } from "./restricted-process-adapter.js";
import { createHuntTestTrustStore, HUNT_TEST_TRUST_KEY_ID } from "./hunt-trust-test-support.js";

const subjectId = `urn:verglos:subject:artifact:sha256:${"a".repeat(64)}`;
const finding = { id: "critical-1", severity: "critical", title: "critical", description: "fixture", detector: "deep-auth", confidence: "certain", category: "auth" } as never;

function recipe(inputs: Readonly<Record<string, string>> = { value: "synthetic-safe-value", needle: "safe" }): HuntRecipe {
  return parseHuntRecipe({
    schemaId: "urn:verglos:schema:hunt-recipe",
    schemaVersion: "1.0.0",
    recipeId: "a1-utf8-contains",
    ruleId: "d1-1",
    targetSubjectId: subjectId,
    imageDigest: { algorithm: "sha256", value: "b".repeat(64) },
    command: ["verglos-probe", "utf8-contains"],
    assertions: ["probe result is true"],
    inputs,
    isolation: "restricted-process",
    limits: { timeoutMs: 2_000, cpuMs: 1_500, memoryMb: 64, diskMb: 1, outputBytes: 128, processes: 1, maxNetworkRequests: 0 },
    cleanup: "always",
    network: { mode: "denied", destinations: [], reason: "A1 built-in pure probe" },
    redaction: "required",
    signature: { status: "verified", signer: HUNT_TEST_TRUST_KEY_ID },
  });
}

function binding(selected: HuntRecipe) {
  const approval = createApprovalReceipt({ requestId: "723e4567-e89b-12d3-a456-426614174000", action: "execute", actor: "human", target: subjectId, files: [], network: [], policyEffect: "hunt", requestedAt: "2026-01-01T00:00:00Z", expiresAt: "2026-01-01T01:00:00Z" }, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
  return bindHuntExecution({ recipe: selected, trust: createHuntTestTrustStore(selected), approval, ruleId: selected.ruleId, subjectId, observationId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", at: "2026-01-01T00:02:00Z" });
}

test("A1 adapter runs only the fixed built-in pure probe and labels its non-isolation boundary", async () => {
  const selected = recipe();
  const result = await new RestrictedProcessAdapter(selected).execute({ finding, projectRoot: "/not-read", timeoutMs: 2_000, binding: binding(selected) });
  assert.equal(result.verdict, "true");
  assert.equal(result.canonicalVerdict, "confirmed");
  assert.equal(result.executionStatus, "completed");
  assert.match(result.evidenceDigest ?? "", /^sha256:[a-f0-9]{64}$/u);
  assert.deepEqual(result.assurance, {
    class: "A1",
    isolation: "restricted-process",
    securityBoundary: false,
    sourceAccess: "none",
    network: "denied",
    processLimit: 1,
    limitation: "A1 runs a trusted built-in pure probe in a bounded worker harness; it is not a security or OS isolation boundary",
  });
});

test("A1 adapter returns not-reproduced without exposing synthetic input", async () => {
  const selected = recipe({ value: "sensitive-synthetic-canary", needle: "absent" });
  const result = await new RestrictedProcessAdapter(selected).execute({ finding, projectRoot: "/not-read", timeoutMs: 2_000, binding: binding(selected) });
  assert.equal(result.verdict, "false");
  assert.equal(result.canonicalVerdict, "not-reproduced");
  assert.doesNotMatch(JSON.stringify(result), /sensitive-synthetic-canary/u);
});

test("A1 adapter rejects arbitrary command, network, process, and binding drift", async () => {
  assert.throws(() => new RestrictedProcessAdapter(parseHuntRecipe({ ...recipe(), command: ["node", "model-output.js"] })), /built-in pure probe/);
  assert.throws(() => new RestrictedProcessAdapter(parseHuntRecipe({ ...recipe(), limits: { ...recipe().limits, processes: 2 } })), /one-worker/);
  assert.throws(() => new RestrictedProcessAdapter(parseHuntRecipe({ ...recipe(), cleanup: "on-success" })), /unconditional cleanup/);
  const selected = recipe();
  const adapter = new RestrictedProcessAdapter(selected);
  await assert.rejects(() => adapter.execute({ finding, projectRoot: "/not-read", timeoutMs: 2_000, binding: { ...binding(selected), command: ["node", "other.js"] } }), /built-in probe/);
});
