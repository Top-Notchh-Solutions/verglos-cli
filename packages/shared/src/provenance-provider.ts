import { canonicalizeJson } from "./schema.js";

export type ProvenanceProvider = "github" | "npm" | "buildkit" | "unknown";
export interface ProviderProvenanceResult { readonly provider: ProvenanceProvider; readonly subjectDigest: string; readonly expectedDigest: string; readonly state: "matched" | "mismatched" | "unavailable"; readonly signatureStatus: "unverified"; }

export interface ProviderProvenanceRecordMember {
  readonly path: string;
  readonly kind: "provenance";
  readonly mediaType: "application/json";
  readonly bytes: Uint8Array;
  readonly required: boolean;
  readonly redaction: "none";
}

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

/** Encode provider provenance as a canonical, explicit record payload. */
export function createProviderProvenanceRecordMember(input: {
  readonly path: string;
  readonly expectedDigest: string;
  readonly provider: ProvenanceProvider;
  readonly subjects?: readonly Record<string, unknown>[];
  readonly required?: boolean;
}): ProviderProvenanceRecordMember {
  const result = matchProviderProvenance(input);
  const limitations = result.state === "matched"
    ? ["Provider subject digest matched the expected artifact digest; provider signature verification was not performed."]
    : result.state === "mismatched"
      ? ["Provider subject digest did not match the expected artifact digest; provenance cannot establish source-to-artifact identity."]
      : ["Provider provenance did not expose a usable subject digest; source-to-artifact identity remains unavailable."];
  const bytes = new TextEncoder().encode(`${canonicalizeJson({ ...result, limitations })}\n`);
  return { path: input.path, kind: "provenance", mediaType: "application/json", bytes, required: input.required ?? false, redaction: "none" };
}
