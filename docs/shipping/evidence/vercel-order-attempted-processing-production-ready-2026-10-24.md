# Web attempted-order processing Production deployment · 2026-10-24

## Deployment receipt

Vercel deployment `dpl_2ij33gVtBZwcYSkwhY2g6uRAcfk1` reached **READY** for
Production and was aliased to `https://verglos.com`, `https://www.verglos.com`,
and the project aliases. It contains the Web main merge for PR #269,
`5c52423231e286b8e176535b8d97e14fa52bbb03`, whose source commit is `9005d5e`.
The build duration reported by Vercel was **1m 35s**.

## Read-only Production smoke

The following requests were made after the deployment became READY. No
credentials, payment creation, database write, customer state, or provider
write was used.

| Path | Status | Bytes | Response SHA-256 |
| --- | ---: | ---: | --- |
| `/` | 200 | 215245 | `sha256:8a7ac82c2efae89ae41b5d189b0320f21be29b2de2f79bbd8a3aaf7f4235b47d` |
| `/proof` | 200 | 24892 | `sha256:65a1f18cd76f99407c1118790fc4f20f97046ba634a33b4513e768b613796698` |
| `/checkout` | 200 | 13757 | `sha256:bc32560a782248bfa48dfb35a0eecd1f79012e7bc46be53083beb33c18fcdf4e` |
| `/llms.txt` | 200 | 4380 | `sha256:eeaf3b3f7239d075ef2effcd49d5d80dfaee714c8c10faf274bf464c793c28e8` |
| `/robots.txt` | 200 | 180 | `sha256:5e22ba5ed294bf64e20d8baa6f7808488d84190bd1297c8275a83120c218fa5c` |
| `/sitemap.xml` | 200 | 1345 | `sha256:ee318347a66a27a32519ede3eded5e9eba506e496bb3982b1856a3dc66a9661f` |
| `GET /api/razorpay/create-qr` | 405 | 0 | `sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |

The Production deployment is now live and the public surface is healthy. The
authenticated `order-status` route was not invoked with a production order;
its `attempted` mapping is covered by the merged focused route contract (**7/7**)
and the deployed source commit. No production payment or terminal provider
event was created.

This advances live Web runtime evidence only. It does not close provider
terminal lifecycle, independent review, authenticated-browser acceptance,
field-CWV, account-deletion, AppSec/Hunt, customer/recipient, or final-release
gates. No backlog checkbox changed; the authoritative score remains **245
checked / 35 open / 280 total (87.5%)**, with **13 AppSec-dependent / 22
non-AppSec** rows open.
