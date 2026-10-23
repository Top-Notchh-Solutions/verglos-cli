# FINAL-WEB-007 Production browser qualification — 2026-10-24

## Scope

The existing landing-release capture harness was hardened in Web commit
`0856d8f` and merged normally by PR **#265** as
`c72c08f1fc1d198de3ec28ed735c40f9a27f2a46`. When Chromium has not delivered a
real interaction entry after the initial settling window, the harness now
performs one additional real pointer/keyboard interaction and waits again. It
never substitutes a guessed INP value; an absent metric still fails closed.

## Production browser receipt

The merged Web source was run against the live canonical origin
`https://verglos.com` with Playwright Chromium and Axe, reduced motion enabled,
desktop `1440x900`, and mobile `390x844`. The capture was read-only and
covered the six required landing paths at both viewports: **12/12**.

Capture timestamp: `2026-10-23T20:53:45.346Z` UTC.

| Path | Desktop | Mobile | LCP range | INP range | Axe serious/critical | Responsive/metadata/crawlability |
| --- | --- | --- | ---: | ---: | ---: | --- |
| `/` | pass | pass | 552/212 ms | 16/16 ms | 0 | pass/pass/pass |
| `/docs` | pass | pass | 144/152 ms | 48/40 ms | 0 | pass/pass/pass |
| `/detectors` | pass | pass | 160/156 ms | 40/48 ms | 0 | pass/pass/pass |
| `/proof` | pass | pass | 152/164 ms | 32/40 ms | 0 | pass/pass/pass |
| `/verify` | pass | pass | 416/348 ms | 48/40 ms | 0 | pass/pass/pass |
| `/checkout` | pass | pass | 436/392 ms | 16/16 ms | 0 | pass/pass/pass |

The capture also returned HTTP **200** for `robots.txt` and `sitemap.xml`, with
8 sitemap URLs. The landing qualifier returned `status: passed`, `ok: true`,
all required desktop/mobile coverage, and no gaps or page failures.

## Boundary and disposition

This is automated browser/Axe evidence, not a human screen-reader observation
or field Core Web Vitals measurement. It does not claim supported-browser
coverage beyond Chromium, customer/recipient acceptance, independent review,
provider lifecycle completion, account deletion, final release, or AppSec/Hunt
review. No login, payment, webhook, database, account, entitlement, customer,
or Production write occurred.

This advances the implementation/hosted evidence for FINAL-WEB-007 and
FINAL-WEB-008; their row contracts remain open for the declared human/field,
dependency, independent-review, and final-release gates. Score remains
**244 checked / 36 open / 280 total (87.1%)**.
