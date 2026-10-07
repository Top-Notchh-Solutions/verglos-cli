# Goal addendum — 2026-10-07

QUAL-WEB-005 fresh-snapshot rehearsal: a production `pg_dump` completed at
`2026-10-07T10:17:27.005Z` (150,515 bytes), restored into disposable
PostgreSQL 18, and accepted PR #153's migration tail to 35 history rows.
Restored aggregate counts were deletion requests 0, payments 0, subscriptions
0, and webhook events 4. Temporary dump/credentials were removed. This
advances RPO/restore/migration rehearsal only; deletion worker/E2E, legal,
customer-held-record, rollback, and independent acceptance gates remain open.
Evidence:
`docs/shipping/evidence/qual-web-005-fresh-production-snapshot-restore-2026-10-07.md`.

Vercel Preview preflight: the pulled Preview values were not recognized Razorpay
test/live key prefixes, the database value was not a PostgreSQL URL, and the
hosted-method variable was absent. No Preview provider/database call was made.
An isolated test deployment/database with valid test credentials is still
required for PLAN-WEB-014/015.

Production read-only audit: Vercel Production has no
`RAZORPAY_ENABLED_PAYMENT_METHODS` variable. A bounded read-only transaction
found 42 tables and 26 applied migrations, while the current hosted payment
candidate contains 31 migrations. Aggregate counts were 0 billing payments,
0 subscriptions, 0 deletion requests, 4 Razorpay webhook events, 1 license,
and 3 legacy migration mappings. No row contents or identifiers were read and
no production write/migration/deployment/payment/deletion operation occurred.
This is truth evidence only; PLAN-WEB-011/012/015 and QUAL-WEB-005 remain
open. Evidence:
`docs/shipping/evidence/production-readonly-billing-and-migration-audit-2026-10-07.md`.

Razorpay method preflight: the official SDK method lookup returned HTTP 401
`BAD_REQUEST_ERROR` / authentication failed for the current test credential
pair, so the real account-enabled method set remains unknown. No live-key
fallback or provider mutation was attempted. PR #149 exact-head payment tests
passed 27/28 with one explicit environment-gated skip; an isolated catalog
check exposed UPI, card, netbanking, wallet, and EMI as configured hosted
methods. This does not satisfy PLAN-WEB-013/014/015 or payment acceptance.
Evidence: `docs/shipping/evidence/razorpay-method-preflight-2026-10-07.md`.

SCM/payment qualification batch: exact Web `origin/main`
`6fccfb26ffb707e53c3ef44166b42280be29de55` passed the focused GitHub/SCM
suite **48/48**. A bounded Razorpay test-mode order was created for the
catalog monthly Pro amount of INR 280,943 paise and remained uncaptured. This
advances code-side/provider connectivity only; live GitHub installation,
Razorpay enabled-method/lifecycle evidence, production reconciliation, and
R-041 rotation remain open. No production operation or backlog checkbox
change occurred. Backlog remains **218 checked / 62 unchecked / 280 total
(77.9%)**. Evidence is recorded in
`docs/shipping/evidence/github-scm-code-side-qualification-2026-10-07.md` and
`docs/shipping/evidence/razorpay-test-order-creation-2026-10-07.md`.

Hosted payment-phase verification: Web PR #149 exact head passed Verify run
`37563023349` on Node 22: serial Web 871/872 pass with one explicit skip,
negative-boundary 2/2, truth-registry 25/25, 31 migrations, typecheck, build,
public-boundary, dependency/SBOM/license/secret checks. Provider test-mode
method/lifecycle evidence remains missing; backlog remains **218 checked / 62
unchecked / 280 total (77.9%)**.

Production payment truth recheck: read-only Chrome DevTools inspection of
`/checkout` returned HTTP 200 and clean console but still displayed the legacy
UPI-only QR path at INR 2,809.43/month. No payment or mutation request occurred.
PR #149 is not deployed; PLAN-WEB-011/012/013/014/015 remain open. Backlog
remains **218 checked / 62 unchecked / 280 total (77.9%)**.

QUAL-CLI-006 continuation: official `in-toto==3.0.0` verification passed for
all six public archives from exact CLI head `6bde945c60ac34351c02a70f6e7a2cb24f98ae1d`
with exact SHA-256 products in a bounded disposable Python 3.12 container.
This is artifact-binding evidence only; trusted keyless Sigstore, legal,
protected publishing, and final release gates remain open. No checkbox
changed; backlog remains **218 checked / 62 unchecked / 280 total (77.9%)**.

Payment continuation: Web PR #149 exact head
`db68157da039d8aab939818f9023f867028e4432` passed focused payment method,
route-contract, and webhook adversarial tests **18/18**, typecheck, Drizzle
schema validation, all **31** ordered migration checks, and license inventory
**3/3**. The PR remains open/mergeable/clean with green reported hosted
checks. This is code-side evidence only; Razorpay account-enabled test-mode
methods and complete provider lifecycle evidence remain absent. No checkbox
changed; backlog remains **218 checked / 62 unchecked / 280 total (77.9%)**.

QUAL-CLI-006 advanced on merged CLI `6bde945`: package/content, 16/16
build/typecheck, all-platform license/notices, six-archive, clean-consumer,
and upgrade/rollback checks passed. Official in-toto verification remains
unproven because its cryptography dependency installation was interrupted;
trusted publishing, legal, Sigstore, and release gates remain open.

QUAL-WEB-006 browser continuation loaded authenticated `/orgs` with HTTP 200,
truthful empty state, clean console, desktop 100/100/100 and mobile 100/100/80
Accessibility/Best Practices/SEO observations, and cold LCP 5,169ms (4,372ms
render delay). This is partial evidence only. Backlog remains **218 checked /
62 unchecked / 280 total (77.9%)**; no checkbox changed.

Merged-phase acceptance refresh: the exact merged CLI/Web substrate harness
passed CLI 250/250, Web 888/888 with 28 explicit environment skips, and
composed Studio/Enterprise/Team/qualification substrates 74/74. This advances
regression confidence only; it does not satisfy hosted payment/provider,
restore/RPO, modified-CLI, GitHub App, customer/reviewer, browser-human,
field-CWV, migration, or production acceptance. The whole-product goal remains
active and the authoritative backlog remains **218 checked / 62 unchecked / 280
total (77.9%)**.

PLAN-CLI-003 continuation: authenticated read-only browser probes kept forged
Enterprise/Studio selectors at Free, returned zero organizations, denied forged
usage/search and expanded project/record/policy/release reads with bounded 403s,
and showed zero deletion requests. No sensitive browser material or mutation
was captured. Licensed modified-CLI and public/private runtime coverage remain
open; backlog remains **218 checked / 62 unchecked / 280 total**.

QUAL-WEB-005 continuation: PR #153 passed 44/44 focused snapshot-backed
deletion/DR/privacy tests after restoring the existing local snapshot into
disposable PostgreSQL 18 and applying current migrations. This does not close
the gate: the snapshot is ~396h old, and authenticated hosted deletion E2E,
current RPO, and deployment rollback remain open. No checkbox changed; backlog
remains **218 checked / 62 unchecked / 280 total**.

Live queue refresh: (1) PLAN-WEB-014/015 provider test-mode method/lifecycle
qualification is blocked on account-enabled Razorpay test state; (2)
QUAL-WEB-005 needs fresh-backup RPO, authenticated deletion E2E, and deployment
rollback evidence; (3) GITHUB-WEB-001..004 / PLAN-CLI-003 needs live App
installation/permission/delivery evidence and R-041 rotation. The merged CLI
packaging correction and Free-account directory probe are complete partial
steps, not remaining implementation queue items. Backlog remains **218 checked /
62 unchecked / 280 total**.

Payment critical-path continuation: PR #149 focused code-side tests passed
44/44 with one explicit unit-test skip; a snapshot-backed disposable database
run then passed both billing-ledger and webhook-claim integrations (2/2, no
skips). This adds no payment checkbox credit. PLAN-WEB-013/014/015 remain open
for account-enabled Razorpay test-mode methods and full lifecycle evidence.
Backlog remains **218 checked / 62 unchecked / 280 total**.

QUAL-WEB-006 browser continuation: after a fresh reload, authenticated
`/orgs` rendered its directory empty state (“Choose an organization” / “No
organizations yet”). The earlier 404 was stale tab state; successful Production
deployment records were confirmed for merged organization-directory commits
`c1bca533` and `6fccfb26`. The account remains Free with no organization, so
paid/org, human screen-reader, large-data, and field-CWV evidence remain open.
No checkbox changed; backlog remains **218 checked / 62 unchecked / 280 total**.

CLI PR #75 subsequently passed all 11 hosted checks across Ubuntu, macOS, and
Windows Node 20/22/24 plus Verglos self-scan and in-toto release binding. It
merged as `6bde945c60ac34351c02a70f6e7a2cb24f98ae1d`. This is a shipped
packaging correction, not Hunt acceptance: HUNT-008/HUNT-009/QUAL-CLI-004
remain open for provenance, isolation, independent review, and functional
acceptance. No checkbox changed; backlog remains **218 checked / 62 unchecked /
280 total**.

QUAL-WEB-006 browser evidence was captured through the approved Chrome DevTools
session: authenticated Free `/account`, desktop/mobile Accessibility and Best
Practices 100, Tab focus to Overview, clean console, 200/304 navigation,
LCP 1,111ms, CLS 0.00, and no CrUX field data. No organization or paid
entitlement was available, so paid/org runtime, human screen-reader,
large-data, and field-CWV gates remain open. Backlog remains **218 checked /
62 unchecked / 280 total**; no checkbox changed.

CLI PR #75 exact head `c4beecb3525256cd2956660af8e3e6b49292b65f` now removes
the public CLI's static private Hunt dependency and validates an optional,
separately provisioned runtime with fail-closed exit-78 behavior. Hunt build,
CLI typecheck, focused 6/6, complete configured CLI suite, public packaging/
license/surface 17/17, six archives, package-content, and public-boundary
audits pass. PR #75 was OPEN/UNSTABLE with 11 hosted checks pending at capture.
This is packaging progress only; HUNT-008/HUNT-009/QUAL-CLI-004 remain open
for provenance, isolation, independent review, and acceptance. Backlog remains
**218 checked / 62 unchecked / 280 total**; no checkbox changed.

Web PR #153 exact head `250313e` hardened the disposable restore drill. The
existing snapshot restored, 35 migrations and both writer passes ran,
reconciliation returned `reconciled`, and fail-closed simulation passed; RTO
was 3.09s. The report failed the critical RPO gate because the snapshot is
approximately 396h old. This adds recovery-path evidence but does not close
QUAL-WEB-005: current production backup/restore, deployment rollback,
authenticated deletion E2E, and final acceptance remain open. Backlog remains
**218 checked / 62 unchecked / 280 total**; no checkbox changed.

Web PR #153 exact head `2127924e418fdca4094fa88bab02656952f4488b` now proves
supporting deletion transaction rollback and same-binding retry under an
injected PostgreSQL failure. Local serial Web 868/1/0, deletion integration
1/1, typecheck/build/schema/35-migration/diff checks, and hosted Verify
`37567278851` pass. Production backup/deployment rollback and authenticated
non-production E2E remain open; backlog stays **218 checked / 62 unchecked /
280 total** and no checkbox changed.

Web PR #153 exact head `eb785d2e382fc60535c15702fe7ffd8b9ae66610` now adds the
fenced supporting-disposition executor and durable per-table receipts. Worker
tests pass 4/4, disposable PostgreSQL integration 1/1, serial Web 868/1/0,
typecheck/build/schema/35-migration/diff checks pass; hosted Verify
`37566730804`, Vercel, GitGuardian, and Preview Comments pass. The approval-gated channel-credential
case blocks before dependent deletes. QUAL-WEB-005 remains open for
retained-row reconciliation, restore/rollback rehearsal, authenticated
non-production E2E, and hosted completion. Backlog remains **218 checked / 62
unchecked / 280 total**; no production operation or checkbox changed.

Web PR #153 exact head `37c8a07ef2c1d4f914c0ace03864d60fb2649a82` passed hosted
Verify `37564973546` and adds the read-only sixteen-table supporting inventory
contract. Local focused 9/9, disposable PostgreSQL 1/1, serialized Web
846/23/0, typecheck/build/schema/34-migration/diff checks pass. The worker
continues to fail closed with `supportingInventoryComplete=false`; executable
dispositions, receipts, reconciliation, restore/rollback, and authenticated
E2E remain open. Backlog remains **218 checked / 62 unchecked / 280 total**;
no production or provider operation occurred.

The HUNT-009 public execution candidate was requalified locally but stopped at
the hosted public/private boundary. CLI PR #74 exact head
`a2a1335d2a0b69ec56391286a4ba77ef773c0457` passed focused execution tests,
build, typecheck, and the full 13/13-task repository test graph. Hosted runs
`37565750571` and `37565750527` failed closed because the six-package public
packer cannot resolve private/alpha `@verglos/hunt`; PR #74 was closed without
merge. HUNT-009 remains unchecked. The whole-product goal remains active and
the authoritative backlog remains **218 checked / 62 unchecked / 280 total**.
No boundary bypass or production/provider/payment/database/migration/
deployment/credential operation occurred.

The active Verglos V1 goal remains whole-product shipping, not a reduced
release. This batch records the latest PR #153 worker scope-fence correction:
head `ade21b6f4c74b0a27bcf349bded6d9ceb7e39ee0`, local focused 32/32 and
negative-boundary 2/2, hosted workflow `37560704115` green. The authoritative
backlog remains **218 checked / 62 unchecked / 280 total**.

The worker is still a contract, not accepted deletion capability. No production
or provider write, migration, deletion, payment, deployment, or browser
mutation occurred. The goal therefore remains active; the next dependency-ready
batch is the disposable-DB-backed user-scoped deletion job/store with explicit
reconciliation and restore evidence.

## 2026-10-07 batch update

PR #153 head `b91222a8d4d6ffd08f2be71391d89a6dafedab1` now persists the
user-scoped deletion job atomically with the request. Focused 16/16,
disposable PostgreSQL 1/1, full serial 846/23/0, typecheck/schema/migration/
build/diff checks pass. Hosted checks were pending immediately after push;
`QUAL-WEB-005` remains open and migration `0031` is not applied to production.

The next PR #153 step adds only the fenced job-state adapter at head
`654c78c69a44d7b5aad4733ec7cb364d760b76b0`. It passes disposable PostgreSQL
1/1 and the full local qualification set, but inventory/destructive/audit
methods remain fail-closed. The whole-product goal remains active.

PR #153 head `4656013` now reads the seven hosted-kind inventory, holds, and
customer-held digests under the job fence, while deliberately retaining
`inventoryComplete=false`. The whole shipping goal remains active; no product
release or deletion acceptance is implied.

## 2026-10-07 payment qualification continuation

The bounded Razorpay Test Mode track configured the locally ignored test
environment with the observed hosted method set and reached both Cards and
Netbanking UI branches on Web PR #149 exact head `b73fdd3`. Cards reached the
save-card/confirming state; Netbanking reached bank selection. Neither reached
a provider success/failure callback or lifecycle evidence. The existing CDP
blank target was restored after each attempt. Backlog remains **218 checked /
62 unchecked / 280 total** and PLAN-WEB-014/015 remain open.

## 2026-10-07 Web regression qualification

The current Web PR #153 deletion-worker candidate at exact head
`929da1907f001c8db71df0e601e08014590fd580` passed its configured serial suite
against a fresh empty disposable Docker `postgres:15` database: pretest 48/48,
main 871/872 with one explicit environment skip, zero failures, exit 0. This
strengthens the local deletion/queue/usage runtime substrate only. It does not
close `QUAL-WEB-005`, payment lifecycle/reconciliation, production migration,
restore/RPO, rollback, authenticated E2E, legal/customer-held, or independent
acceptance gates. The container was removed; no production/provider/payment/
deployment/browser mutation occurred. Backlog remains **218 checked / 62
unchecked / 280 total (77.9%)** and no checkbox changed.

## 2026-10-07 QUAL-WEB-006 runtime probe

The existing authenticated production `/orgs` page was inspected through CDP in
desktop 1710x985 and bounded mobile 390x844 states. Neither state overflowed
horizontally; AX trees were 30/18 named desktop and 32/20 named mobile. The
empty state exposed one focusable link and no buttons. Desktop layout,
recalculation, task, and heap metrics were 0.000059s/0.000669s/0.001557s/
6,530,812 bytes. Programmatic focus is not keyboard/screen-reader proof, so
QUAL-WEB-006 remains open for keyboard, human review, field-CWV, authenticated
data, and large datasets. The viewport was restored, page targets remained
stable, and no production mutation occurred. Backlog remains **218 checked /
62 unchecked / 280 total (77.9%)**.
