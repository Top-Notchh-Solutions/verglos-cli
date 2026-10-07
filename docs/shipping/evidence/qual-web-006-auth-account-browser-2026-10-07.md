# QUAL-WEB-006 authenticated account browser evidence · 2026-10-07

- **Instrument:** Dedicated Chrome DevTools session verified with
  `mcp__chrome_devtools__list_pages`; authenticated page 13 was selected. No
  cookies, authorization headers, payment credentials, or response bodies were
  captured.
- **Surface:** `https://verglos.com/account`, authenticated account identity
  redacted in this record. Rendered accessibility snapshot exposes a named
  main region, navigation links, account state, and a Pro-fence explanation.
  One Tab action focused the `OVERVIEW` link. Console reported no warnings or
  errors. Account navigation/document requests returned 200/304.
- **Lighthouse snapshot:** Desktop and mobile each reported Accessibility 100,
  Best Practices 100, and SEO 100. Agentic Browsing was 50 because the
  `llms.txt` audit reported no links; this is recorded as a separate public
  agentic-web limitation, not silently treated as a perfect audit.
- **Performance trace:** Desktop-equivalent unthrottled trace reported LCP
  1,111ms, CLS 0.00, and no CrUX field data for this authenticated page.
- **Boundary:** The account is currently Free with no license key and the
  organization directory reports no organizations. This does not qualify paid
  Pro/Studio/Enterprise runtime, organization dashboard data, human screen
  reader behavior, large datasets, or field Core Web Vitals. QUAL-WEB-006
  remains unchecked. No entitlement, payment, database, deployment, or
  production configuration was changed.
