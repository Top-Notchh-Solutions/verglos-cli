# FINAL-WEB-007 landing release qualification implementation

Date: 2026-10-19

## Scope

This packet records the original Web implementation for the landing release
qualification contract. It is not a browser sign-off and does not close
`FINAL-WEB-007` or any final acceptance row.

## Source and commits

- Repository: `anuragyadav-git/verglos-web`
- Base: normal Web main merge `c8dc05a57a77d2332856085c70833ceced0599f6`
- Implementation: `d5a3f8f` (`feat(web): qualify landing release captures`)
- Regression/CI wiring: `330280d` (`test(web): enforce landing release qualification`)
- Pull request: #227, `https://github.com/anuragyadav-git/verglos-web/pull/227`
- No squash or history rewrite was used.

## Original logic implemented

- `qualifyLandingRelease` requires every required public path to have both
  desktop and mobile measurements.
- Duplicate path/viewport captures, unexpected paths, invalid paths, missing
  viewport coverage, Core Web Vital breaches, keyboard/landmark/reduced-motion
  failures, missing responsive layout, missing canonical metadata, and failed
  crawlability all fail closed.
- `scripts/landing-release-qualification.ts` parses a versioned browser-capture
  document with bounded field types and emits a versioned qualification report.
- The source audit checks the real landing route files, layout metadata, proof
  accessibility labels, checkout client, responsive CSS, and reduced-motion
  CSS. It does not substitute source tokens for browser measurements.
- `.github/workflows/verify.yml` runs the regression contract before the
  existing public release smoke.

## Verification actually run

- `pnpm test:landing-release`: **4/4 pass, 0 fail**.
- `pnpm test:truth-registry`: **34/34 pass, 0 fail**.
- `pnpm test:public-release-smoke`: **2/2 pass, 0 fail**.
- `pnpm public:release-smoke`: **15 routes, 22/22 publishable claims, 2 proof
  assets, 0 issues**.
- `pnpm typecheck`: pass.
- `pnpm build`: pass; **49/49** static pages generated.
- `git diff --check`: pass.

The local runtime was Node `v26.4.0` / pnpm `10.34.5`; the package requests
Node `22.x`, so the local engine warning is retained rather than hidden.

## Disposition and boundary

The committed verifier is substantive implementation and qualification
substrate. A real browser-produced capture must still be supplied to the CLI;
the CLI rejects a missing, malformed, incomplete, or failed capture. No
production deployment, customer source, provider, billing, publication,
credential, or AppSec state changed. `FINAL-WEB-007` remains unchecked pending
the required real browser/accessibility/performance evidence and its stated
dependencies. Score remains **239 checked / 41 open / 280 total (85.4%)**.
