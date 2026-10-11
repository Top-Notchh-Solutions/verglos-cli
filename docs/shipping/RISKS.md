# Verglos V1 risk register

## 2026-10-11 · R-PUBLIC-SYNC-001 public/private history boundary mitigated

- **Risk:** Local shipping branches can contain private tracker history that
  would fail the public CLI boundary audit if pushed directly.
- **Verification:** The first CLI candidate was closed after the audit found
  private `docs/shipping` history. The replacement CLI PR was rebuilt from
  current public `main`; its public-boundary audit, self-scan, in-toto binding,
  and complete platform matrix all passed. Web PR #173 also passed its local
  and hosted checks.
- **Status:** Mitigated for this synchronization. No private tracker content
  was pushed; no backlog checkbox changed. Continue using fresh public-main
  branches for public CLI changes.
- **Next:** Resume the dependency-ready queue at `QUAL-WEB-006` only after
  this ledger update.
- **Evidence:**
  `docs/shipping/evidence/public-repository-sync-2026-10-11.md`.

## 2026-10-11 · R-TEAM-CLI-001 hosted policy trust boundary

- **Risk:** A locally passing policy verifier could be mistaken for an
  activated Verglos organization policy trust root or live GitHub binding.
- **Verification:** Shipping worktree tests pass 8/8 and the CLI dependency
  graph typecheck/build passes 12/12; the implementation remains fail-closed
  without a trusted active key, matching hosted policy row, or valid scope.
- **Status:** Code-qualified but externally blocked. Keep TEAM-CLI-001 and
  dependent SCM rows unchecked until the named signer, company installation,
  repository binding, and hosted delivery evidence exist.
- **Owner/next action:** Release owner plus TopNotchh organization
  administrator; activate the bounded test trust root, bind the company test
  repository, and run the live fetch/cache/provider matrix.
- **Evidence:**
  docs/shipping/evidence/team-cli-001-code-qualification-block-2026-10-11.md.

## 2026-10-11 · R-PRO-008 billing contract aligned

- Risk: A Pro customer could mistake legacy subscription rows or provider
  invoice metadata for automatic renewal or a tax-invoice product.
- Verification: Web d4dd7f9 labels legacy subscriptions as
  reconciliation-only, exposes an owner-managed manual-renewal link to the
  Cards-only checkout, and explicitly withholds invoice documents, tax
  payloads, and provider URLs. Existing server-side member/allowance/usage
  projections remain tenant scoped.
- Status: PRO-008 accepted under the Final V1 prepaid contract. The remaining
  risk is external release/SCM/Hunt/legal/acceptance qualification, not an
  unbounded client-side billing control.
- Evidence:
  docs/shipping/evidence/pro-008-final-v1-billing-view-2026-10-11.md.

## 2026-10-11 · R-PLAN-WEB-012 lifecycle contract reconciled

- **Risk:** Legacy recurring-subscription code could be mistaken for a V1
  customer promise or leave payment and entitlement state inconsistent.
- **Verification:** Final V1 prepaid Preview/Docker evidence covers signed
  capture/failure/refund, manual renewal, expiry projection, replay/order,
  retry, and exactly-once payment→ledger→license behavior; compatibility
  cancellation/replay evidence remains preserved.
- **Status:** `PLAN-WEB-012` accepted after explicitly retiring automatic
  recurring renewal from the V1 promise. Do not advertise recurring renewal.
- **Evidence:**
  `docs/shipping/evidence/plan-web-012-final-v1-lifecycle-reconciliation-2026-10-11.md`.

## 2026-10-11 · R-PLAN-WEB-015 Production contract reduced

- **Risk:** Production billing could expose a method or Test Mode state that
  conflicts with the Final V1 prepaid Cards-only contract.
- **Verification:** Read-only environment and live-page checks found exactly
  `card`, HTTP 200, Cards only, no Test Mode, and no non-card method marker.
- **Status:** `PLAN-WEB-015` accepted for the no-write Production contract;
  provider lifecycle remains isolated Preview evidence under PLAN-WEB-014.
- **Evidence:**
  `docs/shipping/evidence/plan-web-015-production-cards-only-display-2026-10-11.md`.

## 2026-10-11 · R-PLAN-CLI-003 modified-client boundary reduced

- **Risk:** A modified client could try to select a higher plan, cross tenant
  scope, or read private/public record surfaces.
- **Verification:** Isolated Preview paid and authenticated matrices covered
  forged plan, capability, tenant, usage/query, list/search, download/export,
  and public/private cache inputs. The server preserved the active Pro
  projection and bounded authorization/not-found responses.
- **Status:** `PLAN-CLI-003` accepted. Remaining risk is external Hunt
  provenance/reviewer qualification and separate hosted SCM/release/legal
  gates, not an untested modified-client route in this matrix.
- **Evidence:**
  `docs/shipping/evidence/plan-cli-003-preview-paid-modified-client-matrix-2026-10-11.md`.

## 2026-10-11 · R-PLAN-WEB-014 prepaid provider terminal-result boundary

- **Risk:** Isolated Preview now creates the canonical Cards-only prepaid
  order successfully, but this run has no provider terminal capture/failure,
  signed webhook, ledger/entitlement transition, expiry, or second-order
  renewal evidence.
- **Impact:** Gate 4 and `PLAN-WEB-014` cannot yet claim a complete payment
  lifecycle.
- **Owner:** Authorized payment-test operator and Razorpay Test Mode
  operations.
- **Safe next action:** Complete only the provider-supported Test Mode card
  terminal path, then reconcile the signed event in isolated Preview. Do not
  guess OTPs, fabricate events, edit rows, or use Production checkout.
- **Status:** Code and order-creation progress recorded; score remains
  **223 checked / 57 unchecked / 280 total (79.6%)**.
- **Evidence:**
  `docs/shipping/evidence/plan-web-014-preview-prepaid-order-creation-2026-10-11.md`.

## 2026-10-11 · R-HUNT current runtime is code-qualified but not externally accepted

- **Risk:** The current bounded Hunt runtime, fixed recipe catalog, MCP
  binding, and deny-by-default adapters pass repository tests, but final
  customer enablement still depends on trusted/licensed recipe provenance,
  independent AppSec review, legal approval, and hosted/customer evidence.
- **Impact:** Checking the Hunt and final acceptance rows now would overstate
  shipping readiness.
- **Safe next action:** Preserve the passing package evidence, obtain the
  required provenance/reviewer approvals, then run the Linux/Docker and
  hosted/customer acceptance matrix against the exact source commit.
- **Status:** Code-side qualification passed; external gates remain open.
- **Evidence:**
  `docs/shipping/evidence/cli-current-main-reconciliation-2026-10-11.md`.

## 2026-10-11 · R-PLAN-WEB-014 prepaid-card provider OTP boundary

- **Risk:** Isolated Preview now reaches the canonical Cards-only order and
  Razorpay hosted card flow, but the provider remains at `Sending OTP` after
  successful card-create and consent requests.
- **Impact:** Capture/failure/refund, signed webhook delivery, payment-ledger
  transition, fixed-term entitlement, expiry, and manual-renewal second-order
  reconciliation cannot yet be claimed.
- **Owner:** Authorized payment-test operator and Razorpay Test Mode
  operations.
- **Safe next action:** Use the provider's official OTP/fixture or supported
  terminal-event replay only. Do not guess OTPs, fabricate events, edit rows,
  or test the Production checkout.
- **Status:** Real hosted progress recorded; `PLAN-WEB-014` and Gate 4 remain
  open. Score is **223 checked / 57 unchecked / 280 total (79.6%)**.
- **Evidence:**
  `docs/shipping/evidence/plan-web-014-preview-prepaid-card-hosted-qualification-2026-10-11.md`.

## 2026-10-11 · R-PLAN-WEB-015 lifecycle evidence remains incomplete

- **Risk:** Production correctly displays Cards-only fixed-term checkout, but
  the display does not prove the full prepaid lifecycle.
- **Impact:** Payment truth could still drift from webhook, refund, expiry, or
  manual-renewal reconciliation if those are not qualified separately.
- **Safe next action:** Run the isolated canonical card lifecycle against the
  current deployment and preserve provider-signed evidence; never press the
  Production checkout or edit payment/entitlement rows for evidence.
- **Status:** Contract display aligned; lifecycle checkbox remains open.
- **Evidence:**
  `docs/shipping/evidence/plan-web-015-production-cards-only-display-2026-10-11.md`.

## 2026-10-11 · R-ACCEPT-002 external story acceptance absent

- **Risk:** Repository-owned acceptance substrates are green, but several
  frozen stories still lack hosted/provider/customer or independent evidence.
- **Impact:** The full acceptance corpus cannot be called complete and cannot
  authorize final publication.
- **Safe next action:** Run each remaining authorized external story with its
  required evidence owner and preserve failures as limitations.
- **Status:** Substrate revalidated; acceptance gate remains open. Score is
  **223 checked / 57 unchecked / 280 total (79.6%)**.
- **Evidence:**
  `docs/shipping/evidence/accept-002-current-head-substrate-recheck-2026-10-11.md`.

## 2026-10-11 · R-QUAL-WEB-006 remaining human/field qualification

- **Risk:** Production account rendering is accessible and fast in the lab
  run, but this does not establish human screen-reader behavior, large
  authenticated dataset behavior, or field CWV.
- **Impact:** Complete accessibility/performance acceptance cannot be claimed.
- **Safe next action:** Run the authorized screen-reader and large-data
  scenarios and collect field CWV after the required customer/organization
  state is available.
- **Status:** Partial evidence recorded; checkbox and release gate remain open.
- **Evidence:**
  `docs/shipping/evidence/qual-web-006-production-readonly-cdp-2026-10-11.md`.

## 2026-10-11 · R-DIST-001 dependent product/release qualification absent

- **Risk:** The six public archives now have a clean package boundary and
  install together, but the final release claim depends on qualified
  `LOCAL/HUNT/RECORD` product surfaces and legal/release decisions.
- **Impact:** The package cannot yet be treated as the final V1 release or
  published artifact.
- **Owner:** Release qualification owner, with Hunt/Attest and legal owners.
- **Safe next action:** Complete the dependent product evidence, reconcile the
  legal record, then rerun the exact archive and clean-consumer qualification.
- **Status:** Code-side boundary repaired; release gate remains open. Score is
  **223 checked / 57 unchecked / 280 total (79.6%)**.
- **Evidence:**
  `docs/shipping/evidence/dist-001-package-boundary-recheck-2026-10-11.md`.

## 2026-10-11 · R-LIC-003 final notice/archive qualification absent

- **Risk:** Notice generation is deterministic, but no current release archive
  has been inspected against the exact dependency graph and unresolved legal
  record.
- **Impact:** Public package notice completeness and redistribution readiness
  cannot be claimed.
- **Owner:** Release/legal qualification owner.
- **Safe next action:** Build the exact candidate archives, inspect every
  package surface and notice, reconcile with `LIC-002`, and obtain the
  authorized legal decision before publication.
- **Status:** Generator revalidated; final artifact/legal gate open. Next
  dependency-ready assessment is `DIST-001`.
- **Evidence:**
  `docs/shipping/evidence/lic-003-notice-generator-recheck-2026-10-11.md`.

## 2026-10-11 · R-LIC-002 external-content approval remains absent

- **Risk:** Mechanical dependency inventory is clean, but external engine,
  database, fixture, Hunt-content, and trademark rights are not legally
  approved for the exact release scope.
- **Impact:** Redistribution and public release cannot claim complete legal or
  notice qualification.
- **Owner:** Authorized company/legal reviewer and release owner.
- **Safe next action:** Review the exact release artifacts and complete the
  private addendum with decisions, conditions, reviewer identity, scope,
  expiry, and verifiable approval. Keep unresolved assets unbundled and do
  not publish until disposition is recorded.
- **Status:** Mechanical inventory passed; legal gate open. Next
  dependency-ready assessment is `LIC-003`.
- **Evidence:** `docs/shipping/evidence/lic-002-technical-recheck-2026-10-11.md`.

## 2026-10-11 · R-STUDIO-CLI-001 hosted recipient acceptance absent

- **Risk:** The CLI projection and Web custody route enforce the intended
  allowlist and digest/tenant binding locally, but recipient-side redaction
  and an authorized Studio acceptance have not been independently observed.
- **Impact:** Studio customer-held projection/custody cannot be claimed as
  fully accepted.
- **Owner:** Verglos release owner / authorized Studio recipient.
- **Safe next action:** Use an isolated authorized Studio recipient, capture
  the exact redacted projection and stored digest through the supported route,
  and record independent review/customer acceptance. Do not upload source or
  private findings and do not edit custody rows directly.
- **Status:** Code-side revalidated; hosted/customer gate open. Next
  dependency-ready assessment is `LIC-002`.
- **Evidence:**
  `docs/shipping/evidence/studio-cli-001-code-revalidation-2026-10-11.md`.

## 2026-10-11 · R-TEAM-CLI-001 hosted policy authority remains absent

- **Risk:** The CLI can verify and cache a policy safely, but the hosted
  signer/trust root, mapped paid tenant, GitHub repository binding, canonical
  policy row, and live signed response are not activated.
- **Impact:** Team/Studio/Enterprise organization-policy acceptance and
  downstream SCM checks cannot be claimed.
- **Owner:** Verglos release owner / hosted organization-policy operator.
- **Safe next action:** Provision the authorized non-production tenant and
  repository binding through the application/provider path, publish the
  canonical policy, activate the approved signer, then capture the bounded
  signed-fetch/cache/offline/cross-tenant evidence. Do not create rows by
  direct database edit or use the entitlement key as a policy signer.
- **Status:** Code-side revalidated; hosted gate open. Next dependency-ready
  assessment is `STUDIO-CLI-001`.
- **Evidence:**
  `docs/shipping/evidence/team-cli-001-code-revalidation-2026-10-11.md`.

## 2026-10-10 · R-PLAN-WEB-014 webhook ingress partially mitigated

- **Risk:** Vercel Deployment Protection previously blocked Razorpay before
  the isolated Preview webhook route, preventing signed provider lifecycle
  reconciliation.
- **Evidence:** One Test Mode Preview target now uses a temporary, fresh
  automation-bypass query parameter; pause/resume events completed and the
  isolated row projected `active → paused → active`.
- **Residual risk:** The bypass is temporary and must be rotated/removed;
  provider renewal/payment delivery, replay/order, timeout/retry,
  exactly-once payment/ledger/license behavior, and complete reconciliation
  are still unqualified.
- **Owner:** Web/provider operations.
- **Severity:** High until the full Gate 4 matrix is accepted.
- **Mitigation:** Keep Production webhook disabled for Test Mode, retain
  Razorpay HMAC verification, use isolated Preview only, and clean up the
  bypass after the remaining qualification window.


## R-PLAN-WEB-014-TESTMODE-CARD-ACTIVATION · 2026-10-10

The isolated Test Mode subscription harness reached the card form, but the
official test-card fixture and two bounded activations produced no OTP,
success, failure, or terminal provider event. Provider and isolated database
aggregates were unchanged on read-only recheck. Owner: authorized payment-test
operator with Razorpay Test Mode operations. Missing artifact: a
provider-supported recurring-card authorization and signed delivery into
isolated Preview, followed by exact payment/ledger/license reconciliation.
Safe next action: use a changed provider fixture or a real operator
activation/OTP path; do not guess OTPs or edit rows. Review by 2026-10-11 IST
or on provider-fixture change. Gate 4 and `PLAN-WEB-014` remain open; no
Production write occurred.

Evidence:
`docs/shipping/evidence/plan-web-014-testmode-card-activation-boundary-2026-10-10.md`.

## R-PLAN-WEB-014-CARDS-ONLY-HOSTED-DISPLAY · 2026-10-10

Web `445d8ed` now passes the server-owned Cards-only display configuration to
order and subscription Checkout paths and disables provider default blocks.
The protected Preview create-order route returned HTTP 200 with Test Mode,
canonical catalog `2026-10-02.0`, and method set `card`. A fresh automated
provider frame did not render a usable form without real user activation, so
hosted modal visibility remains unverified by this batch. Owner: Web/provider
operations. Safe next action: use an authorized real browser activation or
provider-supported fixture, then reconcile the resulting signed lifecycle.
Gate 4 and `PLAN-WEB-014` remain open; no Production write occurred.

Evidence:
`docs/shipping/evidence/plan-web-014-cards-only-preview-route-and-hosted-display-2026-10-10.md`.

## R-CLI-SOURCE-DIVERGENCE · 2026-10-10

The local public CLI `main` (`d0a3b217`) is 73 commits ahead and 883 behind
the authoritative remote `origin/main` (`f5686b5c`) and contains founder-owned
untracked shipping assets. Local tests cannot be used as release-head proof
until the histories are reconciled. Owner: founder/release maintainer. Safe
containment: preserve the local tree, qualify only a detached upstream
worktree, and reconcile through an explicit reviewed merge or branch decision.
Gate impact: CLI release qualification, `QUAL-CLI-006`, distribution,
protected publishing, and final acceptance remain open. No source or release
state was changed by the audit.

Evidence: `docs/shipping/evidence/cli-source-divergence-2026-10-10.md`.

## R-PLAN-WEB-014-SUBSCRIPTION-OTP · 2026-10-10

The real isolated Test Mode subscription path reaches Razorpay card
tokenization, but authorization is waiting for an operator OTP. Provider state
is created with zero paid cycles; the application has a pending subscription
and one failed payment projection from the attempted card flow. Owner:
authorized payment-test operator/provider operations. Safe next action: enter
the received OTP in the open hosted checkout, then reconcile the signed event
and projections. Do not guess OTPs, edit rows, or grant entitlements. Gate 4
remains open.

Evidence:
`docs/shipping/evidence/plan-web-014-provider-subscription-authorization-otp-2026-10-10.md`.

## R-PLAN-WEB-014-PROVIDER-RENEWAL-RECONCILIATION · 2026-10-10

Test Mode reports two paid invoices for one active canonical monthly
subscription, while the matching isolated Preview subscription has no payment,
license, or `subscription.charged` projection. This prevents claiming renewal
or entitlement acceptance. Owner: Web/provider operations. Missing artifact:
provider delivery record or supported replay of the exact signed event to the
isolated webhook, followed by ledger/subscription/license reconciliation.
Safe next action: use the provider-supported delivery/replay path only; do not
edit rows or grant entitlements manually. Gate impact: Gate 4 and
`PLAN-WEB-011/012/014/015` remain open.

Evidence:
`docs/shipping/evidence/plan-web-014-provider-renewal-reconciliation-gap-2026-10-10.md`.

## R-PLAN-WEB-014-CARDLESS-EMI-BINDING · 2026-10-10 · resolved code/CI slice

Web PR #172 merged as `98dd571` after the hosted schema job passed with the
pinned ECR Public Postgres mirror. Production code rollout
`dpl_EtggBABkjCRWS9NWHozgH6qbvr5J` passed configuration and read-only smoke.
The provider `cardless_emi` representation is accepted only when canonical
`emi` is bound.

Residual risk remains for the full Gate 4 method/lifecycle matrix,
renewal/failure/expiry, refund replay/order, timeout/retry, exactly-once
behavior, complete reconciliation, and Production billing activation. Owner:
Web/provider/release operations. Gate impact: the observed code and CI gap is
resolved; Gate 4 and the mapped backlog items remain open.

Evidence:
`docs/shipping/evidence/plan-web-014-cardless-emi-merge-production-2026-10-10.md`.

## R-PLAN-WEB-014-CARDLESS-EMI-BINDING · 2026-10-10 · update

The provider Test Mode account returned a captured `cardless_emi` order payment
for a signed snapshot containing canonical `emi`. Web `210d880` now accepts
that one representation only when `emi` is bound and continues to reject
unbound methods.

Residual risk remains for the complete enabled-method matrix, provider
renewal/failure/expiry, refund replay/order, timeout/retry, exactly-once
behavior, and full provider/ledger/entitlement reconciliation. PR #172's
hosted schema job is also awaiting an external GitHub/Docker Hub service
availability fix after two rate-limit failures before test execution. Owner:
Web/provider/release operations. Gate impact: this repairs one Gate 4 code gap;
it does not close Gate 4 or any backlog checkbox.

Evidence:
`docs/shipping/evidence/plan-web-014-cardless-emi-binding-2026-10-10.md`.

## R-PLAN-WEB-014-PREVIEW-PARTIAL-REFUND · 2026-10-10 · update

The isolated Test Mode partial-refund path now has provider and application
evidence: a 140,471-paise refund returned HTTP 200, the provider reported a
processed cumulative refund while remaining captured, the signed Preview
event completed, and the payment ledger projected to `partially_refunded`.
The linked license remained active under the paid-time rule.

Residual risk remains for refund replay/order, all enabled methods, renewal,
provider failure/expiry, timeout/retry, exactly-once across the full matrix,
complete reconciliation, and Production activation. Owner: Web/provider
operations. Gate impact: this advances Gate 4 only; it does not close Gate 4
or any backlog checkbox.

Evidence: `docs/shipping/evidence/plan-web-014-preview-subscription-partial-refund-2026-10-10.md`.

## R-PLAN-WEB-014-PREVIEW-REFUND · 2026-10-10 · update

The isolated Test Mode refund path now has provider and application evidence:
the matched full refund returned HTTP 200, the provider reported one processed
refund, the signed Preview event completed, and the payment ledger projected
to `refunded` with the full watermark. The linked license remained active
under the paid-time rule.

Residual risk remains for partial/refund replay and ordering, all enabled
methods, renewal, provider failure/expiry, timeout/retry, exactly-once across
the full matrix, complete reconciliation, and Production activation. Owner:
Web/provider operations. Gate impact: this advances Gate 4 only; it does not
close Gate 4 or any backlog checkbox.

Evidence: `docs/shipping/evidence/plan-web-014-preview-subscription-refund-2026-10-10.md`.

## R-PLAN-WEB-014-PREVIEW-PAUSE-RESUME · 2026-10-10 · update

The isolated Test Mode provider accepted a bounded pause/resume operation and
the Preview webhook path completed both lifecycle events. The application
projected the recently updated subscription back to `active`, with no recent
payment or license creation.

Residual risk remains for renewal, provider-generated failure/expiry/refund,
all enabled payment methods, replay/out-of-order, timeout/retry, exactly-once,
complete provider/ledger/entitlement reconciliation, and Production
activation. Owner: Web/provider operations. Gate impact: this advances Gate 4
only; it does not close Gate 4 or any backlog checkbox.

Evidence: `docs/shipping/evidence/plan-web-014-preview-subscription-pause-resume-2026-10-10.md`.

## R-PROD-CURRENT-CODE-ROLLOUT-SMOKE · 2026-10-10 · update

Web `51e07f5` was merged as `b08bb509` and deployed READY to Production as
`dpl_ySGLm8Hx7DTjjSZd9Dx4tq7RrMxf`. Configuration validation and read-only
public smoke passed; checkout exposed no Test Mode, provider-test-key,
database, or protection-bypass marker, and HSTS was present. No Production
state-changing write occurred.

Residual risk remains for billing/database activation, full provider lifecycle
reconciliation, monitoring, restore, and rollback rehearsal. Owner: Web/release
operations. Gate impact: Production code rollout qualified only; Gate 4 and
Production activation remain open.

Evidence: `docs/shipping/evidence/production-lifecycle-binding-fix-rollout-2026-10-10.md`.

## R-PLAN-WEB-014-PREVIEW-CANCEL-WEBHOOK-RECONCILIATION · 2026-10-10 · update

Web `d8ddeda`/`51e07f5` repaired the observed provider-shape gap: signed
terminal lifecycle events can recover missing notes from the exact provider
subscription, and `current_end: null` is accepted. A final isolated Preview
Test Mode create/cancel returned HTTP 200/200; the protected endpoint emitted
no diagnostic failure; and the read-only isolated DB showed one recent
`cancelled` row with no recent payment or license row. The earlier pre-fix
`pending` row remains visible and was not manually edited.

Residual risk: only one cancellation slice is evidenced. Renewal,
failure/expiry/refund, all enabled methods, replay/out-of-order/exactly-once,
timeout/retry, full reconciliation, and cleanup of temporary provider webhook
targets remain open. Owner: Web/provider operations. Gate impact: Gate 4 and
`PLAN-WEB-011/012/014/015` remain open.

Evidence: `docs/shipping/evidence/plan-web-014-preview-subscription-webhook-binding-fix-2026-10-10.md`.

## R-PLAN-WEB-014-PREVIEW-CANCEL-WEBHOOK-RECONCILIATION · 2026-10-10

Two real canonical Test Mode subscription creates succeeded and their provider
cancellations returned HTTP 200/state `cancelled`. The isolated application
rows remained `pending`, and the owner-bound status route correctly returned
`processing/pending` without granting payment or entitlement. The evidence gap
is signed provider cancellation delivery to the isolated Preview endpoint and
the resulting DB transition, not a license workaround.

Owner: Web/provider operations. Missing artifact: provider delivery record plus
isolated webhook acceptance and reconciled `cancelled` row. Review before the
next Preview lifecycle run on 2026-10-10. Safe next action: configure a
provider-reachable isolated webhook target or capture a provider-supported
replay through the authorized protected path; do not disable protection or use
Production as a test target. Gate impact: Gate 4 and
`PLAN-WEB-011/012/014/015` remain open.

Evidence: `docs/shipping/evidence/plan-web-014-preview-subscription-create-cancel-reconciliation-2026-10-10.md`.

## R-QUAL-CLI-006-CURRENT-HEAD-CONSUMER · 2026-10-10

The exact public CLI `main` head `f5686b5c` now passes clean-consumer
installation/import, no-implicit-engine execution, and the
`1.8.3 -> 2.0.0-alpha.1 -> 1.8.3` transition. Residual risk is limited to
trusted keyless identity, legal/protected publication, independent review,
and final acceptance; the local transition is not an npm release. Owner:
CLI/release qualification. Gate impact: preparatory progress only;
`QUAL-CLI-006` remains open.

Evidence: `docs/shipping/evidence/qual-cli-006-official-current-head-2026-10-10.md`.

## R-PROD-CURRENT-CODE-ROLLOUT-SMOKE · 2026-10-10

The current READY Production deployment from Web `6f932d4` passed bounded
public route smoke and kept subscription creation unauthenticated GET-fail
closed. No provider, database, entitlement, account, or customer write was
performed. Residual risk remains for Production billing/database activation,
backup/restore, reconciliation, monitoring, and rollback evidence. Owner:
Web/release operations. Gate impact: code-rollout boundary qualified only;
payment and activation gates remain open.

Evidence: `docs/shipping/evidence/production-current-code-rollout-smoke-2026-10-10.md`.

## R-QUAL-CLI-006-CURRENT-HEAD-REMAINING-GATES · 2026-10-10

Official CycloneDX/SPDX, exact-source build, six-archive in-toto binding, and
standards-corpus checks now pass for CLI `main`
`f5686b5c5aa11f45f392e647bd9d7e31830654ba`. Residual risk is that Cosign was
only verified with an ephemeral local key and `--insecure-ignore-tlog=true`:
trusted Fulcio/OIDC/Rekor provenance, protected npm publication, legal review,
independent review, clean-consumer platform evidence, and final acceptance are
still absent. Owner: CLI/release qualification. Gate impact: preparatory
progress only; `QUAL-CLI-006` remains open.

Evidence: `docs/shipping/evidence/qual-cli-006-official-current-head-2026-10-10.md`.

## R-PLAN-WEB-014-PREVIEW-AUTH-FIXTURE-ACCESS · 2026-10-10

The next isolated Preview subscription probe stopped before HTTP because the
Vercel CLI would not expose the hidden Preview auth-fixture secret to the
authorized local runner. No provider, database, payment, webhook,
entitlement, account, customer, deployment, or Production state changed.
Owner: founder or Vercel project administrator. Safe next action: make the
secret available only through the protected authorized runner/CI/browser
fixture, without chat or repository exposure, then rerun the complete
subscription lifecycle and reconciliation matrix. Gate impact: Gate 4 and
`PLAN-WEB-011/012/014/015` remain open.

Evidence: `docs/shipping/evidence/plan-web-014-preview-auth-fixture-unavailable-2026-10-10.md`.

## R-CLI-API-ORIGIN-AUTHORITATIVE-SOURCE · 2026-10-09

The API-origin hardening was first recorded against stale local CLI commit
`439b782d`. The authoritative source now contains the equivalent boundary at
`1972af3abe648312a427c20dc96bbcce54db55a`, verified by focused **24/24** and
complete CLI process **44/44** tests plus **12/12** workspace typecheck/build
tasks. The stale commit must not be used as release provenance.

Residual risk: this is code qualification only. It does not prove package
publication provenance, hosted paid authorization, provider lifecycle,
Production billing/database activation, independent security/legal review, or
rollback/final acceptance. Owner: CLI/release security. Gate impact:
backend progress only; no checkbox change.

Evidence: `docs/shipping/evidence/cli-api-origin-hardening-authoritative-2026-10-09.md`.

## R-QUAL-CLI-006-SOURCE-RESTORATION · 2026-10-09

The public CLI `main` tree briefly had the standards-validation corpus test
without the shared importer/parser source it imported. Commit `d0a3b21` restores
that source and the public export surface; local tests, typecheck, and build
are green. The remaining risk is qualification drift between this exact source
and the official validator/cross-platform/protected-release evidence required
by `QUAL-CLI-006`.

Owner: CLI/release qualification. Gate impact: preparatory progress only; the
item remains open until official validators, trusted release provenance,
protected publishing, legal review, and independent acceptance are recorded.

Evidence: `docs/shipping/evidence/qual-cli-006-standards-source-restoration-2026-10-09.md`.

## R-CLI-API-ORIGIN-CONFIG · 2026-10-09

The CLI stores a configurable API base in a local credentials file. Before
`439b782d`, each transport could concatenate that value directly and attach a
license bearer. The shared `getTrustedApiOrigin` boundary now rejects
non-HTTPS and non-origin values before any request is created, with a focused
zero-fetch regression.

Residual risk: a user can intentionally configure a different clean HTTPS
origin, so custom/self-hosted endpoint ownership remains an operational
trust decision. The CLI does not claim that an arbitrary HTTPS server is
Verglos. Owner: CLI/release security. Gate impact: backend hardening progress;
does not close PLAN-CLI-003 or any external trust/reviewer gate.

Evidence: `docs/shipping/evidence/cli-api-origin-hardening-and-provider-renewal-limit-2026-10-09.md`.

## R-PLAN-WEB-014-provider-renewal-unavailable · 2026-10-09

The current Razorpay Test Mode inventory has no active/pending subscription due
for charge, and the official API material does not expose an immediate
renewal/expiry trigger. Do not shorten canonical Production pricing, alter the
Production database, or synthesize provider events as a substitute. Owner:
Web billing/provider qualification. Gate impact: Gate 4 and
`PLAN-WEB-011/012/014/015` remain open until genuine provider lifecycle
evidence or an explicit provider limitation/release decision is obtained.

Evidence: `docs/shipping/evidence/cli-api-origin-hardening-and-provider-renewal-limit-2026-10-09.md`.

## R-PLAN-WEB-014-active-authenticated-projection-mitigated · 2026-10-09

The isolated provider-to-ledger mismatch is mitigated in code and reconciled
through the signed application path. Web `6f932d4` blocks an advanced
subscription from regressing to `authenticated`; current redacted provider
binding is **5 active→active, 7 cancelled→cancelled, 9 created→pending**.
The fresh hosted Test Mode success and cancellation also matched provider and
isolated state while preserving captured payment and paid time.

Residual risk remains for provider-generated renewal/expiry/failure/refund,
external webhook delivery order, timeout/retry and exactly-once behavior across
the full enabled-method matrix. The signed reconciliation replay proves the
application path but does not replace those provider operations. Gate 4 and
`PLAN-WEB-011/012/014/015` remain open.

Evidence: `docs/shipping/evidence/plan-web-014-lifecycle-ordering-reconciliation-2026-10-09.md`.

## R-PLAN-WEB-014-active-authenticated-projection · 2026-10-09

The isolated Razorpay Test Mode inventory is provider-bound, but five provider
subscriptions report `active` while their isolated `billing_subscriptions`
rows remain `authenticated`. This can make the ledger projection stale even
when the provider and captured-payment/license evidence indicate a successful
subscription. The checkout retry UI repair is deployed in Production as a
fail-closed code rollout, but no Production billing or database write was used
to mask this finding.

**Required closure:** reproduce the provider event ordering with a fresh
isolated subscription, prove that activation cannot be regressed by a later
authenticated event, replay/reconcile the current isolated rows through the
signed webhook path, and rerun the exact provider-to-database-to-payment-to-
license matrix. Until then, keep Gate 4 and `PLAN-WEB-011/012/014/015` open.

Evidence: `docs/shipping/evidence/plan-web-014-hosted-retry-production-rollout-2026-10-09.md`.

## R-PROD-code-rollout-7373c8b-checkout-origin · 2026-10-09

Web `7373c8b` repairs a false same-origin rejection that prevented the debug
browser's legitimate checkout POST from reaching application authorization.
The code is deployed as Vercel `dpl_CLo119NrTffsbLiaNKw4Pq7K2kCA`, READY and
aliased to `https://verglos.com`; tests, build, runtime-config validation, and
read-only smoke passed. The rollout remains fail-closed: no Production plan,
provider/payment, migration, database, entitlement, account, or customer-data
write occurred.

Residual risk is explicit: one isolated Razorpay Test Mode card attempt reached
provider confirmation but returned to retry, so it does not prove capture or
close Gate 4. The complete provider lifecycle, current Production backup/RPO,
migration, reconciliation, monitoring, rollback/forward-fix, independent
AppSec, legal, protected release, and final acceptance gates remain open. The
repository's `pnpm lint` script also needs an intentional ESLint migration;
this batch did not create one interactively. Owner: Web/release operations.
Evidence: `docs/shipping/evidence/production-code-rollout-7373c8b-2026-10-09.md`.

## R-PROD-code-rollout-fa1b9f5-without-activation · 2026-10-09

Web `fa1b9f5c50258ef23daaac4bbf32b24bbd590ef5` is deployed as Vercel
`dpl_4cb7vvAA88aZe3FKXftdmYfSbGJN`, READY and aliased to `https://verglos.com`.
Runtime-config/build validation and read-only public smoke passed. The rollout
is fail-closed: no Production plan IDs, Test Mode values, provider/payment
calls, migration execution, database writes, entitlement changes, account
changes, or customer-data mutations occurred. Previous READY deployment
`dpl_72ptf8YQyLxxXvJHVQDg2vUfh3CN` is the rollback target.

Residual risk is explicit: source migration `0038` was not applied; current
backup/RPO, schema migration, reconciliation, monitoring, rollback/forward
fix, full Test Mode lifecycle, independent AppSec review, legal approval,
protected release approval, and final acceptance remain open. Do not activate
Production billing or database writes until those operation-specific gates
pass. Owner: Web/release operations. Evidence:
`docs/shipping/evidence/production-code-rollout-fa1b9f5-2026-10-09.md`.

## R-PLAN-WEB-014-hosted-cancellation-partial-2026-10-09 · 2026-10-09

The isolated Preview Test Mode run now proves a provider-bound signed
cancellation, exact replay deduplication, out-of-order protection, owner
binding, and provider/database reconciliation. The license retained paid-time
expiry after cancellation. Residual Gate 4 risk remains for renewal/charge,
provider-generated failure/expiry, refund, timeout/retry, complete payment
method coverage, and exactly-once ledger/entitlement reconciliation. The
initial malformed synthetic payload was rejected as designed and is not
acceptance evidence. Production remains fail-closed after its code-only
rollout. Owner: Web billing/release qualification. Evidence:
`docs/shipping/evidence/plan-web-014-hosted-subscription-cancel-replay-2026-10-09.md`.

## R-PLAN-WEB-014-checkout-terminal-state-repaired · 2026-10-09

Web `fa1b9f5` removes the customer-facing risk that a cancelled, completed,
expired, or halted subscription could remain in an indefinite processing state:
the checkout now stops polling and offers a bounded restart, with paid/refunded
precedence. Focused tests, local qualification, and hosted workflow checks
passed. Residual risk is external Gate 4 coverage: Vercel Authentication still
blocks deployed Preview before the route, and hosted provider authorization,
renewal/failure/expiry/refund delivery, and complete ledger/entitlement
reconciliation remain unproven. Owner: Web billing/release qualification.
Production remains fail-closed with no plan, payment, database, migration,
entitlement, account, or customer-data write. Evidence:
`docs/shipping/evidence/plan-web-014-checkout-terminal-lifecycle-2026-10-09.md`.

## R-PLAN-WEB-014-preview-protection-hosted-lifecycle · 2026-10-09

The isolated Razorpay Test Mode credential now passes read-only inventory and
the local `TEST_DATABASE_URL` route has real provider creation/cancellation,
signed cancellation, replay, and out-of-order evidence. The deployed Preview
still returns HTTP 401 from Vercel Authentication before the application route,
so hosted subscription authorization and provider-to-hosted webhook delivery
remain unverified. Owner: authorized Web/release operator. Safe next action:
authenticate the existing debug browser to the Vercel project or deliberately
configure a time-bounded approved Preview access path, then rerun the hosted
flow. Do not bypass protection or copy Test Mode values into Production.
Evidence:
`docs/shipping/evidence/plan-web-014-local-testmode-subscription-cancellation-2026-10-09.md`.

## R-PROD-migration-bearing-candidate-and-stale-rpo · 2026-10-09

The current Web candidate `315a432` is migration-bearing. Its disposable
39-migration restore rehearsal reconciled and measured RTO **3,177 ms**, but
the available snapshot is approximately **441 hours** old versus the critical
48-hour RPO. Exact protected Preview browser smoke is also pending because
the current debug profile was redirected to Vercel login. Do not promote this
candidate to Production until a current-backup/migration preflight,
reconciliation, rollback decision, and authenticated smoke evidence exist.
This is a release-safety boundary, not a reason to omit Production: the
existing fail-closed Production deployment and its later activation,
monitoring, reconciliation, and rollback stages remain in scope. Owner: Web
release operations. Evidence:
`docs/shipping/evidence/production-and-preview-auth-rollout-2026-10-09.md`.

## R-PLAN-WEB-014-current-test-provider-401 · 2026-10-09

The current read-only Razorpay Test Mode plan and subscription inventory calls
using `.env.gates.testing` both return HTTP 401. No provider write was
attempted after the failure. This blocks real isolated subscription
authorization, renewal/charge, failure, expiry, refund, replay, and
provider/ledger/entitlement reconciliation evidence. Owner: authorized
Web/release operator. Remediation: correct or rotate the isolated Test Mode
credential in the provider dashboard, update only isolated Preview/Test
configuration, then rerun bounded read-only inventory. Never paste the
credential into chat. Production remains fail-closed with no state write.
Evidence:
`docs/shipping/evidence/plan-web-014-failed-subscription-invoice-binding-2026-10-09.md`.

## R-PLAN-WEB-014-expiry-provider-and-production-migration · 2026-10-09

The Web `subscription.expired` path is implemented and qualified in isolated
Preview/Test Mode from `4ba15ad`; fresh 38-migration database and focused
integration checks passed. Residual Gate 4 risk is provider-generated expiry,
renewal/charge, failure/halt, refunds, replay/out-of-order delivery, and
complete provider/ledger/entitlement reconciliation. The commit contains a
schema migration, so Production promotion also requires migration preflight,
backup/restore or recovery evidence, reconciliation, and rollback/forward-fix
approval. Production remains the active fail-closed code-only rollout with no
plan, payment, database, migration, entitlement, account, or customer-data
write. Owner: Web billing/release operations. Evidence:
`docs/shipping/evidence/plan-web-014-expired-lifecycle-preview-2026-10-09.md`.

## R-SEC-local-env-and-browser-diagnostic-exposure · 2026-10-09

A local diagnostic attempted to shell-source `.env.test.local`, which is not
safe because its `RAZORPAY_WEBHOOK_SECRET` and `DATABASE_URL` values contain
shell-significant content. The command did not perform a database operation,
but emitted fragments during parsing; an earlier browser diagnostic also
exposed sensitive checkout/session material in local tool output. Do not
source that file or reuse the exposed session. The authorized operator must
rotate/revoke the affected webhook/database credentials as applicable,
refresh or close the old checkout tab, update only the correct isolated
environments, redeploy, and re-verify without printing values. No Production
write was performed. Owner: Web/release operations. This is a manual
security-remediation gate and does not change the backlog score.

## R-PLAN-WEB-014-test-mode-cancellation-slice · 2026-10-09

The newest active isolated Test Mode subscription was cancelled successfully
and reconciled through Preview. The captured payment and active license were
preserved for already-paid time. Residual Gate 4 risk is renewal, failure or
halt, expiry/completion, refunds, replay/out-of-order delivery, and complete
provider/ledger/entitlement reconciliation. Owner: Web billing/release
qualification. No Production state changed. Evidence:
`docs/shipping/evidence/plan-web-014-test-mode-subscription-cancellation-2026-10-09.md`.

## R-PROD-code-rollout-without-billing-activation · canonical 2026-10-09

The current reviewed Web source `a95deef` is deployed as Production
deployment `dpl_72ptf8YQyLxxXvJHVQDg2vUfh3CN`, READY and aliased to
`https://verglos.com`. Runtime configuration, the 45-page build, and
read-only public smoke passed. Production remains fail-closed: no plan IDs,
payment/provider writes, database or migration writes, entitlement changes,
account changes, or customer-data mutations occurred. Residual risk is the
unqualified live billing/database activation, deeper monitoring, rollback
rehearsal, and provider/ledger/entitlement reconciliation. Owner:
Web/release operations. The earlier same-day deployment references below are
historical and superseded. Evidence:
`docs/shipping/evidence/plan-web-014-subscription-invoice-reconciliation-and-production-rollout-2026-10-09.md`.

## R-PROD-code-rollout-without-billing-activation · current 2026-10-09

Production is now deployed from the reviewed Web source as
`dpl_HRbg2hLmHe2WTFxvupkewdw3u9hg`, READY and aliased to
`https://verglos.com`. The code-only rollout and read-only smoke passed, but
live billing/database activation, monitoring depth, rollback rehearsal, and
provider/ledger/entitlement reconciliation remain separate residual risks.
Production remains fail-closed: no plan IDs, database/migration writes,
payment/provider writes, entitlement changes, account changes, or
customer-data mutations occurred. Owner: Web/release operations. Evidence:
`docs/shipping/evidence/production-code-rollout-dpl-HRbg2hLmHe2WTFxvupkewdw3u9hg-2026-10-09.md`.

## R-PLAN-WEB-011-015-subscription-lifecycle-and-production-activation · 2026-10-09

The valid Razorpay Test Mode pair was accepted with HTTP 200 and canonical
monthly/annual Test Mode plans now exist. The Web subscription route is
deployed to Preview and Production. Residual risk is the unqualified real
subscription lifecycle: authorization, charge/renewal, failure,
cancellation/expiry, refund, replay/out-of-order delivery, and
provider/ledger/entitlement reconciliation. Production recurring billing is
intentionally disabled because Test Mode plan IDs and credentials must not be
copied there. Production code and read-only smoke work is active; live-mode
billing and database activation require a separate operation-specific
preflight with backup/restore, reconciliation, and rollback evidence. Owner:
Web billing/release qualification. Evidence:
`docs/shipping/evidence/plan-web-011-015-test-mode-plans-production-rollout-2026-10-09.md`.

## R-PROD-code-rollout-without-billing-activation · 2026-10-09

Production deployment `dpl_E3Xr4UZe1ZXaZfRB7ygvS8HvmQTs` is READY and aliased
to `https://verglos.com`; build, `/`, and `/checkout` smoke checks passed. The
deployment is a code rollout only. No Production database, migration, payment,
provider, entitlement, account, or customer write occurred. Residual risk is
the remaining configuration, monitoring, rollback, migration, and live-
billing activation evidence. Owner: Web/release operations. Evidence:
`docs/shipping/evidence/plan-web-011-015-test-mode-plans-production-rollout-2026-10-09.md`.

## R-QUAL-WEB-006-lab-field-gap · 2026-10-09

The authenticated production account lab trace is strong (LCP 784 ms, TTFB
100 ms, CLS 0.00), but no CrUX field data exists and INP was not measured with
a representative interaction set. A concurrent YouTube tab made the trace's
cross-tab network chain unusable for product conclusions. Residual risk is
field performance, interaction coverage, and complete route qualification—not
the excluded cross-tab chain. Evidence:
`docs/shipping/evidence/qual-web-006-account-performance-trace-2026-10-09.md`.

## R-QUAL-WEB-006-authenticated-runtime-evidence · 2026-10-09

The current production account route passed a clean authenticated read-only
reload, bounded DOM accessibility checks, Lighthouse accessibility/best-
practices/SEO scores of 100/100/100, and named-link keyboard traversal at the
captured viewport. Residual risk is unchanged: this is not human
screen-reader, field-CWV, large-dataset, complete-route, or final truth
acceptance. No production or hosted state changed. Evidence:
`docs/shipping/evidence/qual-web-006-authenticated-account-runtime-2026-10-09.md`.

## R-QUAL-WEB-005-isolated-deletion-e2e · 2026-10-09

The authenticated account-deletion route and deletion-job lease/idempotency
flows now pass against a fresh local PostgreSQL 15 database with the complete
38-migration/50-table schema. Residual risk is unchanged: this does not prove
legal/customer-held-record disposition, production migration authorization,
backup/restore/rollback, reconciliation, or independent acceptance. Owner:
privacy/release qualification. No production or hosted data changed. Evidence:
`docs/shipping/evidence/qual-web-005-deletion-route-e2e-2026-10-09.md`.

## R-041-vercel-rotation-metadata-audit · 2026-10-09

Vercel metadata shows the production `DATABASE_URL` value was updated before
the latest READY production deployment at Web `be4289f`. The audit did not read
the value or target database, so it cannot prove old-credential revocation,
database identity, backup/restore, migration reconciliation, or bounded
post-rotation behavior. Preview intentionally has no database URL or isolation
marker and no enabled payment catalog, keeping Preview payment-disabled. Owner:
Web/release operations. Evidence:
`docs/shipping/evidence/vercel-production-preview-config-audit-2026-10-09.md`.

## R-PLAN-WEB-014-preview-isolation-guard · 2026-10-09

Web PR #170 is merged and prevents Preview payment configuration from starting
without a TLS-safe database URL and explicit isolated-target marker. Residual
risk is unchanged: the marker is an assertion, not verification of disposable
database ownership, migration history, webhook routing, provider Test Mode
lifecycle, or production reconciliation. Owner: billing/release qualification.
No production/provider/payment/database/migration/entitlement/account or
production deployment write occurred. Evidence:
`docs/shipping/evidence/plan-web-014-preview-database-isolation-guard-2026-10-09.md`.

## R-HUNT-011-current-head-requalification · 2026-10-09

The exact merged CLI head now has a fresh pinned Docker adversarial result of
60 pass, one documented macOS namespace skip, and zero failures. Residual risk
is unchanged: local qualification is not independent AppSec review, trusted or
licensed recipe provenance, production activation, or customer acceptance.
Owner: Hunt/release qualification. No production, provider, database, payment,
deployment, registry, signing, customer, or release write occurred. Evidence:
`docs/shipping/evidence/hunt-docker-adversarial-origin-main-2026-10-09.md`.
The current independent-review packet is
`docs/shipping/evidence/hunt-independent-review-packet-2026-10-09.md`; it does
not replace the required external signature.

## R-CLI-EXTERNAL-GATES-2026-10-09

The remaining CLI/backend and release rows have substantial tested substrate,
but no open CLI PR or local dependency-ready code gap remains at the current
head. Acceptance is still exposed to trusted Hunt/licensing provenance,
production signer and tenant activation, hosted provider/SCM evidence, legal
approval, independent security review, customer authorization, protected
publishing, and authenticated rollback/revocation. Owner roles and review
points are recorded in the private matrix. No external state changed. Evidence:
`docs/shipping/evidence/cli-backend-external-gate-matrix-2026-10-09.md`.

## R-PLAN-CLI-003-paid-fixture-matrix · 2026-10-09

The production read-only modified-client probe confirms forged plan,
capability, license, fingerprint, tenant, organization, usage, search,
project, and receipt inputs do not grant the exercised unauthorized access.
Residual risk is material: the session has no paid license or organization
fixture, so it cannot prove authorized paid list/search/export behavior or the
complete public/private runtime matrix. Owner: Web/CLI release qualification.
No production or provider state changed. Evidence:
`docs/shipping/evidence/plan-cli-003-production-readonly-forged-route-recheck-2026-10-09.md`.

## R-DIST-006-boundary-coverage · 2026-10-09

The local rollback rehearsal previously accepted a partial operation list even
though `DIST-006` requires npm, engine, Hunt-feed, signing-identity, and Web
deployment coverage. CLI PR #87 now rejects incomplete and duplicate boundary
sets and is merged after all hosted checks passed. Residual risk is unchanged:
no authenticated registry/provider/signing/deployment rollback or revocation,
protected publishing, legal clearance, operational audit/recovery drill, or
independent review has been performed. Owner: release engineering. No
production or external provider state changed. Evidence:
`docs/shipping/evidence/dist-006-rollback-boundary-completeness-2026-10-09.md`.

## R-QUAL-WEB-006-015-production-checkout · 2026-10-09

The approved Chrome DevTools session now provides a clean read-only production
checkout observation: UPI, Cards, Netbanking, Wallets, EMI, and Pay Later are
rendered, and Accessibility/Best Practices are 100/100 on desktop and mobile.
This reduces browser-transport uncertainty but does not establish provider
account enablement or payment lifecycle. Production did not identify as Test
Mode; SEO 80 is due to a missing meta description and Agentic Browsing 50 is
due to the recommended `llms.txt` H1 being absent. Hold those metadata findings
for the final truth pass. Owner: Web release qualification. No production or
provider state changed. Evidence:
`docs/shipping/evidence/qual-web-006-plan-web-015-production-checkout-cdp-2026-10-09.md`.

## R-DIST-LICENSE-2026-10-08

The CI-equivalent cross-platform install makes the license inventory complete,
but the strict release gate identifies seven unresolved redistribution-review
blockers: six BlueOak-1.0.0 transitive packages and a nested `benchmark@1.0.0`
license conflict under `fast-uri@3.1.7`. The inventory correctly fails closed;
do not classify these packages as clear or publish artifacts until legal review,
an approved source/license disposition, or a reviewed dependency change is
recorded. Owner: release/legal qualification. HUNT-008–011, LIC-002/003,
DIST-001–003/006, and QUAL-CLI-006 remain open. No production, registry, or
npm state changed. Evidence:
`docs/shipping/evidence/qual-cli-backend-hunt-distribution-2026-10-08.md`.

## R-CLI-OPTIONAL-METADATA-2026-10-08

The repository's strict license inventory requires metadata for every locked
optional platform package. A default macOS install links only the current
platform package and therefore reports missing esbuild metadata; the CI release
workflow provisions all supported architectures before install. This is an
operational reproducibility requirement, not permission to weaken inventory
coverage. Owner: release engineering. Evidence:
`docs/shipping/evidence/qual-cli-backend-hunt-distribution-2026-10-08.md`.

## R-QUAL-WEB-006-deployed-docs · 2026-10-08

The merged contrast correction is verified in production on desktop and mobile
with Accessibility/Best Practices 100/100 and no console warnings/errors.
Residual qualification risk is unchanged: metadata truth, human
screen-reader, authenticated paid/org data, large datasets, complete route
coverage, and field/CrUX CWV remain unproven. Owner: Web release
qualification. No production state changed. Evidence:
`docs/shipping/evidence/qual-web-006-deployed-docs-contrast-2026-10-08.md`.

## R-PLAN-CLI-004-QUAL-WEB-006-batch · 2026-10-08

The batch reduces two implementation risks: CLI activation now has a
process-level legacy-v1 fallback rehearsal, and the `/docs/2.0.0` Hunt CTA
contrast defect is corrected in Web PR #164, and both PRs are now hosted-green
and merged. Residual risks are unchanged: neither local synthetic
compatibility nor a route-level browser sweep proves deployed signer/catalog
migration, paid/org
runtime, human screen-reader, large-data, field-CWV, metadata truth, or
payment lifecycle. Owner: CLI/Web release qualification. No production or
provider state changed. Evidence:
`docs/shipping/evidence/plan-cli-004-qual-web-006-batch-2026-10-08.md`.

## R-001 / R-012 update · 2026-10-08

The read-only production `/docs` audit found legacy `$29/mo` and `$199/mo`
rows while the current verified Pro catalog is INR. This is an open public
truth/release risk, not permission to infer Team/Studio/Enterprise pricing.
Containment is to keep the final public-copy/pricing pass frozen until the
truth registry and release-candidate gates authorize correction. The local
DIST-006 rehearsal reduces rollback decision ambiguity but does not mitigate
the absence of authenticated provider rollback or trusted release operations.
Owner: Product Truth / Release Engineering. No production or public write
occurred.

## R-PLAN-WEB-012-out-of-order-payment · 2026-10-08

Web PR #161 now promotes a failed payment row when a later capture carries the
same immutable commercial binding, and ignores late failure retries after a
capture/refund. The behavior is covered by isolated PostgreSQL ledger and real
webhook-handler integrations. Residual risk is external: no account-enabled
Razorpay Test Mode method/lifecycle run or production reconciliation has been
accepted. Owner: billing/release qualification. PLAN-WEB-011/012/014/015 and
R-041 remain open; no production/provider state changed.

## R-ENT-CLI-001-replay-race · 2026-10-08

The result endpoint now fences concurrent identical uploads on the existing
organization/job uniqueness key and reconciles the losing request by digest.
The race is covered by a fresh PostgreSQL E2E. This removes the duplicate
result/500 risk at the route boundary, but does not establish that a real
approved runner executed the job. Operational credential exchange, execution
and expiry/retry qualification, independent Hunt review, and enterprise
acceptance remain open. No production migration or state write occurred.

## R-ENT-CLI-001-hosted-transport · 2026-10-08

The Web transport now has an isolated route/database lifecycle proof: enrollment,
first-poll activation, bounded job issue, source-free result persistence, exact
replay idempotency, conflict refusal, and tenant isolation all pass on a fresh
loopback PostgreSQL fixture. This does not prove that an approved customer
runner executed a Hunt recipe or that the operational one-time credential
exchange is ready. Cross-platform execution, retry/expiry behavior in a real
runner, independent Hunt review, and enterprise acceptance remain release
risks. Do not treat this fixture or a successful upload response as proof that
a private scan executed correctly. Owner: Enterprise/CLI/Web release
qualification. Required next action: exchange an approved non-production
runner credential, run the bounded execution matrix, reconcile the result with
the exact CLI commit, and obtain independent review. No production migration or
state write occurred.

## R-QUAL-WEB-006-015-runtime-observation · 2026-10-08

The production checkout visually lists hosted methods, but a rendered label is
not evidence that the Razorpay account accepts or completes that method. Do
not infer provider enablement, order creation, capture, refund, renewal, or
entitlement from this observation. Likewise, a short CDP audit with missing
LCP/INP data cannot establish full accessibility/performance acceptance.
Owner: Web release qualification. No production state changed.

## R-TEAM-CLI-002-command-only · 2026-10-08

The CLI now emits a validated source-free check payload, but it does not yet
deliver that payload to GitHub/GitLab. Treating the local projection as a
successful provider check would create a false release signal. Keep the item
open until signed organization policy, provider installation authorization,
tenant/commit binding, retry/replay handling, and hosted evidence are complete.
Owner: CLI/Web release qualification. No production state changed.

## CLI entitlement cache and reporting · 2026-10-08

CLI PR #80 (`8f731b3`) prevents accidental reuse of another license/endpoint's
capability cache. Legacy unbound caches now require refresh; independently
verified signed tokens remain a fallback. Cache digests are editable local
metadata and are not a hosted security boundary. whoami plan now means
effective access; consumers needing the status plan must read licensePlan.
Owner: CLI release. Hosted platform qualification and deployment activation
remain open; rollback is reverting this CLI change, with no database impact.
Evidence: `docs/shipping/evidence/plan-cli-cache-identity-whoami-2026-10-08.md`.

## R-PLAN-CLI-001-cross-repo-activation · 2026-10-08

The current Web v2 issuer and CLI verifier now pass an isolated synthetic
roundtrip, including tenant/owner/catalog claims, tamper rejection, and wrong
key rejection. Residual risk is operational: production signer/public-pin
alignment, deployed tenant mapping and activation, supported-version migration,
and hosted acceptance remain unverified. Owner: CLI/Web release
qualification. No production state changed.

## R-PLAN-CLI-003-hosted-boundary · 2026-10-08

The production GET-only forged-route matrix returned bounded 403/400/404
responses with no-store controls across organization, project, repository, and
receipt paths. This reduces tenant-leakage uncertainty but does not prove the
modified CLI path, paid fixture behavior, or complete list/search/export
runtime coverage. Owner: CLI/Web qualification. Required next action: run the
authorized modified-client matrix against a paid non-production fixture and
retain sanitized public/private evidence.

## R-PLAN-WEB-014-test-credential · 2026-10-08

The read-only Razorpay Test Mode capability request returned `Authentication
failed`, so the account-enabled method set is unknown. Do not infer methods
from environment configuration or rendered UI and do not repeat the same
request. Owner: billing/release qualification. Required next action: repair or
rotate the authorized Test Mode credential, verify it with the capability
preflight, and run the isolated Preview lifecycle matrix.

## R-QUAL-WEB-006-account-state · 2026-10-08

Authenticated production `/account` is clean in the available Free state, but
the session does not expose paid dashboard data. Lighthouse Accessibility and
Best Practices are 100/100 and mobile LCP/CLS are 741 ms/0.00, yet this cannot
substitute for paid data, keyboard-visible focus, human screen-reader review,
large datasets, loading/error states, or field-CWV evidence. Owner: Web
qualification. Required next action: use an approved non-production paid
fixture or authorized paid test organization and repeat the complete matrix.

## R-DB-LEGACY-DATA · 2026-10-08

The selected local test database is structurally populated and behind the
current journal. Its read-only aggregate audit found one legacy plan-alias
license, one legacy monitor-channel payload, 1,350 dependency entries, two
expired unconsumed CLI-auth codes, and one canary alert dispatch. Ownership and
orphan checks were clean, but these legacy states require explicit mapping,
retention, or operational treatment before a production cutover. Owner:
Web/schema/release operations. Required next action: approve the mapping and
retention decisions in the production migration runbook and verify them on an
approved snapshot/restore rehearsal. No write occurred.

Selected-database planner qualification (2026-10-08) found one eligible
personal-organization creation, while the other user, project, and license
were already represented; no planner collision, unresolved parent, or
quarantine was found. This narrows the pending data shape but does not resolve
the required legacy alias/channel/auth-code decisions or authorize a write.

## R-DB-MIGRATION-DRIFT · 2026-10-08

The selected local test database contains all declared tables but only 26 of
the current Web journal's 37 migration records. Eleven migrations are pending,
including GitHub identity, SCM binding, billing-order uniqueness, and account
deletion operations. The read-only audit does not authorize applying them: the
database is populated, its isolation/ownership is not accepted, and backup,
restore, rollback, credential, and cutover evidence are incomplete. Owner:
Web/schema/release operations. Required next action: use a separately approved
non-production database for Preview qualification, or follow the approved
production migration runbook only after R-041 and its backup/restore/recovery
gates are closed. No production or database write occurred.

## R-PLAN-WEB-015 production method-set absence · 2026-10-07

Read-only environment-name inspection confirms that both Vercel production
and the local production env file lack `RAZORPAY_ENABLED_PAYMENT_METHODS`.
The merged Web runtime guard fails closed, so the live alias remains on the
legacy QR-only surface until the account-enabled method set is established
after Test Mode credential rotation and an approved production preflight.
Owner: billing/release qualification. Do not guess or write this value.

## R-PLAN-WEB-014 Test Mode browser/provider boundary · 2026-10-07

The Web test environment has usable Razorpay Test Mode credentials and a
declared seven-method application configuration; a read-only Orders request
returned HTTP 200. This does not prove account-enabled methods or lifecycle
behavior. Browser qualification is currently constrained by closed Chrome
DevTools/Playwright MCP transports, while raw CDP remains reachable. Owner:
billing/release qualification. Next action: restore the browser transport or
use an equivalent bounded browser instrument, then run the isolated hosted
Checkout lifecycle with redacted evidence. A prior fallback probe attempted one
Test Mode order but did not capture its result; do not count it as lifecycle
evidence. No production mutation occurred.

## R-QUAL-WEB Node 22 current-main qualification · 2026-10-07

Exact Web main passed the empty-database serial suite with **49/49** pretests,
**879/880** main tests, one explicit skip, and zero failures under pinned Node
`22.23.3`; all **37** migrations, schema, negative-boundary, truth registry,
and typecheck also passed. Remaining risks are external/provider and release
boundaries: production reconciliation, Razorpay lifecycle, build/deploy
acceptance, and final independent acceptance remain absent. Owner:
Web/release qualification. No production/provider/database/deployment
mutation occurred.

## R-QUAL-CLI-006 Node 22 runtime result · 2026-10-07

The exact current CLI head passed fresh-install test **12/12**, typecheck
**13/13**, and build **8/8** under pinned Node `22.23.3`; the container was
removed cleanly. Runtime drift is reduced for this source head. Remaining
risk is release acceptance: official validator completeness, trusted
Sigstore/publishing identity, legal/license review, independent acceptance,
and final release approval remain absent. Owner: release/qualification. No
production/provider/database/deployment/publication mutation occurred.

## R-041 / PLAN-WEB-015 production configuration and credential boundary · 2026-10-07

The latest production deployment at Web commit `1498837` fails before build
because `RAZORPAY_ENABLED_PAYMENT_METHODS` is absent; the live alias therefore
remains QR-only. The production database credential was previously exposed and
is not reused for another audit. Owner: release/operations. Required sequence:
rotate the DB credential, refresh the Vercel production secret, redeploy, revoke
the old credential, verify bounded read-only schema/history, then reconcile the
provider method set and hosted checkout. No production state was changed in
this preflight.

## R-PLAN-WEB-014 current-main order qualification boundary · 2026-10-07

The exact Web main hosted-order path passes **28/28** focused tests against
disposable PostgreSQL, including declared hosted methods, immutable order
binding, capture/failure, replay, refund watermark, and webhook idempotency.
The residual risk is external: no valid isolated Razorpay Test Mode account
run has produced real payment/capture/refund/renewal/webhook evidence, and no
production reconciliation has been attempted. Keep PLAN-WEB-013/014/015 open;
owner: billing/release qualification. Node 22 runtime acceptance is also open.


## R-PLAN-WEB-013 migration bootstrap revalidation · 2026-10-07

Current Web main `14988371cdae94d66d068b49d07cc31f0b26c5ea` includes a guarded
local-only legacy-baseline bootstrap. A disposable empty PostgreSQL database
passed that bootstrap and all **37** ordered migrations, with **22/22** isolated
payment/database checks passing. The prior local empty-schema failure is
therefore resolved for the documented rehearsal. Residual risk is production:
verify the existing legacy baseline and 26-row migration history against the
current tail, rehearse backup/restore and rollback, and obtain Node 22 runtime
acceptance before any cutover. Provider lifecycle and production reconciliation
remain separate release blockers. Owner: Web schema/release. No production
state was touched.

## R-QUAL-CLI-006 current-main artifact/format evidence · 2026-10-07

Exact CLI `origin/main` `7d060b2` now has current-head artifact evidence:
the cross-platform install/build and six-archive pack pass; official
`in-toto==3.0.0` verifies exact archive products; CycloneDX CLI `0.33.1` and
SPDX Tools `0.8.5` validate the generated documents. Remaining risk is not
mechanical artifact validity: the license inventory retains 7 review blockers,
and Sigstore identity, trusted publishing/legal approval, and independent
acceptance remain absent. Owner: release/qualification. Keep QUAL-CLI-006,
LIC-002/003, DIST-001/002/003, and final acceptance open until those external
conditions are evidenced.

## R-GITHUB-WEB-006 provider exchange and cutover evidence · 2026-10-07

PR #154 reconciled head `9032bda` (merged as `1498837`) moves GitHub App token issuance, identity binding,
expiry refresh, and webhook-secret storage behind server-held configuration and
passes local/hosted code checks. Remaining
risk is operational: no authorized GitHub App installation, live provider
webhook lifecycle, multi-repository cutover, token-refresh observation, or
independent review has occurred. Owner: SCM/release qualification. Mitigation:
use test/preview credentials and an authorized organization to exercise install,
permissions, token exchange/expiry, webhook replay, suspend/revoke/reauthorize,
delivery reconciliation, and rollback before accepting TEAM-WEB-006 and the
related gates. No production state was touched.

## R-QUAL-CLI-006 / HUNT-011 exact-head evidence boundary · 2026-10-07

The clean remote-head CLI worktree passed forced Turbo validation **23/23** and
the pinned `postgres:15-alpine` adversarial harness passed **60**, skipped one
macOS/Linux-only namespace assertion, and failed zero. This reduces current
source-regression risk but does not prove Linux isolation, official validators,
trusted publisher/recipe provenance, legal/trusted-publishing review, or
independent acceptance. Owner: release/qualification. Keep HUNT-008/009/010/011
and QUAL-CLI-004/006 open until those external gates are evidenced.

## R-PLAN-WEB-013 migration bootstrap and integration-evidence gap · 2026-10-07

The new handler/database integration passes against a disposable database whose
current schema was prepared locally. A fresh empty database cannot apply the
current migration chain because migration `0000_rename_sentinel_to_pro`
references the legacy `licenses` table before a creating migration. This
blocks making the integration a fresh-CI gate without a reviewed migration
bootstrap change. Owner: Web schema/release; mitigation: reconcile the legacy
baseline and rehearse on a fresh disposable database before changing CI or
production. Separately, real Razorpay lifecycle and production reconciliation
remain open. No production state was touched.

## R-PLAN-WEB-013 shared payment-test fixture isolation · 2026-10-07

The route harness is isolated and hosted Verify is green, but the local normal
parallel suite reports shared-schema writer races and the serial suite contains
an empty-schema fixture assumption. This prevents a full-suite acceptance claim
until test database ownership/reset is made explicit. Owner: Web test
infrastructure; mitigation: give each integration group an isolated schema or
database and remove destructive cross-fixture setup. PLAN-WEB-013/014/015 remain
open. No production state was touched.

## R-QUAL-WEB-006 organization-directory runtime evidence gap · 2026-10-07

The current `/orgs` target has a bounded aggregate CDP observation with no
unnamed interactive AX nodes and no layout shift, but the MCP transport was
closed and no reload-based LCP, field CWV, keyboard sequence, human
screen-reader, Pro/organization-data, responsive/reduced-motion, or large-data
browser evidence was collected in this batch. Owner: Web qualification;
mitigation: use the existing authenticated non-production organization/Pro
target when available, capture redacted reload metrics, and complete the human
review before QUAL-WEB-006 acceptance. No production or browser-state write
occurred.

## R-QUAL-CLI-006 official qualification gap · 2026-10-07

The current CLI worktree passes its shared standards corpus, typecheck, build,
license inventory, and CycloneDX/SPDX SBOM generation after using the
repository's documented temporary cross-platform package setup. The temporary
manifest and generated artifacts were reverted. Remaining risk is official
validator coverage, trusted keyless provenance, legal/trusted-publishing
review, and independent acceptance. Owner: release/qualification.
QUAL-CLI-006 remains open.

## R-044 Checkout failure-state hardening · 2026-10-07

PR #149 head `aa34127` now clears stale order state after provider failures and
pre-confirmation dismissals, returning users to the actual retry screen, and
avoids a false submitted state when `open()` throws. This reduces UI-state
ambiguity but does not establish provider lifecycle, webhook, entitlement,
reconciliation, or hosted acceptance. Owner:
billing/product; mitigation: complete the all-enabled-method Test Mode matrix
and signed ledger reconciliation. PLAN-WEB-013/014/015 remain open.

## R-049 Test Mode method lifecycle remains incomplete · 2026-10-07

The isolated Test Mode Checkout rendered the configured hosted method
surfaces, but UPI contact validation stopped the run before a provider
success/failure outcome. No capture, refund, webhook, entitlement, or
ledger-reconciliation evidence exists. Owner: billing/product; mitigation:
qualify the authenticated app route and every required provider lifecycle in
an approved isolated runtime, then reconcile signed provider events to the
ledger and entitlements. PLAN-WEB-014/015 remain release-blocking. No
production or live-payment operation occurred.

## R-048 deletion hold race hardening · 2026-10-07

The deletion worker now rechecks the durable legal-hold state at the completion
boundary and blocks the job if a hold appeared during deletion. This reduces a
code-side race but does not prove transactional hold/deletion serialization,
authenticated non-production E2E, legal/customer-held disposition, production
reconciliation, restore/rollback, or independent review. Owner: privacy/data
governance; mitigation: qualify the worker against the deployed schema and
authorized legal/customer-held scenarios before enabling destructive execution.
`QUAL-WEB-005` remains open. No production deletion occurred.

## R-044 refund ordering hardening · 2026-10-07

The payment ledger now preserves a monotonic refund watermark: stale smaller
refund observations are no-ops, while negative and over-amount observations are
rejected. This reduces duplicate/out-of-order retry risk in code-side handling,
but does not prove provider delivery ordering, account-enabled method behavior,
capture/refund reconciliation, or production safety. Owner: billing/product
owner; mitigation: qualify every enabled Razorpay method in isolated Test Mode
and reconcile signed webhooks, ledger rows, and entitlements. PLAN-WEB-013/014/
015 remain open. No provider or production operation occurred.

## R-044 evidence update · Razorpay Test Mode has no subscription plans · 2026-10-07

The isolated Test Mode credential pair returned zero provider subscription
plans, and the production environment-name inventory has no plan-ID mapping.
The order-based hosted flow can continue to be qualified, but recurring
renewal/cancellation/expiry cannot be claimed or safely enabled. Creating
provider plans without an approved catalog/entitlement mapping would create
immutable test objects and ambiguous commercial truth. Owner: billing/product
owner; mitigation: approve non-production plan IDs and exact catalog binding,
then qualify the subscription lifecycle privately.

Latest PLAN-WEB-014 provider probe (2026-10-07): Razorpay test mode recorded
one attempted card payment with zero amount paid after the official sandbox
contact/card path; UPI and netbanking rendered but were not completed. This
reduces contact-validation and hosted-display uncertainty only. Complete
method lifecycle evidence, webhook/ledger reconciliation, isolated deployed
runtime, production reconciliation, and R-041 rotation remain release-
blocking. No production or live-payment operation occurred.

Latest QUAL-WEB-005 preview-browser update (2026-10-07): the PR #153 Preview
URL is protected by Vercel deployment login, so Chrome CDP could not reach the
new privacy surface. No bypass or mutation was attempted. Authenticated
non-production deletion E2E remains release-blocking.

Latest QUAL-WEB-005 implementation update (2026-10-07): Web PR #153 head
`db27d793d890929f642ed0d5b5b9bd056a732bc` adds the authenticated privacy/
deletion request surface and passes local 23/23 focused checks plus hosted
Verify `37607448915`. This reduces user-facing wiring uncertainty only;
authenticated deletion E2E, legal/customer-held disposition, restore/rollback,
and production migration/cutover evidence remain release-blocking. No
production operation occurred.

Latest exact production migration preflight (2026-10-07): all 42 allowlisted
tables are present, but production has 26 applied migration rows against the
35-row PR #153 candidate and is blocked on the 0026–0034 tail. Exact counts
remain licenses 1, legacy mappings 3, webhook events 4, billing payments 0,
and subscriptions 0. This reduces state uncertainty only; migration,
deletion, provider, rollback, and merge gates remain open. No production write
occurred.

Latest QUAL-WEB-005 snapshot update (2026-10-07): a fresh 150,515-byte
production dump completed at `2026-10-07T10:17:27.005Z`, restored in disposable
PostgreSQL 18, and accepted PR #153's migration tail to 35 rows. This reduces
RPO/restore/migration-rehearsal uncertainty only; authenticated deletion E2E,
legal/customer-held-record disposition, row reconciliation, rollback, and
independent acceptance remain open. No production write occurred.

Latest Preview preflight update (2026-10-07): Vercel Preview lacks a
recognizable Razorpay test/live key pair, a PostgreSQL database URL, and
`RAZORPAY_ENABLED_PAYMENT_METHODS`. No Preview call was attempted. An
isolated, valid test environment remains release-blocking for PLAN-WEB-014/015.

Latest production read-only audit (2026-10-07): Vercel Production lacks
`RAZORPAY_ENABLED_PAYMENT_METHODS`; production has 26 migration-history rows
while the current hosted candidate has 31. Aggregate billing payments,
subscriptions, and deletion requests are zero; four Razorpay webhook-event
rows exist. This reduces schema/state uncertainty but does not qualify
provider reconciliation, migration, backup/restore, deletion, or RPO. No
production write occurred.

Latest GitHub App preflight (2026-10-07): organization/repository reads work,
but the available GitHub token cannot list App installations and returns HTTP
403 requiring App authorization. This leaves installation identity, scope,
permissions, delivery, and lifecycle evidence unresolved for GITHUB-WEB-001
through GITHUB-WEB-004. No GitHub mutation occurred.

Latest Razorpay method-preflight update (2026-10-07): the official SDK method
lookup returned HTTP 401 authentication failure, while read-only `/v1/orders`
and `/v1/payments` calls with the same test credential pair returned 200. The
401 is endpoint-specific; the account-enabled method set remains unknown.
Local PR #149 configuration supports five hosted method IDs and its baseline
payment suite passed 27/28 with one explicit environment-gated skip, but this
is not provider acceptance. The complete method lifecycle matrix remains
release-blocking; no live-key fallback or production operation occurred.

Latest SCM/payment qualification update (2026-10-07): exact Web `origin/main`
passed the focused GitHub/SCM suite **48/48**, and a bounded test-mode
Razorpay order was created at the catalog monthly Pro amount without capture.
This reduces code-side and credential-connectivity uncertainty only. Live App
installation/delivery/recovery, account-enabled payment methods, full
provider lifecycle, production reconciliation, and R-041 rotation remain
release-blocking; no production operation occurred.

Latest R-044 hosted verification update (2026-10-07): Web PR #149 exact head
`db68157da039d8aab939818f9023f867028e4432` passed Verify `37563023349` with
serial Web 871/872 pass and one explicit skip, negative-boundary 2/2,
truth-registry 25/25, 31 migrations, build, public-boundary, dependency,
SBOM/license, and secret checks. This reduces code/CI uncertainty only;
account-enabled Razorpay methods, provider lifecycle/replay evidence, and
production reconciliation remain release-blocking.

Latest R-044 production truth update (2026-10-07): read-only Chrome DevTools
still observes the legacy UPI-only QR checkout at INR 2,809.43/month, while
Web PR #149 remains open and not deployed. No payment or mutation request was
made. The live payment surface therefore remains unsuitable for test-mode or
all-method acceptance; account-enabled Razorpay test credentials and isolated
lifecycle evidence remain release-blocking.

Latest QUAL-CLI-006 update (2026-10-07): official `in-toto==3.0.0` verification
passed for six public archives from exact CLI head
`6bde945c60ac34351c02a70f6e7a2cb24f98ae1d`, with exact SHA-256 products in a
bounded disposable Python 3.12 container. This reduces artifact-format and
local binding uncertainty only. Trusted keyless Sigstore/Fulcio/Rekor identity,
legal clearance, protected publishing, and final release acceptance remain
open; no release or production operation occurred.

Latest R-044/PLAN-WEB-013 update (2026-10-07): Web PR #149 exact head
`db68157da039d8aab939818f9023f867028e4432` passes focused payment-method,
route-contract, and webhook-adversarial tests 18/18, typecheck, schema, 31
ordered-migration, and 3/3 license checks. This reduces code-side checkout
uncertainty only. Razorpay account-enabled test-mode methods, complete provider
lifecycle/replay evidence, production reconciliation, and Node 22 runtime
qualification remain open and release-blocking; no provider or production
operation occurred.

Latest R-046/QUAL-WEB-006 update (2026-10-07): the authenticated Free account
surface was probed through the approved Chrome DevTools session. Automated
desktop/mobile Lighthouse Accessibility and Best Practices scored 100; the
trace recorded LCP 1,111ms and CLS 0.00, but no organization, paid entitlement,
screen-reader session, large dataset, or CrUX field data was available. The
browser evidence reduces only the Free authenticated-surface uncertainty;
QUAL-WEB-006 remains release-blocking/open.

Latest R-009/HUNT-009 update (2026-10-07): CLI `c4beecb` removes the public
archive's static private `@verglos/hunt` dependency and adds a validated,
fail-closed optional runtime boundary. Local CLI, archive, package-content, and
public-boundary checks pass; PR #75 exact head
`c4beecb3525256cd2956660af8e3e6b49292b65f` had 11 hosted checks pending at
capture. This reduces the packaging blocker but does not resolve trusted
recipe provenance, isolation evidence, independent review, or functional Hunt
acceptance. HUNT-008/HUNT-009/QUAL-CLI-004 remain critical/open.

Latest R-009/HUNT-009 update (2026-10-07): CLI PR #74
(`a2a1335d2a0b69ec56391286a4ba77ef773c0457`) passed local execution/build/
typecheck/full-test evidence, but hosted platform matrix `37565750571` and
self-scan `37565750527` failed closed because public archive packaging cannot
resolve private/alpha `@verglos/hunt`. PR #74 was closed without merge. The
public/private boundary is preserved; HUNT-009 remains critical/open pending a
reviewed packaging design, licensed recipe provenance, approval chain, and
independent qualification.

Latest R-046/QUAL-WEB-005 update (2026-10-07): Web PR #153 head
`37c8a07ef2c1d4f914c0ace03864d60fb2649a82` passed Verify `37564973546` after
adding the read-only sixteen-table supporting inventory and disposition
qualification. The worker still fails closed with
`supportingInventoryComplete=false`; executable dispositions, operation
receipts, reconciliation, restore/rollback rehearsal, and authenticated E2E
remain release-blocking. No production operation occurred.

Latest R-018 update (2026-10-07): CLI PR #73 (`d34ac4f`) supplies exact HTTPS
source metadata for `minipass-pipeline@1.2.4`, reducing the inventory's
mechanical source-missing list from eight to seven. The nested
`benchmark`/`fast-uri` conflict and six BlueOak classifications remain open;
no legal or redistribution clearance is inferred. Hosted checks and counsel /
founder review remain required.

Latest R-010 update (2026-10-07): a local pnpm configuration diagnostic
emitted an npm authentication token to tool output. The value was not recorded
or reused; revoke/rotate it before further registry authentication. This is a
credential-exposure response, not evidence of a production compromise.

Latest R-046 update (2026-10-07): the full Web PostgreSQL-backed suite is not
authoritative when parallel test workers share mutable fixture state: they can
race while creating shared `pgcrypto` setup and leave an integration worker
unresolved. The existing serialized qualification path now passes 867/867
configured tests plus the separately migrated billing integration 1/1, so the
local release evidence is controlled when serialized. Web PR #150 head
`a78578e` and hosted run `37552936102` now make serialized execution the CI
path. The developer parallel invocation remains non-authoritative; no
production operation occurred.

Latest R-044 update (2026-10-07): Web PR #149 implements the hosted order
boundary, server/catalog method declaration, signed order binding,
webhook-authoritative capture/failure path, read-only owner-bound status, and
explicit QR opt-in. This reduces static-UI and polling-grant exposure but does
not qualify account-enabled methods, test-mode lifecycle behavior, provider
replay/order timing, production reconciliation, or the Node 22 hosted baseline.
R-044 remains high and release-blocking under PLAN-WEB-013..015.

Latest R-031 update (2026-09-20): Web PR #49 head `b103d9e` implements catalog-only checkout derivation, signed immutable one-time commercial snapshots, captured/exact-match fulfillment, owner-bound read-only QR status, and a serialized immutable payment ledger covering replay, renewals, failures, ordered lifecycle, and refunds. All exact-head local/hosted code gates pass. R-031 remains critical and release-blocking because Pro has no approved verified INR catalog price, migration `0018` is not production-qualified/applied, tax/invoice/regional policy is unresolved, and no live provider reconciliation evidence exists.

Latest R-021 production inspection (2026-09-12): the approved migrations `0000`–`0014` have now been applied to the Vercel-linked Neon `production` branch. Read-only postflight confirms 33/33 declared application tables, 15 journal rows, 74 aggregate rows unchanged across the original ten tables, and 23 added tables empty. A time-based isolated branch from production returned the pre-migration 10-table/74-row counts and was deleted. The original 74 rows have not been backfilled or reinterpreted. R-021/HOSTED-013 remain critical/open for target mapping, dual-write/backfill, complete source-target reconciliation, and application recovery/cutover qualification. The production DB role remains DDL/DML-capable and requires careful scoped operation control.

Fresh source audit addendum (2026-09-12T17:48:12Z): all 74 rows remain in legacy tables with complete read-only SHA-256 baselines; no aggregate orphan/duplicate/shape anomaly was found. One legacy founder override, one monitor registration with non-empty channel data and 1,350 dependencies, and one canary alert require explicit semantics in any backfill; no target write is authorized by these counts/digests. The audit did not prove provider backup/restore or application rollback. HOSTED-013/R-021 remain critical/open.

Migration replay preflight addendum (2026-09-12): names/types/nullability match for the 87 columns in the ten existing tables; defaults/indexes/constraints/grants remain unchecked. Migration `0000`'s scoped read-only dry-run found 0 `sentinel` plans, but the script also alters the `licenses.plan` default. A missing history table means replay order/application state cannot be established. No tested production restore/rollback evidence exists in the reviewed shipping records; do not replay the chain yet.

Latest R-031 update (2026-09-12): web `cfe6936` adds a 503 catalog-purchasability gate before new Pro QR creation; PR #32 run `34678789958`, GitGuardian, and Vercel pass. This partially contains new-charge exposure only. The existing QR/webhook fulfillment path is unchanged; env INR-paise remains independent of catalog USD pricing, and amount/currency binding, idempotent lifecycle/refund handling, and invoice reconciliation remain open. R-031 remains critical and release-blocking for billing.

Latest R-021 update (2026-09-12): web `9eba73d` adds an explicit read-only schema/count preflight tied to migration/journal SHA-256 and confirms the isolated local test DB has none of the 33 declared app tables. Hosted workflow `34679868578`, GitGuardian, and Vercel pass. This validates only the empty-schema path; there is still no reproducible legacy foundational baseline, production-history reconciliation, signed source manifest, real-data audit, or backfill. R-021 remains critical and HOSTED-013 remains blocked; no migration was attempted.

Latest R-009 evidence (2026-09-20): CLI PRs #43/#44 add a trust-required exact finding/rule/subject plan, a fixed-catalog A1 pure-probe worker with no source/network access and an explicit non-isolation label, and exhaustive verdict precedence. Both exact heads pass all ten hosted checks. With Docker Desktop reachable, the pinned BusyBox runtime suite passes 15 adversarial assertions; the PID/IPC comparison is explicitly skipped because the test host is macOS. This bounded evidence does not replace authenticated/licensed recipe content, functional command integration, Linux namespace evidence, all HUNT-011 cases, or independent security review; R-009 remains critical and open.

Status: governing risk baseline for `TRUTH-012`

Reviewed: 2026-09-08

Implementation baseline: `2125035`

Scope: truth, correctness, security, privacy, licensing, migration, compatibility, operations, quota, cost, commercial, agent, UX, distribution, and acceptance risks across `verglos-cli` and `verglos-web`.

## Operating rule

A risk is not closed by documenting intent. Closure requires the named prevention and detection evidence at the referenced release gate. If evidence expires, implementation changes, a trigger fires, or ownership disappears, the risk returns to `open`.

Severity means:

- `critical`: plausible host/customer compromise, cross-tenant disclosure, destructive data loss, signing/trust compromise, or false signed release assurance; blocks the affected feature/release.
- `high`: material security/privacy/legal/commercial/correctness/availability failure; blocks the affected release gate unless the founder and accountable owner explicitly accept a bounded residual risk with an expiry.
- `medium`: meaningful degradation or support/operational burden; requires an owner and tracked mitigation before GA, but may not block unrelated paths.
- `low`: contained inconvenience with a safe fallback; track when it can aggregate or mislead.

Statuses are `open`, `mitigating`, `controlled`, `accepted`, or `closed`. Every acceptance records scope, approver, evidence, expiry, and reversal trigger. “We will monitor it” is not a mitigation without a metric, alert owner, and containment action.

Release-gate references are the numbered gates in `RELEASE_GATES.md`.

## Truth, evidence, and product correctness

| ID | Risk / current evidence / trigger | Severity / owner | Prevention and detection evidence | Rollback or containment | Blocking gate / status / residual risk |
|---|---|---|---|---|---|
| `R-001` | Public/product copy outruns implementation. Trigger: a command, plan, dashboard, docs, package description, or campaign says shipped/verified/signed/multilanguage when registry/code/tests remain partial/planned. | High · Product Truth | Generate/check public claims from the truth registry; code-link every state; copy snapshot scans; founder evidence review. | Revert/hide the claim and affected checkout/CTA; issue correction/changelog when already published. | Gate 0/6 · mitigating · human prose review can still miss context. |
| `R-002` | Missing, failed, stale, or unlicensed engine/data becomes zero findings/PASS. Current OSV paths fail soft. Trivy's current offline adapter also lacks qualified vulnerability DB/policy freshness and must remain INCOMPLETE for those scopes. Trigger: required coverage unavailable without INCOMPLETE. | Critical · Evidence/Policy | Versioned engine health/coverage, required-evidence policy, negative fixtures for every failure mode, exit 3, engine-outage monitoring. Trivy runs are digest-pinned and sandbox-bounded but computed-only trust and incomplete data freshness are explicit. | Disable affected PASS/sign/publish path; mark prior impacted decisions incomplete; rerun after restored evidence. | Gate 1 · open · third-party outages remain possible but visible; comprehensive vuln coverage, publisher provenance, and policy freshness remain unqualified. |
| `R-003` | Commit/source/artifact/image identity mismatch produces assurance about the wrong release. Trigger: mutable tag/path or user label substitutes for digest-bound subject. | Critical · Target/Evidence | Immutable subject resolver, source/artifact/OCI digest chain, provenance verification, mismatch fixtures, record binding. | Block decision/sign/upload; revoke/annotate affected projection and regenerate record for exact subject. | Gate 1/6 · open · RECORD-012 now preserves source bytes, binds the expected SHA-256 to the included subject, recomputes matched/mismatched/unavailable, and keeps provider/signature unverified in open CLI PR #38; independent issuer/signature trust verification, upstream source-lineage proof, and unavailable evidence remain open. |
| `R-004` | Import normalization/correlation loses producer facts, deduplicates distinct issues, or amplifies noise. Trigger: raw-to-normalized reconciliation mismatch or unsupported fields silently dropped. | High · Evidence Contracts | Schema versions, raw digest/lineage, loss notes, producer fixtures, stable fingerprints, many-to-many correlation, round-trip/count tests. | Disable affected importer/correlation version; fall back to separate producer observations; rebuild projection from immutable raw evidence. | Gate 1 · open · semantic differences between tools remain visible limitations. |
| `R-005` | Malformed/hostile record or evidence archive causes traversal, bomb, parser confusion, digest bypass, or unsafe rendering. Trigger: member/path/size/digest/media invariant fails. | Critical · Record/Security | Streaming caps, duplicate/path/symlink rejection, digest-before-use, allowlisted media/schema, typed subject/run/observation/verification/exception plus versioned lineage subject/edge bindings (`d782e86`, `f887220`, PR #38 pending), bounded lineage-only viewer projection, safe renderer/CSP, and bounded archive/import/parser/output/time/memory/disk/cancellation adversarial corpus (QUAL-CLI-003 accepted at PR #38 `ef6f929`, exact-head self-scan `34857443649` and nine-platform matrix `34857443701` pass). | Quarantine object; never render/sign/import; revoke public access and rotate parser version if affected. | Gate 1/2/6 · open · this corpus does not qualify full export/package integration, fuzzing, redaction/leakage across every public projection, or novel parser/library defects; those remain unqualified. |
| `R-006` | Legacy score/report/attest data is elevated into exact subject, decision, signed record, or verification truth. Current hosted attest is an unsigned caller summary. Trigger: migration/UI labels it canonical/verified. | High · Hosted Migration/Product Truth | Explicit legacy types, migration digests/quarantine, no-fabrication tests, separate routes/projections, truth-copy tests. CLI/Web PRs #38/#33 now retire the summary writer and correct the individual legacy detail page; exact-head CI is pending. | Roll back target reads, relabel/hide affected legacy projection, quarantine mappings; never rewrite a signature history. | Gate 0/1/4 · mitigating, unmerged · `/verify` marketing index still uses “verified” for historical views and remains frozen until Phase 8; existing data stays untouched. |

## Tenant, runtime, credential, and signing security

Web checkpoint correction (2026-09-12): PR #32 head `8263cf6` passes hosted Node 22 run `34677302797`, GitGuardian, and Vercel. All 19 protected route handlers are invoked under unauthenticated/forbidden denial outcomes and project-not-found masking where applicable; exact bounded bodies/statuses and authorized IDs/actions are asserted. Exhaustive role/action and PostgreSQL resolver fixtures supply actor/resource negative cases. HOSTED-012 is accepted. R-007 remains open for operator/provider privileged-access controls; application-level tenant authorization evidence does not establish operational access governance.

| ID | Risk / current evidence / trigger | Severity / owner | Prevention and detection evidence | Rollback or containment | Blocking gate / status / residual risk |
|---|---|---|---|---|---|
| `R-007` | Cross-tenant IDOR or confused-deputy access. `179837a` centralizes organization/project predicates; `08a8c46`/`bdb7045` add PostgreSQL evidence; `b0e3067` adds a scoped-only database facade; `39730f8`/`21c3b19` move organization-directory queries into an authenticated-actor-bound repository and prove cross-user isolation; `8263cf6` executes denial cases across all protected route handlers. | Critical · Hosted Security | Completed: scoped DB facade, actor-bound directory, role/action matrix, PostgreSQL tenant/resource isolation and denial cases, and bounded route-handler denial responses. Remaining: operator audit/alert and privileged-access controls. | Disable affected route/page/API, revoke sessions/tokens/URLs, preserve logs, notify/respond under incident plan, repair authorization additively. | Gate 2/4 · open · HOSTED-011/012 accepted with runs `34672637622`/`34677302797`; operational operator/provider access controls remain open. |
| `R-008` | Generic webhook can enable SSRF, redirect/DNS rebinding, metadata/private-network probing, response exhaustion, or unauthenticated receiver confusion. Web PR #48 now revalidates every attempt, rejects mixed/non-public IPv4+IPv6 answers, pins the approved address into the HTTPS socket, verifies the peer address, denies redirects, and bounds request/time/response. Trigger: classifier/transport drift, platform egress bypass, or unsigned outbound payload misuse. | Critical · Delivery Security | Completed code-level controls: literal registration check, per-attempt DNS validation, loopback/private/shared/link-local/metadata/reserved/mapped/transition denial, pinned TLS connection, redirect denial, bounded JSON/timeout/response, adversarial tests, and inbound Razorpay HMAC plus event replay claims. Remaining: infrastructure egress allow/proxy evidence and per-destination outbound payload signing/key distribution. | Disable generic webhooks globally/per tenant; revoke encrypted destination; block egress; audit/replay only after revalidation. | Gate 2/4 · open with reduced code-level exposure · QUAL-WEB-002 accepted at PR #48; public DNS/hosting and TLS/provider compromise remain, and the residual infrastructure/signing controls are not complete. |
| `R-009` | Hunt executes target/generated/arbitrary code outside declared isolation or exfiltrates secrets/resources. Current Hunt is a shell; target introduces execution. Trigger: sandbox escape, host path/socket/device/network access, fork/resource abuse, unsigned recipe. | Critical · Hunt Runtime/Security | Signed/versioned recipes; no arbitrary model shell; explicit approval/dry run; network deny; non-root/read-only/drop caps/seccomp; process-tree CPU/memory/disk/output/time limits; independent adversarial review. | Keep Hunt exit 78/disable adapter; kill process tree; destroy sandbox; rotate exposed credentials; quarantine recipe/trust root and revoke feed. | Gate 2 · open · no sandbox eliminates kernel/runtime zero-day risk; isolation class stays visible. |
| `R-010` | Raw licenses, device codes, webhook URLs, provider keys, local credential files, debug/provider errors, or support artifacts leak. Current web stores raw license/channel JSON and local files are umask-dependent. Trigger: canary secret appears in log/event/export/public response or credential readable beyond owner. | Critical · Security/Privacy | Hash/tokenize/scoped short tokens; envelope encryption; secret manager/rotation; `0700/0600` atomic local writes; structured redaction; canary tests; log/export scans; trusted endpoint policy. | Revoke/rotate keys/tokens/webhooks; disable logs/endpoints; purge where contractually possible; notify impacted owner; preserve redacted incident evidence. | Gate 2/4/5 · open · secrets necessarily reach explicitly chosen owning providers/destinations. |
| `R-011` | Customer/org/Verglos signing identities are confused or private key/trust root is compromised. No production roots/rotation/revocation exist. Trigger: unauthorized signature, placeholder key, issuer mismatch, key exposure, revoked key accepted. | Critical · Signing/Release Security | Contract progress: CLI `55a052a` binds signer/issuer/key ID/signed-at to the signature, enforces an explicit signer policy and active/retired/revoked key states, rejects a provider descriptor reporting exportable production key material, and tests rotation/revocation behavior with an opt-in test fixture. Still required: actual provider adapters/account policy; independent non-exportability/custody assurance; production roots and pins; trusted time/transparency; deployed rotation/revocation and incident drills. | Revoke/rotate key, stop signing/publication, mark affected trust interval/records, publish incident/recovery metadata, require re-sign/reverify without rewriting old facts. | Gate 1/2/5/6 · open · provider declarations are not hardware proof; caller-supplied signed-at is not trusted time; compromise before trustworthy timestamp/transparency can require manual review. |
| `R-012` | npm/package/update/feed/recipe/build supply chain is tampered with or official identity is impersonated. Current update tracks global latest; release publication remains unqualified and license clearance is blocked. Trigger: digest/provenance/signature mismatch, namespace compromise, unpinned content. | Critical · Release Engineering | Protected publishing/OIDC, immutable versions/digests, artifact attestations/SBOM/notices, compatibility manifest, signed feed indexes, update channel policy, reproducible pack/install verification. | Yank/deprecate affected release, revoke publisher/token/key, pin/block version/channel, publish verified recovery release and incident notice. | Gate 5/6 · open · registry/account-provider compromise remains bounded by independent verification. |
| `R-013` | MCP/agent gains authority beyond the user, silently networks/uploads/signs/executes, or stdout protocol is polluted. Current nine tools lack direct protocol/adversarial tests. Trigger: action exceeds tool schema/host approval or returns fabricated success. | Critical · Agent Integration | Same core contracts; typed limits; explicit host approval for network/upload/sign/run; no hidden credentials; stdio isolation; malformed/oversized tests; shell tools honest; audit action/result. | Disable/remove affected tool, revoke tokens, terminate process, clean temp state, preserve structured failure, fall back to local read-only tools. | Gate 2 · open · host applications differ in approval UX and must be qualified. |

## Privacy, retention, and public evidence

| ID | Risk / current evidence / trigger | Severity / owner | Prevention and detection evidence | Rollback or containment | Blocking gate / status / residual risk |
|---|---|---|---|---|---|
| `R-014` | Legacy CLI telemetry remains default-on and links stable project/account identifiers; new CLI branch removes that analytics coupling, stores affirmative revocable consent, and keeps analytics transmission disabled until hosted controls qualify. Paid score sync is separated by route/schema purpose. Trigger: legacy-client request, analytics collection before retention/deletion qualification, or purpose confusion. | High · Privacy/Hosted Analytics | CLI PR #38 adds versioned consent, coarse identity-free analytics schema, disabled-by-default transport, separate bounded paid sync route, and process canaries. Still required: named owner/access/retention/deletion policy, vendor/request-log retention, legacy-client disable/version plan, independent full egress review. | Keep analytics transport disabled; restrict legacy endpoint/retention, isolate/delete raw events under approved policy, correct disclosures, notify as required. | Gate 0/2/4 · open · CLI/Web exact-head checks pending; no production behavior changed yet; pseudonymous account sync remains identifying within its paid product purpose. |
| `R-015` | Source, paths, finding text/snippets, matched secrets, customer IDs, or signing material leak through reports, upload, public verification, logs, webhooks, or support. Current `reports.findings` is untyped and public attest index exposes names. | Critical · Privacy/Evidence Security | Local/no-upload default; deny-by-default schemas; redaction manifest; exact preview; private default; tenant auth; signed URLs; canary fields across analytics/log/public/support; CSP/safe renderer. | Disable upload/public/support channel, revoke URL, quarantine/delete projection, rotate secret, preserve canonical private evidence, incident response. | Gate 1/2/6 · open · customers can intentionally publish sensitive labels; UX must make consequence explicit. |
| `R-016` | Data outlives purpose/plan/deletion request across DB, objects, backups, logs, Clerk/Neon/Vercel/Resend/Slack/Razorpay/OSV. Current tables have no enforced retention/account deletion. Trigger: overdue `retain_until`, orphan, failed vendor deletion, missing receipt. | High · Data Governance/Operations | Field registry; retention owner/policy; deletion workers/outbox; legal-hold separation; account export/delete orchestration; backup/log/vendor schedules; reconciliation and deletion receipts. | Stop new collection for affected class, restrict access, retry/reconcile deletion, escalate vendor/incident, disclose incomplete deletion accurately. | Gate 2/4/6 · open · immutable billing/legal records require disclosed exceptions. |
| `R-017` | Public verification traffic tracking over-collects or mislabels IP-derived views as verification. Current daily IP digest uses a hard-coded fallback salt and persists indefinitely. Trigger: fallback salt, user agent/raw IP retention, view count shown as cryptographic verification. | High · Public Verification/Privacy | Required secret/no fallback; minimize/drop UA; short retention/aggregation; legal notice; separate request/view/signature-verification metrics and labels; bot/rate controls. Web PR #33 stops new per-view writes from the legacy detail page and leaves historical rows unchanged. | Disable view logging/public aggregate, rotate salt, expire raw digests, correct public wording; preserve record verification function without tracking. | Gate 0/2/6 · open · `/verify` index copy, historical data retention, salt removal/rotation, and aggregate privacy remain unqualified. |

## Licensing, ownership, and redistribution

| ID | Risk / current evidence / trigger | Severity / owner | Prevention and detection evidence | Rollback or containment | Blocking gate / status / residual risk |
|---|---|---|---|---|---|
| `R-018` | Published npm/deployed artifacts may omit dependency notices, weak-copyleft/source duties, SBOM, or copied-file modification provenance. Current CLI inventory reconciles 254 lock versions plus one nested component; current review output still has eight unresolved classifications (benchmark ISC/BSD-3-Clause conflict, six BlueOak cases, minipass-pipeline missing source). All six archives stage LICENSE and THIRD_PARTY_NOTICES, and SBOMs are generated. Web DIST-WEB-001 inventory covers 413 components and flags 79 for manual review, including 53 with no declared license; web MPL/LGPL/CC-BY assets and four modified vendor copies remain open. New Sigstore dependencies are included in the current CLI inventory, but no legal clearance is implied. | High · Release Engineering/Legal | Lock-complete artifact classifier; generated SBOM/notices; license files in tarballs; review conflict and external-content/source obligations; copied-file origin/digest/modification record; artifact gate. | Block/yank release, remove noncompliant asset, repack with notices/source, notify recipients where required. | Gate 0/5 · open · manual review and final legal interpretation remain counsel/founder-owned. |
| `R-019` | External engine/database/schema/fixture/premium pack/recipe has unknown or incompatible license, provenance, trademark, or customer authorization. Trigger: bundling/redistribution/publication without exact artifact record. | High · Legal/Engine/Content | 2026-09-14 inventory records pinned local Trivy 0.74.0 and explicit offline scope, detect-secrets probe-only behavior, Sigstore dependency/fixture attribution/digests, standards code versus vendored files, and scanner fixtures already present in public Git. Still require authenticated Trivy publisher provenance before claiming trusted upstream origin; exact data/rule licenses; fixture authorship/source decision; premium recipe/content rights, modification, customer-license, and trademark records. Unknown classification fails redistribution. | Exclude/unbundle asset, disable feed/package, invoke customer installation, replace with synthetic/compatible material; retain evidence of removal. | Gate 0/5/6 · open · LIC-002 incomplete; upstream terms can change and require re-review. |
| `R-020` | Copyright owner, contributor inbound terms, or brand/trademark policy is unclear. Current legal owner/CLA-or-DCO and separate brand policy are unresolved. Trigger: material outside contribution, ownership claim, third-party branding, enforcement/distribution dispute. | High · Founder/Legal | Establish owner records, contributor DCO/CLA decision, provenance checks, trademark/brand-use policy, protected signing/publisher roles. | Pause accepting/materially using contribution or disputed branding; revert/quarantine change; seek written assignment/license/approval. | Gate 0/5 · open · jurisdiction-specific advice remains external. |

## Migration, compatibility, and data integrity

| ID | Risk / current evidence / trigger | Severity / owner | Prevention and detection evidence | Rollback or containment | Blocking gate / status / residual risk |
|---|---|---|---|---|---|
| `R-021` | Schema migration or later backfill loses, duplicates, misassigns, or makes customer data unavailable. The 15 migrations are now recorded in production; all 33 declared tables exist. The original ten tables retain their audited counts (74 aggregate rows), and the 23 newly created tables are empty. Trigger: source-target count/digest mismatch, orphan, lock/latency spike, failed restore, or dual-write divergence. | Critical · Hosted Migration/Data Operations | Preserve the verified production baseline; use idempotent backfill with explicit legacy mapping/quarantine, bounded dry run, per-source/target counts/digests, shadow comparison, owner review, and a tested application recovery procedure before cutover. | Halt backfill/cutover on mismatch; keep legacy reads authoritative, pause writers if needed, replay/repair idempotently or forward-fix. Do not destructively down-migrate live new data; restore only in a controlled, separately approved incident. | Gate 2/4 · open · schema expansion is verified, but data mapping/backfill, source-target reconciliation, and application-level rollback/cutover qualification remain incomplete; production role can write and requires scoped operation controls. |
| `R-022` | Legacy clients, reports, configs, flags, exits, or hosted flows break during V1 migration. Current 19 commands have sparse process tests and inconsistent exits. Trigger: supported old CLI/server pair changes observable behavior unintentionally. | High · CLI/Hosted Compatibility | 24 process fixtures; old/new client-server matrix; versioned schemas/aliases; additive flags; deprecation/error plan; legacy readers/projections; canary rollout. | Roll back per-surface flag/application version, retain compatibility adapter and old schema reads, publish corrective release; preserve local artifacts. | Gate 0/3/5 · open · unsupported prerelease quirks require explicit boundary. |
| `R-023` | Dual writes diverge or rollback becomes impossible because new-only data is forced into lossy old tables. Trigger: repair backlog, mapping collision, old/new shadow mismatch, unrepresented new state. | Critical · Hosted Platform | One transaction/outbox, operation/idempotency IDs, observable repair queue/SLO, old-authoritative then target-authoritative phases, new-only feature hold, per-surface flags. | Pause rollout/new-only features, revert read authority, repair/replay from immutable event/mapping; keep old table read-only through window. | Gate 4 · open · temporary inconsistency remains visible during provider outages. |
| `R-024` | Raw reports/dependency/channel JSON is malformed/oversized or cannot be safely normalized; inferred fingerprints/names merge distinct tenants/apps. | High · Hosted Data/Evidence | Size/schema limits, byte-preserving digest/quarantine, tenant-local exact-key mapping, no email-domain/cross-license inference, source timestamps and loss markers. | Quarantine row/object; keep legacy view guarded; require owner correction/re-upload; never silently discard or merge. | Gate 1/2/4 · open · some legacy rows may remain unmigratable and retained only by policy. |

## Operations, availability, alerts, and recovery

| ID | Risk / current evidence / trigger | Severity / owner | Prevention and detection evidence | Rollback or containment | Blocking gate / status / residual risk |
|---|---|---|---|---|---|
| `R-025` | Queue/job retry loses work, duplicates side effects, starves tenants, or creates replay storms. Neon PostgreSQL is selected and code-level provider/producer/worker/DLQ controls are accepted; production cutover, representative load, provider-wide recovery, and measured lag/fairness remain unqualified. Trigger: missing ack, lease expiry, duplicate delivery, DLQ growth, lag/fairness threshold breach. | High · Operations | Atomic `SKIP LOCKED` leasing, monotonic fences, idempotent enqueue, bounded retry/dead-letter, tenant cursor/backpressure, transactional outbox, and audited bounded replay are tested locally/hosted. Still require production metrics, failure injection, load, restore/replay, and OPS-015 cutover evidence. | Pause producers, scale/throttle, isolate poison job, move to DLQ, replay bounded set after fix; derive intent from outbox. | Gate 4 · open · implemented semantics reduce duplicate/loss risk, but provider-wide failures and production recovery may still cause visible delay or loss until qualified. |
| `R-026` | Monitoring source failure/staleness could appear clean or project-centric work could miss/overload advisories. Due producer, worker, normalized cache, reverse index, and explicit `INCOMPLETE` outage state are accepted in code; production dual-run/cutover and measured freshness remain open. | Critical · Monitoring/Evidence | Source/version/freshness/incomplete state, normalized cache/reverse component index, due scheduling/backpressure, source-outage fixtures, and freshness metrics are implemented/tested. Still require OPS-015 cutover, representative load, and production alert thresholds. | Mark affected inventory/release INCOMPLETE, pause “clean” notifications/decisions, retry from cached/alternate source with visible age; no fabricated match. | Gate 1/4 · open · zero-day/source publication latency and unqualified production cutover remain explicit limitations. |
| `R-027` | Alert could be suppressed before delivery, duplicated, or lost during retries. Transactional match/outbox, per-channel state, deterministic dedup, bounded retry/dead-letter, and audited replay are accepted in code; production channel/cutover and end-recipient evidence remain open. | High · Delivery Operations | Logical event/outbox, per-channel attempts, deterministic idempotency, sanitized bounded adapters, retry/DLQ, canary contracts, and delivery metrics are implemented/tested. Still require production channel credentials, load/failure injection, and OPS-015 cutover evidence. | Stop affected channel, retain/replay unsent outbox, reset only failed attempt under audit, notify dashboard/owner; never delete event to force retry. | Gate 4 · open · provider acceptance is not guaranteed end-recipient delivery, and production wiring/recovery are unqualified. |
| `R-028` | Backup restores incomplete metadata, missing/corrupt objects, stale queue/outbox, or duplicate external effects. Current production restore/object reconciliation is unproved. | Critical · Data Operations | V1 queue/storage selections are now Neon PostgreSQL plus bounded JSONB; OPS-014 provides digest-manifest/reconciliation primitives. Still require versioned production backups, isolated restore drill, object/orphan reconciliation, point-in-time boundary, credential/key availability, actual queue/outbox replay tests, measured RPO/RTO, and export/exit evidence. | Freeze writes, restore chosen watermark, reconcile/replay idempotently, mark gap/incomplete, rotate secrets if backup exposure; communicate actual recovery window. | Gate 4 · open · provider-wide correlated failures and production recovery remain unqualified despite selected providers and code-level primitives. |
| `R-029` | Provider/configuration outage (Clerk, Neon, Vercel, Razorpay, Resend, Slack, OSV, npm, queue/storage/Sigstore) causes hidden partial success or blocks local value. | High · Platform Operations | Web PR #49 makes the complete implemented production matrix fail closed with value-free diagnostics and pins PostgreSQL queue/JSONB storage. Local and hosted-preview gates pass. The actual Vercel production variable names/scopes remain unverified because the installed credential is unauthorized; PR #49 remains open rather than risking an automatic fail-closed production build before selector provisioning. | Disable dependent hosted action, preserve local/read-only operation, queue safe intent, switch only to prequalified fallback, reconcile after recovery. | Gate 1/4/5 · open · actual production configuration/deployment evidence and third-party SLA/failover evidence remain outside verified coverage. |

## Quota, cost, billing, and commercial viability

| ID | Risk / current evidence / trigger | Severity / owner | Prevention and detection evidence | Rollback or containment | Blocking gate / status / residual risk |
|---|---|---|---|---|---|
| `R-030` | Concurrent requests exceed seats/apps/records/managed allowance, counters drift, or 100% blocks existing/local work. No usage/reservation model exists. | High · Hosted Platform/Billing | Immutable ledger; atomic reserve/commit/release; gauge/counter semantics; replay reconciliation; N/N+1 concurrency tests; 80/100 UX; modified-client tests. | Disable new hosted ingestion/managed admission only, rebuild projections, release expired reservations, preserve existing reads/records/local work. | Gate 4 · open · temporary conservative denial may occur during reconciliation and must be visible. |
| `R-031` | Surprise charge or gateway/catalog/entitlement mismatch. Checkout is now catalog-derived but Pro has no approved verified INR catalog row and production/live-provider evidence is absent. Trigger: charged amount/currency/period/plan differs from the signed checkout snapshot or an unapproved overage is attempted. | Critical · Billing/Product | Signed immutable checkout snapshot; captured exact-match fulfillment; immutable payment/checkout identity; serialized renewal ledger; replay, cross-channel, failure, out-of-order, cancellation, expiry, and refund tests. Still required: approved verified INR price, production migration/configuration, tax/invoice/regional policy, explicit capped overage consent, and live reconciliation. | Keep checkout disabled; preserve entitlement while investigating user fault-free cases; refund/correct invoice; restore prior catalog version; reconcile ledger/provider; notify customer. | Gate 0/4/6 · open · code path is qualified at PR #49 `b103d9e`, but migration `0018` and provider lifecycle are not production-qualified. |
| `R-032` | Unbounded managed execution, storage, verification traffic, advisory work, delivery retries, or support time destroys margin/availability. Current per-plan COGS is unknown. | High · Finance/Operations | Stable internal cost units, hard safety ceilings, admission/backpressure/rate limits, p50/p95/p99 load, invoice/export cost evidence, per-plan COGS/support report, no unlimited null. | Disable/throttle expensive feature, reject new work safely, shorten only future approved retention, cap retries/egress, preserve existing evidence/local work. | Gate 4 · open · demand and provider rates can change after launch; ongoing budgets/alerts required. |
| `R-033` | Provider cost allocation or usage data is false precision, incomplete, privacy-invasive, or used as customer billing without approval. Trigger: unattributed spend omitted, estimates called actual, content fields enter ledger, internal attempt directly charged. | High · Finance/Data Governance | Actual-vs-estimate labels; invoice source/digest; versioned allocation and unattributed remainder; stable integer units; forbidden-field tests; billing ledger separation. | Withdraw metric/invoice line, recalculate with correction entries, refund customer error, pause catalog/allowance change until evidence reconciles. | Gate 4 · open · shared-cost allocation remains an explicit approximation. |
| `R-034` | Plan/capability drift grants unshipped value or removes existing Pro access. CLI catalog consumption and entitlement migration remain behind the web catalog. | High · Product/Hosted Authorization | Web catalog is now versioned and is the source for web capability resolution; legacy `compliance` decodes to Enterprise, Founder is excluded from public catalog, Team/Studio are inactive, Enterprise is contracted, and unverified price is non-purchasable. CLI opaque catalog migration and current-customer compatibility/rollback remain open. | Revert catalog version, deny unshipped routes, preserve existing active entitlement under compatibility mapping, correct copy/checkout. | Gate 0/4/6 · open · server/web vocabulary is normalized; CLI catalog adoption and tenant-specific Enterprise configuration remain outstanding. |

## UX, scope, distribution, and validation

| ID | Risk / current evidence / trigger | Severity / owner | Prevention and detection evidence | Rollback or containment | Blocking gate / status / residual risk |
|---|---|---|---|---|---|
| `R-035` | Dashboard/CLI overloads users with scanner metrics and hides “can this exact release ship?”, incomplete coverage, owner, or next action. | Medium · Product Design | Decision-first IA; progressive disclosure; plain status plus non-color cues; persona usability/accessibility tests; telemetry only with consent/owner. | Revert surface flag/layout, keep machine/local report access, simplify projection without changing canonical evidence. | Gate 3 · open · expert and novice density needs may differ by projection. |
| `R-036` | V1 scope expands into CNAPP, production DAST, endpoint/runtime, autonomous pentesting, or proprietary vulnerability DB, delaying evidence wedge and increasing liability/cost. | High · Founder/Product | Backlog dependency/order, explicit exclusions, architecture review for new service boundary, measured customer evidence before scope expansion. | Stop/remove unapproved epic behind flag, preserve interoperable adapter/import seam, rebaseline plan/commit forecast. | Gate 0/4 · controlled · adjacent requests will recur and require active refusal. |
| `R-037` | Cross-platform install/update/hook/process/sandbox behavior fails or official artifacts differ from tested source. Current process/cross-platform package evidence is incomplete. | High · Release Engineering | Clean npm tarball/install/upgrade/rollback on supported OS/arch; packaged artifact tests; Windows signals/paths/npm; provenance/SBOM/notices; compatibility manifest. | Block/yank platform artifact, pin last-good version, disable updater channel, publish corrected signed artifact; local reports remain readable. | Gate 5 · open · OS/toolchain updates require recurring qualification. |
| `R-038` | POC/benchmark selection bias, unlicensed fixtures, leaked customer data, or overfit detectors produce false market evidence. External validation is intentionally after RC. | High · Research/Product/Legal | Frozen preregistered corpus/method, exact commits/digests/licenses/authorization, blinded review, denominator/error reporting, no training/tuning on holdout, consented customer scope. | Withdraw result/claim, remove unauthorized fixture/data, rerun from frozen method, disclose correction; do not tune retroactively then claim same experiment. | Gate 5/6 · open · external validity remains bounded to sampled populations. |
| `R-039` | Accessibility or machine-readable alternatives fail, making evidence unusable or decisions ambiguous. Current final views do not exist. | Medium · Design/Engineering | Keyboard/screen reader/contrast/reduced-motion tests, semantic status text, JSON/SARIF/record parity, zoom/mobile/browser matrix. | Disable/rework affected projection while retaining accessible machine/local output; never change evidence truth to fit UI. | Gate 3 · open · assistive technology/browser variance requires representative testing. |
| `R-040` | Cross-workspace receipt replay is denied by `c59126e`; rollback and Next.js replacement use same-directory atomic rename from `d7430a5`. CLI PR #38 `a64feb0` adds explicit digest-bound selected-test execute approval, configured audit-store persistence, bounded Node test execution, optional rescan, and tested rollback. Focused tests 27/27; exact-head CI passes all nine platform cells. | High · Agent/Mutation Safety | Keep exact workspace/path/test-byte approval, persist configured receipts before execution, and retain explicit warning that selected test/import code runs with normal host filesystem/process/network permissions; require a sandbox contract before autonomous or untrusted-code use. | Disable mutation on any scope or rollback uncertainty; do not accept a broader receipt or report rollback success unless verified. Do not label this runner isolated/sandboxed. | Gate 2 · open · AGENT-007 acceptance is complete; residual risk is explicitly non-sandboxed selected-test code and needs independent review/owner decision before any broader unattended use. |
| `R-041` | A production database connection credential was exposed in a local process listing while performing a migration diagnostic on 2026-10-06. The value is not retained in shipping documents, logs, commits, or reports. Trigger: any reuse of the exposed credential or further production command-line credential handling. | Critical · Platform Security | Treat the credential as compromised; rotate the Neon/database password and refresh the Vercel production secret before any further production read/write. Use environment files/stdin or provider-managed secret injection, never command-line arguments. Verify the new secret with a bounded read-only identity check and inspect shell/process history for copies. | Revoke/rotate immediately, invalidate local temp files, remove shell history entries where feasible, audit provider access, and pause all production operations until post-rotation verification passes. | Gate 0/4 · open · no further production access is authorized by this evidence until rotation and verification are complete; code-only work may continue. |
| `R-042` | Web and CLI policy digest algorithms are not currently byte-compatible for nested policy values. Web `digestPolicyDocument` sorts only top-level keys, while CLI `canonicalizeJson` sorts recursively; a nested extension fixture produced different `sha256:` digests on 2026-10-06. Trigger: deploying a hosted organization-policy endpoint before canonical alignment. | High · Hosted Policy/CLI Compatibility | Freeze the endpoint until both sides share the same recursive canonical JSON contract; add cross-repository fixture tests, decide whether existing stored digests need a versioned migration, and reconcile any production rows before activation. | Keep hosted policy fetch disabled; reject mismatched digests rather than silently accepting; migrate only after snapshot, dry-run, row counts, and rollback/forward-fix review. | Gate 0/3/4 · open · TEAM-CLI-001 hosted API cannot be accepted until the digest contract and existing-data impact are qualified. |

## Immediate release blockers from current evidence

The following are active blockers, not future hypotheticals:

1. `R-007`: the hosted report reader ownership condition can authorize an authenticated Clerk user without a corresponding database user row.
2. `R-008`: code-level private-network, redirect, DNS/socket-rebinding, response-exhaustion, and inbound replay defenses are qualified at Web PR #48; platform egress allow/proxy evidence and per-destination outbound signing/key distribution remain release blockers.
3. `R-010`/`R-014`: raw credentials and project-linked default telemetry do not meet the privacy/credential contract.
4. `R-018`: CLI PR #34 adds the Apache root LICENSE to all six npm archives and improves generated notices, but lock-complete CLI classification, final artifact qualification, and web copied/transitive obligations remain unresolved.
5. `R-021`: repository migrations cannot recreate/prove the foundational hosted schema.
6. `R-026`/`R-027`: current monitoring can turn OSV failure into apparent absence and has no durable per-channel delivery retry.
7. `R-031`: checkout is cryptographically bound to a catalog snapshot, but no approved verified INR price or production/live-provider reconciliation exists.
8. `R-040`: AGENT-007's explicit approval, diff, selected-test, rescan, rollback, and cross-platform acceptance is complete at CLI PR #38 `a64feb0`; however selected project tests run with normal host filesystem/process/network permissions and are not sandboxed. Do not enable unattended execution against untrusted workspaces or claim isolation; broader use requires explicit owner review or a separately qualified sandbox.

Hunt, canonical records/signing, Team/Studio/Enterprise, managed execution, tenant migration, and new public verification remain disabled/planned, so their critical/high risks block activation rather than an already-shipped complete feature.

## Review and escalation cadence

- The owner reviews a risk whenever its trigger fires, its dependent task changes, a provider/contract/license changes, or a release candidate is cut.
- Critical/high open risks are reviewed at every affected release gate. A `controlled` status includes the exact passing artifact/test/runbook and its commit/run date.
- Security/privacy incidents immediately prioritize containment and evidence preservation over roadmap work. Legal/ownership uncertainty blocks redistribution/publication, not safe local analysis/design.
- Cost alerts use measured units and dated provider evidence. No owner may solve cost by silently degrading Free local work, deleting existing records, or creating surprise charges.
- `STATUS.md` lists current blockers; `TRACEABILITY.md` links capabilities to implementation/tests; this register remains the authority for risk ownership and containment.

`TRUTH-012` changes no runtime, data, provider, package, plan, claim, blog content, or landing-page content.

Current R-007 evidence update (2026-09-12): web PR #32 head `8263cf6` and hosted run `34677302797` verify bounded denial returns from all 19 protected route handlers, supported by the exhaustive role/action matrix and PostgreSQL resolver cases. HOSTED-011/012 are accepted. R-007 remains open for operator/provider privileged-access and audit/alert controls; application tenant-boundary acceptance does not establish operational access governance.

| `R-043` | Owner/name-only SCM binding can misidentify a GitHub organization, permit overbroad repository scope, or mishandle installation lifecycle. | High · SCM identity/tenant isolation | Require immutable GitHub account/repository IDs, App installation/token permission checks, delivery-id replay keys, uninstall/suspend reconciliation, and a bounded authorized-org cutover. | Keep live GitHub-org claims and unattended check publication disabled; fail closed on identity or permission uncertainty. | Gate 3/6 · open · `GITHUB-WEB-001..004`. |
| `R-044` | Razorpay methods vary by account approval/configuration; a static “all methods” UI could promise unavailable payment paths or produce incomplete lifecycle handling. | High · Billing truth | Server/catalog-driven method availability and a redacted test matrix for each enabled method, including capture, failure, refund, renewal, replay, and ordering. | Hide unqualified methods and preserve captured-only/idempotent entitlement logic. | Gate 4/6 · open · `PLAN-WEB-013..015`. |
| `R-045` | Public-repository fixtures can bias evaluation, contain license/IP/PII issues, or be misrepresented as customer acceptance. | High · Acceptance/privacy/legal | Keep full-clone manifests, authorization notes, reports, and findings private; use held-out fixtures and record licenses/scope before analysis. | Do not publish fixture data or claim customer evidence; remove any unauthorized fixture immediately. | Gate 6 · open · `ACCEPT-011..014`. |
| `R-046` | Public CLI commits or logs could reveal private corpus structure, detection strategy, credentials, or competitive intelligence. | High · Public/private boundary | Run staged-file/public-boundary checks; store only hashes and sanitized aggregate evidence publicly, with detailed reports private. | Stop push and rotate any exposed secret; audit history before release. | Gate 0/6 · open · owner: shipping lead. |
| `R-047` | A functional Hunt command can pass local monorepo tests while the public six-package archive cannot install its private `@verglos/hunt` runtime; enabling it would create an unsupported alpha surface or leak private runtime code. | High · Hunt/Distribution | Keep the alpha shell exit-78 contract; reject private workspace dependencies in the packer; require an approved private-runtime distribution design plus trusted/licensed recipe and independent security evidence before enabling. | Revert/disable the command, preserve the last truthful shell, and block publication until the package boundary and gates are independently verified. | Gate 2/5 · open · HUNT-008/009/010/011, QUAL-CLI-004. |
| `R-048` | Account deletion can be recorded without being safely executable: no persisted legal/customer-held authority exists, the generic queue is organization-scoped while deletion is user-scoped, and the complete user-owned data graph has not been operationally enumerated. | Critical · Privacy/Data Governance | Keep the request ledger pending; require a versioned ownership inventory, durable hold authority, customer-held digest contract, bounded worker, row-count reconciliation, audit receipt, and restore rehearsal before destructive execution. | Do not execute deletion; restrict account collection if required; preserve the request and disclose pending/blocked status; escalate legal/vendor retention decisions. | Gate 2/4/6 · open · `QUAL-WEB-005`; exact boundary recorded in `qual-web-005-deletion-worker-boundary-2026-10-07.md`. |

R-048 update (2026-10-07): Web PR #153 adds a versioned seven-kind deletion
inventory and a fail-closed stale/incomplete-inventory gate. This reduces
omission risk in the design boundary but does not provide durable
legal/customer-held authority, a user-scoped bounded worker, row-count
reconciliation, terminal audit receipt, restore rehearsal, or
non-production end-to-end evidence. `QUAL-WEB-005` remains critical and open;
no destructive execution is permitted.

R-048 update (2026-10-07, hold substrate): PR #153 now contains a durable
hold schema and explicit release contract, but the migration is unapplied and
there is no operational writer, worker, customer-held digest proof, row-count
reconciliation, audit receipt, restore rehearsal, or non-production E2E. The
critical deletion risk remains open and the hold table must not be treated as
production authority until its migration and writer receive separate
preflight, authorization, and post-write evidence.

R-048 update (2026-10-07, digest substrate): PR #153 now has a digest-only
registry and exact before/after comparison contract. This does not prove that
customers registered every held record, provide an authenticated writer, or
make deletion operationally safe. Migrations `0029`/`0030` remain unapplied;
the worker, reconciliation, audit receipt, restore, and E2E evidence are
still critical open requirements.

R-048 update (2026-10-07, worker contract): PR #153 adds bounded orchestration
and stable failure handling but no store adapter or destructive execution.
The organization queue remains unsuitable for user-scoped deletion. The
critical risk remains open until disposable-DB integration, row-count/audit
reconciliation, restore rehearsal, and non-production E2E pass.

R-048 update (2026-10-07, worker scope fence): PR #153 head
`ade21b6f4c74b0a27bcf349bded6d9ceb7e39ee0` now blocks a claimed job whose
persisted user identity differs from the invocation before reading deletion
state or invoking an adapter. Focused 32/32, negative-boundary 2/2, and hosted
workflow `37560704115` passed. This reduces cross-user execution risk but does
not change the critical status: the operational store/job boundary,
transactional deletion, reconciliation receipt, restore/rollback rehearsal,
and non-production E2E remain missing; migrations 0029/0030 are unapplied.

R-048 update (2026-10-07, job persistence): PR #153 head
`b91222a8d4d6ffd08f2be71391d89a6dafedab1` now atomically pairs the request
ledger with a dedicated user-scoped job and bounds attempts, idempotency,
status, kinds, and lease fields. Focused 16/16 and disposable PostgreSQL 1/1
pass; migration `0031` remains unapplied. The critical risk is reduced at the
enqueue boundary but remains open until fenced claim/retry SQL, complete
user-owned-data execution, row-count/audit reconciliation, restore/rollback,
and non-production E2E are qualified.

R-048 update (2026-10-07, inventory read): PR #153 head `4656013` adds
lease-fenced counts for the seven hosted kinds plus hold/digest reads, but
keeps `inventoryComplete=false` because supporting user/license/retention
tables and legal dispositions are not yet covered. This reduces omission risk
without enabling deletion; the critical risk remains open until the complete
data graph, per-kind transactions, reconciliation/audit, restore/rollback,
and non-production E2E are qualified.

R-048 update (2026-10-07, fenced adapter): PR #153 head
`654c78c69a44d7b5aad4733ec7cb364d760b76b0` adds atomic user-scoped
`SKIP LOCKED` claim/retry/block state with worker/attempt fences and verifies
it against disposable PostgreSQL. The adapter intentionally fails closed for
inventory, destructive, and audit methods; no runtime wiring or production
migration exists. The critical risk remains open until the complete data graph,
per-kind transactions, row-count/audit reconciliation, restore/rollback, and
non-production E2E are qualified.

R-048 update (2026-10-07, hosted inventory verification): PR #153 exact head
`4656013425c4cadb498f004c1057aa6f1d5931b6` passed hosted workflow
`37562115786` and the required provider checks. This validates the read-side
substrate only; `inventoryComplete=false` remains deliberate and no
destructive method or runtime worker is enabled. The critical omission,
retention, reconciliation, restore, and E2E risks remain open.

R-048 update (2026-10-07, terminal receipt): PR #153 exact head `52be606`
adds a source-only immutable receipt and live-fenced request/job completion
boundary, verified by disposable PostgreSQL and hosted workflow
`37562587132`. This reduces audit-idempotency ambiguity but does not enable
deletion: complete ownership/retention mapping, destructive transactions,
runtime wiring, reconciliation, restore/rollback, and E2E remain critical open
risks; migration `0032` is unapplied.

R-049 update (2026-10-07, payment catalog): the hosted method catalog is
broader in code, but provider/account enablement and lifecycle evidence are
not established. Do not claim card, netbanking, wallet, EMI, or any other
method is live merely because its code is recognized. Keep `PLAN-WEB-013`,
`PLAN-WEB-014`, and `PLAN-WEB-015` open until test-mode method configuration,
order/payment/webhook/replay evidence, and reconciliation are captured. No
provider or production write was performed.

R-049 update (2026-10-07, test-mode order probe): Razorpay accepted one
bounded test-mode order for the exact canonical Pro monthly amount and the
signed notes read back correctly; focused Web billing/configuration tests pass
38/38. This reduces order-creation uncertainty only. The account-enabled
method set and complete payment lifecycle/reconciliation evidence remain
unknown, so PLAN-WEB-013/014/015 stay critical open risks. No payment or
production write occurred.

R-049 update (2026-10-07, direct checkout retry): a second bounded test-mode
order was created and navigated through the existing CDP target, but the
direct provider page exposed no actionable form. No payment lifecycle or
method evidence was claimed; the test order was not captured and the target
was restored to `about:blank`.

R-049 update (2026-10-07, hosted response contract): Web PR #149 commit
`520d40a` now rejects malformed, duplicate, QR-only, and separately unsupported
method lists in the client before hosted Checkout opens. This reduces stale or
overpromised UI risk only; account-enabled method truth, lifecycle evidence,
and production reconciliation remain open.

R-009 update (2026-10-07, provenance projection): the structured HUNT-009
result now carries verified feed/license digests and an explicit legal-clearance
limitation, reducing ambiguity when a local execution result is reviewed.
This does not establish publisher-root authenticity, legal clearance, sandbox
security, or independent review; the critical Hunt release gate remains open.

R-048 update (2026-10-07, per-kind transactions): PR #153 exact head
`9476e5d` adds durable request/kind idempotency and scoped row-count deletes,
verified locally and by hosted workflow `37563632682`. This reduces replay and
partial-operation risk but does not close the critical privacy gate: complete
supporting ownership/retention dispositions, runtime invocation, full
reconciliation, restore/rollback, and authenticated E2E remain open.

R-048 update (2026-10-07, runtime runner): PR #153 exact head `1f8571b`
adds a bounded batch runner and authenticated cron route, verified by local
route/integration tests and hosted workflow `37563987818`. The route has not
been deployed or invoked in production, and its integration deliberately
blocks on `inventoryComplete=false`. Supporting ownership/retention and legal
dispositions, complete reconciliation, restore/rollback, and authenticated
non-production E2E remain critical open risks.

R-048 update (2026-10-07, supporting dispositions): PR #153 exact head
`f83af5c` maps all 16 supporting tables to explicit dispositions and
fail-closed omission tests, verified locally and by hosted workflow
`37564437899`. The registry is not wired to destructive SQL; executable
retention/legal decisions, provider/accounting handling, reconciliation,
restore/rollback, and authenticated non-production E2E remain critical risks.

R-009 update (2026-10-07, pre-runtime trust preflight): CLI `67debee` now
verifies trust and exact rule/subject binding before loading the private Hunt
runtime, reducing preflight authority. This does not establish publisher-root
authenticity, bounded execution qualification, or independent review.

R-041 payment update (2026-10-07): the local Test Mode account rendered Cards
and Netbanking, but the bounded flows stopped at confirming/save-card and bank
selection respectively. Provider success/failure, capture/refund, webhook,
renewal, replay, out-of-order, and entitlement reconciliation remain
unverified. Production method configuration and billing cutover remain blocked
until test-mode evidence and the required credential-rotation/preflight gates
are complete.

QUAL-WEB-006 runtime update (2026-10-07): the authenticated `/orgs` empty state
has bounded desktop/mobile no-overflow and accessibility-tree observations,
but only one focusable link was present and programmatic focus did not prove a
keyboard-visible indicator. Keyboard traversal, human/screen-reader review,
authenticated data states, field-CWV, and large-data behavior remain
unverified; keep the accessibility/performance gate open.

R-QUAL-WEB-005 hold-boundary update (2026-10-07): Web PR #153 `85faba9`
serializes hold mutation with each destructive deletion and terminal receipt
using a user-scoped advisory lock, with focused and disposable-Postgres
evidence. This reduces the hold/deletion race but does not resolve the wider
QUAL-WEB-005 risks: authenticated non-production E2E, disposition and consent
review, production migrations/cutover, reconciliation, restore/RPO, rollback,
and independent acceptance remain open.

R-PLAN-WEB-013 migration-bootstrap update (2026-10-07): Web PR #149
`3f05b0a` adds a read-only preflight and an explicit local-only historical
baseline so an empty database no longer fails opaquely at migration `0000`.
Default empty databases refuse with zero writes; explicit local rehearsal
applies all 31 migrations. This does not establish production migration
history, backup/restore, rollback, or authorization evidence. R-041 credential
rotation and production migration preflight remain open; no checkbox changed.

R-041 payment/Preview update (2026-10-08): Production deployment
`dpl_EGSLPvvtccxcfK9BbPfmJzwEXY5Y` passed runtime-config validation and the
live checkout smoke. Preview was kept fail-closed because its available
environment used live-key metadata and no isolated test database was present;
the temporary method-enabled Preview deployment was deleted. Test Mode
qualification remains blocked on isolated database and test-credential setup.

R-041 payment/Preview guard update (2026-10-08): Web PR #156 merged as
`f75609f14a8c6b385663b768226cf2c0586c0812` after hosted verification passed.
Preview now rejects configured payment methods backed by live Razorpay keys or
incomplete test credentials. This reduces accidental live-key exposure but does
not establish provider lifecycle, method matrix, or production reconciliation
evidence; PLAN-WEB-014/015 remain open.

R-041 payment/Preview auth update (2026-10-08): Web PR #157 merged as
`51bb6fe701b65ffcb2a322e1ff5d67eeb99df3fe` adds a strict non-production
Preview-only fixture identity. The browser now reaches the real order route,
but the supplied Razorpay Test Mode credential returns a bounded provider
failure before order creation. No lifecycle evidence exists; PLAN-WEB-014/015
remain open pending credential repair and the complete matrix.

R-041 credential-containment incident (2026-10-08): a local environment-name
inspection command was malformed and emitted values from `.env.test.local` and
`.env.production.local` into the agent tool output. Treat the affected
Razorpay/test and production-encrypted values as compromised. No provider call,
payment, deployment, database, or production write was made with them after
the incident. Stop all provider/production qualification until the test and
production credentials are rotated/revoked, Vercel production configuration is
refreshed and redeployed where required, and bounded read-only verification
confirms the old values are unusable. Do not copy any value into this ledger.

R-041 update (2026-10-09, invoice-bound subscription and Production rollout):
Web `a95deef` fixes the observed subscription-capture routing defect by binding
through a paid provider invoice when `subscription_id` is absent; isolated
Preview evidence now shows an active subscription, captured subscription
payment, and license binding. The same code is READY in Production as
`dpl_72ptf8YQyLxxXvJHVQDg2vUfh3CN` with no activation writes. Remaining risk is
the unqualified renewal/failure/cancellation/expiry/refund/replay/out-of-order
matrix and complete provider/ledger/entitlement reconciliation. Production
billing and database activation remain fail-closed behind operation-specific
backup/restore, reconciliation, and rollback preflights.

R-041 update (2026-10-09, Test Mode subscription authorization limitation):
The isolated Preview subscription route reached Razorpay’s mandate/OTP step,
but the bounded Test Mode OTP path and a second bank-like OTP interaction did
not authorize. The first-charge/invoice reconciliation remains evidenced, but
renewal, provider failure/expiry, subscription refund, replay/out-of-order,
and complete provider/ledger/entitlement reconciliation remain unqualified.
Owner: Verglos release owner with the Razorpay Test Mode account owner. Until
a provider-supported subscription fixture or documented simulation control is
available, Gate 4 remains open and Production recurring billing remains
fail-closed. No Production or manual database write occurred.

R-041 update (2026-10-10, renewal trigger/replay boundary): Razorpay's
documented subscription update was attempted once against the exact isolated
Test Mode active match and rejected with HTTP 400 because its cycle start is
in the future. The provider has no documented charge-now endpoint. The next
supported path is Dashboard replay of an unacknowledged Subscription/Invoice
event within seven days, but the available debugging Chrome profile is not
authenticated to the Razorpay Dashboard. Owner: authorized Razorpay Test Mode
operator. Until replay or a changed provider-supported fixture is completed,
Gate 4 and `PLAN-WEB-014` remain open and Production billing remains
fail-closed. No provider, database, entitlement, or Production write was
accepted.

R-041 update (2026-10-10, Preview ingress repair and pause/resume): The stale
Preview protection bypass was replaced only on the isolated Test Mode webhook;
a read-only probe reached the application route with HTTP 405. A provider
pause/resume pair then delivered one completed signed event of each type and
returned the application subscription to `active`. The hosted recurring-card
attempt still stopped at provider eligibility/tokenization/OTP and produced no
capture or entitlement. Gate 4 remains open for recurring-card
authorization/capture and full payment/ledger/license reconciliation. No
Production webhook, billing, database, migration, or entitlement state was
changed.

R-041 update (2026-10-10, current provider requalification): Fresh deployed
responses confirm Cards-only in Production and isolated Preview, with billing
subscription creation disabled in Production and enabled only in isolated
Preview Test Mode. Razorpay webhook logs show HTTP 200 for the repaired
failed/paused/resumed deliveries, but no replay or charge-now control is
available for the selected target. Owner: Verglos release owner with the
Razorpay Test Mode account owner; review by 2026-10-17. Keep Gate 4 and
Production billing fail-closed until a supported recurring-card fixture or
provider control produces authorization/capture and reconciliation evidence.
