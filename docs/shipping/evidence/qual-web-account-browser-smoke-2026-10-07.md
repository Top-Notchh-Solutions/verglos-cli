# QUAL-WEB-006 authenticated-account browser smoke — 2026-10-07

- **Browser:** Existing Chrome 154 remote-debugging target on
  `127.0.0.1:9222`; read-only attachment to the already authenticated
  `https://verglos.com/account` tab. No credentials or personal identifiers
  were recorded.
- **Observed flow:** Reloaded `/account`, then inspected the rendered DOM and
  same-origin network responses through Chrome DevTools Protocol. The document
  returned HTTP 200; the observed same-origin document, stylesheet, and script
  responses also returned HTTP 200.
- **Rendered evidence:** title `Verglos — Security Evidence Agent for
  AI-Generated Code`, language `en`, one `main` and one `nav` landmark, seven
  links, zero unlabeled controls, zero tables, and no visible error/failed/
  unavailable copy. The page rendered the Free-plan Pro fence and a `See plans`
  link.
- **Boundary:** This proves only the currently available Free account shell and
  its read-only browser load. It does not prove authenticated Pro/Team/Studio/
  Enterprise dashboard rendering, organization data, large datasets, human
  screen-reader behavior, or field Core Web Vitals. QUAL-WEB-006 remains open.
- **Safety:** No checkout click, payment/provider call, account mutation,
  production database write, deployment, migration, or credential operation
  occurred.
