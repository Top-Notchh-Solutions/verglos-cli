import type { Finding, ScanResult } from "@verglos/shared";

export interface EvidenceArtifact {
  id: string;
  findingId: string;
  finding?: Finding;
  reportPath?: string;
  htmlPath?: string;
  jsonPath?: string;
  createdAt: string;
}

export interface VerifyChain {
  algorithm: "Ed25519";
  publicKeyId: string;
  verifyUrl: string;
  signedAt: string;
}

export interface AttestationBundle {
  schemaVersion: "2.0.0";
  report: ScanResult;
  evidence: EvidenceArtifact[];
  verifyChain: VerifyChain;
  signature: string;
}

export interface SigningKey {
  keyId: string;
  privateKey: Uint8Array | string;
}
