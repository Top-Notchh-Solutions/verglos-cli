export type ProvenanceProvider = "github" | "npm" | "buildkit" | "unknown";
export interface ProviderProvenanceResult { readonly provider: ProvenanceProvider; readonly subjectDigest: string; readonly expectedDigest: string; readonly state: "matched" | "mismatched" | "unavailable"; readonly signatureStatus: "unverified"; }

export function matchProviderProvenance(input: { readonly provider: ProvenanceProvider; readonly subjects?: readonly Record<string, unknown>[]; readonly expectedDigest: string }): ProviderProvenanceResult {
  const subject = input.subjects?.find((entry) => entry.digest && typeof entry.digest === "object" && Object.values(entry.digest as Record<string, unknown>).some((value) => typeof value === "string"));
  const subjectDigest = subject?.digest && typeof subject.digest === "object" ? String(Object.values(subject.digest as Record<string, unknown>)[0] ?? "") : "";
  return { provider: input.provider, subjectDigest, expectedDigest: input.expectedDigest, state: subjectDigest ? (subjectDigest === input.expectedDigest ? "matched" : "mismatched") : "unavailable", signatureStatus: "unverified" };
}
