# Web current-head Preview checkout receipt · 2026-10-24

## Provider receipt

The protected current-head Web Preview deployment
`dpl_8aTPJdicafq8zSduHUYwiQcQHg7D` served the `/checkout` route through the
Vercel provider. The read-only request returned **HTTP 200** with
`x-matched-path: /checkout`, `content-type: text/html`, and the expected
security headers including CSP, HSTS, `x-content-type-options`, and
`x-frame-options`.

The observed CSP permits the Razorpay checkout origin for the declared
`script-src`, `connect-src`, `frame-src`, and `form-action` directives. No
checkout was submitted and no provider, database, entitlement, account, or
Production write occurred.

## Boundary

This proves current hosted Preview route reachability and the checkout/provider
browser security boundary only. It does not prove authenticated browser
acceptance, a captured payment, signed webhook delivery, entitlement
projection, customer acceptance, field-CWV, independent review, or final
release approval. No backlog checkbox or score changed.
