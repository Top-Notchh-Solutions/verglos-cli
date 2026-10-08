# CLI cache identity and effective-plan reporting — 2026-10-08

## Batch and implementation

Backlog: PLAN-CLI-001/002, with supporting PLAN-CLI-003/004 regression
coverage. Dependencies: existing Web capability API and signed v2 contract.
Repository: public CLI, seven source/test files only. No browser, Docker,
schema, payment, deployment or production operation was needed.

Before this change, capabilities.json was not bound to the active license or
API endpoint. A credential switch could retain the previous account's fresh
or offline capability cache. Future fetchedAt values also passed the stale
age test. whoami could display a cached Pro plan while effective access was
Free, omitted signed catalog/allowance details in offline human output, and
printed short license values in full.

CLI commit `8f731b38d8f7c4677efb156a4325ccddb75fa532` binds cache reads and
writes to a SHA-256 digest of the license and API endpoint, rejects future
timestamps and caches at or beyond seven days, and requires a refresh for
legacy unbound caches. Signed-token fallback remains independently verified.
The digest prevents accidental identity reuse; it is not tamper-proof access
control. Hosted authorization remains mandatory.

whoami now uses effective capability authority for plan, retains the license
status plan separately as licensePlan, renders catalog/allowances/token expiry
offline, exposes the verified token's grace flag, and redacts short keys.
No maturity or paid feature is inferred from a plan label.

## Verification

- Initial focused tests: 33/33 on local Node 26.4.0.
- Node 22.23.3 focused entitlement, offline, whoami, fix and machine-output
  process tests: 103/103, zero failures/skips; 42.082 seconds.
- Complete configured CLI package suite:
  `npx -y node@22 ../../scripts/run-package-tests.mjs src`, exit 0.
  This runner emits per-file totals; no unrecorded aggregate is claimed.
- CLI typecheck and build: exit 0. An initial summary return-type error was
  corrected before the successful checks and commit.
- Public-boundary audit and git diff checks: pass. The PR file list contains
  only the seven reviewed CLI implementation/test files.
- Provider responses in new tests are mocked, signing material is ephemeral,
  and credentials/caches use the existing temporary test-profile harness.
- Full Web/monorepo suites, Docker, migration/schema, production activation,
  payment and browser qualification were not run for this CLI-only change.

## PR and acceptance boundary

Pushed PR: https://github.com/Top-Notchh-Solutions/verglos-cli/pull/80
Head: `8f731b38d8f7c4677efb156a4325ccddb75fa532`.
Observed open and mergeable, no submitted review decision. Platform workflow
`37772968379` (nine OS/Node cells plus in-toto binding) and Self-scan workflow
`37772968314` were in progress at the first check. Do not merge until required
checks pass; do not describe this as released.

Accepted backlog IDs: none. PLAN-CLI-001/002/003/004 remain open for their
existing production signer/tenant activation, complete UX, modified hosted
client, and supported-version migration acceptance evidence. Recomputed from
the authoritative backlog: 218 checked / 62 unchecked / 280 total (77.9%).

No production, provider-payment, database, migration, entitlement-row,
deployment, npm publication or customer-state write occurred. Only the CLI
branch/PR and private local ledger changed.

## Next three batches

1. Finish PR #80 qualification and merge when all required hosted checks pass.
   Boundary: existing CLI phase PR. Evidence: exact-head platform/self-scan
   results and final diff review. Dependency: running workflows above.
2. TEAM-CLI-002: inspect and complete CLI check-payload command integration
   against existing release-decision and signed organization-policy APIs.
   Boundary: next CLI phase after #80. Evidence: real command/process tests,
   subject/commit/policy/record binding and hosted checks. Live provider
   acceptance still depends on TEAM-CLI-001/GitHub installation evidence.
3. STUDIO-CLI-001: inspect current redacted projection upload/custody wiring
   across CLI/Web and implement any missing transport/admission path.
   Boundary: coordinated CLI/Web phase with synthetic local integration.
   Evidence: exact approved preview digest, tenant/client binding, rejection
   tests and stored receipt reconciliation. Independent recipient acceptance
   and production changes keep their existing requirements.

Previous interrupted full-suite launches were not used as evidence. This batch
made implementation progress; external gates were not waived or redefined.
