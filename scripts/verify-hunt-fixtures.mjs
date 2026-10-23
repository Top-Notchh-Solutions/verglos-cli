import assert from "node:assert/strict";
import { canonicalizeJson, createApprovalReceipt, huntRecipeDigest, parseHuntRecipe } from "../packages/shared/dist/index.js";
import { createHuntTestTrustStore, HUNT_TEST_TRUST_KEY_ID } from "../packages/hunt/dist/hunt-trust-test-support.js";
import { RestrictedProcessAdapter, runHunt } from "../packages/hunt/dist/index.js";

const subjectId = `urn:verglos:subject:artifact:sha256:${"a".repeat(64)}`;
const observationId = "urn:uuid:723e4567-e89b-12d3-a456-426614174000";
const at = "2026-01-01T00:02:00Z";
const finding = {
  id: "hunt-fixture-critical-1",
  severity: "critical",
  title: "synthetic Hunt fixture",
  description: "bounded synthetic fixture",
  detector: "fixture",
  confidence: "certain",
  category: "fixture",
};
const report = {
  projectRoot: "/tmp/verglos-hunt-fixture-project",
  projectType: "node",
  scannedAt: at,
  durationMs: 1,
  findings: [finding],
};

function recipe(inputs, timeoutMs = 2_000) {
  return parseHuntRecipe({
    schemaId: "urn:verglos:schema:hunt-recipe",
    schemaVersion: "1.0.0",
    recipeId: "a1-utf8-contains",
    ruleId: "hunt.a1.utf8-contains",
    targetSubjectId: subjectId,
    imageDigest: { algorithm: "sha256", value: "b".repeat(64) },
    command: ["verglos-probe", "utf8-contains"],
    assertions: ["probe result is true"],
    fixtures: {
      positive: { fixtureId: "positive", expectedVerdict: "confirmed" },
      negative: { fixtureId: "negative", expectedVerdict: "not-reproduced" },
      timeout: { fixtureId: "timeout", expectedVerdict: "inconclusive" },
      infrastructureFailure: { fixtureId: "adapter-failure", expectedVerdict: "environment-error" },
      unsupported: { fixtureId: "unsupported", expectedVerdict: "not-supported" },
    },
    inputs,
    isolation: "restricted-process",
    limits: { timeoutMs, cpuMs: Math.max(1, timeoutMs - 1), memoryMb: 64, diskMb: 16, outputBytes: 1_024, processes: 1, maxNetworkRequests: 0 },
    cleanup: "always",
    network: { mode: "denied", destinations: [], reason: "A1 pure probe fixture" },
    redaction: "required",
    signature: { status: "verified", signer: HUNT_TEST_TRUST_KEY_ID },
  });
}

function approval() {
  return createApprovalReceipt({
    requestId: "823e4567-e89b-12d3-a456-426614174000",
    action: "execute",
    actor: "human",
    target: subjectId,
    files: [],
    network: [],
    policyEffect: "hunt",
    requestedAt: "2026-01-01T00:00:00Z",
    expiresAt: "2099-01-01T00:00:00Z",
  }, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
}

function execution(selected) {
  return {
    recipe: selected,
    trust: createHuntTestTrustStore(selected),
    approval: approval(),
    ruleId: selected.ruleId,
    subjectId,
    observationId,
    at,
  };
}

async function runCase(name, selected, expectedVerdict, expectedStatus, adapter = new RestrictedProcessAdapter(selected)) {
  const result = await runHunt(report, {
    adapter,
    sandbox: adapter.id,
    execution: execution(selected),
  });
  assert.equal(result.outcomes.length, 1, `${name}: expected one fixture outcome`);
  const outcome = result.outcomes[0];
  assert.equal(outcome?.canonicalVerdict, expectedVerdict, `${name}: unexpected canonical verdict`);
  if (expectedStatus !== undefined) assert.equal(outcome?.executionStatus, expectedStatus, `${name}: unexpected execution status`);
  assert.equal(outcome?.findingId, finding.id, `${name}: finding identity changed`);
  assert.doesNotMatch(canonicalizeJson(result), /fixture-marker|absent-marker|Fixture license text/u, `${name}: fixture input leaked`);
  if (name !== "adapter-failure") {
    assert.equal(outcome?.redacted, true, `${name}: output was not marked redacted`);
    assert.equal(outcome?.assurance?.class, "A1", `${name}: assurance class changed`);
    assert.equal(outcome?.assurance?.network, "denied", `${name}: network policy changed`);
    assert.equal(outcome?.assurance?.sourceAccess, "none", `${name}: source access changed`);
    assert.equal(outcome?.assurance?.securityBoundary, false, `${name}: A1 limitation was hidden`);
  }
  return {
    name,
    canonicalVerdict: outcome?.canonicalVerdict,
    executionStatus: outcome?.executionStatus,
    recipeDigest: huntRecipeDigest(selected),
    evidenceDigest: outcome?.evidenceDigest ?? null,
    redacted: outcome?.redacted === true,
    assurance: outcome?.assurance ?? null,
  };
}

const cases = [];
cases.push(await runCase(
  "positive",
  recipe({ needle: "fixture-marker", value: "bounded fixture-marker value" }),
  "confirmed",
  "completed",
));
cases.push(await runCase(
  "negative",
  recipe({ needle: "absent-marker", value: "bounded safe value" }),
  "not-reproduced",
  "completed",
));
cases.push(await runCase(
  "timeout",
  recipe({ needle: "fixture-marker", value: "bounded fixture-marker value" }, 1),
  "inconclusive",
  "timed-out",
));
cases.push(await runCase(
  "adapter-failure",
  recipe({ needle: "fixture-marker", value: "bounded fixture-marker value" }),
  "environment-error",
  undefined,
  {
    id: "fixture-failure",
    async prepare() {},
    async execute() { throw new Error("synthetic adapter failure"); },
    async cleanup() {},
  },
));

console.log(JSON.stringify({
  status: "ok",
  recipeId: "a1-utf8-contains",
  ruleId: "hunt.a1.utf8-contains",
  cases,
  limitations: ["A1 is a bounded worker harness, not an OS or security isolation boundary; Linux/Docker isolation is qualified separately."],
}, null, 2));
