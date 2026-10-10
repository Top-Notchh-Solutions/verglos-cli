# Verglos shipping decisions

## 2026-10-10 · Test Mode webhook ingress uses temporary Vercel bypass

For isolated Preview qualification only, one Razorpay Test Mode webhook URL
may carry a temporary Vercel Protection Bypass for Automation query parameter
when the Preview deployment is otherwise protected. The bypass is platform
reachability only; Razorpay HMAC verification remains mandatory and Production
URLs must not receive the parameter. The value is never stored in source,
evidence, chat, or logs and must be revoked/removed after qualification.

This decision was validated by a signed Test Mode pause/resume pair that
projected `active → paused → active` in the isolated database. It does not
authorize synthetic events, direct database edits, Production writes, or a
Gate 4 completion claim.

## 2026-10-10 · Keep Gate 4 open after Test Mode card activation boundary

- **Decision:** Treat the known Test Mode card-form interaction as an
  activation limitation, not a payment success. Keep Cards-only scope and
  Production recurring billing fail-closed.
- **Evidence:** The provider checkout remained on the card form after the
  official test-card fixture and two bounded activation attempts; read-only
  provider and isolated application aggregates were unchanged.
- **Next owner/action:** Authorized payment-test operator with Razorpay Test
  Mode operations must provide a changed supported subscription fixture or
  complete a real operator activation/OTP path. Then reconcile the signed
  webhook, payment, ledger, license, entitlement, and access state.
- **Release decision:** `PLAN-WEB-014` and Gate 4 remain open. Do not guess
  OTPs, edit rows, grant entitlements, or advance to another item/gate. Review
  by 2026-10-11 IST or on provider-fixture change.
- **Boundary:** No Production, manual database, entitlement, account, or
  customer-data write; score remains **219/61/280 (78.2%)**.
- **Evidence:** `docs/shipping/evidence/plan-web-014-testmode-card-activation-boundary-2026-10-10.md`.

## 2026-10-10 · Keep Cards-only route boundary qualified, not Gate 4 complete

- **Decision:** Keep the release candidate's declared hosted method set at
  `card`. Accept the protected Preview route result as evidence that the
  server-owned catalog returns only Cards; do not claim provider lifecycle
  acceptance from that response.
- **Evidence:** Web `445d8ed`, Preview `dpl_36zQf2zEsVCrxpic8rcrjFJbQbK7`,
  HTTP 200 Test Mode create-order response, catalog `2026-10-02.0`, method
  set `card`, focused checkout tests **12/12**, and passing 47-page builds.
- **Disposition:** `PLAN-WEB-014` and Gate 4 remain open. The next acceptance
  artifact must be provider-backed card authorization/capture followed by a
  signed webhook and exactly-once payment/ledger/license reconciliation, then
  the remaining replay/order, renewal, failure/expiry, refund, timeout/retry,
  and tenant-binding evidence.
- **Boundary:** No Production billing/database/entitlement/account/customer
  write. No manual isolated-row edit or entitlement grant. Score remains
  **219/61/280 (78.2%)**; no checkbox changed.
- **Evidence:** `docs/shipping/evidence/plan-web-014-cards-only-preview-route-and-hosted-display-2026-10-10.md`.

## 2026-10-10 · Keep Gate 4 open after provider/application reconciliation

- **Observation:** Read-only Razorpay Test Mode reconciliation matched all
  34/34 provider subscription IDs to isolated application rows, but 8
  provider-cancelled rows remain application-pending. Of 33 provider payment
  records, 9 have application rows and 24 remain provider-only.
- **Decision:** Record this as concrete reconciliation progress, not complete
  payment acceptance. Do not manually repair rows, grant entitlements, or
  claim provider-only payments as application fulfillment.
- **Next owner/action:** Authorized provider operation must deliver or replay
  the exact missing signed lifecycle events to the isolated webhook, followed
  by fresh read-only reconciliation.
- **Boundary:** No Production/provider/payment/database/entitlement/account/
  customer write occurred. Score remains **219/61/280 (78.2%)**; no checkbox
  changed.
- **Evidence:**
  `docs/shipping/evidence/plan-web-014-provider-isolated-reconciliation-2026-10-10.md`.

## 2026-10-10 · Preserve divergent local CLI and qualify upstream release head

- **Decision:** Treat CLI `origin/main` `f5686b5c` as the release
  qualification head. Preserve local `main` `d0a3b217` without merge, reset,
  or force-push because it is 73 commits ahead and 883 behind and contains
  founder-owned untracked assets.
- **Reason:** Tests on a divergent local line cannot prove the remote release
  candidate. An isolated detached worktree at the upstream head preserves the
  owner’s work while keeping release evidence attributable.
- **Disposition:** Existing local `d0a3b217` evidence is labeled local-only;
  upstream `f5686b5c` evidence remains authoritative for CLI acceptance.
  `QUAL-CLI-006` and all dependent external gates stay open.
- **Boundary:** Read-only source inspection and isolated worktree only; no
  public source, deploy, package, provider, database, payment, entitlement,
  account, customer, or release state changed. Score remains
  **219/61/280 (78.2%)**.
- **Evidence:** `docs/shipping/evidence/cli-source-divergence-2026-10-10.md`.

## 2026-10-10 · Merge the Cardless EMI repair and use a pinned CI mirror

- **Decision:** Merge Web PR #172 as `98dd571` after replacing the
  rate-limited Docker Hub Postgres service with the matching Docker Official
  Image through ECR Public at a pinned image-index digest. Keep the observed
  `cardless_emi` to canonical `emi` mapping narrow and bound to the signed
  method snapshot.
- **Reason:** The provider representation was real and captured, while the
  prior literal comparison rejected it; the hosted verification failure was
  infrastructure-only and the official ECR mirror restored reproducible CI.
- **Verification:** Hosted run `37991101222` / job `114025167923` passed all
  required Web checks. Production deployment
  `dpl_EtggBABkjCRWS9NWHozgH6qbvr5J` passed runtime configuration and bounded
  read-only smoke.
- **Gate decision:** This advances Gate 4 and Production code rollout only.
  The full payment lifecycle, reconciliation, and Production activation gates
  remain open. Score remains **219/61/280 (78.2%)**; no checkbox changed.
- **Boundary:** No Production database, migration, payment, provider,
  entitlement, account, or customer-data write.
- **Evidence:**
  `docs/shipping/evidence/plan-web-014-cardless-emi-merge-production-2026-10-10.md`.

## 2026-10-10 · Bind provider Cardless EMI to canonical hosted EMI

- **Decision:** Accept only the observed provider representation
  `cardless_emi` as canonical `emi` when `emi` is explicitly present in the
  signed hosted-order snapshot. Do not add Cardless EMI to the enabled
  checkout catalog or loosen other method checks.
- **Reason:** The Test Mode account returned one captured `cardless_emi`
  payment for an order whose server-owned snapshot contained `emi`; literal
  comparison would reject a valid captured payment, while broad method
  acceptance would weaken commercial binding.
- **Evidence:** Web commit `210d880`, PR #172, focused tests **25/25**, full
  serial **900 total / 876 pass / 24 explicit skips / 0 fail**, typecheck,
  build, and read-only provider observation. Hosted schema verification is
  held by the Docker Hub Postgres pull-rate limit before test execution.
- **Disposition:** Keep Gate 4 and `PLAN-WEB-011/012/014/015` open until the
  complete method/lifecycle/reconciliation matrix is evidenced. Score remains
  **219/61/280 (78.2%)**; no checkbox changed.
- **Boundary:** No Production, provider, payment, database, entitlement,
  account, or customer-data write.
- **Evidence:**
  `docs/shipping/evidence/plan-web-014-cardless-emi-binding-2026-10-10.md`.

## 2026-10-09 · Record authoritative CLI transport hardening

- **Decision:** Treat CLI commit
  `1972af3abe648312a427c20dc96bbcce54db55a` as the authoritative API-origin
  hardening source. The earlier `439b782d` remains a stale-checkout
  historical record and is not a release claim.
- **Result:** All bearer-bearing configured API transports reject unsafe bases
  before request construction; the focused and complete CLI suites pass
  **24/24** and **44/44**, with workspace typecheck/build **12/12** each.
- **Production boundary:** Production remains in scope, but this CLI-only
  batch required no Web redeploy and made no npm, provider/payment, plan,
  database/migration, entitlement, account, or customer-data write.
- **Disposition:** Keep `PLAN-CLI-003`, `QUAL-CLI-006`, Gate 4, and the
  external reviewer/legal/protected-release/rollback/final-acceptance gates
  open. Score remains **219/61/280 (78.2%)**; no checkbox changed.
- **Evidence:**
  `docs/shipping/evidence/cli-api-origin-hardening-authoritative-2026-10-09.md`.

## 2026-10-09 · Restore standards importer source before claiming validation

- **Decision:** Restore the missing bounded parser/importer source and public
  exports required by the existing standards-validation corpus.
- **Reason:** The checked-out public `main` tree contained the corpus test but
  lacked the source modules it imported; generated `dist` files are not a
  source or release qualification substitute.
- **Evidence:** Public CLI `d0a3b21`; standards corpus **7/7**, focused CLI
  suite **17/17**, root Turbo test/typecheck/build graphs **8/8**, **11/11**,
  and **6/6**.
- **Gate decision:** Keep `QUAL-CLI-006` open for official validators,
  trusted release provenance, cross-platform clean-consumer evidence,
  protected publishing, legal approval, and independent acceptance.
- **Production boundary:** This code-only batch made no Production deploy or
  plan/provider, payment, database/migration, entitlement, account, or
  customer-data write. The Production scope remains end-to-end in the active
  goal; current operation remains fail-closed.
- **Score:** **219 checked / 61 unchecked / 280 total (78.2%)**; no checkbox
  changed.
- **Evidence:**
  `docs/shipping/evidence/qual-cli-006-standards-source-restoration-2026-10-09.md`.

## 2026-10-09 · Reject unsafe saved CLI API origins

- **Decision:** Require every CLI network helper to resolve its configured API
  base to a bare HTTPS origin before building a request. Preserve explicit
  custom/self-hosted HTTPS origins; reject HTTP and URL components that could
  redirect or reinterpret a request target.
- **Reason:** A locally editable credentials file must not be able to cause a
  license bearer to be sent to an unsafe destination. The boundary is enforced
  before fetch, not only by response handling.
- **Evidence:** CLI `439b782d`, focused tests **17/17**, typecheck, build,
  and `docs/shipping/evidence/cli-api-origin-hardening-and-provider-renewal-limit-2026-10-09.md`.
- **Provider decision:** Do not fabricate renewal/expiry events. The current
  Test Mode inventory has no due active subscription, and the official
  provider material does not document an immediate trigger. Keep the provider
  lifecycle rows open and continue independent backend work.
- **Boundary:** No Production or provider write, database/migration write,
  entitlement/account/customer-data mutation, deployment, or release occurred
  in this CLI batch. Score remains **219/61/280 (78.2%)**.

## 2026-10-09 · Keep Gate 4 open after lifecycle ordering repair

- **Decision:** Ship Web `6f932d4` to Production as a fail-closed code-only
  correction because the observed provider lifecycle regression could stale
  billing projections without requiring Production activation.
- **Evidence:** Focused tests **38/38**, typecheck, 47-page build, remote
  runtime-config/build, and read-only smoke passed. Production deployment
  `dpl_CvNvt9YEQLMhnEB8htL7eiCocbmG` is READY.
- **Isolated qualification:** Fresh Test Mode hosted active and cancellation
  reconciled to isolated active/cancelled rows; captured payment and paid time
  were preserved. Signed application-path replay repaired the prior stale
  rows, with aggregate binding **5 active→active, 7 cancelled→cancelled, 9
  created→pending**.
- **Gate decision:** This is not a complete Gate 4 pass. Provider-generated
  renewal, expiry, failure/refund, external delivery ordering, timeout/retry,
  exactly-once, and complete enabled-method evidence remain open.
- **Boundary:** No Production plan, provider/payment, database/migration,
  entitlement, account, or customer-data write occurred.
- **Score:** **219/61/280 (78.2%)**; no checkbox changed.
- **Evidence:**
  `docs/shipping/evidence/plan-web-014-lifecycle-ordering-reconciliation-2026-10-09.md`.

## 2026-10-09 · Deploy hosted retry repair to Production without activation

- **Decision:** Deploy Web `0bafe73` to Production because the hosted
  `payment.failed` retry defect is customer-facing and the change preserves
  the fail-closed billing boundary.
- **Evidence:** Focused tests **20/20**, typecheck, 47-page build, remote
  Production validation, and read-only smoke passed. Deployment
  `dpl_GnVheZKWyqbMX2zdDfsHmy8y9xHB` is READY and aliased to
  `https://verglos.com`.
- **Boundary:** Do not add Production plan IDs or Test Mode values and do not
  perform Production provider/payment, database/migration, entitlement,
  account, or customer-data writes.
- **Gate decision:** Keep Gate 4 open. Exact isolated reconciliation found
  five provider `active` rows projected as `authenticated`, in addition to
  the still-missing renewal, failure/expiry, refund, replay/out-of-order,
  exactly-once, and complete-method evidence.
- **Score:** **219 checked / 61 unchecked / 280 total (78.2%)**; no checkbox
  changed.
- **Evidence:**
  `docs/shipping/evidence/plan-web-014-hosted-retry-production-rollout-2026-10-09.md`.

## 2026-10-09 · Deploy Web `7373c8b` to Production as fail-closed code only

- **Decision:** Ship the checkout-origin repair to Production because it fixes
  a reproducible browser integration defect, while keeping Production billing
  and persistent writes disabled.
- **Reason:** The browser debug profile reached the checkout page but its
  same-origin POST omitted `Origin`; Next reconstructed the request URL with a
  different loopback host, causing a false 403. The new helper is covered by
  focused tests and preserves foreign-origin rejection.
- **Evidence:** Deployment `dpl_CLo119NrTffsbLiaNKw4Pq7K2kCA` is READY and
  aliased to `https://verglos.com`; runtime-config/build validation and
  read-only smoke passed.
- **Boundary:** No Production plan IDs, Test Mode values, provider/payment
  calls, migrations, database writes, entitlement changes, account changes,
  or customer-data mutations. Do not interpret the code rollout as billing
  activation.
- **Disposition:** Keep Gate 4 and the Production activation,
  current-backup/RPO, migration, reconciliation, monitoring, rollback,
  reviewer, legal, protected-release, and final-acceptance stages open. An
  isolated Test Mode card attempt returned to provider retry and is not
  counted as success. Score remains **219/61/280 (78.2%)**.
- **Evidence:**
  `docs/shipping/evidence/production-code-rollout-7373c8b-2026-10-09.md`.

## 2026-10-09 · Deploy Web `fa1b9f5` to Production as fail-closed code only

- **Decision:** Include and execute the Production code-rollout stage now,
  without activating billing or hosted data mutation.
- **Evidence:** Vercel deployment `dpl_4cb7vvAA88aZe3FKXftdmYfSbGJN` is READY
  and aliased to `https://verglos.com`; runtime-config/build validation and
  read-only smoke passed. Previous READY deployment
  `dpl_72ptf8YQyLxxXvJHVQDg2vUfh3CN` is retained as rollback target.
- **Boundary:** Do not copy Test Mode plan IDs, credentials, Preview database
  URLs, webhook secrets, or fixture identities into Production. No Production
  plan, payment/provider, migration, database, entitlement, account, or
  customer-data write occurred. Source migration `0038` was not executed.
- **Disposition:** Treat this as a completed Production code-rollout slice,
  not as live billing activation. Keep Gate 4, migration/RPO/reconciliation,
  rollback, monitoring, independent review, legal, protected release, and
  final acceptance rows open until their evidence exists. Score remains
  **219/61/280 (78.2%)**; no checkbox changed.
- **Evidence:**
  `docs/shipping/evidence/production-code-rollout-fa1b9f5-2026-10-09.md`.

## 2026-10-09 · Record partial hosted cancellation evidence without closing Gate 4

- **Decision:** Record the corrected isolated Preview Test Mode cancellation,
  replay, out-of-order, owner-binding, and provider/database reconciliation
  results as partial Gate 4 evidence.
- **Reason:** The provider-bound signed event was accepted, an exact replay was
  deduplicated, an older activation did not resurrect state, and the isolated
  database matched the provider. The malformed first harness payload was
  correctly rejected and is excluded from acceptance.
- **Boundary:** This does not prove renewal/charge, failure/expiry, refund,
  timeout/retry, complete payment-method coverage, or full exactly-once
  entitlement reconciliation. Production remains code-only and fail-closed.
- **Disposition:** Keep Gate 4 open and leave the backlog score at
  **219/61/280 (78.2%)** until the missing lifecycle evidence exists.
- **Evidence:**
  `docs/shipping/evidence/plan-web-014-hosted-subscription-cancel-replay-2026-10-09.md`.

## 2026-10-09 · Accept checkout terminal-state repair without closing Gate 4

- **Decision:** Accept Web `fa1b9f5` as a code-side repair for terminal
  subscription UX: cancelled/completed/expired/halted responses stop polling
  and offer a bounded restart; paid/refunded responses remain authoritative.
- **Reason:** The behavior was exposed by real isolated Test Mode cancellation
  evidence. The fix prevents a customer from being trapped in an indefinite
  processing state, while the actual hosted provider lifecycle remains
  unqualified.
- **Boundary:** Focused/local/hosted checks passed. No Production plan,
  provider/payment, database/migration, entitlement, account, or customer-data
  state changed.
- **Disposition:** Keep Gate 4 and `PLAN-WEB-011`, `PLAN-WEB-012`,
  `PLAN-WEB-014`, and `PLAN-WEB-015` open until hosted authorization/capture,
  lifecycle delivery, and complete reconciliation evidence exists. Score
  remains **219/61/280 (78.2%)**.
- **Evidence:**
  `docs/shipping/evidence/plan-web-014-checkout-terminal-lifecycle-2026-10-09.md`.

## 2026-10-09 · Accept the isolated Test Mode cancellation slice, keep Gate 4 open

- **Decision:** Accept the real Test Mode subscription creation/cancellation,
  signed local webhook, replay, and out-of-order result as partial Gate 4
  evidence only.
- **Reason:** The provider credential now returns HTTP 200 inventory and the
  local isolated route reconciles cancellation correctly, but Vercel
  Authentication blocks the deployed Preview before application execution.
  Hosted authorization/capture, provider delivery, renewal/failure/expiry,
  refund, and full entitlement reconciliation are not proven.
- **Boundary:** Test Mode and `TEST_DATABASE_URL` only. No Production plan,
  payment/provider, database/migration, entitlement, account, or customer-data
  state changed.
- **Disposition:** Keep `PLAN-WEB-011`, `PLAN-WEB-012`, `PLAN-WEB-014`,
  `PLAN-WEB-015`, and Gate 4 open. The next external action is authenticated
  access to the protected Preview (or an approved bounded protection setting)
  followed by hosted subscription authorization and webhook delivery; no
  protection bypass is permitted. Score remains **219/61/280 (78.2%)**.
- **Evidence:**
  `docs/shipping/evidence/plan-web-014-local-testmode-subscription-cancellation-2026-10-09.md`.

## 2026-10-09 · Keep Production complete but staged

- **Decision:** Treat Production as a full staged workstream. The current
  operation may be a fail-closed code rollout only, but later configuration,
  billing/database/entitlement activation, monitoring, reconciliation, and
  rollback remain required in the same shipping goal.
- **Reason:** A green hosted build does not prove migration compatibility,
  current-backup RPO, provider lifecycle correctness, or safe write recovery.
  The current Web candidate `315a432` is migration-bearing and its restore
  rehearsal has a stale approximately 441-hour snapshot.
- **Boundary:** Keep the known Production deployment
  `dpl_72ptf8YQyLxxXvJHVQDg2vUfh3CN` fail-closed. No Production plan IDs,
  payment/provider writes, database/migration writes, entitlement changes,
  account changes, or customer-data mutations occurred in this batch. Do not
  copy Test Mode or Preview values into Production.
- **Disposition:** Do not promote the migration-bearing candidate until the
  operation-specific migration, current-backup, reconciliation, and rollback
  preflight is complete. No checkbox changed; score remains
  **219/61/280 (78.2%)**.
- **Evidence:**
  `docs/shipping/evidence/production-and-preview-auth-rollout-2026-10-09.md`.

## 2026-10-09 · Prepare, but do not approve, the legal addendum

- **Decision:** Use a private structured addendum for Gate 7 review; keep all
  legal/licensing and dependent release rows open until an authorized reviewer
  completes the exact decisions and sign-off.
- **Reason:** Existing technical inventories identify versions, digests, and
  unresolved restrictions but are not legal approval. The new packet makes the
  required decision surface explicit without inventing counsel or clearance.
- **Boundary:** No license was marked clear, no notice was suppressed, and no
  package, registry, Production, provider, database, payment, deployment, or
  customer state changed.
- **Evidence:** `docs/shipping/legal/legal-review-addendum-2026-10-09.md`.
- **Score:** **219/61/280 (78.2%)**; no checkbox changed.

## 2026-10-09 · Use a superseding exact-head Hunt review packet

- **Decision:** Keep the 2026-10-02 packet as historical evidence and use the
  superseding 2026-10-09 packet for any independent review.
- **Reason:** The old packet targeted CLI `b781bc4`; the current reviewed CLI
  head is `8bea4be2`, with current hosted self-scan `37827269372` and pinned
  Docker evidence. A reviewer must inspect the exact current commit.
- **Boundary:** Packet preparation does not constitute independent review.
  Codex will not sign it and no reviewer identity or recommendation is
  invented. No external or Production state changed.
- **Disposition:** `HUNT-011` and `QUAL-CLI-004` remain open until the real
  reviewer report and the remaining trusted/licensed provenance evidence
  exist. Score remains **219/61/280 (78.2%)**; no checkbox changed.
- **Evidence:**
  `docs/shipping/evidence/hunt-independent-review-packet-2026-10-09.md`.

## 2026-10-09 · Keep provider lifecycle gate open after invoice-failure qualification

- **Decision:** Accept the invoice-only failed subscription path as isolated
  code/database qualification, but do not close Gate 4 or payment backlog
  checkboxes.
- **Reason:** The handler and reconciliation path now pass, but the current
  gate-testing plan and subscription inventory calls return HTTP 401. Real
  provider-generated lifecycle evidence cannot be inferred from local tests or
  Preview code.
- **Boundary:** No provider write was attempted after the 401. Production
  remains a fail-closed code-only rollout; no Production plan, payment,
  database/migration, entitlement, account, or customer-data write occurred.
- **Next owner/action:** Authorized Web/release operator corrects the isolated
  Razorpay Test Mode credential configuration without sending secrets in chat;
  then rerun read-only inventory before any Test Mode lifecycle write.
- **Score:** **219/61/280 (78.2%)**; no checkbox changed.
- **Evidence:**
  `docs/shipping/evidence/plan-web-014-failed-subscription-invoice-binding-2026-10-09.md`.

## 2026-10-09 · Qualify expiry in Preview before Production migration preflight

- **Decision:** Accept the Web code-side `expired` lifecycle qualification in
  isolated Preview, but do not promote migration `0037_billing_subscription_expired.sql`
  to Production yet.
- **Reason:** The fresh database, focused integrations, full Web suite, and
  protected Preview deployment pass. Production promotion would change the
  database schema and therefore needs an operation-specific migration
  preflight, backup/restore or recovery evidence, reconciliation, and
  rollback/forward-fix decision.
- **Boundary:** Production remains a real, active fail-closed code-rollout
  track. No Production plan IDs, payment/provider writes, database or
  migration writes, entitlement changes, account changes, or customer-data
  mutations occurred.
- **Disposition:** Provider-generated expiry and the rest of Gate 4 remain
  open. Score remains **219/61/280 (78.2%)**; no checkbox changed.
- **Evidence:**
  `docs/shipping/evidence/plan-web-014-expired-lifecycle-preview-2026-10-09.md`.

## 2026-10-09 · Cancellation preserves already-paid entitlement time

- **Decision:** Treat a provider `subscription.cancelled` event as a
  cancellation of future subscription charging, while preserving the license
  period already granted by a captured payment.
- **Evidence:** Isolated Razorpay Test Mode cancellation returned HTTP 200 and
  reconciled to a cancelled subscription with one captured payment and one
  active license in the isolated Preview database. No direct row edit occurred.
- **Boundary:** Test Mode and isolated Preview only; Production remained
  fail-closed with no plan, payment, database, entitlement, account, or
  customer-data writes.
- **Disposition:** This validates one Gate 4 lifecycle slice but does not
  close the complete matrix. Score remains **219/61/280 (78.2%)**; no
  checkbox changed.
- **Evidence:**
  `docs/shipping/evidence/plan-web-014-test-mode-subscription-cancellation-2026-10-09.md`.

## 2026-10-09 · Supersede stale Production deployment reference

- **Decision:** Treat Web source `a95deef` and Production deployment
  `dpl_72ptf8YQyLxxXvJHVQDg2vUfh3CN` as the current Production code-rollout
  record. Older deployment identifiers remain historical and must not be used
  as the current state.
- **Boundary:** The rollout is fail-closed and code-only. No Production plan
  IDs, payment/provider writes, database or migration writes, entitlement
  changes, account changes, or customer-data mutations occurred. Billing and
  database activation remain included later stages with operation-specific
  preflight, recovery, reconciliation, and rollback evidence.
- **Score:** **219 checked / 61 unchecked / 280 total (78.2%)**; no checkbox
  changed.
- **Evidence:**
  `docs/shipping/evidence/plan-web-014-subscription-invoice-reconciliation-and-production-rollout-2026-10-09.md`.

## 2026-10-09 · Promote reviewed code to Production without activation writes

- **Decision:** Deploy the reviewed Web source to Production as a complete
  fail-closed code rollout. Production is included in the shipping objective;
  the current operation does not activate billing or mutate hosted state.
- **Evidence:** Deployment `dpl_HRbg2hLmHe2WTFxvupkewdw3u9hg` is READY and
  aliased to `https://verglos.com`; local and remote build/config checks passed;
  public smoke passed for the documented routes and method/auth boundaries.
- **Boundary:** Do not add Test Mode plan IDs, test credentials, Preview
  database URLs, or test webhook secrets to Production. No Production
  database, migration, payment/provider, entitlement, account, or
  customer-data write occurred. Live activation remains an included later
  stage requiring its own exact preflight, recovery, reconciliation, and
  rollback/forward-fix decision.
- **Score:** **219 checked / 61 unchecked / 280 total (78.2%)**; no checkbox
  changed.
- **Evidence:**
  `docs/shipping/evidence/production-code-rollout-dpl-HRbg2hLmHe2WTFxvupkewdw3u9hg-2026-10-09.md`.

## 2026-10-09 · Make Production a first-class staged shipping track

- **Decision:** Production work is included in the active goal. Ship reviewed
  code and run read-only smoke/monitoring/reconciliation work when the
  code-rollout preflight passes; activate Production billing or database
  writes only after the operation-specific backup, restore, dry-run,
  reconciliation, and rollback preflight passes.
- **Reason:** Production cannot be treated as irrelevant, but Test Mode
  credentials, Test Mode plan IDs, Preview databases, and test webhook
  fixtures must never be copied into Production. A fail-closed Production
  code rollout is a real shipping step, not a final billing acceptance.
- **Evidence:** Web Production deployment
  `dpl_E3Xr4UZe1ZXaZfRB7ygvS8HvmQTs` is READY and aliased to
  `https://verglos.com`; `/` and `/checkout` returned HTTP 200. Preview
  deployment `dpl_CwmAKov2aoDJmyk9o5LqHS849TEJ` is READY with the canonical
  Test Mode plan IDs.
- **Boundary:** No Production database, migration, payment, provider,
  entitlement, account, or customer write occurred. Score remains
  **219/61/280 (78.2%)** and no checkbox changed.

## 2026-10-09 · Use the valid Test Mode pair and create canonical plans

- **Decision:** Do not rotate the Razorpay Test Mode key. The pair in the
  local gate-testing file is accepted by Razorpay with HTTP 200. Create and
  use canonical Pro monthly/yearly plans in Test Mode, configure only
  isolated Preview with their non-secret IDs, and keep Production separate.
- **Reason:** The earlier 401 was caused by the stale/different local test
  file, not by the dashboard pair used for this batch. Rotation would add no
  value once a valid pair is available.
- **Evidence:**
  `docs/shipping/evidence/plan-web-011-015-test-mode-plans-production-rollout-2026-10-09.md`.
- **Boundary:** No secret was printed or committed; no Production provider,
  database, payment, entitlement, account, or customer state changed.

## 2026-10-09 · Accept PLAN-WEB-013; keep the complete payment gate open

- **Decision:** Accept `PLAN-WEB-013` only. The server-owned payment catalog,
  hosted order abstraction, signed commercial binding, fail-closed method
  surface, and captured-only fulfillment are now evidenced for the four
  provider-testable methods.
- **Evidence:** Preview and Production expose `card`, `netbanking`, `wallet`,
  and `emi`; the canonical-amount Test Mode aggregate, isolated database
  matrix, focused tests, typecheck, and build are in the private payment
  lifecycle evidence.
- **Boundary:** This does not close Gate 4 or `PLAN-WEB-011/012/014/015`.
  Provider subscription renewal/cancellation/expiry and full Production
  reconciliation remain unproven; no such evidence is inferred from local
  fixtures or the absence of provider rows. Score is **219/61/280 (78.2%)**.

## 2026-10-09 · Apply the provider-testable payment method set to Production

- **Decision:** Apply the narrowed method set to Vercel Production:
  `card,netbanking,wallet,emi`. The Production environment variable was
  overridden and deployed through the normal Vercel production path.
- **Evidence:** Production deployment `dpl_J1kkum4myNwMnt96EpCQwKtfvnB9`
  reached READY, the `verglos.com` alias was updated, `/checkout` returned
  HTTP 200, and the deployment response exposed only the four enabled method
  names.
- **Boundary:** No Production database, Razorpay key, webhook secret,
  payment, entitlement, or customer record was changed. UPI/Pay Later remain
  unavailable until an approved provider flow exists. PLAN-WEB-014 remains
  open for the four-method lifecycle matrix and remaining lifecycle cases.
  Count remains **218/62/280 (77.9%)**.

## 2026-10-09 · Narrow Preview payment methods to provider-testable set

- **Decision:** Remove `upi`, `upi_qr`, and `paylater` from the isolated
  Preview/Test configuration after the provider exposed only a QR-only UPI
  surface and rejected the Pay Later fixture. Keep `card`, `netbanking`,
  `wallet`, and `emi` enabled.
- **Reason:** A rendered method label or an unusable QR/OTP screen is not
  provider lifecycle evidence. Razorpay Test Mode produced captured provider
  records for the four remaining methods, while UPI and Pay Later produced no
  payment row.
- **Evidence:** Preview variable and local `.env.test.local` now agree; the
  Preview deployment `dpl_H7cXmiGNqddiEvwY9Dgf8rWLeZEK` built successfully and
  its checkout response contains only the four enabled method names.
- **Boundary:** Production was subsequently narrowed to the same four methods
  and redeployed. PLAN-WEB-014 remains open for the four-method lifecycle matrix and renewal,
  cancellation, expiry, replay, timeout, refund, and tenant evidence. Count
  remains **218/62/280 (77.9%)**.

## 2026-10-09 · Accept code-side payment qualification; retain provider lifecycle gate

- **Decision:** Accept the isolated database and code-side payment
  qualification rerun as evidence, but do not mark PLAN-WEB-014 complete.
- **Evidence:** Razorpay Test Mode has 16 canonical-amount payment rows with
  captured card/netbanking/wallet/`cardless_emi` outcomes, failed
  card/netbanking/wallet outcomes, and two processed full refunds. The
  isolated Docker PostgreSQL hosted-order, ledger, webhook-handler, and
  webhook-claim integrations pass 6/6; focused payment/runtime tests pass
  55/55 with one intentional skip; typecheck and the 43-route build pass.
- **Boundary:** The provider account has zero Test Mode subscriptions and the
  current Web surface has no subscription-creation route. Therefore provider
  renewal/cancellation/expiry evidence cannot be claimed, and the remaining
  provider-side matrix stays open. No production payment, database,
  entitlement, customer record, or backlog checkbox changed.

## 2026-10-09 · Qualify the isolated hosted capture/refund slice and keep the full matrix open

- **Decision:** Accept the protected Preview capture → signed webhook →
  entitlement → full-refund reconciliation result as a qualified lifecycle
  slice, but keep PLAN-WEB-014 open until every enabled method and the
  remaining lifecycle/replay/tenant cases are documented.
- **Reason:** The first provider capture exposed that the runtime Neon HTTP
  driver cannot execute the billing ledger's interactive transactions. Web
  commit `d8dc35a` switched the application runtime to the existing
  transaction-capable PostgreSQL driver, after which deployed Preview capture
  and refund paths returned HTTP 200 and the isolated database reconciled both
  payment and license state.
- **Evidence:**
  `docs/shipping/evidence/plan-web-014-preview-hosted-payment-lifecycle-2026-10-09.md`.
- **Boundary:** Razorpay remained in Test Mode and all state was isolated to
  Preview/test infrastructure. No production payment, database, deployment,
  entitlement, or backlog checkbox changed. Count remains **218/62/280
  (77.9%)**.

## 2026-10-09 · Require complete release-boundary rollback rehearsals

- **Decision:** A `DIST-006` rollback rehearsal is invalid unless it covers
  exactly one npm-package, engine-manifest, Hunt-feed, signing-identity, and
  Web-deployment operation. Duplicate or missing boundary kinds fail closed.
- **Reason:** A partial fixture could previously report a successful rehearsal
  without exercising every boundary named by the backlog acceptance criteria.
- **Evidence:** CLI PR #87 merged as `8bea4be`; focused rollback tests **5/5**,
  package/release contracts **11/11**, CLI checks, and all hosted checks pass.
- **Boundary:** This is local fixture/parser hardening only. It does not
  authorize or execute provider/registry/signing/deployment rollback,
  revocation, production writes, or release publication. `DIST-006` remains
  open.

## 2026-10-08 · Accept only the bounded accessibility correction from the route sweep

- **Decision:** Keep the `/docs/2.0.0` contrast correction in Web PR #164, but
  do not change public metadata, pricing, copy, or the unlinked `/pricing`
  route during this batch.
- **Evidence:** Local post-fix Lighthouse is Accessibility 100 / Best Practices
  100; Web typecheck, truth-registry 25/25, serial 862/24/0, and 45-page
  build pass. Remaining route findings are the held meta-description and
  optional llms.txt recommendation.
- **Reason:** The contrast defect is a concrete WCAG-affecting styling issue;
  metadata and pricing changes are explicitly reserved for the founder-
  authorized truth pass.
- **Hosted result:** Web PR #164 merged as
  `394d697903b7fa12ec537dc667f3807cdd75f588` after hosted typecheck/schema,
  Vercel, Preview Comments, and GitGuardian passed.
- **Boundary:** QUAL-WEB-006 remains open for human screen-reader, keyboard,
  paid/org data, large-data, responsive, field-CWV, and complete route
  evidence. No production state changed.

## 2026-10-08 · Preserve legacy entitlement activation during v2 unavailability

- **Decision:** Keep legacy v1 entitlement persistence as the compatibility
  fallback when v1 validation succeeds but v2 issuance returns a bounded
  unavailable response.
- **Evidence:** CLI PR #84 source `7c02099`; focused process/entitlement suite
  63/63 and local full test/typecheck/build/lint gates pass.
- **Hosted result:** PR #84 merged as
  `94829e1a4fc8e42dd67545e99cbe9a3a837b9482` after all hosted platform,
  self-scan, and in-toto checks passed.
- **Boundary:** This is local synthetic compatibility evidence only. Deployed
  signer/catalog alignment, released-version migration, and hosted activation
  remain required before PLAN-CLI-004 acceptance.

## 2026-10-08 · Resolve truth-registry mirror divergence

- **Observation:** The objective names `VERGLOS_TRUTH_REGISTRY.md`, but the
  private tracker has no current mirrored file. The public CLI worktree has an
  older untracked founder-owned copy with stale checkpoints and must remain
  untouched.
- **Resolution:** Treat the private backlog, evidence, status, risks,
  decisions, traceability, execution ledger, and release gates as the current
  shipping authority. Preserve the public untracked asset and schedule a
  reviewed truth-registry reconciliation before any final public-copy edit.
- **Reason:** This prevents a stale public mirror from silently overriding
  current production, Web, CLI, and private evidence.
- **Boundary:** No public file, price, deployment, database, provider, payment,
  or production state changed.

## 2026-10-08 · Hold public docs price correction for final truth pass

- **Observation:** Read-only production `/docs` passed Accessibility, Best
  Practices, and SEO at 100 with no console warnings/errors, but its plan table
  still shows legacy `$29/mo` and `$199/mo` rows. Production currently exposes
  the verified INR Pro catalog.
- **Decision:** Record the contradiction and defer public copy/pricing edits
  until the objective's truth-registry and final-public-pass gates authorize
  them. Do not invent Team/Studio/Enterprise prices from the stale rows.
- **Other finding:** Lighthouse's optional Agentic Browsing score was 67 due
  only to the `llms.txt` recommended-H1 audit.
- **Boundary:** No public copy, price, provider, database, or deployment write
  occurred. FINAL-WEB and QUAL-WEB-006 remain open.

## 2026-10-08 · Keep rollback rehearsal local and history-preserving

- **Decision:** Add a bounded `release rollback-rehearsal` command that
  exercises every release rollback/revocation kind through the shared
  fail-closed decision contract and verifies historical record references stay
  unchanged.
- **Reason:** This advances DIST-006 without inventing provider credentials or
  performing an irreversible registry, signing, deployment, database, or
  production operation.
- **Evidence:** CLI PR #83 merged as `c1a2856`; focused **4/4**, full CLI test
  tasks **12/12**, typecheck, build, lint, and hosted in-toto binding passed.
- **Boundary:** This is not authenticated provider rollback/revocation or
  trusted release acceptance. DIST-002/003/006 and independent operational
  review remain open; no checkbox changed.

## 2026-10-08 · Preserve payment identity across out-of-order failure/capture

- **Decision:** A failed Razorpay observation must not permanently poison the
  same exact provider-payment identity. A later bound capture promotes that
  row and grants once; a late failure after capture/refund is an idempotent
  no-op.
- **Evidence:** Web PR #161 merged as
  `ec02cacf69f3adb0d8df5ccb36a1a4eb5ef4cc3f`; isolated ledger/webhook
  integration **3/3**, focused payment suite **54/54**, and hosted Verify
  `37781035716` passed.
- **Boundary:** This is code-side lifecycle hardening only. Live provider
  method/lifecycle, production reconciliation, and payment release gates
  remain open. No production/provider/database/deployment write occurred.


## 2026-10-08 · Keep CI payload generation source-free and delivery-neutral

The CLI command may validate and emit the shared check payload locally, but it
must not infer delivery success, upload source, fetch a hosted record URL, or
contact a provider. Provider delivery stays behind the signed organization
policy, installation authorization, tenant binding, bounded retry/replay, and
hosted qualification gates.

Evidence: CLI PR #80 head
`58bb9383bdd1273e973620472ffc2d9255be7e9d` and
`docs/shipping/evidence/team-cli-002-cli-check-payload-2026-10-08.md`.

## CLI entitlement cache and reporting · 2026-10-08

Bind local capability cache reuse to license plus API endpoint and preserve
server-side authorization as the security boundary. Reject legacy unbound
caches until refresh instead of attributing them to whichever account happens
to be current. whoami plan represents effective capability authority; retain
licensePlan for the server/cached license label. Evidence: PR #80 (`8f731b3`),
103/103 focused tests and successful configured CLI suite.
Evidence: `docs/shipping/evidence/plan-cli-cache-identity-whoami-2026-10-08.md`.

## 2026-10-08 · Keep Preview test identity strictly non-production

- **Decision:** Permit an explicit internal fixture identity only when the
  runtime is non-production Preview, all fixture fields are bounded, and the
  request carries the operator-supplied secret. Keep normal Clerk auth and
  production auth unchanged.
- **Evidence:** Web PR #157 merged as
  `51bb6fe701b65ffcb2a322e1ff5d67eeb99df3fe`; focused auth tests and the full
  hosted verification suite passed. The local browser reached the real order
  route, while the flagged Test Mode provider credential failed before order
  creation.
- **Boundary:** This is an internal qualification instrument, not founder
  access, payment acceptance, or an entitlement bypass. PLAN-WEB-014/015 remain
  open; no provider, production, database, payment, webhook, or entitlement
  write occurred.

## 2026-10-08 · Freeze the failing Test Mode credential after bounded route attempt

- **Correction:** The local browser qualification made one bounded hosted-order
  request through the app after the Preview fixture authenticated. Razorpay
  returned the app’s bounded provider-failure response before an order was
  created; this was not a successful payment or lifecycle event.
- **Decision:** Make no further provider requests with this credential until it
  is repaired or rotated. Preserve the failure as a limitation, not as a
  provider-method result.
- **Boundary:** Local database counts stayed zero for users, licenses,
  payments, subscriptions, and webhook events. No production or deployment
  write occurred.

## 2026-10-07 · Keep production fail-closed on unknown payment methods

- **Decision:** Do not guess or add `RAZORPAY_ENABLED_PAYMENT_METHODS` in
  production. Keep the hosted payment rollout blocked until R-041 is closed
  and the provider account-enabled method set is established from an approved
  source.
- **Evidence:** Web PR #155 merged as
  `f00b7225ae0c0b8f518e404828aa6247c97dd322`; the automatic production
  deployment `dpl_Btjq8knubUab1ENgF7CEtzdUFV7G` failed in
  `pnpm config:check` because the variable is absent. The live alias remains
  the legacy QR-only checkout.
- **Boundary:** No production configuration, provider, database, payment, or
  customer-state write was made. Test Mode disclosure is code evidence only;
  PLAN-WEB-014/015 remain open.

## 2026-10-07 · Show Test Mode before hosted checkout

- **Decision:** A Test Mode checkout must disclose sandbox/no-real-charge
  status before a user opens Razorpay Checkout; the indicator exposes only a
  boolean and fails closed on public/server key drift.
- **Evidence:** Web PR #155 head `6b0c4f9`; host and Node 22 focused checks,
  typecheck, and 43-page preview build passed. Hosted Verify, GitGuardian, and
  Vercel Preview Comments later passed and the PR merged; see the merge
  decision above.
- **Boundary:** This improves payment disclosure but is not provider lifecycle
  acceptance. The automatic production deployment failed closed on the
  missing method allowlist; no production configuration or provider state
  changed.

## 2026-10-07 · Freeze flagged Razorpay Test Mode credential

- **Decision:** Treat the final redacted read-only inventory as historical
  context only and make no more provider requests with this credential until
  it is rotated/repaired.
- **Evidence:** 10 created orders, 4 payments (3 created/1 captured), 0
  subscriptions, 0 plans, and 1 webhook configuration; no identifiers or
  response bodies retained.
- **Boundary:** This does not qualify enabled methods or any payment
  lifecycle, and no provider or production write occurred. `PLAN-WEB-014/015`
  remain open.

## PLAN-WEB-014 Test Mode credential preflight · 2026-10-07

- **Decision:** Treat the test key and HTTP 200 Orders response as a usable
  precondition only; do not treat it as payment acceptance.
- **Boundary:** The seven method names come from application configuration, not
  provider-account truth. Browser qualification was deferred after Chrome
  DevTools and Playwright MCP returned `Transport closed`. A fallback probe
  attempted one Test Mode order creation but returned no usable result; no
  lifecycle evidence was accepted and no production write occurred.
- **Next:** Restore a bounded browser instrument, observe the provider-hosted
  Checkout in Test Mode, and qualify each actually enabled method and lifecycle
  before revisiting PLAN-WEB-014.

## Web current-main Node 22 qualification · 2026-10-07

- **Decision:** Accept the exact-head Node 22 and disposable-database results
  as supporting evidence; do not close payment, production, or final release
  gates.
- **Evidence:** Web main
  `14988371cdae94d66d068b49d07cc31f0b26c5ea`; serial pretest **49/49**, main
  **879/880**, one explicit skip, zero failures; 37 migrations, schema,
  negative-boundary **2/2**, truth registry **25/25**, and typecheck passed.
- **Boundary:** Provider lifecycle, production reconciliation, deployment
  acceptance, and final independent review remain open. Disposable database
  and worktree only; no checkbox or external state changed.

## QUAL-CLI-006 Node 22 current-main qualification · 2026-10-07

- **Decision:** Accept the pinned Node 22 run as supporting runtime evidence;
  do not close QUAL-CLI-006 or authorize release publication.
- **Evidence:** Exact CLI head
  `7d060b2852551cc017bbb2b5f70bad22843e7273`; fresh install; Turbo test
  **12/12**, typecheck **13/13**, build **8/8**, all exit `0`.
- **Boundary:** The container was removed cleanly. Official/trusted/legal/
  independent release gates remain open; no source, production, provider,
  database, deployment, payment, publication, or customer-state mutation
  occurred. No checkbox changed.

## PLAN-WEB-015 production preflight · 2026-10-07

- **Decision:** Do not promote or configure the hosted-order checkout until
  the production method set is explicitly established and R-041 is closed.
- **Evidence:** Vercel deployment `dpl_H2eqnEqCY96yAAPphch9S2dvUKeK` at Web
  commit `1498837` failed because `RAZORPAY_ENABLED_PAYMENT_METHODS` is
  absent; live `/checkout` remains the QR-only surface.
- **Boundary:** No guessed method list, production price change, provider
  request, database read/write, environment-variable write, or deployment
  cutover occurred. `PLAN-WEB-015` and R-041 remain open.

## PLAN-WEB-013/014 current-main hosted order qualification · 2026-10-07

- **Decision:** Accept the current-main hosted-order and isolated PostgreSQL
  results as implementation evidence; do not represent them as provider or
  production payment acceptance.
- **Evidence:** Exact Web main `14988371cdae94d66d068b49d07cc31f0b26c5ea`;
  payment-focused **28/28**; 37 migrations; typecheck/schema; negative-boundary
  **2/2**; truth-registry **25/25**; 43-page preview build.
- **Boundary:** No provider API, payment, production database, migration,
  deployment, credential, or customer-state write occurred. Real Test Mode
  lifecycle, production reconciliation, and Node 22 acceptance remain open;
  no checkbox changed.

## PLAN-WEB-014 migration-bootstrap revalidation · 2026-10-07

- **Decision:** Treat the local migration-bootstrap uncertainty as resolved for
  the documented current-main rehearsal, but keep production migration and
  release acceptance open.
- **Evidence:** Web main `14988371cdae94d66d068b49d07cc31f0b26c5ea`; guarded
  empty-database bootstrap; all **37** ordered migrations; isolated checks
  **22/22**; typecheck, schema validation, and 43-page preview build passed.
- **Boundary:** Production legacy history/cutover, backup/restore, rollback,
  Node 22 acceptance, provider lifecycle, and production reconciliation remain
  unverified. No checkbox or production state changed.

## QUAL-CLI-006 current-main artifact and format validation · 2026-10-07

- **Decision:** Accept the exact-head artifact and format-validator results as
  supporting release evidence only; do not close QUAL-CLI-006 or authorize
  publication.
- **Evidence:** CLI `origin/main` `7d060b2`; cross-platform install/build
  **8/8**; six public archives; official `in-toto==3.0.0` exact-product
  verification; CycloneDX CLI `0.33.1`; SPDX Tools `0.8.5`; inventory with 7
  review blockers.
- **Reason:** Mechanical validity does not establish trusted keyless identity,
  legal redistribution clearance, protected publishing approval, independent
  acceptance, or a complete release candidate.
- **Boundary:** Disposable worktrees/containers only; no production,
  provider, payment, database, deployment, migration, credential, or
  publication mutation occurred. No checkbox changed.

## Web GitHub App server-side exchange · 2026-10-07

- **Decision:** GitHub installation tokens and immutable installation identity
  must come from the server-held App JWT/provider API, not browser input.
- **Evidence:** PR #154 reconciled head `9032bda`, merged as `1498837`; focused
  SCM/deletion **46/46**; serial Web **857/880** with 23 explicit skips and
  zero failures; hosted typecheck/schema, Vercel, and Preview Comments passed.
- **Security boundary:** The route accepts only installation/repository
  selection intent, validates least-privilege permissions and provider-owned
  IDs, encrypts token/expiry, refreshes through the App exchange, and takes the
  GitHub webhook secret only from `VERGLOS_GITHUB_WEBHOOK_SECRET`.
- **Limit:** No live App credential/org/webhook/cutover or independent review
  evidence exists, so TEAM-WEB-006 and the GitHub release gates remain open.

## CLI origin/main reconciliation and Hunt adversarial qualification · 2026-10-07

- **Decision:** Treat the exact remote-head and pinned Docker run as current
  CLI/Hunt qualification evidence only; do not close HUNT or independent-review
  gates.
- **Evidence:** Clean `origin/main` head `7d060b2`; forced Turbo validation
  **23/23**; Docker `29.7.2`; Hunt **60 passed / 1 skipped / 0 failed**.
- **Reason:** The run is macOS local/CI harness evidence. The namespace
  assertion requires Linux, and no independent reviewer, official validator,
  trusted publisher-root, or legal review was performed.
- **Boundary:** Founder-owned untracked assets were preserved; no production,
  provider, payment, database, deployment, migration, credential, or browser
  mutation occurred. No checkbox changed.

## PLAN-WEB-013/012 webhook-handler PostgreSQL integration · 2026-10-07

- **Decision:** Accept the direct handler/database harness as implementation and
  integration progress only; keep payment and release acceptance open.
- **Evidence:** PR #149 head `9fd22d8`, handler **2/2**, route **2/2**, ledger
  **1/1**, claim **1/1**, unit handler **8/8**, and hosted Verify **37642113170**.
- **Reason:** The harness proves persistence and exactly-once behavior across
  capture, replay, failed order, and monotonic refunds using real handler and
  ledger functions. It does not prove real Razorpay lifecycle events, every
  enabled method, or production reconciliation.
- **Migration finding:** A fresh empty database cannot apply legacy-dependent
  migration `0000` because `licenses` is absent. Do not bypass this with an
  unsafe CI/production push; track it as a migration-bootstrap risk.

## PLAN-WEB-013 isolated hosted-order route · 2026-10-07

- **Decision:** Accept the route harness as qualification progress only; do not
  mark the hosted payment or release backlog complete.
- **Evidence:** PR #149 head `1605340`, hosted Verify **37640983179** green,
  route integration **2/2**, focused payment/quality **44/44**, and local
  typecheck/database/migration/build checks green.
- **Reason:** The harness proves server-side catalog, auth/origin/validation
  boundaries, signed notes, user binding, and provider projection without
  production writes. It does not prove real provider lifecycle or entitlement
  reconciliation. Local full-suite results are also limited by shared fixture
  interference and are not claimed as green.

## QUAL-WEB-006 organization-directory CDP probe · 2026-10-07

- **Decision:** Treat the current `/orgs` aggregate CDP observation as partial
  runtime evidence only; do not claim accessibility/performance acceptance.
- **Evidence:** Existing dedicated Chrome target, direct CDP fallback after
  closed MCP transport, one named visible interactive control, two landmarks
  including `main`, zero visible forms, zero unnamed interactive AX nodes, and
  CLS `0.0000`; existing navigation timing was DOMContentLoaded `4939 ms` and
  load `5647 ms`.
- **Boundary:** No navigation, reload, tab creation, browser-state mutation,
  private-data capture, production/database/payment/deployment/migration
  operation occurred. QUAL-WEB-006 remains open for the missing runtime and
  field evidence.

## QUAL-CLI-006 current-head standards run · 2026-10-07

- **Decision:** Accept the 448/448 shared standards-corpus, license, and SBOM
  run as qualification progress only; keep QUAL-CLI-006 open.
- **Evidence:** Exact CLI head `13d1444`; 113 package test files, shared
  typecheck/build, Docker `29.7.2`, and the documented temporary
  cross-platform package setup pass. License inventory and CycloneDX/SPDX SBOM
  generation passed for 254 lockfile packages; temporary changes were reverted.
- **Boundary:** This does not establish official-validator, trusted keyless
  provenance, legal, cross-platform consumer, or independent-review evidence.
  No source/lockfile/public/production change occurred.

## PLAN-WEB-013 Checkout retry-state hardening · 2026-10-07

- **Decision:** Hosted Checkout failures and pre-confirmation dismissal must
  clear stale order state and return to the actual offer/retry screen; the UI
  must not imply a submitted payment when the provider rejected `open()`.
- **Evidence:** PR #149 exact head `aa34127`; focused 27/27, typecheck, build,
  and diff checks pass. Verify `37637158955`, Vercel, and Preview Comments pass.
- **Boundary:** This changes presentation state only and does not grant access
  or replace webhook authority. PLAN-WEB-013/014/015 remain open; no provider,
  production, database, or deployment mutation occurred.

## PLAN-WEB-014 Test Mode method-display probe · 2026-10-07

- **Decision:** Record the direct Test Mode run as provider UI evidence only;
  do not promote it to app payment, entitlement, or lifecycle acceptance.
- **Evidence:** One isolated Test Mode order rendered the configured hosted
  method surfaces. UPI contact validation stopped the run before a provider
  outcome; no callback, capture, refund, webhook, or ledger reconciliation was
  produced.
- **Boundary:** The existing blank CDP target was reused and restored to
  `about:blank`. PLAN-WEB-014/015 remain open; no production or live-payment
  operation and no checkbox change occurred.

## PLAN-WEB-014 provider iframe qualification attempt · 2026-10-07

- **Decision:** Treat the provider iframe observation as incomplete runtime
  evidence only. Do not infer payment success, failure, capture, or entitlement
  from a loaded Checkout frame.
- **Evidence:** Six provider method selectors were visible; the UPI field was
  unavailable to the bounded CDP interaction after selection and no callback
  or ledger result occurred. The target was restored to `about:blank`.
- **Boundary:** PLAN-WEB-014/015 remain open; no production, database, payment,
  migration, deployment, or customer-state operation occurred.

## QUAL-WEB-005 hold state at completion boundary · 2026-10-07

- **Decision:** A deletion worker must feed the post-delete hold state into its
  final qualification decision; a hold appearing during execution blocks the
  job from completing.
- **Reason:** The initial hold check cannot protect the entire destructive
  interval. An audit receipt must never claim completion after a hold becomes
  active.
- **Evidence:** Web PR #153 commit `d7deec1`; focused 36/36 and disposable
  PostgreSQL 1/1 passed.
- **Boundary:** This closes a code-side race only. `QUAL-WEB-005` remains open
  for authenticated E2E, legal/customer-held disposition, reconciliation,
  restore/rollback, and independent review. No destructive operation occurred.

## PLAN-WEB-013/014 monotonic refund watermark · 2026-10-07

- **Decision:** Treat a signed, valid refund observation lower than the durable
  refund watermark as an idempotent no-op; continue rejecting negative and
  over-amount values.
- **Reason:** Provider deliveries and retries can be out of order. Moving the
  watermark backwards or failing an already-reflected observation would create
  retry churn without changing entitlement truth.
- **Evidence:** Web PR #149 commit `238ec74`; focused tests, typecheck, and a
  disposable schema-fixture billing integration passed.
- **Boundary:** This is ledger hardening, not provider lifecycle acceptance.
  PLAN-WEB-013/014/015, production reconciliation, and release gates remain
  open; no provider or production operation occurred.

## Razorpay Test Mode subscription-plan inventory · 2026-10-07

- **Decision:** Keep the current order-based hosted Checkout path; do not
  create subscription plans or add speculative plan IDs.
- **Evidence:** Read-only Test Mode plan inventory returned zero plans, and no
  plan-ID variable exists in the production environment-name inventory.
- **Reason:** Provider plans are immutable configuration and must bind an
  approved catalog amount, cadence, currency, entitlement period, owner, and
  reconciliation procedure before creation.
- **Consequence:** PLAN-WEB-014/015 remain open for recurring lifecycle and
  production reconciliation evidence.

## QUAL-WEB-005 protected deletion hold authority · 2026-10-07

- **Decision:** Accept the super-admin hold routes as implementation progress;
  keep `QUAL-WEB-005` and merge/deployment gates open.
- **Evidence:** PR #153 exact head
  `929da1907f001c8db71df0e601e08014590fd580`; focused 10/10; serial
  872/849/23/0; hosted Verify `37608932973` passed.
- **Safety:** Only a configured super-admin identity may activate or release
  a hold. Mutations require same-origin, target/request ownership is checked,
  customer-deletion holds require a request reference, and release uses an
  unreleased-row predicate to prevent concurrent double release.
- **Boundary:** This does not qualify production migration, deletion E2E,
  legal/customer-held disposition, consent inventory, reconciliation,
  restore/RPO, deployment rollback, or independent acceptance. No production
  or destructive operation occurred; no checkbox changed.

## QUAL-WEB-005 supporting executor disposable integration · 2026-10-07

- **Decision:** Accept the disposable PostgreSQL integration as stronger
  runtime qualification; keep `QUAL-WEB-005` and production gates open.
- **Evidence:** Web PR #153 current source; PostgreSQL 18 `verglos_test`
  integration **1/1 pass** covering the supporting graph, per-kind deletes,
  holds, leases, receipts, runner, replay, and approval blocking. The exact
  test container was removed after execution.
- **Boundary:** This does not prove production migration/cutover,
  authenticated browser E2E, consent/legal/customer-held approval,
  production reconciliation, restore/RPO, rollback, or independent review.
  No production or destructive operation occurred; no checkbox changed.

## QUAL-WEB-005 customer-held digest registration route · 2026-10-07

- **Decision:** Accept the authenticated customer-held digest registration
  boundary as implementation progress; keep `QUAL-WEB-005` and all merge/
  deployment gates open.
- **Evidence:** PR #153 exact head
  `03d60e99ccf895b3122c4ae6641c3d12b44169bf`; focused 11/11; serial
  870/847/23/0; hosted Verify `37608270504` passed.
- **Safety:** The route is user-scoped, same-origin, bounded, canonical,
  idempotent, and stores only a digest plus fixed record kind. It never accepts
  record bytes. Legal and contract holds are not user-controlled.
- **Boundary:** This does not qualify authenticated deletion E2E, legal/
  customer-held disposition, consent inventory, production migration,
  reconciliation, restore/RPO, deployment rollback, or independent acceptance.
  No production or destructive operation occurred; no checkbox changed.

## QUAL-WEB-005 preview browser boundary · 2026-10-07

- **Decision:** Treat the protected-preview redirect as an access blocker, not
  as a failed product request or acceptance result; keep QUAL-WEB-005 open.
- **Evidence:** Chrome CDP reached the preview URL and observed Vercel login;
  no Verglos response or mutation was reached. The tab was returned to
  production `/orgs`.
- **Boundary:** Do not bypass deployment protection or capture credentials.

## QUAL-WEB-005 privacy surface · 2026-10-07

- **Decision:** Accept the new account privacy surface as implementation
  progress; keep QUAL-WEB-005 and merge/deploy gates open.
- **Evidence:** PR #153 head `db27d793d890929f642ed0d5b5b9bd056a732bc`, local
  23/23 focused tests and required checks, hosted Verify `37607448915` green.
- **Boundary:** The UI records requests but does not claim hosted deletion
  completion. No authenticated E2E, legal/held-record disposition,
  rollback/restore acceptance, or production operation occurred.

## Exact production migration preflight · 2026-10-07

- **Decision:** Keep production migration and PR #153 merge gates closed.
- **Evidence:** Read-only audit found all 42 allowlisted tables, 26 applied
  rows versus 35 expected, and pending migrations 0026–0034; exact counts are
  licenses 1, legacy mappings 3, webhook events 4, payments 0, and
  subscriptions 0.
- **Boundary:** No production DDL, DML, migration, deployment, payment,
  entitlement, deletion, or backlog checkbox change occurred.

## Fresh production snapshot/restore rehearsal · 2026-10-07

- **Decision:** Accept the fresh snapshot and disposable restore as RPO/
  migration-rehearsal evidence, but keep QUAL-WEB-005 and production cutover
  gates open.
- **Evidence:** 150,515-byte snapshot at `2026-10-07T10:17:27.005Z`; restore
  and PR #153 migration tail succeeded; clone history reached 35 rows with
  deletion/payments/subscriptions 0 and webhook events 4.
- **Boundary:** No production write, migration, deployment, payment,
  entitlement, or deletion occurred; hosted deletion E2E, legal/customer
  disposition, rollback, and independent review remain required.

## Preview environment preflight · 2026-10-07

- **Decision:** Do not use the current Vercel Preview for payment qualification.
- **Evidence:** Its key values were not recognizable test/live prefixes, its
  database value was not a PostgreSQL URL, and the hosted method variable was
  absent.
- **Boundary:** No Preview provider/database call or configuration mutation
  occurred; provision an isolated test environment before lifecycle testing.

## Production read-only billing/migration audit · 2026-10-07

- **Decision:** Keep production payment, migration, and deletion gates closed.
  Do not add a guessed method list or apply the 31-migration candidate to the
  26-migration production database.
- **Evidence:** Production variable inventory lacks
  `RAZORPAY_ENABLED_PAYMENT_METHODS`; the read-only audit found 42 tables,
  26 migration rows, zero billing payments/subscriptions, zero deletion
  requests, and four webhook-event rows.
- **Boundary:** No row contents/identifiers were selected and no production
  DDL, DML, migration, deployment, payment, entitlement, or deletion occurred.

## Razorpay method preflight · 2026-10-07

- **Decision:** Keep the payment-method and lifecycle gates open until a valid
  test-account method response is obtained. Do not infer enabled methods from
  documentation or local configuration.
- **Evidence:** SDK method lookup returned HTTP 401 authentication failure,
  while read-only `/v1/orders` and `/v1/payments` calls with the same test
  pair returned HTTP 200; the 401 is endpoint-specific and the method set is
  still unknown. Exact PR #149 payment tests passed 27/28 with one explicit
  environment-gated skip; isolated config exposed five hosted method IDs.
- **Boundary:** No live-key fallback, payment, refund, webhook, entitlement,
  database, deployment, or production operation occurred.

## SCM/payment qualification batch · 2026-10-07

- **Decision:** Record the SCM 48/48 and Razorpay test-order results as
  qualification evidence, but keep all live integration and payment gates
  open.
- **Evidence:** Exact Web `origin/main` passed the focused GitHub/SCM suite
  48/48. `.env.test.local` created one Razorpay test-mode monthly Pro order at
  INR 280,943 paise, status `created`, with no capture or fulfillment.
- **Boundary:** No live GitHub installation, provider lifecycle, webhook,
  entitlement, production reconciliation, database write, deployment, or
  credential rotation occurred. No backlog checkbox changed.

## PLAN-WEB-013 hosted verification refresh · 2026-10-07

- **Decision:** Treat PR #149 as hosted code-qualified but do not merge or
  close payment gates from CI alone.
- **Evidence:** Exact head `db68157da039d8aab939818f9023f867028e4432`, Verify
  `37563023349`: serial 871/872 pass with one explicit skip, negative-boundary
  2/2, truth-registry 25/25, 31 migrations, build and security/public-boundary
  checks green.
- **Boundary:** Razorpay account-enabled method and test-mode lifecycle evidence
  are still required. No provider, production, database, deployment, or merge
  operation occurred.

## Production payment-surface truth recheck · 2026-10-07

- **Decision:** Treat the live checkout as legacy QR-only runtime truth and keep
  all payment release gates open. Do not scan, pay, or use it as test evidence.
- **Evidence:** Read-only Chrome DevTools `/checkout` load: HTTP 200, clean
  console, INR 2,809.43/month, UPI-only copy, and `Show UPI QR code`; no
  mutation request. PR #149 remains a non-production open PR.
- **Boundary:** No payment, provider, database, entitlement, deployment, or
  production configuration operation occurred.

## Razorpay production method preflight · 2026-10-07

- **Decision:** Keep production payment configuration and cutover closed. The
  account-enabled method set must be obtained from a valid provider response;
  it must not be inferred from Test Mode UI, documentation, or code catalogs.
- **Evidence:** Vercel Production has no `RAZORPAY_ENABLED_PAYMENT_METHODS`;
  the read-only SDK method lookup with the pulled live-key pair returned HTTP
  401 `BAD_REQUEST_ERROR`. The deploy from main `8b843da` consequently failed
  runtime-config validation before build completion.
- **Boundary:** No secret value, provider payload, payment, deployment
  promotion, environment mutation, database, or customer-state write occurred.

## QUAL-CLI-006 official in-toto artifact binding · 2026-10-07

- **Decision:** Record the official in-toto result as a qualified artifact
  binding sub-check, but keep QUAL-CLI-006 and release gates open.
- **Evidence:** Exact CLI `6bde945c60ac34351c02a70f6e7a2cb24f98ae1d`; official
  `in-toto==3.0.0` verifier passed six public archives with exact SHA-256
  products in a bounded disposable Python 3.12 container.
- **Boundary:** Ephemeral keys do not establish trusted keyless
  Sigstore/Fulcio/Rekor identity, legal clearance, protected npm publishing,
  or final release acceptance. No publication, tag, deployment, or production
  operation occurred.

## PLAN-WEB-013 exact-head payment qualification · 2026-10-07

- **Decision:** Record the exact-head payment tests as code-side qualification
  and keep the payment gate open. Do not merge PR #149 or claim method/lifecycle
  acceptance from these tests.
- **Evidence:** Web PR #149 head
  `db68157da039d8aab939818f9023f867028e4432`; focused payment tests 18/18;
  typecheck, schema, 31-migration, and 3/3 license checks pass; hosted checks
  are green and the PR is CLEAN/MERGEABLE.
- **Boundary:** Account-enabled Razorpay methods, test-mode runtime lifecycle,
  provider replay/order timing, production reconciliation, and payment
  acceptance remain open. No production/provider/database/deployment write.

## CLI PR #75 hosted qualification and merge · 2026-10-07

- **Decision:** Merge the isolated public/private Hunt runtime packaging
  correction after its complete hosted matrix and release-binding checks
  passed. Do not treat the merge as Hunt product acceptance.
- **Evidence:** PR #75 exact head `c4beecb3525256cd2956660af8e3e6b49292b65f`;
  all 11 checks passed; squash merge commit
  `6bde945c60ac34351c02a70f6e7a2cb24f98ae1d`.
- **Boundary:** Keep HUNT-008, HUNT-009, and QUAL-CLI-004 open for trusted
  recipe provenance, complete isolation qualification, independent review,
  and authorized functional acceptance. No provider, payment, database,
  deployment, or credential operation.

## QUAL-WEB-006 authenticated account browser probe · 2026-10-07

- **Decision:** Record the browser results as partial authenticated-surface
  evidence only. Do not promote them to full accessibility/performance
  acceptance because the session has no paid entitlement or organization.
- **Evidence:** Lighthouse desktop/mobile Accessibility 100 and Best Practices
  100; Tab focus reached Overview; console clean; navigation 200/304; LCP
  1,111ms; CLS 0.00; no CrUX field data.
- **Boundary:** QUAL-WEB-006 remains open for paid/org runtime, human
  screen-reader, large-data, and field-CWV evidence. No entitlement, payment,
  database, deployment, or production configuration change.

## Hunt public/private runtime boundary · 2026-10-07

- **Decision:** Accept the optional-runtime boundary as a real packaging
  correction, not as Hunt product acceptance. The public CLI may execute only
  when the separately provisioned private runtime satisfies the validated
  protocol; otherwise it denies with exit 78.
- **Evidence:** CLI `c4beecb`; focused 6/6, full configured CLI suite,
  packaging/license/surface 17/17, six archives, package-content and public
  boundary audits pass. PR #75 exact head is OPEN/UNSTABLE with 11 hosted
  checks pending at capture.
- **Boundary:** Keep HUNT-008, HUNT-009, and QUAL-CLI-004 open for recipe
  provenance, isolation, independent review, and acceptance. No production,
  provider, payment, database, migration, deployment, or credential action.

## Restore/recovery harness qualification · 2026-10-07

- **Decision:** Record the disposable restore path as partial recovery
  evidence only. Do not treat it as a clean DR or QUAL-WEB-005 acceptance
  result because the snapshot is approximately 396h old and exceeds the
  critical 48h RPO threshold.
- **Evidence:** Web PR #153 head `250313e`; restore, 35 migrations, writer
  passes, `reconciled` manifest, and fail-closed simulation passed; RTO 3.09s.
- **Boundary:** Current production backup/restore, Vercel rollback,
  authenticated deletion E2E, and provider/payment qualifications remain open.
  No production operation or checkbox change.

## QUAL-WEB-005 rollback/retry qualification · 2026-10-07

- **Decision:** Treat the injected PostgreSQL failure/savepoint result as
  transaction rollback/retry evidence only; do not equate it with production
  restore or deployment rollback.
- **Evidence:** Web PR #153 head `2127924e418fdca4094fa88bab02656952f4488b`,
  disposable integration 1/1, serial Web 868/1/0, and hosted Verify
  `37567278851` pass.
- **Boundary:** Keep QUAL-WEB-005 open for production-grade restore,
  deployment rollback, authenticated non-production E2E, and final privacy/
  retention acceptance. No production operation is authorized by this result.

## QUAL-WEB-005 supporting disposition executor · 2026-10-07

- **Decision:** Allow the deletion worker to execute only the reviewed
  user/license-scoped supporting dispositions, with one durable idempotency
  receipt per table and the existing lease fence.
- **Safety:** Preserve users, licenses, accounting/provider rows, unscoped
  telemetry, legacy public rows, customer-held digests, and the deletion audit
  ledger. Check approval-gated channel credentials before deleting dependent
  alert or monitor rows; block closed if credentials remain.
- **Boundary:** Local worker 4/4, disposable PostgreSQL 1/1, serial Web
  868/1/0, typecheck/build/schema/35-migration checks pass. Hosted Verify
  `37566730804`, Vercel, GitGuardian, and Preview Comments pass. Retained-row
  reconciliation, restore/rollback rehearsal,
  authenticated non-production E2E, and final gate acceptance remain open; no
  production migration or deletion is authorized.

## QUAL-WEB-005 supporting inventory gate · 2026-10-07

- **Decision:** Accept the read-only supporting inventory/disposition contract
  as progress only; keep the destructive worker gate closed.
- **Evidence:** Web PR #153 head `37c8a07ef2c1d4f914c0ace03864d60fb2649a82`
  passed Verify `37564973546`; focused 9/9, disposable PostgreSQL 1/1,
  serialized 846/23/0, typecheck/build/schema/migration/diff checks pass.
- **Boundary:** `supportingInventoryComplete=false` remains required until
  executable disposition operations, receipts, retained-row reconciliation,
  restore/rollback rehearsal, and authenticated E2E exist. No production write,
  migration, deletion, deployment, or provider operation occurred.

## HUNT-009 hosted boundary result · 2026-10-07

- **Decision:** Close CLI PR #74 without merge and keep HUNT-009 unchecked.
- **Evidence:** Local execution tests/build/typecheck/full test graph passed,
  but hosted platform matrix `37565750571` and self-scan `37565750527` failed
  at public archive qualification because the public six-package packer cannot
  resolve private/alpha `@verglos/hunt`.
- **Boundary:** Do not make the private Hunt package public implicitly, copy it
  into the CLI archive, or weaken the packer. A reviewed packaging design,
  licensed recipe provenance, approval chain, and independent qualification
  are still required before HUNT-009 can ship.

## CLI license-source metadata merge · 2026-10-07

- **Decision:** Accept the exact-version HTTPS provenance repair into CLI
  `main` after the complete platform matrix, self-scan, and in-toto checks
  passed.
- **Boundary:** The merge changes mechanical inventory provenance only. It is
  not legal approval, redistribution clearance, npm publication, or a release
  go/no-go; the remaining seven review blockers stay fail-closed.

## Exact-version license source metadata · 2026-10-07

- **Decision:** Permit a narrowly scoped source-metadata override only for an
  exact package/version key when the installed manifest omits provenance and
  immutable registry metadata identifies the upstream HTTPS repository.
- **Controls:** Validate HTTPS, keep the override version-pinned, preserve the
  existing redistribution classifier, and keep `--require-clear` fail-closed
  for non-permissive licenses and nested conflicts.
- **Boundary:** This is mechanical provenance repair, not legal approval or
  redistribution clearance. PR #73 must pass hosted checks before any merge;
  no release/publication or production operation is authorized by this
  decision.

## Serialized PostgreSQL qualification path · 2026-10-07

- **Decision:** Use the repository's existing `test:serial` command as the
  authoritative local PostgreSQL qualification path while fixtures share one
  disposable database. Do not credit a parallel shared-database run that can
  race on extension/schema setup.
- **Evidence:** Pretest 48/48, configured Web suite 867/867 with one
  intentional migrated-billing skip, and separate migrated billing integration
  1/1. The prior queue/worker failures do not reproduce serially.
- **Boundary:** This is a local test execution decision, not production or
  release acceptance. No gate or backlog checkbox changed.

## Shared test-database initialization · 2026-10-07

- **Decision:** Do not count the concurrent full Web PostgreSQL run as green
  while independent Node test workers share a database and race on extension
  setup. Preserve the failure/hang as qualification evidence and use isolated
  per-file runs for diagnosis until the harness is serialized or initialization
  is made concurrency-safe.
- **Evidence:** Queue/worker-crash integration passes 7/7; threshold-outbox
  and usage-ledger each pass 1/1 alone. The paired usage run reproduces
  PostgreSQL `23505` on `pg_extension_name_index` and a pending worker.
- **Boundary:** This is a testing decision only. It does not close any Web
  qualification, acceptance, or release gate, and no production operation
  occurred.

This file is newly created because no tracked `DECISIONS.md` existed in the private shipping worktree when checked on 2026-09-14. It is local-only and must not be pushed to the public CLI or Web repositories.

## Razorpay hosted order default · 2026-10-07

- **Decision:** Use Razorpay hosted Checkout/order flow as the default customer
  path. The server-side catalog and explicit provider method configuration are
  authoritative; hosted UPI, cards, netbanking, and wallets are not promised
  unless declared. QR is a separately qualified, explicit opt-in adapter.
- **Evidence:** Web PR #149, commit `eb7e55a`; signed order snapshots, provider
  order binding, read-only status, webhook-authoritative capture/failure, and
  order-success uniqueness are locally verified.
- **Boundary:** Code-side implementation is not account capability or payment
  lifecycle acceptance. Isolated Razorpay test-mode evidence for each enabled
  method, production reconciliation, and R-041 credential rotation remain
  open. No production operation occurred.

## PLAN-CLI-001 opaque catalog/cache boundary · 2026-10-06

- **Decision:** Treat `catalog_version` and capability identifiers from the Web
  entitlement response as server-owned opaque data. Validate only the bounded
  wire shape; do not reconstruct plan capability or allowance maps in the CLI.
- **Cache rule:** A stale cached response is eligible only for the same founder
  `as_plan` simulation scope that produced it. A request for a different
  simulation scope falls back to Free when the server is unreachable.
- **Boundary:** This improves offline safety and observability but does not
  authorize production signer activation, token issuance, or any production
  operation. PLAN-CLI-001/004 remain open pending hosted and activation
  evidence, with R-041 still enforced.

## HUNT-009 packaging boundary · 2026-10-06

- **Decision:** Keep the public alpha CLI on its beta shell until a reviewed packaging design exists for private Hunt execution. Do not add a private workspace package as a public CLI dependency and do not copy private runtime implementation into public archives as an implicit workaround.
- **Rationale:** The public packer intentionally fails closed on private workspace dependencies. Enabling a command that cannot be installed from the public six-package release would create a false release surface and violate the repository code split.
- **Follow-up:** Resolve the private-runtime distribution boundary only after trusted publisher roots, licensed recipe provenance, bounded execution, isolation/adversarial evidence, and independent review are complete.

## TEAM-CLI-001 hosted policy authority boundary · 2026-10-06

- **Repository binding:** A policy fetch is eligible only when an active GitHub
  SCM installation row carries the immutable `repositoryId` and an explicit,
  same-organization `projectId` binding. Repository owner/name or a free-form
  project external ID must never be used as an implicit policy binding. A
  missing or ambiguous binding fails closed without revealing adjacent tenant
  state. GitLab policy fetch remains out of scope until it has an immutable
  provider repository ID contract.
- **Signer custody:** Organization policies use a dedicated Ed25519 signing
  key, separate from entitlement JWT keys. The private key is a server-only
  runtime secret; the envelope key ID is derived from the public SPKI bytes and
  the corresponding public key is pinned in the CLI trusted-key bundle. The
  endpoint is unavailable when the dedicated signer is absent or malformed.
- **Payload contract:** Only a stored `published` policy with
  `canonical-json-v1` digest, valid effective time, and a document conforming
  to the CLI `PolicyDocument` schema may be emitted. The bearer license must
  be active and resolve to an owner mapping for the exact organization UUID.
- **Activation boundary:** Implement and qualify the endpoint, binding, signer,
  and cross-repository fixtures in code first. Do not provision or activate the
  production signer, rewrite production policy rows, or run a hosted fetch
  until R-041 credential rotation and the separate PLAN-CLI-001 activation
  evidence are complete.

## Pro INR catalog activation review frame (2026-10-02)

- **Problem/evidence:** sandbox Standard Checkout completed at ₹2,809.43 (`280943` paise), with captured payment and signed webhook replay idempotency. Production previously failed closed because the canonical Pro catalog was unverified USD.
- **Change:** Web PR #123 (`23a83f0`) changes only the versioned Pro catalog and checkout rendering: monthly ₹2,809.43 / 30 days, annual ₹28,094.30 / 365 days, INR, verified and purchasable. No schema, migration, or database code changes.
- **Rollback:** revert `23a83f0` or roll back the resulting Vercel deployment; the prior catalog makes `checkoutOfferFor` return null and restores the fail-closed checkout. No customer data rollback is required.
- **Verification:** local full suite/build/typecheck/schema/migration/security gates passed; hosted Verify run `36979422192` passed every required step. Merge/deploy remains a deliberate production activation because live Razorpay credentials would create real charges.

## Founder authorization for final acceptance work (2026-10-02)

- **Authorization:** Founder approved proceeding with the final public truth/copy pass after its prerequisite acceptance gates, a real billing/provider checkout test, authorized customer-repository acceptance workflows, legal/licensing review, and independent Hunt isolation review.
- **Evidence boundary:** This authorization does not itself supply the required external artifacts. Current inspection found no local Razorpay credentials, no authorized Vercel project access, no customer repository/fixture package, no legal/licensing approval record, and no independent Hunt reviewer/evidence package. No production checkout, deployment, customer workflow, legal assertion, or independent-review claim is made until those artifacts exist.
- **Next action:** Continue code-side and hosted qualification work; execute provider/customer/legal/review gates only against supplied, verifiable inputs and their documented preflight/rollback controls.

## Shipping-ledger authority and public mirror divergence (2026-09-20)

- **Decision:** `verglos-cli-private-shipping/docs/shipping/` on branch `local/private-shipping-ledger` is the authoritative V1 shipping record. The untracked `verglos-cli/docs/shipping/` copy is a stale local mirror, not an alternate source of truth.
- **Observed divergence:** the public-repository mirror predates accepted OPS-001-014, HUNT-002/003/004/007, and LIC-005 updates. Its backlog/status/traceability/ledger hashes and checkbox totals differ from the private ledger.
- **Resolution:** preserve the mirror as founder-owned untracked material; do not overwrite it silently, use it for acceptance counts, stage it, or push it publicly. Reconciliation occurs only in this private ledger. Any future mirror refresh must be an explicit private/local copy operation and must still remain excluded from public commits.
- **Related exclusion:** `packages/shared/src/spec-validation-corpus.test.ts` in the CLI worktree is an untracked draft and is not QUAL-CLI-006 acceptance evidence because it explicitly avoids the official validators required by that item.

## Mirror recheck (2026-10-03)

- **Observed:** the public CLI checkout remains `main...origin/main [ahead 70, behind 844]` with an untracked `docs/shipping/` mirror and founder-owned assets; its seven shipping-document hashes differ from the private ledger. Neither public nor Web has an open PR.
- **Resolution:** the private branch remains authoritative. No mirror copy, public commit, reset, force-push, or public documentation change was performed. The divergence is expected and remains recorded rather than silently reconciled.

## OPS-001 · Queue/provider decision — Neon PostgreSQL (founder-authorized 2026-09-16)

- **Status:** Selected. Founder authorized bucket B resolution 2026-09-16 with the explicit reasoning that pre-launch (zero paying users) the architecture-decision-set gates for representative workload / measured throughput / recovery drill / actual-cost comparison do not apply. Post-launch, if measured evidence shows Neon/PostgreSQL is inadequate, the interface remains provider-neutral and a replacement can be swapped in behind the `DurableQueueProvider` contract without touching call sites.
- **Selected provider:** Neon PostgreSQL, using the existing `jobs` and `outbox_events` tables on the same database as the tenant model. Implementation lives at `verglos-web/src/lib/queue/postgres-provider.ts`.
- **Contract satisfied:**
  - Idempotent enqueue via the `jobs_org_kind_idempotency_idx` unique index; duplicate enqueue returns the original row and does not mutate lease state.
  - Atomic claim with `SELECT ... FOR UPDATE SKIP LOCKED`; a second concurrent lease sees zero due rows.
  - Lease fencing via `lease_owner` + `lease_expires_at` + `attempts` as monotonic generation; a stale fence rejects acknowledge, fail, and any state mutation.
  - Retry with configurable `retryAt` (default 60 s) until `attempts >= maxAttempts`, then automatic dead-letter (`status = 'dead-letter'`).
  - Opaque fairness cursor (base64url tenant id) so no single tenant can starve another across sweeps.
- **Evidence:** five DB-integration tests in `postgres-provider.integration.test.ts` (skipped without `TEST_DATABASE_URL`) prove enqueue idempotency, atomic claim / no double-lease, stale-fence rejection, retry-to-dead-letter transition, and fairness cursor advance. Nine input-validation unit tests always run.
- **Non-goals for V1:** no separate queue service, no external message broker, no cross-region replication. The unified DB avoids operational complexity while paying users are zero. Provider swap remains cheap because the interface is stable.
- **Post-launch action:** collect real measurements once users exist; if throughput or contention exceeds Neon's practical limit, evaluate an external queue against the same interface and swap without call-site changes.

## OPS-002 · Scheduler / due-job producer (accepted 2026-09-16)

- **Status:** Accepted with OPS-001. Implementation at `verglos-web/src/lib/queue/monitor-producer.ts`.
- **Contract:** deterministic idempotency key `monitor-check:<registration_id>:<YYYY-MM-DD>` — a second producer run in the same UTC day is a no-op on the unique index. Bounded sweep (default 500 registrations per run) enforces backpressure at the schedule layer; per-tenant static ceiling (default 50 outstanding jobs) prevents a single tenant from filling the queue. Ownership resolves through the personal organization `external_id = 'personal-user:<user_id>'` (HOSTED-013 target); registrations whose license user has no personal org are counted as `ownerUnresolvable` and never enqueued against the wrong tenant.
- **Observable lag:** producer manifest reports `observableLagSeconds` (max age of oldest due registration inside the sweep window) and `nextDueAfter` (earliest recently-checked registration outside the window). Owner of OPS-013 metrics wires these to alerting.

## Blanket authorization scope (2026-09-16)

Founder authorized: agent-selected durable queue provider (bucket B), agent-selected object-storage strategy (deferred to Studio implementation window; V1 uses Neon jsonb columns), agent-drafted contributor DCO policy (LIC-005 accepted at CLI PR #41), and routine branch/push/PR/merge/shipping actions without additional approval pauses. Production DB writes remain subject to the separately documented exact-operation preflight and postflight contract; blanket shipping authorization does not replace that evidence boundary.

## GitHub App contract implementation boundary · 2026-10-06

- **Decision:** Implement the GitHub App identity/lifecycle contract as a
  dependency-ready Web phase PR before attempting any live installation or
  organization cutover.
- **Evidence:** Web PR #144 (`afb48dc`) and private evidence
  `github-app-identity-contract-2026-10-06.md` record the immutable identity,
  multi-repository, permission, token, lifecycle, replay, tenant, and redaction
  checks plus the local/hosted check state.
- **Boundary:** The phase is not acceptance of GITHUB-WEB-001..004. Live App
  authorization, provider token exchange, production migration/deployment,
  customer use, and release claims remain gated and require their own reviewed
  preflight and postflight evidence.

## Founder scope decision · 2026-10-06

Verglos remains GitHub-first, but “GitHub-aligned” means a real App/org model:
immutable account and repository IDs, installation permissions/tokens, multiple
repositories, delivery-id replay protection, lifecycle events, and bounded
cutover evidence. The existing provider-neutral SCM substrate is not sufficient
for that claim. Razorpay support is expanded to every payment method actually
enabled in the account/test configuration, represented by a server-side catalog;
we will not advertise unavailable methods or infer support from documentation.
Final validation will use private manifests and full non-shallow public
TypeScript/JavaScript fixtures chosen by architecture shape. Public CLI history
must never contain customer data, credentials, proprietary source, private
reports, or competitive intelligence. The faster path is fat, dependency-ready
phase PRs with one acceptance boundary at a time, not helper-only checkbox work.

## Canonical policy digest rollout boundary · 2026-10-06

- **Decision:** Resolve the Web/CLI nested-policy digest mismatch with an
  explicit versioned algorithm field. Preserve `legacy-top-level-v1` for
  existing rows and use `canonical-json-v1` for new policy writes.
- **Evidence:** Web PR #146 (`5763632`) merged as `88a7791`; hosted Verify
  `37488304350` and the local 864/842/22/0 regression run passed. The additive
  migration is `0027_policy_digest_algorithm.sql`.
- **Rollback/boundary:** The change is additive and does not rewrite stored
  documents. Hosted policy activation, production migration/reconciliation,
  TEAM-CLI-001, and PLAN-CLI-001 remain gated until row inventory, rollout,
  rollback, and endpoint evidence are reviewed. No production operation ran.

## Account deletion worker boundary · 2026-10-07

- **Decision:** Do not implement or run a destructive hosted deletion worker
  until the legal-hold/customer-held authority and complete user-to-owned-data
  inventory are durable and reviewed.
- **Reason:** Existing hold and deletion modules are pure decision surfaces;
  `account_deletion_requests` is only a request ledger. The generic queue is
  organization-scoped, but account deletion is user-scoped and crosses legacy,
  personal-organization, and organization-owned rows. There is no authoritative
  hosted inventory of offline customer-held signed-record digests.
- **Consequence:** `QUAL-WEB-005` remains open. The route continues to record
  requests honestly as pending; no rows are deleted and no production migration
  or cron worker is added by this batch.
- **Evidence:**
  `docs/shipping/evidence/qual-web-005-deletion-worker-boundary-2026-10-07.md`.

## Account deletion inventory substrate · 2026-10-07

- **Decision:** Treat Web PR #153 only as a dependency substrate, not as
  `QUAL-WEB-005` acceptance. The versioned inventory and fail-closed gate may
  precede the operational worker while the remaining authority and recovery
  contracts are designed.
- **Evidence:** PR #153 head
  `718aadcaa384dcfd8a5fc4789c3b62c23c9e3858`; local focused tests 22/22,
  typecheck, database/schema checks, ordered migration validation, diff check,
  and 38-page build pass. Hosted workflow `37559045448` was still pending at
  capture.
- **Boundary:** no deletion worker, legal-hold persistence, customer-held
  digest registration, migration, production write, payment action, browser
  mutation, or checkbox change is authorized by this substrate. The existing
  `QUAL-WEB-005` boundary record remains controlling.

## Durable deletion hold authority substrate · 2026-10-07

- **Decision:** Add the durable hold table and pure release contract as a
  prerequisite, but keep deletion execution disabled. A hold is active only
  while unreleased and unexpired; release requires an actor, timestamp, and
  bounded reason.
- **Evidence:** Web PR #153 head
  `adf9a23b395a2c35208bd7d9cfcc7973300c2827`; local hold tests 3/3, combined
  focus 25/25, serial 846/22/0, typecheck/schema/migration/diff/build pass.
- **Boundary:** migration `0029` is not applied; no API, cron worker,
  destructive deletion, customer-held digest proof, restore rehearsal, or
  checkbox acceptance is supplied by this substrate.

## Customer-held digest registry substrate · 2026-10-07

- **Decision:** Store only canonical SHA-256 identities for customer-held
  signed `.vgl` records and compare the registered set before/after deletion;
  never store or mutate the offline record bytes in the hosted deletion path.
- **Evidence:** Web PR #153 head `4c5966f`; focus 28/28, serial 846/22/0,
  typecheck/schema/migration/diff/build pass, and 31 ordered migrations.
- **Boundary:** migrations `0029`/`0030` are unapplied; no authenticated
  writer, worker, destructive operation, restore rehearsal, or checkbox
  acceptance is supplied.

## Bounded deletion worker contract · 2026-10-07

- **Decision:** Keep the worker user-scoped and adapter-driven. The
  organization-scoped generic queue is not used as an account-deletion
  authority; the adapter must own transactional SQL, claims, retries,
  idempotency, reconciliation, and audit persistence.
- **Evidence:** Web PR #153 head `aef06b7`; worker focus 31/31, negative
  boundary 2/2, serial 846/22/0, typecheck/diff/build pass.
- **Boundary:** no production adapter, cron route, destructive operation,
  migration, restore rehearsal, or checkbox acceptance is supplied by this
  contract. Hosted workflow `37560432960` was in progress.

## Bounded deletion worker scope fence · 2026-10-07

- **Decision:** A worker invocation must match the persisted user identity on
  the claimed job before it may read deletion state or invoke any adapter.
- **Evidence:** Web PR #153 head `ade21b6`; worker/deletion focus 32/32,
  negative boundary 2/2, typecheck/diff pass, and hosted workflow
  `37560704115` with job `112597060041` passed.
- **Boundary:** This closes only the contract-level scope check. The store
  adapter, deletion-job persistence/wiring, row-count and audit reconciliation,
  restore rehearsal, and non-production E2E remain open; no production or
  destructive operation occurred.

## User-scoped deletion job persistence · 2026-10-07

- **Decision:** Pair every accepted deletion request with a durable job in the
  same transaction, using a dedicated user-scoped table rather than the
  organization-scoped generic queue.
- **Evidence:** Web PR #153 head `b91222a`; focused 16/16, disposable
  PostgreSQL integration 1/1, serial 846/23/0, typecheck/schema/migration/
  build/diff pass.
- **Boundary:** Migration `0031` is source-only. This supplies enqueue state
  but not claim/retry SQL, per-kind deletion, reconciliation/audit receipt,
  restore/rollback rehearsal, or acceptance; hosted checks were pending at
  capture and no production operation occurred.

## Fenced deletion job adapter boundary · 2026-10-07

- **Decision:** Implement only the durable user-scoped claim/retry/block state
  first. Use `SKIP LOCKED` plus worker/attempt fences; fail closed for all
  inventory, destructive, and audit operations until separately qualified.
- **Evidence:** Web PR #153 head `654c78c`; disposable PostgreSQL integration
  1/1, serial 846/23/0, typecheck/schema/migration/negative/build/diff pass;
  hosted workflow `37561862519` was queued at capture.
- **Boundary:** No runtime route or cron wires this adapter, migration 0031 is
  unapplied, and `QUAL-WEB-005` remains open pending inventory-backed reads,
  per-kind transactions, reconciliation/audit, restore/rollback, and E2E.

## Deletion inventory read boundary · 2026-10-07

- **Decision:** Read hosted-kind counts only while the job fence is live and
  keep the operational completeness bit false until supporting user/license/
  retention tables and legal dispositions are covered.
- **Evidence:** Web PR #153 head `4656013`; disposable PostgreSQL integration
  1/1, serial 846/23/0, typecheck/schema/migration/negative/build/diff pass;
  hosted workflow `37562115786` was pending at capture.
- **Boundary:** No per-kind deletion, audit receipt, restore rehearsal,
production migration, or acceptance is supplied by this read path.

## Fenced deletion receipt boundary · 2026-10-07

- **Decision:** Persist only bounded terminal decision metadata, and complete
  the request/job atomically under the live worker/attempt fence. Enforce
  unique request and audit-idempotency identity; stale or replayed fences must
  not claim completion.
- **Evidence:** Web PR #153 exact head `52be606`; disposable PostgreSQL
  integration 1/1, serial 846/23/0, typecheck/schema/33-migration/build/diff
  pass; hosted workflow `37562587132` passed.
- **Boundary:** Migration `0032` is source-only and no destructive adapter or
  runtime worker is wired. Complete ownership/retention inventory,
  per-kind deletion, reconciliation, restore/rollback, and E2E remain open.

## Hosted payment method catalog boundary · 2026-10-07

- **Decision:** Represent the broader Razorpay hosted method surface in the
  server catalog, but expose only methods that are both configured and
  code-supported; keep QR and approval-dependent methods fail-closed until
  separately qualified for the account and lifecycle.
- **Evidence:** Web PR #149 exact head `db68157`; local payment/runtime
  25/25, negative boundary 2/2, truth registry 25/25, serial 850/22/0,
  typecheck/schema/build/diff pass; hosted workflow `37563023349` passed.
- **Boundary:** This does not prove account enablement, provider test
  transactions, webhook/replay behavior, production reconciliation, or
  acceptance. The PR remains open and no provider, payment, production,
  database, deployment, or browser mutation occurred.

## Fenced per-kind deletion transactions · 2026-10-07

- **Decision:** Persist one request/kind operation and deleted-row count in the
  same transaction as each scoped deletion. Replays return the original count;
  a stale lease cannot mutate data or record a receipt.
- **Evidence:** Web PR #153 exact head `9476e5d`; focused 29/29, disposable
  PostgreSQL 1/1, serial 846/23/0, typecheck/schema/34-migration/build/diff
  pass; hosted workflow `37563632682` passed.
- **Boundary:** Only the seven hosted projections are implemented. Supporting
  account/license/billing/retention dispositions, runtime wiring,
  reconciliation, restore/rollback, and E2E remain open; migration `0033` is
source-only and no production or destructive operation occurred.

## Bounded deletion runtime runner · 2026-10-07

- **Decision:** Expose only a bounded, authenticated cron adapter for due
  deletion jobs. Enforce a maximum batch of 10, validate the frozen seven-kind
  allowlist, delegate to the fenced worker, and always close the database
  client. Keep malformed jobs untouched and preserve the inventory fail-closed
  boundary.
- **Evidence:** Web PR #153 exact head `1f8571b`; route contract 2/2,
  disposable PostgreSQL integration 1/1, serial 846/23/0, typecheck/schema/
  34-migration/build/diff pass; hosted workflow `37563987818` passed.
- **Boundary:** This wires the runtime contract but does not authorize
  deployment or production invocation. Supporting data dispositions,
  reconciliation, restore/rollback, and authenticated non-production E2E
remain open; `QUAL-WEB-005` is not accepted.

## Supporting deletion dispositions · 2026-10-07

- **Decision:** Enumerate every supporting deletion table with one bounded
  disposition, rationale, and approval flag. Fail closed on omissions,
  duplicate/unknown tables, or blank rationale. Keep the registry separate from
  destructive SQL until every disposition is executable and recoverable.
- **Evidence:** Web PR #153 exact head `f83af5c`; focused deletion/hold/
  inventory 11/11, serial 846/23/0, typecheck/schema/34-migration/build/diff
  pass; hosted workflow `37564437899` passed.
- **Boundary:** This is an omission-detection contract, not deletion
  authorization. Provider/accounting retention, legacy public records,
  customer-held digest handling, reconciliation, restore/rollback, and
  authenticated non-production E2E remain open.

## HUNT-009 supported recipe execution requalification · 2026-10-07

- **Decision:** Record PR #75 as merged implementation and regression
  evidence; keep `HUNT-009` open.
- **Evidence:** Merge `6bde945c`; hosted Ubuntu/macOS/Windows Node 20/22/24,
  self-scan, and in-toto checks all passed. The exact requalification worktree
  package suite exited 0, including focused trust/approval, positive/negative,
  binding-drift, symlink, and unavailable-runtime cases.
- **Boundary:** HUNT-008 trusted/licensed provenance and independent Hunt
  isolation/review remain acceptance gates. No checkbox changed and no external
  recipe or production operation was performed.

## PLAN-WEB-013 test-mode hosted order probe · 2026-10-07

- **Decision:** Accept the test-mode order/read-back as provider binding
  evidence; keep PLAN-WEB-013/014/015 open.
- **Evidence:** Web PR #149 head `db68157`; one bounded Razorpay test order
  used the canonical INR 280,943 Pro monthly offer and returned `created` with
  exact amount/currency and signed checkout notes. Focused billing/config
  suite **38/38 pass**. One observed `netbanking` payment is retained only as
  an aggregate observation.
- **Boundary:** This does not prove account-enabled method discovery or any
  payment lifecycle. No payment/capture/refund/webhook/entitlement or
  production operation occurred; no checkbox changed.

The approved Chrome CDP display probe opened hosted Checkout twice in test
mode and closed without submission. Its child execution context did not expose
stable method labels to the bounded projection, so the result is recorded as
checkout-open evidence only and does not alter the payment decision.

A direct provider-checkout target observation later exposed selectable UPI,
card, netbanking, wallet, EMI, and Pay Later radios, with no QR radio. Record
this as account-level method observation only; keep PLAN-WEB-014/015 open until
each observed method has lifecycle and reconciliation evidence.

## GitHub App installation read-only preflight · 2026-10-07

- **Decision:** Keep GITHUB-WEB-001 through GITHUB-WEB-004 open; do not infer
  installation or cutover state from organization repository access.
- **Evidence:** Organization reads succeed, but `GET /user/installations`
  returns 403 because the current GitHub token is not App-authorized.
- **Boundary:** No GitHub provider mutation or production operation occurred.
## PLAN-WEB-013 hosted Pay Later alignment · 2026-10-07

- **Decision:** Expose Pay Later through the same hosted Checkout adapter as
  the other directly observed methods; keep methods without an equivalent
  qualification observation fail-closed.
- **Evidence:** PR #149 commit `f734acc`; direct test-mode hosted Checkout
  observation showed a selectable Pay Later radio; focused payment/route/runtime
  tests pass 30/30 and typecheck passes.
- **Boundary:** This does not qualify Pay Later success, failure, capture,
  refund, renewal, replay, or entitlement behavior. PLAN-WEB-013/014/015 stay
  open and no payment or production operation occurred.
- **Hosted result:** Exact head `f734acc8d4b03625b96cb90b628be04d4713d91d`
  passed Verify `37611750797` plus GitGuardian, Vercel, and Preview Comments.
  This permits code-side qualification only; it does not authorize merging
  while payment lifecycle and reconciliation gates remain open.
## PLAN-WEB-014 card sandbox contact validation · 2026-10-07

- **Decision:** Treat the card probe as incomplete provider UI evidence only;
  do not claim success, failure, capture, or lifecycle acceptance.
- **Evidence:** Cards rendered in Razorpay test-mode hosted Checkout, but the
  sandbox rejected the synthetic contact input before continuation. The single
  persistent page was restored to `about:blank` and production was untouched.
- **Boundary:** No payment or webhook was produced; PLAN-WEB-014 remains open.
## HUNT-009 execution entitlement gate · 2026-10-07

- **Decision:** Require `hunt.critical` at the CLI execution boundary before
  reading any execution input. A paid plan alone is insufficient; signed
  recipe, approval, supported catalog, exact bindings, and bounded runtime
  gates remain required.
- **Evidence:** PR #76 exact head `17d0813737cda980ccb366c5adf948bda2e293a3`;
  focused 54/54; typecheck passes; Free-plan process denial is verified.
- **Boundary:** This closes a code-side authorization gap only. HUNT-009 and
  HUNT-008 remain open for hosted/requalification, trusted/licensed provenance,
  and independent review.

## PLAN-WEB-014 Cards and Netbanking hosted probes · 2026-10-07

- **Decision:** Keep the all-method hosted order architecture and record the
  Cards/Netbanking runs as incomplete provider UI evidence only. Do not grant
  entitlement or mark any payment lifecycle as passed.
- **Evidence:** Razorpay Test Mode on PR #149 exact head `b73fdd3` reached the
  Cards save-card/confirming state and the Netbanking bank-selection screen.
  Focused payment/runtime contracts remain 47/47 passed.
- **Boundary:** No success/failure callback, capture, refund, webhook,
  renewal, replay, out-of-order, entitlement, database, production, or
  deployment evidence was produced. PLAN-WEB-014/015 remain open; the CDP
  blank target was restored.

## QUAL-WEB-006 mobile/focus runtime probe · 2026-10-07

- **Decision:** Record the `/orgs` desktop/mobile and accessibility-tree
  observations as partial runtime evidence only; do not mark accessibility,
  responsive, or performance acceptance from an empty state.
- **Evidence:** Existing authenticated CDP target; no horizontal overflow at
  1710x985 or 390x844; AX trees 30/18 named and 32/20 named; one focusable
  link; desktop layout/style/task/heap metrics
  0.000059s/0.000669s/0.001557s/6,530,812 bytes.
- **Boundary:** Programmatic focus does not prove keyboard-visible focus or
  screen-reader usability. Data states, field-CWV, large datasets, and human
  review remain open. No checkbox or production state changed.

## Web empty-Postgres regression qualification · 2026-10-07

- **Decision:** Treat the empty-database serial run as local runtime-regression
  evidence only; do not promote it to production or release acceptance.
- **Evidence:** PR #153 exact head `929da1907f001c8db71df0e601e08014590fd580`,
  disposable Docker `postgres:15`, `pnpm test:serial` exit 0, pretest 48/48,
  main 871/872 with one explicit billing-environment skip and zero failures.
- **Boundary:** No migration, `db:push`, production/provider/payment/
  deployment/browser mutation, or backlog checkbox change occurred. The
  deletion, payment, restore/rollback, reconciliation, and independent
  acceptance gates remain open.

## QUAL-WEB-005 hold serialization · 2026-10-07

- **Decision:** Use a user-scoped PostgreSQL transaction advisory lock as the
  shared serialization boundary for hold activation/release and each
  destructive deletion/terminal-receipt transaction. Recheck active holds
  inside that boundary and return a bounded block reason.
- **Reason:** A worker-level recheck alone could observe a hold only after an
  earlier destructive transaction had already committed. Shared locking makes
  the check and each protected mutation orderable without holding a database
  connection across the complete worker attempt.
- **Evidence:** Web PR #153 commit `85faba9`; focused tests **35/35** and
  disposable PostgreSQL integration **1/1**. Verify `37633633802` completed
  successfully at exact head. This is not full deletion acceptance.

## Migration bootstrap safety boundary · 2026-10-07

- **Decision:** Do not edit the applied `0000` migration or silently push an
  empty/partial schema. Route `db:migrate` through a read-only preflight and
  permit the reviewed legacy baseline only for an explicitly confirmed local
  empty database; CI and production refuse that bootstrap path.
- **Reason:** The numbered journal begins after the historical `users` and
  `licenses` baseline, and later application code also depends on legacy
  tables. A direct Drizzle run against an empty database fails before proving
  what it would write; an unconditional bootstrap would risk an unknown or
  production schema.
- **Evidence:** Web PR #149 `3f05b0a`; focused 12/12, serial 855/878/23/0,
  typecheck/schema/31-migration/build/public-boundary/SBOM/license checks, and
  disposable PostgreSQL refusal + explicit 31-migration rehearsal. See
  `docs/shipping/evidence/migration-bootstrap-guard-2026-10-07.md`.
- **Boundary:** This is migration code-side safety only. Production history,
  snapshot/restore, R-041 credential rotation, and deployment authorization
  remain open; no backlog checkbox changed.

## Production checkout post-redeploy smoke · 2026-10-08

- **Observation:** `https://verglos.com/checkout` returned HTTP 200 from Vercel
  and rendered the hosted method projection `UPI · Cards · Netbanking · Wallets
  · EMI · Pay Later` with the current Pro INR catalog. Chrome DevTools found no
  console warnings or errors; Razorpay hosted assets loaded successfully.
- **Mode:** The initial production surface did not show the Razorpay Test Mode
  banner. Treat production as live-key checkout and do not use it for payment
  qualification. Test-mode lifecycle qualification remains a Preview/staging
  operation.
- **Boundary:** No order creation, payment, webhook, entitlement, database,
  provider configuration, price, or migration write occurred. This does not
  close PLAN-WEB-011/012/013/014/015 or R-041. Evidence:
  `docs/shipping/evidence/production-checkout-post-redeploy-2026-10-08.md`.

## Preview payment safety correction · 2026-10-08

- **Decision:** Keep Preview payment checkout fail-closed until it has an
  isolated non-production database and Razorpay Test Mode credentials.
- **Evidence:** Preview deployment `dpl_CHmsR3ZVBsNDngm5D3z5Bb95h9tw` passed the
  build and renders no approved payment methods. The temporary deployment that
  rendered methods with `testMode: false` was deleted. Evidence:
  `docs/shipping/evidence/preview-payment-safety-2026-10-08.md`.
- **Boundary:** No test or live payment, order, webhook, entitlement, database,
  provider, or production write occurred. PLAN-WEB-014 remains open.

## QUAL-WEB-005 request-auth seam for route qualification · 2026-10-08

- **Decision:** Use the existing `requestAuth()` and `requestCurrentUser()` seam
  for account deletion, customer-held digest, and operator hold routes. Keep
  Clerk as the production resolver and permit the provider only in explicit
  non-production integration tests.
- **Reason:** Direct Clerk imports bypassed the reviewed isolated test seam and
  prevented authenticated route qualification without weakening production
  authentication. The seam makes the boundary testable while preserving the
  production path.
- **Evidence:** Web PR #162 merged from exact head
  `3061b9a14bd01ba22e0076b8c30d71d387483ade` as
  `b34376bb02525737830f1d075778ebce774ed006`; focused route integration 8/8,
  deletion/hold/inventory/worker contracts 23/23; isolated 38-migration
  database run; safe-default serial 861/885 with 24 explicit skips and zero
  failures; hosted Verify 37785153399; preview-safe 45-page build.
- **Boundary:** This is not deletion acceptance. Legal/customer-held
  disposition, destructive-worker execution, reconciliation, restore/rollback,
  production authorization, and independent review remain open.

## QUAL-CLI Hunt fixture build boundary · 2026-10-08

- **Decision:** Build the private Hunt package explicitly in the CLI package's
  test script before HUNT-009 execution tests load its local fixture.
- **Reason:** A fresh checkout had no `packages/hunt/dist`, so two valid
  success-path tests incorrectly exercised the intended unavailable-runtime
  response (`78`). The change keeps Hunt out of the public CLI dependency graph
  and does not alter the production loader.
- **Evidence:** CLI PR #82 exact head
  `806f2352f0f95d023a87ef8832a5a23aa47789a1` merged as
  `b852c263fe5aa26f593e4f815532a7ddb6e8d9ff`; local 924-test run with 908
  passes, 0 failures, and 16 explicit skips; focused HUNT-009 5/5; typecheck
  and build pass; platform matrix `37786406937`, self-scan `37786406760`, and
  in-toto binding passed after the isolated Windows Node 20 runner failure was
  rerun.
- **Boundary:** This is test-fixture qualification only. Hunt provenance,
  legal clearance, adversarial completion, independent review, and acceptance
  remain open. No backlog checkbox changed.

## Credential containment after local inspection error · 2026-10-08

- **Decision:** Treat the Razorpay/test and production-encrypted values emitted
  by the malformed environment-inspection command as compromised; do not use
  them for qualification or production operations.
- **Required correction:** Rotate/revoke the affected provider credentials,
  refresh the Vercel production secret, redeploy only after the provider and
  deployment preflight is reviewed, and verify the old values are unusable
  without recording any secret.
- **Boundary:** No provider call, payment, deployment, database, or production
  write was made after the incident. PLAN-WEB-014/015 and R-041 remain open.

## Hosted payment methods remain contract-qualified, not provider-accepted · 2026-10-08

- **Decision:** Preserve hosted checkout as the all-method path and keep QR as
  a separate opt-in adapter. Lock the six currently supported hosted methods
  into synthetic captured/failed/replay tests and reject methods absent from
  the signed checkout snapshot.
- **Evidence:** Web PR #163 merged as `d88aa7b9b219df414707143bc8c6b9c6e9b18193`;
  focused 21/21, serial 862/886 with 24 skips, hosted Verify `37789719564`,
  schema/migration/type/build gates green.
- **Boundary:** Synthetic tests do not prove Razorpay provider lifecycle,
  refunds, renewals, entitlement reconciliation, or production truth. R-041
  credential containment and PLAN-WEB-014/015 remain open.

## Invoice-bound subscription captures and Production code rollout · 2026-10-09

- **Decision:** Bind Razorpay subscription captures through the provider's paid
  invoice when the payment entity omits `subscription_id`; normalize only the
  observed string boolean representation of `captured` and retain all exact
  commercial, signature, status, and refund checks.
- **Evidence:** Web `a95deef`; focused webhook 13/13; full Web 891 total,
  868 pass, 23 explicit skips, 0 failures; isolated Preview invoice/payment/
  subscription/ledger/license reconciliation; Production deployment
  `dpl_72ptf8YQyLxxXvJHVQDg2vUfh3CN` with runtime-config, build, and read-only
  smoke passing.
- **Production boundary:** Production receives the reviewed code only. No
  Production plan IDs, payment/provider writes, database/migration writes,
  entitlement changes, account changes, or customer-data mutations occurred.
- **Disposition:** The observed first-charge subscription defect is fixed. The
  full Gate 4 lifecycle matrix and provider/ledger/entitlement reconciliation
  remain open; no backlog checkbox is accepted from this batch.

## Preview subscription mandate/OTP limitation · 2026-10-09

- **Decision:** Treat the bounded Test Mode subscription mandate/OTP failure as
  a provider-qualification limitation, not as payment success and not as a
  product acceptance failure. Do not repeat the same OTP interaction without
  a changed provider fixture or documented provider control.
- **Evidence:** The catalog-bound Preview route returned 200 and reached the
  provider mandate step; the bounded OTP and bank-like OTP paths failed. The
  isolated database was reconciled read-only with 38 migrations, 4 captured
  subscription payments, 2 active Pro licenses, and cumulative subscription
  and webhook aggregates recorded in the dated evidence file.
- **Boundary:** No Production plan, provider/payment, database/migration,
  entitlement, account, or customer-data write occurred. Gate 4 and
  `PLAN-WEB-011`, `PLAN-WEB-012`, `PLAN-WEB-014`, and `PLAN-WEB-015` remain
  open until the missing provider lifecycle and reconciliation evidence exists.

## Test Mode renewal trigger and replay boundary · 2026-10-10

- **Decision:** Do not use an undocumented charge endpoint or synthetic
  webhook. The supported subscription update was attempted once and rejected
  because the selected subscription's cycle start is in the future.
- **Next permitted action:** Use Razorpay's official Dashboard replay flow for
  an unacknowledged Subscription/Invoice event within seven days, selecting
  only the isolated Preview webhook. Replayed payloads must retain the
  provider signature and pass the existing idempotency path.
- **Boundary:** No provider write was accepted and no application or
  Production state changed. Gate 4 and `PLAN-WEB-014` remain open.
- **Evidence:**
  `docs/shipping/evidence/plan-web-014-testmode-renewal-replay-boundary-2026-10-10.md`.
