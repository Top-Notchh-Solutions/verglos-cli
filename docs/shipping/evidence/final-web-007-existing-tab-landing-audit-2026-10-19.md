# FINAL-WEB-007 existing-tab landing audit — 2026-10-19

## Scope and environment

- **Observed at (UTC):** 2026-10-19T14:19:06Z
- **URL:** `https://verglos.com/`
- **Browser:** the already-open Chrome page; no new tab or window was created.
- **Mutation boundary:** read-only navigation, Lighthouse, accessibility-tree,
  network inspection, and performance traces only. No deployment, provider,
  billing, account, customer, or database write occurred.

## Results

### Lighthouse

- **Desktop:** Accessibility 100, Best Practices 100, SEO 100, Agentic
  Browsing 100; **61/61 audits passed, 0 failed**.
- **Mobile:** Accessibility 100, Best Practices 100, SEO 100, Agentic
  Browsing 100; **60/60 audits passed, 0 failed**.

### Performance traces

- **Desktop, CPU 1x, no network throttle:** LCP **272 ms**, CLS **0.00**;
  TTFB 82 ms and render delay 191 ms. CrUX field data was unavailable.
- **Mobile 412×915, Fast 4G, CPU 1x:** LCP **269 ms**, CLS **0.00**;
  TTFB 75 ms and render delay 193 ms. CrUX field data was unavailable.
- The only render-blocking request was the immutable compressed CSS bundle:
  5 ms total on desktop and 8 ms on mobile, with **0 ms estimated FCP/LCP
  savings**. Critical-path latency was 140 ms desktop and 212 ms mobile, with
  no preconnect opportunity reported.
- The mobile trace reported 1,105 DOM elements, depth 14, and a 40 ms layout
  update affecting 1,513 nodes. It reported no estimated savings and no
  failing threshold.
- The legacy-JavaScript insight identified 14.6 kB of potential polyfill
  waste but estimated **0 ms** FCP/LCP savings; it is recorded as a low-impact
  follow-up, not a release blocker.

### Accessibility and public truth observation

The accessibility tree exposed a named navigation, main landmark, named
controls and links, headings, the Inspect → Decide → Prove → Monitor flow,
explicit Hunt assurance/qualification language, JS/TS scope, and the
security-layer product positioning. No source, credentials, or private
evidence appeared in the inspected public surface.

## Acceptance boundary

This is strong browser/lab qualification evidence for `FINAL-WEB-007`, but it
does not close the row. Human screen-reader testing, supported-environment
coverage beyond this session, real-user/field CWV evidence, large-data
behavior, dependency acceptance (`ACCEPT-009/010`), and independent/final
acceptance remain open. No checkbox was changed; score remains **239 checked /
41 open / 280 total (85.4%)**.

