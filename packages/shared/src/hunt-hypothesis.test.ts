import assert from "node:assert/strict";
import { test } from "node:test";
import { validateContractFixture } from "./fixture-validator.js";
import { parseHuntAttackHypothesis, planHuntAttackHypothesis, type HuntPlaybookDescriptor } from "./hunt-hypothesis.js";
import type { HuntTargetManifest } from "./hunt-target-manifest.js";

const subjectId = `urn:verglos:subject:repository-tree:sha256:${"a".repeat(64)}`;

const playbook: HuntPlaybookDescriptor = {
  recipeId: "a2-command-injection-harness",
  ruleId: "D1-003",
  adapter: "container",
  command: ["node", "/workspace/.verglos/hunt/command-injection.mjs"],
  assertions: ["target harness returned a canonical outcome"],
  requiredInputs: [],
  fixtures: [
    { name: "positive", expected: "confirmed" },
    { name: "negative", expected: "not-reproduced" },
    { name: "timeout", expected: "inconclusive" },
    { name: "adapter-failure", expected: "environment-error" },
  ],
  imageDigest: `sha256:${"b".repeat(64)}`,
};

function manifest(overrides: Partial<HuntTargetManifest> = {}): HuntTargetManifest {
  return {
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
    ...overrides,
  };
}

test("attack hypothesis binds an exact finding to a registered context-supported playbook without execution", () => {
  const hypothesis = planHuntAttackHypothesis({ manifest: manifest(), finding: { id: "finding-command", ruleId: "D1-003", location: "app.js", line: 4, severity: "high" }, playbooks: [playbook] });
  assert.equal(hypothesis.status, "supported");
  assert.equal(hypothesis.targetSubjectId, subjectId);
  assert.equal(hypothesis.playbook?.recipeId, playbook.recipeId);
  assert.deepEqual(hypothesis.targetContext.references.filter((reference) => reference.kind === "sink").map((reference) => reference.value), ["command-execution"]);
  assert.equal(hypothesis.executes, false);
  assert.equal(hypothesis.authority.entitlement, "not-evaluated");
  assert.equal(hypothesis.sequence.every((step) => step.status === "not-run"), true);
  assert.match(hypothesis.hypothesisDigest.value, /^[a-f0-9]{64}$/u);
  assert.equal(validateContractFixture(hypothesis).valid, true);
  assert.equal(JSON.stringify(hypothesis).includes("/private/customer"), false);
});

test("hypothesis fails closed for missing playbooks, incomplete coverage, and unmatched target context", () => {
  const unknown = planHuntAttackHypothesis({ manifest: manifest(), finding: { id: "unknown", ruleId: "D1-999" }, playbooks: [playbook] });
  assert.deepEqual({ status: unknown.status, playbook: unknown.playbook }, { status: "unsupported", playbook: undefined });

  const incomplete = planHuntAttackHypothesis({ manifest: manifest({ coverage: { status: "incomplete", filesInspected: 1, bytesInspected: 1, limitations: ["bounded fixture coverage"] } }), finding: { id: "finding-command", ruleId: "D1-003" }, playbooks: [playbook] });
  assert.equal(incomplete.status, "not_attemptable");
  assert.match(incomplete.reason, /incomplete/);

  const noSink = planHuntAttackHypothesis({ manifest: manifest({ routes: [], apis: [], candidateSinks: [] }), finding: { id: "finding-command", ruleId: "D1-003" }, playbooks: [playbook] });
  assert.equal(noSink.status, "not_attemptable");
  assert.match(noSink.reason, /no matching static capability/);
});

test("hypothesis digest is deterministic and registry commands are not caller-controlled", () => {
  const first = planHuntAttackHypothesis({ manifest: manifest(), finding: { id: "finding-command", ruleId: "D1-003" }, playbooks: [playbook] });
  const second = planHuntAttackHypothesis({ manifest: manifest(), finding: { id: "finding-command", ruleId: "D1-003" }, playbooks: [{ ...playbook, command: [...playbook.command] }] });
  assert.equal(first.hypothesisDigest.value, second.hypothesisDigest.value);
  assert.deepEqual(first.playbook?.command, playbook.command);
  assert.throws(() => planHuntAttackHypothesis({ manifest: manifest(), finding: { id: "finding-command", ruleId: "D1-003" }, playbooks: [{ ...playbook, command: ["node\u0000evil"] }] }), /command contains control characters/);
});

test("hypothesis parser rejects canonical-content tampering", () => {
  const hypothesis = planHuntAttackHypothesis({ manifest: manifest(), finding: { id: "finding-command", ruleId: "D1-003" }, playbooks: [playbook] });
  assert.throws(() => parseHuntAttackHypothesis({ ...hypothesis, reason: "tampered" }), /digest does not match/);
});
