import type { PolicyDocument } from "./policy-document.js";
import type { PolicyEvaluationInput } from "./policy-evaluation.js";

export function assertPolicyCheckCoverage(policy: PolicyDocument, checks: readonly PolicyEvaluationInput["checks"][number][]): void {
  const configured = new Set(policy.checks.map((check) => check.id)); const supplied = new Set(checks.map((check) => check.id));
  const missing = [...configured].filter((id) => !supplied.has(id));
  if (missing.length) throw new Error(`Policy evaluation is missing configured checks: ${missing.sort().join(", ")}`);
}
