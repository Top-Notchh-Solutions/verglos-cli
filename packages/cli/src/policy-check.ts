import { readFile } from "node:fs/promises";
import { explainPolicyEvaluation, parsePolicyEvaluationJson, policyDecisionExitCode } from "@verglos/shared";

export async function executePolicyCheck(path: string, json = false, quiet = false): Promise<number> {
  try {
    const bytes = await readFile(path); if (bytes.byteLength > 8 * 1024 * 1024) throw new Error("policy evaluation exceeds the 8 MiB limit");
    if (path.endsWith(".vgl") || path.includes("snapshot")) throw new Error("record and snapshot inputs are not supported by policy check");
    const evaluation = parsePolicyEvaluationJson(bytes);
    const explanation = explainPolicyEvaluation(evaluation);
    if (json) console.log(JSON.stringify(explanation));
    else if (!quiet) {
      console.log(`Decision: ${explanation.decision}`);
      console.log(`Subject: ${explanation.subjectId}`);
      console.log(`Policy: ${explanation.policy.id}@${explanation.policy.version} (${explanation.policy.digest})`);
      if (explanation.limitations.length) console.log(`Limitations: ${explanation.limitations.join("; ")}`);
      for (const reason of explanation.reasons) console.log(`- [${reason.code}] ${reason.detail} (${reason.owner}; next: ${reason.nextAction})`);
    }
    return policyDecisionExitCode(evaluation.decision);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to evaluate policy document.";
    if (json) console.log(JSON.stringify({ status: "error", code: "POLICY_CHECK_INPUT", message })); else console.error(`[POLICY_CHECK_INPUT] ${message}`);
    return 2;
  }
}
