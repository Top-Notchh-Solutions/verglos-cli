# STUDIO-CLI-001 handoff expiry-fence implementation evidence — 2026-10-24

## Implementation

Web PR #286, `fix(handoff): fence acknowledgement expiry at write`, merged
normally into `main` as merge commit `ce973942c94d889a5eaa0610618a96ce4d38c509`.
Source commit `fc89c93` makes the public acknowledgement compare-and-set
require `expires_at > acknowledgedAt` inside the transaction. The route also
uses an exact-time expiry boundary, so a request read before expiry cannot be
committed after expiry and an acknowledgement at the exact expiry instant is
rejected.

## Verification

- Handoff domain and route contract suite: **30/30 passed**.
- Web TypeScript check: `pnpm exec tsc --noEmit` passed.
- `git diff --check`: passed.
- No real recipient, customer, provider, or Production handoff was used.
- GitHub Actions runs failed/blocked immediately under the current account
  budget state; no paid run was allowed to continue.

## Shipping disposition

This is real STUDIO-CLI-001 production-code hardening, not a checkbox closure.
The row remains open for an authorized recipient acknowledgement, independent
audit/review, and final release sign-off. Score remains **246 checked / 34 open
/ 280 total (87.9%)**, split **13 AppSec-dependent / 21 non-AppSec**. Nothing
was deleted or overwritten.
