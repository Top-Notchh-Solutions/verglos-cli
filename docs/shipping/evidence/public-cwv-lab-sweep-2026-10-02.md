# Public production browser performance lab sweep — 2026-10-02

## Scope

Read-only measurements of the deployed `https://verglos.com` public and authenticated
account routes from the founder's existing Chrome session over Chrome DevTools Protocol.
The temporary `about:blank` tab was reused; no checkout, organization, billing, or
database action was performed.

Viewport: 1200×859. Each route was loaded fresh and allowed to settle for 2.2 seconds.
Values are browser lab measurements, not CrUX/field data and not a human screen-reader
review. `LargestContentfulPaint` was not available in the post-load sample and is therefore
recorded as unknown rather than inferred.

## Measurements

| Route | TTFB ms | DOMContentLoaded ms | load ms | FCP ms | LCP | CLS | main | focusables | horizontal overflow |
| --- | ---: | ---: | ---: | ---: | --- | ---: | --- | ---: | --- |
| `/` | 117.2 | 198.3 | 425.1 | 256 | unknown | 0.00 | yes | 57 | no |
| `/checkout` | 93.1 | 423.5 | 517.2 | 480 | unknown | 0.00 | yes | 4 | no |
| `/docs` | 177.1 | 209.7 | 319.7 | 252 | unknown | 0.00 | yes | 85 | no |
| `/detectors` | 92.6 | 151.0 | 245.0 | 200 | unknown | 0.00 | yes | 2 | no |
| `/verify` | 165.0 | 440.1 | 581.9 | 464 | unknown | 0.00 | yes | 1 | no |
| `/account` | 106.2 | 1749.2 | 1855.3 | 1776 | unknown | 0.00 | yes | 7 | no |

## Boundary

This provides reproducible production lab evidence for route structure, first paint, layout
stability, and overflow. It does **not** close `QUAL-WEB-006`: organization-dashboard
runtime data, human VoiceOver/NVDA review, large-dataset behavior, and complete field-CWV
evidence remain absent. No production write, migration, deployment, billing action, or
marketing change occurred.
