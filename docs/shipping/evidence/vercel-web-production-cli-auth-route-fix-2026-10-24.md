# Vercel Production CLI-auth route fix — 2026-10-24

## Scope

The public-release route inventory includes `/cli-auth`, and the page has an
explicit unauthenticated redirect to `/login`. Production route probing found
that `https://verglos.com/cli-auth` returned HTTP **404** because Clerk
middleware omitted `/cli-auth` from its public matcher. The missing matcher
prevented the page's intended redirect from running.

Web commit `d05ddbdc2e86b779b9f9f0c0a7ea25027373f2b2` adds
`/cli-auth(.*)` to the middleware public allowlist and adds the same boundary
to the public-release smoke contract. Web PR **#261** merged normally into
`main` as `2f88ec0964d44d0ebfdfcbba1fec9637c7de98f0`.

## Local implementation checks

- `pnpm test:public-release-smoke`: **12/12** passed.
- `pnpm test:truth-registry`: **37/37** passed.
- `pnpm typecheck`: passed.
- `git diff --check`: passed.

## Production provider receipt

The owner-managed Vercel project `verglos-web` reported the exact fix
deployment `verglos-8ypaexw6u-anuragyadav20062002s-projects.vercel.app`
**READY** in Production. The post-merge `main` deployment
`verglos-6bt08pwsb-anuragyadav20062002s-projects.vercel.app` also reported
**READY** and became the live Production alias. The Vercel build completed
with valid Production runtime configuration, generated all **49/49** static
pages, and completed deployment successfully.

Read-only HTTP verification against `https://verglos.com` at
`2026-10-23T20:29Z` returned:

| Request | Status | Result |
| --- | ---: | --- |
| `GET /cli-auth` | 307 | redirects to `/login?redirect_url=%2Fcli-auth` |
| `GET /cli-auth?user_code=ABCD-1234` | 307 | preserves the bounded code in the login redirect |
| `GET /proof` | 200 | public proof route remains live |
| `GET /` | 200 | public homepage remains live |
| `GET /checkout` | 200 | checkout page remains live; no checkout submitted |

The verification was GET-only. No payment, database, account, entitlement,
webhook, customer, or final CLI/npm release action was performed.

## Shipping disposition

This closes the concrete Production CLI-auth routing defect and records hosted
Production evidence for the login handoff. It advances the Web hosted/runtime
implementation evidence, but does not by itself close a backlog checkbox:
acceptance, independent review, customer/recipient, human/field, and final
release gates remain governed by their row contracts. No customer acceptance or
AppSec/Hunt result is claimed.
