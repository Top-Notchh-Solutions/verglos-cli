# QUAL-WEB-006 public-surface runtime qualification — 2026-10-08

## Scope and instrument

Read-only Chrome DevTools MCP navigation/performance/Lighthouse runs against
the current public production deployment:

- `https://verglos.com/`
- `https://verglos.com/docs`
- `https://verglos.com/detectors`

The authenticated production checkout tab was preserved. No form, account,
payment, database, entitlement, deployment, or provider mutation occurred.
Runs used the connected Chrome debug session, CPU 1x, and no network
throttling. CrUX field data was unavailable for these pages.

## Results

| Page | Lab LCP | CLS | Lighthouse result |
|---|---:|---:|---|
| `/` | 324 ms | 0.00 | Desktop: accessibility 100, best practices 100, SEO 100; mobile: accessibility 97, best practices 100, SEO 100 |
| `/docs` | 239 ms | 0.00 | Mobile: accessibility 100, best practices 100, SEO 100 |
| `/detectors` | 254 ms | 0.00 | Mobile: accessibility 100, best practices 100, SEO 100 |

The homepage mobile audit identified one real accessibility failure:
insufficient color contrast. The homepage and detectors console contained no
console messages during the captured runs. The homepage, docs, and detectors
also received the Lighthouse agentic-browsing score of 67 because the existing
`llms.txt` audit did not meet its recommendation.

## Limits and disposition

These results cover public rendered surfaces only. They do not qualify
keyboard/screen-reader behavior, authenticated organization/dashboard routes,
large datasets, field Core Web Vitals, deletion, payment, or the final public
claim/release gate. Public content and metadata were not edited because the
final-web marketing freeze remains active. `QUAL-WEB-006` remains open; no
backlog checkbox changed.
