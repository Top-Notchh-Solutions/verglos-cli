# FINAL-WEB-005/008 · npm truth correction and Production deployment

Date: 2026-10-24

## Implementation

- Web source commit: `a32efff00a0d295804a9ffe4c6b726724a2f699b`.
- Web PR: [#284](https://github.com/anuragyadav-git/verglos-web/pull/284),
  merged normally (non-squash) as
  `4b877bf67bdfbe41ddf05d4d95303c01ce79ded2`.
- The public truth registry now distinguishes the latest stable scanner
  (`1.8.3`) from npm's current public `latest`/`alpha` prerelease
  (`2.0.0-alpha.1`). Homepage badges, metadata, JSON-LD, direction docs, and
  `/llms.txt` use the corresponding explicit labels.
- Observed package state at implementation time:
  `npm view verglos version dist-tags --json` returned version
  `2.0.0-alpha.1`, with `latest` and `alpha` both pointing to it.

## Verification

- Focused truth/proof/route tests: **10/10**.
- Full truth-registry suite: **37/37**.
- Public-release smoke: **12/12**.
- Typecheck: passed.
- Production build: passed; **49/49** pages generated.
- Workstation warning retained: package requires Node 22.x; workstation used
  Node 26.4.0.

## Hosted receipt

- Vercel Preview deployment `dpl_6xsRZwXxs3eGFrDgEj8X1F1qEHKc`: `Ready`.
- Vercel Production deployment `dpl_G97rLhokYPQ93y6RHqj2f8kQZyrM`: `Ready`,
  aliased to `https://verglos.com`.
- Read-only live `/llms.txt` verification returned the corrected line:
  `Latest stable npm release is 1.8.3; npm's current public latest prerelease
  is 2.0.0-alpha.1; the source track remains under qualification.`
- GitHub Actions jobs for PR #284 failed with zero steps because the account
  runner/billing gate was unavailable. No paid Actions run was used; local
  verification and the Vercel deployment completed independently.

## Boundary

This is a real code, merge, and Vercel Production truth correction. It does
not close FINAL-WEB-005 or FINAL-WEB-008 because their declared dependency,
independent/acceptance, and final-release gates remain open. No npm publication,
new package version, database migration, customer data use, deletion, AppSec
review, or final go/no-go sign-off occurred. Score remains **246 checked / 34
open / 280 total (87.9%)**, split **13 AppSec-dependent / 21 non-AppSec**.
