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

## Disposition

- `PLAN-WEB-015`: progress only. Production variable/provider configuration,
  catalog, webhook, and deployment reconciliation remain unverified.
- `QUAL-WEB-006`: progress only. Authenticated dashboard field coverage,
  keyboard/screen-reader review, responsive states, full CWV/INP, and
  large-dataset evidence remain open.
- No production/database/payment/deployment/migration write occurred.
