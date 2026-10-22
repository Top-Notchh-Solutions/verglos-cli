#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
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
  "docs/shipping/acceptance/hunt-adjudication-protocol.md",
  "docs/shipping/evidence/razorpay-sandbox-qr-2026-10-03.md",
  "docs/shipping/evidence/current-source-verification-2026-10-03.md",
  "docs/shipping/evidence/hunt-docker-adversarial-2026-10-02.md",
  "docs/shipping/evidence/ent-cli-001-current-head-qualification-2026-10-22.md",
  "docs/shipping/evidence/studio-cli-001-current-head-preview-2026-10-22.md",
  "docs/shipping/evidence/dist-003-current-head-checksum-generation-2026-10-22.md",
  "docs/shipping/evidence/acceptance-stories-verification-2026-10-22.json",
  "docs/shipping/evidence/acceptance-stories-verification-2026-10-22-pr159-pr233.json",
  "docs/shipping/evidence/acceptance-stories-verification-2026-10-22-pr158-pr159-pr233.json",
  "docs/shipping/evidence/accept-002-003-current-head-pr158-pr159-pr233-2026-10-22.md",
  "docs/shipping/evidence/qual-web-006-table-semantics-pr232-2026-10-22.md",
  "docs/shipping/evidence/final-web-008-public-truth-smoke-pr233-2026-10-22.md",
  "docs/shipping/evidence/dist-002-tag-commit-binding-pr159-2026-10-22.md",
];

const forbidden = [
  /-----BEGIN (?:RSA |EC |OPENSSH |PRIVATE )?PRIVATE KEY-----/u,
  /(?:RAZORPAY_KEY_SECRET|CLERK_SECRET_KEY|DATABASE_URL)\s*=/u,
  /rzp_(?:test|live)_[A-Za-z0-9]{12,}/u,
];

const files = paths.map((path) => {
  const absolute = join(root, path);
  if (!existsSync(absolute)) throw new Error(`evidence file missing: ${path}`);
  const bytes = readFileSync(absolute);
  const text = bytes.toString("utf8");
  if (forbidden.some((pattern) => pattern.test(text))) throw new Error(`secret-like material found in evidence: ${path}`);
  return { path, sha256: createHash("sha256").update(bytes).digest("hex"), bytes: bytes.byteLength };
});

const bundle = {
  schema: "verglos.private.acceptance-evidence-bundle.v1",
  generatedAt: new Date().toISOString(),
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
writeFileSync(output, `${JSON.stringify(bundle, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ schema: bundle.schema, fileCount: files.length, output: relative(root, output), secretScan: "passed", openGates: Object.entries(bundle.gateBoundary).filter(([, value]) => value === "open").map(([key]) => key) }));
