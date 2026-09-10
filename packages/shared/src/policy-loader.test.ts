import assert from "node:assert/strict";
import { test } from "node:test";
import { resolveEffectivePolicy } from "./policy-loader.js";
import { parsePolicyDocument, type PolicyDocument } from "./policy-document.js";

const check = (id: string): PolicyDocument["checks"][number] => ({ id, requirement: "required", onFailure: "BLOCK", severities: ["critical"], minimumConfidence: 0.8, freshness: "current", coverage: "complete", artifactMatch: "required", hunt: "not-required" });
const defaults = parsePolicyDocument({ schemaId: "urn:verglos:schema:policy-document", schemaVersion: "1.0.0", policyId: "policy-free", policyVersion: "1.0.0", checks: [check("critical")], exceptions: { enabled: false, requireApproval: false }, approvals: { required: false, authorities: [] } });

test("policy layers merge by precedence and emit an effective digest", () => {
  const result = resolveEffectivePolicy({ defaults, config: { checks: [{ ...check("critical"), minimumConfidence: 0.9 }, check("secrets")] } });
  assert.deepEqual(result.policy.checks.map((item) => item.id), ["critical", "secrets"]);
  assert.equal(result.policy.checks[0]?.minimumConfidence, 0.9);
  assert.deepEqual(result.sourceOrder, ["defaults", "config"]);
  assert.match(result.digest, /^sha256:[a-f0-9]{64}$/);
  assert.throws(() => resolveEffectivePolicy({ defaults, cli: { unsafe: true } as never }));
});
