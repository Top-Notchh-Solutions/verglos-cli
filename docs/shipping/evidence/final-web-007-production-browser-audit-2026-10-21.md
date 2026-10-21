# FINAL-WEB-007 read-only production browser audit · 2026-10-21

## Scope and boundary

This packet records a read-only browser audit of the public production
homepage. It does not claim exact Preview-source identity, real-user/CrUX
field data, customer acceptance, or human screen-reader operation. No form,
authentication, database, deployment, provider, or Production mutation was
performed. Raw browser cookies, credentials, and response bodies containing
session material are not retained here.

The exact Preview URL was attempted in the existing authenticated browser tab
and redirected to Vercel login because deployment protection remained active.
No protection bypass, new tab, or deployment mutation was used.

## Observed browser identity and configuration

- URL: `https://verglos.com/`.
- Existing Chrome tab only; public homepage navigation succeeded.
- Lighthouse navigation audit, desktop: **61/61** audits passed; Accessibility,
  Best Practices, SEO, and Agentic Browsing each scored **100/100**.
- Lighthouse navigation audit, mobile: **60/60** audits passed; Accessibility,
  Best Practices, SEO, and Agentic Browsing each scored **100/100**.
- Performance traces used Fast 4G, 4× CPU slowdown, cold reload, and cache
  bypass. Desktop viewport was `1440x900`; mobile viewport was `390x844`.
- Desktop trace: LCP **727 ms**, LCP TTFB **207 ms**, render delay **520 ms**,
  CLS **0.00**.
- Mobile trace: LCP **594 ms**, LCP TTFB **87 ms**, render delay **506 ms**,
  CLS **0.00**.
- Chrome reported no console errors or warnings after the mobile reload.
  The observed network list contained **35** requests with no failed request;
  expected redirect/cache responses were present.
- CrUX field data was unavailable for this page; these are lab observations.

## Disposition

This strengthens FINAL-WEB-007's public production lab evidence but does not
close the row. The required six-path desktop/mobile browser capture, manual
screen-reader operation, supported-environment coverage, field-CWV evidence,
and final acceptance remain open. No checklist checkbox changed; the score
remains **239 checked / 41 open / 280 total (85.4%)**.
