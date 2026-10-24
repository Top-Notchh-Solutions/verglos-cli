# FINAL-WEB-007 multi-browser local qualification — 2026-10-24

## Scope

The Web landing qualification harness and checkout cadence tabs were exercised
against the updated Web source in an isolated local Next.js server. The source
patch was committed as Web `13b7989785eeff89684919a01c5706907dea1a84` and
merged normally in PR #270 as `2358edee90de78c06d6128a6d312165f911f7b6a`.

The product fix gives the `role="tab"` cadence buttons explicit ARIA keyboard
focus semantics: the selected tab has `tabIndex=0` and the unselected tab has
`tabIndex=-1`. The capture harness now runs the same contract with Chromium,
Firefox, or WebKit selected explicitly. A valid browser `304 Not Modified`
response is accepted only when the final URL and crawlability checks also pass.

## Local execution

- **Base URL:** `http://127.0.0.1:3001`
- **Database:** disposable local Docker PostgreSQL database with the reviewed
  baseline and migrations; no hosted or customer database was used.
- **Required paths:** `/`, `/docs`, `/detectors`, `/proof`, `/verify`, and
  `/checkout`.
- **Viewports:** desktop and mobile for every required path.
- **Capture command:**
  `pnpm capture:landing-release -- --base-url http://127.0.0.1:3001 --browser <browser> --out <capture.json>`
- **Qualification command:**
  `pnpm qualify:landing-release -- <capture.json>`
- **Playwright:** `1.64.1`; Chromium `156.0.8078.4`, Firefox `157.0`,
  WebKit `27.2`.

## Results

| Browser | Capture time (UTC) | Measurements | Axe/accessibility findings | Keyboard failures | Max LCP / FCP / TTFB | Qualification |
| --- | --- | ---: | ---: | ---: | --- | --- |
| Chromium | `2026-10-24T00:18:24.158Z` | 12 | 0 | 0 | 308 / 308 / 205.7 ms | PASS |
| Firefox | `2026-10-24T00:18:29.012Z` | 12 | 0 | 0 | 249 / 249 / 153 ms | PASS |
| WebKit | `2026-10-24T00:18:28.697Z` | 12 | 0 | 0 | 540 / 406 / 308 ms | PASS |

All three qualifications reported `ok: true`. Every measurement also passed
responsive layout, canonical metadata, crawlability, reduced-motion, and
interaction checks. Local `robots.txt` returned HTTP 200 and the sitemap
returned HTTP 200 with 8 URLs.

## Verification and boundary

- `pnpm typecheck` passed.
- `pnpm test:landing-release` passed **4/4**.
- No GitHub Actions run was required; the account Actions budget remains
  blocked at the configured zero-dollar boundary.
- This is local implementation and browser-contract evidence. It is not a
  hosted/Production browser receipt, independent screen-reader review, field
  Core Web Vitals observation, customer/recipient acceptance, AppSec/Hunt
  review, or final release/go-no-go sign-off.
- Keep the relevant `FINAL-WEB-007`, `FINAL-WEB-008`, and qualification rows
  open until their separately required hosted, human, field, review, and
  release evidence exists. No backlog checkbox changed.
