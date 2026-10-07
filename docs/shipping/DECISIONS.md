# Verglos shipping decisions

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
