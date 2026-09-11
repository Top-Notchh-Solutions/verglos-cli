export type ProvenanceProvider = "github" | "npm" | "buildkit" | "unknown";
export interface ProviderProvenanceResult { readonly provider: ProvenanceProvider; readonly subjectDigest: string; readonly expectedDigest: string; readonly state: "matched" | "mismatched" | "unavailable"; readonly signatureStatus: "unverified"; }

export function matchProviderProvenance(input: { readonly provider: ProvenanceProvider; readonly subjects?: readonly Record<string, unknown>[]; readonly expectedDigest: string }): ProviderProvenanceResult {
  const subjectDigests = (input.subjects ?? []).flatMap((entry) => {
    if (!entry.digest || typeof entry.digest !== "object" || Array.isArray(entry.digest)) return [];
    return Object.values(entry.digest as Record<string, unknown>).filter((value): value is string => typeof value === "string" && value.length > 0);
  });
  const uniqueDigests = [...new Set(subjectDigests)].sort();
  const subjectDigest = uniqueDigests[0] ?? "";
  const state = uniqueDigests.length === 0 ? "unavailable" : uniqueDigests.includes(input.expectedDigest) ? "matched" : "mismatched";
  return { provider: input.provider, subjectDigest, expectedDigest: input.expectedDigest, state, signatureStatus: "unverified" };
}
