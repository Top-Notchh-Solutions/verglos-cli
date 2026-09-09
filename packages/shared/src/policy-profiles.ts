import { parsePolicyDocument, type PolicyDocument } from "./policy-document.js";

export function createFreePolicyProfile(): PolicyDocument {
  return parsePolicyDocument({
    schemaId: "urn:verglos:schema:policy-document",
    schemaVersion: "1.0.0",
    policyId: "policy-free",
    policyVersion: "1.0.0",
    checks: [
      {
        id: "critical-findings",
        requirement: "required",
        onFailure: "BLOCK",
        severities: ["critical"],
        minimumConfidence: 0,
        freshness: "current",
        coverage: "allow-incomplete",
        artifactMatch: "not-required",
        hunt: "not-required",
      },
    ],
    exceptions: { enabled: false, requireApproval: false },
    approvals: { required: false, authorities: [] },
  });
}

export function createProPolicyProfile(options: {
  readonly minimumConfidence?: number;
  readonly requireCurrentEvidence?: boolean;
  readonly requireCompleteCoverage?: boolean;
  readonly requireHunt?: boolean;
} = {}): PolicyDocument {
  return parsePolicyDocument({
    schemaId: "urn:verglos:schema:policy-document",
    schemaVersion: "1.0.0",
    policyId: "policy-pro",
    policyVersion: "1.0.0",
    checks: [
      {
        id: "high-confidence-findings",
        requirement: "required",
        onFailure: "BLOCK",
        severities: ["critical", "high"],
        minimumConfidence: options.minimumConfidence ?? 0.8,
        freshness: options.requireCurrentEvidence === false ? "allow-stale" : "current",
        coverage: options.requireCompleteCoverage === false ? "allow-incomplete" : "complete",
        artifactMatch: "required",
        hunt: options.requireHunt ? "required" : "advisory",
      },
    ],
    exceptions: { enabled: true, requireApproval: true },
    approvals: { required: true, authorities: ["release-owner"] },
  });
}
