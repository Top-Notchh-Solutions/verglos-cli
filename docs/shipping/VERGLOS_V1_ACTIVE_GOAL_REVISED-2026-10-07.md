# Verglos V1 Active Shipping Goal — Whole-Backlog, Preview, and Production Shipping

Effective checkpoint: 2026-10-09. This file is the authoritative replacement
goal for the remaining shipping work. Replace the previous active goal with
this complete version before resuming.

## 1. Objective

Ship the complete Verglos V1 across:

- `/Users/anuragyadav/Developer/TopNotchh-Workspace/verglos-cli`
- `/Users/anuragyadav/Developer/TopNotchh-Workspace/verglos-web`

The primary objective is to complete the whole authoritative private backlog
with real implementation, integration, qualification, security review,
release evidence, and final acceptance. Backlog delivery is the main
workstream. Release gates and Production are parallel execution workstreams:
close gates that are technically ready, perform the full Production code,
configuration, smoke, reconciliation, rollback, and activation work in
bounded stages, record external gates with their real owner and missing
artifact, and continue the largest dependency-ready implementation batches
without treating the gate list as a substitute for product shipping.

Production is not excluded from this goal. It has four explicit stages:

1. read-only audit and configuration verification;
2. fail-closed application deployment and public smoke qualification;
3. provider/database/payment activation only after the operation-specific
   preflight, backup/restore, reconciliation, and rollback evidence exists;
4. post-activation monitoring, payment/entitlement reconciliation, and
   rollback or forward-fix rehearsal.

Test Mode credentials, Test Mode plan IDs, Preview databases, and test
webhook fixtures must never be copied into Production. A Production deploy
with recurring billing disabled is still a real Production shipping event;
it is not the final billing launch. Production billing and database writes
remain part of this goal and will be executed when their concrete preflight
criteria are satisfied.

The payment gate had one explicit product gap: the Web code had billing ledger
and subscription-webhook handling, but no server route that created a provider
subscription. Web commit `54e6fd0344b2f8b74e2c4d5ff15a0b02c12b51dd` now adds
the catalog-bound creation route, pending binding, owner-bound status read,
and hosted UI. It still must be qualified against real isolated Razorpay Test
Mode subscription authorization and lifecycle events before Gate 4 can be
called complete.

Verglos is intended for local, CI, hosted, team, organization, and
enterprise-shaped use cases. It is not a local-only product. Those claims are
valid only when the corresponding authorization, isolation, entitlement,
operational, billing, provider, release, and acceptance evidence exists.

The objective is timeboxed to the remaining 24-hour active shipping window,
with a three-hour implementation target wherever current evidence and hosted
dependencies allow. The deadline accelerates execution; it does not permit
skipped gates, fabricated evidence, unsafe production changes, or redefining
“whole shipping” as a partial launch.

Every active work turn must do at least one of the following:

1. Implement or repair product code, tests, integration, or release tooling
   for an unchecked backlog item.
2. Execute the smallest missing qualification needed by an unchecked item.
3. Record the exact external blocker, owner, evidence gap, expiry/review date,
   and release decision, then immediately continue with the next independent
   unchecked item.

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
- Current Web implementation branch: `54e6fd0344b2f8b74e2c4d5ff15a0b02c12b51dd`.
  It adds the provider-subscription creation/status path and remains a code
  qualification batch until the isolated provider lifecycle is evidenced.
- Preview deployment `dpl_CwmAKov2aoDJmyk9o5LqHS849TEJ` is READY at
  `https://verglos-dhp0dkyma-anuragyadav20062002s-projects.vercel.app` with
  isolated Preview configuration and canonical Test Mode plan IDs.
- Production deployment `dpl_E3Xr4UZe1ZXaZfRB7ygvS8HvmQTs` is READY and
  aliased to `https://verglos.com`. Its 45-page build and runtime
  configuration passed; Production plan IDs were deliberately not added, so
  the new recurring subscription UI remains disabled there until live-mode
  Production activation is separately preflighted.
- Razorpay Test Mode accepted the credentials in
  `verglos-web/.env.gates.testing`; no rotation was required. The account had
  no plans, so the canonical Pro plans were created in Test Mode only:
  monthly ₹2,809.43 (`plan_TlaD3tfF8tStbw`) and yearly ₹28,094.30
  (`plan_TlaD4ASatpFUrM`). Preview now has those non-secret plan IDs and a
  12-cycle test subscription count. No Production provider state changed.

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
- The latest read-only production browser check rendered UPI, Cards,
  Netbanking, Wallets, EMI, and Pay Later with no console errors and no
  QR-only path. It did not prove Test Mode, order creation, capture, refund,
  webhook, entitlement, renewal, cancellation, or payment acceptance.
- Before the current rollout, production browser/deployment qualification
  performed no Production database, migration, payment, provider,
  entitlement, or account write. On 2026-10-09, the reviewed Web code was
  deployed to Production as `dpl_E3Xr4UZe1ZXaZfRB7ygvS8HvmQTs`; the build
  passed, `https://verglos.com/` and `/checkout` returned 200, and the
  subscription-creation route correctly returned 405 to an unauthenticated
  GET. This was a bounded application deployment only: no Production
  database, migration, payment, provider, entitlement, or account write
  occurred, and no Test Mode plan or credential was copied to Production.
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
- The payment direction is now all enabled provider methods, not QR-only. QR
  may remain optional, but it cannot be the only payment route or lifecycle
  qualification path.
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
  Preview and Production expose only the provider-testable method set
  `card,netbanking,wallet,emi`; UPI/UPI QR and Pay Later were removed after
  their account fixtures produced no usable payment lifecycle. The Preview
  webhook is Razorpay Test Mode and points to the isolated Preview target.
  This proves configuration and isolation only; it does not replace the
  remaining provider lifecycle and Production-reconciliation evidence.
- Gate 4 qualification now has canonical Test Mode evidence: 16 payments at
  the canonical monthly Pro amount, captures for card/netbanking/wallet/EMI,
  failures for card/netbanking/wallet, and two processed full refunds. The
  isolated database suite passed hosted-order, renewal-ordering,
  cancellation-ordering, replay, out-of-order, tenant-binding, and partial/full
  refund checks. Razorpay reported zero Test Mode subscriptions. The Web
  subscription-creation route is now implemented and isolated route
  qualification passed **2/2**, but provider subscription
  authorization/renewal/cancellation/expiry is not claimed. The valid Test
  Mode credential and canonical Test Mode plan setup are now available, but
  the hosted subscription lifecycle still needs to be run and reconciled.
  Private evidence is
  `docs/shipping/evidence/plan-web-011-012-subscription-checkout-code-2026-10-09.md`.
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
documents. We qualify the active technical gate while continuing the complete
product/backlog pass with every document synchronized. A gate is closed only
when its acceptance artifact exists in private evidence; founder permission
does not turn missing provider, legal, reviewer, customer, or publishing
evidence into a pass.

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
   notes, tenant binding, and pending persistence. The next requirement is
   real isolated Test Mode authorization, renewal/charge, failure,
   cancellation/expiry, refund, replay, and entitlement reconciliation. The
   valid Test Mode credentials and canonical plan objects are now available;
   hosted lifecycle execution and reconciliation remain open. Do not use
   Production DB rows, `$1` pricing, or manual entitlement edits as
   substitutes.
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

Complete technical work within current authority for the active gate while
also taking independent, dependency-ready backlog batches. For an external
gate, record the exact owner, missing artifact, expiry/review date, safe next
action, and release decision; do not claim it passed. Do not wait idly for an
external reviewer or legal approval while independent code work remains, but
do not move the release forward as though that gate were closed.

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
when its separate write preflight passes.

The immediate technical sequence is:

1. Run isolated Preview/Test Mode subscription lifecycle evidence against the
   newly implemented creation/status path.
2. Reconcile the
   payment ledger, provider records, and entitlement state.
3. Close only the payment backlog IDs whose complete criteria are evidenced.
4. Run the Production read-only smoke/reconciliation pass against the newly
   deployed code; do not enable recurring billing from Test Mode configuration.
5. Resolve the npm/CLI versus Web SCM scope decision before attempting Gate 5.
6. Prepare the AppSec/legal/release packets while continuing dependency-ready
   backend/CLI batches.
7. Run final acceptance only after all required gates, Production activation
   preflights, and the release-candidate
   freeze are complete.

## 4A. Execution priority: dependency-ready backend/CLI first

Do not move to Web polish merely because it is easier. At the beginning of
each batch:

1. Read the live private backlog and recompute the unchecked queue.
2. Select the largest coherent set of dependency-ready backend/CLI IDs.
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
10. Record remaining external gates with their owner and next action, then
    immediately take the next independent backend batch.

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

Then continue with the next independent item. Do not relabel a blocked gate as
complete and do not repeatedly rerun unchanged tests to fill time.

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
- state the next independent batch or exact blocker.

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

The QR-only direction is superseded. Implement and qualify a server- and
catalog-driven provider-hosted Razorpay Checkout/order flow that exposes every
payment method actually enabled and approved for the account. The UI must not
promise a method the provider configuration does not enable.

The checkout must bind the server-selected catalog snapshot, plan, cadence,
currency, amount, entitlement period, user, organization where applicable,
and checkout ID. Client input must never choose or override price,
entitlement duration, plan, or provider identity. Provider success/capture and
the signed webhook are authoritative for entitlement; polling is read-only and
cannot grant access.

For every method currently enabled by the provider account—cards, netbanking,
wallets, and EMI—qualify in Razorpay Test Mode, privately and redacted, across
the full matrix below. UPI/UPI QR and Pay Later are not currently enabled
because this account exposed no usable test lifecycle for them. If the account
later exposes an approved usable fixture, add it to the matrix before release;
do not claim a method merely because Checkout renders its label.

The same qualification must cover the provider-subscription path now that the
catalog-bound subscription-creation route and owner-bound status read are
implemented. Webhook lifecycle code plus a route is still not acceptance until
real isolated Test Mode lifecycle evidence exists.

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
- every enabled payment method is qualified or has a documented provider
  limitation and release decision;
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
4. Execute the current technical gate, the Production read-only/deployment
   qualification, and the largest independent backend/CLI
   batch in the same shipping pass. The subscription-creation implementation
   batch is complete in Web `54e6fd0`; continue with isolated Preview/Test
   Mode lifecycle evidence for `PLAN-WEB-011`, followed by reconciliation.
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
10. If a gate is externally blocked, record the real owner and artifact once;
    do not fabricate a signature, consent, legal approval, customer result,
    provider lifecycle, or trusted publication. Continue only with independent
    work that does not falsely depend on the missing gate.
11. After Gate 4 is genuinely closed, resolve npm/CLI-only versus Web SCM
    scope before Gate 5. Do not treat GitHub/GitLab integration as an npm
    publishing prerequisite.
12. Keep only unqualified Production payment/database writes, customer
    fixtures, legal gates, AppSec approval, protected publishing, and final
    POC acceptance closed until their actual evidence and operation-specific
    preflights exist. Continue Production code, read-only audit, smoke,
    monitoring, reconciliation, and rollback work in every applicable pass.

The next batch must not begin with a repeated unchanged suite, a speculative
marketing edit, a production payment click, a direct database entitlement
edit, or a claim that local substrate equals hosted capability.

## 15. Private evidence references

The latest Test Mode plan, Preview deployment, Production deployment, and
Production smoke evidence is:

`docs/shipping/evidence/plan-web-011-015-test-mode-plans-production-rollout-2026-10-09.md`

The latest rollback boundary evidence is:

`docs/shipping/evidence/dist-006-rollback-boundary-completeness-2026-10-09.md`

The latest current-head Hunt evidence is:

`docs/shipping/evidence/hunt-docker-adversarial-origin-main-2026-10-09.md`

The latest Vercel configuration evidence is:

`docs/shipping/evidence/vercel-production-preview-config-audit-2026-10-09.md`

The latest account-deletion qualification evidence is:

`docs/shipping/evidence/qual-web-005-deletion-route-e2e-2026-10-09.md`

The latest authenticated account-runtime qualification evidence is:

`docs/shipping/evidence/qual-web-006-authenticated-account-runtime-2026-10-09.md`

The latest payment qualification and Gate 4 evidence is:

`docs/shipping/evidence/plan-web-014-preview-hosted-payment-lifecycle-2026-10-09.md`

The latest payment decision and backlog acceptance are recorded in
private commit `5a99b0d`; the preceding payment qualification evidence commit
is `8eb85b7`.

The private tracker’s backlog, status, execution ledger, traceability,
decisions, risks, release gates, evidence, and this goal are the source of
truth for the score and acceptance state. Keep this goal active until the
completion standard is actually satisfied.
