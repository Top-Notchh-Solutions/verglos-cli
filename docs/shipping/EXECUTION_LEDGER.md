# Verglos V1 Execution Ledger

# 2026-10-07 — Web GitHub App server-side exchange

- **Code:** Web PR #154 reconciled exact head `9032bda`, merged as `1498837`
  (`096de93` implementation plus `742a167` webhook-secret hardening);
  hosted typecheck/schema, Vercel, and Preview Comments passed.
- **Verification:** Focused SCM **24/24**; full Web **846/868** with 22
  explicit environment-gated skips and zero failures; typecheck, schema,
  29-migration ordering, negative boundary **2/2**, build **38/38**, and diff
  checks passed.
- **Change:** Server-side App-JWT installation-token exchange and
  provider-authoritative account/repository/permission projection; encrypted
  expiry-aware refresh in the SCM delivery cron; browser-supplied GitHub token
  and immutable identity removed from the GitHub route input; GitHub webhook
  secret moved to server-only `VERGLOS_GITHUB_WEBHOOK_SECRET`.
- **Disposition:** Implementation evidence only; TEAM-WEB-006 and live
  GitHub/organization/webhook/independent gates remain open. No checkbox
  changed; backlog remains **218/62/280 (77.9%)**.
- **Boundary:** No production/provider/payment/database/migration/deployment/
  credential/customer/browser write occurred.
- **Evidence:** `docs/shipping/evidence/github-app-server-exchange-2026-10-07.md`.
- **Merge boundary:** The code-side phase is merged, but GITHUB-WEB-001..004
  remain open for authorized organization installation, live provider delivery
  and lifecycle evidence, cutover, and independent acceptance.

The exact PR #154 head was reverified locally after adjacent work: serial Web
tests **846/868** with 22 explicit skips and zero failures; focused SCM/GitHub
tests **19/19**; typecheck, schema, and 29-migration ordering passed. No
checkbox changed and no provider/browser/production write occurred.

PR #154 was then reconciled with Web main after hosted checkout PR #149 merged:
exact pushed head `25b4470`. The reconciled branch passed focused SCM **33/33**,
serial Web **855/878** with 23 explicit skips and zero failures, typecheck,
schema, 31-migration ordering, build, and diff checks. Hosted checks restarted;
live App/org/webhook/cutover evidence remains open.

# 2026-10-07 — Authenticated modified-client probe boundary

- **Runtime:** The existing authenticated CDP page at `https://verglos.com/orgs`
  rendered `No organizations yet`; no organization identifier or tenant route
  was available.
- **Disposition:** `PLAN-CLI-003` remains open. No organization was created and
  no forged authenticated organization request was sent; this is a blocker
  record, not acceptance evidence.
- **Backlog:** **218 checked / 62 unchecked / 280 total (77.9%)**; no checkbox
  changed.
- **Evidence:** `docs/shipping/evidence/modified-client-authenticated-org-absence-2026-10-07.md`.

# 2026-10-07 — CLI origin/main reconciliation and Hunt adversarial qualification

- **Source:** Preserved founder-owned checkout; clean worktree exact
  `origin/main` head `7d060b2852551cc017bbb2b5f70bad22843e7273` after
  `git fetch --prune origin main`.
- **Verification:** `pnpm install --frozen-lockfile`; forced Turbo
  `test typecheck build` **23/23**; Docker client/server **29.7.2/29.7.2**;
  pinned `postgres:15-alpine` Hunt harness **60 passed / 1 skipped / 0 failed**.
- **Disposition:** Current-head CLI and local/CI adversarial evidence improved;
  no checkbox changed. HUNT-008/009/010/011 and QUAL-CLI-004/006 remain open
  for trusted publisher/recipe roots, official validators, Linux isolation,
  legal/trusted-publishing review, and independent acceptance.
- **Boundary:** No production, provider, payment, database, deployment,
  migration, credential, customer-state, or browser-state write occurred.
- **Evidence:** `docs/shipping/evidence/cli-origin-main-reconciliation-2026-10-07.md`.

# 2026-10-07 — PLAN-WEB-013/012 webhook-handler PostgreSQL integration

- **Scope:** Web PR #149 exact head `9fd22d8`, disposable local PostgreSQL 16, and synthetic signed Razorpay events.
- **Evidence:** Real handler integration **2/2**; route **2/2**; ledger **1/1**; webhook claim **1/1**; handler unit **8/8**; local typecheck/schema/31-migration ordering/build/diff checks passed. Hosted Verify **37642113170** passed; Vercel and Preview Comments passed.
- **Coverage:** Captured hosted order grants exactly once, duplicate event is ignored, refunds are monotonic across partial/full/stale observations, and failed order persists without an entitlement. Subscription lifecycle/renewal and identity-conflict behavior remain covered by the existing ledger/unit tests.
- **Limitation:** Fresh CI database migration rehearsal fails at legacy-dependent migration `0000` because `licenses` does not yet exist; no bypass was added and the Verify workflow was left unchanged. Real provider events and production reconciliation remain open.
- **Disposition:** Code-side evidence strengthened; no checkbox changed; backlog remains **218 checked / 62 unchecked / 280 total (77.9%)**. No production/provider/payment/deployment/migration/credential mutation.
- **Evidence:** `docs/shipping/evidence/plan-web-013-webhook-handler-postgres-2026-10-07.md`.

# 2026-10-07 — PLAN-WEB-013 isolated hosted-order route

- **Scope:** Web PR #149 exact head `160534025b58d3f14486390d569e8ba79e928dd2`, disposable local PostgreSQL 16 `verglos_test`, and non-production-only auth/provider seams.
- **Evidence:** Route integration **2/2**; focused payment/quality command **44/44**; local typecheck, `db:check`, 31-migration ordering, and build passed. Hosted Verify **37640983179** passed all repository checks.
- **Limitation:** Normal local parallel suite **864/877 passed, 11 failed, 2 cancelled** from shared database fixture races. Serial suite was not accepted because a writer fixture assumes an empty public schema. No full-suite green claim.
- **Disposition:** Code-side PLAN-WEB-013 evidence strengthened; PLAN-WEB-013/014/015 remain open pending real provider lifecycle and reconciliation evidence. No checkbox changed; backlog remains **218 checked / 62 unchecked / 280 total (77.9%)**.
- **Boundary:** No production database/payment/deployment/migration/credential mutation.
- **Evidence file:** `docs/shipping/evidence/plan-web-013-isolated-order-route-2026-10-07.md`.

# 2026-10-07 — QUAL-WEB-006 organization-directory CDP probe

- **Scope:** Existing dedicated Chrome `/orgs` page target; direct CDP
  read-only fallback because Chrome DevTools MCP transport was closed.
- **Observation:** One visible interactive element, zero unnamed visible
  interactive elements, two landmarks including one `main`, zero visible
  forms, 30 AX nodes, zero unnamed interactive AX nodes, and CLS `0.0000`.
  Existing navigation timing was DOMContentLoaded `4939 ms`, load `5647 ms`,
  and 250 resource entries. LCP and field CWV were unavailable without a
  reload/field source.
- **Disposition:** Partial runtime evidence only. QUAL-WEB-006 remains open
  for Pro/organization data, keyboard, human screen-reader, responsive,
  reduced-motion, reload-CWV, large-data, and field-CWV evidence. No checkbox
  changed; backlog remains **218 checked / 62 unchecked / 280 total (77.9%)**.
- **Boundary:** No navigation, reload, new tab, form submission, browser-state
  mutation, production/database/payment/deployment/migration operation, or
  personal data capture occurred.
- **Evidence:**
  `docs/shipping/evidence/qual-web-006-org-directory-cdp-2026-10-07.md`.

# 2026-10-07 — PLAN-WEB-014 isolated PostgreSQL integration

- **Source:** Web PR #149 exact head `aa34127`; disposable local Docker
  PostgreSQL 16 container and database `verglos_test` on loopback only.
- **Verification:** Guarded non-production schema setup completed. Billing
  ledger, Razorpay webhook/PostgreSQL claim, and receipt-route integration
  tests passed **3/3**.
- **Disposition:** This is database-backed application evidence, not provider
  acceptance. Account-enabled method behavior, real capture/failure/refund
  callbacks, webhook delivery, entitlement reconciliation, and production
  preflight remain open. PLAN-WEB-014/015 remain unchecked; backlog remains
  **218 checked / 62 unchecked / 280 total (77.9%)**.
- **Boundary:** No production, hosted database, customer-state, live-payment,
  deployment, migration-file, or credential operation occurred.
- **Evidence:**
  `docs/shipping/evidence/plan-web-014-isolated-postgres-integration-2026-10-07.md`.

# 2026-10-07 — QUAL-CLI-006 current-head standards run

- **Source:** CLI exact head `13d144438045da574e7cbab6a21ec73341b8f796` in
  `feat/cli-qual-006-importer-corpus`; worktree clean.
- **Verification:** Docker Server `29.7.2`; shared package suite **448/448**
  across 113 test files; shared typecheck and build pass.
- **Standards:** The repository's documented temporary
  `pnpm.supportedArchitectures` setup rehydrated platform-optional packages;
  license inventory and CycloneDX/SPDX SBOM generation passed for the
  254-package lockfile. The temporary manifest and generated artifacts were
  reverted and the worktree is clean.
- **Disposition:** QUAL-CLI-006 remains open for official validators,
  cross-platform/trusted-publishing/legal evidence, and independent review.
  No checkbox changed; backlog remains **218 checked / 62 unchecked / 280
  total (77.9%)**.
- **Evidence:**
  `docs/shipping/evidence/qual-cli-006-current-head-standards-run-2026-10-07.md`.

# 2026-10-07 — PLAN-WEB-013 Checkout retry-state hardening

- **Code:** Web PR #149 exact pushed head `aa34127`.
- **Change:** Provider failure events and pre-confirmation dismissal clear the
  stale order and return to the actual offer/retry screen; the submitted state
  is set only after `checkout.open()` returns successfully.
- **Verification:** Focused payment/checkout/webhook and route-contract tests
  **27/27**, typecheck, production build, and diff check pass. Vercel and
  Preview Comments and exact-head Verify `37637158955` pass.
- **Boundary:** No provider, payment, entitlement, database, migration,
  deployment, production, or credential mutation occurred. PLAN-WEB-013/014/
  015 remain open; no checkbox changed. Backlog remains **218 checked / 62
  unchecked / 280 total (77.9%)**.
- **Evidence:**
  `docs/shipping/evidence/plan-web-013-checkout-retry-state-2026-10-07.md`.

# 2026-10-07 — PLAN-WEB-014 Test Mode method-display probe

- **Result:** One isolated Razorpay Test Mode order was created and hosted
  Checkout rendered UPI, Cards, EMI, Netbanking, Wallet, Pay Later, and
  optional UPI QR. UPI contact validation rejected synthetic input before a
  provider outcome.
- **Disposition:** No callback, capture, refund, webhook, entitlement, or
  app-ledger result was observed. This is provider UI evidence only;
  PLAN-WEB-014/015 remain open and no checkbox changed.
- **Boundary:** The existing CDP blank target was reused and restored to
  `about:blank`. No production, live-payment, database, deployment, or
  credential mutation occurred. Backlog remains **218 checked / 62 unchecked /
  280 total (77.9%)**.
- **Evidence:**
`docs/shipping/evidence/plan-web-014-test-mode-method-display-2026-10-07.md`.

# 2026-10-07 — PLAN-WEB-014 provider iframe qualification attempt

- **Scope:** One Razorpay Test Mode hosted Checkout order using the existing
  Chrome CDP `about:blank` target; no new tab was opened.
- **Observation:** The cross-origin provider iframe exposed six payment-method
  selectors, but its UPI input was unavailable to the bounded CDP interaction
  after selecting the method. No provider callback, capture, refund, webhook,
  entitlement, or app-ledger result was produced.
- **Disposition:** This is incomplete provider-rendering evidence only. The
  target was restored to `about:blank`; PLAN-WEB-014/015 remain open and the
  backlog remains **218 checked / 62 unchecked / 280 total (77.9%)**.
- **Evidence:**
  `docs/shipping/evidence/plan-web-014-provider-iframe-qualification-2026-10-07.md`.

# 2026-10-07 — QUAL-WEB-005 hosted result for hold-boundary fix

- **Result:** Hosted Verify `37632466656` completed successfully for PR #153
  exact head `d7deec1bc115417e924c93846231074ea87ad51e`.
- **Coverage:** Typecheck, serial Web, negative-boundary, truth-registry,
  schema/migration, production build, public-boundary, dependency, SBOM/license,
  and tracked-secret checks passed. Only runner/action deprecation notices were
  emitted.
- **Disposition:** Current-head hosted code evidence only; no accepted ID and
  no checkbox change. `QUAL-WEB-005` remains open for authenticated E2E,
  legal/customer-held disposition, reconciliation, restore/rollback, and
  independent acceptance.
- **Backlog:** **218 checked / 62 unchecked / 280 total (77.9%)**.
- **Boundary:** No production deletion/migration/configuration, provider,
  payment, deployment, browser, entitlement, or credential operation.

# 2026-10-07 — PLAN-WEB-013/014 hosted result for refund hardening

- **Result:** Hosted Verify run `37632192255` completed successfully for PR
  #149 exact head `238ec7425ff1979b82d97e3d371cedbe83fbd394`.
- **Disposition:** This is current-head hosted workflow evidence only. It does
  not qualify provider methods, payment lifecycle/reconciliation, production
  configuration, or payment acceptance; no checkbox changed.
- **Backlog:** **218 checked / 62 unchecked / 280 total (77.9%)**.
- **Boundary:** No provider, browser payment, entitlement, production,
  deployment, migration, or credential operation.

# 2026-10-07 — QUAL-WEB-005 deletion hold completion boundary

- **Batch:** Close the race in which a legal hold could appear between the
  initial deletion check and the final audit decision.
- **Backlog:** `QUAL-WEB-005` attempted; no accepted IDs. Count remains
  **218 checked / 62 unchecked / 280 total (77.9%)**.
- **Code:** Web PR #153 commit `d7deec1`, pushed as exact head
  `d7deec1bc115417e924c93846231074ea87ad51e`.
- **Verification:** Focused deletion/qualification tests **36/36**, typecheck,
  and `git diff --check` passed. Disposable Docker PostgreSQL 15 job
  integration passed **1/1** using temporary tables; the container was removed.
- **Hosted:** Verify run `37632466656` was in progress at capture.
- **Boundary:** No production migration, deletion, database/configuration write,
  browser E2E, legal decision, deployment, rollback, provider, or credential
  operation.
- **Disposition:** Keep PR #153 and QUAL-WEB-005 open for authenticated E2E,
  complete row/held-record reconciliation, legal/consent decisions,
  restore/rollback, and independent acceptance. See
  `docs/shipping/evidence/qual-web-005-hold-boundary-2026-10-07.md`.

# 2026-10-07 — PLAN-WEB-013/014 refund ordering hardening

- **Batch:** Harden the payment ledger against an out-of-order stale refund
  observation on the existing Web payment phase PR.
- **Backlog:** `PLAN-WEB-013` and `PLAN-WEB-014` attempted; no accepted IDs.
  Count remains **218 checked / 62 unchecked / 280 total (77.9%)**.
- **Code:** Web PR #149 commit `238ec74`, pushed as exact head
  `238ec7425ff1979b82d97e3d371cedbe83fbd394`.
- **Verification:** Focused payment/webhook tests 17 runnable passes plus one
  explicit migrated-database skip; typecheck and `git diff --check` passed.
  Disposable Docker PostgreSQL 15 schema fixture via the explicit local
  db:push guard passed `ledger.integration.test.ts` 1/1. Empty-db migration
  was not used as acceptance evidence because migration 0000 requires the
  reviewed legacy baseline.
- **Hosted:** Verify run `37632192255` was queued at capture; prior-head
  success is not counted for the new head.
- **Boundary:** No provider, browser, payment, entitlement, production
  database/configuration, migration, deployment, or credential operation.
- **Disposition:** Keep PR #149 open; provider method/lifecycle and production
  reconciliation gates remain open. See
  `docs/shipping/evidence/plan-web-013-refund-ordering-2026-10-07.md`.

# 2026-10-07 — PLAN-WEB-014 Razorpay Test Mode plan inventory

- **Batch:** Read the isolated provider Test Mode subscription-plan inventory
  before attempting recurring checkout implementation.
- **Result:** `plans.all({ count: 100 })` returned zero plans. Production
  environment-name inspection found no subscription-plan ID mapping.
- **Backlog:** No accepted IDs; count remains **218 checked / 62 unchecked /
  280 total (77.9%)**.
- **Boundary:** No provider plan or subscription was created; no browser,
  payment, webhook, database, deployment, migration, or production operation
  occurred.
- **Decision:** Keep the order-based hosted path and require an approved
  non-production plan mapping before recurring lifecycle qualification.
- **Evidence:**
  `docs/shipping/evidence/plan-web-014-razorpay-test-plan-inventory-2026-10-07.md`.

## 2026-10-07 · QUAL-WEB-005 preview browser boundary

- **Observation:** Chrome CDP read-only navigation to the PR #153 Preview
  `/account/privacy` was redirected to Vercel deployment login before the app
  loaded.
- **Safety:** No Vercel login, credential capture, app mutation, deletion,
  database, payment, or entitlement request occurred; the tab returned to
  production `/orgs`.
- **Boundary:** This does not qualify authenticated preview deletion E2E.

## 2026-10-07 · QUAL-WEB-005 privacy surface

- **Source:** Web PR #153 exact head `db27d793d890929f642ed0d5b5b9bd056a732bc`.
- **Implementation:** Added `/account/privacy` navigation/page with explicit
  confirmation, no-store request history, idempotent submission handling, and
  honest pending-worker/customer-held-record language.
- **Verification:** Focused local suite 23/23; typecheck; schema and 35
  migration checks; build; negative boundary 2/2; SBOM/license; hosted Verify
  `37607448915` all green.
- **Boundary:** No deletion E2E, legal/held-record decision run, restore or
  deployment rollback acceptance, production write/migration/deployment,
  payment, entitlement, or checkbox change.

## 2026-10-07 · exact production migration preflight

- **Result:** Read-only exact audit against PR #153's 35-entry journal found
  all 42 allowlisted tables present, 26 applied migration rows, and the
  pending 0026–0034 tail. Preflight is `blocked-migration-history`.
- **Counts:** licenses 1, legacy mappings 3, webhook events 4, payments 0,
  subscriptions 0.
- **Boundary:** No row contents, credentials, or identifiers were retained;
  no production write/migration/deployment/payment/entitlement/deletion and no
  backlog checkbox change occurred. This does not authorize PR #153 merge.

## 2026-10-07 · merge decision

- **PR #149:** Do not merge. Hosted checks are green, but the provider account
  method list and all-method payment lifecycle are unverified; production also
  lacks the explicit hosted-method configuration.
- **PR #153:** Do not merge. Fresh restore and scoped worker rollback/retry are
  green, but production migration approval, authenticated deletion E2E,
  legal/customer-held-record disposition, and deployment rollback acceptance
  remain open.
- **Reason:** The active shipping goal requires those operational gates before
  merge/deploy; merging green code into an unqualified production path would
  not close any backlog item.

## 2026-10-07 · fresh production snapshot and restore rehearsal

- **Snapshot:** Vercel Production `DATABASE_URL` was used by `pg_dump` in a
  read-only operation. Snapshot completed at `2026-10-07T10:17:27.005Z`,
  size 150,515 bytes; the temporary mode-700 directory and credentials were
  removed afterward.
- **Restore/migration:** Disposable PostgreSQL 18 restore succeeded. PR #153
  exact head `250313e86ae6b746e1137c9f4d5436b23a96c170` passed migration
  ordering and applied the current migration tail; restored history ended at
  35 rows.
- **Reconciliation:** restored aggregate counts were migrations 35, deletion
  requests 0, payments 0, subscriptions 0, webhook events 4.
- **Boundary:** No production DDL/DML/migration/deployment/payment/
  entitlement/deletion occurred. QUAL-WEB-005 remains open for worker,
  authenticated E2E, legal/customer-held records, rollback, and independent
  acceptance evidence.

## 2026-10-07 · Preview environment preflight

- **Result:** Vercel Preview key values were neither `rzp_test_` nor
  `rzp_live_`, the database value was not a PostgreSQL URL, and the hosted
  method variable was absent.
- **Safety:** No Preview provider/database call and no configuration mutation
  occurred. Preview is not a valid payment-qualification target until its
  isolated test credentials/database are provisioned.

## 2026-10-07 · production read-only billing/migration audit

- **Environment:** Vercel production variable inventory lacks
  `RAZORPAY_ENABLED_PAYMENT_METHODS`; a temporary env pull was used without
  printing values and was removed after inspection.
- **Database:** One bounded read-only transaction found 42 tables and 26
  Drizzle migrations (latest `2026-10-06T13:10:00Z`). Aggregate counts:
  payments 0, subscriptions 0, deletion requests 0, webhook events 4,
  licenses 1, legacy mappings 3.
- **Boundary:** No contents/identifiers were selected and no production DDL,
  DML, migration, deployment, payment, entitlement, or deletion occurred.
  Current source migrations are not production-qualified/applied.

## 2026-10-07 · Razorpay method preflight

- **Provider:** Official SDK `payments.fetchPaymentMethods()` with the current
  test credential pair returned HTTP 401 `BAD_REQUEST_ERROR` / authentication
  failed, while read-only `/v1/orders` and `/v1/payments` calls with the same
  pair returned HTTP 200. The 401 is endpoint-specific; the provider method
  set remains unknown. All calls were read-only; no payment/provider mutation
  occurred.
- **Code:** PR #149 exact head payment suite passed **27/28**, with one
  explicit environment-gated ledger skip and zero failures. An explicit
  isolated catalog assertion exposed `upi`, `card`, `netbanking`, `wallet`,
  and `emi` as hosted methods.
- **Boundary:** Provider account methods are still unverified. No live-key
  fallback, production operation, database write, deployment, or checkbox
  change.

## 2026-10-07 · SCM and payment qualification batch

- **SCM:** Exact Web `origin/main` `6fccfb26ffb707e53c3ef44166b42280be29de55`
  passed the focused GitHub/App/SCM, delivery, credential, tenant, and
  negative-boundary suite **48/48**, with no skips.
- **Payment:** `.env.test.local` test credentials created one Razorpay test
  order for monthly Pro at INR 280,943 paise; status was `created`, with no
  capture, payment, refund, webhook, entitlement, or database write.
- **Boundary:** These results do not close GITHUB-WEB-001..004,
  PLAN-CLI-003, PLAN-WEB-013/014/015, or R-041. No backlog checkbox changed.

## 2026-10-07 · next independent batches

1. **PLAN-WEB-014/015:** obtain the account-enabled Razorpay test method list
   and run the isolated hosted lifecycle matrix; the single created order is
   not lifecycle acceptance.
2. **GITHUB-WEB-001..004:** perform an authorized live App installation and
   delivery/recovery qualification after R-041 rotation; code-side contracts
   are now requalified 48/48.
3. **QUAL-WEB-005:** obtain a fresh backup within the 48h RPO and qualify
   authenticated deletion plus deployment rollback; the existing snapshot is
   still approximately 396h old.

## 2026-10-07 · PLAN-WEB-013 hosted verification refresh

- **Run:** Web PR #149 exact head
  `db68157da039d8aab939818f9023f867028e4432`; Verify run `37563023349`, job
  `112604384062`, Node 22/pnpm 10.34.5.
- **Result:** Serial suite 872 total / 871 pass / 1 explicit skip / 0 fail;
  negative-boundary 2/2; truth-registry 25/25; 31 ordered migrations;
  typecheck, build, public-boundary, dependency/SBOM/license/secret checks
  passed.
- **Boundary:** Hosted code qualification is green, but provider account
  methods and test-mode payment lifecycle evidence are absent. No merge,
  deployment, provider, database, or production operation occurred.

## 2026-10-07 · production payment-surface truth recheck

- **Browser:** Read-only Chrome DevTools load of `/checkout` returned HTTP 200
  and no console messages. The current production UI still shows the INR
  2,809.43/month Pro offer, UPI-only copy, and `Show UPI QR code`.
- **Safety:** No button click, QR creation, order creation, payment, webhook,
  entitlement, or other mutation request occurred; no sensitive browser data
  was retained.
- **Boundary:** This confirms the active production deployment has not adopted
  PR #149. It is a truth/safety observation, not payment acceptance. The
  provider test-mode method matrix remains the next external payment batch.

## 2026-10-07 · QUAL-CLI-006 official in-toto artifact binding

- **Source:** CLI `origin/main` and disposable verifier worktree at exact
  `6bde945c60ac34351c02a70f6e7a2cb24f98ae1d`.
- **Verification:** Bounded `python:3.12-slim` container installed official
  `in-toto==3.0.0`; `scripts/verify-in-toto-release.py` passed for six public
  archives and exact SHA-256 products.
- **Boundary:** Ephemeral layout/functionary keys were used only for this
  artifact-binding check. No keyless Sigstore identity, legal approval,
  trusted npm publication, release tag, deployment, or production operation.
  QUAL-CLI-006 remains open.

## 2026-10-07 · PLAN-WEB-013 exact-head payment continuation

- **Source:** Web PR #149 exact head
  `db68157da039d8aab939818f9023f867028e4432`.
- **Verification:** Focused payment method/route/webhook tests **18/18**;
  typecheck passed; Drizzle schema check passed; ordered migration check
  verified **31** migrations; license inventory tests passed **3/3**.
- **Hosted state:** PR #149 is OPEN, non-draft, MERGEABLE, CLEAN; reported
  typecheck/schema, GitGuardian, Vercel, and Preview Comments checks are green.
- **Boundary:** No production/provider/database/deployment write occurred.
  The run proves code-side fail-closed/catalog/webhook contracts only; it does
  not close PLAN-WEB-013/014/015 or authorize merge.

## 2026-10-07 · next independent batches

1. **PLAN-WEB-014/015** — obtain the Razorpay account-enabled method list and
   complete the isolated test-mode lifecycle matrix; provider credentials and
   runtime evidence are still absent.
2. **QUAL-WEB-005** — obtain a fresh backup within the 48h RPO and qualify
   authenticated deletion plus deployment rollback; the current snapshot is
   approximately 396h old.
3. **GITHUB-WEB-001..004 / PLAN-CLI-003** — qualify an authorized GitHub App
   installation and immutable delivery identity after R-041 rotation; keep
   production cutover closed.

## 2026-10-07 · QUAL-CLI-006 artifact qualification continuation

- **Source:** CLI origin/main `6bde945c60ac34351c02a70f6e7a2cb24f98ae1d` in a
  disposable worktree.
- **Result:** Package-content audit passed; forced build/typecheck 16/16;
  all-platform optional dependency install; license inventory/notices; six
  public archives; packed-manifest audit; clean-consumer import/version/no-
  implicit-engine check; and `1.8.3 -> 2.0.0-alpha.1 -> 1.8.3` transition all
  passed.
- **Boundary:** Official in-toto verification was not completed because its
  cryptography dependency download was interrupted. No trusted publishing,
  legal, Sigstore, npm publication, or checkbox credit is claimed.

## 2026-10-07 · QUAL-WEB-006 organization browser continuation

- **Browser:** Authenticated MCP loaded `/orgs`; HTTP 200, empty organization
  state, and no console messages. Automated snapshot observations were desktop
  100/100/100 and mobile 100/100/80 for Accessibility/Best Practices/SEO.
- **Performance:** Cold trace LCP 5,169ms, TTFB 797ms, render delay 4,372ms,
  CLS 0, no CrUX data. This exposes a performance follow-up, not acceptance.
- **Boundary:** Free account/no organization means paid/org, human
  screen-reader, large-data, field-CWV, and customer evidence remain open. No
  mutation or checkbox change.

## 2026-10-07 · merged-phase acceptance story refresh

- **Exact sources:** CLI `6bde945c60ac34351c02a70f6e7a2cb24f98ae1d`; Web
  `6fccfb26ffb707e53c3ef44166b42280be29de55`.
- **Result:** Private harness exited 0: CLI 250/250, Web 888/888 with 28
  explicit environment skips, and composed Studio/Enterprise/Team/qualification
  substrates 74/74.
- **Boundary:** Substrate/regression evidence only. Hunt isolation,
  modified-CLI runtime, provider payment, customer/reviewer/browser-human,
  field-CWV, migration, and production acceptance remain open. No checkbox
  changed; backlog remains 218 checked / 62 unchecked / 280 total.

## 2026-10-07 · PLAN-CLI-003 authenticated boundary probe

- **Browser/API:** Authenticated same-origin read-only probes kept forged
  enterprise/studio plan requests at Free (`simulated=false`), returned zero
  organizations, denied forged usage/search with bounded 403 responses, and
  reported zero deletion requests. The expanded projects/members/evidence/
  policies/evaluations/releases/receipts/download matrix returned the same
  bounded 403 denial; the project-root path returned 405 because it exposes no
  GET operation.
- **Safety:** Only status codes and bounded safe projections were retained; no
  cookies, headers, response bodies, payment data, identity fields, or mutation
  requests were captured.
- **Acceptance boundary:** Licensed modified-CLI requests and public/private
  runtime coverage remain open. No checkbox changed.

## 2026-10-07 · QUAL-WEB-005 snapshot-backed deletion qualification

- **Fixture:** Existing local snapshot restored into disposable PostgreSQL 18;
  PR #153 migrations applied. Snapshot age is approximately 396h and therefore
  fails the 48h RPO requirement.
- **Verification:** Focused QUAL-WEB-005 set passed 44/44, covering deletion
  job integration, worker scope/hold/retry, inventory/dispositions, rollback
  savepoint/retry, DR threshold logic, privacy qualification, and accessibility
  qualification contracts.
- **Boundary:** This uses synthetic/temp-table fixtures and does not prove
  authenticated hosted deletion E2E, current backup cadence, deployment
  rollback, or production deletion. No checkbox changed; the disposable
  container was removed.

## 2026-10-07 · live critical-path queue refresh

1. **PLAN-WEB-014/015** — Web PR #149 at exact head
   `db68157da039d8aab939818f9023f867028e4432`; local code and snapshot-backed
   payment tests are green, but the Razorpay account-enabled test-mode method
   list and complete lifecycle matrix are unavailable.
2. **QUAL-WEB-005** — Web PR #153 at exact head
   `250313e86ae6b746e1137c9f4d5436b23a96c170`; restore/rollback code evidence
   is available, but fresh-backup RPO, authenticated deletion E2E, and
   deployment rollback evidence remain open.
3. **GITHUB-WEB-001..004 / PLAN-CLI-003** — continue against the existing Web
   and CLI substrate; live App installation/permission/delivery qualification
   and R-041 rotation are external blockers. No production cutover is claimed.

The merged CLI PR #75 and live Free-account directory probe are no longer
queued as pending implementation batches. No checkbox changed.

## 2026-10-07 · payment code-side qualification

- **Focused tests:** Web PR #149 payment/configuration set passed 44 tests,
  with 0 failures and 1 explicit unit-test skip. A snapshot-backed disposable
  database run passed both billing-ledger and webhook-claim integrations (2/2,
  0 failures, 0 skips).
- **Docker:** Docker Desktop Server 29.7.2 was reachable; a bounded disposable
  `postgres:15-alpine` container was cleaned up after use.
- **Harness:** An empty database correctly stopped at migration 0000 because
  the repository migration chain requires the reviewed legacy `licenses`
  baseline. Reusing the existing local snapshot supplied that baseline;
  migrations and both integrations then passed. No persistent or production
  database was changed.
- **Acceptance:** Code-side guards and lifecycle contracts are strengthened,
  but account-enabled Razorpay test-mode method/capture/failure/refund/renewal/
  replay/out-of-order evidence is still absent. PLAN-WEB-013/014/015 remain
  open; no checkbox changed.

## 2026-10-07 · QUAL-WEB-006 organization-directory reload

- **Browser:** Fresh reload of the authenticated `/orgs` page rendered the
  organization directory and its truthful empty state, “No organizations yet.”
  The earlier 404 was stale tab state, not current route evidence.
- **Deployment:** Read-only GitHub records show successful Production
  deployments for merged commits `c1bca533c0e617427e42fd1be3c449b0ed458311`
  and `6fccfb26ffb707e53c3ef44166b42280be29de55`.
- **Boundary:** The session remains Free with no organization. This strengthens
  the authenticated directory probe but does not qualify paid/org runtime,
  human screen-reader, large-data, or field-CWV behavior; no checkbox changed.

## 2026-10-07 · CLI PR #75 hosted qualification and merge

- **Hosted:** All 11 checks passed across Ubuntu, macOS, and Windows Node
  20/22/24, Verglos self-scan, and in-toto release binding. The PR was
  mergeable and non-draft with no required branch-protection review.
- **Mutation:** PR #75 merged by squash as
  `6bde945c60ac34351c02a70f6e7a2cb24f98ae1d` from exact head
  `c4beecb3525256cd2956660af8e3e6b49292b65f`.
- **Acceptance boundary:** This merges the packaging correction only;
  HUNT-008/HUNT-009/QUAL-CLI-004 remain open for provenance, isolation,
  independent review, and functional acceptance. No backlog checkbox changed.

## 2026-10-07 · QUAL-WEB-006 authenticated account browser probe

- **Runtime:** Approved Chrome DevTools page 13 authenticated on `/account`;
  no sensitive headers, cookies, credentials, or response bodies captured.
- **Observed:** Accessibility/Best Practices/SEO 100 on desktop and mobile
  Lighthouse snapshots; Tab focus reached Overview; console clean; account
  navigation 200/304; LCP 1,111ms; CLS 0.00; no CrUX field data.
- **Limitations:** Current account is Free and has no organization. Paid/org,
  human screen-reader, large-dataset, and field-CWV qualification remain open.
  No entitlement/payment/database/deployment change or checkbox change.

## 2026-10-07 · Hunt public/private runtime boundary

- **Code:** CLI `c4beecb` removes the public `@verglos/hunt` workspace
  dependency and introduces a validated dynamic runtime protocol. Missing or
  malformed private runtime remains exit 78; test-only injection preserves
  local execution coverage.
- **Local:** Hunt build, CLI typecheck, full configured CLI package suite,
  focused Hunt/runtime 6/6, public archive/license/surface 17/17, six-archive
  pack, packed-manifest audit, clean consumer, package-content audit,
  public-boundary audit, and diff hygiene pass.
- **Hosted:** PR #75 exact head `c4beecb3525256cd2956660af8e3e6b49292b65f`
  is OPEN/UNSTABLE with 11 checks pending at capture; review is undecided.
- **Acceptance:** HUNT-008/HUNT-009/QUAL-CLI-004 remain open for trusted
  provenance, isolation, independent review, and functional acceptance. No
  production or provider operation; no checkbox change.

## 2026-10-07 · restore/recovery harness qualification

- **Code:** Web PR #153 head `250313e` hardens host-port readiness, bounded
  `psql` restore diagnostics, and reconciliation manifest parsing.
- **Rehearsal:** Disposable Postgres restore from the existing local snapshot;
  35 migrations, two writer passes, reconciler, and fail-closed stopped-DB
  simulation all passed. RTO: 3.09s; reconciliation: `reconciled`.
- **Gate:** Snapshot age is approximately 396h, so the 48h critical RPO gate
  failed. This does not certify current backup cadence, production restore,
  deployment rollback, or deletion E2E. No checkbox or production state changed.
- **Evidence:** `docs/shipping/evidence/qual-web-005-restore-harness-250313e-2026-10-07.md`.

## 2026-10-07 · QUAL-WEB-005 rollback/retry qualification

- **Code:** Web PR #153 head `2127924e418fdca4094fa88bab02656952f4488b`
  adds a PostgreSQL savepoint failure-injection test for supporting deletion.
- **Evidence:** The failed transaction leaves earlier deletes and operation
  receipts absent; the recovered retry completes with the same fence and
  idempotency key. Integration 1/1, serial Web 868/1/0, typecheck/build/schema/
  35-migration/diff checks pass.
- **Hosted:** Verify `37567278851`, Vercel, GitGuardian, and Preview Comments
  pass; PR #153 is open and CLEAN.
- **Acceptance:** This is transaction rollback/retry evidence only. Production
  backup restore, deployment rollback, authenticated non-production E2E, and
  QUAL-WEB-005 acceptance remain open. No production operation or checkbox
  change.
- **Evidence:**
  `docs/shipping/evidence/qual-web-005-rollback-retry-2127924-2026-10-07.md`.

## 2026-10-07 · QUAL-WEB-005 supporting disposition executor

- **Code:** Web PR #153 exact head
  `eb785d2e382fc60535c15702fe7ffd8b9ae66610` adds fenced execution for the
  sixteen-table supporting disposition registry and durable per-table receipts.
- **Safety:** Retention-required rows are not mutated. Channel credentials are
  checked first and block before dependent alert/monitor deletes when approval
  is required. Replays use the same request/table idempotency keys.
- **Local:** Worker 4/4; disposable PostgreSQL integration 1/1; serial Web
  suite 868 pass / 1 explicit skip / 0 fail; typecheck, 38-route build,
  schema, 35-migration, and diff checks pass. The disposable fixture was
  removed after testing.
- **Hosted:** Verify `37566730804` passed at the exact head; Vercel,
  GitGuardian, and Preview Comments passed. PR #153 is open and CLEAN.
- **Acceptance:** QUAL-WEB-005 remains open for retained-row reconciliation,
  restore/rollback rehearsal, authenticated non-production E2E, and hosted
  completion. No production operation or checkbox change.
- **Evidence:**
  `docs/shipping/evidence/qual-web-005-supporting-executor-eb785d2-2026-10-07.md`.

## 2026-10-07 · QUAL-WEB-005 supporting inventory snapshot

- **Code:** Web PR #153 exact head `37c8a07ef2c1d4f914c0ace03864d60fb2649a82`
  adds the versioned read-only sixteen-table supporting inventory and
  disposition qualification while retaining `supportingInventoryComplete=false`.
- **Local:** Focused 9/9; disposable PostgreSQL integration 1/1; serialized
  Web suite 846 pass / 23 explicit skips / 0 fail / 869 total; typecheck,
  production build (38 routes), Drizzle check, ordered 34-migration check,
  and diff hygiene pass.
- **Hosted:** Verify `37564973546` success; PR #153 is CLEAN/open.
- **Boundary:** Executable supporting deletes, operation receipts, retained-row
  reconciliation, restore/rollback rehearsal, and authenticated E2E remain
  open. No production operation occurred.
- **Evidence:**
  `docs/shipping/evidence/qual-web-005-supporting-snapshot-pr153-2026-10-07.md`.

## 2026-10-07 · HUNT-009 public-boundary requalification blocked

- **Candidate:** CLI PR #74, exact tested head
  `a2a1335d2a0b69ec56391286a4ba77ef773c0457`; closed without merge.
- **Local:** Focused HUNT-009 tests 3/3; `pnpm build`, `pnpm typecheck`, full
  `pnpm test` (13/13 repository tasks), and diff checks passed.
- **Hosted:** Platform matrix `37565750571` and self-scan `37565750527` failed
  closed at public archive qualification with
  `workspace dependency @verglos/hunt has no known package version`.
- **Boundary:** `@verglos/hunt` is private/alpha and intentionally absent from
  the six-package public release. No packer weakening, implicit archive, or
  public dependency bypass is acceptable. HUNT-009 remains unchecked.
- **Evidence:**
  `docs/shipping/evidence/hunt-009-public-boundary-requalification-2026-10-07.md`.

## 2026-10-07 · PLAN-WEB-013 hosted payment route hardening

- **Code:** Web PR #149 exact head `0a765c9` adds same-origin checks before
  authentication, database lookup, or Razorpay side effects for hosted order
  and optional QR creation.
- **Local:** Focused payment/catalog/checkout/webhook/runtime/route tests
  40/40; typecheck passed; Drizzle check passed; ordered migration check
  verified 31 migrations; preview-semantics production build passed.
- **Hosted:** Verify run `37556130789`, Vercel, GitGuardian, and Preview
  Comments passed. PR #149 remains open, CLEAN, and unmerged.
- **Acceptance:** Code-side hardening only. Provider method capability and
  test-mode lifecycle evidence remain open, so PLAN-WEB-013/014/015 are not
  checked. No provider/payment/database/migration/deployment/credential write
  occurred.
- **Evidence:**
  `docs/shipping/evidence/plan-web-013-payment-route-csrf-2026-10-07.md`.

## 2026-10-07 · QUAL-WEB-006 authenticated account accessibility/performance follow-up

- **Browser:** Chrome 154 DevTools MCP page 13, existing authenticated
  `/account` tab, read-only reload; no cookies, auth headers, private bodies,
  payment data, or personal identifiers retained.
- **Result:** Accessibility snapshot showed one `main` and one `nav`, seven
  links, no unlabeled controls/tables, and no console errors/warnings. Lab
  trace reported LCP 819 ms, TTFB 80 ms, render delay 740 ms, CLS 0.00, with no
  field data. Mobile and desktop Lighthouse accessibility and best-practices
  scores were both 100.
- **Boundary:** The account is still the Free-plan shell and has no
  organization route. Pro/org, human screen-reader, large-data browser, and
  field-CWV acceptance remain open; no checkbox changed. No production,
  provider, payment, database, migration, deployment, or credential operation
  occurred.
- **Evidence:**
  `docs/shipping/evidence/qual-web-006-authenticated-account-performance-2026-10-07.md`.

## 2026-10-07 · QUAL-WEB-006 large-data and serialized-CI merge

- **Hosted:** Web PR #150 passed Verify `37552936102` plus Vercel,
  GitGuardian, and Preview Comments.
- **Merge:** PR #150 merged to Web `main` as
  `a64407d9e7b81ba4db8c52a96d1237da693cb910`.
- **Boundary:** The merge contains the synthetic large-data monitoring
  qualification and serialized shared-PostgreSQL CI path only. Paid/org
  browser, human screen-reader, and field-CWV acceptance remain open;
  QUAL-WEB-006 is not checked. No deployment or production/provider/payment/
  database/credential operation occurred.
- **Evidence:**
  `docs/shipping/evidence/qual-web-006-large-data-2026-10-07.md`.

## 2026-10-07 · CLI license-source metadata hosted qualification and merge

- **Hosted:** PR #73 tested head `d34ac4f` passed Ubuntu/macOS/Windows Node
  20/22/24, self-scan `37554811352`, and in-toto binding in `37554811372`.
- **Merge:** GitHub merged PR #73 to CLI `origin/main` as
  `d63bf7a07c4dc421096b44593cd996aef40320d2`.
- **Gate:** Inventory output retains seven review blockers; the exact
  source-missing classification is repaired, but legal review and
  `--require-clear` remain open. Backlog remains 218 checked / 62 unchecked /
  280 total.
- **Boundary:** No npm publication, tag, production/provider/database/payment
  write, deployment, or credential operation occurred.
- **Evidence:**
  `docs/shipping/evidence/qual-cli-license-source-metadata-2026-10-07.md`.

## 2026-10-07 · CLI license-source metadata follow-up

- **Implementation:** CLI PR #73 / commit `d34ac4f` adds an exact-version,
  HTTPS-only provenance override for `minipass-pipeline@1.2.4`.
- **Verification:** Inventory/SBOM tests 6/6, `pnpm test` 12/12 workspace
  tasks, and `pnpm typecheck` 13/13 tasks passed. Inventory output contains
  254 lockfile package versions, one nested component, and seven unresolved
  review blockers; `--require-clear` remains intentionally non-zero.
- **Acceptance:** This is mechanical provenance evidence only. It does not
  clear legal review, authorize publication, or change any backlog checkbox.
  Backlog remains 218 checked / 62 unchecked / 280 total.
- **Hosted/boundary:** PR #73 is pushed and open/mergeable with checks queued.
  No merge, npm publication, provider/payment/database/deployment operation,
  production write, or credential write occurred. An npm auth token emitted by
  a local diagnostic was not recorded or reused and must be rotated.
- **Evidence:**
  `docs/shipping/evidence/qual-cli-license-source-metadata-2026-10-07.md`.

## 2026-10-07 · CLI release-candidate source follow-up

- After rebuilding source, CLI `pnpm test` completed 12/12 workspace tasks and
  `pnpm typecheck` completed 13/13 tasks, with no failed task.
- This is additional source qualification only; the eight legal/provenance
  blockers remain and backlog stays 218 checked / 62 unchecked / 280 total.
- No npm publication, tag, deployment, production, or credential operation
  occurred.

## 2026-10-07 · CLI release-artifact qualification

- **Build:** CLI commit `ad6ee14` rebuilt successfully across all eight
  workspace packages.
- **Artifacts:** Exactly six public npm archives passed packed-manifest audit;
  the isolated clean consumer installed/imported all six, executed
  `Verglos 2.0.0-alpha.1`, and confirmed no implicit engine installation.
- **Assembly:** Six archives plus notices, CycloneDX, SPDX, inventory,
  clean-consumer evidence, and checksums assembled in a temporary directory;
  12 files total and checksum generation succeeded.
- **Gate result:** The final verifier stops on the eight known redistribution
  blockers (nested benchmark conflict, six BlueOak reviews, and missing
  minipass-pipeline source). No blocker was suppressed. Backlog remains 218
  checked / 62 unchecked / 280 total.
- **Boundary:** Mechanical release qualification only; LIC/DIST gates and
  publication remain open. No npm publish, tag, deployment, production, or
credential operation occurred.

- **Evidence:** `docs/shipping/evidence/qual-cli-release-artifacts-2026-10-07.md`.

## 2026-10-07 · Razorpay Test Mode read-only method probe

- **Request:** Read-only `GET /v1/payments?count=100` using a local
  `rzp_test_` credential; no secret values are recorded.
- **Result:** One returned payment, method `netbanking`, status `captured`, and
  no failed payment in the returned page.
- **Acceptance:** This is not an account capability list or PLAN-WEB-014
  lifecycle evidence. Cards/UPI/wallets, refund/renewal, replay, and ordering
  remain unqualified; backlog remains 218 checked / 62 unchecked / 280 total.
- **Credential boundary:** The local env line is shell-unsafe and must be
  repaired/rotated before any further provider calls. No file was changed.
- **Safety:** No provider write, payment/refund/subscription/webhook,
  production DB, deployment, migration, or credential operation occurred.
- **Evidence:** `docs/shipping/evidence/razorpay-test-readonly-method-probe-2026-10-07.md`.

## 2026-10-07 · Production checkout read-only verification

- **Browser:** Chrome 154 DevTools Protocol reloaded the live checkout only;
  no button was clicked and no provider request was initiated.
- **Result:** HTTP 200; the rendered controls were `Monthly`, `Annual · save
  17%`, and `Show UPI QR code`. No hosted card, UPI intent, netbanking, or
  wallet selector appeared. Observed same-origin document/static resources were
  HTTP 200.
- **Acceptance:** Production remains on the pre-PR-149 QR-only surface. This
  does not qualify provider methods or lifecycle/reconciliation gates;
  PLAN-WEB-013/014/015 remain unchecked. Backlog remains 218 checked / 62
  unchecked / 280 total.
- **Boundary:** No payment, provider, account, production DB, migration,
  deployment, or credential operation occurred.
- **Evidence:** `docs/shipping/evidence/qual-web-production-checkout-readonly-2026-10-07.md`.

## 2026-10-07 · QUAL-WEB-006 production account browser smoke

- **Browser:** Chrome 154 via the existing local DevTools Protocol endpoint;
  read-only reload of the authenticated `/account` tab.
- **Result:** `/account` and observed same-origin document/static resources all
  returned HTTP 200. The DOM contained one main and one nav landmark, seven
  links, no unlabeled controls, no tables, and no visible error copy. The
  rendered state was the Free-plan Pro fence.
- **Acceptance:** This is a smoke result for the available Free shell only.
  It does not qualify paid organization/dashboard, large-data, human
  screen-reader, or field-CWV evidence; QUAL-WEB-006 remains open. Backlog
  remains 218 checked / 62 unchecked / 280 total.
- **Boundary:** No checkout/provider call, account mutation, production DB
  write, deployment, migration, or credential operation occurred.
- **Evidence:** `docs/shipping/evidence/qual-web-account-browser-smoke-2026-10-07.md`.

## 2026-10-07 · PLAN-WEB-013 hosted verification follow-up

- **Code:** Web PR #149 head `550dba0` adds the missing hosted-method entry to
  the complete production runtime-config fixture after production validation
  was made fail closed for QR-only configuration.
- **Verification:** Hosted Verify run `37553696161` is green across Node 22
  typecheck, full tests, negative-boundary/truth-registry, DB/schema and
  migration checks, build, public-boundary, dependency/SBOM/license, and
  tracked-secret checks. Local focused payment/runtime/route-contract tests
  pass 33/33 and typecheck passes.
- **Acceptance:** This is code/CI evidence only. PLAN-WEB-013/014/015 remain
  unchecked pending provider-account method and lifecycle evidence. Backlog
  remains 218 checked / 62 unchecked / 280 total.
- **Boundary:** PR remains open and unmerged. No Razorpay account read or
  configuration change, payment/refund/renewal, production database,
  migration, deployment, or credential operation occurred.

# 2026-10-07 — PLAN-WEB-013 webhook method binding

- **Implementation:** Web PR #149 commit `3f4a7aa` requires new hosted order
  capture/failure webhooks to report a payment method contained in the signed
  server-enabled hosted-method set; QR, subscription, and legacy orders remain
  compatible.
- **Verification:** Focused checkout/webhook/payload tests **15/15 pass**;
  Web typecheck and 40-page production build pass.
- **Limitation:** PLAN-WEB-013/014/015 remain open for provider lifecycle,
  all-enabled-method, deployment, and reconciliation evidence. No checkbox
  changed.
- **Backlog:** **218 checked / 62 unchecked / 280 total (77.9%)**.
- **Boundary:** No browser, provider, payment, production, database,
  migration, deployment, or credential operation occurred.
- **Evidence:** `docs/shipping/evidence/qual-web-plan-013-hosted-2026-10-07.md`.

## 2026-10-07 · Web hosted serial qualification CI

- **Code:** Web PR #150 head `a78578e` changes only Verify workflow test
  execution from parallel `pnpm test` to existing `pnpm test:serial`; the
  developer script remains unchanged.
- **Hosted:** Verify run `37552936102` passes typecheck, serialized pretest and
  configured tests, boundary/truth checks, schema/migrations, build,
  public-boundary, dependency/SBOM/license, and tracked-secret checks. Vercel,
  GitGuardian, and Preview Comments pass. PR is open/mergeable.
- **Acceptance:** This is CI reliability evidence only. No backlog checkbox or
  release gate changed; backlog remains 218 checked / 62 unchecked / 280 total.
- **Boundary:** No merge, deployment, production/database/provider/payment/
  migration/credential/customer operation occurred.
- **Evidence:** `docs/shipping/evidence/qual-web-ci-serial-2026-10-07.md`.

## 2026-10-07 · Web serial PostgreSQL qualification

- **Repository:** Web `main` `cbc0f5a89179995569308695419d4578c57ce716`; no
  source change.
- **Verification:** Existing `pnpm test:serial` with a fresh temporary Docker
  PostgreSQL database passed pretest 48/48 and the configured suite 867/867
  with one intentional billing-ledger skip. A separately migrated synthetic
  legacy baseline applied all current migrations and billing integration passed
  1/1.
- **Resolution:** The previously observed queue/worker failures do not
  reproduce under the serialized qualification path. Parallel shared-database
  execution remains unsuitable evidence and is not credited.
- **Acceptance:** No backlog checkbox or release gate changed. Backlog remains
  218 checked / 62 unchecked / 280 total.
- **Boundary:** Temporary Docker databases only; no production/database/provider/
  payment/deployment/migration/credential/customer operation occurred.
- **Evidence:**
  `docs/shipping/evidence/qual-web-serial-postgres-suite-2026-10-07.md`.

## 2026-10-07 · Web PostgreSQL suite isolation qualification

- **Aggregate:** The full Web PostgreSQL-backed `pnpm test` run used a fresh
  Docker `postgres:18-alpine` database on port `55439` and stalled with two
  idle integration workers after more than three minutes. It was terminated;
  no aggregate pass is claimed.
- **Isolation:** Queue provider plus worker-crash integration passed 7/7 when
  isolated. Threshold-outbox passed 1/1 alone, and usage-ledger passed 1/1
  alone. The two usage files together reproduce a shared-database
  `create extension if not exists pgcrypto` unique-index race (`23505`) and
  worker hang; this is recorded as an open test-harness limitation.
- **Acceptance:** No backlog checkbox or release gate changed. Backlog remains
  218 checked / 62 unchecked / 280 total. Full configured Web qualification is
  still open.
- **Boundary:** All databases were temporary synthetic Docker databases. No
  production/database/provider/payment/deployment/migration/credential or
  customer operation occurred.
- **Evidence:**
  `docs/shipping/evidence/qual-web-db-suite-isolation-2026-10-07.md`.

## 2026-10-07 · ACCEPT-002/003 latest-source substrate refresh

- **Sources:** Private verifier ran explicitly against unreleased CLI `ad6ee14`
  and Web `cbc0f5a`; no temporary fallback worktree was used.
- **Results:** CLI configured package suite 241/241; Web 888/916 with 28
  environment-gated skips and 0 failures; composed substrates 74/74. All
  commands exited 0 and hashes are in the private JSON evidence.
- **Controls:** `acceptance:protocol:check` and
  `acceptance:study-protocols:check` pass. External contact, participants,
  Hunt adjudication, and customer acceptance remain open; final corpus
  verification was intentionally deferred until release-candidate freeze.
- **Audit note:** An earlier compatibility-root run at `b070942` enumerated 34
  tests and is excluded from latest-source acceptance evidence.
- **Acceptance:** ACCEPT-002/003 remain unchecked for complete external,
  hosted, provider, customer, reviewer, and missing story evidence. Backlog
  remains 218 checked / 62 unchecked / 280 total.
- **Boundary:** No production/database/provider/payment/deployment/migration
  operation ran; no public repository or marketing surface changed.
- **Evidence:**
  `docs/shipping/evidence/acceptance-stories-verification-2026-10-07.md` and
  `docs/shipping/evidence/acceptance-stories-verification-2026-10-03.json`.

## 2026-10-07 · QUAL-WEB-005 privacy/deletion/retention qualification

- **Code:** Web `main` `cbc0f5a`; no source change or PR was needed for this
  bounded verification batch.
- **Integration/security:** Temporary `postgres:18-alpine` with isolated
  `verglos_test` ran the focused privacy/deletion/retention and records suite:
  46 passed, 0 failed, 0 skipped. It covered account-deletion scope and
  active-hold refusal, legal/contract/deletion retention, persisted hosted
  record integrity, bounded export cursors, and cross-tenant exclusion.
- **Limitations:** Node 26.4.0 was used locally against the package Node
  22.x baseline. Hosted deletion-worker, legal/customer-held-record,
  consent/vendor, backup/log, and production deletion evidence were not run.
- **Acceptance:** QUAL-WEB-005 remains unchecked. Backlog remains 218 checked /
  62 unchecked / 280 total.
- **Boundary:** No production database/provider/payment read or write,
  migration, deletion, deployment, credential use, or customer operation
  occurred. The temporary container was stopped after the run.
- **Evidence:**
  `docs/shipping/evidence/qual-web-005-privacy-retention-2026-10-07.md`.

### Live queue after this batch

1. QUAL-WEB-006 organization/Pro browser, human screen-reader, and field-CWV
   evidence — current authenticated Chrome state is a Free account shell with
   no organization route; PR #150 large-data evidence is green and merged as
   `a64407d`.
2. PLAN-WEB-014 Razorpay test-mode method/lifecycle matrix — provider enabled
   methods and sandbox credentials are not verified; no payment operation ran.
3. GITHUB-WEB-004 / PLAN-CLI-003 authorized hosted qualification — external
   provider/authenticated state and R-041 credential rotation remain open.

## 2026-10-07 · QUAL-WEB-006 large-data qualification PR #150

- **Code:** Web isolated branch `qual/web-006-large-data`, commit `70680f8`,
  PR #150. The change is limited to the monitoring repository integration
  fixture and assertions; no production source, migration, or public surface
  changed.
- **Integration/security:** Temporary Docker `postgres:18-alpine` with the
  isolated `verglos_test` database passed the monitoring integration 1/1. The
  dashboard suite passed 4/4 and tenant/security checks passed 18/18. The
  fixture proves 45 same-tenant rows paginate 20/20/5, 125 detail matches are
  bounded to 100 with truncation truth, and a foreign component is excluded.
- **Checks:** TypeScript, `pnpm build`, `pnpm db:check`,
  `pnpm db:migrations:check` (29 migrations), and `git diff --check` passed.
  Node 26.4.0 was used locally against the package Node 22.x baseline.
- **Hosted state:** PR #150 is pushed/open/mergeable. Run `37551537264` passed
  in 2m38s with the full Verify job; GitGuardian, Vercel, and Preview Comments
  passed and GitHub reports `CLEAN`. No merge or deployment occurred.
- **Acceptance:** QUAL-WEB-006 remains unchecked for organization/Pro browser
  rendering, human screen-reader review, field CWV, and complete runtime
  evidence. Backlog remains 218 checked / 62 unchecked / 280 total.
- **Boundary:** No production database/provider/payment read or write,
  migration, deployment, credential use, or customer operation occurred.
- **Evidence:**
  `docs/shipping/evidence/qual-web-006-large-data-2026-10-07.md`.

## 2026-10-07 · QUAL-WEB-006 authenticated dashboard continuation

- **Runtime:** Authenticated Chrome DevTools reached `/account/dashboard`,
  which redirected to the current `/account` shell. The page had no console
  errors, preserved private navigation, and retained the previously recorded
  desktop/mobile no-overflow and keyboard evidence.
- **Accessibility/performance:** Lighthouse snapshot scored 100 Accessibility,
  100 Best Practices, and 100 SEO on both desktop and mobile. Agentic Browsing
  was 50 due only to the `llms.txt` audit; the public endpoint itself returns a
  valid H1. The fresh desktop trace recorded LCP 689 ms, CLS 0.00, and TTFB
  110 ms; CrUX has no field data for this page.
- **Checkout boundary:** Local PR #149 development execution without runtime
  secrets displayed the fail-closed checkout state and emitted no payment
  request. Production remains the pre-PR QR-only runtime; one transient
  `ERR_NETWORK_CHANGED` was observed during its existing polling. No payment,
  database/provider, deployment, migration, or production write occurred.
- **Acceptance:** QUAL-WEB-006 remains unchecked. Organization/Pro and
  large-dataset rendering, human screen-reader review, and field-CWV evidence
  remain open. Backlog remains 218 checked / 62 unchecked / 280 total.
- **Evidence:** `docs/shipping/evidence/qual-web-006-dashboard-runtime-2026-10-07.md`.

## 2026-10-07 · PLAN-CLI-004 compatibility PR #72 merge observation

- **Code:** CLI exact head `059918cf920d136ded4528ad7512b82026459ece` merged
  through PR #72 as `c1f1cd77468c28e85371b59fad297847ca5c5050`.
- **Verification:** Previously recorded branch full tests, focused
  compatibility tests, typecheck, and build pass. No new hosted result is
  claimed from the PR creation step.
- **Hosted state:** platform run `37550255842` (in-toto plus all Ubuntu/macOS/
  Windows Node 20/22/24 cells) and self-scan `37550255844` are terminal green.
  GitHub reported PR #72 `CLEAN` and mergeable before merge.
  Deployed signer/catalog alignment, supported-version migration, hosted
  activation, and R-041 rotation remain open.
- **Boundary:** No production signer, entitlement activation, database,
  deployment, publish, release, or customer operation occurred. R-041 remains
  open.

## 2026-10-07 · PLAN-WEB-013 hosted Razorpay checkout code-side batch

- **Code:** Web PR #149, commit `eb7e55a`, on
  `feat/web-plan-013-hosted-checkout`. Hosted Razorpay order creation and
  read-only status routes replace the QR-only customer path; signed order
  snapshots, webhook capture/failure handling, order-success uniqueness, and
  explicit QR opt-in are implemented.
- **Verification:** Focused 19/19; configured Web 850/872 passed, 22
  environment-gated skips, 0 failures; typecheck/build/Drizzle/31-migration
  ordering/diff checks pass. Docker 29.7.2 and Chrome DevTools are reachable.
  Node 26.4.0 was used locally; Node 22 hosted evidence is still required.
- **Hosted state:** GitGuardian, `typecheck-and-schema`, Vercel, and Vercel
  Preview Comments pass; GitHub reports PR merge state `CLEAN`. The PR remains
  open and no merge was performed.
- **Boundary:** No Razorpay account read, sandbox payment, refund, renewal,
  replay, provider configuration, production database/provider/payment write,
  migration, deployment, or price change occurred. R-041 remains open.
- **Acceptance:** PLAN-WEB-013/014/015 remain unchecked because code-side
  tests do not substitute for account-enabled test-mode lifecycle evidence.
  Evidence: `docs/shipping/evidence/plan-web-013-hosted-checkout-2026-10-07.md`.

## Next three independent batches after PLAN-WEB-013

1. PLAN-WEB-014 isolated Razorpay test-mode method/lifecycle matrix — waiting
   on explicit provider test-account capability and PR #149 hosted checks.
2. PLAN-CLI-004 compatibility PR/hosted verification — CLI branch `059918c`,
   independent of provider payment state.
3. QUAL-WEB-006 browser accessibility/performance and remaining large-data/
   field-CWV evidence — authenticated Chrome available; human/field evidence
   remains open.

## 2026-10-06 · QUAL-CLI-006 / DIST-001 / DIST-003 release-artifact qualification

- **Code:** Merged CLI `dacd286`; no public source change was needed. The
  isolated worktree used a temporary all-supported-architectures pnpm overlay
  only to install every lockfile optional-package manifest for legal inventory.
- **Verification:** `pnpm build` 8/8; release-script tests 20/20; package
  contents 6/6; packed manifests 6/6; public boundary; exact prerelease tag;
  clean consumer; and upgrade/rollback all pass. Hosted in-toto remains green
  in run `37497389053`; local official `in-toto-verify` was unavailable.
- **Gate:** strict release verification correctly fails on eight unresolved
  redistribution blockers: six BlueOak-1.0.0 packages, nested
  `benchmark@1.0.0` under `fast-uri@3.1.7`, and source-missing
  `minipass-pipeline@1.2.4`. QUAL-CLI-006 and DIST-001/003 remain unchecked.
  No publication, tag, deployment, production access, or customer operation
  occurred; R-041 remains open.
- **Evidence:** `docs/shipping/evidence/qual-cli-006-dist-release-artifacts-2026-10-06.md`.

## 2026-10-06 · PLAN-CLI-001/004 opaque catalog and cache qualification

- **Code:** CLI commits `937705b`, `fa4a131`, and `714cb3e`, PR #71 merged as
  `dacd286`, preserve server-owned
  `catalog_version`, validates its bounded wire shape, and binds stale cache
  reuse to the requested founder simulation. The fixtures remain opaque and
  server-shaped; no client-side paid capability map was added.
- **Verification:** CLI package runner completed all discovered tests with zero
  failures, including entitlement JWT/offline/license API coverage; CLI
  typecheck, build, and `git diff --check` pass locally. Hosted run
  `37497389053` passes self-scan, in-toto, and all nine platform cells. Earlier
  Windows-only cleanup failures in runs `37495019334` and `37496188177` were
  fixed before this final green run.
- **Boundary:** PLAN-CLI-001/004 remain unchecked. No production signer,
  tenant mapping, v2 issuance, database read/write, deployment, provider,
  customer, publish, or release operation occurred. R-041 remains open.

## Next three independent batches · queue after release-artifact qualification

1. **PLAN-CLI-004 supported-version compatibility fixtures** — deps: Web
   PLAN-WEB-002/003 contract and merged CLI `dacd286`. Repos:
   `verglos-cli` plus read-only Web contract inspection; implementation boundary
   is frozen v1/v2 token, catalog-version, malformed-payload, and old-client
   migration fixtures. Evidence: CLI hosted matrix/self-scan/in-toto green and
   release code-side tests green. Blocker: deployed signer, tenant mapping, and
   live activation integration; R-041 prohibits production access. No write.

2. **QUAL-WEB-006 authenticated dashboard accessibility/performance** — deps:
   current Web dashboard routes and existing production Lighthouse snapshots.
   Repo: `verglos-web` `main` at `cbc0f5a`; implementation boundary is
   read-only browser/runtime evidence for keyboard, screen reader, responsive,
   large-data, and field-CWV behavior, with code fixes only for reproducible
   defects. Blockers are human screen-reader, large-dataset, and complete
   field-CWV runs. No deploy or production data change.

3. **DIST-001/003 legal and protected-release closure** — deps: the generated
   six archives and sidecars from this qualification plus legal review of the
   eight listed inventory blockers. Repo: private shipping ledger and CLI
   release workflow; implementation boundary is review/rerun only, with no
   source bypass of the strict verifier. Evidence required: zero-blocker
   inventory, strict verifier, protected trusted publishing/keyless identity,
   and official in-toto/Sigstore release binding. Blockers: legal decision and
   protected release authority; R-041 still forbids production access.

## 2026-10-06 · TEAM-CLI-001 hosted policy authority substrate

- **Code:** Web PR #148 merged as `cbc0f5a`. Migration `0028` adds an explicit
  nullable SCM installation → project foreign key; GitHub installation admission
  validates same-organization active projects; the new policy route requires an
  active mapped license owner, exact GitHub repository binding, and published
  canonical policy before signing a CLI-compatible envelope.
- **Verification:** Focused policy/SCM/tenant contracts 23/23; full Web
  868/846/22/0; typecheck/build/Drizzle/29-migration ordering; hosted run
  `37493818464` typecheck/schema, Vercel, GitGuardian, and Preview Comments.
- **Boundary:** Code-side substrate only. The dedicated signer remains unset;
  no production migration, row inventory/rewrite, hosted fetch, or customer/
  provider operation occurred. TEAM-CLI-001/PLAN-CLI-001 remain unchecked and
  R-041 still blocks production access.

## 2026-10-06 · PLAN-CLI-003 authenticated request-matrix progress

- **Code:** Web PR #147 merged as `7248919`; usage reconciliation now rejects
  forged tenant/plan/capability/usage/record query fields before ledger access,
  and hosted receipt ingestion rejects the same authority fields plus forged
  allowance/project identity before persistence. Existing v2 entitlement tests
  retain server-derived license, tenant, role, and catalog binding.
- **Verification:** Local Web 865 total / 843 passed / 22 explicit skips / 0
  failures; disposable PostgreSQL receipt integration 1/1; typecheck/build;
  hosted run `37492088157` typecheck/schema, Vercel, GitGuardian, and Preview
  Comments.
- **Boundary:** PLAN-CLI-003 remains unchecked. This is code-side evidence only;
  authenticated production request probing and the remaining list/search/export/
  public-private runtime evidence are still required. No production/provider/
  customer operation occurred.

## 2026-10-06 · HUNT-009 public/private boundary review

- **Decision:** Do not accept or publish the functional Hunt command attempt.
  A public `verglos` package dependency on private `@verglos/hunt` is rejected
  by `scripts/pack-public-packages.mjs`; the attempted wiring was removed before
  commit.
- **Verification:** CLI typecheck, full CLI package tests, build,
  `scripts/check-public-boundary.mjs`, and `git diff --check` passed. Public
  packing was not credited because the local pnpm license command failed with
  `ERR_PNPM_MISSING_PACKAGE_INDEX_FILE` for `turbo@2.10.6`.
- **Boundary:** The alpha `verglos hunt` shell remains exit-78 for entitled
  users. HUNT-008/009/010/011 and QUAL-CLI-004 remain open pending the private
  runtime packaging decision, trusted/licensed recipe provenance, adversarial
  qualification, and independent review. Backlog remains 218/62/280; no
  production, provider, customer, deployment, publish, or release action ran.

## 2026-10-06 · GitHub App identity contract substrate

- **Code:** Web PR #144, branch `feat/github-app-org-contract`, commits
  `afb48dc`/`a496608`, merged to `main` as `1b2a623`.
- **Behavior:** Immutable GitHub account/installation/repository identity,
  bounded multi-repository admission, least-privilege permissions, App JWT and
  token-request helpers, token-expiry validation, lifecycle state handling,
  delivery-ID replay binding, and redacted tenant-scoped webhook/check data.
- **Verification:** 862 total / 840 passed / 22 explicit environment-gated
  skips / 0 failures; focused GitHub/SCM tests 16/16; typecheck, build, schema,
  27-migration ordering, public-boundary, SBOM, license, negative-boundary, and
  diff checks passed. Hosted run `37486358263` passed dependency audit,
  Vercel, Preview Comments, GitGuardian, and hosted type/schema after the
  `sharp >=0.35.5` security-floor fix (`a496608`).
- **Boundary:** Code-side evidence only. No live App install/reauthorization,
  provider token exchange, permission cutover, production migration/deployment,
  database write, customer workflow, or release acceptance occurred.
- **Tracker:** GITHUB-WEB-001..004 and dependent final gates remain unchecked;
  R-043 remains open.

## 2026-10-06 · Razorpay payment-method catalog substrate

- **Code:** Web PR #145, `3ce60b8`, merged to `main` as `d6ce773`.
- **Behavior:** Optional server-side method declaration, fail-closed parsing,
  implemented-adapter filtering, UPI QR method selection, and redacted route
  handling. Unsupported payment methods are not advertised or accepted.
- **Verification:** Focused tests 25/25; full Web 863/841/22/0; local and
  hosted typecheck, tests, schema/migration, build, dependency audit, SBOM,
  license, secret, Vercel, and GitGuardian checks passed.
- **Boundary:** No Razorpay account read/configuration change, provider payment
  or lifecycle test, production billing action, or deployment. PLAN-WEB-014/015
  remain unchecked.

## 2026-10-06 · serial disposable-Postgres integration revalidation

- **Runtime:** Disposable local `postgres:15-alpine` database `verglos_test` on `127.0.0.1:55432`; no production connection.
- **Verification:** Queue/provider, worker-crash, usage-ledger, threshold-outbox, and concurrency integration files pass **14/14** with `--test-concurrency=1`.
- **Boundary:** The parallel full-suite run is not credited because shared schema/extension setup races and incomplete disposable schema caused failures/hangs. Serial evidence validates these 14 paths only; no hosted or production qualification is inferred.

## 2026-10-06 · exact-source acceptance harness rerun

- **Source:** Persistent pinned CLI worktree `955412516b96cc09393e78c43bf7d02b9abd05d9`; Web `763aab07a19f054dee41dc83ab9ec9f0743b4925`.
- **Verification:** CLI 236/236, Web 877/905 with 28 explicit environment-gated skips and 0 failures, composed Studio/Enterprise/Team/quality substrates 72/72; all commands exited 0.
- **Boundary:** Substrate/regression evidence only. Provider lifecycle, customer workflows, independent review, authenticated browser-human checks, field-CWV, migrations, and production acceptance remain open.

## 2026-10-06 · Hunt Docker runtime revalidation

- **Source/runtime:** Exact unreleased CLI commit `955412516b96cc09393e78c43bf7d02b9abd05d9`; Docker Desktop 29.7.2 on macOS/aarch64; pinned Alpine digest.
- **Verification:** `@verglos/hunt` Docker-enabled suite passed 55/56 with 0 failures; all 15 enabled runtime assertions passed. PID/IPC namespace comparison remained the single macOS/Linux-host skip.
- **Boundary:** Fresh local runtime evidence only. Linux namespace qualification, independent Hunt review, recipe provenance, and HUNT-011/QUAL-CLI-004 acceptance remain open.

## 2026-10-03 · ACCEPT-006/007 protocol freeze

- **Code/docs:** Added private comprehension and Hunt-adjudication protocols plus `acceptance:study-protocols:check`.
- **Verification:** Protocol validator passed; evidence bundle regenerated with 12 hashed documents and a passing secret scan.
- **Boundary:** Protocol readiness only; no human participant, 100-sample, or independent-review result inferred.

## 2026-10-03 · ACCEPT-003 evidence bundle progress

- **Code/evidence:** Added private `acceptance:evidence:bundle` generator and ten-file hash manifest.
- **Verification:** Bundle generation passed; secret scan passed; provider/customer/reviewer/browser/field-CWV/account-deletion gates remain explicitly open.
- **Boundary:** Reproducibility packaging only; no release approval inferred.

## 2026-10-03 · ACCEPT-002 story map

- **Code/evidence:** Private `9de1e3c` adds the frozen twelve-story map and makes the cross-repository runner emit it.
- **Verification:** CLI 236/236, Web 877/905 with 28 skips, composed substrates 72/72; runner exits zero and records open story statuses explicitly.
- **Boundary:** ACCEPT-002 remains open until every required story has direct runtime/provider/customer evidence.

## 2026-10-03 · ACCEPT-001 corpus freeze

- **Code/evidence:** Private `ac00dca` extends corpus verification to ten items (six full clones + four source-bound contract artifacts) and writes the v2 manifest.
- **Verification:** `pnpm --silent acceptance:corpus:verify` reports `fixtureCount=10`, `allFullClones=true`, `allCompleteCoverage=true`, `allArtifactsIntact=true`.
- **Boundary:** Technical corpus only; no customer consent or external acceptance inferred.

### ACCEPT-001 addendum

- **Code/evidence:** Private `ed2b826` adds two internal synthetic vulnerable fixtures and v3 corpus evidence.
- **Verification:** `acceptance:corpus:verify` reports 12 items, 6 full clones, 4 intact contract artifacts, and 2 complete internal scans.
- **Boundary:** No customer source, external repository access, exploit, or public finding publication.

## 2026-10-03 · ACCEPT-004 protocol freeze

- **Code/docs:** Private commit `454a0cf` adds the external acceptance protocol, consent template, validator, and package script.
- **Verification:** `pnpm --silent acceptance:protocol:check` passed.
- **Boundary:** Protocol definition only; no customer or external repository activity and no ACCEPT-005+ evidence inferred.

## 2026-10-03 · cross-repository acceptance rerun

- **Source:** CLI `955412516`; Web `763aab0`.
- **Verification:** private runner completed CLI 236/236, Web 877/905 with 28 environment skips and 0 failures, and composed substrates 72/72. Evidence JSON refreshed at `10:27:27Z`.
- **Boundary:** No external provider/customer/browser-human/production acceptance inferred.

## 2026-10-03 · Web production build recheck

- **Source:** Web `main` `763aab0`.
- **Verification:** `pnpm build` passed through runtime-config check, Next.js compilation, type validation, static generation (37 pages), and route trace generation.
- **Boundary:** Local Node 26 engine warning only; no production deployment, migration, or data write.

## 2026-10-03 · Web regression recheck after qualification evidence

- **Source:** Web `main` `763aab0`.
- **Verification:** Full suite 859/837/22/0; SCM pretest 46/40/6/0; typecheck, Drizzle schema check, and migration ordering (24) passed.
- **Boundary:** No production or destructive operation. Open deletion/provider/browser/field-CWV and independent-review gates remain unchanged.

## 2026-10-03 · current-source cross-platform matrix

- **Source/run:** CLI `origin/main` exact head `c17b335f2bfac6d9d63e6a8031f4c19811306296`; GitHub Actions run `37110048279`.
- **Result:** in-toto release binding and all nine Ubuntu/macOS/Windows × Node 20/22/24 jobs passed. Each job built the current source, clean-installed public archives, exercised published `1.8.3` upgrade/rollback, typechecked, and ran tests.
- **Boundary:** This is hosted qualification evidence, not publication or release approval. Trusted keyless provenance, legal/independent review, protected publishing, and customer acceptance remain open.

## 2026-10-03 · TEAM-WEB-006 persistence and enqueue routes

- **Code:** Web PR #132 merged as `049f8ba`; additive migration `0021_scm_check_delivery.sql`.
- **Verification:** Focused route/provider/credential/tenant tests 25/25; full Web suite 859/837/22/0; typecheck, Drizzle check, migration ordering, and hosted checks passed.
- **Boundary:** No production migration or database write. Installation/check routes persist only bounded tenant metadata and queue an outbox event; webhook routes, provider worker/retry/reconciliation, and live evidence remain open.

## 2026-10-03 · TEAM-WEB-006 webhook intake and delivery contract

- **Code:** Web PR #133 feature commit `06d90af`, merged as `510f66c`.
- **Verification:** Provider-specific raw-byte webhook authentication with 256 KiB cap, strict minimal payload parsing, repository binding, and idempotent redacted outbox trigger; pure delivery transition tests cover success, retry bounds, max-attempt failure, and permanent failure. Focused suite 29/29; full Web suite 859 total / 837 passed / 22 skips / 0 failed; hosted Verify, GitGuardian, Vercel, typecheck, Drizzle, and migration checks passed.
- **Boundary:** TEAM-WEB-006 remains open for durable DB worker leasing/updates, provider HTTP delivery, retry/reconciliation execution, and live provider evidence. No production migration or database write.

## 2026-10-03 · TEAM-WEB-006 fenced durable delivery leases

- **Code:** Web PR #134 feature commit `031200f`, merged as `5b52943`; additive migration `0022_scm_delivery_leases.sql`.
- **Verification:** lease-owner/expiry schema and index; `FOR UPDATE SKIP LOCKED` claim/reclaim repository; worker-plus-expiry fenced finish update; focused lease/worker tests 5/5; full Web suite 859/837/22/0; hosted Verify, schema, security, and Vercel checks passed.
- **Boundary:** Provider HTTP execution, reconciliation scheduling, and live provider evidence remain open. Migration has not been run against production.

## 2026-10-03 · TEAM-WEB-006 tenant predicate correction

- **Code:** Web PR #135 feature commit `e65c61d`, merged as `80545aa`.
- **Verification:** Explicit organization predicates added to SCM installation list and check lookup; tenant-boundary/SCM contract tests 19/19 and hosted checks passed.
- **Boundary:** No production data or migration touched. Provider HTTP execution, reconciliation scheduling, and live evidence remain open.

## 2026-10-03 · TEAM-WEB-006 provider delivery runner

- **Code:** Web PR #136 feature commit `d1b57b8`, merged as `6714dd8`.
- **Verification:** Redacted provider request composition, bounded transport delegation, exception-to-retry mapping without body/error persistence, lease-fenced finish, and explicit lease-loss accounting; runner/repository tests 5/5; full Web suite 859/837/22/0; hosted checks passed.
- **Boundary:** No scheduler/reconciliation trigger or live GitHub/GitLab evidence yet. No production migration or database write.

## 2026-10-03 · TEAM-WEB-006 scheduled SCM reconciliation

- **Code:** Web PR #137 commits `55ee4a8` and corrective `6c163d9`, merged as `763aab0`; additive migration `0023_scm_provider_token_envelopes.sql`.
- **Verification:** Nullable encrypted token envelopes, authenticated cron scheduler, in-memory decryption, bounded fetch/Retry-After transport, and aggregate-only response; focused SCM route/lease/runner tests 15/15; full Web suite 859/837/22/0; typecheck, build, migration ordering (24), hosted Verify, security, and Vercel checks passed.
- **Boundary:** Live provider evidence and production migration/cutover qualification remain open. No production database operation.

## 2026-10-03 · LIC-002 external engine and standards record

- **Artifact:** Private `docs/shipping/legal/external-engines-and-standards-2026-10-03.md`.
- **Evidence recorded:** pinned Trivy v0.74.0 image/revision and Apache LICENSE/NOTICE URLs; detect-secrets unbundled executable boundary; Sigstore versions/fixture commit/digests; in-toto software/documentation/specification license split; standards non-vendoring and fixture/premium-content restrictions.
- **Boundary:** Technical inventory only. Final legal approval, immutable detect-secrets release, image/layer/database review, premium recipe provenance, trademark review, and independent review remain open. No public repository, package, production database, or deployment changed.

## 2026-10-03 · TEAM-WEB-006 test registration correction

- **Code:** Web PR #131 merged as `eadc5ac`.
- **Verification:** Configured focused slice 28/28 passed with 6 environment-gated skips; full Web suite 859 total / 837 passed / 22 skipped / 0 failed.
- **Boundary:** Test registration only; provider persistence, routes, retries, reconciliation, and live evidence remain open.

## 2026-10-03 · TEAM-WEB-006 provider transport substrate

- **Code:** Web PR #130 merged as `27cd6c7`.
- **Verification:** Focused tests 5/5; local typecheck/diff; hosted type/schema, GitGuardian, Vercel, and preview checks passed.
- **Boundary:** Provider transport is pure and network-free. Persistence, webhook routes, durable retries, response reconciliation, and live provider evidence remain open. No production operation occurred.

## 2026-10-03 · TEAM-CLI-002 CI check payload substrate

- **Code:** CLI PR #56 merged as `c17b335`.
- **Verification:** Focused tests 3/3; shared typecheck/build; hosted platform matrix, self-scan, and in-toto binding passed.
- **Boundary:** Source-free payload projection is shipped as a substrate only. Organization policy fetch/cache, CLI command wiring, provider adapters/routes, and live SCM evidence remain open. No production operation occurred.

## 2026-10-03 · TEAM-WEB-006 SCM check contract substrate

- **Code:** Web PR #129 merged as `b2352c6`.
- **Verification:** Focused SCM contract tests 4/4; configured Web suite 859 total / 837 passed / 22 environment-gated skips; typecheck, hosted Verify, GitGuardian, Vercel, preview, and diff checks passed.
- **Boundary:** GitHub/GitLab provider adapters, persistence, HTTP webhook routes, retry delivery, and live provider evidence remain open. No production database write, migration, billing action, or marketing change occurred.

## 2026-10-02 · Public route accessibility/lab sweep

- **Run:** Read-only Chrome CDP sweep in a temporary same-browser tab across five public routes.
- **Result:** One main landmark and no horizontal overflow on all routes; accessibility-tree and DOM timing evidence recorded in the private artifact.
- **Boundary:** Lab evidence only; no field-CWV or human screen-reader claim; no production write occurred.

## 2026-10-02 · Hunt independent review packet

- **Artifact:** Private `hunt-independent-review-packet-2026-10-02.md` prepared from CLI head `b781bc4`, hosted run `36984993552`, artifact `11216049055`, and pinned image evidence.
- **Boundary:** Packet is ready for a non-author reviewer; no reviewer identity or signature is invented. HUNT-011/QUAL-CLI-004 remain open.

## 2026-10-02 · Authenticated account accessibility-tree evidence

- **Run:** Existing authenticated Chrome tab, read-only CDP inspection of `/account`.
- **Result:** One `main`, navigation, heading, alert, seven focusables, no horizontal overflow, 65 AX nodes; organization list returned empty.
- **Boundary:** Partial automated accessibility evidence only. No organization was created and no production/database write occurred.

## 2026-10-02 · RECORD-010 accepted

- **Acceptance:** CLI retirement/option/registration tests pass 7/7; Web retired POST, legacy lookup, and `/verify` truth tests pass 3/3; hosted run `36986357199` and production read-only smoke pass.
- **Result:** RECORD-010 accepted. Legacy hash pages remain unsigned/read-only, historical view counters are removed, and canonical offline record verification is the only verification path advertised.
- **Boundary:** No production/database write occurred.

## 2026-10-02 · Legacy verify production smoke

- **Deployment:** Web PR #128 production deployment `verglos-5vy0enlkd-anuragyadav20062002s-projects.vercel.app` reached READY.
- **Read-only smoke:** `curl https://verglos.com/verify` confirms the corrected legacy-summary language and offline verification pointer; removed counters/publish claims are absent.
- **Boundary:** No database, payment, migration, or manual production write occurred.

## 2026-10-02 · Legacy verify truth correction

- **Code:** Web PR #128 (`03304c0`) merged as `fc55203`.
- **Verification:** Hosted run `36986357199` passed typecheck, 837 executed tests / 22 environment-gated skips, schema/migration, build, public-boundary, dependency/SBOM/license, tracked-secret, GitGuardian, and Vercel Preview checks.
- **Boundary:** The public index no longer claims historical views are verification or advertises retired attestation publishing. RECORD-010 remains open pending final CLI/Web compatibility reconciliation. No production operation occurred.

## 2026-10-02 · Web organization dashboard accessibility shell

- **Code:** Web PR #127 (`d92aba3`) merged as `cdc1fff`.
- **Verification:** Hosted run `36985775429` passed typecheck, configured Web tests (836 executed / 22 environment-gated skips), negative boundary/truth, schema/migration checks, build, public-boundary, dependency/SBOM/license, tracked-secret, GitGuardian, and Vercel Preview.
- **Boundary:** Dashboard shell accessibility/responsive implementation is shipped. QUAL-WEB-006 remains open for authenticated dashboard runtime evidence, human screen-reader review, large datasets, and field CWV. No production operation occurred.

## 2026-10-02 · Hosted Linux namespace qualification

- **Change:** CLI PR #55 (`933c14c`) added a manual trigger to `.github/workflows/self-scan.yml`; hosted matrix and PR self-scan passed, then the change merged as `b781bc4`.
- **Evidence:** Manual `main` self-scan `36984993552` passed end-to-end on `ubuntu-latest`. The pinned `postgres:15-alpine` Hunt Docker adversarial suite completed successfully and the PID/IPC namespace-private assertion passed; the run also uploaded the Hunt transcript artifact.
- **Boundary:** Linux namespace evidence is now present. HUNT-011 and QUAL-CLI-004 remain open for recipe execution/provenance and independent review. No production operation occurred.

## 2026-10-02 · Web PR #123 verified INR Pro catalog (pending production activation)

- **Code:** Web `23a83f0` pushed as PR #123: canonical Pro catalog version `2026-10-02.0`, INR amounts `280943`/`2809430` paise, verified/purchasable flags, and checkout UI bound to catalog offers.
- **Verification:** local full Web suite 858 total (836 pass, 22 environment-gated skips), typecheck, build, schema/migration, negative-boundary, truth-registry, license, and SBOM checks passed. Hosted Verify run `36979422192` passed typecheck, full tests, boundary/truth, schema/migrations, build, public-boundary, dependency, SBOM/license, and secret guards.
- **Boundary:** no migration, database write, live payment, or production deployment has been performed by this change. PLAN-WEB-011/012 remain unchecked until production activation and real lifecycle reconciliation are observed. Rollback is a deployment revert or commit revert.

## 2026-10-02 · Web PR #123 production deployment smoke

- **Deployment:** PR #123 merged as `f31a8e212d6fb3c995fd90d5baacde26940e2cc1`; Vercel production deployment `verglos-85ttjw5gm-anuragyadav20062002s-projects.vercel.app` reached READY.
- **Smoke:** Existing authenticated Chrome session loaded `https://verglos.com/checkout`; the rendered offer is INR ₹2,809.43 monthly, with annual cadence available, 30-day monthly entitlement, and the QR action. No production QR/order was created.
- **Boundary:** This verifies catalog/UI deployment only. It does not prove live-key mode, successful payment, webhook delivery, renewal/refund/out-of-order reconciliation, or exactly-one production grant. PLAN-WEB-011/012 remain unchecked; rollback is the prior Vercel deployment or revert `f31a8e2`.

## 2026-10-02 · Web PR #124 PRO-003 release repository runtime evidence

- **Code:** Web `1c21494` merged as `a86bad57bf4b0350f2e1bc1b03d918bb0de985c8` in PR #124. Added the missing Docker-backed PostgreSQL integration to the existing tenant-scoped release/application dashboard implementation and included it in the configured dashboard pretest.
- **Evidence:** Disposable PostgreSQL test passed 1/1: exact subject/decision/policy/signer/coverage/change/incomplete projections, application filter, and foreign-tenant exclusion. Hosted Verify run `36980196035` passed the complete Web gate.
- **Boundary:** No production database/environment operation, migration, deployment, or public-copy change occurred. PRO-003 was already checked in the authoritative backlog; this closes its previously recorded runtime-evidence gap.

## 2026-10-02 · Web PR #125 checkout accessibility qualification progress

- **Code:** Web `22a9f25` merged as `c4abda56dc4fcbe3306ceee69f45619765afd868` in PR #125. Checkout accent controls now use the accessible foreground token and the route exposes a semantic `main` landmark.
- **Verification:** Hosted Verify run `36981068432` passed. Production deployment reached READY; post-deploy Chrome Lighthouse on `/checkout` reports Accessibility **100** and Best Practices **100** (up from Accessibility 94 with contrast and landmark failures).
- **Boundary:** SEO/noindex/llms audit failures are intentional for transactional checkout. QUAL-WEB-006 remains unchecked pending authenticated-dashboard, screen-reader, responsive, large-dataset, and complete Core Web Vitals evidence. No payment, database, migration, or pricing behavior changed.

## 2026-10-02 · Public Web Lighthouse smoke after PR #125

- **Run:** Production Chrome Lighthouse navigation audits on `/`, `/detectors`, and `/docs` (desktop), plus `/checkout` (mobile).
- **Result:** `/`, `/detectors`, and `/docs` each scored Accessibility 100, Best Practices 100, and SEO 100. `/checkout` scored Accessibility 100 and Best Practices 100 on mobile as well as desktop. The only recurring public audit failure is the separate `llms-txt` recommendation; checkout additionally remains intentionally noindex/without a meta description as a transactional surface.
- **Boundary:** This is public smoke evidence only, not the complete QUAL-WEB-006 gate; dashboard screen-reader, large-dataset, and full CWV evidence remain open.

## 2026-10-02 · Hunt sandbox suite recheck

- **Run:** CLI `pnpm --filter @verglos/hunt test` at `e63b504`.
- **Evidence:** 40 tests passed, 0 failed; 16 Docker runtime adversarial tests skipped by their explicit environment gate. A direct Docker preflight failed with socket permission denied.
- **Boundary:** No acceptance checkoff. Runtime isolation, Linux namespace evidence, and independent Hunt review remain open. No production DB/environment, deployment, release, or customer workflow occurred.

## 2026-10-02 · Founder authorization and external-evidence preflight

- **Authorization:** Founder approved final truth/copy work after gates, a real billing/provider checkout test, authorized customer acceptance workflows, legal/licensing review, and independent Hunt isolation review.
- **Read-only preflight:** Local Web environment has no Razorpay/database/Clerk credentials; Vercel CLI cannot access the linked project (`Not authorized`); no customer repository/fixture package, legal approval record, or independent Hunt review artifact was found in the workspace.
- **Boundary:** Approval is recorded, but these missing inputs do not qualify the gates. No production checkout, deployment, customer workflow, legal assertion, independent-review claim, or production database operation occurred.

## 2026-10-02 · FINAL-WEB-001 truth-registry guard progress (Web PR #101)

- **Code:** Reconciliation commit `662f91b` merged in PR #101 as `c3e6668ec87ef386e33462e815877e640004fc16`.
- **Verification:** Hosted run `36972830161` passed typecheck, full tests, negative-boundary, dedicated truth-registry tests, schema/migration checks, build, public-boundary, dependency, SBOM/license, and tracked-secret checks.
- **Acceptance boundary:** FINAL-WEB-001 remains open; no public copy was changed, and final claim-map wiring plus ACCEPT-009/010/founder authorization remain outstanding. No production DB/environment, migration, deployment, release, or marketing action occurred.

## 2026-09-30 · QUAL-WEB-006 public accessibility remediation (Web PR #102)

- **Code:** Web PR #102 exact head `a69e50da3827081c3ab23a8d943017ae26f82e0a` merged as `f138e24bf85de7527a8d3896897bd1aa26fecbe0`.
- **Verification:** Hosted Verify run `36685565094`, GitGuardian, and Vercel passed. The patch changes only contrast/focus/keyboard affordances on public pages and components; product claims and pricing copy are unchanged.
- **Acceptance boundary:** QUAL-WEB-006 remains open for authenticated-dashboard, screen-reader, responsive, large-dataset, and full CWV evidence. No production database/environment, migration, deployment, release, or marketing state changed.

## 2026-09-30 · QUAL-WEB-001 acceptance closeout (Web PR #121)

- **Code:** Follow-up commits `d940136` and `e0fe054` merged as `a88495151f43d1a6addc16a88427288cb2d1458e` in PR #121.
- **Verification:** Hosted Verify run `36760390332` passed typecheck, full tests, `pnpm test:negative-boundary` (including search), schema/migration checks, build, public-boundary, dependency, SBOM/license, and tracked-secret checks. Vercel and GitGuardian checks passed. Existing Docker-backed list/search/export/public-private runtime and modified-CLI authority evidence remain part of the acceptance set.
- **Acceptance boundary:** QUAL-WEB-001 accepted. No production database/environment read or write, migration, deployment, release, publish, or marketing action occurred.

## 2026-09-30 · QUAL-WEB-001 distinct search runtime (Web PR #120)

- **Code:** Web tested head `9ecd0092e202a65549e4a53b0f0cbbb58e144957`; PR #120 merged as `677a78afd27435c57c498fe8bd8b4e9013096642`.
- **Verification:** Bounded organization search over project/release/subject identifiers preserves authorization-before-data-access and project-context scoping. Disposable Docker PostgreSQL runtime test passes 1/1; full configured Web suite passes 836/836 executed tests with 22 environment-gated skips; typecheck/build/schema/21-migration/negative-boundary pass; `pnpm audit --prod` reports no known vulnerabilities. Hosted run `36744036519` is green.
- **Acceptance boundary:** QUAL-WEB-001 remains unchecked. Search runtime evidence is now present, but export semantics and the complete hosted/provider-backed list/search/export/public-private matrix remain open. No production DB/environment, migration, deployment, release, or marketing state changed.

## 2026-09-30 · Web PostgreSQL contention isolation follow-up

- **Verification:** On a fresh disposable PostgreSQL 15 container, the three files implicated by the local all-in-one run pass sequentially: `worker-crash-recovery.integration.test.ts` 2/2, `ledger.integration.test.ts` 1/1, and `threshold-outbox.integration.test.ts` 1/1; 4/4 total.
- **Interpretation:** The earlier duplicate-extension/deadlock failures require concurrent sharing of one local database; they do not reproduce in isolated sequential runs and are superseded by hosted PR #119's green full workflow. No code, checkbox, or production state changed.

## 2026-09-30 · QUAL-WEB-001 direct tenant data-route runtime (Web PR #119)

- **Code:** Web tested head `87f424cbfd93bd3d54232a66a29664c517b4d514`; merged as `1834f442086ab79862eb62984bc4111def3ad923`.
- **Verification:** Focused disposable Docker PostgreSQL test passes 1/1; typecheck, Drizzle schema check, 21-migration ordering, and production build pass. Hosted run `36741825859` is fully green, including the configured PostgreSQL-backed test command and security/license/boundary checks.
- **Runtime evidence:** Evidence and policy-evaluation real handlers preserve tenant/project scope, ignore forged query authority, bind writes to the authorized scope, and mark private responses `private, no-store`.
- **Acceptance boundary:** QUAL-WEB-001 remains unchecked pending distinct search/export semantics and the complete runtime matrix. No production DB/environment, migration, deployment, or release action occurred.

## 2026-09-30 · QUAL-CLI-006 current-source in-toto archive binding (CLI PR #51)

- **Code:** CLI tested head `e63b5041727a175da1d770012cb945a061f05324`, rebased onto `f16c6f1`, merged as `353787539451e918dcda088ff6cbbd497ae1c631`.
- **Verification:** Local typecheck/build/contract tests and official `in-toto==3.0.0` verification pass. Hosted run `36720267628` passes archive binding plus all nine platform/Node cells; self-scan `36720267470` passes.
- **Acceptance boundary:** QUAL-CLI-006 remains unchecked. This binds current source archives to an ephemeral in-toto layout/link, not trusted keyless Sigstore/Fulcio/Rekor release provenance or final publish authorization. Package remains alpha.1 and no production DB/environment, deployment, release, or npm publish occurred.

## 2026-09-30 · QUAL-WEB-001 tenant release runtime (Web PR #118)

- **Code:** Web tested head `d0df2eecf769bf615cfbdad77848f7ce6a3f0f8f`; merged as `b0663e355d7e44eec1b59782f7a77f1a6d04750` in PR #118.
- **Verification:** Disposable Docker PostgreSQL focused run passes 2/2 with zero skips; local TypeScript check passes; hosted run `36717893114` is fully green, including GitGuardian and Vercel.
- **Runtime evidence:** Real tenant release list/detail handlers ignore forged query authority fields, return only the scoped release/subject, and emit `private, no-store`.
- **Acceptance boundary:** QUAL-WEB-001 remains unchecked; distinct search semantics and hosted/provider-backed list/search/export plus the complete public/private matrix remain open. No production database/environment operation occurred.

## 2026-09-30 · QUAL-WEB-001 public receipt runtime (Web PR #117)

- **Code:** Web tested head `1b39c09638e3d9876f898b3e14e064d4e6731bf8`; merged as `d8c7edf00256f7ceb332319c3d351a69e4861f50` in PR #117.
- **Runtime evidence:** Disposable PostgreSQL 15 run passes 2/2 with zero skips. The real public receipt route succeeds with forged tenant/project query fields, returns `no-store`, and verifies the stored digest; the same run keeps private project-list and receipt list/detail/download assertions active.
- **Hosted evidence:** run `36716982904` completed successfully; GitGuardian, Vercel preview, and deployment checks passed.
- **Boundary:** qualification progress only; no production DB/environment read/write, migration, deployment, release, or marketing action occurred.

## 2026-09-30 · QUAL-WEB-001 authorized tenant list runtime (Web PR #116)

- **Code:** Web tested head `95ebce448371ab773f2e8af342098894b6adb966`; merged as `d230af0fd0227f0f4625257e6ee743ed3ef460f0` in PR #116.
- **Runtime evidence:** Disposable PostgreSQL 15 run passes 2/2 with zero skips. The real organization project-list route is invoked for tenant A and B with forged query fields; each response is scoped to its own rows and has `private, no-store`. Existing receipt list/detail/download integration also passes in the same run.
- **Hosted evidence:** run `36716252644` completed successfully; GitGuardian, Vercel preview, and deployment checks passed.
- **Boundary:** qualification progress only; no search endpoint was invented and no production DB/environment read/write, migration, deployment, release, or marketing action occurred.

## 2026-09-30 · QUAL-WEB-001 receipt runtime boundary

- **Run:** disposable local `postgres:15-alpine`; `TEST_DATABASE_URL=postgres://…/verglos_test pnpm exec tsx --test src/lib/organizations/record-receipt-route.integration.test.ts` from `verglos-web`.
- **Result:** **1/1 passed, 0 skipped**. Tenant-isolated list reads for two organizations, authorized detail verification, and private download/export all executed; idempotency/conflict/strict projection assertions also passed.
- **Boundary:** local Docker evidence only. No distinct search API was created; hosted/provider-backed runtime and complete public/private matrix remain open. No production database/environment read or write, migration, deployment, release, or marketing action occurred.

## 2026-09-30 · QUAL-WEB-001 modified-CLI entitlement request (Web PR #115)

- **Code:** Web PR #115 exact tested head `b3dfd77` merged as `4d2051e4`.
- **Verification:** CLI-style user-agent/client headers and forged organization, license, role, plan, capability, allowance, usage, and record fields are ignored; server-derived claims remain authoritative. Focused route/boundary suite passes 10/10. Hosted run `36705118215`, GitGuardian, and Vercel pass.
- **Acceptance boundary:** QUAL-WEB-001 remains unchecked; direct list/search/export/public-private runtime evidence remains open.
- **Operations:** no production/database read or write, migration, deployment, release, publish, or marketing action occurred.

## 2026-09-30 · QUAL-WEB-001 forged-query authority matrix (Web PR #114)

- **Code:** Web PR #114 exact tested head `f79a7a5` merged as `88a809d3`.
- **Verification:** Protected route matrix requests include forged tenant/project/plan/allowance query fields and forged bodies; path-based authorization and non-cacheable denial assertions remain green in the 4/4 boundary suite. Hosted run `36704670862`, GitGuardian, and Vercel pass.
- **Acceptance boundary:** QUAL-WEB-001 remains unchecked; complete modified-CLI and direct list/search/export/public-private runtime evidence remain open.
- **Operations:** no production/database read or write, migration, deployment, release, publish, or marketing action occurred.

## 2026-09-30 · QUAL-WEB-001 public receipt authority/cache boundary (Web PR #113)

- **Code:** Web PR #113 exact tested head `39dfb64` merged as `24232db2`.
- **Verification:** Direct public receipt JSON invocation rejects an invalid identity before querying, does not reflect forged tenant/project query fields, and sets `no-store`; combined private denial/public boundary tests pass 4/4. Hosted run `36704251024`, GitGuardian, and Vercel pass.
- **Acceptance boundary:** QUAL-WEB-001 remains unchecked; complete modified-CLI and direct list/search/export/public-private runtime evidence remain open.
- **Operations:** no production/database read or write, migration, deployment, release, publish, or marketing action occurred.

## 2026-09-30 · QUAL-WEB-001 runtime denial cache matrix (Web PR #112)

- **Code:** Web PR #112 exact tested head `4548734` merged as `517df10c`.
- **Verification:** Every protected organization API route is called through its real handler with forged request-body authority fields while authorization denies; each denial response is asserted `no-store` or `private, no-store`. Focused negative-boundary suite passes 2/2 and local typecheck/diff checks pass. Hosted run `36703830835`, GitGuardian, and Vercel pass.
- **Acceptance boundary:** QUAL-WEB-001 remains unchecked; modified-CLI and direct list/search/export/public-private runtime evidence remain open.
- **Operations:** no production/database read or write, migration, deployment, release, publish, or marketing action occurred.

## 2026-09-30 · QUAL-CLI-006 official in-toto layout/link smoke

- **Run:** Docker `python:3.12-slim`; installed official `in-toto==3.0.0`; generated an ephemeral Ed25519 key; created a synthetic signed root layout and `build` link with `in-toto-mock`/`in-toto-sign`; verified with `in-toto-verify --verification-keys`.
- **Result:** official verifier returned success for the layout/link pair.
- **Boundary:** synthetic local evidence only; no release artifact/pipeline binding, Fulcio identity, Rekor entry, or trusted keyless Sigstore evidence. QUAL-CLI-006 remains unchecked. No production/database read/write, deployment, release, publish, or marketing action occurred.

## 2026-09-30 · PLAN-CLI-004 compatibility fixtures (CLI PR #50)

- **Code:** CLI PR #50 exact tested head `9ff21be` merged as `f16c6f1`.
- **Verification:** frozen server-shaped fixtures cover Free, Pro, Team, Studio, and Enterprise; opaque capability/allowance fields round-trip; malformed catalogs fail closed to Free without stale paid reuse. Local full CLI tests, typecheck, and build pass. Hosted platform run `36700076759` passes all nine Ubuntu/macOS/Windows × Node 20/22/24 cells; self-scan `36700077215` passes.
- **Acceptance boundary:** PLAN-CLI-004 remains unchecked pending deployed signer/catalog alignment, old-token migration evidence across supported versions, and hosted activation integration.
- **Operations:** no production/database read or write, migration, deployment, release, publish, or marketing action occurred.

## 2026-09-30 · QUAL-WEB-001 private account/API cache-boundary completion (Web PR #111)

- **Code:** Web PR #111 exact tested head `f524382` merged as `c83300b`.
- **Verification:** account sync, CLI-auth, license status, score history, and monitor routes attach private no-store headers, including shared paid-license denial responses; focused tenant/monitor contract suites pass 17/17 locally. Hosted run `36693118104` passes typecheck, full tests, DB/migration checks, build, boundary, dependency/SBOM/license, and secret checks; GitGuardian and Vercel pass.
- **Acceptance boundary:** QUAL-WEB-001 remains unchecked. This closes the remaining identified private API cache-header gap but does not complete modified-CLI or direct runtime list/search/export/public-private evidence.
- **Operations:** no production/database read or write, migration, deployment, release, publish, or marketing action occurred.

## 2026-09-30 · QUAL-WEB-001 organization API cache-boundary completion (Web PR #110)

- **Code:** Web PR #110 exact tested head `f60a403` merged as `18ddb408`.
- **Verification:** organization directory, member, project, policy, and release routes route all invalid, denied, validation, not-found, conflict, idempotent, and success responses through private no-store headers; tenant-scope tests pass 13/13 locally. Hosted run `36692358099` passes typecheck, full tests, DB/migration checks, build, boundary, dependency/SBOM/license, and secret checks; GitGuardian and Vercel pass.
- **Acceptance boundary:** QUAL-WEB-001 remains unchecked. This closes the explicit route-source cache-header gap but does not complete modified-CLI or direct list/search/export/runtime boundary evidence.
- **Operations:** no production/database read or write, migration, deployment, release, publish, or marketing action occurred.

## 2026-09-30 · QUAL-WEB-001 private evidence/evaluation cache boundary (Web PR #108)

- **Code:** Web PR #108 exact tested head `8a77d2a` merged as `7279ef2`.
- **Verification:** evidence and policy-evaluation list/create routes route every response through private no-store headers, including denial and validation paths; tenant-scope tests pass 12/12 locally. Hosted run `36691398858` passes typecheck, full tests, DB/migration checks, build, boundary, dependency/SBOM/license, and secret checks; GitGuardian and Vercel pass.
- **Acceptance boundary:** QUAL-WEB-001 remains unchecked. This extends cache-boundary evidence but does not complete modified-CLI or the full list/search/export/cache/public/private matrix.
- **Operations:** no production/database read or write, migration, deployment, release, publish, or marketing action occurred.

## 2026-09-30 · QUAL-WEB-001 private receipt cache-boundary correction (Web PR #105)

- **Code:** Web PR #105 exact tested head `27e972c` merged as `6cb6734`.
- **Verification:** private receipt list/detail response paths now flow through no-store headers; the route contract suite passes 11/11, with local typecheck/diff checks green. Hosted run `36690136102` passes the full Web verification workflow, GitGuardian, and Vercel.
- **Acceptance boundary:** QUAL-WEB-001 remains unchecked. This closes a private-cache defect but not the complete modified-CLI/list/search/export/public/private matrix.
- **Operations:** no production/database read or write, migration, deployment, release, publish, or marketing action occurred.

## 2026-09-30 · QUAL-WEB-001 modified-client entitlement qualification progress (Web PR #104)

- **Code:** Web PR #104 exact tested head `3bd02da` merged as `98169fa`.
- **Verification:** the v2 entitlement route's focused suite passes 6/6, including a forged request carrying plan/tier, tenant, capability, allowance, usage, and record fields; the response and signed claims remain server-resolved. Local typecheck/diff checks pass; hosted run `36689496063` passes the full Web verification workflow, GitGuardian, and Vercel.
- **Acceptance boundary:** QUAL-WEB-001 remains unchecked. The full modified-CLI request matrix and list/search/export/cache/public/private coverage are still open.
- **Operations:** no production/database read or write, migration, deployment, release, publish, or marketing action occurred.

## 2026-09-30 · QUAL-WEB-001 malformed-route boundary qualification progress (Web PR #103)

- **Code:** Web PR #103 exact tested head `66c1f94` merged as `0a85f08`.
- **Verification:** `negative-boundary.test.ts` passes across every protected organization API method and three attacker-controlled organization-ID forms; malformed inputs are rejected before authorization, while guessed IDs receive bounded fixed denials with no identifier echo. Local typecheck/build/diff checks pass; hosted run `36686440312` passes the full Web verification workflow, GitGuardian, and Vercel.
- **Acceptance boundary:** QUAL-WEB-001 remains unchecked. This is route-boundary evidence only; modified/untrusted CLI behavior and complete list/search/export/cache/public/private coverage remain open.
- **Operations:** no production/database read or write, migration, deployment, release, publish, or marketing action occurred.

## 2026-09-30 · QUAL-WEB-006 accessibility remediation ready (Web PR #102)

- **Code:** Web PR #102 exact head `a69e50d` is pushed and remains open/unmerged. It fixes the measured public contrast failures, removes opacity-induced language-label failures, changes coral CTA text to a dark foreground, and adds keyboard focus/labels to docs horizontal scroll regions.
- **Verification:** local typecheck, production build, and diff check pass. Axe-core 4.10.2 reports zero violations on `/`, `/detectors`, and `/docs` (47/31/41 rules passing). Hosted run `36685565094` passes typecheck/tests/schema/migrations/build/public-boundary/dependency/license/SBOM/secret checks; GitGuardian, Vercel, and preview comments pass.
- **Acceptance boundary:** PR remains held under the public truth/marketing freeze. QUAL-WEB-006 stays unchecked pending authenticated-dashboard, hosted, and complete CWV/accessibility evidence.
- **Operations:** no production/database read or write, migration, deployment, release, publish, or marketing action occurred.

## 2026-09-30 · QUAL-WEB-006 axe accessibility findings

- **Evidence:** axe-core 4.10.2 against local public pages reports serious violations: `/` 64 color-contrast nodes, `/detectors` 16 color-contrast nodes, `/docs` 2 color-contrast nodes plus 2 `scrollable-region-focusable` nodes.
- **Acceptance boundary:** these are direct qualification failures. Public-surface class/content remediation remains held by the truth/marketing freeze; QUAL-WEB-006 stays unchecked.
- **Operations:** no production/database read or write, migration, deployment, release, publish, or marketing action occurred.

## 2026-09-30 · QUAL-WEB-006 browser capture results

- **Local browser evidence:** complete cached Playwright Chromium captured public `/`, `/detectors`, and `/docs` successfully (HTTP 200, landmarks present). Measurements: `/` FCP 2344ms / TTFB 2284ms; `/detectors` FCP 308ms / TTFB 277ms; `/docs` FCP 372ms / TTFB 348ms. These are partial diagnostics; LCP/INP/CLS and screen-reader findings were not collected.
- **Failures/limits:** local `/verify` returned HTTP 500 because `DATABASE_URL` is not set, confirmed by the Next.js server stack at `getDb()`. Hosted PR preview URL is protected by Vercel authentication and returned the Vercel login page for every path, so it is not a product capture.
- **Acceptance boundary:** QUAL-WEB-006 remains unchecked; no authenticated dashboard or hosted CWV/accessibility evidence exists.
- **Operations:** no production/database read or write, migration, deployment, release, publish, or marketing action occurred.

## 2026-09-30 · QUAL-WEB-006 browser evidence attempt

- **Attempt:** `pnpm dlx @playwright/test@1.51.1` resolved successfully, but pinned Chromium 134.0.6998.35 download timed out during the primary and fallback downloads. No browser measurement or accessibility capture was produced.
- **Acceptance boundary:** QUAL-WEB-006 remains unchecked; classifier tests are not browser/CWV evidence.
- **Operations:** no production/database read or write, migration, deployment, release, publish, or marketing action occurred.

## 2026-09-30 · QUAL-WEB-005/006 evidence boundary audit

- **Verification:** Web pure quality classifiers pass 18/18, including deletion hold/scope/offline-record invariants and fail-closed accessibility/performance validation for empty, non-finite, and negative measurements.
- **Acceptance boundary:** repository inspection finds no account-deletion HTTP route or hosted deletion trace, and no browser/screen-reader/Core Web Vitals capture. QUAL-WEB-005 and QUAL-WEB-006 remain unchecked; pure classifiers are not runtime qualification.
- **Operations:** no production/database read or write, migration, deployment, release, publish, or marketing action occurred.

## 2026-09-30 · QUAL-WEB-001 authorization audit evidence

- **Verification:** Web focused authorization run passes 30/30 (`tenant-scope`, `authorization`, `denial-response`, and `rbac-matrix`). It exercises all 29 tenant API methods, organization/project guard selection, bounded denials for unauthenticated/forbidden/project-not-found actors, tenant predicates/scoped DB exposure, exhaustive role×action×plan capability composition, and non-cacheable public receipt behavior.
- **Acceptance boundary:** QUAL-WEB-001 remains unchecked. Direct modified/untrusted CLI behavior and the full list/search/export/cache/public/private boundary matrix are not yet qualified by this run.
- **Operations:** no production/database read or write, migration, deployment, release, publish, or marketing action occurred.

## 2026-09-30 · QUAL-CLI-006 in-toto validator availability check

- **Tooling evidence:** an isolated temporary Python environment installed pinned `in-toto==3.0.0`; the official `in-toto-verify --help` command completed successfully.
- **Acceptance boundary:** repository inspection found no signed layout/link set corresponding to the current release artifacts. This is validator availability evidence only; QUAL-CLI-006 remains unchecked pending actual signed in-toto evidence and trusted keyless Sigstore/Fulcio/Rekor verification.
- **Operations:** no production/database read or write, migration, deployment, release, publish, or marketing action occurred.

## 2026-09-30 · QUAL-CLI-006 supported-platform upgrade/rollback transition (CLI PR #49)

- **Code:** PR #49 head `02c3c6ec4af78f0dca538795d12bc133d2d63381` merged as `ef78ac6f82668d4dcefb927edc197e8cce7a7fe4`.
- **Hosted evidence:** platform run `36682992576` passed all nine Ubuntu/macOS/Windows × Node 20/22/24 cells plus self-scan. Each matrix cell completed the real `1.8.3 → 2.0.0-alpha.1 → 1.8.3` consumer transition, with the existing full test suite and clean-consumer checks also green.
- **Boundary:** Windows `.cmd` CLI invocation required shell dispatch and was fixed before the successful rerun. This closes supported-platform transition evidence, but QUAL-CLI-006 stays unchecked pending official in-toto layout/link validation and trusted keyless Sigstore/Fulcio/Rekor evidence.
- **Operations:** no production/database read or write, migration, deployment, release, publish, or marketing action occurred.

## 2026-09-30 · QUAL-CLI-006 cross-platform clean-consumer qualification (CLI PR #48)

- **Code:** PR #48 head `79ae04fee9eb3127127a863ca5458619dce0774c` merged as `f72b9107867e026d8df93411da9c91cf796cde27`. The platform workflow packs/audits six public archives, runs the clean consumer verifier, and uploads one log per matrix cell. Windows support fixes use `pnpm.cmd`/`npm.cmd` with shell dispatch and a pure Node gzip/tar archive reader, avoiding host-specific tar behavior.
- **Hosted evidence:** run `36681169580` passed Ubuntu/macOS/Windows × Node 20/22/24 (9/9) and self-scan. Every cell's clean-consumer step passed: six archives installed, all public libraries imported, `Verglos 2.0.0-alpha.1` executed, and no external engine cache created.
- **Local evidence:** pack-public-packages, packed-manifest audit, clean-consumer verifier, notice tests, and package-surface tests pass. This is direct cross-platform clean-install evidence.
- **Boundary:** no real package upgrade/rollback transition was executed; source compatibility and engine rollback tests remain separate evidence. Official in-toto layout/link validation and trusted keyless Sigstore/Fulcio/Rekor evidence remain absent. QUAL-CLI-006 stays unchecked.


## 2026-09-30 · QUAL-CLI-006 official-format progress (CLI PR #47)

- **Code:** CLI `af3aa09` fixes SPDX generation: top-level `dataLicense`, `SPDXRef-DOCUMENT DESCRIBES` relationships for every package, and URI-safe download locations. Regenerated `SBOM.cdx.json` and `SBOM.spdx.json` were the only generated artifacts in PR #47, merged as `ca88ef2`.
- **Verification:** official CycloneDX CLI 0.33.1 (`cyclonedx/cyclonedx-cli@sha256:252c2e26f468c25fea1e63ecde1bc3198ad6e9dbb57f5ed3236bddcb2281b3a7`) validates `SBOM.cdx.json` (sha256 `69176796bfa676c7e466307b75051549fea4991c46a4f2f4bf8e6e09988f4137`); SPDX Tools 0.8.5 validates `SBOM.spdx.json` (sha256 `e29208279f017eb2be43cb045ecf9f40f375e8dbe97bbfe9c54ac03de552effd`); Microsoft SARIF Multitool 5.7.0 validates a bounded SARIF fixture. Focused generator/license/release tests, full Turbo test graph (12/12), typecheck, build, and diff checks pass.
- **Open evidence:** PR #47 hosted nine-cell matrix and self-scan passed. Official in-toto/Sigstore validation and complete supported-platform install/upgrade/rollback evidence are still missing. QUAL-CLI-006 remains open.
- **Remaining validator attempt:** Cosign 2.4.1 was exercised against the historical Sigstore DSSE fixture, but its `verify-blob-attestation` invocation rejected the fixture payload/format before verification; this is not product evidence. `in-toto-verify` 3.0.0 was inspected but no signed layout/link set exists in the repository to verify. These remain explicit evidence gaps, not failures converted into acceptance.
- **Operations:** no production/database read or write, migration, deployment, release, publish, or marketing action occurred; private docs and founder-owned assets remain outside the PR.

## 2026-09-30 · dependency audit and QUAL-CLI-006 handoff

- **Reconciliation:** current backlog is **214 checked / 55 unchecked / 269 total**. RECORD-002/009/011/012 and DIST-004/005 are accepted, so QUAL-CLI-006 is dependency-ready; the prior inventory statement that it was RECORD-gated was stale and has been corrected.
- **Evidence boundary:** the preserved untracked `spec-validation-corpus.test.ts` passes within the shared suite but asserts required fields rather than invoking official validators. The active host has no `cosign`, `syft`, `grype`, `cyclonedx`, `spdx-tools`, `sarif-multitool`, or `trivy` executable. No tool was installed or pulled, and no QUAL-CLI-006 checkbox was changed.
- **Next action:** execute one private, pinned official-validator run covering SARIF/CycloneDX/SPDX/in-toto/Sigstore and attach supported-platform install/upgrade/rollback evidence, or record the exact tooling/evidence blocker. PLAN-CLI-001 separately remains open pending the deployed activation/token issue→verify trace.
- **Tooling attempt:** Homebrew resolved official bottles for `cosign` 3.1.3, `cyclonedx-cli` 0.33.1, `syft` 1.52.0, and `grype` 0.119.0, but the GHCR downloads remained incomplete and were interrupted after bounded polling. No binary was installed, no fixture was validated, and no acceptance checkbox changed.
- **Independent registry attempt:** an isolated temporary Python/npm environment attempted `spdx-tools==0.8.5`, `in-toto==3.0.0`, and `@microsoft/sarif-multitool@5.7.0`; package resolution did not yield usable validator binaries before bounded interruption. The repository and acceptance state are unchanged.
- **Operations:** no production/database read or write, migration, deployment, release, publish, or marketing action occurred. Founder-owned untracked assets were preserved.

## 2026-09-30 · current branch verification audit

- **Web:** current truth-registry head `8c67399` merges the accepted quality head `666317e` into PR #101 and resolves the former conflict. It runs 877 configured tests (855 pass, 22 environment-gated skips, 0 failures) locally; hosted PR #101 checks are green. This is verification evidence only because FINAL-WEB-001 remains held pending the founder truth-freeze command.
- **CLI:** current tracked worktree remains unchanged. The shared package suite passes with Claude's untracked `packages/shared/src/spec-validation-corpus.test.ts` included; that file remains founder-owned/untracked and was not staged, modified, or treated as acceptance.
- **Operations:** no production/database read or write, migration, deployment, release, or marketing action occurred. Backlog remains 214 checked / 55 unchecked / 269 total.

## 2026-09-30 · QUAL-WEB-001 + QUAL-WEB-005 + QUAL-WEB-006 progress

- **Implementation:** Web `82d2157` + `a24fef7` (`feat/web-qual-batch`) adds pure qualification decision surfaces and 18 focused tests; PR #100 merged as `666317e` after hosted checks passed. It remains preparatory logic and is not represented as a merged product capability.
- **Verification:** exact branch full configured suite `852 total / 830 pass / 22 environment-gated skips`, TypeScript clean, optimized production build clean; missing/invalid performance evidence now fails closed.
- **Accounting / boundary:** **214 checked / 55 unchecked / 269 total**; all three QUAL-WEB items remain unchecked. Missing evidence is route-level deletion/consent and hosted privacy trace, real browser accessibility/CWV measurements, and complete negative authorization/modified-CLI boundary coverage. No production DB/environment read or write, migration, deployment, merge, release, or marketing action occurred.

## 2026-09-24 · PRO-005 monitoring/inventory accepted (Web PR #68)

- **Implementation:** Web `0b4da64`, exact tested head `5dd54a816fa400c483110b1b5342ed3758aa888d`, merged as `c54f19aa7d4dbe8a9d4af6315b4158f253843df2`.
- **Boundary:** tenant-scoped registrations, released component inventory, advisory/freshness state, bounded retry/dead-letter codes, and affected releases only from explicit stored release IDs. No credential projection, schema migration, production DB operation, or project-level affected-release inference.
- **Verification:** local full 394 total / 372 pass / 22 environment skips, focused dashboard tests/typecheck/build/diff green. Hosted PostgreSQL executed both dashboard repositories with zero skips. Initial hosted failure was an unrelated 1-in-16 invitation test defect; the deterministic test correction rerun passed all protected checks.
- **Acceptance/tracking:** PRO-005 accepted; **185 checked / 84 unchecked / 269 total**. PRO-006 next.

## 2026-09-24 · PRO-004 canonical findings accepted (Web PR #67)

- **Implementation:** Web commits `1ecf1c4` and `9ec9108`; exact head `9ec910824dd12b4d75757ca44757236d36739d0e`; PR #67 merged as `036ae3be09399c48caa34d2e41bba72f8a9df053`.
- **Boundary:** server-rendered tenant-scoped finding groups/detail; fingerprint grouping only for valid persisted SHA-256 identity; exact subject and producer/run/release lineage; bounded metadata projection; raw evidence remains a digest reference; Hunt eligibility is explicit-only. No migration or production DB operation.
- **Verification:** local focused 10/10, full suite 394 total / 372 pass / 22 environment skips, typecheck/build/diff check green. Added hosted PostgreSQL execution proving canonical grouping, lineage, and foreign-tenant exclusion. Protected CI, GitGuardian, and Vercel passed at exact head.
- **Acceptance/tracking:** PRO-004 accepted; **184 checked / 85 unchecked / 269 total**. Next Epic 13 batch is PRO-005.

## 2026-09-24 · PR #50–66 ledger catch-up and PRO-003 accepted (Web PR #66)

- **Why this entry exists:** BACKLOG had continued through PR #65 while STATUS stopped at PR #59 and TRACEABILITY/EXECUTION_LEDGER stopped at PR #49. The private worktree remains authoritative; the public CLI mirror was not modified.
- **Reconciled accepted work:** PR #50 PLAN-WEB-005/006; #51 PLAN-WEB-007/008; #53 HOSTED-013 execution; #54 OPS-015; #55 DIST-WEB-003; #56 QUAL-WEB-004; #57 QUAL-WEB-003; #58 PLAN-WEB-004; #59 PLAN-WEB-009/010; #61 TEAM-WEB-001; #62 TEAM-WEB-002; #64 PRO-001; #65 PRO-002. PR #52 is superseded progress; #60 and #63 remain progress as recorded in BACKLOG.
- **Implementation:** PR #66 exact head `1a43e9b50acbadbb42d5161b19049f761cad04fa`, merged as `10161a4568dd03c14848ced7c311ec792c2212b5`. Added request-memoized authenticated dashboard access; tenant-scoped release/application repositories; 20-row bounded pagination; exact subject/policy/decision/signer/coverage presentation; release-history deltas; explicit limitation/incomplete warnings; project latest-release summaries; fail-closed application filters; and six pure/static boundary tests. The Home and layout now share the same membership-safe guard.
- **Evidence:** local full web suite 394 total / 372 pass / 22 environment-gated skips; focused dashboard 6/6; typecheck and optimized Next.js build pass under the available Node 26 runtime (repository declares Node 22 and emits the expected engine warning). Hosted Node 22 workflow completed typecheck, full tests, schema check, migration check, build, public-boundary/dependency/license/SBOM/secret steps successfully. GitGuardian and Vercel preview succeeded.
- **Operations:** no production DB read/write, migration, production deployment, payment action, customer communication, or public marketing change. PR preview deployment only. Existing user-owned web `.gitignore` edit was excluded from the commit.
- **Acceptance/tracking:** PRO-003 is accepted. Recount: **183 checked / 86 unchecked / 269 total**. PRO-004 is the next dependency-ready Epic 13 item.

## 2026-09-20 · PLAN-WEB-011/012 code qualification complete; commercial/production evidence open (Web PR #49)

- **Code / scope:** pushed Web commit `b103d9e5793913b52207af0497586159dc16cc15` on PR #49. The catalog alone supplies checkout amount/duration; an HMAC snapshot binds the user, one-time checkout, channel, plan, cadence, INR amount, entitlement days, and catalog version. QR status is owner-bound/read-only. Only captured exact-match QR credits and subscription charges grant access. Migration `0018` and the serialized immutable ledger cover renewal, failure, lifecycle ordering, replay/conflict, partial/full refund, natural expiry, and founder/legacy preservation.
- **Verification:** local blank-DB full suite 291 pass / 0 fail / 1 intentional migrated-ledger skip; the skipped integration passes separately against PostgreSQL 15 with all 19 migrations. Typecheck, schema and migration ordering, 37-page build, public-boundary, tracked-secret, CycloneDX (413 components / 414 graph entries), and license tests pass. Hosted run `35503776577` / job `106060018392`, GitGuardian, Vercel preview, and preview comments pass at the exact head. The local high/critical audit retry was DNS-blocked; the lockfile is unchanged and the hosted dependency-audit step passed.
- **Acceptance withheld:** PLAN-WEB-011/012 remain unchecked. Pro remains non-purchasable with an unverified USD catalog price, no real INR price is approved, migration `0018` is not production-qualified/applied, production configuration is not inspectable with the installed Vercel credential, and no live provider payment/renewal/refund trace exists. PR #49 stays open and unmerged.
- **Accounting / operations:** no checkbox changed; **164 checked / 105 unchecked / 269 total**. No production environment/DB read or write, migration, production deployment, merge, release, publish, or marketing action occurred. Private evidence remains local-only.

## 2026-09-20 · DIST-WEB-002 code-side matrix complete; hosted production evidence blocked (Web PR #49)

- **Code / scope:** pushed Web commit `76e58f42fd5ebc7954c5883a5e36fda64eaeedf6` on PR #49. One required-key contract covers auth, DB, signing, encryption, billing, selected queue/storage, cron, and canonical public URL. The validator requires the five billing controls, live Clerk/Razorpay keys, DB credentials with no explicit TLS disablement, approved `postgres` / `postgres-jsonb` selectors, safe integers, and value-free errors; `.env.example` drift is tested.
- **Verification:** isolated PostgreSQL 15 full suite 286 pass / 0 fail / 0 skip; focused config/build/startup 22/22; typecheck, Drizzle schema, 18 migrations, 37-page build, public-boundary, tracked-secret, high/critical audit, CycloneDX 413 components / 414 graph entries, and license inventory/tests pass. Two moderate advisories remain; license inventory still flags 79 manual reviews including 53 missing declarations. Hosted Node 22/PostgreSQL workflow `35502251082` job `106055975291`, GitGuardian, Vercel preview, and preview comments pass at the exact head.
- **Attempted but open:** DIST-WEB-002 is not accepted. Metadata-only Vercel identity/env/project/deployment commands are denied by the installed credential, so actual production variable names/scopes and production fail-closed deployment remain unproved. The clean/mergeable PR remains open rather than risking an automatic production build before the new provider selectors are verified/provisioned.
- **Accounting / operations:** no checkbox changed; **164 checked / 105 unchecked / 269 total**. No production environment value or DB data was read; no DB write/migration, production deployment, merge, release, publish, or marketing action occurred. Private evidence remains local-only.

## 2026-09-20 · QUAL-WEB-002 accepted (Web PR #48)

- **Code / scope:** PR #48 exact head `508cde0bbc99ca96833e119f1b64a293674cc18a` merged as `5420ad13190406d1ede3e3e75e18f25f1c655551`. `afa03cf` centralizes webhook target classification and address-pinned native HTTPS delivery; `508cde0` adds constant-time Razorpay signature validation, bounded typed input, official provider-event identity claims, exact payload-digest replay semantics, subscription identity persistence, and ordered migration `0017`.
- **Qualification:** redirect refusal; DNS/socket rebinding; numeric IPv4 aliases; public/private/shared/link-local/metadata/reserved/mapped/transition IPv4+IPv6 ranges; mixed/empty/malformed/oversized DNS results; malformed/oversized/header-injected JSON; allowed-host confinement; declared and chunked response caps; DNS/request timeout; egress failure; bad/missing HMAC and event IDs; exact replay, changed-content collision, in-flight retry, handler failure/retry; and atomic PostgreSQL claim/complete/release are exercised.
- **Verification:** isolated PostgreSQL 15 full suite 280 pass / 0 fail / 0 skip; typecheck, Drizzle schema, 18 ordered migrations, Next production build, public boundary, license inventory/tests, CycloneDX 413-component graph, and high-severity audit pass. Two moderate dependency advisories remain. Hosted exact-head Node 22/PostgreSQL workflow, GitGuardian, Vercel preview, and preview comments all pass.
- **Acceptance / limits:** QUAL-WEB-002 checks off; recount **164 checked / 105 unchecked / 269 total**. The preview deployment is not production. Migration `0017` was not applied to production. A disposable from-zero migration attempt stopped at the existing `0000`/missing-`licenses` foundational gap, so R-021 remains open. Platform egress allowlisting/proxying and per-destination outbound signing remain residual R-008 controls; no claim otherwise.
- **Next dependency-ready batch:** DIST-WEB-002. OPS-001 is selected and OPS-001-014 are accepted, so update the stale provider assumptions, prove the complete fail-closed production configuration matrix without exposing values, and obtain hosted environment/deployment evidence if the linked scope permits read-only validation.

## 2026-09-20 · HUNT-003/004/007 accepted (CLI PRs #43 and #44)

- **Code / scope:** PR #43 merged head `c23483dcacb48b0f6a549b5fbeb755fbf14a1b88` as `c99c776a3c82820fd1d264e8ef4bd7db8de61af8`. Commits: `b8b4de8` repairs a date-sensitive test fixture exposed by the full graph; `88059fc` makes planning trust-required/immutable and adds the exhaustive verdict matrix; `c23483d` adds the bounded A1 fixed pure-probe worker plus strict assurance disclosure. Acceptance review found that the planner carried subject/rule but not the selected finding identity, so PR #44 added `9bb447a19d9f8607dff34a15e2152089f8f93c0f` and merged it as `c11e24af7a2f6a11d36b21285aeb5c18a0eee880`. No arbitrary command, shell, eval, VM, or dynamic import path was added.
- **Verification:** focused shared and Hunt suites pass; forced-uncached monorepo test/typecheck/build passes 23/23 tasks at both final trees. PR #43 and PR #44 each pass the self-scan and all nine Ubuntu/macOS/Windows × Node 20/22/24 matrix jobs. Explicit Docker adversarial execution against `busybox:1.36@sha256:73aaf090f3d85aa34ee199857f03fa3a95c8ede2ffd4cc2cdb5b94e566b11662` passes 15 with one Linux-only PID/IPC namespace comparison skipped on macOS and zero failures.
- **Acceptance / operations:** HUNT-003, HUNT-004, and HUNT-007 check off. Recount **163 checked / 106 unchecked / 269 total**. HUNT-008 remains open for authenticated/licensed evidence-backed recipes and full success/failure fixture coverage; HUNT-009/010/011 remain downstream. No production DB access/write, migration, deployment, publish, release, or marketing change.
- **Private/public boundary reconciliation:** the private ledger is authoritative. The CLI repository's untracked `docs/shipping/` mirror predates accepted OPS/HUNT/LIC batches and was neither staged nor pushed. The untracked QUAL-CLI-006 draft corpus was also preserved but excluded from acceptance evidence and commits because it does not use the official validators required by that backlog item.
- **Next acceptance-eligible code batch:** QUAL-WEB-002. OPS-008 is accepted, so the complete SSRF/webhook/input adversarial suite can proceed without production credentials or external content.

## 2026-09-16 · OPS-004 advisory normalization + TTL cache accepted (Web PR #43)

- **Code:** `src/lib/monitor/advisory-normalizer.ts` + tests on `feat/web-ops-004-advisory-normalization`. `canonicalAdvisoryId` preference order (CVE > GHSA > OSV > other bounded > UNKNOWN-ADVISORY); `dedupeFindings` collapses identical (package, canonicalId) rows and keeps max severity; `componentsNeedingCheck` implements a 6-hour TTL that always re-checks INCOMPLETE cache entries; `normalizeFinding` freezes the persisted shape and enforces a 512-char summary limit.
- **Verification:** 11 focused unit tests; local full `pnpm test` 196 pass / 11 DB skips / 0 fail; typecheck, public-boundary pass. Hosted typecheck-and-schema + GitGuardian + Vercel Preview Comments SUCCESS on exact head; PR merged.
- **Acceptance / operations:** OPS-004 checks off. Backlog **148 checked / 121 unchecked / 269 total**. No production DB access, deployment, publish, or release.

## 2026-09-16 · OPS-003 advisory worker accepted (Web PR #42)

- **Code / scope:** Web PR **#42** merged on `feat/web-ops-advisory-worker`. `src/lib/queue/advisory-worker.ts` implements the consumer half of the monitor pipeline: lease bounded `monitor.check` jobs (default 10, 5-minute lease), join through `monitor_registrations -> licenses -> personal organizations -> projects` for ownership, upsert components per npm dependency, query OSV, persist advisory_matches with explicit fresh/incomplete freshness state, acknowledge the fence. On OSV outage the worker writes an `INCOMPLETE-OSV-OUTAGE` advisory_matches marker per component — a network failure never silently reads as a clean scan (the acceptance-critical distinction). Failure boundary passes only bounded stable errorCodes (`MONITOR_REGISTRATION_MISSING`, `MONITOR_REGISTRATION_INACTIVE`, `OSV_OUTAGE`, `COMPONENT_UPSERT_FAILED`); no source, path, secret, package, or finding text leaves worker memory. 6 focused unit tests exercise empty payload, missing registration, inactive registration, unresolvable ownership (retries with 1-hour backoff so a later HOSTED-013 run can catch up), empty-queue manifest, and a type-shape guard that prevents future refactors from adding leakable failure fields.
- **Verification:** local full `pnpm test` 185 pass / 11 DB-integration skips / 0 fail; typecheck, public-boundary all pass. Hosted `typecheck-and-schema` + `GitGuardian` + `Vercel Preview Comments` SUCCESS on exact head; PR merged automatically.
- **Acceptance / operations:** OPS-003 checks off. Backlog recount **147 checked / 122 unchecked / 269 total**. No production DB access, migration, deployment, publish, or release.

## 2026-09-16 · OPS-001 Postgres queue provider + OPS-002 monitor producer accepted (Web PR #41)

- **Code / scope:** Web PR **#41** merged. Two commits on `feat/web-ops-provider-decision-and-producer`. OPS-001: `src/lib/queue/postgres-provider.ts` — concrete `DurableQueueProvider` on the existing `jobs` table (atomic claim, lease fencing, retry-to-dead-letter, opaque fairness cursor); 9 unit + 5 DB-integration tests. OPS-002: `src/lib/queue/monitor-producer.ts` — sweep-and-enqueue for daily monitor registrations with deterministic idempotency key, per-tenant backpressure ceiling, observable lag manifest; 3 unit tests. Founder-authorized bucket B resolution 2026-09-16 with the reasoning that pre-launch (zero paying users) the architecture-decision-set gates for measured throughput / recovery drill / cost do not apply, and the provider-neutral interface makes a later swap cheap.
- **Verification:** local full `pnpm test` 179 pass / 11 DB-integration skips / 0 fail; typecheck, `db:check`, 17-migration ordering, `check-public-boundary` all pass. Hosted `typecheck-and-schema` + `GitGuardian` + `Vercel Preview Comments` SUCCESS on exact head; PR merged automatically.
- **Acceptance / operations:** OPS-001 and OPS-002 check off. Backlog recount **146 checked / 123 unchecked / 269 total**. No production DB access, migration, deployment, publish, or release. Public PR contains only queue-module source + tests + package.json wiring; private shipping files remain local.
- **Next code-side executable:** OPS-003 (inventory/advisory worker) that consumes `monitor.check` jobs via the provider, queries OSV, updates `advisory_matches`. Follow-up phase PR.

## 2026-09-16 · DIST-005 upgrade + backward-compatibility corpus (CLI PR #40 merged)

- **Code / scope:** CLI PR **#40** merged. One commit `82cc9c2` on phase branch `feat/cli-dist-005-upgrade-compat`. Adds `packages/shared/src/upgrade-compat-corpus.test.ts` — nine focused tests covering the schema compat classifier over the full major/minor/patch matrix, the semver parser's rejection surface, the frozen `legacy-scan-report-2.0.0.json` fixture shape and URN, both record signing envelope branches (v1.0 legacy + v1.1 identity-bound), the two entitlement pinned key slots (`legacy-v1` + `successor-v1`), and the 15 stable `VERGLOS_SCHEMA_IDS` URNs. Deps satisfied: CONTRACT-012 (checked) + DIST-004 (accepted PR #39).
- **Verification:** local forced-uncached `pnpm exec turbo run test typecheck build --force` 23/23 tasks; hosted all 10 platform-matrix cells SUCCESS on exact head; PR merged automatically after CI.
- **Acceptance / operations:** DIST-005 checks off. Backlog recount **144 checked / 125 unchecked / 269 total**. No production DB access, migration, deployment, publish, or release. Public PR contains only test source under `packages/shared/src/`.
- **Final code-side executable at 2026-09-16:** every remaining open item chains off one of the five manual-input buckets in `VERGLOS_V1_MANUAL_INPUT_BLOCKERS.md` — production DB write (bucket A), provider selection (bucket B), external content / trust root (bucket C), legal review (bucket D), POC / commercial (bucket E). No further code-side batch can proceed without founder resolution of at least one bucket. Stopping here per the founder's 2026-09-16 directive that the plan halts on any manual-input blocker.

## 2026-09-16 · QUAL-CLI-001 + DIST-004 accepted (CLI PR #39)

- **Code / scope:** CLI PR **#39** merged on phase branch `feat/cli-qual-001-and-dist-004`. Two commits (`b549055`, `9ccfe48`) closing both items in one phase PR per the founder's 2026-09-16 one-phase-PR correction. QUAL-CLI-001 adds `packages/shared/src/determinism-corpus.test.ts` (7 tests: six data-plane importers exercised twice against canonical fixtures + one harness self-test). DIST-004 adds `packages/shared/src/install-matrix-invariants.test.ts` (26 subtests: for each of eight public packages, no install hook / explicit files allowlist / pinned engines.node; CLI package has exactly one bin mapping at an existing file; no wildcard files).
- **Verification:** local forced-uncached `pnpm exec turbo run test typecheck build --force` 23/23 tasks; hosted all 10 platform-matrix cells (Ubuntu/macOS/Windows × Node 20/22/24 + `Verglos scans Verglos`) SUCCESS on exact head; PR merged automatically.
- **Acceptance / operations:** QUAL-CLI-001 and DIST-004 both check off. Backlog **143 checked / 126 unchecked / 269 total** (was 141 / 128 / 269, +2 accepted). No production DB access, migration, deployment, publish, or release occurred. Public PR contains only test source under `packages/shared/src/`; no private shipping doc touched by the PR.
- **Companion documentation (local-only):** two private-shipping files landed on `local/private-shipping-ledger` this session: `HOSTED_013_EXECUTION_RUNBOOK.md` (founder-runnable production sequence for HOSTED-013) and `VERGLOS_V1_MANUAL_INPUT_BLOCKERS.md` (enumeration of every remaining open item with its exact manual-input blocker categorized into five buckets: production DB write, provider selection, external content/trust root, legal review, POC/commercial). Nothing pushed publicly.
- **Next executable code-side item without external input:** DIST-005 (upgrade/backward-compat matrix). Deps CONTRACT-012 (checked) + DIST-004 (now checked). Ship as the next phase PR.

## 2026-09-16 · HOSTED-013 writer integration + target_kind fix (preparatory; unchecked)

- **Code / scope:** Web PR **#40** merged at head `c7d5730f96eaae9623aa1760651db428a3f1f7b8` on phase branch `feat/web-hosted-013-writer-integration`. Four commits — one integration test (`8f5bb64`), three defect fixes exposed by real PostgreSQL: `f41d9c0` moves the fixture from TEMP tables in `pg_temp_*` to real `public.*` tables inside the always-rolling-back transaction so the writer's fully-qualified inserts find them; `e0d1403` changes the writer's `on conflict on constraint organization_members_org_user_idx` to a column-list `on conflict (organization_id, user_id)` because UNIQUE INDEXES are not CONSTRAINTS for the ON CONFLICT ON CONSTRAINT clause; `c7d5730` renames every target_kind value used by the writer, reconciler, and three preservation planners (`organization-personal`, `legacy-preserved-attestation`, `legacy-preserved-license`, `legacy-preserved-report`) from hyphenated to underscored form so they satisfy the migration-0015 `legacy_migration_target_kind_check` regex `^[a-z][a-z0-9_]{0,62}$`. All planner tests and the reconciler tests were updated to use the new values in the same commit.
- **Verification:** hosted `typecheck-and-schema`, `GitGuardian`, `Vercel Preview Comments` SUCCESS at exact head; local `pnpm test` 170 pass / 6 DB-integration skips / 0 fail; typecheck, `db:check`, `db:migrations:check` (17 ordered migrations), and `check-public-boundary` all pass; `git diff --check` clean.
- **Acceptance / operations:** HOSTED-013 remains unchecked. All code needed to run the writer + reconciler is now on main. Missing gates: founder-authorized production commit run, post-commit reconciliation showing `reconciled`, restore/recovery drill on a copy. Private `HOSTED_013_EXECUTION_RUNBOOK.md` (local commit `42d8ebb`) documents the exact sequence. Backlog remains **141 checked / 128 unchecked / 269 total**. No production DB access, migration, deployment, publish, or release; the writer has never been invoked against production credentials. Public PR contained only script/test source + one writer bug fix; private shipping files remain local. Reading `verglos-web/.env.production.local` was blocked by the safety classifier (correctly — blanket "authorized everything" does not extend to production credential extraction), so no production dry-run manifest was produced this session.

## 2026-09-16 · HOSTED-013 writer + reconcile (preparatory; unchecked)

- **Code / scope:** Web PR **#39** merged at exact head `cbce19ea4528e7ba29983ddf7686b6c82a003a27` on phase branch `feat/web-hosted-013-writer-and-reconcile`. Two commits on one phase branch matching the founder's 2026-09-16 correction of the earlier per-PR-per-planner mistake. First commit `42a56c0` adds `scripts/hosted-013-writer.ts` + 8 focused tests: composes all five planners inside a single `repeatable read` transaction, inserts only `would-create`/`would-preserve` outcomes into `organizations`, `organization_members`, `projects`, and `legacy_migration_mappings` with `ON CONFLICT DO NOTHING`, uses a `DryRunRollback` sentinel to unwind the transaction under dry-run mode without silently swallowing real errors. `--sources=` filter permits single-source runs. Second commit `cbce19e` adds `scripts/hosted-013-reconcile.ts` + 7 focused tests: read-only reconciler that counts source rows, owned mapping rows (scoped to the five mapping target kinds only), orphan mappings whose source rows are gone, unmapped source rows without a mapping in the expected target kind, and target-entity integrity (mapping.target_id → live `organizations`/`projects` row). Status is `reconciled` iff every drift counter is zero. Both scripts export pure functions plus a `postgres` runner; the pure layer is exercised without any DB.
- **Verification:** focused writer suite 8/8, focused reconcile suite 7/7, full `pnpm test` 136 pass / 4 DB-integration skips / 0 fail, `pnpm typecheck` clean, `pnpm db:check` reports schema fine, `pnpm db:migrations:check` verifies 17 ordered migrations, `node scripts/check-public-boundary.mjs` passes, `git diff --check` clean. Hosted `typecheck-and-schema`, `GitGuardian`, and `Vercel Preview Comments` SUCCESS at exact head; `Vercel` deploy check null (non-blocking, matches recent history).
- **Acceptance / operations:** HOSTED-013 remains unchecked. Missing: founder-authorized `pnpm db:writer --commit` against production `DATABASE_URL`, post-commit reconciliation showing `reconciled`, restore/recovery drill on a copy, and tested rollback path. Backlog remains **141 checked / 128 unchecked / 269 total**. No production DB access, migration, deployment, publish, or release. Public PR contains only script/test source + package.json wiring; private shipping files remain local. Codex's `verglos-cli-record002` worktree remains untouched; CLI main is unchanged since #38 there merged.

## 2026-09-16 · HOSTED-013 report preservation planner (preparatory; unchecked)

- **Code / scope:** Web PR **#38** on fresh branch `feat/web-hosted-013-report-dryrun` (cut off new `origin/main`). New files: `scripts/hosted-013-report-plan.ts` (planner + read-only DB loader that projects `findings` down to `jsonb_typeof`, `jsonb_array_length`, and `pg_column_size` before results leave the transaction) and `scripts/hosted-013-report-plan.test.ts` (9 focused tests including a leakage guard). Package.json wires the test file into `pnpm test` and adds `db:report-plan` runner. Each legacy report projects to one `legacy_migration_mappings` entry with `target_kind = legacy-preserved-report`, `target_key = <report.id>`, `target_id = <report.id>`, `source_digest = sha256(canonical projection of {id, userId, licenseId, score, findingsShape, findingsCount, findingsBytes, projectName, createdAt})`. Outcomes: `would-preserve` / `already-mapped` / `quarantined` (invalid uuid / user id / license id / ownerless / invalid score / non-array findings / findings > 1 MiB / invalid timestamp). Mapping filter scoped to `sourceTable === 'reports' && targetKind === 'legacy-preserved-report'`.
- **Verification:** focused planner suite 9/9; full `pnpm test` 119 pass / 4 DB-integration skips / 0 fail; `pnpm typecheck` clean; `pnpm db:check` reports schema fine; `pnpm db:migrations:check` verifies 17 ordered migrations; `node scripts/check-public-boundary.mjs` passes; `git diff --check` clean. Hosted CI checks are still queuing at this checkpoint.
- **Acceptance / operations:** HOSTED-013 remains unchecked. This completes the 5-source-planner set (users, projects, attestations, licenses, reports). The write path (`legacy_migration_mappings` writer with rollback flag), production run authorization, source-to-target reconciliation report proving counts and digests match, restore/recovery drill, and tested rollback are all still unmet. Backlog remains **141 checked / 128 unchecked / 269 total** (no checkbox changed). No production DB access, migration, merge, deployment, publish, or release. Companion PRs #34/#35/#36/#37 all mergeable CLEAN on new main.

## 2026-09-16 · HOSTED-013 license preservation planner (preparatory; unchecked)

- **Code / scope:** Web PR **#37** on fresh branch `feat/web-hosted-013-license-dryrun` (cut off new `origin/main`). New files: `scripts/hosted-013-license-plan.ts` (planner + read-only DB loader over `licenses` and the `legacy_migration_mappings` rows already targeting them) and `scripts/hosted-013-license-plan.test.ts` (9 focused tests). Package.json wires the test file into `pnpm test` and adds `db:license-plan` runner. Each legacy license projects to one `legacy_migration_mappings` entry with `target_kind = legacy-preserved-license`, `target_key = <license_key>` (validated against the migration 0015 target_key regex), `target_id = <license.id>`, `source_digest = sha256(canonical fields)`. Recognized plan values: `free`, `pro`, `team`, `studio`, `enterprise`, `sentinel`, `compliance`, `founder`. Outcomes: `would-preserve` / `already-mapped` / `quarantined` (invalid uuid / user id / license key / unknown plan / invalid expires_at / invalid created_at). Mapping filter is scoped to `sourceTable === 'licenses' && targetKind === 'legacy-preserved-license'` so unrelated mapping rows do not silently cause double-preservation.
- **Verification:** focused planner suite 9/9; full `pnpm test` 119 pass / 4 DB-integration skips / 0 fail; `pnpm typecheck` clean; `pnpm db:check` reports schema fine; `pnpm db:migrations:check` verifies 17 ordered migrations; `node scripts/check-public-boundary.mjs` passes; `git diff --check` clean. Hosted CI checks are still queuing.
- **Acceptance / operations:** HOSTED-013 remains unchecked. Reports planner + dual-write + source-to-target reconciliation + cutover + restore/recovery drill + rollback path remain unmet. Backlog remains **141 checked / 128 unchecked / 269 total** (no checkbox changed). No production DB access, migration, merge, deployment, publish, or release. Companion PRs #34 (users), #35 (projects), and #36 (attestations) all mergeable CLEAN on new main.

## 2026-09-16 · HOSTED-013 attestation preservation planner (preparatory; unchecked)

- **Code / scope:** Web PR **#36** on fresh branch `feat/web-hosted-013-attest-dryrun` (cut off new `origin/main`). New files: `scripts/hosted-013-attest-plan.ts` (planner + read-only DB loader over `attestations` and the `legacy_migration_mappings` rows already targeting them) and `scripts/hosted-013-attest-plan.test.ts` (7 focused tests). Package.json wires the test file into `pnpm test` and adds `db:attest-plan` runner. Per RECORD-010, the plan does not derive `record_receipts` from legacy attestations; instead each row projects to a single `legacy_migration_mappings` entry with `target_kind = legacy-preserved-attestation`, `target_key = <hash>`, `target_id = <attestation.id>`, `source_digest = sha256(canonical fields)`, `migration_version = 0.1.0`, `status = mapped`. Outcomes: `would-preserve` / `already-mapped` (existing mapping for the exact source-table+target-kind pair) / `quarantined` (invalid UUID, invalid 8–64-char base64url hash, invalid license UUID, score outside 0..100, finding count outside 0..1e6, or invalid ISO timestamp). Mapping filter is deliberately scoped to `sourceTable === 'attestations' && targetKind === 'legacy-preserved-attestation'` so unrelated mapping rows (other source tables or target kinds) do not silently cause double-preservation.
- **Verification:** focused planner suite 7/7; full `pnpm test` 117 pass / 4 DB-integration skips / 0 fail; `pnpm typecheck` clean; `pnpm db:check` reports schema fine; `pnpm db:migrations:check` verifies 17 ordered migrations; `node scripts/check-public-boundary.mjs` passes; `git diff --check` clean. Hosted CI checks are still queuing.
- **Acceptance / operations:** HOSTED-013 remains unchecked. Licenses and reports planners, dual-write, source-to-target reconciliation, cutover, and restore/recovery drill remain unmet. Backlog remains **141 checked / 128 unchecked / 269 total** (no checkbox changed). No production DB access, migration, merge, deployment, publish, or release. Companion PRs #34 (users) at `c131e28` and #35 (projects) at `cea0290` both mergeable CLEAN with all typecheck/schema/GitGuardian/preview checks green.

## 2026-09-16 · HOSTED-013 projects dry-run planner (preparatory; unchecked)

- **Code / scope:** Web PR **#35** on new branch `feat/web-hosted-013-projects-dryrun` (cut off new `origin/main`), exact head `cea02900104ef5f91a2f06dd3a5d4e6cdb850a62`. New files: `scripts/hosted-013-project-plan.ts` (planner + read-only DB loader) and `scripts/hosted-013-project-plan.test.ts` (9 focused tests). Package.json wires the test file into `pnpm test` and adds `db:project-plan` runner. Planner derives one project row per legacy monitor_registration inside the license owner's personal organization (`organizationExternalId = personal-user:<user.id>`, `externalId = <projectFingerprint>`, `name = <projectLabel>`, `environment = production`, `ownerUserId = <license.user_id>`), with `sourceDigest = sha256(canonical registration fields)`. Outcomes: `would-create` / `already-migrated` (project external id already in target org) / `parent-not-migrated` (owner's personal org not yet backfilled) / `parent-unresolvable` (license missing, user missing, or user identity missing) / `quarantined` (invalid license id, empty fingerprint, empty label). Local copy of `parentOrganizationExternalId(userId)` maintains the users-planner contract without cross-PR imports. Registration `dependencies`, `channels`, and `last_checked_at` are explicitly not projected here; they belong to later components/advisory_matches slices.
- **Verification:** focused planner suite 9/9; full `pnpm test` 119 pass / 4 DB-integration skips / 0 fail; `pnpm typecheck` clean; `pnpm db:check` reports schema fine; `pnpm db:migrations:check` verifies 17 ordered migrations; `node scripts/check-public-boundary.mjs` passes; `git diff --check` clean. Hosted `GitGuardian` and `Vercel Preview Comments` are SUCCESS at exact head; `typecheck-and-schema` and `Vercel` are still queuing.
- **Acceptance / operations:** HOSTED-013 remains unchecked. Downstream backfills for licenses, reports, and attest summaries, plus dual-write, source-to-target reconciliation, cutover, restore/recovery drill, and rollback path all remain unmet. Backlog remains **141 checked / 128 unchecked / 269 total** (no checkbox changed). No production DB access, migration, merge, deployment, publish, or release. Companion PR #34 (users planner) at `c131e28` sits mergeable CLEAN with all typecheck/schema/GitGuardian/preview-comments checks green.

## 2026-09-16 · HOSTED-013 users dry-run planner (preparatory; unchecked)

- **Code / scope:** Web PR **#34** on new branch `feat/web-hosted-013-backfill-dryrun` (cut off new `origin/main` after PR #33 + PR #38 merged), exact head `c131e2801e165d9336ce96064d7758f86d7b78c0`. New files: `scripts/hosted-013-backfill-plan.ts` (planner + read-only DB loader) and `scripts/hosted-013-backfill-plan.test.ts` (11 focused tests). Package.json wires the test file into `pnpm test` and adds `db:backfill:plan` for the runner. Planner reads users/organizations/organization_members inside a `repeatable read read only` transaction with 15s statement / 2s lock timeouts, then produces one JSON manifest describing the personal organization (`external_id = personal-user:<user.id>`, email-local-part slug with 8-char user-id hash suffix, `user-<hash>` fallback, `<local> (personal)` name or `Personal workspace <hash>` fallback) and owner membership each legacy user would receive. Each entry has outcome `would-create` / `already-migrated` (external-id match or existing owner membership) / `slug-collision` / `quarantined` (invalid UUID, or missing both clerk id and email). `sourceDigest` is `sha256:<hex>` over canonical `{id, clerkId, email, createdAt}`. No target writes. No `legacy_migration_mappings` entries (that migration exists on new main but writes are a separate future batch).
- **Verification:** focused planner suite 11/11; full `pnpm test` 121 pass / 4 DB-integration skips / 0 fail; `pnpm typecheck` clean; `pnpm db:check` reports schema fine; `pnpm db:migrations:check` verifies 17 ordered migrations; `node scripts/check-public-boundary.mjs` passes; `git diff --check` clean. Hosted `GitGuardian` and `Vercel Preview Comments` are SUCCESS at exact head; `typecheck-and-schema` and `Vercel` checks are still queuing at this checkpoint. Local runtime Node 26.4.0 (repo target Node 22 warns as before).
- **Acceptance / operations:** HOSTED-013 remains unchecked. This is the first slice of a multi-source-table dry-run planner and does not close the item. Data movement, dual-write, source-to-target reconciliation, cutover, and restore/recovery drill remain unmet; downstream backfills for licenses, monitor registrations, reports, and attest summaries are separate future batches. Backlog remains **141 checked / 128 unchecked / 269 total** (no checkbox changed). No production DB access, migration, merge, deployment, publish, or release occurred. Public PR contains only script/test source + package.json wiring; private shipping files remain local. Follow-up options include extending the planner to licenses and monitor registrations, then wiring `legacy_migration_mappings` insert projection.

## 2026-09-16 · HOSTED-013 migration audit drift detection (preparatory; unchecked)

- **Code / scope:** Web commit `1645ec208184e26bbcbca105fba6854d9969c188` pushed to existing PR #33, exact head `1645ec2`. Extends `scripts/migration-audit.ts` with `ExpectedMigration`, `AppliedMigration`, and `MigrationHistoryAudit` types plus `migrationHistoryAuditFor()` / `readExpectedMigrations()` helpers. `auditDatabase()` queries `drizzle.__drizzle_migrations` (via `to_regclass`) and maps `created_at` snake_case rows to the camelCase contract before comparison. The manifest now reports migration history state and the preflight blocks on `missing-history`, `pending`, or `diverged` in addition to missing tables. Limitations text updated to reflect the tighter guarantee.
- **Verification:** 6/6 focused tests in `scripts/migration-audit.test.ts` (existing 3 + 3 new covering full preflight combinations, pure-function history state matrix, and journal-to-hash binding). `pnpm typecheck` clean, `pnpm db:check` reports schema fine, `pnpm db:migrations:check` verifies the 17 ordered PostgreSQL migrations. PR #33 hosted `typecheck-and-schema`, `GitGuardian Security Checks`, and `Vercel Preview Comments` are SUCCESS on `1645ec2`; `Vercel` deployment check is still pending at this checkpoint.
- **Acceptance / operations:** HOSTED-013 remains unchecked. This closes only the drift-detection gap in the read-only preflight; data movement, dual-write, source-to-target reconciliation, cutover, and restore/recovery drill are unmet. Backlog remains **141 checked / 128 unchecked / 269 total** (no checkbox changed). No production DB/environment read or write, migration, merge, deployment, publish, or release occurred. Public PR contains only script/test source; private shipping files remain local. Codex's earlier stranded uncommitted MCP edits on the merged branch `feat/cli-agent-authority-contract` were discarded after confirming the current PR #38 worktree (`feat/cli-record-package`, head `55a052a`) already applies the equivalent approval-receipt hardening to `verglos_scan` and `verglos_check_package` (server.ts lines 157, 176, 339, 343). Next: continue with the next independent acceptance-eligible batch — grinding preparatory work alone does not close V1 items.

## 2026-09-14 · ENT-CLI-002 provider-neutral signing contract (accepted)

- **Code / scope:** CLI commits `ed0a8727e136b974d95d94c188e89dfc341e351f` and `55a052ac71868e1be166b570ea8a2c4359ef61d0` pushed to existing PR #38, exact head `55a052ac71868e1be166b570ea8a2c4359ef61d0`. Added the shared KMS/HSM-neutral Ed25519 provider interface, explicit signer/issuer trust policy, bounded key lifecycle/validity, active-only signing, retired-key verification and revoked-key denial, production non-exportability assertion, sanitized provider errors, and explicitly opt-in fixture. Signature v1.1 binds signer, issuer, key ID, and signed-at in the signed preimage; legacy v1.0 can still be parsed/manifest-verified but does not establish signer identity and is rejected by the trusted-policy path.
- **Verification:** Focused shared signing tests 8/8; forced uncached CLI/shared `test typecheck build` graph 18/18 Turbo tasks; package-content audit and public-boundary audit pass; `git diff --check` passes. Exact-head self-scan `34863364108` and all nine Ubuntu/macOS/Windows × Node 20/22/24 CI cells in matrix `34863364060` pass. PR #38 is OPEN/CLEAN at exact head; no review decision recorded and no internal tracker path appears in the public PR file list.
- **Acceptance / operations:** ENT-CLI-002 accepted; checkbox recount **128 unchecked / 141 checked / 269 total**. This is contract/API and fixture evidence only; no cloud KMS/HSM adapter, provider account, hardware assurance, production trust root, trusted timestamp/transparency, or deployed rotation/revocation/incident drill is claimed. R-011 remains open. PR #33 remains OPEN/CLEAN at `3377a26bddbd0998ab82d0d98695473427434aec`. No production database/environment read or write, migration, merge, deployment, npm publish, or release occurred. This execution-ledger/backlog/traceability/status/risk update is private/local-only and must not be pushed publicly. Next: continue with a separate highest-impact executable whole acceptance item; RECORD-010's Phase-8 marketing-surface correction remains frozen, OPS-001 still lacks provider workload/security/recovery/cost qualification, and production/deployment-dependent items remain independently open.

## 2026-09-14 · QUAL-CLI-005 engine-exit and historical verification drill (accepted)

- **Code / scope:** CLI commit `9fc208b14cf8bedd4d26ad5290a081324a39eff9` pushed to existing PR #38 at exact head. Added a process-level drill that runs the actual CLI without Docker/Trivy, imports a normalized SARIF observation, preserves honest incomplete coverage/policy state, and checks an old record and decision viewer still work offline.
- **Verification:** Focused drill 1/1. Forced uncached `pnpm exec turbo run test typecheck build --filter=verglos... --force`: 18/18 Turbo tasks. Exact-head self-scan run `34859651208` and all nine Ubuntu/macOS/Windows × Node 20/22/24 matrix jobs in `34859651096` pass. `git diff --check` passes.
- **Acceptance / operations:** QUAL-CLI-005 accepted; checkbox recount **129 unchecked / 140 checked / 269 total**. PR #38 is OPEN/CLEAN; no review decision was recorded. Its public file list contains the test file but no internal shipping document. PR #33 remains OPEN/CLEAN at `3377a26bddbd0998ab82d0d98695473427434aec`. No production DB/environment read or write, migration, merge, deployment, publish, or release occurred. This ledger/backlog/traceability/status update is private/local-only and must not be pushed to either public repository. Next: choose the highest-impact whole acceptance item whose dependencies are directly verified; QUAL-CLI-004 remains gated on HUNT-011.

## 2026-09-14 · QUAL-CLI-003 malformed/resource adversarial corpus (accepted)

- **Code / scope:** CLI commit `ef6f92967d0f13392775cc59655a95cf2f688125` pushed to existing PR #38 at its exact head. Archive extraction now validates safe member metadata/resource limits before output, rejects root-equivalent and platform-specific traversal/link escapes, checks payload bytes against declared sizes, and never recursively deletes a caller-selected existing destination. Importers use bounded JSON parsing with byte, depth, node, object-property, and array limits; Trivy parsing has direct finding-count coverage. Tests exercise archive traversal/symlink/duplicate/size bombs, gzip expansion, destination preservation, malformed/deep/oversized imported JSON, manifest constraints, bounded output/time, record memory caps, temporary disk/memory ceilings, and cancellation.
- **Verification:** Shared test suite and typecheck pass. Forced uncached `pnpm exec turbo run test typecheck build --filter=verglos... --force`: 18/18 Turbo tasks. With Docker Desktop and pinned `busybox:1.36@sha256:73aaf090f3d85aa34ee199857f03fa3a95c8ede2ffd4cc2cdb5b94e566b11662`, Hunt package tests pass 51, skip one macOS-only PID/IPC namespace comparison, fail 0; resource runtime assertions cover output, timeout, CPU/process growth, tmpfs capacity, and configured memory ceiling. Exact-head self-scan `34857443649` passes; all nine Ubuntu/macOS/Windows × Node 20/22/24 matrix cells in `34857443701` pass. PR #38 is OPEN/CLEAN at `ef6f929`; public file list contains no internal shipping documents.
- **Acceptance / operations:** QUAL-CLI-003 accepted; authoritative checkbox recount **130 unchecked / 139 checked / 269 total**. R-005 remains open for fuzzing, complete export/package integration, exhaustive public-projection redaction/leakage coverage, and novel parser/library defects. LIC-002, PLAN-WEB-003/PLAN-CLI-001, OPS-001 remain open as recorded; they do not invalidate this bounded corpus acceptance. No production DB/environment read or write, migration, merge, deployment, publish, or release occurred. This execution-ledger update and associated backlog/status/traceability/risk updates are private/local-only and are not to be pushed to either public repository. Next: identify the highest-impact independent whole acceptance item from current dependencies and evidence, not a helper-only slice.

## 2026-09-14 · LIC-002 external engine/content inventory (progress; unchecked)

- **Evidence/reconciliation:** Updated the private third-party inventory after current source/runtime inspection. Pinned Trivy image is 0.74.0 by OCI labels and digest, but only misconfiguration/secret scans are run with offline embedded checks; no vuln DB refresh/freshness or signature provenance is established. detect-secrets is explicit-path version probing and baseline JSON handling only. Recorded installed Sigstore library versions/licenses, upstream fixture commit and fixture digests, standards import/export code without vendored schemas, and scanner fixtures already present in public Git but lacking separate provenance.
- **Verification:** Read-only Docker image inspection confirmed the pinned image digest and OCI labels. CLI `npm pack --dry-run --ignore-scripts --json` contains no copied Sigstore fixture JSON paths (it is not the protected staged release archive, and is not release qualification). Official upstream license/NOTICE pages were checked for Trivy and Yelp detect-secrets; no external files or credentials were downloaded or disclosed.
- **Acceptance/operations:** LIC-002 remains unchecked; there is no separately versioned premium rule/recipe corpus, authenticated publisher root/source, approved content-license, modification, customer-license, or trademark record; scanner fixture ownership/source is unresolved. Current checkbox recount: 131 unchecked / 138 checked / 269 total. Documentation commit is private/local only; no production DB/environment access or write, PR merge, deployment, npm publish, or public push occurred. Next: pursue an independent whole acceptance item while owner/legal inputs remain unavailable; do not infer legal clearance.

## 2026-09-14 · OPS-001 queue/provider contract progress (unchecked)

- **Implementation progress:** Web commit `3377a26bddbd0998ab82d0d98695473427434aec` pushed to existing PR #33. `DurableQueueProvider` is a provider-neutral interface defining tenant/idempotency identity, due-work lease requests, fencing shape, acknowledgement, retry/dead-letter result, bounded stable failure codes, and fairness cursor shape. It does not implement or prove durable leasing/fairness and does not select Neon/PostgreSQL (or any provider). The canonical architecture set defers provider selection until workload, security/privacy, recovery, exit, and actual-cost gates pass.
- **Verification:** Queue contract tests 3/3; full local Web tests 108 pass / 4 PostgreSQL-gated skips / 0 failed; typecheck, Drizzle, 17-migration check, production build and diff check pass. Exact-head CI run `34846092388` passes 112/112 tests with PostgreSQL integration active, typecheck, schema/migration checks, production build and security/license/public-boundary checks; Vercel and GitGuardian pass. Local runtime was Node 26.4.0 versus repo Node 22 target (engine warning).
- **Acceptance/operations:** OPS-001 remains unchecked because the backlog requires a justified provider selection compatible with deployed constraints and a complete accepted interface. Missing evidence: representative workload; measured candidate throughput/latency/contention and actual cost; security/privacy/residency review; confirmed runtime/scheduler constraints; restore/replay/export/exit qualification; selected-provider contract tests. Backlog recount: 131 unchecked / 138 checked / 269 total. No production DB access/write/migration, Vercel environment access, production action, merge, deployment, or release occurred. Public PR includes only Web source/tests/package script; private shipping/decision files remain local.

## 2026-09-14 · PLAN-CLI-001 signed catalog consumption (progress; unchecked)

- **Implementation:** CLI `7edb4a980ab118252a94f706e824a16790df7716` pushed to existing PR #38. V2 token is requested after valid v1 license validation with bounded payload and v1 fallback; locally verified v2 capability/allowance/catalog claims are key-hash-bound and drive offline entitlements; fresh REST state overrides signed state; legacy tier-only tokens yield Free for offline CLI and MCP gates; duplicated CLI plan capability maps removed.
- **Verification:** Focused entitlement/token tests 24/24; forced uncached `pnpm turbo run test typecheck build --force` passes 23/23 tasks; public-boundary audit and `git diff --check` pass. PR #38 exact head `7edb4a980ab118252a94f706e824a16790df7716`, OPEN/UNSTABLE with hosted checks in progress. PR #33 remains OPEN/CLEAN at `4c0bd49c6a4702bfa28436f98d641a337a77786c`; hosted checks pass.
- **Acceptance/operations:** PLAN-CLI-001 remains unchecked because dependent PLAN-WEB-003 signer/public-pin production alignment and deployed activation integration are unverified; no backlog count change: 131 unchecked / 138 checked / 269 total. Private tracker commit must remain local-only. No production DB read/write/migration or environment write; no merge, deployment, publish, or release.

## 2026-09-14 · PLAN-WEB-003 entitlement vNext (progress; unchecked)

- **Implementation:** CLI `d6cde6fb7ecd3d1d4aaeea13a973b286e4cd73a4` pushed to existing PR #38; Web `4c0bd49c6a4702bfa28436f98d641a337a77786c` pushed to existing PR #33. Tenant-bound v2 token issue/verify, key-ID selection, backward-compatible legacy signing, production successor-key configuration guard, and online inactive-license downgrade are covered. Web route signs under configured key ID; generated-key end-to-end test verifies successor signature and tenant claims.
- **Verification:** Web 109/109 tests with local PostgreSQL integration active, typecheck, Drizzle check, 17-migration journal validation, production build, public-boundary and diff checks pass. CLI forced uncached test/typecheck/build graph 23/23 Turbo tasks; entitlement/CLI tests, public-boundary, and diff checks pass. Both pushed heads have hosted CI pending as of this ledger update. Local Node is 26.4.0; repos require Node 22.x, so hosted Node 22 checks remain required.
- **Acceptance/tracking:** PLAN-WEB-003 and PLAN-CLI-001 remain unchecked. All-backlog checkbox recount: **138 checked / 131 unchecked / 269 total**. Web provides no immediate offline per-token revocation; fresh online capability refresh reflects inactive license, stale/offline grace remains bounded. CLI opaque allowances/catalog consumption is not complete.
- **Blockers/scope:** Production successor private key plus exact CLI public-key pin alignment and live v2 tenant-mapping availability have not been verified/provisioned. Exact-head CI is pending. No production database read/write/migration or environment write, merge, deployment, release, or publish occurred. Internal documents are local/private and excluded from both public PRs.
- **Next:** wait for the active PR checks to conclude (the runs are live); then resolve failures or record green exact-head evidence. Continue the next independent acceptance item without treating this preparatory entitlement work as acceptance.

## 2026-09-14 · VERIFY-WEB-001 redacted receipt ingestion (accepted)

- **Implementation:** Web `2d89869` pushed to existing PR #33, exact head `2d89869e75d3d0316bf71e94d585a64bff8e34ef`. Added canonical projection-digest binding over normalized fields and active PostgreSQL route tests for authorized bounded POST/list/detail, retry/idempotency, conflicts, and tenant isolation.
- **Verification:** GitHub run `34835571918`: 98/98 tests with PostgreSQL-backed handler integration active; typecheck, `db:check`, 17-migration check, build, public-boundary diff audit, dependency audit, SBOM, license inventory/tests, tracked-secret guard pass. GitGuardian and Vercel pass. Local suite 95 pass / 3 DB-gated skips because local PostgreSQL is unavailable; local typecheck/schema/migration/diff checks pass.
- **Acceptance/tracking:** VERIFY-WEB-001 checked; **138 checked / 131 unchecked / 269 total**, task-checkbox recount. Strict schema rejects source/raw keys; projection digest is recomputed; authorization precedes body parsing; tenant/project scope and exact retry are tested. Object custody, original `.vgl` verification, production data backfill, and recovery remain open.
- **Operations:** no production DB read/write/migration, deployment, merge, or release. Web PR #33 OPEN/CLEAN; internal docs local-only and not pushed.
- **Next:** inspect current migration/backfill/audit implementation for HOSTED-013 and select the strongest executable dry-run/reconciliation slice; keep production writes behind an exact reviewed plan and independent recovery evidence.

## 2026-09-14 · RECORD-006 keyless Sigstore adapter (accepted)

- **Implementation:** CLI `4545eb4` pushed to existing PR #38, exact head `4545eb4f1e1b6d7476e4434c08336695d82a60a0`. Explicit caller-supplied OIDC token via named environment variable; explicit and separately scoped signing/network approvals; allowlisted Sigstore endpoints; canonical statement-to-bundle binding; verified issuer, identity, and bundle; offline verification against caller-root and exact policy. `.vgl` package v1.1 embeds optional bundle/binding and retains v1.0 when absent. No universal Verglos customer key.
- **Verification:** focused Sigstore and record process tests 13/13; forced uncached CLI/shared `test typecheck build` 18/18 Turbo tasks; `git diff --check` and public-boundary audit pass. Exact-head self-scan `34833650330` and all nine Ubuntu/macOS/Windows × Node 20/22/24 cells in matrix `34833650299` pass.
- **Acceptance/tracking:** RECORD-006 checked; **137 checked / 132 unchecked / 269 total**, recounted from task checkboxes. PR #38 OPEN/CLEAN, no merge decision/release. Mock OIDC/Fulcio/Rekor E2E and historical upstream signed fixture qualify local behavior; no live public Rekor write or interactive browser login. Guided UX and plan enforcement remain separate.
- **Scope/operations:** no Web code, production DB read/write/migration, merge, deploy, npm publish, release, or marketing change. Private documentation is local-only and was not pushed.
- **Next:** continue with a whole independent acceptance batch, beginning with Web VERIFY-WEB-001 route-level acceptance evidence; check digest binding and tenant/idempotency behavior against exact route behavior before changing its status.

## 2026-09-14 · RECORD-012 provenance ingestion in Release Records (accepted)

- **Implementation:** CLI commits `e14ac41`, `df9ccb9`, and `96bf984` pushed to existing PR #38; exact head `96bf9846b6fd892194c20a24bf3d9e9bd39387e0`. Added bounded `record import-provenance` for in-toto statement/DSSE input, canonical subject-bound provenance member, exact source-byte preservation, and semantic validation at record create/verify/package boundaries. The CLI process test imports with the new command, creates/exports/packages/verifies a complete record carrying matched GitHub, mismatched npm, and unavailable BuildKit states. A negative shared test rejects provenance matching a digest unrelated to its bound Release Record subject.
- **Verification:** focused shared importer/provider/binding tests 9/9; CLI record-create/import tests 11/11; forced uncached CLI/shared `test typecheck build` 18/18 Turbo tasks; CLI command help, `git diff --check`, and `node scripts/check-public-boundary.mjs` pass. Exact-head self-scan `34819191034` and all nine Ubuntu/macOS/Windows × Node 20/22/24 jobs in matrix `34819191038` pass.
- **Acceptance/tracking:** RECORD-012 checked; **136 checked / 133 unchecked / 269 total**, counted from task checkboxes. PR #38 remains OPEN/CLEAN at `96bf9846b6fd892194c20a24bf3d9e9bd39387e0`; no merge/review decision or release occurred. Provider attribution is caller-declared and DSSE signatures remain unverified; independent verification is separate RECORD-006 work.
- **Scope/operations:** no Web code, public docs, production database read/write/migration, merge, deployment, npm publish, or marketing change. Internal docs stay local/private and were not pushed publicly.
- **Next:** continue with the next independent acceptance item, preserving the Phase-8 freeze on marketing edits; RECORD-010 still awaits correction of historical `/verify` index claims and hosted revalidation.

## 2026-09-14 · RECORD-010 legacy attest compatibility (progress; unchecked)

- **Implementation:** CLI `077b008` pushed to existing PR #38 (head `077b0083bb79dc0b9ec486a324c10c1c5b5afb78`); Web `e58dbd8` pushed to existing PR #33 (head `e58dbd8d53826ae42912b352d903eddef889c7aa`). CLI retires the fake Ed25519 summary API/types, makes `attest` a fixed-output no-op compatibility shell that never echoes report paths/URLs, and corrects MCP descriptions/results. Web disables new legacy summary submissions with HTTP 410, keeps old hashes readable as unsigned/read-only summaries, corrects their detail copy/metadata, and stops page-view writes being called verification.
- **Verification:** forced uncached CLI/shared/MCP test/typecheck/build graph 18/18 Turbo tasks; focused CLI retirement tests 3/3; `@verglos/attest` typecheck/build pass. Web tests 93 pass / 2 existing DB-gated skips; typecheck/build pass; Drizzle check and 17-migration journal validation pass. Exact-head CLI self-scan `34815966866` plus all nine matrix jobs in `34815966832` pass; Web `34815968202`, GitGuardian, and Vercel pass; both PRs report OPEN/CLEAN.
- **Acceptance/tracking:** RECORD-010 remains unchecked; canonical task counts remain **135 checked / 134 unchecked / 269 total**. The `/verify` index still says `verglos attest` publishes and labels historical page-view counts “verified”; it is explicitly a marketing surface and remains untouched until Phase 8. That surface and final hosted evidence are still unmet. Public PR diffs contain only product code/tests; internal trackers are local-only.
- **Operations/next:** no production DB read/write/migration, data deletion, merge, deployment, release, or marketing-index change. After exact-head CI, pursue the next truth/compatibility acceptance batch without changing the Phase-8 freeze.

## 2026-09-14 · RECORD-011 public projection acceptance

- **Implementation:** CLI commit `a898777` pushed to existing PR #38, exact head `a8987771eff59d3219e4fd4df857deaaf17b80d3`. Added decision-derived conservative coverage (`incomplete` / `not-established`), truthful signer states (`unknown` / `unsigned` / `unverified`) using verified package metadata, and reused the fixed limitation redaction for the in-toto predicate/export. CLI-process coverage checks unsigned and signed `.vgl` projections; canaries cover tenant/client, source/path/raw finding, secret, policy, issuer, signer, and limitation content.
- **Acceptance evidence:** shared projection/provenance/viewer tests 7/7; CLI create/project tests 12/12; forced uncached `pnpm exec turbo run test typecheck build --filter=verglos... --force --output-logs=errors-only` 18/18; `git diff --check` and `node scripts/check-public-boundary.mjs` pass. Exact-head self-scan `34814230628` and all nine Ubuntu/macOS/Windows × Node 20/22/24 cells in matrix `34814230639` pass.
- **Tracking/PR:** RECORD-011 accepted; backlog **135 checked / 134 unchecked / 269 total**, recalculated from task checkboxes. PR #38 is OPEN/CLEAN at exact head `a8987771eff59d3219e4fd4df857deaaf17b80d3`; no merge/review decision recorded. PR files contain only product source/tests; local internal docs were not pushed. Web PR #33 remains OPEN/CLEAN at `75b9a482ffdbaf3e31b273550af4aa2585d8a0bb` with checks green and no changes in this batch.
- **Boundary/operations:** local `.vgl` public projection, static viewer, and in-toto export only. Does not establish sanitization of producer-declared member bytes or hosted receipt/upload/log/support safety. No production DB read/write/migration, merge, deployment, release, or marketing change occurred.
- **Next:** inspect and pursue RECORD-010 legacy `attest` compatibility lifecycle, whose stated dependencies RECORD-009 and TRUTH-010 are checked; keep hosted `VERIFY-WEB-001` separate.

## 2026-09-14 · RECORD-009 local record command acceptance

- **Implementation:** CLI commits `d0c5e34` and `fb60d57` pushed to existing PR #38; exact head `fb60d57f8d9723408f04c3ac1205c859df289344`. Extended the 11-member synthetic record journey to use the real CLI process for full `record create --complete`, sign with an exact manifest-scoped approval receipt and test-only Ed25519 private key, pack, and trusted offline verify. Added CLI-process tamper verification assertions for stable exit 78, useful human diagnostics, and no fixture-canary disclosure.
- **Acceptance evidence:** success JSON/quiet behavior, scoped approval, signature/manifest digest binding, package output `uploadPerformed:false`, trusted signer/issuer verification, tamper reason, and fixed exit mapping are directly tested. Focused create/sign suite 13/13; forced uncached `pnpm exec turbo run test typecheck build --filter=verglos... --force --output-logs=errors-only` 18/18; `git diff --check` and `node scripts/check-public-boundary.mjs` pass. Exact-head self-scan `34812069439` and all nine platform jobs in `34812069451` pass.
- **Tracking/PR:** RECORD-009 accepted; backlog **134 checked / 135 unchecked / 269 total**. PR #38 is OPEN/CLEAN and MERGEABLE at exact head `fb60d57f8d9723408f04c3ac1205c859df289344`; no review decision is recorded. Current PR file scope contains source/tests, not private shipping docs or secrets. Local private tracker and CLI documentation mirror reconciled; private docs remain unpushed.
- **Boundary/operations:** this is user-supplied local Ed25519 signing, not guided Sigstore/cosign identity, universal-key custody, hosted receipt integration, legal/trust-root qualification, or proof of redaction. No production DB read/write/migration, merge, deployment, publish, release, Web code change, or marketing edit occurred.
- **Next:** pursue the highest-impact remaining executable acceptance item in the same active CLI PR #38 / Web PR #33; keep marketing held and retain all remaining dependency/evidence gates.

## 2026-09-14 · RECORD-002 `.vgl` package acceptance

- **Implementation:** CLI commit `d0c5e34` pushed to existing PR #38; exact head `d0c5e3441882dc9cd08e2b00ca430b11d0a28942`. Hardens package verification to reject a symlinked `.vgl` root. Strengthens the synthetic 11-member end-to-end CLI fixture to drive complete creation and signed pack/verify as child CLI processes, and verifies aggregate-limit rejection before reading blobs or creating output. The reversible private decision remains `directory-v1`; no archive, upload, or public release is implied.
- **Acceptance evidence:** complete subject/lineage/policy/evaluation/decision/run/observation/verification/exception/approval/redaction graph; unsigned and explicitly trusted Ed25519 flows; deterministic package entries; canonical manifest/descriptor; in-toto export; CSP-limited viewer free-form limitation canary exclusion; omitted payload exclusion; malformed/missing/extra/tampered/symlink/over-limit rejection; no overwrite and no output inside the source store. Focused record tests 8/8; forced uncached `pnpm exec turbo run test typecheck build --filter=verglos... --force --output-logs=errors-only` 18/18; `git diff --check` and `node scripts/check-public-boundary.mjs` pass. Exact-head self-scan `34811310739` and all nine platform jobs in matrix `34811310761` pass.
- **Tracking/PR:** RECORD-002 accepted; actual checkbox count is **133 checked / 136 unchecked / 269 total**. PR #38 remains OPEN/CLEAN at `d0c5e3441882dc9cd08e2b00ca430b11d0a28942`, with no review decision recorded. Public PR file list contains source/tests only; private shipping documents remain local-only and were not pushed. RECORD-011 remains open for its distinct public projection and hosted receipt criteria.
- **Operations:** no production DB access/change, migration, merge, deployment, publish, release, or marketing work in this batch. Redaction metadata is producer-declared, not independent sanitization proof; local `.vgl` contents may include sensitive evidence and must be inspected before sharing.
- **Next:** continue with the highest-impact independent acceptance item; preserve the current PR #38 boundary and do not open a new PR while it remains the active phase PR.

## 2026-09-14 · RECORD-002 `.vgl` package and offline verification (hosted CI pending)

- **Implementation:** CLI commit `af13112` pushed by fast-forward to existing PR #38; exact head `af1311268b6fb115704c3b24177cbbce39e265d6`. The private decision selects the reversible `directory-v1` `.vgl` profile. CLI packages a complete validated record with included content-addressed members, canonical manifest, strict descriptor, deterministic in-toto export, static privacy-limited viewer, and optional detached signature only after exact trusted-key/issuer verification. Offline `record verify` checks every member, graph bindings, descriptor, exact entries, regenerated export/viewer, and signature against an operator-supplied key. It performs no upload. Package and reader aggregate payload cap: 256,000,000 bytes; per member: 50 MB.
- **Evidence:** Synthetic 11-member create→pack→CLI verify; unsigned and explicit trusted Ed25519 signed paths; deterministic package entries; omitted payload exclusion; viewer path/freeform canary exclusion; reject wrong issuer/key, malformed or missing descriptor, missing/tampered members, extra entries, symlinked viewer, and tampered projection/signature. Focused CLI file: 8/8 passed. Forced uncached `pnpm exec turbo run test typecheck build --filter=verglos... --force --output-logs=errors-only`: 18/18 tasks; `git diff --check` and `node scripts/check-public-boundary.mjs` pass. Exact-head self-scan and 9-cell Ubuntu/macOS/Windows × Node 20/22/24 matrix are running; no hosted success claimed yet.
- **Acceptance/tracking:** RECORD-002 remains unchecked pending exact-head hosted results and final scope review. Checkbox recount remains **137 unchecked / 132 checked / 269 total**. RECORD-011 remains open for its downstream public projection/signature-coverage fields and hosted receipt integration. Private decision and tracking documents remain local-only; public PR files are source/tests only.
- **Operations:** No production DB read/write, migration, merge, deploy, npm publish, release, or marketing edit. Local package artifacts use synthetic fixtures only; no customer evidence or real target execution is implied.
- **Next:** verify exact-head PR #38 checks and inspect final acceptance criteria; if all pass, update private tracker count/state, otherwise fix CI failures on the same PR.

## 2026-09-14 · RECORD-002 redaction manifest and consumer binding (progress, not acceptance)

- **Implementation:** CLI commits `8116c7f` and `b52065b` pushed to existing PR #38, exact head `b52065b2bb4532d80f8ae18a99d907ca39a2215b`. Shared assembly now creates a versioned, canonical, digest-bound redaction manifest from member digests, dispositions, and closed categories; it carries no member paths or free-form values and labels assurance producer-declared-only. Omitted members remain in the declared inventory but are excluded from emitted payload bytes. Record create/verify validate schema, digest, status, and exact member/disposition coverage even without complete-graph mode. Shared tests cover deterministic/path-free output, rejected categories/contradictions/future schemas, omission, and coverage tampering; CLI create→verify→export exercises the generated manifest.
- **Verification:** forced uncached `pnpm exec turbo run test typecheck build --filter=verglos... --force` passes 18/18 Turbo tasks; `git diff --check` passes. Exact-head PR #38 `b52065b2bb4532d80f8ae18a99d907ca39a2215b` has all ten required checks green (self-scan plus Ubuntu/macOS/Windows × Node 20/22/24); PR is OPEN/CLEAN. No review decision is recorded.
- **Acceptance/tracking:** no checkbox changed; recalculated count remains **137 unchecked / 132 checked / 269 total**. RECORD-002 remains open: no `.vgl` portable transport has been selected or integrated; viewer/signature packaging and full product assembly/acceptance remain outstanding. This manifest is a producer declaration, not proof that data was sanitized or a general no-leak guarantee.
- **Scope/operations:** staged/pushed only CLI source and tests; no private shipping docs or secrets in PR. No Web changes, production database read/write, migration, merge, deployment, release, or marketing changes. Internal docs remain local-only.
- **Next:** continue RECORD-002 transport-neutral package/consumer work only where supported by the contract; portable `.vgl` transport, viewer/signature packaging, and full acceptance remain open. Keep RECORD-002/011 unchecked until full criteria are evidenced.

## 2026-09-14 · RECORD-011 projection leakage hardening (progress, not acceptance)

- **Implementation:** CLI `e95e0e7a56a1318e4302eefe3f11a1563b0d8f6f` pushed to existing PR #38. Public `record project` no longer serializes custom policy identifiers or arbitrary free-form manifest limitations; each limitation becomes an explicit fixed withholding notice. Shared and CLI-output tests exercise canaries in member paths, source text, secret-shaped text, tenant/client IDs, policy IDs, and decision issuer IDs; exact projection keys are asserted.
- **Verification:** forced uncached `pnpm exec turbo run test typecheck build --filter=verglos... --force` passes 18/18 tasks; focused shared projection tests pass 3/3; focused CLI project tests pass 4/4; `git diff --check` passes. Exact-head hosted self-scan `34780184433` and all nine platform matrix jobs `34780184513` pass.
- **Acceptance/tracking:** no checkbox changed; recalculated canonical count remains **137 unchecked / 132 checked / 269 total**. RECORD-011 is still open: signature and coverage projection are not implemented; RECORD-002 dependency/full assembly, typed redaction manifest, hosted receipt integration, and broader cross-surface adversarial leakage evidence remain. This is synthetic canary evidence for this one offline projection path, not a general no-leak guarantee.
- **Scope/operations:** only shared/CLI source and tests were pushed; internal shipping docs and the private projection contract were not pushed. No web changes, production database reads/writes, migrations, merge, deployment, release, or marketing changes occurred.
- **Next:** finish remaining RECORD-011 semantics only where the record contracts support them; in parallel, pursue transport-neutral RECORD-002 redaction-manifest generation without choosing an archive format. Keep RECORD-002/011 unchecked until full acceptance evidence exists.

## 2026-09-14 · RECORD-002 typed graph, lineage, and offline export (not acceptance)

- **Implementation:** CLI commits `d782e86`, `f887220`, and `3bc5f4d` pushed to existing PR #38. Shared complete-record validation parses typed run/observation/verification/exception/approval payloads, validates unique IDs and exact subject/run/observation/policy/decision bindings, and requires a versioned lineage graph bound to the included subjects. `record create --complete` preflights typed graph payloads before publication. `record header`/viewer expose bounded lineage state only. New `record export` emits a standalone canonical in-toto Statement v1 from a fully verified complete record; it uses Release Decision subjects, binds the manifest digest, writes offline with exclusive creation, and rejects tampered members and overwrites. Export is not integrated into a `.vgl` transport.
- **Verification:** complete-record create/verify/export end-to-end test passes, including exact statement type/digest/subject plus tamper and overwrite rejection. Shared and CLI full package test suites, typechecks, and builds pass. Forced uncached `pnpm exec turbo run test typecheck build --filter=verglos... --force`: 18/18 tasks; `git diff --check` passes. Exact code head `3bc5f4d469de933aec8911bdf4262af7d3278469`; exact-head self-scan `34779228549` and all nine Ubuntu/macOS/Windows × Node 20/22/24 matrix cells `34779228545` pass. PR #38 is OPEN/CLEAN.
- **Acceptance/tracking:** no checkbox changed. RECORD-002 remains open pending an explicit redaction-manifest format and leakage evidence, portable `.vgl` transport decision/integration, and full end-to-end assembly. Existing signing is detached over canonical manifest bytes; no signature digest cycle. Exported limitations are free-form operator text; command help requires review before sharing, and this is not a public-release safety claim. Canonical count remains **137 unchecked / 132 checked / 269 total**.
- **Scope/operations:** only shared/CLI source and tests were pushed; no private docs/secrets in PR diff. No Web code, database read/write, migration, merge, deployment, npm release, or marketing changes. Private docs remain local-only.
- **Next:** resolve the missing redaction-manifest schema/policy against RECORD-011’s public-projection contract, then implement generation plus representative path/source/secret/tenant/client canary leakage tests. Keep export as a sidecar until the `.vgl` transport decision is explicit; do not claim RECORD-002 complete before redaction evidence and end-to-end assembly.

## 2026-09-14 · CLI AGENT-007 acceptance; tracker reconciliation

- **Implementation:** CLI commits `a66e1f4` and `a64feb0` pushed to existing PR #38; exact head `a64feb0bb5c24b665bc464ba623f616d4f35f3f2`. The mutation preview displays a full unified diff and test digests; exact workspace/path receipts gate writes; selected Node tests require a separate execute receipt bound to selected file bytes. Runner caps time, output, test count/concurrency, and V8 heap; optional rescan follows successful tests. Any test/rescan failure triggers rollback, and rollback uncertainty is explicit. The configured approval store persists the test-execution receipt before mutation; audit-store failure prevents mutation and execution.
- **Verification:** focused `fix.test.ts` 27/27; forced uncached `pnpm exec turbo run test typecheck build --filter=verglos... --force` 18/18 Turbo tasks; `git diff --check` passed. Hosted self-scan `34776624650` and all nine Ubuntu/macOS/Windows × Node 20/22/24 jobs in matrix `34776624651` passed. An earlier a66e1f4 Windows Node 24 process startup exited `-1073741502` before tests; rerun attempt 2 passed, and the current a64feb0 matrix passes all jobs on its first attempt. PR #38 is OPEN/CLEAN at exact head above. Its changed-file list is product source/tests and technical docs only; no private shipping docs or secrets.
- **Acceptance/tracking:** AGENT-007 accepted only after exact-head hosted checks; checkbox recount **137 unchecked / 132 checked / 269 total**. Review found the untracked CLI-local mirror still had AGENT-003/005 unchecked (140/129); canonical private evidence at `fef284e` plus `34767527375` and `34767527307` proves those were already accepted, so the local mirror is reconciled without changing canonical counts. R-040 remains open for the explicit non-sandboxed nature of selected-test execution and continued mutation-safety review; no sandbox/isolation claim is made.
- **Other repo and operations:** Web PR #33 remains OPEN/CLEAN at `75b9a482ffdbaf3e31b273550af4aa2585d8a0bb`; existing checks pass. No Web code changed. No production database read/write, migration, merge, deployment, npm release, or marketing edit. Private docs are committed only in the local private-shipping worktree and were not pushed.
- **Next acceptance batch:** continue transport-neutral RECORD-002 assembly from its manifest/release-decision contracts; do not choose ZIP, tar, directory, object store, or other transport absent a governing decision. First identify the missing graph members and exactly which complete acceptance scope can be delivered without inventing a transport.

## 2026-09-13 · Web production config startup/build enforcement (not acceptance)

- **Implementation:** Web commits `5f74817`, `1ce37f9`, and corrective `75b9a48`, pushed to existing PR #33, exact head `75b9a482ffdbaf3e31b273550af4aa2585d8a0bb`. Production runtime validation now runs during Vercel production builds and before Next.js Node runtime startup; Node-only validation loads conditionally for the runtime. Runtime key validation is Edge-bundle compatible and avoids a private-key marker false positive in the tracked-secret guard while accepting newline-terminated PEM values. Subprocess tests use a minimal environment, fail closed on missing production config, allow preview builds/startup, and assert sentinel secrets do not appear in output.
- **Verification:** Web `pnpm test`: 91 passed / 2 skipped / 0 failed (PostgreSQL integration checks skipped because TEST_DATABASE_URL was not configured); focused runtime config tests 12/12 and build-config subprocess tests 2/2; `pnpm typecheck`, `pnpm build`, `pnpm db:check`, `pnpm db:migrations:check` (17 ordered migrations), tracked-secret guard, public-boundary audit, and `git diff --check` pass. Local Node 26.4.0 emits the repository's Node 22.x engine warning. Exact-head hosted run `34774125271` passes typecheck/schema, tracked-secret guard and all workflow steps; GitGuardian, Vercel, and preview comments pass. PR #33 is OPEN/CLEAN with no recorded review decision.
- **Acceptance/tracking:** DIST-WEB-002 remains unchecked; this batch corrected a CI defect and changed no task checkbox. The production env command could not retrieve linked Vercel project settings; `whoami` reports the provided token is denied access to scope `anuragyadav20062002s-projects`. No production env values were read. Queue/object storage remain deferred/unselected under OPS-001; no variable names or provider config were invented. Backlog remains **138 unchecked / 131 checked / 269 total**.
- **Scope:** existing Web PR #33 updated; no new PR. No production DB read/write, migration, production deployment, merge, release, marketing edit, or public internal-document push. Private docs remain local-only.

## 2026-09-13 · HUNT-002 local trust-store verification interface (not acceptance)

- **Implementation:** CLI local commit `2318b9d` adds `verglos hunt verify-recipe <recipePath> --trust-store <path>`. It reads bounded regular JSON inputs, verifies recipe/feed/license digests and Ed25519 feed signatures against the exact caller-supplied local root set, rejects tampering and symlinks, and projects store/feed/recipe digests plus license ID/source/text digest without emitting license text. Output explicitly says publisher-root authenticity must be established out of band, legal clearance is not implied, and execution is not authorized. This command does not fetch feeds, install roots, or execute recipes.
- **Verification:** forced uncached CLI monorepo `test typecheck build` passes 23/23 Turbo tasks. On final code, `pnpm --filter verglos test`, CLI typecheck, `git diff --check`, and `hunt verify-recipe --help` pass; verifier unit/process tests pass 4/4, including tamper and symlink denial. No Docker/runtime execution is part of this verifier path.
- **Acceptance/tracking:** HUNT-002 remains unchecked; actual authenticated official publisher roots/feed and real licensed recipe provenance are not available, and official-root provisioning/feed rotation remain unimplemented. No checkbox changed: **138 unchecked / 131 checked / 269 total**. HUNT-003 remains dependent on accepted HUNT-002 plus its exact subject/finding planner criteria.
- **Scope:** CLI commit is local, not pushed; PR #38 remains the separate ordinary-scan phase. No web changes, private-doc publication, production DB read/write/migration, recipe execution, merge, deploy, release, or marketing edits.

## 2026-09-13 · HUNT signed-feed verification implementation (not acceptance)

- **Implementation:** CLI local commit `40b16dc` on `feat/agent-hunt-phase3` adds a versioned trust-store/feed contract, Ed25519 verification over canonical feed bytes, exact recipe content digest binding, embedded license-text SHA-256 verification, publisher/source metadata binding, root origin/key validity checks, and fail-closed unknown/expired/revoked/tampered handling. Planner and execution gate consume the verification result; execution checks the feed at the approved execution timestamp. Tests replace self-asserted signer allowlists with generated-key signed-feed fixtures.
- **Verification:** forced uncached `pnpm exec turbo run test typecheck build --force` passes 23/23 Turbo tasks; shared/Hunt test suites, typechecks, and `git diff --check` pass. The optional Docker runtime integration suite was not enabled in this verifier batch; its 16 Docker-specific tests are skipped unless configured with a pinned image/digest. GitHub PR #38 is a separate scope and was not modified: it remains OPEN/CLEAN at `84e2932651cc9a42f57bec8021b6c97f977315de`, with self-scan `34770765039` and all nine platform jobs in `34770765059` successful. Web PR #33 remains OPEN/CLEAN at `a698c9074a1de34eaad32e880e5ecb3e40d46ea1`.
- **Acceptance/tracking:** HUNT-002 remains unchecked because no actual official publisher root/feed or real licensed recipe provenance is provisioned/verified, and the CLI does not yet ingest a durable runtime trust store/feed. No backlog checkbox changed: **138 unchecked / 131 checked / 269 total**. HUNT-003 remains dependency-gated on accepted HUNT-002 and its own dry-run/finding-binding criteria. No HUNT item is being credited from helper code alone.
- **Scope:** commit is local and not pushed; no new PR was opened while PR #38 remains the active CLI phase PR. No web changes, database read/write/migration, production mutation, release, merge, deployment, or marketing edits. Private tracker files remain local-only.

## 2026-09-13 · CLI LOCAL-008 exception/export projection acceptance

- **Acceptance:** `LOCAL-008` complete at CLI PR #38 exact head `bee63e3ad76850cd1a6af0345cb5498f87c381ca`. `verglos policy exception <exceptionPath> --approval <path>` is a read-only view of exact exception scope, owner/reason, compensating controls, reversal triggers, validity window, approval decision/digest binding/time state, and export-format support. It explicitly leaves applicability `not-evaluated`; unsupported `.vgl`/JSON, standards, HTML, and PDF formats are labeled not integrated/mapped/implemented rather than advertised as working exports.
- **Verification:** focused tests pass 7/7; forced uncached `pnpm exec turbo run test typecheck build --filter=verglos --force` passes 8/8 Turbo tasks; `git diff --check` passes; exact-head self-scan `34764793925` and all nine platform cells in matrix `34764794099` pass. PR #38 is OPEN/CLEAN.
- **Tracking:** recount from the task checkboxes gives 140 unchecked / 129 checked / 269 total. This corrects the stale 143/126 traceability summary; CLI-local tracker mirror is being synchronized from the authoritative private tracker.
- **Scope:** no exception application/evaluation, export generation, signing, upload, production DB read/write/migration, merge, deploy, or release. Internal shipping docs remain local-only. Next acceptance batch: AGENT-003 MCP contract reconciliation.

## 2026-09-13 · CLI LOCAL-002 acceptance and tracker reconciliation

- **Acceptance:** `LOCAL-002` complete at CLI commit `f494c3d` (PR #38 exact head `f494c3d6be6481112d99a5ec04d8a6cb7d156796`). The strict v1 config schema bounds engine/Hunt/record/telemetry sections; migration inspection reports obsolete/unsupported/invalid/inactive settings without mutation or evaluating legacy JavaScript; scan refuses to apply migration-only settings.
- **Verification:** forced uncached CLI test/typecheck/build graph passed 23/23 Turbo tasks; GitHub matrix `34760687566` passed all nine Ubuntu/macOS/Windows × Node 20/22/24 cells; self-scan `34760687643` passed; PR #38 is OPEN/CLEAN.
- **Tracking:** recalculated all task checkboxes: 143 unchecked / 126 checked / 269 total. Private tracker is newer than the CLI-local mirror; private copies are authoritative and the mirror is synchronized from the tracked source.
- **Scope:** no PR merge/release, production database read/write/migration, or deployment. No private documents were pushed to public remotes.

Verified current checkpoint (2026-09-13): backlog is **143 unchecked / 126 checked / 269 total**, recalculated from every task checkbox. CLI PR #37 is merged at `7813033a2e727fcf018d8a6cdef24573c3a58e19`; CLI PR #38 is OPEN/CLEAN at pushed head `f494c3d6be6481112d99a5ec04d8a6cb7d156796`; platform matrix `34760687566` passes all nine Ubuntu/macOS/Windows × Node 20/22/24 cells and self-scan `34760687643` passes. Web PR #33 is OPEN/CLEAN at pushed head `a698c9074a1de34eaad32e880e5ecb3e40d46ea1`; workflow `34757829628`, GitGuardian, Vercel, and preview checks pass. CLI forced uncached monorepo tests/typecheck/build pass 23/23 Turbo tasks. LOCAL-002 versioned config migration is accepted at exact tested CLI head; LOCAL-003/004/005 and QUAL-CLI-002 retain their recorded evidence scope. Analytics transmission remains off pending R-014/OPS-012 hosted ownership/access/retention/deletion/legacy-client controls. Web migration `0016_score_history_event_id.sql` remains unapplied in production. No production DB read/write, migration, deployment, merge, or release occurred in this batch. The authoritative private tracker files are newer than the stale CLI-local mirror; this batch records and resolves that discrepancy. Private shipping files remain on `local/private-shipping-ledger` only.

- CLI/Web telemetry and paid account-sync purpose separation | `QUAL-CLI-002` accepted; `R-014` and `OPS-012` remain open; CLI PR #38 commit `c8b26a4`; Web PR #33 commit `a698c90` | CLI process tests instrument target file reads, child processes, fetch and common Node HTTP/TLS/socket transports; demonstrate no execution of install/source markers and no source/path/finding/secret/package canaries in outbound bodies. Paid score sync uses a separate strict authenticated allowlist; analytics consent is versioned/revocable but transport remains disabled until governance controls qualify. CLI local full tests/typecheck/build and exact-head matrix/self-scan pass; Web route/schema tests, typecheck, suite/build/migration checks and hosted verification pass. | QUAL-CLI-002 accepted. Independent R-014/OPS-012 owner/access/retention/deletion/legacy-client gates remain open. Migration 0016 is unapplied; no production data changed. PRs are CI-clean, with merge sequencing gated on Web schema-migration qualification.

- CLI LOCAL-003 inspection snapshot integration | Phase 1 · `LOCAL-003`, `GRAPH-007` compatibility | CLI commits `ae65fd4`, `c320574`; PR #37 exact head `c32057461ed393f7429ab42f9f09d040757b4024` | Added additive release snapshot schema 1.1 with coverage included in canonical digest while preserving 1.0 readers/diffs; added opt-in snapshot orchestration for network-denied native scans, injected adapters, and bounded imports; atomic no-overwrite output, cancellation, bounded concurrency, progress and explicit incomplete producer states. Forced uncached monorepo tests/typecheck/build pass 23/23 Turbo tasks; diff check passes. Hosted self-scan `34715650416` and platform matrix `34715650537` were still in progress at last check (macOS Node 24 passed). | `LOCAL-003` remains unchecked: qualified Trivy execution and bound/complete SBOM/provenance semantics are not proven. `GRAPH-007` was already accepted; compatibility preserved. No production DB action and no internal docs pushed.

- CLI ENGINE-006 acceptance | `packages/shared/src/system-engine.ts`, `system-engine.test.ts`, CLI `engines-inspect.ts`; commit `a004eef`; PR #37 exact head `a004eefa97fbc01f92ceddd8dc4f56f75ec9599d` | Explicit absolute regular-file path; bounded Trivy identity/version and five capability probes; SHA-256 with before/after identity check; human/JSON trust/limitation output; no PATH fallback. Focused and full CLI tests/typechecks, forced uncached monorepo test/typecheck/build (23/23 tasks), diff check, self-scan and all nine platform cells pass. | ENGINE-006 accepted for inspection; trust is computed-only and does not establish publisher provenance or managed scan execution. `LOCAL-003` remains open. Backlog 148 unchecked / 121 checked / 269.

- Fresh production aggregate audit | `2026-09-12T17:48:12Z`; read-only repeatable-read transaction | 12/12 source tables, 74 source rows, 15 migration-history entries, complete per-table SHA-256 digests; zero audited orphans/duplicates/malformed JSON; one founder-override license, one registration/1,350 dependency entries/non-empty legacy channels, one canary alert, no live auth codes. Evidence with digests: `docs/shipping/PRODUCTION_SOURCE_AUDIT_2026-09-12.md`. No row values/identifiers selected; no production writes. New mapping table absent; local/uncommitted `0015` not applied. | HOSTED-013 remains unchecked; no target mapping/backfill, dual-write, reconciliation, or cutover. Backlog unchanged: 150 unchecked / 119 checked / 269.

- Production base-schema migration | Web migration set `0000`–`0014`, current web worktree `67bbe09d01de7b51ba8459997bed7d2f1ff17f16`; owner approval received 2026-09-12 | Fresh read-only preflight matched the Vercel production DB endpoint to Neon branch `production`: 10/33 declared tables, 74 aggregate rows, no Drizzle history, 0 `sentinel` licenses, `licenses.plan` default `pro`. Local `pnpm db:check` and `pnpm db:migrations:check` pass; Node 26 warns because the repo pins Node 22. `pnpm exec drizzle-kit migrate` ran through `vercel env run -e production` and exited 0. Read-only postflight: 33/33 public tables; 15 migration journal rows; original table counts remain users 1, licenses 1, activations 6, reports 0, heartbeats 0, cli_auth_codes 4, monitor_registrations 1, alert_dispatches 1, score_history 10, scan_events 50; all 23 new tables are empty; project fields environment/repository_url/owner_user_id exist; license default remains pro and sentinel count remains 0. A point-in-time child branch from production independently returned 10 tables/74 rows and was deleted. | Schema expansion verified as an operational DB task only; HOSTED-013 remains unchecked because it requires current-data dual-write/backfill into target entities with dry run, reconciliation, rollback, and no deletion. No public/private docs pushed; no application deployment, PR merge, production backfill, or cutover.

- CLI LOCAL-001 complete acceptance | `4f8f98e`, `a26bf68`; PR #35, head `a26bf68b010d95326ffb4f4f0c121c0d97dc99f8` | Stable updater JSON/quiet contract plus value-free command-usage failures, typed configuration/infrastructure errors, scan-family bounded output/exits, watch-mode termination, report-path behavior, policy alias equivalence, and a side-effect-free help/applicable-flag matrix for all public command leaves. Uncached monorepo tests 12/12 package tasks, including CLI process suite 36/36; `pnpm typecheck` 13/13, `pnpm build` 8/8, diff check pass. Hosted run `34696804945` passes all nine platform cells and self-scan. No private shipping documents or founder assets were pushed. | Accepted; PR is open for merge decision. Backlog 150 unchecked / 119 checked / 269.

Current execution checkpoint (2026-09-12): CLI PR #34 is merged at `5fcc28f`; local CLI branch `feat/cli-agent-approval-acceptance` contains code commit `4f8f98e`, not pushed and no PR yet. Web PR #32 is OPEN/CLEAN at exact head `67bbe09`; hosted run `34694532678`, GitGuardian, and Vercel pass. `DIST-WEB-001` is accepted: 87/87 PostgreSQL-backed tests plus typecheck, migration/schema checks, production build, public-boundary, dependency audit, CycloneDX 1.6, license inventory/tests, tracked-secret guard, and artifact upload all pass at the exact protected head. The inventory has 413 components, with 79 manual-review flags and 53 missing declared licenses; legal clearance remains open under R-018. Production audits remain strictly read-only: 10/33 declared tables present, 23 missing, aggregate counts total 74, and no customer rows selected. No deployed migration history is discoverable; all 15 migrations replay on a schema-only clone, while a clean-empty DB fails at `0000` because a legacy `licenses` baseline is assumed. The database role can write outside the audited transaction. `neon-api-key` failed provider `GET /api/v2/projects` with HTTP 401, so snapshot/backup schedule metadata is unknown. No production DDL/DML/migration occurred. HOSTED-013/R-021 remain blocked by baseline/history, reconciliation, backup/restore and rollback qualification, independent review, and exact plan approval. Backlog 151 unchecked / 118 checked / 269. Next work should select a whole independent acceptance item; LOCAL-001's option semantics still require contract resolution before checkoff.

Latest execution update (2026-09-12): web PR #32 `cfe693608276e4a51efb8bd2c8ee2f4060a21c66` is OPEN/CLEAN; hosted run `34678789958`, GitGuardian, and Vercel pass. A catalog-backed server guard now rejects new Pro QR checkout with bounded 503 before customer/provider side effects while Pro remains non-purchasable. Full local suite 83/83 (PostgreSQL active), typecheck, build, schema and migration checks pass. This mitigates R-031 but does not complete PLAN-WEB-011/012; no backlog item was accepted. Counts: 152 unchecked / 117 checked / 269.

Migration-preflight execution update (2026-09-12): web commit `9eba73d` was pushed to the existing PR #32; hosted run `34679868578`, GitGuardian, and Vercel pass. `pnpm db:migration-audit --exact-counts` against the explicitly selected isolated local database succeeded in read-only repeatable-read mode and reported all 33 declared tables missing. Local checks pass: 86/86 tests with PostgreSQL, typecheck, production build, Drizzle schema and migration journal checks, and diff check. This is empty-database/tool-path evidence only; no hosted data or production credentials were used, and no DDL/DML ran. HOSTED-013/R-021 remain open, with signed production audit and reproducible foundational schema/history still blockers. Counts remain 152 unchecked / 117 checked / 269.

Latest CLI runtime test (2026-09-12): with Docker Desktop reachable, `VERGLOS_HUNT_DOCKER_INTEGRATION=1` and pinned `busybox:1.36@sha256:73aaf090f3d85aa34ee199857f03fa3a95c8ede2ffd4cc2cdb5b94e566b11662` ran `pnpm --filter @verglos/hunt test`: 51 passed, 1 Linux-host PID/IPC namespace test skipped on macOS, 0 failures. Runtime assertions covered non-root, read-only source/rootfs, network denial, absent socket/device, no-new-privileges, redaction, bounded output/timeout/CPU/processes/tmpfs, memory-ceiling visibility, and signal classification. HUNT-011/QUAL-CLI-004 remain open; this run provides no Linux-host namespace claim and no independent review.

Historical rows retain the state at the cited commit. For current branch heads, PRs, blockers, and backlog counts, use the latest checkpoint below; older counts in execution notes are not current totals.

This ledger records phase-level execution evidence. It is intentionally separate
from the backlog: a backlog item may remain unchecked while a preparatory slice
has evidence, and no preparatory slice is treated as a release gate.

- Production schema-only migration preflight | HOSTED-013, R-021 | `verglos-web` `pnpm db:migration-audit` against the updated Neon PostgreSQL URI, with `exactCounts:false`. Repeatable-read/read-only transaction confirmed `transaction_read_only=on`; bounded statement/lock timeouts applied. Result: 10 of 33 declared public tables present, 23 missing; only `public` application schema; no migration-related table or columns discoverable. Local migration validation passed for 15 ordered SQL migrations; source fingerprint `sha256:1ac092dfddcd50be505a978436871e16e3e933854dc997c11d6bad20a66b7931`. No customer rows selected, no write/migration, no code commit or PR change. `HOSTED-013` remains unchecked; exact backlog 152 unchecked / 117 checked / 269. No production migration can proceed without an identified baseline/history, complete data reconciliation, approved plan, backup/restore and rollback evidence, and explicit user authorization.

- Production migration replay preflight | HOSTED-013/R-021 | Read-only comparison found 87 existing column names, SQL types, and nullability values match Drizzle. Defaults, indexes, constraints, grants, and data reconciliation remain unchecked. `licenses.plan='sentinel'` dry-run count for migration `0000` returned 0; that SQL also alters the default to `pro`. No migration journal or tested restore evidence was identified. This was not a migration dry-run against a cloned database. No production writes occurred; `pnpm db:migrate` was not run. Backlog remains 152 unchecked / 117 checked / 269.

- Production aggregate-count and schema-replay follow-up | HOSTED-013/R-021 | `pnpm db:migration-audit --exact-counts` ran at `2026-09-12T12:23:45Z` in read-only repeatable-read mode with 10-second statement and 2-second lock timeouts. Exit 2 accurately reflects 23/33 missing declared tables. Aggregate-only output: `users=1`, `licenses=1`, `activations=6`, `reports=0`, `heartbeats=0`, `cli_auth_codes=4`, `monitor_registrations=1`, `alert_dispatches=1`, `score_history=10`, `scan_events=50` (74 total); no row values were selected. A schema-only production dump was replayed in a disposable PostgreSQL 18 container: all 15 migrations succeeded, yielding 33/33 tables; no difference was found in existing-table columns/defaults/constraints/indexes compared with production. Conversely, replay against a clean empty PostgreSQL database stops at `0000` (`licenses` missing), proving the chain assumes a pre-existing legacy baseline. Production role has DDL/DML capabilities, but no mutation was attempted. This closes neither HOSTED-013 nor R-021: no production migration journal, data-level rehearsal/reconciliation, backup/restore drill, rollback rehearsal, independent review, or exact approved write plan exists. Counts unchanged at 152 unchecked / 117 checked / 269.

## Current checkpoint

Current acceptance batch: CLI AGENT-001 | commit `86c09a3`; PR #36 head `86c09a349a0e9b5797eaf09c3640628d34a98f4d` | Added exhaustive per-action contract assertions for all 12 shared authority actions. Shared action-authority focused tests pass 3/3; clean shared typecheck/build pass; exact-head self-scan `34711950813` and all nine Ubuntu/macOS/Windows Node 20/22/24 platform cells in `34711950840` pass. GitHub reports PR OPEN/CLEAN; no review decision is recorded. | Accepted at PR head, pending merge. Backlog 149 unchecked / 120 checked / 269. Next: HUNT-001 recipe schema, after contract/licensing review.

Web migration audit follow-up | Web branch `feat/web-legacy-migration-audit`, local only | Local full suite reports 89/89 pass with isolated PostgreSQL 15; typecheck, `db:check`, `db:migrations:check`, config check, and production build pass. This draft includes migration `0015`, mapping-table/schema tests, aggregate-only legacy audit, migration-script import side-effect regression, and a user-owned runtime-config change. It is not pushed and does not complete HOSTED-013. No production query or write occurred in this batch. `HOSTED-013` remains open pending dual-write/backfill/reconciliation, restore/rollback/cutover qualification, and review.

- Date: 2026-09-12
- CLI branch: `feat/post-merge-shipping-slice`, latest pushed commit `bda23e0` (PR #34; self-scan/platform matrix running; local/private documentation is never pushed)
- Web branch: `feat/post-merge-shipping-slice`, latest pushed commit `0d9a185` ([open fork PR #32](https://github.com/anuragyadav-git/verglos-web/pull/32); run `34678019063`, GitGuardian, and Vercel pass; OPEN/MERGEABLE)
- Backlog count: 152 unchecked, 117 checked (HOSTED-011/012 and PLAN-WEB-001/002 accepted at verified PR #32 head; LIC-001/004 also verified complete; DIST-001 remains open because LOCAL/HUNT/RECORD dependencies are incomplete)
- Public-history boundary: shipping documentation remains local-only on `local/private-shipping-ledger`; this private worktree is `/Users/anuragyadav/Developer/TopNotchh-Workspace/verglos-cli-private-shipping`
- Scope guard: blog and landing-page elements are untouched
- Preserved user assets: founder-provided untracked files under `verglos-cli/docs/` remain unstaged
- Latest evidence: CLI package-surface tests 8/8, package-content audit pass, six-archive manifest audit pass, clean consumer install/import/CLI/no-engine check pass, and cache-bypassed Turbo test/typecheck/build 23/23 tasks. PR #34 self-scan and all nine Ubuntu/macOS/Windows Node 20/22/24 cells pass for `5b9b695` (`34666384467`, matrix `34666384473` attempt 2); the first Windows/Node 20 Build attempt failed without a diagnostic, then passed on rerun unchanged. Web commits `b0e3067`/`39730f8`/`21c3b19` deliver HOSTED-011; `26fc04f` and `8263cf6` supply resolver/route-denial evidence. `0d9a185` completes server catalog/capability normalization. PR #32 run `34678019063` passes 82/82 Node 22 tests with PostgreSQL, typecheck, schema/migration checks, build, public-boundary, dependency, and secret checks; GitGuardian and Vercel pass. HOSTED-011/012 and PLAN-WEB-001/002 accepted. PR #32 and #34 remain open and mergeable.
- Release blocker: nested `benchmark@1.0.0` under `fast-uri@3.1.4` has ISC vs BSD-3-Clause license conflict; publishing intentionally fails closed pending review
- Backlog state: 152 unchecked / 117 checked / 269 total. HOSTED-011/012 passed exact-head tenant-boundary and route-denial evidence. PLAN-WEB-001/002 now pass the complete server catalog and catalog-derived capability criteria at `0d9a185`/run `34678019063`; public-plan traffic/managed-run amounts remain explicitly unset, unverified Pro pricing is not purchasable, Team/Studio remain inactive, and Enterprise is contracted. LIC-001/004 remain verified complete. `c59126e`/`bda23e0`/`d7430a5` reduce AGENT-007 gaps but do not complete selected-test semantics/end-to-end qualification; R-007, R-031, CLI catalog migration, and broader release gates remain open.

## Phase status

| Phase | Scope | Status | Evidence | Remaining gate |
| --- | --- | --- | --- | --- |
| 0 | Truth, dependencies, licensing, risks, release gates | In progress | `STATUS.md`, `TRACEABILITY.md`, `RISKS.md`, `RELEASE_GATES.md`, backlog inventory | licensing, legal, provider, and acceptance decisions remain open |
| 1 | Local command/config/inspect/evidence foundations | Preparatory progress | bounded config and output paths; scanner orchestration bounds at `783d997`, `7c9b64d`, `434b026`; CLI Turbo verification passed 19/19 tasks | producer adapters, progress, coverage manifest, universal command fixtures |
| 2 | Canonical records, signing, verification, provenance, public redaction | Preparatory progress | record store, payload-backed assembly, offline signing/verification, provenance and redaction tests | complete graph production, transport packaging, Sigstore verification, independent verifier |
| 3 | Agent/MCP authority and safe Hunt | Preparatory progress | MCP authority/capability registries, strict validators, bounded responses at `4719cf0`, `fbc6133`; Hunt planner/trust/redaction, execution binding with recipe command/limits/process ceilings/assertions, exact adapter binding, declared-isolation enforcement, result-to-finding identity enforcement, source finding preservation, validated/immutable outcomes with bounded execution evidence metadata, policy-bound Docker adapter, lifecycle cleanup, UTF-8-safe evidence bounds, runtime Docker input and runner argv validation, valid Docker namespace defaults, bounded exit-code assertion evaluation, and bounded Docker boundary at `1982e6d`, `f68576a`, `9195266`, `acd1aad`, `38c6ecc`, `9f029f9`, `eb80e0a`, `8cde6fd`, `9ee3a4f`, `7224612`, `75e31f2`, `a152b39`, `50ecf2c`, `9a05914`, `ddf6cfe`, `f32f80a`, `4f67ea6`, `5e4c922`, `2e366a4`, `3f89bb7`, `d422adc`, `4ae9bf2`, `4460f1a`, `e1d4893`, `5f7bc00`, `86c2a4a`, `25e29ea`, `1f94309`, `306f30f`, `abe6978`, `c19b10e`, `733fed4`, `f27312d`, `d800e56`, `3d347dd`, `d3a3f37`, `cfc415c`, `22ed833`, `ae7493b`, `67e6e92`, `27d0441`, `f5c9b3c`, `403f214`, `c27211b`; shared 297/297, Hunt 26/26, and CLI 103/103 tests; CI self-scan run `34594056216` passed all checks; live Docker fixture returned `true` with bounded redacted evidence digest `sha256:acbd711313ac7a94dc13913a8b68adf3394104c4f1070897876f76b1b9e1351a` | assertion coverage beyond exit-code form, built-in pure probes, supported recipe set, independent isolation, and adversarial suite |
| 4 | Hosted receipts, tenant isolation, authorization, custody | Preparatory progress | web receipt APIs, tenant audit, digest verification, URL-safe IDs; webhook IPv6/fragment validation at `ba90058`, production runtime-config validation at `7ab0010`; web tests 45/45 | runtime DAL, object custody, cross-tenant fixtures, full record verification |
| 3 evidence reconciliation (local-only) | Recorded | `2af2cd7` adds runtime `no-new-privileges` evidence to the source-tree and timeout/adversarial work at `83b3994`; Hunt now has 40/40 passing when integration is enabled (31 unit/contract passes plus 9 live Docker checks). The public backlog remains intentionally unchanged at 158 unchecked / 111 checked pending broader HUNT acceptance evidence. | Internal execution note | do not publish |
| 3 authority reconciliation (local-only) | Recorded | `6a272af` extends MCP capability discovery with authoritative action and side-effect metadata; shared suite remains 297/297. AGENT-004 remains preparatory pending entitlement enforcement and complete input/output metadata. | Internal execution note | do not publish |
| 3 authority reconciliation (local-only) | Recorded | `222fd84` adds immutable input/output field metadata to MCP capabilities; shared suite remains 297/297. AGENT-004 remains preparatory pending runtime schema negotiation and entitlement enforcement. | Internal execution note; this row supersedes older inline phase test totals | do not publish |
| 3 authority reconciliation (local-only) | Recorded | `a101124` wires shared capability metadata into MCP `tools/list` discovery with fail-closed missing-record handling; MCP tests 24/24 and typecheck pass. AGENT-004 remains preparatory pending entitlement enforcement and interoperability review. | Internal execution note | do not publish |
| 3 authority reconciliation (local-only) | Recorded | `021e609` removes an unused discovery import; MCP tests remain 24/24 passing. | Internal execution note | do not publish |
| 3 authority reconciliation (local-only) | Recorded | `0fd7cd2` extracts and tests deterministic MCP discovery metadata; MCP tests now 25/25 and typecheck pass. | Internal execution note | do not publish |
| 4 evidence reconciliation (local-only) | Recorded | Web commit `3b8d2d8` extends webhook SSRF validation to reserved documentation and benchmarking IPv4 ranges; web suite now passes 46/46. OPS-008 remains preparatory pending deployed worker/DNS re-resolution evidence. | Internal execution note | do not publish |
| 3 authority reconciliation (local-only) | Recorded | AGENT-004 is complete locally: MCP discovery metadata, Team-aware plan gates, verified CLI entitlement context, SDK interoperability, and shared plan-contract tests; MCP 27/27, shared 299/299, CLI 103/103, and full typechecks pass. | Internal execution note | do not publish |
| 3 authority reconciliation (local-only) | Recorded | AGENT-002 is complete locally: canonical approval receipts are durably persisted with bounded atomic writes, exact scope checks, tamper/symlink rejection, and request-ID replay protection; shared 300/300, MCP 27/27, and typechecks pass. | Internal execution note; hosted audit custody remains a later gate | do not publish |
| 3 Hunt evidence reconciliation (local-only) | Recorded | HUNT-005 is complete locally: pinned Docker integration suite passes 40/40 with non-root, read-only mounts/rootfs, network denial, socket/device absence, no-new-privileges, bounded output/time, and cleanup checks. | Internal execution note; HUNT-011 remains open | do not publish |
| 3 Hunt evidence reconciliation (local-only) | Recorded | HUNT-006 is complete locally: synthetic input, secret/path redaction, UTF-8/output bounds, content digesting, and pinned Docker secret-exfiltration checks pass; latest Hunt suite 45/45. | Internal execution note; HUNT-011 remains open | do not publish |
| 3 Hunt evidence reconciliation (local-only) | Recorded | HUNT-011 now has independent-image evidence: the 45-test Docker adversarial suite passes against two pinned Postgres image digests; namespace/memory qualification remains open. | Internal execution note; do not publish |
| 5 | Plans, entitlement, usage, billing, monitoring, operations | Not started as a complete phase | versioned catalog and bounded entitlement claims are preparatory only | usage ledger, quotas, billing binding, queue/provider decisions, operational workers |
| 6 | Distribution, CI/CD, SBOM/notices, rollback, adversarial suites | Not started as a complete phase | current package/build checks are not release qualification | notices, SBOM, trusted publishing, install matrix, rollback and adversarial evidence |
| 7 | Acceptance stories, POC, independent review, truth reconciliation | Not started | no authorized external POC evidence recorded | founder authorization, fixtures, independent Hunt review, go/no-go |

## Latest execution record (2026-09-12)

- Overnight batch: from 18:00 IST Sep 11 to 06:41 IST Sep 12, 178 CLI commits (`531009a`–`4435964`) and 33 web commits (`b99014b`–`4a6571a`) landed. Commit subjects were reconciled and LIC-001/004 received targeted acceptance review; this is not a line-by-line review of all 211 commits. Most changes are focused hardening/test slices for larger open tasks; do not equate raw commit count with completed backlog items.
- `LIC-001` and `LIC-004` now meet their explicit engineering acceptance criteria. Inventory covers 180 locked versions plus the nested bundled component; CycloneDX/SPDX generators are deterministic and drift-checked in CI. Focused tests pass 7/7. This does not resolve the single nested license conflict or authorize publishing.
- `6bd558b fix(license): account for bundled SBOM components`: identified direct-child nested package manifests and represented bundled components in CycloneDX and SPDX; evidence contributes to LIC-001/004 completion.
- `4435964 fix(release): carry notices and gate unresolved licenses`: adds nested package obligations to notices; stages THIRD_PARTY_NOTICES in all six npm archives; verifies notice/archive byte identity and release evidence hashes; adds fail-closed `--require-clear` before publish. Release-script tests passed 17/17; cache-bypassed Turbo verification passed 23/23 tasks.
- GitHub verification for `4435964`: self-scan run `34664087596` passed; platform matrix run `34664087624` passed on Ubuntu, macOS, and Windows with Node 20, 22, and 24. PR #34 is open and mergeable, not merged.
- Inventory identifies `benchmark@1.0.0` nested in `fast-uri@3.1.4` with conflicting ISC/BSD-3-Clause declarations. This remains a legal review blocker; no license is inferred or cleared.
- Backlog audit: `VERGLOS_V1_BACKLOG.md` now records 156 unchecked / 113 checked / 269 total. The prior 158/111 checkpoint was stale because LIC-001/004 acceptance had not been credited.
- DIST-001 artifact-surface batch: CLI `5b9b695` adds common entrypoint/export validation across all six public package archives, rejects unsafe/unexpected archive members and private-key PEM markers in declared package contents, rejects install hooks and direct Trivy package dependencies, and excludes the non-public `cli-fixture` test harness from `verglos`. Focused tests pass 8/8; package-content audit and packed-manifest audit pass; six archives install in a clean npm consumer, all package imports and `verglos --version` work, and `engines status --json` confirms no implicit engine install/cache creation. Forced Turbo test/typecheck/build passed 23/23 tasks. PR #34 self-scan and all nine Ubuntu/macOS/Windows Node 20/22/24 cells pass (`34666384467`, `34666384473` attempt 2); the initial Windows/Node 20 Build attempt failed without a diagnostic but passed on unchanged rerun. DIST-001 remains unchecked because its backlog dependencies LOCAL/HUNT/RECORD and final package surfaces are not complete; no acceptance item is credited and the total remains 156 unchecked / 113 checked / 269. No artifacts were published; private docs remain local-only.
| 8 | Public copy, pricing, blog, landing, metadata | Deliberately deferred | scope guard | starts only after Phases 0–7 and release gates pass |

## Batch protocol

1. Select 3–8 related backlog IDs with dependencies and contract evidence.
2. Make any number of granular commits locally for auditability.
3. Run the complete affected repository suites and cross-repository checks.
4. Push the accumulated code commits together.
5. Update backlog and all affected shipping documents in one docs commit, then push it.
6. Record exact hashes, test output, branch divergence, blockers, and counts here.

## Explicit blockers requiring authorization or external state

- Legal review for licensing, contributor terms, privacy, trademarks, and enterprise obligations.
- Provider selection for durable queue and object storage.
- Authorized customer repositories/fixtures and external acceptance workflows.
- Independent Hunt isolation/security review.
- Separate approval for publishing, deployment, migrations, npm release, and public changes.

These are not treated as engineering completion, and no public claim is updated
while they remain unresolved.

- CI Hunt adversarial job (preparatory) | `.github/workflows/self-scan.yml` | Ubuntu self-scan now runs the pinned Docker Hunt suite with the validated Postgres image digest, enabling Linux-only namespace evidence in CI; local macOS run remains 46/47 with one explicit platform skip | CLI `f22c1b9`; CI result and independent review remain required
- CI Hunt adversarial result (evidence) | `.github/workflows/self-scan.yml` | GitHub Actions run `34605771365` passed the pinned Hunt Docker suite on Ubuntu, including the Linux PID/IPC namespace assertion, followed by build, tests, typecheck, package/public-boundary audits, and self-scan | commit `f22c1b9`; HUNT-011 still requires independent review before acceptance
- CI entitlement correction result (evidence) | `.github/workflows/self-scan.yml` | GitHub Actions run `34606069696` passed the full workflow after canonical `whoami` plan normalization | commit `5f5b600`; PLAN-CLI-002 remains preparatory pending allowance/source/expiry UX and hosted journey coverage
- CI entitlement payload boundary result (evidence) | `.github/workflows/self-scan.yml` | GitHub Actions run `34606697566` passed build, 113 CLI tests, pinned Docker Hunt suite, release-artifact verifier, typecheck, package/public-boundary audits, and self-scan after malformed/unknown capability plans were made fail-closed | commits `3a1f55e`, `5bd18b0`; PLAN-CLI-001 remains preparatory pending catalog-version/allowance migration
- Hunt outcome consistency boundary (local-only) | `packages/hunt/src/index.ts` | Adapter results with a canonical verdict must now agree with the legacy boolean/not-attemptable verdict; contradictory pairs fail closed. Hunt suite 48 tests (32 pass, 16 platform-gated skips) and full CLI suite/typecheck passed locally. | commit `d2f4fb0`; HUNT-007 remains preparatory pending complete recipe/fixture coverage
- Entitlement metadata boundary (local-only) | `packages/cli/src/entitlement.ts` | Capability payload `real_plan` is now constrained to the recognized plan vocabulary before cache/server data is accepted; unknown metadata fails closed. CLI suite 114/114 and typecheck passed locally. | commit `3ac29c8`; PLAN-CLI-001 remains preparatory pending catalog-version/allowance migration
- Entitlement capability display boundary (local-only) | `packages/cli/src/entitlement.ts` | Capability names containing control characters are rejected before cache/server data is accepted, preventing terminal/control-channel injection through untrusted metadata. CLI suite 115/115 and typecheck passed locally. | commit `fb1f7b9`; PLAN-CLI-001 remains preparatory pending catalog-version/allowance migration
- License-key entropy boundary (local-only) | `packages/shared/src/fingerprint.ts` | License-key generation now uses `crypto.randomBytes` rather than predictable `Math.random` input; checksum verification and randomness regression tests pass. Shared suite 304/304, CLI suite 115/115, and full typechecks passed locally. | commit `adc4e40`; licensing/release qualification gates remain open
- Telemetry retry jitter boundary (local-only) | `packages/cli/src/telemetry.ts` | Retry jitter now uses bounded `crypto.randomInt`, eliminating the remaining `Math.random` self-scan finding without changing retry limits or payload behavior. CLI suite 115/115 and typecheck passed locally. | commit `eaa2f64`; telemetry qualification and consent gates remain open
- Local self-scan revalidation (local-only) | `packages/cli/dist/index.js ci --threshold 95` | Local build and self-scan completed at 100/100, 0 critical/high/medium/low findings, complete coverage (489 files, 7/7 detectors), and 0 Hunt-verifiable findings. Remaining informational database-URL entries are masked snippets in imported research reports, not raw credentials. | commit `eaa2f64`; release qualification and independent review remain open
- Web license-key entropy boundary (local-only) | `verglos-web/src/vendor/shared/fingerprint.ts` | Vendored web license-key generation now uses `crypto.randomBytes`; dedicated regression tests verify checksum validity, wrong-secret rejection, and independence from `Math.random`. Web suite 50/50 and typecheck passed locally. | commit `e62f26c`; web release qualification remains open
- Package audit symlink boundary (local-only) | `scripts/check-package-contents.mjs` | Public-package audit now uses `lstat`, rejects declared and nested symlink paths before traversal, and preserves explicit failure reasons. Package/public-boundary audits, CLI tests 115/115, and typechecks passed locally. | commit `1824161`; full release qualification remains open
- Package audit containment boundary (local-only) | `scripts/check-package-contents.mjs` | Public-package audit now rejects absolute, non-string, and root-escaping `files` entries before filesystem access. Package/public-boundary audits, CLI tests 115/115, and typechecks passed locally. | commit `8483904`; full release qualification remains open
- Hunt runner signal classification boundary (local-only) | `packages/hunt/src/docker-runner.ts` | Timeout classification now requires host-timeout evidence (`killed`/`ETIMEDOUT`); a probe's own SIGTERM remains an explicit failed attempt. Hunt suite passes 49 tests with 48 passing and one platform-gated namespace skip; Docker integration passes 48/49 locally with the macOS namespace skip. | commit `2849602`; HUNT-007/008/011 and independent review remain open
- Distribution artifact revalidation (local-only) | `scripts/check-package-contents.mjs`, `scripts/check-packed-manifests.mjs`, `scripts/verify-release-artifacts.mjs` | Built all six public npm packages; package-content audit passed, packed-manifest audit passed for 6 archives, and SHA256SUMS verification passed for all 6 archives. No artifacts were published. | current `2849602`; DIST-001/003 remain preparatory pending optional-engine, SBOM, notice, and clean-consumer qualification
- Web production billing-config boundary (local-only) | `verglos-web/src/lib/runtime-config.ts` | Production validation now rejects malformed Razorpay amount/day/QR-close values and mismatched public/server key IDs before deployment; seven focused tests and web typecheck pass. No pricing values were changed. | web commit `cf87004`; DIST-WEB-002 remains preparatory pending full hosted provider/queue/object-storage configuration
- Web billing runtime boundary (local-only) | `verglos-web/src/lib/razorpay.ts` | Razorpay amount, duration, and QR-close helpers now fail closed on malformed or unsafe integers instead of producing `NaN`/invalid requests; web suite passes 54/54 and typecheck passes. | web commit `1b41c2a`; DIST-WEB-002 remains preparatory pending full hosted provider/queue/object-storage configuration
- Web Razorpay key runtime boundary (local-only) | `verglos-web/src/lib/razorpay.ts` | Runtime helpers now trim credential IDs, reject whitespace-only server credentials, and reject public/server key drift even when deployment preflight is bypassed; focused billing tests pass and web typecheck passes. | web commit `71af4d1`; DIST-WEB-002 remains preparatory pending full hosted provider/queue/object-storage configuration
- Web payment error-redaction boundary (local-only) | `verglos-web/src/app/api/razorpay/create-qr/route.ts`, `src/app/api/razorpay/qr-status/route.ts` | Payment routes no longer log raw Razorpay exception objects; operational logs retain only bounded status/code/reason metadata while response behavior remains compatible. Full web suite passes 54/54 and typecheck passes. | web commit `0bb15c8`; hosted payment qualification remains open
- Web API exception-redaction boundary (local-only) | `verglos-web/src/app/api/webhooks/razorpay/route.ts`, `src/app/api/license/unlock/route.ts`, `src/app/api/v1/cli-auth/start/route.ts` | Remaining API error handlers no longer log raw exception objects; logs retain only error type metadata while preserving generic client failures. Full web suite passes 54/54 and typecheck passes. | web commit `22adb95`; hosted operational qualification remains open
- Web entitlement-key configuration boundary (local-only) | `verglos-web/src/lib/runtime-config.ts` | Production config now requires a bounded PEM envelope for entitlement signing keys instead of accepting arbitrary strings containing “PRIVATE KEY”; focused config tests 8/8 and typecheck pass. | web commit `493bb79`; DIST-WEB-002 remains preparatory pending complete provider configuration qualification
- Web Razorpay credential-use boundary (local-only) | `verglos-web/src/lib/razorpay.ts` | Razorpay client construction now trims validated key material before SDK use, preventing whitespace-padded environment values from changing credentials; full web suite passes 55/55 and typecheck passes. | web commit `9357617`; hosted payment qualification remains open
- Web production build revalidation (local-only) | `verglos-web` | Next.js production build compiled successfully, type/lint checks passed, page data collection completed, and all 35 static pages generated. | current web `9357617`; deployment, migration, and hosted runtime gates remain open
- Web CI tracked-secret correction (local-only) | `verglos-web/src/lib/runtime-config.test.ts` | CI correctly rejected literal PEM markers in a tracked fixture; the test now constructs the envelope without tracked key material. Full web suite 55/55, typecheck, and local tracked-secret guard pass. | web commit `7fa2642`; public-secret guard remains enforced
- Web CI corrected-run result (local-only) | `.github/workflows/verify.yml` | Requeued run `34610517363` passed typecheck, full tests, database checks, production build, public-boundary audit, dependency audit, and tracked-secret guard. | web commit `7fa2642`; PR #32 remains mergeable
- CLI monitor status projection (local-only) | `packages/cli/src/monitor.ts`, `packages/cli/src/index.ts` | `verglos monitor status` now supports machine-safe `--json` output and quiet suppression, preserving existing human output; CLI suite passes 116/116 and typecheck passes. | CLI commit `43b098d`; LOCAL-001 remains preparatory pending universal common-option registration
- CLI monitor command output contract (local-only) | `packages/cli/src/monitor.ts`, `packages/cli/src/index.ts` | `monitor register`, `monitor unregister`, and `monitor test-alert` now support machine-safe `--json` results and `--quiet` suppression, with bounded error metadata and no channel secret echoing; CLI suite passes 119/119 and typecheck passes. | CLI commit `0491df3`; LOCAL-001 remains preparatory pending common options across remaining command families
- CLI whoami output contract (local-only) | `packages/cli/src/whoami.ts`, `packages/cli/src/index.ts` | `verglos whoami` now supports machine-safe JSON for signed-in/offline/free states and quiet suppression while masking license material and preserving human output; CLI suite passes 121/121 and typecheck passes. | CLI commit `45eece6`; LOCAL-001 remains preparatory pending common options across remaining command families
- CLI badge output contract (local-only) | `packages/cli/src/index.ts` | `verglos badge` now supports machine-safe JSON containing score and generated markdown, plus quiet suppression; default badge output is unchanged. CLI suite passes 121/121 and typecheck passes. | CLI commit `18b7e46`; LOCAL-001 remains preparatory pending common options across remaining command families
- CLI activation output contract (local-only) | `packages/cli/src/index.ts` | `verglos activate` now supports bounded machine-safe success/error JSON and quiet suppression without echoing license keys; existing human and `--ci` exit behavior remains. CLI suite passes 121/121 and typecheck passes. | CLI commit `26e457c`; LOCAL-001 remains preparatory pending common options across remaining command families
- CLI hook output contract (local-only) | `packages/cli/src/index.ts` | `verglos hook` now supports bounded machine-safe success/error JSON and quiet suppression while preserving existing human installation guidance; CLI suite passes 121/121 and typecheck passes. | CLI commit `4126fac`; LOCAL-001 remains preparatory pending common options across remaining command families
- CLI init JSON contract (local-only) | `packages/cli/src/init.ts`, `packages/cli/src/index.ts` | `verglos init --json` now requires `--yes` to prevent interactive prompt contamination, reports bounded config-write state, and never installs hooks silently; CLI suite passes 123/123 and typecheck passes. | CLI commit `052730f`; LOCAL-001 remains preparatory pending remaining command-family coverage and process fixtures
- CLI MCP config output contract (local-only) | `packages/cli/src/index.ts` | `verglos mcp --print-config --json` now emits exactly one compact JSON document and no explanatory prose; the existing human-readable `--print-config` output remains unchanged. CLI suite passes 123/123 and typecheck passes. | CLI commit `4bce926`; LOCAL-001 remains preparatory pending remaining command-family coverage and process fixtures
- CLI telemetry consent boundary (local-only) | `packages/cli/src/telemetry.ts`, `packages/cli/src/scan.ts` | Quiet/JSON scan paths and all CI runs now keep telemetry opt-in; `VERGLOS_TELEMETRY=1` explicitly enables it, while interactive scans preserve existing default behavior and opt-out controls. CLI suite passes 125/125 and typecheck passes. | CLI commit `7e29c69`; privacy/truth gates remain open for hosted purpose separation and final consent review
- CLI monitor entitlement output boundary (local-only) | `packages/cli/src/entitlement.ts`, `packages/cli/src/index.ts` | Capability-denied monitor commands now emit bounded JSON or no output in quiet mode instead of leaking the human upgrade banner; normal human invocations retain the existing CTA. CLI suite passes 125/125 and typecheck passes. | CLI commit `dd735f5`; LOCAL-001 remains preparatory pending remaining command-family coverage and process fixtures
- CLI command-contract regression guard (local-only) | `packages/cli/src/local-command-options.test.ts` | Added source-level guards for JSON/quiet registration across activation, identity, badge, hook, init, monitor subcommands, and MCP config output; CLI suite passes 125/125 and typecheck passes. | CLI commit `e98abb7`; LOCAL-001 remains preparatory pending runtime process fixtures and unimplemented command families
- Hunt Docker adversarial revalidation (local-only) | `packages/hunt/src/docker-runtime-adversarial.test.ts` | With Docker Desktop and pinned `postgres:15-alpine@sha256:2bf082886c059b4cf5af3f9e8d3a8916c35699062899061c13bc32d5921c631a`, the integration suite passed 48/49; the sole skip is the Linux-only PID/IPC namespace assertion on macOS. | 2026-09-11 local run; HUNT-011 and QUAL-CLI-004 remain open pending Linux namespace evidence and independent review
- Web end-to-end qualification revalidation (local-only) | `verglos-web` | Full web suite passed 55/55, TypeScript typecheck passed, Drizzle migration check passed for 15 ordered migrations, and Next.js production build generated all 35 pages. Node engine warning (workspace expects 22.x; local runtime is 26.4.0) is recorded and does not alter the result. | 2026-09-11 local run; hosted provider/license/SBOM/release gates remain open
- License inventory observation (historical, 2026-09-11) | `pnpm licenses list --json` in `verglos-cli` | Initial workspace dependency-graph count was 148 classified entries and did not cover every lockfile/platform version. | Superseded by the lock-complete, bundled-aware LIC-001 inventory at `4435964`.
- Distribution artifact checksum qualification (local-only) | `scripts/check-packed-manifests.mjs`, `scripts/verify-release-artifacts.mjs` | Built all six public npm archives; packed-manifest audit passed and a generated SHA256SUMS manifest verified all six archive checksums. No artifacts were published. | 2026-09-11 local run; DIST-001/003 remain preparatory pending optional-engine, SBOM, notice, and clean-consumer qualification
- CLI init quiet/process contract (local-only) | `packages/cli/src/init.ts`, `packages/cli/src/init.test.ts` | `init --quiet` refuses interactive execution without `--yes`, suppresses output with `--yes`, and has a subprocess fixture proving no prompt, output, or mutation. Full monorepo build/test passed; CLI 128 tests with one expected loopback skip. | commits `d1dd99e`, `24322ec`, `ab6e8f8`; LOCAL-001 remains preparatory pending universal command-family coverage
- CLI login machine-output contract (local-only) | `packages/cli/src/login.ts`, `packages/cli/src/index.ts` | Login supports bounded JSON pending/success/error states and quiet spinner/prose suppression; device credentials are not emitted. Full monorepo build/test passed; CLI 128 tests with one expected loopback skip. | commit `e978526`; LOCAL-001 remains preparatory pending universal command-family coverage
- Web cross-repository verification (local-only) | `verglos-web` | Full web suite passed 55/55, TypeScript typecheck passed, and Drizzle migration check passed for 15 ordered migrations. Node 26.4.0 engine warning (workspace expects Node 22.x) remains recorded. | 2026-09-12 local run; hosted provider, deployment, and acceptance gates remain open
- Web tenant relational-query audit (local-only) | `verglos-web/src/lib/organizations/tenant-scope.test.ts` | Tenant-scope regression coverage now checks both direct `.from(...)` queries and relational `db.query.<tenantTable>` lookups for organization predicates across tenant-owned tables; focused organization tests and typecheck pass. | web commit `7fa52a3`; HOSTED-011/012 remain preparatory pending runtime DAL and cross-tenant fixtures
- Web tenant audit cleanup (local-only) | `verglos-web/src/lib/organizations/tenant-scope.test.ts` | Removed a duplicate tenant-table entry from the static audit list; full web test command (55/55) and typecheck remained green. | web commit `2fe7d91`; HOSTED-011/012 remain preparatory
- Hunt Docker revalidation failure (local-only) | `packages/hunt/src/docker-runtime-adversarial.test.ts` | Re-run attempted with the pinned image configuration, but Docker Desktop’s daemon socket was unavailable (`~/.docker/run/docker.sock` missing; Docker Desktop log hook also lacked permission). The suite therefore returned 36 pass, 12 fail, and 1 explicit namespace skip; no security conclusion is drawn from this run. | 2026-09-12 local run; HUNT-011/QUAL-CLI-004 remain open pending a healthy Docker daemon and Linux namespace evidence
- Hunt adversarial evidence artifact (public CI workflow) | `.github/workflows/self-scan.yml` | The Ubuntu self-scan now captures the bounded pinned Hunt test transcript with `pipefail` and uploads it as a 14-day workflow artifact after success, preserving reviewable evidence without publishing source or private shipping files. | CLI commit `e86d4df`; HUNT-011/QUAL-CLI-004 remain open pending recipe dependencies and independent review
- Hunt evidence artifact CI verification (public CI workflow) | `.github/workflows/self-scan.yml` | GitHub Actions run `34644352510` completed successfully: build, full tests, pinned Hunt suite, evidence-artifact upload, release verifier, typecheck, package/public-boundary audits, and self-scan all passed. | 2026-09-12; HUNT-011/QUAL-CLI-004 still require HUNT-008–010 and independent review
- Hunt CI image identity correction (public CI workflow) | `.github/workflows/self-scan.yml` | The evidence job now names the exact `postgres:15-alpine` tag together with the immutable SHA-256 digest, matching local qualification and preventing accidental ambiguity about the runtime image identity. | CLI commit `3ac16a9`; new CI run pending; no backlog checkbox changed
- Cross-repository verification after CI evidence workflow (local-only) | `verglos-cli`, `verglos-web` | CLI Turbo test graph passed 12/12 tasks (145 pass, one documented loopback skip); web suite passed 65/65 and web typecheck passed. Web reports the existing Node 22 engine warning under local Node 26; no source changes were made in this verification slice. | 2026-09-12; hosted deployment, recipe execution, and downstream release gates remain open
- Hunt execution digest allowlist hardening (local-only) | `packages/shared/src/hunt-recipe-trust.ts`, `hunt-execution-gate.ts`, Hunt/shared tests | Added an execution-only trust predicate requiring the exact recipe content digest to be allowlisted; signer trust remains available for planning metadata, but unknown recipes can no longer reach execution binding. Full CLI tests pass 146/146 and typecheck passes 13/13. | CLI commit `6d15bfb`; HUNT-002 remains preparatory pending licensed/provenance-backed recipe registry
- Hunt digest-gate CI verification (public CI workflow) | `.github/workflows/self-scan.yml` | Ubuntu run `34644997283` passed build, full tests, pinned Hunt runtime suite with evidence upload, release verifier, typecheck, package/public-boundary audits, and self-scan after digest-gated execution changes. | 2026-09-12; HUNT-002 remains preparatory pending licensed/provenance-backed recipe registry
- Hunt trust signer input hardening (local-only) | `packages/shared/src/hunt-recipe-trust.ts`, `hunt-recipe-trust.test.ts` | Trust-policy signer identifiers now reject control characters before canonicalization or audit binding; full CLI tests and typecheck pass (13/13 typecheck tasks). | CLI commit `42b5d92`; HUNT-002 remains preparatory pending licensed/provenance-backed recipe registry
- Hunt non-integration regression revalidation (local-only) | `packages/hunt` | With integration disabled because no Docker daemon is available, all deterministic adapter/validation tests passed (33 pass, 16 expected integration/platform skips, 0 failures). This does not substitute for runtime isolation evidence. | 2026-09-12 local run; HUNT-011/QUAL-CLI-004 remain open
- Publish workflow boundary guard (local-only) | `scripts/publish-workflow-contract.test.mjs` | Added a regression test requiring the publish workflow to pack all six public packages, run package and packed-manifest audits, generate and verify SHA256SUMS, scan forbidden private paths, and publish with provenance. Contract test passes. | CLI commit `269a5aa`; DIST-001/003 remain preparatory pending clean-consumer, SBOM, notice, and release qualification
- Web lint tooling observation (local-only) | `verglos-web/package.json` | `pnpm lint` invokes deprecated `next lint` (Next 15.5) and prompts to create ESLint configuration, exiting non-zero in this environment. No config/dependency was invented; typecheck, tests, build, and migration checks remain the authoritative passing gates until lint policy/dependencies are explicitly selected. | 2026-09-12 local run; web release qualification retains tooling follow-up
- Web lint dependency installation blocker (local-only) | `verglos-web` | Attempting to add the required ESLint packages was rejected by pnpm because existing `node_modules` uses `/Users/anuragyadav/Library/pnpm/store/v10` while the current environment requires a different store; retrying with the existing store failed with `EPERM` creating a project symlink. No dependency or lockfile changes were made. | 2026-09-12 local run; lint tooling requires a permitted pnpm-store reinstall or explicit maintainer setup
- Web production build revalidation (local-only) | `verglos-web` | Next.js production build completed successfully, including internal lint/type validation, page data collection, and generation of all 35 pages. This is distinct from the standalone deprecated `next lint` command, which remains unconfigured. | 2026-09-12 local run; hosted deployment and lint-policy gates remain open
- Web environment/public-boundary verification (local-only) | `verglos-web` | `.env.production.local` is ignored by `.gitignore` and not tracked; no credential-bearing files were found in the tracked/untracked public candidate set, and the web public-boundary diff audit passed. | 2026-09-12 local run; deployment secret provisioning remains an external gate
- Web monitor API error-boundary hardening (local-only) | `verglos-web/src/app/api/v1/monitor/register/route.ts`, `src/app/api/v1/monitor/test-alert/route.ts` | Input and channel-encryption failures now return bounded generic reasons instead of raw exception messages; a route contract regression test covers both handlers. Full web suite passes 56/56 and typecheck passes. | web commit `68e867e`; hosted operational qualification remains open
- Web payment-provider error redaction (local-only) | `verglos-web/src/app/api/razorpay/create-qr/route.ts`, `src/app/api/razorpay/qr-status/route.ts` | Razorpay provider exception descriptions/codes/reasons are no longer returned to clients; responses use a bounded generic error while operational logs retain only safe metadata. Regression coverage passes; full web suite 57/57 and typecheck pass. | web commit `09863fd`; hosted payment qualification remains open
- Web organization input-error redaction (local-only) | `verglos-web/src/app/api/v1/organizations/...` | Organization project, policy, evidence, release, and evaluation routes now return bounded contract reasons for non-schema input failures instead of raw exception messages; tenant-scope audit coverage enforces the invariant. Full web suite passes 57/57 and typecheck passes. | web commit `6539639`; HOSTED-011/012 remain preparatory
- Web monitor delivery-error redaction (local-only) | `verglos-web/src/lib/monitor/dispatch.ts` | Email, Slack, and generic webhook delivery catches now return the bounded `delivery failed` reason instead of exposing raw network/SDK exception text through test-alert detail; route contract coverage enforces the invariant. Full web suite passes 57/57 and typecheck passes. | web commit `65a2737`; hosted delivery qualification remains open
- CLI login JSON failure fixture (local-only) | `packages/cli/src/login.test.ts` | A subprocess login against an unavailable local API emits exactly one bounded JSON `LOGIN_START` error, no stderr, and no filesystem mutation. CLI typecheck passed; focused invocation discovered 129 tests with 128 passes and one expected loopback skip. | local commit `9756a57`; push pending transient GitHub DNS recovery; LOCAL-001 remains preparatory
- CLI machine-error redaction (local-only) | `packages/cli/src/index.ts`, `packages/cli/src/init.ts`, `packages/cli/src/init.test.ts`, `packages/cli/src/local-command-options.test.ts` | Hook and init JSON failure responses now use bounded generic reasons instead of raw filesystem/OS error text; regression coverage verifies init failure output and hook contract. CLI test suite passes 129/130 with one expected loopback skip. | 2026-09-12 local; LOCAL-001 remains preparatory pending broader command-family review
- CLI record JSON error redaction (local-only) | `packages/cli/src/record-sign.ts`, `record-verify.ts`, `record-project.ts`, `record-header.ts` | Record command JSON failures now expose stable generic messages while human stderr retains actionable diagnostics; focused record suite passes 129/130 with one expected loopback skip. | CLI commit `64603ab`; LOCAL-005/008 and RECORD-009 remain preparatory pending full graph/approval integration
- MCP approval audit error boundary (local-only) | `packages/mcp/src/server.ts`, `packages/mcp/src/server.test.ts` | Failed approval-receipt persistence now returns a stable generic MCP error without leaking filesystem/OS details; regression test passes and MCP suite is 28/28. | CLI commit `4d7764d`; AGENT-005 remains preparatory pending runtime authority enforcement
- Hunt adapter error boundary (local-only) | `packages/hunt/src/index.ts`, `packages/hunt/src/index.test.ts` | Adapter execution failures now classify as environment errors with a stable redacted reason instead of echoing host/runtime exception text; Hunt suite passes 34/50 with 16 expected integration/platform skips. | CLI commit `559ed8c`; HUNT-007/011 remain open pending supported recipes and Linux sandbox evidence
- MCP tool execution error boundary (local-only) | `packages/mcp/src/server.ts` | Operational failures from check-before-write, package, scan, and explanation handlers now return stable generic MCP messages without leaking provider/path/runtime details; MCP suite passes 28/28. | CLI commit `bfb2618`; AGENT-005 remains preparatory pending runtime authority and execution evidence
- CLI inspection JSON error boundary (local-only) | `packages/cli/src/diff.ts`, `config-inspect.ts`, `target-inspect.ts`, `policy-check.ts` | Machine-readable failures now expose stable generic messages while human output retains actionable diagnostics; affected CLI tests pass 129/130 with one expected loopback skip. | CLI commit `7d6a96e`; LOCAL-004/005/006 remain preparatory pending schema and graph integration
- Web cron configuration error boundary (local-only) | `verglos-web/src/app/api/cron/monitor/route.ts`, `src/lib/cron-route-contract.test.ts` | Missing cron secret now returns a generic service-unavailable response without disclosing deployment configuration; web tests 58/58, typecheck, and production build pass. | web commit `2883458`; DIST-WEB-002/003 remain open pending deployment configuration and runbook evidence
- Web production-config wiring audit (local-only) | `verglos-web/next.config.ts`, `.env.production.local` | Attempted production-build enforcement using the existing validator, but the local env file contains placeholders/invalid values (missing secrets, non-Postgres URL, public-key drift, invalid billing); enforcement was reverted so the known-good build remains intact. No commit. | 2026-09-12; DIST-WEB-002 is blocked on real deployment secret provisioning, not validator implementation
- CLI record-create JSON error contract (local-only) | `packages/cli/src/record-create.ts`, `record-create.test.ts` | `record create --json --quiet` now emits one bounded `RECORD_CREATE_INPUT` error object on failure instead of silent output; record-create/CLI suite passes 130/131 with one expected loopback skip. | CLI commit `b9e3d5a`; RECORD-009 remains preparatory pending complete graph assembly and approval receipt integration
- CLI evidence JSON error contract (local-only) | `packages/cli/src/index.ts`, `packages/cli/src/local-command-options.test.ts` | `evidence import/export --json --quiet` now emits bounded structured failures instead of silent output; focused CLI suite passes 130/131 with one expected loopback skip. | CLI commit `2d5a738`; LOCAL-001/008 remain preparatory pending universal process fixtures and export integration
- Web cron bearer redirect boundary (local-only) | `verglos-web/.github/workflows/monitor-cron.yml`, `src/lib/monitor-cron-workflow.test.ts` | Removed curl redirect-following from the secret-bearing cron request and added a regression guard; web tests 59/59 and typecheck pass. | web commit `4b6e122`; OPS-008/DIST-WEB-003 remain open pending full webhook/cron operational qualification
- CLI login JSON failure boundary (local-only) | `packages/cli/src/login.ts` | Unexpected login polling/credential-save failures now emit the stable `LOGIN_FAILED` message in JSON mode while human output retains diagnostics; focused CLI suite passes 130/131 with one expected loopback skip. | CLI commit `eff1ee7`; LOCAL-001 remains preparatory pending universal process fixtures
- CLI engine JSON error contract (local-only) | `packages/cli/src/engines-install.ts`, `engines-install.test.ts` | Engine install/update/rollback failures now emit a bounded `ENGINE_INSTALL_INPUT` object in JSON mode while human diagnostics remain available; affected CLI suite passes 131/132 with one expected loopback skip. | CLI commit `cccd050`; ENGINE install qualification remains open pending platform and provenance evidence
- CLI engine-status JSON/quiet contract (local-only) | `packages/cli/src/engines-status.ts`, `engines-status-format.test.ts` | `engines status --json --quiet` now preserves its machine-readable payload; regression coverage confirms JSON takes precedence over human-output suppression. | CLI commit `c3a0eab`; LOCAL-001 remains preparatory pending universal command-family fixtures
- CLI command preflight JSON boundary (local-only) | `packages/cli/src/index.ts` | Record-sign and engine install/update/rollback approval-receipt preflight failures now emit bounded machine errors under `--json --quiet` instead of silent output; typecheck and affected CLI suite pass 131/132 with one expected loopback skip. | CLI commit `5657a8f`; LOCAL-001/RECORD-009 remain preparatory pending full process-fixture coverage and graph integration
- CLI machine-output process fixtures (local-only) | `packages/cli/src/machine-output-process.test.ts` | Subprocess coverage now verifies one bounded JSON response, empty stderr, and exit 78 for record-sign, engine-install, and evidence-import preflight failures; focused fixture suite passes 3/3. | CLI commit `b057e21`; LOCAL-001 remains preparatory pending universal command-family process coverage
- CLI monorepo revalidation (local-only) | all public packages | Full Turbo test, typecheck, and build pipelines pass (12/12 tests, 13/13 typechecks, 8/8 builds); one expected macOS loopback viewer skip remains. | 2026-09-12 local run; hosted CI state could not be queried because GitHub API DNS was unavailable
- CLI target preflight JSON contract (local-only) | `packages/cli/src/index.ts`, `packages/cli/src/machine-output-process.test.ts` | Unsupported `target inspect` kinds now emit a bounded `TARGET_INSPECT_INPUT` JSON response under `--json --quiet`; typecheck and four subprocess fixtures pass. | CLI commit `98fdf9e`; LOCAL-001 remains preparatory pending universal command-family coverage
- CLI post-fixture full revalidation (local-only) | all public packages | After the process-fixture and preflight changes, full Turbo tests, typechecks, and builds remain green (12/12, 13/13, 8/8) with one expected macOS loopback skip. | 2026-09-12 local run; hosted CI state remains unqueried due GitHub API DNS failure
- Hunt Docker prerequisite recheck (local-only) | `packages/hunt` | Docker CLI is installed but the configured daemon socket remains absent (`~/.docker/run/docker.sock`), so adversarial runtime tests cannot be run or accepted as evidence. | 2026-09-12 local run; HUNT-011/QUAL-CLI-004 remain open pending a healthy Linux-capable Docker runtime
- CLI JSON/quiet failure precedence (local-only) | `packages/cli/src/config-inspect.ts`, `record-header.ts`, `machine-output-process.test.ts` | Config inspection and record-header failures now emit one bounded JSON response even with `--quiet`; six subprocess fixtures pass and typecheck is green. | CLI commit `bdd767b`; LOCAL-001/005 remain preparatory pending universal process coverage and graph integration
- MCP runtime entitlement validation (local-only) | `packages/mcp/src/server.ts`, `server.test.ts` | MCP dispatch now rejects unknown runtime `plan` values before capability comparison, failing closed with `MCP_ENTITLEMENT_INVALID`; MCP suite passes 29/29. | CLI commit `0eaf522`; AGENT-005 remains preparatory pending full authority-source integration
- MCP malformed entitlement validation (local-only) | `packages/mcp/src/server.ts`, `server.test.ts` | Dispatch now validates any supplied runtime `plan`, including empty-string and non-string values, before rank comparison; malformed values fail closed with `MCP_ENTITLEMENT_INVALID`. MCP tests pass 29/29 and package typecheck passes. | CLI commit `7b2c6af` local; push blocked by transient GitHub DNS; AGENT-005 remains preparatory pending full authority-source integration
- CLI post-entitlement revalidation (local-only) | all public packages | Full Turbo test and typecheck pipelines remain green after `7b2c6af`: 12/12 test tasks successful (Hunt retains 16 documented integration skips) and 13/13 typecheck tasks successful. | 2026-09-12; hosted CI remains the PR gate
- CLI MCP quiet configuration contract (local-only) | `packages/cli/src/index.ts`, `local-command-options.test.ts` | `mcp --print-config --quiet` now emits only the machine config and suppresses setup guidance; source contract regression passes. CLI suite passes 137/138 with one expected loopback listener skip and typecheck passes. | CLI commit `09aa491`; LOCAL-001 remains preparatory pending universal option registration and full process matrix
- CLI MCP quiet process fixture (local-only) | `packages/cli/src/machine-output-process.test.ts` | Subprocess coverage proves `mcp --print-config --quiet` exits 0, emits exactly one parseable config JSON document, emits no stderr, and creates no files. CLI suite passes 139/139 in this focused run. | CLI commit `e760ebd`; LOCAL-001 remains preparatory pending universal option registration and full process matrix
- Web migration file-boundary hardening (local-only) | `verglos-web/scripts/check-migrations.ts`, `scripts/check-migrations.test.ts` | Migration validation now rejects symlinked journal/SQL files and oversized reviewed files before parsing; 3/3 migration tests, ordered migration check (15 files), and web typecheck pass. | Web commit `af659a6`; HOSTED-001 remains complete while reproducible deployment/rollback evidence remains downstream
- Web post-migration full test revalidation (local-only) | `verglos-web` | Full configured web suite passes 60/60, including migration, authorization, monitor, entitlement, receipt, and runtime-config contracts after `af659a6`. | 2026-09-12; hosted deployment and production configuration gates remain open
- Web cron endpoint transport guard (local-only) | `verglos-web/.github/workflows/monitor-cron.yml`, `src/lib/monitor-cron-workflow.test.ts` | Secret-bearing cron workflow now fails closed unless `BASE_URL` is HTTPS and contains no embedded credentials; static workflow regression passes and web typecheck passes. | Web commit `f09a0d2`; OPS-008 remains open pending runtime DNS/private-address revalidation and delivery evidence
- CLI config migration guard (local-only) | `packages/shared/src/config.test.ts` | Regression coverage locks undeclared `engine`, `record`, and `telemetry` sections to deterministic migration warnings; no unversioned fields are silently applied. Shared suite passes 305/305 and typecheck passes. | CLI commit `edf281e`; LOCAL-002 remains preparatory until versioned section contracts are authorized and implemented
- CLI scanner cancellation boundaries (local-only) | `packages/scanner/src/index.ts`, `orchestration.test.ts` | Scan now checks cancellation after config, target resolution, and filesystem walk stages; regression coverage proves an abort at a stage boundary stops before detector execution. Scanner suite passes 71/71 and typecheck passes. | CLI commit `e644c90`; LOCAL-003 remains preparatory pending producer adapters and snapshot assembly
- CLI detector cancellation boundary (local-only) | `packages/scanner/src/index.ts` | Detector workers now check cancellation immediately after detector execution and before emitting completion, preventing cancelled runs from reporting a completed detector. Scanner suite passes 71/71 and typecheck passes. | CLI commit `b9ee463`; LOCAL-003 remains preparatory pending producer adapters and snapshot assembly
- CLI scanner root boundary (local-only) | `packages/scanner/src/index.ts`, `orchestration.test.ts` | Scans now reject relative, missing, symlinked, and non-directory project roots before config loading or walking; adversarial orchestration coverage passes. Scanner suite passes 72/72 and typecheck passes. | CLI commit `bf4b7d8`; LOCAL-003 remains preparatory pending producer adapters and snapshot assembly
- Cross-repository gate revalidation (local-only) | `verglos-cli`, `verglos-web` | CLI full Turbo tests, typechecks, and builds completed successfully (12/12 test tasks, 13/13 typechecks, 8/8 builds); web full configured suite 60/60, typecheck, and 15-migration validation pass. | 2026-09-12; Hunt Linux runtime, hosted deployment, and production configuration evidence remain open
- Live PR gate check (local-only) | CLI PR #34 and web PR #32 | Both phase branches are synchronized with origin. CLI PR #34 is OPEN/MERGEABLE with self-scan IN_PROGRESS; web PR #32 is OPEN/MERGEABLE with typecheck-and-schema, GitGuardian, and Vercel checks successful (one unnamed neutral check). | 2026-09-12; do not merge CLI until its self-scan completes and phase review is accepted
- CLI public projection immutability (local-only) | `packages/shared/src/public-record-projection.ts`, `public-record-projection.test.ts` | Public record projections now deep-freeze redaction state and nested digests, preventing post-verification mutation of public truth; shared suite passes 306/306 and typecheck passes. | CLI commit `92a318b`; RECORD-011 remains preparatory pending full record assembly and hosted receipt wiring
- Web report tenant predicate (local-only) | `verglos-web/src/app/reports/[id]/page.tsx`, `src/lib/report-access.test.ts` | Authenticated report lookup now includes the local user's tenant/owner predicate before fetching the row; regression guard rejects the prior unscoped query. Focused test and web typecheck pass. | Web commit `406cc3f`; HOSTED-011/012 remain open pending complete DAL and negative-authorization coverage
- Web report ID boundary (local-only) | `verglos-web/src/app/reports/[id]/page.tsx`, `src/lib/report-access.test.ts` | Report pages reject malformed UUID path parameters before database access, matching the UUID-backed schema and preserving fail-closed not-found behavior. Focused test and web typecheck pass. | Web commit `ff19074`; HOSTED-011/012 remain open
- Web tenant-scope regression audit (local-only) | `verglos-web/src/lib/organizations/tenant-scope.test.ts` | Central tenant-scope audit now also covers the authenticated report page and forbids regression to an unscoped report query. Full web suite passes 61/61 and typecheck passes. | Web commit `64257b8`; HOSTED-011/012 remain open pending runtime DAL and negative cross-tenant fixtures
- Web release idempotency scope (local-only) | `verglos-web/src/app/api/v1/organizations/[organizationId]/projects/[projectId]/releases/route.ts`, `src/lib/organizations/tenant-scope.test.ts` | Existing release lookup now includes both organization and project predicates before idempotency comparison, preventing cross-project release-ID reads. Focused authorization/idempotency tests pass 5/5 and web typecheck passes. | Web commit `ec6b007`; HOSTED-011/012 remain open
- Web project-route tenant regression matrix (local-only) | `verglos-web/src/lib/organizations/tenant-scope.test.ts` | Added a grouped static regression covering receipts, evidence, policies, policy evaluations, and releases; each project-scoped route must retain organization and project predicates. Focused tenant suite passes 5/5 and web typecheck passes. | Web commit `0b726b5`; HOSTED-011/012 remain preparatory pending runtime DAL and cross-tenant fixtures
- Web tenant audit predicate strength (local-only) | `verglos-web/src/lib/organizations/tenant-scope.test.ts` | Strengthened the grouped route audit to require a project predicate inside the query's `where(...)` expression, preventing a route from passing solely by mentioning `projectId` elsewhere. Tenant suite passes 5/5; commit pushed after one transient DNS retry. | Web commit `18218de`; HOSTED-011/012 remain preparatory pending runtime DAL and cross-tenant fixtures
- Web post-strengthening full revalidation (local-only) | `verglos-web` | Complete configured web suite passes 63/63 after the stronger tenant predicate audit; migration, authorization, receipt, entitlement, monitor, billing, and runtime-config contracts remain green. | 2026-09-12; runtime DAL fixtures, hosted deployment evidence, and Docker/Linux Hunt evidence remain open
- CLI fix preflight machine-safety (local-only) | `packages/cli/src/index.ts`, `packages/cli/src/local-command-options.test.ts` | `fix --json --quiet` now emits bounded structured errors for missing/invalid approval receipts and denied approval instead of human stderr; focused fix/options suite passes 19/19 and CLI typecheck passes. | CLI commit `0d7a6aa`; LOCAL-001/AGENT-007 remain preparatory pending universal process fixtures and full mutation/rescan rollback qualification
- CLI fix transaction-output boundary (local-only) | `packages/cli/src/index.ts` | Approved `fix --json` now emits its success document only after mutation and optional rescan complete; rescan failure rolls back and returns a bounded `FIX_RESCAN_FAILED` response without a preceding false success payload. Focused fix/options suite passes 19/19 and typecheck passes. | CLI commit `5586a22`; LOCAL-001/AGENT-007 remain preparatory pending universal process fixtures and full rollback qualification
- CLI fix apply-error boundary (local-only) | `packages/cli/src/index.ts`, `packages/cli/src/local-command-options.test.ts` | Header mutation failures now return bounded `FIX_APPLY_FAILED` JSON in machine mode instead of leaking raw exceptions; focused fix/options suite passes 19/19 and typecheck passes. | CLI commit `965a8ad`; LOCAL-001/AGENT-007 remain preparatory pending full mutation rollback qualification
- CLI Hunt option boundary (local-only) | `packages/cli/src/hunt.ts`, `packages/cli/src/hunt-options.test.ts` | Beta Hunt command now rejects unknown severities, unsupported sandbox IDs, oversized/control-character options before entitlement lookup and emits bounded `HUNT_INPUT` JSON; focused tests pass 2/2 and CLI typecheck passes. | CLI commit `e07f296`; HUNT-009 remains preparatory pending supported recipe registry and execution evidence
- CLI Hunt help truth (local-only) | `packages/cli/src/index.ts`, `packages/cli/src/hunt-options.test.ts` | Hunt help now advertises only the currently supported `auto` and `docker` adapters, matching runtime validation and avoiding obsolete node-vm/firecracker claims; Hunt option tests pass 3/3 and typecheck passes. | CLI commit `3793b7d`; HUNT-009 remains preparatory pending supported recipe registry and execution evidence
- CLI Attest option boundary (local-only) | `packages/cli/src/attest.ts`, `packages/cli/src/attest-options.test.ts` | Legacy Attest shell now rejects control-character/oversized report paths and non-HTTPS or credential-bearing verify URLs before entitlement lookup, with bounded `ATTEST_INPUT` JSON; focused tests pass 2/2 and typecheck passes. | CLI commit `2a97928`; RECORD-010 remains preparatory pending canonical record migration and signing lifecycle
- CLI Explain input boundary (local-only) | `packages/cli/src/explain.ts`, `packages/cli/src/explain-options.test.ts` | Explain now rejects control-character and oversized rule IDs before lookup, emitting bounded `EXPLAIN_INPUT` JSON in machine mode; focused tests pass 2/2 and typecheck passes. | CLI commit `e27a828`; LOCAL-001 remains preparatory pending universal process fixtures
- CLI Badge error boundary (local-only) | `packages/cli/src/index.ts`, `packages/cli/src/local-command-options.test.ts` | Badge generation now catches scan/import failures and emits bounded `BADGE_INPUT` JSON in machine mode instead of an unhandled stack; command-option regression suite passes 4/4 and CLI typecheck passes. | CLI commit `42f1490`; LOCAL-001 remains preparatory pending universal process fixtures
- CLI Score error boundary (local-only) | `packages/cli/src/index.ts`, `packages/cli/src/local-command-options.test.ts` | `score --json` now catches scanner/config failures and emits bounded `SCORE_INPUT` JSON instead of an unhandled exception; command-option regression suite passes 4/4 and CLI typecheck passes. | CLI commit `f43a3be`; LOCAL-001 remains preparatory pending universal process fixtures
- CLI CI error boundary (local-only) | `packages/cli/src/index.ts`, `packages/cli/src/local-command-options.test.ts` | `ci --json` now bounds entitlement/scanner failures as `CI_INPUT` JSON and avoids unhandled stacks; command-option regression suite passes 4/4 and CLI typecheck passes. | CLI commit `306c828`; LOCAL-001 remains preparatory pending universal process fixtures
- CLI post-command-boundary revalidation (local-only) | all public CLI packages | Full Turbo test pipeline passes 12/12 tasks; CLI package reports 145 passing with one documented loopback skip after Hunt/Attest/Explain/Badge/Score/CI hardening. | 2026-09-12; typecheck/build and hosted CI remain downstream gates
- Web monitoring fingerprint identity boundary (local-only) | `verglos-web/src/app/api/v1/monitor/register/route.ts`, `test-alert/route.ts`, `registration/[fingerprint]/route.ts`, `src/lib/monitor/route-error-contract.test.ts` | Registration, canary, and unregister APIs now accept only the CLI's canonical 64-character lowercase SHA-256 project fingerprint; full web suite passes 64/64 and typecheck passes. | Web commit `6438091`; OPS monitoring migration remains open pending hosted worker, delivery, and reconciliation evidence
- Cross-repository post-hardening revalidation (local-only) | `verglos-cli`, `verglos-web` | CLI full Turbo tests pass 138/139 with one documented loopback skip; web full configured suite passes 64/64. Latest CLI machine-output and web fingerprint changes introduce no regressions. | 2026-09-12; hosted CI/Docker Linux runtime and downstream acceptance evidence remain open
- Web monitoring registration text boundary (local-only) | `verglos-web/src/app/api/v1/monitor/register/route.ts`, `src/lib/monitor/route-error-contract.test.ts` | Registration labels, dependency names/versions, and CLI version now reject control characters while preserving bounded Unicode values; full web suite passes 65/65 and typecheck passes. | Web commit `b8e9cf3`; OPS monitoring migration remains open pending hosted worker and reconciliation evidence
- Cross-repository verification revalidation (local-only) | `verglos-cli`, `verglos-web` | CLI Turbo tests pass 138/139 with one documented loopback-listener skip; all 12 test tasks succeed. Web configured suite passes 62/62. No source or private-doc changes were made in this slice. | 2026-09-12; hosted CI, Docker Linux namespace evidence, and downstream acceptance gates remain open
- CLI scan spinner failure cleanup (local-only) | `packages/cli/src/scan.ts` | Scan progress cleanup now stops the spinner from the lifecycle `finally` block, including scanner failures; full Turbo test pipeline passes 12/12 tasks with 145 CLI tests passing and one documented loopback-listener skip. | CLI commit `80884ec`; LOCAL-001 remains preparatory pending broader process-fixture coverage
- Hunt Docker adversarial revalidation (local-only) | `packages/hunt/src/docker-runtime-adversarial.test.ts` | With Docker Desktop reachable, the pinned `postgres:15-alpine@sha256:2bf082886c059b4cf5af3f9e8d3a8916c35699062899061c13bc32d5921c631a` runtime passed 15/16 adversarial checks: non-root, read-only mounts/rootfs, no network/socket/devices, no-new-privileges, redaction, output/memory/tmpfs/process/timeout bounds, and signal handling. The PID/IPC namespace check remains explicitly skipped because the test host is macOS; this is not Linux namespace evidence. | 2026-09-12 local run; HUNT-011/QUAL-CLI-004 remain open pending Linux namespace evidence and independent review
- CLI Hunt trust-policy validation (local-only) | `packages/shared/src/hunt-recipe-trust.ts`, `hunt-recipe-trust.test.ts` | Empty recipe digest allowlists are rejected while signer, digest, revocation, expiry, duplicate, control-character, and unknown-field checks remain covered. Shared suite passes 308/308 and full CLI tests/typechecks/build pass. | CLI commit `33c4bbb`; HUNT-002/008 remain preparatory pending licensed, provenance-backed recipe content
- CLI network-scope canonicalization (local-only) | `packages/shared/src/hunt-recipe.ts`, `approval-receipt.ts`, related tests | Hunt recipe and approval network scopes now reject duplicate destinations, preventing ambiguous exact allowlist comparisons. Full CLI tests, typechecks, build, and diff checks pass. | CLI commit `29dff62`; HUNT-003/009 remain preparatory pending authorized recipe registry and execution semantics
- CLI MCP serialization boundary (local-only) | `packages/mcp/src/server.ts`, `server.test.ts` | MCP dispatch now converts cyclic, hostile, or otherwise non-serializable argument objects into bounded structured usage errors instead of throwing outside the protocol contract. MCP suite passes 30/30; full CLI tests, typechecks, and build pass. | CLI commit `56f4aeb`; AGENT-003/005 remain preparatory pending complete shared runtime authority routing
- CLI Hunt execution input boundary (local-only) | `packages/shared/src/hunt-execution-gate.ts`, `hunt-execution-gate.test.ts` | Network-scope evaluation is now inside the fail-closed guard, so malformed approval input returns `false` rather than throwing. Shared suite and full CLI tests/typechecks/build pass. | CLI commit `3a2cf41`; HUNT-003/009 remain preparatory pending authorized recipe registry and execution evidence
- CLI MCP response boundary (local-only) | `packages/mcp/src/server.ts`, `server.test.ts` | MCP response encoding now returns a structured `MCP_OUTPUT_INVALID` error for circular or otherwise non-serializable handler payloads instead of throwing outside the transport contract. MCP suite passes 31/31; full CLI tests, typechecks, and build pass. | CLI commit `2ff9400`; AGENT-003/005 remain preparatory pending complete runtime authority routing
- CLI Hunt evidence immutability (local-only) | `packages/hunt/src/index.ts`, `index.test.ts` | Returned Hunt findings are now structured-cloned and recursively frozen, preventing callers from mutating projected evidence or altering the original scan report after execution. Hunt tests and full CLI tests/typechecks/build pass. | CLI commit `feaf169`; HUNT-003/009 remain preparatory pending authorized recipe registry and execution evidence
- CLI MCP truth comment (local-only) | `packages/mcp/src/server.ts` | Corrected stale Free-tier-only comment to reflect optional host-supplied entitlement across the contracted plan set, with no network lookup on the hot path. MCP tests 31/31 and typecheck pass. | CLI commit `28c14a8`; AGENT-003/005 remain preparatory pending complete runtime authority routing
- Web webhook response boundary (local-only) | `verglos-web/src/lib/monitor/dispatch.ts`, `dispatch.test.ts` | Webhook delivery now consumes chunked response bodies with a strict 64 KiB cap and cancels oversized streams; focused/full web suite passes 67/67 and typecheck passes. | Web commit `f79ee61`; OPS-008 remains preparatory pending queue, retry, and production delivery evidence
- CLI machine-mode process fixtures (local-only) | `packages/cli/src/machine-output-process.test.ts` | Added subprocess coverage for Hunt and Attest entitlement denials and Explain JSON success, asserting deterministic exits, one parseable stdout document, empty stderr, and no unexpected files. Full CLI tests/typechecks/build pass. | CLI commit `d737e25`; LOCAL-001 remains preparatory pending complete command-family process matrix
- CLI score process fixture (local-only) | `packages/cli/src/machine-output-process.test.ts` | Added subprocess coverage for a score configuration failure, asserting exit 2, bounded JSON `SCORE_INPUT`, empty stderr, and no unexpected files. Full CLI tests/typechecks/build pass. | CLI commit `84d154a`; LOCAL-001 remains preparatory pending complete command-family process matrix
- CLI focused scan process fixtures (local-only) | `packages/cli/src/machine-output-process.test.ts` | Added subprocess coverage for `secrets --json --quiet` and `deps --json --quiet`, including canonical project-root identity, parseable scan documents, empty stderr, and telemetry disabled explicitly. Full CLI tests/typechecks/build pass. | CLI commit `77b09c8`; LOCAL-001 remains preparatory pending remaining command-family process matrix
- CLI CI process fixture (local-only) | `packages/cli/src/machine-output-process.test.ts` | Added subprocess coverage for `ci --json --quiet` on a clean temporary project, asserting deterministic success, score payload, parseable output, empty stderr, and explicit telemetry opt-out. Full CLI tests/typechecks/build pass. | CLI commit `da342b3`; LOCAL-001 remains preparatory pending remaining command-family process matrix
- CLI core scan process fixture (local-only) | `packages/cli/src/machine-output-process.test.ts` | Added subprocess coverage for `scan --json --quiet --no-telemetry`, asserting canonical project-root identity, parseable scan output, empty stderr, and no file side effects. Full CLI tests/typechecks/build pass. | CLI commit `81cd878`; LOCAL-001 remains preparatory pending remaining command-family process matrix
- CLI badge process fixture (local-only) | `packages/cli/src/machine-output-process.test.ts` | Added subprocess coverage for `badge --json --quiet`, asserting deterministic score/markdown payload, empty stderr, and no file side effects. Full CLI tests/typechecks/build pass. | CLI commit `64f42dc`; LOCAL-001 remains preparatory pending remaining command-family process matrix
- CLI whoami process fixture (local-only) | `packages/cli/src/machine-output-process.test.ts` | Added subprocess coverage for the no-credentials Free fallback, asserting exact machine JSON, exit 0, empty stderr, and isolated HOME state. Full CLI tests/typechecks/build pass. | CLI commit `b9c38e9`; LOCAL-001 remains preparatory pending remaining command-family process matrix
- CLI top-level process contract (local-only) | `packages/cli/src/machine-output-process.test.ts` | Added subprocess coverage for `--version` and `--help`, asserting deterministic successful output, empty stderr, and no filesystem side effects. Full CLI tests/typechecks/build pass. | CLI commit `979b224`; LOCAL-001 remains preparatory pending remaining command-family process matrix
- CLI mutation approval and write boundary (local-only) | `packages/cli/src/fix.ts`, `packages/cli/src/fix.test.ts` | Header fixes now require an exact approved file set (no widened or narrowed receipt scope), and Next.js config replacement opens the already-planned regular file with `O_NOFOLLOW` before truncation, reducing symlink-swap risk. Full Turbo tests (23/23 tasks; 158 CLI tests) and typechecks/build pass. | CLI commit `174301c`; AGENT-007 remains preparatory pending full mutation/rescan rollback qualification
- CLI rollback snapshot boundary (local-only) | `packages/cli/src/index.ts` | Post-fix rollback snapshots now read and restore through bounded regular-file handles with `O_NOFOLLOW`, preventing a rescan-time symlink replacement from being read or overwritten; snapshot size and file-type checks remain enforced. Full Turbo tests (23/23 tasks; 158 CLI tests) and typechecks/build pass. | CLI commit `1a964a1`; AGENT-007 remains preparatory pending full mutation/rescan rollback qualification
- CLI fix-plan revalidation (local-only) | `packages/cli/src/fix.ts` | The mutation path now re-plans immediately after approval and rejects any file-set change before selecting a writer, preventing a project-type/path change from turning an approved fix into an unapproved mutation. Focused fix tests and CLI typecheck pass. | CLI commit `3a267c8`; AGENT-007 remains preparatory pending full mutation/rescan rollback qualification
- CLI precommit error boundary (local-only) | `packages/cli/src/precommit.ts`, `packages/cli/src/machine-output-process.test.ts` | Scanner/config failures in `precommit` now return exit 2 with one bounded `PRECOMMIT_INPUT` JSON document (or concise human output) instead of an unhandled exception; subprocess coverage verifies empty stderr and deterministic output. CLI tests/typecheck pass. | CLI commit `652585a`; LOCAL-001 remains preparatory pending the remaining command-family process matrix
- CLI machine-output process matrix expansion (local-only) | `packages/cli/src/machine-output-process.test.ts` | Added subprocess qualification for `diff`, `policy check`, `engines status`, and successful `precommit`, covering deterministic exits, parseable JSON, empty stderr, and isolated filesystem behavior. CLI suite passes 163/163 and typecheck passes. | CLI commit `8930d9a`; LOCAL-001 remains preparatory pending remaining mutation/session edge cases
- CLI bounded rollback snapshot reads (local-only) | `packages/cli/src/index.ts` | Rollback snapshot capture now reads in capped chunks through a no-follow handle, rejecting concurrent growth without an unbounded whole-file allocation; focused fix tests (163/163 suite) and typecheck pass. | CLI commit `bb32960`; AGENT-007 remains preparatory pending full mutation/rescan rollback qualification
- CLI session/monitor process fixtures (local-only) | `packages/cli/src/machine-output-process.test.ts` | Added subprocess qualification for activation network failure and monitor capability denial, asserting deterministic exits, bounded JSON, and empty stderr in isolated HOME environments. CLI suite passes 165/165. | CLI commit `e42a592`; LOCAL-001 remains preparatory pending hook and remaining command-family edge cases
- CLI hook false-success boundary (local-only) | `packages/cli/src/config.ts`, `packages/cli/src/index.ts`, `packages/cli/src/machine-output-process.test.ts` | Hook installation now returns whether a Git hook was actually written; outside a Git repository, JSON reports `skipped/not_a_git_repository` instead of falsely claiming installation. Subprocess and config tests pass; CLI suite reaches 166/166. | CLI commit `33bf090`; LOCAL-001 remains preparatory pending final command-family review
- CLI hook process qualification (local-only) | `packages/cli/src/machine-output-process.test.ts` | Added subprocess coverage for both no-Git skip and real Git-hook installation, asserting bounded JSON, empty stderr, and actual hook creation when `.git/hooks` exists. CLI suite passes 167/167. | CLI commit `965e19c`; LOCAL-001 remains preparatory pending final command-family review
- CLI Git hook race hardening (local-only) | `packages/cli/src/config.ts` | Existing hook backups are created exclusively and hook replacement uses a no-follow regular-file handle, preventing concurrent replacement from overwriting a backup or redirecting the write. Hook/config tests and CLI typecheck pass. | CLI commit `09a11e9`; LOCAL-001 remains preparatory pending final command-family review
- Cross-repository verification recheck (local-only) | `verglos-cli`, `verglos-web` | CLI self-scan runs through `09a11e9` pass, including Docker Hunt, package/public-boundary audits, and self-scan. Web migration validation passes all 15 ordered migrations and the configured web suite passes 67/67. Production runtime-config check correctly fails closed when required deployment secrets are absent; no production claim is made from local defaults. | 2026-09-12; hosted deployment configuration and downstream release gates remain open

## Latest local evidence

- Seven-hour review window, measured 2026-09-12 07:06 IST: CLI `ab6e8f8`–`4435964` (120 commits; 00:21–06:41 IST) and web `7fa52a3`–`4a6571a` (21 commits; 00:30–06:00 IST), 141 total. Reconciled all commit subjects/file lists and aggregate implementation/test/config/workflow diffs against backlog acceptance criteria. The changes cluster into CLI machine-output/process contracts, scanner cancellation/path portability, MCP/Hunt validation and error boundaries, approved-fix safety, release packaging/license/SBOM evidence, cross-platform CI, web tenant predicates, error redaction, cron/webhook bounds, migration guards, and production runtime config.
- Seven-hour acceptance disposition: no new backlog checkbox qualifies beyond LIC-001 and LIC-004 already checked in the previous targeted audit. Keep 156 unchecked / 113 checked / 269 total. In particular, the green nine-cell Node 20/22/24 × Ubuntu/macOS/Windows matrix does not complete DIST-004's architecture, engine/offline/update, and install/rollback acceptance; the tenant static audit does not complete HOSTED-011/012 runtime DAL/database negative fixtures; webhook endpoint/response hardening does not complete OPS-008's per-attempt DNS/egress/worker/signature lifecycle evidence; and Hunt planner/trust hardening does not satisfy the supported recipe dependency chain.
- Review finding remediation: CLI `c59126e` binds fix approval to `workspace:<canonical realpath>` and rejects receipts targeting another workspace before mutation. CLI `bda23e0` adds rollback helper regression tests for restoring prior bytes/removing new files, classifying failed rollback as unverified, and avoids writing through symlinked `src/`; snapshot capture now treats only ENOENT as an absent target. `R-040` remains open pending selected-test semantics and end-to-end supported-platform evidence; AGENT-007 remains unchecked.
- Local verification after audit: CLI package test suite and typecheck passed; web `pnpm test` passed 69/69, `pnpm typecheck` passed, and `pnpm db:migrations:check` verified 15 ordered migrations. Web commands emitted the expected unsupported-engine warning because this machine runs Node 26 while `verglos-web` declares Node 22.x; treat GitHub's supported Node matrix, not this local run, as runtime qualification.
- Existing protected CI evidence at the reviewed heads: CLI self-scan run `34664087596` and Ubuntu/macOS/Windows Node 20/22/24 matrix run `34664087624` passed; the previous checkpoint records both PRs as open and mergeable. No blog or landing-page files were changed. Shipping docs remain private/local-only.
- CLI `c59126e`/`bda23e0` verification: focused `fix.test.ts` passes 20/20; cache-bypassed `pnpm exec turbo run test typecheck build --force` succeeds across 23/23 tasks. The commits are pushed to existing CLI PR #34; run `34668088876` (platform matrix) and `34668088943` (self-scan) are in progress. Web PR #32 remains open. Backlog remains 156 unchecked / 113 checked / 269; zero items were checked by this preparatory security batch.

- HUNT-011 Docker revalidation (2026-09-11): pinned Postgres image digest `sha256:2bf082886c059b4cf5af3f9e8d3a8916c35699062899061c13bc32d5921c631a` passed 48/49 Hunt tests on Docker Desktop; the Linux-only PID/IPC namespace assertion was explicitly skipped. HUNT-011 remains open pending Linux runtime evidence and independent review.
- HUNT-011 Ubuntu CI qualification (2026-09-12): GitHub Actions run `34643142278` on `ubuntu-latest` passed the complete pinned Hunt package suite, 50/50 with zero skips, including PID/IPC namespace isolation against the Linux host namespace. This satisfies the platform-runtime evidence portion; HUNT-011 remains unchecked because its HUNT-008–010 dependencies and independent review are still open.
- CLI Hunt cleanup-failure classification (local-only) | `packages/hunt/src/index.ts`, `packages/hunt/src/index.test.ts` | Sandbox cleanup failures are now opaque and converted into a bounded `not_attemptable`/`environment-error` outcome, downgrading any prior verdict instead of rejecting or retaining potentially misleading evidence. Hunt package tests pass 36/36 non-skipped and typecheck passes. | CLI commit `1bc051b`; HUNT-007/011 remain open pending supported recipe coverage and independent adversarial review
- CLI dependency license inventory (historical at `338ed67`) | `scripts/license-inventory.mjs`, `scripts/license-inventory.test.mjs` | Initial deterministic inventory recorded direct/transitive package metadata but did not yet reconcile all lockfile/platform versions or nested bundled packages. | Superseded by LIC-001 completion evidence at `4435964`; external legal review remains open.
- CLI reproducible third-party notices (local-only) | `THIRD_PARTY_NOTICES`, `scripts/generate-third-party-notices.mjs`, `scripts/generate-third-party-notices.test.mjs` | Generated 3,653-line notice bundle from the installed dependency graph, sorted deterministically, retaining available upstream license text and source identity with an explicit non-endorsement disclaimer; generation is byte-identical across runs. | CLI commit `9aecb75`; LIC-003 remains preparatory pending LIC-002 records, clean artifact verification, and legal review
- CLI license/notice CI drift gates (local-only) | `.github/workflows/self-scan.yml` | Protected self-scan now fails on license review blockers or generated-notice drift; local inventory `--check` and byte-for-byte notice comparison pass. | CLI commit `d2cb1b8`; LIC-001/003 remain preparatory pending external records, artifact qualification, and legal review
- CLI reproducible CycloneDX SBOM (historical at `d48b5b5`) | `SBOM.cdx.json`, `scripts/generate-sbom.mjs`, `scripts/generate-sbom.test.mjs`, `.github/workflows/self-scan.yml` | Initial deterministic CycloneDX output and CI drift comparison. | Superseded by LIC-004 completion evidence at `4435964`, including SPDX parity and bundled-component coverage.
- CLI cross-platform license artifact correction (local-only) | `scripts/license-inventory.mjs`, `scripts/generate-third-party-notices.mjs`, `THIRD_PARTY_NOTICES`, `SBOM.cdx.json` | Hosted CI exposed macOS/Linux drift from platform-constrained optional packages; generators now exclude packages declaring `os`/`cpu`, while retaining missing-metadata entries for review. All three deterministic tests pass and artifacts were regenerated. | CLI commit `65342cd`; LIC-001/003/004 remain preparatory pending released-artifact qualification and legal review
- CLI SPDX SBOM parity (historical at `b95f840`) | `SBOM.spdx.json`, `scripts/generate-spdx.mjs`, `scripts/generate-spdx.test.mjs`, `.github/workflows/self-scan.yml` | Deterministic SPDX 2.3 output with stable IDs and CI drift comparison. | Superseded by LIC-004 completion evidence at `4435964`; actual publication/legal review remains open.
- CLI cross-host artifact validation correction (local-only) | `.github/workflows/self-scan.yml` | Hosted CI showed byte-level notice/SBOM drift from registry metadata despite equivalent dependency graph; protected checks now fail on license blockers, malformed/empty generated notices, or invalid CycloneDX/SPDX schemas while deterministic byte tests remain local. | CLI commit `6fa3b25`; LIC-003/004 remain preparatory pending reproducible released-artifact qualification
- CLI release artifact operator commands (local-only) | `package.json` | Exposed stable workspace commands for license inventory, notices, CycloneDX SBOM, and SPDX SBOM generation; all four commands execute successfully against the current dependency graph. | CLI commit `08ffefa`; LIC-001/003/004 remain preparatory pending released-artifact and legal qualification
- CLI release verifier notices/SBOM checks (local-only) | `scripts/verify-release-artifacts.mjs`, `scripts/verify-release-artifacts.test.mjs` | Release verification now validates optional `THIRD_PARTY_NOTICES`, CycloneDX 1.5, and SPDX 2.3 artifacts as regular, non-empty files with schema identity checks; malformed artifacts are rejected and all verifier tests pass. | CLI commit `0d7a0e0`; DIST-003/LIC-004 remain preparatory pending clean-consumer and provenance verification
- CLI release evidence artifact retention (local-only) | `.github/workflows/self-scan.yml` | Protected CI now uploads the exact dependency inventory, generated notices, CycloneDX, and SPDX outputs it validated, retained 14 days for release review; upload is gated on all license/SBOM checks succeeding. | CLI commit `c079458`; DIST-003/LIC-004 remain preparatory pending clean-consumer and provenance verification
- CLI license metadata timeout boundary (local-only) | `scripts/license-inventory.mjs`, `scripts/generate-third-party-notices.mjs` | `pnpm licenses` subprocesses now have a 120-second hard timeout and SIGKILL termination, preventing CI hangs while preserving explicit failures; bounded generators pass locally. | CLI commit `c022ec5`; LIC-001/003 remain preparatory pending legal and released-artifact qualification
- CLI self-scan job timeout (local-only) | `.github/workflows/self-scan.yml` | Protected self-scan job now has a 15-minute upper bound, preventing stale hosted runners from blocking release evidence indefinitely. | CLI commit `735bbcb`; CI revalidation pending
- CLI clean public package staging (local-only) | `scripts/pack-public-packages.mjs`, `scripts/pack-public-packages.test.mjs`, `package.json` | Added a deterministic staging packer for the six public packages. It excludes compiled test files, copies only package metadata needed for redistribution, rewrites workspace dependency ranges to concrete versions, and emits six npm archives; focused test passes. | CLI commit `825e9b1`; DIST-001/003 remain preparatory pending consumer-install, provenance, and release-artifact qualification
- CLI public archive CI qualification (local-only) | `.github/workflows/self-scan.yml` | Self-scan now runs the clean six-package archive test and emits the staged `.tgz` archives as retained CI evidence. | CLI commit `1d9a5cd`; DIST-001/003 remain preparatory pending consumer-install, provenance, and release-artifact qualification
- CLI publish workflow staged-archive integration (local-only) | `.github/workflows/publish.yml` | Pack smoke tests, checksum generation, and npm publish steps now consume the same clean staged archives, avoiding a second unqualified `pnpm pack` path; publish workflow contract and focused verifier tests pass. | CLI commit `d269e45`; DIST-002/003 remain preparatory pending protected-environment, clean-consumer, and release-governance evidence
- CLI release metadata evidence integration (local-only) | `.github/workflows/publish.yml`, `scripts/publish-workflow-contract.test.mjs` | Release preparation now regenerates the dependency license inventory, third-party notices, CycloneDX SBOM, and SPDX SBOM into the same release directory as the qualified archives; verifier and workflow contract tests pass, and all evidence is retained with the release artifact bundle. | CLI commit `66312a4`; LIC-003/004 and DIST-003 remain preparatory pending legal review and clean-consumer/provenance qualification
- CLI staged archive manifest verification (local-only) | `.github/workflows/self-scan.yml` | Protected self-scan now runs the packed-manifest verifier against the exact staged archives after archive qualification, checking resolved dependencies and the single CLI entrypoint before evidence upload. Local manifest audit passes for all six archives. | CLI commit `0c6f629`; DIST-001/003 remain preparatory pending optional-engine matrix and clean-consumer/provenance qualification
- CLI cross-platform Node validation matrix (local-only) | `.github/workflows/platform-matrix.yml` | Added protected Ubuntu/macOS/Windows validation across Node 20, 22, and 24 with frozen install, build, typecheck, and full test steps; hosted matrix is queued for the current PR. | CLI commit `9d17e53`; DIST-004 remains open pending hosted matrix evidence plus engine/offline/path qualification
- CLI cross-platform test discovery fix (local-only) | `scripts/run-package-tests.mjs`, package manifests | Replaced shell-dependent recursive test globs with a Node-based file collector and runner, including compiled Hunt tests without requiring `tsx`; local full Turbo suite passes 12/12 tasks. Hosted matrix failures were traced to glob expansion, not product behavior. | CLI commit `34df9fb`; DIST-004 remains open pending matrix rerun and engine/offline/path qualification
- CLI cross-platform test runner stream fix (local-only) | `scripts/run-package-tests.mjs` | The recursive runner now streams child test output instead of buffering it through `execFile`, preventing platform-dependent max-buffer failures while preserving non-zero exit propagation. Forced full Turbo suite passes 12/12 tasks and CLI tests 167/167. | CLI commit `f7ff8e0`; DIST-004 remains open pending matrix rerun and engine/offline/path qualification
- CLI qualification run concurrency (local-only) | `.github/workflows/self-scan.yml`, `.github/workflows/platform-matrix.yml` | Added per-PR concurrency groups with stale-run cancellation so only the newest grouped commit consumes protected CI capacity and produces release evidence. | CLI commit `028d561`; evidence hygiene improved; DIST-004 remains pending current matrix completion
- CLI serialized package test execution (local-only) | `scripts/run-package-tests.mjs` | Package test files now run with Node test concurrency set to 1, preventing shared environment/cache fixture races observed in hosted Windows and Ubuntu matrix jobs; forced local full Turbo suite passes 12/12 tasks and CLI 167/167. | CLI commit `2bc961a`; DIST-004 remains pending hosted matrix rerun
- CLI MCP portable temporary fixtures (local-only) | `packages/mcp/src/server.test.ts` | Replaced Unix-only `/tmp` fixture roots with Node’s platform temporary directory in MCP audit tests; focused MCP suite passes 31/31. | CLI commit `1a1fdc0`; DIST-004 remains pending hosted matrix rerun and remaining platform fixture review
- CLI archive and agent path portability (local-only) | `packages/shared/src/archive-extractor.ts`, `packages/scanner/src/detectors/agent-surface.ts` | Archive extraction now validates containment with platform-aware relative paths, and agent-surface config discovery honors `HOME`/`USERPROFILE` consistently; local shared 308/308, scanner 72/72, Hunt 36/36 non-skipped, and CLI 167/167 tests pass. | CLI commit `ad3b9d3`; DIST-004 remains pending hosted matrix rerun
- CLI cross-platform portability and Docker evidence (local-only) | `packages/shared/src/archive-safety.ts`, `packages/scanner/src/walker.ts`, `packages/hunt/src/docker-adapter.ts`, `packages/cli/src/entitlement.ts` | Archive member normalization and scanner relative paths are host-independent; Windows Hunt symlink classification and entitlement cache isolation are corrected. Local shared/scanner/Hunt/CLI tests, typecheck, and build pass. With the pinned `postgres:15-alpine@sha256:2bf082886c059b4cf5af3f9e8d3a8916c35699062899061c13bc32d5921c631a`, Docker adversarial evidence passed 51/52 tests on macOS; the Linux-only PID/IPC namespace assertion remains explicitly skipped. | CLI commits `c5dfe21`, `7ec8e24`; DIST-004/HUNT-011/QUAL-CLI-004 remain open pending current hosted matrix completion and independent Linux review
- CLI Windows fixture isolation (local-only) | `packages/cli/src/entitlement.ts`, `packages/scanner/src/orchestration.test.ts` | Entitlement cache paths now resolve from the active configured home at operation time, and scanner fixture paths use `fileURLToPath` so Windows does not receive `/D:/...` URL pathnames. Local scanner 72/72, CLI 167/167, typecheck, and build pass; hosted rerun is required for platform evidence. | CLI commit `b3f9323`; DIST-004 remains open pending current matrix completion
- CLI Windows process-fixture entrypoint (local-only) | `packages/cli/src/cli-fixture.ts` | The process fixture launcher converts only the repository TypeScript CLI entry to a `file://` URL on Windows, preventing Node ESM `ERR_UNSUPPORTED_ESM_URL_SCHEME` while preserving user-supplied filesystem arguments. Local CLI 167/167, typecheck, and build pass; hosted rerun is required for platform evidence. | CLI commit `44aeb2b`; DIST-004 remains open pending current matrix completion
- CLI Windows loader fixture completion (local-only) | `packages/cli/src/cli-fixture.ts` | Process fixtures now normalize both the injected `tsx` loader and repository CLI entry to file URLs on Windows; local CLI 167/167, typecheck, and build pass. | CLI commit `9a53e1b`; DIST-004 remains open pending hosted matrix completion
- CLI Windows tsx path compatibility (local-only) | `packages/cli/src/cli-fixture.ts` | Replaced the URL form with forward-slash drive paths, which matches tsx's Windows resolver and avoids rebasing `file:/D:/...` against temporary fixture directories. Local CLI 167/167, typecheck, and build pass. | CLI commit `5b5323e`; DIST-004 remains open pending hosted matrix completion
- CLI Windows loader and test-profile isolation | `packages/cli/src/cli-fixture.ts`, `scripts/run-package-tests.mjs` | Windows `--import` loaders now use valid file URLs while CLI entries retain tsx-compatible drive paths. Package test files execute in isolated processes so HOME/cache and global fetch fixtures cannot leak across files. Local CLI suite passes; hosted matrix rerun required. | CLI commit `b5e9a5d`; DIST-004 remains open pending hosted matrix completion
- CLI dynamic credential-home resolution | `packages/cli/src/credentials.ts` | Credential and score-cache paths now resolve `HOME`/`USERPROFILE` at operation time, matching entitlement cache isolation and fixing valid JWT/capability behavior on Windows. Local CLI suite passes; hosted matrix rerun required. | CLI commit `e0f88e8`; DIST-004 remains open pending hosted matrix completion
- CLI stable approval path contracts | `packages/cli/src/fix.ts` | Header-fix approval scopes now use stable POSIX-relative paths across hosts while filesystem writes remain native, preventing Windows file-scope mismatches. Local CLI suite passes; hosted matrix rerun required. | CLI commit `d0e10d4`; DIST-004 remains open pending hosted matrix completion
- CLI Windows no-follow compatibility | `packages/cli/src/fix.ts` | Header mutation retains `O_NOFOLLOW` where supported and uses a bounded regular-file recheck for Windows providers that reject the flag, preserving the fail-closed mutation boundary without breaking supported Windows filesystems. Local CLI typecheck passes; hosted matrix rerun required. | CLI commit `9243e06`; DIST-004 remains open pending hosted matrix completion
- CLI release-tool URL portability | `scripts/pack-public-packages.mjs`, `scripts/check-package-contents.mjs`, `scripts/license-inventory.mjs`, `scripts/generate-third-party-notices.mjs`, `scripts/generate-sbom.mjs`, `scripts/generate-spdx.mjs`, `scripts/verify-release-artifacts.test.mjs` | Release and package qualification tooling now converts module URLs with `fileURLToPath`, avoiding `/D:/...` path failures on Windows. Eight focused release/license/SBOM tests pass. | CLI commit `893ea80`; DIST-004 remains open pending hosted matrix completion
- CLI explicit Windows mutation flags | `packages/cli/src/fix.ts` | Windows header mutation no longer passes the unsupported `O_NOFOLLOW` flag; bounded regular-file validation remains in place, while Unix retains kernel no-follow semantics. Local CLI typecheck and tests pass; hosted matrix rerun required. | CLI commit `a5d5782`; DIST-004 remains open pending hosted matrix completion
- CLI clean-consumer release qualification (local-only) | `scripts/verify-clean-consumer.mjs`, release workflows, workflow contract test | Built all six public archives, passed packed-manifest audit, installed the exact archives into a new temporary consumer using npm with lifecycle scripts disabled, imported all five shared packages, and executed `verglos --version` (`2.0.0-alpha.1`). Workflow retains the concise result with release archives and requires this step before publish. Full local typecheck/test suites pass; hosted rerun pending. | working tree after `a5d5782`; DIST-003 remains open pending published provenance/attestation evidence and release-governance gates
- CLI Windows Next.js mutation diagnostic | `packages/cli/src/fix.test.ts` | Added a direct approved Next.js config mutation integration test so Windows CI surfaces the underlying filesystem exception instead of only the CLI's sanitized JSON failure. Unix test passes; hosted rerun required. | working tree after `a5d5782`; DIST-004 remains open
- CLI Windows rollback correction | Phase 3/6 · `AGENT-007`, `R-040` | Code commit `d7430a5`; hosted Windows failures exposed an invalid `/tmp` fixture and rollback following a raced-in symlink. Replaced rollback and existing Next.js config writes with exclusive same-directory temp files and atomic rename; the fixture now uses a real temp workspace. Focused fix tests 20/20, CLI typecheck, full Turbo test/typecheck/build 23/23. GitHub self-scan `34668623254` and platform matrix `34668623265` pass, including Windows Node 20/22/24; existing CLI PR #34 is OPEN/MERGEABLE. | No item checked: AGENT-007 still requires selected-test semantics/guidance and end-to-end CLI failure qualification. Exact backlog: 156 unchecked / 113 checked / 269. No blog/landing edits; internal docs remain local/private.
- Historical web tenant scope primitives and PostgreSQL fixture (superseded by `b0e3067` below) | Phase 4 · `HOSTED-011`, `HOSTED-012`, `R-007` | Web code commits `08a8c46`/`bdb7045`; this checkpoint had 74/74 tests and hosted run `34670279912` passing. | At that point raw `Db` remained exposed. The current facade and exact-head verification are recorded in the later `b0e3067` entry; internal docs remain local-only.
- Historical web tenant-scope CI completion (superseded by the entries below) | Phase 4 · `HOSTED-011`, `HOSTED-012`, `R-007` | Run `34670279912` passed on Node 22 at earlier PR head `bdb7045`; 74 tests and the initial PostgreSQL helper fixture passed. | That head still exposed raw `Db` to routes. Current implementation and acceptance are recorded at `21c3b19` below.

- Historical web scoped database facade checkpoint (superseded by `21c3b19`) | Phase 4 · `HOSTED-011`, `HOSTED-012`, `R-007` | Web `b0e3067`; facade unit/runtime coverage and run `34671571482` established organization/project scope for organization-access routes. | This 75-test checkpoint preceded actor-bound directory operations; latest accepted evidence follows.

- Web tenant data-access acceptance | Phase 4 · `HOSTED-011`, `R-007` | Web `b0e3067`, `39730f8`, `21c3b19`; exact head `21c3b19` has 76/76 local tests with live PostgreSQL, typecheck, schema/migration checks, build, and diff check; hosted Node 22 run `34672637622`, GitGuardian, and Vercel pass. Static audit walks organization API route files and finds no direct raw-DB imports or `getDb()` calls. Scoped facade prevents unscoped organization/project reads and mutations; actor-bound directory repository lists only active memberships for its captured user and creates owner membership for the same actor. PostgreSQL fixtures prove tenant A/B and user A/B isolation, project scope, hostile insert bindings, and rejection of attempted scope widening. | HOSTED-011 checked at the verified PR head; total 155 unchecked / 114 checked / 269. HOSTED-012 remains open for route-level non-member/role denial and existence-hiding fixtures. PR #32 remains OPEN/MERGEABLE; no merge was performed. Private docs remain local-only; no blog/landing changes.
- CLI updater machine-output contract (local-only) | LOCAL-001 · `packages/cli/src/update.ts`, `packages/cli/src/index.ts`, `packages/cli/src/update.test.ts`, `packages/cli/src/machine-output-process.test.ts` | Code commit `4f8f98e` makes updater success/failure typed, sanitizes network/install failures, suppresses npm subprocess output in JSON/quiet modes, and preserves the historic `--update` alias; tests cover current/newer/offline/install-failure plus alias behavior. Full CLI package suite passes with loopback viewer test enabled, along with typecheck, build, and diff check. | One local code commit ahead of `origin/main`; not pushed/no PR. LOCAL-001 remains open; backlog unchanged at 152 unchecked / 117 checked / 269. No database access/write, migration, merge, or deployment. Private documentation only.

- Web CI quality acceptance | DIST-WEB-001 · web `67bbe09`, existing PR #32 | Added pinned `@cyclonedx/cdxgen@12.8.4`, the reviewed `undici@7.29.0` override, protected CI SBOM and path-free license inventory/test steps, and retained CI artifacts. Exact-head workflow `34694532678` passes every step; GitGuardian and Vercel pass. Local web suite is 87/87 with isolated PostgreSQL, typecheck, schema/migration checks, build, high/critical audit, SBOM/license checks, public-boundary, and diff checks pass. SBOM lists 413 components/414 graph entries; license inventory flags 79 for manual review (53 missing declarations), so no legal conclusion is asserted. | DIST-WEB-001 checked; backlog 151 unchecked / 118 checked / 269. PR remains open; no merge/deploy or production DB write. Neon management API GET returned 401; provider snapshot metadata is unknown. Local temporary PostgreSQL test container was removed after the run.
- CLI HUNT-001 declarative recipe schema acceptance | Phase 3 · HUNT-001 | `packages/shared/src/hunt-recipe.ts`, recipe tests, execution binding, and bounded Docker adapter changes at CLI `15457ba`; exact PR #36 head `15457baec59c8a8c55de149fe9df7f0b89ac7709`. Strict versioned schema covers rule/target, SHA-256 image digest, command template, assertions, optional bounded inputs, isolation, CPU/memory/disk/time/process/output/network limits, cleanup, network reason/origin constraints, redaction, and signature metadata. On a clean detached checkout, shared and Hunt package test suites pass; full CLI test/typecheck/build had also passed at this exact commit. Hosted self-scan `34713028173` and all nine Ubuntu/macOS/Windows Node 20/22/24 matrix cells `34713028112` pass. | HUNT-001 accepted; backlog now 121 checked / 148 unchecked / 269 total. HUNT-002 signature/content-digest/license/feed provenance and trust roots remain open; HUNT-003 planner and execution remain open. No production database read/write, migration, merge, or deployment. Private tracker commit follows locally; private shipping docs were not pushed.
- CLI PR #36 merge observation | Phase 3 · AGENT-001, HUNT-001 | GitHub reports PR #36 merged at `2026-09-12T19:09:07Z`; merge commit `a34fc7fb247c29daec5c8341d1e943f63cab13b6` contains exact tested head `15457baec59c8a8c55de149fe9df7f0b89ac7709`. Self-scan `34713028173` and all nine platform cells `34713028112` passed. `origin/main` was fetched and now points at the merge commit. | No backlog-count change: 121 checked / 148 unchecked / 269 total. No CLI follow-up PR or Web PR is open; next acceptance batch is LOCAL-003. No production DB operation, deployment, or private-doc push.
- CLI LOCAL-003 subject-binding correction | Phase 1 · LOCAL-003 | Code commit `cec0648` pushed to existing PR #37. in-toto SHA-256 now compares against validated selected-subject content digests rather than the Verglos subject-ID hash; CycloneDX/SPDX binds only on exact digest match to a selected SBOM subject. Added false-match and SBOM match/mismatch regression tests. Local full tests 12/12 Turbo tasks, typecheck 13/13, build 8/8, and diff check pass. PR #37 is OPEN at `cec064878eb294e06431709a52197677ae723361`; hosted self-scan and nine-platform matrix are in progress. | No checkbox change: 148 unchecked / 121 checked / 269 total. LOCAL-003 remains open pending complete import coverage semantics and qualified Trivy runtime. No Web changes, production DB access/write, migration, merge, or deployment. This private ledger update is local-only and must not be pushed to public repositories.
- CLI LOCAL-003 Trivy fixture/runtime evidence | Phase 1 · LOCAL-003 | Current Docker daemon is reachable on Linux/aarch64. Pulled the platform-specific immutable Trivy 0.74.0 image digest and ran an intentionally unsafe Terraform fixture using `--pull=never`, network disabled, read-only root and target mount, non-root UID/GID, dropped capabilities, no-new-privileges, and CPU/memory/PID bounds. Offline misconfiguration scan exited 0 and returned nine findings; Trivy reported absent policy cache and fell back to embedded checks. Filtered output contained only finding IDs/severities. This was an isolated manual runtime qualification, not Verglos product integration and not proof of vulnerability/secret coverage or current external-policy freshness. Exact-head PR #37 self-scan `34718344312` and all nine platform jobs in `34718344328` pass; merge state CLEAN. | No checkbox change: 148 unchecked / 121 checked / 269 total. LOCAL-003 remains open pending a product adapter with honest embedded-check/offline coverage state and complete imported evidence semantics. No production DB access/write, migrations, Web changes, merge, or deployment. This private ledger update is local-only and must not be pushed publicly.
- CLI LOCAL-003/004 complete acceptance batch | Phase 1 · LOCAL-003, LOCAL-004 | Code already on PR #37, commits `b7e5fa9`, `3c40952`, `cf5ac3b`, exact head `cf5ac3b64aa7a3c0ca2d9d71a59450ca6af9e6d4`. Integrated native, adapter, and supported imports in a single opt-in snapshot with cancellation, bounded concurrency, progress, digest-bound coverage/ToolRun records; added pinned Trivy Docker runtime boundary, redaction and offline incomplete-state evidence; froze legacy scan terminal/HTML/JSON/report path compatibility and opt-in schema 1.1. Local uncached `pnpm exec turbo run test typecheck build --force`: 23/23 tasks; `git diff --check` passes. GitHub self-scan `34720089870` and platform matrix `34720089861` attempt 2 pass all nine Ubuntu/macOS/Windows × Node 20/22/24 cells. Docker Desktop fixture produced a digest-bound snapshot with findings and ToolRun metadata, but intentionally remains INCOMPLETE for unqualified vuln DB/policy freshness; trust is computed-only. | LOCAL-003 and LOCAL-004 accepted; authoritative counts recalculated from task checkboxes: 146 unchecked / 123 checked / 269 total. PR #37 remains OPEN/CLEAN; no merge or deployment. Next executable CLI whole item is LOCAL-002 versioned config migration. Web PR #33 is OPEN at `b2d6b5048111377160d9be6a8e64fe3e1a2a47e9`; disposable PostgreSQL integration, local tests/typecheck/build/schema/migration checks pass, GitGuardian/Vercel pass, hosted typecheck/schema remains in progress. No Web item checked: HOSTED-013 still requires approved data movement, reconciliation, restore/rollback, and independent review. No production DB access/write or migration occurred in this batch; private shipping docs commit remains local-only.
- Web legacy data audit/mapping controls | Phase 4 · HOSTED-013/R-021 (preparatory; no acceptance checkoff) | Code commit `b2d6b50` pushed to Web PR #33. Adds explicit-URL repeatable-read/read-only aggregate audit with bounded timeouts, counts/digests, migration fingerprint, and no row values; adds constrained, idempotent source/target mapping schema with explicit quarantine states; hardens DB URL and runtime secret validation. A disposable local PostgreSQL 16 integration verified uniqueness/quarantine checks; full Web suite, typecheck, Next production build, Drizzle schema and 16-entry migration checks pass; public-boundary check passes. Hosted GitGuardian/Vercel pass; typecheck/schema check pending. | No backlog change; 146 unchecked / 123 checked / 269 total. PR #33 remains OPEN and unmerged. Production was not accessed or modified; this tooling does not qualify source-to-target reconciliation or restore/rollback. Internal shipping docs remain local-only.
- CLI MCP coverage propagation | Phase 3 · AGENT-003/005 | Code commit `b07d85f` pushed to CLI PR #37. MCP `verglos_scan` now returns the scanner's exact coverage manifest and advertises it in capability metadata. Added wrapper and approved-network dispatch tests that assert incomplete coverage is preserved and outbound requests stay within approved npm/OSV origins. Forced Turbo test/typecheck/build passes 23/23 tasks; one loopback-listener test is sandbox-skipped. Public-boundary audit and `git diff --check` pass. Exact-head hosted self-scan and nine-platform matrix are pending. | AGENT-003/005 remain unchecked; no DB access/write, migration, deploy, merge, or release occurred. Backlog remains 146 unchecked / 123 checked / 269 total. This ledger is private/local-only.
- CLI LOCAL-005 release header acceptance | Phase 1 · LOCAL-005 | Code commits `ce24476`, `a113a1d` pushed to existing CLI PR #37, exact head `a113a1db64c8c33e5823cfeb83e62b6ccf50681e`. `record header` verifies the content-addressed store and presents decision/coverage first, all seven subject kinds and available exact digests, policy digest, generated time, signer state, limitations and next action. Added integration coverage for a multi-subject record containing every supported subject kind and asserted subject/member/content digests. Forced uncached test/typecheck/build passes 23/23 Turbo tasks; self-scan `34752187755` and all nine Ubuntu/macOS/Windows × Node 20/22/24 cells in matrix `34752187749` attempt 2 pass. GitHub reports OPEN/CLEAN. | LOCAL-005 accepted; authoritative task checkbox recount is 145 unchecked / 124 checked / 269 total. No merge, deploy, release, production DB operation, or public shipping-document push occurred. LOCAL-002 remains undecided at schema level; exact missing config semantics are recorded in STATUS. Web PR #33 remains open; hosted migration/recovery acceptance remains independent and open. Private ledger only.
- CLI PR #37 merge observation | Phase 1 · LOCAL-003/004/005 | GitHub reports PR #37 merged at `2026-09-13T11:08:07Z`; merge commit `7813033a2e727fcf018d8a6cdef24573c3a58e19` contains exact tested head `a113a1db64c8c33e5823cfeb83e62b6ccf50681e`. Self-scan `34752187755` and all nine Ubuntu/macOS/Windows Node 20/22/24 cells in matrix `34752187749` attempt 2 pass; the earlier Windows Node 22 test failure passed on rerun. PR file list contains only CLI/shared/MCP/scanner source and tests; no private docs, secrets, migration, or deploy content. | No additional checkbox change: 145 unchecked / 124 checked / 269 total. LOCAL-003/004/005 are accepted; no production DB access/write, migration, web merge, deployment, or release occurred. Private documents remain local-only.
- CLI LOCAL-006/007 change and evidence projections | Phase 1 · LOCAL-006, LOCAL-007 | Commits `dc9eff8`, `699c830`, `f5be357` pushed to existing CLI PR #38; exact head `f5be35760df38b1086da04d5186d81179555cdeb`. Release diff now compares validated severity/coverage/lineage and projects next actions; release snapshot v1.3 safely binds producer attribution, raw-evidence digest references, confidence, matched run timestamps/engine health, and explicit limitations while preserving v1.0-v1.2 readers and excluding excerpts. Added focused tests for severity and coverage deltas, owner/remediation/rescan/Hunt limits, lineage blockers, evidence binding/invalid evidence, CLI JSON/human projection, and bounds. Forced uncached `pnpm exec turbo run test typecheck build --filter=verglos --force`: 8/8 Turbo tasks; `git diff --check` passes. Exact-head self-scan `34763541180` and all nine Ubuntu/macOS/Windows × Node 20/22/24 jobs in matrix `34763541116` pass. | LOCAL-006/007 accepted; checkbox recount: 141 unchecked / 128 checked / 269 total. PR #38 OPEN/CLEAN and unmerged; PR file list has no private shipping docs or secrets. Web PR #33 remains OPEN/CLEAN at `a698c9074a1de34eaad32e880e5ecb3e40d46ea1`; no Web code changed. No production database read/write or migration, merge, deployment, or release. The private tracker and CLI docs mirror have matching backlog/traceability/ledger state; documentation commit is local-only.
- CLI MCP safe-tool / shared-contract reconciliation progress | Phase 3 · AGENT-003/005 | Code commit `318464d` pushed to existing CLI PR #38, exact head `318464d624123834d7392fd8bcbb27fb1ea1a4f9`. Pre-write now preserves exact target-path attribution using the shared Finding model and emits explicit partial coverage (fast-path detectors vs omitted project-wide checks); package advisory evidence attributes OSV.dev; package versions and language hints now have UTF-8/control-character bounds, and schemas advertise input limits. MCP tests 39/39, MCP typecheck, and forced uncached CLI/shared test/typecheck/build pass (8/8 Turbo tasks); exact-head self-scan `34766056765` and all nine Ubuntu/macOS/Windows × Node 20/22/24 cells in matrix `34766056760` pass. PR #38 is OPEN/CLEAN and its public file list excludes internal shipping docs/secrets. | No backlog checkbox changed: 140 unchecked / 129 checked / 269 total. AGENT-003 remains open because no MCP handler consumes canonical POLICY-009 evaluation with immutable subject/observation evidence; AGENT-005 remains open on its explicit AGENT-003 dependency. No production DB read/write, migration, merge, deploy, or release. Private tracker only; internal docs were not pushed.
- CLI MCP policy-record acceptance and safe-tool closeout | Phase 3 · AGENT-003/005 | Code commits `25b8f72`, `0f0e563`, `fef284e` pushed to existing CLI PR #38, exact head `fef284e1df4684b40af1f87798c8128ffe0936ab`. Added approval-free, Free-tier `verglos_policy_check` using shared policy, subject, observation, Release Decision, Release Record, authority, and failure contracts. It bounds manifest/store inputs and record size; rejects symlinks, tampering, missing references, and mismatched policy/subject/evaluation bindings; emits the canonical decision and evidence-reference coverage while explicitly disclaiming policy-predicate reruns and producer truth. MCP package tests 43/43, typecheck, and SDK discovery/call pass. Exact-head self-scan `34767527375` succeeds; platform matrix `34767527307` concludes success with all nine platform/runtime build/typecheck/test steps successful. GitHub currently reports all ten PR checks SUCCESS and PR #38 OPEN/CLEAN. | AGENT-003 and dependent AGENT-005 accepted; checkbox recount **138 unchecked / 131 checked / 269 total**. The private backlog, traceability, status, and execution ledger were reconciled together in this local-only documentation batch; public PR file list remains source/tests only. No production DB read/write, migration, merge, deployment, or release occurred. Web PR #33 was not rechecked.
# CLI Release Record core-payload binding | Phase 2 · RECORD-002 (preparatory; no checkoff) | Code commit `84e2932` pushed to existing CLI PR #38, exact head `84e2932651cc9a42f57bec8021b6c97f977315de`. `record create --complete` validates core member payload bytes against manifest digest/size before destination creation; `record verify --complete` repeats payload binding checks after store verification. Shared validation binds included subject IDs, policy identity/digest, canonical evaluation digest, release-decision references/timestamp, and redaction-manifest digest. Tests cover complete assembly, tampered payload rejection, policy mismatch, and CLI create+verify roundtrip. Forced uncached `pnpm exec turbo run test typecheck build --filter=verglos... --force`: 18/18 tasks; `git diff --check` passes. | RECORD-002 remains unchecked; its full graph/export/viewer/signature/redaction/transport acceptance is not implemented. Counts unchanged at 138 unchecked / 131 checked / 269. PR #38 self-scan `34770765039` and nine-platform matrix `34770765059` are IN_PROGRESS; PR is OPEN/UNSTABLE at recorded head. No production database read/write, migration, merge, deployment, or release. Only source/test files were pushed; private shipping docs remain local-only. Next inspect whole RECORD-002 implementation boundary and pursue one complete executable acceptance item without inventing transport semantics.
## 2026-09-30 · QUAL-CLI-006 clean-consumer install evidence

- **Run:** `pnpm pack:public`; `node scripts/check-packed-manifests.mjs .artifacts/public-packages`; `node scripts/verify-clean-consumer.mjs .artifacts/public-packages` on CLI branch `af3aa09` (merged as `ca88ef2`).
- **Result:** six public npm archives packed; packed-manifest audit passed; fresh temporary consumer installed all six archives, imported `@verglos/shared`, `@verglos/scanner`, `@verglos/reporter`, `@verglos/mcp`, and `@verglos/entitlement`, executed `Verglos 2.0.0-alpha.1`, and confirmed no external engine installation/cache.
- **Boundary:** this is macOS clean-install evidence. It does not establish upgrade/rollback, Linux/Windows runtime evidence, or official in-toto/Sigstore trust validation. QUAL-CLI-006 remains unchecked. `.artifacts/public-packages` is ignored and was not committed.
## 2026-09-30 · QUAL-CLI-006 compatibility/rollback corpus evidence

- **Run:** repository-local tsx launcher executed `packages/shared/src/install-matrix-invariants.test.ts`, `packages/shared/src/upgrade-compat-corpus.test.ts`, and `packages/cli/src/engines-install.test.ts`.
- **Result:** **48/48 passed**. The run covers no-install-hook/explicit-files/engines/bin invariants, legacy/current schema and record compatibility, approved engine update and rollback mutation labels, digest/signature validation, and fail-closed invalid/symlink cases.
- **Boundary:** source-level and local macOS evidence only; it does not prove a real Linux/Windows install/upgrade/rollback workflow or official in-toto/Sigstore trust validation. QUAL-CLI-006 remains unchecked.
## 2026-09-30 · QUAL-CLI-006 Linux clean-consumer evidence

- **Run:** `docker run --rm -v "$PWD:/work" -w /work node:24-bookworm node scripts/verify-clean-consumer.mjs .artifacts/public-packages`.
- **Result:** Linux `node:24-bookworm` (linux/amd64 under host emulation) installed all six archives, imported every public library, executed `Verglos 2.0.0-alpha.1`, and created no external engine cache.
- **Boundary:** direct Linux/macOS install evidence now exists. Windows install, real package upgrade/rollback transition, and official in-toto/Sigstore trust validation remain absent; QUAL-CLI-006 remains unchecked.
## 2026-09-30 · QUAL-CLI-006 official Cosign tool smoke

- **Run:** Docker-pinned `gcr.io/projectsigstore/cosign:v2.4.1` generated and verified a DSSE attestation over the actual `verglos-2.0.0-alpha.1.tgz`; verification used `--offline --insecure-ignore-tlog` and returned `Verified OK`.
- **Evidence boundary:** this is an official-tool format/cryptographic smoke only. It used an ephemeral local key, a synthetic predicate, no Fulcio identity, and no Rekor upload. It must not be reported as keyless Sigstore trust or release provenance. Official in-toto layout/link validation and trusted keyless evidence remain open; QUAL-CLI-006 stays unchecked.
## 2026-09-30 · QUAL-CLI-006 real macOS upgrade/rollback transition

- **Run:** fresh temporary consumer; `npm install --prefix <consumer> verglos@1.8.3` → CLI `1.8.3`; `npm install --prefix <consumer> .artifacts/public-packages/*.tgz` → CLI `2.0.0-alpha.1`; repeat published `verglos@1.8.3` install → CLI `1.8.3`.
- **Result:** install → upgrade → rollback completed successfully on macOS, with the reported versions proving each transition. No repository or production state changed.
- **Boundary:** this is direct macOS transition evidence only. Linux/Windows real transitions and official in-toto/Sigstore trust evidence remain open; QUAL-CLI-006 stays unchecked.
## 2026-09-30 · QUAL-CLI-006 real Linux upgrade/rollback transition

- **Run:** `node:24-bookworm` container, fresh consumer; published `verglos@1.8.3` → local six archives → published `verglos@1.8.3`.
- **Result:** CLI reported `1.8.3`, `2.0.0-alpha.1`, `1.8.3`; Linux install, upgrade, and rollback completed successfully.
- **Boundary:** linux/amd64 under host emulation; Windows real transition and official in-toto/Sigstore trust remain absent. QUAL-CLI-006 remains unchecked.
## 2026-10-02 · CLI PR #52 merged and production billing probe corrected

- **CLI:** PR #52 (`514349f`) merged as `ccb65ed` after inspection of the final five-file diff. The scanner redacts configured home-directory prefixes in agent-surface finding paths; hosted platform matrix, self-scan, and in-toto binding checks were green. No private shipping files or founder assets entered the public PR.
- **Billing evidence:** authenticated existing-Chrome probe reached `https://verglos.com/checkout`; `POST /api/razorpay/create-qr` returned `503 PLAN_UNAVAILABLE`. No order, payment, webhook, entitlement, or license write occurred. Evidence file `docs/shipping/evidence/production-checkout-probe-2026-10-02.md` was corrected from the stale 404 observation.
- **Boundary:** package remains `2.0.0-alpha.1`; no production/database write, migration, deployment, npm publish, release tag, or marketing change occurred. Billing/catalog acceptance remains open.
## 2026-10-02 · Web PR #122 checkout fail-closed UI accepted

- **Implementation:** Web commit `f574af3`, merged PR #122. `/checkout` computes available Pro cadences through `checkoutOfferFor`, the same verified-INR gate used by `POST /api/razorpay/create-qr`. With the current unverified USD catalog, the page renders an explicit unavailable state and does not advertise `$29/$290` or offer a QR action.
- **Verification:** Hosted Verify run `36978025646` passed typecheck, full configured tests, negative-boundary, truth-registry, schema/migration checks, production build, public-boundary, dependency/license/SBOM, and tracked-secret guards. Local Razorpay focused suite remained 15 pass / 2 environment-gated skips.
- **Boundary:** This is a truth/UX correction, not billing acceptance. No catalog price, entitlement, production environment, database, migration, payment, webhook, deployment, or marketing claim was changed.
## 2026-10-02 · Razorpay sandbox provider + webhook replay evidence

- **Provider:** Razorpay Test Mode Standard Checkout completed with mock-bank `Success`. Order `order_TixO0lU5jqQIui` produced captured payment `pay_TixQnWornJ3Yl1` for `280943` INR paise. A separate Test Mode QR probe was closed without payment because QR is not the supported mock-success path.
- **Application binding:** signed `qr_code.credited` harness payload bound the captured payment to a valid INR/30-day checkout snapshot. First delivery returned 200 and credited once; replay returned duplicate 200; no release/error path fired.
- **Boundary:** existing Razorpay-focused tests remain 15 pass / 2 environment-gated skips. PLAN-WEB-011/012 are not checked: this is sandbox/provider evidence, while the production catalog is still unverified and no production entitlement/database write occurred.

## 2026-10-02 · PLAN-CLI-002 effective entitlement UX

- **Implementation:** CLI commits `b890763` and `1fe0a0e`, merged through PRs #53 and #54 as `e06de5b` and `443be30`. `verglos whoami` now reports the effective authority source, stale/offline state, capability count, catalog version, and bounded allowances in human and JSON output. Offline, legacy-token, and unavailable-endpoint paths remain fail-soft and do not invent paid access.
- **Verification:** focused whoami tests pass; full process-output suite passes 42/42 locally; forced CLI typecheck passes. PR #53 exposed one stale machine-output assertion; PR #54 corrected it. PR #54 hosted in-toto passed and all nine Ubuntu/macOS/Windows × Node 20/22/24 platform cells passed at exact merged head. The separate self-scan workflow was cancelled by the merge workflow and is not claimed as evidence.
- **Boundary:** PLAN-CLI-002 remains unchecked. PLAN-CLI-001 production signer/catalog activation evidence and complete UX acceptance are still open. No production database write, migration, deployment, npm publish, or release tag occurred.

## 2026-10-02 · QUAL-WEB-006 authenticated account accessibility evidence

- **Implementation:** Web commit `f66d32b`, merged PR #126 as `89056c3`, raises the `/account` signed-in label contrast from the measured 4.15:1 failure to an accessible value without changing copy or layout.
- **Verification:** local typecheck passed; configured Web suite passed 836/836 runnable tests with 22 environment-gated skips. Hosted type/schema, GitGuardian, and Vercel passed. Production Lighthouse on the existing authenticated Chrome session scored Accessibility 100 and Best Practices 100 on desktop and mobile. A desktop performance trace measured LCP 551ms and CLS 0.00.
- **Boundary:** QUAL-WEB-006 remains unchecked. This covers legacy `/account` only; organization-dashboard, screen-reader, reduced-motion, large-dataset, and complete field-CWV evidence remain open. No production database write, migration, billing action, or marketing change occurred. Evidence is private at `docs/shipping/evidence/account-a11y-cwv-2026-10-02.md`.

## 2026-10-02 · HUNT-011 Docker adversarial runtime revalidation

- **Run:** CLI Hunt package suite with Docker integration enabled against pinned Alpine digest `sha256:d9e853e87e55526f6b2917df91a2115c36dd7c696a35be12163d44e6e2a4b6bc`; Docker Desktop Server 29.7.2 is reachable.
- **Result:** 55/56 passed with zero failures. Fifteen runtime adversarial checks passed, covering non-root, read-only mounts/rootfs, network denial, socket/device absence, no-new-privileges, redaction, output/time/CPU/process/disk/memory bounds, and signal classification. One macOS-only PID/IPC namespace assertion was skipped.
- **Boundary:** HUNT-011 and QUAL-CLI-004 remain unchecked for Linux namespace evidence, complete recipe execution/provenance, and independent review. No production operation occurred. Private evidence: `docs/shipping/evidence/hunt-docker-adversarial-2026-10-02.md`.
## 2026-10-03 · current CLI source verification

- **Source:** read-only worktree of `Top-Notchh-Solutions/verglos-cli` `origin/main` at `c17b335`, package `2.0.0-alpha.1`.
- **Commands:** clean `pnpm install --frozen-lockfile`; `pnpm typecheck`; `pnpm build`; `pnpm --filter @verglos/shared test`.
- **Result:** all commands exited successfully; the install-matrix sub-suite passed 26/26 after build. A pre-build attempt failed only because the generated CLI `dist/index.js` did not yet exist, then passed after the required build.
- **Boundary:** verification only; no edits to the current-source worktree, no publication, no production operation, and no checkbox change.
## 2026-10-03 · current Web main regression pass

- **Source:** Web `main` at `763aab0`.
- **Result:** `pnpm test` passed 837 of 859 tests with 22 environment-gated skips and zero failures; the SCM pretest slice passed 40 of 46 with 6 skips and zero failures. `pnpm typecheck`, `pnpm db:check`, `pnpm db:migrations:check` (24 ordered migrations), and `git diff --check` passed.
- **Boundary:** Read-only verification; no production migration, database write, deployment, or checkbox change.
## 2026-10-03 · current CLI public-pack qualification blocker

- **Source:** read-only `origin/main` at `c17b335`; host macOS install with repository-pinned pnpm `9.15.9` retry.
- **Commands:** `node scripts/pack-public-packages.mjs <temp-dir>` and package-surface/clean-consumer tests.
- **Result:** pack fails before archive output because `license-inventory` cannot find metadata for foreign-platform optional `@esbuild/*` lockfile entries. Surface tests pass 6/7; the pack test is the single failure. This is reproduced with pnpm 9 and is not treated as a passing artifact.
- **Boundary:** no source edit, no inventory bypass, no package publication, no production operation, no checkbox change.
## 2026-10-03 · hosted current-source public-pack qualification

- **Run:** GitHub Actions Self-scan `37109797227` at exact head `c17b335f2bfac6d9d63e6a8031f4c19811306296`.
- **Result:** All job steps passed, including license inventory, notices/SBOM drift, six-archive pack, clean consumer, tests, pinned Hunt Docker adversarial suite, release-artifact verification, typecheck, package/public-boundary audits, and self-scan.
- **Boundary:** hosted evidence only; no npm publication, release tag, production deployment, migration, or checkbox change.
## 2026-10-03 · release tag/version integrity (CLI PR #57)

- **Action:** Added a fail-closed immutable-tag check to the publish workflow and its contract tests.
- **Result:** PR `#57`, head `2f18041`, merged as `8706c97`; local focused tests 3/3, combined release-safety checks 11/11, typecheck/build green; hosted Self-scan `37111006863` and Platform matrix `37111006817` green across in-toto plus nine OS/Node cells.
- **Decision:** Record as preparatory progress only. DIST-002/003/006 are not accepted because no protected release, public attestation, legal approval, or rollback/revocation run was performed. No publication or production write.

## 2026-10-03 · rollback/revocation contract (CLI PR #58)

- **Action:** Added shared fail-closed decision logic for rollback/revocation across npm, engines, Hunt feeds, signing identities, and web deployments.
- **Result:** PR `#58`, head `28512c7`, merged as `8e39aa7`; shared test suite, typecheck, and build passed; hosted Self-scan `37111798321`, Platform matrix `37111798352`, and in-toto binding passed.
- **Decision:** Preparatory DIST-006 evidence only. Operational provider adapters, audit/recovery execution, and historical-record verification remain outstanding. No production operation.
# 2026-10-03 · protected publication environment (CLI PR #59)

- **Action:** Added `environment: release` and serialized `verglos-release-publication` concurrency to `.github/workflows/publish.yml`; extended `publish-workflow-contract.test.mjs` to assert both controls.
- **Result:** Commit `d531540` merged as `93dbcf3` in PR `#59`; local shared tests, workflow contract test, full typecheck, and `git diff --check` passed. Hosted Self-scan, in-toto, and completed platform cells passed; the Windows Node 20 cell was still in progress at merge.
- **Decision:** Preparatory DIST-002 evidence only. The environment must have required reviewers configured and a real trusted publication/attestation must run before acceptance. No tag, npm publication, deployment, or production write.

- **Operational configuration:** GitHub `release` environment created at `2026-10-03T09:19:05Z` with required reviewer `anuragyadav-git` and protected-branch deployment policy. This is a configuration change only; no workflow was approved or executed.
# 2026-10-03 · signed organization policy cache substrate (CLI PR #60)

- **Action:** Added shared organization-policy envelope verification and offline cache resolution, exported from `@verglos/shared`; added focused scope/digest/key/cache tests.
- **Result:** Commit `f547cfa` merged as `b7c0799` in PR `#60`; focused tests 3/3, full typecheck, build, and diff checks passed. Hosted Self-scan, in-toto, and platform-matrix runs remain in progress after merge.
- **Decision:** Preparatory TEAM-CLI-001 evidence only. HTTP authentication, persistent cache, CLI integration, and hosted policy API/runtime evidence remain open. No checkbox changed; no production operation.
# 2026-10-03 · post-merge hosted and Web regression verification

- **CLI:** TEAM-CLI-001 PR #60 Self-scan `37112986892` completed successfully. Matrix `37112986882` has green in-toto and completed OS/Node cells; four cells remain in progress.
- **Web:** `main` read-only `pnpm test` passed 837/859 with 22 environment-gated skips and zero failures.
- **Boundary:** No acceptance checkbox changed; authenticated hosted policy fetch, persistence, and runtime integration remain unproven. No production operation.
# 2026-10-03 · stale matrix cancellation and merged-main requalification

- **Observation:** PR #60 matrix `37112986882` had stale metadata since `09:25:28Z`; three Windows jobs had no logs or state transitions.
- **Action:** Cancelled only the stale merged-PR run and dispatched Platform matrix `37113320349` against merged main `b7c0799`.
- **Boundary:** Fresh matrix evidence is pending. No acceptance checkbox, publication, deployment, migration, or production write occurred.
# 2026-10-03 · hosted runner infrastructure blocker

- **Observation:** Fresh matrix `37113320349` became stale at `09:31:20Z` with no job logs or transitions; cancellation request remains unprocessed.
- **Decision:** Do not infer pass/fail or repeatedly dispatch duplicate runs. Treat as an external GitHub runner/control-plane blocker while preserving existing terminal evidence.
- **Boundary:** No acceptance checkbox, publication, deployment, migration, or production write.
# 2026-10-03 · organization policy cache persistence (CLI PR #61)

- **Action:** Added CLI cache read/write helpers over the signed shared policy contract, with atomic restricted-file persistence and adversarial boundary tests.
- **Result:** Commit `9554125` pushed as PR `#61`; focused tests 2/2, full CLI suite, typecheck, build, and diff checks passed. Hosted checks pending.
- **Decision:** Preparatory TEAM-CLI-001 evidence only. Authenticated remote fetch, endpoint contract, and user-facing command wiring remain open; no checkbox changed and no production operation.

# 2026-10-03 · acceptance corpus and product self-scan

- **Action:** Added full-history OWASP Juice Shop, OWASP NodeGoat, and Appsecco DVNA fixture checkouts with local authorization notices; scanned all three and the current Verglos Web repository using CLI `9554125`, telemetry disabled and provenance enabled.
- **Result:** Complete detector coverage. Juice Shop: 906 files / 55 findings / score 0. NodeGoat: 67 files / 31 findings / score 0. DVNA: 35 files / 17 findings / score 34. Web: 396 files / 17 findings / score 79. Exact commits, report hashes, and limitations are recorded in private evidence documents.
- **Decision:** Progress toward ACCEPT-001 only; public fixtures are not customers and no findings were uploaded. No checkbox, production deployment, migration, or database write.

# 2026-10-03 · PR #61 hosted matrix terminal evidence

- **Observation:** Earlier pending state was transient. Run `37113657045` reached terminal success at `09:46:04Z` with all nine platform cells and in-toto binding successful.
- **Decision:** Hosted verification for merged cache persistence is accepted as evidence, while TEAM-CLI-001 remains open for missing remote API and command integration. No production operation.

# 2026-10-03 · nodejs-goof fixture scan

- **Action:** Cloned Snyk Labs `nodejs-goof` with complete history, added scope-limited public-fixture authorization, and scanned locally with CLI `9554125`, telemetry disabled and provenance enabled.
- **Result:** Complete coverage; 25 files and 29 findings (1 critical, 13 high, 15 medium), score 9/critical. Report hashes are in the private acceptance corpus evidence.
- **Decision:** Technical corpus progress only; no upload, exploit, production write, or acceptance checkbox change.

# 2026-10-03 · two additional vulnerable Node fixture scans

- **Action:** Cloned Damm Vulnerable Node Application and buggy-node with complete history, added local authorization notices, and ran current CLI scans with telemetry disabled and provenance enabled.
- **Result:** Damm: 38 files / 17 findings / score 34. buggy-node: 8 files / 57 findings / score 10. Both complete coverage; exact hashes are in the corpus evidence.
- **Decision:** Six-fixture technical corpus progress only. No upload, exploit, production write, or acceptance checkbox change.

# 2026-10-03 · acceptance corpus verification harness

- **Action:** Added private `verify-acceptance-corpus.mjs` and `acceptance:corpus:verify` package script.
- **Result:** Run verified six full clones, exact HEADs, scope-limited authorization files, complete report coverage, and report hashes; wrote the versioned private manifest under `docs/shipping/evidence/`.
- **Decision:** Stronger ACCEPT-001/003 evidence, but no checkbox change: the harness does not create customer consent, independent adjudication, or the final 10–20-corpus gate. No production or database operation.
# 2026-10-03 — acceptance-story substrate recheck

- CLI current source `955412516b96cc09393e78c43bf7d02b9abd05d9`: package-owned
  runner `pnpm --filter verglos test` — 236/236 passed, 0 failed/skipped.
- Hunt Docker adapter tests: 5/5 passed via the CLI package's `tsx` loader.
- Web Studio/Enterprise/Team/quality acceptance substrates: 72/72 passed.
- Evidence: `docs/shipping/evidence/acceptance-story-tests-2026-10-03.md`.
- Classification: substrate regression evidence only; no checkbox closed and
  no production/provider/customer/legal/independent-review operation performed.
# 2026-10-03 — reproducible acceptance-story runner

- Added private `scripts/verify-acceptance-stories.mjs` and package command
  `acceptance:stories:verify`.
- Bound CLI `955412516b96cc09393e78c43bf7d02b9abd05d9` and Web
  `763aab07a19f054dee41dc83ab9ec9f0743b4925`.
- Results: CLI 236/236 passed; Web 877/905 passed, 28 environment-gated skips,
  0 failures; composed Web substrates 72/72 passed.
- Evidence: `docs/shipping/evidence/acceptance-stories-verification-2026-10-03.json`.
- No checkbox, production state, migration, provider, customer, reviewer, or
  public release changed.
# 2026-10-03 — current CLI verification and packaging boundary

- Current source `955412516b96cc09393e78c43bf7d02b9abd05d9`: typecheck, build,
  and `@verglos/shared` tests passed.
- macOS `licenses:inventory` and `pack:public` both failed closed because
  pnpm omitted foreign-platform optional `@esbuild/*` manifests required by the
  lockfile. No bypass or synthetic license metadata was added.
- Hosted Linux Self-scan `37109797227` remains the successful public-pack
  evidence. Private evidence: `docs/shipping/evidence/current-source-
  verification-2026-10-03.md`.
- No checkbox or production/public release state changed.
# 2026-10-03 — merged-main platform matrix observation

- Dispatched Platform matrix run `37115386171` for merged CLI `18ab8e7`.
- In-toto binding and Ubuntu/macOS Node 20/22/24 cells are terminal success.
- Windows Node 20/22/24 remain `in_progress`; no terminal result is inferred.
- Evidence: `docs/shipping/evidence/cli-main-platform-matrix-2026-10-03.md`.
- No checkbox, source, release, deployment, migration, or production state changed.
# 2026-10-03 — matrix poll advanced

Run `37115386171`: Windows Node 24 reached success; Windows Node 20 and 22
remain in progress. Overall conclusion remains unclaimed pending terminal
workflow state.
# 2026-10-03 — merged-main platform matrix complete

Run `37115386171` reached terminal success: in-toto binding and all nine
Ubuntu/macOS/Windows × Node 20/22/24 cells passed against merged CLI `18ab8e7`.
This strengthens current-source qualification only; no checkbox, publication,
deployment, migration, or production state changed.
# 2026-10-03 — Vercel read-only access reconciliation

- Linked Web project environment names and deployment metadata are now
  inspectable through Vercel CLI without revealing secret values.
- Production deployment is READY with `verglos.com` aliases and the expected
  runtime build command.
- This corrects the current access fact only; no billing lifecycle, deployment
  mutation, migration, or production write was performed.
- Evidence: `docs/shipping/evidence/vercel-readonly-access-2026-10-03.md`.

# 2026-10-06 — Web qualification runner and dependency audit repair

- Added `pnpm test:serial` to Web PR #138 (`6e9c707`) so the configured
  pretest/test suites can run with Node test concurrency forced to one worker;
  the existing parallel test command remains unchanged.
- Local verification: Web serial suite 837 passed, 0 failed, 22 explicit
  environment-gated skips. Hosted typecheck/schema, build, Vercel preview,
  and security checks passed after pinning `source-map-js` 1.2.2 and
  `compression` 1.8.2 in the lockfile. The audit still reports two moderate
  findings; no high-severity findings remain.
- This improves reproducibility and removes a release-quality blocker. It does
  not close provider, customer-consent, independent-review, field-CWV,
  screen-reader, Linux-namespace, or production acceptance gates.

# 2026-10-06 — modified-client production boundary probe

- Read-only anonymous probes against `https://verglos.com` sent forged
  `as_plan=pro|studio|enterprise` values and forged organization/tenant query
  identifiers to entitlement, search, usage, evidence, and evaluation paths.
- All entitlement probes returned the bounded Free projection; all protected
  organization probes returned the auth-hidden 404 surface. Evidence:
  `docs/shipping/evidence/modified-client-production-probe-2026-10-06.md`.
- This is only anonymous forged-parameter evidence. Authenticated modified-CLI
  request matrices for usage/records and hosted acceptance remain open; no
  checkbox, production write, database operation, or deployment changed.

# 2026-10-06 — exact-source acceptance-story rerun

- Reran the private cross-repository acceptance harness against CLI
  `955412516b96cc09393e78c43bf7d02b9abd05d9` and Web qualification head
  `24232fd94a80d20e0d01ea80e758a3f77fd13dca`.
- Results: CLI **236/236 passed**; Web **877/905 passed with 28 explicit
  environment-gated skips and 0 failures**; composed Studio/Enterprise/Team/
  quality substrates **72/72 passed**. The evidence bundle was regenerated
  and secret scan passed.
- This refreshes exact-source regression evidence only. Provider lifecycle,
  customer consent, independent review, authenticated browser, field-CWV, and
  account-deletion gates remain open; no checkbox or production state changed.

# 2026-10-06 — SCM delivery contract recheck

- Ran the current Web SCM contract, provider mapping, delivery runner/worker,
  route, and check-composition tests with a disposable PostgreSQL 15 service
  available locally. Result: **19 passed, 0 failed, 0 skipped**.
- The repository contains no separate SCM repository integration fixture; this
  run therefore proves pure contract/runner behavior only. It does not prove
  live GitHub/GitLab credentials, production migrations, provider delivery, or
cutover. The temporary database was stopped and removed; no production state
changed and no checkbox was closed.

# 2026-10-06 — pinned CLI full qualification

- Repaired dependencies in the disposable pinned worktree, then reran
  `pnpm exec turbo run test typecheck build --force` against CLI
  `955412516b96cc09393e78c43bf7d02b9abd05d9`.
- All **23/23 Turbo tasks** succeeded across tests, typechecks, and builds for
  every package. The normal run's 16 Docker integration tests stayed
  explicitly skipped; the separately recorded pinned Docker integration run
  remains the source of the 55/56 result.
- Evidence: `docs/shipping/evidence/cli-full-qualification-2026-10-06.md`.
- No checkbox, release, deployment, migration, or production state changed.

# 2026-10-06 — shipping-document mirror reconciliation

- Compared the private authoritative backlog with the local public CLI
  shipping mirror. They differ in content and age: the private ledger is the
  current 218/51/269 tracker, while `verglos-cli/docs/shipping/` is an older
  Sep-17 untracked user-owned snapshot.
- The public mirror was not overwritten or staged. Private evidence, customer
  material, credentials, and operational release state remain confined to the
  private ledger; the private tracker remains authoritative for acceptance and
  checkbox accounting.
- No source, production, deployment, migration, or release state changed.

# 2026-10-06 — full Juice Shop fixture scan

- Ran the pinned current CLI `955412516b96cc09393e78c43bf7d02b9abd05d9`
  against the full authorized technical fixture at Juice Shop commit
  `1618a611b173b4bf114028e6e02549950606e29d`.
- Result: exit 0, 906 files walked, 55 findings, complete coverage, and no
  detector limitations. Severity counts were 16 critical, 12 high, 18 medium,
  0 low, and 9 info; seven test-file findings were excluded from the score.
- Evidence: `docs/shipping/evidence/juice-shop-scan-2026-10-06.md`.
- This remains public-fixture technical evidence, not customer consent,
  endorsement, hosted acceptance, or a production write. No checkbox changed.

# 2026-10-06 — full DAMM Vulnerable Node fixture scan

- Ran the pinned current CLI against fixture commit
  `1946570b36bf8e6dcac48142f072f40ee9cee160` under its local authorization
  manifest. Result: exit 0, 38 files walked, 17 findings, score 34, and
  critical risk classification.
- All requested detectors executed, but coverage is explicitly incomplete
  because npm registry lookup was unavailable. This limitation is retained in
  the evidence and is not treated as clean or complete coverage.
- Evidence: `docs/shipping/evidence/damm-vulnerable-node-scan-2026-10-06.md`.
- Public-fixture evidence only; no customer acceptance or checkbox changed.

# 2026-10-06 — CLI license and public-package qualification

- Repaired the disposable pinned worktree dependency index, then reran the
  license inventory and direct public-packaging script.
- Inventory passed structurally but reports eight explicit review blockers
  (BlueOak packages, nested `benchmark`, and source-missing
  `minipass-pipeline`). All six current `2.0.0-alpha.1` archives packed
  successfully; archive inspection found notices in every archive and no
  private-key, test-fixture, or CLI-fixture paths.
- Evidence: `docs/shipping/evidence/cli-license-package-qualification-2026-10-06.md`.
- No distribution/legal checkbox changed; no publication, tag, deployment, or
  production state changed.

# 2026-10-06 — clean consumer package qualification

- Ran packed-manifest, package-surface, and clean-consumer checks against the
  six freshly generated current CLI archives. All passed: six archives had
  valid bounded manifests, declared entrypoints resolved, all libraries
  imported, the CLI executed, and no external engine was installed implicitly.
- Evidence: `docs/shipping/evidence/cli-clean-consumer-qualification-2026-10-06.md`.
- Distribution/legal/release checkboxes remain open; no publication or
  production state changed.

# 2026-10-06 — release artifact verifier fail-closed check

- Assembled a private release-shaped directory containing six archives,
  notices, CycloneDX/SPDX SBOMs, dependency inventory, clean-consumer marker,
  and checksums. The verifier accepted the artifact layout and then failed at
  the unresolved-license-blocker gate exactly as designed.
- Evidence: `docs/shipping/evidence/release-artifact-verifier-2026-10-06.md`.
- This confirms the release process cannot bypass legal review; no artifact was
  published and no checkbox changed.

# 2026-10-06 — license blocker dependency map

- Mapped all eight inventory blockers to their lockfile dependency paths and
  installed package metadata, including the nested `benchmark` package under
  `fast-uri` and source-missing `minipass-pipeline`.
- Evidence: `docs/shipping/evidence/license-blocker-dependency-map-2026-10-06.md`.
- This is a legal-review handoff only. No package was reclassified, removed,
  published, or marked approved; no checkbox changed.

# 2026-10-06 — exact pinned CLI self-scan

- Ran the built current CLI against its own pinned source tree with
  `--json --no-telemetry --all`. Result: exit 0, 470 files walked, complete
  coverage, 75 findings, score 67/high risk (1 critical, 2 high, 3 medium,
  69 info; 37 test-file findings excluded).
- Evidence: `docs/shipping/evidence/cli-self-scan-2026-10-06.md`.
- The critical result is retained; this is qualification evidence only and did
  not alter source, production, release, or backlog state.

# 2026-10-06 — self-scan finding triage

- Triage confirmed the critical AGENT-002 finding targets the operator's
  external `~/.cursor/mcp.json`, not tracked Verglos source. The two high
  AUTH-003 findings are URL-component checks in `isSafeNetworkOrigin`, not
  password comparisons. Raw counts were preserved; no unsafe code change or
  operator credential mutation was made.
- Evidence: `docs/shipping/evidence/cli-self-scan-triage-2026-10-06.md`.
- No checkbox, production, release, or backlog state changed.

# 2026-10-06 — full Web serial qualification suite

- Ran `pnpm test:serial` from the current `verglos-web` checkout. Result:
  859 tests discovered, 837 passed, 0 failed, 22 skipped, exit 0.
- Evidence: `docs/shipping/evidence/web-serial-suite-2026-10-06.md`.
- Skips are environment-dependent integration cases; no production write,
  migration, deployment, or backlog checkbox changed.

# 2026-10-06 — acceptance-story verification recheck

- Re-ran `pnpm --silent acceptance:stories:verify` against CLI commit
  `955412516b96cc09393e78c43bf7d02b9abd05d9` and Web commit
  `24232fd94a80d20e0d01ea80e758a3f77fd13dca`. CLI: 236/236; Web: 877/905
  with 28 skips; composed Studio/Enterprise/Team/quality: 72/72; exit 0.
- The machine result preserves the open boundaries: Hunt qualification,
  modified-client runtime qualification, customer acceptance, provider
  qualification, and account deletion implementation. Evidence JSON was
  refreshed at `docs/shipping/evidence/acceptance-stories-verification-2026-10-03.json`.
- No acceptance checkbox changed; no production write, migration, deployment,
  provider capture, customer fixture use, or reviewer sign-off occurred.

# 2026-10-06 — pinned CLI forced qualification

- Exact current CLI commit `955412516b96cc09393e78c43bf7d02b9abd05d9` passed
  `pnpm exec turbo run test typecheck build --force`: 23/23 tasks successful,
  exit 0, with remote caching disabled.
- Evidence: `docs/shipping/evidence/cli-forced-qualification-2026-10-06.md`.
- This is local qualification only; release/legal/provider/customer gates and
  all corresponding backlog checkboxes remain unchanged.

# 2026-10-06 — Web build and schema qualification

- On Web commit `24232fd94a80d20e0d01ea80e758a3f77fd13dca`, typecheck,
  Drizzle schema check, ordered migration check (24 migrations), and production
  build all exited 0; build generated 37 static pages and completed Next.js
  optimization.
- Evidence: `docs/shipping/evidence/web-build-schema-2026-10-06.md`.
- Existing Node 22 engine warning was observed under Node 26.4.0; no migration,
  database write, deployment, or backlog checkbox changed.

# 2026-10-06 — production read-only smoke

- Read-only production requests to `/`, `/checkout`, `/docs`, and
  `/api/v1/entitlement/capabilities` returned HTTP 200. The capability payload
  reported `free`, `simulated=false`, catalog `2026-10-02.0`, active/purchasable
  Pro, inactive Team/Studio, and contracted Enterprise; this matches the
  catalog contract and current checkout behavior.
- Evidence: `docs/shipping/evidence/production-readonly-smoke-2026-10-06.md`.
- No credentials/cookies/payment identifiers were recorded and no production
  write, checkout creation, migration, or deployment occurred.

# 2026-10-06 — acceptance corpus integrity recheck

- Re-ran `pnpm --silent acceptance:corpus:verify` against CLI commit
  `955412516b96cc09393e78c43bf7d02b9abd05d9`. Result: 12 fixtures total,
  including 6 full public repository clones, 4 contract artifacts, and 2
  internal fixtures; all full-clone, coverage, artifact-integrity, and internal
  fixture checks returned true.
- The verification preserves the boundary that these are public technical
  fixtures, not customers or consented acceptance repositories. No exploit,
  upload, production write, migration, deployment, or backlog checkbox change
  occurred.

# 2026-10-06 — authenticated account DOM accessibility probe

- Production `/account` DOM inspection found one `main`, one `nav`, seven
  focusable links, zero unlabeled form controls, and no document-level body
  clipping. Evidence: `docs/shipping/evidence/account-dom-accessibility-probe-2026-10-06.md`.
- Automated DOM evidence only; no human screen-reader, field-CWV, or large-data
  claim and no backlog checkbox change.

# 2026-10-06 — authenticated account performance trace

- Production `/account` desktop trace at 1280×800 recorded lab LCP 971 ms,
  TTFB 115 ms, render delay 856 ms, and CLS 0.00. CrUX field data remains
  unavailable; a legacy-JavaScript insight estimated 14.4 kB savings.
- Evidence: `docs/shipping/evidence/account-performance-trace-2026-10-06.md`.
- Lab-only evidence; no field-CWV, screen-reader, large-dataset, deployment,
  production write, or backlog checkbox claim.

# 2026-10-06 — authenticated account mobile performance trace

- Production `/account` mobile/touch trace at 390×844 recorded lab LCP 768 ms,
  TTFB 97 ms, render delay 671 ms, and CLS 0.00. CrUX field data remains
  unavailable. Browser viewport was restored to 1280×800 afterward.
- Evidence: `docs/shipping/evidence/account-mobile-performance-trace-2026-10-06.md`.
- Lab-only evidence; no field-CWV, screen-reader, large-dataset, deployment,
  production write, or backlog checkbox claim.

# 2026-10-06 — authenticated account Lighthouse mobile audit

- Lighthouse navigation audit on production `/account` scored Accessibility
  100, Best Practices 100, SEO 58, and Agentic Browsing 67; 45 audits passed
  and 3 failed. Failed SEO checks (`is-crawlable`, `canonical`, `llms-txt`)
  are expected for this authenticated private route and were not “fixed” by
  changing public metadata.
- Evidence: `docs/shipping/evidence/account-lighthouse-mobile-2026-10-06.md`.
- No public-copy change, deployment, production write, or backlog checkbox
  change occurred.

# 2026-10-06 — Web negative-boundary and truth-registry qualification

- `pnpm test:negative-boundary`: 2/2 passed. Tenant identifier probing is
  refused before data-bearing access and protected denials are non-cacheable.
- `pnpm test:truth-registry`: 25/25 passed. Public claims are published only
  when exact, shipped, pinned, and measured; drifted or unsupported claims are
  corrected or removed, and unsafe mixed batches refuse the build.
- Evidence: `docs/shipping/evidence/web-negative-boundary-truth-registry-2026-10-06.md`.
- These are qualification results only; no deployment, production write,
  public-copy change, or backlog checkbox change occurred.

# 2026-10-06 — CLI public-package packing qualification

- Exact current CLI commit `955412516b96cc09393e78c43bf7d02b9abd05d9` packed six
  `2.0.0-alpha.1` public archives successfully. Every archive includes the
  package license and third-party notices; archive digests are recorded in the
  evidence file.
- `pnpm licenses:inventory` exited 0 but still reports unresolved review
  blockers (nested-license conflict, BlueOak review requirements, and missing
  source metadata). LIC/DIST release gates therefore remain open.
- Evidence: `docs/shipping/evidence/cli-public-package-pack-2026-10-06.md`.
- No publication, tag, deployment, or backlog checkbox change occurred.

# 2026-10-06 — authoritative tracker reconciliation check

- The private tracker remains authoritative at 218 checked / 51 unchecked /
  269 total. Its open items include the unresolved HUNT, billing/provider,
  migration, distribution, qualification, acceptance, and final-web gates.
- The checked-out public `verglos-cli` worktree is an older dirty `main`
  checkout (`b070942`, ahead/behind divergence) with founder-owned untracked
  shipping documents; it is not used as the current-source qualification tree.
  The exact current CLI tree remains `.local/verglos-cli-current` at
  `955412516b96cc09393e78c43bf7d02b9abd05d9`.
- The public mirror backlog is stale (144 checked / 125 unchecked) and its
  shipping documents are untracked in that dirty worktree. It was not silently
  overwritten. The private tracker is the source used for accounting until a
  deliberate mirror reconciliation can be reviewed and committed in the
  correct repository.
- No source, public repository, deployment, production database, or backlog
  checkbox changed in this reconciliation check.

# 2026-10-06 — Hunt Docker adversarial runtime qualification

- With Docker engine 29.7.2 and pinned image
  `debian@sha256:7c7b2c966bc9ee8cedfeef67e0e279108992c77681fa595db4a9d65c06ccc587`,
  the current CLI Hunt package test completed with zero failures. All 15
  enabled runtime adversarial scenarios passed; the macOS-host namespace
  scenario remained skipped because namespace identifiers are not available
  from the host process.
- Evidence: `docs/shipping/evidence/hunt-docker-adversarial-2026-10-06.md`.
- This is stronger Docker runtime evidence, not Linux host namespace,
  independent-review, trusted-publisher, or full Hunt-command acceptance.
  HUNT-011 and its dependent gates remain open; no checkbox changed.

# 2026-10-06 — hosted Linux Hunt namespace qualification

- Rechecked GitHub Actions Self-scan run `37113682760` at head
  `18ab8e7da3003186b80346c3ee4a58c5d8211626` and downloaded its retained Hunt
  artifact. On `ubuntu-latest`, the pinned Docker suite passed 16/16 runtime
  adversarial scenarios, including the PID/IPC namespace-private check that is
  unavailable on macOS. The overall run concluded success.
- Evidence: `docs/shipping/evidence/hunt-docker-hosted-linux-2026-10-06.md`.
- This closes only the hosted Linux namespace evidence gap. HUNT-011 remains
  open for trusted publisher roots, supported recipe coverage, and independent
  review; no checkbox or production state changed.

# 2026-10-06 — Razorpay sandbox read-only connectivity

- Local Test Mode credentials authenticated successfully against Razorpay's
  read-only payments endpoint (HTTP 200; expected response shape). No checkout,
  QR, payment, webhook, entitlement, database, or production write occurred.
- Evidence: `docs/shipping/evidence/razorpay-sandbox-readonly-2026-10-06.md`.
- This confirms provider connectivity only; PLAN-WEB-011/012 still require the
  complete catalog-bound payment and lifecycle/replay evidence.

# 2026-10-06 — CLI clean-consumer archive qualification

- Fresh temporary consumer installed all six public `2.0.0-alpha.1` archives
  from exact CLI commit `955412516`, imported every public library, executed
  the CLI version command, and verified no external engine was implicitly
  installed or cached. Exit 0.
- Evidence: `docs/shipping/evidence/cli-clean-consumer-2026-10-06.md`.
- This does not close licensing, trusted publication, provenance, or final
  release gates; no publication, deployment, production operation, or backlog
  checkbox change occurred.

# 2026-10-06 — CLI forced regression qualification

- Exact current CLI commit `955412516` completed
  `pnpm exec turbo run test typecheck build --force`: 23/23 uncached tasks
  succeeded, zero failures, exit 0.
- Evidence: `docs/shipping/evidence/cli-forced-regression-2026-10-06.md`.
- No publication, deployment, production operation, or backlog checkbox
  change occurred.

# 2026-10-06 — Web billing lifecycle focused qualification

- Current Web checkout/webhook tests completed 20 total: 18 passed, 2
  PostgreSQL-environment skips, 0 failures, exit 0. Signed catalog binding,
  tamper denial, single-grant/replay semantics, failed/refunded events, and
  malformed-input/configuration boundaries passed.
- Evidence: `docs/shipping/evidence/web-billing-lifecycle-focused-2026-10-06.md`.
- This does not substitute for real provider capture/webhook/refund/renewal or
  production reconciliation; PLAN-WEB-011/012 remain unchecked. No provider,
  database, production, or backlog state changed.

# 2026-10-06 — Web billing PostgreSQL drill blocker

- A disposable PostgreSQL 15.17 Docker database was used to try to promote the
  two skipped billing integration tests. `pnpm db:migrate` failed at migration
  `0000_rename_sentinel_to_pro` because the empty test database lacks the
  legacy `licenses` table the migration assumes. The container was removed
  afterward.
- Evidence: `docs/shipping/evidence/web-billing-postgres-drill-2026-10-06.md`.
- This is an isolated-test migration-baseline finding, not a production write.
  The billing integration tests remain skipped; PLAN-WEB-011/012 and migration
  gates remain open.

# 2026-10-06 — acceptance stories verification refresh

- Current pinned sources re-ran the private acceptance verifier: CLI 236/236,
  Web 877/905 with 28 environment-gated skips, and composed Studio/Enterprise/
  Team/quality substrates 72/72; all commands exited 0.
- Evidence: `docs/shipping/evidence/acceptance-stories-verification-2026-10-06.md`.
- The verifier still leaves Hunt, modified-client runtime, customer,
  provider, and account-deletion boundaries open. No checkbox, production, or
  deployment state changed.

# 2026-10-06 — CLI license-inventory verifier qualification

- Exact current CLI source passed `node --test
  scripts/license-inventory.test.mjs`: 5/5 tests, 0 failures, exit 0. The
  tests preserve deterministic and fail-closed license/SBOM behavior.
- Evidence: `docs/shipping/evidence/cli-license-inventory-tests-2026-10-06.md`.
- Manual license classifications remain unresolved; no publication or backlog
  checkbox change occurred.

# 2026-10-06 — CLI release-artifact gate qualification

- The disposable release pipeline assembled all six current archives and
  required sidecars, passed clean-consumer installation/import/version checks,
  and generated checksums.
- The final verifier refused the artifact because the dependency inventory
  still contains unresolved redistribution blockers. LIC-002/003 and
  DIST-002/003/006 remain open; no publication or backlog checkbox changed.
- Evidence: `docs/shipping/evidence/cli-release-artifact-gate-2026-10-06.md`.

# 2026-10-06 — CLI release-contract tests

- Exact current source passed the package-surface, license-inventory, SBOM,
  release-verifier, and publish-workflow contract tests: 15/15, zero failures.
- The tests preserve the fail-closed license blocker behavior; no legal,
  publication, production, or backlog state changed.
- Evidence: `docs/shipping/evidence/cli-release-contract-tests-2026-10-06.md`.

# 2026-10-06 — CLI private runner protocol substrate

- CLI PR #62 (`1633108b`) merged as `e7b0986`. The shared private-runner
  contract now bounds tenant/runner binding, short-lived signed jobs, replay,
  target/network policy, resource limits, and least-evidence result projection;
  it deliberately does not provide arbitrary remote shell execution.
- Focused tests 3/3, shared typecheck/build, hosted nine-cell platform matrix,
  self-scan, and in-toto binding passed.
- ENT-CLI-001 remains open for HTTP enrollment/poll/result transport, hosted
  integration, deployment evidence, and independent review. No checkbox,
  production, or publication state changed.
- Evidence: `docs/shipping/evidence/ent-cli-private-runner-2026-10-06.md`.

# 2026-10-06 — CLI organization policy fetch/cache integration

- CLI PR #63 (`390b0c0`) merged as `04b48fb`. The command-side policy path now
  performs bounded authenticated fetch, signed tenant/repository verification,
  atomic cache persistence, and explicit offline cache resolution.
- Focused fetch/cache tests 4/4, typecheck/build/diff, hosted nine-cell matrix,
  Self-scan, and in-toto binding passed.
- TEAM-CLI-001 remains open pending deployed Web policy endpoint, production
  activation, and hosted SCM/provider integration evidence. No checkbox,
  production, or database state changed.
- Evidence: `docs/shipping/evidence/team-cli-policy-fetch-2026-10-06.md`.

# 2026-10-06 — CLI Studio client projection workflow

- CLI PR #64 (`468bdc0`) merged as `1fa878d`. The shared and command-side
  workflow now requires an explicit approval bound to organization, client
  workspace, record digest, actor, and expiry before producing an upload-ready
  redacted projection digest.
- Focused shared/CLI tests 6/6, typecheck/build/diff, hosted nine-cell matrix,
  Self-scan, and in-toto binding passed.
- STUDIO-CLI-001 remains open pending upload transport, Web admission and
  persistence, and customer acceptance evidence. No checkbox, production, or
  database state changed.
- Evidence: `docs/shipping/evidence/studio-cli-client-projection-2026-10-06.md`.

# 2026-10-06 — CLI release rollback planning command

- CLI PR #65 (`fc05fb4`) merged as `7946234`. The bounded operator command now
  exposes rollback/revocation decisions while refusing unapproved, mutable,
  same-reference, history-invalidating, or replacement-less signing-identity
  transitions.
- Focused tests 2/2, typecheck/build/diff, hosted nine-cell matrix, Self-scan,
  and in-toto binding passed. One transient Windows Node 24 build crash was
  rerun successfully; it was a runner/toolchain exit, not a source diagnostic.
- DIST-006 remains open pending authenticated provider execution, rollback /
  recovery evidence, and independent qualification. No checkbox, production,
  or database state changed.
- Evidence: `docs/shipping/evidence/dist-006-rollback-plan-2026-10-06.md`.

# 2026-10-06 — structured Hunt isolation evidence pack

- CLI PR #66 (`d3c0df0`) merged as `e62ae12`. Self-scan now writes a structured
  report binding source commit, pinned image digest, runtime, and parsed
  adversarial totals, plus the raw log. Local pinned Docker run: 55 pass, one
  explicit macOS namespace skip, zero failures.
- Hosted run `37458869285` passed all nine platform cells and in-toto. The first
  Windows Node 20 attempt hit a transient `EBUSY` clean-consumer cleanup race;
  the failed cell was rerun successfully. QUAL-CLI-004 remains open for
  independent review and final provenance/recipe gates. No production or
  customer data was accessed.
- Evidence: `docs/shipping/evidence/qual-cli-004-hunt-evidence-pack-2026-10-06.md`.

# 2026-10-06 — bounded Hunt supported-recipe catalog

- CLI PR #67 (`30467e6`) merged as `9725e13`. The Hunt package now validates
  the fixed A1 `utf8-contains` recipe contract and records positive, negative,
  timeout, and adapter-failure fixture expectations. Unknown commands,
  allowlisted network, non-unconditional cleanup, and non-redacted recipes are
  refused before execution.
- Hunt tests/typecheck/build passed; hosted matrix `37462319147`, Self-scan,
  and in-toto passed across all nine platform cells. This is substrate progress
  only; HUNT-008/HUNT-009 stay open for trusted/licensed provenance,
  approval/entitlement wiring, functional command integration, and independent
  review. No production or customer data was accessed.
- Evidence: `docs/shipping/evidence/hunt-008-supported-recipe-catalog-2026-10-06.md`.

# 2026-10-06 — public archive private-dependency boundary

- CLI PR #69 (`ad6ee14`) merged as `b684eba`. The public packer now refuses
  public packages that depend on private workspace packages, with a regression
  contract test. Hosted run `37464586376` passed all nine platform cells,
  clean consumer, upgrade/rollback, self-scan, and in-toto.
- DIST-001 remains open for final release/legal qualification and dependent
  product surfaces. No production, customer, or database state was accessed.
- Evidence: `docs/shipping/evidence/dist-public-private-boundary-2026-10-06.md`.

# 2026-10-06 — account-deletion request boundary

- Web PR #139 (`077a7526b7a39af29cb0a1c9b2865b27cbe0af87`) merged as
  `317102f`. The additive `account_deletion_requests` migration and
  authenticated same-origin route provide explicit confirmation, bounded hosted
  data kinds, private no-store responses, and idempotent pending requests.
- Hosted verification `37468093583` passed full Web tests, type/schema,
  migration ordering, build, public-boundary, dependency/license/security,
  GitGuardian, and Vercel checks. Local focused route tests passed 2/2.
- QUAL-WEB-005 remains open: no production migration or deletion was run, and
  the reviewed legal-hold/customer-held-record worker, consent inventory, and
  deletion acceptance run are still missing. Backlog remains **218 checked / 51
  unchecked / 269 total**.
- Evidence: `docs/shipping/evidence/qual-web-005-account-deletion-boundary-2026-10-06.md`.

# 2026-10-06 — account-deletion execution gate

- Web PR #140 (`3aec3b2bba22dcd5a689488e2cfd22ce9eb2e39f`) merged as
  `b749c419`. The pure execution gate refuses cross-user, non-pending,
  empty-scope, active-hold, incomplete hosted deletion, out-of-scope mutation,
  and customer-held-record alteration cases; it completes only after the
  before/after inventory qualifier passes.
- Hosted Verify, Vercel, and GitGuardian all passed. Local quality suite passed
  20/20, with typecheck, Drizzle check, migration ordering, and diff checks
  clean. No production/database writes or migrations occurred.
- QUAL-WEB-005 remains open because this is not the transaction worker or an
  external privacy/customer acceptance run. Backlog remains **218 checked / 51
  unchecked / 269 total**.

# 2026-10-06 — account-deletion concurrency invariant

- Web PR #141 (`72b651c9b2274c68e315f7a4256ff78109b07e2a`) merged as
  `710a79fd`. Migration `0025` and the schema now enforce one pending deletion
  request per user; the route translates only PostgreSQL uniqueness race `23505`
  into an idempotent response and rethrows unrelated persistence failures.
- Hosted Verify, Vercel, and GitGuardian passed. Local route contracts passed
  3/3; typecheck, Drizzle check, ordered migration check (26), and diff check
  passed. No production/database write or migration occurred.
- QUAL-WEB-005 remains open for the reviewed deletion worker, legal/customer-held
  record evidence, consent inventory, and runtime acceptance. Backlog remains
  **218 checked / 51 unchecked / 269 total**.

# 2026-10-06 — production migration 0021–0025

- Read-only Neon preflight identified 21 applied migrations and no
  `account_deletion_requests` table. A 116 KiB `pg_dump` snapshot was restored
  into Docker PostgreSQL 18; the local clone reached 26 migrations and exposed
  the new SCM/deletion indexes before production apply.
- With founder authorization, `pnpm db:migrate` applied only additive
  migrations `0021` through `0025` to Vercel production. No data updates,
  deletes, backfills, or cutover ran.
- Post-write verification found 26 migration rows, SCM installation/delivery
  tables, deletion table and pending unique index, and unchanged invariant
  counts (2 users, 1 organization, 3 webhook events, 0 deletion requests).
  Web route/quality tests passed 23/23; typecheck, Drizzle, and migration
  checks passed. Evidence:
  `docs/shipping/evidence/production-migration-0021-0025-2026-10-06.md`.
- TEAM-WEB-006 and QUAL-WEB-005 remain open for live provider/cutover and
  hosted deletion/legal/customer-held evidence respectively.

# 2026-10-06 — strict six-package release verification

- CLI PR #70 (`67a132c`) merged as `3a0959a`. Publish-time strict verification
  now requires exactly the six public npm archives and one shared version.
- Local verifier tests passed 4/4, publish/platform contracts 2/2, and full CLI
  typecheck passed 13/13 tasks. Hosted platform run `37472923540` passed
  in-toto plus all Ubuntu/macOS/Windows Node 20/22/24 cells; self-scan
  `37472923665` passed.
- No tag, npm publish, provenance attestation, deployment, or production write
  occurred. DIST-001/002/003 remain open for protected publication, legal
  clearance, final package acceptance, and rollback evidence.
- Evidence: `docs/shipping/evidence/dist-strict-six-package-verifier-2026-10-06.md`.

# 2026-10-06 — account-deletion audit history

- Web PR #142 (`0438316`) merged as `3127199`. The authenticated status route
  now returns at most 50 requests newest-first, preserving private no-store and
  tenant/user authentication boundaries instead of exposing only the oldest row.
- Hosted Verify, Vercel, and GitGuardian passed. Local route contracts passed
  3/3; typecheck, Drizzle check, ordered migration check (26), and diff check
  passed. No production/database write or migration occurred.
- QUAL-WEB-005 remains open for the reviewed deletion worker, legal/customer-held
  record evidence, consent inventory, and runtime acceptance. Backlog remains
  **218 checked / 51 unchecked / 269 total**.

# 2026-10-06 — cross-repository qualification pass

- CLI exact branch `feat/cli-release-six-package-verifier`: forced Turbo
  `test typecheck build` completed **23/23 tasks successfully**. Existing Linux
  Docker-gated tests remained explicit skips where host namespace evidence was
  unavailable; no skip was reclassified as a pass.
- Web exact branch `feat/web-qual-005-deletion-history`: deletion route and
  quality suites passed **23/23**, typecheck passed, Drizzle schema check passed,
  and ordered migration check verified **26 migrations**. Node 26's existing
  Node-22 engine warning was retained as an evidence limitation.
- Evidence: `docs/shipping/evidence/qualification-pass-2026-10-06.md`.
  No public code changed, no PR was opened, and no production operation ran in
  this qualification pass. Backlog remains **218 checked / 51 unchecked / 269 total**.

# 2026-10-06 — authenticated dashboard runtime boundary

- Attached to the existing Chrome debugging session and inspected the deployed
  authenticated route. `/account/dashboard` resolved to the legacy `/account`
  dashboard with Free-state navigation; no organization slug or `/orgs/*`
  surface was available in this session.
- This proves browser attachment and authenticated account rendering only. It
  does not prove organization-dashboard, screen-reader, large-dataset, or field
  CWV acceptance. QUAL-WEB-006 remains open. Evidence:
  `docs/shipping/evidence/authenticated-dashboard-runtime-2026-10-06.md`.

# 2026-10-06 — organization policy client reconciliation

- Current CLI source contains TEAM-CLI-001 implementation from `04b48fb` /
  `390b0c0`: signed organization-policy envelope verification, tenant/repository
  binding, bounded remote fetch, atomic private cache, expiry-aware offline
  fallback, and the `policy organization` command.
- Current focused tests passed **4/4** for cache/fetch behavior. MCP authority
  and input-contract tests passed **28/28**; Hunt MCP tools remain explicit
  alpha stubs and do not execute recipes.
- TEAM-CLI-001 remains unchecked because the hosted policy endpoint is not
  deployed/qualified and PLAN-CLI-001 production activation evidence remains
  open. No public code changed or production operation ran.

# 2026-10-06 — policy digest interoperability blocker

- Before adding the hosted organization-policy endpoint, a shared nested policy
  fixture was hashed through Web `digestPolicyDocument` and CLI
  `canonicalizeJson`. The resulting digests differed, proving the current Web
  shallow-key ordering is not wire-compatible with the CLI recursive canonical
  JSON contract.
- No endpoint was added on top of that mismatch. `R-042` records the required
  canonical-alignment decision, cross-repository fixture tests, and any
  versioned migration/reconciliation needed before activation.

# 2026-10-06 — versioned Web canonical policy contract

- Web PR #143 (`b575084`) merged as `6bc6bcd`. It adds a side-by-side recursive
  canonical JSON serializer and `canonicalPolicyDocumentDigest` matching the
  CLI policy contract, with a nested fixture whose digest is
  `sha256:d25b1fc5b6487ecf9f75fb46179c698c8fe3ce7f6a783d9e790f088785931bc8`.
- The existing Web `digestPolicyDocument` path remains unchanged deliberately;
  no stored policy rows were rewritten and no hosted endpoint was enabled.
  TEAM-CLI-001 remains open pending row inventory, versioned migration/rollback
  review, endpoint wiring, and PLAN-CLI-001 activation evidence.
- Local Web policy lifecycle tests passed 12/12, typecheck passed, and Vercel
  Preview completed successfully for the exact merge head. No production or
  database operation occurred.
- Post-merge configured Web suite then passed **840/862 tests**, with 22
  existing environment-gated PostgreSQL/integration skips and 0 failures.
  The local Node 26 versus repository Node 22 engine warning remains an
  explicit limitation; hosted Vercel verification passed on the exact head.

# 2026-10-06 — current acceptance-story substrate rerun

- Private `pnpm --silent acceptance:stories:verify` completed successfully
  against CLI `ad6ee1479c887c59eb6630da4754a2e0b7b4045e` and Web `6bc6bcd1fbd51ad77e27a67463ba0e5c9572025d`.
- CLI package suite: **241/241 passed**. Web configured suite: **880/908
  passed**, 28 existing environment-gated skips, 0 failures. Composed
  Studio/Enterprise/Team/quality substrates: **74/74 passed**.
- Evidence JSON was refreshed with command output hashes. This remains
  substrate/regression evidence only: no hosted HTTP, provider, customer,
  reviewer, browser-human, field-CWV, migration, or production acceptance is
  claimed. No production/database operation occurred.

# 2026-10-06 — canonical policy digest alignment

- Web PR #146 (`5763632`) merged as `88a7791`; hosted Verify run
  `37488304350` passed all required checks.
- The Web contract now names both digest algorithms, preserves legacy row
  verification, defaults new writes to recursive `canonical-json-v1`, and
  stores the algorithm through additive migration `0027_policy_digest_algorithm`.
- Local Web verification passed 864/842/22/0; ordered migration validation
  passed for 28 migrations. No stored rows were rewritten and no production
  migration or hosted policy endpoint activation occurred.
- This addresses the implementation mismatch recorded in R-042. TEAM-CLI-001,
  PLAN-CLI-001, production reconciliation, and final activation evidence remain
  open. No checkbox changed.

# 2026-10-06 — scope expansion: GitHub orgs, payment methods, private acceptance corpus

- **Founder direction recorded:** shipping scope now includes production-aligned GitHub organization/App architecture, all Razorpay payment methods enabled by the account, and a private full-clone evaluation corpus spanning TypeScript/JavaScript architecture shapes from small products through enterprise-like systems.
- **GitHub boundary:** current SCM code is a provider-neutral substrate and remains open. New `GITHUB-WEB-001..004` items require immutable GitHub account/repository IDs, App installation/token lifecycle, delivery-id replay protection, lifecycle reconciliation, and bounded authorized-org cutover evidence. No GitHub provider claim is upgraded by this planning entry.
- **Payment boundary:** new `PLAN-WEB-013..015` items require server/catalog-driven method availability and Razorpay test-mode evidence for each method actually enabled (cards, UPI, netbanking, wallets where enabled), including capture, failures, refunds, renewals, replay, and ordering. Provider documentation is descriptive only; account configuration and redacted runtime evidence decide availability. No production payment write occurred.
- **Acceptance boundary:** new `ACCEPT-011..014` items are explicitly post-shipping: they start only after implementation/qualification gates and release-candidate freeze. They require private non-shallow public fixtures, exact commit/license manifests, reproducible scans from current unreleased source, held-out false-positive review, and final regression/go-no-go. Public technical fixtures do not represent customer consent. No fixture secrets, customer data, proprietary code, or competitive intelligence may enter the public CLI repository.
- **Acceleration protocol:** one dependency-ready acceptance boundary per phase PR/repository; complete route/schema/module/tests/evidence together; parallelize independent CLI/Web work; use focused tests while implementing and one full suite per merged phase; switch to the next independent queue when provider/customer/reviewer evidence blocks; recount checkboxes from the authoritative private backlog after every substantial batch; never check a box for preparatory code alone.
- **Safety:** no marketing edits, npm publication, release tags, or production database/payment changes are implied. Production operations remain subject to R-041 credential rotation and the reviewed preflight/write/postflight contract.

# 2026-10-07 — QUAL-WEB-005 deletion-worker boundary

- **Attempted batch:** `QUAL-WEB-005` privacy/deletion/retention operational
  qualification.
- **Inspected source:** Web `cbc0f5a89179995569308695419d4578c57ce716`;
  account-deletion route, schema, pure deletion gate, retention policy, and
  Studio/Enterprise hold contracts.
- **Result:** progress/blocker evidence only. The request ledger and pure gates
  exist, but no persisted legal-hold/customer-held authority or safe hosted
  deletion worker exists. The generic queue is organization-scoped and cannot
  be reused as a user-scoped account deletion job without an ownership/design
  decision.
- **Checks:** source/contract inspection only; no production/database/provider
  write, browser mutation, deletion, migration, or credential operation.
- **Evidence:**
  `docs/shipping/evidence/qual-web-005-deletion-worker-boundary-2026-10-07.md`.
- **Backlog:** no checkbox changed; **218 checked / 62 unchecked / 280 total**.
- **Next:** keep this gate open and continue with independent payment/browser
  qualification work; design the deletion inventory/hold authority before any
  worker or destructive integration is attempted.

# 2026-10-07 — QUAL-WEB-006 organization-route probe

- **Attempted batch:** authenticated deployed organization-dashboard runtime
  qualification.
- **Runtime evidence:** Chrome DevTools page 15, `https://verglos.com/orgs`,
  rendered the 404 page; the document request returned HTTP 404 and one
  corresponding console resource error.
- **Interpretation:** no unscoped `/orgs` listing surface was available in the
  attached account. A slug-scoped route was not tested because no organization
  slug or authorized organization fixture was available.
- **Boundary:** this does not prove dashboard accessibility, large-data, field
  CWV, or screen-reader acceptance. No checkout/payment/account/API mutation or
  response-body capture occurred.
- **Evidence:** `docs/shipping/evidence/qual-web-006-org-route-probe-2026-10-07.md`.
- **Backlog:** `QUAL-WEB-006` remains unchecked; **218 checked / 62 unchecked /
  280 total**.

# 2026-10-07 — QUAL-WEB-006 large-data qualification

- **Batch:** validate the merged large-dashboard fixture on the exact Web
  qualification head.
- **Code/hosted:** PR #150 head `a78578e` merged as
  `a64407d9e7b81ba4db8c52a96d1237da693cb910`; hosted required checks were
  green.
- **Local results:** disposable PostgreSQL 18 integration **1/1 pass, 0
  skips**; typecheck pass; Drizzle check pass; 29 ordered migrations pass;
  preview production build pass with 38 pages generated.
- **Limitations:** Node 26.4.0 versus the repository Node 22.x baseline and the
  existing multi-lockfile workspace-root warning remain recorded. This does
  not prove slug-scoped authenticated runtime, human screen-reader, field CWV,
  or full QUAL-WEB-006 acceptance.
- **State:** no production/provider/browser mutation; no checkbox changed;
  **218 checked / 62 unchecked / 280 total**.

# 2026-10-07 — authenticated organization entry implementation

- **Batch:** close the deployed `/orgs` discovery gap without mixing changes
  into payment PR #149.
- **Code:** Web PR #151, head `07788c08d`, adds the authenticated organization
  directory, active-membership slug links, account navigation entry, and 2
  focused contract tests.
- **Local results:** focused tests **2/2 pass**, typecheck pass, Drizzle check
  pass, and 38-page preview build pass.
- **Hosted state:** hosted run `37557043246`, type/schema, Vercel, GitGuardian,
  and Preview Comments passed. PR #151 merged as
  `c1bca533c0e617427e42fd1be3c449b0ed458311`.
- **Boundary:** no production/database/provider write, deployment promotion,
  payment action, or browser mutation. `QUAL-WEB-006` remains unchecked.
- **Backlog:** **218 checked / 62 unchecked / 280 total**.

# 2026-10-07 — production organization entry verification

- **Runtime:** Vercel production deployment
  `dpl_G7umvo3ZRerRWeg5SZUi8fPRnnHQ` is Ready and aliases `verglos.com`.
- **Browser:** existing authenticated Chrome page 13 requested `/orgs` and
  received HTTP 200; the main landmark, organization empty state, account link,
  route chunk, and clean console were observed.
- **Limitation:** the attached account has no active organization membership,
  so slug-scoped dashboard, screen-reader, and field-CWV evidence remain open.
- **Boundary:** no data/account/payment/provider mutation occurred.
- **Backlog:** no checkbox changed; **218 checked / 62 unchecked / 280 total**.

# 2026-10-07 — organization creation CSRF hardening

- **Batch:** audit the state-changing `/api/v1/organizations` creation route
  after adding the production organization entry point.
- **Code:** Web PR #152, head `415ce17`, adds exact same-origin enforcement
  before authentication/persistence plus a focused route contract.
- **Local:** route contract **1/1 pass**, typecheck, Drizzle check, and 38-page
  build pass.
- **Hosted:** GitGuardian, Preview Comments, hosted workflow `37557549508`, and
  Vercel preview passed. PR #152 merged as
  `6fccfb26ffb707e53c3ef44166b42280be29de55`.
- **Boundary:** no production/provider/database write, migration, payment, or
  browser mutation; no checkbox changed; **218 checked / 62 unchecked / 280
  total**.

# 2026-10-07 — payment production-method configuration hardening

- **Batch:** harden the production payment-method configuration boundary on
  the existing hosted-checkout phase PR.
- **Code:** Web PR #149, head `6b5da26`, rejects an unset or blank
  `RAZORPAY_ENABLED_PAYMENT_METHODS` in production and retains QR-only
  rejection.
- **Local:** focused payment/runtime tests **8/8**, typecheck, Drizzle check,
  and 40-page preview build pass.
- **Hosted:** workflow `37558018780` pending and Vercel preview deploying at
  capture; GitGuardian and Preview Comments pass.
- **Boundary:** no production/provider/database/payment/browser mutation; no
  checkbox changed; **218 checked / 62 unchecked / 280 total**.

# 2026-10-07 — QUAL-WEB-005 customer-held digest registry substrate

- **Batch:** add the digest-only customer-held record registry and comparison
  contract on the existing PR #153 boundary.
- **Backlog:** `QUAL-WEB-005` attempted but open; no accepted IDs and no
  checkbox changes. Count remains **218 checked / 62 unchecked / 280 total**.
- **Code:** Web PR #153 head `4c5966f`; migrations `0029` and `0030` are
  source-only and not applied to production.
- **Local:** combined deletion focus **28/28**, serial **846 pass / 22
  explicit skips / 0 fail**, typecheck/schema pass, ordered migration check
  **31**, diff check pass, and 38-page build pass.
- **Hosted:** checks for the new head were pending at capture; no hosted
  acceptance or merge claim made.
- **Boundary:** no production/database/provider/payment/deployment write,
  migration, deletion, browser mutation, or secret handling occurred.
- **Evidence:**
  `docs/shipping/evidence/qual-web-005-customer-held-digests-pr153-2026-10-07.md`.
- **Next:** add an authenticated writer only with bounded ownership and
  idempotency, then qualify the worker against a disposable database and
  restore rehearsal.

## Hosted result update — 2026-10-07

Workflow `37559903900` passed at job `112594573865` in 2m42s; Vercel,
GitGuardian, and Preview Comments passed at PR #153 head `4c5966f`. This is
hosted verification of the code substrate only; the PR remains open and no
production migration or deletion operation occurred.

# 2026-10-07 — QUAL-WEB-005 durable hold authority substrate

- **Batch:** persist the reviewed legal/contract/customer-deletion hold
  authority and explicit release semantics on the existing PR #153 boundary.
- **Backlog:** `QUAL-WEB-005` attempted but open; no accepted IDs and no
  checkbox changes. Count remains **218 checked / 62 unchecked / 280 total**.
- **Code:** Web PR #153 head
  `adf9a23b395a2c35208bd7d9cfcc7973300c2827`; migration `0029` is staged in
  source only and is not applied to production.
- **Local:** hold tests **3/3**, combined deletion focus **25/25**, serial
  **846 pass / 22 explicit skips / 0 fail**, typecheck/schema pass, ordered
  migration check **30**, diff check pass, and 38-page build pass.
- **Hosted:** checks for the new head were in progress at capture; no hosted
  acceptance or merge claim made.
- **Boundary:** no production/database/provider/payment/deployment write,
  migration, deletion, browser mutation, or secret handling occurred.
- **Evidence:**
  `docs/shipping/evidence/qual-web-005-hold-authority-pr153-2026-10-07.md`.
- **Next:** implement the bounded worker only after the customer-held digest
  contract and row-level reconciliation/restore boundaries are reviewed.

# 2026-10-07 — QUAL-WEB-005 versioned inventory substrate

- **Batch:** add the reviewed prerequisite inventory and fail-closed gate for
  account deletion without executing deletion.
- **Backlog:** `QUAL-WEB-005` attempted but open; no accepted IDs and no
  checkbox changes. Authoritative count remains **218 checked / 62 unchecked /
  280 total**.
- **Code:** Web PR #153, head
  `718aadcaa384dcfd8a5fc4789c3b62c23c9e3858`, based on Web main
  `6fccfb26ffb707e53c3ef44166b42280be29de55`.
- **Local:** focused tests **22 pass / 0 fail / 0 skipped**; typecheck,
  `db:check`, ordered migration check (**29**), diff check, and 38-page
  preview build pass. No migration file changed; frozen lockfile install was
  unchanged.
- **Hosted:** GitGuardian, Preview Comments, and Vercel pass; required hosted
  `typecheck-and-schema` workflow `37559045448` remained pending at capture
  (job `112591905027`). PR remains open and is not acceptance evidence.
- **Boundary:** no production/database/provider/payment/deployment write,
  migration, deletion, browser mutation, or secret handling occurred.
- **Evidence:**
  `docs/shipping/evidence/qual-web-005-inventory-pr153-2026-10-07.md`.
- **Next:** finish hosted verification, then separately implement and qualify
  durable hold authority, customer-held digest registration, bounded worker,
  reconciliation/audit receipt, restore rehearsal, and authenticated
  non-production E2E before considering the backlog item.

## Hosted result update — 2026-10-07

Workflow `37559045448` reached terminal green at job `112591905027`; GitGuardian,
Vercel Preview Comments, and Vercel also passed. The PR remains open and was
not merged or promoted because this is a fail-closed substrate and the broader
deletion, restore, rollback, provider, and release gates remain unresolved.

# 2026-10-07 — payment hosted-correction

- **Finding:** hosted workflow `37558018780` failed on one stale runtime-config
  expectation after the production payment-method guard was added; 870 passed,
  1 skipped, and 1 failed.
- **Correction:** Web PR #149 advanced to head `900a6a5` with the matching
  assertion; the behavior remains fail-closed.
- **Local:** full serial suite **850 pass / 22 explicit skips / 0 fail**;
  focused payment/runtime set **28/28 pass**.
- **Hosted:** replacement workflow `37558287090` passed all configured checks;
  Vercel preview completed successfully.
- **Boundary:** no production/provider/database/payment/browser mutation; no
  checkbox changed; **218 checked / 62 unchecked / 280 total**.

# 2026-10-07 — QUAL-WEB-005 bounded worker contract

- **Batch:** add the fenced user-scoped worker orchestration contract on PR
  #153; no production adapter or destructive SQL.
- **Backlog:** `QUAL-WEB-005` attempted but open; no accepted IDs and no
  checkbox changes. Count remains **218 checked / 62 unchecked / 280 total**.
- **Code:** Web PR #153 head `aef06b70f1b16d2c4ade4edd43d236b80a0d0b19`.
- **Local:** worker/deletion focus **31/31**, negative boundary **2/2**,
  serial **846 pass / 22 explicit skips / 0 fail**, typecheck/diff pass, and
  38-page build pass.
- **Hosted:** workflow `37560432960` was in progress at capture; no hosted
  acceptance or merge claim made.
- **Boundary:** no production/database/provider/payment/deployment write,
  migration, deletion, browser mutation, or secret handling occurred.
- **Evidence:**
  `docs/shipping/evidence/qual-web-005-worker-contract-pr153-2026-10-07.md`.
- **Next:** implement the store adapter only with disposable-DB integration,
  row-count/audit reconciliation, and restore rehearsal evidence.

# 2026-10-07 — QUAL-WEB-005 worker scope-fence correction

- **Batch:** close the claimed-job user-scope gap on the existing PR #153
  worker boundary.
- **Backlog:** `QUAL-WEB-005` attempted but open; no accepted IDs and no
  checkbox changes. Count remains **218 checked / 62 unchecked / 280 total**.
- **Code:** Web PR #153 head
  `ade21b6f4c74b0a27bcf349bded6d9ceb7e39ee0`; claimed-job user mismatch is
  blocked before state reads or adapter calls.
- **Local:** worker/deletion focus **32/32**, negative boundary **2/2**,
  typecheck pass, and diff check pass. Docker 29.7.2 was healthy but no
  integration container was started.
- **Hosted:** workflow `37560704115`, job `112597060041`, passed; Vercel,
  GitGuardian, and Preview Comments passed. PR remains open/mergeable.
- **Boundary:** no production/database/provider/payment/deployment write,
  migration, deletion, browser mutation, or secret handling. Migrations
  `0029`/`0030` remain unapplied.
- **Evidence:**
  `docs/shipping/evidence/qual-web-005-worker-scope-fence-pr153-2026-10-07.md`.
- **Next:** implement the disposable-DB-backed user-scoped deletion job/store
  boundary, with row-count/audit reconciliation and restore/rollback evidence
  before any operational enablement.

# 2026-10-07 — QUAL-WEB-005 user-scoped job persistence

- **Batch:** persist a user-scoped deletion job atomically with the request on
  the existing PR #153 boundary.
- **Backlog:** `QUAL-WEB-005` attempted but open; no accepted IDs and no
  checkbox changes. Count remains **218 checked / 62 unchecked / 280 total**.
- **Code:** Web PR #153 head
  `b91222a8d4d6ffd08f2be71391d89a6dafedab1`; additive migration `0031` and
  request/job transaction are source-only.
- **Local:** focused **16/16**, disposable PostgreSQL integration **1/1**,
  serial **846 pass / 23 explicit skips / 0 fail**, typecheck, Drizzle check,
  32-migration ordering, diff check, and 38-page build pass. Docker 16 test
  container was stopped after the bounded run.
- **Hosted:** checks were pending immediately after push; no hosted success
  claimed. PR remains open; mergeability awaits the new checks.
- **Boundary:** no production/database/provider/payment/deployment write,
  migration, deletion, browser mutation, or secret handling.
- **Evidence:**
  `docs/shipping/evidence/qual-web-005-job-persistence-pr153-2026-10-07.md`.
- **Next:** implement and qualify the fenced store claim/retry adapter before
  any deletion execution or production migration consideration.

# 2026-10-07 — QUAL-WEB-005 fenced store adapter substrate

- **Batch:** implement the user-scoped PostgreSQL claim/retry/block adapter on
  PR #153 without wiring destructive execution.
- **Backlog:** `QUAL-WEB-005` attempted but open; no accepted IDs and no
  checkbox changes. Count remains **218 checked / 62 unchecked / 280 total**.
- **Code:** Web PR #153 head
  `654c78c69a44d7b5aad4733ec7cb364d760b76b0`.
- **Local:** disposable PostgreSQL integration **1/1**, serial **846 pass /
  23 explicit skips / 0 fail**, typecheck, Drizzle check, 32-migration
  ordering, negative-boundary **2/2**, diff check, and 38-page build pass.
- **Hosted:** workflow `37561862519` queued at capture; Vercel was deploying.
  No hosted success claimed; PR remains open.
- **Boundary:** inventory/destructive/audit methods fail closed; no
  production/database/provider/payment/deployment write, migration, deletion,
  browser mutation, or secret handling.
- **Evidence:**
  `docs/shipping/evidence/qual-web-005-store-adapter-pr153-2026-10-07.md`.
- **Next:** implement the inventory-backed read snapshot and per-kind
  transactional adapter, with row-count reconciliation and audit receipt
  persistence still behind restore/rollback qualification.

# 2026-10-07 — QUAL-WEB-005 fenced inventory read

- **Batch:** add lease-fenced reads for seven hosted kinds, active holds, and
  customer-held digest identities on PR #153.
- **Backlog:** `QUAL-WEB-005` attempted but open; no accepted IDs and no
  checkbox changes. Count remains **218 checked / 62 unchecked / 280 total**.
- **Code:** Web PR #153 head `4656013`; snapshot keeps `inventoryComplete`
  false until supporting user/license/retention dispositions are covered.
- **Local:** disposable PostgreSQL integration **1/1**, serial **846 pass /
  23 explicit skips / 0 fail**, typecheck, Drizzle check, 32-migration
  ordering, negative-boundary **2/2**, diff check, and 38-page build pass.
- **Hosted:** workflow `37562115786` pending at capture; Vercel was deploying.
  No hosted success claimed.
- **Boundary:** no production/database/provider/payment/deployment write,
  migration, deletion, browser mutation, or secret handling.
- **Evidence:**
  `docs/shipping/evidence/qual-web-005-inventory-read-pr153-2026-10-07.md`.
- **Next:** complete the supporting ownership/retention inventory before any
  per-kind deletion transaction can be enabled.

# 2026-10-07 — QUAL-WEB-005 fenced inventory hosted verification

- **Batch:** verify the exact PR #153 inventory-read head through the hosted
  qualification workflow.
- **Backlog:** `QUAL-WEB-005` attempted but open; no accepted IDs and no
  checkbox changes. Count remains **218 checked / 62 unchecked / 280 total**.
- **Code:** Web PR #153 exact head
  `4656013425c4cadb498f004c1057aa6f1d5931b6`.
- **Hosted:** workflow `37562115786` passed, including the full configured
  checks; Vercel, GitGuardian, and Preview Comments passed.
- **Boundary:** no production/database/provider/payment/deployment write,
  migration, deletion, browser mutation, or secret handling.
- **Acceptance:** inventory remains incomplete by design; supporting data
  ownership/retention, destructive transactions, row-count/audit receipt,
  restore/rollback, runtime wiring, and authenticated non-production E2E are
  still required.
- **Evidence:**
  `docs/shipping/evidence/qual-web-005-inventory-read-pr153-2026-10-07.md`.
- **Next:** complete and qualify the supporting ownership/retention inventory
before enabling any destructive adapter.

# 2026-10-07 — QUAL-WEB-005 fenced deletion receipt

- **Batch:** add the source-only terminal receipt and fenced request/job
  completion boundary on PR #153.
- **Backlog:** `QUAL-WEB-005` attempted but open; no accepted IDs and no
  checkbox changes. Count remains **218 checked / 62 unchecked / 280 total**.
- **Code:** Web PR #153 exact head `52be606`; migration `0032` is not applied.
- **Local:** disposable PostgreSQL integration **1/1**, serial **846 pass /
  23 explicit skips / 0 fail**, typecheck, Drizzle check, 33-migration
  ordering, build, and diff checks pass.
- **Hosted:** workflow `37562587132` passed; Vercel, GitGuardian, and Preview
  Comments passed.
- **Boundary:** no production/database/provider/payment/deployment write,
  migration, deletion, browser mutation, or secret handling.
- **Acceptance:** destructive per-kind execution, complete ownership/
  retention inventory, runtime wiring, reconciliation against actual deletes,
  restore/rollback, and authenticated non-production E2E remain open.
- **Evidence:**
  `docs/shipping/evidence/qual-web-005-audit-receipt-pr153-2026-10-07.md`.

# 2026-10-07 — PLAN-WEB-013 hosted payment method catalog

- **Batch:** extend the server-authoritative hosted Razorpay method catalog on
  the existing checkout PR; keep unsupported/unqualified methods fail-closed.
- **Backlog:** `PLAN-WEB-013` attempted but open; no accepted IDs and no
  checkbox changes. Count remains **218 checked / 62 unchecked / 280 total**.
- **Code:** Web PR #149 exact head
  `db68157da039d8aab939818f9023f867028e4432`.
- **Local:** focused payment/runtime 25/25, negative boundary 2/2, truth
  registry 25/25, serial 850/22/0, typecheck, Drizzle check, 31-migration
  ordering, 40-page build, and diff check pass.
- **Hosted:** workflow `37563023349`, job `112604384062`, passed with hosted
  Vercel, GitGuardian, and Preview Comments checks. PR remains open and
  unmerged.
- **Boundary:** no account/provider configuration proof, payment transaction,
  lifecycle/replay evidence, production reconciliation, database/provider/
  deployment write, or browser mutation. `PLAN-WEB-014` and `PLAN-WEB-015`
  remain open.
- **Evidence:**
  `docs/shipping/evidence/plan-web-013-payment-method-catalog-pr149-2026-10-07.md`.

# 2026-10-07 — QUAL-WEB-005 fenced per-kind transactions

- **Batch:** add source-only migration `0033` and implement all seven
  user-scoped, lease-fenced deletion operations with durable idempotency and
  row-count receipts on PR #153.
- **Backlog:** `QUAL-WEB-005` attempted but open; no checkbox changes. Count
  remains **218 checked / 62 unchecked / 280 total**.
- **Code:** Web PR #153 exact head
  `9476e5d018c9ab18bd09fa6bec4f89e2ff353e92`, pushed and open.
- **Local:** focused qualification 29/29; disposable PostgreSQL integration
  1/1; serial 846/23/0; typecheck; Drizzle check; 34 migration ordering;
  negative boundary 2/2; truth registry 25/25; 38-route build; diff check.
- **Hosted:** workflow `37563632682`, job `112606299085`, passed; Vercel,
  GitGuardian, and Preview Comments passed. PR is `CLEAN` and unmerged.
- **Boundary:** migration is source-only. Supporting ownership/retention
  inventory, runtime worker invocation, complete reconciliation,
  restore/rollback, and authenticated non-production E2E remain open. No
  production/database/provider/payment/deployment write, migration, deletion,
  or browser mutation occurred.
- **Evidence:**
`docs/shipping/evidence/qual-web-005-kind-transactions-pr153-2026-10-07.md`.

# 2026-10-07 — QUAL-WEB-005 bounded runtime runner

- **Code:** Web PR #153 exact head
  `1f8571b4a146e9ef78ca9ae25c13b86f8e89665c` adds a batch-limited
  account-deletion runner and `CRON_SECRET`-authenticated Node cron route. It
  selects only due jobs, caps the batch at 10, validates the frozen seven-kind
  set, delegates to the fenced worker, and closes the database client in
  `finally`.
- **Local:** Route contract 2/2, disposable PostgreSQL integration 1/1,
  negative boundary 2/2, truth registry 25/25, serial 846/23/0, typecheck,
  schema, ordered 34-migration, diff, and 38-route build checks pass.
- **Hosted:** Verify `37563987818`, job `112607416147`, plus Vercel,
  GitGuardian, and Preview Comments passed. PR #153 remains open, CLEAN, and
  unmerged.
- **Boundary:** The batch integration deliberately remains blocked by
  `inventoryComplete=false`; no production route invocation or destructive
  write occurred. Supporting data disposition, reconciliation, restore/
  rollback, and authenticated non-production E2E remain open. Backlog remains
  218 checked / 62 unchecked / 280 total.
- **Evidence:**
  `docs/shipping/evidence/qual-web-005-runtime-runner-pr153-2026-10-07.md`.

# 2026-10-07 — QUAL-WEB-005 supporting disposition registry

- **Code:** Web PR #153 exact head
  `f83af5c0bdb9b15ee87ec83ac365e1fc5f91bd26` adds a bounded registry for
  every supporting table outside the seven hosted deletion projections. Each
  entry names its disposition, rationale, and approval requirement; the checker
  fails closed on omission, duplication, unknown tables, and blank rationale.
- **Local:** Focused deletion/hold/inventory tests 11/11; serial 846/23/0;
  typecheck; Drizzle; ordered 34-migration; diff; and 38-route build pass.
- **Hosted:** Verify `37564437899`, job `112608834179`, plus Vercel,
  GitGuardian, and Preview Comments passed. PR #153 remains open, CLEAN, and
  unmerged.
- **Boundary:** The registry is not consumed by the destructive store yet.
  Executable SQL, reconciliation, approved retention/legal treatment,
  restore/rollback, and authenticated non-production E2E remain open. No
  production or destructive operation occurred; backlog remains 218 checked /
  62 unchecked / 280 total.
- **Evidence:**
`docs/shipping/evidence/qual-web-005-supporting-dispositions-pr153-2026-10-07.md`.

# 2026-10-07 — QUAL-WEB-005 customer-held digest registration route

- **Batch:** add the authenticated same-origin customer-held digest registry
  boundary to PR #153; accept only the fixed `signed_vgl` kind and canonical
  SHA-256 identity, never record bytes.
- **Backlog:** `QUAL-WEB-005` attempted but open; no accepted IDs and no
  checkbox changes. Count remains **218 checked / 62 unchecked / 280 total
  (77.9%)**.
- **Code:** Web PR #153 exact head
  `03d60e99ccf895b3122c4ae6641c3d12b44169bf`, pushed and open.
- **Local:** focused route/hold/digest/worker tests 11/11; serial 870/847/23/0;
  typecheck; Drizzle; 35-migration ordering; negative-boundary 2/2; build;
  diff check.
- **Hosted:** Verify `37608270504` passed; Vercel Preview Comments passed.
- **Boundary:** legal/contract hold administration is not exposed to ordinary
  users. No production/database/provider/payment/deployment write, migration,
  deletion, or browser mutation. Authenticated non-production deletion E2E,
  executed dispositions, consent inventory, reconciliation, restore/RPO,
  rollback, and independent acceptance remain open.
- **Evidence:**
  `docs/shipping/evidence/qual-web-005-customer-held-digest-route-2026-10-07.md`.

# 2026-10-07 — QUAL-WEB-006 PR ledger correction

- **Correction:** Record Web PR #151 as merged at `f1384ba` after hosted run
  `37557043246` passed typecheck/schema, Vercel, GitGuardian, and Preview
  Comments.
- **Backlog:** no acceptance ID closed and no checkbox changed; exact count
  remains **218 checked / 62 unchecked / 280 total (77.9%)**.
- **Boundary:** QUAL-WEB-006 remains open for paid/org runtime, human
  screen-reader, large-data, and complete field-CWV evidence.

# 2026-10-07 — QUAL-WEB-005 protected deletion hold authority

- **Batch:** add super-admin-only hold activation/listing and atomic release
  routes to the existing PR #153 deletion boundary.
- **Backlog:** `QUAL-WEB-005` attempted but open; no accepted IDs and no
  checkbox changes. Count remains **218 checked / 62 unchecked / 280 total
  (77.9%)**.
- **Code:** Web PR #153 exact head
  `929da1907f001c8db71df0e601e08014590fd580`, pushed and open.
- **Local:** focused hold/admin/digest/worker contracts 10/10; serial
  872/849/23/0; typecheck; Drizzle; 35-migration ordering;
  negative-boundary 2/2; truth registry 25/25; SBOM; license inventory; and
  build pass.
- **Hosted:** Verify `37608932973` passed; Vercel, GitGuardian, and Preview
  Comments passed. PR remains clean and unmerged.
- **Boundary:** production audit still has migrations `0026`–`0034` pending.
  Authenticated non-production deletion E2E, disposition decisions, consent
  inventory, row reconciliation, restore/RPO, rollback, and independent
  acceptance remain open. No production/database/provider/payment/deployment
  write, migration, deletion, or browser mutation occurred.
- **Evidence:**
  `docs/shipping/evidence/qual-web-005-hold-authority-route-929da19-2026-10-07.md`.

# 2026-10-07 — QUAL-WEB-005 supporting executor disposable integration

- **Batch:** run the real account-deletion store/runner integration against a
  bounded disposable PostgreSQL 18 database after the supporting executor and
  hold routes landed.
- **Backlog:** `QUAL-WEB-005` attempted but open; no accepted IDs and no
  checkbox changes. Count remains **218 checked / 62 unchecked / 280 total
  (77.9%)**.
- **Runtime:** disposable container `verglos-qual-db-20261007`, isolated
  `verglos_test`, local port 55432; integration **1/1 pass**. The exact
  container was removed after the run.
- **Evidence:** hold blocking/release, lease retry/reclaim/stale-fence safety,
  all 16 supporting dispositions, retained-row receipts, channel-credential
  approval block, seven hosted-kind deletes, idempotency, terminal audit
  receipt, batch runner, and replay protection.
- **Boundary:** no production/database/provider/payment/deployment write,
  migration, deletion, or browser mutation. Production migration/cutover,
  authenticated browser E2E, consent/legal/customer-held decisions,
  reconciliation, restore/RPO, rollback, and independent acceptance remain
  open.
- **Evidence file:**
  `docs/shipping/evidence/qual-web-005-supporting-executor-integration-929da19-2026-10-07.md`.

# 2026-10-07 — HUNT-009 supported recipe execution requalification

- **Batch:** Re-run the merged gated supported-recipe execution at CLI PR #75
  exact merge `6bde945c`.
- **Backlog:** `HUNT-009` attempted but open; no accepted IDs and no checkbox
  changes. Count remains **218 checked / 62 unchecked / 280 total (77.9%)**.
- **Evidence:** Hosted platform matrix, self-scan, and in-toto all green;
  local `packages/cli` `pnpm test` exited 0. Focused cases cover exact
  approval/trust binding, negative probe, binding drift, symlink input, and
  unavailable private runtime denial.
- **Boundary:** No external recipe, customer repository, production, payment,
  deployment, or migration operation occurred. Trusted/licensed provenance
  and independent Hunt review remain open.
- **Evidence file:**
  `docs/shipping/evidence/hunt-009-supported-recipe-execution-pr75-2026-10-07.md`.

# 2026-10-07 — PLAN-WEB-013 test-mode hosted order probe

- **Batch:** Run one bounded Razorpay test-mode hosted-order creation and
  provider read-back against the canonical Pro monthly catalog snapshot.
- **Backlog:** `PLAN-WEB-013/014/015` attempted but open; no accepted IDs and
  no checkbox changes. Count remains **218 checked / 62 unchecked / 280 total
  (77.9%)**.
- **Result:** One order created and re-read successfully: status `created`,
  exact INR 280,943 amount/currency, complete signed checkout-note binding.
  Read-only payment history exposed one observed `netbanking` method; it does
  not prove the complete enabled-method set.
- **Verification:** Web PR #149 head `db68157` focused billing/configuration
  suite **38/38 pass**.
- **Boundary:** Test mode only; no authorization, capture, refund, webhook,
  entitlement grant, production/provider configuration, database, migration,
  deployment, or customer-state write. Full account-method and lifecycle
  matrix remains open.
- **Evidence file:**
  `docs/shipping/evidence/plan-web-013-test-mode-order-2026-10-07.md`.

- **Browser probe:** Approved Chrome CDP opened the hosted Razorpay Checkout
  twice for bounded test orders and closed both without submission. No stable
  method labels were exposed in the child execution context, so no method was
  claimed from browser text.

- **Method observation:** A direct CDP attachment to the hosted
  `api.razorpay.com` target exposed six selectable radio labels—UPI, card,
  netbanking, wallet, EMI, and Pay Later—and no QR radio. No method was
  selected or submitted; this is not lifecycle evidence.

# 2026-10-07 — GitHub App installation read-only preflight

- **Batch:** Inspect the authorized GitHub account and organization/App
  installation state without changing provider state.
- **Result:** Organization and repository reads succeeded; `GET
  /user/installations` returned 403 requiring an App-authorized token.
- **Backlog:** `GITHUB-WEB-001..004` attempted but open; no checkbox changes.
  Count remains **218 checked / 62 unchecked / 280 total (77.9%)**.
- **Boundary:** No installation, webhook, repository, check, organization,
  production, payment, database, or deployment mutation occurred.
- **Evidence file:**
  `docs/shipping/evidence/github-app-installation-readonly-2026-10-07.md`.
# 2026-10-07 — PLAN-WEB-013 hosted Pay Later alignment

- **Batch:** Align the server payment-method catalog with the direct hosted
  Checkout observation while preserving fail-closed behavior for unqualified
  methods.
- **Implementation:** Web PR #149 commit `f734acc` marks `paylater` as
  `checkoutSupported` and adds a regression assertion; QR remains a separate
  explicit adapter and cardless EMI, bank transfer, and eMandate remain hidden.
- **Verification:** Focused payment/route/runtime suite **30/30 pass**;
  `pnpm typecheck` passes; `git diff --check` passes.
- **PR:** #149, pushed to `f734acc`; hosted checks pending at capture.
- **Backlog:** PLAN-WEB-013/014/015 attempted but open; count remains
  **218 checked / 62 unchecked / 280 total (77.9%)**.
- **Boundary:** No method was selected or submitted. No provider lifecycle,
  production, database, migration, deployment, or credential operation occurred.
- **Hosted result addendum:** PR #149 exact head
  `f734acc8d4b03625b96cb90b628be04d4713d91d` passed Verify run
  `37611750797`; GitGuardian, Vercel, and Preview Comments passed. No
  checkbox changed because provider lifecycle/reconciliation evidence remains
  open.
# 2026-10-07 — PLAN-WEB-014 card sandbox probe

- **Batch:** Attempt one bounded test-mode hosted Cards flow without creating
  or closing browser tabs.
- **Result:** The existing persistent CDP page displayed Cards and accepted the
  sandbox card fields, but provider contact validation rejected the synthetic
  contact before continuation.
- **Boundary:** No payment, authorization, capture, failure, refund, webhook,
  entitlement, database, production, or credential operation occurred. Page
  restored to `about:blank`; production `/orgs` was untouched.
- **Backlog:** PLAN-WEB-014 attempted but open; count remains **218 checked /
  62 unchecked / 280 total (77.9%)**.
- **Evidence:** `docs/shipping/evidence/plan-web-014-card-sandbox-contact-2026-10-07.md`.
# 2026-10-07 — HUNT-009 execution entitlement gate

- **Batch:** Close the authorization gap on the direct supported-recipe
  execution path without weakening recipe, approval, catalog, binding, or
  runtime checks.
- **Implementation:** CLI commit `71de29f` requires the paid `hunt.critical`
  capability before execution input reads; merge commit `17d0813` reconciles
  the branch with current `origin/main`.
- **Verification:** Focused Hunt/process suite **54/54 pass**; package
  typecheck, build, and diff check pass; Free-plan process regression emits bounded
  `CAPABILITY_REQUIRED` JSON and performs no input reads.
- **PR:** #76, exact head `17d0813737cda980ccb366c5adf948bda2e293a3`, open and
  mergeable; hosted Self-scan `37612897033` and Platform matrix
  `37612897011` pass all 11 checks (in-toto plus Ubuntu/macOS/Windows Node
  20/22/24).
- **Backlog:** HUNT-009 attempted but open; count remains **218 checked / 62
  unchecked / 280 total (77.9%)**.
- **Boundary:** No production, customer, provider, database, deployment, or
  private-fixture operation occurred.
# 2026-10-07 — PLAN-WEB-014 direct checkout navigation probe

- **Batch:** Reuse the existing Chrome target for one bounded Razorpay
  test-mode checkout navigation attempt.
- **Result:** A test-mode order was created, but the direct public checkout
  target exposed no actionable form or method controls. The same page returned
  to `about:blank`; no new tab was created.
- **Boundary:** No payment, authorization, capture, refund, webhook,
  entitlement, database, production, or customer-state write occurred.
- **Backlog:** PLAN-WEB-014 attempted but open; count remains **218 checked /
  62 unchecked / 280 total (77.9%)**.
- **Evidence:** `docs/shipping/evidence/plan-web-014-direct-checkout-navigation-2026-10-07.md`.
# 2026-10-07 — HUNT-009 structured provenance projection

- **Batch:** Preserve the existing entitlement, signed-recipe, approval,
  catalog, and bounded-runtime gates while exposing the provenance needed to
  interpret a successful structured Hunt result.
- **Implementation:** CLI commit `c8a2e4b` adds verified feed/origin/digest,
  trust-store and recipe digests, redacted license evidence,
  `executionAuthorized`, and explicit `legalClearance: false`.
- **Verification:** Focused Hunt/process tests **54/54 pass**; package
  typecheck, build, and diff check pass. PR #76 pushed at exact head
  `c8a2e4b4bf337a332a003ac9296a6d3bbde15d9a`; hosted platform-matrix and
  self-scan runs `37614239691`/`37614239664` are pending at capture, with
  in-toto passed.
- **Backlog:** HUNT-009 attempted but open; count remains **218 checked / 62
  unchecked / 280 total (77.9%)**.
- **Boundary:** No production, provider, payment, database, deployment, or
  credential operation occurred.

# 2026-10-07 — HUNT-009 pre-runtime trust preflight

- **Implementation:** CLI commit `67debee` moves trust-store verification and
  exact recipe rule/subject binding ahead of private runtime loading and
  supported-catalog validation; invalid bindings cannot trigger runtime load.
- **Verification:** Focused Hunt/process tests **55/55 pass**, including the
  runtime-not-loaded regression; CLI typecheck, build, and diff check pass.
  PR #76 is pushed at exact head
  `67debee964c0c6be736d247793ec1d6faa7babb9`; the 9-cell platform matrix and
  self-scan are in progress, while the new in-toto binding has passed.
- **Backlog:** HUNT-009 attempted but open; count remains **218 checked / 62
  unchecked / 280 total (77.9%)**.
- **Boundary:** No production, provider, payment, database, deployment, or
  credential operation occurred.

# 2026-10-07 — HUNT Docker adversarial re-run

- **Evidence:** Current PR #76 head `67debee` ran the provided pinned harness
  with the existing `postgres:15-alpine` digest and returned **60 pass / 1
  explicit macOS namespace skip / 0 failures**, exit code 0, in 9.5 seconds.
- **Private artifact:** `docs/shipping/evidence/hunt-docker-adversarial-2026-10-07.md`.
- **Limitation:** This is local/CI adversarial evidence only; it is not an
  independent security review. HUNT-011 and QUAL-CLI-004 remain open.
- **Backlog:** Count remains **218 checked / 62 unchecked / 280 total
  (77.9%)**. No production, provider, payment, database, deployment, or
  credential operation occurred.

# 2026-10-07 — PLAN-WEB-013 hosted method response contract

- **Implementation:** Web PR #149 commit `520d40a` adds fail-closed client
  parsing for the server-created hosted-order response before opening
  Razorpay Checkout. The parser requires a bounded INR order and unique
  non-empty hosted method list, accepting UPI/cards/netbanking/wallets/EMI/Pay
  Later and rejecting QR or separately unsupported methods.
- **Verification:** Focused payment/route tests **16/16 pass**; Web typecheck
  and diff check pass. Private evidence:
  `docs/shipping/evidence/plan-web-013-hosted-method-response-2026-10-07.md`.
- **Backlog:** PLAN-WEB-013 attempted but open; PLAN-WEB-014/015 remain open;
  count remains **218 checked / 62 unchecked / 280 total (77.9%)**.
- **Boundary:** No provider, production, database, deployment, payment, or
  credential operation occurred.

# 2026-10-07 — Web full-suite payment revalidation

- **Verification:** Active Web PR #149 full configured test command completed
  with pretest **42/48** (6 environment-gated skips) and main suite
  **850/872** (22 environment-gated skips), **0 failures**. Focused
  hosted-method tests remain 16/16; typecheck and diff check pass. Node
  `v26.4.0` emitted the existing workspace Node 22 engine warning.
- **Boundary:** This strengthens code-side PLAN-WEB-013 evidence only; provider
  lifecycle and production reconciliation remain open. No provider,
  production, database, deployment, payment, or credential operation occurred.

# 2026-10-07 — Web payment build/schema verification

- **Verification:** Active Web PR #149 `pnpm db:check` passed with no migration
  drift; `pnpm build` compiled successfully and generated all 40 pages.
- **Limitations:** Local build recorded the existing Node 22 engine warning and
  multiple-lockfile workspace-root warning; production runtime validation was
  skipped outside a production deployment.
- **Boundary:** Code-side evidence only; no production, database, payment,
  deployment, provider, or credential operation occurred. Backlog remains
  **218 checked / 62 unchecked / 280 total (77.9%)**.

# 2026-10-07 — Web PR #149 hosted checks complete

- **Hosted result:** Exact head `520d40aa740bcf7dfb79cd7711a66d20555b7908`
  passed `typecheck-and-schema`, Vercel, Vercel Preview Comments, and
  GitGuardian.
- **Boundary:** PR remains open because PLAN-WEB-013/014/015 still require
  provider lifecycle, all-enabled-method, and production reconciliation
  evidence. No merge, provider, production, database, deployment, payment,
  or credential operation occurred. Backlog remains **218 checked / 62
  unchecked / 280 total (77.9%)**.

# 2026-10-07 — MCP Hunt verdict explanation

- **Implementation:** CLI PR #76 commit `7022408` adds the bounded
  `verglos_hunt_explain_verdict` result for all three recorded verdict values.
  It does not rerun Hunt, load a runtime, authorize execution, or make a
  network call; Pro entitlement remains enforced.
- **Verification:** MCP package tests pass **38/38** across all shards;
  typecheck, build, and `git diff --check` pass.
- **Limitation:** HUNT-009 and HUNT-010 remain open because supported Hunt
  execution, trusted/licensed provenance, independent review, and the other
  MCP Hunt execution tools are not qualified. No checkbox changed.
- **Backlog:** **218 checked / 62 unchecked / 280 total (77.9%)**.
- **Boundary:** No browser, provider, payment, production, database,
  deployment, credential, or external-recipe operation occurred.

# 2026-10-07 — HUNT PR #76 hosted matrix complete

- **Hosted result:** CLI PR #76 head `7022408` passes all nine
  Ubuntu/macOS/Windows × Node 20/22/24 cells, the Verglos self-scan, and the
  in-toto release binding.
- **Limitation:** HUNT-009 remains open for trusted/licensed publisher roots,
  bounded execution qualification, and independent review. HUNT-010 remains
  partial because the finding/report/before-write MCP execution tools are
  still alpha stubs. No checkbox changed.
- **Backlog:** **218 checked / 62 unchecked / 280 total (77.9%)**.
- **Boundary:** No browser, provider, payment, production, database,
  deployment, credential, or external-recipe operation occurred.

# 2026-10-07 — Web full regression after method webhook binding

- **Verification:** Web PR #149 head `3f4a7aa` full `pnpm test` completed with
  pretest **42/48** (6 environment-gated skips) and main suite **851/873** (22
  environment-gated skips), **0 failures**.
- **Limitation:** This strengthens code-side PLAN-WEB-013 evidence only;
  provider lifecycle and reconciliation evidence remain open. No checkbox
  changed.
- **Backlog:** **218 checked / 62 unchecked / 280 total (77.9%)**.
- **Boundary:** No browser, provider, payment, production, database,
  migration, deployment, or credential operation occurred.

# 2026-10-07 — PLAN-WEB-013 signed hosted-method binding

- **Implementation:** Web PR #149 commit `67fb7e2` binds the server-selected
  hosted payment-method set into signed Razorpay order notes and validates it
  on snapshot parsing. QR/subscription signatures and legacy order notes remain
  readable.
- **Verification:** Focused checkout/webhook/payload tests **15/15 pass**;
  Web typecheck, 40-page build, `pnpm db:check`, and diff check pass.
- **Limitation:** PLAN-WEB-013/014/015 remain open for provider lifecycle,
  all-enabled-method, deployment, and reconciliation evidence. No checkbox
  changed.
- **Backlog:** **218 checked / 62 unchecked / 280 total (77.9%)**.
- **Boundary:** No browser, provider, payment, production, database,
  migration, deployment, or credential operation occurred.

# 2026-10-07 — CLI regression after MCP Hunt explanation

- **Verification:** Root `pnpm test` at CLI PR #76 head `7022408` completed
  with **12/12 Turbo tasks successful** and 0 failed tasks, including the MCP
  package suite.
- **Limitation:** This is regression evidence for the bounded explanation
  surface only; no backlog checkbox changed and HUNT-009/HUNT-010 remain open.
- **Backlog:** **218 checked / 62 unchecked / 280 total (77.9%)**.
- **Boundary:** No browser, provider, payment, production, database,
  deployment, credential, or external-recipe operation occurred.

# 2026-10-07 — Web hosted verification complete

- **Verification:** Web PR #149 exact head `3f4a7aa` passed hosted run
  `37616532399`, including typecheck, serial/negative/truth tests, DB checks,
  build, public-boundary diff, dependency audit/SBOM/license checks,
  tracked-secret guard, and evidence upload. Vercel, Preview Comments, and
  GitGuardian are green.
- **Limitation:** PR #149 is merge-clean but PLAN-WEB-013/014/015 remain open
  for provider lifecycle, all-enabled-method, and reconciliation evidence. No
  checkbox changed.
- **Backlog:** **218 checked / 62 unchecked / 280 total (77.9%)**.
- **Boundary:** No browser, provider, payment, production, database,
  migration, deployment, or credential operation occurred.

# 2026-10-07 — HUNT-010 MCP runtime bridge

- **Implementation:** CLI PR #76 commit `b72982a` injects the private Hunt
  runtime into the public MCP boundary without making it a public dependency.
  Finding/report execution requires a complete signed binding and approval
  coverage for report, recipe, and trust-store files; missing runtime/binding is
  an explicit `not_attemptable` result. Before-write remains bounded preflight
  only and cannot synthesize arbitrary recipes.
- **Verification:** Shared/MCP builds, MCP **29/29**, CLI typecheck,
  public-boundary audit, and HUNT-009 execution tests pass. Hosted platform
  matrix `37617790266` passed all nine Ubuntu/macOS/Windows × Node 20/22/24
  cells and in-toto; self-scan `37617790257` also passed.
- **Limitation:** HUNT-009/HUNT-010 remain open for trusted/licensed roots,
  hosted execution qualification, and independent review. No checkbox changed.
- **Backlog:** **218 checked / 62 unchecked / 280 total (77.9%)**.
- **Boundary:** No production, provider, payment, database, deployment,
  credential, browser, or external-recipe operation occurred.

# 2026-10-07 — HUNT-010 hosted runtime-bridge qualification

- **Evidence:** Exact CLI PR #76 head `b72982a577d73a17273eb25d398521a92ad011c4`
  passed platform workflow `37617790266` across all nine supported
  Ubuntu/macOS/Windows × Node 20/22/24 cells, with in-toto binding green;
  self-scan `37617790257` passed as well.
- **Interpretation:** This is hosted integration/regression evidence only.
  HUNT-009/HUNT-010 remain open for trusted/licensed publisher roots, bounded
  execution qualification, and independent review. No checkbox changed.
- **Backlog:** **218 checked / 62 unchecked / 280 total (77.9%)**.
- **Boundary:** No production, provider, payment, database, deployment,
  credential, browser, or external-recipe operation occurred.

# 2026-10-07 — PLAN-WEB-013 direct test-mode method observation

- **Evidence:** A bounded localhost Razorpay Checkout page using test-prefix
  credentials rendered UPI, cards, EMI, netbanking, wallets, Pay Later, and UPI
  QR in the hosted iframe. The approved CDP session captured method labels only.
- **Boundary:** The catalog-amount test order was dismissed without payment; the
  local server was stopped and the target restored to `about:blank`. No capture,
  refund, webhook, entitlement, database, production, or deployment mutation
  occurred.
- **Limitation:** This strengthens PLAN-WEB-013 direct method evidence only.
  PLAN-WEB-014/015 remain open for full lifecycle and production reconciliation.
- **Backlog:** **218 checked / 62 unchecked / 280 total (77.9%)**.

# 2026-10-07 — PLAN-WEB-014 test-mode failure-path attempt

- **Evidence:** Hosted test Checkout reached the mock card flow but ended with
  “Payment could not be completed” after the synthetic contact value was
  rejected. Provider order/payment lookup was read-only and found no attached
  payment.
- **Limitation:** No success, capture, refund, webhook, renewal, replay,
  out-of-order, or exactly-once entitlement evidence was obtained. This is not
  payment acceptance.
- **Boundary:** Test-mode orders only; no production, live-key, database,
  deployment, entitlement, or payment-capture mutation occurred. The temporary
  server was stopped and browser target restored to `about:blank`.
- **Backlog:** **218 checked / 62 unchecked / 280 total (77.9%)**.

# 2026-10-07 — HUNT/MCP phase merge

- **Integration:** CLI PR #76 source head `b72982a` merged to `main` as
  `8e436544c164f9812263c504cd26b74e3bb8acec` after all hosted platform,
  self-scan, and in-toto checks passed.
- **Limitation:** This integrates the bounded bridge only. HUNT-009/HUNT-010
  and related qualification items remain open for trusted/licensed roots,
  bounded execution qualification, adversarial/independent review, and final
  release acceptance. No checkbox changed.
- **Backlog:** **218 checked / 62 unchecked / 280 total (77.9%)**.
- **Boundary:** No production, provider, payment, database, deployment,
  credential, or browser mutation occurred in the merge operation.

# 2026-10-07 — STUDIO-CLI-001 exact-preview binding

- **Implementation:** CLI PR #77 head `fdaec85` hardens `record project-client`
  with a safe-field allowlist, fixed limitation redaction, and an explicit
  approval bound to the exact canonical preview digest.
- **Integration:** PR #77 merged to CLI `main` as
  `de92976d3790fef1bd4ce0cf00e9e589ae603974` after all nine platform cells,
  self-scan, and in-toto release binding passed.
- **Verification:** Shared full suite and CLI full configured suite exit 0;
  focused tests pass 4/4 and 1/1; shared/CLI typecheck/build, public-boundary,
  and diff checks pass.
- **Limitation:** Hosted upload/custody, independent redaction proof, and
  Studio recipient/customer acceptance remain open. No checkbox changed.
- **Backlog:** **218 checked / 62 unchecked / 280 total (77.9%)**.
- **Boundary:** No production, provider, payment, database, deployment,
  credential, or browser operation occurred.

# 2026-10-07 — PLAN-WEB-014 sandbox lifecycle continuation

- **Scope:** Provider test-mode only; Razorpay test credentials from the
  isolated environment, one reused Chrome CDP page, and temporary localhost
  provider-only Checkout server. No production page, database, deployment, or
  live credential was used.
- **Evidence:** The official sandbox card flow recorded one attempted card
  payment with `amountPaid=0` and no capture. UPI and netbanking rendered in
  fresh test orders but were not completed. No identifiers, card data,
  contact value, cookies, response bodies, or personal data were retained.
- **Cleanup:** The CDP page was restored to `about:blank`; the exact temporary
  server was stopped.
- **Limitation:** This does not close PLAN-WEB-014/015 or any payment gate;
  success, capture, refund, renewal, cancellation, replay, out-of-order,
  webhook, exactly-once entitlement, and production reconciliation remain
  unproven. Backlog remains **218 checked / 62 unchecked / 280 total (77.9%)**.

# 2026-10-07 — QUAL-WEB-006 organization-directory AX/performance probe

- **Scope:** Read-only Chrome CDP inspection of authenticated production
  `/orgs`; no new tab, helper, navigation, or mutation.
- **Verification:** One `main`, one `h1`, one `h2`, one named link, and a
  30-node accessibility tree were observed. The page snapshot had 79 DOM
  nodes, `LayoutDuration=0`, `RecalcStyleDuration=0.000991s`,
  `TaskDuration=0.004148s`, and `JSHeapUsedSize=7941820` bytes.
- **Limitation:** This is partial evidence only. Keyboard, human
  screen-reader, mobile/responsive, reduced-motion, field-CWV,
  authenticated-dashboard-data, and large-dataset qualification remain open.
  No checkbox changed; backlog remains **218 checked / 62 unchecked / 280
  total (77.9%)**.
# 2026-10-07 — ENT-CLI-001 bounded private runner client

- **Implementation:** CLI PR #78 exact head `68772d7` merged to `main` as
  `dc4c1dbb151cded93580c95698d119151b490a81`; it adds Ed25519
  canonical-job verification, authenticated GET-only polling, tenant/runner/
  target binding, bounded persistent job/nonce replay protection, fail-closed
  malformed-job handling, and a
  least-evidence admission summary. No remote execution or result upload is
  exposed.
- **Verification:** Shared focused tests 5/5, CLI focused tests 3/3, shared/
  CLI typecheck and build, full configured CLI suite (0 failures), public
  boundary, diff, and command-surface smoke pass. Hosted matrix
-  Hosted platform matrix `37621823761` passed all nine Ubuntu/macOS/Windows ×
  Node 20/22/24 cells plus in-toto, and self-scan `37621823764` passed.
- **Limitation:** ENT-CLI-001 remains unchecked pending hosted endpoint and
  runner enrollment, bounded execution/result reconciliation, cross-platform
  qualification, and independent review. No production/provider/database/
  payment/deployment/browser/customer operation occurred.
- **Backlog:** **218 checked / 62 unchecked / 280 total (77.9%)**.

# 2026-10-07 — QUAL-CLI-006 standards validation corpus

- **Batch:** Add the missing required-field validation corpus on top of the
  already merged shared importer implementations.
- **Backlog:** `QUAL-CLI-006` attempted but open; no accepted IDs and no
  checkbox changes. Count remains **218 checked / 62 unchecked / 280 total
  (77.9%)**.
- **Code:** CLI PR #79 exact head
  `13d144438045da574e7cbab6a21ec73341b8f796`, pushed after rebasing onto
  current `origin/main` (`dc4c1db`).
- **Verification:** Shared importer/security tests **29/29**; full configured
  CLI graph **12/12** tasks; typecheck across 10 packages; build across 8
  packages; and diff check pass.
- **Hosted state:** Run `37625527232` passed all nine OS/Node cells, self-scan,
  and in-toto. PR #79 merged as
  `7d060b2852551cc017bbb2b5f70bad22843e7273`.
- **Boundary:** No production, provider, database, deployment, credential,
  package publication, or release operation occurred.
- **Limitation:** Official-validator, cross-platform artifact, legal/
  provenance, trusted-publishing, and independent acceptance evidence remain
  required before QUAL-CLI-006 can close.
- **Evidence:**
  `docs/shipping/evidence/qual-cli-006-standards-validation-corpus-2026-10-07.md`.

# 2026-10-07 — PLAN-WEB-013 hosted checkout prefill hardening

- **Batch:** Harden the existing hosted Checkout response with trusted
  authenticated customer prefill while preserving the server/catalog payment
  boundary.
- **Backlog:** `PLAN-WEB-013` attempted but open; no accepted IDs and no
  checkbox changes. Count remains **218 checked / 62 unchecked / 280 total
  (77.9%)**.
- **Code:** Web PR #149 exact head
  `b73fdd3beba513c0f9fc69a38c2fc69319ff9474`, pushed to the existing phase
  branch.
- **Verification:** Focused checkout/payment/webhook tests **23/23**,
  negative-boundary **2/2**, typecheck, Drizzle schema check, ordered
  31-migration check, production build (40 routes), and diff check pass.
  Node `v26.4.0` emitted the repository's existing Node 22 engine warning.
- **Hosted state:** Exact head passed hosted `typecheck-and-schema` run
  `37624542330`; Vercel, Vercel Preview Comments, and GitGuardian are green.
  The PR was not merged because provider lifecycle and reconciliation gates
  remain open.
- **Boundary:** No production, database, migration, provider, payment,
  deployment, entitlement, browser, or credential mutation occurred.
- **Limitation:** This does not prove provider configuration or any payment
  lifecycle, webhook, entitlement, or reconciliation path. PLAN-WEB-013/014/015
  remain open.
- **Evidence:**
  `docs/shipping/evidence/plan-web-013-hosted-prefill-2026-10-07.md`.
# 2026-10-07 — PLAN-WEB-013 current-head payment contract verification

- **Batch:** Re-verify the current hosted-payment source boundary after the
  prefill and Pay Later changes, without browser/provider access.
- **Result:** Web PR #149 exact head `b73fdd3` passed the focused payment,
  checkout, route, webhook, and runtime-config command **47/47 / 0 failures /
  0 skips**.
- **Backlog:** No accepted IDs; count remains **218 checked / 62 unchecked /
  280 total (77.9%)**.
- **Boundary:** No Chrome, Razorpay, database, deployment, migration,
  entitlement, credential, or production operation occurred. Provider lifecycle
  and reconciliation evidence remain required for PLAN-WEB-014/015.
- **Evidence:**
  `docs/shipping/evidence/plan-web-013-payment-contract-2026-10-07.md`.
## 2026-10-07 · PLAN-WEB-014 hosted card probe and local method configuration

- Added the observed Razorpay Test Mode method declaration to the ignored
  local Web test environment so the hosted order route does not fail closed
  during local qualification; production configuration was not changed.
- PR #149 exact head `b73fdd3` rendered the six implemented hosted methods and
  optional UPI QR. A bounded Cards probe reached the save-card prompt, but the
  final collector failed; no success/capture/refund/webhook/entitlement result
  was inferred.
- Focused payment/runtime contracts passed 47/47. The existing blank CDP
  target was restored. PLAN-WEB-014/015 remain unchecked and backlog remains
  218 checked / 62 unchecked / 280 total.
- Evidence: `docs/shipping/evidence/plan-web-014-card-hosted-probe-2026-10-07.md`.

The follow-up Netbanking probe reached bank selection but did not reach the
provider mock-bank success/failure control. No callback, capture, webhook, or
entitlement result was inferred; the CDP blank target was restored.

Web empty-Postgres regression batch (2026-10-07):

- **Source:** Web PR #153 exact head
  `929da1907f001c8db71df0e601e08014590fd580`.
- **Environment:** fresh disposable Docker `postgres:15`, empty
  `verglos_test`, `TEST_DATABASE_URL` only; the exact container was removed.
- **Result:** `pnpm test:serial` exit 0; pretest 48/48; main 871/872 with one
  explicit environment-gated billing skip and zero failures.
- **Disposition:** runtime-regression evidence only. No migration, `db:push`,
  production/provider/payment/deployment/browser mutation, or checkbox change.
  `QUAL-WEB-005` and all release gates remain open.
- **Evidence:**
 `docs/shipping/evidence/qual-web-005-empty-postgres-regression-2026-10-07.md`.

QUAL-WEB-006 browser runtime batch (2026-10-07):

- **Scope:** authenticated production `/orgs` empty state through the existing
  CDP page; desktop 1710x985 and mobile 390x844 emulation.
- **Result:** no horizontal overflow; AX trees 30/18 named desktop and 32/20
  named mobile; one focusable link and zero buttons; desktop layout,
  recalculation, task, and heap metrics 0.000059s/0.000669s/0.001557s/
  6,530,812 bytes.
- **Boundary:** Programmatic focus is not keyboard/screen-reader acceptance.
  Data states, keyboard traversal, human review, field-CWV, and large-data
  qualification remain open. The viewport was restored; a five-second target
  monitor observed no page creation/destruction. No checkbox changed.
- **Evidence:** `docs/shipping/evidence/qual-web-006-org-directory-mobile-focus-2026-10-07.md`.

# 2026-10-07 — QUAL-WEB-005 hold serialization

- **Batch:** Web PR #153, exact pushed head `85faba9d2e8569c285d631d1c7912753886d145b`.
- **Result:** User-scoped advisory locking now serializes hold mutation with
  supporting/hosted deletion and terminal receipt boundaries; active holds
  block before mutation or completion.
- **Verification:** Focused **35/35**, disposable PostgreSQL integration
  **1/1**, typecheck, schema, ordered 35-migration, and diff checks pass.
  Verify `37633633802` completed successfully at exact head; Vercel and
  Preview Comments were also green.
- **Backlog:** No accepted IDs; **218 checked / 62 unchecked / 280 total
  (77.9%)**. `QUAL-WEB-005` remains open.
- **Boundary:** No production/provider/payment/database/deployment/deletion or
  credential operation occurred. Lint was not accepted: `next lint` opened its
  interactive ESLint setup prompt in the worktree.

## 2026-10-07 · PLAN-WEB-014 Test Mode order API boundary

- **Batch:** One bounded Razorpay Test Mode Orders API create/fetch operation
  using the ignored Web test key pair; no browser or production payment was
  attempted.
- **Result:** Provider returned matching `created` status, INR currency, and
  `280943` minor-unit amount on create and fetch.
- **Backlog:** No accepted IDs; **218 checked / 62 unchecked / 280 total
  (77.9%)**. PLAN-WEB-013/014/015 remain open.
- **Boundary:** No method selection, payment authorization/capture, refund,
  renewal, webhook, entitlement, application database, production, QR,
  deployment, or credential mutation occurred.
- **Evidence:**
  `docs/shipping/evidence/plan-web-014-test-order-api-2026-10-07.md`.

## 2026-10-07 · PLAN-WEB-014 Test Mode webhook inventory and refund alignment

- **Batch:** Read-only Test Mode webhook inventory plus Web PR #149 refund
  event alignment.
- **Result:** One inactive endpoint on `verglos.com`; relevant events include
  `refund.created` and `refund.processed`. Code head `051d4be` processes only
  terminal `refund.processed` using the provider's cumulative watermark.
- **Verification:** Focused payment tests **29 pass / 1 explicit DB skip / 0
  failures**, typecheck, schema, migration-order, build, diff, and staged
  secret scan passed. Hosted Verify `37645815573` completed successfully for
  exact head `051d4be`; Vercel Preview Comments also passed.
- **Backlog:** No accepted IDs; **218 checked / 62 unchecked / 280 total
  (77.9%)**. PLAN-WEB-013/014/015 remain open.
- **Boundary:** No webhook configuration, payment, entitlement, database,
  production, deployment, QR, or credential mutation occurred.
- **Evidence:**
  `docs/shipping/evidence/plan-web-014-test-webhook-inventory-2026-10-07.md`.

## 2026-10-07 · Web migration bootstrap guard

- **Code:** Web PR #149 exact pushed head `3f05b0a` adds a read-only
  `db:migrate` preflight, an explicit local-only legacy baseline, and guard
  tests without editing the numbered Drizzle journal.
- **Verification:** Focused migration/guard/audit tests **12/12**, serial Web
  suite **855 passed / 23 explicit skips / 0 failures** out of 878, typecheck,
  schema check, ordered **31-migration** check, build, public-boundary,
  SBOM/license inventory, and diff checks passed. Disposable PostgreSQL 15
  rehearsal proved default empty-schema refusal with zero tables and explicit
  local bootstrap followed by 31 applied migrations and five baseline tables.
- **Backlog:** No accepted IDs; **218 checked / 62 unchecked / 280 total
  (77.9%)**. Migration evidence does not close payment, deletion, production,
  or release gates.
- **Boundary:** No production/provider/payment/deployment/credential write or
  browser mutation occurred. The only database writes were to the disposable
  local Docker database, which was removed.
- **Evidence:** `docs/shipping/evidence/migration-bootstrap-guard-2026-10-07.md`.

## 2026-10-07 · Web migration guard ported to PR #153

- **Code:** The same guard is present on Web PR #153 exact pushed head
  `f81de9f`, whose journal contains 35 migrations; the runbook count was
  corrected to `0000..0034`.
- **Verification:** Focused migration/guard/audit tests **12/12**, typecheck,
  schema check, ordered **35-migration** check, and diff checks pass. Serial
  Web suite: **850 passed / 23 explicit skips / 0 failures** out of 873.
  Disposable PostgreSQL 15 again proved default refusal with zero public tables
  and explicit local bootstrap through all 35 migrations and five baseline
  tables.
- **Disposition:** This is merge-candidate integration evidence only. PR #153
  remains open for its privacy/deletion, restore/rollback, production, and
  independent acceptance gates; no checkbox changed.

## 2026-10-07 · Web migration preflight schema-scope correction

- **Code:** Corrected both candidates so the empty-database decision counts
  base tables in every non-system schema, not only `public`. Exact pushed heads:
  PR #149 `e46299a`; PR #153 `47af6fa`.
- **Verification:** Typecheck, focused migration/guard/audit tests **12/12**,
  ordered migration checks (**31** and **35** respectively), and diff checks
  pass. Hosted checks are queued/running for the new heads.
- **Backlog:** No accepted IDs; **218 checked / 62 unchecked / 280 total
  (77.9%)**.
- **Boundary:** No production, provider, payment, deployment, credential, or
  browser mutation occurred. PRs remain open and must not be merged solely on
  this code-side correction.

# 2026-10-07 — Web PR #153 migration reconciliation after PR #149 merge

- **Code:** PR #153 exact pushed head `8a0bc3b` incorporates `origin/main`
  merge `8b843da`; billing migrations remain `0029–0030`, and deletion
  migrations were renumbered to `0031–0036` with journal/test references updated.
- **Verification:** Typecheck passed when run alone; focused deletion/payment/
  migration tests passed **27/29** with **2 explicit DB skips**; full serial Web
  suite passed **857/880** with **23 explicit skips** and zero failures; build,
  schema check, ordered **37-migration** check, and diff check passed.
- **Backlog:** No accepted IDs; **218 checked / 62 unchecked / 280 total
  (77.9%)**. QUAL-WEB-005 remains open for its operational and independent
  gates.
- **Boundary:** No production migration, deletion, payment, provider,
  deployment, credential, or browser-state write occurred.

# 2026-10-07 — Live checkout remains QR-only after PR #149 merge

- **Observation:** In-place CDP inspection of `https://verglos.com/checkout`
  still rendered the QR-only action and UPI copy; no hosted method list was
  present.
- **Disposition:** PR #149’s merge is not a production cutover. PLAN-WEB-013,
  PLAN-WEB-014, and PLAN-WEB-015 remain open; no deployment or payment action
  was attempted.
- **Backlog:** **218 checked / 62 unchecked / 280 total (77.9%)**; no checkbox
  changed.
- **Evidence:** `docs/shipping/evidence/live-checkout-still-qr-only-2026-10-07.md`.

# 2026-10-07 — Production Razorpay method preflight remains unauthenticated

- **Read-only result:** Vercel Production has no
  `RAZORPAY_ENABLED_PAYMENT_METHODS`; the SDK method lookup using the pulled
  live-key pair returned HTTP **401 `BAD_REQUEST_ERROR`**. No provider payload
  or secret was retained.
- **Deployment result:** Vercel’s production build from main `8b843da` failed
  runtime-config validation before build completion because the method variable
  is absent.
- **Current-mainline confirmation:** The subsequent automatic Production
  deployment from Web main `2e86514` failed at the same pre-build
  runtime-config stage with the same missing-variable message.
- **Post-merge confirmation:** After PR #154 merged as `1498837`, the automatic
  Production deployment from that exact main failed before build at
  `pnpm config:check` for the same absent variable.
- **Disposition:** Do not guess the production method list or promote the
  hosted-checkout cutover. PLAN-WEB-013/014/015 remain open.
- **Evidence:** `docs/shipping/evidence/razorpay-production-method-preflight-2026-10-07.md`.

# 2026-10-07 — Web PR #149 merged after hosted verification

- **Merge:** Web PR #149 exact head `e46299a` merged as `8b843da` after hosted
  typecheck/schema, Vercel, and Preview Comments passed.
- **Disposition:** This merges the hosted Razorpay/catalog/migration code phase;
  it does not accept PLAN-WEB-011/012/013/014/015. Provider lifecycle,
  all-enabled-method matrix, production reconciliation, and release gates remain
  open.
- **Backlog:** No checkbox changed; **218 checked / 62 unchecked / 280 total
  (77.9%)**.

# 2026-10-07 — PLAN-WEB-014 current-main local integration

- **Code:** Exact merged Web main `1498837` in fresh worktree
  `qual/web-plan-014-current-main`.
- **Verification:** Disposable PostgreSQL 15 bootstrap and 37 ordered
  migrations; payment/catalog/webhook/replay/refund/lifecycle tests **22/22**;
  typecheck, Drizzle schema check, and preview-mode **43-page** build passed.
- **Boundary:** Synthetic signed events only. No Razorpay API/credential,
  hosted payment, provider webhook, production configuration/database,
  deployment, or customer-state operation occurred. PLAN-WEB-014/015 remain
  open and no checkbox changed.
- **Evidence:** `docs/shipping/evidence/plan-web-014-current-main-local-integration-2026-10-07.md`.

# 2026-10-07 — Web PR #154 final base reconciliation

After PR #153 merged as `2e86514`, PR #154 was reconciled against that main and
pushed at exact head `9032bda`. Focused SCM/deletion contracts passed **46/46**;
serial Web passed **857/880** with 23 explicit skips and zero failures;
typecheck, build, schema, 37-migration ordering, and diff checks passed. Hosted
checks for this final reconciled head have not yet appeared. Live GitHub
App/org/webhook/cutover evidence remains open.

# 2026-10-07 — Web PR #153 merged after migration reconciliation

- **Merge:** PR #153 exact head `8a0bc3b` merged as `2e86514` after hosted
  typecheck/schema, Vercel, Preview Comments, and GitGuardian checks passed.
- **Disposition:** The deletion worker/inventory substrate and reconciled
  37-entry journal are now on Web main. `QUAL-WEB-005` remains open for
  authenticated non-production E2E, legal/customer-held disposition,
  production migration, restore/rollback, reconciliation, and independent
  acceptance.
- **Backlog:** No checkbox changed; **218 checked / 62 unchecked / 280 total
  (77.9%)**.
