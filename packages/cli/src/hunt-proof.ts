import { readHuntJson, parseHuntReport } from "./hunt-execute.js";
import { loadHuntRuntime, type HuntRuntimeLoader } from "./hunt-runtime.js";
import type { HuntWorkerInput } from "./hunt-worker.js";

/** Replay one supported Hunt hypothesis and run its bounded negative control. */
export async function executeHuntProof(input: HuntWorkerInput): Promise<number> {
  try {
    const [hypothesis, reportValue, recipe, trust, approval] = await Promise.all([
      readHuntJson(input.hypothesisPath, "Hunt hypothesis"),
      readHuntJson(input.reportPath, "Hunt report"),
      readHuntJson(input.recipePath, "Hunt recipe"),
      readHuntJson(input.trustStorePath, "Hunt trust store"),
      readHuntJson(input.approvalPath, "Hunt approval"),
    ]);
    const runtime = await loadHuntRuntime(input.runtimeLoader as HuntRuntimeLoader | undefined);
    const result = await runtime.runSupportedHuntProof({ hypothesis, report: parseHuntReport(reportValue), recipe, trust, approval, entitlement: "hunt.critical", observationId: input.observationId });
    if (input.json) console.log(JSON.stringify(result));
    else if (!input.quiet) {
      console.log(`Hunt proof: ${result.proof.status}`);
      console.log(`Finding: ${result.findingId}`);
      console.log(`Sandbox: ${result.sandbox}`);
      console.log(`Negative control: ${result.proof.negativeControl}`);
      console.log(`Execution: ${result.executes ? "started" : "not attempted"}`);
      console.log(`Limitation: ${result.proof.limitation}`);
    }
    return result.proof.status === "confirmed" ? 1 : result.proof.status === "not-reproduced" ? 0 : 3;
  } catch {
    if (input.json) console.log(JSON.stringify({ status: "denied", code: "HUNT_PROOF_DENIED", message: "proof execution was not authorized or its bounded input was invalid" }));
    else if (!input.quiet) console.error("Hunt proof execution was not authorized or its bounded input was invalid.");
    return 78;
  }
}
