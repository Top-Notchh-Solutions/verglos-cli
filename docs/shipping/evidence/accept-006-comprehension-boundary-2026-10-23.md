# ACCEPT-006 comprehension scorer boundary hardening · 2026-10-23

Private commit `e8a551d1` hardens
`scripts/score-comprehension-test.mjs` to reject future completion timestamps,
duplicate participant identity digests, and secret-like material anywhere in
the comprehension input, including the artifact/rubric.

The focused ACCEPT-006 suite passes **8/8**. Combined with the current
ACCEPT-005 workflow, bundle-builder, held-out correction-loop, corpus-triage,
and final-regression contracts, the bounded result is **29/29 passed**.

This is scorer implementation evidence only. No participant run, participant
identity, customer repository, provider, Production, publication, deployment,
or AppSec result was used or fabricated. ACCEPT-006 remains open for the
preregistered consenting participant run, redacted aggregate evidence, and
independent scoring review. Nothing was deleted or overwritten.
