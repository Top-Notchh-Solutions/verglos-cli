# CLI/backend external-gate matrix — 2026-10-09

## Purpose

This is the current backend/CLI queue audit after CLI PR #87 merged. It records
why each remaining CLI/release item cannot be accepted from local code and
green CI alone. It is an execution control, not acceptance evidence; no
checkbox is changed by this matrix.

## Current source state

- CLI `origin/main`: `8bea4be2fa18533eafd088122be769e942965626`.
- `gh pr list` showed no open CLI PR at the audit checkpoint.
- CLI PR #85 merged as `80fa930`; PR #86 merged as `fc452ba`; PR #87 merged as
  `8bea4be2`.
- Recorded local/hosted substrate includes CLI typecheck/build, configured
  tests, Hunt/adversarial evidence, package/public-boundary checks, release
  contracts, in-toto, and the Ubuntu/macOS/Windows × Node 20/22/24 matrix.
- Score remains **218 checked / 62 unchecked / 280 total (77.9%)**.

## Item-by-item disposition

| ID | Code-side state | Missing acceptance artifact or operation | Owner role | Review point |
| --- | --- | --- | --- | --- |
| HUNT-008 | Fixed A1 recipe catalog and fixture contracts exist | Trusted/licensed recipe publisher root, provenance, command/approval wiring qualification, independent review | Product/release owner + independent AppSec reviewer | Before Hunt release candidate |
| HUNT-009 | Approval, entitlement, trust, binding, and redacted provenance gates exist | Trusted/licensed publisher roots, bounded execution run, and independent qualification | Product/release owner + independent AppSec reviewer | Before Hunt release candidate |
| HUNT-010 | Bounded MCP finding/report/before-write/explain surfaces exist | Same Hunt trust/provenance gates and independent review of the execution boundary | Product/release owner + independent AppSec reviewer | Before MCP Hunt release |
| HUNT-011 | Pinned Docker/Linux adversarial evidence exists, with the recorded macOS namespace skip | Complete recipe/provenance dependency and an independent sandbox review/sign-off | Independent AppSec reviewer | Before Hunt release candidate |
| PLAN-CLI-001 | Opaque catalog/capability consumption and fail-soft cache behavior are implemented | Production signer/public pin, tenant mapping, deployed activation, and current hosted token evidence | Release/provider operator | Before paid activation acceptance |
| PLAN-CLI-002 | Effective-plan and allowance projection is implemented and hosted-qualified | PLAN-CLI-001 activation plus complete supported CLI UX acceptance | Release/provider operator + product owner | After PLAN-CLI-001 |
| PLAN-CLI-003 | Forged plan/tenant/usage/record denial evidence exists, including the 2026-10-09 read-only probe | Authorized paid/org fixture and complete authenticated list/search/export/public-private runtime matrix | Founder/product owner + authorized fixture owner | Before modified-client acceptance |
| PLAN-CLI-004 | Free/Pro/Team/Studio/Enterprise compatibility fixtures and legacy fallback exist | Deployed signer/catalog alignment, old-token migration evidence, and hosted activation integration | Release/provider operator | Before compatibility acceptance |
| TEAM-CLI-001 | Signed policy schema, digest binding, fetch, cache, and CLI command exist | Production signer/trust-root activation, policy-row reconciliation, and live hosted fetch | Organization-policy operator | Before organization acceptance |
| TEAM-CLI-002 | Deterministic source-free check payload and CLI contract exist | TEAM-CLI-001 activation, CLI command wiring, hosted SCM/provider delivery, and live retry/replay evidence | SCM/provider operator | Before SCM acceptance |
| STUDIO-CLI-001 | Safe client projection, allowlist, redaction, and approval digest binding exist | Hosted upload/custody, independent redaction proof, and authorized Studio recipient/customer acceptance | Product owner + authorized recipient/customer | Before Studio acceptance |
| ENT-CLI-001 | Signed outbound-poll runner protocol, replay hardening, result projection, and Web lifecycle substrate exist | Operational credential exchange, approved isolated runner execution/result reconciliation, cross-platform qualification, and independent review | Enterprise operator + independent reviewer | Before Enterprise runner acceptance |
| LIC-002 | Private external-engine/content inventory exists | Legal approval, immutable detect-secrets/tool selection, image/layer/database review, premium recipe provenance, and reviewer disposition | Legal/release owner | Before release candidate freeze |
| LIC-003 | Deterministic notice generation and archive staging exist | Final legal/license clearance and release-artifact qualification with required upstream notices | Legal/release owner | Before npm publication |
| DIST-001 | Package guard and public-boundary checks exist | Dependent final product surfaces, legal clearance, and final release-package qualification | Release engineering | Before release candidate freeze |
| DIST-002 | OIDC/trusted-publishing workflow and archive/version checks exist | Protected environment approval, trusted-publishing identity review, and an actual approved immutable publication/attestation | Release engineering + npm operator | Final release only |
| DIST-003 | Checksums/SBOM/provenance verification substrate exists | Trusted release identity, legal clearance, final release-note verification, and clean-consumer evidence for the approved release | Release engineering + legal owner | Final release only |
| DIST-006 | Complete five-boundary local rollback rehearsal now fails closed | Authenticated registry/provider/engine/feed/signing/deployment rollback or revocation drill, operational review, and recovery evidence | Release engineering + provider operators | Before release candidate freeze |
| QUAL-CLI-004 | Structured Hunt isolation evidence pack and pinned results exist | Independent security review and final Hunt recipe/provenance qualification | Independent AppSec reviewer | Before Hunt release candidate |
| QUAL-CLI-006 | Official format validation, install/upgrade/rollback substrate, and platform matrix exist | Trusted keyless Sigstore/Fulcio/Rekor release identity, legal clearance, protected publishing, and final acceptance | Release engineering + legal/release reviewer | Before release candidate freeze |

## Backend-track decision

No open CLI PR or dependency-ready CLI code gap was found at this checkpoint.
The remaining CLI rows are externally gated as shown above. Do not create a
helper-only CLI change solely to reduce the count. Continue with the next
independent Web/cross-repository qualification while preserving this matrix.

## Boundary

No production, provider, registry, signing, database, payment, deployment,
customer, legal, reviewer, or release write occurred during this audit. The
matrix does not authorize any of those operations. Each external operation
requires its own preflight and evidence.
