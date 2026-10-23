# ACCEPT-008 commercial validator boundary hardening · 2026-10-23

Private commit `6af3fbb7` hardens
`scripts/validate-commercial-acceptance.mjs` to reject future completion
timestamps, secret-like material anywhere in the commercial input, and reuse
of one evidence digest across different commercial event kinds.

The focused ACCEPT-008 suite passes **7/7**. Combined with the current
ACCEPT-006, ACCEPT-005, bundle-builder, held-out correction-loop,
corpus-triage, and final-regression contracts, the bounded result is
**36/36 passed**.

This is validator implementation evidence only. No plan agreement, checkout,
support, hosted-cost, recipient, billing, customer, provider, Production,
publication, deployment, or AppSec result was fabricated or performed.
ACCEPT-008 remains open for actual commercial evidence and independent/final
acceptance. Nothing was deleted or overwritten.
