# FINAL-WEB-007/008 Vercel Production promotion receipt — 2026-10-24

## Scope

- Provider: Vercel project `anuragyadav20062002s-projects`, production deployment
  `dpl_Aw8Coq1UJV2XPKDpN8s8RemXhgmu`.
- Observation time: `2026-10-24T03:39:09Z`.
- This receipt records the provider's actual production state and a bounded
  promotion/idempotency check. It does not claim a new public release.

## Provider action and result

Command executed from the clean Web worktree:

```text
vercel promote dpl_Aw8Coq1UJV2XPKDpN8s8RemXhgmu --yes --timeout 3m
```

The provider returned:

```text
Error: The provided deploymentId (dpl_Aw8Coq1UJV2XPKDpN8s8RemXhgmu) is already the current production deployment. (409)
```

This is an idempotency receipt: Vercel confirmed that the deployment is
already the current Production deployment, so no alias, build, payment,
database, or release state was mutated by this command.

## Provider inspection

`vercel inspect dpl_Aw8Coq1UJV2XPKDpN8s8RemXhgmu --json` reported:

- `target`: `production`
- `readyState`: `READY`
- active aliases: `verglos.com`, `www.verglos.com`,
  `verglos-web.vercel.app`,
  `verglos-web-anuragyadav20062002s-projects.vercel.app`, and
  `verglos-web-git-main-anuragyadav20062002s-projects.vercel.app`

## Read-only public sweep

The following requests were made with Node `fetch` and did not mutate data:

| Endpoint | Status | Content type | Bytes |
| --- | ---: | --- | ---: |
| `/` | 200 | `text/html; charset=utf-8` | 215245 |
| `/docs` | 200 | `text/html; charset=utf-8` | 68839 |
| `/detectors` | 200 | `text/html; charset=utf-8` | 37545 |
| `/proof` | 200 | `text/html; charset=utf-8` | 24892 |
| `/verify` | 200 | `text/html; charset=utf-8` | 15806 |
| `/checkout` | 200 | `text/html; charset=utf-8` | 13784 |
| `/robots.txt` | 200 | `text/plain` | 180 |
| `/sitemap.xml` | 200 | `application/xml` | 1345 |
| `/llms.txt` | 200 | `text/markdown; charset=utf-8` | 4380 |

## Shipping disposition

This advances the real provider-production-state and public-availability
evidence for `FINAL-WEB-007` and `FINAL-WEB-008`. It does not close either row:
human screen-reader and field-CWV evidence, recipient/customer acceptance,
independent review, and final release/go-no-go remain separate requirements.
No checkbox changed; the authoritative score remains **245 checked / 35 open /
280 total (87.5%)**, split **13 AppSec-dependent / 22 non-AppSec**.

No paid GitHub Actions run, customer data, payment, npm publication, tag,
final release, database mutation, or deletion occurred.
