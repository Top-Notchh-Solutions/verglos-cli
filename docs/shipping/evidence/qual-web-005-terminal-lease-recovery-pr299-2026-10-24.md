# QUAL-WEB-005 terminal lease recovery · Web PR #299 · 2026-10-24

## Scope

This packet records a production-code correction for the account-deletion
worker. It is implementation and provider/Production evidence only. It does
not claim customer deletion, customer-held operation, independent review,
AppSec/Hunt review, recovery acceptance, or final release sign-off.

## Implementation

- Pull request: `https://github.com/anuragyadav-git/verglos-web/pull/299`.
- Implementation commit: `eb7e97403eae833c249446c9e5de6f6991dcc963`.
- Normal merge commit: `e178e2ec55b19c6ad4bac455ef38a39b079f4368`.
- Defect: a worker could disappear after taking its final lease, leaving a
  `running` job that the batch selector excluded forever because
  `attempt >= max_attempts`.
- Fix: expired terminal leases are atomically reaped as `dead-lettered`, stale
  lease ownership is cleared, and the bounded
  `ACCOUNT_DELETION_LEASE_EXPIRED` code is recorded. Batch selection includes
  these terminal-expiry candidates and reports the dead-letter result.

## Verification

- Focused worker/store/privacy contracts passed **38/38**.
- Isolated PostgreSQL integration passed **1/1**, including batch reaping of
  an expired final lease and verification of the cleared lease plus stable
  error code.
- Web typecheck passed.
- `git diff --check` passed.
- The integration used the disposable local PostgreSQL container only. No
  customer or Production database deletion was performed.

## Provider boundary

The merged Web commit reached Vercel Production:

- Deployment: `dpl_4tcfvRdXWh68ALPY1VaTCqCJPS1e`.
- URL: `https://verglos-9vcij5054-anuragyadav20062002s-projects.vercel.app`.
- State: **READY**, target `production`.
- Read-only matrix: canonical `verglos.com` **6/6 HTTP 200**; `www` **6/6
  HTTP 308**; exact deployment hostname **6/6 HTTP 302** behind Vercel SSO.
- GitHub Actions runs failed at the blocked budget/runner boundary and were
  not rerun.

`QUAL-WEB-005` remains unchecked for authorized Production/customer-held
operation, independent review, recovery/rollback acceptance, and final
release evidence. Score remains **246 checked / 34 open / 280 total (87.9%)**,
split **13 AppSec-dependent / 21 non-AppSec**. Nothing was deleted or
overwritten.
