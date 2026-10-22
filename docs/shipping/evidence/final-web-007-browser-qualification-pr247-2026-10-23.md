# FINAL-WEB-007 browser qualification implementation · 2026-10-23

## Source and implementation

- **Repository:** `verglos-web`
- **Source commit:** `9fcd1031a559a67563124fbaab3e5fa6dd0ed96d`
- **Pull request:** https://github.com/anuragyadav-git/verglos-web/pull/247
- **Branch:** `codex/final-web-007-release-audit-20261023`
- **Implementation:** Added `scripts/capture-landing-release.ts`, a real
  Chromium + axe capture for `/`, `/docs`, `/detectors`, `/proof`, `/verify`,
  and `/checkout` at desktop and mobile viewports. The capture records
  fail-closed LCP, observed interaction timing, CLS, FCP, TTFB, axe findings,
  keyboard focus, landmarks, reduced-motion behavior, responsive overflow,
  canonical metadata, and the emitted robots policy. The qualification schema
  now requires an observed interaction when interactive controls exist and
  distinguishes an intentionally non-interactive route from missing evidence.
- **Product fixes found by the capture:** The homepage mobile domains panel
  now has a bounded min-width contract, and the capability comparison table is
  keyboard-focusable with an accessible label.

## Verification

- `pnpm exec tsc --noEmit` — passed.
- `pnpm test:landing-release` — **4/4 passed**.
- `pnpm test:public-release-smoke` — **7/7 passed**.
- `pnpm exec node --import tsx --test src/lib/qual/qual-web-suites.test.ts` —
  **22/22 passed**.
- `pnpm db:check` — passed.
- `pnpm db:migrations:check` — **43 ordered migrations verified**.
- `pnpm build` — passed; **49/49 routes generated**.
- Local production-like server with Chromium + axe capture — **12/12
  measurements captured**, **qualification passed**, zero gaps and zero page
  failures. Raw capture and qualification outputs are preserved at:
  `final-web-007-browser-capture-pr247-2026-10-23.json` and
  `final-web-007-browser-qualification-pr247-2026-10-23.json`.
- `pnpm test:serial` against a newly created isolated Docker PostgreSQL 15
  `verglos_test` database — **919 passed / 2 explicit skips / 0 failures**.
- `pnpm licenses:test` — **3/3 passed**; dependency inventory completed with
  its existing manual-review notices.

## Hosted state and limits

PR #247 hosted Verify run `39837353961` and private-runner run `39837353981`
failed before repository steps under the existing GitHub account
payments/spending-limit condition; jobs that started reported `runner_id: 0`
and empty runner names. GitGuardian and Vercel passed. No rerun, bypass,
merge-around, deployment, provider, customer, database, or Production action
was taken.

The local browser result is lab evidence, not human screen-reader acceptance,
supported-browser coverage, real-user field CWV, customer/recipient
acceptance, independent review, or final release sign-off. Keep
`FINAL-WEB-007` unchecked for those remaining gates and keep the score at
**239 checked / 41 open / 280 total (85.4%)**. Nothing was deleted.
