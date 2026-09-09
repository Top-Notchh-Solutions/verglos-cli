import { parseTrivyJson, type TrivyObservation } from "./trivy-parser.js";

export interface FixtureEngineRun { readonly engineId: "verglos.fixture"; readonly version: "1"; readonly status: "success" | "failure"; readonly observations: readonly TrivyObservation[]; readonly targetCodeExecuted: false; }
export function runFixtureEngine(raw: Uint8Array, options: { readonly fail?: boolean } = {}): FixtureEngineRun {
  if (options.fail) return Object.freeze({ engineId: "verglos.fixture", version: "1", status: "failure", observations: [], targetCodeExecuted: false });
  return Object.freeze({ engineId: "verglos.fixture", version: "1", status: "success", observations: parseTrivyJson(raw), targetCodeExecuted: false });
}
