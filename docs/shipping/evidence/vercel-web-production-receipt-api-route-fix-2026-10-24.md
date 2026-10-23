# Vercel Production public receipt API route fix — 2026-10-24

## Scope

The bounded public `GET /api/v1/receipts/[receiptId]` route is the JSON
counterpart of the public redacted receipt page. Its route handler already
returns a safe not-found response without exposing receipt data, but Clerk
middleware omitted `/api/v1/receipts` from the public matcher. Before this
fix, a request reached the middleware HTML `404` boundary instead of the
implemented JSON route boundary.

Web commit `74239c898cb073626f08f169c5451c587dced607` adds
`/api/v1/receipts(.*)` to the public matcher and extends the public-release
smoke contract. Web PR **#264** merged normally into `main` as
`9985f1f7030de66f5f8d07b01705f65c678f1369`.

## Local implementation checks

- `pnpm test:public-release-smoke`: **12/12** passed.
- `pnpm test:truth-registry`: **37/37** passed.
- `pnpm typecheck`: passed.
- `git diff --check`: passed.

## Production provider receipt

The post-merge Vercel Production deployment
`verglos-m2zim7kjt-anuragyadav20062002s-projects.vercel.app` reported
**READY**, owns the live aliases `verglos.com`, `www.verglos.com`, and
`verglos-web.vercel.app`, and generated the current Production build. The
exact-fix promotion was also created for commit `74239c8`; the merged `main`
deployment is the live alias deployment.

Read-only HTTP verification against `https://verglos.com` at
`2026-10-23T20:45:43Z` returned:

| Request | Status | Result |
| --- | ---: | --- |
| `GET /api/v1/receipts/00000000-0000-0000-0000-000000000000` | 404 | JSON `{\"ok\":false,\"reason\":\"receipt not found\"}`; `application/json`; `no-store` |

The all-zero identifier is a forged/nonexistent probe. This verifies the
public route boundary and safe absence response; it does not claim that a
real receipt exists and does not enumerate or read receipt data. The request
was GET-only. No receipt was created, no database/payment/account/entitlement
state changed, and no customer, final CLI/npm release, or AppSec action was
performed.

## Shipping disposition

This corrects a concrete Production API boundary and records a live hosted
JSON route response. It advances hosted/runtime implementation evidence for
the receipt and final-web contracts, but does not close a backlog checkbox by
itself: provider lifecycle completion, recipient/customer acceptance,
independent review, human/field evidence, and final-release gates remain
governed by their row contracts. No customer acceptance or AppSec/Hunt result
is claimed.
