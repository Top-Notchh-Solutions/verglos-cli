# FINAL-WEB-007 local source browser qualification — 2026-10-21

## Scope and boundary

- **Source:** clean Web worktree at commit `70f69de` (`fix(web): close public
  surface audit gaps`).
- **Target:** local `http://127.0.0.1:3010/`; the parent Web checkout was not
  used or modified.
- **Paths:** `/`, `/docs`, `/detectors`, `/proof`, `/verify`, and `/checkout`.
- **Procedure:** existing Chrome DevTools page **3** only; no new tab/window,
  Production write, provider action, payment interaction, or Preview bypass.
- **Conditions:** cold reloads at desktop `1440x900` and mobile `390x844`,
  Fast 4G, 4× CPU throttling, light color scheme, and reduced-motion unset.

This is local current-source evidence. It does not replace deployed exact-head
requalification, CrUX/field CWV, human accessibility, supported-environment,
customer, legal, provider, or final acceptance evidence.

## Performance traces

Chrome performance traces recorded `CLS 0.00` on every route:

| Path | Desktop LCP | Mobile LCP | Desktop TTFB | Mobile TTFB |
| --- | ---: | ---: | ---: | ---: |
| `/` | 552 ms | 753 ms | 142 ms | 141 ms |
| `/docs` | 428 ms | 1002 ms | 123 ms | 105 ms |
| `/detectors` | 648 ms | 866 ms | 66 ms | 56 ms |
| `/proof` | 650 ms | 841 ms | 66 ms | 53 ms |
| `/verify` | 657 ms | 837 ms | 59 ms | 60 ms |
| `/checkout` | 620 ms | 623 ms | 64 ms | 60 ms |

All six routes produced no console errors or warnings in the same run.

## Direct browser contract checks

- All six routes rendered a non-empty title, description, canonical URL, and
  primary heading.
- `/docs` rendered two tables, six column headers per table, and 21 scoped row
  headers; the catalog terms table retained its caption.
- `/proof` rendered both `Boundary` labels with the strengthened
  `text-[#f5f2ea]/60` class.
- `/checkout` rendered `noindex, nofollow` and had zero Razorpay script tags
  before an explicit payment interaction. No provider interaction occurred.

The Lighthouse wrapper reported a contradictory `meta-description` failure on
the local navigation runs even though direct DOM inspection returned the
expected descriptions on all six routes. The contradiction is retained here
for recheck rather than treated as a source failure. Checkout's noindex state
is intentional and is not a defect.

## Qualification and disposition

- Existing source checks remain green: truth-registry **35/35**, landing
  qualification **4/4**, public-release-smoke contract **2/2**, actual smoke
  **16 routes / 22/22 claims / 2 proof assets / 0 issues**, typecheck, diff
  check, and detached build **49/49** pages.
- This run strengthens current-source browser evidence for FINAL-WEB-007 and
  verifies the fixes against the six public route contracts.
- No backlog checkbox changed. FINAL-WEB-007 remains open for deployed exact-
  head requalification, actual INP/field-CWV, human/supported-environment
  evidence, and final acceptance. FINAL-WEB-008 and the remaining external,
  legal, provider, customer, and AppSec gates remain open.
- No credentials, cookies, customer data, or provider secrets were retained.

