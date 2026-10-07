export type HuntVerdict = "true" | "false" | "not_attemptable";

export interface ExplainHuntVerdictInput {
  readonly findingId: string;
  readonly verdict: HuntVerdict;
}

export interface ExplainHuntVerdictResult {
  readonly ok: true;
  readonly tool: "verglos_hunt_explain_verdict";
  readonly findingId: string;
  readonly verdict: HuntVerdict;
  readonly meaning: string;
  readonly limitations: readonly string[];
}

const MEANINGS: Readonly<Record<HuntVerdict, string>> = {
  true: "The bounded Hunt result classified this finding as reproduced or confirmed under the tested recipe and inputs; that is evidence about the tested fixture and does not by itself establish production exploitability.",
  false: "The bounded Hunt result classified this finding as not reproduced under the tested recipe and inputs; that does not prove the underlying code is safe in every environment.",
  not_attemptable: "The bounded Hunt run could not establish a verdict because policy, runtime, timeout, unsupported-recipe, or environment constraints prevented a valid attempt.",
};

const LIMITATIONS = Object.freeze([
  "This explanation does not rerun Hunt or authorize execution.",
  "Interpret the verdict with the exact recipe, subject, approval, runtime, and evidence digests.",
  "A verdict is not a production exploitability or security-certification claim.",
]);

export function explainHuntVerdict(input: ExplainHuntVerdictInput): ExplainHuntVerdictResult {
  if (!input || typeof input !== "object") throw new Error("hunt_explain_verdict requires an object");
  if (typeof input.findingId !== "string" || input.findingId.length === 0 || input.findingId.length > 512) {
    throw new Error("hunt_explain_verdict findingId exceeds bounds");
  }
  if ([...input.findingId].some((character) => character.charCodeAt(0) < 0x20 || character.charCodeAt(0) === 0x7f)) {
    throw new Error("hunt_explain_verdict findingId contains control characters");
  }
  if (input.verdict !== "true" && input.verdict !== "false" && input.verdict !== "not_attemptable") {
    throw new Error("hunt_explain_verdict verdict is invalid");
  }
  return {
    ok: true,
    tool: "verglos_hunt_explain_verdict",
    findingId: input.findingId,
    verdict: input.verdict,
    meaning: MEANINGS[input.verdict],
    limitations: LIMITATIONS,
  };
}
