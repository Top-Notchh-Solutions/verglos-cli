# FINAL-WEB-008 public truth and release smoke evidence

**Date:** 2026-10-22  
**Implementation repository:** `verglos-web`  
**Source commit:** `d32da250d5c2427dcfa36f560421a2506bb8a659`  
**Pull request:** [#233](https://github.com/anuragyadav-git/verglos-web/pull/233)  
**Merge commit:** `065c84510df147dc72955310a599413cf375be63`

## Implemented

- Extended the public release-truth source inventory to include the public
  `robots.ts` and `sitemap.ts` machine-readable surfaces.
- Added required-token checks for crawl directives and public sitemap entries.
- Added fail-closed validation for duplicate or malformed public route-manifest
  entries.
- Changed the hosted Verify workflow to run the smoke command with
  `pnpm --silent`, ensuring the uploaded `public-release-smoke.json` artifact
  contains JSON rather than package-manager wrapper output.
- Added regression tests for the manifest and machine-readable artifact
  contract.

## Verification

- `pnpm --silent public:release-smoke`: passed; **16 routes**, **20 source
  files**, **0 issues**, **22/22 publishable claims**, **2 proof assets**.
- Public smoke plus landing qualification tests: **8/8 passed**.
- `pnpm test:truth-registry`: **35/35 passed**.
- `pnpm typecheck`: passed.
- `git diff --check`: passed.
- Hosted Verify web run `39778264795`: passed.
- Hosted Private runner qualification run `39778264796`: passed, including the
  isolated PostgreSQL lifecycle and Linux/macOS/Windows protocol matrix.

## Safety and disposition

No database was connected or modified. No provider, production, customer,
recipient, publication, legal, AppSec, or field-performance state changed.
No file, branch, record, or deployment was deleted. The source branch remains
available on GitHub.

This closes the code-side `FINAL-WEB-008` public-truth/release-smoke gap only.
Keep `FINAL-WEB-008` unchecked for its dependency on final acceptance and
release-gate reconciliation, including the required final claim sweep/go-no-go
artifact. No release or production publication is claimed.

Live checklist score after this merge: **239 checked / 41 open / 280 total
(85.4%)**.
