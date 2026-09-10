export const HUNT_VERDICTS = ["confirmed", "not-reproduced", "inconclusive", "not-supported", "environment-error", "policy-denied"] as const;
export type HuntVerdict = (typeof HUNT_VERDICTS)[number];
export function classifyHuntOutcome(input: { readonly assertionMatched?: boolean; readonly supported: boolean; readonly policyAllowed: boolean; readonly environmentError?: boolean; readonly timedOut?: boolean }): HuntVerdict {
  if (!input.policyAllowed) return "policy-denied";
  if (!input.supported) return "not-supported";
  if (input.environmentError) return "environment-error";
  if (input.timedOut) return "inconclusive";
  return input.assertionMatched === true ? "confirmed" : input.assertionMatched === false ? "not-reproduced" : "inconclusive";
}
