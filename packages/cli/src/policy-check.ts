import { readFile } from "node:fs/promises";
import { explainPolicyEvaluation, parsePolicyEvaluationJson, policyDecisionExitCode } from "@verglos/shared";

export async function executePolicyCheck(path: string, json = false, quiet = false): Promise<number> {
  try {
    const evaluation = parsePolicyEvaluationJson(await readFile(path));
    const explanation = explainPolicyEvaluation(evaluation);
    if (json) console.log(JSON.stringify(explanation));
    else if (!quiet) {
      console.log(`Decision: ${explanation.decision}`);
      console.log(`Subject: ${explanation.subjectId}`);
      console.log(`Policy: ${explanation.policy.id}@${explanation.policy.version} (${explanation.policy.digest})`);
      if (explanation.limitations.length) console.log(`Limitations: ${explanation.limitations.join("; ")}`);
      for (const reason of explanation.reasons) console.log(`- ${reason.detail} (${reason.owner}; next: ${reason.nextAction})`);
    }
    return policyDecisionExitCode(evaluation.decision);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to evaluate policy document.";
    if (json) console.log(JSON.stringify({ status: "error", message })); else console.error(message);
    return 2;
  }
}
