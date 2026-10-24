# Vercel Production public-surface recheck · 2026-10-24T07:17Z

## Read-only provider receipt

Vercel CLI `59.25.4` inspected the `verglos.com` deployment and reported
`readyState: READY`. No deployment, environment-variable, database, payment,
customer, or provider write was performed.

The live HTTPS checks returned the following bounded results:

| Route | Status | Bytes | Body SHA-256 |
| --- | ---: | ---: | --- |
| `/` | 200 | 215245 | `sha256:7ce7f7e730fa1b995fd17026dc89b8d89f64a1dc57fe232b8589b462f8bb1f8c` |
| `/proof` | 200 | 24892 | `sha256:c61459e0b694ad2e52c445008fbe6d7a5c5659544f53e3c222458639e4174e73` |
| `/checkout` | 200 | 13784 | `sha256:d75a324a25df51a67b35c2401320665c066b2d3c33b94be5c69c2018a50fd9b9` |
| `/llms.txt` | 200 | 4380 | `sha256:eeaf3b3f7239d075ef2effcd49d5d80dfaee714c8c10faf274bf464c793c28e8` |
| `/robots.txt` | 200 | 180 | `sha256:5e22ba5ed294bf64e20d8baa6f7808488d84190bd1297c8275a83120c218fa5c` |
| `/sitemap.xml` | 200 | 1345 | `sha256:9606b817e6f1396815d5f2ab34072ab97db57ae278bbe0a6d61f2bbdf3404683` |
| `/api/razorpay/create-qr` GET | 405 | 0 | `sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |

## Boundary

This is read-only hosted availability and public-surface evidence. It does
not create authenticated browser acceptance, human screen-reader or field-CWV
evidence, provider payment lifecycle completion, customer/recipient consent,
independent review, AppSec/Hunt review, or final release sign-off. No checkbox
changed; score remains **246 checked / 34 open / 280 total (87.9%)**, split
**13 AppSec-dependent / 21 non-AppSec**.
