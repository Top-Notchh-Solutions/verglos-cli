# PLAN-WEB-013 payment method catalog · 2026-10-07

## Scope

This batch extends the existing Razorpay hosted-checkout catalog on Web PR
#149 from the QR-only surface toward provider-hosted payment methods. The
server remains authoritative: only configured and catalog-supported hosted
methods are exposed to checkout. Recognized but unqualified or unsupported
methods remain fail-closed. No provider, database, production, deployment,
payment, or browser mutation was performed.

## Code and hosted evidence

- Repository: `verglos-web`, branch `feat/web-plan-013-hosted-checkout`.
- Exact head: `db68157da039d8aab939818f9023f867028e4432`.
- PR: #149, open, merge state `CLEAN`, intentionally not merged.
- Hosted workflow: `37563023349`, job `112604384062`, passed.
- Hosted checks: typecheck, serial tests, negative-boundary/truth checks,
  database/schema and ordered-migration checks, production build,
  public-boundary audit, dependency audit, CycloneDX SBOM, license inventory
  and tests, tracked-secret guard, Vercel, GitGuardian, and Preview Comments.
- Local: focused payment/runtime tests 25/25; negative boundary 2/2; truth
  registry 25/25; serial 850 pass / 22 explicit skips / 0 fail; typecheck;
  Drizzle check; 31 ordered migrations; production build 40 pages; diff
  check.

## Acceptance boundary

`PLAN-WEB-013` is attempted but remains open. Hosted catalog support is
code-level only: UPI, card, netbanking, wallet, and EMI are represented as
hosted candidates, while UPI QR and other approval-dependent methods are
recognized but not exposed as supported checkout methods without explicit
qualification. There is still no account-enabled method configuration proof,
provider test transaction/lifecycle evidence, webhook replay evidence, or
production reconciliation. `PLAN-WEB-014` and `PLAN-WEB-015` therefore remain
open, and no backlog checkbox changed.

Authoritative backlog at capture: **218 checked / 62 unchecked / 280 total**.
