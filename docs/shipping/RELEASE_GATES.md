# Verglos V1 release gates

## PLAN-CLI-004 hosted verification · 2026-10-07

CLI PR #72 head `059918cf920d136ded4528ad7512b82026459ece` is open, mergeable,
and GitHub reports merge state `CLEAN`. Platform run `37550255842` passes
in-toto and all Ubuntu/macOS/Windows Node 20/22/24 cells; self-scan
`37550255844` passes. This is terminal code/packaging verification only and
does not close PLAN-CLI-004 or Gate 0/5: deployed signer/catalog alignment,
old-token migration, hosted activation, production safety, and R-041 rotation
remain open. No production operation occurred.

## QUAL-WEB-006 browser continuation · 2026-10-07

The authenticated account shell remains clean in read-only Chrome DevTools:
Lighthouse snapshot Accessibility/Best Practices/SEO are each 100 on desktop
and mobile, and the fresh desktop trace reports LCP 689 ms and CLS 0.00. The
agentic score is 50 solely because the audit reports `llms.txt`; the public
route currently returns a valid H1. Local PR #149 execution without secrets
fails closed before creating a payment request. This does not close
QUAL-WEB-006 or Gate 2/3/4: organization/Pro and large-data rendering,
screen-reader, field-CWV, and payment/provider lifecycle evidence remain open.
No production operation occurred.

## PLAN-WEB-013 code-side gate update · 2026-10-07

Web PR #149 (`eb7e55a`) moves the customer path from QR-only to catalog-gated
Razorpay hosted orders, with signed commercial binding, webhook-authoritative
entitlement, read-only status, explicit QR opt-in, and successful-order
uniqueness. Local Web 850/872/22/0, focused 19/19, typecheck/build/Drizzle/
31-migration/diff checks pass. GitGuardian, hosted typecheck/schema, Vercel,
and Preview Comments pass; GitHub reports the PR merge state `CLEAN`. This
does not close PLAN-WEB-013/014/015 or Gate 4/6: account-enabled test-mode
method/lifecycle evidence, production reconciliation, Node 22 hosted
verification, R-041 rotation, and required restore/rollback evidence remain
open. No production operation occurred.

## QUAL-CLI-006 / DIST-001 / DIST-003 qualification · 2026-10-06

The merged CLI `dacd286` passed 20/20 release-script tests, six-package
packing, package/boundary/tag audits, clean-consumer installation, and the
`1.8.3 -> 2.0.0-alpha.1 -> 1.8.3` upgrade/rollback transition. The strict
verifier remains OPEN because the inventory contains eight unresolved
redistribution reviews: six BlueOak-1.0.0 packages, the nested
`benchmark@1.0.0`/`fast-uri@3.1.7` license conflict, and missing source for
`minipass-pipeline@1.2.4`. No publication, tag, deployment, production access,
or customer operation occurred. R-041 remains open. Evidence:
`docs/shipping/evidence/qual-cli-006-dist-release-artifacts-2026-10-06.md`.

## PLAN-CLI-001/004 addendum · 2026-10-06

CLI PR #71 (`937705b`, `fa4a131`, `714cb3e`) merged as `dacd286` hardens the
opaque catalog-version and simulation-cache contract with local and hosted
evidence. Hosted run `37497389053` passes self-scan, in-toto, and all nine
platform cells. It is still preparatory code-side evidence only: it does not
satisfy production signer activation, trust-root alignment, live token
issuance, or final release gates. No gate checkbox or backlog count changes
from this batch; R-041 continues to block production operations.

## HUNT-009 boundary review · 2026-10-06

The public CLI must not declare private `@verglos/hunt` or embed private Hunt
runtime code as an unreviewed workaround. The attempted functional wiring was
removed before commit; typecheck/tests/build/public-boundary/diff checks pass.
Public packing is not credited because the local pnpm license command fails on
missing `turbo@2.10.6` package-index metadata. HUNT-008/009/010/011 and
QUAL-CLI-004 remain open; the alpha shell stays exit-78.

Founder authorization checkpoint (2026-10-02): approval was given to proceed with the final public truth/copy pass after prerequisites, a real billing/provider checkout test, authorized customer acceptance workflows, legal/licensing review, and independent Hunt isolation review. The authorization does not replace evidence. Current read-only inspection found no billing credentials or linked Vercel access, no authorized customer repository/fixture artifact, no legal approval record, and no independent Hunt review package. Those gates remain open; no production checkout, deployment, customer workflow, legal assertion, or independent-review claim occurred.

QUAL-WEB-001 progress (2026-09-30): Web PR #115 tested head `b3dfd77` merged as `4d2051e4`; CLI-style headers and forged organization/license/role/plan/capability/allowance/usage/record fields remain ignored in favor of server-derived entitlement claims. Focused route/boundary tests pass 10/10; hosted run `36705118215`, GitGuardian, and Vercel pass. Gate remains OPEN pending complete list/search/export/public-private runtime evidence. No production operation occurred.

QUAL-WEB-001 progress (2026-09-30): Web PR #114 tested head `f79a7a5` merged as `88a809d3`; the protected route matrix now carries forged tenant/project/plan/allowance query fields alongside forged bodies while path authorization and non-cacheable denial invariants remain green. Hosted run `36704670862`, GitGuardian, and Vercel pass. Gate remains OPEN pending complete modified-CLI and list/search/export/public-private runtime evidence. No production operation occurred.

QUAL-WEB-001 progress (2026-09-30): Web PR #113 tested head `39dfb64` merged as `24232db2`; direct public receipt JSON coverage rejects invalid identities with forged tenant/project query fields without reflection and preserves `no-store`. Combined boundary tests pass 4/4; hosted run `36704251024`, GitGuardian, and Vercel pass. Gate remains OPEN pending complete modified-CLI and list/search/export/public-private runtime evidence. No production operation occurred.

QUAL-WEB-001 progress (2026-09-30): Web PR #112 tested head `4548734` merged as `517df10c`; every protected organization API route is now invoked through its real handler with forged body authority fields and denial responses are asserted non-cacheable (`no-store` or `private, no-store`). Focused negative-boundary tests pass 2/2; hosted run `36703830835`, GitGuardian, and Vercel pass. Gate remains OPEN pending complete modified-CLI and direct list/search/export/public-private runtime evidence. No production operation occurred.

QUAL-CLI-006 progress (2026-09-30): an isolated Docker run with official `in-toto==3.0.0` generated and verified a signed synthetic root layout plus link using `in-toto-verify --verification-keys`; verification succeeded. This is format/verification smoke only, using an ephemeral key and synthetic materials. Gate remains OPEN pending actual release-pipeline binding and trusted keyless Sigstore/Fulcio/Rekor evidence. No production operation occurred.

PLAN-CLI-004 progress (2026-09-30): CLI PR #50 tested head `9ff21be` merged as `f16c6f1`; frozen server-shaped plan/catalog fixtures cover Free/Pro/Team/Studio/Enterprise and malformed responses fail closed to Free without stale paid reuse. Hosted run `36700076759` passes the complete nine-cell platform matrix and self-scan `36700077215` passes. Gate remains OPEN: deployed signer/catalog alignment, supported-version old-token migration evidence, and hosted activation integration are still required. No production operation occurred.

QUAL-WEB-001 progress (2026-09-30): Web PR #103 merged as `0a85f08` after hosted run `36686440312`, adding malformed/traversal/zero-UUID organization-ID probes across every protected organization API method with fixed denials, no identifier echo, and authorization-before-data-access. Web PR #104 merged as `98169fa` after hosted run `36689496063`, proving forged plan/tier, tenant, capability, allowance, usage, and record fields are ignored by v2 entitlement issuance in favor of server-resolved license, tenant, role, and catalog values. QUAL-WEB-001 remains OPEN: complete modified-CLI request coverage and list/search/export/cache/public/private boundary evidence are still missing. No production operation occurred.

QUAL-WEB-001 cache-boundary progress (2026-09-30): Web PR #105 merged as `6cb6734` after hosted run `36690136102`. Private receipt list/detail responses now set `private, no-store` across invalid, denied, not-found, validation, allowance, conflict, idempotent, integrity-failure, and success paths; local tenant-scope contract tests pass 11/11. QUAL-WEB-001 remains OPEN pending the complete modified-CLI and list/search/export/cache/public/private matrix. No production operation occurred.

QUAL-WEB-001 private evidence/evaluation cache-boundary progress (2026-09-30): Web PR #108 merged as `7279ef2` after hosted run `36691398858`. Evidence and policy-evaluation list/create routes now set `private, no-store` across invalid, denied, validation, not-found, conflict, idempotent, storage-failure, and success paths; local tenant-scope contract tests pass 12/12. QUAL-WEB-001 remains OPEN pending complete modified-CLI and list/search/export/cache/public/private matrix evidence. No production operation occurred.

QUAL-WEB-001 organization API cache-boundary progress (2026-09-30): Web PR #110 merged as `18ddb408` after hosted run `36692358099`. Organization directory, member, project, policy, and release routes now set `private, no-store` across every response path; local tenant-scope contract tests pass 13/13. QUAL-WEB-001 remains OPEN pending modified-CLI and direct list/search/export/runtime public-private matrix evidence. No production operation occurred.

QUAL-WEB-001 private account/API cache-boundary progress (2026-09-30): Web PR #111 merged as `c83300b` after hosted run `36693118104`. Account sync, CLI-auth, license status, score history, and monitor routes now set `private, no-store` across response paths, including paid-license denials; combined focused contract tests pass 17/17. QUAL-WEB-001 remains OPEN pending modified-CLI and direct runtime list/search/export/public-private matrix evidence. No production operation occurred.

QUAL-WEB-001/005/006 progress (2026-09-30): Web `82d2157` + `a24fef7` on `feat/web-qual-batch` add pure authorization/privacy/accessibility qualification classifiers. Focused tests pass 18/18; exact-branch configured suite passes 830/852 with 22 environment-gated skips; typecheck and production build pass. PR #100 merged as `666317e` after hosted checks passed. These commits do **not** close Gate 2/3/4 or the backlog items: route-level account deletion/consent and hosted privacy evidence, real browser/screen-reader/CWV measurements, and complete modified-CLI/authorization boundary coverage remain open. No production operation occurred.

PLAN-WEB-011/012 gate update (2026-09-20): Web PR #49 exact head `b103d9e5793913b52207af0497586159dc16cc15` implements catalog-only checkout values, signed immutable one-time commercial snapshots, captured/exact-match fulfillment, owner-bound read-only status, and a PostgreSQL ledger for serialized renewals, immutable payment identity, replay/conflict handling, chronological lifecycle, failure, expiry, and partial/full refunds. Local blank-DB suite passes 291/292 with one intentional migrated-ledger skip; that integration passes separately against all 19 migrations. Typecheck, schema/migration checks, build, security/boundary/SBOM/license gates, hosted run `35503776577`, GitGuardian, and Vercel preview pass. Gate 4 remains OPEN: Pro has no approved verified INR catalog price, migration `0018` lacks production backup/restore/rollback evidence and is unapplied, production configuration is not inspectable with the installed credential, and no live gateway lifecycle reconciliation exists. PR #49 remains open/unmerged; no production operation occurred.

DIST-WEB-002 gate update (2026-09-20): Web PR #49 exact head `76e58f42fd5ebc7954c5883a5e36fda64eaeedf6` makes the complete production runtime matrix fail closed for auth, credentialed PostgreSQL/no explicit TLS disablement, Ed25519 signing, channel encryption, live billing/auth keys and all billing integers, approved PostgreSQL queue/JSONB storage selectors, cron, and canonical `https://verglos.com`, with value-free diagnostics. `.env.example` matrix drift, invalid production failure, complete production success, and Node startup behavior are tested. Local isolated-PostgreSQL suite passes 286/286; all local schema/build/security/license gates and exact-head hosted Node 22 run `35502251082`, GitGuardian, and Vercel preview pass. Gate remains OPEN: the installed Vercel credential is unauthorized for the linked scope, so actual production variable names/scopes and a production deployment are unverified. PR #49 remains open to avoid a fail-closed main deployment before the two provider selectors can be confirmed/provisioned. No production env/DB value was read and no production operation occurred.

LIC-002 inventory addendum (2026-09-14): private third-party inventory now matches the pinned Trivy adapter, explicit-path detect-secrets probe, Sigstore runtime/test assets, current standards handling, and existing public-source fixtures. Gate 5 remains OPEN: no authenticated publisher root/content feed or approved premium rule/recipe license, provenance, modification, customer-license, and trademark terms exist; the scanner fixture authorship/source decision is unresolved. No redistribution clearance is inferred, and the update did not mark LIC-002 complete.

OPS-001 queue contract progress (2026-09-14): Web PR #33 exact head `3377a26bddbd0998ab82d0d98695473427434aec` passes `34846092388` (112/112 PostgreSQL-backed tests, typecheck/schema/17-migration checks/build/security/license/public-boundary), GitGuardian, and Vercel. The provider-neutral interface is preparatory progress only; OPS-001 remains unchecked because the canonical architecture defers provider selection pending workload, security/privacy, recovery, exit, and actual-cost evidence. Existing PostgreSQL tables do not establish provider suitability. No queue worker/producer is activated. No production DB/environment action occurred.

VERIFY-WEB-001 acceptance addendum (2026-09-14): Web PR #33 exact head `2d89869e75d3d0316bf71e94d585a64bff8e34ef` passes PostgreSQL-backed route integration and full hosted verification (run `34835571918`, 98/98 tests; typecheck/schema/17-migration checks/build/dependency/SBOM/license/secret/public-boundary checks; GitGuardian; Vercel). This qualifies authenticated bounded redacted-projection ingestion and tenant-scoped idempotency only. It does not qualify original `.vgl` verification, object custody, production data cutover/backfill, backup/restore, or release. No production DB operation or deployment occurred in this batch.

RECORD-006 qualification addendum (2026-09-14): CLI PR #38 `4545eb4` implements explicit caller-token keyless signing, scoped approval, official Sigstore verification against the supplied trust root and exact issuer/identity, offline verification, and optional package-v1.1 bundle evidence. Exact-head self-scan `34833650330`, all nine platform cells in `34833650299`, focused 13/13, and uncached 18/18 local Turbo tasks pass. This is code/contract qualification only: the Sigstore network was mocked, no public Rekor entry was created, no interactive user login/plan gating is implemented, and npm publication/release/legal clearance remain open. Do not equate acceptance of RECORD-006 with release readiness.

Web runtime-config gate addendum (2026-09-13): commits `5f74817`/`1ce37f9`/`75b9a48` on Web PR #33 fail closed for the implemented production auth, database, signing, encryption, billing, cron, and public URL controls at Vercel production build and Node server startup, with no-secret-output process tests. Local full Web tests 91 passed / 2 DB integration tests skipped, typecheck/build/schema/17-migration/public-boundary checks pass; exact-head run `34774125271`, GitGuardian, and Vercel pass. This does not complete DIST-WEB-002: durable queue/object-storage providers remain unselected under OPS-001, and the actual production environment matrix is unverified because the available Vercel token lacks access to the linked project scope. No production env values were read and no deployment occurred.

Latest checkpoint (2026-09-12; supersedes dated gate snapshots below): approved web production base-schema migration `0000`–`0014` ran successfully through `pnpm exec drizzle-kit migrate` using Vercel production env. Postflight verifies 33/33 declared public tables, 15 migration-history rows, original 10 table counts unchanged (74 aggregate rows), 23 new tables empty, zero sentinel license rows, `pro` default, and all three project contract columns. A time-based temporary branch from production reproduced the 10-table/74-row baseline and was deleted. This closes only the approved schema-apply operation—not HOSTED-013, production backfill/dual-write, application cutover, or full recovery qualification. Web PR #32 remains OPEN/CLEAN at `67bbe09`; hosted Node 22 workflow `34694532678`, GitGuardian, and Vercel pass. `DIST-WEB-001` remains accepted; the 413-component license inventory still has 79 manual-review flags (53 missing declarations), so legal clearance is not inferred and R-018 remains open. Backlog: 150 unchecked / 119 checked / 269. No application deployment, PR merge, or public-copy change.

Production data audit addendum (2026-09-12T17:48:12Z): read-only repeatable-read audit confirms source counts/digests for all 74 legacy rows and 15 applied migrations; details are private in `PRODUCTION_SOURCE_AUDIT_2026-09-12.md`. This does not qualify a data migration, backup/restore, rollback, or cutover. HOSTED-013 remains open. Production schema expansion is complete; independent shipping batches need not wait for backfill implementation.

Production migration execution (2026-09-12): exact owner approval was received after presenting scope. A fresh read-only preflight identified Neon branch `production`, 10/33 tables, 74 aggregate rows, no journal, 0 sentinel rows, and `licenses.plan` default `'pro'::text`. Local `pnpm db:check` and `pnpm db:migrations:check` passed. `pnpm exec drizzle-kit migrate` exited 0; read-only postflight confirmed the full expected result. Point-in-time branch rehearsal succeeded and the branch was deleted. HOSTED-013 remains unchecked because no user-data backfill/dual-write/cutover or source-to-target reconciliation was executed; those are separate writes requiring their own exact plan and approval. The broader release is not authorized by this schema migration.

Production migration gate update (2026-09-12): bounded repeatable-read/read-only audits found 10/33 declared application tables present, 23 missing, no discoverable migration-history table, and aggregate exact counts totaling 74 rows across present tables. No customer row values were selected. The role can perform DDL/DML outside the read-only transaction. All 15 migrations replay on a disposable schema-only production clone; replay on a clean-empty DB fails because `0000` requires the pre-existing `licenses` baseline. Neon management API `GET /api/v2/projects` returned HTTP 401 using the separate `neon-api-key`, so provider backup/snapshot schedule metadata remains unknown. This is a blocking discovery, not migration readiness. HOSTED-013/R-021 still require identified legacy baseline/history, source-data inventory and reconciliation, signed audit evidence, approved exact migration plan, tested backup/restore and rollback, and independent review. No production write/migration occurred.

Migration replay gate addendum (2026-09-12): 87 existing column names/types/nullability values match Drizzle, but schema constraints/defaults/indexes/grants remain unverified. `0000`'s only data update currently matches zero `sentinel` license rows, but it still changes a column default. No migration-history record or tested snapshot restore was available. `pnpm db:migrate` remains prohibited on the production endpoint pending exact reviewed plan and all restore/reconciliation gates.

Migration gate update (2026-09-12): web `9eba73d` adds a local read-only audit command; local 86/86 tests and build/type/schema/migration checks pass, hosted run `34679868578`, GitGuardian, and Vercel pass. The command observed an empty isolated DB, not production data. HOSTED-013 and R-021 still require a complete/reproducible baseline, authorized source snapshot, signed manifest, mapping/reconciliation evidence, tested rollback, and independent review; this helper does not satisfy or authorize those gates. Backlog count unchanged at 152 unchecked / 117 checked / 269.

LIC-002 record update (2026-10-03): private artifact `docs/shipping/legal/external-engines-and-standards-2026-10-03.md` records exact technical provenance for pinned external engines, libraries, fixtures, and standards handling. It deliberately does not assert legal approval, redistribution permission, premium-content rights, trademark clearance, or independent review. LIC-002 remains OPEN and the release remains fail-closed for unresolved classifications.

Local Hunt runtime revalidation (2026-09-12): Docker Desktop integration against pinned BusyBox passes all 15 runtime assertions; Hunt package aggregate 51 pass / 1 macOS namespace skip. HUNT-011/QUAL-CLI-004 remain open; the skip is not treated as a pass and Linux-host evidence/independent review are still required.

Hunt planning/A1/verdict update (2026-09-20): CLI PRs #43/#44 pass both local 23/23 task graphs and all exact-head hosted checks. HUNT-003/004/007 are accepted: planning requires trust and binds exact finding/rule/subject; A1 is a fixed pure-probe harness explicitly labeled non-isolating; verdict precedence cannot turn infrastructure failure into `not-reproduced`. Gate 2 remains OPEN because HUNT-008-011, authenticated/licensed recipe coverage, Linux adversarial namespace evidence, and independent review are incomplete. The public Hunt execution command remains disabled.

Webhook/input qualification update (2026-09-20): Web PR #48 exact head `508cde0` passes 280/280 isolated-PostgreSQL tests, all local quality/schema/build/boundary checks, Node 22 hosted verification, GitGuardian, and Vercel preview. QUAL-WEB-002 is accepted for address-pinned SSRF/rebinding defense, redirects, IP-family/private/link-local/metadata cases, bounded inputs/responses/time, egress failures, and inbound HMAC/event-replay handling. Gate 2/4 remain OPEN: platform egress allowlisting/proxying, per-destination outbound webhook signatures, production migration `0017`, the R-021 foundational migration/backfill boundary, and broader operations/load qualification are not complete.

## Gate 0 — Truth and scope

- Current capability registry reconciled with code/tests.
- Every command and plan has a shipped/partial/planned label.
- Open-core, premium content, third-party licenses, notices, and trademark boundaries reviewed.

### PLAN-CLI-003 progress · 2026-10-06

The authenticated usage/record request matrix has code and hosted CI evidence
at Web PR #147 / merge `7248919`. Forged authority fields are rejected or
ignored before server-side ledger/persistence decisions. The release gate
remains open for the authenticated production probe and the complete
list/search/export/cache/public-private runtime matrix; no production evidence
is inferred from this code batch.

## Gate 1 — Evidence correctness

- Subject identity is immutable and digest-bound.
- Native and imported observations preserve attribution.
- Duplicate, malformed, stale, and mismatched evidence tests pass.
- Engine absence/staleness yields `INCOMPLETE`, never false `PASS`.

## Gate 2 — Security and agent safety

- No target-code execution during ordinary scanning.
- Hunt recipes are signed, bounded, isolated, redacted, and network-denied by default.
- SSRF, path traversal, archive bomb, symlink, malformed input, resource exhaustion, webhook, and tenant-boundary tests pass.

## Gate 3 — Product and UX

- Local viewer answers release decision before deep evidence.
- Developer, lead, client, and procurement views are understandable without founder explanation.
- Keyboard, screen reader, contrast, reduced motion, and machine-readable alternatives pass.

## Gate 4 — Commercial and operations

- Server-side seats, quotas, retention, overages, billing, and modified-CLI tests pass.
- Idempotency, retries, dead letters, restore drill, rollback, alert delivery, and monitoring pass.
- Per-plan hosted COGS and support cost are measured; no unbounded managed execution exists.

## Gate 5 — Distribution and licensing

- Clean install/upgrade/rollback on supported macOS, Linux, and Windows architectures.
- Trusted npm provenance, dependency SBOM, `THIRD_PARTY_NOTICES`, license validation, attribution, and modification notices are complete.
- Current state (2026-09-12): OPEN. LIC-001/004 and HOSTED-011/012 are accepted; CLI PR #34 self-scan and all nine Ubuntu/macOS/Windows Node 20/22/24 cells pass. Web PR #32 head `0d9a185` passes hosted run `34678019063`, GitGuardian, and Vercel, including 82/82 PostgreSQL-backed tests and all build/schema/security checks. PLAN-WEB-001/002 are accepted: catalog-derived server capabilities and explicit commercial/allowance states are implemented, while PLAN-CLI-001 and R-031 gateway/checkout reconciliation remain open. R-007 operator/provider privileged-access controls remain open. DIST-001 stays open behind LOCAL/HUNT/RECORD dependencies. Publishing remains fail-closed because the nested `benchmark@1.0.0` ISC/BSD-3-Clause conflict needs review; LIC-002 external content records, web redistribution review, release-note qualification, protected publish controls, and full amd64/arm64 install/rollback evidence remain open.

## Gate 6 — External acceptance

Current web update (2026-09-12): PR #32 head `0d9a185` is OPEN/MERGEABLE; hosted Node 22 run `34678019063`, GitGuardian, and Vercel pass. CI passes 82/82 tests with PostgreSQL, typecheck, schema/migration checks, production build, public-boundary, dependency, and tracked-secret checks. HOSTED-011/012 and PLAN-WEB-001/002 are accepted. Backlog count: 152 unchecked / 117 checked / 269. PR #34 also remains open; no merges or deployments were performed.

Web verification addendum (2026-09-12): PR #32 head `21c3b19` passes Node 22 run `34672637622`, including PostgreSQL integration, typecheck, full suite, schema/migration checks, build, public-boundary, dependency, and secret checks; GitGuardian and Vercel pass. HOSTED-011 is accepted at the verified PR head. HOSTED-012 route-level non-member/role-denial and existence-hiding evidence remains incomplete.

- Feature-complete release candidate tested against frozen public and authorized repositories/artifacts.
- Acceptance stories in `VERGLOS_FINAL_ACCEPTANCE_AND_POC.md` pass.
- Truth registry, docs, dashboard labels, pricing copy, and campaign claims updated only after evidence review.
Release-safety addendum (2026-10-03): CLI PR #57 (`8706c97`) now enforces that a future release tag matches all six public package versions before publication. Hosted self-scan and the full nine-cell platform matrix pass at the exact PR head. This hardens the DIST-002/003/006 prerequisite surface but does not satisfy protected-environment approval, legal/trusted-publishing review, actual npm provenance, or rollback/revocation qualification.

Rollback addendum (2026-10-03): CLI PR #58 (`8e39aa7`) adds a shared decision contract that refuses mutable targets and historical-record invalidation and requires replacement identity during signing-key revocation. It is not an operational rollback/revocation run; DIST-006 remains open.

Docker evidence addendum (2026-10-06): current-source Hunt Docker qualification
passed 15/15 enabled adversarial runtime scenarios against a pinned Debian image
under Docker 29.7.2. This does not close Gate 2 or Gate 6: host-level Linux
namespace qualification, independent review, trusted recipe publisher roots,
and external acceptance remain absent.

Distribution evidence addendum (2026-10-06): CLI PR #70 (`3a0959a`) makes the
publish workflow fail closed unless the release contains exactly the six public
npm archives at one shared version. Hosted platform run `37472923540` and
self-scan `37472923665` passed. DIST-001/002/003 remain open pending protected
trusted publication, legal clearance, actual provenance evidence, and final
release-governance qualification.

Production schema addendum (2026-10-06): migrations `0021`–`0025` were applied
to Neon production only after read-only inventory, a local `pg_dump` restore
rehearsal, and exact additive SQL review. Post-write verification reached 26
migration rows and confirmed new SCM/deletion tables/indexes with invariant row
counts unchanged. This does not close provider cutover, deletion acceptance,
backup/restore operations, or independent-review gates.

## Scope addendum · 2026-10-06

Before Gate 3/6 can claim GitHub organization alignment, `GITHUB-WEB-001..004`
must prove immutable account/repository binding, App installation permissions and
token lifecycle, delivery replay/lifecycle reconciliation, and a bounded
authorized-org cutover. Provider-neutral SCM tests alone are insufficient.

Before Gate 4/6 can claim complete billing support, `PLAN-WEB-013..015` must
derive methods from the server/catalog configuration and qualify every Razorpay
method enabled for the account in test mode (cards, UPI, netbanking, wallets
where enabled), including success/failure, capture, refund, renewal, replay, and
out-of-order events. Documentation does not substitute for account evidence.

Before Gate 6 can claim final acceptance, and only after the shipping candidate
is frozen, `ACCEPT-011..014` must use private
non-shallow fixture manifests, held-out repositories, reproducible current-source
scans, license/scope records, false-positive correction review, and a dated
regression/go-no-go. No customer acceptance may be inferred from public fixtures.
