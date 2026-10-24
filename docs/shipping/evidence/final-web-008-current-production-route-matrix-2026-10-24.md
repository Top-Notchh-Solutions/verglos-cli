# FINAL-WEB-008 · current Production route matrix

Date: 2026-10-24

## Receipt

Against the Ready Vercel Production deployment
`dpl_G97rLhokYPQ93y6RHqj2f8kQZyrM`, aliased to `https://verglos.com`, a
read-only route matrix returned:

| Route | Method | Result |
| --- | --- | --- |
| `/` | GET | 200 |
| `/docs` | GET | 200 |
| `/docs/2.0.0` | GET | 200 |
| `/proof` | GET | 200 |
| `/llms.txt` | GET | 200 |
| `/robots.txt` | GET | 200 |
| `/sitemap.xml` | GET | 200 |
| `/api/razorpay/create-qr` | GET | 405, expected method refusal |
| `/api/razorpay/create-qr` | POST `{}` | 403, refused without a payment payload |

The live `/llms.txt` response also contains the corrected stable/prerelease
version wording recorded in
`final-web-005-008-npm-truth-production-deployment-2026-10-24.md`.

## Boundary

This was a read-only Production smoke. No payment, customer data, database
write, npm publication, deletion, AppSec review, or final release decision
occurred. FINAL-WEB-008 remains unchecked for its declared dependencies,
independent/acceptance evidence, and final release gates. Score remains
**246 checked / 34 open / 280 total (87.9%)**.
