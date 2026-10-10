# Verglos V1 Active Shipping Goal — Whole-Backlog, Preview, and Production Shipping

Effective checkpoint: 2026-10-10. This file is the authoritative replacement
goal for the remaining shipping work. Replace the previous active goal with
this complete version before resuming.

## Current checkpoint · 2026-10-10

This is the complete replacement goal for the current shipping run. The
authoritative private backlog currently recomputes to **223 checked / 57
unchecked / 280 total (79.6%)**. This number must be recomputed from the live
backlog after every substantial batch; no goal-file edit, deployment, browser
click, configuration change, or test run closes a checkbox by itself.

### 2026-10-10 · PLAN-WEB-014 provider-state recheck

The current Razorpay Test Mode subscription inventory was rechecked read-only:
42 rows total, 5 active, 15 awaiting authorization, 22 cancelled, 0 due for
charge, and 0 tokenized cards. No provider, payment, webhook, database,
entitlement, account, or Production write occurred. This confirms rather than
weakens the existing recurring-card blocker. `PLAN-WEB-014` and Gate 4 remain
open and parked with the recorded owner, unblock artifact, review date, and
Cards-only fail-closed release decision. The score remains **223/57/280
(79.6%)**.

Evidence:
`docs/shipping/evidence/plan-web-014-testmode-renewal-qualification-recheck-2026-10-10.md`.

### 2026-10-10 · TEAM-CLI-001 hosted activation recheck

Shared organization-policy tests passed **3/3**, CLI cache/fetch tests passed
**4/4**, and shared/CLI typechecks passed. A Vercel environment-name audit
found no organization-policy signer/trust-root activation in Preview or
Production; no values were revealed or changed. `TEAM-CLI-001` remains
unchecked pending hosted signer/trust-root activation, policy-row
reconciliation, and a live tenant/repository-bound fetch. The existing
`STUDIO-CLI-001` custody block is assessed next, followed by `LIC-002`. Score
remains **223/57/280 (79.6%)**.

Evidence:
`docs/shipping/evidence/team-cli-001-hosted-activation-recheck-2026-10-10.md`.

### 2026-10-10 · QUAL-CLI-006 current private-source qualification

The current private source completed `pnpm exec turbo run test typecheck
build --force` with **23/23 tasks successful**, zero failures, and zero cached
tasks. This is current-source regression/build evidence only. Trusted keyless
signing, protected publication/attestation, legal clearance, independent
release review, and protected-pipeline consumer evidence remain open, so
`QUAL-CLI-006` stays unchecked. The next independent assessment is
`QUAL-WEB-006`. Score remains **223/57/280 (79.6%)**.

Evidence:
`docs/shipping/evidence/qual-cli-006-current-private-run-2026-10-10.md`.

### 2026-10-10 · PLAN-CLI-001 revalidation and queue correction

`PLAN-CLI-001` is already checked in the authoritative backlog. The current
Web Preview deployment `dpl_553h93xmbKWFAPKSdr8t3679reU7`, isolated Neon Test
database, and Preview isolation marker were rechecked with an existing mapped
active Pro fixture. The deployed v2 route returned HTTP 200 at catalog
`2026-10-02.0`; the current CLI verifier accepted the pinned signature,
`schemaVersion=2`, owner/tenant scope, 21 capabilities, and bounded
allowances. This rerun changes no checkbox and does not close Gate 4.

The queue must not select `PLAN-CLI-001` again. `HUNT-008` and `PLAN-WEB-012`
remain parked on their recorded external provenance/provider artifacts;
`PLAN-CLI-003` and `PRO-008` remain dependency-bound to the open lifecycle
work. The next dependency-ready assessment is `TEAM-CLI-001`, whose code is
implemented but whose hosted signer/trust-root activation, policy-row
reconciliation, and live tenant/repository-bound fetch are still required.
The live score remains **223/57/280 (79.6%)**.

Evidence:
`docs/shipping/evidence/plan-cli-001-preview-v2-issue-verify-rerun-2026-10-10.md`.

### 2026-10-10 · PLAN-WEB-012 local lifecycle update

A disposable local PostgreSQL 15 `verglos_test` container initialized the
reviewed migrations and was removed after the payment-webhook integration
passed **5/5** with 0 failures: capture/replay/refund, failed order, failed
subscription invoice, paid invoice exactly-once, and expiry. The remote Neon
test URL was rejected by the local-isolation guard and was not used.

This proves only the application/database substrate. Provider-generated
renewal, failure/expiry, refund/replay/order, timeout/retry, and complete
signed reconciliation remain open, so `PLAN-WEB-012` stays unchecked and
parked. The score remains **223/57/280 (79.6%)**; the next selection must be a
dependency-ready item after this provider gate.

Evidence:
`docs/shipping/evidence/plan-web-012-local-lifecycle-pass-provider-block-2026-10-10.md`.

### 2026-10-10 · HUNT-008 qualification update

The current Hunt package build and tests passed **45 executable tests**, with
**16 explicit Docker integration skips** and 0 failures. This qualifies the
fixed A1 catalog and bounded local runner contracts only. Trusted/licensed
recipe provenance, supported-rule approval wiring, and independent AppSec
review remain missing, so `HUNT-008` stays unchecked and parked. HUNT-009–011
remain downstream or separately gated; the next dependency-ready item by
strict backlog order is `PLAN-WEB-012`. The score remains **223/57/280
(79.6%)**.

Evidence:
`docs/shipping/evidence/hunt-008-requalification-block-2026-10-10.md`.

### 2026-10-10 · ACCEPT-002 substrate verification update

The exact private acceptance verifier now passes against the pinned current
checkouts: CLI **241/241**, Web **921/951** with 30 explicit
environment-gated skips, and composed Studio/Enterprise/Team/quality
substrates **74/74**. A stale ignored workspace dependency link was repaired
before rerunning; no tracked source, provider, database, entitlement,
customer, or Production state changed.

This does not close `ACCEPT-002`: the verifier explicitly remains
substrate/regression evidence only. Hosted/provider lifecycle, modified-CLI
runtime, Studio recipient, Enterprise runner, human browser/field-CWV,
account-deletion, consent, and independent-review evidence remain open. Keep
the checkbox open, park the item, and assess the earlier Hunt items next by
strict top-to-bottom backlog order. The score remains **223/57/280 (79.6%)**.

Evidence:
`docs/shipping/evidence/accept-002-substrate-pass-external-block-2026-10-10.md`.

### 2026-10-10 · TEAM-CLI-001 implementation progress

The current CLI branch now contains the signed organization-policy envelope,
bounded atomic cache, authenticated fetch, and `verglos policy organization
fetch` command. Shared policy tests pass 3/3, CLI cache/fetch tests pass 4/4,
and shared/CLI typecheck plus CLI build pass. This is implementation progress,
not acceptance: `TEAM-CLI-001` remains unchecked and is parked until
production signer/trust-root activation, hosted policy-row reconciliation, and
a live tenant/repository-bound fetch are evidenced. The strict queue now
selects `STUDIO-CLI-001` for assessment. No extra input is required from the
founder for this code batch, and the supplied gate-test environment is not used
as Production evidence.

Evidence:
`docs/shipping/evidence/team-cli-001-policy-client-2026-10-10.md`.

### 2026-10-10 · `PLAN-WEB-014` provider retry block

The current isolated Preview/Test Mode recurring-card retry reached the
provider card-tokenization/OTP boundary and ended in a provider terminal-state
failure. Three exact recent Test Mode subscriptions were cancelled and a
read-only provider query found zero payments for them. No Production payment,
database, entitlement, account, organization, or customer-data write occurred.
At that checkpoint, `PLAN-WEB-014` was the sole active item, unchecked and
genuinely blocked on a provider-supported recurring-card fixture or
provider-side renewal/delivery control. It is now parked under the queue rule
below; it remains unchecked. Owner: Verglos founder/provider support. Unblock
artifact: the provider fixture/control plus signed webhook evidence. Review:
2026-10-11 IST. Evidence:
`docs/shipping/evidence/plan-web-014-preview-recurring-card-retry-boundary-2026-10-10.md`.

### 2026-10-10 · Production schema migration evidence

The bounded Production schema operation created a pre-write backup, applied
the pending reviewed migrations through the protected environment runner, and
verified **39/39** migrations with zero missing declared tables. The migration
audit was corrected to use Drizzle application order because journal
timestamps are non-monotonic after branch merges. Production `/`, `/checkout`,
and `/docs` returned 200 afterward; no payment, entitlement, account,
organization, customer-data, or backfill write occurred. This is supporting
evidence only. The Gate 4 payment qualification workstream remains open.
Evidence:
`docs/shipping/evidence/production-migration-2026-10-10.md`.

### 2026-10-10 · current Preview webhook configuration

Razorpay Test Mode now reports an enabled webhook for the current READY
Preview deployment. Its secret is present and 20 application lifecycle events
are active. The historical webhook targets were left untouched. A protected
GET to the current Preview webhook route returned the expected HTTP 405 for
the POST-only signed endpoint. No provider event or application write was
generated. Evidence:
`docs/shipping/evidence/plan-web-014-current-preview-webhook-configuration-2026-10-10.md`.

This completes webhook configuration only; `PLAN-WEB-014`, Gate 4, and the
score remain open at **219 checked / 61 unchecked / 280 total (78.2%)** until
provider lifecycle and entitlement reconciliation evidence exists.

### 2026-10-10 · current protected Preview browser revalidation

The current READY Preview deployment for Web `445d8ed` was opened through the
existing authenticated Chrome DevTools session with Vercel protection left
enabled. The browser-rendered checkout showed Razorpay Test Mode, the
canonical Pro offer, and exactly one hosted method: Cards. No UPI/QR,
Netbanking, Wallet, EMI, Pay Later, or eMandate label was present. The older
four-method page was confirmed to be a stale webhook target, not the current
deployment. Evidence:
`docs/shipping/evidence/plan-web-014-current-preview-browser-acceptance-2026-10-10.md`.

The disposable Docker PostgreSQL run passed the payment webhook integration
suite **5/5** and the combined route/webhook/lifecycle suite **33/33**. This
supports code-side replay/idempotency, refund, failure, invoice, expiry,
lifecycle, and retry behavior. It does not replace provider-generated renewal
or provider replay/out-of-order evidence. `PLAN-WEB-014`, Gate 4, and the
score remain open at **219 checked / 61 unchecked / 280 total (78.2%)**.

At this historical Preview checkpoint, `PLAN-WEB-014` was the only
implementation and acceptance workstream. Its complete blocked record is now
committed, so it remains parked without being checked and the first
dependency-ready unchecked item has been selected by scanning the backlog from
the top. The current active item is `PLAN-CLI-001`; it was selected because it
is dependency-ready, not merely because it is easier. The next item is never
selected merely because it is easier.
All work on the CLI, Web application, Preview, Production, payment provider,
browser, Docker, and private tracker must either implement, unblock, qualify,
or document evidence for this active item.

The current release-candidate payment decision is **Cards-only**. The
deployed method configuration is `card` in Preview and Production; UPI/QR,
netbanking, wallet, EMI, Pay Later, eMandate, and other methods are not
claimed until separately qualified. Cards-only is a product-scope decision,
not payment acceptance: one canonical-price Razorpay Test Mode recurring-card
authorization/capture and its first payment-to-license reconciliation are now
evidenced in isolated Preview. The remaining requirement is the complete
lifecycle matrix and final hosted Preview acceptance.

The current Web head is commit `445d8ed` on `feat/preview-test-auth`. It
keeps the isolated Preview fixture-auth seam available outside an explicit
Production runtime while requiring the explicit auth-enabled and isolated-
database markers, and it constrains the hosted Razorpay display configuration
to the declared Cards-only catalog instead of allowing provider defaults to
reopen unqualified methods. The latest Preview hosted-display deployment
`dpl_Es8QZoQr7H7sYRzhKMTqVnzMfnB5` was READY. The latest protected Preview
route-check deployment is `dpl_36zQf2zEsVCrxpic8rcrjFJbQbK7`; its checkout
route returned HTTP 200 with `testMode:true`, catalog version `2026-10-02.0`,
and the server-declared method set `card` only. The current Production code
rollout `dpl_9tXipBQD1CmYK8EpmMLCBPrgh3zw` is READY and aliased to
`https://verglos.com`; its public checkout is configured for Cards only. These
are fail-closed code/configuration and isolated-route checks only: they did not
create a Production payment, subscription, database row, migration,
entitlement, account, or customer-data mutation. Preview branch
requalification remains a separate step and must use the isolated database,
Test Mode provider configuration, and private fixture evidence.

The current gate state is: Gates 1–3 are complete for isolated
qualification; Gate 4 is materially qualified but remains open until the
remaining Cards-only lifecycle matrix and final hosted reconciliation are
evidenced;
Gates 5–9 remain open or external as described in Section 4. No production
billing or database activation is implied by this checkpoint.

### 2026-10-10 · strict execution lock and latest Preview boundary

The founder has explicitly authorized controlled write operations, including
bounded Production work, for this shipping goal. That authorization does not
turn incomplete evidence into acceptance and does not permit unbounded data
mutation, credential disclosure, test/Production mixing, or real-money
charging. Every write must still have an exact target, dry-run result, mode
check, backup/restore plan when data can change, reconciliation, rollback or
forward-fix, and post-write verification.

The execution queue is strict:

1. Keep exactly one active backlog ID. `PLAN-CLI-001`, `PLAN-CLI-002`,
   `PLAN-CLI-004`, and `PLAN-WEB-011` are now checked. `PLAN-WEB-012` is
   parked pending provider lifecycle artifacts; `TEAM-CLI-001` is now parked
   pending hosted signer/fetch activation, and the current dependency-ready ID
   is `ACCEPT-002`; `STUDIO-CLI-001` is parked pending hosted custody and
   recipient acceptance, `LIC-002` is parked pending legal approval, and
   `QUAL-CLI-006` is parked pending trusted release identity/publication, and
   `QUAL-WEB-006` is parked pending complete hosted matrix evidence;
   `PLAN-WEB-014` and `HUNT-008` remain parked and unchecked.
2. Finish or genuinely document the active ID's remaining acceptance work. If
   it is genuinely blocked, commit the complete blocked record, park it
   unchecked, and select the first dependency-ready unchecked item from the
   top of the backlog. This is a queue transition, not acceptance. After the
   current `PLAN-CLI-001` revalidation, the next dependency-ready assessment
   is `TEAM-CLI-001`; do not count its local implementation as hosted
   acceptance until the signer/trust-root and live fetch artifacts exist.
3. Recompute the live score from `docs/shipping/VERGLOS_V1_BACKLOG.md` after
   each substantial batch. Only complete acceptance evidence may change a
   checkbox; code, deployment, browser clicks, configuration, or a partial
   provider observation never changes it by itself.
4. After the active ID is accepted—or after a complete blocked record is
   committed—update the backlog, execution ledger, evidence index,
   status/showcase records, and score in one traceable batch. If blocked, keep
   the checkbox open and select the first dependency-ready ID by top-to-bottom
   backlog order; do not skip an earlier parked item silently.
5. If an external provider, reviewer, legal approval, customer fixture, or
   Production credential is genuinely missing, record the exact owner,
   artifact, expiry/review date, and next unblock action while keeping the
   checkbox open. Do not silently skip the item or claim a lower-environment
   result as Production evidence.

### 2026-10-10 execution update · PLAN-CLI-002 accepted and queue advanced

`PLAN-CLI-002` is checked at **221 checked / 59 unchecked / 280 total
(78.9%)**. The CLI now reports effective plan, authority source,
stale/offline-grace state, opaque capability count, catalog version, bounded
allowances, and verified-token expiry through `whoami` in human and
machine-safe output. The exact local verification and hosted-evidence
boundary are recorded in
`docs/shipping/evidence/plan-cli-002-effective-capability-ux-2026-10-10.md`.

The queue now returns to the first dependency-ready Web item,
`PLAN-WEB-011`, whose implementation is present but whose whole acceptance
still requires signed provider delivery and payment reconciliation. The
earlier `HUNT-008` item remains parked because trusted/licensed recipe
provenance and a real independent AppSec review cannot be manufactured by
local code or by this agent. No Production write is implied by this queue
transition; controlled writes remain bounded by the preflight, backup,
reconciliation, and rollback rules above.

### 2026-10-10 execution update · PLAN-WEB-011 accepted

`PLAN-WEB-011` is checked at **222 checked / 58 unchecked / 280 total
(79.3%)**. The isolated Preview/Test Mode trace proves the server-catalog
Pro/monthly INR offer, exact amount/currency binding, signed provider events,
active subscription, captured payment, and linked active license. This closes
the catalog/amount item only; Production billing remains fail-closed under
`PLAN-WEB-015`, and full lifecycle work is now active under `PLAN-WEB-012`.
Evidence:
`docs/shipping/evidence/plan-web-011-canonical-amount-binding-accepted-2026-10-10.md`.

### 2026-10-10 execution update · PLAN-WEB-012 parked, PLAN-CLI-004 accepted

`PLAN-WEB-012` remains unchecked because provider-generated renewal,
failure/expiry, replay/out-of-order, timeout/retry, and exactly-once lifecycle
evidence are still missing; local or synthetic webhook fixtures cannot replace
that artifact. The next dependency-ready independent track was `TEAM-CLI-001`;
its implementation is complete but hosted activation is parked. The next
dependency-ready item is `STUDIO-CLI-001`. `PLAN-CLI-004` is checked at **223 checked / 57 unchecked /
280 total (79.6%)** after compatibility fixtures, legacy activation fallback,
hosted matrix evidence, and the current v2 issue→verify trace were reconciled.
R-041 and protected release activation remain external gates.
Evidence:
`docs/shipping/evidence/plan-cli-004-compatibility-accepted-2026-10-10.md`.

### 2026-10-10 execution update · TEAM-CLI-001 parked, Studio selected

The signed organization-policy client, cache, fetch command, and local tests
are complete. Acceptance remains blocked by production signer/trust-root
activation, hosted policy-row reconciliation, and live tenant/repository fetch
evidence. The item remains unchecked. The queue therefore advances to
`STUDIO-CLI-001`, whose exact-preview projection is already implemented but
still needs hosted upload/custody, independent redaction proof, and Studio
recipient/customer acceptance. The next dependency-ready item is now
`LIC-002`, which is an external legal/release evidence track.

Evidence:
`docs/shipping/evidence/team-cli-001-hosted-activation-block-2026-10-10.md`.

### 2026-10-10 execution update · STUDIO-CLI-001 parked, LIC-002 selected

The exact redacted Studio client projection and approval-bound preview are
implemented and locally qualified. Hosted upload/custody, independent
redaction proof, and an authorized Studio recipient/customer run remain
missing, so `STUDIO-CLI-001` stays unchecked. The strict queue now selects
`LIC-002`, the next dependency-ready item by backlog order.

Evidence:
`docs/shipping/evidence/studio-cli-001-hosted-custody-block-2026-10-10.md`.

### 2026-10-10 execution update · LIC-002 parked, QUAL-CLI-006 selected

The technical license/notice inventory is reproducible and its local checks
pass, but no legal reviewer approval exists for the exact release candidate.
`LIC-002` remains unchecked. The queue now selects `QUAL-CLI-006`, whose
official validation and clean-consumer evidence must still be reconciled with
legal, trusted-publishing, and independent-review gates.

Evidence:
`docs/shipping/evidence/lic-002-legal-approval-block-2026-10-10.md`.

### 2026-10-10 execution update · QUAL-CLI-006 parked, QUAL-WEB-006 selected

The official CLI format, package, in-toto, standards, and consumer-transition
evidence is complete, but trusted keyless release identity, protected
publication, legal clearance, independent review, and final protected-pipeline
consumer evidence are missing. `QUAL-CLI-006` remains unchecked. The queue now
selects `QUAL-WEB-006` for a read-only authenticated Chrome qualification.

Evidence:
`docs/shipping/evidence/qual-cli-006-release-trust-block-2026-10-10.md`.

### 2026-10-10 execution update · QUAL-WEB-006 parked, ACCEPT-002 selected

The authenticated desktop account page passed a read-only accessibility
snapshot and desktop Lighthouse Accessibility/Best Practices/SEO checks, but
the CLS trace was invalidated because its culprit tree named YouTube nodes.
Mobile, keyboard, human screen-reader, large-data, field-CWV, and complete
authenticated-route evidence remain missing. `QUAL-WEB-006` stays unchecked;
the queue now selects `ACCEPT-002`.

Evidence:
`docs/shipping/evidence/qual-web-006-qualification-block-2026-10-10.md`.

### 2026-10-10 execution amendment · blocked-item queue rule

The current `PLAN-WEB-014` provider block is recorded with its owner, missing
artifact, review date, cleanup evidence, and release decision. It is not
checked. No new secret or credential is required from the founder for the next
execution turn; the only missing external artifact currently identified is a
provider-supported recurring-card/renewal fixture with signed webhook
evidence.

After the blocked record is committed, the next scan starts at the top of the
live backlog. `HUNT-008` is the first unchecked ID; its trusted/licensed
provenance and independent-qualification requirements must be assessed and
recorded before selecting a later ID. If those requirements are externally
blocked, park `HUNT-008` with the same owner/artifact/date/release record, then
assess the next dependency-ready candidate, currently `PLAN-CLI-001`. A
blocked item is never checked, and parking one never improves the score.

The first unchecked queue item, `HUNT-008`, has now been audited and parked
unchecked because its authenticated/licensed recipe provenance, approval
wiring qualification, and independent AppSec qualification are missing. The
single active item is now `PLAN-CLI-001`; its next action is a bounded
deployed v2 entitlement-token issue→verify trace for an authorized tenant.
This queue transition does not close either item or change the score. Evidence:
`docs/shipping/evidence/top-backlog-queue-transition-2026-10-10.md`.

The first active-item implementation pass for `PLAN-CLI-001` is complete:
Web `ecc32f2` deployed the v2 entitlement-token route behind a middleware fix,
the focused entitlement tests passed 7/7, and the Production route now
returns its intended fail-closed 401/404 responses. The item remains
unchecked because no authorized paid-tenant issue→verify trace has been
captured yet. The next action remains the bounded activation preflight and
hosted trace; no fake key, anonymous Free response, or direct entitlement
write may be used as acceptance. Evidence:
`docs/shipping/evidence/plan-cli-001-production-v2-route-rollout-2026-10-10.md`.

The latest controlled Preview run created and then cancelled two isolated
Test Mode recurring-card fixtures. The provider stopped both at card
tokenization/mandate authorization: no captured payment or license grant was
produced, and the owner-bound status route reconciled both rows as cancelled.
This boundary is recorded in
`docs/shipping/evidence/plan-web-014-preview-recurring-card-boundary-2026-10-10.md`.
It strengthens Gate 4 evidence but does not close `PLAN-WEB-014`.

### 2026-10-10 · isolated Preview/Test Mode full-refund reconciliation

A read-only preflight matched the authenticated Razorpay Test Mode payment
detail to one isolated captured canonical Pro/monthly card payment with an
active subscription and active Pro license. A provider-dashboard full Test
Mode refund completed for that exact payment. The isolated Preview webhook
store completed two distinct signed events, `refund.created` and
`refund.processed`; the payment projected to `refunded` with the full
refund watermark and the linked Pro license became inactive. The application
subscription remained `active` at observation time, so provider
cancellation/expiry after refund is still open and is not inferred from the
refund. No manual database, payment, subscription, license, or entitlement
edit occurred. Evidence:
`docs/shipping/evidence/plan-web-014-preview-official-subscription-card-full-refund-2026-10-10.md`.

This is Gate 4 progress only. `PLAN-WEB-014` remains the sole active item and
the score remains **219 checked / 61 unchecked / 280 total (78.2%)** because
renewal/expiry, refund replay/order and out-of-order, timeout/retry,
exactly-once reconciliation, and final hosted Preview acceptance remain
unqualified.

### 2026-10-10 · isolated Preview/Test Mode cancellation after full refund

After the full-refund observation, a read-only join found exactly one active
application subscription linked to the refunded canonical Pro/monthly card
payment and inactive Pro license. The exact Razorpay Test Mode subscription
was cancelled immediately through the documented provider endpoint and
returned HTTP 200 with status `cancelled`. The isolated Preview webhook store
completed one distinct signed `subscription.cancelled` event; the
application subscription projected `active → cancelled`, while the payment
remained fully `refunded` and the license remained inactive. No manual row
edit occurred. Evidence:
`docs/shipping/evidence/plan-web-014-preview-subscription-cancellation-after-refund-2026-10-10.md`.

This is Gate 4 progress only. `PLAN-WEB-014` remains open and the score
remains **219 checked / 61 unchecked / 280 total (78.2%)** because
renewal/expiry, refund replay/order and out-of-order, timeout/retry,
exactly-once reconciliation, and final hosted Preview acceptance remain
unqualified.

### 2026-10-10 · local Docker webhook regression support

The Web payment webhook suite ran against disposable local PostgreSQL 15
after its localhost-only isolation guard correctly refused the Neon URL:
database-backed integration tests passed **5/5**, and focused route/webhook
tests passed **28/28**. This supports replay/idempotency, monotonic refund,
failure/no-grant, invoice binding, expiry projection, lifecycle ordering, and
retry semantics at code level. It does not replace provider-delivered
renewal, provider replay/out-of-order, or hosted Preview acceptance. Evidence:
`docs/shipping/evidence/plan-web-014-local-docker-webhook-regression-2026-10-10.md`.

### 2026-10-10 · provider renewal schedule recheck

The authenticated Razorpay Test Mode subscription inventory returned HTTP 200
with five active subscriptions. Four have one paid cycle and the earliest
next charge is 9 November 2026; one has two paid cycles and a later January
2027 charge. No active subscription can produce a renewal during this run,
and the provider exposes no supported immediate charge or renewal-replay
control for them. No provider update or payment operation was submitted.
This is a read-only provider boundary, not Gate 4 acceptance. Evidence:
`docs/shipping/evidence/plan-web-014-provider-renewal-schedule-recheck-2026-10-10.md`.

### 2026-10-10 · provider webhook replay-control boundary

The authenticated Razorpay Test Mode Webhooks surface was reloaded through
Chrome DevTools. It exposed webhook configuration and active-event settings,
but no delivery history, delivery identifier, retry, replay, or out-of-order
scheduling control. No configuration was changed and no event was replayed or
synthetically posted. The Docker replay tests remain code-side only. Evidence:
`docs/shipping/evidence/plan-web-014-provider-webhook-replay-control-boundary-2026-10-10.md`.

This keeps `PLAN-WEB-014` and Gate 4 open; the provider replay/out-of-order
case needs a supported provider fixture or real provider retry evidence.

### 2026-10-10 · current Preview Cards-only revalidation

The current READY Preview deployment for Web `445d8ed` was inspected with
Vercel CLI. Its `/checkout` route returned HTTP 200 with canonical catalog
`2026-10-02.0`, exactly `paymentMethods: [{id: "card", label: "Cards"}]`,
`testMode: true`, and `subscriptionEnabled: true`. The Preview environment
listing showed the isolated-database marker, Preview `DATABASE_URL`, Razorpay
Test Mode configuration, webhook secret, and Cards-only method configuration
without revealing values. Direct browser navigation without the Vercel
protection bypass redirected to Vercel login, so this is server/configuration
evidence only and not final hosted browser acceptance. Evidence:
`docs/shipping/evidence/plan-web-014-current-preview-cards-only-revalidation-2026-10-10.md`.

### 2026-10-10 · Production Cards-only revalidation superseding stale-tab observation

Fresh public and browser checks returned HTTP 200 and confirmed the current
Production checkout configuration is Cards-only: the server-rendered payload
reported `paymentMethods: [{id: "card", label: "Cards"}]`, `testMode: false`,
and `subscriptionEnabled: false`; forced reload of both existing Chrome
Production tabs showed no UPI/QR, Netbanking, Wallet, EMI, Pay Later, or
eMandate labels. The earlier extra-label observation was stale browser state.
This remains read-only configuration evidence and does not qualify
Production payment acceptance. Evidence:
`docs/shipping/evidence/plan-web-014-production-cards-only-revalidation-2026-10-10.md`.

### 2026-10-10 · official subscription-card capture superseding checkpoint

The official Razorpay Test Mode subscription-card fixture completed one
canonical Pro/monthly authorization and capture for an isolated Preview-created
subscription. Five distinct signed webhook events completed:
`payment.authorized`, `payment.captured`, `subscription.authenticated`,
`subscription.activated`, and `subscription.charged`. Redacted read-only
joins matched the captured payment to the active subscription and active Pro
license with the same canonical INR amount/currency and tenant/user binding.
This proves the first payment-to-ledger-to-license chain in the isolated
environment; it does not prove provider-generated renewal, failure/expiry,
refund replay/order, out-of-order delivery, timeout/retry, or final hosted
Preview acceptance. Evidence:
`docs/shipping/evidence/plan-web-014-preview-official-subscription-card-success-2026-10-10.md`.

### 2026-10-10 · official subscription-card failure superseding checkpoint

The official Razorpay Test Mode subscription-card failure fixture was run
against a canonical Pro/monthly subscription created through isolated
Preview. A signed `payment.failed` webhook completed, one failed payment row
was recorded without a `license_id`, and the active-license count remained
unchanged at three. The hosted provider UI stopped at its Test Mode
OTP/tokenization boundary; no OTP was guessed or entered. This proves one
hosted failure/no-grant projection, but not provider-generated renewal,
expiry, refund replay/order, out-of-order delivery, timeout/retry, or final
hosted Preview acceptance. Evidence:
`docs/shipping/evidence/plan-web-014-preview-official-subscription-card-failure-2026-10-10.md`.

### 2026-10-10 signed Test Mode webhook ingress boundary

The Vercel platform protection boundary was repaired for one Test Mode
Preview webhook target using a fresh automation-bypass value kept out of
source, logs, and evidence. A provider subscription with prior paid cycles
was paused and resumed in Razorpay Test Mode. Both provider operations
returned HTTP 200; the isolated Preview endpoint completed signed
`subscription.paused` and `subscription.resumed` events and projected the
matched row `active → paused → active`. No payment, license, entitlement,
account, manual database, or Production state changed.

This is new Gate 4 progress, not payment acceptance. Provider-generated
renewal/payment capture, failure/expiry, subscription refund,
replay/out-of-order, timeout/retry, exactly-once payment/ledger/license, and
complete tenant reconciliation remain open. Evidence:
`docs/shipping/evidence/plan-web-014-testmode-webhook-ingress-pause-resume-2026-10-10.md`.

For every successful payment acceptance, private evidence must show the full
chain: server-selected canonical catalog and amount, provider authorization
or capture, valid signed webhook, one payment row, one ledger row, correct
user/tenant/organization binding, one entitlement/license, correct access,
replay idempotency, and correct failure/cancellation/refund/renewal/expiry
transitions. Provider IDs, secrets, database URLs, cookies, authorization
headers, personal data, and raw payment payloads must be redacted. Direct
entitlement edits, founder-email shortcuts, screenshots, synthetic provider
events, and green local tests are not substitutes.

Production remains explicitly in scope for the complete objective. Every
Production pass must distinguish read-only audit, fail-closed code rollout,
configuration activation, state-changing payment/database/entitlement work,
post-write reconciliation, monitoring, and rollback/restore. The founder has
now explicitly authorized **controlled Production write work** for this goal
(2026-10-10), so the next Production batches may execute their required
bounded writes instead of stopping at read-only evidence. That authorization
does not authorize unbounded deletion, credential exposure, real-money
charging, test-data mixing, or an unchecked entitlement shortcut.

Each Production write still requires a recorded dry run, exact target and
scope, environment/mode check, backup or snapshot where data can change,
reconciliation criteria, rollback or forward-fix decision, post-write
verification, and a private evidence record. Continue the goal with one active
backlog item, exact score recomputation, private evidence,
execution-ledger synchronization, and a concise implementation showcase after
each accepted batch.

### Controlled Production write mode — added 2026-10-10

The execution order is now:

1. Identify the exact unchecked backlog item and the Production operation that
   directly satisfies it.
2. Inspect the exact deployment/source/configuration shape and perform a
   read-only dry run. Confirm the live/test provider mode, canonical amount,
   account/tenant fixture, and rollback target.
3. For database or migration work, take or verify the approved snapshot,
   record the migration/backfill and expected row counts, and rehearse the
   restore or forward-fix path before writing.
4. Execute only the bounded operation. Use a non-production Test Mode fixture
   for no-money payment evidence; never put Preview/Test Mode keys, plan IDs,
   webhook secrets, or test database URLs into Production. A live Production
   payment is never described as free merely because the owner expects no
   customer to be present.
5. Reconcile provider state → database ledger → entitlement/license → account
   or organization access. A write that lacks the complete chain does not
   close a checkbox.
6. Verify monitoring, failure handling, rollback/forward-fix readiness, and
   the public surface. Then update the backlog score, evidence archive,
   execution ledger, goal checkpoint, and implementation showcase.

The user’s standing instruction is to keep moving through the backlog and use
Production where the acceptance contract requires it. The safety boundary is
operational rather than a reason to pause: if an item’s required write is
reversible and its preflight is complete, perform it; if it requires a missing
legal, independent-review, provider, customer-consent, or credential artifact,
record that owner and continue with the next genuinely independent item
without falsely checking the blocked item.

### 2026-10-10 provider renewal trigger boundary

One supported Razorpay Test Mode subscription-update attempt was bounded to
the exact active provider/application match and rejected with HTTP 400 because
the subscription cycle start is in the future. The authenticated Test Mode
dashboard was then rechecked: the active canonical subscription has one paid
cycle and its next charge is 10 November 2026; its Update dialog exposes no
immediate-charge or renewal-replay action. No provider update was submitted.
A provider-generated renewal or eligible Dashboard replay still must reach the
isolated Preview webhook and reconcile to the existing entitlement/license.
This does not change the active item, Gate 4, Production safeguards, or score.
Evidence:
`docs/shipping/evidence/plan-web-014-testmode-renewal-replay-boundary-2026-10-10.md`.
Dashboard follow-up:
`docs/shipping/evidence/plan-web-014-provider-renewal-dashboard-boundary-2026-10-10.md`.

### 2026-10-10 execution lock — one backlog item at a time

The active backlog item is `PLAN-WEB-014` and it is the only implementation
and acceptance workstream until it is fully accepted or explicitly blocked
with a current owner, missing artifact, expiry/review date, and release
decision. Do not start the next backlog item, next gate, Web polish batch,
SCM batch, or unrelated documentation batch while this item is open. Work is
allowed only when it implements, unblocks, qualifies, or records complete
evidence for `PLAN-WEB-014`.

The current payment-release decision is **Cards-only**. The declared hosted
method set for the release candidate must be `card` in Preview and Production;
UPI/QR, netbanking, wallet, EMI, Pay Later, eMandate, and other methods must
be disabled or hidden until separately qualified. This narrows the acceptance
matrix; it does not waive provider authorization, webhook, reconciliation, or
entitlement evidence. The configuration change is not complete until the
exact deployed Preview and Production environment shapes are verified.

The immediate acceptance proof is one canonical-price Razorpay Test Mode card
subscription in isolated Preview, followed by the complete chain: provider
authorization/capture, signed webhook, exactly one payment row, exactly one
ledger entry, correct tenant binding, one Pro entitlement/license, replay
idempotency, and the required failure/cancellation/refund/renewal state
transitions. The first authorization/capture and payment-to-license chain and
one failure/no-grant path are now evidenced once each; until the remaining
matrix and final hosted acceptance are evidenced, `PLAN-WEB-014`, Gate 4, and
the backlog score remain open. The remaining provider renewal/expiry, refund
replay/order,
out-of-order, timeout/retry, and final hosted acceptance cases must be
qualified without synthetic events or manually edited entitlement rows.

### Entitlement evidence definition — required for Gate 4 acceptance

For this goal, entitlement evidence means one private, redacted record that
joins the same checkout/provider correlation across the complete path:

1. Verglos selects the canonical plan, amount, currency, cadence, catalog
   version, user, and tenant or organization on the server.
2. Razorpay Test Mode authorizes and captures the recurring card payment.
3. The isolated Preview webhook verifies the provider signature and accepts
   the event exactly once.
4. The database contains exactly one corresponding payment row and one ledger
   row, both bound to the correct user and tenant or organization.
5. One correct Pro entitlement/license is created or extended, and the
   account-access decision matches that entitlement.
6. A duplicate or replayed event is harmless, an out-of-order event is
   rejected or contained, and no second payment, ledger row, or entitlement
   appears.
7. Failure, cancellation, refund, expiry, timeout, and retry do not grant
   unauthorized access; renewal extends the existing entitlement instead of
   creating a duplicate.
8. Read-only reconciliation shows provider, webhook, payment, ledger,
   entitlement, and access state agree. No direct entitlement-row edit is
   allowed as evidence.

The latest batch added protected Preview order-route evidence only. It did not
add this entitlement chain, so Gate 4 and `PLAN-WEB-014` remain open.

### 2026-10-10 provider/browser activation boundary

The known isolated Test Mode subscription harness reached the provider card
form. The official test-card fixture was entered without recording card
values, followed by one bounded DOM activation and one real viewport-coordinate
activation. The provider stayed on the card form; no OTP, success, failure, or
terminal checkout event appeared. Read-only provider and isolated-database
aggregates were unchanged. No successful authorization/capture, signed
webhook, payment row, ledger row, entitlement/license change, account-access
change, or Production write was observed.

This is a real provider/browser activation boundary, not payment acceptance.
The owner is the authorized payment-test operator with Razorpay Test Mode
operations. The next safe action is a changed provider-supported subscription
fixture or a real operator activation/OTP path; do not guess OTPs, edit rows,
or grant entitlements. Review by 2026-10-11 IST or when the provider fixture
changes. The score remains **219 checked / 61 unchecked / 280 total / 78.2%**.

## 1. Objective

Ship the complete Verglos V1 across:

- `/Users/anuragyadav/Developer/TopNotchh-Workspace/verglos-cli`
- `/Users/anuragyadav/Developer/TopNotchh-Workspace/verglos-web`

The primary objective is to complete the whole authoritative private backlog
with real implementation, integration, qualification, security review,
release evidence, and final acceptance. Backlog delivery is the main
workstream. Release gates and Production are part of that same shipping
objective, and controlled Production writes are authorized when they directly
serve the active acceptance item. Execution remains one active backlog item at
a time: qualify the current gate or Production operation only when it directly
unblocks that item, record external gates with their real owner and missing
artifact, and advance only after the active item is accepted or genuinely
blocked with a release decision. The gate list never substitutes for product
shipping, and product work never substitutes for missing external evidence.

Production is not excluded from this goal. It has four explicit stages:

1. read-only audit and configuration verification;
2. fail-closed application deployment and public smoke qualification;
3. provider/database/payment activation only after the operation-specific
   preflight, backup/restore, reconciliation, and rollback evidence exists;
4. post-activation monitoring, payment/entitlement reconciliation, and
   rollback or forward-fix rehearsal.

The current Production operation is a complete fail-closed code-rollout
slice, not the whole Production scope and not a reason to skip the remaining
Production work. From the 2026-10-10 authorization checkpoint onward,
Production write operations may be executed when the controlled-write
contract above is satisfied. For every Production pass, include all of the
following in the work record:

- inspect the exact source commit, build, runtime configuration shape, domain,
  deployment state, health routes, logs, and rollback target without exposing
  secrets or personal data;
- deploy the reviewed application code to Production after typecheck, focused
  tests, required full-suite checks, build, runtime-config validation, and
  rollback-target verification;
- verify the deployed public routes, HTTP methods, authentication boundaries,
  console/runtime errors, checkout rendering, headers, caching, and
  fail-closed behavior;
- verify that Production has the correct environment separation and that no
  Preview/Test Mode plan IDs, test database URL, test webhook secret, or test
  credentials were copied into it;
- record the deployment identifier, alias, source commit, build result,
  smoke result, limitations, and rollback path in the private ledger and
  evidence archive; and
- continue the same Production record through provider configuration,
  migration/backfill planning, payment and subscription actions,
  entitlement/account/customer-data changes, post-deploy reconciliation,
  monitoring, incident response, rollback, and final acceptance whenever
  those operations are authorized and their own preflights are complete; and
- keep recurring billing, provider writes, database migrations/backfills,
  payment captures/refunds, entitlement changes, account changes, and
  customer-data mutations disabled until each operation has its own approved
  preflight, backup/restore or recovery evidence, reconciliation check, and
  rollback/forward-fix decision; after that checkpoint, execute the bounded
  operation and record its post-write result.

Therefore, the current Production statement is:

> Production shipping is in scope end-to-end. This operation deploys the
> reviewed code as a fail-closed rollout only: no Production plan IDs,
> payment writes, database writes, migration writes, entitlement changes,
> account changes, or customer-data mutations occur in this rollout. Those
> Production activation, reconciliation, monitoring, rollback, and final
> acceptance stages remain mandatory parts of the same goal; they are
> deferred only until their operation-specific preflights are satisfied.

Test Mode credentials, Test Mode plan IDs, Preview databases, and test
webhook fixtures must never be copied into Production. A Production deploy
with recurring billing disabled is still a real Production shipping event;
it is not the final billing launch. Production billing and database writes
remain part of this goal and will be executed when their concrete preflight
criteria are satisfied.

### Current Production rollout declaration — do not narrow the goal

The current Production action is a reviewed code deployment as a
**fail-closed code rollout only**. It is an accepted in-scope shipping step,
but it is not permission to silently skip the rest of Production. The rollout
must include and report every item below:

- source commit, diff review, typecheck, focused tests, required full-suite
  checks, build, runtime-configuration validation, and known rollback target;
- deployment ID, target/environment, aliases, build result, route/health
  results, HTTP-method and authentication-boundary checks, browser rendering,
  console/runtime errors, headers, caching, and fail-closed behavior;
- proof that Production did not receive Preview/Test Mode plan IDs, test
  credentials, test webhook secrets, isolated-test database URLs, fixture
  customers, or test entitlement state;
- read-only verification of Production provider mode, database/migration
  compatibility, deployment logs, monitoring/alerts, and relevant aggregate
  state without exposing secrets, payment identifiers, database URLs, or
  personal data;
- a private evidence record and execution-ledger entry that state what passed,
  what was not exercised, the exact limitation, the owner, the rollback path,
  and the release decision; and
- a live backlog recomputation after the batch. A code-only rollout does not
  close payment, database, migration, entitlement, account, customer-data,
  monitoring, recovery, or final-acceptance checkboxes by itself.

The following Production work remains mandatory in this same goal after the
code rollout: correct live provider/customer/plan/webhook configuration;
database migrations and backfills; subscription, capture, refund, and other
provider actions; entitlement, account, organization, and customer-data
changes; post-write ledger/provider/entitlement reconciliation; monitoring
and incident response; authenticated rollback/restore or forward-fix
rehearsal; and final Production acceptance. Each state-changing operation
requires its own reviewed dry run, bounded scope, backup/snapshot, restore
evidence, reconciliation criteria, rollback/forward-fix decision, and
post-write verification before execution. Until then, those surfaces stay
disabled or fail closed and are recorded as open—not omitted.

### Production scope map — every surface remains in the shipping objective

The phrase “fail-closed code rollout only” describes the **current safe
Production operation**. It does not reduce the Production deliverable to a
code deploy. The same goal must carry the complete Production chain below to
completion, with a separate evidence record and backlog decision for every
stage:

1. **Application rollout:** reviewed source, dependency and migration
   compatibility, focused and full tests, typecheck, build, deployment,
   runtime configuration validation, route/authentication/HTTP checks,
   browser and console smoke, headers/caching checks, monitoring hookup, and
   a verified rollback target.
2. **Live configuration:** the correct live provider account and mode,
   canonical catalog and price records, plan IDs, customer/organization
   ownership rules, live webhook endpoint and secret, feature flags, email,
   object storage, queue, rate limits, and every other required Production
   integration. Test keys, Preview URLs, test plan IDs, fixture customers,
   and test webhook secrets must never be copied into Production.
3. **Database release:** schema inspection, exact migration plan, dry run,
   bounded DDL/DML, backup or snapshot, restore rehearsal, migration and
   backfill row counts, compatibility checks, post-write verification, and a
   rollback or forward-fix decision. This includes every required table,
   index, constraint, catalog, billing, ledger, organization, entitlement,
   audit, and customer-data change.
4. **Payment and subscription lifecycle:** server-selected canonical price
   and catalog binding; order/subscription creation; authorization, capture,
   failure, retry, timeout, cancellation, renewal, expiry, full and partial
   refund; provider webhook signature, duplicate, replay, out-of-order, and
   reconciliation handling; and exactly-once payment-ledger behavior. No
   lifecycle step is considered shipped from a route or a green build alone.
5. **Entitlement and account state:** verified payment-to-ledger-to-
   entitlement ordering; plan upgrades/downgrades; Team, Studio, and
   Enterprise organization ownership; account/customer data changes;
   license issuance, renewal, revocation, and expiry; tenant isolation;
   audit records; and repair/reconciliation behavior without manual row
   edits or founder-email shortcuts.
6. **Release operations:** protected npm and Vercel approvals, package
   provenance and notices, deployment promotion, rollback/restore rehearsal,
   incident and alert routing, rate-limit and abuse controls, and recovery
   evidence for both the Web application and the npm/CLI product.
7. **Acceptance and handoff:** authenticated Production smoke, live
   provider/database/ledger/entitlement reconciliation, monitoring window,
   rollback readiness, final backlog recomputation, final acceptance, and
   the authorized POC corpus across companies from zero to 100 crore revenue
   and across all supported plans. External AppSec, legal, customer-consent,
   and repository-authorization gates must be recorded with their real
   owner and artifact; they may not be silently marked complete.

The current code-only rollout is therefore a real first Production slice,
not the completion claim. A later Production resume must explicitly report
each item above as **passed, failed, deferred with owner/date, or blocked by
an external gate**. “Deferred” means the checkbox stays open; it never means
the surface was forgotten. The backlog score changes only when the complete
acceptance evidence for the corresponding item exists.

### Production completeness contract — current execution update

The Production workstream must be reported as a complete chain, not as a
code-only stopping point. Every Production pass must explicitly account for
all of these surfaces:

- source commit, migration compatibility, build, runtime configuration shape,
  deployment identity, domain aliases, health routes, logs, headers, caching,
  authentication boundaries, checkout rendering, console/runtime errors,
  rollback target, and public smoke;
- environment separation, including proof that Preview/Test Mode keys, plan
  IDs, webhook secrets, fixture database URLs, and test customer data were not
  copied into Production;
- Production provider configuration and canonical plan/customer/webhook
  configuration, but only after the correct provider mode and account state
  are independently verified;
- every requested database migration, backfill, payment/provider write,
  capture, refund, subscription action, entitlement change, account change,
  and customer-data mutation, each with its own dry run, bounded scope,
  backup/snapshot, restore rehearsal, row-count/reconciliation result,
  rollback or forward-fix decision, and named owner;
- post-deploy health, payment/ledger/entitlement reconciliation, alerting and
  monitoring, failure response, rollback readiness, and final acceptance.

The present operation is the first Production stage only: a reviewed,
fail-closed code rollout. The later surfaces are still in the same goal and
must not be silently omitted. Conversely, a migration-bearing candidate must
not be promoted just because its hosted build is green; the Production
migration preflight and recovery evidence must be current first. The latest
verified Production deployment is `dpl_9tXipBQD1CmYK8EpmMLCBPrgh3zw`, READY
and aliased to `https://verglos.com`; its public rollout was fail-closed and
its billing/database/entitlement state remained untouched. The current Web
qualification worktree is `feat/preview-test-auth` at `445d8ed`; its focused
checkout suite, typecheck, diff check, and full local build passed. It is not
a Production activation candidate merely because those checks passed.

Evidence for this current boundary is:
`docs/shipping/evidence/production-and-preview-auth-rollout-2026-10-09.md`.

The current fail-closed retry rollout evidence is:
`docs/shipping/evidence/plan-web-014-hosted-retry-production-rollout-2026-10-09.md`.

The current provider-to-database lifecycle-ordering reconciliation evidence
is:
`docs/shipping/evidence/plan-web-014-lifecycle-ordering-reconciliation-2026-10-09.md`.

The current CLI API-origin and provider-renewal-boundary evidence is:
`docs/shipping/evidence/cli-api-origin-hardening-and-provider-renewal-limit-2026-10-09.md`.

The current CLI standards-validation source restoration is:
`d0a3b21`, with evidence at
`docs/shipping/evidence/qual-cli-006-standards-source-restoration-2026-10-09.md`.
It is qualification progress only; official validators, trusted release
provenance, protected publishing, legal review, and independent acceptance
remain open.

### 2026-10-10 current execution checkpoint — Cards-only hosted display repaired

The active Web batch repaired a concrete `PLAN-WEB-014` acceptance defect:
the Verglos page catalog was Cards-only, but the hosted Razorpay Checkout
modal could still show provider-default UPI and eMandate tabs. Web commit
`445d8ed` adds a server/catalog-driven hosted display configuration with
`show_default_blocks: false` and passes it to both order and subscription
Checkout paths. Focused checkout tests passed **12/12**, Web typecheck
passed, the Preview build passed, and the Production build passed.

The batch was deployed to the READY Preview hosted-display deployment
`dpl_Es8QZoQr7H7sYRzhKMTqVnzMfnB5` and the READY Production deployment
`dpl_9tXipBQD1CmYK8EpmMLCBPrgh3zw`, aliased to `https://verglos.com`.
Protected Preview route qualification was then checked on
`dpl_36zQf2zEsVCrxpic8rcrjFJbQbK7`: the order route returned HTTP 200,
`testMode:true`, catalog `2026-10-02.0`, and `card` only. Production
verification remains fail-closed and read-only for billing state: no
Production payment, subscription, database, migration, entitlement, account,
or customer-data write occurred. The isolated Preview subscription route and
database remain the only place where Test Mode lifecycle writes may be
exercised.

This repairs the hosted-method display boundary; it does not close
`PLAN-WEB-014` or Gate 4. The remaining active-item proof is the complete
canonical-price recurring-card lifecycle: provider authorization/capture,
signed webhook, exactly-once payment and ledger reconciliation, tenant-bound
Pro entitlement, replay/idempotency, and the remaining cancellation, failure,
renewal, expiry, refund, timeout, and out-of-order cases. The live score
therefore remains **219 checked / 61 unchecked / 280 total / 78.2%** until
that evidence is complete.

The private evidence record for this batch is
`docs/shipping/evidence/plan-web-014-cards-only-preview-route-and-hosted-display-2026-10-10.md`.
It must include the redacted commit,
deployment IDs, test results, hosted-method observation, database write
boundary, and remaining limitations. It must never include provider secrets,
full provider IDs, database URLs, cookies, authorization headers, or raw
payment payloads.

### 2026-10-09 continuation checkpoint — provider authorization remains open

The next bounded Preview/Test Mode subscription attempt reached the
catalog-bound creation route with HTTP 200 and Razorpay’s subscription-card
mandate/OTP step. The provider rejected the bounded OTP attempt and a second
bank-like OTP interaction also failed. This is a provider-qualification
limitation, not payment success and not a reason to claim Gate 4 complete.
Read-only isolated reconciliation found 38 applied migrations, 5 active, 7
cancelled, and 12 pending subscription rows, 4 captured subscription payment
rows, 2 active Pro licenses, and 61 completed webhook-event rows. These are
cumulative isolated-fixture aggregates and do not attribute a captured
payment or entitlement to the failed retry.

Temporary Preview auth diagnostics were removed after diagnosis; focused
Preview-auth tests passed 4/4 and Web typecheck passed with only the existing
Node 22 engine warning under the Node 26 runner. No Production plan IDs,
payment/provider writes, database or migration writes, entitlement changes,
account changes, or customer-data mutations occurred. Gate 4 and
`PLAN-WEB-011`, `PLAN-WEB-012`, `PLAN-WEB-014`, and `PLAN-WEB-015` remain open.
The next valid attempt requires a provider-supported Test Mode subscription
mandate/renewal fixture or documented provider simulation control; do not
repeat the same OTP path indefinitely. Evidence:
`docs/shipping/evidence/plan-web-014-preview-subscription-otp-limitation-2026-10-09.md`.

The payment gate had one explicit product gap: the Web code had billing ledger
and subscription-webhook handling, but no server route that created a provider
subscription. Web commit `54e6fd0344b2f8b74e2c4d5ff15a0b02c12b51dd` added the
catalog-bound creation route, pending binding, owner-bound status read, and
hosted UI. That route is now additionally covered by the current lifecycle
ordering repair at `6f932d4`; it still must be qualified against the complete
isolated Razorpay Test Mode subscription matrix before Gate 4 can be called
complete.

The next provider observation exposed and then verified a second concrete gap:
Razorpay's first subscription capture is linked through a paid invoice and
order, while the payment entity may omit `subscription_id`. Web commit
`a95deef` adds invoice-backed binding and accepts the observed string form of
the provider's captured flag while retaining exact amount, currency, status,
refund, signature, and signed-note checks. A fresh isolated Preview/Test Mode
subscription now reconciled to an active subscription, a captured subscription
payment, and a license binding. This advances Gate 4 evidence; it does not
claim the full renewal/failure/refund/replay/out-of-order matrix complete.

Verglos is intended for local, CI, hosted, team, organization, and
enterprise-shaped use cases. It is not a local-only product. Those claims are
valid only when the corresponding authorization, isolation, entitlement,
operational, billing, provider, release, and acceptance evidence exists.

The objective is timeboxed to the remaining 24-hour active shipping window,
with a three-hour implementation target wherever current evidence and hosted
dependencies allow. The deadline accelerates execution; it does not permit
skipped gates, fabricated evidence, unsafe production changes, or redefining
“whole shipping” as a partial launch.

Every active work turn must stay on the current active backlog item until that
item is accepted or explicitly blocked. A different backlog item may begin
only after the current item has a documented acceptance decision or a genuine
external blocker; dependency work is allowed only when it directly unblocks
the current item.

Every active work turn must do at least one of the following:

1. Implement or repair product code, tests, integration, or release tooling
   for an unchecked backlog item.
2. Execute the smallest missing qualification needed by an unchecked item.
3. Record the exact external blocker, owner, evidence gap, expiry/review date,
   and release decision, then continue only with work that can unblock the
   same active item. Do not advance the queue merely because another item is
   easier or technically independent.

A status-only recap, repeated unchanged test run, helper-only change, arbitrary
documentation edit, browser clicking without an acceptance purpose, or
checkbox edit without current evidence is not progress.

## 2. Authoritative checkpoint and scoreboard

The authoritative private tracker is:

`/Users/anuragyadav/Developer/TopNotchh-Workspace/verglos-cli-private-shipping`

Branch: `local/private-shipping-ledger`.

Current exact scoreboard:

- **219 checked / 61 unchecked / 280 total / 78.2%**.
- The score is unchanged by the current subscription-plan setup and
  deployments: no checkbox is closed until its complete acceptance evidence
  exists. Recompute it from the live backlog after each batch.
- `PLAN-WEB-013` was accepted after the four-method payment-catalog and
  hosted-order evidence batch; `PLAN-WEB-011`, `PLAN-WEB-012`,
  `PLAN-WEB-014`, and `PLAN-WEB-015` remain open.
- Recompute the count from the live private backlog after every substantial
  batch. Never use a remembered count.
- Report the exact score every time a batch is completed or a blocker is
  recorded.

Current source checkpoints:

- CLI `origin/main`: `8bea4be2fa18533eafd088122be769e942965626`.
- Web `origin/main`: `be4289f838b4cd53ed243979bfd7623262b69636`.
- Web PR #166 merged as `ff0dd15b3eada55eb898038bc66ea0c5394bead6`.
- Web PR #167 merged as `9841236c64a816fc90402cd90ff2bc93ce35382c`.
- Web PR #168 merged as `cedf199855a5c4734122ae4849253156328cff1b`.
- CLI PR #85 merged as `80fa930`.
- CLI PR #86 merged as `fc452ba`.
- CLI PR #87 merged as `8bea4be2fa18533eafd088122be769e942965626`.
- Web PR #170 from `3779616` merged as `be4289f` after all hosted checks passed.
  It adds a fail-closed Preview guard requiring both a validated database URL
  and an explicit `VERGLOS_PREVIEW_DATABASE_ISOLATED=true` marker whenever
  Preview payment methods are configured. It is progress, not payment
  lifecycle acceptance, and does not change the backlog score.
- Web PR #169 was a duplicate of already merged Preview-auth work (its patch
  was identical to PR #157 and its base was stale) and is now closed. It was
  not merged or counted as new shipping progress.
- Current Web production-qualification sequence on
  `feat/preview-test-auth` includes `7373c8b` (same-origin checkout request
  acceptance), `0bafe73` (hosted payment-failure retry preservation),
  `6f932d4` (subscription lifecycle ordering guard), and `445d8ed`
  (Cards-only hosted Checkout display restriction). These changes passed the
  applicable focused suites, typecheck, diff check, and full local build and
  were deployed only through the fail-closed Production path.
- Current CLI backend hardening commits are `439b782d` and `d0a3b21`. The former
  rejects unsafe saved
  API bases before license, entitlement, monitor, login, unlock, or telemetry
  requests are built; focused security/entitlement/monitor tests passed
  **17/17**, and CLI typecheck/build passed. This is backend progress mapped
  to the modified-client/security surface. The latter restores the shared
  standards-validation parser/importer source and passes the corpus **7/7**;
  neither commit is a complete production signer or entitlement activation
  gate.
- Earlier Web qualification branch `da45a97` on `feat/preview-test-auth`
  supplied invoice-backed subscription-capture reconciliation, the code-side
  `subscription.expired` path, and invoice-only `payment.failed` binding.
  Those records remain historical evidence. The current worktree head is
  `445d8ed` on the same branch; its hosted display repair is qualified by the
  focused checkout suite and deployed through the fail-closed Production path.
  Neither the migration-bearing qualification work nor the lifecycle work is a
  Production activation candidate until the applicable migration, recovery,
  reconciliation, and rollback evidence is current.
- The latest isolated Preview hosted-display deployment for the current
  qualification branch is `dpl_Es8QZoQr7H7sYRzhKMTqVnzMfnB5`, READY, with the
  isolated Preview configuration and Cards-only hosted display repair. The
  protected route-check deployment is `dpl_36zQf2zEsVCrxpic8rcrjFJbQbK7` and
  returned the expected isolated Test Mode order-route result. The earlier
  `dpl_HbYCQG4hnDH6Jew48YcNUuRkVVaA`, `dpl_EhFoWzfHSbQt5LkRYaxS7MdGqc4u`,
  and `dpl_FBtepYT84UUNCcvjo1jj43HxU7KB` records remain historical evidence
  for the invoice-only failure, expiry code path, and invoice-backed
  first-charge reconciliation.
- The latest Production deployment is
  `dpl_9tXipBQD1CmYK8EpmMLCBPrgh3zw`, READY and aliased to
  `https://verglos.com`. The remote runtime-config check, 47-page build, and
  fail-closed public rollout passed. Production plan IDs were deliberately not
  added, so recurring billing remains fail-closed there. This is the latest
  complete Production code-rollout slice; live billing, provider, database,
  migration, entitlement, account, and customer-data activation remain
  explicitly included deferred stages with their own preflights.
- Earlier Web PR #171 at `fa1b9f5c50258ef23daaac4bbf32b24bbd590ef5`
  remains historical evidence for the Preview-only auth fixture and checkout
  terminal-lifecycle repair. The current production-qualification head is
  tracked by the local private ledger at `6f932d4`; protected Preview/browser
  qualification and migration-bearing promotion requirements remain separate
  and are not implied by a Production code rollout.
- Earlier isolated Test Mode work recorded canonical Pro plans and first-charge
  evidence, but one historical read-only recheck returned HTTP 401. No
  provider write was attempted after that response. A later redacted recheck
  using the current isolated configuration returned HTTP 200 for both plan and
  subscription inventory; the historical 401 is superseded and does not
  authorize Production activity.
- A later redacted Test Mode recheck returned HTTP 200 for both plan and
  subscription inventory, and a local isolated Web qualification created real
  Test Mode subscriptions from the server catalog, cancelled them through the
  provider, reconciled signed cancellation webhooks, detected replay, and
  preserved cancellation against an older out-of-order lifecycle event. This
  supersedes the earlier credential observation for the current isolated
  configuration, but it does not prove hosted Preview delivery or the full
  renewal/failure/expiry/refund/entitlement matrix. Evidence:
  `docs/shipping/evidence/plan-web-014-local-testmode-subscription-cancellation-2026-10-09.md`.

- The latest isolated lifecycle reconciliation created a fresh canonical Pro
  subscription, reconciled the provider's active state to the isolated Web
  database, verified one captured first payment and the active paid license,
  cancelled a subscription in Test Mode, and reconciled the signed webhook.
  A redacted provider-to-database aggregate then matched 5 active, 7
  cancelled, and 9 pending/created records after the application-path replay
  repair. The ordering guard rejects older, same-time, and authenticated
  regressions. This is real qualification progress but it still does not
  prove provider-generated renewal, expiry, halted/failure, subscription
  refund, external replay/out-of-order delivery, timeout/retry, or full
  exactly-once acceptance across every enabled method. Evidence:
  `docs/shipping/evidence/plan-web-014-lifecycle-ordering-reconciliation-2026-10-09.md`.

Web commit `fa1b9f5` also repairs the customer-facing terminal lifecycle state:
cancelled, completed, expired, and halted subscriptions stop polling and offer
a restart, while paid/refunded responses retain precedence. This code-side
qualification does not close the hosted provider gate. Evidence:
`docs/shipping/evidence/plan-web-014-checkout-terminal-lifecycle-2026-10-09.md`.

The private tracker is authoritative for acceptance. The public repositories
must never receive private tracker documents, customer data, credentials,
private fixture contents, detailed security findings, or competitive
intelligence.

## 2A. Complete shipping document system

This goal is an operating index, not a replacement for the other shipping
documents. Every substantial batch must read the relevant documents below and
update the appropriate records; never maintain progress only in this goal.

### Private shipping control plane

These files govern execution and acceptance in the private tracker:

- `docs/shipping/VERGLOS_V1_BACKLOG.md` — authoritative checkbox backlog and
  score.
- `docs/shipping/EXECUTION_LEDGER.md` — chronological commands, results,
  boundaries, owners, and dispositions for every substantial batch.
- `docs/shipping/STATUS.md` — current human-readable shipping status.
- `docs/shipping/TRACEABILITY.md` — backlog ID to implementation, test,
  hosted-run, and evidence mapping.
- `docs/shipping/DECISIONS.md` — scope, provider, architecture, and release
  decisions; append corrections when older entries are superseded.
- `docs/shipping/RISKS.md` — risk register, severity, owner, mitigation,
  containment, and gate impact.
- `docs/shipping/RELEASE_GATES.md` — gate acceptance and release-boundary
  evidence.
- `docs/shipping/VERGLOS_V1_MANUAL_INPUT_BLOCKERS.md` — exact founder,
  reviewer, legal, provider, customer, and credential actions still needed.
- `docs/shipping/FOUNDER_ACTION_STEPS.md` — plain-language founder actions;
  it must not request secrets in chat.
- `docs/shipping/HOSTED_013_EXECUTION_RUNBOOK.md` and
  `docs/shipping/PRODUCTION_SOURCE_AUDIT_2026-09-12.md` — production data,
  migration, backup, restore, reconciliation, and rollback procedures.
- `docs/shipping/VERGLOS_RECORD_PACKAGE_DECISION.md`,
  `docs/shipping/VERGLOS_RECORD_PROVENANCE.md`, and
  `docs/shipping/VERGLOS_THIRD_PARTY_INVENTORY.md` — record, provenance,
  dependency, notice, and redistribution truth.
- `docs/shipping/GOAL_ADDENDUM*.md` — historical scope decisions and learning;
  newer dated entries supersede older ones without deleting history.

`docs/shipping/evidence/` is the private evidence archive. Add a dated,
redacted evidence file for each meaningful qualification event. Do not dump
all evidence into the goal. `docs/shipping/acceptance/` contains the external
workflow, consent, comprehension, and Hunt adjudication protocols; it does
not itself prove that a customer, reviewer, or legal approver completed them.
`docs/shipping/legal/` is private and holds licensing/legal records only.
The complete private Markdown scope is `docs/shipping/**/*.md`, including all
root control-plane files plus every acceptance, evidence, and legal record;
the named files above are the operating entry points, not a reduced subset.

### Product, company, and architecture truth

The product meaning and feature scope must remain connected to the shipping
work. Read these before changing product behavior, plan claims, public copy,
or architecture:

- `verglos-cli/docs/VERGLOS_COMPANY_USAGE_AND_FEATURE_MAP.md` — who uses
  each capability, where it runs, and which plan it serves.
- `verglos-cli/docs/VERGLOS_PRODUCT_ARCHITECTURE_BLUEPRINT.md` — product
  thesis, current/target truth, hypotheses, architecture, and ship gates.
- `verglos-cli/docs/shipping/VERGLOS_TRUTH_REGISTRY.md` — current versus
  partial/planned capability truth.
- `verglos-cli/docs/shipping/VERGLOS_ARCHITECTURE_DECISION_SET.md` —
  accepted architecture decisions and deferred hypotheses.
- `verglos-cli/docs/shipping/VERGLOS_PLAN_AND_CAPABILITY_RECONCILIATION.md`
  — canonical plan, allowance, entitlement, and pricing reconciliation.
- `verglos-cli/docs/shipping/VERGLOS_FINAL_ACCEPTANCE_AND_POC.md` — final
  acceptance stories, corpus, external validation, and go/no-go.
- `verglos-cli/docs/shipping/VERGLOS_HOSTED_COST_AND_USAGE_LEDGER.md` —
  usage dimensions, allowances, cost attribution, and reconciliation.
- `verglos-cli/docs/shipping/VERGLOS_DATA_AND_SCHEMA_MIGRATION_INVENTORY.md`
  — schema ownership, migration history, baseline, backfill, and recovery.
- `verglos-cli/docs/shipping/VERGLOS_COMMAND_AND_UI_CONTRACT.md`,
  `VERGLOS_AGENT_AND_MCP_CONTRACT.md`, `VERGLOS_MCP_CAPABILITY_TRUTH.md`,
  `VERGLOS_AI_CHANGE_CONTEXT_CONTRACT.md`, and the other
  `verglos-cli/docs/shipping/VERGLOS_*.md` documents — command, agent, MCP,
  evidence, policy, engine, importer, record, provenance, target, schema,
  privacy, compatibility, Hunt, release, and capability contracts. The
  entire glob is in scope; the examples above are not an abbreviated allowlist.
- `verglos-cli/docs/e2e-test-matrix.md` and all research documents under
  `verglos-cli/docs/research/` — bounded evaluation methodology and research
  context, never customer acceptance by themselves.

The CLI shipping directory also contains its own public implementation
records (`verglos-cli/docs/shipping/VERGLOS_V1_BACKLOG.md`,
`VERGLOS_V1_MANUAL_INPUT_BLOCKERS.md`, `EXECUTION_LEDGER.md`, `STATUS.md`,
`TRACEABILITY.md`, `DECISIONS.md`, `RISKS.md`, `RELEASE_GATES.md`, and
`HOSTED_013_EXECUTION_RUNBOOK.md`). Keep them consistent with the private
tracker without copying private evidence, credentials, customer data, or
reviewer/legal records into the public repository.

Company context remains available under
`/Users/anuragyadav/Developer/TopNotchh-Workspace/knowledge/company/`,
especially `products.md`, `current-focus.md`, `architecture.md`,
`roadmap.md`, `mission.md`, `vision.md`, `deployment-strategy.md`,
`ai-strategy.md`, `coding-standards.md`, `brand.md`, and `topnotch.md`.
Those documents inform product intent; the private backlog and evidence still
decide what is shipped.

### Web operational documents

For Web changes, also read `verglos-web/docs/deployment-runbook.md`,
`verglos-web/docs/dr-drill-runbook.md`, `verglos-web/docs/cron-setup.md`, and
`verglos-web/CLERK-RUNBOOK.md` when present. These do not override the
private release gates, migration runbook, or production safety rules.

### Required synchronization after every batch

Update the smallest applicable set of `EXECUTION_LEDGER.md`, `STATUS.md`,
`TRACEABILITY.md`, `DECISIONS.md`, `RISKS.md`, `RELEASE_GATES.md`, the
backlog, and dated evidence. Recompute the backlog from checkboxes. Keep
historical entries intact, append superseding corrections, and state whether
any production, database, payment, provider, deployment, account, customer,
legal, reviewer, or release state changed.

## 3. Current verified state and accumulated learning

The following evidence is already available and must not be repeated without
a changed input or a clear acceptance need:

- CLI PR #85 hardened private cache writes with atomic replacement and private
  file modes. Focused coverage was 34/34; local typecheck/build and hosted
  platform, in-toto, and Verglos self-scan checks passed.
- CLI PR #86 hardened private-runner replay persistence: parent directory
  `0700`, replay files `0600`, random exclusive temporary files, fsync, atomic
  rename, and cleanup. Focused private-runner coverage was 5/5; all nine
  Ubuntu/macOS/Windows × Node 20/22/24 hosted cells and in-toto passed.
- CLI PR #87 hardened `DIST-006` rollback rehearsal. A rehearsal now requires
  exactly one operation for each npm-package, engine-manifest, Hunt-feed,
  signing-identity, and Web-deployment boundary and rejects incomplete,
  duplicate, or mismatched fixtures. Focused rollback coverage was 5/5;
  package/release contracts were 11/11; typecheck, build, and public-boundary
  checks passed; all 11 hosted checks passed.
- CLI ordinary Hunt tests passed 45/45. Pinned Docker adversarial evidence
  passed 60 checks with one explicit macOS namespace skip and zero failures.
- CLI package/public-boundary audits, packed manifests, release-script tests,
  typecheck, build, and the configured full test run passed at the recorded
  source head. These qualify tested substrate; they do not satisfy external
  activation, legal, reviewer, publishing, or customer-authorization gates.
- Web payment/ledger/webhook focused qualification passed 31/31 against a
  disposable PostgreSQL 15 database migrated through all 38 migrations.
- A separate clean Web serial run passed 885/887 with 2 explicit skips and 0
  failures. Web typecheck, schema/migration ordering, 45-route build, and
  local public-route qualification passed.
- Web PR #166 fixed the keyless Preview middleware 500 path. PR #167 moved
  direct Clerk consumers to the request-auth seam, removing 500s on
  `/activate`, `/cli-auth`, `/account`, and `/orgs` in keyless Preview while
  preserving fail-closed production auth. PR #168 changed the missing-database
  receipt route to a bounded 503/no-store response while preserving real
  database errors.
- The pre-repair read-only Production browser check rendered UPI, Cards,
  Netbanking, Wallets, EMI, and Pay Later with no console errors and no
  QR-only path. It did not prove Test Mode, order creation, capture, refund,
  webhook, entitlement, renewal, cancellation, or payment acceptance. The
  current Web `445d8ed` repair constrains the hosted display to Cards-only and
  disables provider default blocks; a new hosted-modal verification belongs
  to the active `PLAN-WEB-014` acceptance chain.
- Earlier Production browser/deployment qualification performed no
  Production database, migration, payment, provider, entitlement, or account
  write. The current reviewed Web code was subsequently deployed to
  Production as `dpl_9tXipBQD1CmYK8EpmMLCBPrgh3zw`; the build and fail-closed
  public rollout passed, and no Production database, migration, payment,
  provider, entitlement, or account write occurred. No Test Mode plan or
  credential was copied to Production. This is a bounded application
  deployment slice, while the complete Production activation track remains
  mandatory in this goal.
- The authenticated Chrome DevTools session is available on
  `127.0.0.1:9222`; Docker Desktop is available. Both are instruments, not
  acceptance evidence by themselves.
- Test-mode payment qualification requires an isolated non-production
  database and webhook destination. Changing `DATABASE_URL` does not recreate
  tables; the target database must be migrated and its migration history and
  schema verified before use.
- A production-looking QR, a clicked “I've paid — check now” response, a
  polling status, a provider dashboard screenshot, a direct Neon row edit, a
  founder-email allowlist, a `$1` production price, a mocked provider, or a
  green unit test is not payment acceptance evidence.
- A founder’s general consent to work on Verglos does not replace repository
  owner authorization, legal approval, an independent Hunt reviewer, trusted
  publisher identity, customer consent, or provider/account evidence when an
  item explicitly requires that artifact.
- The earlier all-enabled-method direction is now superseded for the current
  release candidate by the 2026-10-10 Cards-only decision below. QR may not
  be used as the sole payment route or as payment acceptance evidence.
- The current Web payment safety gap is explicit Preview database isolation:
  test keys and an all-method catalog are not enough. Preview payment config
  must fail closed without a disposable non-production database, TLS-safe URL,
  and an independently verified webhook target. The marker is a safety
  assertion, not proof by itself; migration history, schema, webhook routing,
  and disposable-target verification remain required evidence.
- The correct way to advance a backend item is a small, reviewable change on
  the current upstream head with focused tests, the full required suite,
  typecheck/build, exact diff review, hosted checks, and private evidence.
  A stale worktree, duplicate PR, passing local tests on already-merged code,
  or a green browser page does not create a new acceptance event.
- The exact merged CLI head `8bea4be2fa18533eafd088122be769e942965626` has a
  fresh pinned Docker adversarial requalification: 60 pass, one documented
  macOS namespace skip, zero failures. This strengthens HUNT-011 evidence but
  does not replace independent AppSec review, trusted/licensed recipe
  provenance, production activation, or customer acceptance.
- Web PR #170 is now merged and makes Preview payment configuration fail closed
  without a TLS-safe database URL and explicit isolated-target marker. Local
  focused tests passed 38/38, serial passed 864 with 24 explicit skips and no
  failures, typecheck/build passed, and all hosted checks passed. This does not
  prove database migration/schema, webhook-target, provider lifecycle, or
  production reconciliation.
- The current isolated payment setup uses a separate Neon test database with
  the reviewed migration set applied and an explicit Preview isolation marker.
  The historical `card,netbanking,wallet,emi` configuration is only a prior
  qualification baseline. The active release-candidate decision is now
  Cards-only: Preview and Production must expose `card` only, with all other
  hosted methods disabled or hidden until separately qualified. The Preview
  webhook is Razorpay Test Mode and points to the isolated Preview target.
  This proves configuration and isolation only; it does not replace the
  remaining provider lifecycle, entitlement, and Production-reconciliation
  evidence.
- The current hosted Checkout display repair is Web `445d8ed`. It applies the
  Cards-only method catalog to the provider's hosted display configuration and
  disables provider default blocks. The hosted-display deployment is
  `dpl_Es8QZoQr7H7sYRzhKMTqVnzMfnB5`; the protected route check is
  `dpl_36zQf2zEsVCrxpic8rcrjFJbQbK7`; Production is
  `dpl_9tXipBQD1CmYK8EpmMLCBPrgh3zw`. This is a method-display, route-check,
  and fail-closed rollout only; it does not itself prove a paid recurring
  lifecycle or alter the backlog score.
- The Cards-only decision reduces the matrix but does not close Gate 4. The
  current missing proof is a successful provider-supported recurring card
  authorization plus signed delivery, one-to-one payment/ledger/license
  reconciliation, replay idempotency, and failure/cancellation/refund/renewal
  transitions. A test card rejected as ineligible for recurring payments is a
  blocker for this same item and must be repaired or formally dispositioned;
  synthetic events, direct entitlement edits, and a rendered Cards label do
  not satisfy it.
- Gate 4 qualification now has canonical Test Mode evidence: 16 payments at
  the canonical monthly Pro amount, captures for card/netbanking/wallet/EMI,
  failures for card/netbanking/wallet, and two processed full refunds. The
  isolated database suite passed hosted-order, renewal-ordering,
  cancellation-ordering, replay, out-of-order, tenant-binding, and partial/full
  refund checks. The Web subscription-creation route is implemented and
  isolated route qualification passed **2/2**. A fresh first-charge
  subscription lifecycle was reconciled through the provider invoice on
  isolated Preview, and `da45a97` additionally qualifies an invoice-only
  failed subscription payment with no entitlement grant. Provider-generated
  renewal, failure, cancellation/expiry, refunds, replay/out-of-order
  delivery, and complete provider/ledger/entitlement reconciliation remain
  unclaimed because the latest read-only Test Mode recheck returned HTTP 401;
  no write was attempted after it. Private evidence is
  `docs/shipping/evidence/plan-web-014-failed-subscription-invoice-binding-2026-10-09.md`.
- The code-side `subscription.expired` lifecycle is now additionally qualified
  from Web `4ba15ad` against a fresh database with all 38 migrations and
  focused webhook/ledger integrations passing. This strengthens Gate 4 but
  does not prove provider-generated expiry or close any payment checkbox. The
  new schema migration remains Preview-only pending a Production migration
  preflight, recovery/restore evidence, reconciliation, and rollback decision.
  Evidence:
  `docs/shipping/evidence/plan-web-014-expired-lifecycle-preview-2026-10-09.md`.
- A fresh local PostgreSQL 15 qualification of the merged Web tree applied all
  38 migrations and passed the authenticated account-deletion route E2E 1/1
  plus deletion-job lease/idempotency integration 1/1. This strengthens
  QUAL-WEB-005 only; legal/customer-held-record, production recovery,
  reconciliation, and independent acceptance remain open.
- A fresh authenticated production `/account` read-only requalification after
  reload found no console warnings/errors, one main, one heading, nine named
  visible controls, no unnamed controls, no horizontal overflow, and
  Lighthouse Accessibility/Best Practices/SEO 100/100/100. This strengthens
  QUAL-WEB-006 only; human screen-reader, full route, large-dataset,
  field-CWV, and final truth gates remain open.
- A read-only account route sweep confirmed the paid monitoring, alerts,
  history, and activations routes redirect through the existing paid-context
  gate without a paid fixture; privacy passed a mobile 100/100/100 Lighthouse
  snapshot and organizations loaded without mutation. Treat paid-route
  coverage as missing rather than as a failure or acceptance pass.
- A fresh production `/account` lab trace measured LCP 784 ms, TTFB 100 ms,
  render delay 684 ms, and CLS 0.00, with no CrUX field data. The concurrent
  YouTube-tab network chain was excluded as contaminated; no performance code
  change was justified by the 14.4 KiB legacy-JavaScript finding because its
  estimated FCP/LCP savings were zero.
- The earlier backend/hosted-readiness recheck found no open CLI PR or
  dependency-ready CLI code gap and recorded Preview as payment-disabled. That
  snapshot is superseded for Gate 2/3 by the current isolated Neon Preview
  database, isolation marker, Test Mode webhook, and four-method catalog. The
  private gate evidence preserves both timestamps; do not use the older
  snapshot as the current environment state.

Private evidence for the latest CLI batch is:

`docs/shipping/evidence/dist-006-rollback-boundary-completeness-2026-10-09.md`

## 4. Release-gate workstream inside whole-product shipping

The nine release gates are one control layer in the full shipping system; they
do not replace the company feature map, architecture, implementation backlog,
acceptance stories, execution ledger, traceability, risks, or release
documents. Qualify only the gate or Production operation that directly
supports the current active backlog item, while synchronizing every relevant
document. A gate is closed only when its acceptance artifact exists in private
evidence; founder permission does not turn missing provider, legal, reviewer,
customer, or publishing evidence into a pass.

### Current gate state

1. **Isolated test database — complete.** A separate Neon test database and
   the isolated Docker PostgreSQL path are available. The reviewed migration
   set was applied and schema/migration checks passed. No Production database
   is used for Preview payment qualification.
2. **Preview database isolation — complete.** Preview has the isolated
   database URL and `VERGLOS_PREVIEW_DATABASE_ISOLATED=true`; payment
   configuration fails closed without both the URL and marker. Migration
   history, target identity, and webhook routing remain part of every future
   requalification.
3. **Razorpay Test Mode and webhook — complete for qualification.** Valid
   Test Mode keys, webhook secret, canonical catalog, two canonical Test Mode
   subscription plans, and the isolated Preview webhook target are
   configured. The Test Mode plan IDs are present in Preview only. Secrets
   must never be pasted into chat or public files. Production remains on its
   separate provider configuration and has not received Test Mode plans or
   credentials.
4. **Hosted payment matrix — partially complete and highest technical
   priority.** `PLAN-WEB-013` is closed. `PLAN-WEB-011`, `PLAN-WEB-012`,
   `PLAN-WEB-014`, and `PLAN-WEB-015` remain open. Web commit `54e6fd0` now
   provides the provider-subscription creation/status API and UI, with signed
   notes, tenant binding, and pending persistence. A fresh isolated canonical
   Pro subscription was authorized, captured, reconciled through the provider
   invoice, and bound to an active paid license; a Test Mode cancellation was
   also reconciled. The current ordering guard rejects older, same-time, and
   authenticated regressions, and signed application-path replay repaired
   the current provider-to-database aggregate to active 5, cancelled 7, and
   pending/created 9. The remaining requirement is provider-backed evidence
   for renewal/charge, failure/halted behavior, expiry, subscription refund,
   external duplicate/replay/out-of-order delivery, timeout/retry, exactly-once
   ledger and entitlement behavior, and complete tenant/method binding. Commit
   `fa1b9f5` additionally repairs the checkout terminal-state UX so cancelled,
   completed, expired, and halted subscriptions stop polling and offer a
   restart, with paid/refunded precedence. Do not use Production DB rows,
   `$1` pricing, synthetic events as provider evidence, or manual entitlement
   edits as substitutes.
   As of 2026-10-10, the active release-candidate matrix is intentionally
   narrowed to Cards-only. Set and verify `RAZORPAY_ENABLED_PAYMENT_METHODS`
   as `card` in both Preview and Production and remove every other hosted
   method from the declared surface. Do not mark this item complete until a
   provider-supported recurring card authorization succeeds and the signed
   webhook, payment row, ledger row, entitlement/license, replay, tenant
   binding, failure, cancellation, refund, and renewal evidence all match.
   The latest route check proved canonical Test Mode order creation only; it
   did not prove a paid subscription, signed webhook, payment/ledger/license
   reconciliation, or account access. A previous provider OTP/recurring-card
   attempt was rejected, and automated activation of a fresh hosted provider
   frame was not usable. Resolve this provider-activation boundary or formally
   disposition it with a real owner and release decision before advancing to
   another backlog item or gate.
5. **GitHub/GitLab integration — scope decision required, not an npm
   prerequisite.** Publishing the npm/CLI package does not require a GitHub
   or GitLab installation. The active Web SaaS scope is GitHub-first and has
   `TEAM-CLI-002`, `TEAM-WEB-006`, and `GITHUB-WEB-001..004` open for live SCM
   qualification. If V1 is npm/CLI-only, record these Web SCM items as
   explicitly deferred; if Web SCM is in V1, use one authorized company test
   repository and keep its consent record private.
6. **Independent AppSec review — external and open.** A real security
   reviewer who did not implement Hunt must inspect the exact CLI commit, run
   the Linux/Docker adversarial suite, document residual risks, and sign
   pass/pass-with-limitations/fail. Codex may prepare the packet and tests but
   cannot be the independent signer. No action is required from the founder
   until a reviewer is selected; never fabricate or AI-generate the approval.
7. **Legal/licensing approval — external and open.** An authorized legal or
   company reviewer must approve the private addendum covering Trivy,
   detect-secrets, fixtures, Hunt content, notices, modification/
   redistribution, trademarks, scope, expiry, and reviewer identity.
8. **Protected release and recovery — open.** Enable protected npm/Vercel
   approvals and perform authenticated rollback/restore rehearsals across the
   npm package, engine manifest, Hunt feed, signing identity, and Web
   deployment. Local fixture tests alone do not close this gate.
9. **Final acceptance/POC corpus — open and last.** After implementation and
   release-candidate freeze, run the authorized POC corpus, plan/user/tenant
   matrix, revenue scenarios, held-out false-positive/false-truth evaluation,
   final regression, and dated go/no-go review.

### Gate operating rule

Complete technical work within current authority for the active gate, but do
not advance to another backlog item or gate until the active item is accepted
or explicitly blocked. For an external blocker, record the exact owner,
missing artifact, expiry/review date, safe next action, and release decision;
then work only on the same item's unblock path. Do not claim a gate passed
because configuration changed, a label rendered, or local tests passed.

### Production execution track

Production work is included in every resume, with the boundary made explicit
for each operation:

1. **Audit:** inspect Production environment names, provider mode, domain,
   schema/migration history, health routes, deployment state, and relevant
   aggregates read-only. Never print secret values, database URLs, payment
   identifiers, or personal data.
2. **Code rollout:** deploy reviewed code when typecheck, focused tests, full
   required suite, build, runtime-config validation, and rollback target are
   recorded. A code-only deploy may keep a new feature disabled until its
   activation evidence exists. The 2026-10-09 subscription-route rollout is
   the current example.
3. **Configuration activation:** use the correct Production provider mode and
   Production plan/customer/webhook configuration. Never copy Test Mode keys,
   Test Mode plan IDs, Preview database URLs, or test webhook secrets into
   Production. Rebuild after every environment change and verify the exact
   deployed environment.
4. **Database or payment writes:** before migrations, backfills, billing
   activation, captures, refunds, entitlement changes, or account changes,
   record the reviewed operation, dry-run/row counts, backup or snapshot,
   restore rehearsal, reconciliation, bounded window, and rollback or
   forward-fix. Execute only the operation that has that preflight.
5. **Post-deploy acceptance:** run domain/route/console smoke checks,
   provider configuration checks, health/metrics checks, ledger/provider/
   entitlement reconciliation, and rollback readiness. Record pass,
   limitation, owner, and release decision in private evidence.

Production is therefore neither skipped nor treated as a substitute for
isolated Test Mode evidence. Production deployment can proceed when its code
rollout preflight passes; Production billing/database activation proceeds only
when its separate write preflight passes. Every Production resume must report
which of the audit, code-rollout, configuration, write-activation,
post-deploy-reconciliation, monitoring, and rollback items were executed,
which remain deferred, and why.

The immediate technical sequence is deliberately one-item-at-a-time:

1. Apply and verify the Cards-only configuration in isolated Preview first;
   keep Production fail-closed until the Preview configuration and method
   surface are proven.
2. Complete one canonical-price recurring card authorization in isolated
   Razorpay Test Mode, then reconcile provider → signed webhook → payment row
   → ledger row → entitlement/license → account access.
3. Exercise replay/idempotency, tenant binding, failure, cancellation,
   refund, renewal, expiry, timeout, and retry behavior for that same Cards-
   only surface. Do not substitute another payment method or synthetic event.
4. Record the exact provider limitation if recurring card authorization still
   fails, repair only this path, and keep `PLAN-WEB-014` open. Do not begin
   `PLAN-WEB-011`, `PLAN-WEB-012`, `PLAN-WEB-015`, Gate 5, or unrelated backlog
   work until this item is accepted or genuinely blocked.
5. After acceptance or a documented external block, recompute the backlog,
   update the ledger/evidence/gates/status/traceability records, and then
   select the next single item. Production code rollout, read-only audit,
   monitoring, and rollback checks may continue only when they directly
   support this item; Production billing, database, and entitlement writes
   still require their own preflight.

## 4A. Execution priority: current backlog item first

Do not move to Web polish, CLI polish, SCM, or another gate merely because it
is easier. While an active item is open, take one item only. At the beginning
of each batch:

1. Read the live private backlog and recompute the unchecked queue.
2. Select exactly one active ID. The current active ID is `PLAN-WEB-014`.
3. Inspect the acceptance criteria and all repository instructions.
4. Implement the missing code, tests, integration, or release surface.
5. Run focused qualification, then the required phase suite once the batch is
   complete.
6. Run security, adversarial, public-boundary, supported-runtime, typecheck,
   build, schema, and migration checks required by the affected items.
7. Inspect the exact diff and staged file list.
8. Push one reviewable phase PR when a PR is needed; verify hosted checks,
   review state, head, and mergeability.
9. Accept only IDs whose complete criteria are evidenced.
10. Record remaining external gates with their owner and next action, but do
    not take the next backlog item until the active ID is accepted or genuinely
    blocked with a release decision.

Backend work is exhausted only when every remaining CLI/backend, governance,
and release item is either accepted with current evidence or recorded as
externally blocked with an explicit owner, missing artifact, expiry/review
date, and release decision. A code-side improvement does not close an item
whose criteria still require provider activation, legal approval, trusted
publishing, independent review, customer authorization, production
reconciliation, or hosted operational evidence.

The execution order is:

1. CLI implementation and qualification: Hunt/agent authority,
   entitlement/catalog compatibility, policy/cache/check payloads,
   records/provenance, private-runner behavior, and distribution safety.
2. Cross-repository contracts needed by those CLI items, using Web only for
   the smallest reviewed contract or fixture required.
3. CLI distribution, supported-runtime, adversarial, and release gates.
4. Web truth, hosted browser, payment-method/lifecycle, accessibility,
   performance, privacy, deletion, retention, backup/restore, and production
   reconciliation.
5. GitHub App/org integration and SCM delivery qualification.
6. Founder-supplied company-shaped POC, held-out corpus evaluation,
   false-positive/false-truth correction, final regression, and go/no-go.
7. Only after all gates pass: public docs, pricing, metadata, npm publication,
   release tags, and launch operations.

## 5. Live unchecked queue and blocker policy

Recompute this list from `docs/shipping/VERGLOS_V1_BACKLOG.md` before each
batch. The checkpoint queue is:

- CLI/backend and release: HUNT-008–011, PLAN-CLI-001–004,
  TEAM-CLI-001/002, STUDIO-CLI-001, ENT-CLI-001, LIC-002/003,
  DIST-001–003/006, QUAL-CLI-004, and QUAL-CLI-006.
- Web/cross-repository: PLAN-WEB-011–015, PRO-008, TEAM-WEB-006,
  QUAL-WEB-005/006, ACCEPT-002/003, ACCEPT-005–010/011–014,
  FINAL-WEB-001–008, and GITHUB-WEB-001–004.
- Governance/release decisions: the remaining plan-hypothesis,
  queue/object-storage, legal/external-license, networked-Hunt,
  independent-review, authorized-fixture/consent, external-operation, and
  no-Team/Studio/Enterprise-GA claims checkboxes.

Known external-gate classes must be recorded precisely, not used as a reason
to stop the whole goal:

- HUNT-008–011: trusted or licensed publisher roots, recipe provenance,
  bounded execution qualification, and independent security review.
- PLAN-CLI-001/002/004 and TEAM-CLI-001/002: production signer/trust-root
  activation, tenant/deployed activation, policy-row reconciliation, live
  hosted fetch, and hosted SCM/provider integration.
- PLAN-CLI-003: authenticated production modified-client behavior and complete
  list/search/export/public-private runtime evidence.
- STUDIO-CLI-001: hosted upload/custody, independent redaction proof, and
  Studio recipient/customer acceptance.
- ENT-CLI-001: operational credential exchange, approved isolated runner
  execution/result reconciliation, cross-platform evidence, and independent
  review.
- LIC-002/003: legal/licensing/provenance disposition and final release
  qualification.
- DIST-001–003/006: dependent product/legal/trusted publishing/provenance and
  authenticated rollback/revocation evidence. Local DIST-006 rehearsal
  hardening is progress, not complete rollback acceptance.
- QUAL-CLI-004/006: independent review, trusted release identity, legal
  disposition, and final acceptance.
- Web and GitHub items: isolated Test Mode lifecycle, production
  preflight/reconciliation, authenticated paid/org fixtures, field runtime
  evidence, final truth review, GitHub App identity/permissions/token
  lifecycle, delivery replay protection, reconciliation, and authorized
  organization cutover.

When an item is blocked, record it once in the private tracker with:

- exact ID and acceptance criterion;
- implementation already completed;
- exact missing evidence or external operation;
- named owner or responsible organization;
- expiry/review date;
- safe next action;
- release decision while the gate remains open.

Then remain on the same active item and work only on its unblock path. Do not
relabel a blocked gate as complete or jump to the next item merely to improve
the score. Once the complete blocked record is committed, park the item and
select the first dependency-ready unchecked item from the top of the backlog;
do not repeatedly rerun unchanged tests to fill time.

## 6. Fat-batch acceptance protocol

Every substantial batch must identify:

- backlog IDs;
- acceptance criteria;
- dependencies and external-state requirements;
- repository and exact branch/base;
- implementation boundary;
- evidence required;
- active phase PR;
- production/database/payment/deployment write status;
- machine-load plan.

While the execution lock in this goal is active, a batch contains exactly one
backlog ID: `PLAN-WEB-014`. A gate, Production check, documentation update,
or test batch may be included only when it directly implements, unblocks,
qualifies, or records evidence for that ID.

Then complete, as applicable:

1. implementation;
2. integration;
3. focused tests;
4. security and adversarial tests;
5. typecheck/build/schema/migration checks;
6. acceptance review;
7. PR and hosted-CI verification;
8. private tracker reconciliation.

After the batch:

- recalculate the exact checked/unchecked/total count;
- give a concise user-facing shipping showcase: what was implemented or
  repaired, which product surface is now demonstrable, the relevant files and
  commits/PRs/deployment, and the evidence that proves it;
- list accepted IDs;
- list attempted-but-open IDs and missing evidence;
- list repository commits and push/PR/merge state;
- list tests and actual totals, including skips and limitations;
- list private evidence and documentation commits;
- state whether any production, database, payment, provider, deployment, or
  account write occurred;
- state whether the active ID was accepted or remains open, and state its exact
  next unblock action or blocker. Do not name a different backlog item as the
  next batch while the active ID remains open.

Keep the backlog, traceability, execution ledger, status, decisions, risks,
release gates, truth registry, and evidence mutually consistent. Make one
compact private documentation commit per substantial batch. Never push private
tracker documents to public remotes.

## 7. Production, database, and credential safety

Standing founder authorization permits required work within this shipping
objective, including inspection, test deployment, provider qualification,
rollback, and operational cutover, but it does not waive operation-specific
safety evidence.

Before any irreversible production operation, require all of:

- exact reviewed SQL or provider operation;
- dry-run result and row counts;
- backup/snapshot evidence;
- restore rehearsal;
- reconciliation criteria;
- rollback or forward-fix procedure;
- bounded execution plan;
- post-write verification.

A reviewed code-only Production deployment is also an in-scope shipping
operation. It must have a clean build, runtime configuration validation, a
known rollback deployment, a bounded smoke plan, and a post-deploy result.
It may ship code while a feature remains fail-closed. It must not be used to
silently activate Test Mode billing, bypass an unresolved database migration,
or claim a payment lifecycle that has not been qualified.

Rules:

- First inspect production schema, migration history, permissions, provider
  configuration, and aggregate evidence read-only.
- A provider-management token is not automatically a SQL credential.
- Never pass database or provider credentials in command-line arguments.
- Never print or paste secrets into chat, logs, PRs, or public repositories.
- Treat any exposed production credential or token as compromised: revoke,
  rotate, replace, redeploy, and verify bounded read-only behavior before use.
- Never run production DDL, DML, migrations, backfills, cutovers, deletions,
  payment charges, billing changes, or other state-changing writes without
  the operation-specific preflight above. Production code deployments are
  allowed only under the code-rollout preflight described above.
- If access, backup evidence, provider configuration, or customer
  authorization is insufficient, pause only that operation and continue
  independent product work.
- Never bypass MFA/CAPTCHA, invent browser sessions, fabricate payment
  confirmation, or claim provider/customer/reviewer evidence that was not
  actually obtained.

## 8. Payment architecture and qualification

The QR-only direction is superseded. The current release-candidate decision is
Cards-only: implement and qualify a server- and catalog-driven
provider-hosted Razorpay Checkout/order and subscription flow that exposes
`card` only. UPI/QR, netbanking, wallets, EMI, Pay Later, eMandate, and other
hosted methods must be disabled or hidden in Preview and Production until they
are separately qualified. The UI must not promise a method the provider
configuration does not enable.

The checkout must bind the server-selected catalog snapshot, plan, cadence,
currency, amount, entitlement period, user, organization where applicable,
and checkout ID. Client input must never choose or override price,
entitlement duration, plan, or provider identity. Provider success/capture and
the signed webhook are authoritative for entitlement; polling is read-only and
cannot grant access.

For this release candidate, qualify `card` only in Razorpay Test Mode,
privately and redacted, across the full lifecycle matrix below. If the account
later needs another method, explicitly expand the declared method set, add its
fixtures and lifecycle evidence, and re-run the acceptance matrix before
release. Do not claim a method merely because Checkout renders its label.

The same qualification must cover the provider-subscription path now that the
catalog-bound subscription-creation route and owner-bound status read are
implemented. Webhook lifecycle code plus a route is still not acceptance until
real isolated Test Mode lifecycle evidence exists.

Entitlement evidence is mandatory, not an optional follow-up document. The
private record must connect the same redacted checkout/provider correlation to
the signed webhook verification, exactly one payment row, exactly one ledger
row, the correct user/tenant/organization binding, one license/entitlement,
and the resulting account-access decision. It must also show deduplication
for duplicate/replayed events, rejection or containment of out-of-order
events, and no unauthorized access after failure, cancellation, refund, or
expiry. Renewal must extend the existing entitlement rather than create a
duplicate, and a repair/reconciliation run must explain any pre-existing
aggregate discrepancy without manual entitlement-row edits. A rendered Cards
label, a local test, a direct database edit, a screenshot, or a synthetic
provider event is not enough.

Qualify across:

- checkout creation and display;
- success and failure;
- authorization and capture;
- full and partial refund;
- renewal, cancellation, and expiry;
- webhook signature validation;
- duplicate, replayed, and out-of-order events;
- provider retry and timeout behavior;
- exactly-once payment-ledger and entitlement/license behavior;
- tenant and organization binding;
- amount, currency, cadence, plan, and catalog-version binding.

Use an isolated non-production deployment, database, and webhook destination.
The test checkout must visibly identify itself as sandbox/test and must never
render a live QR or live payment URL. Production must reject test keys and
non-live configuration. If a provider sandbox cannot exercise a live-only
method, record the limitation, supported fallback, owner, evidence, and
release decision; do not fake the result.

Never use a production database for Preview payment testing. Never lower a
production price to `$1`. Never use a direct database row edit or founder
email allowlist as payment proof. An internal preview-only fixture may test
entitlement behavior, but it must be labeled as entitlement testing rather
than payment evidence.

Team, Studio, and Enterprise billing may not be claimed until each plan has a
reviewed catalog/price/entitlement contract, organization ownership and tenant
binding, provider customer/subscription/payment mapping, webhook lifecycle,
authorization/quota behavior, and non-production browser/runtime evidence.
Reconcile Team versus Studio naming against the canonical catalog before any
public copy change.

The exposed production QR and the prior “I've paid — check now” pending status
are historical safety findings only. Do not scan, pay, or treat them as
success. The production checkout’s visible methods are configuration/rendering
evidence, not payment-lifecycle acceptance.

## 9. Browser, Docker, and machine-load constraints

Before a browser batch, verify that Chrome DevTools can list/select the
Verglos page through `127.0.0.1:9222`. Use it for rendered behavior, network
status, console errors, accessibility snapshots, and performance traces. Do
not capture cookies, authorization headers, payment credentials, database
URLs, private response bodies, or personal data; redact payment identifiers.

Before a Docker batch, verify Docker health. Use bounded resources, concurrency,
repository size, trace duration, polling, and log volume. Reuse existing
images, caches, and worktrees when safe. Stop only the exact runaway process,
container, test, or trace started by the batch; never use broad destructive
cleanup.

Browser and Docker availability are prerequisites for some tests, not proof
that authentication, isolation, payment, production correctness, or a
backlog item passed.

## 10. Repository and release rules

Before planning, read `/Users/anuragyadav/Developer/TopNotchh-Workspace/brain`,
the current repository `AGENTS.md`/`CLAUDE.md`, and the current copies of the
shipping truth, architecture, backlog, traceability, execution ledger,
status, decisions, risks, release gates, truth registry, command/UI contract,
agent/MCP contract, final acceptance/POC, schema inventory, and Web migration
runbook.

For `verglos-cli`:

- preserve the public/private boundary;
- run affected tests, typecheck, build, process/adversarial tests, package and
  public-boundary checks, and platform checks;
- inspect current CLI PRs before creating another;
- keep internal shipping documents and fixture evidence private;
- do not publish the final npm version until the complete V1 is qualified.

For `verglos-web`:

- run affected tests, typecheck, build, schema/migration ordering,
  integration, security, and route/runtime checks;
- treat migration files as production-impacting;
- do not merge or deploy while required migration, restore, rollback, or
  provider evidence is unresolved;
- do not edit public pricing, landing, metadata, blog, or marketing surfaces
  until technical and truth gates pass.

For both repositories:

- fetch and inspect exact branch divergence;
- inspect final diff and staged file list before every push;
- use grouped, reviewable commits and one phase PR per repository;
- preserve unrelated user changes and untracked founder assets;
- never rewrite public history or force-push without explicit recovery review;
- verify hosted checks and the exact merged head before recording progress.

At release, qualify npm/pnpm installation, clean consumer installation,
exports, lockfile/workspace behavior, supported Node LTS versions,
Linux/macOS/Windows, CI integration, machine-readable output, monorepo and
single-package repositories, and applicable Next.js/React/Node API/serverless/
worker/CLI shapes. Native source analysis remains JavaScript/TypeScript
focused; other languages may be represented through imported SARIF, SBOM, or
external-engine evidence, but must not be advertised as native Verglos SAST.

## 11. Authorization, legal, and independent review gates

For every private or customer repository, obtain a private consent record
containing owner/organization, repository URL and exact commit SHA, permitted
paths and commands, network policy, findings-storage choice, allowed evidence
fields, retention/expiry, and revocation/deletion instructions. Do not upload
repository source or credentials into chat and do not put these records in the
public CLI repository.

For third-party materials, obtain a private legal addendum covering Trivy
image/release and NOTICE use, detect-secrets, scanner fixtures, Hunt
recipes/rules, modification and redistribution rights, trademark restrictions,
required notices, scope, expiry, reviewer, and approval date.

An independent AppSec/security reviewer who did not implement the Hunt
sandbox must review the exact current CLI commit, run Linux/Docker adversarial
tests, document findings and residual risks, and sign the private review
packet with name/organization, scope, tests, findings, recommendation, and a
verifiable approval reference. Founder consent or an AI-generated signature is
not independent review evidence.

Codex may prepare code, tests, templates, sanitized evidence packets, and
instructions. It must leave the corresponding checkbox open until the real
external artifact exists.

## 12. Final corpus, company-shaped POC, and go/no-go

Do not source, clone, or deeply analyze the final company-shaped corpus until
implementation, integration, qualification, release gates, and the
release-candidate freeze are complete. The founder will provide final
authorized repositories and POC inputs. Public repositories may be used only
for earlier bounded qualification when explicitly allowed; they are not
customer acceptance.

After the candidate is frozen, the final POC must cover founder-supplied
company/use-case shapes and revenue scenarios from ₹0 through approximately
₹1 crore, ₹10 crore, ₹50 crore, and ₹100 crore annual revenue. Revenue is a
scenario axis, not a fabricated customer or traction claim.

Exercise every canonical plan after plan-name reconciliation. A plan counts
only when its entitlements, limits, organization roles, billing/payment state,
CLI behavior, Web behavior, upgrade/downgrade, denial, and audit evidence are
exercised.

Record exact authorization, commit, license, plan, revenue-band scenario,
configuration, runtime, findings, resource use, reproducibility, adjudication,
and limitations privately. Use held-out repositories for false-positive and
false-truth evaluation; do not tune against the holdout. Keep repository
contents, customer data, credentials, reports, detailed findings, and
competitive intelligence private.

## 13. Completion standard

This goal is complete only when:

- every required backlog item is genuinely accepted or explicitly blocked with
  an owner, evidence gap, expiry/review date, and release decision;
- the company feature map, architecture blueprint, truth registry, plan
  reconciliation, acceptance/POC document, and public capability surfaces
  agree on what is current, partial, planned, or excluded;
- all critical release gates pass;
- CLI, Web, cross-repository, supported-runtime, and platform verification
  passes;
- Hunt authority, provenance, bounded execution, isolation, and adversarial
  review are complete;
- If Web SCM is in the V1 release scope, GitHub App/org identity, permissions,
  token lifecycle, delivery replay protection, reconciliation, and authorized
  cutover are qualified; if V1 is npm/CLI-only, the Web SCM items are
  explicitly deferred rather than silently treated as npm requirements;
- the Web billing surface has a real provider-subscription creation route,
  with server-catalog binding and isolated Test Mode renewal/cancellation/
  expiry evidence, before claiming recurring payment completeness;
- the current release candidate's declared payment method set is `card` only,
  and Cards is fully qualified; any future method expansion has its own
  provider-supported matrix, limitation record, and release decision;
- production migrations, reconciliation, backup/restore, rollback, and
  recovery are qualified where required;
- Production has a dated code-deployment, configuration, smoke,
  reconciliation, monitoring, and rollback record; Production billing and
  database activation are either fully qualified with their own preflight or
  explicitly recorded as blocked with an owner, evidence gap, and release
  decision;
- independent legal, licensing, security, and customer-authorization gates
  are satisfied;
- the authorized final POC and held-out false-positive/false-truth evidence
  are complete;
- backlog, traceability, execution ledger, status, truth registry, decisions,
  risks, release gates, and evidence agree with implementation;
- unsupported public claims are removed or corrected;
- final PRs, deployment, billing, payment, rollback, and release procedures
  are verified;
- no marketing surface, npm version, release tag, or launch operation was
  changed prematurely.

Do not mark the goal complete based on commit volume, green CI alone,
preparatory code, a lower checkbox count, public fixture scans, a partial
deployment, or a partial hosted flow.

## 14. Resume instruction

At resume, perform this exact sequence:

1. Read `brain`, repository instructions, this goal, and the live private
   backlog.
2. Recompute the scoreboard and open-ID list; report **219/61/280 (78.2%)**
   only as the starting checkpoint, then trust the recomputed result.
3. Read the nine-gate matrix and Production execution track in Section 4 and
   update the execution ledger with each gate's status, owner, missing
   artifact, next action, and write boundary.
4. Work only on `PLAN-WEB-014`: verify the Cards-only application and hosted
   Checkout configuration from Web `445d8ed`, complete the recurring card
   provider authorization, reconcile entitlement evidence, and repair the
   active blocker. Production read-only/code-rollout work is allowed only when
   it directly supports this item. Do not start another backlog item or gate
   until `PLAN-WEB-014` is accepted or genuinely blocked with a current
   release decision. The subscription-creation implementation batch is
   complete in Web `54e6fd0`; the hosted display repair is `445d8ed`; the
   remaining work is isolated Preview/Test Mode lifecycle evidence and
   reconciliation.
5. Inspect current CLI and Web branches/PRs and verify recorded heads. Keep
   duplicate PR #169 closed and do not count it as shipping progress.
6. For each batch, record IDs, criteria, dependencies, evidence, production/
   database/payment/provider write boundary, and machine-load plan before work.
7. Implement and qualify the batch with focused tests, required integration,
   security/adversarial checks, typecheck, build, schema, and migrations.
8. Inspect public/private boundaries, exact diff, staged files, hosted PR state,
   and deployment/provider results where applicable.
9. Reconcile the backlog, execution ledger, evidence, decisions, risks,
   release gates, Production deployment/smoke result, and status; report the
   exact new score.
10. If the active item is externally blocked, record the real owner, missing
    artifact, expiry/review date, safe next action, and release decision once;
    do not fabricate a signature, consent, legal approval, customer result,
    provider lifecycle, or trusted publication. Continue only with the same
    item's unblock path until its complete blocked record is committed. After
    that record, park the item and select the first dependency-ready unchecked
    item from the top of the backlog; do not skip an earlier parked item or
    use the block to inflate the score.
11. After Gate 4 is genuinely closed, resolve npm/CLI-only versus Web SCM
    scope before Gate 5. Do not treat GitHub/GitLab integration as an npm
    publishing prerequisite.
12. Keep only unqualified Production payment/database writes, customer
    fixtures, legal gates, AppSec approval, protected publishing, and final
    POC acceptance closed until their actual evidence and operation-specific
    preflights exist. Continue Production code, read-only audit, smoke,
    monitoring, reconciliation, and rollback work only when it directly
    supports the active item; otherwise leave it queued until that item is
    accepted or genuinely blocked.

The next batch must not begin with a repeated unchanged suite, a speculative
marketing edit, a production payment click, a direct database entitlement
edit, or a claim that local substrate equals hosted capability.

## 15. Private evidence references

The latest Test Mode plan, Preview deployment, Production deployment, and
Production smoke evidence is:

`docs/shipping/evidence/plan-web-011-015-test-mode-plans-production-rollout-2026-10-09.md`

The latest exact Production code-rollout evidence is:

`docs/shipping/evidence/plan-web-014-subscription-invoice-reconciliation-and-production-rollout-2026-10-09.md`

The latest rollback boundary evidence is:

`docs/shipping/evidence/dist-006-rollback-boundary-completeness-2026-10-09.md`

The latest current-head Hunt evidence is:

`docs/shipping/evidence/hunt-docker-adversarial-origin-main-2026-10-09.md`

The current independent Hunt reviewer packet is:

`docs/shipping/evidence/hunt-independent-review-packet-2026-10-09.md`

The current legal/licensing review addendum is:

`docs/shipping/legal/legal-review-addendum-2026-10-09.md`

The latest Vercel configuration evidence is:

`docs/shipping/evidence/vercel-production-preview-config-audit-2026-10-09.md`

The latest current Production fail-closed audit is:

`docs/shipping/evidence/production-current-fail-closed-audit-2026-10-09.md`

The latest account-deletion qualification evidence is:

`docs/shipping/evidence/qual-web-005-deletion-route-e2e-2026-10-09.md`

The latest authenticated account-runtime qualification evidence is:

`docs/shipping/evidence/qual-web-006-authenticated-account-runtime-2026-10-09.md`

The latest payment qualification and Gate 4 evidence is:

`docs/shipping/evidence/plan-web-014-preview-hosted-payment-lifecycle-2026-10-09.md`

The latest subscription invoice-binding and Production rollout evidence is:

`docs/shipping/evidence/plan-web-014-subscription-invoice-reconciliation-and-production-rollout-2026-10-09.md`

The latest hosted retry and current Production deployment evidence is:

`docs/shipping/evidence/plan-web-014-hosted-retry-production-rollout-2026-10-09.md`

The latest lifecycle-ordering and provider-to-database reconciliation evidence
is:

`docs/shipping/evidence/plan-web-014-lifecycle-ordering-reconciliation-2026-10-09.md`

The latest CLI API-origin hardening and provider-renewal-boundary evidence is:

`docs/shipping/evidence/cli-api-origin-hardening-and-provider-renewal-limit-2026-10-09.md`

The latest expiry-lifecycle and current Preview qualification evidence is:

`docs/shipping/evidence/plan-web-014-expired-lifecycle-preview-2026-10-09.md`

The latest invoice-only subscription-failure qualification and current
Test Mode credential blocker evidence is:

`docs/shipping/evidence/plan-web-014-failed-subscription-invoice-binding-2026-10-09.md`

The latest checkout terminal-lifecycle repair evidence is:

`docs/shipping/evidence/plan-web-014-checkout-terminal-lifecycle-2026-10-09.md`

The latest Preview-auth and complete Production-boundary evidence is:

`docs/shipping/evidence/production-and-preview-auth-rollout-2026-10-09.md`

The latest Preview subscription-authorization limitation evidence is:

`docs/shipping/evidence/plan-web-014-preview-subscription-otp-limitation-2026-10-09.md`

The latest Production read-only smoke evidence is:

`docs/shipping/evidence/production-readonly-smoke-2026-10-09.md`

The latest Cards-only hosted-display and current Production rollout evidence
is:

`docs/shipping/evidence/plan-web-014-cards-only-hosted-config-and-production-rollout-2026-10-10.md`

The latest protected Preview order-route and hosted-display qualification
evidence is:

`docs/shipping/evidence/plan-web-014-cards-only-preview-route-and-hosted-display-2026-10-10.md`

The latest Test Mode card activation-boundary evidence is:

`docs/shipping/evidence/plan-web-014-testmode-card-activation-boundary-2026-10-10.md`

The latest Test Mode webhook-ingress and pause/resume evidence is:

`docs/shipping/evidence/plan-web-014-testmode-webhook-ingress-pause-resume-2026-10-10.md`

The latest CLI standards-corpus evidence is:

`docs/shipping/evidence/qual-cli-006-standards-corpus-current-2026-10-09.md`

The latest official CycloneDX/Cosign qualification evidence is:

`docs/shipping/evidence/qual-cli-006-official-cyclonedx-cosign-2026-10-09.md`

The earlier payment decision and backlog acceptance are recorded in private
commit `5a99b0d`; the preceding payment qualification evidence commit is
`8eb85b7`. The latest protected Preview route and Cards-only display evidence
is recorded in private commit `995f8398`.

The private tracker’s backlog, status, execution ledger, traceability,
decisions, risks, release gates, evidence, and this goal are the source of
truth for the score and acceptance state. Keep this goal active until the
completion standard is actually satisfied.

### 2026-10-10 execution checkpoint — Preview ingress repaired; recurring-card proof remains

The authenticated Razorpay Test Mode Dashboard was used to replace the stale
automation bypass only on the isolated Preview webhook. A read-only request to
that Preview endpoint returned HTTP 405, proving the request reached Verglos'
webhook route rather than the Vercel protection wall. Production was not
selected or changed.

One exact active Test Mode Pro/monthly subscription matched one isolated
`billing_subscriptions` row. The documented provider pause operation returned
HTTP 200 and produced one completed signed `subscription.paused` event; the
documented resume operation returned HTTP 200 and produced one completed signed
`subscription.resumed` event. The application row returned to `active`.

The bounded recurring-card attempt still did not authorize or capture. The
initial general test fixture was rejected as not eligible for recurring
payments; the official subscription fixture remained in provider
tokenization/OTP flow. No OTP was guessed or entered. One provider
`payment.failed` event completed, but no new captured payment, ledger grant,
entitlement, or license was observed. Read-only aggregates are captured 3,
failed 4, partially refunded 1, refunded 3, active licenses 2, and 75
completed webhook events.

This is Gate 4 ingress/lifecycle progress only. `PLAN-WEB-014` and Gate 4
remain open for recurring-card authorization/capture and complete
payment/ledger/license reconciliation. The authenticated Test Mode
Subscriptions detail page exposed no provider `charge now` control, so no
additional provider action was taken through an undocumented endpoint. The
published Test Card guide's random OTP instruction applies to the later
sample-payment page, not the saved-card tokenization-eligibility step that
stopped this recurring flow. The
score remains **219 checked / 61 unchecked / 280 total / 78.2%**; no checkbox
changed.

Evidence:
`docs/shipping/evidence/plan-web-014-preview-webhook-bypass-pause-resume-2026-10-10.md`.

### 2026-10-10 continuation requalification — Cards-only surfaces and provider boundary

Fresh read-only checks confirm the deployed Production checkout exposes
Cards-only with subscription creation disabled, while the isolated Preview
checkout exposes Cards-only with Test Mode subscription creation enabled. The
authenticated Razorpay webhook detail shows HTTP 200 for the completed
`payment.failed`, `subscription.paused`, and `subscription.resumed` deliveries;
older 401 rows are historical protection failures. The Dashboard exposes no
replay or charge-now control for the selected target.

The provider inventory remains HTTP 200 with five active subscriptions, one
with two paid cycles and four with one. The isolated database currently has
active 5, cancelled 8, pending 23 subscriptions; captured 3, failed 4,
partially refunded 1, refunded 3 payments; two active licenses; and 75
completed webhook events. The new pending attempts do not prove authorization,
capture, entitlement, or renewal.

The remaining external blocker is a supported Razorpay Test Mode recurring-card
tokenization/authorization fixture or official replay/charge control. Owner:
Verglos release owner with the Razorpay Test Mode account owner; review by
2026-10-17. Gate 4 and `PLAN-WEB-014` remain open, and the score remains
**219 checked / 61 unchecked / 280 total / 78.2%**; no checkbox changed.

### 2026-10-10 execution amendment — production-inclusive checkbox closure mode

The current provider-webhook configuration work is complete. Do not repeat an
unchanged Dashboard/webhook probe as progress. The live private tracker, not
historical paragraphs lower in this file, is authoritative for the current
score, active item, and queue: **223 checked / 57 unchecked / 280 total
(79.6%)**. The first unchecked backlog item is `HUNT-008`; its current
implementation qualification is recorded, but trusted/licensed recipe
provenance, approval wiring, and an independent AppSec review are still
missing. Those external requirements cannot be replaced by founder consent or
an agent-signed report.

`verglos-web/.env.gates.testing` is an authorized Razorpay Test Mode input for
isolated Preview qualification only. Read it with a safe dotenv parser when
needed; never print its values, source it as shell code, copy it to Production,
or treat its presence as gate evidence. It does not contain permission to
perform Production billing or entitlement writes.

Production is in scope for reviewed code deployment, read-only verification,
and operation-specific state changes. Before any Production write, require a
dry run, exact target and mode check, current backup/snapshot, restore
rehearsal, reconciliation criteria, rollback or forward-fix plan, and
post-write verification. Keep provider Test Mode keys, Test Mode plan IDs,
Preview databases, fixture identities, and bypass values out of Production.

The execution priority is now checkbox closure, one item at a time:

1. Recompute the score from the live backlog after every substantial batch.
2. Scan from the top and select the first unchecked item whose dependencies
   are genuinely ready; implement the smallest complete slice, run the tests
   and relevant hosted/Production verification, and write private evidence.
3. Update the backlog, `STATUS.md`, `EXECUTION_LEDGER.md`, traceability,
   decisions/risks, and this goal in the same tracker batch. Check a box only
   when every acceptance criterion is evidenced.
4. If the selected item is externally blocked, record the owner, missing
   artifact, review/expiry date, safe unblock action, and release decision,
   then select the next dependency-ready unchecked item. Do not fabricate an
   approval, silently skip the queue, or retry an unchanged provider path.

This amendment supersedes stale historical statements in this file that name
`PLAN-CLI-001`, `PLAN-WEB-014`, or the 219/61 score as the current active
checkpoint. It does not close Gate 4 or any backlog item by itself.

### 2026-10-10 HUNT-008 supplementary Docker qualification

The pinned Docker adversarial run completed with **60 passes / 1 explicit
macOS namespace skip / 0 failures** at CLI source commit
`ad6ee1479c887c59eb6630da4754a2e0b7b4045e`. This is useful qualification
evidence, but it is not a Linux namespace result, independent AppSec review,
trusted recipe provenance, or legal approval. `HUNT-008` remains unchecked and
parked; the score remains **223/57/280 (79.6%)**.

Evidence:
`docs/shipping/evidence/hunt-008-docker-adversarial-macos-2026-10-10.md`.
