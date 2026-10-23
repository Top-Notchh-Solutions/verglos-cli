#!/usr/bin/env node

import { createHash } from "node:crypto";
import { constants, fstatSync, lstatSync, openSync, readSync, closeSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const MAX_EVIDENCE_BYTES = 16 * 1024 * 1024;
const output = process.env.VERGLOS_ACCEPTANCE_BUNDLE_OUTPUT
  ?? join(root, "docs/shipping/evidence/acceptance-evidence-bundle-2026-10-03.json");

const paths = [
  "docs/shipping/evidence/acceptance-corpus-verification-2026-10-03-v3.json",
  "docs/shipping/evidence/acceptance-corpus-2026-10-03.md",
  "docs/shipping/evidence/acceptance-stories-verification-2026-10-03.json",
  "docs/shipping/evidence/acceptance-stories-verification-2026-10-19.json",
  "docs/shipping/evidence/acceptance-stories-verification-2026-10-19.md",
  "docs/shipping/evidence/acceptance-story-map-2026-10-03.json",
  "docs/shipping/evidence/acceptance-story-tests-2026-10-03.md",
  "docs/shipping/evidence/accept-005-topnotchh-owned-qualification-2026-10-19.md",
  "docs/shipping/evidence/accept-005-packed-first-party-qualification-2026-10-19.md",
  "docs/shipping/evidence/qual-web-005-authenticated-route-e2e-2026-10-19.md",
  "docs/shipping/acceptance/external-workflow-protocol.md",
  "docs/shipping/acceptance/consent-record.template.md",
  "docs/shipping/acceptance/comprehension-test-protocol.md",
  "docs/shipping/acceptance/commercial-acceptance-protocol.md",
  "docs/shipping/acceptance/hunt-adjudication-protocol.md",
  "docs/shipping/evidence/razorpay-sandbox-qr-2026-10-03.md",
  "docs/shipping/evidence/current-source-verification-2026-10-03.md",
  "docs/shipping/evidence/hunt-docker-adversarial-2026-10-02.md",
  "docs/shipping/evidence/ent-cli-001-current-head-qualification-2026-10-22.md",
  "docs/shipping/evidence/studio-cli-001-current-head-preview-2026-10-22.md",
  "docs/shipping/evidence/dist-003-current-head-checksum-generation-2026-10-22.md",
  "docs/shipping/evidence/dist-003-checksum-output-portability-pr160-2026-10-22.md",
  "docs/shipping/evidence/final-web-007-landing-accessibility-pr234-2026-10-22.md",
  "docs/shipping/evidence/acceptance-stories-verification-2026-10-22-pr160-pr234.json",
  "docs/shipping/evidence/accept-002-003-current-head-pr160-pr234-2026-10-22.md",
  "docs/shipping/evidence/acceptance-stories-verification-2026-10-22-pr160-pr161-pr234.json",
  "docs/shipping/evidence/studio-cli-001-approval-shape-pr161-2026-10-22.md",
  "docs/shipping/evidence/studio-cli-001-merged-head-focused-recheck-2026-10-22.md",
  "docs/shipping/evidence/acceptance-stories-verification-2026-10-22-pr161-pr162-pr234.json",
  "docs/shipping/evidence/ent-cli-001-reconciliation-pr162-2026-10-22.md",
  "docs/shipping/evidence/acceptance-stories-verification-2026-10-22-pr162-pr163-pr234.json",
  "docs/shipping/evidence/dist-001-package-contents-boundary-pr163-2026-10-22.md",
  "docs/shipping/evidence/acceptance-stories-verification-2026-10-22-pr163-pr235.json",
  "docs/shipping/evidence/qual-web-005-worker-kind-boundary-pr235-2026-10-22.md",
  "docs/shipping/evidence/acceptance-stories-verification-2026-10-22-pr163-pr235-pr236.json",
  "docs/shipping/evidence/qual-web-006-measurement-boundary-pr236-2026-10-22.md",
  "docs/shipping/evidence/studio-cli-001-current-head-requalification-pr167-pr241-2026-10-22.md",
  "docs/shipping/evidence/studio-cli-001-current-head-requalification-pr244-2026-10-22.md",
  "docs/shipping/evidence/accept-002-current-head-pr239-2026-10-22.md",
  "docs/shipping/evidence/accept-003-current-head-pr239-2026-10-22.md",
  "docs/shipping/evidence/accept-005-current-blocker-audit-2026-10-22.md",
  "docs/shipping/evidence/accept-005-current-head-first-party-qualification-2026-10-22.md",
  "docs/shipping/evidence/accept-005-web-security-headers-pr240-2026-10-22.md",
  "docs/shipping/evidence/accept-005-web-public-proof-url-pr241-2026-10-22.md",
  "docs/shipping/evidence/qual-web-serial-fresh-postgres-2026-10-22.md",
  "docs/shipping/evidence/qual-cli-scanner-false-positive-precision-pr167-2026-10-22.md",
  "docs/shipping/evidence/ent-cli-001-current-head-requalification-pr167-2026-10-22.md",
  "docs/shipping/evidence/ent-cli-001-current-head-requalification-pr244-2026-10-22.md",
  "docs/shipping/evidence/dist-001-current-head-requalification-pr167-2026-10-22.md",
  "docs/shipping/evidence/dist-002-current-head-requalification-pr167-2026-10-22.md",
  "docs/shipping/evidence/dist-002-license-remediation-audit-pr167-2026-10-22.md",
  "docs/shipping/evidence/dist-003-current-head-requalification-pr167-2026-10-22.md",
  "docs/shipping/evidence/dist-006-current-head-requalification-pr167-2026-10-22.md",
  "docs/shipping/evidence/qual-cli-006-current-head-requalification-pr167-2026-10-22.md",
  "docs/shipping/evidence/qual-web-005-current-head-requalification-2026-10-22.md",
  "docs/shipping/evidence/qual-web-006-current-head-requalification-2026-10-22.md",
  "docs/shipping/evidence/qual-web-005-local-isolated-qualification-2026-10-22.md",
  "docs/shipping/evidence/qual-cli-006-trusted-root-sigstore-pr164-2026-10-22.md",
  "docs/shipping/evidence/dist-003-origin-manifest-boundary-pr165-2026-10-22.md",
  "docs/shipping/evidence/ent-cli-001-private-runner-lifetime-pr166-pr237-2026-10-22.md",
  "docs/shipping/evidence/final-web-007-landing-viewport-boundary-pr238-2026-10-22.md",
  "docs/shipping/evidence/final-web-008-public-route-index-boundary-pr242-2026-10-22.md",
  "docs/shipping/evidence/final-web-008-public-route-coverage-pr243-2026-10-22.md",
  "docs/shipping/evidence/final-web-008-robots-guard-pr244-2026-10-22.md",
  "docs/shipping/evidence/final-web-008-sitemap-guard-pr245-2026-10-22.md",
  "docs/shipping/evidence/final-web-008-emitted-metadata-pr246-2026-10-23.md",
  "docs/shipping/evidence/final-web-008-hosted-gate-billing-audit-2026-10-23.md",
  "docs/shipping/evidence/final-web-007-browser-qualification-pr247-2026-10-23.md",
  "docs/shipping/evidence/final-web-007-browser-capture-pr247-2026-10-23.json",
  "docs/shipping/evidence/final-web-007-browser-qualification-pr247-2026-10-23.json",
  "docs/shipping/evidence/final-web-007-test-worker-serialization-pr247-2026-10-23.md",
  "docs/shipping/evidence/final-web-007-hosted-gate-billing-audit-pr247-2026-10-23.md",
  "docs/shipping/evidence/final-web-007-hosted-gate-billing-audit-d02ac18-2026-10-23.md",
  "docs/shipping/evidence/final-web-007-public-release-integration-pr247-2026-10-23.md",
  "docs/shipping/evidence/dist-002-publish-permissions-pr168-2026-10-22.md",
  "docs/shipping/evidence/dist-003-dist-006-qual-cli-006-merged-main-requalification-2026-10-22.md",
  "docs/shipping/evidence/acceptance-stories-verification-2026-10-22-pr164-pr165-pr166-pr237-pr238.json",
  "docs/shipping/evidence/acceptance-stories-verification-2026-10-22.json",
  "docs/shipping/evidence/acceptance-stories-verification-2026-10-22-pr159-pr233.json",
  "docs/shipping/evidence/acceptance-stories-verification-2026-10-22-pr158-pr159-pr233.json",
  "docs/shipping/evidence/accept-002-003-current-head-pr158-pr159-pr233-2026-10-22.md",
  "docs/shipping/evidence/qual-web-006-table-semantics-pr232-2026-10-22.md",
  "docs/shipping/evidence/final-web-008-public-truth-smoke-pr233-2026-10-22.md",
  "docs/shipping/evidence/dist-002-tag-commit-binding-pr159-2026-10-22.md",
  // Current 2026-10-23 execution evidence. Keep the historical entries above
  // so older acceptance runs remain reproducible, while making the default
  // bundle useful for the current merged CLI/Web heads as well.
  "docs/shipping/evidence/acceptance-public-oss-corpus-2026-10-23.md",
  "docs/shipping/evidence/owner-authorization-2026-10-23.md",
  "docs/shipping/evidence/gate-artifact-inventory-2026-10-23.md",
  "docs/shipping/evidence/dist-001-pack-manifest-read-binding-pr174-2026-10-23.md",
  "docs/shipping/evidence/dist-001-package-audit-read-binding-pr172-2026-10-23.md",
  "docs/shipping/evidence/dist-001-packed-manifest-read-binding-pr173-2026-10-23.md",
  "docs/shipping/evidence/dist-002-003-publication-archive-snapshot-pr170-2026-10-23.md",
  "docs/shipping/evidence/dist-002-license-owner-disposition-2026-10-23.md",
  "docs/shipping/evidence/dist-002-release-tag-read-binding-pr177-2026-10-23.md",
  "docs/shipping/evidence/dist-003-artifact-read-binding-pr171-2026-10-23.md",
  "docs/shipping/evidence/dist-003-checksum-read-binding-pr175-2026-10-23.md",
  "docs/shipping/evidence/dist-006-rollback-evidence-read-binding-pr176-2026-10-23.md",
  "docs/shipping/evidence/dist-006-rollback-input-hardening-pr169-2026-10-23.md",
  "docs/shipping/evidence/qual-web-005-deletion-input-boundary-pr248-2026-10-23.md",
  "docs/shipping/evidence/qual-web-006-boolean-measurement-boundary-pr249-2026-10-23.md",
  "docs/shipping/evidence/final-web-003-catalog-allowance-display-pr250-2026-10-23.md",
  "docs/shipping/evidence/final-web-005-machine-readable-plan-terms-pr250-2026-10-23.md",
  "docs/shipping/evidence/final-web-006-proof-origin-boundary-pr250-2026-10-23.md",
  "docs/shipping/evidence/final-web-007-008-public-metadata-landing-2026-10-23.md",
  "docs/shipping/evidence/final-web-source-contracts-2026-10-23.md",
  "docs/shipping/evidence/cli-workspace-full-test-2026-10-23.md",
  "docs/shipping/evidence/qual-web-006-dashboard-capture-command-pr257-2026-10-23.md",
  "docs/shipping/evidence/vercel-web-production-preview-receipts-2026-10-23.md",
  "docs/shipping/evidence/vercel-web-current-head-preview-2026-10-23.md",
  "docs/shipping/evidence/vercel-web-current-head-checkout-preview-2026-10-24.md",
  "docs/shipping/evidence/cli-platform-matrix-run-39985823350-2026-10-23.md",
  "docs/shipping/evidence/cli-platform-matrix-run-39993289161-2026-10-23.md",
  "docs/shipping/evidence/acceptance-evidence-bundle-cli-platform-matrix-39993289161-2026-10-23.md",
  "docs/shipping/evidence/final-web-007-qualification-runtime-pr253-2026-10-23.md",
  "docs/shipping/evidence/final-web-008-machine-readable-release-smoke-pr250-2026-10-23.md",
  "docs/shipping/evidence/final-web-008-page-extension-inventory-pr250-2026-10-23.md",
  "docs/shipping/evidence/accept-009-release-reconciler-2026-10-23.md",
  "docs/shipping/evidence/accept-009-reconciliation-date-boundary-2026-10-23.md",
  "docs/shipping/evidence/accept-010-candidate-freeze-2026-10-23.md",
  "docs/shipping/evidence/accept-010-artifact-kind-boundary-2026-10-23.md",
  "docs/shipping/evidence/accept-012-public-oss-triage-2026-10-23.md",
  "docs/shipping/evidence/accept-011-architecture-corpus-2026-10-23.md",
  "docs/shipping/evidence/accept-012-architecture-corpus-triage-2026-10-23.md",
  "docs/shipping/evidence/accept-012-triage-integrity-boundary-2026-10-23.md",
  "docs/shipping/evidence/accept-012-current-head-digest-bound-rerun-2026-10-23.md",
  "docs/shipping/evidence/accept-011-012-current-cli-c0f0db6-public-corpus-2026-10-23.md",
  "docs/shipping/evidence/accept-013-held-out-correction-loop-2026-10-23.md",
  "docs/shipping/evidence/accept-013-correction-time-boundary-2026-10-23.md",
  "docs/shipping/evidence/accept-003-deterministic-bundle-manifest-2026-10-23.md",
  "docs/shipping/evidence/accept-003-bundle-symlink-boundary-2026-10-23.md",
  "docs/shipping/evidence/accept-005-authorized-workflow-date-boundary-2026-10-23.md",
  "docs/shipping/evidence/accept-006-comprehension-boundary-2026-10-23.md",
  "docs/shipping/evidence/accept-006-rubric-digest-boundary-2026-10-23.md",
  "docs/shipping/evidence/accept-008-commercial-boundary-2026-10-23.md",
  "docs/shipping/evidence/accept-008-commercial-payload-boundary-2026-10-23.md",
  "docs/shipping/evidence/accept-008-commercial-provenance-2026-10-24.md",
  "docs/shipping/evidence/accept-014-final-regression-contract-2026-10-23.md",
  "docs/shipping/evidence/accept-014-web-candidate-binding-2026-10-23.md",
  "docs/shipping/evidence/accept-005-authorized-workflow-contract-2026-10-23.md",
  "docs/shipping/evidence/accept-005-public-oss-workflow-contract-2026-10-24.md",
  "docs/shipping/evidence/accept-005-public-oss-workflow-bundle-2026-10-24.md",
  "docs/shipping/evidence/accept-006-participant-provenance-2026-10-24.md",
  "docs/shipping/evidence/razorpay-testmode-current-readonly-recheck-2026-10-24.md",
  "docs/shipping/evidence/acceptance-input-read-boundaries-2026-10-23.md",
  "docs/shipping/evidence/acceptance-evidence-writer-boundaries-2026-10-23.md",
  "docs/shipping/evidence/acceptance-stories-current-head-2026-10-23.md",
  "docs/shipping/evidence/acceptance-stories-verification-2026-10-23-current-retry.json",
  "docs/shipping/evidence/acceptance-evidence-bundle-current-2026-10-23.md",
  "docs/shipping/evidence/acceptance-evidence-bundle-current-retry-2026-10-23.md",
  "docs/shipping/evidence/backlog-audit-13-23-current-2026-10-23.md",
  "docs/shipping/evidence/qual-web-005-current-head-contract-0c2b306-2026-10-23.md",
  "docs/shipping/evidence/qual-web-005-local-isolated-integration-2026-10-23.md",
  "docs/shipping/evidence/qual-web-005-migration-preflight-pr258-2026-10-23.md",
  "docs/shipping/evidence/dist-002-003-006-current-main-requalification-2026-10-23.md",
  "docs/shipping/evidence/qual-web-006-dashboard-capture-read-boundary-pr259-2026-10-23.md",
  "docs/shipping/evidence/accept-003-qual-web005-bundle-integrity-v3-2026-10-23.md",
  "docs/shipping/evidence/accept-003-bundle-verifier-2026-10-23.md",
  "docs/shipping/evidence/accept-002-003-clean-current-story-run-2026-10-23.md",
  "docs/shipping/evidence/acceptance-stories-verification-2026-10-23-clean-current.json",
  "docs/shipping/evidence/acceptance-release-reconciliation-2026-10-23-current.json",
  "docs/shipping/evidence/acceptance-candidate-freeze-2026-10-23-current.json",
  "docs/shipping/evidence/acceptance-release-state-artifacts-2026-10-23.md",
  "docs/shipping/evidence/dist-003-local-release-artifacts-2026-10-23.md",
  "docs/shipping/evidence/acceptance-candidate-freeze-2026-10-23-artifacts.json",
  "docs/shipping/evidence/dist-002-003-npm-publication-observation-2026-10-23.md",
  "docs/shipping/evidence/dist-002-003-npm-publication-observation-2026-10-23.json",
  "docs/shipping/evidence/qual-web-005-local-current-head-integration-2026-10-23.md",
  "docs/shipping/evidence/dist-006-local-rollback-rehearsal-2026-10-23.md",
  "docs/shipping/evidence/dist-006-private-contract-suite-2026-10-23.md",
  "docs/shipping/evidence/acceptance-evidence-bundle-dist006-private-suite-2026-10-23.md",
  "docs/shipping/evidence/studio-cli-001-current-head-contract-2026-10-23.md",
  "docs/shipping/evidence/dist-002-current-publish-contract-2026-10-23.md",
  "docs/shipping/evidence/dist-002-release-environment-state-2026-10-23.md",
  "docs/shipping/evidence/qual-web-005-fresh-migrated-current-head-2026-10-23.md",
  "docs/shipping/evidence/dist-002-npm-preflight-identity-boundary-pr190-2026-10-23.md",
  "docs/shipping/evidence/dist-002-npm-preflight-identity-boundary-merge-pr190-2026-10-23.md",
  "docs/shipping/evidence/dist-006-rollback-handle-recheck-pr191-2026-10-23.md",
  "docs/shipping/evidence/accept-009-010-014-version-binding-2026-10-23.md",
  "docs/shipping/evidence/accept-005-authorized-workflow-version-binding-2026-10-23.md",
  "docs/shipping/evidence/accept-013-correction-loop-version-binding-2026-10-23.md",
  "docs/shipping/evidence/dist-001-license-read-binding-pr179-2026-10-23.md",
  "docs/shipping/evidence/ent-cli-001-runner-read-binding-pr192-2026-10-23.md",
  "docs/shipping/evidence/studio-cli-001-projection-race-pr254-2026-10-23.md",
  "docs/shipping/evidence/studio-cli-001-projection-race-pr254-merge-2026-10-23.md",
  "docs/shipping/evidence/source-queue-audit-after-merged-prs-2026-10-23.md",
  "docs/shipping/evidence/accept-003-bundle-integrity-verification-2026-10-23.md",
  "docs/shipping/evidence/dist-002-registry-response-boundary-pr193-2026-10-23.md",
  "docs/shipping/evidence/dist-002-registry-response-boundary-pr193-merge-2026-10-23.md",
  "docs/shipping/evidence/qual-web-005-store-scope-pr255-merge-2026-10-23.md",
  "docs/shipping/evidence/qual-web-006-dashboard-capture-coverage-pr256-merge-2026-10-23.md",
  "docs/shipping/evidence/accept-011-012-bounded-corpus-read-binding-2026-10-23.md",
  "docs/shipping/evidence/dist-002-release-tag-read-binding-private-2026-10-23.md",
  "docs/shipping/evidence/dist-003-release-artifact-read-binding-private-2026-10-23.md",
  "docs/shipping/evidence/dist-003-006-consumer-archive-staging-private-2026-10-23.md",
  "docs/shipping/evidence/dist-001-package-content-read-binding-private-2026-10-23.md",
  "docs/shipping/evidence/acceptance-stories-verification-2026-10-23-coherent.json",
  "docs/shipping/evidence/accept-002-stories-coherent-head-2026-10-23.md",
  "docs/shipping/evidence/dist-002-003-license-read-binding-private-2026-10-23.md",
  "docs/shipping/evidence/dist-001-003-public-packer-read-binding-private-2026-10-23.md",
  "docs/shipping/evidence/accept-009-010-release-byte-binding-2026-10-23.md",
  "docs/shipping/evidence/accept-014-regression-byte-binding-2026-10-23.md",
  "docs/shipping/evidence/accept-005-authorized-workflow-byte-binding-2026-10-23.md",
  "docs/shipping/evidence/accept-003-bundle-size-boundary-2026-10-23.md",
  "docs/shipping/evidence/accept-007-adjudication-validator-2026-10-23.md",
  "THIRD_PARTY_NOTICES",
];

const FORBIDDEN = [
  /-----BEGIN (?:RSA |EC |OPENSSH |PRIVATE )?PRIVATE KEY-----/u,
  /(?:RAZORPAY_KEY_SECRET|CLERK_SECRET_KEY|DATABASE_URL)\s*=/u,
  /rzp_(?:test|live)_[A-Za-z0-9]{12,}/u,
];

export function buildAcceptanceEvidenceBundle({ bundleRoot = root, bundlePaths = paths, generatedAt = new Date().toISOString() } = {}) {
  const resolvedRoot = resolve(bundleRoot);
  if (!Array.isArray(bundlePaths) || bundlePaths.length === 0) throw new Error("evidence bundle paths are invalid");
  if (typeof generatedAt !== "string" || !Number.isFinite(new Date(generatedAt).getTime())) throw new Error("evidence bundle generatedAt is invalid");
  const seen = new Set();
  const files = [...bundlePaths].sort().map((path) => {
    if (typeof path !== "string" || path.length === 0 || path.startsWith("/") || path.includes("\\") || path.split("/").includes("..")) throw new Error(`evidence path is unsafe: ${path}`);
    if (seen.has(path)) throw new Error(`duplicate evidence path: ${path}`);
    seen.add(path);
    const absolute = resolve(resolvedRoot, path);
    if (absolute !== resolvedRoot && !absolute.startsWith(`${resolvedRoot}/`)) throw new Error(`evidence path escapes bundle root: ${path}`);
    const bytes = readEvidenceFile(absolute, path);
    const text = bytes.toString("utf8");
    if (FORBIDDEN.some((pattern) => pattern.test(text))) throw new Error(`secret-like material found in evidence: ${path}`);
    return { path, sha256: createHash("sha256").update(bytes).digest("hex"), bytes: bytes.byteLength };
  });
  const manifestSha256 = `sha256:${createHash("sha256").update(JSON.stringify(files)).digest("hex")}`;
  return {
    schema: "verglos.private.acceptance-evidence-bundle.v1",
    generatedAt,
    manifestSha256,
    files,
    gateBoundary: {
      technicalCorpus: "verified",
      substrateRegression: "verified",
      providerLifecycle: "open",
      customerConsent: "open",
      independentReview: "open",
      authenticatedBrowser: "open",
      fieldCwv: "open",
      accountDeletion: "open",
    },
    note: "Private reproducibility manifest. It contains hashes and bounded evidence references, not source, credentials, customer data, or reviewer sign-off.",
  };
}

function readEvidenceFile(absolute, path) {
  let before;
  try {
    before = lstatSync(absolute);
  } catch (error) {
    if (error?.code === "ENOENT") throw new Error(`evidence file missing: ${path}`);
    throw error;
  }
  if (!before.isFile()) throw new Error(`evidence path must be a regular file: ${path}`);
  if (before.size > MAX_EVIDENCE_BYTES) throw new Error(`evidence file exceeds size limit: ${path}`);
  let descriptor;
  try {
    descriptor = openSync(absolute, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
    const opened = fstatSync(descriptor);
    if (!opened.isFile() || opened.size > MAX_EVIDENCE_BYTES || !sameIdentity(before, opened)) throw new Error(`evidence file changed or exceeds size limit while opening: ${path}`);
    const bytes = readBoundedDescriptor(descriptor, path);
    const after = fstatSync(descriptor);
    if (after.size > MAX_EVIDENCE_BYTES || after.size !== bytes.byteLength || !sameIdentity(opened, after)) throw new Error(`evidence file changed or exceeds size limit while reading: ${path}`);
    return bytes;
  } finally {
    if (descriptor !== undefined) closeSync(descriptor);
  }
}

function readBoundedDescriptor(descriptor, path) {
  const chunks = [];
  let total = 0;
  while (true) {
    const buffer = Buffer.allocUnsafe(Math.min(64 * 1024, MAX_EVIDENCE_BYTES + 1 - total));
    const bytesRead = readSync(descriptor, buffer, 0, buffer.byteLength, null);
    if (bytesRead === 0) break;
    total += bytesRead;
    if (total > MAX_EVIDENCE_BYTES) throw new Error(`evidence file exceeds size limit while reading: ${path}`);
    chunks.push(buffer.subarray(0, bytesRead));
  }
  return Buffer.concat(chunks, total);
}

function sameIdentity(left, right) {
  return left.dev === right.dev && left.ino === right.ino;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const bundle = buildAcceptanceEvidenceBundle();
  writeFileSync(output, `${JSON.stringify(bundle, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
  console.log(JSON.stringify({ schema: bundle.schema, fileCount: bundle.files.length, output: relative(root, output), manifestSha256: bundle.manifestSha256, secretScan: "passed", openGates: Object.entries(bundle.gateBoundary).filter(([, value]) => value === "open").map(([key]) => key) }));
}
