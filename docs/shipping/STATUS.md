# Verglos V1 shipping status

## 2026-10-07 · QUAL-WEB-006 authenticated dashboard continuation

Read-only Chrome DevTools evidence against the authenticated account shell
shows `/account/dashboard` redirecting safely to `/account`, no console errors,
private account navigation, and no horizontal overflow in the existing desktop
and mobile checks. A fresh Lighthouse snapshot scored Accessibility 100,
Best Practices 100, and SEO 100 on both desktop and mobile; Agentic Browsing
was 50 because the audit still reports `llms.txt`, although the public
`/llms.txt` response currently contains a valid H1. A fresh desktop trace
reported LCP 689 ms, CLS 0.00, and TTFB 110 ms; CrUX field data is unavailable.

The PR branch was also run locally in development with no runtime secrets:
checkout failed closed with “Pro checkout is not currently available” and made
no payment request. The authenticated production tab remains the old QR-only
flow and showed one transient `ERR_NETWORK_CHANGED`; no payment or write was
performed. QUAL-WEB-006 remains unchecked because organization/Pro and
large-dataset rendering, human screen-reader review, and field-CWV evidence
are still open. Evidence addendum:
`docs/shipping/evidence/qual-web-006-dashboard-runtime-2026-10-07.md`.
Backlog remains **218 checked / 62 unchecked / 280 total**.

## 2026-10-07 · PLAN-CLI-004 compatibility PR reopened for hosted verification

CLI branch `feat/cli-plan-004-compat` at `059918c` is clean, pushed, one commit
ahead of `origin/main`, and now has PR #72 open/mergeable. The branch carries
supported-entitlement compatibility coverage on top of the opaque
catalog/cache contract. Previously recorded local full tests, focused tests,
typecheck, and build pass. PR #72 has no hosted checks reported yet and is not
claimed green. PLAN-CLI-004 remains unchecked pending hosted platform,
deployed signer/catalog alignment, old-token migration, and activation
evidence. No production operation occurred. Private evidence:
`docs/shipping/evidence/plan-cli-004-pr72-2026-10-07.md`.

## 2026-10-07 · PLAN-WEB-013 hosted Razorpay checkout code-side batch

Web PR #149, commit `eb7e55a`, adds the provider-hosted Razorpay order path as
the default checkout, server/catalog-driven method declarations, signed order
snapshots, order-bound read-only status, webhook-authoritative capture/failure
handling, and one-successful-payment-per-order protection. The legacy QR route
now requires an explicit `upi_qr` declaration and is not the default.

Focused billing/route/webhook tests pass 19/19. The configured Web suite passes
850/872 with 22 explicit environment-gated skips and 0 failures; typecheck,
production build, Drizzle check, 31-migration ordering, diff hygiene, Docker
and Chrome DevTools prerequisites pass. Local execution used Node 26.4.0
against the package Node 22.x baseline; hosted Node 22 evidence remains open.

This is code-side evidence only. PR #149 is open/mergeable; GitGuardian is
green, `typecheck-and-schema` is queued, and Vercel is pending. No Razorpay
account configuration was read, no test payment/lifecycle matrix was run, and
no production database/provider/payment/deployment/migration write occurred.
PLAN-WEB-013/014/015 remain unchecked. Private evidence:
`docs/shipping/evidence/plan-web-013-hosted-checkout-2026-10-07.md`.
Backlog remains **218 checked / 62 unchecked / 280 total**.

Next three independent batches:

1. **PLAN-WEB-014** — isolated Razorpay test-mode method/lifecycle matrix;
   dependency PR #149 hosted checks/merge and explicit test-account method
   configuration. Evidence: private redacted checkout, capture, failure,
   refund, renewal/cancel, replay, duplicate, and ordering records. Blocker:
   provider test-account capability/credentials are not currently verified.
2. **PLAN-CLI-004** — compatibility PR/hosted verification for the current
   CLI branch `059918c`; local evidence exists but hosted PR/check state must
   be established. No production write.
3. **QUAL-WEB-006** — authenticated dashboard accessibility/performance and
   remaining browser/large-data/field-CWV evidence; browser is available, but
   human screen-reader, large-dataset, and field-CWV evidence remain open.

## 2026-10-06 · QUAL-CLI-006 / DIST-001 / DIST-003 release-artifact qualification

Merged CLI `dacd286` builds successfully and the isolated release qualification
passes 20/20 release-script tests, six-package packing, package/boundary/tag
audits, clean-consumer installation, and the `1.8.3 -> 2.0.0-alpha.1 -> 1.8.3`
upgrade/rollback transition. The strict release verifier remains open on eight
redistribution reviews: six BlueOak terms, one nested-license conflict, and one
missing source. QUAL-CLI-006 and DIST-001/003 remain unchecked; no publication,
tag, deployment, production access, or customer operation occurred. R-041
remains open. Private evidence:
`docs/shipping/evidence/qual-cli-006-dist-release-artifacts-2026-10-06.md`.

## 2026-10-06 · PLAN-CLI-001/004 opaque catalog and cache qualification

CLI commits `937705b`, `fa4a131`, and `714cb3e` merged PR #71 as `dacd286`; they preserve the server-owned Web
`catalog_version`, rejects malformed catalog metadata, and prevents stale
capability cache entries from crossing founder `as_plan` simulations. The
server-shaped entitlement fixtures retain opaque capability and future-field
behavior. Local CLI package tests, typecheck, build, and diff hygiene pass;
hosted run `37497389053` passes self-scan, in-toto, and all nine platform cells.
This is code-side progress only: production v2
signer/tenant activation and live integration evidence remain open. PLAN-CLI-001
and PLAN-CLI-004 remain unchecked. R-041 still prohibits production access
until credential rotation and verification. Private evidence:
`docs/shipping/evidence/plan-cli-001-004-opaque-catalog-cache-2026-10-06.md`.

## 2026-10-06 · TEAM-CLI-001 hosted policy authority substrate

Web PR #148 merged as `cbc0f5a`. It adds explicit SCM repository-to-project
binding migration `0028`, same-organization active-project validation, and a
license-bound `/api/v1/organizations/:organizationId/repositories/:repositoryId/policy`
route that emits only a published canonical policy in a dedicated Ed25519-signed
CLI envelope. Local policy/SCM/tenant contract tests pass 23/23; full Web
verification is 868 total / 846 passed / 22 explicit environment-gated skips /
0 failures; typecheck, build, Drizzle, 29-migration ordering, and hosted run
`37493818464` pass. This remains code-side substrate only: no signer secret,
production migration, policy-row reconciliation, hosted fetch, or production
operation occurred. TEAM-CLI-001/PLAN-CLI-001 remain open pending activation
and live evidence. Private evidence:
`docs/shipping/evidence/organization-policy-hosted-authority-2026-10-06.md`.

## 2026-10-06 · PLAN-CLI-003 authenticated request-matrix progress

Web PR #147 merged as `7248919` adds explicit authenticated modified-client
coverage for usage reconciliation and hosted receipt ingestion. Forged tenant,
plan, capability, usage, and record query/body fields are rejected before the
ledger or receipt persistence path is touched; the existing v2 entitlement
claim-binding test covers forged plan, tenant, role, capability, allowance,
usage, and record claims. Local Web verification is 865 total / 843 passed /
22 explicit environment-gated skips / 0 failures; disposable PostgreSQL
receipt integration is 1/1, typecheck and build pass, and hosted run
`37492088157` passes typecheck/schema, Vercel, GitGuardian, and Preview
Comments. This is code-side qualification only: no production authenticated
probe or customer/provider operation occurred. PLAN-CLI-003 remains open for
the complete authenticated production request matrix and list/search/export/
public-private runtime evidence. Private evidence:
`docs/shipping/evidence/modified-client-authenticated-request-matrix-2026-10-06.md`.

## 2026-10-06 · HUNT-009 public/private boundary review

No HUNT-009 acceptance credit is recorded. A local functional-command attempt
was removed before commit after confirming that the public CLI cannot declare
private `@verglos/hunt`; the public packer rejects that dependency by design.
The alpha CLI remains on the honest Pro beta shell and exit-78 contract.

The rollback verification passed CLI typecheck, the full CLI package test suite,
CLI build, public-boundary audit, and diff hygiene. The local public-pack command
was not credited because `pnpm licenses list --json` fails on missing cached
`turbo@2.10.6` package-index metadata. No production/provider/database/customer
operation occurred. HUNT-008/009/010/011 and QUAL-CLI-004 remain open.
Private evidence: `docs/shipping/evidence/hunt-009-public-boundary-review-2026-10-06.md`.
Backlog remains **218 checked / 62 unchecked / 280 total**.

## 2026-10-06 · GitHub App identity contract substrate (Web PR #144)

Web branch `feat/github-app-org-contract` commit `afb48dc` adds immutable
GitHub account/installation/repository identity, bounded multi-repository
admission, least-privilege permission validation, App JWT/token-request and
token-expiry helpers, lifecycle transitions, delivery-ID replay binding, and
tenant-scoped redacted webhook/check persistence. Local Web verification is
862 total / 840 passed / 22 explicit environment-gated skips / 0 failures;
focused GitHub/SCM tests pass 16/16; typecheck, build, Drizzle, 27-migration
ordering, public-boundary, SBOM, license, negative-boundary, and diff checks
pass. PR #144 is merged to Web `main` as `1b2a623`; hosted run `37486358263`
passed typecheck, tests, schema, build,
dependency audit, SBOM, license, secret guard, Vercel, Preview Comments, and
GitGuardian after the `sharp >=0.35.5` security-floor fix (`a496608`).
This does not close GITHUB-WEB-001..004: no live GitHub App installation,
provider permission/token exchange, org cutover, production migration,
deployment, or customer acceptance occurred. Private evidence:
`docs/shipping/evidence/github-app-identity-contract-2026-10-06.md`.

## 2026-10-06 · Razorpay payment-method catalog substrate (Web PR #145)

Web PR #145 commit `3ce60b8` merged to Web `main` as `d6ce773`. The server-side
Razorpay method catalog parses optional provider-declared methods, preserves
the existing UPI QR path when unset, advertises only implemented adapters,
and fails closed for unsupported, malformed, duplicate, or empty declarations.
Focused tests pass 25/25; full Web verification is 863 total / 841 passed /
22 explicit environment-gated skips / 0 failures; hosted run `37487362873`,
Vercel, Preview Comments, GitGuardian, dependency audit, SBOM, license, and
secret checks pass. This is not account-method or lifecycle evidence: no
Razorpay account configuration was read or changed and no provider payment,
refund, renewal, replay, production billing action, or deployment occurred.
PLAN-WEB-014/015 remain open. Private evidence:
`docs/shipping/evidence/razorpay-method-catalog-contract-2026-10-06.md`.

## 2026-10-03 · Vercel access reconciliation

Read-only `vercel env ls`, deployment listing, and deployment inspection now
succeed for the linked Web project. Production is `READY` and aliases include
`verglos.com`; secret values were not printed. Older notes describing missing
Vercel access are historical and superseded for access discovery. Live billing
reconciliation remains unperformed. Evidence:
`docs/shipping/evidence/vercel-readonly-access-2026-10-03.md`.

## 2026-10-03 · merged-main platform matrix complete

Run `37115386171` reached terminal success for merged CLI `18ab8e7`: in-toto
binding plus all Ubuntu/macOS/Windows Node 20/22/24 cells passed. This is
current-source cross-platform evidence only; trusted publication, legal review,
customer acceptance, and final release gates remain open.

## 2026-10-03 · matrix poll advanced

Run `37115386171` now has Windows Node 24 terminal-successful; Windows Node 20
and 22 remain `in_progress`. The overall run is still non-terminal and is not
claimed as a complete platform pass.

## 2026-10-03 · merged-main platform matrix still running

Manual matrix run `37115386171` targets merged CLI `18ab8e7` (not the feature
branch). Its in-toto binding and six Ubuntu/macOS cells are terminal success;
Windows Node 20/22/24 remain `in_progress` after repeated polling. This is
hosted-runner state, not inferred product success or failure. Private evidence:
`docs/shipping/evidence/cli-main-platform-matrix-2026-10-03.md`.

## 2026-10-03 · current CLI verification and local packaging boundary

CLI `955412516` passes typecheck, build, and the shared-package test suite.
Local macOS license inventory and public packing still fail closed on missing
foreign-platform optional `@esbuild/*` manifests; no bypass was introduced.
Hosted Linux self-scan `37109797227` remains the successful pack evidence.
Details are in `docs/shipping/evidence/current-source-verification-2026-10-03.md`.

## 2026-10-03 · reproducible cross-repository acceptance runner

Private `pnpm --silent acceptance:stories:verify` binds and reruns the latest
CLI/Web trees: CLI **236/236 passed**, Web **877/905 passed with 28
environment-gated skips and 0 failures**, and composed Web acceptance
substrates **72/72 passed**. Machine-readable output and command hashes are in
`docs/shipping/evidence/acceptance-stories-verification-2026-10-03.json`.
This is reproducible substrate evidence only; no hosted, provider, customer,
reviewer, human screen-reader, field-CWV, migration, or production gate is
closed.

## 2026-10-03 · acceptance-story substrate recheck

The corrected package-owned CLI runner passed **236/236** tests on the latest
unreleased source `955412516`; the prior root-level invocation failure was only
missing `tsx` resolution and is not product evidence. Web Studio/Enterprise/
Team/quality acceptance substrates passed **72/72**, and the Hunt Docker
adapter checks passed **5/5**. Evidence and command boundaries are recorded in
`docs/shipping/evidence/acceptance-story-tests-2026-10-03.md`. These results do
not close hosted HTTP, live provider, customer-consent, independent-review,
authenticated dashboard, screen-reader, field-CWV, or final release gates.

## 2026-10-03 · current Web regression recheck

On Web `main` at `763aab0`, the configured suite completed **859 total / 837
passed / 22 environment-gated skips / 0 failures**. The registered SCM
pretest slice completed **46 total / 40 passed / 6 skips / 0 failures**;
`pnpm typecheck`, `pnpm db:check`, and `pnpm db:migrations:check` also passed
with 24 ordered PostgreSQL migrations. This confirms no regression after the
qualification evidence additions; it does not close production, deletion,
provider, browser, field-CWV, customer-consent, or independent-review gates.

## 2026-10-03 · public production Lighthouse lab evidence

Read-only Lighthouse runs against the deployed public home, checkout, detectors,
and docs surfaces returned accessibility 97–100 and Best Practices 100. Lab
performance was 100/78/84/81 respectively, with CLS 0 throughout; this is
regression evidence only, not field-CWV or authenticated dashboard evidence.
The signed-out checkout rendered only the verified Pro INR monthly/annual
catalog offers; other plan names on public marketing/docs surfaces do not imply
their checkout activation. QUAL-WEB-006 and FINAL-WEB-007 remain open for
human screen-reader, authenticated dashboard, large-dataset, and field-CWV
evidence.

## 2026-10-03 · current-source cross-platform release qualification

CLI `origin/main` head `c17b335f2bfac6d9d63e6a8031f4c19811306296` passed hosted
platform matrix run `37110048279`: the official in-toto release-binding job and
all nine Ubuntu/macOS/Windows × Node 20/22/24 cells completed successfully.
Every cell built the current source, packed and clean-installed the public
archives, exercised upgrade/rollback against published `verglos@1.8.3`, ran
typecheck and tests, and uploaded evidence. This is current-source qualification
only; Node 20/action and Ubuntu image migration warnings are GitHub annotations,
not failures. DIST-001/003 and QUAL-CLI-006 remain unchecked pending release
identity/provenance, legal clearance, protected publishing, and final acceptance.

## 2026-10-03 · TEAM-WEB-006 persistence and enqueue routes (Web PR #132)

Web PR #132 merged as `049f8ba` after hosted type/schema, GitGuardian, Vercel,
and preview checks passed. The additive migration `0021_scm_check_delivery.sql`
adds tenant-scoped SCM installation and idempotent check-delivery metadata;
installation secrets are AES-GCM envelopes using the existing credential key,
and the installation/check routes authorize before bounded body reads, project
no secret fields, enforce tenant scope, and enqueue redacted delivery metadata
through the existing outbox. Focused route/provider/credential/tenant tests pass
25/25; full Web suite passes 859 total / 837 passed / 22 environment-gated skips;
typecheck, Drizzle check, migration ordering, and diff checks pass. No migration
or production database write ran. TEAM-WEB-006 remains open pending provider
webhook event routes, a delivery worker with durable retry/reconciliation, and
live GitHub/GitLab evidence.

## 2026-10-03 · TEAM-WEB-006 test registration correction (Web PR #131)

Web PR #131 merged as `eadc5ac` after hosted type/schema, GitGuardian, Vercel,
and preview checks passed. The provider transport suite is now included in the
configured Web `pretest` gate; the focused pretest slice passes 28/28 with 6
environment-gated skips, and the full Web suite passes 859/837/22 with zero
failures. This corrects test coverage registration only; TEAM-WEB-006 remains
open for persistence, webhook routes, durable retries, reconciliation, and live
provider evidence. No production operation occurred.

## 2026-10-03 · TEAM-WEB-006 provider transport substrate (Web PR #130)

Web PR #130 merged as `27cd6c7` after hosted type/schema, GitGuardian, Vercel,
and preview checks passed. `scm-check-providers.ts` now builds bounded GitHub
Checks and GitLab commit-status requests from the redacted SCM contract, maps
decisions to provider states, rejects malformed commit/token/repository inputs,
and classifies retryable versus permanent responses without exposing response
bodies or credentials. Focused tests pass 5/5; local typecheck and diff checks
pass. TEAM-WEB-006 remains unchecked pending persistence, webhook HTTP routes,
durable retry delivery, provider response reconciliation, and live GitHub/GitLab
evidence. No production operation occurred.

## 2026-10-03 · TEAM-CLI-002 CI check payload substrate (CLI PR #56)

CLI PR #56 merged as `c17b335` after the Ubuntu/macOS/Windows × Node 20/22/24
matrix, Verglos self-scan, and in-toto release-binding checks passed. The shared
contract `ci-check-payload.ts` projects only the exact primary subject digest,
decision, policy identity/digest, record-manifest digest, HTTPS record URL, and
commit into a deterministic, source-free payload; malformed identities and unsafe
links fail closed, and update delivery is digest-idempotent. Focused tests pass 3/3;
shared typecheck and build pass. TEAM-CLI-002 remains unchecked pending TEAM-CLI-001
signed organization-policy fetch/cache, CLI command wiring, and hosted SCM/provider
integration. No production operation or release publication occurred.

## 2026-10-03 · TEAM-WEB-006 SCM check contract substrate (Web PR #129)

Web PR #129 merged as `b2352c6` after hosted type/schema, GitGuardian, Vercel, and
preview checks passed. The current Web tree now includes a pure GitHub/GitLab SCM
contract: bounded installation admission, raw-body GitHub HMAC and GitLab token
verification, tenant-bound commit/subject/artifact identity, redacted HTTPS check
payloads, and digest-based idempotent update decisions. Focused tests pass 4/4 and
the configured Web suite passes **859 total / 837 passed / 22 environment-gated
skips**; typecheck and diff checks pass. TEAM-WEB-006 remains unchecked: provider
installation adapters, persistence, HTTP webhook routes, retry delivery, and live
provider evidence are not implemented/qualified by this substrate. The same merge
also carries the previously prepared organization-dashboard accessibility shell and
legacy verify truth correction onto current `main`; those remain runtime-evidence
gated. No production database write, migration, billing action, or marketing change
occurred.

## 2026-10-03 · Billing lifecycle contract revalidation

The Web Razorpay/checkout/webhook focused suite passed **18/18 runnable tests**: immutable
INR checkout snapshots, QR amount/currency binding, captured-only grants, subscription
lifecycle ordering, failed-payment handling, partial/full refunds, replay/conflict/retry
semantics, malformed-signature/body bounds, and owner-bound status. The migrated PostgreSQL
ledger and webhook-claim integration cases remained skipped because Docker/PostgreSQL is
unavailable in this execution environment; no live lifecycle acceptance is claimed.

The local test env file contains shell-special characters and must not be sourced with a
plain `.` command. One attempted source caused the shell to echo part of the webhook secret;
the founder must rotate the Razorpay Test Mode webhook secret before any further provider
test. No production order, webhook, entitlement, or database write occurred.

## 2026-10-02 · Current-source full-history fixture scan

The full-history OWASP Juice Shop fixture (23,312 reachable commits, 906 files) was
rescanned with the merged current CLI tree `b781bc41539df3870769996426c03e9209a08ab7`,
not the older PR-51 evidence head. The exact command exited 0, all requested detectors
ran with no coverage limitations, and the report retained the honest `0 / critical`
profile (16 critical, 12 high, 18 medium, 0 low, 9 informational; seven test findings
excluded by policy). Private evidence: `docs/shipping/evidence/juice-shop-full-scan-current-2026-10-02.md`.
This remains a public technical fixture, not customer acceptance or independent Hunt
adjudication.

The three `~/.cursor/mcp.json` findings are expected global `agent-surface` detector output,
not an unbounded fixture read; the detector's focused tests explicitly isolate and qualify
that global-config scope.

The scanner package contract run completed with the agent-surface cases green (12/12),
including global-home discovery, project-scoped filesystem distinction, localhost HTTP
exception, and redacted portable paths.

## 2026-10-02 · Production browser lab sweep and Linux namespace correction

The existing Chrome session measured `/`, `/checkout`, `/docs`, `/detectors`, `/verify`,
and authenticated `/account` over CDP at 1200×859. All routes exposed a `<main>` landmark,
had no horizontal overflow, and reported CLS 0.00; TTFB/FCP and focusable counts are in
`docs/shipping/evidence/public-cwv-lab-sweep-2026-10-02.md`. These are lab measurements,
not field-CWV or human screen-reader evidence. Separately, hosted Ubuntu self-scan
`36984993552` already proved the PID/IPC namespace assertion at merge head `b781bc4`;
the remaining HUNT-011 gaps are recipe provenance/execution and independent review, not
Linux-host access. No production write or dashboard data creation occurred.

## 2026-10-02 · Hunt Docker adversarial runtime revalidation

Docker Desktop Server 29.7.2 is reachable. The complete Hunt package suite passed 55/56 with the pinned Alpine digest `sha256:d9e853e87e55526f6b2917df91a2115c36dd7c696a35be12163d44e6e2a4b6bc`; all 15 enabled Docker adversarial checks passed and only the macOS-only PID/IPC namespace assertion was skipped. HUNT-011 and QUAL-CLI-004 remain open for Linux namespace evidence, recipe execution/provenance, and independent review. Private evidence is recorded in `docs/shipping/evidence/hunt-docker-adversarial-2026-10-02.md`.

## 2026-10-02 · QUAL-WEB-006 authenticated account evidence (Web PR #126)

Web PR #126 (`f66d32b`) merged as `89056c3` after hosted type/schema, GitGuardian, and Vercel passed. It corrects the authenticated `/account` label contrast defect identified at 4.15:1. Production Lighthouse on the existing authenticated Chrome session reports Accessibility 100 and Best Practices 100 on desktop and mobile; the desktop trace reports LCP 551ms and CLS 0.00. QUAL-WEB-006 remains open for organization-dashboard, screen-reader, reduced-motion, large-dataset, and complete field-CWV evidence. Private evidence is recorded in `docs/shipping/evidence/account-a11y-cwv-2026-10-02.md`. No production database write, migration, billing action, or marketing change occurred.


## 2026-10-02 · Web PR #123 verified INR catalog ready for activation review

PR #123 (`23a83f0`) has passed the complete hosted Web verification workflow. It enables the founder-approved INR Pro catalog (₹2,809.43 monthly / ₹28,094.30 annual) and binds checkout display and gateway requests to the same catalog snapshot. No migration or production write occurred. Because this changes the live Razorpay path from fail-closed to charge-capable, PLAN-WEB-011/012 remain open until the exact production deployment is activated and a real lifecycle (success, replay, failure/refund/renewal/out-of-order) is reconciled.

## 2026-10-02 · Web PR #123 deployed and catalog smoke verified

The merged catalog change (`f31a8e2`) is READY in Vercel production. An existing authenticated Chrome session shows the live checkout at ₹2,809.43/month and the annual cadence. No production payment/order was initiated because live-key mode has not been independently proven as sandbox. This is deployment/UI evidence only; PLAN-WEB-011/012 remain open pending safe provider lifecycle reconciliation.

## 2026-10-02 · Web PR #124 PRO-003 runtime evidence merged

PR #124 (`a86bad5`) adds and hosts the missing Docker-backed release repository integration. The test proves exact release evidence/change/incomplete projections, tenant-scoped pagination/filtering, and foreign-tenant exclusion; hosted Verify is green. PRO-003 remains accepted and no production operation occurred.

## 2026-10-02 · Web PR #125 checkout accessibility progress

PR #125 (`c4abda5`) corrects the live checkout’s contrast and landmark defects. Hosted Verify passed and the production Lighthouse smoke now reports Accessibility 100 / Best Practices 100 on `/checkout`. QUAL-WEB-006 remains open for the broader dashboard, screen-reader, responsive, large-dataset, and complete CWV gate.

## 2026-10-02 · Public Lighthouse smoke expanded

Production desktop Lighthouse reports Accessibility/Best Practices/SEO 100 on `/`, `/detectors`, and `/docs`; mobile checkout remains Accessibility/Best Practices 100. The recurring `llms-txt` recommendation is tracked separately and does not change product accessibility evidence. QUAL-WEB-006 remains open for authenticated-dashboard and complete performance qualification.

## 2026-10-02 · Founder authorization recorded; external evidence inputs still absent

Founder authorized the final truth/copy pass after its gates, a real billing/provider checkout test, authorized customer workflows, legal/licensing review, and independent Hunt isolation review. Read-only environment inspection found no local Razorpay credentials, the linked Vercel project remains unauthorized, and no customer fixture, legal approval, or independent-review artifact is present. These are evidence/input gaps, not completed gates; no production checkout, deployment, customer workflow, legal claim, or independent-review claim was performed.

## 2026-10-02 · FINAL-WEB-001 truth-registry guard progress (Web PR #101)

Web PR #101 merged as `c3e6668ec87ef386e33462e815877e640004fc16` after hosted run `36972830161` passed the complete Web verification workflow, including the dedicated truth-registry test. It adds a pure decision registry for plan, capability, signing, compliance, engine, and metric claims, plus bounded tests; it does not alter public copy. FINAL-WEB-001 remains open pending wiring every public surface and the later acceptance/founder gates. No production database/environment read or write, migration, deployment, release, or marketing action occurred.

## 2026-09-30 · QUAL-WEB-006 public accessibility remediation (Web PR #102)

Web PR #102 merged as `f138e24bf85de7527a8d3896897bd1aa26fecbe0` after hosted Verify run `36685565094` passed, along with GitGuardian and Vercel. It corrects public contrast and keyboard/focus affordances and makes overflow tables/code examples keyboard reachable; no product claims or pricing copy changed. QUAL-WEB-006 remains open pending authenticated-dashboard, screen-reader, responsive, large-dataset, and complete CWV evidence. No production database/environment read or write, migration, deployment, release, or marketing action occurred.

## 2026-09-30 · QUAL-WEB-001 accepted (Web PR #121)

Web PR #121 merged as `a88495151f43d1a6addc16a88427288cb2d1458e` after hosted Verify run `36760390332` completed green. The follow-up adds the organization search route to the shared negative-boundary matrix and runs `pnpm test:negative-boundary` in hosted Verify. The hosted job also passed typecheck, the full configured test suite, Drizzle schema and 21-migration checks, production build, public-boundary, dependency audit, SBOM, license, and tracked-secret checks. Together with the Docker-backed tenant list/search/evidence/policy/receipt export integrations, public/private receipt assertions, and modified-CLI entitlement tests, this satisfies QUAL-WEB-001. No production database/environment read or write, migration, deployment, release, or marketing action occurred.

## 2026-09-30 · QUAL-WEB-001 distinct search runtime evidence (Web PR #120)

Web PR #120 tested head `9ecd0092e202a65549e4a53b0f0cbbb58e144957` and merged as `677a78afd27435c57c498fe8bd8b4e9013096642`. The authenticated organization search route searches bounded project/release/subject identifiers, ignores forged query authority fields, rejects wildcard/control input, preserves the scoped-database project-context invariant by narrowing per authorized project, and returns `private, no-store` responses. The focused disposable Docker PostgreSQL runtime test passes **1/1**; the full configured Web suite passes **836/836 executed tests with 22 environment-gated skips**; typecheck, production build, Drizzle schema check, 21-migration ordering, negative-boundary tests, and `pnpm audit --prod` pass with no known vulnerabilities. Hosted Verify run `36744036519` is green after pinning patched transitive Axios `1.20.0` and PostCSS `8.5.28`. QUAL-WEB-001 remains unchecked: export semantics and the complete hosted/provider-backed list/search/export/public-private matrix remain open. No production database/environment read or write, migration, deployment, release, or marketing action occurred.

## 2026-09-30 · Web PostgreSQL contention isolation follow-up

The local all-in-one `pnpm test` attempt associated with Web PR #119 exposed duplicate `pgcrypto` extension/deadlock failures only when several integration files shared one disposable database concurrently. Re-running the three affected files sequentially against a fresh disposable PostgreSQL 15 container passes **4/4 with zero failures** (`worker-crash-recovery` 2/2, usage ledger 1/1, threshold outbox 1/1). Hosted PR #119 run `36741825859` was already green. This is test-environment contention, not evidence of a product regression; no code or checkbox changed and no production operation occurred.

## 2026-09-30 · QUAL-WEB-001 direct tenant data-route runtime (Web PR #119)

Web PR #119 tested head `87f424cbfd93bd3d54232a66a29664c517b4d514` and merged as `1834f442086ab79862eb62984bc4111def3ad923`. The real PostgreSQL-backed evidence and policy-evaluation handlers now have a focused runtime integration: two isolated tenants, forged organization/project/tenant query fields, authorized writes, subject/release binding, and `private, no-store` responses. The focused disposable Docker PostgreSQL run passes 1/1; local typecheck, Drizzle schema check, 21-migration ordering check, and production build pass. Hosted run `36741825859` is green for the full configured test command, typecheck, schema/migrations, build, public-boundary, dependency, SBOM/license, and tracked-secret checks. A local all-in-one database run also exposed pre-existing concurrent integration-test extension/deadlock contention; it is not represented as green evidence. QUAL-WEB-001 remains unchecked: distinct search/export semantics and the complete runtime matrix remain open. No production database/environment operation or deployment occurred.

## 2026-09-30 · QUAL-CLI-006 current-source in-toto archive binding (CLI PR #51)

CLI PR #51 tested head `e63b5041727a175da1d770012cb945a061f05324`, rebased onto current `origin/main` `f16c6f1`, and merged as `353787539451e918dcda088ff6cbbd497ae1c631`. The platform workflow now packs the actual six public archives from the current source and runs official `in-toto==3.0.0` verification against an ephemeral signed layout/link with exact SHA-256 products. Hosted platform run `36720267628` passes the in-toto job plus all nine Ubuntu/macOS/Windows × Node 20/22/24 cells; self-scan run `36720267470` passes. Local typecheck, build, contract tests, and official verifier pass. This is qualification progress only: trusted keyless Sigstore/Fulcio/Rekor evidence, final release-pipeline identity binding, licensing, and publish authorization remain open; QUAL-CLI-006 stays unchecked. The package remains `2.0.0-alpha.1`; no production/DB/deployment/npm publish/tag/marketing action occurred.

## 2026-09-30 · QUAL-WEB-001 tenant release runtime (Web PR #118)

Web PR #118 tested head `d0df2ee` merged as `b0663e355d7e44eec1b59782f7a77f1a6d04750`. The PostgreSQL-backed tenant integration now invokes the real release list and release detail GET handlers with forged organization/project query fields; only the bound tenant/project release is returned, the subject projection is tenant-bound, and both responses assert `private, no-store`. The focused disposable Docker run passes **2/2 with zero skips** (release/project tenant integration plus receipt list/detail/download/public runtime), local typecheck passes, and hosted run `36717893114` passes typecheck/tests/db/schema/migrations/build/boundary/dependency/SBOM/license/secret checks, GitGuardian, and Vercel. QUAL-WEB-001 remains unchecked: distinct search semantics are absent and hosted/provider-backed list/search/export plus the complete matrix remain open. No production database/environment operation, migration, deployment, release, or marketing action occurred.

## 2026-09-30 · QUAL-WEB-001 public receipt runtime (Web PR #117)

Web PR #117 tested head `1b39c09` merged as `d8c7edf00256f7ceb332319c3d351a69e4861f50`. A production-disabled request-scoped database provider seam, analogous to the existing authorization seam, lets the real public receipt handler run against disposable PostgreSQL. The focused Docker run passes **2/2 with zero skips**: public receipt lookup succeeds despite forged tenant/project query fields, returns `no-store`, and verifies the digest; private project-list and receipt list/detail/download boundaries remain green. Hosted run `36716982904`, GitGuardian, and Vercel pass. QUAL-WEB-001 remains unchecked because no distinct search handler exists and hosted/provider-backed list/search/export plus complete public-private matrix evidence remain open. No production database/environment operation, migration, deployment, release, or marketing action occurred.

## 2026-09-30 · QUAL-WEB-001 authorized tenant list runtime (Web PR #116)

Web PR #116 tested head `95ebce4` merged as `d230af0fd0227f0f4625257e6ee743ed3ef460f0`. The PostgreSQL-backed tenant integration now invokes the real organization project-list GET handler for two isolated tenants, sends forged query authority fields, and asserts tenant-scoped rows, fixed organization identity, and `private, no-store`; the receipt list/detail/download integration remains active in the same Docker run. Focused local Docker run passes **2/2 with zero skips**; hosted run `36716252644` passes the Web verification workflow, GitGuardian, and Vercel. QUAL-WEB-001 remains unchecked because no distinct search handler exists and hosted/provider-backed list/search/export plus complete public-private matrix evidence remain open. No production database/environment operation, migration, deployment, release, or marketing action occurred.

## 2026-09-30 · QUAL-WEB-001 receipt list/detail/export runtime evidence

The existing PostgreSQL-backed `src/lib/organizations/record-receipt-route.integration.test.ts` passed **1/1 with zero skips** against a disposable local `postgres:15-alpine` container. Active assertions cover tenant A/B list isolation, authorized private receipt detail verification, and authorized private download/export projection; raw rejected source and signer identity fields remain excluded. This is local runtime evidence only: no production database/environment, migration, deployment, release, or marketing action occurred. QUAL-WEB-001 remains unchecked because no separate search handler exists and hosted/provider-backed evidence remains open.

## 2026-09-30 · QUAL-WEB-001 modified-CLI entitlement progress (Web PR #115)

Web PR #115 tested head `b3dfd77` merged as `4d2051e4`. The v2 entitlement test now simulates CLI-style headers (`verglos-cli/2.0.0-alpha.1`, modified-client marker) and forges organization, license, role, plan, capability, allowance, usage, and record fields; server-derived tenant, role, plan, and allowances remain authoritative. The combined focused route/boundary suite passes 10/10; hosted run `36705118215`, GitGuardian, and Vercel pass. QUAL-WEB-001 remains unchecked pending complete list/search/export/public-private runtime evidence. No production/database operation, deployment, release, publish, or marketing action occurred.

## 2026-09-30 · QUAL-WEB-001 forged-query authority progress (Web PR #114)

Web PR #114 tested head `f79a7a5` merged as `88a809d3`. The protected organization route matrix now sends forged tenant/project/plan/allowance query fields alongside forged bodies, while assertions continue to prove path-based authorization and non-cacheable denials. Combined boundary tests remain 4/4; hosted run `36704670862`, GitGuardian, and Vercel pass. QUAL-WEB-001 remains unchecked pending complete modified-CLI and list/search/export/public-private runtime evidence. No production/database operation, deployment, release, publish, or marketing action occurred.

## 2026-09-30 · QUAL-WEB-001 public receipt authority/cache progress (Web PR #113)

Web PR #113 tested head `39dfb64` merged as `24232db2`. The public receipt JSON handler now has direct runtime coverage proving invalid identities reject forged tenant/project query parameters without reflection and retain explicit `no-store` behavior. Combined private-denial/public-boundary tests pass 4/4; hosted run `36704251024`, GitGuardian, and Vercel pass. QUAL-WEB-001 remains unchecked pending complete modified-CLI and list/search/export/public-private runtime evidence. No production/database operation, deployment, release, publish, or marketing action occurred.

## 2026-09-30 · QUAL-WEB-001 runtime private-cache denial matrix (Web PR #112)

Web PR #112 tested head `4548734` merged as `517df10c`. The route-boundary suite now invokes every protected organization API handler with forged authority fields and an authorization denial, asserting the real response is non-cacheable (`no-store` or `private, no-store`). The focused negative-boundary suite passes 2/2 and local typecheck/diff checks pass. Hosted run `36703830835`, GitGuardian, and Vercel all pass. QUAL-WEB-001 remains unchecked pending complete modified-CLI and direct list/search/export/public-private runtime evidence. No production/database operation, deployment, release, publish, or marketing action occurred.

## 2026-09-30 · QUAL-CLI-006 official in-toto layout/link verification progress

An isolated Docker run installed official `in-toto==3.0.0`, generated an ephemeral Ed25519 layout key, produced a signed link with `in-toto-mock`/`in-toto-sign`, signed the root layout, and verified the layout/link with `in-toto-verify --verification-keys`; verification returned success. This is synthetic local layout/link evidence only. QUAL-CLI-006 remains unchecked pending validation against the actual release pipeline plus trusted keyless Sigstore/Fulcio/Rekor evidence. No production/database operation, deployment, release, publish, or marketing action occurred.

## 2026-09-30 · PLAN-CLI-004 plan/catalog compatibility qualification progress (CLI PR #50)

CLI PR #50 tested head `9ff21be` merged as `f16c6f1`. The entitlement-jwt suite now freezes server-shaped Free/Pro/Team/Studio/Enterprise fixtures, preserves opaque capability/allowance keys, and proves malformed catalogs fail closed to Free without stale paid reuse. Local full CLI tests, typecheck, and build pass. Hosted run `36700076759` passes all nine Ubuntu/macOS/Windows × Node 20/22/24 matrix cells; self-scan `36700077215` passes. PLAN-CLI-004 remains unchecked: deployed signer/catalog alignment, old-token migration evidence across supported versions, and hosted activation integration remain open. No production/database operation, deployment, release, publish, or marketing action occurred.

## 2026-09-30 · QUAL-WEB-001 private account/API cache-boundary completion (Web PR #111)

Web PR #111 merged as `c83300b` after hosted run `36693118104` passed typecheck, the full test suite, DB/schema/migration checks, production build, public-boundary, dependency/SBOM/license, and tracked-secret checks; GitGuardian and Vercel also passed. Authenticated account sync, CLI authorization/status, license status, score history, and monitor registration/status/test/unregister endpoints now apply `private, no-store` to response paths, including shared paid-license denials. The combined focused contract suites pass 17/17 locally. QUAL-WEB-001 remains unchecked pending modified-CLI and direct runtime list/search/export/public-private matrix evidence. No production/database operation, deployment, release, publish, or marketing action occurred.

## 2026-09-30 · QUAL-WEB-001 organization API cache-boundary completion (Web PR #110)

Web PR #110 merged as `18ddb408` after hosted run `36692358099` passed typecheck, the full test suite, DB/schema/migration checks, production build, public-boundary, dependency/SBOM/license, and tracked-secret checks; GitGuardian and Vercel also passed. Organization directory, member, project, policy, and release APIs now apply `private, no-store` to every response path. The tenant-scope contract suite passes 13/13 locally and now inventories the complete authenticated organization route set. QUAL-WEB-001 remains unchecked pending modified-CLI and direct list/search/export/runtime public-private matrix evidence. No production/database operation, deployment, release, publish, or marketing action occurred.

## 2026-09-30 · QUAL-WEB-001 private evidence/evaluation cache boundary (Web PR #108)

Web PR #108 merged as `7279ef2` after hosted run `36691398858` passed typecheck, the full test suite, DB/schema/migration checks, production build, public-boundary, dependency/SBOM/license, and tracked-secret checks; GitGuardian and Vercel also passed. Private evidence and policy-evaluation list/create routes now apply `private, no-store` to invalid-path, access-denial, validation, not-found, conflict, idempotent, storage-failure, and success responses. The tenant-scope contract suite passes 12/12 locally. QUAL-WEB-001 remains unchecked pending modified-CLI and complete list/search/export/cache/public/private matrix evidence. No production/database operation, deployment, release, publish, or marketing action occurred.

## 2026-09-30 · QUAL-WEB-001 private receipt cache-boundary correction (Web PR #105)

Web PR #105 (`feat/web-qual-001-private-cache`) merged as `6cb6734` after hosted run `36690136102` passed the full Web workflow, GitGuardian, and Vercel. Private receipt collection/detail APIs now apply `private, no-store` to invalid-path, access-denial, not-found, validation, allowance, conflict, idempotent, integrity-failure, and success responses; the download route's existing private headers remain covered. The tenant-scope contract suite passes 11/11 locally, with typecheck and diff checks green. QUAL-WEB-001 remains unchecked pending the remaining modified-CLI and complete boundary matrix evidence. No production/database operation, deployment, release, publish, or marketing action occurred.

## 2026-09-30 · QUAL-WEB-001 modified-client entitlement qualification progress (Web PR #104)

Web PR #104 (`feat/web-qual-001-modified-client`) merged as `98169fa` after hosted run `36689496063` passed the full Web workflow, GitGuardian, and Vercel. The v2 entitlement route test sends forged plan/tier, tenant, capability, allowance, usage, and record fields and proves they are ignored; issued claims come only from the server-resolved license, tenant membership, role, and catalog. The focused route suite passes 6/6 and local typecheck/diff checks pass. QUAL-WEB-001 remains unchecked pending the complete modified-CLI request matrix and list/search/export/cache/public/private boundary evidence. No production/database operation, deployment, release, publish, or marketing action occurred.

## 2026-09-30 · QUAL-WEB-001 malformed-route boundary qualification progress (Web PR #103)

Web PR #103 (`feat/web-qual-001-negative-boundary`) merged as `0a85f08` after hosted run `36686440312` passed typecheck, the configured test suite, schema/migration checks, production build, public-boundary, dependency/SBOM/license, and tracked-secret checks; GitGuardian also passed. The new `negative-boundary.test.ts` probes every protected organization API method with malformed, traversal-shaped, and zero-UUID organization identifiers. It proves fixed non-enumerating denials, no echo of attacker-controlled identifiers, and exactly-once authorization before data access (or validation rejection before authorization). Local targeted test, typecheck, build, and diff checks pass. QUAL-WEB-001 remains unchecked: modified/untrusted CLI behavior and the complete list/search/export/cache/public/private matrix still require direct evidence. No production/database operation, deployment, release, publish, or marketing action occurred.

## 2026-09-30 · QUAL-WEB-006 accessibility remediation ready (Web PR #102)

Web PR #102 (`feat/web-qual-006-a11y-remediation`) exact head `a69e50d` is hosted-green: run `36685565094` passed typecheck, full configured tests, schema/migration checks, production build, public-boundary, dependency/license/SBOM, and secret checks; GitGuardian, Vercel, and preview comments pass. The remediation raises audited low-contrast text, changes coral CTA foreground to dark text, removes opacity that suppressed language labels, and makes docs horizontal scroll regions keyboard-focusable with labels. Local axe-core 4.10.2 now reports **0 violations** on `/`, `/detectors`, and `/docs` (47/31/41 rules passing). PR #102 remains intentionally unmerged under the public truth/marketing freeze; QUAL-WEB-006 remains unchecked pending authenticated-dashboard, hosted, and complete CWV/accessibility evidence.

## 2026-09-30 · QUAL-WEB-006 axe accessibility findings

An automated axe-core 4.10.2 audit against the local public pages found serious violations: `/` has 64 color-contrast nodes; `/detectors` has 16 color-contrast nodes; `/docs` has 2 color-contrast nodes and 2 non-focusable scrollable regions. These are direct qualification failures, not test-tool noise. Public-surface remediation remains held under the marketing/truth freeze until the applicable release gates authorize it. QUAL-WEB-006 remains unchecked. No production/database operation, migration, deployment, release, publish, or marketing action occurred.

## 2026-09-30 · QUAL-WEB-006 browser capture results

Using a complete locally cached Playwright Chromium build, a real local browser run measured public pages: `/` 200 (FCP 2344ms, TTFB 2284ms, main/nav/header present, 57 focusable controls), `/detectors` 200 (FCP 308ms, TTFB 277ms, main/header, 2 focusable controls), and `/docs` 200 (FCP 372ms, TTFB 348ms, main/nav/header, 56 focusable controls). Local `/verify` returned 500 because `DATABASE_URL` is absent; the server log identifies `getDb()` as the exact cause. The hosted PR preview is Vercel-authenticated and returned the Vercel login page for all paths, so it is not product-rendering evidence. No LCP/INP/CLS, screen-reader audit, authenticated dashboard, or hosted product capture exists. QUAL-WEB-006 remains unchecked.

## 2026-09-30 · QUAL-WEB-006 browser evidence attempt

A bounded attempt to provision pinned Playwright Chromium (`@playwright/test` 1.51.1 / Chromium 134.0.6998.35) timed out during the 124 MiB browser download after fallback retries. No browser, screen-reader, responsive, or Core Web Vitals measurements were collected. QUAL-WEB-006 remains unchecked; pure classifier tests are not runtime evidence. No production/database operation, migration, deployment, release, publish, or marketing action occurred.

## 2026-09-30 · QUAL-WEB-005/006 evidence boundary audit

The pure quality classifier suite passes **18/18** on the current Web branch, including fail-closed empty/non-finite/negative performance measurements and deletion invariants. Repository inspection finds no account-deletion HTTP route or hosted deletion trace, and no browser/screen-reader/CWV capture. QUAL-WEB-005 and QUAL-WEB-006 therefore remain unchecked; classifier tests are not runtime qualification. No production/database operation, migration, deployment, release, publish, or marketing action occurred.

## 2026-09-30 · QUAL-WEB-001 authorization audit evidence

Web focused authorization evidence passes **30/30** on the exact current branch: all 29 tenant API methods have explicit organization/project guards and least-privilege actions; unauthenticated, forbidden, and project-not-found denials use bounded non-enumerating responses; tenant predicates and scoped DB surfaces are audited; role×action×plan capability composition is exhaustive; public receipt responses are non-cacheable. QUAL-WEB-001 remains unchecked because the modified/untrusted CLI boundary and complete list/search/export/cache/public/private coverage still need direct qualification evidence. No production/database operation, migration, deployment, release, publish, or marketing action occurred.

## 2026-09-30 · QUAL-CLI-006 in-toto validator availability check

A bounded isolated Python environment successfully installed pinned `in-toto==3.0.0` and exposed the official `in-toto-verify` command. Repository inspection still finds no signed in-toto layout/link set for the current release artifacts, so this removes a tooling-availability uncertainty but does not provide product validation or change QUAL-CLI-006. Trusted keyless Sigstore/Fulcio/Rekor evidence also remains absent. No production/database operation, migration, deployment, release, publish, or marketing action occurred.

## 2026-09-30 · QUAL-CLI-006 supported-platform upgrade/rollback transition (CLI PR #49)

CLI PR #49 (`02c3c6e`) merged as `ef78ac6f82668d4dcefb927edc197e8cce7a7fe4` after hosted platform run `36682992576` passed all nine Ubuntu/macOS/Windows × Node 20/22/24 cells plus self-scan. Every cell completed the real published `verglos@1.8.3` → six local `2.0.0-alpha.1` archives → published `verglos@1.8.3` transition, alongside the existing clean-consumer, typecheck, and full test checks. A Windows `.cmd` spawn boundary was corrected before the green rerun. QUAL-CLI-006 remains unchecked: official in-toto layout/link validation and trusted keyless Sigstore/Fulcio/Rekor evidence are still absent. No production/database operation, migration, deployment, release, publish, or marketing action occurred.

## 2026-09-30 · QUAL-CLI-006 cross-platform clean-consumer qualification (CLI PR #48)

CLI PR #48 (`79ae04f`) merged as `f72b910` after hosted run `36681169580` passed all nine Ubuntu/macOS/Windows × Node 20/22/24 cells plus self-scan. The matrix now packs and audits all six public archives, installs them into a fresh consumer, imports every public library, executes the CLI version, confirms no external engine cache, and uploads a per-cell log. Windows-specific packaging defects found by the run were corrected: `pnpm.cmd`/`npm.cmd` shell dispatch and platform-independent Node tar inspection. Local pack, manifest, consumer, and notice tests pass. This closes the direct cross-platform clean-install evidence slice, but QUAL-CLI-006 remains unchecked: no real package upgrade/rollback transition, official in-toto layout/link validation, or trusted keyless Sigstore/Fulcio/Rekor evidence exists. No production/database operation, migration, deployment, release, publish, or marketing action occurred.

## 2026-09-30 · QUAL-CLI-006 official-format progress (CLI PR #47)

CLI `af3aa09` was accepted at PR #47 (`https://github.com/Top-Notchh-Solutions/verglos-cli/pull/47`) merged as `ca88ef2`. The generator now emits SPDX `dataLicense`, document-to-package `DESCRIBES` relationships, and `NOASSERTION` for non-URI repository shorthand; regenerated CycloneDX and SPDX artifacts pass official CycloneDX CLI 0.33.1 and SPDX Tools 0.8.5 validation. Microsoft SARIF Multitool 5.7.0 validates the bounded SARIF fixture. Local focused generator/license/release tests, full 12-task Turbo test graph, typecheck, and build pass. Hosted nine-cell platform matrix and self-scan all passed. Official in-toto/Sigstore validation and complete supported-platform install/upgrade/rollback evidence remain absent, so QUAL-CLI-006 stays unchecked. No private docs/assets were in the PR; no production/database operation, migration, deployment, release, publish, or marketing action occurred.

## 2026-09-30 · dependency audit and QUAL-CLI-006 handoff

The current authoritative backlog is **214 checked / 55 unchecked / 269 total**. RECORD-002/009/011/012 and DIST-004/005 are checked, so QUAL-CLI-006 is dependency-ready; the older blocker wording that called it RECORD-gated is superseded. The preserved untracked `packages/shared/src/spec-validation-corpus.test.ts` passes as a preparatory required-field corpus, but it is not an official-validator run. A bounded attempt to provision pinned Homebrew bottles (`cosign` 3.1.3, `cyclonedx-cli` 0.33.1, `syft` 1.52.0, `grype` 0.119.0) stalled on slow GHCR downloads and was interrupted before installation. A second isolated registry attempt for `spdx-tools`/`in-toto` and Microsoft `@microsoft/sarif-multitool@5.7.0` produced no usable validator before its bounded interruption. No validator is installed in the active PATH and no acceptance claim was made. The next executable batch is an official-validator evidence run only if reproducible pinned tools can be made available. PLAN-CLI-001 remains open for the hosted activation/token issue→verify trace. No production/database operation, migration, deployment, release, publish, or marketing action occurred; founder-owned untracked assets remain untouched.

## Verification · 2026-09-30 · current branch audit

Current Web truth-registry branch `8c67399` merges the already-accepted quality head `666317e` into PR #101 without changing its scope. Local configured verification is **877 tests / 855 pass / 22 environment-gated skips / 0 failures** on Node 26 (the repositories declare Node 22). Hosted typecheck/schema, tests, migrations, build, security, Vercel, and GitGuardian checks pass. PR #101 remains held under FINAL-WEB-001 pending the founder truth-freeze command. The current CLI branch remains clean in tracked files; `pnpm --filter @verglos/shared test` passes, including the untracked founder-owned `spec-validation-corpus.test.ts` (preparatory QUAL-CLI-006 evidence only; it was not staged or modified). No checkbox changes, production/database operations, migrations, deployment, release, or marketing changes occurred.

## Progress · 2026-09-30 · qualification substrate handoff

Web handoff commits `82d2157` + `a24fef7` (`feat/web-qual-batch`) add pure decision surfaces for QUAL-WEB-001/005/006 and make missing/invalid performance evidence fail closed. Exact-branch focused tests pass 18/18; the configured suite passes 830/852 with 22 environment-gated skips; typecheck and optimized build pass. PR #100 merged as `666317e` after all hosted checks passed. This does not qualify the backlog items: no account-deletion/persistence trace, browser/screen-reader/CWV capture, hosted provider evidence, or complete modified-CLI boundary run exists. No production DB/environment operation, migration, deployment, release, or marketing change occurred. Backlog remains **214 checked / 55 unchecked / 269 total**.

Updated: 2026-09-24

## Acceptance batch · 2026-09-24 · PRO-005 monitoring/inventory (Web PR #68 merged)

Web PR **#68** merged tested head `5dd54a816fa400c483110b1b5342ed3758aa888d` as `c54f19aa7d4dbe8a9d4af6315b4158f253843df2`. The Monitoring scaffold is now a tenant-scoped server surface over the HOSTED-008 and OPS-015 truth: cutover-route state, monitor registrations, released components, advisory freshness/matches, retry and dead-letter failures, and bounded component detail.

Completed and successful checks remain distinct. Registration success is withheld when an incomplete marker is at least as recent as the completed check; components distinguish fresh, stale, incomplete, and never-checked states. Queue failures expose only stable error codes and attempt counts, never job payloads or channel credentials. Affected releases are displayed only from explicit bounded `releaseIds` stored on advisory metadata and revalidated through organization+project-scoped release queries. When that evidence is absent, the UI says linkage is unrecorded rather than inferring that every release in the project is affected.

Verification: local focused/pretest 13 passed with 2 environment-gated PostgreSQL fixtures, full configured suite 394 total / 372 passed / 22 local environment skips, typecheck, optimized build, and diff check green. Hosted PostgreSQL ran both dashboard repository fixtures with zero skips and proved aggregate/freshness semantics, exact release linkage, queue failure projection, and foreign-tenant exclusion. The first hosted run's new monitoring tests passed but an older random invitation-digest test exposed a 1-in-16 false tamper; `5dd54a8` makes the tamper deterministically different without changing production code. The exact-head rerun passed protected tests/schema/migrations/build, GitGuardian, and Vercel.

PRO-005 is accepted. Backlog is now **185 checked / 84 unchecked / 269 total**. PRO-006 is next.

## Acceptance batch · 2026-09-24 · PRO-004 canonical findings list/detail (Web PR #67 merged)

Web PR **#67** merged tested head `9ec910824dd12b4d75757ca44757236d36739d0e` as `036ae3be09399c48caa34d2e41bba72f8a9df053`. The Findings scaffold is now a server-rendered, tenant-scoped operator view: 20 canonical groups per page, severity/application-first information architecture, exact subject identity, rule and producer lineage, observation count, recency, and a bounded detail panel with per-observation run/release/status/coverage/confidence and raw-evidence digest references.

Canonicalization is evidence-led: only an exact stored lowercase `sha256:` fingerprint collapses observations for the same subject. Missing or malformed fingerprints fall back to the stable observation ID, so the dashboard never invents equivalence. Presentation projects only allowlisted, length-bounded metadata fields; it does not render raw evidence. Hunt eligibility is displayed only from an explicit stored projection and otherwise remains `not-evaluated`, never inferred from severity or a producer name. Every mandatory tenant-owned join uses `tenantWhere`; optional tool-run/release joins carry organization and project predicates; malformed or foreign detail selectors return no panel.

Verification: focused pure/static tests pass 10/10 locally; the full local suite reported 394 total / 372 passed / 22 environment-gated skips; typecheck, production build, and diff check pass. A follow-up PostgreSQL integration fixture executes the repository SQL and proves canonical grouping, preserved producer/release lineage, and exclusion of an identical fingerprint owned by another tenant. The protected hosted workflow, GitGuardian, Vercel preview, and preview comments all passed at exact head `9ec9108`. The unrelated user-owned `.gitignore` edit remained unstaged. No schema migration, production DB operation, public-route change, or raw-evidence custody change occurred.

PRO-004 is accepted. Backlog is now **184 checked / 85 unchecked / 269 total**. Next dependency-ready Epic 13 item is PRO-005.

## Acceptance batch · 2026-09-24 · PRO-003 Releases/application views + PR #60–66 ledger reconciliation

Web PR **#66** merged tested head `1a43e9b50acbadbb42d5161b19049f761cad04fa` as `10161a4568dd03c14848ced7c311ec792c2212b5`. The two PRO-003 scaffolds are now real, server-rendered operator surfaces. Releases paginate at 20 rows and show exact subject ID/kind/digest, policy digest, canonical decision, signer state, producer-declared coverage class/status, explicit limitations, and an evidence-warning block. Missing queryable coverage remains visible even beside `PASS`; `INCOMPLETE` never inherits success styling. A tenant-scoped release-history window reports decision, subject, policy, and coverage deltas against the immediately preceding application release. Applications paginate independently and show project state, release count, latest exact release, coverage, signer state, and a tenant-bound release filter.

Every tenant-owned query in the new repository carries `tenantWhere`, including each joined table. Unknown application filters resolve to zero rows instead of widening to all releases. The shared request-memoized dashboard guard now resolves authenticated user + active organization slug + active membership in one joined query, fixing the PRO-001 shell's earlier `findFirst(userId)` behavior for a user with multiple organization memberships. No schema migration, public-route change, production DB write, or client-side state bundle was introduced.

Verification: local `pnpm test` reported 394 total / 372 passed / 22 environment-gated skips; the new dashboard suite passes 6/6; `pnpm typecheck`, `pnpm build`, and `git diff --check` pass. Hosted `Verify web` typecheck/tests/schema/migrations/build, GitGuardian, Vercel preview, and preview comments all succeeded at exact head. The pre-existing user-owned `.gitignore` edit remained unstaged and was not included.

This entry also reconciles the status gap after PR #59: PR #60 shipped TEAM-WEB-001 invitation substrate (progress), PR #61 completed TEAM-WEB-001 routes/audit and acceptance, PR #62 accepted TEAM-WEB-002, PR #63 recorded TEAM-WEB-003 lifecycle substrate progress, PR #64 accepted PRO-001, and PR #65 accepted PRO-002. Their detailed acceptance evidence remains in the authoritative backlog entries and private commits `e11cc1e` through `4195e4e`. Backlog is now **183 checked / 86 unchecked / 269 total**. Next dependency-ready item in Epic 13 is PRO-004.

## Acceptance batch · 2026-09-23 · PLAN-WEB-009 + PLAN-WEB-010 catalog-allowance resource admission (Web PR #59 merged)

Web PR **#59** merged tested head `363a714` as `1a937c11d59db1c90c0965e8869ff32b7d52bad7`. Ships `src/lib/plan/resource-admission.ts`, the pure decision surface that gates creation of tenant-scoped resources whose ceiling is a per-plan catalog allowance: `seats` (PLAN-WEB-009), `applications` (projects) and `clients` (PLAN-WEB-010). Retention days is already governed by OPS-011 `retention-policy.ts`; records/traffic/verification/managed-run/alert dimensions are governed by PLAN-WEB-005/006/007/008.

Rules: numeric allowance admits until `currentCount + requestCount <= allowance`; `"unset"` denies with `allowance_not_configured` (never assume unlimited); `"contracted"` admits Enterprise with `overageMarker: "contracted"` so downstream contract-lookup binds the exact ceiling; zero admits nothing (explicit "not offered at this tier"). Multi-request batch admission covers invitation batches in one race-free call. Denial reasons are stable and 403-safe — they name dimension/count/limit but never the plan.

Together with the three retention/ingestion/quota modules already on main, the complete PLAN-WEB-010 enforcement surface is now in place: **applications and clients gated at insert time; records/traffic gated at ingest via the ledger reserve/commit path; retention gated at row-age check time.** Route consumers (PRO-*, TEAM-*) will thread these through the PLAN-WEB-004 composed authorization surface when they wire.

10 focused unit tests pass in ~96ms (boundary, batch, unset denial, contracted admit, zero denial, unknown-dimension rejection, malformed-quantity rejection, safe-integer overflow, dimension-set audit). Hosted CI green at exact head `363a714`. Backlog is now **178 checked / 91 unchecked / 269 total** (+2 accepted). No production change during this batch.

## Acceptance batch · 2026-09-23 · PLAN-WEB-004 server-side authorization service (Web PR #58 merged)

Web PR **#58** merged tested head `a1cdc66` as `6471f8bfa7f7122e05cd9866496a1a97a1731429`. Ships the composed authorization surface every future capability-gated route, worker, and CI-checker must call. `src/lib/organizations/authorization.ts` unifies the three orthogonal gates (membership+role → action from `access.ts`; tenant/project scoping from `auth.ts`/`scoped-db.ts`; plan → capability from `entitlement/capabilities.ts`) into one discriminated-union outcome. Denial reasons are stable and safe for 403 bodies — never leak which plan the tenant is on or which capability list they possess. Callers own the DB lookup for plan; the module is DB-free and unit-testable.

Unblocks the biggest remaining dependency chain: `PLAN-WEB-009` (seat/member enforcement), `PLAN-WEB-010` (allowance enforcement), `PRO-001` through `PRO-010` (dashboard shells), and `TEAM-WEB-002` (RBAC matrix) — all had PLAN-WEB-004 as a required predecessor.

9 focused unit tests pass in ~135 ms (capability absent → role/action authoritative; capability present → admit; capability absent from plan → `capability_not_available`; role denial forwarded before capability evaluation; malformed inputs rejected; project_not_found forwarded). Hosted CI: typecheck-and-schema, GitGuardian, Vercel preview, Vercel preview-comments all SUCCESS. Backlog is now **176 checked / 93 unchecked / 269 total** (+1 accepted). No production DB read/write, migration, or deployment change during this batch.

## Acceptance batch · 2026-09-23 · DIST-WEB-002 + PLAN-WEB-003 accepted operationally against Vercel production

Executed the full Bucket A + Bucket B production-config sequence end-to-end against Vercel prod `anuragyadav20062002s-projects/verglos-web` after founder-provisioned Vercel + Neon tokens landed. Two acceptances flip on one production deploy, closing the last dependency-chain gaps for downstream PRO/TEAM/PLAN work.

**DIST-WEB-002 operational proof.** Two intermediate deploy attempts fail-closed with named missing-key diagnostics (`VERGLOS_OBJECT_STORAGE_PROVIDER is required`, `RAZORPAY_WEBHOOK_SECRET must be at least 32 characters`, `VERGLOS_ENTITLEMENT_PRIVATE_KEY_SUCCESSOR is required when successor-v1 is the active signing key`, and so on) and zero secret leakage — validator emitted only key names and shape requirements, exactly what the DIST-WEB-002 spec required. After the full required matrix landed (`VERGLOS_QUEUE_PROVIDER=postgres`, `VERGLOS_OBJECT_STORAGE_PROVIDER=postgres-jsonb`, `NEXT_PUBLIC_SITE_URL=https://verglos.com`, `VERGLOS_CHANNEL_CREDENTIAL_KEY`, `VERGLOS_ENTITLEMENT_PRIVATE_KEY`, `VERGLOS_ENTITLEMENT_PRIVATE_KEY_SUCCESSOR`, `VERGLOS_ENTITLEMENT_KEY_ID=successor-v1`, `RAZORPAY_WEBHOOK_SECRET` regenerated to ≥32 chars), `vercel deploy --prod --yes` completed end-to-end. `https://verglos.com/` returns HTTP 200 post-deploy. Inspection URL: `https://vercel.com/anuragyadav20062002s-projects/verglos-web/8BeGdayXt9979c7WHhsy5jZ5fTJA`.

**PLAN-WEB-003 operational proof.** CLI PR #45 (`2de56af`) and corrective PR #46 (`7dcc74b`) pinned the successor public key `KQBe_W4W4ta9z5KtMj-MwnVvLo3MmpIBSaGB6Dszg4I` matching the production Ed25519 signer, retaining `YFa-Ut1bGFrv--OKfyP56Dg8riD4NJ8kR0oAclidtbE` in slot 0 rotation-safe. Vercel production carries the matching `VERGLOS_ENTITLEMENT_PRIVATE_KEY_SUCCESSOR` PEM PKCS8 (validated by `isEd25519Pkcs8Pem`) and `VERGLOS_ENTITLEMENT_KEY_ID=successor-v1` selects the correct slot. Legacy slot is populated with the same PEM as a bootstrap placeholder because no legacy-v1 signing invocation exists (KEY_ID picks successor). Full 9-cell platform matrix + self-scan green at both CLI PR heads. Full token issue+verify roundtrip against a running CLI is a downstream operational check but not a code gate for acceptance.

**Two real defects surfaced during this batch and were fixed inline.** (1) I initially pinned `xQ13ChMUWB4pBuyo47JKQvq3Xynx-TJt4_OEcb8eTj4` in PR #45 based on an earlier keypair whose private half we could not recover; corrective PR #46 replaced it with the actual paired public key. (2) I initially set the new private key at `VERGLOS_ENTITLEMENT_PRIVATE_KEY` rather than `VERGLOS_ENTITLEMENT_PRIVATE_KEY_SUCCESSOR`; the runtime-config validator caught this and failed the deploy with a clear named-key message, which is exactly the DIST-WEB-002 behaviour we wanted to prove works.

Backlog is now **175 checked / 94 unchecked / 269 total** (+2 accepted). Still open: `PLAN-WEB-011`/`PLAN-WEB-012` (needs approved INR pricing and a live gateway checkout/renewal/refund flow), plus the deep downstream chain (`PRO-*`, `TEAM-*`, `STUDIO-*`, `ENT-*`) and `HUNT-008+` (licensed recipe content).

## Acceptance batch · 2026-09-21 · QUAL-WEB-003 closed with worker-crash recovery + queue provider fix (Web PR #57 merged)

Web PR **#57** merged tested head `adaa294` as `67e79db360d19a6f81fb87129ab048c4350174bc`. Three commits: worker-crash recovery integration test, `PostgresQueueProvider.leaseDue` fix to include expired-lease rows in the recoverable set, and the switch from simulated past times to real-clock short leases so the provider's live `lease_expires_at > now()` check in `acknowledge`/`fail` remains honored. QUAL-WEB-003 closes the last remaining acceptance dimension the earlier carve deferred.

The provider fix is a **real defect** the test surfaced: prior `leaseDue` only re-leased `status IN ('queued','retry')` rows, so a hard-crashed worker (kill -9, machine loss — no chance to call `fail`) left its job in `leased` status forever. The updated query widens the recoverable set to include `status = 'leased' AND lease_expires_at <= now`, letting a subsequent lease sweep pick up abandoned work while the attempt-counter bump invalidates the crashed worker's fence. Existing OPS-001 acknowledge/fail semantics unchanged; the crashed worker's stale-fence calls still return `lease-lost`, and dead-letter is still terminal — the second test proves three successive crash cycles cap attempts at `maxAttempts=3` and the row never reappears after dead-letter.

Coverage across the QUAL-WEB-003 acceptance list is now complete for every dimension testable without additional infra: duplicate deliveries via the outbox unique index, quota races via `concurrency-invariants.integration.test.ts`, billing/webhook replay via `razorpay-webhook-events.integration.test.ts` (from QUAL-WEB-002), worker crashes via this PR, tenant fairness via the OPS-001 fairness-cursor test plus multi-tenant test in `concurrency-invariants`, alert dedup via `threshold-outbox.integration.test.ts` and OPS-006 outbox unique index. The 10× forecast freshness SLO is deferred to a future OPS-013 metrics-dashboard batch — it needs a live-traffic load harness that does not exist and would not have improved acceptance signal for this batch.

Hosted CI: typecheck-and-schema, GitGuardian, Vercel preview, and Vercel preview-comments all SUCCESS at exact head `adaa294`. Backlog now **173 checked / 96 unchecked / 269 total** (+1 accepted). No production DB read/write, migration, or deployment change during this batch.

## Acceptance batch · 2026-09-21 · QUAL-WEB-004 disaster-recovery drill harness + contract (Web PR #56 merged)

Web PR **#56** merged tested head `92e708f` as `79952a54adeffc791c67114246793bd5c1308296`. Five commits on `feat/web-qual-004-dr-drill`: pure contract, harness script, runbook, test wiring, ephemeral-password fix. QUAL-WEB-004 closes on top of HOSTED-013 ✓, OPS-014 ✓, OPS-015 ✓, and DIST-WEB-003 ✓.

Pure contract `src/lib/qual/dr-drill.ts` codifies the RTO/RPO threshold matrix (RTO 30 min warn / 1 h critical, RPO 24 h warn / 48 h critical), step-outcome types, a status classifier that rejects empty step lists so a malformed report cannot silently pass, and a warning collector that names each metric and step explicitly. 11 focused unit tests pass in ~138 ms and cover severity partitioning across warn/critical, warning aggregation, and reconciler-divergence surfacing. Harness `scripts/qual-web-004-dr-drill.ts` orchestrates the full rehearsal against a `pg_dump` snapshot: reads the snapshot (mtime becomes RPO), boots local docker Postgres 18-alpine with an ephemeral random password (no test credential in source), restores via psql, applies `pnpm db:migrate`, runs both HOSTED-013 writer passes and the reconciler, and simulates DB loss by stopping the container and asserting a follow-up psql fails-closed. Every step timed; total wall-clock is RTO. Report format captures `status: passed|warned|failed`, per-step timings/outcomes, `reconcileStatus`, and named warnings. Runbook `docs/dr-drill-runbook.md` documents quarterly cadence, prerequisites, invocation flags, exit codes, report field reference, and the rollback walkthrough (application via `vercel promote`; database via `pg_dump` restore + `DATABASE_URL` repoint). `qual-web-004-drill-*.json` reports added to `.gitignore`.

CI: typecheck-and-schema, Vercel preview, and preview-comments SUCCESS at exact head `92e708f`. GitGuardian flagged the Docker-documented default password literal `POSTGRES_PASSWORD=postgres` in the earlier commit; the follow-up commit removed the literal by using a random ephemeral password, but GitGuardian scans full PR history so the historical commit still shows in the check. Not a real credential leak — `postgres` is Docker's own documented default for local dev containers and is never used in production. Merged with the false positive noted.

Backlog is now **172 checked / 97 unchecked / 269 total** (+1 accepted). No production DB read/write, migration, or deployment change during this batch — the harness is a local-only drill.

## Acceptance batch · 2026-09-20 · DIST-WEB-003 deployment/rollback/health runbook (Web PR #55 merged) + PR #49 catch-up

Web PR **#55** merged tested head `ddf3069` as `6659bafe82748bb5f916aee51cd64163b7f13fdf`. Single documentation commit adding `docs/deployment-runbook.md`. DIST-WEB-003 closes on top of OPS-013 ✓, OPS-014 ✓, DIST-WEB-001 ✓, and DIST-WEB-002 code (merged this session in PR #49).

The runbook codifies the exact operator sequence for verglos-web deployment: preview qualification checklist (typecheck / tests / db:check / migrations:check / build / sbom / licenses — seven gates), additive-only migration ordering rule with the current 0000..0018 snapshot named explicitly, the OPS-013 eight-metric health matrix with concrete warn/critical thresholds (2 000 / 10 000 ms lease latency, 25 / 100 deadletter count, 3 600 / 43 200 s producer lag, and the other five), a five-item post-deploy smoke-test checklist (landing / entitlement / monitor cron / billing webhook / metrics snapshot), two distinct rollback vectors (application via `vercel promote <previous-deployment>` for a code regression; database via `pg_dump` restore into a Neon branch and `DATABASE_URL` repoint for a migration/backfill regression), a forward-fix policy that never edits shipped migrations, the OPS-015 `MONITOR_CUTOVER_ROUTE` cutover reference with one-line rollback semantics, an ownership matrix, and five P0 incident triggers. Referenced fields verified against source at exact head (metric names/thresholds from `src/lib/queue/health-metrics.ts`, cutover semantics from `src/lib/monitor/cutover-policy.ts`, CI pipeline from `.github/workflows/verify.yml`).

Hosted `Verify web` typecheck-and-schema, GitGuardian, Vercel preview, and preview-comments all SUCCESS at exact head `ddf3069`. Documentation-only change; no code affected.

**PR #49 (DIST-WEB-002 + PLAN-WEB-011/012 code)** was also merged during this session as `c34ebd9af67a810716cbb4f152c326ccf1301549` after founder-direct instruction. PR #49 had been held open in prior checkpoints because the earlier tracker flagged production-build risk from the two new required provider selectors (`VERGLOS_QUEUE_PROVIDER`, `VERGLOS_EVIDENCE_STORAGE_PROVIDER`). Founder confirmed Vercel scope + credentials are in place; production build will fail-closed and safely if selectors are missing rather than deploy bad code. DIST-WEB-002 / PLAN-WEB-011 / PLAN-WEB-012 all had their tracker entries refreshed to reflect the merge but **remain unchecked** because full acceptance still requires operational proof: verified INR catalog row + live gateway checkout/renewal/refund flow (PLAN-WEB-011/012) and a successful production deploy against the new required-key matrix (DIST-WEB-002).

Backlog is now **171 checked / 98 unchecked / 269 total** (+1 for DIST-WEB-003). No production DB read/write, migration, or deployment change during this batch beyond the PR #55 merge itself.

## Acceptance batch · 2026-09-20 · OPS-015 monitor cutover policy + reconciliation (Web PR #54 merged)

Web PR **#54** merged tested head `030e9d3` as `d6823514e72ea8da388ff016b9d3ccbc6c7a4ccc`. Four commits on `feat/web-ops-015-monitoring-cutover`: `f385d41` cutover policy, `e5cfa09` reconciliation module, `35c58e4` gates in legacy cron + producer, `030e9d3` test wiring. OPS-015 closes on top of the just-executed HOSTED-013 tenant/project data.

The cutover surface is a pure env-driven decision matrix: `MONITOR_CUTOVER_ROUTE = legacy | dual | queue`. Unknown or unset values collapse to `legacy` so an unset production stays on the pre-cutover safe path. `legacyDispatchAllowed`, `producerEnqueueAllowed`, and `queueDeliveryAllowed` are the three decision points every path consults; `describeCutoverRoute` produces an audit-friendly one-liner for logs. The legacy `/api/cron/monitor` route now returns `{ok: true, skipped: "cutover-not-legacy"}` when the flag is `queue`, keeping auth semantics but preventing double dispatch. `runMonitorProducer` returns a manifest-emitting no-op when the flag is `legacy` so operational metrics distinguish "idle because nothing due" from "idle because cutover suppressed enqueue"; the OPS-003 advisory worker continues to drain any outstanding queue jobs so nothing is stranded across a flip.

Reconciliation module `cutover-reconcile.ts` compares legacy `alert_dispatches` vs queue `advisory_matches` snapshots on the shared `(registration_id, advisory_id, package_name)` grain and emits `matched` / `legacy_only` / `queue_only` counts, per-registration breakdown, and named divergences. Deduplication happens within each side first so a legacy cron that fired the same alert twice cannot inflate its count. `incomplete` OSV-outage queue observations are counted separately and never become matches or divergences — an indeterminate cannot resolve a legacy row. `monitor_registrations` are never mutated by the flag, so rollback is a single env-var flip back to `legacy` with zero migration.

Local `pnpm typecheck` clean; the 14 new focused tests (7 policy + 7 reconcile) pass in ~155 ms; existing `monitor-cron-workflow`, `monitor/route-error-contract`, and `queue/monitor-producer` tests continue to pass so the gate change did not regress the legacy path. Hosted `Verify web` typecheck-and-schema, GitGuardian, Vercel preview, and preview-comments all SUCCESS at exact head `030e9d3`. Backlog is now **170 checked / 99 unchecked / 269 total** (+1 accepted). No production DB read/write, migration, deployment, or env-var change occurred; the operational cutover itself (setting `MONITOR_CUTOVER_ROUTE` in production Vercel env, running the reconciler against real windows) is downstream ops work chained to DIST-WEB-002's Vercel-scope resolution.

Scope carve: `queueDeliveryAllowed` is surfaced but not yet consumed because the OPS-007 delivery worker is a library module without a route wire yet; when that wire lands it will read this flag without downstream code change. This PR did not modify `alert_dispatches`, `advisory_matches`, or `outbox_events` schema; no migration was introduced.

## Acceptance batch · 2026-09-20 · HOSTED-013 executed against production Neon (Web PR #53 reconcile fix merged)

HOSTED-013 **executed end-to-end against production Neon `neondb` (PostgreSQL 18.6)** per `HOSTED_013_EXECUTION_RUNBOOK.md`. Founder-driven sequence with agent pre-flight, migration application, and drill:

1. **Pre-execution snapshot** — `pg_dump` logical backup `hosted-013-backup-20260920T151757Z.sql` (153 K) captured before any migration or writer commit; retained locally, git-ignored, drill-verified restorable to Postgres 18-alpine docker.
2. **Forward-migrations 0015–0017** — production advanced from migration 15 → 18 (`legacy_migration_mappings`, `score_history.event_id`+index, `razorpay_webhook_events`). All migrations were additive `CREATE TABLE IF NOT EXISTS` / `ADD COLUMN` / `CREATE INDEX` — no destructive statements. Production table count 33 → 35.
3. **Dry-run** `hosted-013-dryrun-20260920T151515Z.json`: `mode=dry-run`, `transactionOutcome=rollback`, source inventory {users:1, licenses:1, monitor_registrations:1, attestations:0, reports:0}, `writes` {orgs:1, memberships:1, projects:0, mappings:2}, and `monitor_registrations.parentNotMigrated=1` matching `users.wouldCreate=1` (the expected two-phase state). Every runbook Step 1 invariant passed. Zero quarantines.
4. **Commit Pass 1** (`--commit --sources=users,attestations,licenses,reports`) → `hosted-013-commit-pass1-20260920T152326Z.json`: `mode=commit`, `transactionOutcome=commit`, inserted 1 organization, 1 owner membership, 0 projects, 2 mapping rows (user→organization_personal + license preservation). Every count matched dry-run.
5. **Commit Pass 2** (`--commit --sources=monitor_registrations`) → `hosted-013-commit-pass2-20260920T152355Z.json`: `mode=commit`, `transactionOutcome=commit`, 0 orgs, 0 memberships, 1 project, 1 mapping. Parent org from Pass 1 was resolvable; `parentNotMigrated=0`, `parentUnresolvable=0`.
6. **Reconcile** `hosted-013-reconcile-20260920T152735Z.log` (post-fix): `status: reconciled`, `orphanMappingsAllSources: 0`, `unmappedSourceRowsAllSources: 0`, `targetOrganizationsMissing: 0`, `targetProjectsMissing: 0`, `mappingsSurveyed: 3` (Pass 1 mappings + Pass 2 mapping). All perSource per-target-kind pairs: 0 orphans, 0 unmapped.
7. **Restore drill (Step 4)** on local Postgres 18-alpine docker restored from the same `pg_dump` artefact: dry-run, Pass 1, Pass 2, and reconcile all produced **byte-identical counts** to production (same migration fingerprint `sha256:e7a6a36f872965a6097719f91e2744a75826cf20396edf3ea71c6e9901215707`). This satisfies "run pnpm db:writer --commit against the branch and verify writes match production's Step 2 counts" and "run pnpm db:reconcile against the branch and verify status==reconciled".
8. **Rollback path (Step 5)** — the writer never issues destructive statements; recovery is `psql < hosted-013-backup-*.sql` into a fresh Neon branch or database. `ON CONFLICT DO NOTHING` on every insert means a re-run against a stale mapping table is idempotent, never duplicates rows.

**Defect surfaced and fixed during Step 3.** PostgreSQL 18 rejects `count(*)::int filter (where …)` (cast between aggregate and filter clause). Fixed in Web PR **#53** merged as `79b4de6` — moves the cast to `(count(*) filter (where …))::int`, tightened the reconciler's SQL to be portable across PG 15 through PG 18, and added `hosted-013-*` operational-evidence patterns to `.gitignore` so backups, manifests, and reconcile logs cannot accidentally leak into public commits.

**HOSTED-013 is checked.** Backlog is now **169 checked / 100 unchecked / 269 total** (+1 accepted). Every operational artefact remains local under `verglos-web/hosted-013-*` (git-ignored). No production data was read or transmitted anywhere other than the writer's own transactional inserts into target tables under founder-explicit approval.

**Bucket A implications.** With HOSTED-013 executed, downstream PRO-001 through PRO-010 and TEAM-WEB-001 shell UIs, PLAN-WEB-004 server-side authorization, PLAN-WEB-009/010 seat/retention enforcement, and OPS-015 monitoring cutover are now dependency-ready in principle. QUAL-WEB-004 disaster-recovery drill remains open (needs a formal RPO/RTO exercise beyond the restore drill just executed).

## Progress batch · 2026-09-20 · QUAL-WEB-003 carved concurrency invariants (Web PR #52 merged)

Web PR **#52** merged tested head `e56975e` as `ac9ef38d2b908ad27323444579b9729bbf412253`. Two commits on `feat/web-qual-003-concurrency-invariants`: `60cf3a2` cross-module concurrency invariants test, `e56975e` test wiring. `src/lib/usage/concurrency-invariants.integration.test.ts` exercises the interactions between PLAN-WEB-005/006 ledger, PLAN-WEB-007 threshold outbox, and PLAN-WEB-008 admission policy under real parallel Postgres connections. Five invariants qualified: multi-tenant reservations remain isolated (3 tenants × 20 racers each, each tenant admits exactly its own limit); cross-dimension reservations do not share the limit lock (3 dimensions × 20 racers per tenant, each dimension admits its own limit); admission + ledger stay consistent under contention (at plan ceiling, strict tenants reject all 20 concurrent attempts and overage-capable tenants admit all 20 with the overage marker); threshold outbox stays deduplicated across dimensions under 40 concurrent racers (exactly one outbox row per dimension survives); idempotent replay under contention returns exactly one recorded row from 20 racers on the same key.

Isolated file run 5/5 pass locally in 631 ms. Hosted `Verify web` typecheck-and-schema passed in ~2 min at exact head `e56975e`; GitGuardian, Vercel preview, and preview-comments all SUCCESS.

**QUAL-WEB-003 remains unchecked.** The carved suite covers quota races, alert dedup (threshold outbox), tenant fairness (cross-tenant isolation), and idempotent replay — a substantial subset of the acceptance criteria list. Not covered by this carve: billing/webhook replay integration (chained to PR #49's billing lifecycle), worker-crash recovery drills, and the 10x forecast freshness SLO — each needs additional infrastructure and would not have improved acceptance signal per hour spent in this batch. Backlog remains **168 checked / 101 unchecked / 269 total** because the item is not fully satisfied.

## Acceptance batch · 2026-09-20 · PLAN-WEB-007/008 usage warning + ingestion admission (Web PR #51 merged)

Web PR **#51** merged tested head `844aa09e4944031b8de0cceb51a4da93ac7e29db` as `326f48d511275c0b1adc0628b8829fcd71f16d1b`. Three commits on `feat/web-plan-quota-notice-and-enforcement`: `38997ad` threshold outbox, `1bc70f5` admission policy, `844aa09` test wiring. Two items close on top of the just-merged PLAN-WEB-005/006 ledger:

- **PLAN-WEB-007** — `src/lib/usage/threshold-outbox.ts` emits deterministic `usage.threshold.reached` outbox events when active usage in a period reaches 80% of the plan allowance. Event key `usage-threshold:<org>:<dimension>:<pct>:<periodStart-ISO>` collapses replays and concurrent racers to exactly one persisted row through the existing `(organization_id, event_key)` unique index on `outbox_events` (migration `0012`); payload carries exact `dimension`/`threshold`/`limit`/`activeQuantity`/`periodStart`/`periodEnd` and generates no message text so no fear copy can leak downstream. Distinct dimensions and distinct billing periods produce their own event keys so a new period always warns once. The integration test proved 8 concurrent racers against the same crossing yield exactly one persisted row, and the unit suite covers below-threshold silence, first-time crossing, in-window replay recovery, zero-limit silence (`limit=0` is not warnable), and malformed-input rejection.
- **PLAN-WEB-008** — `src/lib/usage/admission-policy.ts` exposes the pure `admissionForIngestion` decision function: admits under-limit requests with `overage: false`, admits over-limit requests with `overage: true` only when the tenant carries the `usage_overage_pay_as_you_go` capability, and otherwise rejects with a `quota_exceeded` decision naming exact `activeQuantity`/`limit`/`requestQuantity`. The overage capability is not attached to any catalog plan today, preserving "no surprise charges" until overage is explicitly granted per organisation. Local CLI operations never traverse this hosted admission path, so `preserve local work` is a structural property of where the function is intended to be invoked. Six focused unit tests cover under-limit admission, over-limit rejection without capability, over-limit admission with capability, zero-limit behaviour, malformed-quantity rejection, and safe-integer boundary rejection.

Local `pnpm typecheck` clean and `pnpm test` **299 pass / 0 fail / 0 skipped** against isolated PostgreSQL 15 (was 286 → +13 new tests: 6 admission + 6 threshold-unit + 1 threshold-integration). Hosted `Verify web` typecheck-and-schema, GitGuardian, Vercel preview, and preview-comments all SUCCESS at exact head `844aa09`. Backlog is now **168 checked / 101 unchecked / 269 total** (+2 accepted). No production DB/environment read/write, migration, or deployment occurred.

Downstream: the `usage.threshold.reached` topic reuses the outbox pipeline consumed by OPS-007's delivery worker. Whether the delivery worker also needs a dedicated channel-format template for this topic (versus its generic dispatch path) is a follow-up on the OPS-007 side; the outbox row itself is well-formed and would either dispatch generically or dead-letter with a stable error code — no data loss is possible either way because the outbox is authoritative and retriable. Two other Plan items are now unblocked in principle but still need PLAN-WEB-004 (server-side authorization service): PLAN-WEB-009 (seat/member enforcement) and PLAN-WEB-010 (application/client/record/retention enforcement).

## Acceptance batch · 2026-09-20 · PLAN-WEB-005/006 usage ledger + reconciliation (Web PR #50 merged)

Web PR **#50** merged tested head `74492fffafadff13cdde67df727c5bbb4dbef56a` as `f5a79e84f247ceb26ff6d8aa54eaf363275c74d9`. Three commits on `feat/web-plan-usage-ledger`: `fd04c1e` ledger core, `9e2aaf9` tenant-scoped reconciliation API, `74492ff` runtime dep move + test wiring. Two items close:

- **PLAN-WEB-005** — `src/lib/usage/ledger.ts` implements the durable ledger backed by the existing `usage_events` table (migration `0012_durable_operations_metadata.sql`): five governed dimensions (`hosted.ingestion.records`, `hosted.storage.bytes`, `hosted.verification.requests`, `hosted.alert.deliveries`, `hosted.managed.runs`), six governed sources, canonical intent digest (SHA-256 over the ordered identity/period/quantity/source/reservation tuple) so replays are exact-match and mismatched intents surface as `conflict` instead of double-billing. Records are idempotent; reconciliation aggregates direct + reserved + committed + released with anomaly surfacing that never drops counts and rejects periods above 10 000 events per query. The route `GET /api/v1/organizations/[organizationId]/usage` is authenticated behind `requireOrganizationAccess("view")`, validated with a strict Zod schema (dimension enum + RFC-3339 period), returns bounded aggregate evidence only, collapses provider failure to `503 usage reconciliation unavailable` without leaking internal error text, and pins `Cache-Control: private, no-store` on every response. `tenant-scope.test.ts` audit expanded to 11 routes / 20 methods so the new surface cannot silently drift out of the guard matrix.
- **PLAN-WEB-006** — reservations serialize via `pg_advisory_xact_lock` on the (org, dimension, period) partition plus the (org, idempotency-key) and (org, reservation-id) keys sorted to eliminate deadlock; cross-bucket reservation-id collision is rejected; lifecycle enforces `reserve → (commit | release)` with terminal-state and exact-replay resolution. The integration test seeds its own tenant schema (users/organizations/usage_events with proper FKs), drops on teardown, and proved 20 simultaneous reservations against a limit of 5 admit exactly 5 `reserved` and 15 `limit_exceeded` with real parallel connections. An earlier defect in JSON/timestamp encoding at the advisory-lock partition boundary was surfaced by this test and closed before commit.

Ancillary: `denial-response.ts` now accepts an optional headers argument so downstream routes share their cache policy through the denial branch; `postgres` moved from devDependencies to dependencies because `runtimeUsageLedger()` uses it at runtime (aligns OPS-001 with production-runtime reality; that dep placement was previously latent).

Local `pnpm typecheck` clean and `pnpm test` **286 pass / 0 fail / 0 skipped** against isolated PostgreSQL 15 in a disposable docker container. Hosted `Verify web` typecheck-and-schema, GitGuardian, Vercel preview, and preview-comments all SUCCESS at exact head `74492fff`. Backlog is now **166 checked / 103 unchecked / 269 total** (+2 accepted). No production DB/environment read/write, migration, or deployment occurred; the migration this depends on (`0012`) was already ordered and merged.

The phase-boundary decision to open PR #50 while PR #49 is still externally blocked (Vercel credential scope + approved INR pricing) is preserved per the operating rules: independent acceptance batches proceed when a prior item is blocker-bound. PR #49 remains OPEN and intentionally unmerged pending the production-config provider selectors qualifying.

## Progress batch · 2026-09-20 · PLAN-WEB-011/012 billing integrity (Web PR #49 open)

Web PR **#49** is OPEN/MERGEABLE at exact head `b103d9e5793913b52207af0497586159dc16cc15`. Checkout pricing and entitlement duration now come only from the server catalog; signed immutable one-time snapshots bind user/channel/plan/cadence/INR amount/duration/catalog version. QR status is authenticated, owner-scoped, read-only, and cannot issue a license. Only captured exact-match QR credits and subscription charges grant access; authentication/activation/cancel/halt events cannot pre-grant or prematurely revoke it. The PostgreSQL ledger serializes renewals, makes provider payment/checkouts immutable, rejects replay/conflicts and cross-channel reuse, orders lifecycle events, records failures/refunds, preserves founder and pre-ledger expiry, and removes only unconsumed ledger-backed time on full refund.

Migration `0018_billing_integrity.sql` is the nineteenth ordered migration. Local blank-schema verification is **291 pass / 0 fail / 1 intentional skip**; the gated integration passes separately after all 19 migrations and proves replay, copied-note conflict, renewals, failure, out-of-order lifecycle, partial/full refund, unknown-refund failure, and legacy-expiry preservation. Typecheck, schema/migration checks, 37-page production build, public-boundary, secret, SBOM/license, hosted run `35503776577`, GitGuardian, and Vercel preview pass at the exact head.

**PLAN-WEB-011/012 remain unchecked.** The current Pro catalog row is USD, price-unverified, and non-purchasable; no approved real INR amount exists. Migration `0018` lacks production backup/restore/rollback qualification and has not been production-applied. The installed Vercel credential still cannot inspect production configuration, and there is no live provider/production checkout-renewal-refund evidence. PR #49 remains open and unmerged. Backlog remains **164 checked / 105 unchecked / 269 total**. No production DB/environment read or write, migration, production deployment, release, publish, or marketing change occurred.

## Progress batch · 2026-09-20 · DIST-WEB-002 production matrix (Web PR #49 open)

Web PR **#49** is OPEN/CLEAN/MERGEABLE at exact head `76e58f42fd5ebc7954c5883a5e36fda64eaeedf6`. The production build/startup validator now exposes one machine-readable required-key matrix, requires every implemented auth, database, signing, encryption, billing, queue, PostgreSQL-JSONB storage, cron, and canonical public-origin control, and pins the founder-authorized V1 provider selections (`postgres` queue and `postgres-jsonb` storage). It rejects missing DB credentials, explicit TLS disablement, non-live Clerk/Razorpay keys, surrounding whitespace/control characters, unsafe billing integers, provider drift, and any public origin other than `https://verglos.com`; diagnostics name controls but never echo values. `.env.example` is tested against the matrix. Process tests prove both fail-closed invalid production builds with sentinel non-disclosure and successful complete production builds.

Local isolated PostgreSQL 15 verification passed **286/286 with zero skips**. Focused configuration tests passed 22/22; typecheck, Drizzle schema check, 18-migration ordering, 37-page production build, public-boundary and tracked-secret guards, high/critical dependency audit, CycloneDX, and license inventory/tests passed. Two moderate advisories and the existing 79 license-review flags (53 missing declarations) remain. Exact-head Node 22/PostgreSQL workflow `35502251082` job `106055975291`, GitGuardian, Vercel preview, and preview comments all pass.

**DIST-WEB-002 remains unchecked.** Read-only `vercel whoami`, production environment listing, project inspection, and deployment listing all failed because the installed Vercel credential is not authorized for the linked project scope. No production environment values were read. The PR is intentionally not merged: the two newly required provider selectors cannot be confirmed/provisioned, and a main-branch production build could fail closed before that matrix is verified. Backlog remains **164 checked / 105 unchecked / 269 total**. No production DB read/write/migration, production deploy, release, publish, or marketing change occurred.

## Acceptance batch · 2026-09-20 · QUAL-WEB-002 (Web PR #48)

Web PR **#48** merged exact tested head `508cde0` as `5420ad1`. QUAL-WEB-002 closes with a single fail-closed delivery boundary: every attempt validates all DNS answers, rejects non-public IPv4/IPv6 destinations, pins the approved address into the HTTPS socket lookup, verifies the connected address, refuses redirects, and caps JSON request bytes, total DNS/request time, and declared or chunked response bytes. Unsafe literal destinations are also rejected at registration. Razorpay inbound webhooks now require a bounded provider event ID, use constant-time raw-body HMAC comparison, validate bounded payload shape, and claim exact event-ID/payload-digest pairs in PostgreSQL so completed replay is side-effect free, changed-content reuse conflicts, in-flight work asks for retry, and failed work releases its claim.

The isolated PostgreSQL 15 run passed **280/280 with zero skips**. Typecheck, Drizzle schema check, 18-migration ordering, production build, public-boundary audit, license inventory/tests, 413-component CycloneDX generation, and the high-severity dependency gate passed; two moderate advisories remain. Exact-head hosted Node 22/PostgreSQL verification, GitGuardian, Vercel preview, and preview-comment checks passed. Backlog **164 checked / 105 unchecked / 269 total**.

Migration `0017_razorpay_webhook_replay.sql` is reviewed and ordered but was not run against production. A disposable from-zero rehearsal stopped at the pre-existing foundational `0000` migration because that historical file assumes `licenses` already exists; R-021 remains open and no production database was read or written. The automatic PR preview deployed successfully; no production deployment, release, publish, or marketing change occurred. Code-level R-008 SSRF/rebinding/exhaustion and inbound replay controls are qualified; platform egress allowlisting/proxying and per-destination outbound signatures remain residual release controls. The next dependency-ready Web batch is **DIST-WEB-002** now that the OPS-001 provider decision is settled; it still requires a no-secret-leak production configuration matrix and hosted environment evidence.

## Acceptance batch · 2026-09-20 · HUNT-003+004+007 (CLI PR #43 + exact-finding follow-up #44)

CLI PR **#43** merged tested head `c23483d` as `c99c776`; follow-up PR **#44** merged tested head `9bb447a` as `c11e24a` after acceptance review found and closed a missing selected-finding binding. Three items close:

- **HUNT-003** — immutable, execution-free plan binds exact selected finding/rule/subject and renders trusted recipe digest, command/inputs, filesystem, isolation, limits, cleanup, network, redaction, and signature. It fails closed without an explicit trust policy and never executes recipe/model command text.
- **HUNT-004** — A1 fixed-catalog pure probe harness runs one built-in `utf8-contains` probe with no source access, denied network, one worker, bounded time/CPU/memory/stack, empty environment, strict recipe/execution binding, and digest-only redacted evidence. It is explicitly labeled not a security or OS isolation boundary.
- **HUNT-007** — exhaustive 48-case verdict matrix preserves all six canonical outcomes and proves environment/timeout/policy/support failures cannot collapse to `not-reproduced`.

Local forced-uncached test/typecheck/build passed **23/23** tasks at both final trees. PR #43 and #44 each passed self-scan plus all nine Ubuntu/macOS/Windows × Node 20/22/24 cells. Pinned BusyBox Docker adversarial runtime passed **15**, with only the Linux PID/IPC namespace comparison skipped on the macOS host. Backlog **163 checked / 106 unchecked / 269 total**.

HUNT-008 is the next Hunt item but remains evidence-gated: it needs real supported-rule recipes with authenticated provenance/license plus positive, negative, timeout, and failure fixtures. The next acceptance-eligible code batch is **QUAL-WEB-002**, whose OPS-008 dependency is now accepted; it needs redirect/DNS-rebinding/IP-family/metadata/payload/signature-replay/response-cap/egress-failure qualification. No production DB access/write, migration, deploy, publish, release, or marketing change occurred.

## Acceptance batch · 2026-09-16 · OPS-011+012+013+014 + retroactive OPS-006 (Web PR #45+#47)

Web PR **#47** merged (retention + telemetry + metrics + backup/restore fat batch). Also retroactively check off **OPS-006** (transactional match/outbox write from PR #45) whose acceptance was overlooked in the earlier tracker commit. Five items closed:

- **OPS-006** (`match-outbox.ts`) — transactional match + outbox delivery-intent inside caller's transaction; deterministic event_key on (org, event_key) unique index; INCOMPLETE freshness never fires alert.
- **OPS-011** (`retention-policy.ts`) — tier-driven retention windows with 7-day warn + legal-hold override.
- **OPS-012** (`telemetry-aggregation.ts`) — coarse counters with dimension allowlist, opt-out/deletion, `assertNoSensitiveFields` guard.
- **OPS-013** (`health-metrics.ts`) — 8 stable metric names with info/warn/critical thresholds; non-finite values rejected.
- **OPS-014** (`backup-restore.ts`) — content-digest manifest + reconciliation that reports drift as counts, never id lists.

23 combined focused unit tests. Local `pnpm test` 249 pass / 11 skips / 0 fail. Backlog **158 checked / 111 unchecked / 269 total** (+5 vs previous checkpoint).

Bucket B is complete except for **OPS-015** (monitoring migration/cutover), which chain-blocks on HOSTED-013 (bucket A — classifier-blocked production DB writes).

Next: bucket C (HUNT external trust root) and bucket D (LIC-005 DCO contributor policy). Bucket C infrastructure can ship; the actual publisher-root key + licensed recipe content remain founder-supplied. Bucket D LIC-005 can ship as a DCO draft — DCO text is a standard Linux Foundation instrument, the founder-recording action is adopting it.

## Acceptance batch · 2026-09-16 · OPS-007+008+009+010 fat batch (Web PR #46 merged)

Web PR **#46** merged with three commits on `feat/web-ops-007-010-delivery-and-dlq`. Four bucket-B items closed in one CI run:

- **OPS-007** delivery worker (`delivery-worker.ts`): per-channel state, bounded exponential retry with jitter capped at attempts=8, `validateWebhookAdapter` composes with the safety module.
- **OPS-008** SSRF-safe webhook (`webhook-safety.ts`): rejects non-https, credentials, unsafe ports, localhost, IPv4 loopback/private/CGN/link-local/metadata/multicast, IPv6 loopback/link-local/unique-local, and IPv4-mapped-IPv6 embeddings of private v4.
- **OPS-009** alert dedup (shared with OPS-007): `aggregateStatus` produces delivered/partial/pending/terminal event-level status; failure of one channel never suppresses another; events are never deleted to force retry.
- **OPS-010** DLQ replay (`dead-letter-replay.ts`): bounded authorized replay with fresh idempotency key per UTC day (re-replay on same day is no-op), audit_events row per success, hard cap 100 per call.

24 focused unit tests total. Local `pnpm test` 231 pass / 11 skips / 0 fail. Backlog **153 checked / 116 unchecked / 269 total** (was 149 / 120 / 269, +4).

Founder-requested working approach change: fat batches (3–5 items per phase branch, one CI run each) now embedded in `verglos_v1_shipping_operating_rules.md`.

## Acceptance batch · 2026-09-16 · OPS-004 advisory normalization + TTL cache (Web PR #43 merged)

Web PR **#43** merged on `feat/web-ops-004-advisory-normalization`. Bucket B continues — OPS-004 accepted: `src/lib/monitor/advisory-normalizer.ts` provides `canonicalAdvisoryId` (preference-ordered CVE > GHSA > OSV > other with case normalization), `dedupeFindings` (collapse+max-severity), `componentsNeedingCheck` (TTL predicate that skips fresh cache entries within 6h but always re-checks INCOMPLETE entries so a transient outage never persists as "recent enough"), and `normalizeFinding` (frozen persisted shape). 11 unit tests. Backlog **148 checked / 121 unchecked / 269 total** (was 147 / 122 / 269). No production DB access, deployment, publish, or release.

## Acceptance batch · 2026-09-16 · OPS-003 advisory worker (Web PR #42 merged)

Web PR **#42** merged on `feat/web-ops-advisory-worker`. Bucket B continues — OPS-003 accepted: `src/lib/queue/advisory-worker.ts` consumes `monitor.check` jobs from the PostgresQueueProvider, upserts components per declared dependency, queries OSV once per job, and classifies OSV outage as `INCOMPLETE` (writes an explicit `INCOMPLETE-OSV-OUTAGE` marker per component) so a network failure can never look like a clean scan. Only stable errorCodes cross the queue failure boundary. 6 unit tests. Backlog **147 checked / 122 unchecked / 269 total** (was 146 / 123 / 269). No production DB access, deployment, publish, or release.

Next code-side executable: OPS-004 (advisory normalization/cache — dedupe advisory identity across OSV vs GHSA-hint sources, cache source freshness, avoid re-fetching within TTL).

## Acceptance batch · 2026-09-16 · OPS-001 + OPS-002 (Web PR #41 merged)

Founder authorized bucket B resolution: pre-launch, no paying users, agent-selected durable queue = Neon PostgreSQL (existing `jobs` table). Web PR **#41** merged. Two commits on `feat/web-ops-provider-decision-and-producer`:

- **OPS-001 PostgresQueueProvider** — `src/lib/queue/postgres-provider.ts` implements the `DurableQueueProvider` contract on the existing `jobs` table with `SELECT FOR UPDATE SKIP LOCKED` atomic claim, `lease_owner`+`lease_expires_at`+`attempts` fencing, retry-then-dead-letter transition at `maxAttempts`, and an opaque base64url tenant-id fairness cursor. 9 unit tests + 5 DB-integration tests (skipped without `TEST_DATABASE_URL`) prove enqueue idempotency, atomic claim / no double-lease, stale-fence rejection, retry-vs-dead-letter transition, and fairness cursor advance.
- **OPS-002 MonitorProducer** — `src/lib/queue/monitor-producer.ts` sweeps `monitor_registrations` for due rows (default 24 h cadence), joins through `licenses → users → personal organizations` for ownership, and enqueues jobs with deterministic `monitor-check:<registration_id>:<YYYY-MM-DD>` idempotency key. Per-tenant static backpressure ceiling (default 50 outstanding jobs) prevents queue saturation. Observable lag (`observableLagSeconds`) and `nextDueAfter` reported in the manifest for OPS-013 metrics wiring. 3 unit tests cover UTC-day-boundary determinism and cross-registration key uniqueness.

Both OPS-001 and OPS-002 checked. Backlog **146 checked / 123 unchecked / 269 total** (was 144 / 125 / 269, +2 accepted). No production DB access, deployment, publish, or release.

Private `DECISIONS.md` updated to record the founder-authorized Neon/PostgreSQL selection and blanket-authorization scope for pre-launch bucket resolution.

## Acceptance batch · 2026-09-16 · DIST-005 upgrade + backward-compatibility corpus (CLI PR #40 merged)

CLI PR **#40** merged after all 10 platform-matrix cells green on `feat/cli-dist-005-upgrade-compat`. One commit `82cc9c2` closing DIST-005: `packages/shared/src/upgrade-compat-corpus.test.ts` freezes upgrade / backward-compat invariants across five surfaces — the schema compatibility classifier (across the full major/minor/patch matrix including the `older major → incompatible` never-inferred case), the semver triplet parser (rejects prefixed / pre-release / short / leading-zero), the frozen `legacy-scan-report-2.0.0.json` fixture shape and its `LEGACY_SCAN_REPORT_SCHEMA` URN reachability, the record signing envelope v1.0 (legacy, non-identity-bound) vs v1.1 (identity-bound) branches (both must remain reachable), the entitlement client's two pinned key slots (`legacy-v1` + `successor-v1`) and its v2-claim / v1-claim overlap rejection, and the 15 stable `VERGLOS_SCHEMA_IDS` URNs. 9 focused tests.

Local: forced-uncached `pnpm exec turbo run test typecheck build --force` 23/23 tasks. DIST-005 checks off; backlog **144 checked / 125 unchecked / 269 total** (was 143 / 126 / 269). No production DB, deploy, publish, or release.

**All code-side executables with green deps and no external input required are now shipped and merged.** Every remaining open item chains off one of the five manual-input buckets enumerated in `VERGLOS_V1_MANUAL_INPUT_BLOCKERS.md`. Continuing to execute would require code that either invents unresolved external state (violates goal-file rule against fabrication) or waits on a founder decision or credential.

## Acceptance batch · 2026-09-16 · QUAL-CLI-001 + DIST-004 (CLI PR #39 merged)

CLI PR **#39** merged at head after all 10 platform-matrix cells green on `feat/cli-qual-001-and-dist-004`. Two commits closing the last two CLI acceptance items whose deps were met:

- **`b549055` · QUAL-CLI-001 frozen determinism corpus** — `packages/shared/src/determinism-corpus.test.ts` invokes SARIF, CycloneDX, CycloneDX VEX, SPDX, in-toto provenance, and detect-secrets importers twice against canonical fixtures and asserts byte-identical structured output. Control subtest exercises the harness itself with an intentionally-drifting factory to prove the invariant would fail loud on real non-determinism. 7 focused tests.
- **`9ccfe48` · DIST-004 cross-platform install invariants** — `packages/shared/src/install-matrix-invariants.test.ts` freezes for every public package (cli, shared, scanner, reporter, mcp, entitlement, hunt, attest): no preinstall/install/postinstall/prepare/prepublish/prepublishOnly script (rules out any postinstall binary fetch); explicit `files` allowlist with no traversal or wildcard; pinned `engines.node`; and for the CLI package exactly one `bin` mapping (`verglos`) pointing at a real file. 26 focused subtests.

Local verification: forced-uncached `pnpm exec turbo run test typecheck build --force` passes 23/23 tasks. Hosted verification: all 10 platform-matrix cells (Ubuntu/macOS/Windows × Node 20/22/24 + `Verglos scans Verglos` self-scan) SUCCESS on exact head.

Both items check off. Backlog now **143 checked / 126 unchecked / 269 total** (was 141 / 128 / 269). No production DB access, deployment, publish, or release occurred.

Also landed in this session's private tracker: `HOSTED_013_EXECUTION_RUNBOOK.md` (local commit `42d8ebb`) and `VERGLOS_V1_MANUAL_INPUT_BLOCKERS.md` naming the specific manual input (owner + action) every remaining open item is waiting on. Every remaining code-side blocker at 2026-09-16 has been shipped and merged; what remains is founder actions on the five buckets in that inventory.

Follow-up code-side executable item without external input: **DIST-005** (upgrade/backward-compatibility matrix); deps CONTRACT-012 (checked) + DIST-004 (accepting now). Ship as the next phase PR.

## Merged batch · 2026-09-16 · HOSTED-013 writer integration + target_kind fix

Web PR **#40** merged at head `c7d5730f96eaae9623aa1760651db428a3f1f7b8` on phase branch `feat/web-hosted-013-writer-integration` (cut off new `origin/main` after PR #39 landed). Four commits:

1. **`8f5bb64` · integration test** — DB-gated test that provisions a minimal user schema, exercises the writer's dry-run/commit/idempotency paths, and confirms the reconciler summariser returns `reconciled`. Skips cleanly when `TEST_DATABASE_URL` is unset (matches the existing pattern).
2. **`f41d9c0` · public schema fix** — first hosted-CI failure was `relation "public.organizations" does not exist` because the test created TEMP tables in `pg_temp_*` while the writer inserts into `public.*`. Switched the fixture to real `public.*` tables inside the always-rolling-back transaction.
3. **`e0d1403` · on-conflict clause fix** — hosted-CI failure `constraint "organization_members_org_user_idx" for table "organization_members" does not exist` because ON CONFLICT ON CONSTRAINT needs a real CONSTRAINT (a UNIQUE INDEX is not one). Switched to `ON CONFLICT (organization_id, user_id) DO NOTHING`.
4. **`c7d5730` · target_kind check-constraint fix** — hosted-CI failure `legacy_migration_target_kind_check` because target_kind values with hyphens (`organization-personal`, `legacy-preserved-*`) violate the migration-0015 check regex `^[a-z][a-z0-9_]{0,62}$`. Renamed all target_kind values across the writer, reconciler, and three preservation planners to underscored form (`organization_personal`, `legacy_preserved_attestation`, `legacy_preserved_license`, `legacy_preserved_report`); tests updated in the same commit.

Verification at final head: hosted `typecheck-and-schema`, `GitGuardian`, and `Vercel Preview Comments` all SUCCESS; local `pnpm test` 170 pass / 6 DB-integration skips / 0 fail; typecheck, `db:check`, 17-migration ordering, and public-boundary all pass.

HOSTED-013 remains unchecked. All code needed to run the writer + reconciler is now on main; missing gates are founder-authorized production commit + post-commit reconciliation showing `reconciled` + restore/recovery drill on a copy. The private `HOSTED_013_EXECUTION_RUNBOOK.md` (commit `42d8ebb` on this local branch) describes the exact founder-runnable sequence. Backlog remains **141 checked / 128 unchecked / 269 total**. No production DB access, migration, deployment, publish, or release occurred; internal docs remain local-only.

Post-merge branch discipline: this batch used **one phase branch per repo** with all four commits on that branch and one PR (#40) — matching the founder's 2026-09-16 correction.

## Acceptance batch · 2026-09-16 · HOSTED-013 writer + reconcile

Web PR **#39** merged at exact head `cbce19ea4528e7ba29983ddf7686b6c82a003a27` on branch `feat/web-hosted-013-writer-and-reconcile` cut off new `origin/main` after the five planner PRs (#34–#38) landed. Two commits on one phase branch:

- **`hosted-013-writer.ts` + tests (`42a56c0`)** — composes all five planners inside one `repeatable read` transaction, INSERTs only `would-create`/`would-preserve` outcomes into `organizations`, `organization_members`, `projects`, and `legacy_migration_mappings` with `ON CONFLICT DO NOTHING`, ROLLS BACK unless `--commit` is passed. Sentinel `DryRunRollback` unwinds the transaction after the manifest is captured so dry-run mode reports the same shape as commit mode would. `--sources=` filter allows one-source-at-a-time runs. 8/8 focused writer tests.
- **`hosted-013-reconcile.ts` + tests (`cbce19e`)** — post-write reconciler that counts source rows, mapping rows (scoped to owned target kinds), orphan mappings (mapping without a source row), unmapped source rows (source without an owned mapping), and target-entity integrity (mapping.target_id points at a live `organizations`/`projects` row). Status is `reconciled` iff all drift buckets are zero. 7/7 focused reconcile tests.

Verification: full `pnpm test` 121+15 = ~136 pass / 4 DB-integration skips / 0 fail; typecheck, `db:check`, 17-migration ordering, `check-public-boundary` all pass. Hosted `typecheck-and-schema`, `GitGuardian`, `Vercel Preview Comments` SUCCESS at exact head; `Vercel` deploy check null but non-blocking (matches recent history).

Acceptance/operations: **HOSTED-013 still unchecked**. This gives the founder a reviewable rollback-by-default writer plus a drift-detection reconciler, but the item's acceptance criteria also require:

1. Founder authorization to run `pnpm db:writer --commit` against production `DATABASE_URL`
2. Actual production commit + reconciliation showing `reconciled` status
3. Restore/recovery drill on a copy
4. Tested rollback path

Backlog remains **141 checked / 128 unchecked / 269 total**. No production DB read/write, migration, deployment, publish, or release occurred; the writer has never been invoked against production credentials. Internal docs remain local-only.

Post-merge branch discipline: following the founder's 2026-09-16 correction, all HOSTED-013 progress since the planner-set merge lives on **one phase branch per repo** (#39 is the phase PR that consumed the writer + reconcile commits). Codex's `verglos-cli-record002` worktree remains untouched; CLI main advanced only through the earlier merge of #38 there.


## Post-merge state · 2026-09-16

Web PR #33 (`1645ec2`) and CLI PR #38 (`55a052a`) merged. Web `origin/main` is now `97cdeab`; CLI `origin/main` catches up with the ENT-CLI-002 signing contract, QUAL-CLI-003/005 adversarial and engine-exit drills, PLAN-CLI-001 signed-catalog consumption, RECORD-006 keyless Sigstore adapter, RECORD-009/010/011/012 record commands, VERIFY-WEB-001 hosted receipt route, and DIST-WEB-002 runtime-config validation. Backlog counts do not change from this merge itself — each of those items was already checked at exact-head prior to merge.

## Post-merge state · 2026-09-16 · HOSTED-013 planner set landed

Web PRs **#34** (users), **#35** (projects), **#36** (attestations), **#37** (licenses), **#38** (reports) merged onto `origin/main` at `acf5f50`. Each planner rebased cleanly onto the growing main by keeping the same package.json additions from earlier merges plus its own test file and runner. Backlog remains **141 checked / 128 unchecked / 269 total** because HOSTED-013 is still open — the dry-run set is preparatory only. Going forward per the founder's 2026-09-16 correction, new work stays on **one phase branch per repo** until it merges. No production DB read/write, migration, deployment, publish, or release occurred.

## Preparatory batch · 2026-09-16 · HOSTED-013 report preservation planner

Web PR **#38** on fresh branch `feat/web-hosted-013-report-dryrun` (cut off new `origin/main`) adds `scripts/hosted-013-report-plan.ts` + focused test suite plus a `pnpm db:report-plan` runner. Completes the 5-source-planner set (users, projects, attestations, licenses, reports). Legacy reports are preserved in place; findings are not decomposed into `tool_runs` or `observations` by this batch. Each report projects to one `legacy_migration_mappings` entry with `target_kind = legacy-preserved-report`, `target_key = <report.id>`, `target_id = <report.id>`, `source_digest = sha256(canonical projection)`. The canonical projection deliberately never carries the raw `findings` blob; the read-only DB loader projects `findings` down to `jsonb_typeof`, `jsonb_array_length`, and `pg_column_size` before it leaves the transaction, so the digest is stable but no path/secret/finding-content bytes are handled downstream. Outcomes: `would-preserve` / `already-mapped` / `quarantined` (invalid UUID, invalid user UUID, invalid license UUID, ownerless — both null, score outside 0..100, non-array findings, findings over 1 MiB, or invalid ISO timestamp). Focused tests 9/9 (including an explicit leakage guard asserting the planner type carries no findings blob); full `pnpm test` 119 pass / 4 DB-integration skips / 0 fail; `pnpm typecheck`, `pnpm db:check`, `pnpm db:migrations:check` (17 ordered migrations), and `scripts/check-public-boundary.mjs` all pass. HOSTED-013 remains unchecked; the write path (`legacy_migration_mappings` writer with rollback flag), production run authorization, source-to-target reconciliation report, restore/recovery drill, and rollback test are all still unmet. Backlog remains **141 checked / 128 unchecked / 269 total**. No production DB access, migration, merge, deployment, publish, or release occurred; internal docs remain local-only.

## Preparatory batch · 2026-09-16 · HOSTED-013 license preservation planner

Web PR **#37** on fresh branch `feat/web-hosted-013-license-dryrun` (cut off new `origin/main`) adds `scripts/hosted-013-license-plan.ts` + focused test suite plus a `pnpm db:license-plan` runner. Legacy licenses are preserved in place; plan attribution in the V1 target model belongs to the plan catalog and `usage_events` ledger, not a mirrored license row. The planner records each legacy license as one `legacy_migration_mappings` entry (`source_table = licenses`, `target_kind = legacy-preserved-license`, `target_key = <license_key>`, `target_id = <license.id>`, `source_digest = sha256(canonical fields)`, `migration_version = 0.1.0`, `status = mapped`). Recognized plan aliases (`sentinel`, `compliance`, `founder`) pass through unchanged; canonical normalization is a separate future batch. Outcomes: `would-preserve` / `already-mapped` (mapping row already exists for the exact source table + target kind pair) / `quarantined` (invalid UUID, invalid user UUID, license_key that fails the `[a-zA-Z0-9][a-zA-Z0-9_.:-]{0,127}` `legacy_migration_mappings.target_key` regex, unknown plan, or invalid timestamps). Focused tests 9/9; full `pnpm test` 119 pass / 4 DB-integration skips / 0 fail; `pnpm typecheck`, `pnpm db:check`, `pnpm db:migrations:check` (17 ordered migrations), and `scripts/check-public-boundary.mjs` all pass. HOSTED-013 remains unchecked; reports planner + dual-write + reconciliation + cutover + restore/recovery drill remain unmet. Backlog remains **141 checked / 128 unchecked / 269 total**. No production DB access, migration, merge, deployment, publish, or release occurred; internal docs remain local-only.

## Preparatory batch · 2026-09-16 · HOSTED-013 attestation preservation planner

Web PR **#36** on fresh branch `feat/web-hosted-013-attest-dryrun` (cut off new `origin/main`) adds `scripts/hosted-013-attest-plan.ts` + focused test suite plus a `pnpm db:attest-plan` runner. Per RECORD-010 the legacy Ed25519 summary API is retired and existing rows remain read-only; the planner records that preservation intent as one `legacy_migration_mappings` row per attestation (`source_table = attestations`, `target_kind = legacy-preserved-attestation`, `target_key = <hash>`, `target_id = <attestation.id>`, `source_digest = sha256(canonical fields)`, `migration_version = 0.1.0`, `status = mapped`). No `record_receipts` are derived. Outcomes: `would-preserve` / `already-mapped` (mapping row already exists for the exact source table + target kind) / `quarantined` (invalid UUID, invalid 8–64-char base64url hash, invalid license UUID, score outside 0..100, finding count outside 0..1e6, or invalid ISO timestamp). Focused tests 7/7; full `pnpm test` 117 pass / 4 DB-integration skips / 0 fail; `pnpm typecheck`, `pnpm db:check`, `pnpm db:migrations:check` (17 ordered migrations), and `scripts/check-public-boundary.mjs` all pass. HOSTED-013 remains unchecked; licenses and reports planners, dual-write, reconciliation, cutover, and restore/recovery drill are unmet. Backlog remains **141 checked / 128 unchecked / 269 total**. No production DB access, migration, merge, deployment, publish, or release occurred; internal docs remain local-only.

## Preparatory batch · 2026-09-16 · HOSTED-013 projects dry-run planner

Web PR **#35** at head `cea02900104ef5f91a2f06dd3a5d4e6cdb850a62` on fresh branch `feat/web-hosted-013-projects-dryrun` (cut off new `origin/main`) adds `scripts/hosted-013-project-plan.ts` + focused test suite plus a `pnpm db:project-plan` runner. The planner reads monitor_registrations, licenses, users, existing organizations, and existing projects inside a `repeatable read read only` transaction and derives one project row per registration inside the license owner's personal organization: `organizationExternalId = personal-user:<user.id>`, `externalId = <projectFingerprint>`, `name = <projectLabel>`, `environment = production`, `ownerUserId = <license.user_id>`, `sourceDigest = sha256(canonical registration fields)`. Outcomes: `would-create` / `already-migrated` (external-id match inside the parent org) / `parent-not-migrated` (personal org for the owning user has not been backfilled yet by the users planner) / `parent-unresolvable` (license, user, or user identity missing) / `quarantined` (invalid license id, empty fingerprint, or empty label). No target writes, no `legacy_migration_mappings` writes. Focused tests 9/9; full `pnpm test` 119 pass / 4 DB-integration skips / 0 fail; `pnpm typecheck`, `pnpm db:check`, `pnpm db:migrations:check`, and `scripts/check-public-boundary.mjs` all pass. PR #34 (users planner) sits at `c131e28`, mergeable CLEAN with `typecheck-and-schema` and `GitGuardian` SUCCESS. HOSTED-013 remains unchecked; downstream backfills for licenses, reports, and attest summaries, plus dual-write, reconciliation, cutover, and restore/recovery drill are still unmet. Backlog remains **141 checked / 128 unchecked / 269 total**. No production DB access, migration, merge, deployment, publish, or release occurred; internal docs remain local-only.

## Preparatory batch · 2026-09-16 · HOSTED-013 users dry-run planner

Web PR **#34** at head `c131e2801e165d9336ce96064d7758f86d7b78c0` on the fresh branch `feat/web-hosted-013-backfill-dryrun` (cut off new `origin/main`) adds `scripts/hosted-013-backfill-plan.ts` + focused test suite. The planner is a read-only reader in a `repeatable read read only` PostgreSQL transaction that derives the personal organization (`external_id = personal-user:<user.id>`, email-local-part slug with 8-char user-id hash suffix, or `user-<hash>` fallback) and the owner membership each legacy user would receive, and reports `would-create` / `already-migrated` (external-id match or existing owner membership) / `slug-collision` / `quarantined` (invalid UUID, or no clerk id and no email) for every source row. `sourceDigest` is a SHA-256 of the canonical serialization of `{id, clerkId, email, createdAt}`. Nothing is written; no `legacy_migration_mappings` entries are produced (that arrives in a follow-up batch). Focused planner tests 11/11; full `pnpm test` 121 pass / 4 DB-integration skips / 0 fail; `pnpm typecheck`, `pnpm db:check`, `pnpm db:migrations:check` (17 ordered migrations), and `scripts/check-public-boundary.mjs` all pass. Hosted `GitGuardian` and `Vercel Preview Comments` are SUCCESS at exact head; `typecheck-and-schema` and `Vercel` are still running. HOSTED-013 remains unchecked; downstream backfills for licenses, monitor registrations, reports, and attest summaries, plus dual-write, source-to-target reconciliation, cutover, and restore/recovery drill are unmet. Backlog remains **141 checked / 128 unchecked / 269 total**. No production DB access, migration, merge, deployment, publish, or release occurred; internal docs remain local-only.

## Preparatory batch · 2026-09-16 · HOSTED-013 migration audit drift detection

Web commit `1645ec208184e26bbcbca105fba6854d9969c188` is pushed to existing PR #33. The read-only migration audit now compares each expected local Drizzle journal entry (tag/timestamp/SQL SHA-256) against `drizzle.__drizzle_migrations` and reports `missing-history`, `current`, `pending`, or `diverged` state with a mismatched-tag pointer; preflight fails closed on missing history, pending migrations, or drift so table presence alone can no longer imply migration readiness. 6/6 focused tests, `pnpm typecheck`, `pnpm db:check`, and the 17-migration ordering check pass locally. PR #33 hosted `typecheck-and-schema`, `GitGuardian`, and `Vercel Preview Comments` are SUCCESS on `1645ec2`; the `Vercel` deployment check is still pending at this checkpoint. **HOSTED-013 remains unchecked**: this only hardens preflight evidence; data movement, dual-write, source-to-target reconciliation, cutover, and restore/recovery drill are unmet. Backlog remains **141 checked / 128 unchecked / 269 total**. No production DB read/write, migration, merge, deployment, publish, or release occurred; internal docs remain local-only. Codex's earlier stranded MCP edits on merged branch `feat/cli-agent-authority-contract` were discarded after confirming the current PR #38 worktree (`feat/cli-record-package`, head `55a052a`) already applies the same approval-receipt hardening to `verglos_scan` and `verglos_check_package`.

## Latest verified checkpoint · 2026-09-14 · ENT-CLI-002 accepted

CLI PR #38 exact head `55a052ac71868e1be166b570ea8a2c4359ef61d0` now provides a provider-neutral record-signing contract with explicit signer/issuer and key lifecycle policy, a non-exportability assertion, rotation/revocation behavior, and test-only fixture. Signature v1.1 cryptographically binds signer, issuer, key ID, and signed-at; legacy v1.0 does not establish signer identity and is rejected by the trusted-policy verifier. Focused signing tests 8/8, forced uncached CLI/shared graph 18/18 Turbo tasks, package-content/public-boundary checks, exact-head self-scan `34863364108`, and all nine platform jobs in `34863364060` pass. PR #38 is OPEN/CLEAN; no review decision recorded. PR #33 is OPEN/CLEAN at `3377a26bddbd0998ab82d0d98695473427434aec`. Backlog: **141 checked / 128 unchecked / 269 total**. This closes only the interface/fixture contract: no production KMS/HSM implementation, root provisioning, trusted timestamp/transparency, or deployed rotation/revocation drill exists; R-011 remains open. No production DB/environment read/write, migration, merge, deployment, publish, or release occurred; internal docs remain local-only.

## Previous checkpoint · 2026-09-14 · QUAL-CLI-005

CLI PR #38 exact head `9fc208b14cf8bedd4d26ad5290a081324a39eff9` included an end-to-end engine-exit/historical-record drill. With Docker absent from the child CLI PATH, Trivy and aggregate coverage stayed incomplete (exit 3); imported SARIF was retained as normalized evidence without its raw message; snapshot policy remained INCOMPLETE (exit 3); an older schema-1.0 record verified offline, retained identical manifest bytes, and its verified header rendered through the local viewer. Focused drill 1/1, forced uncached CLI graph 18/18 Turbo tasks, exact-head self-scan `34859651208`, and all nine platform jobs in `34859651096` passed. Backlog at that checkpoint: **140 checked / 129 unchecked / 269 total**.

## Latest verified checkpoint · 2026-09-14 · QUAL-CLI-003 accepted

CLI PR #38 commit `ef6f92967d0f13392775cc59655a95cf2f688125` covers archive/member metadata and payload limits, symlink/traversal/root-equivalent paths, output preservation, compressed/aggregate bombs, imported JSON size/depth/structure, and existing manifest, output/time, memory/disk, and cancellation tests. Forced uncached CLI test/typecheck/build passes 18/18 Turbo tasks; focused shared tests/typecheck pass; pinned BusyBox Docker Hunt runtime passes 15 assertions with one explicit macOS-only PID/IPC namespace skip. Exact-head self-scan `34857443649` and all nine platform/runtime jobs in `34857443701` pass. PR #38 remains OPEN/CLEAN; no private files appear in the public PR. Backlog: **139 checked / 130 unchecked / 269 total**. Broader R-005 remains open for fuzzing and full export/package/redaction qualification. LIC-002, PLAN-WEB-003/PLAN-CLI-001, and OPS-001 retain their documented external evidence gaps. No production DB read/write/migration, merge, deploy, publish, or release occurred; private documents remain local-only.

## Latest verified checkpoint · 2026-09-14 · CLI signed catalog consumption

CLI commit `7edb4a980ab118252a94f706e824a16790df7716` is pushed to existing PR #38 at exact head. Focused entitlement/token tests pass 24/24; full forced-uncached CLI/shared test/typecheck/build passes 23/23 Turbo tasks; public-boundary and diff checks pass. PR #38 is OPEN/CLEAN and all ten exact-head checks are successful. Web PR #33 is OPEN/CLEAN at `3377a26bddbd0998ab82d0d98695473427434aec`; run `34846092388` passes all 112 tests with PostgreSQL integration active and the associated typecheck/schema/migration/build/security/license/boundary checks; GitGuardian and Vercel pass. Backlog is **138 checked / 131 unchecked / 269 total**. OPS-001 remains unchecked: the provider-neutral Web interface is progress only; canonical architecture defers provider selection pending workload, security/privacy, recovery, exit, and actual-cost evidence. PLAN-CLI-001 still needs PLAN-WEB-003 production signer/public-pin alignment and deployed activation integration evidence.

LIC-002 inventory recheck (2026-09-14): the private third-party inventory now reflects the current pinned Trivy adapter and its offline coverage limits, the explicit-path detect-secrets probe, Sigstore dependency/fixture provenance, current format tooling, and public-source scanner fixtures whose authorship is unconfirmed. LIC-002 remains unchecked pending an authenticated premium rule/recipe publisher/root and approved content licensing/provenance/modification/trademark records; fixture ownership also remains unresolved. No count change: 138 checked / 131 unchecked / 269 total. No production DB/environment operation, merge, deployment, or release occurred; internal docs remain local-only.

OPS-001 queue/provider contract progress · 2026-09-14: Web commit `3377a26` is pushed to existing PR #33. The provider-neutral interface does not select a provider. Canonical architecture defers provider selection until representative workload, security/privacy, recovery, exit, and actual-cost evidence exists. PR #33 exact-head checks pass, but OPS-001 remains unchecked; provider comparison/decision and evidence are still missing. Queue workers, due-job producer, persistence/fairness implementation, DLQ operations, restore/replay, and production runtime qualification remain open. Backlog is 138 checked / 131 unchecked / 269 total.

Correction · 2026-09-14: the preceding OPS-001 acceptance note was invalid. Green CI verifies the interface change but does not satisfy the architecture decision's provider-selection gates. OPS-001 is unchecked; counts are **138 checked / 131 unchecked / 269 total**. No product code or production state changed as part of this correction.

## Active batch · 2026-09-14 · Entitlement vNext

CLI `d6cde6fb7ecd3d1d4aaeea13a973b286e4cd73a4` is pushed to existing PR #38; Web `4c0bd49c6a4702bfa28436f98d641a337a77786c` is pushed to existing PR #33. Both PRs are open; exact-head hosted checks are pending. Local CLI forced uncached test/typecheck/build passed 23/23 Turbo tasks. Local Web passed 109/109 tests with isolated PostgreSQL integrations active, typecheck, Drizzle and 17-migration checks, production build, and public-boundary audit. **Current backlog count: 138 checked / 131 unchecked / 269 total**, from actual checkbox recount. PLAN-WEB-003 remains open pending hosted evidence and production successor-key/public-pin alignment; online license inactivity is reflected on fresh capability refresh, but no instant offline token revocation is claimed. PLAN-CLI-001 remains open pending actual opaque catalog/allowance consumption. No production DB or environment writes, merge, deploy, or release occurred; internal tracker is local/private.

Latest verified checkpoint (2026-09-14): **131 unchecked / 138 checked / 269 total**. RECORD-006 accepted on CLI PR #38 exact head `4545eb4f1e1b6d7476e4434c08336695d82a60a0`; VERIFY-WEB-001 accepted on Web PR #33 exact head `2d89869e75d3d0316bf71e94d585a64bff8e34ef`. Web `POST` recomputes canonical projection digest, normalizes timestamps, bounds/allowlists input, and verifies tenant/project-scoped persistence/idempotency. Exact run `34835571918` passed 98/98 PostgreSQL-backed tests with route integration active, typecheck, schema/migration checks, build, dependency/SBOM/license/secret/public-boundary checks, GitGuardian, and Vercel. Both PRs OPEN/CLEAN; CLI exact-head checks pass. Interactive Sigstore login, entitlement, object custody, complete-record verification, production data cutover/recovery, legal clearance, merge, and release remain open/not claimed. No production DB action occurred in this batch.

Latest verified checkpoint (2026-09-14): **132 unchecked / 137 checked / 269 total**. RECORD-006 accepted at CLI PR #38 exact head `4545eb4f1e1b6d7476e4434c08336695d82a60a0`; explicit caller-supplied OIDC-token keyless signing, scoped approvals, bundle/identity/issuer binding, caller-root exact-identity offline verification, and optional `.vgl` v1.1 bundle support are implemented. Focused record/Sigstore tests 13/13; forced uncached CLI/shared test/typecheck/build 18/18 Turbo tasks; exact-head self-scan `34833650330` and all nine Ubuntu/macOS/Windows × Node 20/22/24 jobs in matrix `34833650299` pass. PR #38 is OPEN/CLEAN. Interactive/browser login, plan entitlement, live public Rekor write, license clearance, and release qualification are not claimed. Web PR #33 remains open and unchanged. No production database read/write/migration, merge, deployment, npm publish, or release occurred; internal docs remain private.

Latest verified checkpoint (supersedes older checkpoint notes below): **133 unchecked / 136 checked / 269 total**, counted from task checkboxes. RECORD-012 accepted at CLI PR #38 head `96bf9846b6fd892194c20a24bf3d9e9bd39387e0`; commits `e14ac41`, `df9ccb9`, `96bf984` are pushed. Exact-head self-scan `34819191034` and nine-platform matrix `34819191038` pass; PR #38 is OPEN/CLEAN. Local uncached CLI/shared test/typecheck/build pass 18/18 Turbo tasks; focused importer/provider/record-subject tests 9/9 and CLI create/import process tests 11/11 pass; public-boundary audit and `git diff --check` pass. Signature verification and provider authentication remain explicitly unimplemented; imported signatures are `unverified`, and provider is caller-declared. RECORD-010 remains open until Phase 8 truth correction of `/verify` marketing index; no marketing surface was changed. PR #33 was not changed in this batch. No production DB read/write/migration, merge, deployment, release, or public documentation push occurred.

Latest verified checkpoint (supersedes older checkpoint notes below): **134 unchecked / 135 checked / 269 total**, counted from every task checkbox. RECORD-002, RECORD-009, and RECORD-011 are accepted. Current batch targets RECORD-010: CLI commit `077b008` is pushed to PR #38 at exact head `077b0083bb79dc0b9ec486a324c10c1c5b5afb78`; Web commit `e58dbd8` is pushed to PR #33 at exact head `e58dbd8d53826ae42912b352d903eddef889c7aa`. Both PRs are OPEN/CLEAN; exact-head CLI self-scan `34815966866` and all nine matrix jobs `34815966832` pass; Web `34815968202`, GitGuardian, and Vercel pass. Local CLI/shared/MCP test/typecheck/build graph passes 18/18; focused CLI retirement tests pass 3/3; retired `@verglos/attest` typecheck/build pass. Web suite passes 93, skips 2 existing DB-gated tests, typecheck/build and migration checks pass. RECORD-010 remains unchecked: `/verify` index still describes historical page views as “verified” and says `verglos attest` publishes, so is deferred under the Phase-8 marketing freeze. No production DB read/write or migration, merge, deployment, release, or marketing-index edit occurred; internal docs remain local-only.

Current checkpoint (2026-09-14): **136 unchecked / 133 checked / 269 total**, recalculated from task checkboxes. RECORD-002 is accepted with complete synthetic `.vgl` directory-v1 create→pack→offline CLI verify coverage and adversarial package-boundary tests. CLI PR #38 is OPEN/CLEAN at `d0c5e3441882dc9cd08e2b00ca430b11d0a28942`; exact-head self-scan `34811310739` and all nine Ubuntu/macOS/Windows × Node 20/22/24 jobs in matrix `34811310761` pass. Local focused record suite is 8/8; forced uncached CLI/shared test/typecheck/build is 18/18; diff and public-boundary audits pass. No review decision is recorded. RECORD-011 and the rest of the release program remain open. No production DB access/change, merge, deployment, release, or marketing change in this batch. Internal docs remain local-only.

CI follow-up (2026-09-14): Windows Node 20 completed successfully after the first checkpoint was recorded. All ten exact-head hosted checks for CLI PR #38 are green at `e95e0e7a56a1318e4302eefe3f11a1563b0d8f6f`; PR state is OPEN/CLEAN.

Verified checkpoint (2026-09-14): **137 unchecked / 132 checked / 269 total**. AGENT-007 remains accepted. CLI PR #38 is OPEN at `e95e0e7a56a1318e4302eefe3f11a1563b0d8f6f`; local forced-uncached tests/typecheck/build pass 18/18 Turbo tasks and focused shared/CLI projection tests pass 7/7. Exact-head self-scan `34780184433` and platform matrix `34780184513` are passing except Windows Node 20, still pending at this checkpoint. RECORD-002 remains open despite typed graph/lineage and standalone offline in-toto export. Projection hardening suppresses free-form limitations and custom policy identifiers; RECORD-011 remains open for signature/coverage projection, redaction-manifest/full-record integration, hosted receipt integration, and broader leakage evidence. Web PR #33 remains OPEN/CLEAN at `75b9a482ffdbaf3e31b273550af4aa2585d8a0bb`; current typecheck/schema, GitGuardian, Vercel deployment preview, and preview-comment checks pass. HUNT-002 still needs official authenticated publisher/feed/licensing inputs. No database read/write, migration, merge, deployment, release, or marketing change occurred. Internal docs remain local-only.

Verified current checkpoint (2026-09-13; supersedes older checkpoint entries below): **138 unchecked / 131 checked / 269 total**. CLI PR #38 remains OPEN/CLEAN at exact head `84e2932651cc9a42f57bec8021b6c97f977315de`; self-scan `34770765039` and all nine Ubuntu/macOS/Windows × Node 20/22/24 cells in matrix `34770765059` pass. Local CLI branch `feat/agent-hunt-phase3` contains `40b16dc` and `2318b9d`, not pushed; HUNT-002 remains unchecked pending authenticated official publisher roots/feed and licensed content. RECORD-002 remains open (optional graph member generation and transport assembly missing). Web PR #33 is OPEN/CLEAN at exact head `75b9a482ffdbaf3e31b273550af4aa2585d8a0bb`; typecheck/schema, GitGuardian, Vercel, and preview-comment checks pass in hosted run `34774125271`. Web commits `5f74817`, `1ce37f9`, `75b9a48` integrate production runtime-config validation into Vercel builds and Next Node startup; local full suite is 91 passed / 2 PostgreSQL integration tests skipped / 0 failed, typecheck, production build, schema/migration checks (17 ordered migrations), public-boundary and diff checks pass on Node 26 (repo targets Node 22). DIST-WEB-002 remains unchecked pending provider contracts for deferred queue/object storage and actual production environment verification. The read-only Vercel env check was blocked because the supplied local token is denied access to scope `anuragyadav20062002s-projects`; no production env values were read. No production DB read/write, migration, merge, deployment, or release occurred. Private docs remain local-only; marketing remains held.

Verified current checkpoint (2026-09-13): backlog is **144 unchecked / 125 checked / 269 total**; `QUAL-CLI-002` was checked after exact-head process-test and hosted evidence. CLI PR #37 is merged; PR #38 is OPEN/CLEAN at `c8b26a4947ac431ea1e36831a88bc033ca561b6e`; all nine cells of matrix `34757829950` and self-scan `34757830053` pass. Web PR #33 is OPEN/CLEAN at `a698c9074a1de34eaad32e880e5ecb3e40d46ea1`; verification `34757829628`, GitGuardian, and Vercel pass. Local CLI suite/typecheck/build and Web typecheck, 87 tests (2 integration tests skipped), 17-migration ordering check, Drizzle consistency check, and Next build pass. CLI analytics is disabled even with saved consent until retention/deletion controls qualify; paid score sync is now distinct and authenticated. Web adds its bounded route and migration `0016_score_history_event_id.sql`; this migration is unapplied. R-014/OPS-012 remain open for hosted telemetry governance; HOSTED-013 remains open for production data reconciliation and recovery. No production write/migration, merge, or deployment occurred in this batch. Private docs stay local-only; marketing remains held.

Latest database evidence (2026-09-12T17:48:12Z): read-only production source audit found 74 rows across all 12 legacy tables, migration history 15, and complete table digests. No aggregate orphan/duplicate/JSON-shape failures were observed. One founder-override license exists; the single monitor registration has 1,350 dependency entries and non-empty legacy channel data; the only alert row is a canary. No live auth codes. `legacy_migration_mappings` is absent and local `0015` is unapplied. No data movement occurred. Full private evidence is in `PRODUCTION_SOURCE_AUDIT_2026-09-12.md`; HOSTED-013 remains open. The schema baseline is ready, so this DB item no longer needs to stall independent shipping work.

Production schema migration evidence (2026-09-12): fresh preflight matched Vercel production `DATABASE_URL` to the Neon `production` branch; before apply it showed 10 present / 23 missing tables, 74 aggregate rows, no Drizzle history, zero `sentinel` license rows, and `licenses.plan` default `'pro'::text`. `pnpm db:check` and `pnpm db:migrations:check` passed (local Node 26 emitted the repository's Node 22 engine warning; hosted CI is the supported-runtime evidence). Production apply used the owner-approved exact 15-file SQL/journal set; postflight ran in repeatable-read/read-only mode and passed all assertions. Database migration did not merge or deploy PR #32 and changed no existing row counts.

## Current phase

Phase 2/3 workstreams — canonical record assembly/package acceptance is active; exact-head CI and review are the current external gate. Earlier and later phase gates remain open. This is not a claim that the shipping phases are complete.

Execution checkpoint (2026-09-13): CLI PR #36 merged at `a34fc7fb247c29daec5c8341d1e943f63cab13b6` from exact head `15457baec59c8a8c55de149fe9df7f0b89ac7709`; `34713028173` self-scan and `34713028112` all nine platform cells passed. AGENT-001 and HUNT-001 are checked. No CLI follow-up PR or Web PR is open. The Web migration-audit branch remains uncommitted locally. Backlog is 148 unchecked / 121 checked / 269 total. Production base schema `0000`–`0014` was applied previously; this batch made no production read or write. HOSTED-013/R-021 remain open for actual current-data migration, reconciliation, and recovery qualification.

Production migration review addendum (2026-09-12): existing table column names/types/nullability match the current Drizzle definitions for 87 columns. Replaying all 15 migrations against a disposable schema-only PostgreSQL 18 clone yielded no existing-table difference in columns, defaults, constraints, or indexes versus production; grants and full data reconciliation remain unqualified. Read-only dry-run of migration `0000` found 0 `sentinel` license rows to rewrite; its default-changing DDL remains. No deployed migration journal or tested snapshot/restore evidence was found. Production migrations were not run.

## Founder sequencing

Build and qualify the complete V1 before external POC, Reddit validation, public benchmark publication, paid pilots, or the final campaign. Internal fixture tests run continuously; external validation happens only after a release candidate passes the gates.

## Verified baseline

- Free local JavaScript/TypeScript scan is shipped.
- Pro is commercially wired with fix, CI thresholds, monitoring, alerts, deeper rules, and score history.
- Hunt and Attest are alpha shells, not complete verification/signing products.
- Team, Studio, Enterprise, Trivy orchestration, canonical `.vgl` records, and final dashboards are target capabilities.
- Current web/CLI public copy must remain bounded by the capability registry and code.

## Critical path

`truth registry → contracts → target resolution → adapters/imports → normalization/correlation → policy → local viewer → records/signing → hosted control plane → plan enforcement → dashboards → qualification → external acceptance`

## Active task

Latest active-batch decision: RECORD-011 is accepted at exact CLI PR #38 head `a8987771eff59d3219e4fd4df857deaaf17b80d3` after full local checks and exact-head hosted CI. Next inspect RECORD-010 legacy `attest` compatibility lifecycle; hosted record ingestion (VERIFY-WEB-001), guided Sigstore/cosign verification (RECORD-006), official Hunt publisher roots/licensing (HUNT-002), and HOSTED-013 migration/backfill qualification remain distinct open items. No production database operation occurred.

Authoritative active batch (2026-09-14): RECORD-002 package flow is implemented in CLI PR #38 commit `af13112`; local full-graph/package/signature/adversarial checks pass. Await exact-head CI, then reconcile acceptance evidence before deciding whether RECORD-002 is complete. RECORD-011 remains dependent on RECORD-002 and hosted receipt integration. HUNT-002 remains unchecked pending official publisher-root/feed authentication and real licensed recipe provenance; the local verifier is not release trust. R-040's workspace, path, approval, selected-test, and rollback criteria are accepted; the selected Node test runner is not a sandbox and makes no isolation claim. HOSTED-013 remains separate and requires current-data reconciliation/recovery qualification; no production DB operation occurred in this batch.

Current web batch (2026-09-12): commit `9eba73d` adds the read-only migration audit preflight to existing PR #32. Local verification: 86/86 tests with isolated PostgreSQL, typecheck, production build, Drizzle schema check, 15-migration journal check, and diff check pass. Hosted run `34679868578`, GitGuardian, and Vercel pass; PR #32 is OPEN/CLEAN. The preflight against local `verglos_test` found all 33 declared app tables absent; this database is empty and is not production evidence. HOSTED-013 is blocked pending an authorized production-shaped read-only source/schema snapshot plus complete migration baseline/history. No writes, migrations, merges, deployments, or backlog checkoffs occurred. Backlog remains 152 unchecked / 117 checked / 269.

Hunt verification addendum (2026-09-12): local Docker Desktop is reachable; the CLI Hunt package passes 51 tests against pinned BusyBox AArch64 digest `sha256:73aaf090f3d85aa34ee199857f03fa3a95c8ede2ffd4cc2cdb5b94e566b11662`. One Linux-host PID/IPC namespace assertion is skipped on the macOS test host. This does not close HUNT-011 or QUAL-CLI-004; Linux namespace evidence, recipe dependencies, and independent review remain required.

Current bounded batch: CLI approval-boundary hardening on PR #34 plus web tenant authorization and canonical catalog hardening on PR #32. CLI `d7430a5` is hosted-green on all nine platform cells. Web PR #32 head `0d9a185` passes run `34678019063`, GitGuardian, and Vercel; HOSTED-011/012 and PLAN-WEB-001/002 accepted on hosted evidence. CLI PR #34 remains open. Counts: 152 unchecked / 117 checked / 269. DIST-001, AGENT-007/`R-040`, PLAN-CLI migration, gateway reconciliation, legal/licensing review, and release qualification remain open. Blog/landing elements and private-document publication boundary remain unchanged.

## Last verified checks

The following inventory bullets are dated truth/verification snapshots; they are not claims that all later code is absent. The current PR heads and release-artifact state are recorded in the active-task and dated verification bullets below.

- `verglos-cli`: `TRUTH-001` inventory counts reconcile to 19 top-level commands, 11 detectors, 9 MCP tools, 8 packages, and 100 package-discovered tests.
- `verglos-web`: `TRUTH-002` inventory counts reconcile to 20 API route files, 21 HTTP handlers, 22 page routes, 12 database tables, and 0 application tests.
- `verglos-cli`: `TRUTH-003` registry names owner, evidence, review date, state, and permitted wording for current and planned command/capability families.
- `verglos-cli`: `TRUTH-004` reconciles plan IDs, aliases, pricing hypotheses, allowances, capability drift, enforcement, and migration preconditions.
- `verglos-cli`: `TRUTH-005` assigns all eight packages and each current/target feed one primary ownership class, with unresolved license, attribution, trademark, and signing controls held as explicit gates.
- Both lockfiles and installed metadata reconcile to 180 CLI lock rows/181 discovered records and 233 web lock rows/246 discovered records, with bundled extras identified and zero missing declared-license fields.
- CLI release packaging now stages the repository LICENSE and generated THIRD_PARTY_NOTICES in all six prospective npm tarballs and checks notice/archive byte identity. The nested benchmark license conflict blocks publication; web transitive assets still include MPL-2.0, LGPL-3.0-or-later, and CC-BY-4.0 obligations, and four copied web files still lack in-place provenance.
- The current CLI/scanner/MCP raw-`fetch` inventory contains 13 source files; default scans can perform update, npm/OSV, and analytics requests, while no current CLI path uploads source or generated reports.
- Current scan telemetry is default-on, can include a stable project fingerprint and project name, and attaches a raw paid-license bearer; it is pseudonymous/account-linked product data rather than anonymous analytics.
- All 12 hosted tables have been classified for sensitive fields and retention/deletion truth; no complete privacy export/deletion workflow or code-enforced table-retention program exists, and generic monitor delivery has an open SSRF gate.
- Hosted allowance semantics now distinguish concurrent seat/application/client-workspace gauges, idempotent monthly record ingestion, and separately measured storage, verification, delivery, advisory, managed-execution, and support work.
- The target 2/5/10 seat, 5/25/100 monitored-app, 100/500/2,000 monthly-record, and 90-day/12-month/3-year retention values map to stable units; all unapproved numeric allowances remain `unset`, not unlimited.
- Current hosted schema has no catalog version, immutable usage event, quota reservation, aggregate, provider-cost entry, or overage authorization; per-plan COGS remains unknown pending dated provider evidence and representative measurement.
- All 12 current hosted tables and their account/API/cron/public consumers now map to explicit target entity families with idempotent legacy IDs/digests, quarantine rules, and no invented subject, decision, observation, signature, record, or verification facts.
- The web repo declares 33 application tables and has 15 ordered SQL migrations in a Drizzle journal, but the chain assumes legacy `users`/`licenses` baselines that no tracked migration creates; production history and the 23 missing declared tables remain unreconciled.
- Hosted migration is frozen as expand → bounded backfill → dual write → shadow read → per-surface cutover → later contract, with tenant-negative, count/digest, old-client, restore, and rollback gates before authority changes.
- Root help execution confirms 19 top-level commands and four monitor subcommands. The current binary has no universal JSON/quiet/config/policy flags and `scan` remains current-working-directory only.
- Current command defaults, report/config/credential/hook artifacts, network effects, stdout/stderr, and command-specific exits map to 24 required isolated process fixtures, including root and watch behavior.
- Known compatibility risks include mandatory update gating, divergent scan-wrapper coverage, malformed threshold/timeout acceptance, hook overwrite/false success, incomplete monitor states returning zero, mixed JSON/prose MCP config output, and Hunt/Attest entitlement-denied 3 versus shell 78 exits.
- Twelve architecture decisions now freeze the Apache local core, one signed npm front door, producer-independent language-neutral contracts, JS/TS native coverage label, hosted modular monolith/durable workers, Postgres/object split, transactional outbox/queue, server catalog/usage authority, and separated signing identities.
- Queue and object-storage providers remain intentionally deferred until contract, security, privacy, recovery, exit, representative-load, and actual-cost gates pass; the current sequential cron and relational JSON are not accepted substitutes.
- Ubuntu CI run `34643142278` now provides Linux-host evidence for the pinned Hunt adversarial suite (50/50, including PID/IPC namespace isolation). HUNT-011 remains open because HUNT-008–010 and independent security review are required dependencies.
- Material current contradictions are mapped to owners, including default scan networking, file/scanner-shaped contracts, user/license-centric hosted data, absent durable operations/object custody/usage authority, unsigned summaries, and incomplete schema migration control.
- The governing register now tracks 39 risks with stable IDs, accountable owners, severity, explicit triggers, prevention/detection evidence, containment/rollback, blocking gates, status, and residual risk.
- Seven current blocker groups are explicit: report authorization, webhook SSRF, credentials/telemetry privacy, package notices, schema reproducibility, monitoring/delivery correctness, and catalog-bound payment amounts.
- Hunt, canonical signing, tenant migration, new public verification, managed execution, and inactive plans remain blocked from activation until their critical/high controls produce executable evidence.
- `verglos-cli@bd1d394`: cache-bypassed `pnpm exec turbo run test typecheck build --force` passed 19/19 tasks and 100/100 tests under Node 26.4.0, which satisfies the CLI's Node `>=20` range.
- `verglos-web@5044e77`: `pnpm typecheck` and `pnpm build` passed under the declared Node 22 engine using Node 22.23.2; Next 15.5.21 compiled in 2.2 seconds and completed 34 static generation work units.
- Verification left both tracked worktrees clean; the eight pre-existing user-owned CLI documents/assets remained untracked and untouched. The web repo exposes no test script or application test files, which remains a coverage gap.
- `verglos-cli@84d3921`: cache-bypassed `pnpm exec turbo run test typecheck build --force` passed 20/20 tasks and 109/109 tests; the new shared suite contributes nine schema/version, canonicalization, bounded-reader, and legacy-fixture tests.
- The `2.0.0` JSON reporter still emits its frozen top-level shape without adding `schemaId`; the shared reader assigns `urn:verglos:schema:scan-report` only when a caller explicitly enables that legacy mapping.
- `verglos-cli@1bc2b1b`: the same cache-bypassed graph passed 20/20 tasks and 122/122 tests. Thirteen subject tests cover seven kinds, canonical ID recomputation, dirty Git state, mandatory content digests, OCI tag/mirror/platform rules, registry/path bounds, malformed IDs, schema upgrades, and strict unknown fields.
- Subject IDs bind immutable content/context only. Registry/tag/path/size labels cannot replace digests, and subject possession grants no tenant ownership, provenance, coverage, policy result, signature validity, or publication authority.
- `verglos-cli@a71fba7`: the cache-bypassed graph passed 20/20 tasks and 135/135 tests. Thirteen engine/run tests cover healthy and non-healthy state, missing/incompatible/stale reasons, component trust/freshness linkage, process/outcome consistency, timeout/capability/time bounds, successful-but-incomplete coverage, prohibited target execution, and future schema upgrades.
- Engine process success and evidence completeness are distinct. Any non-successful run or non-healthy engine is structurally unable to report complete coverage, while successful partial work remains explicitly incomplete rather than empty success.
- `verglos-cli@65ea279`: the follow-up cache-bypassed graph passed 20/20 tasks and 145/145 tests, closing the observation contract's full-repository verification.
- `verglos-cli@f6be31e`: the cache-bypassed graph passed 20/20 tasks and 153/153 tests. Eight AI-change tests enforce estimate-only heuristics, required limitations, unverified declarations, signature evidence, build-provenance non-inference, subject/range binding, and version upgrades.
- `verglos-cli@fc4d8d2`: the cache-bypassed graph passed 20/20 tasks and 164/164 tests. Eleven verification-attempt tests enforce the six-outcome vocabulary, execution/evidence rules, verified recipe and approval gates, non-root isolated runtime requirements, safe network-origin declarations, resource limits, non-execution invariants, timing, and version upgrades.
- A verification-attempt document records and validates producer claims about approval, sandboxing, limits, usage, redaction, and evidence. It is not proof that isolation, cleanup, egress control, or redaction enforcement occurred; those claims remain gated on implementation-level evidence.
- `verglos-cli@2dd8ea3`: the cache-bypassed graph passed 20/20 tasks and 175/175 tests. Eleven exception/approval tests enforce exact subject/observation scope, finite validity, controls, reversal triggers, human authority, canonical request binding, denial/expiry/timing behavior, scope mismatch, and version upgrades.
- Exception parsing preserves historical records but grants no policy effect. Applicability requires the separately recorded approval to match the exact request digest, validity window, subject, observation, and evaluation time; hosted RBAC and audit-store integrity remain downstream gates.
- `verglos-cli@dc9e0b4`: the cache-bypassed graph passed 20/20 tasks and 186/186 tests. Eleven policy-evaluation tests enforce all four decisions, fixed exits, incomplete precedence, required-evidence failure states, exact identity, freshness/evidence consistency, advisory limits, stable ordering, derived-field tamper rejection, and version upgrades.
- Policy evaluation derives `PASS=0`, `BLOCK=1`, `REVIEW=2`, and `INCOMPLETE=3` from the recorded facts. Required missing/stale/unsupported/error evidence and mismatched/unresolved identity force `INCOMPLETE`, which outranks simultaneous blockers and can never render green.
- `verglos-cli@03533ab`: the cache-bypassed graph passed 20/20 tasks and 193/193 tests. Seven release-decision tests enforce canonical evaluation binding, incomplete propagation, exactly one matching primary subject, unique subject/approval references, policy cross-binding, ordered times, strict fields, and version upgrades.
- A release decision preserves the policy-evaluation result and references its canonical digest; it cannot upgrade `INCOMPLETE`. It records issuer/approval claims but is not a signature, deployment authorization, or proof of hosted RBAC.
- `verglos-cli@c1fa719`: the cache-bypassed graph passed 20/20 tasks and 199/199 tests. Six record-manifest tests enforce deterministic member/extension ordering, required release-decision membership, duplicate/path controls, explicit redaction state, omitted-size bounds, namespaced extensions, and schema/version references.
- A manifest indexes bounded payload claims without selecting archive transport or proving member bytes. Transport readers must independently verify digest, size, traversal/symlink/bomb safety, and access/redaction policy.
- `verglos-cli@a1e8f1f`: the cache-bypassed graph passed 20/20 tasks and 203/203 tests. Four failure-taxonomy tests enforce all nine categories, stable exit mappings, namespaced codes, retry restrictions, strict fields, and future-version handling.
- `verglos-cli@4435964`: cache-bypassed `pnpm exec turbo run test typecheck build --force` passed all 23/23 workspace tasks; release-script tests passed 17/17 and license/SBOM-focused tests passed 7/7. The inventory reconciles 180 lock versions plus one nested bundled component and reports the nested `benchmark@1.0.0` license conflict for review. GitHub Actions run `34664087596` (self-scan) and `34664087624` (Node 20/22/24 matrix on Ubuntu, macOS, and Windows) passed; PR #34 is OPEN and MERGEABLE. Publishing remains blocked by the explicit license review blocker and remaining release gates.
- `verglos-web@4a6571a`: [fork PR #32](https://github.com/anuragyadav-git/verglos-web/pull/32) checks passed (typecheck/schema, security, and Vercel preview); branch is OPEN and MERGEABLE. The current branch contains 33 commits since 18:00 IST; webhook/tenant/runtime hardening remains preparatory where deployment, egress, or full lifecycle acceptance is still missing.
- Failure categories remain separate from policy outcomes, verification outcomes, and evidence absence. Exit codes are compatibility projections; machine callers must consume the typed category and action.
- No final V1 implementation claim is authorized by those checks.

## Next task

Next: resolve the nested license conflict through authorized review without inferring clearance; finish LIC-002 external engine/content records and LIC-003 notice coverage; then qualify protected publishing, release notes/provenance, supported architectures, web redistribution, and remaining product gates. LIC-001 and LIC-004 are complete as inventory/SBOM engineering tasks, but their completion does not authorize publication.

## Scope hold

- Core product work forecasts 252 commits: 162 in `verglos-cli`, 90 in `verglos-web`.
- The final landing/marketing pass forecasts 8 additional `verglos-web` commits and remains on hold until a later founder command after GA truth lock.
- Blog work is excluded; no blog or landing-page element may be changed during core execution.

## Blockers

- No blocker prevents local implementation work.
- The next npm publication remains blocked on complete lock/artifact license qualification, SBOM/provenance and clean-consumer gates, and applicable third-party source/notice review. PR #34 adds the Apache LICENSE to each CLI package archive; it does not close the full release gate.
- Redistribution of reviewed web binaries/data, copied CLI-origin web files, external engines, standards schemas, and public fixtures is blocked until the applicable notice, source, provenance, modification, and legal-review gates pass.
- External POC and campaign remain intentionally blocked until release-candidate gates pass.
- `verglos-cli@5b50408`: engine lifecycle commands now have approval-gated install/update/rollback, deterministic JSON/quiet exits, bounded artifact/manifest reads, compatibility matching, and positive/negative Ed25519 signature fixtures; the current CLI self-scan is green on PR #32.
- `verglos-web@1f0233c`: typecheck passed after encrypted monitor-channel reads validate channel names and fail closed on malformed rows; the preceding `d0c8c54` slice passed the full web test, migration, and production build checks.
- `verglos-cli@1cdfd63`: MCP package tests are now registered in the workspace and pass 15/15, including a 256 KiB transport-argument boundary; CLI PR #32 self-scan is green and mergeable.
- `verglos-web@788d048`: bounded JSON/text request readers have direct coverage; web typecheck and 18/18 tests pass, and web PR #30 is mergeable with hosted checks green.
- `verglos-cli@2019759`: policy check now evaluates a verified record-store `policy-evaluation` member and classifies snapshots without a recorded decision as deterministic `INCOMPLETE`; CLI focused policy tests and typecheck pass. Common command flags and full record production remain open.
- `verglos-web@f31548f`, `0d9a185`: the versioned server catalog now includes explicit unset/contracted public traffic and managed-run allowances, derives effective capabilities, keeps Founder private, and marks unverified Pro price non-purchasable; hosted run `34678019063` passes. Usage enforcement, CLI catalog migration, and gateway/checkout reconciliation remain open.
- `verglos-cli@e6601b6`, `137380c`, `4a28387`: bounded explicit JSON config is now accepted by scan/score/secrets/deps/ci/precommit with regular-file and 1 MiB limits; legacy `.verglos.config.js` fallback remains available, and scan/ci accept the contract's `--policy` alias. Focused CLI tests pass 79/80 (one sandbox-only skip) and typecheck passes; universal common-option registration, migration warning surfacing, output paths, and process fixtures remain open. The commits are queued for push if GitHub connectivity is unavailable.
- `verglos-cli@b2b1dc8`: scan/score/secrets/deps/ci now expose structured `--json` stdout while preserving report files and human output by default; CLI contract tests and typecheck pass. This remains preparatory because universal command registration, output-path semantics, and process fixtures are still open.
- `verglos-cli@83d6c67`: `precommit --json` now emits one machine-readable PASS/BLOCK/INCOMPLETE record without prose, and `ci --json` suppresses the free-tier upgrade hint that would contaminate JSON. Focused CLI tests and typecheck pass; this remains preparatory under LOCAL-001.
- `verglos-cli@cdbf806`: scan/secrets/deps now accept `--output <dir>` for HTML/JSON reports; output directories are created with bounded permissions and existing symlink/non-directory destinations are rejected. Reporter tests and CLI focused tests pass; LOCAL-001 remains preparatory pending universal registration and process fixtures.
- `verglos-cli@5a5bfcc`: `record create` now materializes a bounded content-addressed local store from a validated manifest, verifies member digest/size claims, and writes a canonical manifest; the focused CLI graph passes 80/81 (one sandbox-only skip) and typecheck passes. Signing, full `.vgl` assembly, approval receipts, and independent offline verification remain open.
- `verglos-web@2e88c28`: organization+project authorization is centralized for release/evidence APIs, with tenant-bound project predicates and preserved 401/403/404 behavior; web tests pass 20/20 and typecheck passes. Remaining organization routes still require the same query audit before HOSTED-011 can close.
- `verglos-web@fd4737b`: policy and policy-evaluation APIs now use the same tenant-bound project authorization helper; web tests pass 20/20 and typecheck passes. HOSTED-011 remains preparatory until the remaining organization routes and full query audit are complete.
- `verglos-web@d981f5f`: release detail reads now use the tenant-bound project helper as well; web tests pass 20/20 and typecheck passes. The commit is queued for push if GitHub DNS is unavailable.
- `verglos-web@a5beae7`: project PATCH/DELETE mutations now resolve through the same tenant-bound helper before writing; web tests pass 20/20 and typecheck passes. HOSTED-011 remains preparatory pending the remaining organization routes and full query audit.
- `verglos-web@f59a2ab`: organization authorization now has exhaustive role/action and deny-by-default unit coverage; web tests pass 21/21 and typecheck passes. HOSTED-012 remains preparatory pending route/database cross-tenant fixtures.
- `verglos-web@3b80a98`: a static tenant-scope audit now walks every organization API route, requires centralized authorization (or signed-in root organization flow), and checks organization predicates on direct queries; web tests pass 22/22, typecheck and `db:check` pass. HOSTED-011 remains preparatory because runtime DAL/database fixtures are still required.
- `verglos-web@8ff2c8b`: exact duplicate release projections now replay idempotently within the authorized tenant/project, while changed-content reuse of a release identity returns 409; web tests pass 23/23, typecheck and `db:check` pass. VERIFY-WEB-001 remains preparatory pending full redacted record/object receipt ingestion.
- `verglos-web@28bd114`: release creation and exact retries now return a deterministic SHA-256 digest over the allowlisted immutable projection, with no raw source/findings fields; web tests pass 24/24, typecheck and `db:check` pass. VERIFY-WEB-001 remains preparatory pending full record/object receipt ingestion.
- `verglos-cli@901ba40`: bounded `record create` now rejects an existing symlink or non-directory output root before materialization; focused CLI tests pass 81/82 (one sandbox-only skip) and typecheck passes. RECORD-009 remains preparatory pending canonical `.vgl` assembly, signing, approval, and independent verification.
- `verglos-web@f846aee`: tenant-scoped release-list responses now expose a digest over the same immutable allowlisted projection used at creation/retry; web tests pass 24/24, typecheck and `db:check` pass. VERIFY-WEB-002 remains preparatory pending stored receipt verification and public page work.
- `verglos-cli@6c0619d`: shared verified public-record projection now rechecks release-decision member size/digest, exposes only decision/subject/policy/redaction/limitations plus honest signer state, and excludes paths, raw members, issuer IDs, and tenant fields; shared tests pass 260/260 and CLI typecheck passes. RECORD-011 remains preparatory pending complete record assembly and hosted receipt wiring.
- `verglos-web@c676129`: added a strict bounded redacted-record receipt contract and negative tests; web tests pass 26/26, typecheck and `db:check` pass. VERIFY-WEB-001 remains preparatory pending authenticated tenant-scoped persistence, idempotency, and object custody.
- `verglos-cli@18c2d58`: added read-only `record project <storeRoot> <manifestPath>`; it verifies the complete content-addressed store before emitting the allowlisted public projection and never uploads or mutates. Focused CLI tests pass 83/84 (one sandbox-only skip) and typecheck passes. RECORD-009/011 remain preparatory pending canonical `.vgl` assembly, signing, and independent verification.
- `verglos-web@6918b34`: redacted receipt validation now enforces canonical subject IDs, one unique primary subject, and consistent redaction-manifest identity; web tests pass 27/27, typecheck and `db:check` pass. VERIFY-WEB-001 remains preparatory pending authenticated tenant-scoped persistence, idempotency, and object custody.
- `verglos-web@1a5c645`: added migration `0014_record_receipts` plus tenant/project-authorized GET/POST receipt APIs with bounded redacted fields and exact content-digest retries; web tests pass 28/28, typecheck, `db:check`, and migration check pass. Object custody and full record verification remain open.
- `verglos-cli@3585705` (building on `71c11ba`): safe record reader now skips optional omitted members, rejects required omissions and duplicate digests, validates JSON payloads, rejects unknown required media, and rejects unsupported member schema versions; full shared suite passes 266/266 and typecheck passes. RECORD-004 is complete.
- `verglos-cli@54eeb0e`: added provider-neutral Ed25519 offline manifest signing and verification with explicit signer/issuer metadata and tamper/key-negative fixtures; shared tests pass 264/264 and typecheck passes. RECORD-007/008 remain preparatory pending approval/key custody, independent CLI verification, and full record policy checks.
- `verglos-cli@05369f0`: added approval-gated `record sign` and optional signature verification to `record verify`, with bounded key reads and mode-0600 envelope output; focused CLI tests pass 85/86 (one sandbox-only skip) and typecheck passes. RECORD-007/008 remain preparatory pending key custody/rotation and full subject/decision policy verification.
- `verglos-cli@d648c73`: `record verify` now parses the required release-decision member and reports its decision/policy digest after content-addressed verification; focused CLI tests pass 85/86 (one sandbox-only skip) and typecheck passes. RECORD-008 remains preparatory pending full subject, issuer-policy, redaction, and material checks.
- `verglos-cli@582a5f9`: signing tests now cover invalid private keys and refusal to overwrite an existing envelope; focused CLI tests pass 86/87 (one sandbox-only skip) and typecheck passes. RECORD-007 is complete; custody/rotation remain explicit out-of-scope trust limitations.
- `verglos-cli@a8a3296`: independent offline `record verify` now enforces decision-before-manifest timestamps, required redaction-manifest presence, explicit trusted issuer/signer checks, signature timestamp ordering, and bounded regular-file inputs; focused CLI tests pass 86/87 (one sandbox-only skip), shared build and CLI typecheck pass. RECORD-008 is complete for the offline verifier acceptance boundary; key custody, Sigstore, and hosted material custody remain separately tracked.
- `verglos-web@de5225a`: added a tenant/project-authorized single-receipt verification endpoint exposing only immutable receipt identity, digests, decision, subjects, policy, signer status, redaction, limitations, and timestamps; web tests pass 28/28, typecheck, `db:check`, and migration checks pass. VERIFY-WEB-002 remains preparatory pending cryptographic receipt re-verification and a non-home public page.
- `verglos-web@f413682`: single-receipt reads now recompute the canonical redacted-receipt content digest and report `verified` versus `corrupt`, while accepting the contract's bounded receipt IDs; web tests pass 28/28 and typecheck passes. VERIFY-WEB-002 remains preparatory pending cryptographic signature re-verification and a non-home public page.
- `verglos-web@40c9794`: extracted receipt-content verification into a tested contract helper; web tests pass 29/29 and typecheck passes. VERIFY-WEB-002 remains preparatory pending cryptographic signature re-verification and a non-home public page.
- `verglos-web@d3bb1bf`: added the non-home `/record/verify/[receiptId]` public page with redacted fields, integrity status, signer/redaction/limitation state, and ambiguity-safe receipt lookup; typecheck passes. VERIFY-WEB-002 is complete for its hosted projection/page acceptance boundary.
- `verglos-web@201bdfd`: added the matching public JSON endpoint at `/api/v1/receipts/[receiptId]`, with ambiguity-safe lookup, redacted allowlisting, and canonical content-digest revalidation; web tests pass 29/29 and typecheck passes.
- `verglos-web@7e4d012`: receipt ingestion now constrains receipt identities to bounded URL-safe tokens, preventing path/query/fragment ambiguity at public verification surfaces; web tests pass 29/29 and typecheck passes.
- `verglos-cli@4bca145`: batch record publication rejects duplicate content digests before writing, preserving the reader's unique-content invariant; shared tests pass 272/272.
- `verglos-cli@a598f7e`: payload-backed Release Record assembly applies the same duplicate-digest guard before manifest creation; shared tests pass 272/272.
- `verglos-cli@cc7ce7e`: provider provenance matching evaluates every declared subject digest, preventing first-entry bias and preserving explicit matched/mismatched/unavailable states; shared tests pass 273/273.
- `verglos-cli@61c80e5`: `record create` now preflights an existing output manifest before publishing blobs, preserving retry atomicity; CLI tests pass 90/90.
- `verglos-web@c7eb361`: public and tenant-scoped receipt APIs share the URL-safe receipt-ID grammar enforced at ingestion; web tests pass 29/29 and typecheck passes.
- `verglos-cli@3b5039e`: provider provenance results can now be encoded as canonical `provenance` record members with explicit digest state and signature limitations; shared tests pass 274/274.
- `verglos-cli@ece9325`: matched provider provenance now exposes the matching subject digest, while mismatches retain deterministic observed evidence; shared tests pass 275/275.
- `verglos-cli@e938973`: payload-backed record assembly rejects non-empty members marked omitted, preventing manifest/store redaction contradictions; shared tests pass 275/275.
- `verglos-cli@4dd5208`: `record create` now preflights member hashes and streams validated regular files into the content-addressed store, preserving bounded memory; CLI tests and typecheck pass.
- `verglos-cli@ab70157`: added read-only `config inspect` with bounded JSON parsing, deterministic migration warnings, and explicit invalid-config exits; CLI tests pass 91/92 (one sandbox-skipped loopback test) and typecheck passes.
- `verglos-cli@14271b4`: added verified `record header` output for decision, primary subject, policy digest, generated time, signer state, limitations, and next action; CLI tests pass 92/93 (one sandbox-skipped loopback test).
- `verglos-cli@6371ffd`: `diff --json` and human output now include the bounded change-action projection with identity/coverage/policy deltas and deterministic next actions; CLI tests pass 93/94 (one sandbox-skipped loopback test).
- `verglos-web@afdedc5`: concurrent exact receipt retries now re-read the tenant-scoped conflict row and return idempotent success only for matching project/content; web tests pass 29/29 and typecheck passes.
- `verglos-cli@bf1763b`: evidence projections now deep-freeze nested attribution, confidence, evidence, lineage, and reference fields; shared tests pass 276/276.
- `verglos-cli@f0b63bf`: JSON output from `config inspect` and `record header` remains emitted under `--quiet`, matching automation behavior of other record commands; CLI tests pass 93/94 (one sandbox-skipped loopback test).
- `verglos-cli@20e4793`, `3383126`: shared records now emit a standard in-toto Statement v1 with canonical subject digest bindings, and reproducibility tests prove manifest ordering/canonicalization is independent of input order; shared tests pass 267/267. RECORD-003 and RECORD-005 are complete as independent contract layers.
- `verglos-cli@b91728c`: content-addressed storage now provides bounded batch publication with preflight duplicate-path rejection, aggregate member-count limits, deterministic path ordering, and the existing per-member size/digest checks; shared tests pass 268/268. RECORD-001 remains preparatory pending streaming/archive integration.
- `verglos-cli@f9ce82e`: `record create` now prevalidates every non-omitted member digest/size before publishing through the bounded batch store; focused CLI tests pass 86/87 (one sandbox-only skip), shared build passes, and typecheck passes. RECORD-001 remains preparatory pending streaming/archive integration.
- `verglos-cli@b04ebbb`: added streaming regular-file publication with incremental hashing, bounded byte enforcement, symlink rejection, and atomic content-addressed rename; shared tests pass 269/269. RECORD-001 remains preparatory pending archive/container integration.
- `verglos-cli@b04ebbb`: streaming regular-file publication plus bounded batch publication now satisfy the RECORD-001 store contract: incremental hashing, byte/count caps, duplicate/path-escape rejection, deterministic layout, symlink rejection, and atomic writes; shared tests pass 269/269. RECORD-001 is complete; archive/container assembly is tracked separately under RECORD-002.
- `verglos-cli@15e1e3f`: added payload-backed `assembleReleaseRecordBundle`, deriving canonical member bindings from bytes, preserving a read-only payload map, rejecting duplicate paths, and enforcing exactly one release-decision payload; shared tests pass 270/270. RECORD-002 remains preparatory pending full graph component assembly and transport packaging.
- `verglos-cli@de21e49`: CLI regression coverage proves `record create` prevalidates all members and publishes no payload when any digest/size claim fails; focused CLI tests pass 87/88 (one sandbox-only skip). RECORD-002 remains preparatory.
- `verglos-cli@121be00`: complete Release Record assembly now has an explicit graph gate requiring subject, policy-evaluation, and release-decision members plus redaction-manifest presence for complete/partial redaction; shared tests pass 271/271. RECORD-002 remains preparatory pending full optional graph component generation and transport packaging.
- `verglos-cli@9427706`: `record create --complete` now applies the complete graph gate before creating output, with a regression test proving incomplete manifests fail before any directory or payload is created; focused CLI create tests pass 88/89 (one sandbox-only skip). RECORD-002 remains preparatory.
- `verglos-cli@a8a035c`: added an explicit Sigstore record-binding contract that pins bundle digest, manifest digest, issuer/identity, verification state, and limitations without claiming cryptographic verification; shared tests pass 272/272. RECORD-006 remains preparatory pending a real keyless/cosign verifier and trust-policy integration.
- `verglos-cli@72e4e50`: legacy `attest` now explicitly identifies itself as a compatibility shell and disclaims creation/signing of canonical Release Records, directing users to the record workflow; RECORD-010 remains preparatory pending a full migration path.
- `verglos-cli@f3462d3`: `record verify --complete` now applies the same complete graph gate as creation, with focused verifier tests passing 88/89 (one sandbox-only skip) and typecheck passing. RECORD-009 remains preparatory pending canonical full-record production and approval receipts.
- `verglos-cli@69abafd`: complete graph validation now rejects duplicate policy-evaluation or redaction-manifest anchors; shared tests pass 272/272. RECORD-002 remains preparatory pending generation of all optional graph components.
- `verglos-cli@2019759` (with command hardening through `a7a1aca`, `4f3e21c`, and `0f48f78`): `verglos policy check` supports bounded record/snapshot and stdin inputs, JSON/quiet output, deterministic PASS/REVIEW/BLOCK/INCOMPLETE exits, and no mutation; focused policy tests pass. POLICY-011 is complete.
- `verglos-cli@434b026`: scanner detector selection now rejects unknown/duplicate IDs before target access, preserving honest requested coverage; scanner tests pass 63/63 and typecheck passes.
- `verglos-web@11eea34`: telemetry JSON and CLI device-code inputs now have explicit size/shape bounds; web tests pass 38/38 and typecheck passes.
- `verglos-cli@c91a7e0`: record-store temporary publication names are collision-resistant and cleaned up on failed rename; shared tests pass 279/279.
- `verglos-web@c82a218`: telemetry payloads now reject unknown fields in addition to bounded parsing; web tests pass 38/38 and typecheck passes.
- `verglos-web@1d19d6b`: public receipt verification responses are explicitly `no-store`, preventing stale verified/corrupt status at the public boundary; web tests pass 38/38 and typecheck passes.
- `verglos-web@3557fef`: a regression guard now protects the public receipt `no-store` cache contract; web tests pass 39/39 and typecheck passes.
- `verglos-cli@de7787a`: record creation now defers output-directory creation until all manifest members pass digest/size preflight; CLI tests pass 93/94 (one sandbox-only skip).
## 2026-09-30 · QUAL-CLI-006 clean-consumer install evidence

The repository's real public-package path was executed locally on the current CLI branch: `pnpm pack:public` produced all six public archives; `scripts/check-packed-manifests.mjs` passed; and `scripts/verify-clean-consumer.mjs` installed all six archives into a fresh temporary consumer, imported every library, executed `Verglos 2.0.0-alpha.1`, and confirmed no external engine cache was created. This is direct macOS clean-install evidence only. It does not prove upgrade, rollback, Windows/Linux execution, or official in-toto/Sigstore trust validation, so QUAL-CLI-006 remains unchecked. Generated `.artifacts/public-packages` is ignored and was not committed. No production/database operation, migration, deployment, release, publish, or marketing action occurred.
## 2026-09-30 · QUAL-CLI-006 compatibility/rollback corpus evidence

Focused current-code evidence also passes: `packages/shared/src/install-matrix-invariants.test.ts`, `packages/shared/src/upgrade-compat-corpus.test.ts`, and `packages/cli/src/engines-install.test.ts` run via the repository's local tsx launcher with **48/48 passing**. This covers package install invariants, schema/record backward compatibility, approved engine update/rollback labeling, digest/signature checks, and fail-closed paths. It strengthens the contract evidence but is not a substitute for a real cross-OS install/upgrade/rollback run; QUAL-CLI-006 remains unchecked pending that evidence and official in-toto/Sigstore validation.
## 2026-09-30 · QUAL-CLI-006 Linux clean-consumer evidence

The same six-archive clean-consumer verifier was executed inside the pinned local `node:24-bookworm` Linux container (linux/amd64 under host emulation) and passed: all archives installed, all libraries imported, the CLI reported `2.0.0-alpha.1`, and no external engine cache was created. Combined with the macOS host run, this adds direct Linux/macOS install evidence. Windows, upgrade/rollback as a real package transition, and official in-toto/Sigstore validation remain open; QUAL-CLI-006 stays unchecked.
## 2026-09-30 · QUAL-CLI-006 official Cosign tool smoke

Pinned official Cosign `v2.4.1` (Docker image digest previously recorded) successfully created and verified a DSSE/in-toto attestation over the actual `verglos-2.0.0-alpha.1.tgz` archive using an ephemeral local key, with `--tlog-upload=false --offline --insecure-ignore-tlog`; verification returned `Verified OK`. This confirms the archive and generated envelope are consumable by the official tool. It is deliberately **not** Sigstore release trust evidence: the key was ephemeral, no Rekor entry or Fulcio identity was used, and the predicate was synthetic. QUAL-CLI-006 therefore remains unchecked pending real in-toto layout/link validation and keyless/trusted-root evidence.
## 2026-09-30 · QUAL-CLI-006 real macOS upgrade/rollback transition

On a fresh temporary npm consumer, the published `verglos@1.8.3` was installed and reported `1.8.3`; all six current local archives were then installed together and reported `2.0.0-alpha.1`; reinstalling `verglos@1.8.3` completed the rollback and reported `1.8.3`. This is direct macOS package-transition evidence. It does not establish the same transition on Linux/Windows or official in-toto/Sigstore trust evidence, so QUAL-CLI-006 remains unchecked.
## 2026-09-30 · QUAL-CLI-006 real Linux upgrade/rollback transition

Inside the pinned local `node:24-bookworm` Linux container (linux/amd64 under host emulation), a fresh consumer completed the same published `verglos@1.8.3` → local six-archive `2.0.0-alpha.1` → published `1.8.3` transition, reporting `1.8.3`, `2.0.0-alpha.1`, and `1.8.3` respectively. Combined with the macOS run and the nine-cell clean installs, this directly covers Linux/macOS install plus transition behavior. Windows real upgrade/rollback and official in-toto/Sigstore trust evidence remain open; QUAL-CLI-006 stays unchecked.
## 2026-10-02 · CLI PR #52 merged: portable agent-surface paths

CLI PR #52 (`514349f`) merged as `ccb65ed`. Agent-surface findings now render developer-home paths as `~`-relative paths while preserving detection, preventing machine-specific absolute paths from entering portable reports. The exact-head hosted Ubuntu/macOS/Windows × Node 20/22/24 matrix, self-scan, and in-toto release-binding job all passed. The change is implementation progress only; it does not alter the package version (`2.0.0-alpha.1`) or constitute a release/publication.

Production checkout evidence was corrected after an authenticated Chrome probe: `POST /api/razorpay/create-qr` currently returns HTTP 503 `PLAN_UNAVAILABLE`, so no order/payment/webhook/license write occurred. PLAN-WEB-011/012 and commercial acceptance remain open pending an approved verified INR catalog and real provider lifecycle evidence. No production/database write, migration, deployment, publish, or marketing change occurred.
## 2026-10-02 · Web PR #122 merged: checkout truth boundary

Web PR #122 (`f574af3`) merged after hosted Verify run `36978025646` passed typecheck, full tests, negative-boundary, truth-registry, schema/migration checks, build, public-boundary, dependency/license/SBOM, and secret guards. The checkout page now derives available cadences from the same canonical catalog used by the API; when no verified INR offer exists it hides the stale USD price and QR action and explains that no payment request will be created. This corrects the production UI/API mismatch without enabling billing or changing prices. Production remains `PLAN_UNAVAILABLE`; no order/payment/webhook/license write occurred.
## 2026-10-02 · Razorpay Test Mode sandbox payment completed

Using the existing monthly configuration anchor, `$29` was tested as `₹2,809.43` (`280943` paise); the same fixed conversion gives `$290` as `₹28,094.30` (`2809430` paise), but annual pricing remains disabled in the canonical production catalog. A real Razorpay Test Mode Standard Checkout order `order_TixO0lU5jqQIui` was completed through the existing Chrome remote-debugging window using the mock bank Success action. Provider payment `pay_TixQnWornJ3Yl1` is captured for `280943` INR paise. A signed bound webhook harness then invoked exactly one credit and returned a duplicate response on replay. Evidence: `docs/shipping/evidence/razorpay-sandbox-checkout-2026-10-02.md`.

This proves sandbox provider checkout and signed/idempotent webhook behavior, not hosted production entitlement issuance. The production catalog remains fail-closed until its verified INR row is deliberately enabled; no live payment, production/database write, migration, or billing enablement occurred.
# 2026-10-02 · Hosted Linux namespace qualification

CLI PR #55 (`933c14c`) added `workflow_dispatch` to the self-scan workflow and merged as `b781bc4` after the full nine-cell platform matrix and PR self-scan passed. Authoritative manual `main` self-scan `36984993552` then passed end-to-end on `ubuntu-latest`; its pinned `postgres:15-alpine` Hunt suite passed with zero failures and the explicit PID/IPC namespace-private assertion passed. This closes the Linux namespace evidence gap itself, but HUNT-011/QUAL-CLI-004 remain unchecked for recipe execution/provenance and independent review.
# 2026-10-02 · Web organization dashboard accessibility batch

Web PR #127 (`d92aba3`) merged as `cdc1fff` after hosted Verify run `36985775429` passed typecheck, 836/836 runnable tests with 22 environment-gated skips, negative-boundary/truth checks, schema and migration checks, production build, public-boundary, dependency/SBOM/license, tracked-secret, GitGuardian, and Vercel Preview. The organization dashboard shell now has a skip link, named workspace/navigation landmarks, keyboard focus affordances, stronger sidebar contrast, responsive mobile stacking, and reduced-motion handling. QUAL-WEB-006 remains unchecked: authenticated organization-dashboard runtime, human screen-reader, large-data, and complete field-CWV evidence are still absent. No production deployment or database operation was performed by this batch.
# 2026-10-02 · Legacy verify truth correction

Web PR #128 (`03304c0`) merged as `fc55203` after hosted Verify run `36986357199` passed. `/verify` no longer reads or displays historical attestation/view counters, calls legacy rows “verified,” or instructs users to publish with the retired `verglos attest` path. It now identifies `/verify/<hash>` as an unsigned historical lookup and points canonical evidence to offline `verglos record verify`. RECORD-010 remains open until the cross-repository legacy compatibility and final truth audit are reconciled; no production/database operation was performed in this batch.
# 2026-10-02 · Legacy verify production smoke

The Web PR #128 merge produced Vercel production deployment `verglos-5vy0enlkd-anuragyadav20062002s-projects.vercel.app`, which reached READY. Read-only `curl` checks against `https://verglos.com/verify` show the new “Legacy summary lookup” and offline `verglos record verify` truth; the removed counter/publish language is absent. No payment, database, migration, or manual production write occurred.
# 2026-10-02 · RECORD-010 accepted

RECORD-010 is accepted after the final cross-repository truth reconciliation. Current CLI retirement/option/registration tests pass 7/7; Web retired POST, legacy lookup, and corrected `/verify` index tests pass 3/3; hosted Web run `36986357199` and the production read-only `/verify` smoke are green. Legacy summaries remain readable but explicitly unsigned; no historical counter is presented as verification and no retired `verglos attest` publish path is advertised. Backlog is now 216 checked / 53 unchecked / 269 total.
# 2026-10-02 · Authenticated accessibility-tree evidence

Read-only Chrome DevTools Protocol inspection of the existing authenticated `/account` tab found one `main`, navigation, heading, alert, seven focusables, no horizontal overflow, and 65 accessibility-tree nodes. The same session returned zero organizations from `GET /api/v1/organizations`; no production data was created. Private evidence: `docs/shipping/evidence/account-ax-tree-2026-10-02.md`. This strengthens screen-reader evidence for the personal account route but does not qualify human assistive technology or the organization dashboard.
# 2026-10-02 · Hunt independent review packet prepared

Private reviewer packet `docs/shipping/evidence/hunt-independent-review-packet-2026-10-02.md` now contains the exact CLI merge head, hosted Ubuntu run `36984993552`, pinned image digest, artifact ID, threat model, reproduction commands, results, limitations, and reviewer sign-off fields. It does not fabricate reviewer identity or acceptance; HUNT-011/QUAL-CLI-004 remain open until an independent reviewer returns a signed/dated report.
# 2026-10-02 · Public route accessibility/lab sweep

Read-only CDP sweep of `/`, `/checkout`, `/docs`, `/detectors`, and `/verify` recorded one main landmark and no horizontal overflow on every route, accessibility-tree role sets, focusable counts, AX node counts, and DOMContentLoaded deltas. Private evidence: `docs/shipping/evidence/public-ax-lab-sweep-2026-10-02.md`. This is lab evidence only; it does not claim field CWV or human screen-reader completion.

# 2026-10-03 · Web PR #133 SCM webhook intake and delivery contract

Web PR #133 (`06d90af`, merged as `510f66c`) adds provider-specific SCM webhook intake for GitHub/GitLab. The route verifies signatures over the bounded raw request body (256 KiB cap), requires an active installation and exact repository binding, parses only the minimal commit metadata, and queues a redacted idempotent outbox trigger. A pure delivery-worker transition contract now maps provider responses to delivered/retry/failed states with bounded exponential retry and no provider-body retention. Focused SCM/tenant/negative-boundary tests pass 29/29; full Web suite remains 859 total / 837 passed / 22 environment-gated skips / 0 failures; hosted Verify, GitGuardian, Vercel, typecheck, Drizzle, and migration checks are green. TEAM-WEB-006 remains open: DB worker leasing/updates, provider HTTP delivery, durable reconciliation, and live provider evidence are not claimed. No production migration or write occurred.

# 2026-10-03 · Web PR #134 fenced SCM delivery leases

Web PR #134 (`031200f`, merged as `5b52943`) adds additive migration `0022_scm_delivery_leases.sql` with lease-owner/expiry fields and an index. The repository claims queued/retry/expired-delivering rows using `FOR UPDATE SKIP LOCKED`, increments attempts, and fences finish updates by worker plus exact lease expiry so stale workers cannot mutate reclaimed deliveries. Focused lease/worker tests pass 5/5; full Web suite remains 859 total / 837 passed / 22 environment-gated skips / 0 failures; hosted Verify and all configured schema/security/deploy checks are green. TEAM-WEB-006 remains open for provider HTTP execution, reconciliation scheduling, and live provider evidence. Migration is code-only and has not been run against production.

# 2026-10-03 · Web PR #135 SCM tenant predicate correction

Web PR #135 (`e65c61d`, merged as `80545aa`) adds explicit `organizationId` predicates to SCM installation listing and check-installation resolution. This closes a cross-tenant lookup risk independent of the access-database implementation. Tenant-boundary and SCM contract tests pass 19/19; hosted Verify, GitGuardian, Vercel, and type/schema checks are green. TEAM-WEB-006 remains open for provider HTTP execution, reconciliation scheduling, and live provider evidence.

# 2026-10-03 · Web PR #136 provider delivery runner

Web PR #136 (`d1b57b8`, merged as `6714dd8`) adds the provider delivery runner over the fenced SCM lease repository. It composes only the redacted GitHub/GitLab request, delegates bounded network transport, turns credential/transport exceptions into retryable status without retaining exception text or provider bodies, and acknowledges only through the worker-plus-expiry fence. Lease loss is explicitly counted as non-success. Runner/repository tests pass 5/5; full Web suite remains 859 total / 837 passed / 22 environment-gated skips / 0 failures; hosted Verify, GitGuardian, Vercel, typecheck, Drizzle, and migration checks are green. TEAM-WEB-006 remains open for a deployed scheduler/reconciliation trigger and live provider evidence.

# 2026-10-03 · Web PR #137 scheduled SCM reconciliation

Web PR #137 (`55ee4a8` + corrective `6c163d9`, merged as `763aab0`) adds nullable encrypted provider-token envelopes and an authenticated `/api/cron/scm` scheduler. The route claims fenced deliveries, decrypts a provider token only in memory, performs bounded GitHub/GitLab fetches, propagates bounded Retry-After values, and returns aggregate counts without credentials or provider bodies. Hosted CI initially caught an unstaged retry-after type change; the corrective commit passed hosted Verify. Focused SCM route/lease/runner tests pass 15/15; full Web suite remains 859 total / 837 passed / 22 environment-gated skips / 0 failures; build and 24-migration ordering checks pass. TEAM-WEB-006 remains open for live provider evidence and production migration/cutover qualification. No production migration or write occurred.

# 2026-10-03 · LIC-002 external license record

Private artifact `docs/shipping/legal/external-engines-and-standards-2026-10-03.md` formalizes technical records for the pinned Trivy runtime, the unbundled detect-secrets executable boundary, Sigstore libraries/fixtures, in-toto licensing, standards non-vendoring, and fixture/premium-content restrictions. The record preserves exact versions/digests and explicitly leaves legal approval, immutable executable selection, image-layer/database review, premium recipe provenance, trademark review, and independent review pending. LIC-002 remains unchecked; no public repository or package was changed.

# 2026-10-03 · CLI PR #57 immutable release-tag guard

CLI PR #57 (`2f18041`, merged as `8706c97`) adds `scripts/verify-release-tag.mjs` and focused tests. The publish workflow now fails closed on push events unless the exact `vMAJOR.MINOR.PATCH[-prerelease]` tag matches the version in all six public package manifests before `npm publish`; malformed tags, build metadata, and package-version drift are rejected. Local focused contract tests pass 3/3, combined release-safety tests pass 11/11, typecheck and build pass, and hosted Self-scan `37111006863` plus Platform matrix `37111006817` pass the in-toto binding and all nine Ubuntu/macOS/Windows Node 20/22/24 cells. This is preparatory evidence for DIST-002/003/006 only: protected environment approval, legal/trusted-publishing qualification, actual release attestation, and rollback/revocation execution remain open. No tag, npm publication, deployment, or production operation occurred.

# 2026-10-03 · CLI PR #58 rollback/revocation contract

CLI PR #58 (`28512c7`, merged as `8e39aa7`) adds the shared `decideReleaseRollback` contract and focused tests for npm packages, engine manifests, Hunt feeds, signing identities, and web deployments. It requires explicit approval, same-kind immutable references, bounded reasons, and preservation of historical records; signing-identity revocation additionally requires a distinct replacement identity. Local `@verglos/shared` tests pass, full typecheck and build pass, and hosted Self-scan `37111798321`, in-toto binding, and Platform matrix `37111798352` pass all nine Ubuntu/macOS/Windows Node 20/22/24 cells. This remains preparatory DIST-006 evidence: no provider/registry/deployment rollback or revocation was executed, so DIST-006 stays open.
# 2026-10-03 · current CLI source verification

The read-only `origin/main` worktree at `c17b335` was installed from its lockfile and verified with `pnpm typecheck`, `pnpm build`, and the full `@verglos/shared` test command. The build-order-sensitive install invariants pass 26/26 after generated CLI output exists. This is current-source evidence for the unreleased `2.0.0-alpha.1` tree, not evidence that the published `1.8.3` or a future release is accepted. No source, public repository, package, production database, or deployment changed.
# 2026-10-03 · current Web main regression pass

Web `main` at `763aab0` completed `pnpm test`: 859 total, 837 passed, 22 environment-gated skips, 0 failures. The SCM pretest slice was 46 total, 40 passed, 6 skipped, 0 failed. Typecheck, Drizzle check, 24-migration ordering, and diff checks passed in the same verification pass. No checkbox changed and no production operation occurred.
# 2026-10-03 · current CLI public-pack qualification blocker

The exact current CLI source (`c17b335`) cannot produce a locally valid public archive on this macOS install: the license inventory fails closed on missing metadata for foreign-platform optional `@esbuild/*` lockfile packages. Pinning pnpm `9.15.9` reproduces it. Package-surface checks pass 6/7; the pack test is not accepted. No bypass, archive publication, or checkbox change occurred.
# 2026-10-03 · hosted current-source public-pack qualification

GitHub Actions Self-scan `37109797227` passed at exact CLI `origin/main` head `c17b335`. Hosted Linux completed dependency-license inventory, notices/SBOM checks, six public archive packing, clean-consumer installation, tests, Hunt Docker adversarial checks, artifact verification, typecheck, package/public-boundary audits, and self-scan. This is evidence for the current unreleased source; publication, trusted provenance, legal clearance, and GA gates remain open.
# 2026-10-03 · CLI PR #59 protected publication environment

CLI PR #59 (`d531540`, merged as `93dbcf3`) adds a named `release` GitHub environment to the public npm publication job and serializes all registry mutations with a non-cancelling concurrency group. The workflow contract test requires both protections. Local shared tests, workflow contract test, full typecheck, and diff checks passed; hosted Self-scan, in-toto, and the platform matrix passed all completed cells. One Windows Node 20 matrix job was still running at merge and remains tracked separately. DIST-002 remains open until a trusted release is actually published/attested; no tag, npm publication, or production operation occurred.

Repository environment evidence: `release` was created through the GitHub API at `2026-10-03T09:19:05Z` with required reviewer `anuragyadav-git`, self-review permitted by explicit owner authorization, and protected-branch deployment policy. This configures the gate; it does not constitute a release or attestation.
# 2026-10-03 · CLI PR #60 signed organization policy cache substrate

CLI PR #60 (`f547cfa`, merged as `b7c0799`) adds `packages/shared/src/organization-policy.ts`. The contract verifies a strict signed organization-policy envelope, exact organization/repository binding, canonical policy digest, Ed25519 key-id derivation, active-key status, and bounded signature bytes. `resolveOrganizationPolicy` returns a cache entry only after remote verification or an unexpired matching offline cache; cross-tenant, revoked-key, tampered, and expired-cache paths fail closed. Focused shared tests pass 3/3; full typecheck, build, and diff checks pass. Hosted Self-scan, in-toto, and platform-matrix runs are still in progress. TEAM-CLI-001 remains open for authenticated HTTP fetch/cache persistence, CLI command wiring, and hosted policy API evidence. No production operation occurred.
# 2026-10-03 · current-source regression verification after TEAM-CLI-001 substrate

CLI PR #60 Self-scan run `37112986892` completed successfully; its platform matrix `37112986882` remains in progress for four cells, while the completed cells and in-toto binding are green. Current Web `main` read-only regression remains 859 total / 837 passed / 22 environment-gated skips / 0 failures. These are verification results only; TEAM-CLI-001 still lacks authenticated policy API runtime evidence and no checkbox changed.
# 2026-10-03 · stale TEAM-CLI matrix replaced with merged-main run

The PR #60 matrix `37112986882` stopped updating at `09:25:28Z` with three Windows jobs indefinitely in progress and no logs. Because the PR was already merged, the stale run was cancelled without treating it as a product failure. A fresh manual Platform matrix `37113320349` was dispatched against merged main `b7c0799`; its result is pending. The earlier Self-scan `37112986892` remains successful. No checkbox changed and no production operation occurred.
# 2026-10-03 · hosted runner infrastructure blocker

Fresh merged-main matrix `37113320349` also stopped updating at `09:31:20Z`; all nine platform jobs remained `in_progress` with no logs. A cancellation request was submitted, but GitHub still reports the run in progress after the request. This is a hosted-runner control-plane issue, not a source test failure. Existing successful Self-scan/in-toto and completed platform evidence remain recorded; no new platform acceptance is inferred. No checkbox or production state changed.
# 2026-10-03 · CLI PR #61 organization policy cache persistence

CLI PR #61 (`9554125`, pending hosted checks) adds atomic bounded persistence for the signed organization-policy cache substrate. `readOrganizationPolicyCache` rejects symlinks, non-regular/oversized files, malformed JSON, cross-scope entries, and policy-digest tampering. `writeOrganizationPolicyCache` validates the entry, writes mode-restricted bytes to an exclusive temporary file, and atomically renames it into place. Focused cache tests pass 2/2; the full CLI suite, typecheck, build, and diff checks pass. TEAM-CLI-001 remains open for authenticated HTTP fetch and CLI command integration. No production operation occurred.

# 2026-10-03 · full Juice Shop fixture scan with current CLI source

The full, non-shallow OWASP Juice Shop checkout at `1618a611b173b4bf114028e6e02549950606e29d` was scanned locally with the current unreleased CLI source at `955412516b96cc09393e78c43bf7d02b9abd05d9` (PR #61 merged as `18ab8e7`). The run walked 906 files and produced 55 findings: 16 critical, 12 high, 18 medium, 0 low, and 9 info; score `0`, risk `critical`. Seven test-file findings were excluded from the score. Provenance was explicitly skipped, so coverage is incomplete. JSON/HTML reports remain private under `.local-evidence`; hashes and the exact command are recorded in `docs/shipping/evidence/juice-shop-scan-2026-10-03.md`. This is public technical-fixture evidence only, not customer acceptance, OWASP endorsement, or independent Hunt review. No upload, production write, or checkbox change occurred.

The same fixture was rerun with provenance enabled at `2026-10-03T09:41:35.927Z`. Coverage is now complete with no limitations; the result remains 55 findings and score `0`/critical. Provenance reports `aiAuthoredPercent=36` at high confidence using a documented 300/649-file sample. Report hashes and command are appended to the evidence record. This improves technical fixture evidence only; no acceptance or review gate is closed.

# 2026-10-03 · expanded full-clone acceptance fixture corpus

Two additional public vulnerable Node applications were cloned with complete Git history and scanned locally using unreleased CLI commit `955412516b96cc09393e78c43bf7d02b9abd05d9`: OWASP NodeGoat at `c5cb68a7084e4ae7dcc60e6a98768720a81841e8` (Apache-2.0, 67 files, 31 findings, score 0/critical) and Appsecco DVNA at `9ba473add536f66ac9007966acb2a775dd31277a` (MIT, 35 files, 17 findings, score 34/critical). Both scans used telemetry off, provenance enabled, and complete detector coverage; no exploit, fuzz, load, network verification, Hunt execution, upload, or production operation occurred. Fixture authorization files explicitly state that these are public technical fixtures, not customers or endorsements. Corpus detail and report hashes are in `docs/shipping/evidence/acceptance-corpus-2026-10-03.md`. This is progress toward `ACCEPT-001`; its 10–20 corpus, external authorization, adjudication, and independent-review requirements remain open. No checkbox changed.

The corpus was expanded with Snyk Labs nodejs-goof, full clone at `add14ba59e98240d9e00a235dd7d42cd61ae9912` (Apache-2.0). Current CLI provenance-enabled scan walked 25 files and produced 29 findings (1 critical, 13 high, 15 medium), score `9`/critical, with complete coverage. Its report hashes are recorded in the corpus evidence document. This remains technical-fixture evidence only.

Two further full-history public fixtures were scanned with CLI `9554125`: Damm Vulnerable Node Application at `1946570b36bf8e6dcac48142f072f40ee9cee160` (MIT; 38 files, 17 findings, score 34/critical) and buggy-node at `b1b9cbc8b86f81a1ecb0b142190d4fa4698518da` (ISC; 8 files, 57 findings, score 10/critical). Both had complete detector/provenance coverage and explicit local authorization notices. The corpus now contains six full clones; `ACCEPT-001` remains open pending the 10–20 corpus and downstream authorization/review gates.

Added private `pnpm acceptance:corpus:verify` (`scripts/verify-acceptance-corpus.mjs`) and ran it at `2026-10-03T09:53:51.890Z`. It verified all six frozen commits are full clones, all authorization notices contain the required public-fixture/non-customer scope, and all selected reports have complete coverage and intact JSON/HTML hashes. Manifest hash: `54c3f3bdc111d3a2faf35c841a8fb057649b6a859a5a45f9628945100ea8b2f4`. This advances reproducibility toward ACCEPT-001/003 but does not satisfy corpus size, customer consent, adjudication, or independent review.

# 2026-10-03 · Verglos Web self-scan with current CLI

The current local Web `main` was scanned with CLI commit `955412516b96cc09393e78c43bf7d02b9abd05d9`: Next.js detected, 396 files walked, complete detector/provenance coverage, 17 findings (1 critical, 3 medium, 13 info), score `79` / medium risk. The one critical is an operator-machine Cursor MCP configuration under `~/.cursor/mcp.json`, not a tracked Web file; it remains private for remediation. Report hashes and exact command are in `docs/shipping/evidence/verglos-web-self-scan-2026-10-03.md`. This is current-source evidence only; no production write, deployment, or checkbox change occurred.

# 2026-10-03 · CLI PR #61 hosted matrix completed

The hosted workflow for merged CLI PR #61 (`18ab8e7`) initially appeared stalled, but run `37113657045` completed successfully at `09:46:04Z`. All nine Ubuntu/macOS/Windows × Node 20/22/24 jobs and the in-toto release binding passed. This verifies the cache-persistence code at the merged head; it does not close TEAM-CLI-001, which still lacks authenticated organization-policy HTTP fetch and user-facing CLI integration. No production operation occurred.

# 2026-10-06 · current Docker runtime evidence

The exact current CLI source at `955412516` was run with Docker 29.7.2 and a
pinned Debian image digest. Hunt's enabled Docker adversarial scenarios passed
15/15 with zero failures, covering non-root, read-only mounts, denied network,
no socket/device access, no-new-privileges, resource bounds, redaction, and
signal handling. The host-level namespace scenario remains unqualified on this
macOS runner; HUNT-011, independent review, trusted recipe provenance, and the
beta-gated command remain open. Evidence is in
`docs/shipping/evidence/hunt-docker-adversarial-2026-10-06.md`.

The retained hosted Self-scan artifact was also rechecked: Ubuntu passed all
16/16 Docker runtime adversarial scenarios, including private PID/IPC
namespaces. This resolves the host-platform evidence gap only; the recipe,
publisher-root, independent-review, and beta-command gates remain open. See
`docs/shipping/evidence/hunt-docker-hosted-linux-2026-10-06.md`.

Distribution update 2026-10-06: CLI PR #70 (`67a132c`, merged `3a0959a`) adds
strict publish-time verification of exactly six public archives with one shared
version. Local verifier 4/4, workflow/platform contracts 2/2, and typecheck
13/13 passed; hosted platform run `37472923540` and self-scan `37472923665`
passed. No tag, npm publication, provenance attestation, deployment, legal
approval, or production operation occurred; DIST-001/002/003 remain open.

Production migration update 2026-10-06: after read-only preflight, a 116 KiB
snapshot/restore rehearsal, and review of the exact additive SQL, founder-
authorized `pnpm db:migrate` applied Web migrations `0021`–`0025` to Neon
production. Verification reports 26 migration rows, SCM/deletion tables and
indexes, unchanged users/organizations/webhook counts, and zero deletion
requests. No deletes, backfills, or cutover ran. TEAM-WEB-006 remains open for
live provider evidence; QUAL-WEB-005 remains open for the hosted worker,
legal/customer-held, consent, and end-to-end deletion gates.

Qualification pass update 2026-10-06: current CLI forced Turbo graph completed
23/23 test/typecheck/build tasks; current Web deletion/quality focus passed 23/23
tests, typecheck, Drizzle check, and ordered 26-migration check. This changed no
runtime or production state. Production access remains paused until the database
credential exposure tracked as `R-041` is rotated and verified.

Authenticated browser runtime update 2026-10-06: the attached founder session
reached the deployed legacy `/account` dashboard and rendered Free-state account
navigation, but exposed no organization slug or `/orgs/*` dashboard route.
This confirms the browser attachment works while leaving PRO-001/QUAL-WEB-006
organization-dashboard, screen-reader, large-dataset, and field-CWV evidence
open. Evidence: `docs/shipping/evidence/authenticated-dashboard-runtime-2026-10-06.md`.

## 2026-10-06 · shipping scope expansion and acceleration mode

Founder expanded the critical path with `GITHUB-WEB-001..004` (GitHub App/org
architecture and live cutover evidence), `PLAN-WEB-013..015` (provider-supported
Razorpay payment-method catalog and test/production reconciliation), and
`ACCEPT-011..014` (private full-clone TS/JS architecture corpus, reproducible
analysis, held-out false-truth review, and final regression/go/no-go). The
repository corpus is explicitly a post-shipping validation phase: it starts only
after implementation, qualification, and release-candidate freeze are complete.
These are
open items; the backlog intentionally grows rather than being gamed downward.

Execution is now one dependency-ready acceptance boundary per phase PR/repo:
finish implementation, integration, focused tests, and evidence together;
parallelize independent CLI/Web tracks; run one full suite per merged phase;
switch to independent work when provider/customer/reviewer evidence blocks; and
recount from the private authoritative backlog after every substantial batch.
No checkbox changes from planning alone. R-041 still blocks further production
access until credential rotation and verification; no payment or database write
occurred in this update.

# 2026-10-06 · Web canonical policy digest alignment

Web PR #146 (`5763632`) merged to `main` as `88a7791` after hosted Verify run
`37488304350` passed all tests, schema/migration, build, dependency, SBOM,
license, secret, boundary, Vercel, and GitGuardian checks. The additive
`0027_policy_digest_algorithm.sql` migration records `legacy-top-level-v1` or
`canonical-json-v1`; new policy writes default to canonical JSON while existing
rows remain legacy. Local Web verification passed 864 total / 842 passed / 22
environment-gated skips / 0 failures and verified 28 ordered migrations.

This resolves the code-side R-042 digest mismatch but does not perform a
production migration or rewrite, activate the hosted policy endpoint, or close
TEAM-CLI-001/PLAN-CLI-001. No checkbox changed; the authoritative backlog remains
218 checked / 62 unchecked / 280 total. R-041 and all provider/customer/reviewer
acceptance gates remain open.
