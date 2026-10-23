# Vercel Production proof-route fix — 2026-10-24

## Scope

This receipt records an owner-authorized Production correction for the public
proof surface. The live `verglos.com/proof` route returned HTTP 404 even though
the merged Web source contained `src/app/proof/page.tsx`. The Clerk middleware
public-route matcher omitted `/proof`, so the public page was treated as a
protected route in Production.

The fix adds `/proof(.*)` to the public route allowlist in Web commit
`6228bccb2f91255ba446690d676706d523981aa1`. Web PR **#260** merged normally
into `main` as `fb6ff569e4a7bf108d95b5a7680c9f4130bbf8d5`.

## Local implementation checks

- `pnpm test:truth-registry`: **37/37** passed.
- `pnpm test:public-release-smoke`: **12/12** passed.
- `pnpm typecheck`: passed.
- `git diff --check`: passed.
- No payment, database, account, entitlement, customer, webhook, or release
  mutation was performed by the fix or its verification.

## Production provider receipt

The exact fix commit was deployed to the owner-managed Vercel project
`verglos-web` as Production deployment
`verglos-60uvuqcmu-anuragyadav20062002s-projects.vercel.app`. Vercel reported
the deployment **READY** and attached the aliases `verglos.com`,
`www.verglos.com`, and `verglos-web.vercel.app`. The post-merge `main`
deployment `verglos-6f0mwxc43-anuragyadav20062002s-projects.vercel.app` also
reported **READY** and became the live Production alias.

Read-only HTTP verification against `https://verglos.com` at
`2026-10-23T20:19Z` returned:

| Route | Status | Result |
| --- | ---: | --- |
| `/` | 200 | public homepage served |
| `/proof` | 200 | body contained `Public proof assets`; 24,892 bytes |
| `/checkout` | 200 | checkout page served; no checkout submitted |
| `/llms.txt` | 200 | Markdown surface served |
| `/robots.txt` | 200 | text surface served |
| `/sitemap.xml` | 200 | XML surface served |

Vercel Production build logs reported valid Production runtime configuration,
Next.js build success, and **49/49** static pages generated. The verification
was GET-only. No payment/provider lifecycle, database, customer, account,
entitlement, webhook, or final CLI/npm release action was performed.

## Shipping disposition

This closes the concrete Production routing defect and records real hosted
Production evidence for the public Web surfaces. It advances
`FINAL-WEB-006`, `FINAL-WEB-007`, and `FINAL-WEB-008` implementation/hosted
evidence, but does not by itself close those rows: their declared acceptance,
human/field, independent-review, dependency, and final-release gates remain
open. It does not alter the AppSec/Hunt hold or claim customer acceptance.

Evidence captured by the owner-controlled Production action; no external
customer or independent reviewer is represented.
