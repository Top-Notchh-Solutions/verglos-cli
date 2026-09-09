import { parsePolicyEvaluation, type PolicyEvaluationDocument } from "./policy-evaluation.js";

export interface PolicyExplanation {
  readonly decision: PolicyEvaluationDocument["decision"];
  readonly subjectId: string;
  readonly policy: { readonly id: string; readonly version: string; readonly digest: string };
  readonly limitations: readonly string[];
  readonly reasons: readonly { readonly detail: string; readonly owner: string; readonly nextAction: string; readonly checkId?: string }[];
}

export function explainPolicyEvaluation(value: PolicyEvaluationDocument): PolicyExplanation {
  const evaluation = parsePolicyEvaluation(value);
  return {
    decision: evaluation.decision,
    subjectId: evaluation.subjectId,
    policy: { id: evaluation.policy.id, version: evaluation.policy.version, digest: `${evaluation.policy.digest.algorithm}:${evaluation.policy.digest.value}` },
    limitations: Object.freeze([...evaluation.limitations]),
    reasons: Object.freeze(evaluation.reasons.map((reason) => ({ detail: reason.detail, owner: reason.owner, nextAction: reason.nextAction, ...(reason.checkId ? { checkId: reason.checkId } : {}) }))),
  };
}
