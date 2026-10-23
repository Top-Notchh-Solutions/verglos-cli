# QUAL-WEB-006 public home browser qualification — 2026-10-18

## Scope and boundary

This packet records a fresh browser qualification of the public Verglos home
route using the already-open Verglos Chrome page. It covers the public landing
surface only. It is not authenticated dashboard qualification, a human
screen-reader study, a large-dataset test, field Core Web Vitals evidence, a
provider test, a legal approval, final acceptance, or AppSec evidence.

No new Chrome window or tab was opened. No credentials, private tracker data,
customer source, or private evidence was entered into the browser.

## Run identity

- URL: `https://verglos.com/`
- Run date: `2026-10-18`
- Desktop Lighthouse report timestamp: `2026-10-18T09:43:17.124Z`
- Mobile Lighthouse report timestamp: `2026-10-18T09:43:28.598Z`
- Browser audit: Chrome DevTools Lighthouse navigation mode
- Performance trace: Chrome DevTools navigation trace with a cold reload,
  CPU throttling `1x`, and no network throttling
- CrUX field data: unavailable for this page

## Lighthouse results

| Device | Accessibility | Best Practices | SEO | Agentic Browsing | Passed | Failed |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Desktop | 100 | 100 | 100 | 100 | 61 | 0 |
| Mobile | 100 | 100 | 100 | 100 | 60 | 0 |

The raw reports are retained beside this packet:

- `desktop-report.json` — SHA-256
  `a9058262b3c861e85751bf165f871cc416a374d6b8c224f01bc1d0da57936df2`
- `mobile-report.json` — SHA-256
  `8e9c2979c67b569e49732f330fb5262e0292b12d49dbe62cc2f76200bba82134`

The report scan found no authorization headers, bearer values, cookies with
customer data, private keys, or credential values. Matches for words such as
`third-party-cookies` are Lighthouse audit names/descriptions only.

## Performance trace

- LCP: **334 ms** (lab/observed trace)
  - TTFB: 111 ms
  - element render delay: 223 ms
  - LCP element: text heading; no network LCP resource
- CLS: **0.00**
- Forced reflow: one unattributed 61 ms call frame; no top-level function was
  identified and the tool reported no estimated metric savings.
- The page network list contained 37 requests; the listed responses were 200
  or 304 and were limited to Verglos, Clerk, and the public linked assets.

The trace reported no actionable estimated savings for render-blocking
resources. Because CrUX returned no field data, the LCP and CLS values above
are lab evidence and must not be presented as real-user performance.

## Disposition

This packet advances the public-route portion of `QUAL-WEB-006`, but the row
remains unchecked. The remaining contract requires authenticated dashboard
coverage, human keyboard/screen-reader review, large-dataset behavior, complete
responsive/loading/error-state coverage, and field performance evidence. No
backlog checkbox or release claim changes from this packet.

The AppSec-held Hunt rows remain separate and unchanged. The live score remains
**230 checked / 50 open / 280 total (82.1%)**.
