# Vercel production/Preview read-only reconciliation · 2026-10-08

## Scope

Read-only Vercel CLI inspection of the linked `verglos-web` project and its
latest deployments. No environment value was retrieved, printed, changed, or
written; no deployment was started; no provider or database request was made.

## Current state

- Linked project inspection succeeded with the existing local Vercel session.
- Latest Production deployment `dpl_GQSb8NahZMKUdabYQSKJLyXpP9r1` is
  `READY`, targets `production`, and aliases `verglos.com` and
  `www.verglos.com`.
- The deployment is built from merged Web commit
  `51bb6fe701b65ffcb2a322e1ff5d67eeb99df3fe` (PR #157).
- Production variable-name inventory contains `DATABASE_URL`, the Razorpay
  key/webhook names, and `RAZORPAY_ENABLED_PAYMENT_METHODS`. Only presence was
  checked; values were not read or compared.
- Preview variable-name inventory contains `DATABASE_URL`, the Razorpay
  credential/webhook names, and no `RAZORPAY_ENABLED_PAYMENT_METHODS`. Preview
  therefore remains fail-closed for payable checkout until its isolated test
  setup is deliberately provisioned.

## Limits and disposition

Variable-name presence does not prove that the production database credential
was revoked, that Preview and Production use different databases, or that the
provider account enables every configured method. No live provider lifecycle,
payment, webhook, entitlement, migration, or database evidence was obtained.
No backlog checkbox changed; `PLAN-WEB-011/012/013/014/015` and R-041 remain
open. Backlog remains **218 checked / 62 unchecked / 280 total (77.9%)**.
