# FINAL-WEB-003 canonical plan matrix evidence — 2026-10-17

## Scope

This record covers the implementation slice for the public plan/pricing
presentation. It does not claim final release acceptance, hosted billing
qualification, legal approval, or production deployment.

## Public source

- Repository: `anuragyadav-git/verglos-web`
- Pull request: `https://github.com/anuragyadav-git/verglos-web/pull/177`
- Branch: `feat/final-web-001-truth-registry-20261017`
- Commits: `b2b3d4a`, `4aa3310`, regular merge `609faa0`
- Assignee: `anuragyadav-git`
- History: normal granular commits and a regular merge; no squash, rebase,
  force-push, empty, duplicate, or artificial commit

The merge commit incorporated the advanced public `main` head and resolved
only the homepage/`/llms.txt` overlap while retaining the catalog-derived
plan data, Team column, and fail-closed truth assertion.

## Implemented

- Added the canonical Team plan card to the homepage.
- Added Team to the public capability matrix between Pro and Studio.
- Added Team to `/llms.txt` with the inactive `Not purchasable` state.
- Added truth-registry assertions for Team price and `Validation` state.

## Verification

- `pnpm test:truth-registry`: **28 passed / 0 failed / 0 skipped**
- `pnpm typecheck`: passed
- `pnpm build`: passed; **47/47** static pages generated
- `git diff --check`: passed
- Local runtime warning: repository requests Node 22.x; this machine used
  Node 26.4.0 and pnpm 10.34.5. The checks passed despite that warning.

## Remaining acceptance boundary

FINAL-WEB-003 remains unchecked. Exact allowances, billing terms, explicit
overages, and dependent acceptance evidence still require their own recorded
criteria. The private shipping score remains **230 checked / 50 unchecked /
280 total (82.1%)**. The Hunt AppSec/security review remains the only closed
gate and is still scheduled last.

## Catalog-terms implementation slice

Web PR #177 commit `fa01830` extends the plan matrix implementation with a
canonical `publicPlanTerms()` projection. The homepage and docs now render
billing/state, seats, applications, records per month, client workspaces,
hosted retention, and overage status for every catalog plan. `unset` values
render as `Not set in public catalog`; they are not treated as unlimited, and
the public surface states `No overage schedule published` rather than
inventing commercial terms.

Verification: truth-registry tests **29/29**, typecheck, diff check, and the
production build with **47/47** static pages passed. The commit is a separate
substantive contribution assigned to `anuragyadav-git`; no squash, rebase,
force-push, empty, duplicate, or artificial commit was used. The row remains
open for dependent acceptance evidence.
