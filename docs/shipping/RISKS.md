# Verglos V1 risk register

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
