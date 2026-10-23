# QUAL-WEB-006 Production read-only browser qualification — 2026-10-11

## Scope

An already authenticated Chrome session was used against the current
Production pages `https://verglos.com/account` and
`https://verglos.com/orgs`. The run was read-only: no checkout, payment,
database, entitlement, organization, membership, or account mutation was
performed.

## Results

- `/account` loaded successfully. Its authenticated body rendered the Free
  account state and the expected account navigation without an auth error.
- `/orgs` loaded successfully and rendered the safe empty organization state;
  the account had no active organization membership to exercise a slug-scoped
  dashboard.
- The DevTools accessibility snapshot for `/account` exposed a main landmark,
  named navigation links for Overview, Monitoring, Alerts, Score History,
  Activations, Privacy, Organizations, and Docs, plus a named `h2` heading
  and accessible plan/checkout content.
- Lighthouse navigation audit for `/account`: desktop Accessibility **100**,
  Best Practices **100**; mobile Accessibility **100**, Best Practices **100**.
- Cold desktop DevTools performance trace: LCP **993 ms**, TTFB **131 ms**,
  render delay **862 ms**, CLS **0.00**. The page had no field CrUX data.
- Network requests for the route returned 200 for the document, styles,
  scripts, route data, and Clerk resources. No console errors or warnings were
  present after navigation.

The Lighthouse SEO failures were the expected authenticated-route boundary:
indexing was blocked, no canonical was emitted, and the route is not a public
marketing page. They are not counted as accessibility or performance defects
for this account route.

## Acceptance status

`QUAL-WEB-006` remains unchecked. This run does not replace the missing human
screen-reader exercise, large authenticated dataset qualification, or field
Core Web Vitals evidence. No production or customer state changed.
