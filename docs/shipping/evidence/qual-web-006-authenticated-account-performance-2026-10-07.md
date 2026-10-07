# QUAL-WEB-006 authenticated account accessibility/performance qualification — 2026-10-07

- **Instrument:** Existing Chrome 154 DevTools MCP attachment on
  `127.0.0.1:9222`, page 13, after a read-only reload of the already
  authenticated `https://verglos.com/account` tab. No cookies, authorization
  headers, payment data, response bodies, or personal identifiers were
  recorded.
- **Rendered boundary:** The accessibility snapshot exposed one `main` and
  one `nav` landmark, seven links, no tables, and no unlabeled controls. The
  page rendered the Free-plan state and the Pro fence; it did not expose an
  organization slug or paid dashboard route. The console contained no error or
  warning messages.
- **Network boundary:** The observed document, Next.js CSS/chunks, Clerk
  bootstrap resources, and same-origin account route prefetches returned
  successfully. The probe recorded status/count information only; it did not
  retain request headers or private bodies.
- **Lab trace:** Unthrottled Chrome reload reported LCP **819 ms**, TTFB **80
  ms**, render delay **740 ms**, and CLS **0.00**. Chrome reported no field
  (CrUX) data for this page.
- **Lighthouse:** Mobile and desktop navigation audits each reported
  Accessibility **100**, Best Practices **100**, SEO **58**, and Agentic
  Browsing **67**. The three SEO failures were the expected private-route
  indexing/canonical/`llms.txt` audits; this is not public marketing evidence
  and is not changed in this phase.
- **Acceptance boundary:** This strengthens authenticated Free-shell lab
  evidence only. It does not prove Pro/organization dashboard rendering,
  large-data browser behavior, human screen-reader review, responsive
  organization flows, or field Core Web Vitals. QUAL-WEB-006 remains open.
- **Safety:** No checkout interaction, provider request, payment, account
  mutation, database write, migration, deployment, or credential operation
  occurred.
