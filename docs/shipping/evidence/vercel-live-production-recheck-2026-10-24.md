# Vercel live Production read-only recheck · 2026-10-24

## Observed provider state

At `2026-10-23T21:42:42Z` (`2026-10-24 03:12:42 IST`), Vercel CLI
`59.25.4` inspected the linked `verglos-web` project. Deployment
`dpl_4kPkUBoDBWQi5Vm7F4snTq3yxwn3` reported `target: production` and
`readyState: READY`, with aliases `verglos.com`, `www.verglos.com`,
`verglos-web.vercel.app`, and the linked Vercel project aliases. The previously
recorded migration deployment `dpl_37JwVaAw25BoYn4Ase9bn9usm4WL` also reported
`target: production` and `readyState: READY`.

No deployment, alias, environment variable, database, payment, account,
entitlement, customer, or release-publication write was performed during this
recheck. The provider operation was inspection plus read-only HTTP requests.

## Live route observations

| Route | HTTP status | Bytes | Content type | Body SHA-256 |
| --- | ---: | ---: | --- | --- |
| `/` | 200 | 215245 | `text/html; charset=utf-8` | `0475bc684343664dbe99641eef6084423d33f2ef6a1e0e307ca0b28d53e4fe3d` |
| `/proof` | 200 | 24892 | `text/html; charset=utf-8` | `6e3ab85c9b468507e952c8987daf54d3e8c094c73c68fd313377b689d947a502` |
| `/llms.txt` | 200 | 4380 | `text/markdown; charset=utf-8` | `eeaf3b3f7239d075ef2effcd49d5d80dfaee714c8c10faf274bf464c793c28e8` |
| `/robots.txt` | 200 | 180 | `text/plain` | `5e22ba5ed294bf64e20d8baa6f7808488d84190bd1297c8275a83120c218fa5c` |
| `/sitemap.xml` | 200 | 1345 | `application/xml` | `daf46485a006e0106b6377d83a753cb3021f24a4b8d40fb2474e786f515279bf` |

The landing response identified `server: Vercel`, `x-vercel-cache: HIT`, and a
normal Vercel request ID. These are hosted-surface observations only.

## Shipping disposition

This is fresh live provider/runtime evidence for the public Web surfaces. It
does not create customer or recipient acceptance, authenticated deletion,
commercial acceptance, human screen-reader or field-CWV evidence, independent
review, AppSec/Hunt evidence, or final release/go-no-go approval. No backlog
checkbox changes; the authoritative score remains **245 checked / 35 open /
280 total (87.5%)**, partitioned as **13 AppSec-dependent / 22 open
non-AppSec** rows. Nothing was deleted or overwritten.
