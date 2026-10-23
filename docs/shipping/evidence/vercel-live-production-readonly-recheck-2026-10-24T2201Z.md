# Live Vercel Production read-only recheck · 2026-10-24T22:01:42Z

## Deployment observation

Vercel reported the latest `verglos-web` Production deployment as **READY**;
the observed source branch deployment is bound to Web commit
`791500d4dbc495312287287f692a6fc39120e3a2`. The merged `main` deployment at
Web commit `98b5cf652623bf4f000ed93366b67a38154579e1` was also reported READY.

## Read-only probes

All requests were unauthenticated `GET` requests to `https://verglos.com`.
Response bodies were hashed locally; no response body or secret was persisted.

| Path | Status | Bytes | SHA-256 |
| --- | ---: | ---: | --- |
| `/` | 200 | 215245 | `0475bc684343664dbe99641eef6084423d33f2ef6a1e0e307ca0b28d53e4fe3d` |
| `/proof` | 200 | 24892 | `6e3ab85c9b468507e952c8987daf54d3e8c094c73c68fd313377b689d947a502` |
| `/llms.txt` | 200 | 4380 | `eeaf3b3f7239d075ef2effcd49d5d80dfaee714c8c10faf274bf464c793c28e8` |
| `/robots.txt` | 200 | 180 | `5e22ba5ed294bf64e20d8baa6f7808488d84190bd1297c8275a83120c218fa5c` |
| `/sitemap.xml` | 200 | 1345 | `daf46485a006e0106b6377d83a753cb3021f24a4b8d40fb2474e786f515279bf` |
| `/api/razorpay/create-qr` | 405 | 0 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |

The 405 is the expected method boundary for a GET against a POST-only payment
route. No deployment, alias, environment, database, payment, webhook,
customer, account, or release-publication write occurred. This is current
Production surface evidence only; it does not create provider lifecycle,
customer/recipient, human/field, independent-review, AppSec/Hunt, or final
release evidence. No backlog checkbox changes; score remains **245 checked /
35 open / 280 total (87.5%)**.

