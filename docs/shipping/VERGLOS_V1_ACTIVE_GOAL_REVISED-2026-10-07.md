# Verglos V1 Active Shipping Goal — Backend-First Whole-Backlog Pass

Effective checkpoint: 2026-10-09. This file is the authoritative replacement
goal for the remaining shipping work. Replace the previous active goal with
this complete version before resuming.

## 1. Objective

Ship the complete Verglos V1 across:

- `/Users/anuragyadav/Developer/TopNotchh-Workspace/verglos-cli`
- `/Users/anuragyadav/Developer/TopNotchh-Workspace/verglos-web`

The primary objective is to complete the whole authoritative private backlog
with real implementation, integration, qualification, security review,
release evidence, and final acceptance. The main execution path is now
backend/CLI-first: close every genuinely executable unchecked CLI/backend item
in coherent fat batches before spending the critical path on Web polish.

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

- **218 checked / 62 unchecked / 280 total / 77.9%**.
- No checkbox changed during the latest CLI rollback-hardening batch.
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

The private tracker is authoritative for acceptance. The public repositories
must never receive private tracker documents, customer data, credentials,
private fixture contents, detailed security findings, or competitive
intelligence.

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
- Production browser, deployment, and local qualification work performed no
  production database, migration, payment, provider, entitlement, account,
  or deployment write.
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

Private evidence for the latest CLI batch is:

`docs/shipping/evidence/dist-006-rollback-boundary-completeness-2026-10-09.md`

## 4. Execution priority: backend/CLI first

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

Rules:

- First inspect production schema, migration history, permissions, provider
  configuration, and aggregate evidence read-only.
- A provider-management token is not automatically a SQL credential.
- Never pass database or provider credentials in command-line arguments.
- Never print or paste secrets into chat, logs, PRs, or public repositories.
- Treat any exposed production credential or token as compromised: revoke,
  rotate, replace, redeploy, and verify bounded read-only behavior before use.
- Never run production DDL, DML, migrations, backfills, cutovers, deletions,
  payment charges, billing changes, deployments, or other writes without the
  operation-specific preflight above.
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

For every enabled method—cards, UPI, netbanking, wallets, EMI, Pay Later, and
any other account-enabled method—qualify in Razorpay Test Mode, privately and
redacted, across:

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
- all critical release gates pass;
- CLI, Web, cross-repository, supported-runtime, and platform verification
  passes;
- Hunt authority, provenance, bounded execution, isolation, and adversarial
  review are complete;
- GitHub App/org identity, permissions, token lifecycle, delivery replay
  protection, reconciliation, and authorized cutover are qualified;
- every enabled payment method is qualified or has a documented provider
  limitation and release decision;
- production migrations, reconciliation, backup/restore, rollback, and
  recovery are qualified where required;
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

1. Read `brain`, repository instructions, and the live private backlog.
2. Recompute the scoreboard and open-ID list.
3. Inspect current CLI and Web branches/PRs and verify the recorded heads.
4. Verify the merged Web PR #170 head and record its acceptance boundary; keep
   duplicate PR #169 closed and do not count it as shipping progress.
5. Select the largest dependency-ready backend/CLI batch.
6. Record IDs, criteria, evidence, write boundary, and machine-load plan.
7. Implement and qualify the batch with focused and required tests.
8. Inspect public/private boundaries and hosted PR state.
9. Reconcile private evidence and report the exact score.
10. If no executable CLI item remains, record the backend external-gate matrix
   once and move to the next independent Web/cross-repository item.
11. Keep production, payment, customer, legal, and reviewer gates open until
    their actual evidence exists.

The next batch must not begin with a repeated unchanged suite, a speculative
marketing edit, a production payment click, a direct database entitlement
edit, or a claim that local substrate equals hosted capability.

## 15. Private evidence references

The latest rollback boundary evidence is:

`docs/shipping/evidence/dist-006-rollback-boundary-completeness-2026-10-09.md`

The latest current-head Hunt evidence is:

`docs/shipping/evidence/hunt-docker-adversarial-origin-main-2026-10-09.md`

The private tracker’s backlog, status, execution ledger, traceability,
decisions, risks, release gates, evidence, and this goal are the source of
truth for the score and acceptance state. Keep this goal active until the
completion standard is actually satisfied.
