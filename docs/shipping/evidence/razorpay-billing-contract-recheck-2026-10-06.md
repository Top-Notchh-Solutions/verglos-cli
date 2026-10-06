# Razorpay billing contract recheck — 2026-10-06

Current Web source focused suite: **15 pass, 0 fail, 1 environment-gated
skip**.

Covered contracts include catalog-bound INR checkout amounts, immutable signed
commercial snapshots, QR owner/read-only status, captured-only grants, fixed
single-use amount/currency checks, failed payments, immutable refund identity,
event conflicts/in-flight duplicates, retry semantics, malformed signatures and
oversized bodies, and expiry behavior. Provider exception details remain
redacted from client responses.

The single skipped test is the migration-backed billing-ledger serialization
integration test, which requires the configured PostgreSQL integration
environment. This suite is contract evidence only; it does not replace the
missing live Razorpay capture/webhook/refund/renewal run.
