# QUAL-WEB-006 authenticated account recheck — 2026-10-11

## Scope and safety

Read-only qualification of the authenticated Production `/account` surface
through the connected Chrome DevTools session. The account remained in its
Free/paywall state. No form, payment, organization, entitlement, database,
provider, deployment, or customer-data mutation occurred. A temporary clean
same-session account tab was used for the performance trace and closed after
the run; the existing browser tabs were preserved.

## Accessibility and responsive observations

- Desktop and mobile Lighthouse navigation audits both reported Accessibility
  **100** and Best Practices **100**.
- The accessibility tree exposed one named main region, named account
  navigation links, a level-2 heading, and a named plans link.
- At mobile emulation `390x844`, `document.documentElement.scrollWidth` equaled
  `clientWidth` (`390`), so no horizontal overflow was observed.
- A real Tab traversal visited Overview, Monitoring, Alerts, Score history,
  Activations, Privacy, Organizations, Docs, and See plans. Each control was
  named and matched `:focus-visible`; traversal returned to the document body
  after the final control.
- The browser console contained no messages during the clean account load.

## Performance and network

- Clean account trace: **LCP 483 ms**, **TTFB 72 ms**, render delay **411 ms**,
  and **CLS 0.00**. No CrUX field data exists for this page.
- The account document request completed with HTTP **200**; the observed
  account CSS, JavaScript, Clerk, RSC, and route resources were HTTP **200**
  or expected **304** responses, with no application 4xx/5xx response.
- Chrome’s network-dependency insight also included unrelated YouTube traffic
  from another browser tab. Those external requests were excluded from the
  account finding; the account document itself had no estimated LCP savings.
- Lighthouse’s three non-perfect findings were the authenticated route’s
  expected no-index behavior, missing public canonical metadata, and the
  held `llms.txt` recommendation. They are not treated as account a11y
  defects.

## Repository verification

The focused Web qualification and organization/account contract tests passed
**37/37**. The relevant account pages remain intentionally dynamic because
they read authenticated identity and private license state; no cache change
was made from a single browser trace.

## Disposition

This is current desktop/mobile account-shell evidence, not full
`QUAL-WEB-006` acceptance. The checkbox remains open for an authorized
human screen-reader run, paid organization/large-dataset rendering, and field
Core Web Vitals. No checkbox changed. The private tracker remains **228
checked / 52 unchecked / 280 total (81.4%)**.

Owner/next action: Web accessibility/performance reviewer plus an authorized
paid/organization fixture owner; run the remaining screen-reader, large-data,
and field-CWV scenarios without using Production writes.
