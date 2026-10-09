# Verglos V1 release gates

## 2026-10-10 · Gate 4 Cardless EMI repair and Production code rollout

Web PR #172 merged as `98dd571` after hosted Verify
`37991101222` / job `114025167923` passed all required Web checks. The CI
Postgres service is now pinned to the matching Docker Official Image through
ECR Public, avoiding the previously observed Docker Hub rate-limit failure.
Production deployment `dpl_EtggBABkjCRWS9NWHozgH6qbvr5J` is READY and aliased
to `https://verglos.com`; read-only route/configuration smoke passed and no
Test Mode identifiers were exposed.

This advances Gate 4's provider-method binding and Production code-rollout
boundaries only. The complete enabled-method/subscription lifecycle matrix,
replay/order, timeout/retry, exactly-once, provider/ledger/entitlement
reconciliation, and Production billing/database activation remain open. No
Production state-changing write occurred. Score remains **219/61/280
(78.2%)**; no checkbox changed.

Evidence:
`docs/shipping/evidence/plan-web-014-cardless-emi-merge-production-2026-10-10.md`.

## 2026-10-10 · Gate 4 provider Cardless EMI binding repair

The read-only Test Mode inventory exposed one captured `cardless_emi` order
payment whose immutable checkout notes contained canonical `emi`. Web
`210d880` repairs the binding boundary with a single explicit mapping and
regression tests; it does not expose a new method or grant entitlement from
provider labels alone.

Focused tests, the full serial Web suite, typecheck, build, Vercel Preview,
and GitGuardian passed. The hosted schema job has not run because its GitHub
runner cannot pull `postgres:15-alpine` under Docker Hub's unauthenticated
rate limit; one retry reached the same infrastructure failure.

Gate 4 remains open for the complete enabled-method and subscription/payment
lifecycle matrix, replay/order, timeout/retry, exactly-once behavior, and
provider/ledger/entitlement reconciliation. No Production state changed.
Score remains **219/61/280 (78.2%)**; no checkbox changed.

Evidence:
`docs/shipping/evidence/plan-web-014-cardless-emi-binding-2026-10-10.md`.

## 2026-10-10 · Gate 4 partial-refund slice now evidenced

A separate isolated captured subscription payment passed identity preflight.
A 140,471-paise Test Mode partial refund returned HTTP 200; the provider
remained `captured` with cumulative refund `140471` and one processed refund;
the isolated Preview endpoint completed one fresh `refund.processed` event;
and the ledger row projected to `partially_refunded` with the same watermark.
The linked license remained active.

This closes only the partial-refund/watermark projection slice. Gate 4 remains
open for refund replay/order, the complete enabled-method matrix, renewal,
failure/expiry, timeout/retry, exactly-once, and full
provider/ledger/entitlement reconciliation. Production remains fail-closed
and untouched. Score remains **219/61/280 (78.2%)**; no checkbox changed.

Evidence: `docs/shipping/evidence/plan-web-014-preview-subscription-partial-refund-2026-10-10.md`.

## 2026-10-10 · Gate 4 full-refund slice now evidenced

A read-only identity preflight matched an isolated captured subscription
payment to Razorpay Test Mode. The full refund returned HTTP 200; the provider
reported `refunded` with one processed full refund; the isolated Preview
webhook completed one fresh `refund.processed` event; and the ledger payment
row projected to `refunded` with the full refund watermark. The linked license
remained active under the paid-time policy.

This closes only the full-refund delivery/projection slice. Gate 4 remains
open for partial refunds, refund replay/order, the complete enabled-method
matrix, renewal, failure/expiry, timeout/retry, exactly-once, and full
provider/ledger/entitlement reconciliation. Production remains fail-closed
and untouched. Score remains **219/61/280 (78.2%)**; no checkbox changed.

Evidence: `docs/shipping/evidence/plan-web-014-preview-subscription-refund-2026-10-10.md`.

## 2026-10-10 · Gate 4 pause-resume slice now evidenced

One active isolated Razorpay Test Mode subscription was paused and resumed.
Both provider calls returned HTTP 200; the isolated Preview endpoint accepted
one completed `subscription.paused` and one completed
`subscription.resumed` event; and the recently updated application row ended
in `active`. No recent payment or license row was created.

This closes only the pause/resume delivery/projection slice. Gate 4 remains
open for the complete enabled-method matrix, renewal, provider failure/expiry,
refund, replay/out-of-order, timeout/retry, exactly-once, and full
provider/ledger/entitlement reconciliation. Production remains fail-closed
and untouched. Score remains **219/61/280 (78.2%)**; no checkbox changed.

Evidence: `docs/shipping/evidence/plan-web-014-preview-subscription-pause-resume-2026-10-10.md`.

## 2026-10-10 · Production code rollout remains fail-closed

Web `51e07f5` was merged through PR #171 as `b08bb509` and deployed READY as
Production `dpl_ySGLm8Hx7DTjjSZd9Dx4tq7RrMxf`, aliased to `https://verglos.com`.
Production config validation passed. Read-only smoke returned 200 for `/`,
`/checkout`, and `/docs`, the unauthenticated subscription route returned 405,
checkout exposed no Test Mode/provider-test-key/database/protection marker, and
HSTS was present.

This advances the Production code-rollout stage only. It does not authorize or
claim Production billing/database activation, payment lifecycle acceptance,
reconciliation, monitoring, restore, or rollback. No Production state-changing
write occurred. Score remains **219/61/280 (78.2%)**; no checkbox changed.

Evidence: `docs/shipping/evidence/production-lifecycle-binding-fix-rollout-2026-10-10.md`.

## 2026-10-10 · Gate 4 signed cancellation slice now reconciles

The Preview/Test Mode lifecycle handler now recovers the immutable checkout
binding from the exact provider subscription when Razorpay omits notes and
accepts `current_end: null` on terminal lifecycle payloads. Web `d8ddeda` and
`51e07f5` passed focused webhook tests **18/18**, complete Web tests **899
total / 875 pass / 24 explicit skips / 0 fail**, typecheck, and the hosted
Preview build. A fresh canonical create/cancel operation returned HTTP 200/200;
the protected webhook endpoint emitted no diagnostic failure; and read-only
isolated DB evidence showed a recent `cancelled` row with no recent payment or
license row.

This closes only the signed cancellation binding slice. Gate 4 remains open
for the complete enabled-method matrix, renewals, failure/expiry/refund,
replay/out-of-order/exactly-once, timeout/retry, and full provider/ledger/
entitlement reconciliation. Production remained fail-closed and untouched.
Score remains **219/61/280 (78.2%)**; no checkbox changed.

Evidence: `docs/shipping/evidence/plan-web-014-preview-subscription-webhook-binding-fix-2026-10-10.md`.

## 2026-10-10 · Gate 4 real subscription cancellation finding

The isolated Preview/Test Mode route produced two canonical monthly provider
subscriptions and two successful provider cancellations. The owner-bound
status path remained safely `processing/pending` before payment. After
cancellation, Razorpay reported the fresh subscriptions as `cancelled`, while
the isolated application rows remained `pending`; no payment or entitlement
was granted.

This materially advances Gate 4 but does not close it. Signed provider
cancellation delivery, application reconciliation, replay/out-of-order
handling, renewal, expiry/failure/refund, and remaining method evidence are
still required. The branch-scoped Preview secret and Vercel protection bypass
were not copied to Production, and no Production state-changing write
occurred. Score remains **219/61/280 (78.2%)**.

Evidence: `docs/shipping/evidence/plan-web-014-preview-subscription-create-cancel-reconciliation-2026-10-10.md`.

## 2026-10-10 · Current-head consumer and Production rollout update

The exact CLI `main` head `f5686b5c` now passes clean-consumer installation of
all six public archives, public-library imports, no-implicit-engine execution,
and the `1.8.3 -> 2.0.0-alpha.1 -> 1.8.3` upgrade/rollback transition. This
advances `QUAL-CLI-006`; trusted keyless identity, legal/protected publishing,
independent review, and final acceptance remain open.

The current READY Production deployment from Web `6f932d4` passed bounded
read-only route smoke. This confirms the fail-closed code-rollout stage only;
it does not close Gate 4 or Production billing/database activation,
reconciliation, monitoring, restore, or rollback. No state-changing write
occurred and the score remains **219/61/280 (78.2%)**.

Evidence: `docs/shipping/evidence/qual-cli-006-official-current-head-2026-10-10.md`;
`docs/shipping/evidence/production-current-code-rollout-smoke-2026-10-10.md`.

## 2026-10-10 · Qualification progress and unresolved lifecycle access

The exact current CLI `main` head
`f5686b5c5aa11f45f392e647bd9d7e31830654ba` passed official CycloneDX/SPDX
validation, an 8/8 build, six-archive in-toto binding verification, and the
7/7 standards corpus. The local Cosign result is not trusted release
provenance because it used an ephemeral key and skipped the transparency log.
`QUAL-CLI-006` therefore remains open for trusted identity, legal and
protected publishing approval, independent review, clean-consumer evidence,
and final acceptance.

The isolated Preview lifecycle run did not reach the HTTP route: Vercel
withheld the hidden Preview auth-fixture secret. Gate 4 and
`PLAN-WEB-011/012/014/015` remain open; no provider, database, payment,
entitlement, or Production state changed. Score remains
**219/61/280 (78.2%)** and no checkbox changed.

Evidence: `docs/shipping/evidence/qual-cli-006-official-current-head-2026-10-10.md`;
`docs/shipping/evidence/plan-web-014-preview-auth-fixture-unavailable-2026-10-10.md`.

## 2026-10-09 · Current Production fail-closed audit

Production deployment `dpl_CvNvt9YEQLMhnEB8htL7eiCocbmG` is READY from Web
`6f932d4`. Metadata-only environment inspection found no recurring Razorpay
plan-ID or subscription-count variable, and no environment values were read.
Public route smoke passed (`/`, `/checkout`, `/docs` → 200; unauthenticated
subscription GET → 405) with no public provider-key, Test-Mode, session-token,
or database-URL marker.

This qualifies the current fail-closed Production code-rollout boundary only.
It does not close Gate 4 or the later Production billing/database activation,
reconciliation, monitoring, rollback/restore, legal, independent-review, or
final-acceptance gates. No Production state-changing write occurred; score
remains **219/61/280 (78.2%)**.

Evidence: `docs/shipping/evidence/production-current-fail-closed-audit-2026-10-09.md`.

## 2026-10-09 · Production anonymous modified-client probe

Read-only Production probes ignored forged Pro/Studio/Enterprise plan values
and returned the server-owned Free projection. Forged organization, tenant,
project, usage, evidence, and policy requests returned HTTP 404. This is
progress for `PLAN-CLI-003`, not authenticated acceptance; no Production
state-changing write occurred and no checkbox changed.

Evidence: `docs/shipping/evidence/modified-client-production-probe-2026-10-09.md`.

## 2026-10-09 · Exact-source official in-toto qualification

The merged CLI source rebuilt successfully (**8/8** tasks), produced the six
public archives, and passed the official `in-toto==3.0.0` exact-product
verification. This advances `QUAL-CLI-006` only. Trusted keyless
Sigstore/Fulcio/Rekor release identity, legal approval, protected npm
publication, and final acceptance remain separate open gates. No npm or
Production state-changing write occurred; score remains **219/61/280
(78.2%)** and no checkbox changed.

Evidence: `docs/shipping/evidence/qual-cli-006-official-intoto-merged-source-2026-10-09.md`.

## 2026-10-09 · Authoritative CLI transport hardening

Authoritative CLI commit
`1972af3abe648312a427c20dc96bbcce54db55a` now applies the clean-HTTPS-origin
boundary to every configured bearer-bearing transport. Focused tests **24/24**,
complete CLI process tests **44/44**, workspace typecheck **12/12**, and
workspace build **12/12** pass. This is backend qualification progress only;
it does not close `PLAN-CLI-003`, `QUAL-CLI-006`, Gate 4, legal/reviewer,
protected release, rollback, or final acceptance.

PR #88 is merged into CLI `main` at
`f5686b5c5aa11f45f392e647bd9d7e31830654ba`; all protected platform cells,
self-scan, and in-toto release binding passed. Production remains explicitly
in scope. The existing fail-closed Web deployment remains READY and its
read-only `/` and `/checkout` smoke returned HTTP 200. No Web redeploy or npm
publish/tag was needed for this CLI-only change, and no Production
plan/provider/payment, database/migration, entitlement, account, or
customer-data write occurred.
Score remains **219/61/280 (78.2%)**; no checkbox changed.

Evidence: `docs/shipping/evidence/cli-api-origin-hardening-authoritative-2026-10-09.md`.

## 2026-10-09 · CLI standards-validation source restoration

Public CLI `d0a3b21` restores the shared bounded parser/importer source and
standards corpus dependencies. The corpus passes **7/7** and the root Turbo
test/typecheck/build graphs pass **8/8**, **11/11**, and **6/6** tasks. This is
qualification progress only: `QUAL-CLI-006` remains open for official
validators, trusted release provenance, cross-platform clean-consumer evidence,
protected publishing, legal approval, and independent acceptance. No Production
deployment or state-changing write occurred; Production remains in scope
end-to-end with the current operation fail-closed.

Score remains **219 checked / 61 unchecked / 280 total (78.2%)**.

Evidence: `docs/shipping/evidence/qual-cli-006-standards-source-restoration-2026-10-09.md`.

## 2026-10-09 · CLI transport hardening and provider renewal boundary

CLI `439b782d` now fails closed on unsafe configured API origins across
license, entitlement, monitor, login, unlock, and telemetry transports.
Focused tests **17/17**, typecheck, and build passed. This strengthens the
backend/security substrate but does not close a release checkbox.

The read-only Test Mode inventory returned 21 subscriptions (5 active, 7
cancelled, 9 created) with no active/pending record due for charge. The
official provider material documents mock payment success/failure and plan
periods, but no immediate renewal/expiry trigger. Gate 4 remains open for
provider-generated renewal/expiry/failure/refund, external replay/order,
timeout/retry, exactly-once, and complete enabled-method evidence.

Production smoke remained read-only: `/` and `/checkout` returned 200, the
unauthenticated API GET probes returned 405, and no Test Mode marker appeared.
No Production/provider/database/entitlement/account/customer-data write
occurred. Score remains **219/61/280 (78.2%)**; no checkbox changed.

Evidence: `docs/shipping/evidence/cli-api-origin-hardening-and-provider-renewal-limit-2026-10-09.md`.

## 2026-10-09 · Gate 4 lifecycle ordering and reconciliation qualification

Web `6f932d4` prevents a later authenticated lifecycle event from regressing
an advanced subscription. Focused tests **38/38**, typecheck, the 47-page
build, remote Production validation, and read-only smoke passed. A fresh
isolated Test Mode hosted subscription reconciled active provider state to an
active ledger row with captured payment and active license; cancellation also
reconciled and preserved paid time.

The signed isolated reconciliation replay now reports **5 active→active, 7
cancelled→cancelled, 9 created→pending** across the provider inventory. This
qualifies the application ordering/reconciliation path, not provider renewal,
expiry, failure, refund, external delivery, or complete exactly-once matrix
acceptance. Production deployment `dpl_CvNvt9YEQLMhnEB8htL7eiCocbmG` remains
fail-closed; no Production write occurred. Gate 4 remains open, as do Gates
6–9. Score remains **219/61/280 (78.2%)**; no checkbox changed.

Evidence: `docs/shipping/evidence/plan-web-014-lifecycle-ordering-reconciliation-2026-10-09.md`.

## 2026-10-09 · Hosted retry repair and Production code rollout

Web `0bafe73` repairs the hosted retry state after a provider `payment.failed`
event, with **20/20** focused tests, passing typecheck, and a passing 47-page
production build. Vercel deployment `dpl_GnVheZKWyqbMX2zdDfsHmy8y9xHB` is
READY and aliased to `https://verglos.com`; remote runtime-config validation
and read-only public smoke passed. Production checkout has no Test Mode or
provider-test-key marker.

This qualifies another Production fail-closed code-rollout slice only. No
Production plan IDs, Test Mode values, provider/payment calls, database or
migration writes, entitlement changes, account changes, or customer-data
mutations occurred. The isolated Test Mode retry reached provider success, but
exact reconciliation still shows five provider `active` subscriptions mapped
to `authenticated` isolated ledger rows. Gate 4 therefore remains open for
that defect plus renewal, failure/expiry, refund, replay/out-of-order,
exactly-once, and complete enabled-method evidence. Gates 6–9 remain open.
Score remains **219/61/280 (78.2%)**; no checkbox changed.

Evidence: `docs/shipping/evidence/plan-web-014-hosted-retry-production-rollout-2026-10-09.md`.

## 2026-10-09 · Production code rollout repaired and redeployed

Web `7373c8b` fixes the browser same-origin checkout boundary in the order,
subscription, and QR creation routes. Origin/route tests **11/11**, typecheck,
the 47-page build, Vercel Production runtime-config validation, and read-only
smoke passed. Deployment `dpl_CLo119NrTffsbLiaNKw4Pq7K2kCA` is READY and
aliased to `https://verglos.com`.

This qualifies the current Production code-rollout stage only. Production
plan/payment/database/migration/entitlement/account/customer activation,
post-deploy monitoring, reconciliation, and rollback remain separate required
stages. No Production write occurred. The isolated Test Mode hosted checkout
reached provider confirmation but returned to retry, so that attempt is not
successful Gate 4 evidence. Gate 4 remains open for the complete provider
lifecycle and provider/ledger/entitlement matrix; Gates 6–9 remain open for
their external reviewers, protected release/recovery, and final acceptance.
Score remains **219/61/280 (78.2%)**; no checkbox changed.

Evidence: `docs/shipping/evidence/production-code-rollout-7373c8b-2026-10-09.md`.

## 2026-10-09 · Production fail-closed code rollout qualified

The reviewed Web source `fa1b9f5c50258ef23daaac4bbf32b24bbd590ef5` is
deployed as Vercel `dpl_4cb7vvAA88aZe3FKXftdmYfSbGJN`, READY and aliased to
`https://verglos.com`. Runtime-config validation, the remote build, and
read-only public smoke passed. Unauthenticated subscription creation is
rejected at the route boundary (GET 405; POST 403).

This opens/qualifies only the Production code-rollout stage. Production
billing, provider, database, migration, entitlement, account, and
customer-data activation remain separate gated stages. No Production plan
IDs, Test Mode values, provider/payment calls, migration execution, database
write, entitlement change, account change, or customer-data mutation
occurred. Migration `0038` exists in the source but was not applied. The
previous READY deployment `dpl_72ptf8YQyLxxXvJHVQDg2vUfh3CN` is the rollback
target.

Gate 4 and the payment rows remain open for the complete isolated provider
lifecycle and provider/ledger/entitlement reconciliation. Gates 6–9 remain
open for their real reviewer, legal, protected-release/recovery, and final
acceptance evidence. Score remains **219/61/280 (78.2%)**; no checkbox
changed.

Evidence: `docs/shipping/evidence/production-code-rollout-fa1b9f5-2026-10-09.md`.

## 2026-10-09 · Gate 4 partial hosted cancellation qualification

Isolated Preview Test Mode now has provider-bound evidence for a signed
`subscription.cancelled` event, exact replay deduplication, an older-event
rejection path, owner-bound status, and provider/database reconciliation. The
provider and database both report `cancelled`; the canonical monthly Pro
binding and paid-time license expiry remain intact.

The first synthetic request was rejected because its payload omitted the
provider-signed checkout binding; the corrected signed run is the evidence.
This does not close Gate 4. Renewal/charge, failure/expiry, refund,
timeout/retry, complete method coverage, and the full exactly-once
provider/ledger/entitlement matrix remain required. Production remains a
qualified fail-closed code rollout only. Score remains **219/61/280 (78.2%)**;
no checkbox changed.

Evidence: `docs/shipping/evidence/plan-web-014-hosted-subscription-cancel-replay-2026-10-09.md`.

## 2026-10-09 · Gate 4 checkout terminal-state repair

Web PR #171 commit `fa1b9f5` closes a code-side lifecycle gap: checkout now
stops polling and offers a restart for cancelled, completed, expired, or
halted subscriptions instead of displaying indefinite processing. Focused
tests, typecheck, build, the 896-test local serial suite, and hosted workflow
`37866290786` passed.

This does not close Gate 4. Hosted Preview is still blocked by Vercel
Authentication, and real hosted provider authorization/capture, renewal,
failure/expiry, refund, webhook delivery, and full ledger/entitlement
reconciliation remain required. Production stays fail-closed with no
plan/payment/database/entitlement write. Score remains **219/61/280 (78.2%)**;
no checkbox changed.

Evidence: `docs/shipping/evidence/plan-web-014-checkout-terminal-lifecycle-2026-10-09.md`.

## 2026-10-09 · Gate 4 progress — real Test Mode subscription cancellation

The isolated Test Mode credential now passes read-only inventory (plans HTTP
200, subscriptions HTTP 200). The local server created a subscription from the
canonical catalog using `TEST_DATABASE_URL`; Razorpay cancelled it with HTTP
200; the signed cancellation event reconciled; replay was idempotent; and an
older out-of-order lifecycle event did not restore the cancelled state.

This is a real provider creation/cancellation slice, not a Gate 4 close. The
protected deployed Preview returned HTTP 401 before the application route, so
provider-to-hosted webhook delivery and browser subscription authorization are
still unproven. Renewal/charge, capture, provider-generated failure/expiry,
refund, complete entitlement reconciliation, and hosted delivery remain open.
Production remains fail-closed and unchanged. Score remains
**219/61/280 (78.2%)**; no checkbox changed.

Evidence: `docs/shipping/evidence/plan-web-014-local-testmode-subscription-cancellation-2026-10-09.md`.

## 2026-10-09 · Production is a complete staged workstream, not a code-only stop

The current Production boundary is explicitly accepted only for the
fail-closed code-rollout stage. The full Production track remains in scope:
read-only audit; reviewed code deployment; environment/provider separation;
operation-specific migration, payment, entitlement, account, and customer-data
preflights; backup/restore and current RPO; reconciliation; post-deploy health
and monitoring; rollback/forward-fix rehearsal; and final acceptance.

Web `315a432` is migration-bearing and remains a Preview qualification
candidate. It must not be promoted to Production until the current-backup,
migration, reconciliation, and rollback preflight is complete. The known
Production deployment remains READY at
`dpl_72ptf8YQyLxxXvJHVQDg2vUfh3CN`; this batch made no Production deploy or
plan, provider/payment, database/migration, entitlement, account, or
customer-data write. Test Mode values remain excluded from Production.

The Preview auth repair and hosted/local evidence are recorded in
`docs/shipping/evidence/production-and-preview-auth-rollout-2026-10-09.md`.
Score remains **219/61/280 (78.2%)**; no checkbox changed.

## 2026-10-09 · Web PR #171 integrated and hosted-verified

PR #171 is now based on current `main` at `be8cd219` and is mergeable. The
private-runner migration remains `0037`, while the unreleased subscription
expiry migration is `0038`. The ordered migration check, full Web serial suite
(**896 total / 872 pass / 24 explicit skips / 0 fail**), hosted workflow
`37864205130`, Vercel Preview, GitGuardian, typecheck, build, dependency and
licence checks all passed. The PR remains open and unmerged.

Production was only inspected read-only and remains READY at
`dpl_72ptf8YQyLxxXvJHVQDg2vUfh3CN`; this batch made no Production deploy,
migration, provider/payment, database, entitlement, account, or customer-data
write. Production is therefore still included at the fail-closed code-rollout
stage. Gate 4, migration activation, recovery/rollback evidence, and external
provider/reviewer gates remain open. Score remains **219/61/280 (78.2%)**; no
checkbox changed.

Evidence: `docs/shipping/evidence/web-pr-171-main-integration-2026-10-09.md`.

## 2026-10-09 · Current Web migration-tail restore rehearsal

The current Web branch `da45a97` was restored into disposable PostgreSQL 15,
migrated through **38** migrations, reconciled successfully, and exercised the
stopped-database fail-closed path. RTO was **3,302 ms**. The available snapshot
is **441 hours** old, so the critical 48-hour RPO gate correctly remains open.

This strengthens current-branch recovery evidence but does not authorize a
Production migration or close `QUAL-WEB-005`, `DIST-006`, the payment rows, or
the Production activation track. No Production/provider/database/payment/
entitlement/account/customer-data write occurred. Score remains
**219/61/280 (78.2%)**; no checkbox changed.

Evidence: `docs/shipping/evidence/qual-web-004-current-migration-tail-rehearsal-2026-10-09.md`.

## 2026-10-09 · Production fail-closed environment audit

The read-only Vercel audit confirms Production deployment
`dpl_72ptf8YQyLxxXvJHVQDg2vUfh3CN` remains READY at `https://verglos.com` and
has no recurring Razorpay plan-ID or subscription-count variable configured.
No environment values were revealed. No deployment, provider, database,
migration, payment, entitlement, account, or customer-data write occurred.

This keeps Production accepted for the current fail-closed code-rollout
stage. It does not close Gate 4 or the later billing/database activation,
monitoring, reconciliation, and rollback stages. Score remains
**219/61/280 (78.2%)**; no checkbox changed.

Evidence: `docs/shipping/evidence/production-fail-closed-env-audit-2026-10-09.md`.

## 2026-10-09 · Gate 7 preparation — legal/licensing addendum

The private legal review addendum now covers Trivy image/release/NOTICE use,
`detect-secrets`, scanner fixtures, Hunt recipes/rules, modification and
redistribution, trademarks, required notices, scope, expiry, reviewer
identity, conditions, and approval reference. This is a review request only;
it is not legal approval and does not clear any release artifact. Gate 7,
`LIC-002`, `LIC-003`, and dependent release rows remain open until an
authorized reviewer completes it against the exact release candidate. No
production, provider, database, payment, deployment, registry, signing,
customer, or release write occurred. Score remains **219/61/280 (78.2%)**;
no checkbox changed.

Evidence: `docs/shipping/legal/legal-review-addendum-2026-10-09.md`.

## 2026-10-09 · Gate 6 preparation — current Hunt reviewer packet

The private independent-review packet now targets CLI
`8bea4be2fa18533eafd088122be769e942965626`, cites hosted self-scan
`37827269372`, and supplies the current pinned Docker evidence and reviewer
procedure. This is preparation only: Codex cannot be the independent signer.
Gate 6, `HUNT-011`, and `QUAL-CLI-004` remain open until a real AppSec
reviewer who did not implement the sandbox runs the Linux/Docker tests and
returns a signed report. No production, provider, database, payment,
deployment, registry, signing, customer, legal, or release write occurred.
Score remains **219/61/280 (78.2%)**; no checkbox changed.

Evidence: `docs/shipping/evidence/hunt-independent-review-packet-2026-10-09.md`.

## 2026-10-09 · Gate 4 progress — failed invoice-only subscription path

Web `da45a97` qualifies the invoice-only failed subscription path in
isolated Preview: a failed payment without `subscription_id` is bound through
its invoice, recorded as failed with a pending subscription lifecycle, and
does not grant entitlement. Focused tests **14/14**, isolated integration
**4/4**, full Web suite **892 total / 869 pass / 23 explicit skips / 0 fail**,
typecheck/build/schema checks, and Preview deployment
`dpl_HbYCQG4hnDH6Jew48YcNUuRkVVaA` passed.

The current gate-testing plan/subscription inventory returned HTTP 401, so
real provider lifecycle execution is paused pending corrected isolated
credentials. Gate 4 is not closed. Production remains included through the
existing fail-closed code rollout; this batch made no Production plan,
payment/provider, database/migration, entitlement, account, or customer-data
write. Score remains **219/61/280 (78.2%)**; no checkbox changed.

Evidence: `docs/shipping/evidence/plan-web-014-failed-subscription-invoice-binding-2026-10-09.md`.

## 2026-10-09 · Gate 4 progress — expiry code qualified, provider expiry open

The Web expiry path is implemented and qualified in isolated Preview/Test
Mode from `4ba15ad`: the fresh database applied all 38 migrations, focused
webhook/ledger integrations passed **13/13**, **1/1**, and **3/3**, and the
full suite passed **891 total / 868 pass / 23 explicit skips / 0 fail**.
Preview deployment `dpl_EhFoWzfHSbQt5LkRYaxS7MdGqc4u` is READY.

This is not a Gate 4 close. Provider-generated expiry, renewal/failure,
refund, replay/out-of-order, and complete provider/ledger/entitlement
reconciliation remain open. Production is still actively included through
the current fail-closed code rollout `dpl_72ptf8YQyLxxXvJHVQDg2vUfh3CN`; the
new migration-bearing commit requires its own Production migration preflight
before promotion. No Production plan IDs, payment/provider writes, database
or migration writes, entitlement changes, account changes, or customer-data
mutations occurred. Score remains **219/61/280 (78.2%)**; no checkbox changed.

Evidence: `docs/shipping/evidence/plan-web-014-expired-lifecycle-preview-2026-10-09.md`.

## 2026-10-09 · Gate 4 progress — Test Mode cancellation

The newest active isolated Test Mode subscription was cancelled immediately
through Razorpay (`cancel_at_cycle_end=false`), returned HTTP 200 with
`cancelled`, and reconciled through the isolated Preview webhook/database.
The corresponding captured payment and active license remained present for
already-paid time. No direct row edit or Production operation occurred.

This is a Gate 4 qualification slice, not closure. Renewal, failure/halt,
expiry/completion, refund, replay/out-of-order, and full provider/ledger/
entitlement reconciliation remain open. Score remains **219/61/280 (78.2%)**;
no checkbox changed. Evidence:
`docs/shipping/evidence/plan-web-014-test-mode-subscription-cancellation-2026-10-09.md`.

## 2026-10-09 · Canonical correction — latest Production code-rollout record

The older `dpl_HRbg2hLmHe2WTFxvupkewdw3u9hg` entry below is historical and is
superseded by Web source `a95deef` and Production deployment
`dpl_72ptf8YQyLxxXvJHVQDg2vUfh3CN`, READY and aliased to `https://verglos.com`.
The remote runtime-config check, 45-page build, and read-only public smoke
passed. This remains a complete fail-closed code rollout only: no Production
plan IDs, payment/provider writes, database or migration writes, entitlement
changes, account changes, or customer-data mutations occurred. Gate 4 is still
open for the remaining provider lifecycle and provider/ledger/entitlement
reconciliation evidence. Score remains **219/61/280 (78.2%)**; no checkbox
changed. Canonical evidence:
`docs/shipping/evidence/plan-web-014-subscription-invoice-reconciliation-and-production-rollout-2026-10-09.md`.

## PLAN-WEB-014 Preview subscription authorization limitation · 2026-10-09

The bounded isolated Preview/Test Mode retry reached the catalog-bound
subscription route with HTTP 200 and loaded the subscription-card
mandate/OTP step. Razorpay rejected the bounded OTP attempt; a second
bank-like OTP interaction also failed. This retry created no new captured
payment or entitlement claim. Read-only isolated aggregates were reconciled
without manual row edits: 38 migrations, 5 active/7 cancelled/12 pending
subscription rows, 4 captured subscription payments, 2 active Pro licenses,
and 61 completed webhook rows.

Gate 4 remains OPEN. `PLAN-WEB-011`, `PLAN-WEB-012`, `PLAN-WEB-014`, and
`PLAN-WEB-015` remain unchecked pending a provider-supported subscription
mandate/renewal fixture plus provider failure/expiry/refund/replay/
out-of-order and complete provider/ledger/entitlement reconciliation. No
Production plan IDs, payment/provider writes, database/migration writes,
entitlement changes, account changes, or customer-data mutations occurred.
Evidence: `docs/shipping/evidence/plan-web-014-preview-subscription-otp-limitation-2026-10-09.md`.

## QUAL-CLI-006 current standards corpus · 2026-10-09

The current CLI standards-validation corpus passed 7/7, and the shared package
typecheck/build passed. This does not close `QUAL-CLI-006`: host-level
`cosign`, `in-toto-verify`, `syft`, and `trivy` were unavailable, and the
required official-validator, exact release-candidate consumer,
trusted-keyless-identity, protected-publish, legal, and final-acceptance
evidence is still missing. No checkbox changed and no Production/provider/
database/payment/deployment/npm state changed. Evidence:
`docs/shipping/evidence/qual-cli-006-standards-corpus-current-2026-10-09.md`.

## QUAL-CLI-006 official artifact-validator pass · 2026-10-09

The generated 150-component CycloneDX 1.5 SBOM passed cached official
CycloneDX CLI `0.33.1` validation. Cached Cosign `v2.4.1` also completed an
ephemeral local sign/verify with transparency-log upload/verification disabled.
This does not close `QUAL-CLI-006`, `DIST-002`, or `DIST-003`: trusted
Fulcio/OIDC identity, Rekor/public provenance, exact release-candidate
consumer install/upgrade/rollback, complete official-format validation,
protected publishing, and legal approval remain missing. No checkbox changed.
Evidence: `docs/shipping/evidence/qual-cli-006-official-cyclonedx-cosign-2026-10-09.md`.

## Current Production code-rollout qualification · 2026-10-09

Production deployment `dpl_HRbg2hLmHe2WTFxvupkewdw3u9hg` reached READY and is
aliased to `https://verglos.com` from reviewed Web source
`54e6fd0344b2f8b74e2c4d5ff15a0b02c12b51dd`. Local typecheck, the configured
Web serial suite (**865 pass / 23 explicit skips / 0 fail**), the 45-page
build, remote Production runtime-config validation, and remote build all
passed.

Read-only public smoke returned HTTP 200 for `/`, `/checkout`, and `/docs`;
the POST-only subscription-creation route returned 405 to GET and the
owner-bound subscription-status route returned 401 to unauthenticated GET.
Production checkout exposed no Test Mode or provider-plan marker and retained
private no-store caching plus HSTS.

This qualifies the complete fail-closed Production code-rollout slice. It does
not claim live billing or data activation. No Production plan IDs, database or
migration writes, payment/provider writes, entitlement changes, account
changes, or customer-data mutations occurred. Those are included deferred
Production stages and remain blocked until their operation-specific preflight,
backup/restore or recovery evidence, reconciliation, and rollback/forward-fix
decision exist.

Gate 4 remains open for the complete isolated provider subscription lifecycle
and provider/ledger/entitlement reconciliation. Score remains **219 checked /
61 unchecked / 280 total (78.2%)**; no checkbox changed.

Evidence: `docs/shipping/evidence/production-code-rollout-dpl-HRbg2hLmHe2WTFxvupkewdw3u9hg-2026-10-09.md`.

## Current reconciliation · 2026-10-09

The earlier Test Mode credential blocker is superseded. The local isolated
Test Mode pair was accepted by Razorpay with HTTP 200; no rotation was
needed. Canonical Pro monthly and annual Test Mode plans now exist, and only
their non-secret IDs were configured in Preview.

Preview deployment `dpl_CwmAKov2aoDJmyk9o5LqHS849TEJ` and Production
deployment `dpl_E3Xr4UZe1ZXaZfRB7ygvS8HvmQTs` both reached READY. Production
was aliased to `https://verglos.com`; its build, runtime configuration,
`/`, and `/checkout` smoke passed. Production has no Test Mode plan IDs, so
recurring billing remains disabled there. This is a completed code-rollout
slice, not Gate 4 acceptance. No Production database, migration, payment,
provider, entitlement, account, or customer write occurred.

Gate 4 remains open for the real isolated subscription authorization,
renewal/charge, failure, cancellation/expiry, refund, replay/out-of-order,
and provider/ledger/entitlement reconciliation evidence. Production is now
an active execution track: continue read-only audit, smoke, monitoring,
rollback preparation, and later live-mode billing/database activation only
after the operation-specific preflight.

Score remains **219 checked / 61 unchecked / 280 total (78.2%)**; no checkbox
changed.

Evidence: `docs/shipping/evidence/plan-web-011-015-test-mode-plans-production-rollout-2026-10-09.md`.

## Razorpay Test Mode credential blocker · 2026-10-09

Read-only Test Mode plan discovery returned HTTP **401** with the local test
credential pair. The dashboard confirmed a different current Test Mode key and
offers key regeneration with an explicit old-key expiry choice. No rotation
was performed. Gate 4 remains open until the authorized operator updates the
isolated Test/Preview credential and the canonical recurring plans are created
and exercised. No Production state changed; score remains **219/61/280
(78.2%)**.

Evidence: `docs/shipping/evidence/plan-web-011-012-test-provider-credential-blocker-2026-10-09.md`.

## Hosted subscription route implementation · 2026-10-09

Web commit `54e6fd0` implements the previously missing subscription-creation
surface and its owner-bound status read. It is qualified with typecheck,
focused **43/43** tests, isolated database/provider route integration **2/2**,
and a **45-page** production build. The provider test seam does not substitute
for real Razorpay Test Mode evidence.

Gate 4 therefore remains open. The next acceptance artifact must use the
isolated Test Mode account and record real authorization, subscription charge /
renewal, failed charge, cancellation or expiry, refund, replay/out-of-order,
and entitlement reconciliation results. No Production database, payment,
provider, environment, or deployment write occurred; score remains
**219/61/280 (78.2%)**.

Evidence: `docs/shipping/evidence/plan-web-011-012-subscription-checkout-code-2026-10-09.md`.

## Gate 4 scan result · 2026-10-09

The provider-method catalog/checkout abstraction portion is accepted as
`PLAN-WEB-013`; its checkbox is now closed. Gate 4 as a whole remains open:
`PLAN-WEB-011`, `PLAN-WEB-012`, `PLAN-WEB-014`, and `PLAN-WEB-015` still require
the stated provider lifecycle and Production-reconciliation evidence. The
current evidence proves the supported four-method catalog and the isolated
code-side lifecycle, but the Razorpay Test Mode account has no subscriptions.
The subscription-creation route is now implemented, but no unsupported
renewal/cancellation/expiry result is inferred. Score is **219/61/280
(78.2%)**.

## PLAN-WEB-014 Preview and Production method set narrowed to provider-testable methods · 2026-10-09

The isolated Preview/Test configuration now enables only `card`,
`netbanking`, `wallet`, and `emi`. `upi`, `upi_qr`, and `paylater` were
removed after the provider exposed UPI only as an unsafe-to-scan QR flow and
the Pay Later test fixture rejected without creating a payment. The local test
fixture matches Preview, and deployment
`dpl_H7cXmiGNqddiEvwY9Dgf8rWLeZEK` built successfully; its checkout response
contains only the four enabled method names. The same allowlist was then
applied to Production; deployment `dpl_J1kkum4myNwMnt96EpCQwKtfvnB9` reached
READY, `verglos.com/checkout` returned HTTP 200, and the Production checkout
response also contains only the four enabled method names.

This removes two provider-unavailable methods from the acceptance scope, but
does **not** close PLAN-WEB-014. The four enabled methods still need complete
provider success/failure/refund evidence and the renewal, cancellation,
expiry, replay/out-of-order, timeout, tenant-binding, and partial-refund
cases. No database, key, webhook, payment, entitlement, or customer record
changed. No checkbox changed; count remains **218/62/280 (77.9%)**. Evidence:
`docs/shipping/evidence/plan-web-014-preview-hosted-payment-lifecycle-2026-10-09.md`.

## PLAN-WEB-014 qualification rerun · 2026-10-09

The read-only Razorpay Test Mode aggregate contains 16 canonical-amount
payments: captured outcomes for card, netbanking, wallet, and the provider's
`cardless_emi` outcome; failed outcomes for card, netbanking, and wallet; and
two processed full refunds. No UPI, UPI QR, or Pay Later row exists. The
account has zero Test Mode subscriptions, so provider-side renewal,
cancellation, and expiry evidence is unavailable rather than inferred.

The restarted isolated Docker PostgreSQL path passed the hosted-order,
ledger-renewal/refund, webhook-handler, and webhook-claim/replay integrations
(6/6), the focused payment/runtime suite (55 pass, 0 fail, 1 intentional
skip), typecheck, and the 43-route production build. This closes the
code-side qualification slice, but does not close PLAN-WEB-014: a provider
subscription lifecycle and the remaining provider-side matrix are still
required. No checkbox changed; count remains **218/62/280 (77.9%)**. Evidence:
`docs/shipping/evidence/plan-web-014-preview-hosted-payment-lifecycle-2026-10-09.md`.

## PLAN-WEB-014 isolated Preview hosted lifecycle correction · 2026-10-09

The first real Razorpay Test Mode capture exposed a production-code defect in
the Preview runtime: the Neon HTTP driver cannot execute the interactive
transactions required by the billing ledger. Web commit `d8dc35a` switched
the runtime database module to the existing PostgreSQL driver with bounded
connection reuse and prepared statements disabled for Neon pooled
connections. Typecheck, focused Razorpay tests, and the production build
passed; the fix was deployed only to isolated Preview.

The protected Preview endpoint then accepted signed provider-state replays for
canonical Test Mode order captures and full refunds. The isolated Neon
database recorded completed capture/refund webhook events, payment rows with
the full refund watermark, linked licenses, and inactive licenses after full
refund. The six hosted method surfaces remained visible at the canonical
price.

This qualifies the hosted capture → entitlement → full-refund reconciliation
slice, but does **not** close the complete PLAN-WEB-014 matrix. Each enabled
method still needs documented provider success/failure behavior, and renewal,
cancellation, expiry, replay/out-of-order, timeout, tenant-binding, and
partial-refund evidence remain open. No checkbox changed; count remains
**218/62/280 (77.9%)**. Evidence:
`docs/shipping/evidence/plan-web-014-preview-hosted-payment-lifecycle-2026-10-09.md`.

## PLAN-WEB-014 isolated Preview hosted payment matrix · 2026-10-09

The isolated Preview checkout used Razorpay Test Mode, the canonical monthly
Pro amount, and the six configured hosted methods: UPI, Cards, Netbanking,
Wallets, EMI, and Pay Later. Fresh Preview order creation returned HTTP 200;
status polling returned HTTP 200 with a read-only `pending` result; and
provider cancellation/failure returned the user to a retryable state. The
provider UI exposed UPI as QR-only in this session, while card and netbanking
branches stalled at the provider's simulated OTP/processing states after
waiting. Wallet and Pay Later had previously reached provider OTP/eligibility
screens without capture.

This is application-boundary and failure-path evidence only. No successful
capture, signed webhook delivery, refund, or entitlement/license
reconciliation was observed, so Gate 4 and the payment-related backlog items
remain open. No production/provider/live-payment/database write occurred; the
count remains **218/62/280 (77.9%)**. Evidence:
`docs/shipping/evidence/plan-web-014-preview-hosted-payment-matrix-2026-10-09.md`.

## QUAL-WEB-006 authenticated account performance trace · 2026-10-09

Production `/account` lab reload measured LCP **784 ms**, TTFB **100 ms**,
render delay **684 ms**, and CLS **0.00**; CrUX field data was unavailable.
The trace's cross-tab network chain was contaminated by a concurrent YouTube
tab and was excluded. This strengthens lab evidence only; field INP,
large-data, complete-route, screen-reader, and final truth evidence remain
open. No checkbox or production state changed; count remains
**218/62/280 (77.9%)**. Evidence:
`docs/shipping/evidence/qual-web-006-account-performance-trace-2026-10-09.md`.

## QUAL-WEB-006 authenticated account runtime requalification · 2026-10-09

The current authenticated production `/account` route passed a clean
read-only reload, DOM accessibility checks, Lighthouse
Accessibility/Best-Practices/SEO **100/100/100**, and bounded keyboard
traversal with named links and no unnamed controls. This strengthens the
authenticated account-runtime portion of `QUAL-WEB-006` only. Human
screen-reader, complete paid-route, large-data, field-CWV, and final truth
evidence remain open. Direct paid-route navigation redirected through the
existing paid-context gate without a paid fixture; privacy and organizations
loaded read-only. No checkbox or production state changed; count remains
**218/62/280 (77.9%)**. Evidence:
`docs/shipping/evidence/qual-web-006-authenticated-account-runtime-2026-10-09.md`.

## QUAL-WEB-006 / PLAN-WEB-015 production checkout/browser recheck · 2026-10-09

Read-only Chrome DevTools inspection of a separate production checkout tab
rendered UPI, Cards, Netbanking, Wallets, EMI, and Pay Later with no console
messages. Desktop/mobile Lighthouse Accessibility and Best Practices were
100/100; SEO was 80 (missing meta description) and Agentic Browsing was 50
(`llms.txt` lacks the recommended H1). Production did not identify as Test
Mode, so this is not payment lifecycle or production reconciliation evidence.
No production/provider/payment/database/deployment/account write occurred;
`PLAN-WEB-011/012/013/014/015` and `QUAL-WEB-006` remain open. Backlog
remains **218/62/280 (77.9%)**. Evidence:
`docs/shipping/evidence/qual-web-006-plan-web-015-production-checkout-cdp-2026-10-09.md`.

## PLAN-WEB-014 current Web main local qualification · 2026-10-08

Exact Web `origin/main` `cedf199855a5c4734122ae4849253156328cff1b` passed the
focused payment/ledger/webhook slice **31/31** against disposable PostgreSQL
15 with all **38** ordered migrations applied. A fresh-database configured
serial run passed **885/887**, with **2 explicit skips and 0 failures**;
typecheck, schema, migration ordering, 45-route build, and local public-route
checks passed. The first serial attempt reused the migrated payment database
and produced eight expected fixture table-collision errors; the result was
discarded and the suite rerun against a fresh database.

This does not pass the payment release gate: no account-enabled provider method
truth, real Razorpay lifecycle, credential rotation, or production
reconciliation was exercised. No production/provider/payment/deployment or
customer write occurred. `PLAN-WEB-013/014/015` remain open and the backlog
remains **218/62/280 (77.9%)**. Evidence:
`docs/shipping/evidence/plan-web-014-current-main-local-qualification-2026-10-08.md`.

## CLI backend, Hunt, and distribution qualification · 2026-10-08

The current CLI source passed the configured package tests, build, typecheck,
lint, ordinary Hunt tests **45/45**, pinned Docker adversarial run **60 pass /
1 explicit macOS namespace skip / 0 fail**, and release/public-boundary
contracts **10/10**. Public package packing passed after CI-equivalent
cross-platform optional-package installation. The strict release gate then
failed closed at license review with seven blockers: six BlueOak-1.0.0
dependencies (`glob`, `lru-cache`, `minimatch`, `minipass`, `minipass-flush`,
`path-scurry`) and nested `benchmark@1.0.0` conflicting with `fast-uri`.
This does not pass LIC-002/003, DIST-001–003/006, or QUAL-CLI-006; no
checkbox changed and no publication occurred. Evidence:
`docs/shipping/evidence/qual-cli-backend-hunt-distribution-2026-10-08.md`.
The exact package/source/digest legal review packet is
`docs/shipping/legal/transitive-license-review-2026-10-08.md`; it is not an
approval and does not clear the blockers.

## QUAL-WEB-006 deployed docs contrast recheck · 2026-10-08

Production `/docs/2.0.0` confirms the merged contrast correction: desktop and
mobile Lighthouse Accessibility/Best Practices are 100/100, no console
warnings/errors were captured, and mobile has no horizontal overflow or
unnamed focusable controls. The route still fails the held canonical and
optional `llms.txt` metadata audits. This does not pass QUAL-WEB-006 because
human screen-reader, authenticated paid/org, large-data, field-CWV, and
complete-route evidence remain absent. No checkbox or production state changed.

Evidence: `docs/shipping/evidence/qual-web-006-deployed-docs-contrast-2026-10-08.md`.

## PLAN-CLI-004 / QUAL-WEB-006 fat batch · 2026-10-08

CLI PR #84 source `7c02099` adds process-level legacy-v1 activation fallback
evidence; focused 63/63 and local full CLI test/typecheck/build/lint gates pass.
PR #84 merged as `94829e1a4fc8e42dd67545e99cbe9a3a837b9482` after all hosted
platform, self-scan, and in-toto checks passed.
Web PR #164 source `4e00cc3` corrects the `/docs/2.0.0` CTA contrast defect
and merged as `394d697903b7fa12ec537dc667f3807cdd75f588` after hosted
typecheck/schema, Vercel, Preview Comments, and GitGuardian passed. Local
typecheck, truth-registry 25/25, serial 862 passed / 24 environment-gated
skips / 0 failed, 45-page build, and post-fix Lighthouse Accessibility/Best
Practices 100/100 pass. The production browser sweep remains partial and
metadata/llms findings stay held under the truth freeze. Neither backlog item
passes yet:
deployed compatibility, complete authenticated browser/CWV evidence, human
screen-reader review, and the payment/provider gates remain open. No checkbox,
production, provider, database, payment, migration, or deployment state
changed. Count remains **218/62/280 (77.9%)**.

Evidence: `docs/shipping/evidence/plan-cli-004-qual-web-006-batch-2026-10-08.md`.

## DIST-006 / QUAL-WEB-006 current checkpoint · 2026-10-08

CLI PR #83 merged as `c1a2856`. The local rollback/revocation rehearsal covers
the five required kinds and preserves historical references, but it does not
pass the distribution gate: authenticated registry/engine/feed/signing/Web
rollback, trusted publication, legal clearance, and operational review remain
missing. Hosted in-toto, self-scan, all macOS/Ubuntu cells, and Windows Node 22
and 24 passed; Windows Node 20 remains in progress. The read-only `/docs`
browser audit passed Accessibility/Best Practices/SEO at 100 with no console
warnings, but found stale dollar pricing and therefore does not pass the final
truth/public-copy gates. No checkbox or production state changed; backlog
remains **218/62/280 (77.9%)**.

## Mirror reconciliation note · 2026-10-08

The objective references `VERGLOS_TRUTH_REGISTRY.md`, but the private tracker
does not currently contain a mirrored copy. The public CLI worktree contains an
older untracked founder-owned copy; it is preserved and is not used as current
acceptance truth. Current private backlog, evidence, status, risks, decisions,
and release-gate entries are the authoritative shipping record until a reviewed
truth-registry reconciliation batch is authorized.

## ENT-CLI-001 concurrent result replay hardening · 2026-10-08

Web PR #160 merged as `4cc1f5d3098435a845cffaae010f72c981ac8bcd`. A fresh
PostgreSQL E2E proves the organization/job uniqueness fence resolves concurrent
identical uploads as one creation plus one idempotent replay, while conflicting
payloads remain refused. Hosted Verify, Vercel, and GitGuardian passed. This
does not pass ENT-CLI-001: approved runner execution, operational credential
exchange, cross-platform qualification, independent Hunt review, and
enterprise acceptance remain required.

Evidence: `docs/shipping/evidence/ent-cli-001-private-runner-replay-race-2026-10-08.md`.

## ENT-CLI-001 hosted private-runner transport · 2026-10-08

Web PR #159 merged as `2b3f37918fb386b0d5ffa231fa5f6ee11ae6e07b` after the
real route lifecycle passed **1/1** against a fresh loopback PostgreSQL 15
fixture. The first empty poll activates an enrolled runner and exact completed
result replays are idempotent; conflicts remain refused. Focused contracts,
clean serial tests, Web static checks, hosted Verify, Vercel, and GitGuardian
all pass. This still does not pass ENT-CLI-001: operational credential
exchange, approved runner execution, cross-platform qualification, independent
Hunt review, and enterprise acceptance remain required. No production migration
or write occurred.

Evidence: `docs/shipping/evidence/ent-cli-001-private-runner-e2e-2026-10-08.md`.

## QUAL-WEB-006 / PLAN-WEB-015 runtime observation · 2026-10-08

Read-only production CDP inspection is recorded, including the hosted-method
labels and zero observed console/exception events. It does not pass either
gate: full accessibility/performance evidence and provider/configuration/
lifecycle reconciliation remain outstanding.

Evidence: `docs/shipping/evidence/qual-web-006-plan-web-015-production-readonly-cdp-2026-10-08.md`.

## CLI check-payload batch merged · 2026-10-08

The command path is merged at `d865fb1809ad651fd6ae7e011f089dee07733d79`
after all hosted checks passed. This removes the local command-wiring gap but
does not close signed policy activation, hosted SCM/provider delivery, or
TEAM-CLI-002.

## Payment method/lifecycle local qualification · 2026-10-08

The targeted Web payment suite is green locally (56 pass, 2 expected
PostgreSQL-gated skips). This validates code-side method and lifecycle guards
only; it does not satisfy live Razorpay Test Mode or production reconciliation
gates. PLAN-WEB-011/012/013/014/015 remain open.

Evidence: `docs/shipping/evidence/plan-web-013-015-payment-method-local-qualification-2026-10-08.md`.

## TEAM-CLI-002 command-path progress · 2026-10-08

PR #80 head `58bb9383bdd1273e973620472ffc2d9255be7e9d` passes focused and full
local CLI checks for source-free payload generation. Hosted platform matrix
and self-scan are pending. This is not SCM delivery evidence and does not
close TEAM-CLI-001/002, TEAM-WEB-006, or a release gate. Backlog remains
218/62/280 (77.9%).

Evidence: `docs/shipping/evidence/team-cli-002-cli-check-payload-2026-10-08.md`.

## CLI entitlement cache and reporting · 2026-10-08

PR #80 (`8f731b3`) passes local CLI qualification for cache identity and
whoami output. Hosted workflows 37772968379 and 37772968314 are still pending.
This does not close PLAN-CLI-001/002/003/004 or a production/payment/release
gate. Backlog remains 218/62/280 (77.9%).
Evidence: `docs/shipping/evidence/plan-cli-cache-identity-whoami-2026-10-08.md`.

## PLAN-WEB-014 Preview authentication fixture · 2026-10-08

Web PR #157 merged as `51bb6fe701b65ffcb2a322e1ff5d67eeb99df3fe` after hosted
verification, public-boundary, dependency/license, security, and Vercel checks
passed. The internal fixture allowed an isolated local browser run to reach the
real hosted order route without Clerk credentials. The supplied Test Mode
provider credential failed before order creation, so no success, failure,
capture, refund, renewal, webhook, replay, out-of-order, or entitlement
evidence is accepted. PLAN-WEB-014/015 remain open.

## PLAN-WEB-015 production environment shape recheck · 2026-10-07

Vercel production and the local production env file both lack
`RAZORPAY_ENABLED_PAYMENT_METHODS`. The runtime guard correctly fails closed
before promotion. The gate remains open pending R-041 rotation, approved
account-enabled method truth, and a reviewed production configuration. No
environment/provider/database/payment write occurred.

## PLAN-WEB-014/015 merge and production fail-closed boundary · 2026-10-07

Web PR #155 merged as main commit
`f00b7225ae0c0b8f518e404828aa6247c97dd322` after hosted Verify
`37659362013`, GitGuardian, and Vercel Preview Comments passed. The automatic
production deployment `dpl_Btjq8knubUab1ENgF7CEtzdUFV7G` failed before build
because `RAZORPAY_ENABLED_PAYMENT_METHODS` is missing in production. The
live alias therefore remains on the legacy QR-only checkout. This gate stays
open: do not guess the method set or configure production until R-041 is
rotated and the account-enabled provider methods are established. No
production configuration, provider, database, payment, or customer-state
write occurred.

## PLAN-WEB-014 Test Mode pre-checkout disclosure · 2026-10-07

Web PR #155 head `6b0c4f9` adds a truthful pre-checkout Test Mode notice and
fails closed on public/server Razorpay key drift. Local and pinned Node 22
focused checks, typecheck, and the 43-page preview build passed; hosted
checks later passed and the PR merged. This does not qualify payment methods
or lifecycle; the production deployment failed closed on the missing method
allowlist. `PLAN-WEB-014/015` remain open.

## PLAN-WEB-014 Test Mode read-only inventory freeze · 2026-10-07

The final bounded read-only Test Mode inventory observed 10 created orders, 4
payments (3 created and 1 captured), no subscriptions or plans, and one
webhook configuration. It provides no account-enabled method truth and no
payment lifecycle evidence. Further provider calls are frozen until the
flagged Test Mode credential is rotated/repaired. The payment and production
gates remain open; no provider or production state changed.

## PLAN-WEB-014 Test Mode credential preflight · 2026-10-07

The supplied test environment authenticated successfully to Razorpay Test Mode
via a redacted read-only Orders request (HTTP 200) and declares seven methods.
This does not qualify provider-account method availability or any payment
lifecycle. Browser evidence is pending because both browser MCP transports
returned `Transport closed`; a fallback probe attempted one Test Mode order but
did not capture its result. No lifecycle evidence was accepted. No production
state changed; the gate remains open.

## Web current-main Node 22 qualification · 2026-10-07

Exact Web `origin/main` `14988371cdae94d66d068b49d07cc31f0b26c5ea` passed
pretest **49/49**, main **879/880** with one explicit environment-gated skip,
zero failures, all **37** local migrations, schema, negative-boundary **2/2**,
truth registry **25/25**, and typecheck under pinned Node `22.23.3`. This does
not pass provider lifecycle, production reconciliation, build/deploy, or
final payment/release acceptance. No checkbox changed; backlog remains
**218 checked / 62 unchecked / 280 total (77.9%)**.

## QUAL-CLI-006 Node 22 runtime qualification · 2026-10-07

Exact CLI `origin/main` `7d060b2852551cc017bbb2b5f70bad22843e7273` passed
fresh-install test **12/12**, typecheck **13/13**, and build **8/8** in the
pinned Node `22.23.3` container. This advances the runtime gate but does not
pass QUAL-CLI-006: official validator completeness, trusted Sigstore and
publishing identity, legal/license review, independent acceptance, and final
release approval remain required. No checkbox changed; backlog remains
**218 checked / 62 unchecked / 280 total (77.9%)**.

## PLAN-WEB-015 production configuration boundary · 2026-10-07

Production deployment of Web commit `1498837` fails closed because
`RAZORPAY_ENABLED_PAYMENT_METHODS` is missing, and the live alias still serves
the legacy QR-only checkout. This does not pass production reconciliation. The
method set must come from account-enabled provider configuration after the
R-041 credential rotation; it must not be guessed from local or Test Mode UI.
No production write or checkbox change occurred. Evidence:
`docs/shipping/evidence/plan-web-015-production-preflight-2026-10-07.md`.

## PLAN-WEB-013/014 current-main hosted order qualification · 2026-10-07

Exact Web main `14988371cdae94d66d068b49d07cc31f0b26c5ea` passed the focused
hosted-order/payment suite **28/28** with isolated PostgreSQL, plus typecheck,
schema, 37-migration ordering, negative-boundary **2/2**, truth-registry
**25/25**, and a 43-page preview build. This advances implementation evidence
but does not pass the payment gate: real Razorpay Test Mode order/payment,
capture, failure, refund, renewal, webhook, and production reconciliation
evidence remain absent. No checkbox or production state changed. Evidence:
`docs/shipping/evidence/plan-web-013-015-current-main-payment-order-qualification-2026-10-07.md`.

## PLAN-WEB-014/015 migration-bootstrap boundary · 2026-10-07

Current Web main `14988371cdae94d66d068b49d07cc31f0b26c5ea` passes the guarded
local empty-database bootstrap, all **37** ordered migrations, **22/22**
isolated payment/database checks, typecheck, schema validation, and a 43-page
preview build. This clears the local bootstrap uncertainty only; it does not
pass production migration/history reconciliation, backup/restore, rollback,
Node 22 runtime acceptance, provider lifecycle, or production reconciliation.
No checkbox or production state changed. Evidence:
`docs/shipping/evidence/plan-web-014-current-main-local-integration-2026-10-07.md`.

## CLI current-main public artifact pack preflight · 2026-10-07

Exact CLI `origin/main` `7d060b2` passed the documented cross-platform install,
build **8/8**, and public packaging produced all six expected archives in an
isolated worktree. A disposable `python:3.12-slim` container running official
`in-toto==3.0.0` verified all six archives with exact SHA-256 products and
exited 0. This does not pass QUAL-CLI-006, which still requires the remaining
official format validator coverage, resolution of 7 license review blockers,
trusted publishing/legal review, and independent acceptance. No checkbox or
production state changed; backlog remains **218 checked / 62 unchecked / 280
total (77.9%)**.

## CLI current-main Hunt adversarial requalification · 2026-10-07

The exact remote CLI head `7d060b2` reran the pinned Hunt harness and passed
**60/60 executed assertions**, with one explicit macOS/Linux-namespace skip
and zero failures; Docker client/server were `29.7.2/29.7.2`. This is
repeatable macOS evidence only and does not pass HUNT-008/009/010/011 or
QUAL-CLI-004/006: trusted recipe/publisher provenance, official validators,
Linux-host isolation, legal/trusted-publishing review, and independent
acceptance remain required. No checkbox or production state changed; backlog
remains **218 checked / 62 unchecked / 280 total (77.9%)**.

## CLI exact origin/main qualification · 2026-10-07

CLI remote head `7d060b2` passed **12/12** test tasks, **13/13** typecheck
tasks, and **8/8** build tasks. This strengthens regression evidence but does
not pass Hunt provenance, independent review, supported-platform release, or
final acceptance gates.

## Web GitHub App server-side exchange · 2026-10-07

PR #154 reconciled head `9032bda` merged as `1498837` after focused
SCM/deletion **46/46**, serial Web **857/880** with 23 explicit skips, hosted
typecheck/schema, Vercel, and Preview Comments passed. This advances the GitHub
implementation gate but does not pass it: live authorized App installation,
immutable multi-repository scope, least-privilege provider verification, signed
webhook lifecycle/replay/reconciliation, cutover, and independent acceptance
remain required. No checkbox or production state changed; GITHUB-WEB-001..004
remain unchecked.

## CLI origin/main reconciliation and Hunt adversarial qualification · 2026-10-07

The exact remote CLI head `7d060b2` passes forced Turbo validation **23/23**;
the pinned Hunt harness passes **60/60 executed checks**, with one explicit
macOS/Linux-namespace skip and zero failures. This advances evidence but does
not pass the Hunt/release gates: HUNT-008/009/010/011 and QUAL-CLI-004/006
still require trusted recipe/publisher provenance, official validators,
Linux-host isolation evidence, legal/trusted-publishing review, and independent
acceptance. No checkbox or production state changed.

## PLAN-WEB-013/012 webhook-handler PostgreSQL integration · 2026-10-07

The direct handler/database harness passes locally and PR #149 head `9fd22d8`
passes hosted Verify **37642113170**. This advances the code-side payment gate
but does not pass it: real provider lifecycle evidence, all-enabled-method
qualification, production reconciliation, and migration-bootstrap resolution
remain open. PR #149 remains intentionally unmerged. No production state or
credential changed; backlog remains **218 checked / 62 unchecked / 280 total
(77.9%)**.

## PLAN-WEB-013 isolated hosted-order route · 2026-10-07

Hosted Verify **37640983179** is green for PR #149 exact head `1605340`; the
isolated route and focused checks are green. This does **not** pass the payment
release gate: real test-provider success/capture/failure/refund/renewal,
webhooks, entitlement reconciliation, production preflight, and deployment
evidence remain absent. The PR is intentionally not merged. No production or
credential state changed; backlog remains **218 checked / 62 unchecked / 280
total (77.9%)**.

## QUAL-WEB-006 organization-directory CDP probe · 2026-10-07

The existing `/orgs` page target was inspected with read-only direct CDP after
the Chrome DevTools MCP transport was closed. One visible named interactive
control, two landmarks including `main`, zero visible forms, zero unnamed
interactive AX nodes, and CLS `0.0000` were observed; existing navigation
timing was DOMContentLoaded `4939 ms` and load `5647 ms`. This does not pass
QUAL-WEB-006: Pro/organization data, keyboard, human screen-reader,
responsive/reduced-motion, reload-based CWV, large-data, and field-CWV
evidence remain open. No checkbox or production state changed.

## QUAL-CLI-006 current-head standards run · 2026-10-07

CLI exact head `13d144438045da574e7cbab6a21ec73341b8f796` passes the shared
standards corpus **448/448**, shared typecheck/build, and Docker availability.
The repository's documented temporary `pnpm.supportedArchitectures` setup
rehydrated platform-optional packages, after which license inventory and
CycloneDX/SPDX SBOM generation passed for the 254-package lockfile. The
temporary manifest and generated artifacts were reverted. This is supporting
evidence only and does not pass QUAL-CLI-006, which still requires official
validators, trusted keyless provenance, legal/trusted-publishing review, and
independent acceptance.

## PLAN-WEB-013 Checkout retry-state hardening · 2026-10-07

PR #149 exact head `aa34127` passes local focused 27/27, typecheck, production
build, and diff checks. Exact-head Verify `37637158955`, Vercel, and Preview
Comments pass. The client now clears stale order state
after failed or pre-confirmation-dismissed hosted attempts and does not show a
submitted state when `checkout.open()` throws. This does not pass the payment
gate or change any backlog checkbox.

## PLAN-WEB-014 Test Mode method-display probe · 2026-10-07

The isolated Test Mode provider probe created one order and rendered UPI,
Cards, EMI, Netbanking, Wallet, Pay Later, and optional UPI QR. UPI contact
validation stopped the run before a provider outcome; no callback, capture,
refund, webhook, entitlement, or reconciliation result was produced. This
does not pass the payment gate. PLAN-WEB-014/015 remain open; the existing
CDP blank target was restored and no production state changed.

## PLAN-WEB-014 provider iframe qualification attempt · 2026-10-07

The bounded Test Mode Checkout loaded the cross-origin provider iframe and
exposed six method selectors, but the UPI field was unavailable to the CDP
interaction after selection. No callback, capture, refund, webhook,
entitlement, or reconciliation result was produced. This does not pass the
payment gate; PLAN-WEB-014/015 remain open. The existing target was restored
to `about:blank` and no production state changed.

## QUAL-WEB-005 hosted result for hold-boundary fix · 2026-10-07

Hosted Verify `37632466656` passed at PR #153 exact head
`d7deec1bc115417e924c93846231074ea87ad51e`, including typecheck, serial,
boundary, truth, schema/migration, build, public-boundary, dependency,
SBOM/license, and secret checks. This does not pass QUAL-WEB-005: authenticated
non-production deletion E2E, legal/customer-held disposition, row
reconciliation, production migration, restore/rollback, and independent
acceptance remain open. No merge, checkbox, or production state changed.

## PLAN-WEB-013/014 hosted result for refund hardening · 2026-10-07

Hosted Verify `37632192255` passed at PR #149 exact head
`238ec7425ff1979b82d97e3d371cedbe83fbd394`. This strengthens current-head
hosted code/schema/security/build evidence but does not pass the payment gate:
account-enabled Razorpay methods, provider success/failure/capture/refund/
renewal/cancellation/replay/out-of-order evidence, entitlement reconciliation,
and production preflight remain open. No merge, checkbox, or production state
changed.

## QUAL-WEB-005 deletion hold completion boundary · 2026-10-07

PR #153 exact head `d7deec1bc115417e924c93846231074ea87ad51e` now carries the
post-delete legal-hold state into the final qualification decision. Focused
36/36 tests, typecheck, diff check, and disposable PostgreSQL integration 1/1
pass; hosted Verify `37632466656` was in progress at capture. This is not
QUAL-WEB-005 acceptance: authenticated non-production E2E, complete row and
customer-held reconciliation, consent/legal disposition, production migration,
restore/rollback, and independent review remain open. No checkbox or
production state changed.

Payment order boundary addendum (2026-10-07): a bounded Test Mode Orders API
create/fetch returned the matching INR amount and `created` state. This does
not pass the payment gate and does not close PLAN-WEB-013/014/015 because no
hosted method lifecycle, webhook, entitlement, refund, renewal, or
reconciliation evidence exists. No production/provider payment was charged.

Refund-event addendum (2026-10-07): the Test Mode account's read-only event
inventory includes `refund.created` and `refund.processed`, but its only
configured webhook is inactive on the product host. Web PR #149 `051d4be` now
uses the provider-fetched cumulative refund watermark for terminal processed
refunds and ignores non-terminal creation for entitlement purposes. The
payment gate remains open because no delivery or provider lifecycle was
qualified.

## PLAN-WEB-013/014 refund ordering hardening · 2026-10-07

PR #149 exact head `238ec7425ff1979b82d97e3d371cedbe83fbd394` now treats stale
smaller refund watermarks as idempotent no-ops while rejecting invalid bounds.
The focused runnable payment tests, typecheck, diff check, and disposable
schema-fixture billing integration pass. This does not pass the payment gate:
account-enabled method runtime, provider capture/refund/renewal/cancellation/
replay/out-of-order evidence, entitlement reconciliation, and production
configuration remain unverified. Hosted Verify `37632192255` was queued at
capture; no checkbox, merge, deployment, or production state changed.

## PLAN-WEB-014 Test Mode plan inventory · 2026-10-07

The authenticated Razorpay Test Mode plan inventory returned zero subscription
plans. The production environment-name inventory has no subscription-plan ID
mapping. No provider object was created because plans are immutable provider
configuration and the catalog/cadence/entitlement mapping has not been
approved. PLAN-WEB-014/015 remain open for the provider lifecycle and
reconciliation matrix; no checkbox or production state changed.

## PLAN-WEB-013 current-head payment contract verification · 2026-10-07

Web PR #149 exact head `b73fdd3beba513c0f9fc69a38c2fc69319ff9474` passed the
focused payment/configuration/webhook contract command **47/47, 0 failures,
0 skips**. This confirms current-source fail-closed method configuration,
commercial binding, prefill parsing, route boundaries, webhook replay/error
handling, and production key validation. It does not pass the payment gate:
provider method display/lifecycle, entitlement reconciliation, renewal,
refund, and production evidence remain open. No checkbox or production state
changed.

## QUAL-WEB-005 preview browser boundary · 2026-10-07

Chrome CDP reached the PR #153 Preview URL but Vercel deployment protection
redirected to Vercel login before the application loaded. No bypass or browser
mutation was attempted. Authenticated non-production deletion E2E remains an
open gate; the redirect is not application acceptance evidence.

## QUAL-WEB-005 privacy surface · 2026-10-07

PR #153 exact head `db27d793d890929f642ed0d5b5b9bd056a732bc` adds the
authenticated account privacy/deletion request surface. Local 23/23 focused
tests, typecheck, schema/35-migration ordering, build, negative boundary, and
SBOM/license gates pass; hosted Verify `37607448915` is green. This does not
pass QUAL-WEB-005: authenticated non-production deletion E2E, legal and
customer-held-record disposition, row reconciliation, restore/rollback, and
independent acceptance remain required.

## Exact production migration preflight · 2026-10-07

The bounded read-only audit against PR #153's 35-entry migration journal found
all 42 allowlisted tables present, 26 applied rows, and pending migrations
0026–0034. Exact counts are licenses 1, legacy mappings 3, webhook events 4,
payments 0, and subscriptions 0. Preflight is
`blocked-migration-history`; no migration, merge, deployment, or checkbox
credit is authorized by this result. See
`docs/shipping/evidence/production-migration-exact-audit-2026-10-07.md`.

## Fresh production snapshot/restore rehearsal · 2026-10-07

The fresh production snapshot completed at `2026-10-07T10:17:27.005Z`,
restored into disposable PostgreSQL 18, and accepted PR #153's migration tail
to 35 migration rows. This advances the RPO/restore rehearsal subcheck, but
QUAL-WEB-005 remains open for authenticated deletion E2E, legal/customer-held
record disposition, row reconciliation, rollback, and independent acceptance.
No production write or migration occurred.

## Preview environment preflight · 2026-10-07

Vercel Preview does not currently expose a recognizable Razorpay test/live key
pair or PostgreSQL database URL and lacks `RAZORPAY_ENABLED_PAYMENT_METHODS`.
No Preview provider/database call was attempted. The isolated payment gate
therefore remains closed pending a valid non-production environment.

## Production read-only billing/migration audit · 2026-10-07

Production Vercel configuration lacks `RAZORPAY_ENABLED_PAYMENT_METHODS`.
Read-only database metadata/aggregate audit found 42 tables and 26 applied
migrations, versus 31 in the current hosted candidate; billing payments,
subscriptions, and deletion requests are all 0, with 4 webhook-event rows.
This does not qualify payment reconciliation, migration application, deletion,
backup/restore, or RPO. No production write occurred.

## Razorpay method preflight · 2026-10-07

The official SDK method lookup with the current test credentials returned HTTP
401 `BAD_REQUEST_ERROR` / authentication failed, while a fresh read-only probe
using the same pair returned HTTP 200 for `/v1/orders` and `/v1/payments`. The
401 is therefore endpoint-specific, not proof that the credentials are
invalid. The real account-enabled method set is still unknown. The PR #149
exact-head payment suite passed 27/28 with one explicit environment-gated skip;
a separate isolated catalog assertion exposed UPI, card, netbanking, wallet,
and EMI. This keeps the provider-method and lifecycle gates open. No live-key
fallback or provider, production, database, or deployment write occurred.

## SCM/payment qualification batch · 2026-10-07

The focused SCM/GitHub contract suite passed **48/48** at exact Web
`origin/main` `6fccfb26ffb707e53c3ef44166b42280be29de55`. One Razorpay
test-mode order was created at the catalog monthly Pro amount (INR 280,943
paise) and was not captured. These results reduce code-side and credential
connectivity uncertainty only. Live GitHub installation/delivery/recovery,
account-enabled payment methods, full payment lifecycle, production
reconciliation, and R-041 rotation remain release-blocking. No checkbox
changed.

## PLAN-WEB-013 hosted verification refresh · 2026-10-07

Web PR #149 exact head passed Verify run `37563023349`: serial Web 871/872
pass with one explicit skip, negative-boundary 2/2, truth-registry 25/25, 31
ordered migrations, typecheck, build, public-boundary, dependency/SBOM/license,
and tracked-secret checks. This is hosted code qualification only. The payment
gate remains open for account-enabled Razorpay methods and complete isolated
test-mode lifecycle evidence; no merge or production operation occurred.

## Production payment-surface truth recheck · 2026-10-07

Production `/checkout` still renders the legacy UPI-only QR path at INR
2,809.43/month. Chrome DevTools saw HTTP 200 and no console errors; no payment
or mutation request was made. This confirms Web PR #149 is not deployed and
does not qualify any payment gate. PLAN-WEB-011/012/013/014/015 remain open;
no production cutover or payment operation is authorized by this observation.

## Razorpay production method preflight · 2026-10-07

The linked Vercel Production environment has a live-key prefix, but the
read-only Razorpay SDK `payments.fetchPaymentMethods()` request returned HTTP
401 `BAD_REQUEST_ERROR`. No provider payload or secret was retained. The
account-enabled production method set therefore remains unknown; do not guess
`RAZORPAY_ENABLED_PAYMENT_METHODS` or promote a production checkout cutover.
The deployment built from Web main `8b843da` failed at runtime-config validation
because that variable is absent. Payment and deployment gates remain open.
Evidence: `docs/shipping/evidence/razorpay-production-method-preflight-2026-10-07.md`.
The subsequent automatic Production deployment from Web main `2e86514` failed at
the same pre-build runtime-config stage with the same missing-variable message,
confirming that the blocker is current on merged mainline.
After PR #154 merged as `1498837`, Production again failed before build at
`pnpm config:check` for the same absent variable. No production configuration
write or promotion occurred.

## QUAL-CLI-006 official in-toto artifact binding · 2026-10-07

The exact merged CLI head `6bde945c60ac34351c02a70f6e7a2cb24f98ae1d` passed
`scripts/verify-in-toto-release.py` in a bounded disposable Python 3.12
container with official `in-toto==3.0.0`; all six public archives and their
exact SHA-256 products verified. This closes the local official in-toto
sub-check only. Trusted keyless Sigstore/Fulcio/Rekor release identity, legal
clearance, protected publication, and final acceptance remain open; no
checkbox changed and no release operation occurred.

## PLAN-WEB-013/014/015 exact-head payment continuation · 2026-10-07

Web PR #149 exact head `db68157da039d8aab939818f9023f867028e4432` passed
focused payment/configuration/route/webhook tests **18/18**, typecheck,
Drizzle schema validation, ordered migration validation (**31**), and license
inventory (**3/3**). PR #149 remains OPEN, MERGEABLE, CLEAN, with reported
hosted checks successful. This does not satisfy the payment gate: the
Razorpay account-enabled method set, isolated test-mode capture/failure/refund/
renewal/replay/out-of-order matrix, and production reconciliation remain
unproven. No checkbox changed and no production/provider/database/deployment
write occurred.

## QUAL-CLI-006 artifact qualification continuation · 2026-10-07

Merged CLI `6bde945c60ac34351c02a70f6e7a2cb24f98ae1` passes the local package,
build/typecheck, all-platform license/notices, six-archive, clean-consumer, and
upgrade/rollback checks. Official in-toto verification was not completed after
its cryptography dependency installation was interrupted. Trusted
Sigstore/publishing identity, legal clearance, protected publication, and
release-candidate approval remain open; QUAL-CLI-006 does not close.

## QUAL-WEB-006 organization browser continuation · 2026-10-07

Authenticated `/orgs` read-only evidence is 200/empty-state/clean-console with
desktop snapshot Accessibility/Best Practices/SEO 100/100/100 and mobile
100/100/80. The cold trace's LCP was 5,169ms with 4,372ms render delay and no
CrUX data. This does not close QUAL-WEB-006 or any release gate.

## Merged-phase acceptance story refresh · 2026-10-07

The exact merged CLI/Web substrate run passed CLI 250/250, Web 888/888 with 28
explicit environment skips, and composed Studio/Enterprise/Team/qualification
tests 74/74. This is regression evidence only. It does not close any hosted
provider, customer, reviewer, browser-human, field-CWV, migration, or production
gate; no release gate or backlog checkbox closed. Backlog remains **218
checked / 62 unchecked / 280 total (77.9%)**.

## PLAN-CLI-003 authenticated boundary probe · 2026-10-07

An authenticated read-only browser matrix kept forged paid-plan selectors at
Free and denied forged organization/project reads across the record, policy,
release, usage, and search surfaces with bounded 403 responses. This is partial
boundary evidence only; licensed modified-CLI coverage and public/private
runtime evidence remain required. No release gate or backlog checkbox closed.

## QUAL-WEB-005 snapshot-backed deletion qualification · 2026-10-07

The isolated snapshot-backed QUAL-WEB-005 set passed 44/44 after current
migrations were applied to disposable PostgreSQL 18. This is local contract and
rollback evidence only: the snapshot is approximately 396h old, and no
authenticated hosted deletion E2E, current-backup RPO, deployment rollback, or
production deletion was performed. The release gate remains open.

## PLAN-WEB-013/014/015 payment code-side qualification · 2026-10-07

PR #149 focused payment/configuration tests passed 44/44 with one explicit
unit-test skip. A bounded snapshot-backed Docker/PostgreSQL run applied the PR
migrations and passed both billing-ledger and webhook-claim integrations (2/2,
no skips). This closes no payment gate: account-enabled Razorpay test-mode
methods and complete lifecycle/reconciliation evidence remain required.

## QUAL-WEB-006 organization-directory reload · 2026-10-07

Fresh authenticated browser evidence shows `/orgs` renders its truthful empty
state after reload; the earlier 404 was stale tab state. This confirms the
deployed directory route, but the account is Free with no organization. It does
not close QUAL-WEB-006: paid/org runtime, human screen-reader, large-data, and
field-CWV evidence remain open.

## QUAL-WEB-006 authenticated account browser probe · 2026-10-07

The authenticated Free `/account` surface passes the captured automated
accessibility/performance observations, but the account has no organization or
paid entitlement. Paid/org runtime, human screen-reader, large-data, and field
CWV gates remain unproven; no release gate or backlog checkbox closed.

## HUNT-008/HUNT-009/QUAL-CLI-004 public runtime boundary · 2026-10-07

CLI PR #75 exact head `c4beecb3525256cd2956660af8e3e6b49292b65f` removes the
public/private packaging failure and passes local boundary evidence, but its
11 hosted checks were pending at capture. Provenance, isolation, independent
review, and functional Hunt acceptance remain open; no release gate or
backlog checkbox closed.

## Restore/recovery harness qualification · 2026-10-07

Web PR #153 head `250313e` passes the disposable restore, migration, writer,
reconciliation, and fail-closed simulation steps, but the available snapshot
is approximately 396h old and fails the critical 48h RPO threshold. No
release gate or backlog checkbox closed; current backup, production restore,
deployment rollback, and authenticated deletion E2E remain open.

## QUAL-WEB-005 rollback/retry qualification · 2026-10-07

Web PR #153 head `2127924e418fdca4094fa88bab02656952f4488b` passes local and
hosted rollback/retry qualification, including Verify `37567278851`. It does
not close the release gate: production backup restore/deployment rollback and
authenticated non-production E2E remain unproven, so no release gate or
backlog checkbox closed.

## QUAL-WEB-005 supporting disposition executor · 2026-10-07

Web PR #153 head `eb785d2e382fc60535c15702fe7ffd8b9ae66610` passes local worker,
disposable-DB, serial-suite, typecheck, production-build, schema, migration,
and diff checks. It adds durable supporting operation receipts and blocks
approval-gated channel credentials before dependent deletes. Hosted typecheck/
schema and Vercel were pending at capture. QUAL-WEB-005 is still open for
retained-row reconciliation, restore/rollback rehearsal, and authenticated
non-production E2E; hosted Verify `37566730804`, Vercel, GitGuardian, and
Preview Comments pass, but no release gate or checkbox closed.

## QUAL-WEB-005 supporting inventory snapshot · 2026-10-07

Web PR #153 head `37c8a07ef2c1d4f914c0ace03864d60fb2649a82` passed Verify
`37564973546`; local focused, disposable-DB, serialized-suite, typecheck,
build, schema, migration, and diff checks pass. The read-only inventory
contract is not deletion acceptance: `supportingInventoryComplete=false`
remains enforced. Executable dispositions, receipts, reconciliation,
restore/rollback rehearsal, and authenticated E2E remain open. No release gate
or backlog checkbox closed.

## HUNT-009 public-boundary requalification · 2026-10-07

CLI PR #74 was closed without merge. Local focused execution tests and the
full build/typecheck/test graph passed, but hosted platform matrix
`37565750571` and self-scan `37565750527` failed at public-archive
qualification because private/alpha `@verglos/hunt` is not one of the six
public packages. HUNT-009 remains a release blocker; no packer bypass,
implicit archive, or acceptance credit is allowed. Evidence:
`docs/shipping/evidence/hunt-009-public-boundary-requalification-2026-10-07.md`.

## QUAL-WEB-006 large-data and serialized-CI merge · 2026-10-07

Web PR #150 passed hosted Verify `37552936102`, Vercel, GitGuardian, and
Preview Comments, then merged as
`a64407d9e7b81ba4db8c52a96d1237da693cb910`. This strengthens the controlled
qualification path for same-tenant pagination, 100-row truncation truth, and
foreign-tenant exclusion. It does not close QUAL-WEB-006 or any release gate:
paid/org browser, human screen-reader, and field-CWV evidence remain open. No
deployment or production operation occurred.

## CLI license-source metadata hosted qualification and merge · 2026-10-07

PR #73 tested head `d34ac4f` passed the complete Ubuntu/macOS/Windows Node
20/22/24 platform matrix, self-scan `37554811352`, and in-toto binding in
`37554811372`, then merged as
`d63bf7a07c4dc421096b44593cd996aef40320d2`. This removes only the mechanical
source-missing classification for `minipass-pipeline@1.2.4`. The verifier
still fails closed on the nested `benchmark`/`fast-uri` conflict and six
BlueOak legal reviews; LIC-002/003, DIST-001/002/003, and publication remain
open. No release or production operation occurred.

## CLI license-source metadata follow-up · 2026-10-07

CLI PR #73 (`d34ac4f`) removes the mechanical source-missing classification for
`minipass-pipeline@1.2.4` using an exact-version HTTPS provenance override.
Inventory/SBOM tests 6/6, CLI tests 12/12 workspace tasks, and typecheck 13/13
tasks pass. The final verifier remains intentionally blocked on seven items:
the nested `benchmark`/`fast-uri` license conflict and six BlueOak legal
reviews. `--require-clear` still exits 2. LIC-002/003, DIST-001/002/003, and
publication remain open; PR #73 is open/mergeable with hosted checks queued.
No merge, publication, production, provider, database, payment, deployment,
or credential operation occurred. Evidence:
`docs/shipping/evidence/qual-cli-license-source-metadata-2026-10-07.md`.

## CLI release-candidate source follow-up · 2026-10-07

The rebuilt current source passes `pnpm test` (12/12 workspace tasks) and
`pnpm typecheck` (13/13 tasks). This does not clear the eight redistribution
review blockers or authorize publication; LIC/DIST gates remain open.

## CLI release-artifact qualification · 2026-10-07

The source rebuild, six-archive public pack, packed-manifest audit, isolated
clean-consumer install/import/version run, sidecar assembly, and checksum
generation pass. The final verifier remains intentionally red on eight
redistribution blockers: one nested license conflict, six BlueOak reviews, and
one missing source. Mechanical packaging is qualified; legal/provenance
review, notices clearance, trusted publication, attestation, and final release
acceptance remain open. No publication or deployment occurred.

## Razorpay Test Mode read-only method probe · 2026-10-07

A read-only Test Mode payment listing observed one captured `netbanking`
payment. This is not a complete account-enabled method or lifecycle matrix;
PLAN-WEB-014/015 and billing release gates remain open. The local Test Mode env
also has shell-unsafe secret syntax and must be rotated before further provider
calls. No provider or production operation occurred.

## Production checkout read-only verification · 2026-10-07

The live checkout still renders only the QR path (`Monthly`, `Annual`, and
`Show UPI QR code`). PR #149's hosted checkout is not deployed. This is
production truth evidence, not a release approval: PLAN-WEB-013/014/015 and
the provider lifecycle/reconciliation gates remain open. No payment or other
production operation occurred.

## QUAL-WEB-006 production account browser smoke · 2026-10-07

The existing Chrome DevTools target loaded `/account` read-only with HTTP 200;
the Free account shell had one main/one nav landmark, seven links, no
unlabeled controls, no tables, and no visible error copy. This is not paid
dashboard or large-data acceptance. Human screen-reader, authenticated
organization/paid-plan, and field-CWV evidence remain open, so QUAL-WEB-006
and the dependent release gates remain open. No production operation occurred.

## PLAN-WEB-013 hosted verification follow-up · 2026-10-07

Web PR #149 head `550dba0` passed hosted Verify run `37553696161` across the
full Node 22 quality/security/build matrix. Local focused payment/runtime/
route-contract tests are 33/33 and typecheck passes. This validates the
fail-closed production method-config contract and CI fixture only; it does not
close PLAN-WEB-013/014/015 or Gate 4/6. Account-enabled Razorpay test-mode
method/lifecycle evidence, production reconciliation, restore/rollback,
credential rotation, and release authorization remain open. No production
operation occurred.

Worker-contract update (2026-10-07): PR #153 head `aef06b7` adds fenced
user-scoped orchestration and stable retry handling. Focus 31/31, negative
boundary 2/2, serial 846 pass / 22 explicit skips, typecheck/diff, and
38-page build pass; hosted workflow `37560432960` was in progress. This does
not pass Gate 2/4/6 or accept `QUAL-WEB-005`; the operational adapter,
reconciliation, audit receipt, restore, and E2E remain open.

Hosted result update (2026-10-07): PR #153 exact-head workflow `37559903900`
passed at job `112594573865`; Vercel, GitGuardian, and Preview Comments also
passed. The result does not pass the deletion gate or authorize migrations,
deletion, restore, rollback, provider cutover, or promotion.

Hold-authority update (2026-10-07): PR #153 head
`adf9a23b395a2c35208bd7d9cfcc7973300c2827` adds the unapplied durable deletion
hold schema and explicit release contract. Local hold 3/3, combined focus
25/25, serial 846 pass / 22 explicit skips, typecheck/schema/migration/diff,
and 38-page build pass. Hosted checks for the new head were in progress at
capture. This does not pass Gate 2/4/6 or accept `QUAL-WEB-005`; the worker,
customer-held digest proof, reconciliation, restore rehearsal, and
non-production E2E remain open.

Customer-held digest update (2026-10-07): PR #153 head `4c5966f` adds the
source-only digest registry and exact before/after proof contract. Focus 28/28,
serial 846 pass / 22 explicit skips, typecheck/schema/migration/diff, and
38-page build pass; the journal validates 31 migrations. Hosted checks were
pending at capture. This does not pass Gate 2/4/6 or accept `QUAL-WEB-005`;
the authenticated writer, worker, reconciliation, restore, and E2E remain
open. No production or destructive operation occurred.

Hosted result update (2026-10-07): PR #153 workflow `37559045448` reached
terminal green, with GitGuardian, Vercel Preview Comments, and Vercel passing.
This only verifies the substrate checks; `QUAL-WEB-005` remains open and the
PR remains unmerged/unpromoted under the broader release-gate policy.

## Web hosted serial qualification CI · 2026-10-07

PR #150 head `a78578e` changes the hosted Verify test step to the existing
serial shared-database harness. Run `37552936102` is green across typecheck,
tests, schema/migrations, build, public-boundary, dependency/SBOM/license,
secret, GitGuardian, Vercel, and preview checks. This improves the evidence
path but closes no product or release gate; PR #150 remains open and no
deployment/merge occurred.

## Web serial PostgreSQL qualification · 2026-10-07

The existing `test:serial` path passes pretest 48/48 and configured Web tests
867/867 with one intentionally skipped migrated-billing test. A separate
synthetic migrated baseline passes billing integration 1/1. This qualifies the
local serialized test path only; parallel shared-database execution remains
non-authoritative, and no product, hosted, provider, production, or release
gate is closed by this batch.

## Web PostgreSQL suite isolation qualification · 2026-10-07

The full PostgreSQL-backed Web suite was attempted but stalled and is not
green evidence. Queue fairness/worker-crash failures pass in isolated 7/7
execution; threshold-outbox and usage-ledger pass 1/1 separately. A shared
database setup race occurs when the two usage files run concurrently. No
release gate or backlog item is closed by this batch; full configured-suite
qualification remains open. No production operation occurred.

## ACCEPT-002/003 latest-source substrate refresh · 2026-10-07

The private harness passes unreleased CLI 241/241, Web 888/916 with 28
explicit environment-gated skips, and composed Studio/Enterprise/Team/quality
74/74. An earlier compatibility-root run at `b070942` was only 34/34 and is
not credited as latest-source evidence. This does not close ACCEPT-002/003 or
Gate 6: hosted/provider/customer/reviewer evidence and complete story coverage
remain open. No production operation occurred.

## QUAL-WEB-005 privacy/deletion/retention qualification · 2026-10-07

The existing Web privacy/deletion/retention and hosted-record projection
surfaces pass 46/46 focused tests with an isolated Docker PostgreSQL database,
including account-deletion scope and hold behavior, retention decisions,
content verification, and foreign-tenant exclusion. This does not close
QUAL-WEB-005 or Gate 2/4/6: hosted deletion-worker execution,
legal/customer-held-record decisions, consent/vendor inventory, and
end-to-end production deletion evidence remain open. No production operation
occurred.

The approved Chrome CDP display probe opened the Razorpay hosted Checkout UI
twice for test-mode orders and closed without submission. No stable method
labels were exposed in the bounded child-context projection, so this does not
advance the account-enabled-method or lifecycle gates and no method is claimed.

A subsequent direct attachment to the provider checkout target observed six
selectable hosted radios—UPI, card, netbanking, wallet, EMI, and Pay Later—and
no QR radio. This advances account-method discovery for the test account but
does not advance lifecycle acceptance: no method was selected or submitted.

Payment qualification update (2026-10-07): Razorpay test-mode order creation
and read-back now pass for the canonical Pro monthly offer, with exact amount,
currency, `created` state, and signed catalog binding; Web PR #149 focused
billing/configuration tests pass 38/38. This is only provider order/binding
evidence. It does not close the payment gate: account-enabled method discovery,
all enabled methods, success/failure/capture/refund/renewal/cancellation,
duplicate/out-of-order/retry behavior, exactly-once entitlement, and redacted
browser/webhook evidence remain open. No payment or production operation
occurred.

Supporting-executor integration update (2026-10-07): current Web PR #153
source passed `account-deletion-jobs.integration.test.ts` **1/1** against a
disposable PostgreSQL 18 `verglos_test` database. The run covers the full
supporting disposition graph, hold/lease behavior, approval blocking, all
seven hosted kinds, receipts, batch execution, and replay. This strengthens
Gate 2 qualification but does not close Gate 2/4/6 or accept `QUAL-WEB-005`:
production migration/cutover, authenticated browser E2E, consent and
legal/customer-held decisions, reconciliation, restore/RPO, rollback, and
independent acceptance remain open. The exact container was removed; no
production migration or deletion occurred.

## QUAL-WEB-006 large-data qualification · 2026-10-07

Web PR #150 (`70680f8`) adds bounded integration evidence for 45 same-tenant
components (20/20/5 pages), 125 advisory matches, the 100-row detail cap with
explicit truncation truth, and foreign-tenant exclusion. Local focused tests,
tenant/security checks, typecheck, build, schema, migration ordering, and diff
hygiene pass. Hosted run `37551537264`, Vercel, GitGuardian, and Preview
Comments pass, and GitHub reports PR #150 `CLEAN` and mergeable. This is not
full QUAL-WEB-006 acceptance: organization/Pro
browser data, human screen-reader, and field-CWV evidence remain open. No
production operation occurred.

## PLAN-CLI-004 hosted verification · 2026-10-07

CLI PR #72 head `059918cf920d136ded4528ad7512b82026459ece` merged as
`c1f1cd77468c28e85371b59fad297847ca5c5050` after GitHub reported merge state
`CLEAN`. Platform run `37550255842` passes
in-toto and all Ubuntu/macOS/Windows Node 20/22/24 cells; self-scan
`37550255844` passes. This is terminal code/packaging verification only and
does not close PLAN-CLI-004 or Gate 0/5: deployed signer/catalog alignment,
old-token migration, hosted activation, production safety, and R-041 rotation
remain open. No production operation occurred.

## QUAL-WEB-006 browser continuation · 2026-10-07

The authenticated account shell remains clean in read-only Chrome DevTools:
Lighthouse snapshot Accessibility/Best Practices/SEO are each 100 on desktop
and mobile, and the fresh desktop trace reports LCP 689 ms and CLS 0.00. The
agentic score is 50 solely because the audit reports `llms.txt`; the public
route currently returns a valid H1. Local PR #149 execution without secrets
fails closed before creating a payment request. This does not close
QUAL-WEB-006 or Gate 2/3/4: organization/Pro and large-data rendering,
screen-reader, field-CWV, and payment/provider lifecycle evidence remain open.
No production operation occurred.

## PLAN-WEB-013 code-side gate update · 2026-10-07

Web PR #149 (`eb7e55a`) moves the customer path from QR-only to catalog-gated
Razorpay hosted orders, with signed commercial binding, webhook-authoritative
entitlement, read-only status, explicit QR opt-in, and successful-order
uniqueness. Local Web 850/872/22/0, focused 19/19, typecheck/build/Drizzle/
31-migration/diff checks pass. GitGuardian, hosted typecheck/schema, Vercel,
and Preview Comments pass; GitHub reports the PR merge state `CLEAN`. This
does not close PLAN-WEB-013/014/015 or Gate 4/6: account-enabled test-mode
method/lifecycle evidence, production reconciliation, Node 22 hosted
verification, R-041 rotation, and required restore/rollback evidence remain
open. No production operation occurred.

## QUAL-CLI-006 / DIST-001 / DIST-003 qualification · 2026-10-06

The merged CLI `dacd286` passed 20/20 release-script tests, six-package
packing, package/boundary/tag audits, clean-consumer installation, and the
`1.8.3 -> 2.0.0-alpha.1 -> 1.8.3` upgrade/rollback transition. The strict
verifier remains OPEN because the inventory contains eight unresolved
redistribution reviews: six BlueOak-1.0.0 packages, the nested
`benchmark@1.0.0`/`fast-uri@3.1.7` license conflict, and missing source for
`minipass-pipeline@1.2.4`. No publication, tag, deployment, production access,
or customer operation occurred. R-041 remains open. Evidence:
`docs/shipping/evidence/qual-cli-006-dist-release-artifacts-2026-10-06.md`.

## PLAN-CLI-001/004 addendum · 2026-10-06

CLI PR #71 (`937705b`, `fa4a131`, `714cb3e`) merged as `dacd286` hardens the
opaque catalog-version and simulation-cache contract with local and hosted
evidence. Hosted run `37497389053` passes self-scan, in-toto, and all nine
platform cells. It is still preparatory code-side evidence only: it does not
satisfy production signer activation, trust-root alignment, live token
issuance, or final release gates. No gate checkbox or backlog count changes
from this batch; R-041 continues to block production operations.

## HUNT-009 boundary review · 2026-10-06

The public CLI must not declare private `@verglos/hunt` or embed private Hunt
runtime code as an unreviewed workaround. The attempted functional wiring was
removed before commit; typecheck/tests/build/public-boundary/diff checks pass.
Public packing is not credited because the local pnpm license command fails on
missing `turbo@2.10.6` package-index metadata. HUNT-008/009/010/011 and
QUAL-CLI-004 remain open; the alpha shell stays exit-78.

Founder authorization checkpoint (2026-10-02): approval was given to proceed with the final public truth/copy pass after prerequisites, a real billing/provider checkout test, authorized customer acceptance workflows, legal/licensing review, and independent Hunt isolation review. The authorization does not replace evidence. Current read-only inspection found no billing credentials or linked Vercel access, no authorized customer repository/fixture artifact, no legal approval record, and no independent Hunt review package. Those gates remain open; no production checkout, deployment, customer workflow, legal assertion, or independent-review claim occurred.

QUAL-WEB-001 progress (2026-09-30): Web PR #115 tested head `b3dfd77` merged as `4d2051e4`; CLI-style headers and forged organization/license/role/plan/capability/allowance/usage/record fields remain ignored in favor of server-derived entitlement claims. Focused route/boundary tests pass 10/10; hosted run `36705118215`, GitGuardian, and Vercel pass. Gate remains OPEN pending complete list/search/export/public-private runtime evidence. No production operation occurred.

QUAL-WEB-001 progress (2026-09-30): Web PR #114 tested head `f79a7a5` merged as `88a809d3`; the protected route matrix now carries forged tenant/project/plan/allowance query fields alongside forged bodies while path authorization and non-cacheable denial invariants remain green. Hosted run `36704670862`, GitGuardian, and Vercel pass. Gate remains OPEN pending complete modified-CLI and list/search/export/public-private runtime evidence. No production operation occurred.

QUAL-WEB-001 progress (2026-09-30): Web PR #113 tested head `39dfb64` merged as `24232db2`; direct public receipt JSON coverage rejects invalid identities with forged tenant/project query fields without reflection and preserves `no-store`. Combined boundary tests pass 4/4; hosted run `36704251024`, GitGuardian, and Vercel pass. Gate remains OPEN pending complete modified-CLI and list/search/export/public-private runtime evidence. No production operation occurred.

QUAL-WEB-001 progress (2026-09-30): Web PR #112 tested head `4548734` merged as `517df10c`; every protected organization API route is now invoked through its real handler with forged body authority fields and denial responses are asserted non-cacheable (`no-store` or `private, no-store`). Focused negative-boundary tests pass 2/2; hosted run `36703830835`, GitGuardian, and Vercel pass. Gate remains OPEN pending complete modified-CLI and direct list/search/export/public-private runtime evidence. No production operation occurred.

QUAL-CLI-006 progress (2026-09-30): an isolated Docker run with official `in-toto==3.0.0` generated and verified a signed synthetic root layout plus link using `in-toto-verify --verification-keys`; verification succeeded. This is format/verification smoke only, using an ephemeral key and synthetic materials. Gate remains OPEN pending actual release-pipeline binding and trusted keyless Sigstore/Fulcio/Rekor evidence. No production operation occurred.

PLAN-CLI-004 progress (2026-09-30): CLI PR #50 tested head `9ff21be` merged as `f16c6f1`; frozen server-shaped plan/catalog fixtures cover Free/Pro/Team/Studio/Enterprise and malformed responses fail closed to Free without stale paid reuse. Hosted run `36700076759` passes the complete nine-cell platform matrix and self-scan `36700077215` passes. Gate remains OPEN: deployed signer/catalog alignment, supported-version old-token migration evidence, and hosted activation integration are still required. No production operation occurred.

QUAL-WEB-001 progress (2026-09-30): Web PR #103 merged as `0a85f08` after hosted run `36686440312`, adding malformed/traversal/zero-UUID organization-ID probes across every protected organization API method with fixed denials, no identifier echo, and authorization-before-data-access. Web PR #104 merged as `98169fa` after hosted run `36689496063`, proving forged plan/tier, tenant, capability, allowance, usage, and record fields are ignored by v2 entitlement issuance in favor of server-resolved license, tenant, role, and catalog values. QUAL-WEB-001 remains OPEN: complete modified-CLI request coverage and list/search/export/cache/public/private boundary evidence are still missing. No production operation occurred.

QUAL-WEB-001 cache-boundary progress (2026-09-30): Web PR #105 merged as `6cb6734` after hosted run `36690136102`. Private receipt list/detail responses now set `private, no-store` across invalid, denied, not-found, validation, allowance, conflict, idempotent, integrity-failure, and success paths; local tenant-scope contract tests pass 11/11. QUAL-WEB-001 remains OPEN pending the complete modified-CLI and list/search/export/cache/public/private matrix. No production operation occurred.

QUAL-WEB-001 private evidence/evaluation cache-boundary progress (2026-09-30): Web PR #108 merged as `7279ef2` after hosted run `36691398858`. Evidence and policy-evaluation list/create routes now set `private, no-store` across invalid, denied, validation, not-found, conflict, idempotent, storage-failure, and success paths; local tenant-scope contract tests pass 12/12. QUAL-WEB-001 remains OPEN pending complete modified-CLI and list/search/export/cache/public/private matrix evidence. No production operation occurred.

QUAL-WEB-001 organization API cache-boundary progress (2026-09-30): Web PR #110 merged as `18ddb408` after hosted run `36692358099`. Organization directory, member, project, policy, and release routes now set `private, no-store` across every response path; local tenant-scope contract tests pass 13/13. QUAL-WEB-001 remains OPEN pending modified-CLI and direct list/search/export/runtime public-private matrix evidence. No production operation occurred.

QUAL-WEB-001 private account/API cache-boundary progress (2026-09-30): Web PR #111 merged as `c83300b` after hosted run `36693118104`. Account sync, CLI-auth, license status, score history, and monitor routes now set `private, no-store` across response paths, including paid-license denials; combined focused contract tests pass 17/17. QUAL-WEB-001 remains OPEN pending modified-CLI and direct runtime list/search/export/public-private matrix evidence. No production operation occurred.

QUAL-WEB-001/005/006 progress (2026-09-30): Web `82d2157` + `a24fef7` on `feat/web-qual-batch` add pure authorization/privacy/accessibility qualification classifiers. Focused tests pass 18/18; exact-branch configured suite passes 830/852 with 22 environment-gated skips; typecheck and production build pass. PR #100 merged as `666317e` after hosted checks passed. These commits do **not** close Gate 2/3/4 or the backlog items: route-level account deletion/consent and hosted privacy evidence, real browser/screen-reader/CWV measurements, and complete modified-CLI/authorization boundary coverage remain open. No production operation occurred.

PLAN-WEB-011/012 gate update (2026-09-20): Web PR #49 exact head `b103d9e5793913b52207af0497586159dc16cc15` implements catalog-only checkout values, signed immutable one-time commercial snapshots, captured/exact-match fulfillment, owner-bound read-only status, and a PostgreSQL ledger for serialized renewals, immutable payment identity, replay/conflict handling, chronological lifecycle, failure, expiry, and partial/full refunds. Local blank-DB suite passes 291/292 with one intentional migrated-ledger skip; that integration passes separately against all 19 migrations. Typecheck, schema/migration checks, build, security/boundary/SBOM/license gates, hosted run `35503776577`, GitGuardian, and Vercel preview pass. Gate 4 remains OPEN: Pro has no approved verified INR catalog price, migration `0018` lacks production backup/restore/rollback evidence and is unapplied, production configuration is not inspectable with the installed credential, and no live gateway lifecycle reconciliation exists. PR #49 remains open/unmerged; no production operation occurred.

DIST-WEB-002 gate update (2026-09-20): Web PR #49 exact head `76e58f42fd5ebc7954c5883a5e36fda64eaeedf6` makes the complete production runtime matrix fail closed for auth, credentialed PostgreSQL/no explicit TLS disablement, Ed25519 signing, channel encryption, live billing/auth keys and all billing integers, approved PostgreSQL queue/JSONB storage selectors, cron, and canonical `https://verglos.com`, with value-free diagnostics. `.env.example` matrix drift, invalid production failure, complete production success, and Node startup behavior are tested. Local isolated-PostgreSQL suite passes 286/286; all local schema/build/security/license gates and exact-head hosted Node 22 run `35502251082`, GitGuardian, and Vercel preview pass. Gate remains OPEN: the installed Vercel credential is unauthorized for the linked scope, so actual production variable names/scopes and a production deployment are unverified. PR #49 remains open to avoid a fail-closed main deployment before the two provider selectors can be confirmed/provisioned. No production env/DB value was read and no production operation occurred.

LIC-002 inventory addendum (2026-09-14): private third-party inventory now matches the pinned Trivy adapter, explicit-path detect-secrets probe, Sigstore runtime/test assets, current standards handling, and existing public-source fixtures. Gate 5 remains OPEN: no authenticated publisher root/content feed or approved premium rule/recipe license, provenance, modification, customer-license, and trademark terms exist; the scanner fixture authorship/source decision is unresolved. No redistribution clearance is inferred, and the update did not mark LIC-002 complete.

OPS-001 queue contract progress (2026-09-14): Web PR #33 exact head `3377a26bddbd0998ab82d0d98695473427434aec` passes `34846092388` (112/112 PostgreSQL-backed tests, typecheck/schema/17-migration checks/build/security/license/public-boundary), GitGuardian, and Vercel. The provider-neutral interface is preparatory progress only; OPS-001 remains unchecked because the canonical architecture defers provider selection pending workload, security/privacy, recovery, exit, and actual-cost evidence. Existing PostgreSQL tables do not establish provider suitability. No queue worker/producer is activated. No production DB/environment action occurred.

VERIFY-WEB-001 acceptance addendum (2026-09-14): Web PR #33 exact head `2d89869e75d3d0316bf71e94d585a64bff8e34ef` passes PostgreSQL-backed route integration and full hosted verification (run `34835571918`, 98/98 tests; typecheck/schema/17-migration checks/build/dependency/SBOM/license/secret/public-boundary checks; GitGuardian; Vercel). This qualifies authenticated bounded redacted-projection ingestion and tenant-scoped idempotency only. It does not qualify original `.vgl` verification, object custody, production data cutover/backfill, backup/restore, or release. No production DB operation or deployment occurred in this batch.

RECORD-006 qualification addendum (2026-09-14): CLI PR #38 `4545eb4` implements explicit caller-token keyless signing, scoped approval, official Sigstore verification against the supplied trust root and exact issuer/identity, offline verification, and optional package-v1.1 bundle evidence. Exact-head self-scan `34833650330`, all nine platform cells in `34833650299`, focused 13/13, and uncached 18/18 local Turbo tasks pass. This is code/contract qualification only: the Sigstore network was mocked, no public Rekor entry was created, no interactive user login/plan gating is implemented, and npm publication/release/legal clearance remain open. Do not equate acceptance of RECORD-006 with release readiness.

Web runtime-config gate addendum (2026-09-13): commits `5f74817`/`1ce37f9`/`75b9a48` on Web PR #33 fail closed for the implemented production auth, database, signing, encryption, billing, cron, and public URL controls at Vercel production build and Node server startup, with no-secret-output process tests. Local full Web tests 91 passed / 2 DB integration tests skipped, typecheck/build/schema/17-migration/public-boundary checks pass; exact-head run `34774125271`, GitGuardian, and Vercel pass. This does not complete DIST-WEB-002: durable queue/object-storage providers remain unselected under OPS-001, and the actual production environment matrix is unverified because the available Vercel token lacks access to the linked project scope. No production env values were read and no deployment occurred.

Latest checkpoint (2026-09-12; supersedes dated gate snapshots below): approved web production base-schema migration `0000`–`0014` ran successfully through `pnpm exec drizzle-kit migrate` using Vercel production env. Postflight verifies 33/33 declared public tables, 15 migration-history rows, original 10 table counts unchanged (74 aggregate rows), 23 new tables empty, zero sentinel license rows, `pro` default, and all three project contract columns. A time-based temporary branch from production reproduced the 10-table/74-row baseline and was deleted. This closes only the approved schema-apply operation—not HOSTED-013, production backfill/dual-write, application cutover, or full recovery qualification. Web PR #32 remains OPEN/CLEAN at `67bbe09`; hosted Node 22 workflow `34694532678`, GitGuardian, and Vercel pass. `DIST-WEB-001` remains accepted; the 413-component license inventory still has 79 manual-review flags (53 missing declarations), so legal clearance is not inferred and R-018 remains open. Backlog: 150 unchecked / 119 checked / 269. No application deployment, PR merge, or public-copy change.

Production data audit addendum (2026-09-12T17:48:12Z): read-only repeatable-read audit confirms source counts/digests for all 74 legacy rows and 15 applied migrations; details are private in `PRODUCTION_SOURCE_AUDIT_2026-09-12.md`. This does not qualify a data migration, backup/restore, rollback, or cutover. HOSTED-013 remains open. Production schema expansion is complete; independent shipping batches need not wait for backfill implementation.

Production migration execution (2026-09-12): exact owner approval was received after presenting scope. A fresh read-only preflight identified Neon branch `production`, 10/33 tables, 74 aggregate rows, no journal, 0 sentinel rows, and `licenses.plan` default `'pro'::text`. Local `pnpm db:check` and `pnpm db:migrations:check` passed. `pnpm exec drizzle-kit migrate` exited 0; read-only postflight confirmed the full expected result. Point-in-time branch rehearsal succeeded and the branch was deleted. HOSTED-013 remains unchecked because no user-data backfill/dual-write/cutover or source-to-target reconciliation was executed; those are separate writes requiring their own exact plan and approval. The broader release is not authorized by this schema migration.

Production migration gate update (2026-09-12): bounded repeatable-read/read-only audits found 10/33 declared application tables present, 23 missing, no discoverable migration-history table, and aggregate exact counts totaling 74 rows across present tables. No customer row values were selected. The role can perform DDL/DML outside the read-only transaction. All 15 migrations replay on a disposable schema-only production clone; replay on a clean-empty DB fails because `0000` requires the pre-existing `licenses` baseline. Neon management API `GET /api/v2/projects` returned HTTP 401 using the separate `neon-api-key`, so provider backup/snapshot schedule metadata remains unknown. This is a blocking discovery, not migration readiness. HOSTED-013/R-021 still require identified legacy baseline/history, source-data inventory and reconciliation, signed audit evidence, approved exact migration plan, tested backup/restore and rollback, and independent review. No production write/migration occurred.

Migration replay gate addendum (2026-09-12): 87 existing column names/types/nullability values match Drizzle, but schema constraints/defaults/indexes/grants remain unverified. `0000`'s only data update currently matches zero `sentinel` license rows, but it still changes a column default. No migration-history record or tested snapshot restore was available. `pnpm db:migrate` remains prohibited on the production endpoint pending exact reviewed plan and all restore/reconciliation gates.

Migration gate update (2026-09-12): web `9eba73d` adds a local read-only audit command; local 86/86 tests and build/type/schema/migration checks pass, hosted run `34679868578`, GitGuardian, and Vercel pass. The command observed an empty isolated DB, not production data. HOSTED-013 and R-021 still require a complete/reproducible baseline, authorized source snapshot, signed manifest, mapping/reconciliation evidence, tested rollback, and independent review; this helper does not satisfy or authorize those gates. Backlog count unchanged at 152 unchecked / 117 checked / 269.

LIC-002 record update (2026-10-03): private artifact `docs/shipping/legal/external-engines-and-standards-2026-10-03.md` records exact technical provenance for pinned external engines, libraries, fixtures, and standards handling. It deliberately does not assert legal approval, redistribution permission, premium-content rights, trademark clearance, or independent review. LIC-002 remains OPEN and the release remains fail-closed for unresolved classifications.

Local Hunt runtime revalidation (2026-09-12): Docker Desktop integration against pinned BusyBox passes all 15 runtime assertions; Hunt package aggregate 51 pass / 1 macOS namespace skip. HUNT-011/QUAL-CLI-004 remain open; the skip is not treated as a pass and Linux-host evidence/independent review are still required.

Hunt planning/A1/verdict update (2026-09-20): CLI PRs #43/#44 pass both local 23/23 task graphs and all exact-head hosted checks. HUNT-003/004/007 are accepted: planning requires trust and binds exact finding/rule/subject; A1 is a fixed pure-probe harness explicitly labeled non-isolating; verdict precedence cannot turn infrastructure failure into `not-reproduced`. Gate 2 remains OPEN because HUNT-008-011, authenticated/licensed recipe coverage, Linux adversarial namespace evidence, and independent review are incomplete. The public Hunt execution command remains disabled.

Webhook/input qualification update (2026-09-20): Web PR #48 exact head `508cde0` passes 280/280 isolated-PostgreSQL tests, all local quality/schema/build/boundary checks, Node 22 hosted verification, GitGuardian, and Vercel preview. QUAL-WEB-002 is accepted for address-pinned SSRF/rebinding defense, redirects, IP-family/private/link-local/metadata cases, bounded inputs/responses/time, egress failures, and inbound HMAC/event-replay handling. Gate 2/4 remain OPEN: platform egress allowlisting/proxying, per-destination outbound webhook signatures, production migration `0017`, the R-021 foundational migration/backfill boundary, and broader operations/load qualification are not complete.

## Gate 0 — Truth and scope

- Current capability registry reconciled with code/tests.
- Every command and plan has a shipped/partial/planned label.
- Open-core, premium content, third-party licenses, notices, and trademark boundaries reviewed.

### PLAN-CLI-003 progress · 2026-10-06

The authenticated usage/record request matrix has code and hosted CI evidence
at Web PR #147 / merge `7248919`. Forged authority fields are rejected or
ignored before server-side ledger/persistence decisions. The release gate
remains open for the authenticated production probe and the complete
list/search/export/cache/public-private runtime matrix; no production evidence
is inferred from this code batch.

## Gate 1 — Evidence correctness

- Subject identity is immutable and digest-bound.
- Native and imported observations preserve attribution.
- Duplicate, malformed, stale, and mismatched evidence tests pass.
- Engine absence/staleness yields `INCOMPLETE`, never false `PASS`.

## Gate 2 — Security and agent safety

- No target-code execution during ordinary scanning.
- Hunt recipes are signed, bounded, isolated, redacted, and network-denied by default.
- SSRF, path traversal, archive bomb, symlink, malformed input, resource exhaustion, webhook, and tenant-boundary tests pass.

## Gate 3 — Product and UX

- Local viewer answers release decision before deep evidence.
- Developer, lead, client, and procurement views are understandable without founder explanation.
- Keyboard, screen reader, contrast, reduced motion, and machine-readable alternatives pass.

## Gate 4 — Commercial and operations

- Server-side seats, quotas, retention, overages, billing, and modified-CLI tests pass.
- Idempotency, retries, dead letters, restore drill, rollback, alert delivery, and monitoring pass.
- Per-plan hosted COGS and support cost are measured; no unbounded managed execution exists.

## Gate 5 — Distribution and licensing

- Clean install/upgrade/rollback on supported macOS, Linux, and Windows architectures.
- Trusted npm provenance, dependency SBOM, `THIRD_PARTY_NOTICES`, license validation, attribution, and modification notices are complete.
- Current state (2026-09-12): OPEN. LIC-001/004 and HOSTED-011/012 are accepted; CLI PR #34 self-scan and all nine Ubuntu/macOS/Windows Node 20/22/24 cells pass. Web PR #32 head `0d9a185` passes hosted run `34678019063`, GitGuardian, and Vercel, including 82/82 PostgreSQL-backed tests and all build/schema/security checks. PLAN-WEB-001/002 are accepted: catalog-derived server capabilities and explicit commercial/allowance states are implemented, while PLAN-CLI-001 and R-031 gateway/checkout reconciliation remain open. R-007 operator/provider privileged-access controls remain open. DIST-001 stays open behind LOCAL/HUNT/RECORD dependencies. Publishing remains fail-closed because the nested `benchmark@1.0.0` ISC/BSD-3-Clause conflict needs review; LIC-002 external content records, web redistribution review, release-note qualification, protected publish controls, and full amd64/arm64 install/rollback evidence remain open.

## Gate 6 — External acceptance

Current web update (2026-09-12): PR #32 head `0d9a185` is OPEN/MERGEABLE; hosted Node 22 run `34678019063`, GitGuardian, and Vercel pass. CI passes 82/82 tests with PostgreSQL, typecheck, schema/migration checks, production build, public-boundary, dependency, and tracked-secret checks. HOSTED-011/012 and PLAN-WEB-001/002 are accepted. Backlog count: 152 unchecked / 117 checked / 269. PR #34 also remains open; no merges or deployments were performed.

Web verification addendum (2026-09-12): PR #32 head `21c3b19` passes Node 22 run `34672637622`, including PostgreSQL integration, typecheck, full suite, schema/migration checks, build, public-boundary, dependency, and secret checks; GitGuardian and Vercel pass. HOSTED-011 is accepted at the verified PR head. HOSTED-012 route-level non-member/role-denial and existence-hiding evidence remains incomplete.

- Feature-complete release candidate tested against frozen public and authorized repositories/artifacts.
- Acceptance stories in `VERGLOS_FINAL_ACCEPTANCE_AND_POC.md` pass.
- Truth registry, docs, dashboard labels, pricing copy, and campaign claims updated only after evidence review.
Release-safety addendum (2026-10-03): CLI PR #57 (`8706c97`) now enforces that a future release tag matches all six public package versions before publication. Hosted self-scan and the full nine-cell platform matrix pass at the exact PR head. This hardens the DIST-002/003/006 prerequisite surface but does not satisfy protected-environment approval, legal/trusted-publishing review, actual npm provenance, or rollback/revocation qualification.

Rollback addendum (2026-10-03): CLI PR #58 (`8e39aa7`) adds a shared decision contract that refuses mutable targets and historical-record invalidation and requires replacement identity during signing-key revocation. It is not an operational rollback/revocation run; DIST-006 remains open.

Docker evidence addendum (2026-10-06): current-source Hunt Docker qualification
passed 15/15 enabled adversarial runtime scenarios against a pinned Debian image
under Docker 29.7.2. This does not close Gate 2 or Gate 6: host-level Linux
namespace qualification, independent review, trusted recipe publisher roots,
and external acceptance remain absent.

Distribution evidence addendum (2026-10-06): CLI PR #70 (`3a0959a`) makes the
publish workflow fail closed unless the release contains exactly the six public
npm archives at one shared version. Hosted platform run `37472923540` and
self-scan `37472923665` passed. DIST-001/002/003 remain open pending protected
trusted publication, legal clearance, actual provenance evidence, and final
release-governance qualification.

Production schema addendum (2026-10-06): migrations `0021`–`0025` were applied
to Neon production only after read-only inventory, a local `pg_dump` restore
rehearsal, and exact additive SQL review. Post-write verification reached 26
migration rows and confirmed new SCM/deletion tables/indexes with invariant row
counts unchanged. This does not close provider cutover, deletion acceptance,
backup/restore operations, or independent-review gates.

## Scope addendum · 2026-10-06

Before Gate 3/6 can claim GitHub organization alignment, `GITHUB-WEB-001..004`
must prove immutable account/repository binding, App installation permissions and
token lifecycle, delivery replay/lifecycle reconciliation, and a bounded
authorized-org cutover. Provider-neutral SCM tests alone are insufficient.

Before Gate 4/6 can claim complete billing support, `PLAN-WEB-013..015` must
derive methods from the server/catalog configuration and qualify every Razorpay
method enabled for the account in test mode (cards, UPI, netbanking, wallets
where enabled), including success/failure, capture, refund, renewal, replay, and
out-of-order events. Documentation does not substitute for account evidence.

Before Gate 6 can claim final acceptance, and only after the shipping candidate
is frozen, `ACCEPT-011..014` must use private
non-shallow fixture manifests, held-out repositories, reproducible current-source
scans, license/scope records, false-positive correction review, and a dated
regression/go-no-go. No customer acceptance may be inferred from public fixtures.

Payment configuration addendum (2026-10-07): Web PR #149 head `6b5da26` now
fails production runtime validation when `RAZORPAY_ENABLED_PAYMENT_METHODS` is
unset or blank, and continues to reject QR-only configuration. Focused payment
and runtime-config tests pass 8/8, typecheck, schema check, and the 40-page
preview build pass. Hosted run `37558018780` and the Vercel preview were
pending/deploying at capture. This hardens PLAN-WEB-013 but closes no payment
or release gate; account-enabled method, test-mode lifecycle, and production
reconciliation evidence remain open. Private evidence:
`docs/shipping/evidence/plan-web-013-production-method-config-pr149-2026-10-07.md`.

Payment hosted-correction addendum (2026-10-07): PR #149 head `6b5da26` was
not accepted after hosted workflow `37558018780` found one stale runtime-config
expectation (870 pass / 1 skip / 1 fail). The test was corrected at head
`900a6a5`; the local serial suite is 850 pass / 22 explicit skips and the
replacement hosted workflow `37558287090` is pending. No behavior was weakened
and no production/provider state changed. Private evidence:
`docs/shipping/evidence/plan-web-013-pr149-hosted-correction-2026-10-07.md`.

Payment hosted-correction result (2026-10-07): replacement workflow
`37558287090` passed all configured hosted checks at PR #149 head `900a6a5`,
including the 850-pass / 22-explicit-skip serial suite, build, boundary,
dependency, license, SBOM, and secret checks. Vercel preview completed. This
does not close PLAN-WEB-013/014/015: the Vercel project still has no listed
`RAZORPAY_ENABLED_PAYMENT_METHODS` configuration, and account-enabled
test-mode lifecycle/reconciliation evidence is absent.

Deletion qualification addendum (2026-10-07): Web PR #153 head
`718aadcaa384dcfd8a5fc4789c3b62c23c9e3858` adds a versioned deletion inventory
and fail-closed completeness/version gate. Local 22/22 focused tests,
typecheck, schema/database checks, ordered migration validation, diff check,
and 38-page build pass; hosted `typecheck-and-schema` workflow `37559045448`
was pending at capture. This does not pass Gate 2/4/6 or accept
`QUAL-WEB-005`: durable hold authority, customer-held digest registration,
bounded worker, reconciliation/audit receipt, restore rehearsal, and
authenticated non-production E2E remain open. No production or destructive
operation occurred.

Deletion job persistence addendum (2026-10-07): Web PR #153 head
`b91222a8d4d6ffd08f2be71391d89a6dafedab1` adds an additive user-scoped job
table and transactionally pairs it with each request. Focused 16/16,
disposable PostgreSQL integration 1/1, serial 846/23/0, typecheck/schema,
32-migration ordering, diff, and 38-page build pass. Hosted checks were
pending at capture. This still does not pass Gate 2/4/6 or accept
`QUAL-WEB-005`: claim/retry adapter, per-kind deletion, reconciliation/audit,
restore/rollback, and authenticated non-production E2E remain open; migration
0031 is source-only and unapplied.

Deletion inventory-read addendum (2026-10-07): Web PR #153 head `4656013`
adds lease-fenced reads for seven hosted kinds, active holds, and customer-held
digests, verified by disposable PostgreSQL 1/1 and the full local suite. The
adapter explicitly returns `inventoryComplete=false` until supporting
user/license/retention data and legal dispositions are covered. Hosted workflow
`37562115786` was pending at capture. This does not pass Gate 2/4/6 or accept
`QUAL-WEB-005`; destructive transactions, reconciliation/audit, restore/
rollback, and authenticated non-production E2E remain open.

Deletion adapter addendum (2026-10-07): Web PR #153 head
`654c78c69a44d7b5aad4733ec7cb364d760b76b0` adds the user-scoped PostgreSQL
claim/retry/block adapter with `SKIP LOCKED` and worker/attempt fencing.
Disposable integration 1/1, serial 846/23/0, typecheck/schema/migration,
negative-boundary, diff, and 38-page build pass. Hosted workflow `37561862519`
was queued at capture. This still does not pass Gate 2/4/6 or accept
`QUAL-WEB-005`: inventory-backed reads, destructive per-kind transactions,
reconciliation/audit, restore/rollback, and authenticated non-production E2E
remain open; migration 0031 is source-only and unapplied.

Deletion worker scope-fence addendum (2026-10-07): Web PR #153 head
`ade21b6f4c74b0a27bcf349bded6d9ceb7e39ee0` adds the claimed-job user-scope
check before state reads or adapter calls. The worker/deletion focus is 32/32,
the negative-boundary suite is 2/2, and hosted workflow `37560704115` passed
with Vercel, GitGuardian, and Preview Comments. This still does not pass Gate
2/4/6 or accept `QUAL-WEB-005`: no production adapter, deletion-job wiring,
destructive SQL, row-count/audit reconciliation, restore/rollback rehearsal, or
authenticated non-production E2E is present; migrations 0029/0030 remain
unapplied.

Deletion inventory hosted verification addendum (2026-10-07): Web PR #153
exact head `4656013425c4cadb498f004c1057aa6f1d5931b6` passed workflow
`37562115786`, including hosted typecheck/tests/schema/migration/build,
public-boundary, dependency/license/SBOM, secret, Vercel, GitGuardian, and
Preview Comments checks. This still does not pass Gate 2/4/6 or accept
`QUAL-WEB-005`: the adapter intentionally reports incomplete inventory,
destructive transactions, reconciliation/audit, restore/rollback, runtime
wiring, and authenticated non-production E2E remain open. No production
migration or deletion occurred.

Deletion receipt hosted verification addendum (2026-10-07): Web PR #153 exact
head `52be606` passed workflow `37562587132`, including hosted tests,
schema/migration/build, boundary, dependency/license/SBOM, secret, Vercel,
GitGuardian, and Preview Comments checks. This still does not pass Gate 2/4/6
or accept `QUAL-WEB-005`: migration `0032` is source-only, and complete
ownership/retention inventory, destructive transactions, runtime wiring,
reconciliation, restore/rollback, and authenticated non-production E2E remain
open. No production migration or deletion occurred.

Payment method gate update (2026-10-07): PR #149 hosted catalog verification
is green, but the payment release gate is not satisfied. Required before
acceptance: account-enabled test-mode method configuration, qualified hosted
checkout evidence for each enabled method, success/failure/cancel/refund/
webhook replay coverage, and ledger-to-provider reconciliation. QR is not a
substitute for hosted-method qualification, and no live payment or production
configuration change is authorized by this substrate batch.

Deletion gate update (2026-10-07): PR #153 now has hosted-kind transactional
deletes and durable per-kind receipts, but `QUAL-WEB-005` still fails closed.
Before acceptance, qualify the complete supporting data graph and retention
dispositions, wire and authenticate the worker invocation, reconcile actual
row counts and audit receipts, rehearse restore/rollback, and run the
authenticated non-production E2E. Migration `0033` remains unapplied to
production; no deletion or production write occurred.

Runtime runner update (2026-10-07): PR #153 exact head
`1f8571b4a146e9ef78ca9ae25c13b86f8e89665c` passed hosted Verify
`37563987818` / job `112607416147`, with route contract 2/2, disposable DB
integration 1/1, serial 846/23/0, ordered 34-migration validation, and a
38-route build passing locally. This wires a bounded authenticated adapter but
does not close Gate 2/4/6 or accept `QUAL-WEB-005`: the inventory gate remains
false, and supporting dispositions, reconciliation, restore/rollback, and
authenticated non-production E2E remain open. No production invocation or
destructive operation occurred.

Supporting-disposition update (2026-10-07): PR #153 exact head
`f83af5c0bdb9b15ee87ec83ac365e1fc5f91bd26` passed hosted Verify
`37564437899` / job `112608834179`, with focused deletion/hold/inventory
11/11, serial 846/23/0, ordered 34-migration validation, and a 38-route build
passing locally. The registry improves omission detection but does not close
Gate 2/4/6 or accept `QUAL-WEB-005`: executable dispositions,
reconciliation, restore/rollback, and authenticated non-production E2E remain
open. No production invocation or destructive operation occurred.

Hold-authority update (2026-10-07): PR #153 exact head
`929da1907f001c8db71df0e601e08014590fd580` passed hosted Verify
`37608932973` / job `112751169501`, with focused hold/admin/digest/worker
contracts 10/10, serial 872/849/23/0, ordered 35-migration validation,
negative-boundary, truth, SBOM/license, and build checks passing locally. The
new routes are super-admin-only, same-origin for mutations, target/request
bound, bounded, private/no-store, and race-safe on release. This does not
close Gate 2/4/6 or accept `QUAL-WEB-005`: migrations `0029`–`0034` remain
unapplied, and authenticated deletion E2E, approved dispositions, consent
inventory, reconciliation, restore/RPO, rollback, and independent acceptance
remain open. No production migration, deletion, or destructive operation
occurred.
Payment hosted-method alignment update (2026-10-07): Web PR #149 commit
`f734acc` marks Pay Later as hosted-checkout-supported after the direct
test-mode Checkout target exposed a Pay Later radio. Focused payment/route/
runtime tests pass **30/30** and typecheck passes. This is presentation and
catalog alignment only; no payment method was selected, and the provider
lifecycle, reconciliation, production configuration, and release gates remain
open. No production operation occurred.
Hosted gate addendum (2026-10-07): PR #149 exact head
`f734acc8d4b03625b96cb90b628be04d4713d91d` passed Verify `37611750797`,
GitGuardian, Vercel, and Preview Comments. The code-side gate is green, but
PLAN-WEB-013/014/015 remain release-blocking for provider lifecycle and
production reconciliation; no merge or production operation occurred.
Payment qualification addendum (2026-10-07): a bounded test-mode Cards
Checkout probe reached the hosted card form, but provider contact validation
blocked continuation before the mock success/failure page. No payment,
webhook, entitlement, or production operation occurred. PLAN-WEB-014 remains
release-blocking and no checkbox changed.

Payment qualification continuation (2026-10-07): a fresh provider-only
test-mode probe used the documented E.164 contact and official sandbox card
fixture. Razorpay recorded one attempted card payment with `amountPaid=0`;
UPI and netbanking rendered but were not completed. This adds failure/display
evidence only and does not satisfy success, capture, refund, renewal,
cancellation, replay, out-of-order, webhook, exactly-once entitlement, or
production reconciliation requirements. PLAN-WEB-014/015 remain open; no
production, database, deployment, or live-payment operation occurred. See
`docs/shipping/evidence/plan-web-014-test-mode-lifecycle-attempt-2026-10-07.md`.
Hunt gate update (2026-10-07): CLI PR #76 exact head
`17d0813737cda980ccb366c5adf948bda2e293a3` adds paid `hunt.critical`
enforcement before supported-recipe execution input reads. Local focused
Hunt/process tests 54/54 and typecheck pass; hosted cross-platform checks are
pending. This closes no release gate: trusted/licensed recipe provenance,
independent review, and complete Hunt qualification remain open.

QUAL-WEB-006 runtime addendum (2026-10-07): read-only CDP inspection of the
authenticated production `/orgs` empty state found one `main`, one `h1`, one
`h2`, one named link, and a 30-node accessibility tree. The snapshot had 79
DOM nodes, zero layout duration, 0.000991 s style recalculation, 0.004148 s
task duration, and 7,941,820 bytes JS heap. This is partial evidence only and
does not close the accessibility/performance gate: keyboard, human
screen-reader, mobile, field-CWV, authenticated dashboard-data, and large-data
qualification remain open. No checkbox or production state changed. See
`docs/shipping/evidence/qual-web-006-org-directory-ax-perf-2026-10-07.md`.

QUAL-CLI-006 validation addendum (2026-10-07): CLI PR #79 exact head
`13d144438045da574e7cbab6a21ec73341b8f796` adds standards required-field
corpus coverage. Shared importer/security tests 29/29, configured CLI graph
12/12, typecheck across 10 packages, and build across 8 packages pass. Hosted
run `37625527232` passed all nine Ubuntu/macOS/Windows × Node 20/22/24 cells,
self-scan, and in-toto; PR #79 merged as
`7d060b2852551cc017bbb2b5f70bad22843e7273`. This does not satisfy the
release gate: official validators, artifact and legal/provenance review,
trusted publishing, cross-platform release evidence, and independent
acceptance remain required. No checkbox or external state changed.

Hosted Checkout prefill addendum (2026-10-07): Web PR #149 exact head
`b73fdd3beba513c0f9fc69a38c2fc69319ff9474` adds bounded server-derived email
and E.164 contact prefill with fail-closed client parsing. Focused tests
23/23, negative-boundary 2/2, typecheck, schema/migration checks, build, and
diff check pass; hosted `typecheck-and-schema` run `37624542330`, Vercel,
Vercel Preview Comments, and GitGuardian are green. This does not satisfy
the payment release gate: account-enabled method qualification, complete
success/failure/capture/refund/renewal/cancellation/replay/out-of-order/webhook
coverage, exactly-once entitlement behavior, and ledger-to-provider
reconciliation remain required. No production/provider/payment/database/
deployment operation occurred; no checkbox changed.

Payment qualification continuation (2026-10-07): the Razorpay Test Mode
hosted Checkout rendered the observed Cards and Netbanking branches. Cards
reached the provider save-card/confirming state and Netbanking reached bank
selection, but neither produced a success/failure callback or lifecycle event.
This is method-display/navigation evidence only and does not close the payment
gate or PLAN-WEB-014/015. No provider identifier, payment, webhook,
entitlement, database, deployment, or production state was retained.

## Web empty-Postgres regression qualification · 2026-10-07

PR #153 exact head `929da1907f001c8db71df0e601e08014590fd580` passed
`TEST_DATABASE_URL=<fresh-empty-local-db> pnpm test:serial` against disposable
Docker `postgres:15`: pretest **48/48**, main **871/872** with one explicit
environment skip, zero failures, exit 0. This is supporting runtime evidence
only. It does not pass the production deletion gate or any payment gate:
authenticated non-production deletion E2E, migration/cutover, restore/RPO,
rollback, reconciliation, provider lifecycle, and independent acceptance
remain open. No checkbox changed and the disposable container was removed.

## QUAL-WEB-006 mobile/focus runtime probe · 2026-10-07

The authenticated production `/orgs` empty state showed no horizontal overflow
at desktop 1710x985 or bounded mobile 390x844. AX trees were 30/18 named and
32/20 named nodes; one focusable link and zero buttons were present. Desktop
layout/style/task/heap metrics were 0.000059s/0.000669s/0.001557s/6,530,812
bytes. This does not pass QUAL-WEB-006: keyboard traversal, human
screen-reader review, focus-visible proof, field-CWV, authenticated data
states, and large-data evidence remain open. No production mutation or
checkbox change occurred.

## QUAL-WEB-005 hold serialization · 2026-10-07

Web PR #153 exact head `85faba9d2e8569c285d631d1c7912753886d145b` adds a
user-scoped PostgreSQL advisory-lock boundary shared by hold activation/release
and supporting/hosted deletion plus terminal receipt completion. Active holds
are rechecked inside each protected transaction and cause a bounded worker
block. Focused tests **35/35**, disposable PostgreSQL integration **1/1**,
typecheck, schema, ordered 35-migration, and diff checks pass; hosted Verify
`37633633802` completed successfully at exact head; Vercel and Preview
Comments were also green. This strengthens but does not pass
Gate 2/4/6 or accept `QUAL-WEB-005`: authenticated non-production E2E,
approved dispositions, production migrations/cutover, reconciliation,
restore/RPO, rollback, and independent acceptance remain open. No checkbox or
production state changed.

## PLAN-WEB-014 current-main local integration · 2026-10-07

The exact merged Web main `1498837` passed a disposable PostgreSQL 15 run with
37 ordered migrations and **22/22** payment/catalog/webhook/replay/refund/
lifecycle tests, plus typecheck, schema check, and a preview-mode **43-page**
build. This is isolated synthetic-event evidence only; it does not pass the
provider lifecycle or production reconciliation gates. PLAN-WEB-014/015 remain
open. Evidence: `docs/shipping/evidence/plan-web-014-current-main-local-integration-2026-10-07.md`.

## PLAN-WEB-012 out-of-order payment hardening · 2026-10-08

Web PR #161 merged as `ec02cacf69f3adb0d8df5ccb36a1a4eb5ef4cc3f` after hosted
typecheck/schema, serial, build, dependency/license/SBOM, public-boundary,
GitGuardian, Vercel, and Preview Comments checks passed. The isolated ledger and
webhook-handler tests prove failed→captured recovery and late-failure replay
idempotency. This advances the code-side payment gate only; live provider
method/lifecycle and production reconciliation remain required. No checkbox
changed and no production/provider/database/deployment state changed. Evidence:
`docs/shipping/evidence/plan-web-012-out-of-order-payment-2026-10-08.md`.

## QUAL-WEB-005 route integration progress · 2026-10-08

PR #162 current exact head
`3061b9a14bd01ba22e0076b8c30d71d387483ade` passes the isolated authenticated
route integration **8/8**, deletion/hold/inventory/worker contracts **23/23**,
safe-default serial **861/885 with 24 explicit
skips and zero failures**, typecheck, schema/migration checks, diff hygiene,
and the preview-safe 45-page build. The clean database-backed serial run at
the initial auth-seam head had eight known shared-fixture schema collisions;
the current head's rebuilt isolated route-to-worker/deletion-job integrations
pass 2/2; the shared fixture skips cleanly when its migrated tables are
absent. Hosted Verify `37785153399`, Vercel, GitGuardian, and Preview Comments
passed, and PR #162 merged to Web main as
`b34376bb02525737830f1d075778ebce774ed006`.
This does not pass the deletion release gate: legal/customer-held disposition,
destructive-worker E2E, reconciliation, restore/rollback, production
authorization, and independent acceptance remain open. No checkbox or
production state changed. Evidence:
`docs/shipping/evidence/qual-web-005-route-e2e-2026-10-08.md`.

## PLAN-WEB-014 subscription invoice binding and Production code rollout · 2026-10-09

Web `a95deef` passed focused webhook **13/13**, full Web **891 total / 868
pass / 23 explicit skips / 0 fail**, typecheck, and the 45-page build. A fresh
isolated Preview/Test Mode subscription reconciled through its paid invoice to
the provider payment/order/subscription, an active isolated subscription, a
captured payment ledger row, and a license binding. Production deployment
`dpl_72ptf8YQyLxxXvJHVQDg2vUfh3CN` passed runtime-config/build/read-only smoke
and remains fail-closed for billing activation. This qualifies the observed
first-charge subscription defect as fixed, but does not pass the complete Gate
4 lifecycle matrix or provider/ledger/entitlement reconciliation. No checkbox
changed. Evidence:
`docs/shipping/evidence/plan-web-014-subscription-invoice-reconciliation-and-production-rollout-2026-10-09.md`.
