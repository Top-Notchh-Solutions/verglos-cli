# Vercel Production public receipt route fix — 2026-10-24

## Scope

The public-release manifest includes `/record/verify/[receiptId]`, and the
page is explicitly a public redacted receipt view with non-indexing metadata,
bounded receipt identity validation, and content-digest verification. The
Clerk middleware public matcher omitted `/record/verify`, so a valid public
receipt could not reach the page handler and the route boundary was not
actually deployed as public.

Web commit `f381c965469800ea7135b0801ff39fba17a00572` adds
`/record/verify(.*)` to the middleware public allowlist and extends the
public-release smoke contract to require all three public protected-boundary
entries. Web PR **#262** merged normally into `main` as
`58c4832ab8c40362867854e916c0a7ce561f3e2e`.

## Local implementation checks

- `pnpm test:public-release-smoke`: **12/12** passed.
- `pnpm test:truth-registry`: **37/37** passed.
- `pnpm typecheck`: passed.
- `git diff --check`: passed.

## Production provider receipt

The owner-managed Vercel project `verglos-web` reported the exact fix
deployment `verglos-3o64st7ht-anuragyadav20062002s-projects.vercel.app`
**READY** in Production. The post-merge `main` deployment
`verglos-9bhwsngsr-anuragyadav20062002s-projects.vercel.app` also reported
**READY** and owns the live aliases `verglos.com`, `www.verglos.com`, and
`verglos-web.vercel.app`. The Production build generated **49/49** static
pages and completed successfully.

Read-only route verification used a forged all-zero receipt identity and
continued to return the expected HTTP **404** boundary; no receipt identifier
was enumerated and no database or receipt data was read or written. The
deployed source/build receipt and the smoke contract prove that the public
route now reaches the intended public route boundary; a successful 200 receipt
view requires an existing authorized receipt and was not fabricated here.

The verification was read-only. No payment, database, account, entitlement,
webhook, customer, or final CLI/npm release action was performed.

## Shipping disposition

This corrects the concrete Production public-route boundary and records the
hosted deployment. It advances Web hosted/runtime implementation evidence, but
does not close a backlog checkbox by itself: valid receipt acceptance,
customer/recipient, independent-review, human/field, and final-release gates
remain governed by their row contracts. No customer acceptance or AppSec/Hunt
result is claimed.
