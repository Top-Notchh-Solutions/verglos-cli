# Production read-only browser qualification

Date: 2026-10-08
Status: runtime observation only; no acceptance checkbox changed.

## Instrument and scope

- Chrome `154.0.8037.98` through the approved loopback CDP endpoint
  `127.0.0.1:9222`.
- Authenticated production page selected by URL only; no cookies, headers,
  response bodies, email, payment identifiers, or credentials were recorded.
- Read-only navigation to `https://verglos.com/account` and
  `https://verglos.com/checkout`; the page was restored to `/account`.
- No checkout button was clicked, no order was created, and no provider or
  database write occurred.

## Observations

| Page | Render/runtime observation |
| --- | --- |
| `/account` | 1 main, 1 nav, 9 visible links, 5 paragraphs, 0 unlabeled visible controls, 0 images missing alt, 66 non-ignored accessibility nodes / 12 unnamed nodes, 0 captured console-error/exception events. |
| `/checkout` | 1 main, 3 visible buttons, 0 unlabeled visible controls, 0 images missing alt, 52 non-ignored accessibility nodes / 11 unnamed nodes, 0 captured console-error/exception events. |

Production checkout rendered these hosted-method labels: UPI, Cards,
Netbanking, Wallets, EMI, and Pay Later. It rendered no UPI QR label. This is
a rendered UI observation, not provider-account or order-creation evidence.

Navigation observations were `/account` DOMContentLoaded 3865 ms / load 4221
ms and `/checkout` DOMContentLoaded 522 ms / load 1819 ms. Largest Contentful
Paint was unavailable from this short CDP observation; CLS was 0 in the
available entries. These values do not satisfy the complete CWV gate.

## 2026-10-08 CDP refresh

The same authenticated target was inspected read-only with Chrome DevTools
Lighthouse, performance traces, and keyboard traversal. No button was clicked
and no request that creates an order, payment, entitlement, deletion request,
or other application mutation was sent.

- `/account`: Lighthouse Accessibility **100**, Best Practices **100**, SEO
  **100**, Agentic Browsing **50**. The only reported audit failure was the
  `llms.txt` recommendation; this is a public-marketing truth-freeze item, not
  a product-runtime failure. Lab trace LCP was **1,910 ms**, CLS **0.00**, and
  no CrUX field data was available. The trace attributed most LCP time to
  render delay.
- `/checkout`: Lighthouse Accessibility **100**, Best Practices **100**, SEO
  **80**, Agentic Browsing **50**. Reported audit gaps were the missing
  meta-description and the same `llms.txt` recommendation. Lab trace LCP was
  **500 ms**, CLS **0.00**, and no CrUX field data was available. The trace
  reported approximately **36.3 KB** of legacy-JavaScript opportunity without
  an estimated LCP saving.
- Checkout keyboard traversal reached Monthly, Annual, Continue, Back, and
  the document body before looping; all encountered controls had accessible
  names and no obvious focus trap was observed. This is a bounded probe, not a
  human screen-reader acceptance.
- `/account/privacy` rendered the account-data/deletion surface. The request
  control was disabled before confirmation, the page showed no deletion
  requests, and the read-only deletion-list request returned HTTP 200. No
  deletion request was submitted.

These are lab/runtime observations only. The public metadata findings were
not changed during this batch because the final public truth pass is gated by
the release plan. They do not close `QUAL-WEB-006` or `PLAN-WEB-015`.

## Disposition

- `PLAN-WEB-015`: progress only. Production variable/provider configuration,
  catalog, webhook, and deployment reconciliation remain unverified.
- `QUAL-WEB-006`: progress only. Authenticated dashboard field coverage,
  keyboard/screen-reader review, responsive states, full CWV/INP, and
  large-dataset evidence remain open.
- No production/database/payment/deployment/migration write occurred.
