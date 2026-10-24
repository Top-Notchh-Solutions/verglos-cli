# FINAL-WEB-007/008 production availability recheck — 2026-10-24

## Scope

This is a read-only production availability receipt for the already deployed
Web candidate. It did not deploy, promote, rollback, mutate the database, run
GitHub Actions, publish npm, or change any customer data.

- Vercel deployment: `dpl_Aw8Coq1UJV2XPKDpN8s8RemXhgmu`
- Deployment target/status: `production` / `Ready`
- Production aliases: `https://verglos.com`, `https://www.verglos.com`,
  `https://verglos-web.vercel.app`
- Web source recorded by the existing deployment receipt: `21f9cfb`

## Read-only HTTP receipt

Node's built-in HTTPS fetch followed redirects and checked each endpoint on
2026-10-24. Every endpoint returned HTTP 200:

| Endpoint | HTTP | Response bytes |
| --- | ---: | ---: |
| `/` | 200 | 215245 |
| `/docs` | 200 | 68839 |
| `/detectors` | 200 | 37545 |
| `/proof` | 200 | 24892 |
| `/verify` | 200 | 15806 |
| `/checkout` | 200 | 13784 |
| `/robots.txt` | 200 | 180 |
| `/sitemap.xml` | 200 | 1345 |
| `/llms.txt` | 200 | 4380 |

The deployment inspection also reported the production target as Ready and the
public aliases above. The earlier multi-browser receipt remains the source for
Chromium/Firefox/WebKit, Axe, keyboard, and INP measurements.

## Disposition

This strengthens automated production/provider availability evidence for
`FINAL-WEB-007` and `FINAL-WEB-008`. It does not prove human screen-reader or
field-CWV performance, customer/recipient acceptance, independent review,
AppSec/Hunt review, or final release/go-no-go sign-off. No checkbox changed.

The focused local acceptance contract run passed **31/31**. The authoritative
shipping score remains **245 checked / 35 open / 280 total (87.5%)**, split into
**13 AppSec-dependent / 22 non-AppSec** open rows.
