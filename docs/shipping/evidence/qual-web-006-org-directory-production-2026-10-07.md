# QUAL-WEB-006 production organization entry — 2026-10-07

## Deployment

- Vercel target: production, status Ready.
- Deployment: `dpl_G7umvo3ZRerRWeg5SZUi8fPRnnHQ`.
- Deployment URL: `https://verglos-4qpz8mhqr-anuragyadav20062002s-projects.vercel.app`.
- Alias: `https://verglos.com`.
- The deployment was created after Web PR #151 merged as
  `c1bca533c0e617427e42fd1be3c449b0ed458311`.

## Authenticated browser evidence

- Instrument: existing authenticated Chrome DevTools page 13; no new session
  or credentials were created.
- Request: `GET https://verglos.com/orgs` returned **200**.
- Accessibility snapshot rendered the main landmark, “Choose an organization,”
  a Personal Account link, and the honest empty state “No organizations yet.”
- The production route chunk `app/orgs/page-1b1100e89dd8c15a.js` loaded with
  HTTP 200.
- Console: no messages.

## Boundary

The attached account has no active organization membership, so no slug-scoped
dashboard link was available to exercise. This proves the authenticated entry
route and empty state only; it does not qualify organization creation,
slug-scoped dashboard rendering, screen-reader behavior, field CWV, or full
`QUAL-WEB-006`. No account, database, payment, or provider mutation occurred.
