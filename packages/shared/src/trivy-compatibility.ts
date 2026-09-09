import { parseTrivyJson, type TrivyObservation } from "./trivy-parser.js";

export interface TrivyFixture { readonly engineMajor: number; readonly outputSchema: "trivy-json-v1"; readonly observations: readonly TrivyObservation[]; }
export class TrivyCompatibilityError extends Error { override readonly name = "TrivyCompatibilityError"; constructor(readonly code: "UNKNOWN_MAJOR" | "UNKNOWN_SCHEMA", message: string) { super(message); } }

export function parseSupportedTrivyFixture(raw: Uint8Array, version: string, supportedMajor = 0): TrivyFixture {
  const match = /(?:^|\s|v)(\d+)(?:\.\d+){0,2}(?:\s|$)/.exec(version);
  const major = match ? Number(match[1]) : NaN;
  if (!Number.isInteger(major) || major !== supportedMajor) throw new TrivyCompatibilityError("UNKNOWN_MAJOR", "Trivy major version is outside the frozen compatibility set.");
  return Object.freeze({ engineMajor: major, outputSchema: "trivy-json-v1", observations: parseTrivyJson(raw) });
}
