# PLAN-WEB-012 out-of-order payment ledger qualification · 2026-10-08

## Scope

Web PR #161 merged as `ec02cacf69f3adb0d8df5ccb36a1a4eb5ef4cc3f` from source
head `396d72e`. The batch covers one code-side lifecycle invariant:

- a later captured event promotes the same immutable provider-payment row after
  an earlier failed event;
- a failure delivered after capture or refund is an idempotent no-op when the
  commercial binding is exact;
- the payment identity, signed checkout snapshot, and entitlement serialization
  remain unchanged.

## Evidence

- A disposable local PostgreSQL 15 container was explicitly bootstrapped with
  the reviewed legacy baseline and all **38** ordered Web migrations.
- The real ledger integration passed **1/1**: failed → captured granted exactly
  one entitlement; captured → late failed preserved the captured state; refund
  ordering and the final entitlement projection remained correct.
- The real Razorpay webhook-handler integration passed **2/2**, including the
  same failed → captured → late-failed sequence through the handler.
- The focused payment suite passed **54/54**.
- Local typecheck, Drizzle schema check, migration ordering check, diff check,
  and production build passed.
- The repository safe-default serial suite passed **861/884**, with **23
  environment-gated skips** and **0 failures**. Hosted Verify run
  `37781035716` passed typecheck/schema, serial, private-runner E2E,
  negative-boundary, truth-registry, build, dependency, license, SBOM,
  public-boundary, and tracked-secret checks.

## Boundary

This is implementation and isolated synthetic-event evidence only. It does not
prove an account-enabled Razorpay method, live Test Mode success/capture/refund
or renewal, provider webhook delivery, production reconciliation, or release
acceptance. No production database, provider, payment, entitlement,
deployment, or credential state was changed. PLAN-WEB-011/012/014/015 remain
open and the backlog remains **218 checked / 62 unchecked / 280 total
(77.9%)**.
