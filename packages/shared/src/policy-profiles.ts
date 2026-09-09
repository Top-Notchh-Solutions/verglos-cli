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
