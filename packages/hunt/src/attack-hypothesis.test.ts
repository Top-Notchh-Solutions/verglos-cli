import assert from "node:assert/strict";
import { test } from "node:test";
import type { HuntTargetManifest } from "@verglos/shared";
import { SUPPORTED_HUNT_RECIPE_CATALOG } from "./supported-recipe-catalog.js";
import { planSupportedHuntAttack } from "./attack-hypothesis.js";

const subjectId = `urn:verglos:subject:repository-tree:sha256:${"c".repeat(64)}`;
const manifest: HuntTargetManifest = {
  schemaId: "urn:verglos:schema:hunt-target-manifest",
  schemaVersion: "1.0.0",
  targetSubjectId: subjectId,
  frameworks: ["express"],
  entrypoints: [{ path: "app.js", kind: "source" }],
  routes: [{ method: "POST", path: "/run", file: "app.js" }],
  apis: [{ method: "POST", path: "/run", file: "app.js" }],
  dependencyBoundaries: ["express", "@modelcontextprotocol/sdk"],
  agentMcpTools: ["read"],
  candidateSinks: [
    { kind: "command-execution", path: "app.js", line: 3, confidence: "candidate" },
    { kind: "network-request", path: "app.js", line: 4, confidence: "candidate" },
    { kind: "file-boundary", path: "app.js", line: 5, confidence: "candidate" },
    { kind: "xss", path: "app.js", line: 6, confidence: "candidate" },
    { kind: "dynamic-code", path: "app.js", line: 7, confidence: "candidate" },
  ],
  coverage: { status: "complete", filesInspected: 2, bytesInspected: 300, limitations: [] },
};

test("public Hunt catalog produces an execution-free hypothesis for a mapped target", () => {
  const hypothesis = planSupportedHuntAttack({ manifest, finding: { id: "finding-1", ruleId: "D1-003", severity: "high" } });
  assert.equal(hypothesis.status, "supported");
  assert.equal(hypothesis.playbook?.recipeId, "a2-command-injection-harness");
  assert.equal(hypothesis.playbook?.registry, "public-bounded-catalog");
  assert.equal(hypothesis.executes, false);
  assert.equal(hypothesis.authority.recipeTrust, "required");
});

test("every public catalog rule has a deterministic descriptor", () => {
  assert.equal(SUPPORTED_HUNT_RECIPE_CATALOG.length, 18);
  for (const descriptor of SUPPORTED_HUNT_RECIPE_CATALOG) {
    const hypothesis = planSupportedHuntAttack({ manifest, finding: { id: `finding-${descriptor.ruleId}`, ruleId: descriptor.ruleId } });
    assert.equal(hypothesis.playbook?.recipeId, descriptor.recipeId);
    assert.equal(hypothesis.executes, false);
  }
});
