# QUAL-WEB-006 populated dashboard and transient capture v3 · 2026-10-24

## Bound execution

- Web implementation commit: `21f9cfb` (`fix(dashboard): harden populated qualification surfaces`).
- Web PR: #280, merged normally as `395e8252f80df68cb6ae1fe6f0d41f4b79980647`.
- Fixture: owner-controlled synthetic organization
  `qual-web-006-synthetic-20261024`, created additively in the configured test
  database; no customer repository, customer data, payment, or Production
  database write was used.
- Browser: Playwright Chromium, 1440×900 desktop and 390×844 mobile, with
  reduced motion enabled and the Preview-only authenticated test seam.
- Capture digest:
  `sha256:880f1652fb59a50e7136c2f25b1aae895aa228624e1d4306f8f1ba04fbef7ff6`.
- Raw capture: `qual-web-006-dashboard-synthetic-2026-10-24-v3.json`.

## Observed result

The browser captured all 13 authenticated dashboard routes in 52 measurements:

- 26 ready measurements: 13 desktop and 13 mobile;
- 13 loading measurements with the loading announcement observed;
- 13 error measurements with the error announcement observed;
- every ready route reported the seeded 100-row dataset total;
- Axe violations: **0**;
- keyboard operability, landmarks, reduced-motion, and responsive-layout
  checks: **52/52**.

The capture is browser-observed DOM/runtime output. It was not patched after
capture and does not contain credentials or source/customer content.

## Implementation corrections included in PR #280

- Normalize PostgreSQL aggregate timestamp strings before dashboard date
  formatting so populated Findings does not throw `Invalid time value`.
- Fail closed when a legacy/unknown policy lifecycle value has no action map.
- Give Alerts facts valid div label/value semantics and correct low-contrast
  muted text.
- Constrain the populated Record Upload and Records filter controls to the
  mobile viewport.

Local verification passed:

- `pnpm typecheck`;
- `pnpm test:dashboard-release` — **4/4**;
- `pnpm test:serial` — **904 passed / 24 designed database-dependent skips /
  0 failures / 928 total**;
- `pnpm build` — **49/49** routes;
- `git diff --check`.

## Qualification boundary

The strict dashboard qualifier remains **failed closed**. Accessibility and
state coverage are green, but the remote Neon test database produces
database-backed local TTFB/FCP/LCP breaches (the qualifier keeps its 800 ms
TTFB and 1,800/2,500 ms FCP/LCP limits), so the complete performance decision
is not claimed. This is a test-environment performance boundary, not a reason
to change the thresholds or manufacture a pass.

The hosted provider receipts are separate and real:

- Vercel Preview `dpl_DrzPfLuw8fzuRLxu6V5kWaZGd7BF` is **READY** for the
  merged Web implementation.
- Vercel Production `dpl_Aw8Coq1UJV2XPKDpN8s8RemXhgmu` is **READY**, aliased
  to `https://verglos.com`, `https://www.verglos.com`, and
  `https://verglos-web.vercel.app`.

These receipts advance implementation/provider evidence only. QUAL-WEB-006
remains unchecked for field-CWV/human review, independent review, and final
acceptance. No GitHub Actions run was started or used, and no existing file,
branch, artifact, customer record, or deployment was deleted.
