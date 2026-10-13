import { readHuntJson, parseHuntReport } from "./hunt-execute.js";
import { loadHuntRuntime, type HuntRuntimeLoader } from "./hunt-runtime.js";
import type { HuntWorkerInput } from "./hunt-worker.js";

export interface HuntRetestInput extends HuntWorkerInput {
  readonly beforeSubjectId: string;
  readonly remediationPath: string;
  readonly remediationApprovalPath: string;
}

/** Re-run the same supported proof against an approved post-remediation subject. */
export async function executeHuntRetest(input: HuntRetestInput): Promise<number> {
  try {
    const [hypothesis, reportValue, recipe, trust, approval, remediation, remediationApproval] = await Promise.all([
      readHuntJson(input.hypothesisPath, "Hunt hypothesis"),
      readHuntJson(input.reportPath, "Hunt report"),
      readHuntJson(input.recipePath, "Hunt recipe"),
      readHuntJson(input.trustStorePath, "Hunt trust store"),
      readHuntJson(input.approvalPath, "Hunt approval"),
      readHuntJson(input.remediationPath, "Remediation proposal"),
      readHuntJson(input.remediationApprovalPath, "Remediation approval"),
    ]);
    const runtime = await loadHuntRuntime(input.runtimeLoader);
    const result = await runtime.runSupportedHuntRetest({
      hypothesis,
      report: parseHuntReport(reportValue),
      recipe,
      trust,
      approval,
      entitlement: "hunt.critical",
      observationId: input.observationId,
      beforeSubjectId: input.beforeSubjectId,
      remediation,
      remediationApproval,
    });
    if (input.json) console.log(JSON.stringify(result));
    else if (!input.quiet) {
      console.log(`Hunt retest: ${result.retest.status}`);
      console.log(`Finding: ${result.findingId}`);
      console.log(`Proof: ${result.proof.proof.status}`);
      console.log(`Remediation approval: ${result.remediation.approved ? "verified" : "not verified"}`);
      console.log(`Limitation: ${result.retest.limitation}`);
    }
    return result.retest.status === "cleared" ? 0 : result.retest.status === "still-reproduced" ? 1 : 3;
  } catch {
    if (input.json) console.log(JSON.stringify({ status: "denied", code: "HUNT_RETEST_DENIED", message: "retest was not authorized or its bounded input was invalid" }));
    else if (!input.quiet) console.error("Hunt retest was not authorized or its bounded input was invalid.");
    return 78;
  }
}
