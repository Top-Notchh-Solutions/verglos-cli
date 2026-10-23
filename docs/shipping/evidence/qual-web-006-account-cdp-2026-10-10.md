# QUAL-WEB-006 authenticated account Chrome qualification — 2026-10-10

## Read-only hosted evidence

Using the existing authenticated Chrome DevTools session against
`https://verglos.com/account`:

- the accessibility snapshot exposed a named main region, navigation links,
  account navigation, a level-2 heading, and named plan/checkout links;
- the desktop Lighthouse snapshot scored Accessibility **100**, Best
  Practices **100**, and SEO **100** (27 audits passed, one unrelated
  agentic-browsing audit failed);
- the cold desktop trace reported LCP **1,879 ms** and TTFB **106 ms**;
  the LCP was text and its delay was render-side, not network transfer;
- the page produced 32 observed requests; the Verglos document, scripts,
  stylesheets, and route data returned successfully, with no application
  console failure observed in this pass.

No credentials, cookies, response bodies, account identifiers, or state-changing
requests were retained. No form was submitted and no Production/database,
payment, entitlement, or customer-data write occurred.

## Limitations

The performance trace's CLS culprit report was internally inconsistent with
the target page (it named YouTube nodes), so no CLS pass is claimed from that
trace. Mobile, keyboard traversal across every authenticated route, a human
screen-reader run, loading/error states, large-dataset rendering, INP/field
CrUX, and complete account/dashboard route coverage remain unverified.

`QUAL-WEB-006` therefore remains unchecked. Owner: Web accessibility/performance
reviewer. Next action: repeat the authenticated route matrix at desktop/mobile,
run an independent screen-reader pass, and capture a clean CLS/INP trace with
large-data fixtures. Review: 2026-10-11 IST.
