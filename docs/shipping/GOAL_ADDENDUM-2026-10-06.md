# Verglos V1 goal addendum — 2026-10-06

This private addendum extends the active shipping objective; it does not relax
any existing evidence or safety gate.

## Added completion scope

1. GitHub-first organization architecture must be production-aligned: App
   installation identity, immutable account/repository IDs, multi-repository
   scope, permission/token lifecycle, delivery replay protection, lifecycle
   reconciliation, and authorized cutover evidence.
2. Razorpay billing must expose only provider/account-enabled methods through a
   server/catalog contract and qualify the enabled matrix (cards, UPI,
   netbanking, wallets where enabled) across success, failure, capture, refund,
   renewal, replay, and out-of-order events.
3. Final evaluation must use private, full non-shallow TypeScript/JavaScript
   repositories selected by architecture shape: small product, multi-user SaaS,
   multi-tenant/team, and enterprise-like boundaries. Public technical fixtures
   are not customer acceptance.
4. Feedback must use a held-out corpus to identify false positives, false truth,
   missing coverage, and performance regressions before the final go/no-go.
5. Public CLI repositories must contain no customer data, credentials,
   proprietary source, private reports, fixture contents, or competitive
   intelligence. Public evidence is limited to sanitized aggregates and hashes.

## Execution rule

Use one dependency-ready acceptance boundary per phase PR/repository. Finish the
implementation, integration, focused tests, security checks, and evidence for
that boundary together; run one full suite per merged phase; parallelize
independent CLI/Web work; move to an independent queue when provider,
customer-consent, reviewer, or production-credential evidence blocks. Checkbox
counts are recomputed from this private authoritative backlog after every
substantial batch. No item is checked for preparatory code alone.

Production access remains paused under R-041 until credential rotation and
verification. This addendum authorizes planning and code/evidence work, not an
unreviewed production write, payment charge, npm publication, release tag, or
marketing claim.
