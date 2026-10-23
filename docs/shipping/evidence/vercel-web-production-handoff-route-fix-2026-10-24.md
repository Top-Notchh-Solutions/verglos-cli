# Vercel Production public handoff route fix — 2026-10-24

## Scope

The `/handoff/[handoffId]` page is explicitly a public recipient surface. It
does no server-side lookup; the opaque handoff ID and one-time token are
admitted together by the guarded acknowledgement API. Production returned
HTTP **404** for the route because Clerk middleware omitted `/handoff` from its
public matcher.

Web commit `4d091d2c2139ba6b84eb7a303f33ad3f6faff0e4` adds
`/handoff(.*)` to the middleware public allowlist and extends the public-release
smoke contract. Web PR **#263** merged normally into `main` as
`73d4c9a4b1f0594eecd0689d4495269893e2b5c0`.

## Local implementation checks

- `pnpm test:public-release-smoke`: **12/12** passed.
- `pnpm test:truth-registry`: **37/37** passed.
- `pnpm typecheck`: passed.
- `git diff --check`: passed.

## Production provider receipt

The post-merge Vercel Production deployment
`verglos-gvgmi5d5g-anuragyadav20062002s-projects.vercel.app` reported
**READY** and owns the live aliases `verglos.com`, `www.verglos.com`, and
`verglos-web.vercel.app`. The build generated **49/49** static pages and
completed successfully.

Read-only HTTP verification against `https://verglos.com` at
`2026-10-23T20:41Z` returned:

| Request | Status | Result |
| --- | ---: | --- |
| `GET /handoff/00000000-0000-0000-0000-000000000000` | 200 | public `Acknowledge a delivery` page rendered; no lookup performed |
| `GET /record/verify/00000000-0000-0000-0000-000000000000` | 404 | forged receipt remains safely absent |
| `GET /cli-auth` | 307 | login handoff remains live |
| `GET /proof` | 200 | public proof route remains live |

The verification was GET-only. No token was submitted, no handoff was
acknowledged, and no payment, database, account, entitlement, webhook,
customer, or final CLI/npm release action was performed.

## Shipping disposition

This corrects the concrete Production public recipient-route boundary and
records a live hosted page. It advances hosted/runtime implementation evidence,
but does not close a backlog checkbox by itself: recipient/customer acceptance,
independent review, human/field, and final-release gates remain governed by
their row contracts. No customer acceptance or AppSec/Hunt result is claimed.
