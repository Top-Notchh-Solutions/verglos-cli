# Verglos truth registry

This is the single classification source for implementation, docs, dashboard labels, pricing copy, and campaign claims. Every capability is `shipped`, `partial`, `planned`, or `hypothesis` and must link to code/tests or an explicit decision.

Detailed current-state evidence:

- CLI: [`VERGLOS_CLI_CAPABILITY_INVENTORY.md`](./VERGLOS_CLI_CAPABILITY_INVENTORY.md), reviewed 2026-09-08 at behavior baseline `caa2a56`.
- Hosted web: [`VERGLOS_WEB_CAPABILITY_INVENTORY.md`](./VERGLOS_WEB_CAPABILITY_INVENTORY.md), reviewed 2026-09-08 at web behavior baseline `5044e77`.

## Shipped

- npm CLI front door and local JavaScript/TypeScript scan
- native secret, injection, auth, misconfiguration, dependency, package, and AI-pattern detectors
- local HTML/JSON reports, score, paths and line numbers
- provenance signals, slopsquat/typosquat checks
- pre-commit hook, four functional MCP tools, and standard CI critical gate
- bounded Pro header-fix workflow, CI score thresholds, and three deeper native detector packs

## Partial / alpha

- Pro Hunt commands are shells and do not yet provide complete exploitability verification.
- Attest is a shell; functional signing/public verification is not complete.
- Monitoring register/status/unregister/test-alert CLI integrations exist, but hosted scheduling, delivery, retry, and retention remain an end-to-end claim pending the hosted audit.
- Login, activation, license status, entitlement, and telemetry clients exist; server behavior remains an end-to-end claim pending the hosted audit.
- `verglos ci --hunt` and `verglos scan --hunt` do not run Hunt verification.
- Plan/config/capability vocabularies conflict and the current CLI has no Team tier.
- Hosted auth, Pro QR payment, licensing, telemetry, monitoring, score history, and account surfaces have implementations but no application tests and are not the final V1 control plane.
- Hosted monitoring has no durable queue/retry/dead-letter path; failed attempts are currently written into the dedup ledger.
- Hosted attestation stores an unsigned caller-supplied summary. Its random URL hash is an identifier, not a report digest or signature, and the current CLI shell does not publish it.
- The legacy hosted report viewer has an authorization edge case when the signed-in Clerk user has no database user row.

## Planned V1

- versioned subject/observation/policy/verification/Release Record contracts
- local artifact/image/IaC target resolution
- verified, pinned, replaceable Trivy adapter
- SARIF, CycloneDX, SPDX, VEX, provenance, and detect-secrets baseline import/export
- normalization, deduplication, source-to-artifact lineage, release diff
- policy decisions: PASS, REVIEW, BLOCK, INCOMPLETE
- local viewer and `.vgl` record assembly
- supported local Hunt, guided signing, Sigstore/in-toto verification
- Pro, Team, Studio, and Enterprise hosted workflows and dashboards

## Hypotheses

- non-Pro prices and allowances
- demand for unified source-to-artifact evidence
- Studio client handoff and evidence resale
- Enterprise private runners, SSO/SCIM, and custom detectors
- managed cloud Hunt demand

## Claim rules

1. “Native SAST” means Verglos detector coverage, currently JS/TS.
2. External engine, imported evidence, and native detection are separate coverage classes in every UI and report.
3. Sigstore proves signer identity/integrity, not security perfection, company ownership, or compliance.
4. “Unlimited local” never means unlimited hosted storage or managed compute.
5. No customer, revenue, benchmark, exploitability, or compliance claim is public without a source and date.
6. “Local” means source and reports remain local unless a user explicitly uploads them; it does not imply zero network. Current scans can query npm/OSV, entitlement, updates, and telemetry.
7. Current telemetry may contain a derived repository/package name and an authorization bearer; do not claim “no identity” without the field-level qualification in the CLI inventory.
8. “Verify” is reserved for cryptographic or explicitly scoped evidence verification. A random-hash database lookup cannot be described as independent attestation verification.
9. Route/table/UI presence is not proof of configured production operation, delivery reliability, authorization safety, or release readiness.
