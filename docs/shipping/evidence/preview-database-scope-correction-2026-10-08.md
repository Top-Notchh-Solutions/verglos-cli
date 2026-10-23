# Preview database scope correction · 2026-10-08

## Scope

Repaired the linked Vercel project's Preview configuration without changing
Production values or contacting Razorpay.

## Changes and verification

- Removed the `preview` target from `DATABASE_URL`; metadata now shows the
  variable targeted only at `production`.
- Production retained `DATABASE_URL`; its encrypted value was not read or
  printed.
- Created fresh Preview deployment
  `dpl_5Wtw7ezHfiTzsTEKUneBmcSPnQ1f` from Web commit `1e2b392`.
- Vercel build completed `READY`; runtime validation reported
  `Preview runtime configuration is safe or payment-disabled.`
- Protected read-only `/checkout` verification returned:
  `unavailable=true`, `hosted_methods=false`, `test_banner=false`.
- The deployment built 43 pages and made no provider, payment, entitlement,
  database, migration, or Production write.

## Limits

Historical Preview deployment URLs remain listed in Vercel and were not
deleted or individually inspected for their frozen environment snapshots. The
fresh/current Preview path is fail-closed, but project-wide historical
deployment isolation is not claimed until those deployments are expired or
deleted under an explicit cleanup decision. An isolated non-production
database is still required before enabling Test Mode payment methods.

## Disposition

No backlog checkbox changed. `PLAN-WEB-014/015` remain open, as do R-041's
old-credential-revocation and read-only-verification requirements. Backlog
remains **218 checked / 62 unchecked / 280 total (77.9%)**.
