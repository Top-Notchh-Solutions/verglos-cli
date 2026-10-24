# QUAL-WEB-006 local authenticated dashboard ready-state rerun v3

Captured 2026-10-24 against the disposable synthetic dashboard fixture at
`http://127.0.0.1:3310`, with 13 authenticated dashboard routes and desktop/mobile
viewports in each browser. The application code was `verglos-web` commit
`b344def` (merged to `main` as `b17c846c1932636a55eac01895a5226fa9899a3d`).

The rerun was made after fixing the observed product defects:

- monitoring, alerts, and members muted 11px notes now meet the observed contrast threshold;
- billing allowance bars now expose valid `progressbar` semantics;
- the dashboard capture probe verifies visible controls can receive focus when the WebKit headless runner does not advance native Tab focus.

## Observed packets

Each packet contains 26 ready measurements (13 routes × desktop/mobile). No
ready-state accessibility or performance failure remained in the qualification
report for Chromium, Firefox, or WebKit. The qualification still remains open
for the intentionally unprovided large-dataset, loading, and error-state
evidence; this packet does not claim those states.

| Browser | Capture | SHA-256 |
| --- | --- | --- |
| Chromium | `qual-web-006-dashboard-local-authenticated-chromium-ready-v3-2026-10-24.json` | `7c4752ed8daa0b07cbe4bcaa452fcacb359187719d8faefe68996dc45f3a9f9d` |
| Firefox | `qual-web-006-dashboard-local-authenticated-firefox-ready-v3-2026-10-24.json` | `154fbb3d7f1b5d39469dcbff10a574c9f6cec66a2f37b2a262e963735b3fe231` |
| WebKit | `qual-web-006-dashboard-local-authenticated-webkit-ready-v3-2026-10-24.json` | `003136b5c6a2eb2d413e1d9347f1f4c3ca764919fd8f54aea7942502182577eb` |

Local verification: `pnpm typecheck` passed; `pnpm test:dashboard-release`
passed 4/4; the local synthetic PostgreSQL container was retained. No hosted
provider action, production payment, publication, customer repository, or
external acceptance was performed.
