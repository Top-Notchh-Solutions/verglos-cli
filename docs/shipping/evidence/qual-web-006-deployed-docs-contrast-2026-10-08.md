# QUAL-WEB-006 deployed docs contrast evidence · 2026-10-08

- **Surface:** `https://verglos.com/docs/2.0.0`
- **Source:** Web main merge `394d697903b7fa12ec537dc667f3807cdd75f588`
  (PR #164, contrast correction)
- **Instrument:** Chrome DevTools CDP, read-only navigation and DOM inspection.
- **Desktop Lighthouse:** Accessibility 100, Best Practices 100, SEO 92,
  Agentic Browsing 67; 49 passed / 2 failed.
- **Mobile Lighthouse:** Accessibility 100, Best Practices 100, SEO 92,
  Agentic Browsing 67; 49 passed / 2 failed.
- **Failed audits:** `canonical` (missing valid `rel=canonical`) and optional
  `llms-txt` recommendation. These are public metadata surfaces held for the
  founder-authorized truth pass and were not changed in this qualification.
- **Console:** no warnings or errors captured.
- **Mobile DOM observation:** viewport 500x844, document width 500, no
  horizontal overflow; one `main`, one `h1`, four named focusable links, and
  no unnamed focusable controls.
- **Contrast fix verification:** the Hunt docs link is rendered with
  `text-[#18181b]` on `rgb(232, 93, 76)` and Lighthouse Accessibility remains
  100 on both device classes.
- **Safety:** no form, checkout, payment, provider, database, account, or
  customer-state action occurred.

This strengthens route-level evidence only. Human screen-reader review,
authenticated paid/org data, large datasets, field/CrUX CWV, complete route
coverage, and metadata truth remain open. No backlog checkbox changed; count
remains **218 checked / 62 unchecked / 280 total (77.9%)**.
