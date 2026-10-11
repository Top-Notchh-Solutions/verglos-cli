# Verglos V1 · Manual-input blocker inventory (private)

## 2026-10-11 · TEAM-CLI-001 hosted signer/SCM block

TEAM-CLI-001's repository-owned code is qualified at focused tests 8/8 and
Turbo typecheck/build 12/12, but its complete acceptance is externally
blocked. The missing artifacts are the activated Verglos organization-policy
signing root, one active TopNotchh GitHub installation/repository binding, and
the live signed hosted fetch/cache/provider evidence.

Owner: release owner plus TopNotchh organization administrator. Review:
2026-10-11 or when artifacts are available. Next action: install/bind the
authorized company test repository, publish a non-sensitive policy row, and
run the live fetch plus offline-cache recheck. Release decision: keep the
checkbox and all dependent SCM checkboxes open; do not treat unit tests as
provider evidence.

Evidence:
docs/shipping/evidence/team-cli-001-code-qualification-block-2026-10-11.md.

## 2026-10-11 · PRO-008 cleared by Final V1 billing contract

The Pro member and billing view is no longer blocked by the retired
recurring-subscription or invoice-document expectation. V1 provides
server-enforced two-seat membership, allowance and threshold projections,
owner-only payment/provider metadata, and a customer-initiated manual-renewal
link to Cards-only prepaid checkout. Legacy subscription rows remain visible
only for reconciliation; tax-invoice documents and provider download URLs are
not claimed.

PRO-008 is checked. Score is 228/52/280 (81.4%). No external input is needed
for this checkbox. The next dependency-ready item is selected only after the
HUNT-008 external provenance/reviewer blocker is recorded; remaining gates are
Gate 5 SCM, independent Hunt/AppSec, legal, protected release/rollback, and
final acceptance.

Evidence:
docs/shipping/evidence/pro-008-final-v1-billing-view-2026-10-11.md.

## 2026-10-11 · PLAN-WEB-012 cleared by Final V1 contract reconciliation

The old recurring-subscription acceptance wording is retired. Final V1 now
means Cards-only prepaid fixed-term access with a second user-initiated order;
automatic recurring renewal is compatibility-only. The accepted Preview/Docker
matrix covers capture, failure/no-grant, refund, manual renewal, expiry,
replay/order, retry, and exactly-once reconciliation.

`PLAN-WEB-012` is checked. Score is **227/53/280 (81.1%)**. The next queue is
external HUNT-008 provenance/review (blocked) followed by the next
dependency-ready implementation item. Gate 5, legal, protected release/
rollback, and final acceptance remain open.

Evidence:
`docs/shipping/evidence/plan-web-012-final-v1-lifecycle-reconciliation-2026-10-11.md`.

## 2026-10-11 · PLAN-WEB-015 cleared by read-only Production reconciliation

Production now matches the Final V1 Cards-only contract: the environment
method catalog is exactly `card`, the live checkout returned HTTP 200 with
Cards only, and no Test Mode or non-card method marker appeared. Checkout was
not submitted and no Production state changed. The provider lifecycle is
already accepted in isolated Preview under PLAN-WEB-014.

`PLAN-WEB-015` is checked. Score is **226/54/280 (80.7%)**. The next
dependency-ready queue item remains `PLAN-WEB-012`; its remaining provider
subscription compatibility evidence is separate from the final prepaid offer.
HUNT-008 remains externally blocked on trusted/licensed recipe provenance and
independent review, and Gate 5 remains open.

Evidence:
`docs/shipping/evidence/plan-web-015-production-cards-only-display-2026-10-11.md`.

## 2026-10-11 · PLAN-CLI-003 cleared; next queue is Hunt provenance

The isolated Preview paid modified-client matrix is complete and
`PLAN-CLI-003` is checked. It covered forged plan/capability/tenant/query
inputs, private organization/project/list/search/record/download boundaries,
public receipt behavior, and the active Pro Bearer CLI surfaces. The only
Preview writes were one acceptance organization and one test project in the
isolated database. Score is **225/55/280 (80.4%)**.

The next queue item by dependency order is `HUNT-008`, but it is externally
blocked rather than code-blocked: the missing inputs are trusted/licensed
recipe provenance and independent qualification. Record that owner/action
before moving to the next dependency-ready implementation item. `PLAN-WEB-012`
and `PLAN-WEB-015` remain open billing/reconciliation work and Gate 5 remains
open for the authorized GitHub organization workflow.

Evidence:
`docs/shipping/evidence/plan-cli-003-preview-paid-modified-client-matrix-2026-10-11.md`.

## 2026-10-11 · Gate 4 cleared for Final V1 prepaid billing

The Final V1 Cards-only prepaid lifecycle is no longer blocked: two real
isolated Preview captures, signed webhook delivery, failed/no-grant behavior,
full and partial refund, and a second manual-renewal order were reconciled.
Fresh Docker payment integration passed 6/6 and the focused payment suite
passed 29/29 with one explicit environment-gated skip and zero failures.

The recurring-card fixture request is retired from the V1 blocker list because
automatic recurring renewal is not in the current product contract. The next
single dependency-ready queue item is `PLAN-CLI-003`; `PLAN-WEB-015` remains a
separate Production contract/reconciliation item. Score is **224/56/280
(80.0%)**.

Evidence:
`docs/shipping/evidence/plan-web-014-preview-prepaid-cards-lifecycle-2026-10-11.md`.

## 2026-10-11 · full refund processed; remaining lifecycle qualification

The isolated Preview Test Mode full refund is now processed. The signed
`refund.processed` webhook returned HTTP **200**, and the isolated database
projects the matching payment to `refunded` with the full refund watermark.
The existing paid-time license remains active until its recorded expiry under
the current refund contract. This supersedes the pending-refund entry below.

The manual-input blocker is no longer the refund transition for this payment.
PLAN-WEB-014 and Gate 4 still require provider-backed failure/recovery and
expiry evidence, a second customer-initiated manual-renewal order, and
replay/out-of-order, timeout/retry, and exactly-once reconciliation. Score
remains **223/57/280 (79.6%)**; no checkbox changed.

Evidence:
`docs/shipping/evidence/plan-web-014-preview-cards-refund-processed-2026-10-11.md`.

## 2026-10-11 · success-path capture/webhook is proven; remaining lifecycle open

The isolated Preview Cards-only run completed through an official Razorpay Test
Mode card fixture. The provider showed Captured, the signed webhook route and
read-only order-status route returned HTTP 200, and the browser reached Pro
activation. A full Test Mode refund was issued, but the provider currently
reports it as processing; `refund.processed` delivery and entitlement
revocation are not yet observed.

Keep `PLAN-WEB-014`, `PLAN-WEB-015`, and Gate 4 open for processed refund,
failure recovery, expiry, manual renewal, replay/out-of-order, timeout/retry,
and exactly-once evidence. Score remains **223/57/280 (79.6%)**. Evidence:
`docs/shipping/evidence/plan-web-014-preview-cards-capture-webhook-2026-10-11.md`.

## 2026-10-11 · provider capture without historical webhook delivery

The official Razorpay Test Mode card fixture completed and the provider
dashboard showed the canonical Pro monthly payment as **Captured**. The exact
isolated Preview webhook target was enabled after that payment, so Razorpay
did not deliver a historical signed event and the application correctly stayed
in its webhook-waiting state. No event was replayed or synthesized.

This proves provider-side capture only. Keep `PLAN-WEB-014`, `PLAN-WEB-015`,
and Gate 4 open until a fresh payment after webhook enablement proves signed
capture delivery, ledger credit, fixed-term entitlement, and the remaining
refund/expiry/manual-renewal/exactly-once cases. Score remains **223/57/280
(79.6%)**. Evidence:
`docs/shipping/evidence/plan-web-014-preview-cards-capture-webhook-boundary-2026-10-11.md`.

## 2026-10-11 · prepaid provider terminal boundary

Two official Razorpay domestic Test Mode card attempts reached the isolated
Preview hosted checkout, but the provider returned its own failure result
before a signed terminal event. The application therefore has no provider
capture to reconcile into the payment ledger or fixed-term entitlement. Keep
`PLAN-WEB-014`, `PLAN-WEB-015`, and Gate 4 open. Do not guess an OTP, synthesize
a webhook, edit a database row, or use Production billing. Evidence:
`docs/shipping/evidence/plan-web-014-preview-prepaid-provider-terminal-failure-2026-10-11.md`.

## 2026-10-11 · prepaid contract current boundary

The current Final V1 contract replaces the historical recurring-card payment
promise with one-time Cards-only prepaid access and customer-initiated manual
renewal. Isolated Preview order creation now returns the canonical server-owned
offer and Cards-only method set, but no provider terminal result or signed
payment-to-ledger-to-entitlement reconciliation has been captured in this
run. Keep `PLAN-WEB-014` and Gate 4 open for that evidence. Do not request or
retest a recurring-card fixture as a V1 prerequisite.

Evidence: `docs/shipping/evidence/plan-web-014-preview-prepaid-order-creation-2026-10-11.md`.

## Current superseding reconciliation · 2026-10-10 · Official recurring-card fixture

The protected isolated Preview route created a canonical Pro monthly Test Mode
subscription. Razorpay's official domestic Visa fixture reached the recurring
card-save/mandate step, but the supported `Skip OTP` control returned that the
card was not eligible for recurring payments. The provider reported
`created`/`paid_count=0` with no linked payment; the exact isolated
subscription was cancelled with HTTP 200.

The provider-supported recurring-card/tokenization fixture or renewal/delivery
control remains the only missing artifact for the next Gate 4 attempt. Keep
`PLAN-WEB-014` and Gate 4 open; no OTP guessing, undocumented endpoint,
synthetic webhook, manual row edit, or Production billing operation is
permitted. Review: 2026-10-17 IST. Score remains **223/57/280 (79.6%)**.

Evidence: `docs/shipping/evidence/plan-web-014-preview-official-recurring-card-fixture-boundary-2026-10-10.md`.

## Current superseding reconciliation · 2026-10-10 · gates-testing inventory

The isolated `.env.gates.testing` values were parsed without recording any
secret. Read-only Razorpay Test Mode plan and subscription inventory returned
HTTP 200. The configured canonical Pro monthly and annual plans were present,
and the provider returned 42 Test Mode subscriptions across `active`,
`cancelled`, and `created`. The local method configuration is Cards-only.

This removes credential validity and plan discovery as the current Gate 4
blocker. It does not close Gate 4 or `PLAN-WEB-012`/`014`: the remaining
artifact is a bounded isolated lifecycle run with signed provider-generated
renewal, failure/expiry, refund replay/order, out-of-order, timeout/retry,
exactly-once, and payment-to-ledger-to-license reconciliation evidence. No
Production or database/provider/entitlement write occurred.

Evidence: `docs/shipping/evidence/razorpay-gates-testing-readonly-inventory-2026-10-10.md`.

## Current superseding reconciliation · 2026-10-10 · Recurring-card provider boundary

The earlier Test Mode credential and dashboard-authentication blockers are
superseded. Fresh read-only provider inventory returned HTTP 200, the
authenticated Razorpay webhook detail showed HTTP 200 for the repaired
`payment.failed`, `subscription.paused`, and `subscription.resumed` deliveries,
and fresh deployed responses confirmed Cards-only in Production and isolated
Preview. Production remains subscription-disabled and Preview remains
isolated Test Mode subscription-enabled.

The remaining missing artifact is provider-supported recurring-card
tokenization/authorization and capture, followed by one-to-one payment,
ledger, license, and access reconciliation. The selected Dashboard target
exposed no replay or charge-now control. Owner: Verglos release owner with
the Razorpay Test Mode account owner. Review by 2026-10-17. Safe next action:
obtain provider confirmation or a supported Test Mode fixture/control and run
only the missing cases. Keep Gate 4 and `PLAN-WEB-014` open; do not retry the
same OTP path indefinitely, use Production, edit rows, or use synthetic
provider events.

Evidence:
`docs/shipping/evidence/plan-web-014-preview-webhook-bypass-pause-resume-2026-10-10.md`.

The redacted provider-support request is prepared at:
`docs/shipping/evidence/razorpay-testmode-recurring-card-support-request-2026-10-10.md`.

## Current superseding reconciliation · 2026-10-10 · CLI backend queue audit

The authoritative CLI `origin/main` is `f5686b5c`; implementation PRs through
#88 are merged and no open CLI implementation PR remains. The remaining CLI
checkboxes require real external artifacts: trusted npm signing/publishing,
legal/licensing decisions, independent Hunt review, hosted tenant/SCM
operations, customer/recipient acceptance, or final release qualification.

Owner/action: release maintainer coordinates trusted publishing; authorized
legal/company reviewer handles licensing; independent AppSec reviewer handles
Hunt; authorized organization/customer owners handle hosted and POC evidence.
Review before the next release-candidate decision on **2026-10-10**. Do not
create a duplicate PR or fabricate any approval. Web payment qualification
continues independently.

Evidence: `docs/shipping/evidence/cli-backend-queue-audit-2026-10-10.md`.

## Current superseding reconciliation · 2026-10-10 · Partial refund qualification

A second isolated captured subscription payment passed provider identity
preflight. Its 140,471-paise Test Mode partial refund returned HTTP 200, the
provider reported one processed cumulative refund, and the isolated Preview
payment row reconciled to `partially_refunded` with the same watermark.

The full Gate 4 matrix remains open for refund replay/order, enabled methods,
renewal, failure/expiry, timeout/retry, exactly-once, and complete
provider/ledger/entitlement reconciliation. No secret is recorded here and
Production remains untouched.

Evidence:
`docs/shipping/evidence/plan-web-014-preview-subscription-partial-refund-2026-10-10.md`.

## Current superseding reconciliation · 2026-10-10 · Test Mode refund qualification

The previously flagged Test Mode credential boundary is no longer blocking
this technical run: the authorized `gates-testing` environment passed a
read-only identity preflight and one bounded full refund. Razorpay returned
HTTP 200, delivered a completed `refund.processed` event to isolated Preview,
and the matched payment row reconciled to `refunded`.

This does not close Gate 4. Partial refund, refund replay/order, remaining
payment methods, renewal, failure/expiry, timeout/retry, exactly-once, and
complete provider/ledger/entitlement reconciliation remain missing artifacts.
No secret is recorded here. Production remains untouched.

Evidence:
`docs/shipping/evidence/plan-web-014-preview-subscription-refund-2026-10-10.md`.

## Current superseding reconciliation · 2026-10-10 · Provider cancellation delivery

The Preview fixture access issue is resolved for the authorized runner through
a branch-scoped secret and authenticated Vercel transport. Two real canonical
Test Mode subscription creates and two Test Mode cancellations succeeded.
However, the provider reported the fresh subscriptions cancelled while the
isolated database retained their rows as pending; the owner-bound status route
returned processing/pending and granted nothing.

The missing artifact is a signed Razorpay cancellation delivery to the
isolated Preview endpoint plus the reconciled database transition. Owner: Web/
provider operations. Review before the next lifecycle run on 2026-10-10. The
safe next action is a provider-reachable isolated webhook target or a
provider-supported replay through the authorized protected path. Do not
disable Preview protection, use Production, or edit rows manually. Gate 4 and
`PLAN-WEB-011/012/014/015` remain open.

Evidence:
`docs/shipping/evidence/plan-web-014-preview-subscription-create-cancel-reconciliation-2026-10-10.md`.

## Current superseding reconciliation · 2026-10-10 · CLI consumer and Production code rollout

`QUAL-CLI-006` now has current-head clean-consumer and transition evidence:
all six public archives installed and imported, `Verglos 2.0.0-alpha.1`
executed without implicit external-engine installation, and
`1.8.3 -> 2.0.0-alpha.1 -> 1.8.3` passed. The remaining artifacts are
trusted keyless publisher identity, protected npm approval/publication, legal
clearance, independent review, and final acceptance.

The current READY Production deployment from Web `6f932d4` passed bounded
read-only route smoke and remains fail-closed. No Production/provider/
database/entitlement/account/customer write occurred. Production activation,
reconciliation, monitoring, restore, and rollback remain operation-specific
gates.

No founder input is needed for this technical batch. The separate missing
artifact for Gate 4 remains the protected Preview auth fixture needed to run
the isolated subscription lifecycle; it must be supplied to an authorized
runner, never pasted into chat or committed.

Evidence:
`docs/shipping/evidence/qual-cli-006-official-current-head-2026-10-10.md`;
`docs/shipping/evidence/production-current-code-rollout-smoke-2026-10-10.md`.

## Current superseding reconciliation · 2026-10-10 · Preview fixture access and CLI qualification

The exact current CLI `main` head
`f5686b5c5aa11f45f392e647bd9d7e31830654ba` now has official CycloneDX/SPDX,
exact-source build, six-archive in-toto binding, standards-corpus, and
public-boundary evidence. `QUAL-CLI-006` still needs trusted keyless release
identity, protected publication, legal/independent review, consumer platform
evidence, and final acceptance.

The isolated Preview subscription operation did not start because Vercel
withheld the hidden Preview auth-fixture secret from the authorized runner.
No HTTP request or provider/database/entitlement/Production write occurred.
Owner: founder or Vercel project administrator. Missing artifact: protected
runtime access for an authorized runner, never a secret pasted into chat or
committed. Review before the next Preview attempt on 2026-10-10. Gate 4 and
`PLAN-WEB-011/012/014/015` remain open until the complete lifecycle matrix and
reconciliation are executed. Score remains **219/61/280 (78.2%)**; no checkbox
changed.

Evidence:
`docs/shipping/evidence/qual-cli-006-official-current-head-2026-10-10.md`;
`docs/shipping/evidence/plan-web-014-preview-auth-fixture-unavailable-2026-10-10.md`.

## Current superseding reconciliation · 2026-10-09 · Legal review packet

The private legal/licensing review request is prepared here:

`docs/shipping/legal/legal-review-addendum-2026-10-09.md`

Owner/action: an authorized legal/company reviewer must decide each section,
state conditions, scope, expiry, reviewer identity, and verifiable approval
reference against the exact release artifacts. This is not approval. Until it
is completed, Gate 7, `LIC-002`, `LIC-003`, and dependent release rows remain
open. No credential or customer source is needed in chat.

## Current superseding reconciliation · 2026-10-09 · Hunt reviewer packet

The independent Hunt review packet is refreshed for exact CLI head
`8bea4be2fa18533eafd088122be769e942965626` and hosted self-scan
`37827269372`:

`docs/shipping/evidence/hunt-independent-review-packet-2026-10-09.md`

Owner/action: an AppSec/security reviewer who did not implement the Hunt
sandbox must independently run the Linux/Docker tests, record findings and
residual risks, choose `PASS`, `PASS WITH LIMITATIONS`, or `FAIL`, and return a
verifiable signed report. Codex may prepare the packet but cannot sign it.
Until that external artifact exists, `HUNT-011`, `QUAL-CLI-004`, and dependent
release rows remain open. No secret, customer source, or credential is needed
from chat for this action.

## Current superseding reconciliation · 2026-10-09 · Test Mode credential recheck

The current read-only Razorpay Test Mode plan and subscription inventory calls
using `.env.gates.testing` returned HTTP 401. No provider write was attempted.
The authorized Web/release operator must correct or rotate the isolated Test
Mode credential in the Razorpay dashboard, update only Preview/Test
configuration, and rerun bounded read-only inventory. Do not send the secret
in chat. Until that succeeds, real provider subscription authorization,
renewal, failure, expiry, refund, replay, and reconciliation evidence remains
open.

The invoice-only failed subscription path is now code-qualified in Preview by
Web `da45a97`, so no code action is waiting on the credential. Production
remains the existing fail-closed code-only rollout; no Production plan,
payment/provider, database/migration, entitlement, account, or customer-data
write occurred in this recheck. Score remains **219/61/280 (78.2%)**.
Evidence: `docs/shipping/evidence/plan-web-014-failed-subscription-invoice-binding-2026-10-09.md`.

## Current superseding reconciliation · 2026-10-09 · Test Mode and Production

The earlier note that the local Test Mode credential required rotation is
superseded. The pair in `.env.gates.testing` was accepted by Razorpay with
HTTP 200, so no rotation is required. Canonical Pro monthly and annual plans
were created in Test Mode and only their non-secret IDs were added to the
isolated Preview environment.

The Web code is now deployed to Preview and Production. Production is
aliased to `https://verglos.com`; its build and public `/` and `/checkout`
smokes passed. Production has not received Test Mode keys, Test Mode plan
IDs, or a Preview database URL. Recurring billing remains disabled in
Production until a separate live-mode configuration and activation preflight
is complete. No Production database, migration, payment, provider,
entitlement, account, or customer write occurred.

No founder input is needed for the current technical batch. The next
technical action is the authenticated isolated Preview/Test Mode subscription
lifecycle and provider/ledger/entitlement reconciliation. Genuine manual
inputs still required later are the independent AppSec reviewer, legal/company
approval, npm/CLI versus Web SCM scope decision, protected release approvals,
and authorized final POC/customer fixtures. Production billing or database
activation also requires the operation-specific backup, restore,
reconciliation, and rollback preflight; it is part of the goal, not omitted
from it. Never paste secrets or customer source into chat.

## Current superseding reconciliation · 2026-10-09

The current authoritative score is **219 checked / 61 unchecked / 280 total
(78.2%)**. `PLAN-WEB-013` is accepted. The separate Neon test database,
Preview isolation marker, Razorpay Test Mode webhook, and four-method catalog
are available; older entries below that describe Preview as having no isolated
database are historical and superseded.

No founder input is needed for the next code batch. The missing subscription-
creation route is an implementation gap already tracked by `PLAN-WEB-011`, not
a credential or reviewer blocker. The founder is needed later only for true
external artifacts: an independent AppSec reviewer, legal/company approval,
the npm/CLI versus Web SCM scope decision, and authorized final POC/customer
fixtures. Never paste secrets or customer source into chat.

Do not push publicly. This document enumerates remaining manual-input classes under Verglos V1 and names the specific owner action needed to unblock them. Reconciled 2026-10-07 after current CLI/Web head reconciliation, official CLI artifact validation, Razorpay Test Mode inventory freeze, and the latest private evidence commits. Older bullets below are superseded where this update marks an item accepted.

Per the goal file: "For every item left unchecked in the active area, state the specific unmet criterion and required evidence or owner. Do not describe a task as 'blocked' without naming the dependency and why it prevents work."

Nothing in this document is speculative. Every entry cites the exact acceptance criterion or dependency the item is waiting on.

## Current-state reconciliation · 2026-10-08

### Read-only browser refresh · 2026-10-09

The approved Chrome DevTools transport is reachable again. A separate
production checkout tab rendered UPI, Cards, Netbanking, Wallets, EMI, and Pay
Later with no console messages; desktop/mobile Lighthouse Accessibility and
Best Practices were 100/100. This updates the historical note that the browser
transport was unavailable, but it does not change the provider boundary:
production did not identify as Test Mode, and no order, payment, webhook,
entitlement, database, provider, deployment, or account write occurred.
`PLAN-WEB-011/012/013/014/015` and `QUAL-WEB-006` remain open. The missing
meta description and `llms.txt` H1 are held for the final truth/metadata pass.
Evidence: `docs/shipping/evidence/qual-web-006-plan-web-015-production-checkout-cdp-2026-10-09.md`.

The historical entries below retain the evidence that existed when they were
written. The following newer evidence supersedes any older statement that says
the production deployment still lacks the hosted-method configuration:

- The 2026-10-08 production smoke rendered the hosted UPI, Cards, Netbanking,
  Wallets, EMI, and Pay Later projection with HTTP 200 and no browser console
  errors. This confirms the current display/deployment boundary only; it does
  not qualify payment success, capture, refund, renewal, replay ordering,
  webhook delivery, entitlement issuance, or production reconciliation.
- `DIST-WEB-002` and `DIST-WEB-003` are already checked in the authoritative
  backlog. Their older unauthorized-Vercel/missing-variable notes below are
  historical evidence, not current open checklist items.
- `R-041` remains open until the exposed production database credential's
  rotation, Vercel secret refresh, old-credential revocation, and bounded
  read-only verification are independently evidenced. No production database
  write is authorized by this reconciliation.
- `PLAN-WEB-011/012/013/014/015` remain open because the live provider
  lifecycle and production reconciliation evidence is still missing. Further
  requests with the previously flagged Test Mode credential remain frozen.
- The local Web test environment now contains a Neon PostgreSQL value, but a
  bounded metadata/aggregate audit found 26 migration records, 2 users, 1
  license, 1 organization, and 4 Razorpay webhook-event rows. It is therefore
  not an empty isolated Preview database and must not be used for payment
  qualification. The raw value and Neon identifiers were not recorded or
  reused; see `test-database-isolation-audit-2026-10-08.md`.

## Blocker taxonomy

Every remaining item falls in one of these five buckets. Categorized this way so the founder can unblock a batch of items with a single decision or credential.

| Bucket | Manual input required | Items chained off it |
|---|---|---|
| **A · Production DB write** | Production `DATABASE_URL` with write privileges + explicit go/no-go on the writer's `--commit` run per `HOSTED_013_EXECUTION_RUNBOOK.md` | HOSTED-013, all PRO-*, QUAL-WEB-004, and every downstream that reads the tenant/project model |
| **B · Provider/cutover evidence** | Neon PostgreSQL is selected and OPS-001-014 are accepted. Remaining input is the production migration/cutover state needed by OPS-015 plus later measured workload/recovery evidence. | OPS-015, DIST-WEB-003, QUAL-WEB-003/004/005, PRO-005/009 and downstream Studio/Enterprise operations |
| **C · External Hunt content / independent review** | Authenticated, licensed evidence-backed recipe content plus approved supported-rule coverage; later independent isolation review | HUNT-008 through HUNT-011, QUAL-CLI-004 |
| **D · Legal review** | Approved licensing (Trivy / detect-secrets / scanner fixtures / premium rule packs) and third-party redistribution approval. LIC-005 DCO policy is accepted. | LIC-002, LIC-003, DIST-002, DIST-003, DIST-006 |
| **E · POC / commercial** | Authorized customer repositories, POC recruitment consent, paid-pilot authorization, external campaign go-ahead, npm publish / production deploy authorization | ACCEPT-001 through ACCEPT-010, FINAL-WEB-001 through FINAL-WEB-008, RECORD-010 (Phase-8 marketing embargo lift) |

Each unresolved class below points at its governing bucket. Resolving a bucket makes only the dependency-satisfied items in that class executable.

## HOSTED / PRO / QUAL-WEB stack — bucket A (production DB write)

- **HOSTED-013** — planner set, writer, reconciler, and runbook all shipped and merged. Unmet: founder runs `pnpm db:writer --commit` per `HOSTED_013_EXECUTION_RUNBOOK.md`, produces `reconciled` manifest, walks the restore drill on a Neon branch. Owner: founder.
- **PRO-001 through PRO-010** — all block on HOSTED-013's real production data being in the tenant/project model. No PRO-* item can produce its dashboard slice against an empty target-schema production DB.
- **PLAN-WEB-004** — server-side authorization service depends on real tenant data landing via HOSTED-013.
- **PLAN-WEB-005 through PLAN-WEB-010** — usage/allowance/seat/retention enforcement all require live tenant data + real quota measurements post-cutover.
- **QUAL-WEB-004** — migration/restore/disaster-recovery drill requires HOSTED-013 committed and OPS-014/015 selected (see bucket B).

## OPS / DIST-WEB stack — bucket B (provider/cutover evidence)

- **OPS-001 through OPS-014** — accepted. Neon PostgreSQL is the founder-authorized V1 durable queue; producer, advisory processing, matching/outbox, delivery, webhook, dedup, DLQ, retention, telemetry, health metrics, and backup/reconciliation code are merged.
- **OPS-015** — monitoring migration/cutover remains open on HOSTED-013 production data migration and an evidence-backed cutover/rollback run.
- **DIST-WEB-002** — code-side matrix remains complete at Web PR #49 head `b103d9e`; it remains open because the installed Vercel credential is unauthorized, so actual production variable names/scopes, provider-selector provisioning, and production deployment evidence cannot be verified.
- **DIST-WEB-003** — OPS-013/014 are accepted; this runbook now remains chained to DIST-WEB-002 production configuration/deployment evidence and an executable health/rollback rehearsal.
- **QUAL-WEB-003** — concurrency/idempotency load suite blocks on OPS/PLAN.
- **QUAL-WEB-005** — privacy/deletion/retention qualification blocks on OPS-011/012 + Studio/Enterprise foundations.
- **PLAN-WEB-007** — 80% warning behavior blocks on OPS-006.

## HUNT stack — bucket C (external content / independent review)

- **HUNT-002 through HUNT-007** — accepted where applicable (HUNT-001-007 are now all checked). The trust contract remains local/caller-supplied for pre-launch; planning, A1/A2 execution boundaries, redaction, and verdict classification are implemented and tested.
- **HUNT-008** — needs real evidence-backed supported-rule recipes with authenticated provenance/license and positive, negative, timeout, and failure fixtures. Synthetic catalog scaffolding alone cannot satisfy this criterion.
- **HUNT-009 through HUNT-011** — remain downstream of HUNT-008: functional command, MCP tools, and complete adversarial suite.
- **QUAL-CLI-004** — Hunt independent isolation evidence pack chains off HUNT-011 and requires independent security review.

## Licensing stack — bucket D (legal review)

- **LIC-002** — external engine/content license records need approved Trivy/detect-secrets/scanner-fixtures/premium-rule licenses, provenance, modification records, and trademark language. Owner/legal review is external.
- **LIC-003** — `THIRD_PARTY_NOTICES` generator exists (`9a1dad4`, `4435964`) but final artifact/legal qualification needs LIC-002.
- **LIC-005** — accepted at CLI PR #41 with DCO 1.1, inbound license, contribution licensing, trademark/security language, and CLA fallback documented.
- **DIST-002** — trusted npm publishing workflow chains off LIC-003/004 (final licensing before publish). Workflow code (`2f162d2`) exists preparatory.
- **DIST-003** — release artifact attestations/checksums generator (`e5e4e72`, `66312a4`, `d269e45`, `4435964`) is preparatory; needs LIC clearance for public release.
- **DIST-006** — rollback/revocation workflow chains off DIST-002 through DIST-005.
- **DIST-004 / DIST-005** — accepted; they are no longer blocker-inventory items.

## Team / Studio / Enterprise stack — bucket A + bucket B chain

- **TEAM-WEB-001 through TEAM-WEB-010, TEAM-CLI-001/002** — organization creation, RBAC, shared policy versioning, baseline/exception register, approval queue, GitHub/GitLab check integration, Jira/Linear work-item integration, portfolio views, organization signing workflow, and E2E authorization suite all block on TEAM-WEB-001 (which needs HOSTED-002 already checked + PLAN-WEB-009 which blocks on bucket A).
- **STUDIO-CLI-001, STUDIO-WEB-001 through STUDIO-WEB-010** — client workspace model, authorization/leakage suite, canonical branding projection, public verification publication controls, custom-domain verification, handoff receipt model, client portfolio dashboard, retention/export, billing/allowance flows, and E2E acceptance suite all block on STUDIO-WEB-001 (which needs HOSTED-002-007 + PLAN-WEB-010, blocking on bucket A) and RECORD-011 (already checked but STUDIO-CLI-001 also needs PLAN-CLI-001 → chain).
- **ENT-CLI-001, ENT-WEB-001 through ENT-WEB-008** — private runner protocol, SSO organization contract, SCIM lifecycle, runner enrollment/job API, KMS policy, deployment contract, audit export, residency/retention controls, and readiness suite. All chain off TEAM/ENGINE-HUNT-RECORD and bucket A.

## Plan chain — chained off HOSTED-002/003 (bucket A) and production signer key

### 2026-10-10 update

`PLAN-CLI-001` and `PLAN-CLI-002` are now checked. The current score is
**221 checked / 59 unchecked / 280 total (78.9%)**. `PLAN-CLI-002` evidence is
`docs/shipping/evidence/plan-cli-002-effective-capability-ux-2026-10-10.md`.

- **PLAN-WEB-003** — signed entitlement token vNext is operationally qualified against the provisioned successor signer and corrected CLI public pin (`7dcc74b`); the remaining downstream check is a real activation/token issue→verify integration trace, not another key-pin change.
- **PLAN-CLI-001** — capability/allowance consumption and bounded offline fallback are implemented (`7edb4a9`, corrected pin `ac74fb2`). The isolated Preview activation/token issue→verify integration trace is now recorded and the item is checked; Gate 4 remains separate.
- **PLAN-CLI-002** — effective-capability UX is checked after the current-plan/authority/stale/allowance/expiry reporting and complete local verification were recorded. See the dated evidence above.
- **PLAN-CLI-003** — modified/untrusted CLI test client blocks on PLAN-WEB-004-012 (bucket A + B chain).
- **PLAN-CLI-004** — plan/catalog contract fixtures block on PLAN-WEB-002/003 + PLAN-CLI-001.
- **PLAN-WEB-011 / PLAN-WEB-012** — code qualification is complete on Web PR #49 head `b103d9e`: catalog-only signed snapshots plus an immutable serialized lifecycle/refund ledger pass local and hosted verification. Acceptance remains blocked on an approved verified INR catalog price, production migration `0018` backup/restore/rollback qualification and application, accessible production configuration, and live Razorpay reconciliation. No production write is authorized by the code result.

## ACCEPT / FINAL-WEB stack — bucket E (POC + commercial)

- **ACCEPT-001** — frozen 10-20 repository/artifact corpus needs founder-authorized customer repositories with responsible-disclosure rules and non-public vulnerable fixtures. Explicitly needs Gate 0-5 pass first.
- **ACCEPT-002 through ACCEPT-010** — every ACCEPT item chains off ACCEPT-001. Includes automated stories, evidence bundles, external workflow protocol, authorized workflows, comprehension test, Hunt adjudication study, commercial acceptance/COGS, truth reconciliation, and GA release candidate freeze.
- **FINAL-WEB-001 through FINAL-WEB-008** — every public marketing copy/pricing/docs/proof-asset/accessibility/claim-sweep item blocks on ACCEPT-009/010 + explicit founder command. Under the goal file's Phase-8 marketing embargo until every prior gate passes.
- **RECORD-010** — legacy `attest` compatibility. Progress commits `077b008` + `e58dbd8` merged. Unmet: Phase-8 correction of `/verify` marketing index. Blocks on same embargo as FINAL-WEB.

## Miscellaneous — bucket A (production DB) or already-partial

- **QUAL-CLI-006** — dependency-ready now that IMPORT exports, RECORD-002/009/011/012, and DIST-004/005 are accepted. CLI PR #47 (`af3aa09`) fixes SPDX generator defects and records official SARIF/CycloneDX/SPDX validation evidence; acceptance still needs official in-toto/Sigstore validation plus supported-platform install/upgrade/rollback evidence. The item remains unchecked while PR #47 hosted matrix/self-scan checks are pending and those remaining evidence classes are absent.
- No independent DIST-005 action remains; it is accepted. The next Hunt item is HUNT-008 and is blocked on the concrete content/provenance evidence stated above.

## Founder-checklist items (explicitly external — bucket A/B/D/E)

These lines in the backlog are explicit founder-decision items, not agent tasks:

- Confirm final plan hypotheses after evidence (Team $99 vs bounded founding cohort; Studio $249 vs bounded founding cohort). [E]
- Neon PostgreSQL queue selection is complete for pre-launch; supply later production cutover/recovery evidence for OPS-015. [B]
- Obtain legal review for premium content license, contributor terms, trademarks, privacy, terms, and enterprise obligations. [D]
- Approve any external engine/fixture redistribution with unresolved license or NOTICE status. [D]
- Approve networked Hunt recipe exceptions individually; default remains no network. [C]
- Arrange independent Hunt isolation/security review. [C]
- Supply authorized customer fixtures/repositories and consent for external acceptance. [E]
- Authorize external conversations, paid pilots, checkout tests, campaign, publish, deploy, npm release, tags, pushes, and production migrations separately. [E]
- Do not claim Team/Studio/Enterprise generally available until their end-to-end gates pass. [E — persistent constraint]

## What CAN still be shipped without founder input

The current CLI and Web implementation heads have no open phase PR requiring local merge work. QUAL-CLI-006's current-head supporting run now has official in-toto, CycloneDX, and SPDX evidence plus Node 22/platform evidence; it remains unchecked because trusted keyless identity, legal/license clearance, independent review, and release approval are not proven. PLAN-WEB-014 is frozen at the provider boundary until the flagged Test Mode credential is rotated/repaired; no further provider calls should use it. DIST-WEB-002/003, PLAN-WEB-015, HOSTED-013, OPS-015, and the downstream PRO/Team/Studio/Enterprise runtime items remain production/cutover-gated. HUNT-008/009/010/011 and QUAL-CLI-004 remain content/provenance/independent-review-gated. POC, legal, publication, and marketing remain external gates.

The next three independent batches are therefore:

1. **R-041 / production safety:** founder rotates the exposed production database credential, refreshes the Vercel production secret, redeploys, revokes the old credential, and provides bounded read-only verification before any production DB operation.
2. **PLAN-WEB-014/015:** after Test Mode credential rotation, establish the account-enabled method set and capture the private lifecycle matrix; only then reconcile production configuration. No guessed method list or QR-only fallback is acceptable.
3. **GITHUB-WEB-004 / external qualification:** authorized App/org installation and bounded install/webhook/check/uninstall/recovery evidence, or the next legal/trusted-publishing review batch if that authorization is not available.

## Recommended founder action order (to unblock the largest chunk fastest)

1. **Bucket A (production DB write)** — one hour of founder time to run the writer + reconciler + restore drill. Unblocks HOSTED-013 + ~30 downstream items (all PRO-*, PLAN-WEB-004+, TEAM/STUDIO/ENT foundations).
2. **Bucket D (legal review)** — clear LIC-002 external-content/redistribution licensing. LIC-005 is already accepted; remaining clearance unblocks DIST-002/003/006.
3. **Bucket C (Hunt external content)** — supply authenticated/licensed evidence-backed recipes and supported-rule evidence. Unblocks HUNT-008-011 + QUAL-CLI-004.
4. **Bucket B (cutover evidence)** — after HOSTED-013, run monitoring migration/cutover and recovery evidence for OPS-015 and downstream operations.
5. **Bucket E (POC + commercial)** — happens last per the goal file's phase ordering. Everything else must be gate-passed first.

Every currently identified acceptance blocker at 2026-09-20 names its required external evidence or owner above; completed provider, DCO, compatibility, and early Hunt items are no longer treated as blockers.
