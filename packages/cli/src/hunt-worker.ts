import { readHuntJson, parseHuntReport } from "./hunt-execute.js";
import { loadHuntRuntime, type HuntRuntimeLoader } from "./hunt-runtime.js";

export interface HuntWorkerInput {
  readonly hypothesisPath: string;
  readonly reportPath: string;
  readonly recipePath: string;
  readonly trustStorePath: string;
  readonly approvalPath: string;
  readonly observationId: string;
  readonly json?: boolean;
  readonly quiet?: boolean;
  readonly runtimeLoader?: HuntRuntimeLoader;
}

/** Execute one supported hypothesis only after all signed/bounded gates pass. */
export async function executeHuntWorker(input: HuntWorkerInput): Promise<number> {
  try {
    const [hypothesis, reportValue, recipe, trust, approval] = await Promise.all([
      readHuntJson(input.hypothesisPath, "Hunt hypothesis"),
      readHuntJson(input.reportPath, "Hunt report"),
      readHuntJson(input.recipePath, "Hunt recipe"),
      readHuntJson(input.trustStorePath, "Hunt trust store"),
      readHuntJson(input.approvalPath, "Hunt approval"),
    ]);
    const runtime = await loadHuntRuntime(input.runtimeLoader);
    const result = await runtime.runSupportedHuntAttack({ hypothesis, report: parseHuntReport(reportValue), recipe, trust, approval, entitlement: "hunt.critical", observationId: input.observationId });
    if (input.json) console.log(JSON.stringify(result));
    else if (!input.quiet) {
      console.log(`Hunt worker: ${result.outcome.canonicalVerdict ?? result.outcome.verdict}`);
      console.log(`Finding: ${result.findingId}`);
      console.log(`Sandbox: ${result.sandbox}`);
      console.log(`Execution: ${result.executes ? "started" : "not run"}`);
      console.log(`Proof/counterexample: ${result.proof.status}`);
      console.log(`Reason: ${result.outcome.reason}`);
    }
    return result.outcome.canonicalVerdict === "confirmed" ? 1 : 0;
  } catch {
    if (input.json) console.log(JSON.stringify({ status: "denied", code: "HUNT_WORKER_DENIED", message: "hypothesis execution was not authorized or its bounded input was invalid" }));
    else if (!input.quiet) console.error("Hunt worker execution was not authorized or its bounded input was invalid.");
    return 78;
  }
}
