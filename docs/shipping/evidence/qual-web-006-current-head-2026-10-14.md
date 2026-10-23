# QUAL-WEB-006 current merged-head qualification — 2026-10-14

## Scope

This record qualifies the exact public Web merge commit
`a54d70dfacfaf9506b1336b788d9cd86c9ca74d7` in disposable worktree
`/private/tmp/verglos-web-qual-006`. The merge preserves Web PR #175
contribution commit `aace29cf223f41532403fd4e03666b6f68ac3fb3`.

The local host was macOS arm64 with Node `v26.4.0` and pnpm `9.15.9`; the
package declares Node `22.x`, so this run is supplementary rather than a
supported-release environment claim. Dependencies were installed with the
frozen lockfile. No public source file, deployment configuration, provider,
database, account, entitlement, payment, customer, or release state changed.

## Results

- `pnpm install --frozen-lockfile`: passed. The host/runtime warning was
  retained: current Node is `26.4.0`, while the package engine is `22.x`.
- `pnpm typecheck`: passed.
- Focused `src/lib/qual/qual-web-suites.test.ts`: **20/20 passed**.
- `pnpm build`: passed with Next `15.5.25`; static generation completed for
  **47/47** pages/routes.
- `pnpm test`: pretest completed **44 passed / 6 explicit skips / 0 failed**;
  the configured main suite completed **876 passed / 24 explicit skips /
  0 failed**. Skips are environment-gated and were not counted as passes.
- Code-side qualification includes fail-closed empty measurements, keyboard
  and screen-reader-landmark requirements, desktop-tier LCP/INP/CLS/FCP/TTFB
  thresholds, and reduced-motion handling. The source contains explicit
  `prefers-reduced-motion: reduce` rules for the public release flow and the
  organization dashboard shell.

## Local browser observation

The existing Verglos local browser page was loaded at
`http://127.0.0.1:3101/` in the connected Chrome DevTools session before that
page was closed. Its accessibility-tree snapshot exposed a named
`banner`/navigation, named links and sign-in control, a `main` region, the
level-one homepage heading, visible action controls, a named content region,
and the page's subsequent headings/lists/tables/FAQ content. No obvious
missing accessible name was observed in that snapshot.

The tab was no longer present when the trace/audit continuation was attempted;
the unrelated YouTube, Razorpay, and image tabs were not opened, navigated, or
otherwise touched. Therefore this record does **not** claim a new Lighthouse
score, browser Core Web Vitals trace, human screen-reader review, or large-data
browser run.

## Hosted Preview read-only boundary

Vercel inspection found the existing Ready Preview deployment
`dpl_CWUzbJ2myRqkXRMSu4KgVcS7zYi` at
`https://verglos-3uq086qc2-anuragyadav20062002s-projects.vercel.app` with target
`preview`. Protected `vercel curl --head` checks returned HTTP **200** for
`/`, `/detectors`, `/docs`, and `/checkout`. The responses identified the
expected Next/Vercel route, content type, security headers, and prerender/cache
behavior. Direct browser navigation was deployment-protection gated, so no
hosted browser measurement was inferred from the header checks.

## Acceptance boundary

This is current-head implementation and read-only qualification evidence only.
`QUAL-WEB-006` remains unchecked for the complete authenticated dashboard
route matrix, authorized human keyboard/screen-reader review, paid or
organization large-dataset rendering, responsive/loading/error-state review
across the required surfaces, a supported-environment browser performance
trace, and field Core Web Vitals. Existing production/account browser evidence
remains separate and is not silently merged into this run.

No score changed: **228 checked / 52 unchecked / 280 total (81.4%)**.
