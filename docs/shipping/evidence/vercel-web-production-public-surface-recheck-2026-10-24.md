# Vercel Web Production public-surface recheck · 2026-10-24

## Scope

At `2026-10-23T21:23:55Z` (`2026-10-24 02:53:55 IST`), a bounded read-only
HTTP recheck ran against `https://verglos.com` after the explicitly confirmed
Production migration deployment. No login, token, payment, webhook,
database, entitlement, account, customer, or release-publication write was
performed.

## Provider receipt

- Provider: Vercel project `verglos-web`
- Deployment: `dpl_37JwVaAw25BoYn4Ase9bn9usm4WL`
- Deployment URL: `https://verglos-26u5hfvn5-anuragyadav20062002s-projects.vercel.app`
- Target/state: `production` / `READY`
- Source ref: `codex/fix-production-proof-route-20261024`
- Source commit: `791500d4dbc495312287287f692a6fc39120e3a2`
- Aliases: `verglos.com`, `www.verglos.com`, `verglos-web.vercel.app`

## Read-only route results

| Route | Expected | Observed | Content boundary |
| --- | ---: | ---: | --- |
| `/` | 200 | 200 | HTML |
| `/docs` | 200 | 200 | HTML |
| `/detectors` | 200 | 200 | HTML |
| `/proof` | 200 | 200 | HTML |
| `/verify` | 200 | 200 | private HTML |
| `/checkout` | 200 | 200 | private HTML |
| `/cli-auth` | 307 | 307 | bounded redirect to `/login?redirect_url=%2Fcli-auth` |
| `/handoff/33333333-3333-4333-8333-333333333333` | 200 | 200 | private, no-store HTML; synthetic forged ID only |
| `/record/verify/00000000-0000-0000-0000-000000000000` | 404 | 404 | private, no-store HTML; no receipt read |
| `/llms.txt` | 200 | 200 | Markdown |
| `/robots.txt` | 200 | 200 | text |
| `/sitemap.xml` | 200 | 200 | XML |
| `/api/v1/receipts/00000000-0000-0000-0000-000000000000` | 404 | 404 | JSON `{"ok":false,"reason":"receipt not found"}`, `no-store` |

All thirteen declared probes matched their expected status. The zero UUID and
forged handoff UUID are synthetic negative probes; they do not represent a
real receipt, handoff, recipient, customer, or acceptance event.

## Shipping disposition

This is current provider/Production surface evidence for the implementation
and public-boundary portions of `STUDIO-CLI-001`, `QUAL-WEB-005`,
`QUAL-WEB-006`, `FINAL-WEB-006`, `FINAL-WEB-007`, and `FINAL-WEB-008`. It does
not create authenticated deletion evidence, payment/provider lifecycle
evidence, customer/recipient acceptance, human screen-reader or field-CWV
evidence, independent AppSec/Hunt review, or final go/no-go approval. No
backlog checkbox is changed; the authoritative score remains **244 checked /
36 open / 280 total (87.1%)**, partitioned as **13 AppSec-dependent / 23
non-AppSec** rows.
