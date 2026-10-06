# QUAL-WEB-006 authenticated dashboard runtime qualification — 2026-10-07

## Scope and boundary

- Read-only browser evidence was collected through the authenticated Chrome
  DevTools session on `https://verglos.com`.
- `/account/dashboard` redirects to `/account`. The session is authenticated,
  but the account is Free and no organization-slug dashboard or `/orgs/*`
  surface was available. This therefore qualifies the current account shell,
  not organization-dashboard or Pro-data acceptance.
- No database read/write, payment, deployment, migration, or customer-data
  mutation was performed. The signed-in email is intentionally omitted from
  this record.

## Accessibility and responsive evidence

- Mobile emulation: `390x844`, DPR 1, touch enabled.
- Mobile layout reports document width equal to viewport width (`390/390`),
  with no horizontal overflow.
- Desktop layout reports one `main` landmark and one `nav` landmark, with no
  horizontal overflow at `1440x900`.
- Keyboard traversal with real Tab events reached all seven links in order:
  Overview, Monitoring, Alerts, Score history, Activations, Docs, and See
  plans; the next Tab returned focus to the document body.
- The four authenticated sub-route requests (`/account/monitoring`,
  `/account/alerts`, `/account/history`, `/account/activations`) all safely
  resolved to the same Free-state `/account` shell in this session.

## Lighthouse evidence

Both navigation audits targeted `https://verglos.com/account`:

| Device | Accessibility | Best practices | SEO | Agentic browsing |
| --- | ---: | ---: | ---: | ---: |
| Desktop | 100 | 100 | 58 | 67 |
| Mobile | 100 | 100 | 58 | 67 |

The three failed audits are `is-crawlable`, `canonical`, and `llms-txt`.
These are expected private-dashboard/SEO-surface limitations and are not
counted as accessibility failures. The raw private reports are preserved as:

- `qual-web-006-lighthouse-2026-10-07/desktop-report.json`
  SHA-256 `bb3b3a2f60f7b37cc4020a6e5920622647b61b6b621a00f3535de02b75fc8f12`
- `qual-web-006-lighthouse-2026-10-07/mobile-report.json`
  SHA-256 `b521e3b889d1946dcfed642a090eac0a36a822a2d3a70b2992267f00ad6e5095`

## Performance evidence

- Mobile trace at `390x844`: LCP `620 ms`, CLS `0.00`, TTFB `89 ms`, render
  delay `531 ms`; no CrUX field data is available.
- Desktop trace at `1440x900`: LCP `872 ms`, CLS `0.00`, TTFB `138 ms`, render
  delay `734 ms`; no CrUX field data is available.
- The LCP element is the text Pro-fence heading; the trace reported no
  estimated savings. A legacy-JavaScript insight estimated 14.4 kB of wasted
  bytes but zero FCP/LCP savings.

## Acceptance boundary

- QUAL-WEB-006 remains unchecked. This run is sufficient for current account
  shell accessibility/responsive/performance evidence only.
- Missing evidence remains: organization dashboard, Pro/large-dataset
  rendering, human screen-reader review, and field Core Web Vitals.
- No Web code change was justified by a reproducible defect in this run.
