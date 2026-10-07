# Verglos V1 traceability

## PLAN-WEB-013 hosted verification refresh · 2026-10-07

Web PR #149 exact head `db68157da039d8aab939818f9023f867028e4432` passed hosted
Verify run `37563023349`: serial Web 871/872 pass with one explicit skip,
negative-boundary 2/2, truth-registry 25/25, 31 ordered migrations, typecheck,
build, public-boundary, dependency, SBOM, license, and tracked-secret checks.
This does not close PLAN-WEB-013/014/015 because provider runtime and
account-enabled method evidence remain missing. See
`docs/shipping/evidence/payment-pr149-hosted-qualification-2026-10-07.md`.

## Production payment-surface truth recheck · 2026-10-07

Read-only Chrome DevTools inspection of production `/checkout` returned HTTP
200 with clean console but rendered the legacy UPI-only QR path at INR
2,809.43/month. No payment or mutation request occurred. This confirms PR #149
is not deployed and provides no test-mode/provider lifecycle evidence;
PLAN-WEB-011/012/013/014/015 remain unchecked. See
`docs/shipping/evidence/qual-web-payment-production-qr-observation-2026-10-07.md`.

## QUAL-CLI-006 official in-toto artifact binding · 2026-10-07

The exact merged CLI head `6bde945c60ac34351c02a70f6e7a2cb24f98ae1d` passed
the repository release verifier in a bounded disposable `python:3.12-slim`
container with official `in-toto==3.0.0`: six public archives were accepted
with exact SHA-256 products. This closes only the official local artifact
binding sub-check. Trusted keyless Sigstore/Fulcio/Rekor identity, legal,
protected publishing, and final release evidence remain open; QUAL-CLI-006
stays unchecked. See
`docs/shipping/evidence/qual-cli-006-official-intoto-2026-10-07.md`.

## PLAN-WEB-013/014/015 exact-head payment continuation · 2026-10-07

Web PR #149 exact head `db68157da039d8aab939818f9023f867028e4432` passed the
focused payment-method, route-contract, and webhook-adversarial tests **18/18**
with no skips. Typecheck, Drizzle schema validation, ordered migration
validation (**31**), and license inventory (**3/3**) passed. The PR is OPEN,
MERGEABLE, CLEAN, and its reported hosted checks are successful. This is
implementation qualification only; account-enabled Razorpay test-mode method
runtime and lifecycle evidence are missing, so PLAN-WEB-013/014/015 remain
unchecked. No production/provider/database/deployment operation occurred. See
`docs/shipping/evidence/payment-pr149-exact-head-qualification-2026-10-07.md`.

## QUAL-CLI-006 artifact qualification continuation · 2026-10-07

CLI `6bde945c60ac34351c02a70f6e7a2cb24f98ae1` passed package-content audit,
forced build/typecheck 16/16, all-platform optional-dependency license
inventory/notices, six-archive packing, packed-manifest audit, clean-consumer
installation/import/version/no-implicit-engine checks, and the
`1.8.3 -> 2.0.0-alpha.1 -> 1.8.3` transition. Official in-toto verification
was not completed after its cryptography dependency installation was
interrupted. QUAL-CLI-006 remains open for in-toto, trusted Sigstore/publishing,
legal, and final release evidence. No checkbox changed; backlog remains **218
checked / 62 unchecked / 280 total (77.9%)**.

## QUAL-WEB-006 organization browser continuation · 2026-10-07

The authenticated Chrome DevTools MCP session loaded `/orgs` with HTTP 200,
truthful empty organization state, and clean console. Snapshot observations
were desktop Accessibility/Best Practices/SEO 100/100/100 and mobile
100/100/80. A cold trace recorded LCP 5,169ms, TTFB 797ms, render delay
4,372ms, CLS 0, and no CrUX field data. This remains partial Free-account
evidence; paid/org, human screen-reader, large-data, field-CWV, and customer
acceptance remain open. No checkbox changed.

## Merged-phase acceptance story refresh · 2026-10-07

The private acceptance harness passed at exact CLI commit
`6bde945c60ac34351c02a70f6e7a2cb24f98ae1d` and Web commit
`6fccfb26ffb707e53c3ef44166b42280be29de55`: CLI 250/250, Web 888/888 with 28
explicit environment skips, and composed Studio/Enterprise/Team/qualification
substrates 74/74. This is substrate/regression evidence only and does not close
the hosted provider, customer, reviewer, browser-human, field-CWV, migration,
or production gates. No checkbox changed; backlog remains **218 checked / 62
unchecked / 280 total (77.9%)**. Detailed evidence:
`docs/shipping/evidence/acceptance-stories-merged-phase-2026-10-07.md`.

## PLAN-CLI-003 authenticated boundary probe · 2026-10-07

- Authenticated Chrome same-origin read-only requests proved forged Enterprise
  and Studio plan selectors remain Free, organization listing is empty, forged
  usage/search and the expanded project/record/policy/release reads return
  bounded 403 denial, and account-deletion GET has no requests. No sensitive
  response material was recorded.
- This strengthens the modified-client boundary but does not close PLAN-CLI-003:
  licensed CLI requests, record list/search/export, and public/private runtime
  coverage remain open. See
  `docs/shipping/evidence/modified-client-authenticated-browser-matrix-2026-10-07.md`.

## QUAL-WEB-005 snapshot-backed deletion qualification · 2026-10-07

- Web PR #153 exact head `250313e` passed 44/44 focused qualification tests
  after restoring the existing local snapshot into disposable PostgreSQL 18
  and applying current migrations. Coverage includes deletion-job integration,
  scope/hold/retry, inventory/dispositions, rollback/retry, DR thresholds, and
  privacy qualification contracts.
- The snapshot is approximately 396h old and the fixtures are synthetic/temp
  table based. Authenticated hosted deletion E2E, current RPO, deployment
  rollback, and production deletion remain unproven; QUAL-WEB-005 stays
  unchecked. See
  `docs/shipping/evidence/qual-web-005-snapshot-deletion-2026-10-07.md`.

## PLAN-WEB-013/014/015 payment code-side qualification · 2026-10-07

- PR #149 focused payment tests passed 44/44 with one explicit unit-test skip.
  Docker health passed; a disposable snapshot-backed PostgreSQL database
  applied the PR migrations and passed both billing-ledger and webhook-claim
  integrations (2/2, no skips). An empty-database attempt correctly stopped at
  migration 0000 because the reviewed legacy `licenses` baseline was absent.
- This confirms code-side fail-closed method configuration, catalog-bound order
  creation, and webhook/lifecycle contracts only. Razorpay account-enabled
  test-mode runtime evidence remains missing. PLAN-WEB-013/014/015 stay
  unchecked. See
  `docs/shipping/evidence/payment-code-side-qualification-2026-10-07.md`.

## QUAL-WEB-006 organization-directory reload · 2026-10-07

- A fresh reload in the authenticated Chrome session rendered the `/orgs`
  directory with “Choose an organization” and “No organizations yet.” The
  prior 404 was stale tab state. Successful Production deployment records were
  confirmed read-only for merged organization-directory commits `c1bca533` and
  `6fccfb26`.
- The account is still Free and has no organization. This is partial live
  evidence only; paid/org, human screen-reader, large-data, and field-CWV
  acceptance remain open. No checkbox changed. See
  `docs/shipping/evidence/qual-web-006-auth-account-browser-2026-10-07.md`.

## QUAL-WEB-006 authenticated account browser probe · 2026-10-07

- Chrome DevTools MCP verified the approved authenticated session. `/account`
  rendered named navigation/main structure, Tab focus reached Overview, and
  console/network checks were clean (200/304). Lighthouse desktop/mobile
  Accessibility and Best Practices were 100; trace LCP was 1,111ms and CLS
  0.00, with no CrUX data.
- The session is Free with no organization, so paid/org runtime, human
  screen-reader, large-data, and field-CWV evidence remain missing. No
  checkbox changed. See
  `docs/shipping/evidence/qual-web-006-auth-account-browser-2026-10-07.md`.

## HUNT-008/HUNT-009/QUAL-CLI-004 public runtime boundary · 2026-10-07

- CLI `c4beecb` removes the public archive's static private Hunt dependency
  and validates a separately provisioned runtime boundary; absent/malformed
  runtimes fail closed. Focused execution/runtime 6/6, CLI suite, public
  archive/license/surface 17/17, six-archive pack, package-content, and
  public-boundary checks pass.
- PR #75 exact head
  `c4beecb3525256cd2956660af8e3e6b49292b65f` is OPEN/UNSTABLE with 11 hosted
  checks pending at capture. This does not prove Hunt provenance, isolation,
  independent review, or acceptance; no checkbox changed. See
  `docs/shipping/evidence/hunt-public-runtime-boundary-c4beecb-2026-10-07.md`.

## Restore/recovery harness qualification · 2026-10-07

- Web PR #153 head `250313e` ran a disposable snapshot restore, 35 ordered
  migrations, both HOSTED-013 writer passes, reconciliation, and a stopped-DB
  fail-closed simulation successfully; measured RTO was 3.09s and the
  reconciler returned `reconciled`.
- The snapshot was approximately 396h old, so the 48h critical RPO gate
  failed. This is not production restore/deployment rollback or authenticated
  deletion E2E evidence; QUAL-WEB-005 remains unchecked. See
  `docs/shipping/evidence/qual-web-005-restore-harness-250313e-2026-10-07.md`.

## QUAL-WEB-005 rollback/retry qualification · 2026-10-07

- Web PR #153 head `2127924e418fdca4094fa88bab02656952f4488b` proves injected
  supporting-delete failure rollback and same-binding retry in disposable
  PostgreSQL integration 1/1. Serial Web is 868/1/0; typecheck/build/schema/
  35-migration/diff checks pass.
- Hosted Verify `37567278851`, Vercel, GitGuardian, and Preview Comments pass.
  This does not prove production restore/deployment rollback or authenticated
  non-production E2E; QUAL-WEB-005 remains unchecked. See
  `docs/shipping/evidence/qual-web-005-rollback-retry-2127924-2026-10-07.md`.

## QUAL-WEB-005 supporting disposition executor · 2026-10-07

- Web PR #153 head `eb785d2e382fc60535c15702fe7ffd8b9ae66610` adds the
  user/license-scoped supporting executor and durable per-table idempotency
  receipts. Worker 4/4, disposable PostgreSQL integration 1/1, serial Web
  868/1/0, typecheck/build/schema/35-migration/diff checks pass.
- The approval-gated channel-credential case blocks before dependent deletes;
  retained rows are reconciled by the worker's final inventory snapshot.
- Hosted Verify `37566730804` passed at the exact head; Vercel, GitGuardian,
  and Preview Comments passed. QUAL-WEB-005 remains open for restore/rollback and
  authenticated non-production E2E. No checkbox changed. See
  `docs/shipping/evidence/qual-web-005-supporting-executor-eb785d2-2026-10-07.md`.

## QUAL-WEB-005 supporting inventory snapshot · 2026-10-07

- Web PR #153 head `37c8a07ef2c1d4f914c0ace03864d60fb2649a82` passed hosted
  Verify `37564973546` and remains CLEAN/open.
- The read-only sixteen-table supporting inventory and disposition registry
  now have focused 9/9 tests, disposable PostgreSQL integration 1/1, and full
  serialized suite 846/23/0 over 869 tests. Typecheck, 38-route production
  build, Drizzle check, ordered 34-migration check, and diff hygiene pass.
- `supportingInventoryComplete=false` remains deliberate. No checkbox changed;
  executable dispositions, receipts, reconciliation, restore/rollback, and
  authenticated E2E remain required. See
  `docs/shipping/evidence/qual-web-005-supporting-snapshot-pr153-2026-10-07.md`.

## HUNT-009 public-boundary requalification · 2026-10-07

- CLI PR #74 tested head `a2a1335d2a0b69ec56391286a4ba77ef773c0457` and was
  closed without merge.
- Local focused execution coverage passed 3/3; repository build, typecheck,
  full test graph (13/13 tasks), and diff checks passed.
- Hosted platform matrix `37565750571` and self-scan `37565750527` failed at
  the public archive step because the six-package packer cannot resolve the
  private/alpha `@verglos/hunt` workspace dependency. This confirms the
  existing public/private boundary rather than authorizing a bypass.
- HUNT-009 remains unchecked. See
  `docs/shipping/evidence/hunt-009-public-boundary-requalification-2026-10-07.md`.

## QUAL-WEB-006 large-data and serialized-CI merge · 2026-10-07

- Web PR #150 passed hosted Verify `37552936102`, Vercel, GitGuardian, and
  Preview Comments, then merged to Web `main` as
  `a64407d9e7b81ba4db8c52a96d1237da693cb910`.
- The merged boundary covers only the synthetic large-data monitoring fixture,
  same-tenant pagination/truncation/foreign-tenant assertions, and serialized
  shared-PostgreSQL CI execution.
- QUAL-WEB-006 remains open for authenticated Pro/org browser evidence, human
  screen-reader review, and field CWV. No deployment or production operation
  occurred; see
  `docs/shipping/evidence/qual-web-006-large-data-2026-10-07.md`.

## CLI license-source metadata hosted qualification and merge · 2026-10-07

- Tested CLI head `d34ac4f` passed all Ubuntu/macOS/Windows Node 20/22/24
  cells, self-scan `37554811352`, and in-toto release binding in
  `37554811372`.
- PR #73 merged to CLI `origin/main` as
  `d63bf7a07c4dc421096b44593cd996aef40320d2`.
- The source-missing classification is removed mechanically; the nested
  `benchmark`/`fast-uri` conflict and six BlueOak legal reviews remain
  fail-closed. No backlog checkbox or release gate was closed, and no npm
  publication, tag, deployment, production, provider, database, payment, or
  credential operation occurred.

## CLI license-source metadata follow-up · 2026-10-07

- CLI PR #73 head `d34ac4f` adds an exact-version HTTPS source override for
  `minipass-pipeline@1.2.4`, based on read-only npm registry metadata for that
  immutable version.
- Inventory/SBOM tests pass 6/6, full CLI tests pass 12/12 workspace tasks,
  and typecheck passes 13/13 tasks. The inventory has 254 package versions,
  one nested component, and seven remaining review blockers.
- This removes only the source-missing classification. The nested license
  conflict and six BlueOak legal reviews remain fail-closed; `--require-clear`
  still exits 2. PR #73 is open with hosted checks queued. No checkbox,
  release gate, merge, publication, production operation, or credential write
  changed. See
  `docs/shipping/evidence/qual-cli-license-source-metadata-2026-10-07.md`.

## CLI release-candidate source follow-up · 2026-10-07

- Rebuilt current CLI source passes `pnpm test` with 12/12 workspace tasks and
  `pnpm typecheck` with 13/13 tasks.
- This is source-level release evidence only; the eight redistribution review
  blockers and LIC/DIST/publication gates remain open.

## CLI release-artifact qualification · 2026-10-07

- CLI `ad6ee14` rebuilt across eight workspace packages. Six public archives
  passed packed-manifest audit and an isolated clean consumer installed/imported
  all six, ran `Verglos 2.0.0-alpha.1`, and confirmed no implicit engine
  installation.
- A complete temporary release assembly produced six archives, five sidecars,
  and checksums. The final verifier reaches only the unresolved eight-item
  redistribution review list: nested benchmark conflict, six BlueOak reviews,
  and missing `minipass-pipeline` source.
- This qualifies mechanical packaging only; LIC/DIST/publication gates remain
  open and no npm/tag/deployment/production operation occurred. See
  `docs/shipping/evidence/qual-cli-release-artifacts-2026-10-07.md`.

## Razorpay Test Mode read-only method probe · 2026-10-07

- A read-only payment listing using a local `rzp_test_` credential returned one
  captured `netbanking` payment and no failed payment in the page.
- This is historical observed-method evidence, not provider capability or
  lifecycle acceptance. PLAN-WEB-014/015 remain open.
- The local env contains shell-unsafe secret syntax; no file was changed and
  the credential must be rotated before further provider calls. No provider
  write, payment, refund, subscription, webhook, production, or deployment
  action occurred. See
  `docs/shipping/evidence/razorpay-test-readonly-method-probe-2026-10-07.md`.

## Production checkout read-only verification · 2026-10-07

- **Observed:** Chrome DevTools Protocol loaded the production checkout with
  HTTP 200. The live DOM exposed only monthly/annual cadence controls and
  `Show UPI QR code`; no hosted card, UPI intent, netbanking, or wallet method
  selector was present.
- **Interpretation:** Production remains pre-PR-149 QR-only. PLAN-WEB-013/014/
  015 and production reconciliation remain open; this is not provider
  lifecycle evidence.
- **Boundary:** No button click, payment, provider, database, migration,
  deployment, or credential operation occurred. See
  `docs/shipping/evidence/qual-web-production-checkout-readonly-2026-10-07.md`.

## QUAL-WEB-006 production account browser smoke · 2026-10-07

- **Read-only browser evidence:** Chrome 154 DevTools Protocol reloaded the
  authenticated `/account` tab. The document and observed same-origin static
  resources returned HTTP 200; DOM inspection found one main/one nav landmark,
  seven links, no unlabeled controls, no tables, and no visible error copy.
- **Truth boundary:** The rendered page is the Free-plan Pro fence. No paid
  organization, large dataset, human screen-reader, or field-CWV evidence is
  present; QUAL-WEB-006 remains open.
- **Safety:** No provider/payment, account mutation, production DB,
  deployment, migration, or credential action occurred. See
  `docs/shipping/evidence/qual-web-account-browser-smoke-2026-10-07.md`.

## PLAN-WEB-013 hosted verification follow-up · 2026-10-07 · Web PR #149

- **Head/result:** `550dba0`; hosted Verify run `37553696161` is green for
  Node 22 typecheck, full tests, negative-boundary/truth-registry,
  DB/schema/migration checks, build, public-boundary, dependency/SBOM/license,
  and tracked-secret checks.
- **Local result:** Focused payment/runtime/route-contract tests pass 33/33;
  typecheck passes.
- **Boundary:** The change aligns the complete production-config fixture with
  the new requirement for at least one hosted Razorpay method. It does not
  establish provider account capabilities or lifecycle evidence. PR #149 is
  open/unmerged; PLAN-WEB-013/014/015 remain open and no production,
  provider, payment, migration, deployment, or credential operation occurred.

## Web hosted serial qualification CI · 2026-10-07

- Web PR #150 head `a78578e` uses the existing serial PostgreSQL test harness
  in Verify. Hosted run `37552936102` passes the complete job, including
  serialized tests, schema/migration, build, security, public-boundary,
  dependency, SBOM, license, and tracked-secret checks.
- This resolves CI scheduling reliability only; it does not establish
  provider, production, customer, GitHub cutover, or release-candidate
  acceptance. See
  `docs/shipping/evidence/qual-web-ci-serial-2026-10-07.md`.

## Web serial PostgreSQL qualification · 2026-10-07

- **Result:** The existing serial harness passes pretest 48/48 and the
  configured Web suite 867/867 with one intentional billing-ledger skip. The
  separately migrated billing baseline passes 1/1 after all current migrations
  apply to a synthetic database.
- **Interpretation:** This resolves the local serial qualification path and
  explains the prior parallel-run failures; it is not hosted/provider/
  production acceptance and does not close a backlog item or release gate.
- **Evidence:**
  `docs/shipping/evidence/qual-web-serial-postgres-suite-2026-10-07.md`.

## Web PostgreSQL suite isolation qualification · 2026-10-07

- **Evidence:** The aggregate full Web PostgreSQL run stalled and is not
  credited. Queue provider/worker-crash integration passes 7/7 in isolation;
  threshold-outbox and usage-ledger each pass 1/1 in isolation.
- **Limitation:** Running the two usage files concurrently against one test DB
  races on `pgcrypto` extension setup and leaves a worker unresolved. This is
  tracked as test-harness qualification debt, not silently converted to a
  product pass.
- **Boundary:** No production operation occurred; no acceptance checkbox or
  gate changed. See
  `docs/shipping/evidence/qual-web-db-suite-isolation-2026-10-07.md`.

## ACCEPT-002/003 latest-source substrate refresh · 2026-10-07

- **Sources:** Unreleased CLI `ad6ee1479c887c59eb6630da4754a2e0b7b4045e` and Web
  `cbc0f5a89179995569308695419d4578c57ce716` were passed explicitly to the
  private verifier.
- **Results:** CLI configured package suite 241/241; Web 888/916 with 28
  environment-gated skips and 0 failures; composed substrates 74/74. All
  commands exited 0 and output hashes are retained in the private JSON.
- **Controls:** Acceptance protocol and study-protocol integrity checks pass;
  external contact, participants, and Hunt adjudication remain explicitly
  open. The final corpus verifier was intentionally deferred until release-
  candidate freeze.
- **Audit note:** An earlier compatibility-root run at `b070942` enumerated
  34 tests and is excluded from latest-source acceptance evidence.
- **Boundary:** ACCEPT-002/003 remain open for complete hosted/provider/
  customer/reviewer evidence and the missing story coverage. See
  `docs/shipping/evidence/acceptance-stories-verification-2026-10-07.md`.

## QUAL-WEB-005 privacy/deletion/retention qualification · 2026-10-07

- **Verification:** On Web `main` `cbc0f5a`, an isolated Docker PostgreSQL
  run passed 46/46 focused tests with 0 failures and 0 skips. The suite covers
  deletion scope and legal-hold invariants, retention ceilings/warnings,
  hosted-record integrity, export-cursor bounds, and tenant isolation.
- **Boundary:** No source changed and no production operation occurred.
  QUAL-WEB-005 remains open for hosted deletion-worker execution,
  legal/customer-held-record decisions, consent/vendor inventory, and
  end-to-end deletion evidence. See
  `docs/shipping/evidence/qual-web-005-privacy-retention-2026-10-07.md`.

## QUAL-WEB-006 large-data qualification · 2026-10-07 · Web PR #150

- **Implementation:** Web `70680f8` extends the isolated monitoring repository
  integration fixture to 45 same-tenant components and 125 selected-component
  advisory matches. The assertions cover 20/20/5 pagination, 45 unique IDs,
  the bounded 100-row detail result with `matchesTruncated: true`, and a
  foreign-tenant component that remains inaccessible.
- **Verification:** The focused Docker PostgreSQL integration passes 1/1;
  dashboard tests pass 4/4; tenant/security tests pass 18/18; TypeScript,
  production build, Drizzle schema check, 29-migration ordering, and diff
  hygiene pass. Docker used a temporary synthetic `postgres:18-alpine`
  database and was stopped after the run.
- **Hosted state:** PR #150 is open and mergeable. Hosted run `37551537264`
  passed in 2m38s, including the full Verify job; Vercel, GitGuardian, and
  Preview Comments passed, and GitHub reports `CLEAN`. No merge or deployment
  occurred.
- **Boundary:** This does not close QUAL-WEB-006. Organization/Pro browser
  rendering, human screen-reader review, and field-CWV evidence remain open.
  No production/provider/payment/database/migration operation occurred.

## QUAL-WEB-006 authenticated dashboard continuation · 2026-10-07

- **Runtime evidence:** The authenticated Chrome session resolved
  `/account/dashboard` to `/account` with no console errors; the current
  account shell remained private and rendered without the previously recorded
  desktop/mobile overflow or keyboard defects.
- **Automated evidence:** Lighthouse snapshot results were 100/100/100 for
  accessibility/best-practices/SEO on both desktop and mobile. Agentic
  Browsing remained 50 because of the `llms.txt` audit, despite the public
  endpoint returning a valid H1. The fresh desktop trace measured LCP 689 ms,
  CLS 0.00, and TTFB 110 ms with no CrUX field data.
- **Checkout safety:** Local PR #149 execution with absent runtime secrets
  failed closed and made no payment request. The authenticated production tab
  still serves the legacy QR path; no payment or write was performed.
- **Acceptance boundary:** QUAL-WEB-006 remains open for organization/Pro and
  large-data evidence, human screen-reader review, and field CWV. See
  `docs/shipping/evidence/qual-web-006-dashboard-runtime-2026-10-07.md`.

## PLAN-CLI-004 compatibility PR #72 merged · 2026-10-07

- **Implementation:** CLI head `059918cf920d136ded4528ad7512b82026459ece`
  merged as `c1f1cd77468c28e85371b59fad297847ca5c5050` adds
  supported-entitlement compatibility coverage on top of the opaque
  catalog/cache implementation at `dacd286`.
- **Verification:** Existing branch evidence records full CLI tests, focused
  compatibility tests, typecheck, and build passing. Platform run
  `37550255842` and self-scan `37550255844` pass in-toto, self-scan, and all
  Ubuntu/macOS/Windows Node 20/22/24 cells. GitHub reported PR #72 `CLEAN`
  and mergeable before merge.
- **Boundary:** PLAN-CLI-004 remains unchecked pending hosted platform checks,
  deployed signer/catalog alignment, old-token migration evidence, and hosted
  activation integration. No production operation occurred.

## Hosted Razorpay checkout code-side evidence · 2026-10-07 · Web PR #149

- **Implementation:** `eb7e55a` adds catalog-gated hosted order creation,
  signed `order` commercial snapshots, provider-order binding, read-only
  owner-bound status, webhook-authoritative capture/failure processing, and a
  partial uniqueness index for successful order payments. QR creation requires
  an explicit `upi_qr` declaration and remains a separate adapter.
- **Verification:** Focused billing/route/webhook tests 19/19; configured Web
  suite 850/872/22/0; typecheck, production build, Drizzle check, 31 ordered
  migrations, Docker and Chrome prerequisites pass. GitGuardian,
  typecheck/schema, Vercel, and Preview Comments pass; GitHub reports the PR
  merge state `CLEAN`.
- **Acceptance boundary:** PLAN-WEB-013/014/015 remain open. No provider
  account capabilities, test payment, refund/renewal/replay/order evidence,
  production reconciliation, deployment, migration, or payment write was
  observed. Node 22 hosted evidence and private sandbox lifecycle evidence
  remain required.

## Release-artifact qualification · 2026-10-06 · merged CLI `dacd286`

- **Implementation boundary:** isolated qualification only; no public source
  change, publish, tag, deployment, production access, or customer operation.
- **Verification:** 20/20 release-script tests, 6/6 package contents and
  packed-manifest audits, public-boundary audit, exact `v2.0.0-alpha.1` tag
  match, six-archive clean consumer, and upgrade/rollback all pass. Hosted
  in-toto evidence remains green in run `37497389053`.
- **Open gate:** strict release verification rejects eight redistribution
  blockers: six BlueOak-1.0.0 packages, one nested-license conflict, and one
  missing source. QUAL-CLI-006 and DIST-001/003 remain unchecked; R-041 still
  blocks production access.

## Opaque entitlement catalog/cache · 2026-10-06 · CLI PR #71

- **Implementation:** CLI commits `937705b`, `fa4a131`, and `714cb3e`, merged as
  `dacd286`, carry the server-provided
  `catalog_version` through capability resolution, fails closed on malformed
  catalog metadata, and refuses stale cache reuse across founder simulation
  scopes. Frozen Web-shaped fixtures keep capability names and future fields
  opaque to the client.
- **Verification:** CLI package tests completed with zero failures; typecheck,
  build, and diff checks passed. Hosted run `37497389053` passed self-scan,
  in-toto, and all nine Ubuntu/macOS/Windows × Node 20/22/24 cells. Two
  earlier Windows teardown failures were corrected before this final run.
- **Boundary:** This does not close PLAN-CLI-001/004. Production signer/public
  pin alignment, tenant mapping, live issuance, and activation evidence remain
  open; R-041 still blocks production access.

## Hosted organization-policy authority · 2026-10-06 · Web PR #148

- **Implementation:** Web merge `cbc0f5a` adds additive SCM project binding,
  same-organization active-project validation, a license/tenant/repository-bound
  policy route, canonical policy-document validation, and a separate Ed25519
  organization-policy signer.
- **Verification:** Focused policy/SCM/tenant contracts 23/23; full Web
  868/846/22/0; typecheck, build, Drizzle, 29-migration ordering, hosted run
  `37493818464`, Vercel, GitGuardian, and Preview Comments pass.
- **Boundary:** No production signer/trust-root activation, policy inventory or
  rewrite, hosted fetch, production migration, or customer/provider operation.
  TEAM-CLI-001 and PLAN-CLI-001 remain open for activation and live evidence.

## Modified authenticated client boundary · 2026-10-06 · Web PR #147

- **Implementation:** Web commit `7248919` rejects forged tenant, plan,
  capability, usage, and record fields on the authenticated usage and receipt
  request paths before ledger access or persistence; the existing v2 token
  matrix binds claims to server-side license/tenant/catalog state.
- **Verification:** Local Web 865/843/22/0, disposable PostgreSQL receipt
  integration 1/1, typecheck, build, hosted run `37492088157` typecheck/schema,
  Vercel, GitGuardian, and Preview Comments all pass.
- **Boundary:** Code-side qualification only. PLAN-CLI-003 remains open for
  authenticated production probing and the remaining list/search/export/cache/
  public-private runtime matrix. No production or customer operation occurred.

## Hunt functional command boundary · 2026-10-06

- **Attempt:** A bounded local command was prototyped on CLI branch `feat/cli-hunt-execution-v1` from `67a132c`, but no commit was retained.
- **Finding:** Public CLI packaging cannot depend on private `@verglos/hunt`; the repository packer rejects private workspace dependencies. The previous unmerged candidate `0ee7348` has the same boundary defect and is not acceptance evidence.
- **Verification:** After removal, CLI typecheck, tests, build, public-boundary, and diff checks pass. Public pack was not credited because pnpm license-index metadata is missing locally.
- **Status:** HUNT-009 remains unchecked and the shell remains the truthful exit-78 alpha contract. No private implementation details, findings, or customer data entered the public repository.

## SCM/GitHub App · 2026-10-06 · Web PR #144

- **Implementation:** `src/lib/organizations/github-app-contract.ts`, additive
  migration `0026_github_app_identity.sql`, installation/check/webhook route
  integration, and tenant-scoped lifecycle/replay metadata.
- **Verification:** Focused GitHub/SCM tests 16/16; full Web suite 862/840/22/0;
  typecheck, build, Drizzle, migration ordering, public-boundary, SBOM, license,
  dependency audit, negative-boundary, and diff checks passed; hosted run
  `37486358263` and Vercel/GitGuardian checks are green.
- **Boundary:** The implementation is not live-provider or org-cutover proof.
  GITHUB-WEB-001..004, provider permission/token exchange, production changes,
  and acceptance remain open.

## Billing/Razorpay method truth · 2026-10-06 · Web PR #145

- **Implementation:** `src/lib/billing/payment-methods.ts`, checkout page/client,
  QR route selection, runtime-config validation, and `.env.example` contract.
- **Verification:** Focused tests 25/25; full Web 863/841/22/0; hosted run
  `37487362873` passed typecheck, tests, schema, build, dependency audit, SBOM,
  license, public-boundary, and secret checks.
- **Boundary:** PLAN-WEB-013 substrate only. Account-enabled methods,
  provider lifecycle matrix, and production reconciliation remain open under
  PLAN-WEB-014/015.

## Organization policy digest · 2026-10-06 · Web PR #146

- **Implementation:** Web PR #146 (`5763632`, merged as `88a7791`) adds explicit
  legacy and recursive canonical JSON digest algorithms, persists the algorithm
  with additive migration `0027_policy_digest_algorithm.sql`, and defaults new
  policy writes to `canonical-json-v1` while preserving legacy rows.
- **Verification:** Focused policy tests 13/13; full Web 864/842/22/0; 28
  ordered migrations; hosted Verify `37488304350`, Vercel, GitGuardian, build,
  dependency, SBOM, license, secret, boundary, and schema checks passed.
- **Boundary:** This is code-side R-042 alignment only. No production row
  rewrite, migration, hosted policy API activation, or PLAN-CLI-001 evidence
  occurred; TEAM-CLI-001 and final reconciliation/activation remain open.

## Acceptance · 2026-10-03 · ACCEPT-006/007 protocol freeze

- **Artifacts:** Private comprehension-test and Hunt-adjudication protocols with validators.
- **Verification:** `pnpm --silent acceptance:study-protocols:check` passed; the evidence bundle now hashes 12 documents and its secret scan passes.
- **Boundary:** No participant responses, 100-sample adjudication, or independent sign-off exists yet; ACCEPT-006 and ACCEPT-007 remain open.

## Acceptance · 2026-10-03 · ACCEPT-003 evidence bundle progress

- **Artifact:** Private `acceptance-evidence-bundle-2026-10-03.json` hashes ten bounded evidence documents.
- **Verification:** `pnpm --silent acceptance:evidence:bundle` passed its secret-like material scan and recorded six explicit open gates.
- **Boundary:** The bundle has no reviewer signature, provider capture, customer consent, browser-human, field-CWV, or account-deletion proof; ACCEPT-003 remains open until those required evidence fields are supplied.

## Acceptance · 2026-10-03 · ACCEPT-002 story map

- **Artifact:** Private `acceptance-story-map-2026-10-03.json` freezes twelve named story surfaces and their evidence/status.
- **Result:** Runner passed CLI 236/236, Web 877/905 with 28 environment skips, and composed substrates 72/72; all story statuses are emitted in the machine manifest.
- **Boundary:** This is explicit substrate mapping, not full external/hosted/customer acceptance. Open statuses remain visible for Hunt isolation, modified CLI runtime, Studio recipient, Enterprise provider, and account deletion.

## Acceptance · 2026-10-03 · ACCEPT-001 corpus freeze

- **Artifact:** Private ten-item corpus manifest `acceptance-corpus-verification-2026-10-03-v2.json`.
- **Result:** Six full non-shallow public repositories plus four exact-source contract artifacts; all six scans have complete coverage and all four artifact digests/byte counts match CLI `955412516`.
- **Boundary:** Public technical fixtures are not customers; no exploit, network callback, load test, customer consent, or external acceptance is claimed.

### ACCEPT-001 addendum

Private `ed2b826` adds two synthetic vulnerable fixtures (`internal-idor` and
`internal-agent-surface`) with explicit internal authorization and complete
current-source scans. The refreshed v3 manifest now covers twelve items and
closes the non-public-fixture requirement without introducing customer data.

## Acceptance · 2026-10-03 · ACCEPT-004 protocol freeze

- **Artifact:** Private `docs/shipping/acceptance/external-workflow-protocol.md` and `consent-record.template.md`.
- **Verification:** `pnpm --silent acceptance:protocol:check` passed; the validator checks recruitment, consent, exact-scope, data-handling, success, and downstream-gate markers.
- **Boundary:** No external contact, repository access, customer finding storage, or customer acceptance was performed. ACCEPT-005 onward remain open.

## Verification · 2026-10-03 · cross-repository acceptance rerun

- **Source:** CLI `955412516b96cc09393e78c43bf7d02b9abd05d9`; Web `763aab07a19f054dee41dc83ab9ec9f0743b4925`.
- **Result:** CLI 236/236 passed; Web 905 total / 877 passed / 28 environment-gated skips / 0 failures; composed Studio/Enterprise/Team/quality substrates 72/72 passed.
- **Boundary:** Substrate/regression evidence only. No hosted HTTP, provider, customer, reviewer, browser-human, field-CWV, migration, or production acceptance is claimed.

## Verification · 2026-10-03 · Web production build recheck

- **Source:** Web `main` at `763aab07a19f054dee41dc83ab9ec9f0743b4925`.
- **Result:** `pnpm build` passed: runtime-config prebuild check, Next.js compilation, type validation, 37 static pages, and route trace generation.
- **Boundary:** Local Node 26 emitted the repository's existing Node 22 engine warning. No deployment, migration, or production write occurred.

## Verification · 2026-10-03 · current Web regression recheck

- **Source:** Web `main` at `763aab0`.
- **Result:** Full configured suite 859 total / 837 passed / 22 environment-gated skips / 0 failures; SCM pretest slice 46 / 40 / 6 / 0; typecheck, Drizzle schema check, and 24-migration ordering check passed.
- **Boundary:** Regression evidence only; no production database write, migration, deployment, account deletion, provider lifecycle, or human/browser acceptance is inferred.

## Verification · 2026-10-03 · public production Lighthouse lab pass

- **Targets:** `https://verglos.com/`, `/checkout`, `/detectors`, and `/docs`; read-only deployed responses.
- **Result:** Accessibility 97–100 and Best Practices 100 across all four targets. Performance was 100/78/84/81 respectively; observed LCP was 1.3/4.3/4.0/4.4 seconds and CLS was 0 on every target.
- **Boundary:** Lab data is not field CWV, authenticated dashboard evidence, or human screen-reader review. Checkout exposed only the verified Pro INR monthly/annual offers while signed out; no Team/Studio/Enterprise purchase capability is claimed.
- **Additional smoke:** Unauthenticated probes of `/orgs/demo`, `/orgs/demo/home`, and `/orgs/demo/releases` returned HTTP 404 with Clerk signed-out protection headers, so guessed organization slugs are not disclosed. This does not replace an authenticated member-dashboard run.

## Verification · 2026-10-03 · current-source cross-platform matrix

- **Run:** GitHub Actions platform matrix `37110048279`, exact CLI `origin/main` head `c17b335f2bfac6d9d63e6a8031f4c19811306296`.
- **Result:** Official in-toto release binding plus all nine Ubuntu/macOS/Windows × Node 20/22/24 cells passed. Each cell completed current-source build, public archive clean consumer, published `1.8.3` → current `2.0.0-alpha.1` → published `1.8.3` transition, typecheck, and tests.
- **Boundary:** Cross-platform qualification is now evidenced on hosted runners. This does not prove trusted keyless Sigstore/Fulcio/Rekor release identity, legal authorization, protected npm publishing, or GA release.

## Verification · 2026-10-03 · hosted current-source public-pack qualification

- **Run:** GitHub Actions Self-scan `37109797227`, exact `origin/main` head `c17b335f2bfac6d9d63e6a8031f4c19811306296`.
- **Result:** Complete hosted job passed: lockfile license inventory, third-party notices, CycloneDX/SPDX drift, build, six public archive packing, clean consumer installation, test suite, pinned Hunt Docker adversarial suite, release-artifact verifier, typecheck, package/public-boundary audits, and self-scan.
- **Boundary:** This supplies hosted Linux artifact evidence and supersedes the local macOS optional-package limitation for that run. It does not authorize npm publication, trusted keyless provenance, legal clearance, or GA release; those gates remain open.

## Verification · 2026-10-03 · current CLI public-pack qualification

- **Source:** CLI `origin/main` at `c17b335`, clean read-only worktree.
- **Result:** package-surface checks passed 6/7. The pack/clean-public-pack test and `pack-public-packages.mjs` both fail closed before archive creation because the macOS install lacks metadata for foreign-platform optional lockfile packages (`@esbuild/*`); the license inventory requires every lockfile package to be represented. Re-running with pinned pnpm `9.15.9` reproduced the same failure. No archive was treated as valid.
- **Boundary:** This is a platform qualification blocker for DIST-001/003 and LIC-003, not a code or license bypass. The hosted OS matrix remains the authoritative route for cross-platform installation evidence; no public package or release was published.

## Verification · 2026-10-03 · current Web main regression pass

- **Source:** Web `main` at `763aab0` (SCM scheduled reconciliation merge).
- **Verification:** `pnpm test` completed with 859 total / 837 passed / 22 environment-gated skips / 0 failures. The registered SCM pretest slice completed 46 total / 40 passed / 6 skips / 0 failures. Earlier same-session `pnpm typecheck`, `pnpm db:check`, `pnpm db:migrations:check` (24 ordered migrations), and `git diff --check` were also successful.
- **Boundary:** This is regression evidence only. It does not close live billing, provider cutover, production migration, human accessibility, field-CWV, customer-consent, or independent-review gates.

## Verification · 2026-10-03 · current CLI source baseline

- **Source:** read-only worktree of public CLI `origin/main` at `c17b335` (package version `2.0.0-alpha.1`); no edits or reset to the founder checkout.
- **Verification:** after a clean `pnpm install --frozen-lockfile`, `pnpm typecheck`, `pnpm build`, and `pnpm --filter @verglos/shared test` passed. The install-matrix suite reported 26/26 checks after build. The pre-build run correctly failed on the absent generated CLI `dist/index.js`; it was not counted as product evidence.
- **Boundary:** This verifies current source contracts only. It does not constitute release, trusted publishing, Hunt isolation, independent review, or production acceptance; the old published `1.8.3` remains only a compatibility-matrix baseline.

## Progress · 2026-10-03 · LIC-002 pinned external-engine record

- **Artifact:** Private `docs/shipping/legal/external-engines-and-standards-2026-10-03.md`, committed as `aa07dbf`.
- **Coverage:** Records pinned Trivy image/version/digest and Apache texts, the explicit-path detect-secrets boundary, Sigstore package/fixture provenance, in-toto license split, standards non-vendoring, and fixture/premium-content restrictions.
- **Boundary:** This is technical provenance, not legal approval or redistribution clearance. Immutable executable selection, image/database/signature review, premium recipe rights, trademark review, and independent review remain open; LIC-002 stays unchecked. No public repository, package, production database, or deployment changed.

## Progress · 2026-10-03 · TEAM-WEB-006 persistence and enqueue
- **Implementation:** Web PR #132 merged as `049f8ba`.
- **Behavior:** Additive `0021` stores tenant-bound installation identities and redacted check deliveries; encrypted webhook secrets never enter response projections; authorized routes cap raw bodies, enforce digest idempotency, and enqueue through the existing outbox.
- **Verification:** Focused route/provider/credential/tenant tests 25/25; full Web suite 859 total / 837 passed / 22 skipped / 0 failed; typecheck, Drizzle check, migration ordering, hosted schema/typecheck, GitGuardian, Vercel, and preview checks passed.
- **Boundary:** No production migration/write. Webhook event routes, provider delivery worker, durable retry/reconciliation, and live provider evidence remain open.

## Progress · 2026-10-03 · TEAM-WEB-006 test registration
- **Implementation:** Web PR #131 merged as `eadc5ac`.
- **Verification:** Provider tests are registered in `pretest`; focused configured slice passes 28/28 with 6 environment-gated skips; full Web suite passes 859 total / 837 passed / 22 skipped / 0 failed.
- **Boundary:** Registration correction does not add persistence, routes, retries, reconciliation, or live provider evidence. No production operation occurred.

## Progress · 2026-10-03 · TEAM-WEB-006 provider transport
- **Implementation:** Web PR #130 merged as `27cd6c7`.
- **Behavior:** Pure provider adapter builds GitHub Checks and GitLab commit-status requests from the redacted check contract; validates token/repository/commit boundaries, maps terminal decisions, and classifies retryable responses without returning response bodies.
- **Verification:** Focused tests 5/5; local typecheck/diff; hosted type/schema, GitGuardian, Vercel, and preview checks passed.
- **Boundary:** Persistence, webhook routes, durable retries, response reconciliation, and live provider evidence remain open. No production operation occurred.

## Progress · 2026-10-03 · TEAM-CLI-002 CI check payload
- **Implementation:** CLI PR #56 merged as `c17b335`.
- **Behavior:** `composeCiCheckPayload` validates a Release Decision and emits a bounded source-free payload containing exact subject, decision, policy identity/digest, record URL/manifest digest, and commit identity; `decideCiCheckDelivery` suppresses identical replays.
- **Verification:** Focused tests 3/3; shared package typecheck/build; hosted Ubuntu/macOS/Windows × Node 20/22/24, self-scan, and in-toto binding passed.
- **Boundary:** TEAM-CLI-002 remains open pending organization-policy authority/cache, CLI command integration, and hosted SCM/provider evidence. No production operation occurred.

## Progress · 2026-10-03 · TEAM-WEB-006 SCM check contract
- **Implementation:** Web PR #129 merged as `b2352c6` from `feat/web-team-scm-check-contract`.
- **Behavior:** Pure contract validates GitHub/GitLab installation identities, verifies raw webhook material, rejects cross-tenant installation binding, and emits bounded redacted check payloads with deterministic external identity and payload-digest idempotency.
- **Verification:** Focused tests 4/4; configured Web suite 859 total / 837 passed / 22 environment-gated skips; typecheck, hosted type/schema, GitGuardian, Vercel, preview, and diff checks passed.
- **Boundary:** TEAM-WEB-006 remains open pending provider adapters, persistence, HTTP routes, retry delivery, and live GitHub/GitLab webhook evidence. No production operation occurred.

## Evidence · 2026-10-02 · Public route accessibility/lab sweep
- Existing Chrome CDP session inspected five public routes in a temporary same-browser tab.
- Every route exposed one `main` landmark and no horizontal overflow; AX roles, node counts, focusables, and DOMContentLoaded deltas are recorded privately.
- This strengthens QUAL-WEB-006 lab evidence but does not substitute for field CWV or human screen-reader review.

## Evidence · 2026-10-07 · Authenticated account accessibility/performance follow-up

- Existing Chrome DevTools page 13 reloaded the authenticated `/account` route
  read-only. The snapshot exposed one `main` and one `nav` landmark, seven
  links, no unlabeled controls, no tables, and no console errors/warnings.
- Unthrottled lab trace: LCP 819 ms, TTFB 80 ms, render delay 740 ms, CLS
  0.00; no CrUX field data was available. Mobile and desktop Lighthouse both
  reported Accessibility 100 and Best Practices 100.
- The page still rendered only the Free-plan Pro fence. This strengthens
  browser/lab evidence but does not prove Pro/org dashboard rendering, human
  screen-reader review, large-data browser behavior, or field CWV. QUAL-WEB-006
  remains open. No production operation occurred.
- Private evidence:
  `docs/shipping/evidence/qual-web-006-authenticated-account-performance-2026-10-07.md`.

## Progress · 2026-10-07 · PLAN-WEB-013 hosted payment route hardening

- Web PR #149 exact head `0a765c9` adds same-origin checks before auth or
  provider/database side effects for hosted order and optional QR creation.
- Focused tests passed 40/40; typecheck, Drizzle check, 31-migration ordering,
  preview-semantics build, hosted Verify `37556130789`, Vercel, GitGuardian,
  and Preview Comments passed. GitHub reports PR #149 CLEAN.
- This changes no backlog checkbox. It does not establish provider-enabled
  methods or test-mode lifecycle evidence; PLAN-WEB-013/014/015 remain open.
  No production operation occurred.
- Private evidence:
  `docs/shipping/evidence/plan-web-013-payment-route-csrf-2026-10-07.md`.

## Progress · 2026-10-02 · current CLI fixture boundary clarification

The current-source Juice Shop scan's three redacted `~/.cursor/mcp.json` findings are
expected global agent-surface scope, covered by isolated detector tests, not an unbounded
read of the fixture. The exact scan report and hashes are in the private evidence file.
The focused agent-surface contract cases pass 12/12, including global-home discovery and
portable path redaction.

## Evidence · 2026-10-02 · Hunt review packet

- Private packet prepared with exact implementation head, hosted run/artifact, pinned image digests, threat model, reproduction commands, limitations, and sign-off fields.
- The packet is review-ready but intentionally unsigned; independent review remains an external gate.

## Evidence · 2026-10-02 · Authenticated account accessibility tree

- Existing authenticated Chrome session was inspected read-only through CDP on `/account`.
- One `main`, navigation, heading, alert, seven focusables, no horizontal overflow, and 65 AX nodes were observed.
- `GET /api/v1/organizations` returned zero organizations; no production write occurred.
- This is automated account-route evidence only; human screen-reader and organization-dashboard evidence remain open.

## Acceptance · 2026-10-02 · RECORD-010 legacy compatibility

- **CLI evidence:** Current `attest-options.test.ts` + `local-command-options.test.ts` pass 7/7; retired shell returns bounded `LEGACY_ATTEST_RETIRED`, performs no signing/publication, and does not echo customer paths or URLs.
- **Web evidence:** Retired `POST /api/v1/attest`, legacy hash lookup, and `/verify` truth regression pass 3/3; hosted run `36986357199` is green; production `/verify` smoke confirms the corrected public boundary.
- **Decision:** Accepted. Legacy links remain compatible and unsigned; canonical records use offline `record create/sign/verify`. No production/database write occurred.

## Verification · 2026-10-02 · Legacy verify production smoke

- **Deployment:** Vercel production deployment `verglos-5vy0enlkd-anuragyadav20062002s-projects.vercel.app` reached READY after Web PR #128 merge.
- **Smoke:** `https://verglos.com/verify` contains “Legacy summary lookup” and `verglos record verify`; the retired counters and publish language are absent.
- **Boundary:** Read-only HTTP smoke only; no payment, database, migration, or manual production write occurred.

## Progress · 2026-10-02 · Legacy verify truth correction

- **Implementation:** Web PR #128 head `03304c0`, merged as `fc552038c70a12a056103905753a9d744e2bd95b`.
- **Behavior:** `/verify` is now a non-counting legacy-summary explanation; it does not present historical rows as signed usage evidence or advertise the retired publish path. Existing `/verify/<hash>` compatibility pages remain explicitly unsigned.
- **Verification:** Hosted Verify `36986357199` passed the full configured Web gate, Vercel Preview, and the new source-level truth regression. RECORD-010 remains open for final cross-repository compatibility/truth reconciliation.

## Progress · 2026-10-02 · Organization dashboard accessibility shell

- **Implementation:** Web PR #127 head `d92aba3`, merged as `cdc1fffc8afa06dbce7a67f5d10dd31d66307af3`.
- **Behavior:** Authenticated organization dashboard chrome now exposes skip-to-main navigation, named workspace and organization-navigation landmarks, keyboard-visible focus, higher-contrast sidebar labels, mobile layout at narrow widths, and reduced-motion handling.
- **Verification:** Hosted Verify run `36985775429` passed the full configured Web gate and Vercel Preview. This is implementation progress, not QUAL-WEB-006 acceptance: authenticated runtime, human screen-reader, large-dataset, and field-CWV evidence remain open.

## Verification · 2026-10-02 · Authoritative hosted Linux Hunt run

- **Run:** GitHub Actions manual `main` self-scan `36984993552`, exact merge head `b781bc41539df3870769996426c03e9209a08ab7`.
- **Result:** Complete self-scan passed. The pinned `postgres:15-alpine` Hunt Docker suite passed with zero failures; the Linux PID/IPC namespace-private assertion passed on `ubuntu-latest`.
- **Boundary:** This closes the Linux namespace evidence gap, but HUNT-011 and QUAL-CLI-004 remain unchecked for recipe execution/provenance and independent review.

## Verification · 2026-10-02 · Hunt Docker adversarial runtime revalidation

- **Run:** CLI Hunt package tests with `VERGLOS_HUNT_DOCKER_INTEGRATION=1` against pinned `alpine@sha256:d9e853e87e55526f6b2917df91a2115c36dd7c696a35be12163d44e6e2a4b6bc` on Docker Desktop Server 29.7.2.
- **Result:** 55/56 passed with zero failures. Fifteen Docker runtime adversarial checks passed: privilege, filesystem, network, socket/device, no-new-privileges, redaction, output/time/CPU/process/disk/memory bounds, and signal classification. One PID/IPC namespace comparison was skipped because the host is macOS.
- **Boundary:** HUNT-011 and QUAL-CLI-004 remain unchecked pending Linux namespace evidence, recipe execution/provenance, and independent review. No production operation occurred.

## Progress · 2026-10-02 · QUAL-WEB-006 authenticated account evidence (Web PR #126)

- **Implementation:** Web `f66d32b`, merged as `89056c3`, raises the `/account` signed-in label contrast without changing product copy or layout.
- **Evidence:** Local typecheck and configured tests pass (836 runnable / 22 environment-gated skips); hosted type/schema, GitGuardian, and Vercel pass. Existing authenticated Chrome production Lighthouse reports Accessibility 100 and Best Practices 100 on desktop and mobile. Desktop performance trace reports LCP 551ms and CLS 0.00.
- **Boundary:** QUAL-WEB-006 remains unchecked for organization-dashboard, screen-reader, reduced-motion, large-dataset, and complete field-CWV evidence. No production operation occurred.

## Verification · 2026-10-02 · Hunt sandbox suite recheck

- **Run:** `pnpm --filter @verglos/hunt test` on CLI `feat/cli-qual-006-cross-platform-consumer` at `e63b504`.
- **Result:** 40 contract/unit tests passed with 0 failures. Sixteen Docker runtime adversarial cases were environment-gated because Docker Desktop/socket access is unavailable on this host; the direct Docker invocation failed with permission denied before execution.
- **Boundary:** This does not qualify Linux namespace/runtime isolation, HUNT-011, QUAL-CLI-004, or independent security review. No checkbox changed and no production operation occurred.

## Progress · 2026-10-02 · FINAL-WEB-001 truth-registry guard (Web PR #101)

- **Implementation:** PR #101 was reconciled with current `main` in commit `662f91b`, then merged as `c3e6668ec87ef386e33462e815877e640004fc16`.
- **Evidence:** Hosted Verify run `36972830161` passed typecheck, full tests, negative-boundary tests, the dedicated truth-registry suite, schema/migration checks, build, public-boundary, dependency, SBOM/license, and secret checks. The merge adds no public copy or claim changes.
- **Boundary:** FINAL-WEB-001 remains open. The pure guard is not the public claim map, final truth sweep, or release authorization; ACCEPT-009/010 and founder command remain required. No production operation occurred.

## Progress · 2026-09-30 · QUAL-WEB-006 public accessibility remediation (Web PR #102)

- **Implementation:** Web PR #102 tested head `a69e50da3827081c3ab23a8d943017ae26f82e0a`, merged as `f138e24bf85de7527a8d3896897bd1aa26fecbe0`.
- **Evidence:** Hosted Verify run `36685565094`, GitGuardian, and Vercel passed. The patch raises low-contrast public text, uses theme-aware button text, adds keyboard focus to horizontally scrollable tables/code examples, and preserves existing copy, prices, and product states.
- **Boundary:** QUAL-WEB-006 remains unchecked. Authenticated-dashboard, screen-reader, responsive, large-dataset, and complete Core Web Vitals evidence remain open. No production operation occurred.

## Acceptance · 2026-09-30 · QUAL-WEB-001 complete negative authorization suite (Web PR #121)

- **Implementation:** Follow-up commits `d940136` and `e0fe054` on the runtime-data qualification branch, merged as `a88495151f43d1a6addc16a88427288cb2d1458e` in PR #121.
- **Evidence:** The shared negative-boundary matrix now includes the authenticated organization search route, and hosted Verify run `36760390332` executes `pnpm test:negative-boundary` in addition to the full test suite, typecheck, schema/migration checks, build, public-boundary, dependency, SBOM/license, and secret checks. All hosted steps completed successfully. Existing Docker-backed list/search/export/public-private integrations and modified-CLI authority tests complete the acceptance boundary.
- **Acceptance:** QUAL-WEB-001 is accepted. The suite covers role/action authorization, guessed and malformed IDs, forged client/query authority, tenant-scoped list/search/export runtime, cache boundaries, public/private receipt behavior, and current CLI request behavior. No production operation occurred.

## Progress · 2026-09-30 · QUAL-WEB-001 distinct search runtime (Web PR #120)

- **Implementation:** Web `9ecd0092e202a65549e4a53b0f0cbbb58e144957`, merged as `677a78afd27435c57c498fe8bd8b4e9013096642`.
- **Evidence:** The real organization search handler runs against disposable PostgreSQL for two tenants. Forged query authority fields are ignored, tenant A cannot search tenant B's release, wildcard input is rejected, and the response is `private, no-store`; focused Docker run passes 1/1. Full configured Web suite is 836 passed / 22 environment-gated skips; typecheck, build, schema, migration ordering, negative-boundary, and production audit checks pass. Hosted run `36744036519` is green.
- **Boundary:** This is progress only. QUAL-WEB-001 remains unchecked because distinct export semantics and the complete hosted/provider-backed list/search/export/public-private matrix are still missing. No production operation occurred.

## Verification follow-up · 2026-09-30 · Web PostgreSQL contention isolation

- **Evidence:** Fresh disposable PostgreSQL 15 container, sequential focused runs: worker-crash recovery 2/2, usage ledger 1/1, threshold outbox 1/1; total 4/4 with zero failures. The prior local all-in-one failure was concurrent extension/deadlock contention; hosted PR #119 remains green.
- **Boundary:** No implementation or checkbox changed. This narrows the local failure to shared-test-database concurrency and does not replace hosted or full-suite evidence. No production operation occurred.

## Progress · 2026-09-30 · QUAL-WEB-001 direct tenant data-route runtime (Web PR #119)

- **Implementation:** Web `87f424cbfd93bd3d54232a66a29664c517b4d514`, merged as `1834f442086ab79862eb62984bc4111def3ad923`.
- **Evidence:** Focused Docker PostgreSQL runtime test passes 1/1. Evidence and policy-evaluation list/create handlers ignore forged query authority, bind inserts to the authorized tenant/project, exclude the other tenant, and emit `private, no-store`. Hosted run `36741825859` passes the complete configured verification workflow.
- **Boundary:** No checkbox changed. QUAL-WEB-001 still lacks distinct search/export route semantics and complete public/private/list/search/export runtime coverage. A local concurrent all-suite attempt hit existing pgcrypto/deadlock contention; hosted CI is the authoritative green run. No production operation occurred.

## Progress · 2026-09-30 · QUAL-CLI-006 current-source in-toto archive binding (CLI PR #51)

- **Implementation:** CLI `e63b5041727a175da1d770012cb945a061f05324`, rebased onto current main `f16c6f1`, merged as `353787539451e918dcda088ff6cbbd497ae1c631`.
- **Evidence:** The workflow packs six current source archives and verifies their exact SHA-256 products with official `in-toto==3.0.0`. Hosted run `36720267628` passes the in-toto job and all nine Ubuntu/macOS/Windows × Node 20/22/24 cells; self-scan `36720267470` passes. Local typecheck/build/contract/verifier checks pass.
- **Boundary:** No checkbox changed. `2.0.0-alpha.1` remains unreleased; trusted keyless Sigstore/Fulcio/Rekor, final release identity, licensing, and publish authorization evidence are still absent. No production operation occurred.

## Progress · 2026-09-30 · QUAL-WEB-001 tenant release runtime (Web PR #118)

- **Implementation:** Web `d0df2ee`, merged as `b0663e35` in PR #118, extends the isolated PostgreSQL tenant fixture with real release-list and release-detail route invocations.
- **Evidence:** Disposable Docker PostgreSQL run passes 2/2 with zero skips; forged organization/project query fields are ignored, tenant A receives only its release and subject, and both real responses are `private, no-store`. Hosted run `36717893114`, GitGuardian, and Vercel pass.
- **Boundary:** No checkbox changed. QUAL-WEB-001 still lacks a distinct search handler and hosted/provider-backed list/search/export plus complete public-private runtime evidence. No production operation occurred.

## Progress · 2026-09-30 · QUAL-WEB-001 public receipt runtime (Web PR #117)

- **Implementation:** Web `1b39c09`, merged as `d8c7edf0` in PR #117, adds a production-disabled AsyncLocalStorage database provider seam and uses it only in the isolated receipt integration.
- **Evidence:** Docker PostgreSQL focused run passes 2/2 with zero skips. The real public receipt handler ignores forged tenant/project query fields, returns `no-store`, and verifies the digest; private list/detail/download assertions remain active. Hosted run `36716982904`, GitGuardian, and Vercel pass.
- **Boundary:** No checkbox changed. QUAL-WEB-001 still lacks a distinct search handler and hosted/provider-backed list/search/export plus complete public-private runtime evidence. No production operation occurred.

## Progress · 2026-09-30 · QUAL-WEB-001 authorized tenant list runtime (Web PR #116)

- **Implementation:** Web `95ebce4`, merged as `d230af0f` in PR #116, invokes the real organization project-list GET handler through the authorization provider for two isolated tenants and includes forged query authority fields.
- **Evidence:** Docker PostgreSQL focused run passes 2/2 with zero skips (project list plus receipt list/detail/download); project responses contain only the requested tenant's rows, preserve the server-derived organization identity, and return `private, no-store`. Hosted run `36716252644` and GitGuardian/Vercel pass.
- **Boundary:** No checkbox changed. QUAL-WEB-001 still lacks a distinct search handler and hosted/provider-backed list/search/export plus complete public-private runtime evidence. No production operation occurred.

## Progress · 2026-09-30 · QUAL-WEB-001 receipt list/detail/export runtime

- **Evidence:** `verglos-web/src/lib/organizations/record-receipt-route.integration.test.ts` passed 1/1 against disposable Docker PostgreSQL with no skip.
- **Boundary proven:** tenant-isolated list A/B, authorized detail verification, private download/export projection, idempotency/conflict/strict projection, and omission of signer identity/raw source.
- **Boundary remaining:** no distinct search handler exists; hosted/provider-backed runtime and complete public/private matrix remain open. No checkbox changed.

## Progress · 2026-09-30 · QUAL-WEB-001 modified-CLI entitlement request

- **Implementation:** Web `b3dfd77`, merged as `4d2051e4` in PR #115, extends the forged entitlement request with CLI-style headers and organization/license/role authority fields.
- **Evidence:** Server-derived tenant, role, plan, and allowances remain authoritative; focused route/boundary suite passes 10/10. Hosted run `36705118215`, GitGuardian, and Vercel pass.
- **Boundary:** This closes no checkbox. QUAL-WEB-001 still requires complete list/search/export/public-private runtime evidence. No production operation occurred.

## Progress · 2026-09-30 · QUAL-WEB-001 forged query authority fields

- **Implementation:** Web `f79a7a5`, merged as `88a809d3` in PR #114, adds attacker-controlled tenant/project/plan/allowance query fields to every protected route matrix request.
- **Evidence:** Existing path-authorization and non-cacheable denial assertions continue to pass in the 4/4 boundary suite; hosted run `36704670862`, GitGuardian, and Vercel pass.
- **Boundary:** This closes no checkbox. QUAL-WEB-001 still requires complete modified-CLI and direct list/search/export/public-private runtime evidence. No production operation occurred.

## Progress · 2026-09-30 · QUAL-WEB-001 public receipt authority boundary

- **Implementation:** Web `39dfb64`, merged as `24232db2` in PR #113, invokes the public receipt JSON route with invalid identity and forged tenant/project query parameters.
- **Evidence:** Combined private denial/public receipt boundary tests pass 4/4; public invalid-path responses remain `no-store` and do not reflect forged authority fields. Hosted run `36704251024`, GitGuardian, and Vercel pass.
- **Boundary:** This closes no checkbox. QUAL-WEB-001 still requires complete modified-CLI and direct list/search/export/public-private runtime evidence. No production operation occurred.

## Progress · 2026-09-30 · QUAL-WEB-001 runtime denial cache matrix

- **Implementation:** Web `4548734`, merged as `517df10c` in PR #112, extends the existing protected-route matrix with real handler calls for every organization API method and forged request-body authority fields.
- **Evidence:** Focused negative-boundary suite passes 2/2; denial responses assert `no-store` or `private, no-store`. Hosted run `36703830835`, GitGuardian, and Vercel pass.
- **Boundary:** This closes no checkbox. QUAL-WEB-001 still requires complete modified-CLI and direct list/search/export/public-private runtime evidence. No production operation occurred.

## Progress · 2026-09-30 · QUAL-CLI-006 official in-toto layout/link smoke

- **Evidence:** Docker `python:3.12-slim` installed official `in-toto==3.0.0`; an ephemeral Ed25519 key signed a synthetic root layout and `build` link, and `in-toto-verify --verification-keys` returned success.
- **Boundary:** This proves the official verifier can consume a valid layout/link pair, not release provenance. It uses synthetic data and an ephemeral key; trusted keyless Sigstore/Fulcio/Rekor evidence and actual release-pipeline binding remain open. QUAL-CLI-006 stays unchecked.

## Progress · 2026-09-30 · PLAN-CLI-004 compatibility fixtures

- **Implementation:** CLI `9ff21be`, merged as `f16c6f1` in PR #50, adds frozen server-shaped plan/catalog fixtures for Free, Pro, Team, Studio, and Enterprise plus malformed-payload fail-closed cases. Capability and allowance keys remain opaque to the client.
- **Evidence:** Full local CLI test suite, typecheck, and build pass. Hosted platform run `36700076759` passes all nine Ubuntu/macOS/Windows × Node 20/22/24 cells; self-scan `36700077215` passes.
- **Boundary:** This is PLAN-CLI-004 progress only. The item remains unchecked pending deployed signer/catalog alignment, old-token migration evidence across supported versions, and hosted activation integration. No production operation occurred.

## Progress · 2026-09-30 · QUAL-WEB-001 private account/API cache boundaries

- **Implementation:** Web `f524382`, merged as `c83300b` in PR #111, adds private no-store response headers to authenticated account sync, CLI-auth, license, score-history, and monitor routes and to shared paid-license denials.
- **Evidence:** Combined focused tenant/monitor contract suites pass 17/17 locally; hosted run `36693118104` passes the full verification workflow, GitGuardian, and Vercel.
- **Boundary:** This closes no checkbox. QUAL-WEB-001 still requires modified/untrusted CLI and direct runtime list/search/export/public-private evidence. No production operation occurred.

## Progress · 2026-09-30 · QUAL-WEB-001 organization API cache boundaries

- **Implementation:** Web `f60a403`, merged as `18ddb408` in PR #110, adds private no-store response helpers to organization directory, member, project, policy, and release APIs and inventories every authenticated organization route in the tenant-scope contract suite.
- **Evidence:** Tenant-scope contract tests pass 13/13 locally; hosted run `36692358099` passes the full verification workflow, GitGuardian, and Vercel.
- **Boundary:** This closes no checkbox. QUAL-WEB-001 still requires modified/untrusted CLI and direct list/search/export/runtime public-private matrix evidence. No production operation occurred.

## Progress · 2026-09-30 · QUAL-WEB-001 private evidence/evaluation cache boundary

- **Implementation:** Web `8a77d2a`, merged as `7279ef2` in PR #108, adds private no-store response helpers to evidence and policy-evaluation list/create routes and covers all data-bearing and denial paths.
- **Evidence:** Tenant-scope contract tests pass 12/12 locally; hosted run `36691398858` passes the full verification workflow, GitGuardian, and Vercel.
- **Boundary:** This closes no checkbox. QUAL-WEB-001 still requires modified/untrusted CLI and complete list/search/export/cache/public/private evidence. No production operation occurred.

## Progress · 2026-09-30 · QUAL-WEB-001 private receipt cache boundary

- **Implementation:** Web `27e972c`, merged as `6cb6734` in PR #105, adds a no-store response helper to private receipt collection/detail routes and binds all error/success paths to private cache headers.
- **Evidence:** Tenant-scope contract tests pass 11/11 and hosted run `36690136102` is green. Public receipt behavior remains non-cacheable; private download headers remain explicit.
- **Boundary:** This fixes one privacy boundary but closes no checkbox. QUAL-WEB-001 still requires the complete modified-CLI and list/search/export/cache/public/private matrix. No production operation occurred.

## Progress · 2026-09-30 · QUAL-WEB-001 modified-client entitlement boundary

- **Implementation:** Web `3bd02da`, merged as `98169fa` in PR #104, extends the v2 entitlement route contract suite with forged-client authority fields.
- **Evidence:** forged plan/tier, tenant, capabilities, allowances, usage, and record payload fields are ignored; the issued claims remain bound to the server license, tenant resolver, role, and catalog. Focused route tests pass 6/6 and hosted run `36689496063` is green.
- **Boundary:** This is progress only. QUAL-WEB-001 still requires the complete request matrix and list/search/export/cache/public/private evidence. No production operation occurred.

## Progress · 2026-09-30 · QUAL-WEB-001 malformed-route boundaries

- **Implementation:** Web `66c1f94`, merged as `0a85f08` in PR #103, adds `src/lib/organizations/negative-boundary.test.ts` and a targeted `test:negative-boundary` script.
- **Evidence:** Every protected organization API method is exercised with malformed, traversal-shaped, and zero-UUID organization identifiers. The route layer either rejects malformed IDs before authorization or returns a fixed non-enumerating denial; attacker-controlled IDs are never echoed and authorization runs exactly once before any data-bearing path. Hosted run `36686440312` passed the full Web workflow.
- **Boundary:** This closes no checkbox. QUAL-WEB-001 still requires modified/untrusted CLI and complete list/search/export/cache/public/private evidence. No production operation occurred.

## Progress · 2026-09-30 · QUAL-WEB-001 + QUAL-WEB-005 + QUAL-WEB-006 substrate

- **Implementation:** Web `82d2157` + `a24fef7` on `feat/web-qual-batch`; PR #100 merged as `666317e` after hosted checks passed.
- **Evidence:** `src/lib/qual/qual-web-suites.ts` provides pure authorization-coverage, privacy-deletion, and accessibility/performance decision surfaces. Its focused suite passes 18/18; the exact branch's configured full suite passes 830/852 with 22 environment-gated skips; typecheck and optimized build pass. The follow-up fails closed on empty, non-finite, and negative performance measurements.
- **Boundary:** this is preparatory qualification logic, not route, persistence, browser, provider, or hosted acceptance. QUAL-WEB-001/005/006 remain open; no checkbox changed and no production operation occurred.

## Acceptance · 2026-09-24 · PRO-005 (Web PR #68)

- **Implementation:** Web `0b4da64` plus deterministic-test correction `5dd54a8`, merged as `c54f19a`.
- **Evidence:** tenant-scoped released inventory, registration completed/successful state, advisory freshness/matches, retry/dead-letter failures, and explicit-only affected-release linkage. Hosted PostgreSQL proves the aggregate query and foreign-tenant exclusion.
- **Authoritative result:** **185 checked / 84 unchecked / 269 total**. PRO-006 through PRO-010 remain open; no production monitoring success or customer usage is inferred.

## Acceptance · 2026-09-24 · PRO-004 (Web PR #67)

- **Implementation:** Web `1ecf1c4` plus PostgreSQL fixture `9ec9108`, merged as `036ae3b`.
- **Evidence:** tenant-scoped canonical finding groups, bounded detail/metadata projection, exact subject and producer/run/release lineage, explicit-only Hunt eligibility, and fail-closed detail selection. Hosted PostgreSQL executes and verifies the repository's grouping and foreign-tenant exclusion path.
- **Authoritative result:** **184 checked / 85 unchecked / 269 total**. PRO-005 through PRO-010 remain open; no claim of production dashboard usage or final V1 acceptance is made.

## Acceptance/reconciliation · 2026-09-24 · Web PRs #50–66, through PRO-003

- **Authoritative result:** the backlog now records **183 checked / 86 unchecked / 269 total**. This catch-up closes the traceability-document lag without changing any earlier acceptance decision.
- **PR #50–59 chain:** PLAN-WEB-005/006, PLAN-WEB-007/008, HOSTED-013 production execution/reconciliation, OPS-015, DIST-WEB-003, QUAL-WEB-004, QUAL-WEB-003, PLAN-WEB-004, and PLAN-WEB-009/010 are accepted; PR #52 was progress later superseded by PR #57. Exact evidence is retained in the corresponding backlog entries and STATUS batches.
- **PR #60–63 chain:** TEAM-WEB-001 invitation substrate in PR #60 was progress and its route/audit completion in PR #61 is accepted; TEAM-WEB-002 is accepted at PR #62; TEAM-WEB-003 PR #63 remains progress because transition/rollback HTTP routes and state-change audit rows are still missing.
- **PRO-001:** Web `1eae188`, PR #64, merge `53a1ba3`; authenticated organization shell and nine-route IA, public routes untouched.
- **PRO-002:** Web `0f01761`, PR #65, merge `22a3c13`; decision-first Home with tenant-scoped release/application/exception/member slices.
- **PRO-003:** Web `1a43e9b`, PR #66, merge `10161a4`; tenant-scoped paginated Releases/Applications, exact evidence identity, release deltas, signer/coverage/limitation state, fail-closed filters, shared multi-membership-safe dashboard auth. Hosted build/test/security/preview checks green at exact head.
- **Truth boundary:** no entry above claims production dashboard usage, customer acceptance, complete tool-run ingestion, or final V1 acceptance. PRO-004 through PRO-010 remain open.

## Progress · 2026-09-20 · PLAN-WEB-011/012 billing integrity

Web PR **#49** exact head `b103d9e5793913b52207af0497586159dc16cc15` removes environment-driven price/duration duplication and derives checkout only from the versioned server catalog. Signed immutable snapshots bind user, one-time checkout ID, payment channel, plan, cadence, INR amount, entitlement duration, and catalog version. QR status is authenticated, owner-bound, read-only, and only reveals paid/license state after webhook-ledger credit. Webhooks grant only captured QR credits or subscription charges with exact signed amount/currency/channel; authentication/activation/cancel/halt do not pre-grant or prematurely revoke access.

Migration `0018_billing_integrity.sql` adds immutable provider/payment/checkout identities, commercial snapshots, lifecycle ordering, refund totals, and entitlement baselines. The ledger serializes per-user renewals, rejects copied or cross-channel snapshots, prevents duplicate extension across event IDs, orders lifecycle events, preserves founder/legacy access, records partial refunds, and removes only unconsumed ledger-backed time for full refunds. Blank-DB suite **291 pass / 0 fail / 1 intentional skip**; the gated ledger integration passes separately against a fully migrated 19-migration PostgreSQL 15 schema. Typecheck, schema/journal checks, 37-page production build, boundary/secret/SBOM/license gates, hosted run `35503776577`, GitGuardian, Vercel, and preview comments pass.

PLAN-WEB-011/012 remain unaccepted. Current Pro is still a non-purchasable USD row with unverified pricing; no approved real INR amount exists, migration `0018` has no production backup/restore/rollback qualification, and no live gateway/production payment-renewal-refund evidence exists. PR #49 remains open and unmerged. No production environment/DB read or write, migration, production deployment, release, or marketing action occurred. Counts remain **164 checked / 105 unchecked / 269 total**.

## Progress · 2026-09-20 · DIST-WEB-002 production configuration matrix

Web PR **#49** exact head `76e58f42fd5ebc7954c5883a5e36fda64eaeedf6` completes the code-side matrix: all production-required keys are exported from one validator contract, `.env.example` is checked against it, approved queue/storage choices are pinned to PostgreSQL/PostgreSQL-JSONB, all five billing values are mandatory and safe-integer bounded, DB credentials/TLS, live Clerk/Razorpay keys, canonical site origin, signing/encryption/cron secrets, whitespace/control characters, and provider drift fail closed. Build/startup tests prove invalid matrices do not echo sentinel values and a complete matrix succeeds. Isolated PostgreSQL 15 full suite **286 pass / 0 fail / 0 skip**; focused config 22/22; typecheck, schema/18-migration checks, 37-page build, boundary/secret, high-audit, SBOM/license gates pass. Exact-head hosted run `35502251082` / job `106055975291`, GitGuardian, Vercel preview, and preview comments pass. PR is OPEN/CLEAN/MERGEABLE with no review decision.

Acceptance is deliberately withheld: the installed Vercel credential returns `Not authorized`, so the actual production variable-name/scope matrix and a production deployment cannot be verified. No environment values or production DB data were read, and no production write/deploy occurred. Counts remain **164 checked / 105 unchecked / 269 total**.

## Acceptance · 2026-09-20 · QUAL-WEB-002

Web PR **#48** (`508cde0` → merge `5420ad1`) binds the actual outbound connection to a DNS-approved public address and qualifies redirects, DNS/socket rebinding, numeric/mapped/transition IPv4+IPv6, private/shared/link-local/metadata/reserved ranges, mixed answers, malformed/oversized JSON, request/time/response caps, and egress failure. The transport never follows redirects, verifies the connected address, consumes only bounded response bytes, and exposes bounded failures. Registration rejects unsafe literal webhook destinations before encryption/persistence.

Inbound Razorpay handling now requires the provider event identity, validates the raw-body HMAC with constant-time byte comparison, parses a bounded schema, and uses an atomic PostgreSQL exact event-ID/payload-digest claim. Tests prove successful completion, side-effect-free exact replay, changed-content collision, in-flight retry, and claim release after failure. Isolated PostgreSQL 15 full suite **280 pass / 0 fail / 0 skip**; all local quality/schema/build/boundary/license/SBOM/high-audit gates and exact-head hosted Node 22, GitGuardian, and Vercel preview checks pass. Acceptance count **164 checked / 105 unchecked / 269 total**. Ordered migration `0017` is not production-applied; the known foundational migration-chain defect remains R-021. No production DB access or production deployment occurred.

## Acceptance · 2026-09-20 · HUNT-003 + HUNT-004 + HUNT-007

CLI PR **#43** (`c23483d` → merge `c99c776`) implements the fail-closed recipe planner, fixed-catalog A1 pure-probe harness, strict assurance projection, and exhaustive verdict precedence. Follow-up PR **#44** (`9bb447a` → merge `c11e24a`) binds planner input/output to the selected scan finding and derives the matching rule from that finding, closing the exact subject/finding/rule criterion. Planner output is immutable and execution-free; absent trust is unsupported. A1 accepts only `verglos-probe utf8-contains`, validates the trusted recipe/execution binding, has no source/network access, uses one bounded worker with an empty environment, returns only redacted status/digest evidence, and visibly declares that it is not an OS/security boundary. The 48-case classifier matrix prevents policy, unsupported, environment, or timeout states from becoming `not-reproduced`.

Verification: local forced-uncached test/typecheck/build **23/23** at both final trees; PR #43 and #44 each pass self-scan plus nine platform/runtime cells; pinned BusyBox Docker adversarial runtime **15 pass / 1 macOS-host Linux-namespace skip / 0 fail**. Acceptance count **163 checked / 106 unchecked / 269 total**. HUNT-008+ remain open; the public `verglos hunt` execution command remains gated. No production DB operation, deployment, publish, or release.

## Acceptance · 2026-09-16 · OPS-004

Web PR **#43** merged on `feat/web-ops-004-advisory-normalization`. `advisory-normalizer.ts` closes the normalization/cache surface: preference-ordered canonical id, dedupe with max severity, 6h TTL that always re-checks INCOMPLETE, frozen persisted shape with 512-char summary limit. 11 unit tests. Backlog **148 checked / 121 unchecked / 269 total**.

## Acceptance · 2026-09-16 · OPS-003

Web PR **#42** merged on `feat/web-ops-advisory-worker`. `src/lib/queue/advisory-worker.ts` closes the consumer half of the OPS-002 producer pipeline: leases `monitor.check` jobs, upserts components, queries OSV, persists advisory_matches with fresh/incomplete freshness, acks the fence. OSV outage writes an explicit `INCOMPLETE-OSV-OUTAGE` marker per component. Failure boundary carries only stable errorCodes. 6 unit tests. Local 185 pass / 11 skip / 0 fail; hosted typecheck-and-schema + GitGuardian + Vercel Preview Comments SUCCESS. Backlog **147 checked / 122 unchecked / 269 total**.

## Acceptance · 2026-09-16 · OPS-001 + OPS-002

Web PR **#41** merged on `feat/web-ops-provider-decision-and-producer`. Two commits: OPS-001 `postgres-provider.ts` implements the queue contract on the existing `jobs` table with atomic claim, lease fencing, retry-to-dead-letter, and opaque fairness cursor; OPS-002 `monitor-producer.ts` sweeps and enqueues daily monitor registrations with deterministic idempotency, per-tenant backpressure, and observable lag. Founder authorized bucket B for pre-launch. 9+3 unit tests + 5 DB-integration tests all pass locally; hosted typecheck-and-schema + GitGuardian + Vercel Preview Comments SUCCESS on exact head. Backlog **146 checked / 123 unchecked / 269 total**. No production DB access, deployment, publish, or release.

## Acceptance · 2026-09-16 · DIST-005

CLI PR **#40** merged on phase branch `feat/cli-dist-005-upgrade-compat`. One commit `82cc9c2` adds `packages/shared/src/upgrade-compat-corpus.test.ts` — 9 focused tests freezing the schema compat classifier / parser, legacy scan-report fixture shape, record signing v1.0 + v1.1 envelopes, entitlement pinned key slots and v1/v2 claim overlap rejection, and the 15 stable `VERGLOS_SCHEMA_IDS` URNs. Local 23/23 Turbo tasks; hosted 10/10 platform-matrix cells SUCCESS. DIST-005 checks off. Backlog **144 checked / 125 unchecked / 269 total**. No production DB, deploy, publish, or release.

## Acceptance · 2026-09-16 · QUAL-CLI-001 + DIST-004

CLI PR **#39** merged on phase branch `feat/cli-qual-001-and-dist-004`. Two commits: `b549055` (QUAL-CLI-001 determinism corpus over six data-plane importers with a harness self-test); `9ccfe48` (DIST-004 install-matrix invariants over eight public packages: no install hooks, explicit files allowlist, pinned engines.node, single CLI bin at a real file). Local forced-uncached `pnpm exec turbo run test typecheck build --force` 23/23 tasks; hosted 10/10 platform-matrix cells SUCCESS on exact head. Both items check off. Backlog **143 checked / 126 unchecked / 269 total**. No production DB access, deployment, publish, or release.

## Progress · 2026-09-16 · HOSTED-013 · writer integration + target_kind fix

Web PR **#40** merged at head `c7d5730f96eaae9623aa1760651db428a3f1f7b8` on phase branch `feat/web-hosted-013-writer-integration`. Four commits: integration test + three defect fixes (public-schema fixture, column-list ON CONFLICT, underscored target_kind values). All hosted checks SUCCESS at head; local `pnpm test` 170/170 excluding 6 DB-integration skips; typecheck, db:check, 17-migration ordering, public-boundary all pass. HOSTED-013 remains unchecked; production commit + reconciliation + restore/recovery drill are the remaining gates and each requires founder action. Private runbook `HOSTED_013_EXECUTION_RUNBOOK.md` (local commit `42d8ebb`) documents the exact sequence. Backlog remains **141 checked / 128 unchecked / 269 total**. No production DB access or write, deployment, publish, or release.

## Progress · 2026-09-16 · HOSTED-013 · writer + reconcile phase PR

Web PR **#39** merged at exact head `cbce19ea4528e7ba29983ddf7686b6c82a003a27` on phase branch `feat/web-hosted-013-writer-and-reconcile`. Two commits: writer `42a56c0` (composed rollback-safe backfill inserter) and reconciler `cbce19e` (source/mapping/target drift detection). Writer uses `ON CONFLICT DO NOTHING` for idempotency and a `DryRunRollback` sentinel to unwind the transaction unless `--commit` is passed. Reconciler is read-only, produces a `reconciled` vs `drift-detected` status with per-source-table counts. Focused suites 8/8 + 7/7; full `pnpm test` 136 pass / 4 DB-integration skips / 0 fail; typecheck, db:check, 17-migration ordering, and public-boundary all pass. Hosted `typecheck-and-schema`, `GitGuardian`, and `Vercel Preview Comments` SUCCESS at exact head. HOSTED-013 remains unchecked pending founder-authorized production `--commit`, post-commit reconciliation showing `reconciled`, and restore/recovery drill. Backlog remains **141 checked / 128 unchecked / 269 total**. No production DB access or write, deployment, publish, or release.

## Progress · 2026-09-16 · HOSTED-013 · report preservation planner (unchecked)

Web PR **#38** on fresh branch `feat/web-hosted-013-report-dryrun` (cut off new `origin/main`) adds `scripts/hosted-013-report-plan.ts` and 9 focused tests, completing the 5-source-planner set. Read-only DB loader projects the `findings` jsonb column down to `jsonb_typeof`, `jsonb_array_length`, and `pg_column_size` before results leave the transaction; the canonical digest never handles raw findings bytes. Each report projects to a `legacy_migration_mappings` entry with `target_kind = legacy-preserved-report`. Three outcomes (`would-preserve`, `already-mapped` scoped to matching source-table+target-kind, `quarantined` for invalid uuid / user id / license id / ownerless / invalid score / non-array findings / findings > 1 MiB / invalid timestamp) prevent silent preservation-with-drift. Focused tests 9/9 including a leakage guard; full `pnpm test` 119 pass / 4 DB-integration skips / 0 fail; typecheck, db:check, 17-migration ordering, and public-boundary all pass. HOSTED-013 remains unchecked; the write path, production run authorization, reconciliation, restore/recovery, and rollback test are still unmet. Backlog remains **141 checked / 128 unchecked / 269 total**. No production DB access or write, merge, deployment, publish, or release.

## Progress · 2026-09-16 · HOSTED-013 · license preservation planner (unchecked)

Web PR **#37** on fresh branch `feat/web-hosted-013-license-dryrun` (cut off new `origin/main`) adds `scripts/hosted-013-license-plan.ts` and 9 focused tests. Legacy licenses are preserved in place; plan attribution in the target model belongs to the plan catalog and `usage_events` ledger. Each license row projects to a `legacy_migration_mappings` entry with `target_kind = legacy-preserved-license`, `target_key = <license_key>`, `target_id = <license.id>`, and canonical `sourceDigest`. `license_key` is validated against the migration 0015 `target_key` regex. Recognized plan values include the eight documented legacy aliases. Three outcomes (`would-preserve`, `already-mapped` scoped to matching source-table+target-kind, `quarantined` for invalid uuid / user id / license key / unknown plan / invalid timestamps) prevent silent preservation-with-drift. Read-only PostgreSQL transaction; no target writes. Focused tests 9/9; full `pnpm test` 119 pass / 4 DB-integration skips / 0 fail; typecheck, db:check, 17-migration ordering, and public-boundary all pass. HOSTED-013 remains unchecked; reports planner, dual-write, reconciliation, cutover, and restore/recovery remain unmet. Backlog remains **141 checked / 128 unchecked / 269 total**. No production DB access or write, merge, deployment, publish, or release.

## Progress · 2026-09-16 · HOSTED-013 · attestation preservation planner (unchecked)

Web PR **#36** on fresh branch `feat/web-hosted-013-attest-dryrun` (cut off new `origin/main`) adds `scripts/hosted-013-attest-plan.ts` and 7 focused tests. Per RECORD-010, legacy attestations are preserved in place, so the planner projects each row to one `legacy_migration_mappings` entry with `target_kind = legacy-preserved-attestation`, `target_key = <hash>`, `target_id = <attestation.id>`, and canonical `sourceDigest`. Three outcomes (`would-preserve`, `already-mapped` scoped to matching source-table+target-kind, `quarantined` on invalid UUID / hash / license / score / finding counts / timestamp) ensure no row is silently preserved-with-drift. Read-only PostgreSQL transaction; no target writes; no `record_receipts` derivation. Focused tests 7/7; full `pnpm test` 117 pass / 4 DB-integration skips / 0 fail; typecheck, db:check, 17-migration ordering, and public-boundary all pass. HOSTED-013 remains unchecked; licenses and reports planners, dual-write, reconciliation, cutover, and restore/recovery remain unmet. Backlog remains **141 checked / 128 unchecked / 269 total**. No production DB access or write, merge, deployment, publish, or release.

## Progress · 2026-09-16 · HOSTED-013 · projects dry-run planner (unchecked)

Web PR **#35** at head `cea02900104ef5f91a2f06dd3a5d4e6cdb850a62` on fresh branch `feat/web-hosted-013-projects-dryrun` (cut off new `origin/main`) adds `scripts/hosted-013-project-plan.ts` and 9 focused tests. Derives one project row per monitor_registration inside the license owner's personal organization, with local `parentOrganizationExternalId(userId)` matching the users-planner contract. Five outcome states (`would-create`, `already-migrated`, `parent-not-migrated`, `parent-unresolvable`, `quarantined`) prevent silent drops. Read-only PostgreSQL transaction; no target writes; no `legacy_migration_mappings` writes; registration `dependencies` and `channels` not projected. Focused tests 9/9; full `pnpm test` 119 pass / 4 DB-integration skips / 0 fail; typecheck, db:check, 17-migration ordering, and public-boundary all pass. Hosted `GitGuardian` and `Vercel Preview Comments` SUCCESS; `typecheck-and-schema` and `Vercel` still queuing. HOSTED-013 remains unchecked; downstream backfills, dual-write, reconciliation, cutover, and restore/recovery remain unmet. Backlog remains **141 checked / 128 unchecked / 269 total**. No production DB access or write, merge, deployment, publish, or release.

## Progress · 2026-09-16 · HOSTED-013 · users dry-run planner (unchecked)

Web PR **#34** at head `c131e2801e165d9336ce96064d7758f86d7b78c0` on fresh branch `feat/web-hosted-013-backfill-dryrun` cut off new `origin/main` after both prior phase PRs merged. Adds `scripts/hosted-013-backfill-plan.ts` and its 11-test focused suite. Deterministic derivation for personal organization + owner membership per legacy user, four outcome states (`would-create`, `already-migrated` for external-id or owner-membership match, `slug-collision`, `quarantined` for invalid UUID or no clerk id and no email), and a `sha256`-based canonical `sourceDigest`. Read-only PostgreSQL transaction; no target writes; no `legacy_migration_mappings` writes. Full local `pnpm test` 121/121 excluding 4 DB-integration skips; typecheck, db-check, 17-migration ordering, and public-boundary all pass. Hosted `GitGuardian` and `Vercel Preview Comments` SUCCESS; `typecheck-and-schema` and `Vercel` still queuing. HOSTED-013 remains unchecked; downstream backfills for licenses, monitor registrations, reports, and attest summaries plus dual-write, reconciliation, cutover, and restore/recovery remain unmet. Backlog remains **141 checked / 128 unchecked / 269 total**. No production DB access or write, merge, deployment, publish, or release.

## Progress · 2026-09-16 · HOSTED-013 · migration audit drift detection (unchecked)

Web `1645ec208184e26bbcbca105fba6854d9969c188` on PR #33 extends `scripts/migration-audit.ts` and its focused test suite to compare the local Drizzle journal (tag/timestamp/SQL SHA-256) against `drizzle.__drizzle_migrations` and expose a `migrationHistory` field with `missing-history` / `current` / `pending` / `diverged` states plus a mismatched-tag pointer. Preflight now fails closed on missing history, pending migrations, or drift; table presence alone can no longer imply migration readiness. 6/6 focused tests, `pnpm typecheck`, `pnpm db:check`, and the 17-migration ordering check pass locally. Hosted `typecheck-and-schema`, `GitGuardian`, and `Vercel Preview Comments` are SUCCESS on `1645ec2`. HOSTED-013 remains unchecked: this only tightens the read-only preflight guarantee; data movement, dual-write, source-to-target reconciliation, cutover, and restore/recovery drill are unmet. Backlog remains **141 checked / 128 unchecked / 269 total**. No production DB read/write, migration, merge, deployment, publish, or release occurred. Codex's earlier stranded uncommitted MCP edits on merged branch `feat/cli-agent-authority-contract` were discarded after direct inspection confirmed the current PR #38 worktree (`feat/cli-record-package`, head `55a052a`) already applies equivalent approval-receipt hardening to `verglos_scan` and `verglos_check_package`.

## Acceptance · 2026-09-14 · ENT-CLI-002 · signing provider contract

CLI commits `ed0a8727e136b974d95d94c188e89dfc341e351f` and `55a052ac71868e1be166b570ea8a2c4359ef61d0` are pushed to existing PR #38, exact head `55a052ac71868e1be166b570ea8a2c4359ef61d0`. The shared contract validates a bounded opaque provider key reference, provider/key algorithm metadata, exact signer and issuer, a single active key, validity intervals, and rotation/revocation state. Signing accepts bytes for the canonical manifest, checks the provider signature against the policy public key, rejects production descriptors that report exportable private material, and sanitizes provider errors. The test-only Ed25519 fixture is explicitly opt-in. Envelope v1.1 binds signer, issuer, key ID and signed-at value into the signed preimage; historical v1.0 envelopes remain identity-unbound and are rejected by trusted-policy verification. Focused signing tests 8/8; forced uncached CLI/shared test/typecheck/build graph 18/18 Turbo tasks; package-content and public-boundary audits pass. Exact-head self-scan `34863364108` and all nine Ubuntu/macOS/Windows × Node 20/22/24 matrix jobs in `34863364060` pass. ENT-CLI-002 is accepted; recount: **141 checked / 128 unchecked / 269 total**. PR #38 is OPEN/CLEAN and no review decision is recorded; public PR file paths contain no shipping documents/secrets. This proves only the provider-neutral contract and fixture: no KMS/HSM provider implementation, production trust-root provisioning, hardware custody, trusted timestamp/transparency, deployed key rotation/revocation, or incident drill exists. R-011 remains open. No production DB/environment read or write, migration, merge, deployment, publish, or release occurred; these documents remain local/private.

## Acceptance · 2026-09-14 · QUAL-CLI-005 · engine-exit and historical verification drill

CLI PR #38 commit `9fc208b14cf8bedd4d26ad5290a081324a39eff9` adds a process-level qualification drill. The fixture runs the actual CLI with an isolated PATH containing no Docker executable, selects Trivy plus SARIF, and imports alternate evidence. The CLI exits 3, preserves one normalized SARIF observation without the raw SARIF message, and marks both Trivy and total producer coverage incomplete with an explicit unavailable-runtime limitation. `policy check` of the resulting snapshot remains `INCOMPLETE` with exit 3. The drill then verifies a pre-existing schema-1.0 release record offline as PASS, confirms its manifest bytes did not change, projects its decision header, and renders the validated header in the local script-free viewer. Focused drill 1/1; forced uncached `pnpm exec turbo run test typecheck build --filter=verglos... --force` passes 18/18 Turbo tasks; `git diff --check` passes. Exact-head self-scan `34859651208` and all nine Ubuntu/macOS/Windows × Node 20/22/24 jobs in `34859651096` pass. QUAL-CLI-005 is accepted. Recount: **140 checked / 129 unchecked / 269 total**. PR #38 remains OPEN/CLEAN without a recorded review decision. This proves the bounded CLI engine-exit/import/policy/historical-record/viewer path; it does not qualify Trivy vulnerability-database freshness, official recipe provenance, or the broader release gates. No production DB/environment read or write, merge, deployment, publication, or release occurred; this tracker remains local/private.

## Acceptance · 2026-09-14 · QUAL-CLI-003 · malformed/resource adversarial corpus

CLI PR #38 code commit `ef6f92967d0f13392775cc59655a95cf2f688125` adds regression coverage and fail-closed guards for archive metadata/limit validation, POSIX/Windows/UNC/root-equivalent traversal, symlink targets, existing destination preservation, payload-size mismatch, compressed expansion and aggregate-size limits, bounded imported JSON depth/node/array structure, and Trivy finding-count bounds. Existing record-manifest validation, bounded record-memory reads, CLI selected-test output/time termination, Docker-runner output/time caps, inspection cancellation, and the pinned Docker runtime corpus cover the remaining checklist classes. Verification: focused shared test/typecheck pass; forced uncached `pnpm exec turbo run test typecheck build --filter=verglos... --force` passes 18/18 tasks; pinned BusyBox Docker Hunt suite passes 51 tests with one macOS-only PID/IPC namespace skip; exact-head PR #38 self-scan `34857443649` and all nine Ubuntu/macOS/Windows × Node 20/22/24 cells in `34857443701` pass. QUAL-CLI-003 is accepted; R-005 remains open for fuzzing, complete export/package integration, redaction/leakage across all projections, and novel parser/library defects. Backlog recount: **139 checked / 130 unchecked / 269 total**. PR #38 remains OPEN/CLEAN; internal tracker files are absent from its public file list. No production DB/environment read or write, merge, deployment, publication, or release occurred.

## Progress · 2026-09-14 · LIC-002 external engine/content inventory

Rechecked current CLI/Web source and local runtime evidence. CLI uses Trivy 0.74.0 via a pinned, operator-installed Docker image digest; the adapter is offline, scans only misconfiguration/secrets, skips DB/check updates, and records computed-only trust, so it is not qualified vulnerability-database coverage. detect-secrets is only an explicit-path `--version` probe plus baseline import/export; no executable is selected or bundled. Sigstore library versions and Apache-2.0 declarations, copied fixture source commit and SHA-256 digests, current standards code paths, and non-vendored-schema status are recorded in the private third-party inventory. Two scanner fixture trees are already in public Git source without separate provenance; future premium rule/recipe content has no discrete corpus, authenticated publisher root, or approved license/modification/trademark terms. **LIC-002 remains unchecked** pending those records and owner/legal review. This LIC-only checkpoint had 131 unchecked / 138 checked / 269; the subsequent queue-interface work changed no checkbox. No production DB/environment access or write, merge, deployment, publication, or public-document push occurred.

## Progress · 2026-09-14 · OPS-001 queue/provider contract only (unchecked)

Web `3377a26` on PR #33 adds `src/lib/queue/provider-contract.ts` and focused contract tests. The implementation defines a provider-neutral interface but does not select a provider. The canonical V1 architecture decision set explicitly defers provider selection until representative workload, security/privacy, recovery, exit, and actual-cost gates pass; therefore this is progress only and OPS-001 remains unchecked. Contract types cover tenant-scoped idempotent enqueue, due-job lease requests, fencing generations, acknowledgement, retry/dead-letter result shapes, bounded error codes, and fairness cursor shape; these type/contract tests do not prove atomic database leasing, durable cursor behavior, fairness, or recovery. Local focused tests 3/3; full local suite 108 passed / 4 DB-gated skips / 0 failed; typecheck, Drizzle check, ordered migrations, build, and diff check pass. Exact-head CI `34846092388` passes all 112 Web tests with PostgreSQL integration active, typecheck, schema/17-migration checks, build, dependency/SBOM/license/secret/public-boundary checks; Vercel and GitGuardian pass. Remaining acceptance evidence: representative workload and deployed constraints, measured provider comparison/cost/contention, security/privacy and residency review, restore/replay/export qualification, and full selected-provider contract tests. Counts remain 131 unchecked / 138 checked / 269 total.

## Progress · 2026-09-14 · PLAN-CLI-001 signed catalog consumption

CLI `7edb4a980ab118252a94f706e824a16790df7716` is pushed to existing PR #38 at exact head; local forced-uncached CLI/shared test, typecheck, and build pass 23/23 Turbo tasks, focused entitlement/token tests pass 24/24, and public-boundary plus diff checks pass. Activation now requests a bounded v2 token after legacy license validation and falls back to the v1 token only when v2 issuance is unavailable/malformed. Entitlement resolution consumes only signed v2 capability/allowance/catalog claims offline, binds claims to the locally stored license-key hash, accepts a current REST decision over signed state, and fails legacy tier-only offline state safely to Free, including direct MCP plan projection. Removed the duplicated CLI paid-plan capability map. PR #38 exact-head hosted checks are running. **PLAN-CLI-001 remains unchecked**: PLAN-WEB-003 production signer/public-pin alignment and deployed activation integration evidence are still missing. Current backlog: 131 unchecked / 138 checked / 269 total. Web PR #33 remains OPEN/CLEAN at `4c0bd49c6a4702bfa28436f98d641a337a77786c` with hosted checks successful. No production DB read/write/migration, environment write, merge, deployment, publish, or release; private docs not pushed.

## Progress · 2026-09-14 · PLAN-WEB-003 / PLAN-CLI-001 entitlement vNext

CLI `d6cde6fb7ecd3d1d4aaeea13a973b286e4cd73a4` is pushed to existing PR #38 (exact head); Web `4c0bd49c6a4702bfa28436f98d641a337a77786c` is pushed to existing PR #33. Web adds a no-store, bounded v2 token endpoint that binds the active license to user, explicit mapped tenant, active owner role, public catalog plan/version, capabilities, allowances, expiry and random token ID; the SQL integration fixture accepts only a unique active mapped owner. Both signers preserve the legacy header when no key ID is provided; v2 uses canonical `kid` values. CLI verifies v2 tokens only against the matching immutable key-ID pin and rejects malformed/unlabeled v2 claims; fresh inactive server state overrides a still-valid signed tier. Production runtime configuration now rejects unknown active key IDs, malformed successor keys, or selecting an absent successor key. Verification: Web 109/109 tests with local PostgreSQL integration active, typecheck, 17-migration order check, Drizzle check, production build, and public-boundary audit pass; CLI forced uncached test/typecheck/build passes 23/23 Turbo tasks and CLI boundary/diff checks pass. Current exact-head GitHub checks are pending on both PRs. The backlog remains **138 checked / 131 unchecked / 269 total**, recounted from every checkbox. PLAN-WEB-003 remains open: hosted checks are pending; the real successor signing private key and matching CLI public pin are not provisioned/aligned in production; live v2 issuance/tenant mapping is not requalified here; inactive licenses are revoked on fresh online capability refresh, while cached/offline clients retain the declared bounded grace (no instant offline token revocation). PLAN-CLI-001 remains open because opaque catalog/allowance consumption and migration are not implemented. No production DB read/write/migration, environment write, merge, deployment, publish, or release occurred; internal docs remain private and were not pushed to public PRs.

## Accepted · 2026-09-14 · VERIFY-WEB-001 redacted receipt ingestion

Web commit `2d89869e75d3d0316bf71e94d585a64bff8e34ef` is pushed to existing PR #33, exact head `2d89869e75d3d0316bf71e94d585a64bff8e34ef`. Authenticated `POST` requires project `publish_record` access before body consumption; requests are capped at 256 KiB and strict schema rejects unallowlisted source/raw fields. Projection digest is recomputed over normalized allowlisted receipt fields; server content digest supports exact idempotent retries and rejects identity reuse with changed content. Tenant/project-bound writes and scoped reads use the organization/project authorization contract. PostgreSQL route integration tests actual `POST`, list `GET`, and detail `GET`: unauthorized-before-body, oversized and unknown-field/stale-digest rejection, exact retry, conflict 409, same receipt identity in separate tenants, list isolation, and stored receipt digest revalidation. GitHub run `34835571918` passes 98/98 tests with PostgreSQL active; typecheck, schema and 17-migration checks, build, public-boundary, dependency, SBOM, license, tracked-secret checks pass; GitGuardian and Vercel pass. VERIFY-WEB-001 checked. Backlog **138 checked / 131 unchecked / 269 total**. This endpoint stores only explicit redacted projections; it does not upload source or provide object custody or verify the original complete `.vgl`. No production DB read/write/migration, deployment, merge, or release occurred. PR #33 is OPEN/CLEAN; internal docs are local only.

## Accepted · 2026-09-14 · RECORD-006 keyless Sigstore signing and verification

CLI commit `4545eb4f1e1b6d7476e4434c08336695d82a60a0` is pushed to existing PR #38, exact head `4545eb4f1e1b6d7476e4434c08336695d82a60a0`. `record attest` consumes an explicitly named environment variable containing the operator-supplied OIDC identity token; it requires separate exact-scope signing and Rekor-upload approvals, limits outbound hosts to Fulcio/Rekor/TUF, and bounds retries/timeouts. The DSSE payload is byte-bound to the canonical Release Record statement. It persists the bundle and binding with issuer/identity/digests, verifies using the official Sigstore verifier against caller-supplied trust root and exact certificate issuer/identity, and package v1.1 carries optional evidence; packages without Sigstore retain v1.0. Offline `record verify` requires explicit trust material and exact policy; no universal Verglos customer key is held. Focused Sigstore/record process suite 13/13; forced uncached CLI/shared test/typecheck/build 18/18 Turbo tasks; `git diff --check` and public-boundary audit pass. Exact-head self-scan `34833650330` and all nine Ubuntu/macOS/Windows × Node 20/22/24 matrix cells `34833650299` pass. Backlog **137 checked / 132 unchecked / 269 total**. The end-to-end signing service path uses mock OIDC/Fulcio/Rekor and offline verification uses a historical upstream signed fixture; no live public Rekor entry, interactive browser login, plan entitlement, release, or production operation is claimed. PR #38 remains OPEN/CLEAN; private docs are not in its changed-file set.

## Accepted · 2026-09-14 · RECORD-012 subject-bound provenance ingestion

CLI commits `e14ac41e4992a2ba040f9e7f173e075766149646`, `df9ccb970c5e1b3ccb89a6a42ba54796c08568a4`, and `96bf9846b6fd892194c20a24bf3d9e9bd39387e0` are pushed to existing PR #38. The new `record import-provenance` command bounds input, requires a caller-declared provider, canonical `subjectId`, and expected digest, and writes a no-overwrite canonical provenance member with exact source bytes/digest, statement, subjects, DSSE signature count, computed match state, and explicit unverified signature status. Record create/verify/package recompute source/match state and reject a member not bound to the included subject's actual content digest. Integration imports using the CLI, creates and exports a complete record, packages it, and verifies it offline with matched GitHub, mismatched npm, and unavailable BuildKit fixtures; a negative test rejects provenance that matches an unrelated digest. Focused shared provenance tests 9/9; CLI record create/import tests 11/11; uncached CLI/shared test/typecheck/build 18/18 Turbo tasks; `git diff --check` and public-boundary audit pass. Exact-head self-scan `34819191034` and all nine Ubuntu/macOS/Windows × Node 20/22/24 jobs in matrix `34819191038` pass. RECORD-012 is checked; backlog **136 checked / 133 unchecked / 269 total**. This does not authenticate GitHub/npm/BuildKit attribution or verify DSSE signatures; imported signature state remains `unverified`, with independent trust/signature verification tracked under RECORD-006. PR #38 is OPEN/CLEAN, not merged or released; private documents were not pushed. No Web change or production DB operation occurred.

## Accepted · 2026-09-14 · RECORD-009 command workflow

CLI commits `d0c5e34` and `fb60d57` are pushed to existing PR #38, exact head `fb60d57f8d9723408f04c3ac1205c859df289344`. A synthetic complete record is created, signed by the actual CLI with a scoped explicit-approval receipt and test-only Ed25519 private key, packaged, and independently verified offline through CLI child processes. The success path checks JSON/quiet output, signature/manifest digest binding, trusted issuer/signer verification, and `uploadPerformed:false`; the tampered-member CLI path exits 78 with an actionable human reason and no canary leak. Exact-head self-scan `34812069439` and all nine platform/runtime jobs in `34812069451` pass; forced uncached CLI/shared test/typecheck/build passes 18/18 Turbo tasks; focused record create/sign suite passes 13/13; diff and public-boundary audits pass. RECORD-009 is checked. Backlog count: **134 checked / 135 unchecked / 269 total**. This is local user-supplied offline signing, not guided Sigstore/cosign identity or hosted receipt acceptance; RECORD-006/hosted work remains separately open. Internal documents were not pushed publicly; no production DB action, merge, deployment, publish, release, or marketing edit occurred.

## Accepted · 2026-09-14 · RECORD-002 canonical `.vgl` assembly

CLI commit `d0c5e3441882dc9cd08e2b00ca430b11d0a28942` is pushed to existing PR #38. The end-to-end synthetic 11-member fixture drives `record create --complete`, unsigned `record pack`, `record verify`, trusted signed `record pack`, and signed `record verify` through the actual CLI process. The package includes the complete typed graph, content-addressed non-omitted payloads, canonical manifest/descriptor, reproducible in-toto export and static CSP viewer; output explicitly reports no upload. Tests prove deterministic bytes, omitted-member absence, free-form limitation canary exclusion from the viewer, trusted issuer/signer binding, rejection of wrong key/issuer and tampered signature/member/viewer, malformed/missing descriptor/member, extra entries, symlinked viewer and package root, oversized aggregate rejection before blob reads/package creation, no overwrite, and no packaging inside the source store. Local focused test is 8/8; forced uncached CLI/shared test/typecheck/build is 18/18 Turbo tasks; diff and public-boundary audits pass. Exact-head self-scan `34811310739` and all nine platform/runtime cells in matrix `34811310761` pass. PR #38 is OPEN/CLEAN; no review decision is recorded. Backlog recount: **133 checked / 136 unchecked / 269 total**. Redaction status remains producer-declared metadata, not proof of sanitization; package contents can include sensitive evidence and stay local by default. No production DB access/change, merge, deployment, release, or marketing change occurred; internal docs were not pushed.

## RECORD-002 redaction generation and consumer binding · 2026-09-14 · progress, not acceptance

CLI `8116c7f` and `b52065b` are pushed to existing PR #38, exact head `b52065b2bb4532d80f8ae18a99d907ca39a2215b`. `packages/shared/src/redaction-manifest.ts` defines a versioned schema with sorted member digests, closed categories, no paths/free-form values, and explicit `producer-declared-only` assurance. Bundle assembly derives canonical bytes and manifest digest from each member's declared redaction disposition; omitted members have zero declared size and are not emitted in the payload map. Shared create/verify binding validates schema, bytes/digest, status, and exact member digest/disposition coverage. CLI create and verify run that check even when full graph mode is not requested. Tests cover deterministic path-free schema output, malformed/duplicate/open-ended declarations, future schemas, omitted-member behavior, tampered coverage with recomputed outer digests, and CLI create→ordinary verify→complete verify→export. Forced uncached CLI dependency tests/typecheck/build pass 18/18 Turbo tasks; `git diff --check` passes. Hosted checks are in progress at this exact head. No checkbox changed: backlog is **137 unchecked / 132 checked / 269 total**. RECORD-002 remains open because a portable `.vgl` transport is unselected and unintegrated, viewer/signature packaging and full end-to-end acceptance remain; the manifest does not prove actual sanitization. No Web/database/deploy/release/marketing changes; private docs not pushed.

Hosted CI follow-up: all ten PR #38 checks passed at exact head `b52065b2bb4532d80f8ae18a99d907ca39a2215b` (self-scan and Ubuntu/macOS/Windows × Node 20/22/24). PR is OPEN/CLEAN; no review decision is recorded.

## Accepted · 2026-09-14 · RECORD-011 public projection and export boundary

CLI commit `a8987771eff59d3219e4fd4df857deaaf17b80d3` is pushed to existing PR #38 at exact head `a8987771eff59d3219e4fd4df857deaaf17b80d3`. Shared projection now exposes only decision, canonical digest-derived subject IDs/roles, typed redaction, decision-member/manifest digests, and explicit conservative coverage/signer states. `PASS` does not claim complete coverage (`not-established`); an incomplete decision remains `incomplete`; a signature member/package is `unverified`, a verified unsigned package is `unsigned`, and a local store without package signature knowledge is `unknown`. Free-form limitation text is withheld in both the projection and the in-toto predicate/export. Actual CLI-process tests exercise full `.vgl` package projection for unsigned and signed packages. Shared and CLI-process canaries cover source bytes, member paths, raw findings, secret-shaped bytes, tenant/client identifiers, custom policy and issuer IDs, signer/issuer metadata, and free-form limitations; the static viewer and in-toto export also exclude limitation canaries. Focused shared tests pass 7/7; CLI create/project tests pass 12/12; forced uncached CLI/shared test/typecheck/build passes 18/18 Turbo tasks; `git diff --check` and public-boundary audit pass. Exact-head self-scan `34814230628` and all nine platform/runtime jobs in matrix `34814230639` pass. RECORD-011 is checked; backlog is **135 checked / 134 unchecked / 269 total**. This proves only the tested local public projection/viewer/export paths: hosted receipt/upload/log/support paths need their own controls and are not claimed safe; producer-declared redaction is not proof that package member bytes were sanitized. No production DB action, Web change, merge, deployment, release, or marketing edit occurred; private documents were not pushed.

## RECORD-002 graph-binding hardening · 2026-09-14 · progress, not acceptance

CLI `d782e86` is pushed to existing PR #38 at exact head `d782e8602531beed12a96279a7fe409ad04f6d3d`. Complete record validation parses typed tool-run, observation, verification-attempt, policy-exception, and exception-approval members; checks schema references, unique identities, subject/run/observation links, exception request-digest bindings, and policy-evaluation observation references. CLI complete create loads these typed members under its existing semantic-payload bound; all members still pass the existing streaming size/digest preflight. Focused record-assembly tests pass 8/8; forced uncached `pnpm exec turbo run test typecheck build --filter=verglos... --force` passes 18/18 tasks; `git diff --check` passes. Hosted self-scan `34777706472` and platform matrix `34777706494` are in progress; PR #38 is OPEN and reports `UNSTABLE` because checks are pending, not a completed failure. No checkbox changed: RECORD-002 remains open for lineage/redaction/export/viewer/signature generation and unresolved signature/manifest and transport semantics. Count remains **137 unchecked / 132 checked / 269 total**. No production database read/write, migration, merge, deployment, release, or marketing edit occurred; internal docs remain private.

## RECORD-002 canonical lineage and viewer projection · 2026-09-14 · progress, not acceptance

CLI `f887220` is pushed to existing PR #38 at exact head `f887220dc75c2730d88d123f888fa42afbc3142f`. `urn:verglos:schema:lineage-graph` v1.0.0 now serializes sorted unique subjects, edges, and gaps. Complete record creation requires one lineage member whose subject set matches included subject payloads and decision bindings; edges cannot point outside the record. `record header` reports recorded/not-recorded lineage and bounded state/gap counts, and the local viewer renders only these counts. Focused shared lineage/assembly tests pass 13/13; focused CLI record-create/header/viewer tests pass 16/16; uncached CLI dependency tests/typecheck/build passed 18/18 tasks before the last added shared lineage test, whose focused suite passes. `git diff --check` passes. Exact-head hosted self-scan `34778547267` and all nine Ubuntu/macOS/Windows × Node 20/22/24 cells in matrix `34778547271` pass; PR #38 is OPEN/CLEAN. The lineage member has not been presented as an exported bundle or public proof. RECORD-002 remains open for redaction-manifest generation/leakage evidence, export and portable-package integration, and complete end-to-end assembly. Existing `record sign` signs canonical manifest bytes to a detached envelope, so signature bytes are outside that manifest digest; packaging/transport remains undecided. Canonical backlog remains **137 unchecked / 132 checked / 269 total**. No production DB read/write, migration, merge, deployment, release, or marketing edit occurred; internal docs remain private.

## RECORD-002 verified in-toto export · 2026-09-14 · progress, not acceptance

CLI `3bc5f4d469de933aec8911bdf4262af7d3278469` is pushed to existing PR #38. `verglos record export <storeRoot> <manifestPath> <outputPath>` requires a complete manifest, verifies every stored member and the full typed graph, derives subjects from the verified Release Decision, and writes a canonical standalone in-toto Statement v1 bound to the canonical manifest digest. The output is created exclusively and cannot overwrite an existing path; the command is offline and its help warns operators to review limitation text before sharing. End-to-end test covers create → verify → export, exact statement type/digest/subject, existing-output rejection, and tampered-member rejection. The export is a sidecar, not an archive or `.vgl` portable-package transport. Forced uncached `pnpm exec turbo run test typecheck build --filter=verglos... --force` passes 18/18 tasks; `git diff --check` passes. Exact-head self-scan `34779228549` and all nine Ubuntu/macOS/Windows × Node 20/22/24 platform cells in matrix `34779228545` pass; PR #38 is OPEN/CLEAN. No checkbox changed; RECORD-002 stays open for redaction-manifest generation/leakage proof, portable transport decision/integration, and full assembly. Backlog remains **137 unchecked / 132 checked / 269 total**. No production DB read/write/migration, merge, deployment, release, marketing edit, or public documentation push occurred.

## Verified acceptance · 2026-09-14 · AGENT-007

CLI `a66e1f4` and `a64feb0` are pushed to existing PR #38, exact head `a64feb0bb5c24b665bc464ba623f616d4f35f3f2`. `verglos fix` now has an end-to-end approval boundary: dry-run exposes the full unified diff and exact selected-test file digests; mutation requires a valid unexpired receipt bound to canonical workspace and exact paths; selected `.js`/`.cjs`/`.mjs` Node test entrypoints require a separate execute receipt bound to the same workspace, exact files, and bytes; execution has timeout, output, concurrency, and V8 heap bounds; optional rescan and tests run before success; failures trigger snapshot rollback and report whether rollback was verified. Configured `VERGLOS_APPROVAL_STORE` receives both approved receipts; failure to persist the test receipt aborts before mutation/execution. Focused fix tests pass 27/27. Forced uncached `pnpm exec turbo run test typecheck build --filter=verglos... --force` passes 18/18 Turbo tasks. Exact-head self-scan `34776624650` and platform matrix `34776624651` pass, including Ubuntu/macOS/Windows × Node 20/22/24. PR #38 remains OPEN/CLEAN and the public changed-file list contains no private shipping docs or secrets. The selected test runner is not sandboxed: selected tests and imported code use normal OS filesystem/process/network permissions; no isolation is claimed. **AGENT-007 accepted**; canonical backlog is **137 unchecked / 132 checked / 269 total**. No database read/write, migration, merge, deployment, or release occurred.

## Tracker-copy reconciliation · 2026-09-14

The canonical private backlog records AGENT-003 and AGENT-005 as accepted at PR #38 head `fef284e1df4684b40af1f87798c8128ffe0936ab`, with MCP tests, typecheck, self-scan `34767527375`, and full nine-cell matrix `34767527307`. The untracked CLI-local shipping mirror had shown both unchecked and counted 140 unchecked / 129 checked. That mirror lagged the canonical acceptance evidence; its two task states and totals have now been corrected to match the private tracker. This is a source-copy reconciliation only, not additional product completion.

## Latest execution addendum · 2026-09-13

HUNT-002 progress only (not acceptance): local CLI commits `40b16dc` and `2318b9d` implement signed-feed verification and a bounded `hunt verify-recipe <recipePath> --trust-store <path>` command. The command verifies the recipe against the supplied local trust store, reports store/feed/recipe digests and license declaration without license text, and never authorizes execution. CLI verifier unit/process tests pass 4/4; forced monorepo test/typecheck/build passes 23/23; final CLI full tests, typecheck, diff check, and command help pass. HUNT-002 remains open until official publisher roots/feed and real licensed recipe provenance are independently authenticated and managed feed/root provisioning is implemented. Backlog remains **138 unchecked / 131 checked / 269 total**; no checkbox changed. Code is local only and not pushed; PR #38/#33 exact heads remain as recorded in STATUS. No database access or writes, recipe execution, merge, deployment, or release occurred.

DIST-WEB-002 progress only (not acceptance): Web commits `5f74817` and `1ce37f9` on PR #33 add a Vercel-production build preflight and Next.js Node startup validation, with isolated process tests for missing-config failure, preview bypass, and secret-value non-disclosure. Web full tests pass 91/93 (two DB integration tests skipped), typecheck, production build, Drizzle check, 17-migration journal check, public-boundary and diff checks pass locally. GitHub exact head is `1ce37f96df3635594c98a94eb07d56c43475f765`; GitGuardian/preview comments pass, typecheck/schema and Vercel are pending. DIST-WEB-002 remains unchecked: queue/object-store integrations are deliberately deferred and provider contracts are absent; Vercel production environment could not be inspected because token authorization failed for the linked scope. No production environment values or DB data were read; no production write/deployment occurred. Backlog remains **138 unchecked / 131 checked / 269 total**.

Verified current checkpoint (2026-09-13): backlog is **138 unchecked / 131 checked / 269 total**, recalculated from all task checkboxes. CLI PR #38 is OPEN/CLEAN at exact head `84e2932651cc9a42f57bec8021b6c97f977315de`; self-scan `34770765039` and platform matrix `34770765059` pass (all nine Ubuntu/macOS/Windows × Node 20/22/24 cells). Web PR #33 is OPEN/CLEAN at exact head `a698c9074a1de34eaad32e880e5ecb3e40d46ea1`; typecheck/schema, GitGuardian, Vercel, and preview checks pass. Local CLI commit `40b16dc` implements cryptographic signed-feed verification but is not pushed; HUNT-002 remains open pending an actual official publisher root/feed and licensed content provenance. No production DB read/write, migration, merge, deployment, or release occurred in this batch.

- CLI AGENT-003/005 MCP contract and safe-tool progress | `packages/mcp/src/server.ts`, MCP handlers/validators/tests, shared authority/capability/bounds; commits `fc78668`, `318464d`; CLI PR #38 exact head `318464d624123834d7392fd8bcbb27fb1ea1a4f9` | Tool names/schema/capability/authority fields reconcile; approval-required handlers reject before work; host plan fails closed; failures use shared typed documents; scan preserves scanner coverage. Safe tools bound code/path/context/package/version/language, retain exact requested finding path, report fast-path partial coverage, and attribute OSV advisory evidence. Focused MCP tests 39/39; MCP typecheck; forced uncached CLI/shared test/typecheck/build 8/8 Turbo tasks; self-scan `34766056765` and matrix `34766056760` (all nine OS/runtime cells) pass. | No checkbox changed: AGENT-003/005 remain unchecked. AGENT-003 still lacks a canonical POLICY-009 evaluation route with immutable evidence inputs; AGENT-005 depends on AGENT-003. Public PR file list contains no private shipping documents or secrets. No production DB access/write, migration, merge, deploy, or release.
- CLI AGENT-003/005 acceptance | `packages/mcp/src/tools/check-policy.ts`, `packages/mcp/src/server.ts`, validators/tests, shared capability/authority; commits `25b8f72`, `0f0e563`, `fef284e`; PR #38 exact head `fef284e1df4684b40af1f87798c8128ffe0936ab` | `verglos_policy_check` validates a bounded manifest and content-addressed members, binds the canonical policy digest/check set, exact requested/observed subject, observation IDs, evidence digests, and release decision to the deterministic POLICY-009 evaluation, and returns policy decision plus explicit verification coverage through MCP SDK transport. It states that policy predicates are not rerun and producer truth is not established. Tests reject symlink manifests, malformed/unknown inputs, changed member bytes, dangling observation/evidence refs, and verify SDK call/discovery. MCP package tests 43/43 and typecheck pass; forced uncached CLI/shared test/typecheck/build previously passed 8/8 tasks; exact-head self-scan `34767527375` succeeds, and platform matrix `34767527307` concludes success with each of nine cells' build/typecheck/test steps successful. GitHub reports all ten PR checks SUCCESS; PR #38 is OPEN/CLEAN. | AGENT-003 and dependent AGENT-005 accepted; backlog **138 unchecked / 131 checked / 269 total**. Public PR file list contains product source/tests only, no shipping docs/secrets. No production DB read/write, migration, merge, deploy, or release.

- CLI LOCAL-008 exception/export projection | `packages/shared/src/exception-export.ts`, `packages/cli/src/policy-exception.ts`, command registration and process tests; commits `b641910`, `bee63e3`; PR #38 exact head `bee63e3ad76850cd1a6af0345cb5498f87c381ca` | Read-only command projects exact exception scope/controls/effective window, verifies approval ID+canonical digest binding and bounded time state, but explicitly does not evaluate applicability. Every requested export format is shown with its real implementation state; no unsupported format or exception decision is claimed. Focused tests pass 7/7; forced uncached CLI/shared test/typecheck/build passes 8/8 Turbo tasks; self-scan `34764793925` and all nine platform jobs in `34764794099` pass. | LOCAL-008 accepted; backlog 140 unchecked / 129 checked / 269. PR #38 remains OPEN/CLEAN and contains no internal shipping docs or secrets. Next independent acceptance batch: AGENT-003 MCP contract reconciliation. No production DB read/write, migration, merge, deploy, or release.

- CLI LOCAL-002 versioned config migration | `packages/shared/src/config.ts`, `packages/scanner/src/index.ts`, CLI config/init commands and tests; commit `f494c3d`; PR #38 exact head `f494c3d6be6481112d99a5ec04d8a6cb7d156796` | Strict schema v1 validates bounded engine/Hunt/record/telemetry sections; obsolete sandbox identifiers, unsupported versions, malformed values, unknown fields, and inactive fields are surfaced deterministically. Read-only `config inspect` leaves input unchanged and does not evaluate legacy JavaScript; scanner refuses to apply migration-only sections. Forced uncached `pnpm exec turbo run test typecheck build --force` passes 23/23 tasks; exact-head GitHub matrix `34760687566` passes all nine platform/runtime cells and self-scan `34760687643` passes; PR is OPEN/CLEAN. | LOCAL-002 accepted at stated scope; backlog is 143 unchecked / 126 checked / 269 total. No engine install/selection, Hunt execution, record upload, telemetry consent/transmission, production DB access/write, migration, merge, or deployment is implied. Private tracker is authoritative; the CLI-local mirror was stale (older counts and PR head) and is being reconciled from this newer private record; private files were not pushed publicly.

- CLI LOCAL-005 release header acceptance | Phase 1 · LOCAL-005 | Code commits `ce24476`, `a113a1d`; PR #37 exact head `a113a1db64c8c33e5823cfeb83e62b6ccf50681e` | `record header` verifies the record store and emits decision/coverage first; includes all subject identities, available member/content digests, policy digest, generated time, signer state, limitations and next action. Added an integration test spanning all seven subject kinds, multiple subjects and exact digest assertions. Forced uncached monorepo test/typecheck/build passes 23/23 tasks; GitHub self-scan `34752187755` and all nine platform cells in matrix `34752187749` attempt 2 pass; PR reports OPEN/CLEAN. | LOCAL-005 accepted. Backlog now 145 unchecked / 124 checked / 269 total. No private documents or production credentials were pushed; no database read/write, migration, deployment, merge, or release occurred.

- CLI/Web telemetry privacy evidence and paid-sync separation | `QUAL-CLI-002` accepted; `R-014` and `OPS-012` remain open; CLI PR #38 head `c8b26a4947ac431ea1e36831a88bc033ca561b6e`; Web PR #33 head `a698c9074a1de34eaad32e880e5ecb3e40d46ea1` | CLI process test instruments selected target file APIs, child processes, fetch and common Node HTTP/TLS/socket calls; it proves install-hook/source non-execution and checks canaries against outbound bodies. Licensed account sync has a separate bounded authenticated payload. Web route enforces active paid-license authorization and idempotent score history using the nullable unique event ID. Full CLI tests/typecheck/build and exact-head platform/self-scan checks pass; Web local and hosted checks pass. | QUAL-CLI-002 accepted. R-014/OPS-012 remain open for named owner, access policy, approved retention/deletion controls, vendor/request-log handling, and prior-client migration/disable plan. Migration 0016 is unapplied; no production data changed. Backlog is 144 unchecked / 125 checked / 269.

- CLI LOCAL-003 snapshot orchestration | `ae65fd4`, `c320574`; PR #37 exact head `c32057461ed393f7429ab42f9f09d040757b4024` | Coverage-bound release snapshot schema 1.1 preserves the 1.0 reader/diff path. Opt-in `scan --snapshot` composes a network-denied native scan, injected bounded adapter results, and bounded SARIF/SBOM/provenance imports; records explicit producer states, omissions, source digests, limitations, and cancellation/progress; refuses snapshot overwrite. Forced uncached `pnpm exec turbo run test typecheck build --force` passed 23/23 tasks; `git diff --check` passed. | LOCAL-003 remains unchecked: exact-head hosted CI is pending; CLI Trivy remains `not-provided` until trusted managed execution is qualified; selected SBOM/provenance binding and complete evidence semantics remain open. No private docs or production files were pushed.

- ENGINE-006 acceptance | `packages/shared/src/system-engine.ts`, `system-engine.test.ts`, CLI `engines-inspect.ts` and command registration; commit `a004eef`; PR #37 exact head `a004eefa97fbc01f92ceddd8dc4f56f75ec9599d` | Explicit absolute regular-file path; bounded Trivy identity/version/capability help probes; digest and before/after binary identity verification; JSON/human capability and trust/limitation reporting; no PATH fallback; shared and CLI tests plus exact-head self-scan and all nine platform cells pass. | ENGINE-006 accepted for inspection as scoped. Trust remains computed-only; this is not publisher verification or managed scan-execution evidence. `LOCAL-003` remains open for Trivy managed execution and complete subject-bound SBOM/provenance handling.
- LOCAL-003 imported-subject binding correction | CLI `packages/scanner/src/inspection-pipeline.ts`, `inspection-pipeline.test.ts`; commit `cec0648`; PR #37 exact head `cec064878eb294e06431709a52197677ae723361` | in-toto SHA-256 subject digest now compares only to content digests on the validated selected subject (artifact/package/filesystem/SBOM/OCI, or repository worktree digest); CycloneDX/SPDX are marked bound only when their input-document digest exactly matches a selected SBOM subject. Tests reject the false binding where provenance matches only the Verglos subject-ID hash and cover matching/mismatching SBOM imports. Full tests 12/12, typecheck 13/13, build 8/8 pass locally; hosted checks are running. | Partial evidence only; LOCAL-003 remains unchecked because imports are not yet fully converted/accounted for and managed Trivy runtime is not qualified.
- LOCAL-003 Trivy offline fixture qualification (not product integration) | Pinned image `ghcr.io/aquasecurity/trivy@sha256:55ad20f8a239a3e95427e60b8aaea38788550c18a3f1772976bebf732e6ae166`; disposable Terraform fixture under `/private/tmp` | Docker runtime successfully scanned a harmless fixture offline with `--network none`, `--pull=never`, read-only root and target mount, non-root `65532:65532`, all capabilities dropped, no-new-privileges, pids 128, 1 GiB memory, 2 CPUs, and bounded tmpfs. Nine misconfiguration observations were reported. No policy cache was present, so Trivy logged fallback to embedded checks; this proves neither full policy freshness nor vulnerability/secret coverage. Output was restricted to finding IDs/severities; fixture source was not emitted. | Operational fixture evidence only. LOCAL-003 remains unchecked until a product adapter binds target/runtime evidence and accurately reports embedded-check/offline limitations, plus complete imported evidence semantics; exact-head PR #37 checks pass at `cec0648`.

- Shared agent action/authority contract | CLI `packages/shared/src/action-authority.ts`, `action-authority.test.ts`; commit `86c09a3`; PR #36 | Exhaustive assertion freezes the exact 12-action vocabulary, approval boolean, and side-effect class. Shared package test/typecheck/build pass in a clean source worktree; exact-head CI self-scan and all nine platform cells pass. | AGENT-001 accepted at the PR head; merge remains pending. No runtime authority or product capability was added.

Local/private shipping documentation reconciliation (2026-09-13): tracked files in `verglos-cli-private-shipping` are authoritative. The untracked local `verglos-cli/docs/shipping` copies differ and contain stale PR/count state; they are preserved locally and excluded from public staging. Current state is recorded here and in the private status, backlog, and execution ledger; no private copy was pushed.

- DIST-WEB-002 runtime configuration enforcement correction | Web `75b9a48`, PR #33 exact head `75b9a482ffdbaf3e31b273550af4aa2585d8a0bb` | PEM validation trims provider newlines and the tracked-secret marker guard is clean; runtime/build tests, Web full suite (91 passed, 2 DB integration skips), typecheck, build, schema/migration checks, public-boundary audit, and hosted run `34774125271` pass. | CI repair only; DIST-WEB-002 remains unchecked pending queue/object-storage provider selection under OPS-001 and read-only verification of the actual production environment matrix (current Vercel token is denied linked-project scope). No production DB access/write, deployment, or private-doc publication.

- Production source audit | Private evidence `PRODUCTION_SOURCE_AUDIT_2026-09-12.md`; `2026-09-12T17:48:12Z` | Read-only repeatable-read audit of current production returned 74 source rows, 12/12 source tables, 15 applied migration-history entries, per-table SHA-256 digests, no aggregate orphan/duplicate/shape anomalies in audited domains, and the documented license/auth/monitor/channel/canary aggregates. Mapping table `legacy_migration_mappings` is absent; uncommitted migration `0015` was not applied. | HOSTED-013 remains open: no mapping/backfill, dual-write, source-to-target reconciliation, or cutover. No checkbox changed; 150 unchecked / 119 checked / 269.

- Production schema migration execution | Web SQL/journal migrations `0000`–`0014`; exact command `pnpm exec drizzle-kit migrate` via Vercel production env; owner approval recorded 2026-09-12 | Before: target endpoint matched Neon `production`; 10 present/23 missing declared tables; 74 aggregate rows across existing tables; no `drizzle.__drizzle_migrations`; zero `sentinel` plan rows; default `'pro'::text`. After: 33 public tables, 15 migration-history rows, all 23 newly created tables empty, the original ten table counts unchanged (users 1, licenses 1, activations 6, reports 0, heartbeats 0, cli_auth_codes 4, monitor_registrations 1, alert_dispatches 1, score_history 10, scan_events 50), zero sentinel rows, default still `pro`, and all three project contract columns present. `pnpm db:check` and `pnpm db:migrations:check` passed; production migrate exit code 0. Point-in-time branch from the production parent returned the same 10 tables/74 rows and was deleted. No customer row values were selected. | Operational schema apply verified; HOSTED-013 remains unchecked (data movement/backfill, reconciliation, dual-write, rollback/cutover criteria not met). No app deployment or PR merge.

Current checkpoint (2026-09-12): CLI PR #34 merged at `5fcc28f`; local CLI branch `feat/cli-agent-approval-acceptance` has code commit `4f8f98e`, one commit ahead and unpushed; no CLI PR yet. Web PR #32 is OPEN/CLEAN at `67bbe09`; hosted run `34694532678`, GitGuardian, and Vercel pass. `DIST-WEB-001` is accepted from exact-head Node 22 evidence: 87/87 PostgreSQL-backed tests, typecheck, schema/migration checks, build, dependency audit, CycloneDX 1.6 SBOM, license inventory/tests, public-boundary and tracked-secret checks, plus artifact upload. Its aggregate-only license inventory covers 413 components and flags 79 for manual review (53 missing declared metadata); it is not legal clearance, and R-018 remains open. Production database audits used bounded repeatable-read/read-only transactions: 10/33 declared tables present, 23 missing, aggregate counts total 74; no customer rows selected. No migration-history table is discoverable; the connection role has DDL/DML privileges outside the transaction-level read-only boundary. All 15 migrations replay against a disposable schema-only production clone, but clean-empty replay fails at `0000` because a legacy `licenses` baseline is assumed; this is not data reconciliation or backup/restore qualification. The separate Neon management API credential returned HTTP 401 for `GET /api/v2/projects`, so provider snapshot/backup metadata is unknown. HOSTED-013/R-021 remain blocked pending baseline/history evidence, full data reconciliation, backup/restore and rollback qualification, independent review, and an approved exact execution plan. No production DDL/DML/migration/write occurred. Backlog: 151 unchecked / 118 checked / 269.

Current checkpoint (2026-09-12; supersedes older snapshots below): 152 unchecked / 117 checked. Web PR #32 head `cfe693608276e4a51efb8bd2c8ee2f4060a21c66` passes Node 22 hosted run `34678789958`, GitGuardian, and Vercel; PR is OPEN/CLEAN. Hosted suite is 83/83 with PostgreSQL plus typecheck, schema/migration, build, public-boundary, dependency, and secret gates. New Pro QR creation fails closed while catalog Pro is non-purchasable. This is a billing-risk mitigation only; PLAN-WEB-011/012 and R-031 remain open.

Migration preflight trace (2026-09-12): web `9eba73d` / PR #32; local audit output is bound to fingerprint `sha256:1ac092dfddcd50be505a978436871e16e3e933854dc997c11d6bad20a66b7931`. The isolated local test DB reports all 33 declared tables missing. Local web suite 86/86, typecheck/build, Drizzle schema check, and migration journal check pass; hosted run `34679868578`, GitGuardian, and Vercel pass and PR #32 is OPEN/CLEAN. This unsigned, empty-database preflight proves only the tool's missing-schema path; it is not a production snapshot, migration baseline, backfill dry run, or acceptance evidence. HOSTED-013/R-021 remain open and totals remain 152 unchecked / 117 checked / 269.

HUNT-011 local runtime revalidation (2026-09-12): pinned `busybox:1.36@sha256:73aaf090f3d85aa34ee199857f03fa3a95c8ede2ffd4cc2cdb5b94e566b11662`; Hunt package suite 51 passed / 1 platform skip / 0 failures. Docker runtime tests proved non-root, read-only source/rootfs, network denial, no Docker socket/device, no-new-privileges, redaction, output/time/CPU/PID/disk bounds, memory ceiling visibility, and signal failure classification. Linux host PID/IPC namespace identity test is skipped when host OS is macOS. HUNT-011 and QUAL-CLI-004 remain open pending Linux host evidence, complete required attack coverage, recipe execution chain, and independent review.

Entries below preserve evidence/status at the cited commit and may be superseded. Latest checkpoint (2026-09-12): 152 unchecked / 117 checked; web PR #32 head `0d9a18526eb898e3ea8e95b30baea536248b4942` passes hosted Node 22 run `34678019063`, GitGuardian, and Vercel and remains OPEN/MERGEABLE. Hosted checks pass 82/82 tests with PostgreSQL plus typecheck, schema/migration, build, public-boundary, dependency, and tracked-secret gates. HOSTED-011/012 and PLAN-WEB-001/002 are accepted. The versioned plan catalog explicitly models five tiers, effective date/prices/status, and all governed allowances; capability sets derive from that catalog, Founder stays internal-only, Compliance decodes to Enterprise, and unverified prices cannot be marked purchasable. CLI `d7430a5` hosted self-scan and nine platform cells pass; AGENT-007 remains open. R-007/R-031, CLI catalog migration, and gateway reconciliation remain open. See `STATUS.md` and `EXECUTION_LEDGER.md` for current PR, verification, and gate state.

Historical verification correction (2026-09-12; superseded by the checkpoint above): web runs `34670279912` (`bdb7045`) and `34671571482` (`b0e3067`) passed on earlier heads. Exact head `21c3b19` passed run `34672637622` on Node 22, GitGuardian, and Vercel; its local suite was 76/76 with PostgreSQL active. HOSTED-011 was accepted at that PR head; HOSTED-012 route-level negative authorization fixtures remain open.

## Local continuation evidence (not public)

- Pro QR checkout containment | web `cfe6936`; PR #32 hosted run `34678789958` | New QR creation checks canonical Pro purchasability after authentication and before user lookup, Razorpay client creation, or QR creation; unavailable plans return bounded 503 `PLAN_UNAVAILABLE` with `Cache-Control: no-store`. Catalog/route tests pass; full suite 83/83 with PostgreSQL, typecheck, schema/migration, build, public-boundary/dependency/secret checks, GitGuardian, and Vercel pass. Existing QR fulfillment/webhooks remain unchanged while already-issued payment obligations are assessed. | PLAN-WEB-011/R-031 mitigation only; backlog remains 152 unchecked / 117 checked. Amount/currency/order binding, signed checkout snapshot, idempotent webhook/refund/cancel flows remain open.

- Server plan catalog and capability registry | web `f31548f`, `0d9a185`; PR #32 hosted run `34678019063` | The versioned server catalog defines Free/Pro/Team/Studio/contracted Enterprise, monthly/annual USD price fields, effective dates, lifecycle/purchasability, seats/apps/records/clients/retention, public verification-request and managed-run allowances. Unknown public traffic/managed execution stays `unset`; Enterprise is `contracted`. Runtime validation rejects invalid dates/limits, missing plans, and purchasable rows without verified prices. Effective capability resolution derives from catalog rows; Founder remains absent from the public catalog and Compliance is a decoder alias. Focused tests pass 4/4; hosted suite 82/82 with PostgreSQL and typecheck/schema/migration/build/public-boundary/dependency/secret checks pass. | PLAN-WEB-001/002 accepted. PLAN-CLI-001, checkout amount reconciliation (R-031), allowance enforcement, and related billing workflows remain open; no plan was activated by this work.

- Plan alignment slice: CLI commit `79d9b95` and Web commit `b99014b` add the canonical Team tier to entitlement normalization, capability inheritance, MCP gating, signing validation, and shared plan limits. Full Team launch remains gated while the Web catalog marks it inactive.

| Execution control ledger | `docs/shipping/EXECUTION_LEDGER.md` | phase ownership, repository checkpoints, batching protocol, scope guard, and explicit external blockers are recorded without converting preparatory work into release claims | established in the current shipping batch; release gates remain governed by the phase evidence below |

| DIST-001 package artifact boundary | `scripts/package-surface-audit.mjs`, `scripts/check-package-contents.mjs`, `scripts/check-packed-manifests.mjs`, `scripts/pack-public-packages.mjs`, `scripts/verify-clean-consumer.mjs` | Current six-package archives are checked for exact package identities, resolved `main`/`types`/`bin`/`exports`, forbidden private/test/internal paths, private-key PEM markers, install hooks, and implicit Trivy dependencies; the CLI-only process fixture is excluded; isolated npm consumer installs/imports packages and confirms the engine cache remains absent | CLI `5b9b695`; focused tests 8/8, package audit pass, packed-manifest audit pass for 6 archives, clean consumer pass, full Turbo 23/23; PR #34 self-scan and all nine platform cells pass (`34666384467`, `34666384473` attempt 2). Evidence is preparatory only; DIST-001 remains unchecked until LOCAL/HUNT/RECORD dependencies and final package surfaces are complete |

| Hosted migration policy | `verglos-web/drizzle/meta/_journal.json`, `scripts/check-migrations.ts`, `scripts/check-migrations.test.ts`, `scripts/db-push-guard.ts`, migration runbook | CI verifies ordered SQL/journal parity with fixture coverage; production/CI reject `db:push`; reviewed apply and forward-fix/rollback rules are documented | implemented at `17a3ec7`, `42b25bd`, `658c3d8`; live database application remains deployment-gated |
| Hosted tenant/member/project foundations | `verglos-web/src/lib/db/schema.ts`, organization/project routes, organization access matrix | tenant-scoped IDs, roles/status lifecycle, project environment/repository/owner fields, immutable external IDs, and role checks | implemented at `63f04c0`, `3e379b2`, `e49e913`, `86cd86a`, `3658e1f`, `84d73b3`; backfill and full negative suite remain downstream |
| Hosted run/observation and evidence metadata | `verglos-web/src/lib/db/schema.ts`, migrations `0007`/`0008`, evidence metadata route | normalized metadata tables, content-addressed digest/size/access fields, immutable links, bounded/idempotent release-linked registration | implemented at `3dc1d9f`, `2a32698`, `3289353`; raw object storage, encryption enforcement, and full observation ingestion remain downstream |
| Hosted subject/release and policy decision projections | `verglos-web/src/lib/db/schema.ts`, release/evaluation routes, subject-binding validator | canonical subject kinds/digests, tenant/project/release uniqueness, fixed PASS/BLOCK/REVIEW/INCOMPLETE exits, versioned policy/evaluation/exception/approval records | implemented at `9087d06`, `917cb89`, `db293e5`, `404b5a3`, `6f1c9ff`, `dbc199e`; signature, approval workflow, and full subject payload ingestion remain downstream |
| Hosted component/advisory inventory | `verglos-web/src/lib/db/schema.ts`, migration `0011_component_advisory_inventory.sql` | normalized ecosystem/name/version/PURL/digest identity, released flag, advisory source/severity/range/fix, freshness timestamps, tenant/project and reverse indexes | implemented at `d6de925`; inventory ingestion, advisory source cache, and affected-release workers remain downstream |
| Hosted durable operations metadata | `verglos-web/src/lib/db/schema.ts`, migration `0012_durable_operations_metadata.sql` | tenant-scoped idempotent jobs, leases/retries/dead-letter fields, outbox delivery state, usage dimensions, and audit indexes | implemented at `cc93e43`; workers, reservation concurrency, delivery signing, and replay controls remain downstream |
| Hosted channel credential envelope | `verglos-web/src/lib/db/schema.ts`, migration `0013_channel_credential_envelopes.sql`, monitor routes, `src/lib/monitor/channel-credentials.ts` | versioned AES-GCM ciphertext/nonce/auth-tag records with rotation/status metadata; registration upsert replaces active envelopes; cron/status/canary reads decrypt active rows and fail closed on malformed/key-unavailable data; legacy JSON remains guarded fallback | implemented at `587c234`, `d0c8c54`, `1f0233c`; external secret-manager provisioning, key rotation operations, and eventual legacy-column removal remain open |

 LOCAL-009-012 viewer and journey foundations | `packages/cli/src/viewer-session.ts`, `viewer-renderer.ts`, `report-view.ts`, `cli-fixture.ts`, `local-journey.test.ts` | tests cover loopback session boundaries, escaped rendering, report validation, subprocess fixtures, and local journey projections | implemented locally; browser packaging and cross-platform final drill remain downstream
 POLICY-012/013 CI migration and adversarial policy matrix | `packages/cli/src/scan.ts`, shared policy/failure/exception tests | CI routes policy evaluation while preserving exits; adversarial tests cover four outcomes, incomplete precedence, stale/missing evidence, expiry, and deterministic ordering | implemented locally; hosted policy authority remains downstream
 POLICY-005-010 policy foundations | `packages/shared/src/baseline*.ts`, `exception*.ts`, `policy-evaluation.ts`, `policy-explanation.ts` | focused tests cover bounded baseline store/compare, exception scope/expiry, four-way evaluator outcomes, incomplete precedence, and explanation projections | implemented locally; full command/hosted integration remains downstream
 IMPORT-012 evidence commands | `packages/cli/src/evidence-transfer.ts`, `packages/cli/src/index.ts` | command surface supports bounded file/stdin input, file/stdout output, JSON/quiet modes, source format/digest summary, and deterministic failure exit | implemented locally; deeper standards conformance remains downstream
 GRAPH-009 local diff command | `packages/cli/src/diff.ts` | diff test covers malformed snapshot rejection and deterministic local exit behavior; reader caps bytes and collection sizes | implemented locally; hosted history remains downstream
 POLICY-003/004 policy profiles | `packages/shared/src/policy-profiles.ts` | policy profile tests cover critical-only Free defaults and bounded configurable Pro confidence/severity/freshness/Hunt settings | implemented locally; entitlement/evaluator wiring remains downstream
 POLICY-001/002 policy schema and loader | `packages/shared/src/policy-document.ts`, `policy-loader.ts` | policy tests cover required evidence fields, strict unknown-field rejection, deterministic precedence, bounded layers, and effective digest | implemented locally; hosted policy authority remains downstream
 GRAPH-001-008 graph/release foundations | `packages/shared/src/native-observation-adapter.ts`, `fingerprint-v1.ts`, `normalization.ts`, `correlation.ts`, `deduplication.ts`, `lineage-graph.ts`, `release-snapshot.ts`, `release-diff.ts` | focused tests cover subject-bound observations, stable fingerprints, normalization, disagreement retention, deduplication, lineage gaps, snapshots, and diffs | implemented locally; public diff command remains GRAPH-009
 IMPORT-001-011 evidence import/export foundations | `packages/shared/src/*importer.ts`, `provenance-*`, `detect-secrets-*`, `*exporter.ts` | focused tests cover bounded readers, structural validation, provenance matching, secret refusal, runner limits, and deterministic standards output | implemented locally; public command wiring remains IMPORT-012
 ENGINE-010-015 Trivy evidence foundations | `packages/shared/src/trivy-*.ts`, `fixture-engine.ts` | parser, metadata, compatibility, failure policy, evidence replay, and fixture tests pass | implemented locally; adapter execution/graph integration remains downstream
 ENGINE-004 safe archive downloader/extractor | `packages/shared/src/archive-extractor.ts`, `tar-extractor.ts` | archive safety/extractor tests cover bounded downloads, checksum, traversal, links, duplicates, and partial-output cleanup | implemented and verified locally; trusted source/signature verification remains ENGINE-005
 ENGINE-005 trusted engine source/artifact verification | `packages/shared/src/engine-trust.ts` | engine-trust tests cover exact HTTPS origins, canonical Ed25519 signatures, source/size/digest binding, and fail-closed mismatch | implemented locally; mirror/update orchestration remains ENGINE-007/008
 ENGINE-007 mirror/offline source selection | `packages/shared/src/engine-source.ts` | engine-source tests cover cache preference, HTTPS mirror validation, offline no-source, allowlisted origin, signature, and freshness gates | implemented locally; CLI orchestration remains ENGINE-008
 AGENT-005 package evidence availability | `packages/mcp/src/tools/check-package.ts` | 5 focused tests: clean complete lookup, OSV outage warning, blocking high CVE, registry/latest-version gaps, malformed direct calls | implemented locally; incomplete npm/OSV/latest evidence is explicit; runtime/network safety remains downstream
 AGENT-005 check-before-write direct boundary | `packages/mcp/src/tools/check-before-write.ts` | 1 focused test: malformed code/path/language/context inputs rejected before filesystem work | implemented locally; detector/runtime safety remains downstream
 AGENT-005 explain-finding direct boundary | `packages/mcp/src/tools/explain-finding.ts` | 2 focused tests: malformed/bounded rule rejection and unknown-rule response preservation | implemented locally; rule-bank completeness remains downstream
 AGENT-005 strict direct tool shapes | `packages/mcp/src/tools/check-before-write.ts`, `check-package.ts` | 6 focused tests include unknown-field rejection for both tools | implemented locally; runtime/detector safety remains downstream
 AGENT-005 MCP dispatch boundary | `packages/mcp/src/server.ts`, `packages/mcp/src/server.test.ts` | dispatch tests reject non-object/oversized arguments and oversized response payloads before transport | implemented locally; full transport/error taxonomy remains downstream
AGENT-005 bounded network lookup lifecycle | `packages/mcp/src/tools/check-package.ts` | 5 package tests pass after replacing uncancelled timeout races with AbortController cancellation | implemented locally; network policy/proxy controls remain downstream
LOCAL-001/HUNT-009 machine-safe Hunt shell | `packages/cli/src/hunt.ts`, `packages/cli/src/index.ts` | JSON and quiet modes preserve explicit denied/unavailable states and exit semantics without implying Hunt execution | implemented at rewritten `fea28ac`, covered by `16f0315`; supported recipe execution and approval/entitlement enforcement remain downstream
LOCAL-002 bounded configuration inputs | `packages/shared/src/config.ts` | ignore paths, Hunt duration/skip lists, and Attest paths/text are bounded before scan configuration is consumed; migration warnings remain compatible | implemented at `7ce370e`, verified by shared suite (281/281); full versioned engine/Hunt/record/telemetry migration remains downstream
LOCAL-002 implicit config path safety | `packages/scanner/src/index.ts`, `packages/scanner/src/config-path.test.ts` | implicit JavaScript config is accepted only from a bounded regular file; symlinked config falls back safely without loading it | implemented at `526951b`; scanner suite 64/64 passes
LOCAL-002 ignore-file boundary | `packages/scanner/src/index.ts`, `packages/scanner/src/config-path.test.ts` | `.verglosignore` is read only from a regular file within byte, line-count, and line-length bounds; unsafe/oversized files are ignored safely | implemented at `58acb71`; scanner suite 65/65 passes
LOCAL-002 fail-closed ignore policy | `packages/scanner/src/index.ts`, `packages/scanner/src/config-path.test.ts` | files exceeding line or line-length bounds are rejected in full rather than partially applied | implemented at `a068396`; scanner suite 65/65 passes
LOCAL-002 combined ignore-path cap | `packages/scanner/src/index.ts`, `packages/scanner/src/config-path.test.ts` | `.verglosignore` entries cannot bypass the schema’s total 256-path bound when appended to config | implemented at `6407d22`; scanner suite 65/65 passes
LOCAL-001 Attest output boundary | `packages/cli/src/attest.ts`, `packages/cli/src/index.ts`, `packages/cli/src/local-command-options.test.ts` | legacy Attest shell exposes JSON/quiet denied or unavailable states without implying Release Record signing | implemented at `772b83d`; CLI suite 93/93 plus one sandbox skip
LOCAL-001 Explain output boundary | `packages/cli/src/explain.ts`, `packages/cli/src/index.ts`, `packages/cli/src/local-command-options.test.ts` | Explain list/lookup exposes deterministic JSON, stable unknown-rule error, and quiet suppression without changing human defaults | implemented at `76a6423`; CLI suite 93/93 plus one sandbox skip
LOCAL-003 scan coverage manifest | `packages/shared/src/types.ts`, `packages/scanner/src/inspection-pipeline.ts`, `packages/scanner/src/inspection-pipeline.test.ts` | One opt-in snapshot binds producer coverage/ToolRun metadata, requested/executed capabilities, explicit limitations, and subject digests; native + adapter + import composition, progress, bounded concurrency, and pre/in-flight cancellation are tested | accepted at PR #37 `cf5ac3b`; matrix `34720089861` attempt 2 (9/9), self-scan `34720089870`, local Turbo test/typecheck/build 23/23. Trivy remains explicitly incomplete for unqualified vuln DB/policy freshness and unsupported capabilities; engine trust is computed-only.
LOCAL-003 Trivy product adapter | `packages/shared/src/trivy-adapter.ts`, `packages/shared/src/trivy-adapter.test.ts`, CLI snapshot command and Docker fixture | Pinned digest, no runtime pull, network disabled, read-only target/root, non-root, dropped capabilities, no-new-privileges, resource/time/output bounds, cleanup, redaction, diagnostics => incomplete | integrated and locally exercised at PR #37 `b7e5fa9`; offline misconfiguration fixture evidence only; no comprehensive vulnerability/secret coverage or publisher provenance claim
LOCAL-003 imported subject binding | `packages/shared/src/in-toto-import.ts`, `packages/shared/src/sbom-import.ts`, `packages/scanner/src/inspection-pipeline.test.ts` | Imported provenance/SBOM evidence binds only when selected subject content digests match; unbound/mismatched imports remain explicitly incomplete | corrected at `cec0648`; matched/mismatched digest cases and integrated import orchestration pass at exact PR #37 head
LOCAL-004 scan compatibility projection | `packages/cli/src/scan.ts`, `packages/cli/src/machine-output-process.test.ts`, reporter process tests | Default terminal/stdout, JSON schema 2.0.0, HTML rendering, and report filenames remain backward compatible; schema 1.1 inspection snapshot is opt-in and no-overwrite tested | accepted at PR #37 `cf5ac3b`; full local Turbo checks 23/23 and exact-head hosted matrix/self-scan pass
HOSTED-011/012 report ownership fail-closed | `verglos-web/src/app/reports/[id]/page.tsx`, `src/lib/report-access.test.ts` | Authenticated report reads require a provisioned local user and exact report ownership; missing identity no longer falls through | implemented at `5e3a244`; web suite 40/40 and typecheck pass
HOSTED report severity projection | `verglos-web/src/app/reports/[id]/page.tsx`, `src/lib/reports/scan-counts.ts`, `src/lib/reports/scan-counts.test.ts` | Stored finding severities are counted into the rendered report instead of being replaced with zeroes | implemented at `920de3a`; web suite 41/41 and typecheck pass
VERIFY-WEB-001 public receipt identity guard | `verglos-web/src/app/record/verify/[receiptId]/page.tsx`, `src/lib/organizations/public-receipt-route.test.ts` | Public receipt pages reject overlong or non-URL-safe identities before any database lookup | implemented at `6266f69`; web suite 42/42 and typecheck pass
VERIFY-WEB-002 public attestation hash guard | `verglos-web/src/app/verify/[hash]/page.tsx`, `src/lib/attest/public-hash-route.test.ts` | Public attestation lookups accept only the exact 12-character base64url hash format emitted by the minting contract | implemented at `4e9c4bb`; web suite 43/43 and typecheck pass
DIST-002 CI qualification gate | `.github/workflows/self-scan.yml`, `.github/workflows/publish.yml` | Protected PR self-scan and npm publish workflows run build, full tests, and typecheck before scan/publish | implemented at `2f162d2`; YAML diff check pass; hosted workflow execution remains pending
DIST-001 public package contents audit | `scripts/check-package-contents.mjs`, `.github/workflows/publish.yml` | Release audit checks six public package manifests, dist roots, CLI bin, and forbidden private/internal packaged paths before publish | implemented at `beb8a54`; full build and package audit pass; tarball matrix remains open
DIST-001 npm tarball smoke test | `.github/workflows/publish.yml` | CI packs all six public packages and scans archive entries for forbidden private/internal paths before publish | implemented at `79a9b55`; local smoke test passed for six archives; hosted workflow execution remains pending
DIST-001 install-hook/bin guard | `scripts/check-package-contents.mjs` | Public packages cannot declare install-time hooks, and `verglos` must publish exactly one `dist/index.js` bin | implemented at `6ab8bca`; package audit passes for six packages
DIST-001 pull-request boundary gate | `.github/workflows/self-scan.yml` | The public package contents audit runs on every protected PR self-scan before release qualification | implemented at `a525add`; workflow syntax/diff check pass; hosted execution remains pending
DIST-003 release checksum artifacts | `.github/workflows/publish.yml` | Publish workflow creates SHA256SUMS for all six packed npm artifacts and retains them as a bounded CI artifact | implemented at `e5e4e72`; historical state at that commit lacked SBOM and clean-consumer verification, both now wired; release notes and actual provenance review remain open
LIC-003 dependency notice generation (preparatory evidence) | `scripts/package-license-text.mjs`, `scripts/generate-third-party-notices.mjs`, `scripts/generate-third-party-notices.test.mjs`, `.github/workflows/publish.yml` | Preserves separate LICENSE/NOTICE text for every installed version path, deduplicates identical texts, bounds files at 512 KiB, and emits review-required markers for unsafe/unreadable entries; current workflow stages notices in all six archives. | CLI `9a1dad4`, `4435964`; LIC-001 inventory is complete, while LIC-002 external records, full legal/artifact and web qualification remain open
DIST-WEB-001 web CI quality workflow | `verglos-web/.github/workflows/verify.yml` | Protected web changes run typecheck, 87/87 PostgreSQL-backed tests, schema/migration validation, production build, public-boundary audit, high/critical dependency audit, CycloneDX 1.6 SBOM, component license inventory/tests, tracked-secret guard, and retained evidence artifact | implemented by `3c12ed9`, `a046ad8`, and `67bbe09`; exact-head hosted run `34694532678` plus GitGuardian and Vercel pass; accepted
DIST-WEB-001 dependency-license detail | `verglos-web/scripts/generate-sbom.mjs`, `scripts/license-inventory.mjs`, `scripts/license-inventory.test.mjs` | CycloneDX component/dependency graph and sanitized license metadata are generated from the pinned web lock; path/author/evidence fields are omitted from the license report | 413 components; 79 flagged for manual review, 53 with no declared license; legal/redistribution clearance remains open under R-018 and separate licensing backlog items
AGENT-003 unknown MCP tool contract | `packages/mcp/src/server.ts`, `packages/mcp/src/server.test.ts` | Unknown dispatch names fail closed with stable structured `MCP_UNKNOWN_TOOL` usage errors instead of prose stubs | implemented at `f196b20`; MCP suite 18/18 and typecheck pass
LOCAL-003 skipped progress state | `packages/shared/src/types.ts`, `packages/scanner/src/index.ts`, `packages/scanner/src/orchestration.test.ts`, `packages/cli/src/scan.ts` | Explicit provenance opt-out reports `skipped` rather than falsely claiming a completed phase; spinner uses matching wording | implemented at `72a1c99`; scanner 67/67 and CLI 94/94 plus one sandbox skip
ENGINE-002 cache path safety | `packages/shared/src/engine-cache.ts` | 4 engine-cache tests include traversal rejection for install/read paths | implemented locally; engine provenance/update/rollback remain downstream
 AGENT-005 deterministic scan projection | `packages/mcp/src/tools/scan.ts` | 2 focused tests: severity/rule/file/line ordering and direct input-boundary rejection, including unknown fields | implemented locally; scanner execution/network safety remains downstream
 AGENT-005 alpha Hunt/Attest input boundary | `packages/mcp/src/input-validation.ts`, `packages/mcp/src/server.ts` | 1 focused validator test: required bounded strings, enum verdicts, object signing config, and unknown-field rejection across five alpha tools | implemented locally; tools remain explicit v2.0.0-alpha stubs and execution/approval gates remain downstream
 LOCAL-001 machine output under quiet | `packages/cli/src/index.ts` | command contract review confirms evidence import/export preserve JSON output with `--quiet`, while human text remains suppressible | implemented locally; universal option registration and process-fixture coverage remain open
 LOCAL-001 policy routing preserves JSON | `packages/cli/src/index.ts` | focused command-contract test confirms `scan --policy` and `ci --policy` forward both `--json` and `--quiet` to policy evaluation | implemented locally; full process fixtures remain open
 LOCAL-001 quiet watch output | `packages/cli/src/index.ts` | command-contract test confirms watch lifecycle notices are suppressed for `--quiet` and `--json` while rescans remain active | implemented locally; full watch process fixture remains open
 LOCAL-001 precommit quiet output | `packages/cli/src/precommit.ts`, `packages/cli/src/index.ts` | command-contract test confirms precommit supports `--quiet` while JSON remains machine-readable and timeout remains non-blocking | implemented locally; full process fixture remains open
LOCAL-001 updater output boundary | `packages/cli/src/update.ts`, `packages/cli/src/index.ts`, `packages/cli/src/update.test.ts`, `packages/cli/src/machine-output-process.test.ts` | current/newer/offline/install-failure paths emit stable bounded JSON and exits; historic `--update` human alias and quiet suppression are process-tested; installer output cannot contaminate JSON | local CLI commit `4f8f98e`; full CLI suite including loopback test, typecheck, and build pass; LOCAL-001 remains open pending complete common-option contract reconciliation and acceptance review
 LOCAL-002 nested config migration warnings | `packages/shared/src/config.ts` | shared config tests verify unknown Hunt/Attest/white-label fields are surfaced deterministically while malformed values remain invalid | implemented locally; full versioned section migration remains open
| Capability | Contract | Backlog IDs | Tests required | Public state |
|---|---|---|---|---|
| Command/capability truth | truth registry | TRUTH-001/002/003 | inventories reconcile with code; every public phrase remains bounded | enforced in `VERGLOS_TRUTH_REGISTRY.md` at `6038545` |
| Schema/version foundation | `VERGLOS_SCHEMA_VERSION_AND_CANONICAL_JSON.md` | CONTRACT-001 | 9 shared tests: ID/version grammar, compatibility, deterministic canonicalization, non-JSON rejection, byte/structure limits, redacted parse errors, legacy mapping, actionable upgrade | implemented at `84d3921`; domain validators remain CONTRACT-002-012 |
| Immutable subject identity | `VERGLOS_SUBJECT_CONTRACT.md` | CONTRACT-002 | 13 subject tests: seven kinds, ID recomputation, dirty worktree, missing digest, mutable OCI tag, mirror equivalence, registry/platform/path/digest bounds, version/unknown-field rejection | implemented at `1bc2b1b`; resolvers and mismatch-to-INCOMPLETE remain TARGET-001-010/CONTRACT-008 |
| Producer health and tool runs | `VERGLOS_ENGINE_RUN_AND_HEALTH_CONTRACT.md` | CONTRACT-003 | 13 shared tests: health round trips, absence/incompatibility/staleness, trust/freshness references, duplicates, process/coverage/timing/capability contradictions, no target execution, version upgrade | implemented at `a71fba7`; adapters/execution/raw replay/final policy remain ENGINE/CONTRACT-004/008 |
| Canonical observations | `VERGLOS_OBSERVATION_CONTRACT.md` | CONTRACT-004 | 10 observation tests: origin/raw lineage, locations, evidence redaction, extension isolation/bounds, HTTPS references, unknown mappings, version/strict fields | implemented at `65ea279`; fingerprint/correlation/policy remain GRAPH/POLICY |
| AI-change context | `VERGLOS_AI_CHANGE_CONTEXT_CONTRACT.md` | CONTRACT-005 | 8 shared tests: estimate-only heuristics, reproducibility/limitations, declaration authenticity, signature evidence/status, build-provenance non-inference, subject/range/version bounds | implemented at `f6be31e`; legacy adapter/aggregation/UI wording remain downstream |
| Verification attempts | `VERGLOS_VERIFICATION_ATTEMPT_CONTRACT.md` | CONTRACT-006 | 11 shared tests: six outcomes, evidence/non-execution invariants, signature/approval gates, isolation/runtime/cleanup, HTTPS-origin network policy, resource/timing/version bounds | implemented at `fc4d8d2`; sandbox enforcement, recipes, execution, leakage tests, and legacy verdict migration remain AGENT/HUNT/CONTRACT-012 |
| Policy exceptions and approvals | `VERGLOS_EXCEPTION_AND_APPROVAL_CONTRACT.md` | CONTRACT-007 | 11 shared tests: canonical request binding, exact bounded scope, duplicate/wildcard denial, controls/triggers, finite validity, human approval, denial/expiry/timing, subject/observation mismatch, version upgrades | implemented at `2dd8ea3`; hosted RBAC, revocation events, policy effects, UI, and audit-store integrity remain HOSTED/POLICY/CONTRACT-008-010 |
| Policy evaluation | `VERGLOS_POLICY_EVALUATION_CONTRACT.md` | CONTRACT-008 | 11 shared tests: PASS/REVIEW/BLOCK/INCOMPLETE, 0/2/1/3 exits, incomplete precedence, evidence failure/freshness, identity, advisory bounds, unique/stable ordering, derived-field tamper rejection, version upgrade | implemented at `dc9e0b4`; policy documents, profiles, exception effects, and production evaluator remain POLICY-001-013 |
| Release decision | `VERGLOS_RELEASE_DECISION_CONTRACT.md` | CONTRACT-009 | 7 shared tests: canonical evaluation digest/reference, incomplete propagation, one matching primary subject, unique subjects/approvals, policy cross-binding, time bounds, strict fields/version upgrade | implemented at `03533ab`; authorization, signing, record assembly, deployment, and public verification remain downstream |
| Release Record manifest | `VERGLOS_RECORD_MANIFEST_CONTRACT.md` | CONTRACT-010 | 6 shared tests: deterministic member/extension ordering, required decision membership, duplicate/path controls, redaction/omitted-size bounds, namespaced extensions, schema/version references | implemented at `c1fa719`; archive transport, byte verification, traversal/bomb/symlink safety, signing, and custody remain RECORD |
| Typed failure taxonomy | `VERGLOS_FAILURE_TAXONOMY_CONTRACT.md` | CONTRACT-011 | 4 shared tests: nine categories/exit mappings, namespace and exit contradictions, retry restrictions, strict/future-version handling | implemented at `a1e8f1f`; command adapters, provider error mapping, telemetry redaction, and acceptance fixtures remain downstream |
| Frozen fixtures and validators | `VERGLOS_CONTRACT_FIXTURE_HARNESS.md` | CONTRACT-012 | 2 shared tests: valid/invalid/legacy fixture classes, deterministic canonical output, bounded malformed/unsupported handling | implemented at `d4b1296`; downstream consumers use the shared dispatch boundary |
| Target resolver boundary | `VERGLOS_TARGET_RESOLVER_CONTRACT.md` | TARGET-001 | 2 shared tests: explicit target syntax, capability mapping, no-project-execution context | implemented at `3b1877e`; concrete target resolvers remain TARGET-002-010 |
| Git repository resolver | `VERGLOS_REPOSITORY_RESOLVER.md` | TARGET-002 | 2 shared tests: typed non-repository/invalid-target handling and Git metadata boundary | implemented at `1ec9ba8`; platform/path and deeper dirty/submodule qualification remain open |
| Package metadata resolver | `VERGLOS_PACKAGE_RESOLVER.md` | TARGET-003 | 2 shared tests: metadata-only package identity and missing/malformed metadata | implemented at `ee5b4b9`; lockfile/build/workspace enrichment remains open |
| Filesystem subject resolver | `VERGLOS_FILESYSTEM_RESOLVER.md` | TARGET-004 | 2 shared tests: deterministic tree hashing, symlink non-following, non-directory rejection | implemented at `a3de37a`; permission/special-file corpus remains open |
| Generic artifact resolver | `VERGLOS_ARTIFACT_RESOLVER.md` | TARGET-005 | 2 shared tests: deterministic file/directory hashing and missing-target rejection | implemented at `0fb7f21`; adversarial archive/special-file corpus remains open |
| SBOM subject resolver | `VERGLOS_SBOM_RESOLVER.md` | TARGET-006 | 2 shared tests: CycloneDX byte binding and unsupported-format rejection | implemented at `b72e2b6`; full CycloneDX/SPDX validation corpus remains open |
| OCI reference parser | `VERGLOS_OCI_REFERENCE_CONTRACT.md` | TARGET-007 | 2 shared tests: digest/tag/platform parsing and unsafe-reference rejection | implemented at `69a5eaa`; registry resolution remains TARGET-008 |
| OCI manifest resolver | `VERGLOS_OCI_RESOLVER.md` | TARGET-008 | 2 shared tests: index child/platform preservation and tag/invalid-document rejection | implemented at `14888ba`; network fetch/platform selection remain downstream |
| Local OCI layout resolver | `VERGLOS_OCI_LAYOUT_RESOLVER.md` | TARGET-009 | 2 shared tests: content-addressed blob verification and missing-blob rejection | implemented at `bc2259f`; tar/archive hardening remains open |
| Source-to-artifact linkage | `VERGLOS_SOURCE_ARTIFACT_LINKAGE.md` | TARGET-010 | 2 shared tests: matched/unavailable and mismatch classification | implemented at `b6b3811`; build provenance correlation remains open |
| Target inspect command | `VERGLOS_TARGET_INSPECT_COMMAND.md` | TARGET-011 | CLI typecheck plus target-inspect process test; deterministic JSON/human output and exit mapping | implemented at `230c4a7`; OCI/network target modes remain gated |
| EngineAdapter contract | `VERGLOS_ENGINE_ADAPTER_CONTRACT.md` | ENGINE-001 | 1 shared test: bounded timeout and explicit network declaration invariants | implemented at `f1a86dd`; concrete Trivy adapter remains ENGINE-002+ |
| Trivy adapter health boundary | `VERGLOS_TRIVY_ADAPTER.md` | ENGINE-001 (preparatory) | 1 shared test: explicit healthy/unavailable health probe | implemented at `609a7b1`; signed engine manifest and managed execution remain ENGINE-002+ |
| Engine manifest contract | `VERGLOS_ENGINE_MANIFEST.md` | ENGINE-002 | 2 shared tests: signed artifact metadata/canonicalization and mutable-digest rejection | implemented at `e95a7b6`; signature verification and install lifecycle remain ENGINE-003+ |
| Engine cache transaction | `VERGLOS_ENGINE_CACHE.md` | ENGINE-003 | 2 shared tests: digest-verified atomic install and mismatch rejection | implemented at `d54cb00`; fsync/concurrency qualification remains open |
| Archive safety gate | `VERGLOS_ARCHIVE_SAFETY.md` | ENGINE-004 (preparatory) | 2 shared tests: traversal/link/duplicate/size rejection | implemented at `7bcd472`; tar/zip decoding and downloader remain unshipped |
| Atomic tar extraction | `VERGLOS_ARCHIVE_SAFETY.md` | ENGINE-004 (preparatory) | 1 shared test: staged validated file extraction | implemented at `4e0709e`; compressed tar/zip parsing and downloader remain open |
| Bounded gzip tar extraction | `VERGLOS_ARCHIVE_SAFETY.md` | ENGINE-004 (preparatory) | 1 shared test: gzip decompression through atomic extractor | implemented at `16b649e`; zip parsing and downloader remain open |
| Engine cache status | `VERGLOS_ENGINE_CACHE.md` | ENGINE-008 | 1 shared test: read-only listing of digestable installed entries | implemented at `412be88`; remote mirror transport remains downstream |
| CLI engine status | `VERGLOS_ENGINES_STATUS_COMMAND.md` | ENGINE-008 | CLI typecheck plus cache-status process test | implemented at `b1e1431`; deterministic read-only status is shipped |
| CLI engine install/update/rollback | `VERGLOS_ENGINES_INSTALL_COMMAND.md` | ENGINE-008 | 10 CLI tests: approval, JSON/quiet exits, digest/regular-file bounds, compatibility manifest matching, Ed25519 verification, update/rollback labels | implemented at `0babdef`, `da407cf`, `19b8a9c`, `5b50408`; remote mirror activation remains downstream |
| Importer registry | `VERGLOS_IMPORTER_REGISTRY.md` | IMPORT-001 (preparatory) | 2 shared tests: SARIF detection/source digest and oversized/ambiguous rejection | implemented at `779940f`; format-specific normalization remains open |
| SARIF importer | `VERGLOS_SARIF_IMPORTER.md` | IMPORT-002 (preparatory) | 2 shared tests: SARIF 2.1 run preservation and version/malformed-run rejection | implemented at `08c6a44`; observation normalization and URI/path corpus remain open |
| SARIF URI safety | `VERGLOS_SARIF_IMPORTER.md` | IMPORT-002 (preparatory) | 1 shared test: traversal/unsafe artifact URI rejection | implemented at `9b9d8b6`; full location normalization remains open |
| CycloneDX importer | `VERGLOS_CYCLONEDX_IMPORTER.md` | IMPORT-003 (preparatory) | 2 shared tests: component/dependency preservation and malformed-array rejection | implemented at `60f9b50`; full component/license/subject normalization remains open |
| CycloneDX component integrity | `VERGLOS_CYCLONEDX_IMPORTER.md` | IMPORT-003 (preparatory) | existing importer tests plus required component identity/hash-shape validation | implemented at `6774586`; full normalization remains open |
| SPDX importer | `VERGLOS_SPDX_IMPORTER.md` | IMPORT-004 (preparatory) | 2 shared tests: namespace/collection preservation and malformed-collection rejection | implemented at `e5d5e01`; full checksum/license/subject normalization remains open |
| SPDX package/file integrity | `VERGLOS_SPDX_IMPORTER.md` | IMPORT-004 (preparatory) | required SPDXID/name and fileName validation | implemented at `808e91b`; full checksum/license/subject normalization remains open |
| CycloneDX VEX importer | `VERGLOS_CYCLONEDX_VEX_IMPORTER.md` | IMPORT-005 (preparatory) | 2 shared tests: analysis assertion preservation and malformed-analysis rejection | implemented at `8f92e41`; component-link normalization remains open |
| in-toto/SLSA provenance importer | `VERGLOS_PROVENANCE_IMPORTER.md` | IMPORT-006 (preparatory) | 2 shared tests: subject/builder preservation and missing-subject rejection | implemented at `845a4fa`; signature verification/provider adapters remain open |
| detect-secrets baseline importer | `VERGLOS_DETECT_SECRETS_IMPORTER.md` | IMPORT-008 (preparatory) | 2 shared tests: metadata/finding preservation and malformed-baseline rejection | implemented at `51d3b10`; exporter and optional runner remain open |
| Optional detect-secrets runner | `VERGLOS_DETECT_SECRETS_RUNNER.md` | IMPORT-009 (preparatory) | 1 shared test: explicit-path unavailable classification | implemented at `d40a322`; bounded scan execution remains open |
| Native finding projection | `VERGLOS_NATIVE_FINDING_ADAPTER.md` | GRAPH-001 (preparatory) | 1 shared test: finding identity/provenance/remediation preservation | implemented at `69eed8c`; subject-bound Observation normalization remains open |
| Canonical fingerprint v1 | `VERGLOS_FINGERPRINT_V1.md` | GRAPH-002 (preparatory) | 2 shared tests: repeatability and identity/evidence-bound changes | implemented at `a71b174`; full correlation/dedup graph remains open |
| Severity/confidence normalization | `VERGLOS_NORMALIZATION_V1.md` | GRAPH-003 (preparatory) | 2 shared tests: original preservation/mapping and unknown severity exposure | implemented at `2945afa`; producer-specific normalization remains open |
| Observation correlation graph | `VERGLOS_CORRELATION_GRAPH.md` | GRAPH-004 (preparatory) | 1 shared test: exact grouping with producer/disagreement retention | implemented at `33c6e10`; fuzzy matching/dedup projection remain open |
| Deduplication projection | `VERGLOS_DEDUPLICATION.md` | GRAPH-005 (preparatory) | 1 shared test: exact duplicate grouping plus bounded near-match review candidates | implemented at `8f23f27`; subject-bound Observation normalization and full graph integration remain open |
| Source-to-artifact lineage graph | `VERGLOS_LINEAGE_GRAPH.md` | GRAPH-006 (preparatory) | 2 shared tests: deterministic nodes/edges, unavailable endpoints, and mismatch gaps | implemented at `ff64690`; provenance verification and producer integrations remain open |
| Release snapshot format | `VERGLOS_RELEASE_SNAPSHOT.md` | GRAPH-007 (preparatory) | 1 shared test: canonical digest stability, sorted producer identities, and retained lineage gaps | implemented at `cc5c9ba`; policy/release consumers and diff engine remain open |
| Release diff engine | `VERGLOS_RELEASE_DIFF.md` | GRAPH-008 (preparatory) | 1 shared test: added/fixed/unchanged fingerprints and explicit identity/coverage/policy flags | implemented at `dbc06ee`; CLI rendering and severity-aware comparisons remain open |
| `verglos diff` command | `VERGLOS_DIFF_COMMAND.md` | GRAPH-009 (preparatory) | CLI test: malformed snapshot rejection; shared diff output remains deterministic and offline | implemented locally; full snapshot fixture/process coverage remains open |
| Policy document schema | `VERGLOS_POLICY_DOCUMENT.md` | POLICY-001 (preparatory) | 1 shared test: strict gates, advisory restrictions, unique checks, approval authorities, and canonical digest | implemented locally; loader precedence and evaluator integration remain open |
| Policy loader/merge precedence | `VERGLOS_POLICY_LOADER.md` | POLICY-002 (preparatory) | 1 shared test: layered check replacement, deterministic ordering, strict unknown-field rejection, and effective digest | implemented locally; config file discovery and evaluator integration remain open |
| Free policy profile | `VERGLOS_FREE_POLICY_PROFILE.md` | POLICY-003 (preparatory) | 1 shared test: critical blocking gate, explicit incomplete allowance, and no approval requirement | implemented locally; evaluator wiring remains open |
| Pro policy profile | `VERGLOS_PRO_POLICY_PROFILE.md` | POLICY-004 (preparatory) | 2 shared tests: configurable confidence/freshness/coverage/Hunt and approval controls | implemented locally; evaluator wiring and entitlement integration remain open |
| Baseline contract | `VERGLOS_BASELINE_CONTRACT.md` | POLICY-005 (preparatory) | 1 shared test: subject/policy binding, duplicate rejection, digesting, and stale/mismatch classification | implemented locally; concurrent local store and evaluator integration remain open |
| Local baseline store | `VERGLOS_BASELINE_STORE.md` | POLICY-005 (preparatory) | 1 shared test: atomic publication, owner-only file creation, and validated read-back | implemented locally; evaluator integration and user-facing baseline workflow remain open |
| Baseline comparison | `VERGLOS_BASELINE_COMPARISON.md` | POLICY-006 (preparatory) | 1 shared test: accepted-vs-new fingerprints with subject/policy-bound status | implemented locally; evaluator and CLI policy workflow remain open |
| Policy explanation renderer | `VERGLOS_POLICY_EXPLANATION.md` | POLICY-010 (preparatory) | 1 shared test: decision-first subject/policy/limitation/reason projection | implemented locally; CLI policy command and evaluator integration remain open |
| Agent action authority matrix | `VERGLOS_ACTION_AUTHORITY.md` | AGENT-001 (preparatory) | 1 shared test: approval-free inspect/propose and approval-required side effects | implemented locally; approval receipts and MCP integration remain open |
| Auditable approval receipt | `VERGLOS_APPROVAL_RECEIPT.md` | AGENT-002 (complete) | shared tests: exact request binding, bounded decision time, expiry, widened-target rejection, timezone-aware instant comparison, atomic persistence, tamper/symlink rejection, and request-ID replay rejection | implemented at `00155b4`, `4035b47`, `ebeb642`; runtime MCP/CLI enforcement is covered by integration tests |
| MCP tool authority metadata | `VERGLOS_MCP_AUTHORITY.md` | AGENT-003 (preparatory) | 1 shared test: legacy tool mapping and approval classification | implemented locally; MCP handler migration remains open |
| MCP discovery authority annotations | `VERGLOS_MCP_AUTHORITY.md` | AGENT-003 (preparatory) | 1 MCP test: shared authority metadata remains available to discovery consumers | implemented locally; handler contract migration remains open |
| MCP capability truth registry | `VERGLOS_MCP_CAPABILITY_TRUTH.md` | AGENT-004 (preparatory) | shared and MCP tests: unique tool inventory, plan/maturity/action/side-effect labels, immutable input/output fields, and `tools/list` metadata | implemented locally; entitlement integration and interoperability review remain open |
| Agent input bounds | `VERGLOS_AGENT_INPUT_BOUNDS.md` | AGENT-005 (preparatory) | 1 shared test: UTF-8 bounds for code/path/context/package inputs | implemented locally; handler integration and attribution projection remain open |
| MCP safe-tool bounds integration | `VERGLOS_AGENT_INPUT_BOUNDS.md` | AGENT-005 (preparatory) | MCP typecheck: pre-write and package handlers validate bounds before work | implemented locally; full handler fixture coverage remains open |
| Remediation proposal contract | `VERGLOS_REMEDIATION_PROPOSAL.md`, `packages/mcp/src/tools/explain-finding.ts` | AGENT-006 | shared and MCP tests: bounded proposal with exact subject/file scope, explicit no-network/no-mutation invariants, tests, policy effect, and uncertainty | implemented at `9ad98a6`; mutation/application remains separately gated by AGENT-007 |
| Remediation approval gate | `VERGLOS_REMEDIATION_APPROVAL.md`, `packages/cli/src/fix.ts`, `packages/cli/src/index.ts` | AGENT-007 (preparatory) | Focused CLI tests 20/20; canonical workspace receipt binding; symlinked `src/` cannot redirect writes; rollback atomically replaces a raced-in symlink without changing its external target; CLI typecheck and Turbo 23/23 pass; hosted self-scan and nine platform cells pass on `d7430a5` | `c59126e`, `bda23e0`, `d7430a5`; selected-test semantics and end-to-end CLI failure qualification remain open |
| Declarative Hunt recipe schema | `VERGLOS_HUNT_RECIPE.md`, `packages/shared/src/hunt-recipe.ts` | HUNT-001 | Shared schema tests cover required/versioned fields, digest-pinned command, assertions/inputs, isolation and bounded CPU/memory/disk/time/process/output/network limits, denied/allowlisted network constraints, cleanup, redaction, and signature metadata. Full CLI tests/typecheck/build pass at `15457ba`; exact-head PR #36 self-scan and all nine platform cells pass (`34713028173`, `34713028112`). | accepted at CLI commit `15457ba`; cryptographic signature verification, trusted feed/license provenance, planner, and execution are separate open HUNT-002/003/008/009 criteria |
| Hunt recipe trust store and signed feed verifier | `packages/shared/src/hunt-recipe-trust.ts`, `hunt-recipe-trust.test.ts`, Hunt execution gate/planner | HUNT-002 (partial; not accepted) | CLI commit `40b16dc` verifies canonical Ed25519 feed bytes against exact configured HTTPS-origin/key pins; binds canonical recipe digest and publisher-declared license/source plus embedded license-text SHA-256; rejects unknown feed/key, origin mismatch, invalid signature, out-of-validity feed/key, unknown/revoked recipe, recipe digest/signer/status mismatch, and license-text digest mismatch. Shared adversarial fixtures cover tampering, expiry, revocation, unknown entries, and feed-shadow ordering; execution uses the supplied approval timestamp for expiry. Full uncached CLI monorepo test/typecheck/build: 23/23 Turbo tasks pass. | cryptographic mechanism is implemented locally; HUNT-002 remains open because there is no provisioned/independently verified official publisher root/feed or real licensed recipe source, and no durable CLI trust-store ingestion/runtime feed integration. Embedded source URL is a signed publisher declaration, not a network fetch or legal clearance. |
| Hunt recipe planner/dry run | `VERGLOS_HUNT_PLANNER.md` | HUNT-003 (preparatory) | 1 shared test: exact rule/subject matching and execution-free plan projection | implemented locally; signed recipe selection and executor remain open |
| Hunt execution authorization gate | `VERGLOS_HUNT_EXECUTION_GATE.md` | HUNT-003 (preparatory) | 1 shared test: trusted recipe, exact target, and execute approval requirements | implemented locally; sandbox executor and verdict recording remain open |
| Hunt verdict/failure classifier | `VERGLOS_HUNT_VERDICT.md` | HUNT-007 (preparatory) | shared test: all six verdicts plus timeout/environment/policy precedence remain distinct | implemented locally; executor evidence and adversarial suite remain open |
| Hunt output redaction | `VERGLOS_HUNT_REDACTION.md` | HUNT-006 (preparatory) | 1 shared test: credential-shaped redaction and UTF-8 output cap with truncation flag | implemented locally; synthetic-input pipeline and end-to-end leakage suite remain open |
| Local content-addressed record store | `VERGLOS_RECORD_STORE.md` | RECORD-001 | shared tests: atomic member publication, digest-verified read, traversal/symlink rejection, bounded streaming, duplicate/path guards, and concurrent-write isolation | store contract is complete; archive/container assembly, signing, and hosted custody remain separate gates |
| Record member descriptor | `VERGLOS_RECORD_STORE.md` | RECORD-002 (preparatory) | 1 shared test: byte-bound digest and manifest metadata projection with path safety | implemented locally; full `.vgl` assembly remains open |
| Release Record assembly/package boundary | `VERGLOS_RECORD_ASSEMBLY.md`, private `VERGLOS_RECORD_PACKAGE_DECISION.md`, `packages/shared/src/record-assembly.ts`, `packages/shared/src/record-package.ts`, CLI record create/pack/verify | RECORD-002 (pending exact-head CI) | Full synthetic 11-member graph validates subjects, run, observation, lineage, verification-attempt, exception/denied approval, policy/evaluation, decision, and generated redaction manifest. CLI flow creates local store, packs deterministic `directory-v1` with in-toto export/static viewer, verifies unsigned and trusted Ed25519-signed packages offline, excludes omitted bytes, and rejects wrong issuer/key, malformed/missing/extra/symlink/tampered content; viewer hides free-form canaries and carries non-verification/non-sanitization warnings. Focused CLI fixture 8/8; forced uncached CLI/shared test/typecheck/build 18/18; hosted self-scan/platform checks pending at `af13112`. |
| Release Record manifest digest | `VERGLOS_RECORD_DIGEST.md` | RECORD-003 (preparatory) | 1 shared test: deterministic canonical digest of validated manifest | implemented locally; reproducible full bundle pipeline remains open |
| Safe Release Record reader | `VERGLOS_RECORD_READER.md` | RECORD-004 (preparatory) | 1 shared test: manifest validation, member digest verification, and declared-size enforcement | implemented locally; archive bomb/symlink/version corpus remains open |
| Public Release Record projection | `VERGLOS_PUBLIC_RECORD_PROJECTION.md` | RECORD-011 (preparatory) | 1 shared test: safe-field allowlist excludes member payload metadata | implemented locally; hosted receipt and leakage corpus remain open |
| Release provenance predicate | `VERGLOS_RECORD_PROVENANCE.md` | RECORD-005 (preparatory) | 1 shared test: manifest digest, deduplicated subject IDs, and limitations binding | implemented locally; signature adapter and independent verifier remain open |
| `verglos policy check` command | `VERGLOS_POLICY_CHECK_COMMAND.md` | POLICY-011 (preparatory) | CLI tests cover malformed/oversized input, JSON/quiet/exit behavior, verified record-store policy-member evaluation, embedded evaluation, and unevaluated snapshot `INCOMPLETE` | bounded read-only record/snapshot boundary implemented locally; common command framework, full record production, and process fixtures remain open |
| Record command workflow | `VERGLOS_COMMAND_AND_UI_CONTRACT.md` | RECORD-009 (accepted at CLI PR #38 head `fb60d57f8d9723408f04c3ac1205c859df289344`) | Synthetic complete CLI create → receipt-approved local Ed25519 sign → package → trusted offline verify; fixed success/error exits, JSON/quiet, explicit no-upload result, useful tamper reason, canary exclusion; 13/13 focused, 18/18 uncached Turbo tasks, exact-head self-scan and nine platform jobs pass | local offline user-supplied-key workflow accepted; guided Sigstore/cosign, hosted receipt integration, and independent redaction proof remain open |
| CI policy-evaluation compatibility | `VERGLOS_POLICY_CHECK_COMMAND.md` | POLICY-012 (preparatory) | CLI typecheck plus registered `scan/ci --policy-evaluation <path>` routes | routes implemented locally; `scan --ci`, full process fixtures, and evaluator migration remain open |
| Policy adversarial decision matrix | `VERGLOS_POLICY_CHECK_COMMAND.md` | POLICY-013 (preparatory) | 1 shared table-driven test: PASS/BLOCK/REVIEW/INCOMPLETE decisions preserve exits | outcome matrix coverage added locally; exception, baseline, unknown-rule, and end-to-end integrations remain open |
| Read-only common output options | `VERGLOS_COMMAND_AND_UI_CONTRACT.md` | LOCAL-001 (preparatory) | CLI source contract plus scanner/config/reporter tests cover bounded `--config`, structured `--json`, `--policy` aliases, machine-safe precommit JSON, explain/Hunt/Attest shell modes, and symlink-safe `--output <dir>` reports | explicit config, JSON, policy, and report paths are wired locally; universal registration and process fixtures remain open |
| Config migration inspection | `VERGLOS_COMMAND_AND_UI_CONTRACT.md` | LOCAL-002 (preparatory) | 3 shared migration tests plus bounded explicit-config/symlink/malformed-config CLI coverage | legacy fallback remains compatible; warning surfacing, rewrite flow, and complete engine/Hunt/record/telemetry validation remain open |
| Tenant project authorization/data boundary | web `organizations/auth.ts`, `tenant-data.ts`, `scoped-db.ts`, `directory-repository.ts`, organization APIs | HOSTED-011 (accepted at PR head) | Scoped-only facade auto-enforces organization/project query context and insert identity; scope narrowing uses a private WeakMap of auth-created base clients rather than proxy layering. Actor-bound directory repository restricts listing/creation to the authenticated user. PostgreSQL tests cover omitted predicates, cross-user directory isolation, project inserts, and hostile IDs. Exact-head suite 76/76; typecheck, schema/migration checks, build pass; hosted run `34672637622`, GitGuardian, and Vercel pass. | web `179837a`, `08a8c46`, `b0e3067`, `39730f8`, `21c3b19`; HOSTED-011 checked. HOSTED-012 completed at `8263cf6` and run `34677302797` |
| Organization authorization matrix and route denial behavior | web `organizations/access.test.ts`, `access-resolver.ts`, `tenant-scope.test.ts`, tenant API handlers | HOSTED-012 (accepted) | Exhaustive role/action matrix; PostgreSQL resolver cases for non-member, missing organization, inactive member, forbidden role, and foreign/missing project masking; tests execute all 19 protected route methods with unauthenticated/forbidden outcomes and project-not-found outcomes where applicable, asserting fixed bounded responses and requested IDs/actions. Hosted Node 22 suite passes 81/81 with PostgreSQL active; typecheck, schema/migration, build, public-boundary, dependency, and tracked-secret checks pass. | web `8263cf6`; PR #32 run `34677302797`, GitGuardian and Vercel pass; operator/provider privileged-access controls remain in R-007 |
| Exact release retry boundary | web release API + `release-idempotency.test.ts` + `release-projection.test.ts` | VERIFY-WEB-001 (preparatory) | web 24/24 tests cover exact replay, changed decision, tenant/project mismatch, changed limitations, and deterministic allowlisted projection digests | full redacted record projection/object receipt ingestion remains open |
| Inspect plan boundary | `VERGLOS_COMMAND_AND_UI_CONTRACT.md` | LOCAL-003 (preparatory) | planner tests plus scanner orchestration tests: deterministic ordering, execution/network-off declarations, unsupported/duplicate/bound rejection, bounded detector concurrency, abort handling before target access, caller-list immutability, and detector-selection drift rejection | producer adapters, progress, coverage manifest, and snapshot production remain open |
| Legacy JSON report compatibility | `VERGLOS_COMMAND_AND_UI_CONTRACT.md` | LOCAL-004 (preparatory) | 1 reporter fixture: frozen top-level keys/types and no default `schemaId` | JSON serializer compatibility covered locally; HTML/process/path compatibility remains open |
| Release header projection | `VERGLOS_COMMAND_AND_UI_CONTRACT.md` | LOCAL-005 (preparatory) | 1 shared test: decision, primary subject, policy digest, limitations, explicit signer state, and no severity fields | pure projection added locally; reporter/UI/signing integration remains open |
| Change/action projection | `VERGLOS_COMMAND_AND_UI_CONTRACT.md`, `VERGLOS_RELEASE_DIFF.md` | LOCAL-006 accepted at PR #38 head `f5be35760df38b1086da04d5186d81179555cdeb` | `release-diff.test.ts`, `change-actions.test.ts`, and CLI `diff.test.ts` prove added/fixed/worsened/improved/unchanged states, severity uncertainty, target/producer coverage and blockers, identity/policy/lineage deltas, remediation, unassigned owner, rescan/Hunt non-authority, bounded JSON/human output | implemented and exact-head qualified; still unmerged/unreleased |
| Evidence/lineage projection | `VERGLOS_COMMAND_AND_UI_CONTRACT.md`, `VERGLOS_RELEASE_DIFF.md` | LOCAL-007 accepted at PR #38 head `f5be35760df38b1086da04d5186d81179555cdeb` | `release-snapshot.test.ts`, `release-diff.test.ts`, `change-actions.test.ts`, and CLI `diff.test.ts` prove v1.3 digest-verified safe attribution/evidence references, confidence, matching run time/engine health, limitations, v1.0-v1.2 compatibility, excerpt exclusion, invalid-evidence rejection, bounded omission counts, lineage delta and unresolved-lineage blockers | implemented and exact-head qualified; still unmerged/unreleased |
| Exception/export projection | `VERGLOS_COMMAND_AND_UI_CONTRACT.md` | LOCAL-008 (preparatory) | shared test: exact scope/approval projection, bounded controls/reversal window, and implemented export allowlist | pure projection remains read-only; `.vgl`, HTML/PDF, signing, viewer, and command integration remain unavailable |
| Loopback viewer session boundary | `VERGLOS_COMMAND_AND_UI_CONTRACT.md` | LOCAL-009 (preparatory) | 1 CLI test: loopback bind, unpredictable session token, exact-route/CSP enforcement, traversal denial, and clean shutdown | server boundary added locally; UI, browser launch, report validation, and hosted viewing remain open |
| Accessible local viewer renderer | `VERGLOS_COMMAND_AND_UI_CONTRACT.md` | LOCAL-010 (preparatory) | 1 CLI test: escaped dynamic text, semantic main/headings, decision visibility, and script/external-URL absence | static renderer added locally; accessibility audit, browser launch, and report wiring remain open |
| Report-view validation boundary | `VERGLOS_COMMAND_AND_UI_CONTRACT.md` | LOCAL-011 (preparatory) | 2 CLI tests: supported JSON projection rendering and rejection of HTML/record/malformed inputs | pure validation/render preparation added locally; browser/session wiring and full report formats remain open |
| CLI subprocess fixture harness | `VERGLOS_COMMAND_AND_UI_CONTRACT.md` | LOCAL-012 (preparatory) | 1 CLI test: captured exit/stdout/stderr and unexpected-file baseline | reusable harness added locally; no-account journey, network/process hooks, and OS matrix remain open |
| Local boundary journey fixture | `VERGLOS_COMMAND_AND_UI_CONTRACT.md` | LOCAL-012 (preparatory) | 1 CLI test: static release snapshot diff → header → viewer composition with no hosted dependency | direct helper boundary fixture only; real command entrypoints and effect capture remain open |
| Local path compatibility fixture | `VERGLOS_COMMAND_AND_UI_CONTRACT.md` | LOCAL-012 (preparatory) | 1 CLI test on macOS host: spaces/Unicode acceptance plus missing/NUL rejection for report-view preparation | host-native path coverage only; Windows/Linux execution remains unverified |
| Agent action authority lookup | `VERGLOS_AGENT_AND_MCP_CONTRACT.md` | AGENT-001 (preparatory) | 2 shared tests: complete action matrix, unknown-value rejection, side-effect approval alignment, and frozen metadata | lookup hardened locally; receipts and MCP enforcement remain open |
| Agent authorization gate | `VERGLOS_AGENT_AND_MCP_CONTRACT.md` | AGENT-002 (complete) | shared tests: receipt-free read actions, missing/mismatched/denied/expired/usable states, timezone-aware bounds, persisted receipt round-trip, and replay rejection | pure gate plus durable store and MCP/CLI enforcement are implemented; broader hosted audit custody remains separate |
| MCP read-only input validation | `VERGLOS_AGENT_AND_MCP_CONTRACT.md` | AGENT-003 (preparatory) | 1 MCP test: strict string validation and bounded rule/code/path inputs | check-before-write and explain-finding validation added locally; other tools and authority enforcement remain open |
| MCP capability discovery reconciliation | `VERGLOS_AGENT_AND_MCP_CONTRACT.md` | AGENT-004 (preparatory) | shared test plus server guard: tool/capability set equality, duplicate/drift rejection, deterministic output, frozen metadata | discovery drift now fails closed locally; entitlement and runtime side-effect enforcement remain open |
| MCP package input validation | `VERGLOS_AGENT_AND_MCP_CONTRACT.md` | AGENT-005 (preparatory) | 1 MCP validator test: strict package/version strings and shared UTF-8 bounds | package handler now rejects coercion locally; network lookup safety and full tool contract remain open |
| MCP scan input validation | `VERGLOS_AGENT_AND_MCP_CONTRACT.md` | AGENT-005 (preparatory) | 1 MCP validator test: absolute bounded project root, integer limit range, strict booleans, and unknown-field rejection | scan handler validates before execution locally; scanner network/runtime safety remains open |
| MCP scan coverage propagation | `packages/mcp/src/tools/scan.ts`, `packages/mcp/src/server.test.ts`, `packages/shared/src/mcp-capabilities.ts` | AGENT-003/005 (preparatory) | scan wrapper test preserves the scanner's exact coverage manifest; approved-network dispatch integration test asserts coverage and exact npm/OSV recipients; forced Turbo test/typecheck/build passes 23/23 | code at `b07d85f` is pushed to CLI PR #37; hosted self-scan/platform matrix pending. No checkbox credited: policy/authority reconciliation across all MCP handlers and complete AGENT-005 acceptance evidence remain open |
| Offline/mirror source policy | `VERGLOS_ENGINE_SOURCE_POLICY.md` | ENGINE-007 (preparatory) | 2 shared tests: cache precedence/HTTPS mirror and offline/unsafe-source denial | implemented at `9e6b230`; signed fetch integration remains open |
| Engine trust verification | `VERGLOS_ENGINE_TRUST.md` | ENGINE-005 | 1 shared test: Ed25519 verification over canonical unsigned manifest bytes | implemented at `b5f00fa`; trust-root rotation and downloader integration remain open |
| Engine source origin pinning | `VERGLOS_ENGINE_TRUST.md` | ENGINE-005 (preparatory) | 1 shared test: exact HTTPS origin allowlist | implemented at `7b1e418`; artifact downloader integration remains open |
| System engine inspection | `VERGLOS_SYSTEM_ENGINE.md` | ENGINE-006 | 1 shared test: explicit absolute path and unavailable probe handling | implemented at `34ea338`; capability negotiation remains open |
| Native JS/TS scan | command + observation | TRUTH-001, CONTRACT-001 | Current: 58 scanner tests in `packages/scanner/src/**/*.test.ts`; required: frozen detector fixtures and determinism | shipped; evidence: `VERGLOS_CLI_CAPABILITY_INVENTORY.md` |
| External evidence import | observation + adapter | IMPORT-001/002, ENGINES | SARIF/SBOM/VEX malformed and attribution fixtures | planned |
| Source-to-artifact identity | subject + lineage | TARGET-001, GRAPH-001 | digest mismatch/incomplete tests | planned |
| Release decision | policy decision | CONTRACT-002, POLICY | PASS/REVIEW/BLOCK/INCOMPLETE matrix | planned |
| Local viewer | command/UI contract | LOCAL epic | accessibility and export tests | planned |
| Hunt | agent safety + verification | AGENT/HUNT epic | Current: none; required: isolation, network, resource, verdict tests | partial shell; evidence: `packages/cli/src/hunt.ts`, `packages/hunt/src/index.ts` |
| Signed `.vgl` record | prove contract | PROVE epic | Current: none; hosted random-hash summary is not evidence; required: offline verification, tamper, redaction | planned; evidence: `VERGLOS_WEB_CAPABILITY_INVENTORY.md` |
| Monitoring | hosted data/ops | HOSTED/OPERATIONS | Current: 7 CLI management tests, 0 hosted tests; required: registration, idempotency, retry, advisory update, delivery | partial integration; evidence: both capability inventories |
| Plan enforcement | commercial contract | TRUTH-004, COMM/BILLING | Current: 27 CLI entitlement/JWT tests, 0 hosted tests; signed tokens now reject structurally invalid and future-issued claims before entitlement use; required: catalog, migration, concurrency, modified CLI, overage | partial; authority/migration: `VERGLOS_PLAN_AND_CAPABILITY_RECONCILIATION.md` |
| Open-core boundary | ownership + license class | TRUTH-005, LIC | Package/feed inventory, modified-CLI server enforcement, license/notice classifier, signing-identity rotation | decided; inventory: `VERGLOS_OPEN_CORE_AND_COMMERCIAL_BOUNDARY.md` |
| Third-party compliance | dependency/asset inventory | TRUTH-006, LIC/DIST | Clean-store classifier, artifact notices/SBOM, copied-file provenance, external engine/schema/fixture records | partial; baseline: `VERGLOS_THIRD_PARTY_INVENTORY.md`; redistribution blockers open |
| Telemetry and privacy | consent + data-field registry | TRUTH-007, OPS-012, hosted/agent/record/security epics | Outbound-request inventory; canary leakage tests; consent/revoke; retention/deletion; SSRF/egress; credential/log redaction | partial; baseline: `VERGLOS_TELEMETRY_AND_PRIVACY_INVENTORY.md`; runtime gates open |
| Hosted usage and cost | immutable usage/reservation/cost ledger | TRUTH-008, HOSTED-009, PLAN-WEB-001/005-010, OPS-013 | Replay/reconciliation; concurrency/idempotency; 80/100 thresholds; overage consent; provider-invoice and privacy tests | planned; design: `VERGLOS_HOSTED_COST_AND_USAGE_LEDGER.md`; current COGS unknown |
| Hosted data migration | tenant/application/subject/evidence migration map | TRUTH-009, HOSTED-001-013 | Clean schema; idempotent backfill; shadow parity; tenant negatives; old-client matrix; restore/rollback | planned; baseline: `VERGLOS_DATA_AND_SCHEMA_MIGRATION_INVENTORY.md`; no destructive migration authorized |
| CLI compatibility | current command/process contract | TRUTH-010, CONTRACT/AGENT/HUNT/RECORD/PLAN-CLI/DIST | One isolated process fixture per current command plus root/watch/MCP; artifact/config readers; old CLI/server matrix | partial; baseline: `VERGLOS_COMMAND_COMPATIBILITY_INVENTORY.md`; direct process coverage absent |
| V1 architecture | modular monolith/workers + producer/data/signing boundaries | TRUTH-011, all implementation epics | Engine exit; tenant negatives; migration/restore; queue/object failure; usage concurrency; signing trust separation | decided; governing set: `VERGLOS_ARCHITECTURE_DECISION_SET.md`; provider selections deferred |
| Risk governance | owned trigger/mitigation/rollback/gate register | TRUTH-012, all implementation/release gates | Risk-specific executable evidence; blocker review; residual acceptance expiry/reversal | active; 39 risks in `RISKS.md`; seven immediate release blockers |
| Regression baseline | exact CLI/web commits and supported runtimes | TRUTH-013, every implementation task | Fresh CLI test/typecheck/build; Node-22 web typecheck/build; post-run drift | passed at `bd1d394`/`5044e77`; evidence: `VERGLOS_BASELINE_VERIFICATION.md`; coverage gaps remain |
| Pro/Team/Studio/Enterprise UI | dashboard contract | dashboard epics | authorization and role journeys | planned |
| Final acceptance | acceptance contract | POST-RC | frozen corpus and authorized POC | not-started |

Update this table with file paths, test names, and commit IDs as tasks ship.
- HUNT-004/005 boundary (preparatory) | `packages/hunt/src/docker-adapter.ts`, `docker-runner.ts` | pinned digest, network denial, read-only mount, tmpfs, non-root, capability drop, no-new-privileges, PID/memory bounds, bounded timeout/output, explicit failure states, symlink-root rejection | PR #33 commits `ddf6cfe`, `f32f80a`, `4f67ea6`, `5e4c922`; actual Docker invocation, trusted recipes, and independent isolation evidence remain open
- HUNT-006 evidence redaction (preparatory) | `packages/shared/src/hunt-redaction.ts`, `packages/hunt/src/docker-runner.ts` | credential and explicit scoped-path redaction before evidence digest, combined UTF-8 output cap, content digest | PR #33 commit `d422adc`; sandbox capture and adversarial exfiltration evidence remain open
- OPS-008 webhook endpoint hardening (preparatory) | `src/lib/monitor/dispatch.ts` | reject mapped/expanded private IPv6 targets and URL fragments; existing DNS re-resolution/redirect denial retained | web PR #31 commit `ba90058`; full SSRF qualification, DNS pinning, response/egress evidence remain open
- ENGINE-004 safe archive transport/extraction (preparatory) | `archive-extractor.ts` | bounded streamed download, duplicate/traversal/link rejection, partial-output cleanup | implemented locally; checksum/signature and format adapters remain downstream
- ENGINE-007 mirror/offline source selection (preparatory) | `engine-source.ts` | signed metadata, digest pins, freshness bound, cache precedence, origin allowlist | implemented locally; customer mirror transport and activation remain downstream
- ENGINE-008 engine lifecycle commands | `engine-lifecycle.ts`, `packages/cli/src/engines-install.ts`, `packages/cli/src/engines-status.ts` | deterministic status/install/update/rollback transitions with approval, source, and compatibility gates | implemented locally; remote mirror activation and full orchestration remain downstream
- ENGINE-009 Trivy execution profiles | `trivy-adapter.ts`, `trivy-adapter.test.ts` | repository/filesystem/artifact/OCI/IaC/SBOM profile mapping, bounded subject identity, timeout/output caps, and no target-code execution claim | implemented locally; managed engine lifecycle/orchestration and graph integration remain downstream |
- ENGINE-010 Trivy JSON parser/normalizer (preparatory) | `trivy-parser.ts` | bounded untrusted JSON parsing, normalized severity/package fields, raw evidence digest | implemented locally; canonical observation adapter and golden compatibility fixtures remain downstream
- ENGINE-011 Trivy run attribution metadata (preparatory) | `trivy-run-metadata.ts` | component digests, source/license, capabilities, and ordered timestamps | implemented locally; integration into ToolRun/Release Record remains downstream
- ENGINE-012 Trivy compatibility fixtures (preparatory) | `trivy-compatibility.ts` | frozen major/output schema boundary and explicit unknown-major rejection | implemented locally; expanded golden corpus and release policy remain downstream
- ENGINE-013 Trivy failure/freshness policy (preparatory) | `trivy-failure-policy.ts` | explicit incomplete coverage for missing, stale, incompatible, database, and execution failures | implemented locally; integration with ToolRun policy evaluation remains downstream
- ENGINE-014 Trivy raw evidence retention/replay (preparatory) | `trivy-evidence.ts` | content-addressed local storage, digest/size verification, parser replay without rescanning | implemented locally; retention policy and record integration remain downstream
- ENGINE-015 fixture engine drill (preparatory) | `fixture-engine.ts` | deterministic success/failure fixture path with no target-code execution | implemented locally; final engine-exit drill remains downstream-gated
- IMPORT-001 bounded importer registry (preparatory) | `importer-registry.ts` | UTF-8 bounded JSON reader, format/version detection, source digest, ambiguity rejection | implemented locally; format-specific validation remains downstream
- IMPORT-002 SARIF structural hardening (preparatory) | `sarif-importer.ts` | typed nested run/result/location validation and unsafe URI rejection | implemented locally; standards-complete preservation and canonical observation mapping remain downstream
- IMPORT-003 CycloneDX structural hardening (preparatory) | `cyclonedx-importer.ts` | component/hash/dependency shape validation with typed failures | implemented locally; full CycloneDX preservation and subject binding remain downstream
- IMPORT-004 SPDX structural hardening (preparatory) | `spdx-importer.ts` | package checksum and relationship shape validation with typed failures | implemented locally; complete SPDX semantics and subject binding remain downstream
- IMPORT-005 CycloneDX VEX structural hardening (preparatory) | `cyclonedx-vex-importer.ts` | vulnerability identity and analysis shape validation; assertions remain non-native | implemented locally; full VEX semantics remain downstream
- IMPORT-006 in-toto provenance structural hardening (preparatory) | `provenance-importer.ts` | envelope/payload, subject digest, and predicate shape validation; signatures remain unverified | implemented locally; provider adapters and canonical linkage remain downstream
- IMPORT-007 provider provenance matching (preparatory) | `provenance-provider.ts` | exact subject digest matching for GitHub/npm/BuildKit labels; signature remains unverified | implemented locally; provider extraction and verification remain downstream
- IMPORT-008 detect-secrets baseline export (preparatory) | `detect-secrets-importer.ts` | canonical baseline export with raw-secret field refusal | implemented locally; reviewed-state semantics and runner policy remain downstream
- IMPORT-009 detect-secrets runner probe hardening (preparatory) | `detect-secrets-runner.ts` | explicit absolute path, control/path bounds, timeout and output cap, no installation | implemented locally; full invocation and policy integration remain downstream
- IMPORT-010 bounded SARIF exporter (preparatory) | `sarif-exporter.ts` | canonical SARIF 2.1.0 output with public subject/decision properties and bounded messages | implemented locally; standards validator and complete decision mapping remain downstream
- IMPORT-011 standards document exporters (preparatory) | `standards-exporter.ts` | deterministic validated CycloneDX/SPDX/VEX round-trip helpers | implemented locally; full standards conformance and graph/decision projection remain downstream
- IMPORT-012 evidence transfer helper (preparatory) | `packages/cli/src/evidence-transfer.ts` | bounded file transfer and validated CycloneDX/SPDX export with exclusive output creation | public command wiring, stdin/JSON/quiet UX, and exit taxonomy remain downstream
- GRAPH-001 native finding-to-observation adapter (preparatory) | `native-observation-adapter.ts` | deterministic subject-bound observation IDs, strict parsing, native provenance/remediation mapping | scanner integration and full graph correlation remain downstream
- GRAPH-003 normalization bounds (preparatory) | `normalization.ts` | original severity preservation, unknown mapping visibility, finite confidence bounds | producer-specific mappings and policy integration remain downstream
- GRAPH-004 canonical correlation comparison (preparatory) | `correlation.ts` | deterministic grouping and canonical payload disagreement detection | full multi-source graph integration remains downstream
- GRAPH-005 deduplication projection hardening (preparatory) | `deduplication.ts`, `correlation.ts` | permutation-independent projections, canonical payload comparison, 10000-item bound, deduplicated fuzzy candidates | semantic merge and full lineage integration remain downstream
- GRAPH-006 lineage graph hardening (preparatory) | `lineage-graph.ts` | bounded nodes/declarations, runtime relation/status/reference validation, deterministic duplicate-edge handling | provenance verification and complete producer integration remain downstream
- GRAPH-007 release snapshot hardening (preparatory) | `release-snapshot.ts` | bounded inputs, valid fingerprint/producer checks, subject-bound lineage, deterministic edge/gap normalization | policy/release authorization and signed records remain downstream
- GRAPH-008 canonical release diff (preparatory) | `release-diff.ts` | canonical identity and lineage comparisons with deterministic observation classifications | worsened/stale semantics and policy integration remain downstream
- GRAPH-009 offline diff reader hardening (preparatory) | `packages/cli/src/diff.ts` | 32 MiB bound, structural snapshot checks, digest validation, offline exit behavior | hosted history and full snapshot semantics remain downstream
- POLICY-001 policy document validation hardening (preparatory) | `policy-document.ts` | typed issue paths, unsafe text rejection, bounded canonical extensions | evaluation, RBAC, and hosted policy enforcement remain downstream
- POLICY-002 policy layer loader hardening (preparatory) | `policy-loader.ts` | typed layer errors, 1 MiB canonical bound, per-check validation, deterministic precedence | config discovery and hosted policy authority remain downstream
- POLICY-003 Free profile fixture hardening (preparatory) | `policy-profiles.test.ts` | explicit critical-only defaults, freshness/coverage/artifact/Hunt settings, approval state, deterministic digest | evaluator and entitlement integration remain downstream
- POLICY-004 Pro profile option bounds (preparatory) | `policy-profiles.ts` | finite confidence bounds and deterministic configurable defaults | entitlement and evaluator integration remain downstream
- POLICY-005 baseline contract/store hardening (preparatory) | `baseline.ts`, `baseline-store.ts` | typed validation, epoch timestamp comparison, 4 MiB bound, collision-safe content-addressed publication | policy bypass, hosted sync, and multi-user audit remain downstream
- POLICY-006 baseline comparison hardening (preparatory) | `baseline-compare.ts` | bounded SHA-256 current fingerprints, timestamp validation, typed comparison errors, deterministic duplicate projection | evaluator effect and hosted synchronization remain downstream
- POLICY-007 exception applicability input hardening (preparatory) | `exception.ts` | subject/observation/timestamp validation before applicability evaluation | exception effects, RBAC, and immutable audit remain downstream
- POLICY-008 exception audit projection (preparatory) | `exception-audit.ts` | read-only digest-bound exception/approval projection with subject and observation scope | expiry enforcement, immutable storage, and hosted audit remain downstream
- POLICY-009 evaluator coverage boundary (preparatory) | `policy-boundary.ts` | configured checks cannot silently disappear before policy evaluation | full effective-policy evaluator wiring and exception effects remain downstream
- POLICY-010 explanation projection hardening (preparatory) | `policy-explanation.ts` | immutable nested policy/reasons, stable reason codes, bounded output | evaluator wiring and UI rendering remain downstream
- HUNT-002/003 planner trust boundary (preparatory) | `packages/shared/src/hunt-recipe-trust.ts`, `packages/shared/src/hunt-planner.ts`, `packages/shared/src/hunt-execution-gate.ts` | execution-free plans and execution gates expose immutable command/input/limit/network metadata, recipe/image digests, and require an allowlisted signer, exact `hunt` policy effect, matching network scope, plus optional exact recipe content digest when policy pins one | PR #33 commits `1982e6d`, `f68576a`, `9195266`, `acd1aad`, `38c6ecc`, `cc55092`, `6dab83e`; supported recipe execution, isolation, and adversarial evidence remain open
- HUNT-006 output redaction bounds (preparatory) | `packages/shared/src/hunt-redaction.ts` | credential-shaped output redaction now rejects unsafe limits and guarantees UTF-8 byte caps with visible truncation | PR #33 commit `9f029f9`; sandbox capture and secret-exfiltration adversarial evidence remain open
- HUNT-006 credential pattern coverage (preparatory) | `packages/shared/src/hunt-redaction.ts` | redaction covers bearer/JWT/private-key-shaped credentials in addition to token/key assignments, with regression fixtures | PR #33 commit `eb80e0a`; sandbox capture and secret-exfiltration adversarial evidence remain open
- HUNT-006 synthetic input coverage (preparatory) | `packages/shared/src/hunt-redaction.ts` | synthetic inputs replace assignment, JWT, bearer, and private-key-shaped values before probe execution | PR #33 commit `c893e81`; sandbox capture and secret-exfiltration adversarial evidence remain open
- HUNT-002 trust policy schema (preparatory) | `packages/shared/src/hunt-recipe-trust.ts` | trust policies validate bounded signer, revocation, and digest allowlists and reject unknown or duplicate entries before evaluation | PR #33 commit `8cde6fd`; signed feed/license provenance and durable trust-store rotation remain open
- HUNT-002 execution fail-closed policy (preparatory) | `packages/shared/src/hunt-execution-gate.ts` | malformed trust policy input cannot authorize execution and is converted to a denied gate result | PR #33 commit `9ee3a4f`; signed feed/license provenance and durable trust-store rotation remain open
- HUNT-002 trust-policy digest binding (preparatory) | `packages/shared/src/hunt-recipe-trust.ts` | canonical digest of the exact validated trust policy is available for verification-attempt binding and audit | PR #33 commit `7224612`; signed feed/license provenance and durable trust-store rotation remain open
- HUNT-003 approval network scope (preparatory) | `packages/shared/src/hunt-execution-gate.ts`, `packages/shared/src/hunt-execution-gate.test.ts` | execution gate accepts an allowlisted recipe only when the approval network set exactly matches the recipe and rejects widened scopes | PR #33 commit `75e31f2`; runtime network enforcement and sandbox evidence remain open
- HUNT-001 recipe network origin bounds (preparatory) | `packages/shared/src/hunt-recipe.ts`, `packages/shared/src/hunt-recipe.test.ts` | allowlisted destinations reject credentials, paths, queries, and fragments; only HTTPS origins are represented | PR #33 commit `a152b39`; resolver/DNS enforcement remains sandbox-gated
- HUNT-003 execution identity binding (preparatory) | `packages/shared/src/hunt-execution-binding.ts`, `packages/shared/src/hunt-execution-binding.test.ts` | binds validated recipe/trust/approval digests, exact rule/subject/observation identities, image digest, and network mode; rejects widened approvals and freezes returned metadata | PR #33 commit `5f7bc00`; actual runner integration, isolation, and adversarial evidence remain open
- HUNT-003 adapter orchestration boundary (preparatory) | `packages/hunt/src/index.ts`, `packages/hunt/src/types.ts`, `packages/hunt/src/index.test.ts` | only an explicitly injected adapter may execute; dry-run and identity mismatches reject; total duration is bounded and cleanup is guaranteed | PR #33 commit `86c2a4a`; built-in probe implementation, recipe/approval wiring, isolation, and adversarial evidence remain open
- DIST-WEB-002 runtime configuration boundary (preparatory) | `verglos-web/src/lib/runtime-config.ts`, `verglos-web/src/lib/runtime-config.test.ts` | production site URL must be an HTTPS origin; optional channel encryption key is restricted to valid 32-byte hex/base64 material | web PR #31 commit `7ab0010`; complete deployment secret matrix and production smoke evidence remain open
- HUNT-006 evidence UTF-8 bound (preparatory) | `packages/hunt/src/docker-runner.ts`, `packages/hunt/src/docker-runner.test.ts` | output clipping preserves valid UTF-8 and guarantees the returned text's encoded bytes remain within the configured cap | PR #33 commit `25e29ea`; sandbox capture and secret-exfiltration adversarial evidence remain open
- HUNT-005 Docker input-shape boundary (preparatory) | `packages/hunt/src/docker-adapter.ts`, `packages/hunt/src/docker-adapter.test.ts` | malformed runtime image, digest, command, and project-root values fail closed before argv construction | PR #33 commit `1f94309`; runtime isolation and adversarial evidence remain open
- HUNT-006 adapter lifecycle cleanup (preparatory) | `packages/hunt/src/index.ts`, `packages/hunt/src/index.test.ts` | adapter cleanup is attempted even when preparation fails, preventing partial sandbox state from being retained | PR #33 commit `306f30f`; real sandbox cleanup evidence remains open
- HUNT-005 runner argv boundary (preparatory) | `packages/hunt/src/docker-runner.ts`, `packages/hunt/src/docker-runner.test.ts` | direct runner calls reject malformed, oversized, or control-character argv entries before invoking Docker | PR #33 commit `abe6978`; runtime isolation and adversarial evidence remain open
- HUNT-003 execution binding enforcement (preparatory) | `packages/hunt/src/index.ts`, `packages/hunt/src/types.ts`, `packages/hunt/src/index.test.ts` | adapter execution requires validated recipe/trust/approval/observation identity binding and passes that immutable binding into the adapter | PR #33 commit `c19b10e`; supported recipes, runtime isolation, and adversarial evidence remain open
- HUNT-007 result identity boundary (preparatory) | `packages/hunt/src/index.ts`, `packages/hunt/src/index.test.ts` | adapter results with a different finding ID are converted to explicit non-attemptable outcomes rather than widening evidence scope | PR #33 commit `733fed4`; supported verdict evidence and adversarial review remain open
- HUNT-007 source evidence preservation (preparatory) | `packages/hunt/src/index.ts`, `packages/hunt/src/index.test.ts` | adapter-supplied finding payloads are ignored; the original report finding remains authoritative even when IDs match | PR #33 commit `f27312d`; supported verdict evidence and adversarial review remain open
- HUNT-007 adapter outcome validation (preparatory) | `packages/hunt/src/index.ts`, `packages/hunt/src/index.test.ts` | adapter verdicts, identities, reasons, evidence paths, and durations are runtime-validated and bounded before projection | PR #33 commit `d800e56`; supported verdict evidence and adversarial review remain open
- HUNT-007 immutable outcome projection (preparatory) | `packages/hunt/src/index.ts`, `packages/hunt/src/types.ts`, `packages/hunt/src/index.test.ts` | returned Hunt outcome arrays and entries are frozen so validated verdict state cannot be mutated downstream | PR #33 commit `3d347dd`; supported verdict evidence and adversarial review remain open
- HUNT-005 policy-bound Docker adapter (preparatory) | `packages/hunt/src/docker-sandbox-adapter.ts`, `packages/hunt/src/docker-sandbox-adapter.test.ts` | revalidates project roots, requires bound image digest and denied network, invokes bounded/redacting Docker runner, and returns honest non-attemptable status until assertions are implemented | PR #33 commit `d3a3f37`; supported recipes, runtime isolation, and adversarial evidence remain open
- HUNT-003 recipe execution metadata binding (preparatory) | `packages/shared/src/hunt-execution-binding.ts`, `packages/hunt/src/docker-sandbox-adapter.ts` | binds validated command, isolation, limits, cleanup, and redaction metadata; Docker consumes the bound command/limits and refuses digest or network drift | PR #33 commit `cfc415c`; supported recipe assertion evaluation and independent isolation evidence remain open
- HUNT-005 declared isolation enforcement (preparatory) | `packages/hunt/src/docker-sandbox-adapter.ts`, `packages/hunt/src/docker-sandbox-adapter.test.ts` | Docker execution refuses recipes whose bound isolation is not explicitly `container`, preventing declaration/runtime mismatch | PR #33 commit `22ed833`; independent isolation evidence remains open
- HUNT-006 bounded execution evidence metadata (preparatory) | `packages/hunt/src/types.ts`, `packages/hunt/src/index.ts`, `packages/hunt/src/docker-sandbox-adapter.ts` | Docker outcomes preserve only bounded status/digest/byte/truncation/redaction metadata; malformed evidence fields are rejected | PR #33 commit `ae7493b`; raw capture, assertion evaluation, and adversarial evidence remain open
- HUNT-005 Docker runtime boundary correction (preparatory) | `packages/hunt/src/docker-adapter.ts`, `packages/hunt/src/docker-adapter.test.ts` | removed invalid `private` PID/UTS and `seccomp=default` argv values; Docker’s default PID/UTS namespaces and builtin seccomp are now relied on, with valid explicit controls retained | PR #33 commit `403f214`; daemon configuration and independent adversarial evidence remain open
- HUNT-005 live Docker fixture (evidence) | `packages/hunt/src/docker-sandbox-adapter.ts` | real pinned local image completed under network denial, read-only source mount, non-root UID, capability drop, no-new-privileges, tmpfs, process/memory/output bounds; redacted 8-byte output produced digest `sha256:acbd711313ac7a94dc13913a8b68adf3394104c4f1070897876f76b1b9e1351a` and remained not-attemptable pending assertion evaluation | local run 2026-09-11; one fixture is not sufficient for HUNT acceptance or adversarial suite
- HUNT-004/005 recipe process ceiling binding (preparatory) | `packages/shared/src/hunt-recipe.ts`, `packages/shared/src/hunt-execution-binding.ts`, `packages/hunt/src/docker-sandbox-adapter.ts` | signed recipe limits now require a bounded process count, carry it through the immutable execution binding, and cap Docker `--pids-limit` to that approved value | PR #33 commit `27d0441`; actual probe execution and process-tree adversarial evidence remain open
- HUNT-008 bounded exit-code assertion execution (preparatory evidence) | `packages/shared/src/hunt-execution-binding.ts`, `packages/hunt/src/docker-runner.ts`, `packages/hunt/src/docker-sandbox-adapter.ts` | recipe assertions are carried into the binding; Docker preserves exit status and evaluates only the exact `exit code is N` form, leaving other assertion syntax not-attemptable | PR #33 commit `c27211b`; live pinned-image fixture returned `true` with redacted evidence; broader recipe coverage remains open
- HUNT-007 negative Docker exit evidence (preparatory evidence) | `packages/hunt/src/docker-runner.ts`, `packages/hunt/src/docker-sandbox-adapter.ts` | a pinned fixture exiting with code 7 produced `executionStatus: failed`, `verdict: not_attemptable`, bounded 7-byte redacted output, and evidence digest `sha256:e569086fed2f7b8f8c6844d2f022e6ca80bbe27ddb2b3286645275c1a2319d20`; infrastructure failure did not become a false verdict | local run 2026-09-11; failure taxonomy and adversarial suite remain open
- HUNT-007 assertion verdict boundary tests (preparatory) | `packages/hunt/src/docker-runner.ts`, `packages/hunt/src/docker-sandbox-adapter.test.ts` | bounded exit-code assertions now preserve actual container exit codes; supported non-zero codes classify false, while unsupported assertion syntax remains not-attemptable | PR #33 commit `d67bc84`; broader verdict taxonomy and adversarial evidence remain open
- HUNT-007 exit-code input validation (preparatory) | `packages/hunt/src/docker-runner.ts`, `packages/hunt/src/docker-runner.test.ts` | injected/runtime exit codes outside the safe 0–255 process range fail closed as failed execution and cannot influence a verdict | PR #33 commit `8792706`; full process/signal adversarial evidence remains open
- HUNT-011 opt-in Docker adversarial harness (evidence) | `packages/hunt/src/docker-runtime-adversarial.test.ts` | pinned-image integration tests verify non-root identity, read-only source mount, and network denial with bounded command timeout; local run passed 32/32 Hunt tests including 3 integration checks | PR #33 commit `3386beb`; broader device/namespace/resource/fork/signal/secret-exfiltration coverage remains open
- HUNT-011 expanded Docker adversarial harness (evidence) | `packages/hunt/src/docker-runtime-adversarial.test.ts` | pinned-image integration checks additionally verify no host Docker socket, no `/dev/kmsg`, read-only root filesystem, secret-shaped output redaction, and bounded captured output; local run passed 37/37 Hunt tests with all 8 integration checks enabled | PR #33 commit `ef698d7`; broader namespace/resource/fork/signal/cleanup and multi-image coverage remains open
- HUNT-011 timeout boundary evidence (evidence) | `packages/hunt/src/docker-runtime-adversarial.test.ts` | pinned-image integration check runs a sleeping probe under a 500 ms host timeout and records an explicit `timed-out` status with a bounded signal-derived exit code | PR #33 commit `2991658`; process-tree cleanup and broader resource exhaustion coverage remain open
- HUNT-005/HUNT-011 source symlink boundary (evidence) | `packages/hunt/src/docker-adapter.ts`, `packages/hunt/src/docker-adapter.test.ts` | Docker project-root validation walks bounded directory entries, permits only in-root symlinks, and rejects broken, escaping, or non-regular entries before bind mounting | PR #33 commit `83b3994`; full multi-platform filesystem corpus remains open
- OPS-008 reserved webhook address boundary (preparatory) | `verglos-web/src/lib/monitor/dispatch.ts`, `src/lib/monitor/dispatch.test.ts` | webhook validation now rejects documentation, benchmarking, and other reserved IPv4 ranges in addition to private/link-local/metadata targets | web PR #31 commit `3b8d2d8`; deployed DNS re-resolution and delivery-worker evidence remain open
- HUNT-005/HUNT-011 privilege boundary evidence (evidence) | `packages/hunt/src/docker-runtime-adversarial.test.ts` | pinned-image integration reads `/proc/self/status` and verifies Docker `no-new-privileges` is active for the probe | PR #33 commit `2af2cd7`; independent review and multi-image coverage remain open
- AGENT-004 MCP capability side-effect truth (preparatory) | `packages/shared/src/mcp-capabilities.ts`, `packages/shared/src/mcp-capabilities.test.ts` | every discovered MCP capability now exposes its authoritative action and side-effect class alongside plan, maturity, and approval requirement | PR #33 commit `6a272af`; server entitlement enforcement and complete input/output metadata remain open
- AGENT-004 MCP capability I/O metadata (preparatory) | `packages/shared/src/mcp-capabilities.ts`, `packages/shared/src/mcp-capabilities.test.ts` | capability discovery now publishes bounded input and output field names derived from the registered MCP schemas, with immutable arrays | PR #33 commit `222fd84`; runtime schema negotiation and entitlement enforcement remain open
- AGENT-004 MCP server discovery metadata (preparatory) | `packages/mcp/src/server.ts` | `tools/list` now fails closed on missing capability records and publishes the shared action/plan/maturity/side-effect/approval/input/output metadata under the Verglos `_meta` namespace | PR #33 commit `a101124`; entitlement enforcement and client interoperability review remain open
- AGENT-004 discovery hygiene | `packages/mcp/src/server.ts` | removed unused capability import after MCP test/typecheck verification | PR #33 commit `021e609`; no behavior change
- AGENT-004 discovery contract test (preparatory) | `packages/mcp/src/server.ts`, `packages/mcp/src/server.test.ts` | extracted deterministic `listAdvertisedTools()` and locked that every `tools/list` entry carries the exact shared capability metadata | PR #33 commit `0fd7cd2`; entitlement enforcement and interoperability review remain open
- HUNT-006 live redaction fixture (evidence) | `packages/hunt/src/docker-sandbox-adapter.ts`, `packages/hunt/src/docker-runner.ts` | a pinned container emitted secret-shaped token/path material; the adapter returned only bounded redacted metadata, `redacted: true`, 31 output bytes, and evidence digest `sha256:c1efa5b7d1c5c2d2e680279e3cef399fd70db5a356957a9ed1b9f3dc1193d1d9` | local run 2026-09-11; raw secret non-escape and adversarial exfiltration suite remain open
- OPS-008 webhook response cap (preparatory) | `verglos-web/src/lib/monitor/dispatch.ts` | webhook delivery rejects malformed or over-64 KiB declared response bodies before retaining any body bytes, while immediate body cancellation and timeout remain in place | web PR #31 commit `855517a`; full signed-payload, DNS-pinning, egress, and adversarial delivery evidence remain open
- HUNT-008 bounded exit-code assertion execution (preparatory evidence) | `packages/shared/src/hunt-execution-binding.ts`, `packages/hunt/src/docker-runner.ts`, `packages/hunt/src/docker-sandbox-adapter.ts` | recipe assertions are carried into the binding; Docker preserves exit status and evaluates only the exact `exit code is N` form, leaving other assertion syntax not-attemptable | PR #33 commit `c27211b`; live pinned-image fixture returned `true` with redacted digest `sha256:acbd711313ac7a94dc13913a8b68adf3394104c4f1070897876f76b1b9e1351a`; broader recipe coverage remains open
- AGENT-004 entitlement gate integration (evidence) | `packages/mcp/src/server.ts`, `packages/mcp/src/server.test.ts`, `packages/cli/src/index.ts` | MCP dispatch enforces Free/Pro/Team/Studio ordering with Enterprise compatibility; the CLI passes locally verified entitlement context, and an SDK client round-trip verifies discovery plus entitlement denial | local commits `4793635`, `13b057d`, `531009a`, `79d9b95`, `6badb9d`, `87243c6`, `e7f9fea`; AGENT-004 acceptance evidence complete
- AGENT-002 replay-resistant approval store (evidence) | `packages/shared/src/approval-store.ts`, `packages/shared/src/approval-store.test.ts` | bounded atomic receipt persistence now treats request IDs as one-time authority handles and rejects a second digest with widened scope; shared 300/300 and MCP 27/27 pass | local commit `ebeb642`; hosted audit custody and upstream action-contract reconciliation remain separate
- HUNT-005 pinned Docker adapter evidence (complete) | `packages/hunt/src/docker-adapter.ts`, `packages/hunt/src/docker-runner.ts`, `packages/hunt/src/docker-runtime-adversarial.test.ts` | real pinned image `postgres@sha256:2bf082886c059b4cf5af3f9e8d3a8916c35699062899061c13bc32d5921c631a`; Docker suite passes 40/40 covering non-root, read-only source/rootfs, network denial, socket/device absence, no-new-privileges, output/time bounds, and cleanup | local run 2026-09-11; multi-image and broader namespace/resource/fork/signal/secret adversarial qualification remains HUNT-011
- HUNT-011 adversarial expansion (evidence) | `packages/hunt/src/docker-runtime-adversarial.test.ts` | pinned Docker suite now passes 44/44, adding CPU-burning timeout, process-tree growth, writable-tmpfs capacity, and signal-termination fixtures; HUNT-011 remains open for independent multi-image and remaining namespace/memory qualification | local commit `ceb3f8e`, run 2026-09-11
- Team plan contract correction (evidence) | `packages/shared/src/config.ts`, `packages/cli/src/init.ts` | config schema and generated init template now accept canonical `team` metadata while retaining `compliance` only as a legacy alias; verified by shared 301/301 and CLI 103/103 tests plus typechecks | local commit `42c0a7b`; verified license state remains the entitlement authority
- HUNT-007 canonical runtime verdict projection (evidence) | `packages/hunt/src/docker-sandbox-adapter.ts`, `packages/hunt/src/index.ts`, `packages/hunt/src/types.ts` | Docker outcomes now expose canonical `confirmed`, `not-reproduced`, `inconclusive`, `not-supported`, and `environment-error` states alongside legacy alpha verdicts; timeout/environment/unsupported assertion tests pass | local commit `1135512`; full recipe/classifier qualification remains gated by HUNT-008/HUNT-011
- HUNT-006 synthetic/redacted evidence boundary (complete) | `packages/shared/src/hunt-redaction.ts`, `packages/hunt/src/docker-runner.ts`, `packages/hunt/src/docker-runtime-adversarial.test.ts` | secret-shaped inputs are replaced, output is redacted before hashing/return, sensitive paths are removed, and byte caps are enforced; pinned Docker suite passes 45/45 with secret-exfiltration and output-bound fixtures | local commits `08e6efb`, `c893e81`, `1e86c7d`, `eb80e0a`, `9f029f9`, `f32f80a`, `2e366a4`, `d422adc`, `25e29ea`, `abe6978`, `ceb3f8e`; broader HUNT-011 qualification remains open
- HUNT-011 multi-image runtime evidence (evidence) | `packages/hunt/src/docker-runtime-adversarial.test.ts` | the full 46-test pinned Docker suite passes independently against local `postgres@sha256:2bf082886c059b4cf5af3f9e8d3a8916c35699062899061c13bc32d5921c631a` and `postgres@sha256:20edbde7749f822887a1a022ad526fde0a47d6b2be9a8364433605cf65099416`, including an in-container cgroup memory-ceiling assertion; namespace qualification remains open | local runs 2026-09-11; commit `eb5728f`
- HUNT-011 namespace fixture (evidence) | `packages/hunt/src/docker-runtime-adversarial.test.ts` | Linux hosts now compare container PID/IPC namespace identifiers against the host; macOS Docker Desktop skips this host-`/proc`-dependent assertion explicitly. Both pinned-image runs remain 46 passed, 1 platform skip | local commit `91bb1bd`; Linux CI/runtime evidence still required for closure
- Hunt package public truth (evidence) | `packages/hunt/README.md` | public package documentation now distinguishes implemented alpha recipe/trust/approval/redaction/Docker boundaries from still-gated supported recipe content and documents legacy plus canonical verdict fields without claiming beta completion | local commit `c0e366a`; landing/blog content untouched
- Public plan-table truth (evidence) | `README.md`, `packages/cli/README.md` | public CLI tables now use canonical Free/Pro/Team/Studio/Enterprise columns, Team `$99/mo`, Studio `$249/mo`, and accurate alpha/beta capability states; landing/blog content untouched | local commit `0fc406f`
- MCP authority fail-closed boundary (evidence) | `packages/mcp/src/server.ts` | registered tools now reject missing shared authority metadata before entitlement/handler dispatch, while unknown names retain the stable `MCP_UNKNOWN_TOOL` error; MCP 27/27 and typecheck pass | local commit `a545ca2`; full contract migration remains gated by LOCAL-003/POLICY-009
- Public Hunt architecture truth (evidence) | `docs/2.0.0-hunt-and-attest.md` | public architecture doc now describes the implemented alpha Docker/recipe/trust/redaction boundaries, canonical verdicts, and explicit beta/legal/runtime gates; Node-vm is no longer presented as a product default | local commit `303d628`; landing/blog content untouched
- Canonical Enterprise tier vocabulary (evidence) | `packages/shared/src/config.ts`, `packages/cli/src/init.ts`, `verglos-web/src/lib/entitlement/capabilities.ts`, `verglos-web/src/lib/entitlement/sign.ts` | CLI and web accept `enterprise` as the canonical contracted tier; legacy `compliance` input normalizes to Enterprise on the web; Team/Studio remain inactive catalog entries; CLI shared tests 302/302, CLI typecheck 13/13, web tests 48/48, and web typecheck pass | CLI `17b537c`, web `14dbcd8`; billing/catalog activation remains gated
- Legacy entitlement claim normalization (evidence) | `packages/entitlement/src/client.ts` | Signed legacy `compliance` claims remain signature-verified but are exposed to callers as canonical `enterprise`; regression test covers the migration without weakening token validation | CLI `bfd4948`; public catalog and hosted lifecycle gates remain open
- Pre-commit preservation boundary (evidence) | `packages/cli/src/config.ts` | Existing regular Git hooks are copied to a non-overwriting Verglos backup and chained before the scanner; repeated installs are idempotent and symlinked/non-regular hooks fail closed; 2 focused tests plus CLI 105/105 pass | CLI `80361eb`; full process fixture and cross-platform hook qualification remain open
- CLI plan simulation help truth (evidence) | `packages/cli/src/index.ts` | Founder-only `--as-plan` help now lists canonical Free/Pro/Team/Studio/Enterprise values, matching runtime normalization without activating contracted tiers | CLI `d99314b`; entitlement and catalog gates remain authoritative
- Machine-safe fix output (evidence) | `packages/cli/src/index.ts`, `packages/cli/src/fix.ts` | `verglos fix` now supports `--json` and `--quiet`; dry-run JSON reports the bounded plan, applied JSON reports fixed count/rescan request, and internal status output is suppressed in machine mode; CLI 105/105 and typecheck pass | CLI `4db8a12`; full process fixtures and mutation acceptance remain open
- Fix option registration regression (evidence) | `packages/cli/src/local-command-options.test.ts` | Contract test now explicitly locks `fix --json` and `fix --quiet` registration; focused command-option suite passes 4/4 | CLI `0be339a`; process-level mutation fixtures remain open
- Fix process fixture (evidence) | `packages/cli/src/fix.test.ts` | Isolated temporary project and HOME execute the real CLI entrypoint with `fix --json --dry-run`; JSON is parseable, no stderr/filesystem mutation occurs, and the original config remains byte-identical | CLI `4ca5387`; approved mutation/rescan and cross-platform fixtures remain open
- Fix approved mutation process contract (evidence) | `packages/cli/src/index.ts`, `packages/cli/src/fix.test.ts` | Approved `fix --json` execution now emits exactly one machine-readable JSON document after a real filesystem mutation; human follow-up output is suppressed and the fixture verifies the exact scoped receipt plus persisted CSP change | CLI `a8eff94`; cross-platform fixtures remain open
- Record verify process boundary (evidence) | `packages/cli/src/record-verify.test.ts` | A real CLI subprocess returns a bounded JSON error with exit 78 for a missing record manifest, writes no stderr or unexpected files, and preserves fail-closed behavior | CLI `6ad4f53`; valid cross-platform record process fixtures remain open
- Record create process boundary (evidence) | `packages/cli/src/record-create.test.ts` | A real CLI subprocess materializes a valid bounded record with `--json --quiet`, emits parseable success metadata, and writes no stderr outside the requested output root | CLI `d826fdd`; cross-platform and complete-graph fixtures remain open
- Record project process boundary (evidence) | `packages/cli/src/record-project.test.ts` | A real CLI subprocess returns a bounded JSON error with exit 78 for malformed manifests, writes no stderr or unexpected files, and preserves fail-closed projection behavior | CLI `f4940f0`; valid cross-platform projection fixtures remain open
- Hunt adversarial CI execution (preparatory) | `.github/workflows/self-scan.yml` | The Ubuntu self-scan workflow runs the pinned Docker Hunt adversarial suite with a fixed Postgres image digest, so Linux namespace checks execute in CI rather than being silently skipped on macOS | CLI `f22c1b9`; CI result and independent review remain open
- Hunt adversarial CI result (evidence) | `.github/workflows/self-scan.yml` | Ubuntu run `34605771365` passed the full pinned Docker adversarial suite and the remaining release workflow checks, including Linux PID/IPC namespace isolation | CLI `f22c1b9`; independent Hunt review remains open
- Hunt adversarial CI requalification (evidence) | `.github/workflows/self-scan.yml` | Ubuntu run `34643142278` passed the complete pinned Hunt package suite 50/50 with zero skips, including Linux PID/IPC namespace isolation; this is runtime evidence only and does not satisfy the unmet HUNT-008–010 dependencies | CLI `80884ec`; independent Hunt review remains open
- PLAN-CLI-002 canonical whoami plan display (evidence) | `packages/cli/src/whoami.ts` | Live and cached entitlement plans are normalized through the shared tier authority before persistence/display; legacy `compliance` is exposed as Enterprise and paid Team/Studio/Enterprise states are styled consistently | CLI `5f5b600`; allowance/source/expiry UX remains open
- PLAN-CLI-001 cached tier normalization (evidence) | `packages/cli/src/entitlement.ts`, `packages/cli/src/entitlement-offline.test.ts` | Offline REST/cache resolution now canonicalizes legacy `compliance` responses to Enterprise before callers consume the plan; regression verifies stale-cache behavior without a JWT | CLI `29e4c00`; opaque catalog allowances and hosted lifecycle remain open
- PLAN-CLI-001 entitlement metadata normalization (evidence) | `packages/cli/src/entitlement.ts`, `packages/cli/src/entitlement-offline.test.ts` | The auxiliary `real_plan` metadata is normalized through the same canonical tier authority as `plan`, preventing legacy compliance vocabulary from leaking to callers | CLI `e34f908`; opaque catalog allowances and hosted lifecycle remain open
- PLAN-CLI-001 capability payload boundary (evidence) | `packages/cli/src/entitlement.ts`, `packages/cli/src/entitlement-offline.test.ts` | Disk cache and REST capability responses now require bounded, typed plan/capability/TTL/boolean fields; malformed payloads fail closed to Free before entitlement resolution | CLI `3a1f55e`; signed catalog/allowance and hosted lifecycle remain open
- PLAN-CLI-001 unknown-plan fail-closed boundary (evidence) | `packages/cli/src/entitlement.ts`, `packages/cli/src/entitlement-offline.test.ts` | Capability payloads with unrecognized plan identifiers are rejected before their capability list can be honored, preventing future/forged plan labels from granting paid behavior | CLI `5bd18b0`; signed catalog/allowance and hosted lifecycle remain open
- LIC-001 dependency license classifier (complete; legal blocker remains open) | `scripts/license-inventory-core.mjs`, `scripts/license-inventory.mjs`, `scripts/license-inventory.test.mjs` | Inventory reconciles every one of 180 lock versions plus the nested bundled component and emits declared/detected license, source and source basis, direct/transitive scope, redistribution class, notice obligation, and explicit review blockers; missing metadata fails closed. The nested `benchmark@1.0.0` ISC/BSD-3-Clause conflict is reported, not waived. | CLI `338ed67`, `9aa583d`, `4e828b9`, `6bd558b`, `4435964`; tests and cross-platform inventory CI pass; publication/legal clearance remains blocked
- LIC-004 reproducible dependency SBOM (complete) | `scripts/generate-sbom.mjs`, `scripts/generate-spdx.mjs`, `scripts/license-inventory.test.mjs`, `.github/workflows/self-scan.yml` | Deterministic CycloneDX 1.5 and SPDX 2.3 cover the full lock inventory plus bundled component; fixed metadata avoids run-time drift; license conclusions remain explicitly `NOASSERTION`; generator coverage tests and CI drift checks pass. | CLI `d48b5b5`, `b95f840`, `9aa583d`, `6bd558b`, `4435964`; release publication remains gated separately
- LIC-003/DIST-003 archive notice enforcement (preparatory evidence) | `scripts/generate-third-party-notices.mjs`, `scripts/pack-public-packages.mjs`, `scripts/verify-release-artifacts.mjs`, `.github/workflows/publish.yml` | Third-party notices include bundled components and are staged byte-identically in all six npm archives; release verification checks evidence/archive hashes and blocks `--require-clear` while review blockers exist. Release scripts 17/17, Turbo 23/23 tasks; GitHub self-scan `34664087596` and platform matrix `34664087624` passed. | CLI `4435964`; PR #34 open/mergeable, publishing still blocked by legal review and remaining gates
- Overnight batch reconciliation (preparatory evidence) | CLI and web changes, 2026-09-11 18:00–2026-09-12 06:41 IST | Reconciled 178 CLI commits (`531009a` through `4435964`) and 33 web commits (`b99014b` through `4a6571a`); their subjects cover command/process output, path/runtime validation, Hunt/MCP boundaries, licensing/release evidence, tenant predicates, webhook handling, and web runtime configuration. Targeted diff/test/CI acceptance review verified LIC-001 and LIC-004; this is not a claim of line-by-line review of all 211 commits. Other hardening remains preparatory where wider acceptance evidence is open. | CLI PR #34 and [web fork PR #32](https://github.com/anuragyadav-git/verglos-web/pull/32) remain open/mergeable; CI green on current heads
- Exact seven-hour commit audit (2026-09-12 00:06–07:06 IST) | CLI `ab6e8f8`–`4435964` (120 commits); web `7fa52a3`–`4a6571a` (21 commits) | Reconciled every commit record and the aggregate source/test/config/workflow diff against acceptance criteria. Reviewed CLI work covers machine-safe command/process contracts, scanner cancellation/root/path handling, MCP/Hunt error/authority boundaries, fix approval and rollback hardening, package/license/SBOM/release gates, and Windows/macOS/Linux CI portability. Web work covers tenant-bound report/release/query predicates, static tenant-query regression guards, bounded/redacted route errors, cron bearer redirect/transport controls, webhook response/input bounds, migration/config validation, and production runtime settings. Current local CLI package tests/typecheck pass; web tests pass 69/69, typecheck passes, and all 15 ordered migrations validate (local web commands ran under Node 26; CI matrix is the supported-runtime evidence). The only already-eligible checkbox changes are LIC-001/004 previously reconciled; backlog remains 156 unchecked / 113 checked. AGENT-007 remains open; review identified missing invocation-workspace binding for approval `target` and absent failed-rescan rollback coverage, tracked as `R-040`. No blog/landing-page changes. | PR #34 (`4435964`) and web fork PR #32 (`4a6571a`) remain open; current CI was green at last recorded check; do not merge based on backlog count alone

- CLI fix approval and rollback hardening | CLI `c59126e`, `bda23e0` | Canonical workspace receipt binding, cross-workspace denial before mutation, symlinked `src/` escape prevention, bounded snapshots that classify only ENOENT as absent, restore/remove rollback tests, and explicit failure when rollback cannot be verified. Focused fix suite: 20/20; forced Turbo test/typecheck/build: 23/23 tasks. Pushed to existing CLI PR #34 at `bda23e0`; self-scan and platform matrix are running. | AGENT-007 remains unchecked; selected-test semantics and end-to-end CLI failure qualification remain open. Backlog stays 156 unchecked / 113 checked / 269. No private docs or blog/landing content was pushed.

- CLI Windows rollback correction | CLI `d7430a5` | The hosted matrix at `bda23e0` failed all Windows Node cells: an authorization test assumed `/tmp` exists, and rollback could follow a raced-in symlink on Windows. The test now uses an existing temporary workspace; rollback and Next.js config replacement use an exclusive same-directory temporary file plus atomic rename, with original permission mode retained. Focused fix tests 20/20, CLI typecheck, and forced Turbo test/typecheck/build 23/23 pass locally. Pushed to existing CLI PR #34; hosted rerun pending. | AGENT-007 remains unchecked; selected-test semantics and full end-to-end CLI failure qualification are open. Backlog 156 unchecked / 113 checked / 269. No internal docs or blog/landing content was pushed.

- CLI Windows rollback correction | CLI `d7430a5` | The hosted matrix at `bda23e0` failed all Windows Node cells: an authorization test assumed `/tmp` exists, and rollback could follow a raced-in symlink on Windows. The test now uses an existing temporary workspace; rollback and Next.js config replacement use an exclusive same-directory temporary file plus atomic rename, with original permission mode retained. Focused fix tests 20/20, CLI typecheck, and forced Turbo test/typecheck/build 23/23 pass locally. Hosted self-scan `34668623254` and all nine Ubuntu/macOS/Windows Node 20/22/24 cells `34668623265` pass on the corrected head. | AGENT-007 remains unchecked; selected-test semantics and end-to-end CLI failure qualification remain open. Backlog 156 unchecked / 113 checked / 269. No internal docs or blog/landing content was pushed.

- Web PostgreSQL tenant-boundary fixture | Web `08a8c46`, `bdb7045` | Added isolated PostgreSQL 15 in CI and a transaction-scoped temporary-table integration test using production Drizzle table definitions and tenant helpers. Test proves tenant A sees/updates only its row, forged organization/project insert IDs are overwritten, and tenant B's row remains unchanged. First hosted attempt found service-hostname resolution was invalid for a runner-hosted job; `bdb7045` uses published localhost port. Local full suite passes 74/74 with DB test active; typecheck, schema/migration checks, build, public-boundary audit, and high-severity dependency audit pass. GitGuardian and Vercel pass; corrected hosted GitHub run `34670279912` pending. | HOSTED-011 remains open because raw `Db` remains exposed at route boundaries; HOSTED-012 remains open pending route-level non-member, role-denial, and cross-tenant resource fixtures. Backlog 156 unchecked / 113 checked / 269. No blog/landing changes.

- Web scoped tenant database facade | Web `b0e3067`, hosted run `34671571482` | Organization API access now exposes a typed scoped-only Drizzle facade that applies organization/project predicates to query and mutation execution, scopes relational reads and joins, binds insert IDs, requires project scope for project-owned tables, rejects conflict-update bypass, and hides raw client/builder internals. Exact-head local checks pass 75/75 with PostgreSQL active, typecheck, schema/migration checks, build, and diff check; hosted run, GitGuardian, and Vercel pass. | HOSTED-011 remains unchecked pending a complete query/mutation audit and scoping of the separate organization-directory bootstrap; HOSTED-012 remains open pending route-level non-member, role-denial, and cross-tenant denial fixtures. Counts unchanged at 156 unchecked / 113 checked / 269. Private docs are local-only; blog/landing remain untouched.

- Web directory and project-scope completion | Web `39730f8`, `21c3b19` | Organization list/create handlers no longer receive a raw database client; repository operations capture authenticated user identity and integration tests prove user A/B directory isolation and owner-membership creation. Project access narrows the original auth-created scoped client via a private WeakMap rather than layering scoped proxies; live PostgreSQL test covers project-owned inserts through the narrowed client and rejects scope widening. Full local suite 76/76, typecheck, schema/migration checks, and production build pass. | Exact-head hosted run `34672637622` pending; HOSTED-011 stays unchecked until its green result; HOSTED-012 route-level denial fixtures remain open. Backlog 156 unchecked / 113 checked / 269.

- Web tenant authorization resolver hardening | Web `26fc04f`, `3544561`; PR #32 run `34675067531` | Extracted the production membership/project resolver from Clerk-bound auth into a testable server module. PostgreSQL fixtures cover active owner success; non-member vs missing organization masking; viewer denial for project management; inactive membership; foreign/missing project masking; project-scope narrowing; and active-only hiding of archived projects. A route-handler test using experimental Node module mocks passed under local Node 26 but failed on the supported Node 22 runner because mocked ESM exports were unavailable; the unstable harness was removed in `3544561`. Final exact-head local suite 79/79 with PostgreSQL, typecheck, schema/migration checks, build, and diff check pass; hosted Node 22 run `34675067531`, GitGuardian, and Vercel pass. | Preparatory only: HOSTED-012 remains unchecked pending reliable route-level actor/role and cross-tenant response fixtures. Count remains 155 unchecked / 114 checked / 269. Existing PR #32 remains OPEN/MERGEABLE; docs remain private and no blog/landing changes were made.
- Web tenant route permission contract | Web `9abfbed`, `5e0858c`; PR #32 hosted run `34676506674` | Static source contract asserts all 19 exported tenant API methods' least-privilege guard/action, requested organization/project IDs, authorization-before-scoped-query order, and shared bounded denial return. Combined suite: role/action matrix, denial response contract, resolver PostgreSQL integration, and static route audit. Full local suite 80/80 with PostgreSQL plus typecheck, schema/migration checks, production build, public-boundary audit, and diff check; Node 22 hosted run, GitGuardian, and Vercel pass. | Stronger preparatory evidence only. HOSTED-012 remains unchecked until real route handlers are exercised with denied actors and cross-tenant requests and their responses are compared for non-enumeration. Backlog 155 unchecked / 114 checked / 269; PR #32 OPEN/MERGEABLE.
- Web tenant route denial acceptance | `8263cf6`; PR #32 hosted run `34677302797` | Real exported handler functions for all 19 protected tenant API methods are invoked with unauthenticated/forbidden authorization outcomes and project-not-found outcomes where applicable; each response is checked for its fixed status/body and each guard for exact requested tenant/resource IDs and action. Exhaustive role/action tests and live PostgreSQL resolver tests cover non-member, inactive, forbidden-role, and missing/foreign-resource states. Hosted Node 22 passes 81/81 tests with PostgreSQL, typecheck, schema/migration checks, production build, public-boundary, dependency, and tracked-secret guards; GitGuardian and Vercel pass. | HOSTED-012 accepted; backlog 154 unchecked / 115 checked / 269. R-007 remains open for operator/provider privileged-access controls; PR #32 remains OPEN/MERGEABLE.
- Production migration schema preflight (evidence only) | Web `23886fc` read-only `db:migration-audit`; exact timestamp `2026-09-12T12:00:49.307Z` | Updated local Neon PostgreSQL credential was used without printing it. The production audit ran the repository's repeatable-read/read-only transaction, with exact counts disabled. It returned 10 present / 23 missing among the 33 declared application tables; only the `public` application schema exists, and no migration-history table/columns were discovered. Repository migration/journal validation passed for 15 ordered PostgreSQL migrations, fingerprint `sha256:1ac092dfddcd50be505a978436871e16e3e933854dc997c11d6bad20a66b7931`. No customer rows, DDL/DML, migration, or write. | HOSTED-013 and R-021 remain open/blocked: production baseline/history and source-data reconciliation are not qualified; no migration is authorized. Counts unchanged at 152 unchecked / 117 checked / 269.
- RECORD-010 legacy attestation lifecycle (progress, unchecked) | CLI `077b008`; Web `e58dbd8`; existing PRs #38/#33 | CLI `attest` emits fixed deprecation metadata without echoing local paths/URLs or claiming signing/publication; the unused Ed25519 summary API/types are removed in favor of canonical Release Record types; MCP tool metadata names the retired behavior. Web legacy POST returns 410 before auth/body/DB access; existing `/verify/[hash]` records remain readable but are labeled unsigned caller-submitted summaries, the hash is identified as a lookup key only, and the page no longer writes view events as verification. Focused CLI tests 3/3, CLI/shared/MCP Turbo checks 18/18, Web 93 pass/2 DB-gated skips, Web typecheck/build, Drizzle check and 17 migrations pass. Exact-head CLI self-scan `34815966866` and nine-platform matrix `34815966832` pass; Web `34815968202`, GitGuardian, and Vercel pass. | RECORD-010 remains open: `/verify` index still calls historical page views “verified” and instructs users that `verglos attest` publishes; it is a marketing surface frozen until Phase 8. No production database operation or data deletion occurred; tracker counts remain 134 unchecked / 135 checked / 269.
## Progress · 2026-10-02 · production browser lab and Hunt boundary correction

CDP measurements over the existing authenticated Chrome session cover six deployed routes
with TTFB/FCP/load, CLS, landmark, focusable, and overflow observations. Evidence:
`docs/shipping/evidence/public-cwv-lab-sweep-2026-10-02.md`. This strengthens QUAL-WEB-006
lab evidence only; it does not substitute for organization-dashboard data, human
screen-reader review, large-dataset testing, or field CWV. Hosted Ubuntu self-scan
`36984993552` already supplies Linux PID/IPC namespace evidence for HUNT-011; recipe
provenance/execution and independent review remain open. No checkbox changed.
## Progress · 2026-10-02 · current CLI full-history fixture scan

The full-history OWASP Juice Shop clone was rescanned with current merged CLI tree
`b781bc4` (tree `466d71a`), exit 0. The run walked 906 files, executed all requested
detectors, and recorded the exact score/counts and report digests in
`docs/shipping/evidence/juice-shop-full-scan-current-2026-10-02.md`. This strengthens
technical fixture evidence only; it does not close customer consent, independent review,
legal approval, or Hunt adjudication gates. No production operation occurred.
## 2026-10-03 · CLI PR #57 immutable release-tag guard

- **Code:** CLI `2f18041` merged as `8706c9701ad62a39939080e7b7200f3db66c4cb4`.
- **Contract:** `verify-release-tag.mjs` validates the exact release ref and all six public package versions before publication; malformed or mismatched refs fail closed. `publish-workflow-contract.test.mjs` asserts the guard precedes `npm publish`; focused tests pass 3/3 and combined release-safety checks pass 11/11.
- **Hosted evidence:** Self-scan `37111006863` and Platform matrix `37111006817` passed, including in-toto binding and all nine Ubuntu/macOS/Windows Node 20/22/24 cells.
- **Boundary:** DIST-002/003/006 remain unchecked pending protected publishing/legal approval, real release attestation, and rollback/revocation evidence. No tag, publication, deployment, or production operation occurred.

## 2026-10-03 · CLI PR #58 rollback/revocation contract

- **Code:** CLI `28512c7` merged as `8e39aa7c82c1f9630ba1a2f95b13271f0c1e3fe6`.
- **Contract:** Shared `decideReleaseRollback` covers five release surfaces; refuses missing approval, mutable/same references, cross-kind targets, history invalidation, and signing-key revocation without a distinct replacement. Focused shared tests, full typecheck, and build passed.
- **Hosted evidence:** Self-scan `37111798321`, Platform matrix `37111798352`, and in-toto binding passed; all nine platform cells passed.
- **Boundary:** DIST-006 remains unchecked. This is a decision contract only; no registry, engine, feed, signing, or deployment rollback/revocation operation was executed.
# 2026-10-03 · CLI PR #59 protected publication environment

- **Code:** CLI commit `d531540` (PR `#59`, merged as `93dbcf3`) gates the publication job behind the `release` environment and serializes registry mutations with `verglos-release-publication` concurrency.
- **Verification:** Local shared tests, publish workflow contract test, full typecheck, and diff checks passed; hosted Self-scan, in-toto, and completed platform cells passed. Windows Node 20 remained in progress at merge.
- **Boundary:** DIST-002 remains unchecked until GitHub environment reviewers are configured and a real keyless trusted publication/attestation is completed. No publication or production operation occurred.

- **Operational evidence:** GitHub environment `release` now has required reviewer `anuragyadav-git` and protected-branch policy (configured 2026-10-03T09:19:05Z). Configuration alone is not release evidence.
# 2026-10-03 · CLI PR #60 signed organization policy cache substrate

- **Code:** CLI `f547cfa` (PR `#60`, merged as `b7c0799`) adds `organization-policy.ts` and tests, exported through shared package index.
- **Evidence:** Signed envelope verification binds exact organization/repository scope, policy digest, active Ed25519 key identity, and canonical signature bytes; offline resolution accepts only a matching unexpired cache. Focused tests 3/3, typecheck/build/diff green; hosted checks still running.
- **Boundary:** TEAM-CLI-001 remains unchecked pending authenticated API fetch/cache persistence, CLI command wiring, and hosted policy integration. No production or database operation occurred.
# 2026-10-03 · post-merge hosted and Web regression verification

- **Evidence:** CLI Self-scan `37112986892` passed; platform matrix `37112986882` has four still-running cells and all completed cells green. Web `main` regression passed 837/859 with 22 skips and zero failures.
- **Decision:** Verification strengthens current-source confidence but does not satisfy TEAM-CLI-001 hosted policy API evidence or any external acceptance gate. No production or database write.
# 2026-10-03 · stale matrix cancellation and merged-main requalification

- **Evidence:** Matrix `37112986882` was cancelled after stale metadata and no Windows logs; fresh merged-main matrix `37113320349` targets `b7c0799` and is queued.
- **Decision:** Do not infer platform acceptance from the stale run. Await the fresh run's terminal result; no checkbox changed.
# 2026-10-03 · hosted runner infrastructure blocker

- **Evidence:** Runs `37112986882` and `37113320349` both stopped updating with matrix jobs lacking logs; the second cancellation request is still pending. Self-scan `37112986892` remains terminal-successful.
- **Boundary:** Platform acceptance is unverified; this is not treated as a code failure or a completed gate.
# 2026-10-03 · organization policy cache persistence (CLI PR #61)

- **Code:** CLI `9554125` (PR `#61`, pending) adds `organization-policy-cache.ts` and tests.
- **Evidence:** Cache persistence validates canonical policy digest and exact scope, refuses symlink/oversized/malformed/tampered entries, and uses exclusive temporary writes plus atomic rename. Full local CLI suite, typecheck, build, and diff checks pass.
- **Boundary:** TEAM-CLI-001 remains unchecked pending authenticated policy API fetch and command integration. No production or database write occurred.

# 2026-10-03 · current-source acceptance corpus and Web self-scan

- **Evidence:** Full non-shallow public technical fixtures Juice Shop (`1618a611`), NodeGoat (`c5cb68a`), and DVNA (`9ba473a`) were scanned with CLI `9554125`; all detector/provenance coverage completed. Current Web `main` was also scanned: 396 files, 17 findings, score 79/medium.
- **Artifacts:** Private corpus and self-scan evidence are recorded under `docs/shipping/evidence/acceptance-corpus-2026-10-03.md`, `juice-shop-scan-2026-10-03.md`, and `verglos-web-self-scan-2026-10-03.md`; reports remain in ignored local evidence storage.
- **Boundary:** This is technical fixture evidence only. It does not represent customer consent, OWASP/Appsecco endorsement, independent review, or final acceptance. No checkbox or production state changed.

# 2026-10-03 · CLI PR #61 hosted completion

- **Evidence:** Merged PR `#61` at `18ab8e7`; run `37113657045` completed successfully with all nine Ubuntu/macOS/Windows × Node 20/22/24 platform cells and in-toto binding green.
- **Boundary:** TEAM-CLI-001 remains open for authenticated organization-policy HTTP fetch and user-facing command integration. No production or database operation occurred.

# 2026-10-03 · nodejs-goof corpus expansion

- **Evidence:** Full clone of Snyk Labs `nodejs-goof` at `add14ba59e98240d9e00a235dd7d42cd61ae9912` (Apache-2.0) scanned with CLI `9554125`; 25 files, 29 findings, score 9/critical, complete detector/provenance coverage.
- **Boundary:** Public technical fixture only, with local authorization notice; not customer consent or vendor endorsement. `ACCEPT-001` remains open and no production state changed.

# 2026-10-03 · damm-vulnerable-node and buggy-node corpus expansion

- **Evidence:** Full clones at `1946570b` (MIT) and `b1b9cbc8` (ISC) were scanned with CLI `9554125`; complete detector/provenance coverage produced 17 and 57 findings respectively.
- **Boundary:** Both are public technical fixtures with local scope notices, not customers or endorsements. The six-repository corpus remains preparatory ACCEPT-001 evidence; no production state changed.

# 2026-10-03 · acceptance corpus verification harness

- **Code:** Private `scripts/verify-acceptance-corpus.mjs`, exposed as `pnpm acceptance:corpus:verify`.
- **Verification:** Six frozen full clones, authorization notices, report schemas, complete detector coverage, and JSON/HTML SHA-256 hashes verified at current unreleased CLI commit `9554125`; manifest hash `54c3f3bdc111d3a2faf35c841a8fb057649b6a859a5a45f9628945100ea8b2f4`.
- **Boundary:** Reproducibility/integrity evidence only. ACCEPT-001/003 remain open for required corpus breadth, acceptance stories, customer authorization, and independent review.
# 2026-10-03 acceptance-story substrate evidence

`docs/shipping/evidence/acceptance-story-tests-2026-10-03.md` binds the latest
unreleased CLI source `955412516b96cc09393e78c43bf7d02b9abd05d9` to the
package-owned 236/236 CLI test result, five Hunt Docker-adapter checks, and
72/72 Web Studio/Enterprise/Team/quality substrate tests. The initial failed
root invocation is classified as harness resolution (`tsx` absent at the
temporary worktree root), not a source regression. This evidence is progress
only and does not satisfy external, authenticated, customer, legal, or
independent-review gates.
# 2026-10-03 acceptance-story runner

Private `scripts/verify-acceptance-stories.mjs` runs the package-owned latest
CLI suite, Web full suite, and composed Studio/Enterprise/Team/quality suites,
records exact source commits, output hashes, exit codes, and parsed totals, and
fails closed on any non-zero command. Run result: CLI 236/236; Web 877/905 with
28 environment skips and zero failures; composed Web 72/72. This advances
ACCEPT-002/003 reproducibility without asserting external acceptance.

# 2026-10-06 DIST strict six-package verifier

CLI PR #70 (`67a132c`) merged as `3a0959a`. The publish workflow invokes strict
artifact verification requiring exactly the six public npm archives at one
shared version. Local verifier 4/4, workflow/platform contracts 2/2, typecheck
13/13, hosted platform run `37472923540`, and self-scan `37472923665` passed.
This is preparatory evidence only; protected publication, legal clearance,
actual provenance, and rollback evidence remain open.

# 2026-10-06 production migration 0021–0025

Production migration evidence is retained in
`docs/shipping/evidence/production-migration-0021-0025-2026-10-06.md`.
Read-only preflight found 21 applied migrations; snapshot/restore rehearsal
reached 26 migrations in Docker PostgreSQL 18. Founder-authorized production
apply of additive migrations `0021`–`0025` completed successfully. Verification
confirmed 26 migration rows, new SCM/deletion tables and indexes, unchanged
bounded row counts, Web qualification 23/23, typecheck, Drizzle, and migration
checks. This proves schema deployment only, not provider cutover or deletion
acceptance.

# 2026-10-06 organization policy client

TEAM-CLI-001 implementation is present at CLI commits `04b48fb` / `390b0c0`:
signed, versioned organization/repository-bound policy verification, bounded
remote fetch, atomic private cache, offline expiry checks, and a CLI command
that exposes source and policy digest. Focused cache/fetch tests pass 4/4.

- **TEAM-CLI-001 canonical contract progress (unchecked):** Web PR #143
  (`b575084`, merged `6bc6bcd`) adds a versioned recursive canonical JSON
  serializer and digest helper with a nested fixture matching the CLI digest.
  The legacy Web digest path is intentionally unchanged until stored-row
  inventory and a reviewed migration/rollback plan exist. Policy tests 12/12,
  Web typecheck, and Vercel Preview passed. Hosted endpoint activation,
  production reconciliation, and PLAN-CLI-001 evidence remain open under
  `R-042`; no production operation occurred.
The hosted policy API and production PLAN-CLI activation are not qualified, so
the backlog item remains open.

## Scope addendum · 2026-10-06 · GitHub org, payments, acceptance corpus

`GITHUB-WEB-001..004` trace to immutable GitHub account/repository identity, App
installation/token lifecycle, delivery replay/lifecycle reconciliation, and an
authorized organization cutover. `PLAN-WEB-013..015` trace to a server/catalog
payment-method surface and account-specific Razorpay test evidence; provider
documentation is not runtime evidence. `ACCEPT-011..014` trace to a post-shipping-
candidate private non-shallow TypeScript/JavaScript fixture phase, reproducible current-source scans,
held-out false-positive review, and a final regression/go-no-go record. None of
these items is accepted by this planning entry; no public repository receives
fixture data, credentials, customer data, or private competitive intelligence.

# 2026-10-07 · QUAL-WEB-005 deletion-worker boundary

The account-deletion route and pure qualification gates are implemented, but
`QUAL-WEB-005` cannot be traced to an operational acceptance path yet. The
current schema has no durable legal-hold/customer-held authority, and the
organization-scoped generic queue cannot safely represent a user-scoped account
deletion job spanning the owned data graph. The exact gap and required design
boundary are recorded in
`docs/shipping/evidence/qual-web-005-deletion-worker-boundary-2026-10-07.md`.
No checkbox changed and no destructive operation ran.

# 2026-10-07 · QUAL-WEB-006 large-data qualification

Web PR #150 (`a78578e`) merged as `a64407d`. Its organization monitoring
repository fixture exercises 45 components, 124 selected-component matches,
bounded pagination, freshness/failure projection, truncation, and foreign-
tenant exclusion. The disposable PostgreSQL run passed 1/1 with zero skips;
typecheck, schema, 29-migration ordering, and production build also passed.
The evidence remains partial because authenticated slug runtime, human
screen-reader, and field-CWV qualification are not proven.

# 2026-10-07 · organization entry implementation

`QUAL-WEB-006` now traces to Web PR #151, which adds the authenticated `/orgs`
directory and account navigation link over the existing actor-bound directory
repository. The route never accepts a tenant identifier from the URL; each
slug-scoped link remains guarded by the organization layout. Local 2/2 focused
contracts, typecheck, schema check, and production build pass. Hosted run
`37557043246` and the required provider checks passed; PR #151 merged as
`c1bca533`. The full qualification gate remains open for authenticated runtime,
human screen-reader, and field-CWV evidence.

# 2026-10-07 · production organization entry verification

Vercel production deployment `dpl_G7umvo3ZRerRWeg5SZUi8fPRnnHQ` now serves
the merged `/orgs` entry route. Existing authenticated page 13 received HTTP
200, rendered the organization empty state, loaded the route chunk, and
reported no console messages. No organization membership was available for
slug-scoped dashboard exercise; the broader `QUAL-WEB-006` gate remains open.

# 2026-10-07 · organization creation CSRF hardening

The state-changing organization creation route now rejects cross-origin POSTs
before auth/database work. Web PR #152 carries the focused ordering contract;
local test/typecheck/schema/build pass, hosted workflow `37557549508`, Vercel,
GitGuardian, and Preview Comments passed, and the PR merged as
`6fccfb26ffb707e53c3ef44166b42280be29de55`. This is remediation evidence
only; no checkbox changed.

# 2026-10-07 · payment production-method configuration hardening

Web PR #149 head `6b5da26` makes production payment configuration fail closed
when `RAZORPAY_ENABLED_PAYMENT_METHODS` is absent or blank and retains the
QR-only rejection. Focused payment/runtime tests pass 8/8; typecheck, schema,
and 40-page preview build pass. Hosted run `37558018780` and Vercel preview
were pending/deploying at capture. This is remediation evidence only; no
payment or release gate was accepted and no checkbox changed.

# 2026-10-07 · payment hosted-correction

Hosted workflow `37558018780` failed on the expected error list for missing
production controls after the intentional payment-method validation change;
the observed suite total was 870 pass / 1 skip / 1 fail. Web PR #149 now
points at `900a6a5` with the corrected assertion. Local serial verification is
850 pass / 22 explicit skips; replacement hosted workflow `37558287090` passed
all configured checks and Vercel completed. This is correction evidence only;
no gate or checkbox changed. Provider-enabled method and lifecycle evidence
remain open.

# 2026-10-07 · QUAL-WEB-005 versioned inventory substrate

`QUAL-WEB-005` now traces to Web PR #153 head
`718aadcaa384dcfd8a5fc4789c3b62c23c9e3858` for a versioned seven-kind
account-deletion inventory, source-table ownership map, customer-held
disposition contract, and fail-closed stale/incomplete-inventory gate. Local
focused tests pass 22/22, with typecheck, database/schema checks, ordered
migration validation, diff check, and 38-page build pass. This is not the
operational acceptance path: durable hold authority, customer-held digest
registration, bounded worker, row-count/audit reconciliation, restore
rehearsal, and authenticated non-production E2E remain required. Hosted
workflow `37559045448` was pending at capture; no checkbox changed.

# 2026-10-07 · QUAL-WEB-005 durable hold authority substrate

PR #153 head `adf9a23b395a2c35208bd7d9cfcc7973300c2827` now traces the
deletion boundary to an unapplied durable hold schema and pure lifecycle
contracts. The substrate records typed hold kind, actor, reason, expiry, and
explicit release evidence; it does not execute deletion. New tests pass 3/3,
combined focus 25/25, serial 846 pass / 22 explicit skips, typecheck/schema/
migration/diff/build pass, and the journal now validates 30 migrations. Hosted
checks for the new head were in progress at capture. Worker, customer-held
digest proof, reconciliation, restore rehearsal, and authenticated E2E remain
unproven.

# 2026-10-07 · QUAL-WEB-005 customer-held digest registry substrate

PR #153 head `4c5966f` now traces the customer-held boundary to a source-only
digest registry and pure canonicalization/comparison contracts. Only
`sha256:` identities for signed `.vgl` records are stored; record bytes are
never part of this surface. Focus 28/28, serial 846 pass / 22 explicit skips,
typecheck/schema/migration/diff/build pass, and 31 migrations validate. An
authenticated writer, deletion worker, reconciliation receipt, restore
rehearsal, and non-production E2E remain open; hosted checks were pending.

# 2026-10-07 · QUAL-WEB-005 bounded worker contract

PR #153 head `aef06b7` traces the deletion boundary to a fenced, user-scoped
worker orchestration contract. It binds the claimed request scope, checks
inventory and holds before adapter calls, uses per-kind idempotency keys,
compares held digests, requires the existing execution decision, and refuses
completion without a fenced audit receipt. Focus 31/31, negative boundary 2/2,
serial 846 pass / 22 explicit skips, typecheck/diff/build pass. The store
adapter, restore/rollback rehearsal, and authenticated E2E remain unproven;
hosted workflow `37560432960` was in progress.

# 2026-10-07 · QUAL-WEB-005 worker scope-fence correction

PR #153 head `ade21b6f4c74b0a27bcf349bded6d9ceb7e39ee0` now checks the claimed
job's persisted user identity before reading state or invoking a deletion
adapter. The worker/deletion focus passes 32/32, the negative-boundary suite
passes 2/2, and hosted workflow `37560704115` passes with the required provider
checks. This remains traceability for the contract only: no operational store,
job route, destructive SQL, restore rehearsal, or authenticated non-production
E2E exists, so `QUAL-WEB-005` remains unchecked and source-only migrations
0029/0030 remain unapplied.

# 2026-10-07 · QUAL-WEB-005 fenced store adapter substrate

PR #153 head `654c78c69a44d7b5aad4733ec7cb364d760b76b0` now traces the durable
job to an atomic PostgreSQL claim/retry/block adapter with `SKIP LOCKED` and
worker/attempt fences. Disposable PostgreSQL integration 1/1, serial 846/23/0,
typecheck/schema/migration/negative/build/diff checks pass; hosted workflow
`37561862519` was queued at capture. Inventory reads, per-kind deletion,
reconciliation/audit, restore rehearsal, and authenticated E2E remain absent,
so this is substrate only and `QUAL-WEB-005` remains unchecked.

# 2026-10-07 · QUAL-WEB-005 fenced inventory read

PR #153 head `4656013` traces the user-scoped job to lease-fenced reads of all
seven hosted kinds, active holds, and customer-held digest identities. The
disposable PostgreSQL integration is 1/1 and the full local qualification set
passes; hosted workflow `37562115786` was pending at capture. The adapter keeps
`inventoryComplete=false` because supporting user/license/retention data and
legal dispositions are not yet covered. Destructive SQL, reconciliation/audit,
restore rehearsal, and authenticated E2E remain absent.

# 2026-10-07 · QUAL-WEB-005 user-scoped job persistence

PR #153 head `b91222a8d4d6ffd08f2be71391d89a6dafedab1` now traces the deletion
request to a durable user-scoped job inserted in the same transaction. The
schema contract is bounded by request/idempotency uniqueness, attempts,
status/kind checks, due time, and paired lease fields. Focused 16/16,
disposable PostgreSQL integration 1/1, serial 846/23/0, typecheck/schema/
migration/build/diff checks pass. This remains substrate only: hosted checks
were pending at capture, and no store claim/retry adapter, destructive SQL,
reconciliation receipt, restore rehearsal, or authenticated E2E exists.

# 2026-10-07 · QUAL-WEB-005 fenced inventory hosted verification

PR #153 exact head `4656013425c4cadb498f004c1057aa6f1d5931b6` passed hosted
workflow `37562115786` with the full configured qualification, public-boundary,
dependency/license/SBOM, secret, Vercel, GitGuardian, and Preview Comments
checks. The evidence strengthens the lease-fenced inventory read only;
supporting ownership/retention dispositions, destructive transactions,
reconciliation/audit, restore/rollback, runtime wiring, and authenticated E2E
remain absent, so `QUAL-WEB-005` remains open.

# 2026-10-07 · QUAL-WEB-005 fenced deletion receipt

PR #153 exact head `52be606` traces the live-fenced completion boundary to an
immutable source-only receipt with unique request/idempotency identity and
bounded per-kind metadata. Disposable PostgreSQL integration 1/1, serial
846/23/0, typecheck/schema/33-migration/build/diff checks, and hosted workflow
`37562587132` pass. Destructive per-kind SQL, complete ownership/retention
inventory, runtime wiring, restore/rollback, and authenticated E2E remain
absent, so `QUAL-WEB-005` remains open.

# 2026-10-07 · PLAN-WEB-013 hosted payment method catalog

PR #149 exact head `db68157da039d8aab939818f9023f867028e4432` traces the
checkout method surface to a server-authoritative Razorpay catalog. Hosted
workflow `37563023349` passed the configured code, schema, build, boundary,
dependency, and secret checks; local payment/runtime focus is 25/25 and the
serial suite is 850/22/0. This is catalog substrate only: account-enabled
method configuration, provider lifecycle/replay qualification, production
reconciliation, and the remaining payment plans are absent. `PLAN-WEB-013`,
`PLAN-WEB-014`, and `PLAN-WEB-015` remain open.

# 2026-10-07 · QUAL-WEB-005 fenced per-kind transactions

PR #153 exact head `9476e5d018c9ab18bd09fa6bec4f89e2ff353e92` traces each of
the seven hosted kinds to a lease-fenced, user-scoped PostgreSQL transaction
and durable request/kind idempotency receipt. Focused 29/29, disposable
PostgreSQL 1/1, serial 846/23/0, 34-migration/schema/build/boundary/truth
checks, and hosted workflow `37563632682` pass. This is an operational
substrate milestone only: the worker gate remains `inventoryComplete=false`
until supporting retention/ownership, runtime invocation, reconciliation,
restore/rollback, and authenticated E2E are qualified.

# 2026-10-07 · QUAL-WEB-005 bounded runtime runner

PR #153 exact head `1f8571b4a146e9ef78ca9ae25c13b86f8e89665c` traces due
user-scoped deletion jobs through a batch-limited runner and an authenticated
Node cron route. Route contract 2/2, disposable PostgreSQL integration 1/1,
negative 2/2, truth registry 25/25, serial 846/23/0, 34-migration/schema,
build, and boundary checks pass; hosted workflow `37563987818` / job
`112607416147` passes. The integration remains blocked by the deliberate
`inventoryComplete=false` fence. This is runtime wiring evidence only:
production invocation, supporting ownership/retention disposition,
reconciliation, restore/rollback, and authenticated non-production E2E remain
unqualified, so `QUAL-WEB-005` remains open.

# 2026-10-07 · QUAL-WEB-005 supporting disposition registry

PR #153 exact head `f83af5c0bdb9b15ee87ec83ac365e1fc5f91bd26` traces all 16
supporting tables to an explicit bounded disposition, rationale, and approval
flag. Focused deletion/hold/inventory tests are 11/11; serial is 846/23/0;
typecheck, 34-migration/schema, build, and boundary checks pass; hosted
workflow `37564437899` / job `112608834179` passes. This improves omission
detection only: the destructive store does not consume the registry, and
reconciliation, recovery, and authenticated non-production E2E remain
unqualified. `QUAL-WEB-005` remains open.
