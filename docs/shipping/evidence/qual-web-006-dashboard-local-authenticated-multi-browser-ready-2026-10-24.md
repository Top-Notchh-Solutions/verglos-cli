# QUAL-WEB-006 authenticated dashboard multi-browser capture · 2026-10-24

## Execution boundary

Web PR #274 merged normally as `b9f051fd4c36de9e20fcde3b29bbd3104c08925e`.
It adds the bounded real-interaction retry needed when Firefox or WebKit has
not surfaced an INP entry on the first interaction. The retry is capped at
three observed interactions and never substitutes a guessed metric.

The capture ran against the isolated local Preview-like server and synthetic
`owner-fixture` organization backed by the disposable local database. No
Production request, customer repository, hosted provider write, or customer
data was used.

## Browser packets

| Browser | Measurements | Routes | Viewports | JSON SHA-256 |
| --- | ---: | ---: | --- | --- |
| Chromium | 26 | 13 | desktop + mobile | `99cf609a2dc73b8ef1d5aec3644f3bacb4d8890b94c5c8454b7ac2fe59e99043` |
| Firefox | 26 | 13 | desktop + mobile | `08896d2213e39461b30d494f4ed23cf2e770d22e0d2051b6e801d85d5f04c609` |
| WebKit | 26 | 13 | desktop + mobile | `986aea3674819e168618e68715a41aff45cbe43394076cb5b4a4bbf1680440a7` |

All three packets contain **13/13 ready desktop + 13/13 ready mobile**
measurements. Accessibility findings, keyboard state, reduced-motion state,
responsive state, and performance values are observed per packet.

## Fail-closed qualification

The dashboard qualifier remains intentionally open:

- Chromium: **73** gaps, including 8 observed page-contract failures.
- Firefox: **73** gaps, including 8 observed page-contract failures.
- WebKit: **85** gaps, including 20 observed page-contract failures.
- Loading states: **0/13** per browser.
- Error states: **0/13** per browser.
- Large-dataset ready states: **0/13** per browser.

This materially advances automated authenticated supported-browser capture for
`QUAL-WEB-006`, but does not close it. Human screen-reader review, field-CWV,
large-dataset, loading/error, independent review, and final acceptance remain
open. No backlog checkbox changed; score remains **245 checked / 35 open / 280
total (87.5%)**, partitioned as **13 AppSec-dependent / 22 non-AppSec** rows.
