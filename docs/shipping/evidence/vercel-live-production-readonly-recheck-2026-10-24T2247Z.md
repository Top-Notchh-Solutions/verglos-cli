# Live Vercel Production read-only recheck · 2026-10-24T22:47:41Z

## Deployment observation

Vercel deployment `dpl_EAgP2Crg4EmSJgWVLeQpMWCss9Uf` was inspected as
**READY** and owns the `https://verglos.com` Production alias. The probe below
was unauthenticated and read-only; response bodies were hashed locally and no
body or secret was persisted.

## Read-only probes

| Path | Status | Bytes | SHA-256 |
| --- | ---: | ---: | --- |
| `/` | 200 | 215245 | `c6812180d7595ec5ced393fa9b25507b5fc57ecf721c77f8fedf36c95f187d02` |
| `/proof` | 200 | 24892 | `eee9f35a48239e41ef2b9f5d0c0ff04bfe9dd6a6be5a8290ac4bc3a8e08a4d54` |
| `/checkout` | 200 | 13757 | `0f36d6de4b6580e72ea251854a0547849b6b5479e13e3903fa341a0b03e82062` |
| `/llms.txt` | 200 | 4380 | `eeaf3b3f7239d075ef2effcd49d5d80dfaee714c8c10faf274bf464c793c28e8` |
| `/robots.txt` | 200 | 180 | `5e22ba5ed294bf64e20d8baa6f7808488d84190bd1297c8275a83120c218fa5c` |
| `/sitemap.xml` | 200 | 1345 | `dc55c82771d3af4e46b616263679278f8dc19d6fd742ce9bf146ef2b2c4231a8` |
| `/api/razorpay/create-qr` (GET) | 405 | 0 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |

The `405` is the expected method boundary for a GET against the POST-only QR
route. No deployment, alias, environment, database, payment, webhook,
customer, account, or publication write occurred. This is current Production
surface evidence only; it does not create provider lifecycle,
customer/recipient, human/field, independent-review, AppSec/Hunt, or final
release evidence. No backlog checkbox changes; score remains **245 checked /
35 open / 280 total (87.5%)**.
