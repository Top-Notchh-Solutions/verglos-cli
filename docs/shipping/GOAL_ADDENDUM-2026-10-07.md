# Verglos V1 goal addendum — 2026-10-07

This addendum supersedes the earlier QR-only checkout emphasis. It adds scope;
it does not relax any existing evidence, security, privacy, or production gate.

## Payment checkout migration

- Replace QR-only checkout as the default with a provider-hosted Razorpay
  Checkout/order flow for every payment method actually enabled and approved
  on the account.
- The server/catalog contract is authoritative. Do not promise cards, UPI,
  netbanking, wallets, or other methods unless runtime configuration and
  qualification prove they are enabled.
- QR is optional only when separately enabled and qualified; it cannot be the
  sole/default qualification path.
- Provider capture/signed webhooks remain authoritative for entitlements;
  client polling is read-only.
- Qualify every enabled method across creation, success, failure,
  authorization/capture, refunds, renewal, cancellation, replay, duplicate and
  out-of-order webhooks, retries, tenant binding, and exactly-once licensing.

## Test and production boundaries

- Qualification uses provider test credentials, a preview/staging deployment,
  and an isolated database. The test checkout must visibly say sandbox/test and
  must never render a live QR or live payment URL.
- Production rejects test keys. Do not set production prices to $1 as a test
  substitute, and do not use Neon membership or direct production rows as
  payment evidence.
- Internal preview entitlement fixtures are acceptable only when explicitly
  labeled as entitlement tests, not payment proof.
- R-041 still blocks production changes until the exposed database credential
  is rotated, Vercel is refreshed/redeployed, the old credential is revoked,
  and bounded read-only verification succeeds.

## Plan truth

The current web checkout sells only Pro through a QR path. Team/Studio/
Enterprise purchase claims require a reviewed catalog, organization binding,
provider mapping, webhook lifecycle, authorization/quota behavior, and
non-production browser evidence for each plan. Reconcile Team naming with the
canonical product catalog before implementation or public copy changes.

## Runtime evidence recorded

On 2026-10-07 the authenticated browser reached the public checkout and showed
an INR 2,809.43/month Razorpay UPI QR. The status endpoint returned HTTP 200
with status pending after repeated “I’ve paid — check now” clicks. No payment,
capture, webhook, or entitlement was observed. This is not test-mode evidence;
the QR must not be scanned or paid.

## Next acceptance boundary

Implement the provider-hosted all-method checkout abstraction, tests, and
preview/test-mode qualification before any production billing change. Keep
public pricing and marketing frozen until the evidence matrix passes.

## Operating constraints for the final shipping pass

- Keep the dedicated Chrome DevTools debug session available for runtime
  qualification. Verify 127.0.0.1:9222 and the current authenticated page before
  each browser batch; never record cookies, authorization headers, payment
  credentials, database URLs, or personal data.
- Keep Docker available for bounded integration, webhook, PostgreSQL, sandbox,
  and adversarial checks. Verify daemon health before each batch and record
  resource-limited skips separately from product failures.
- Complete the remaining active work within 24 hours. Parallelize only disjoint
  CLI/Web/browser/Docker work, keep the next three independent batches live,
  and prioritize safety, billing, critical acceptance, hosted verification, and
  release gates. The deadline never waives evidence, tests, or production
  preflight.
- Protect the machine: bound concurrency, Docker resources, trace duration,
  polling, logs, and corpus size; avoid simultaneous heavy builds/suites; stop
  only exact processes started by the current batch; never use broad cleanup.

## Whole-shipping target and founder-supplied final POC

- The primary target is the entire authoritative backlog and product shipping
  path within 24 hours maximum, with a three-hour target wherever current
  evidence and hosted dependencies allow. The target never waives gates.
- Do not spend the critical path sourcing or analyzing the final repository
  corpus. The founder will provide the final live/authorized repositories and
  POC inputs. Prepare the product, harnesses, fixtures, contracts, evidence
  templates, and gates so the supplied corpus can run immediately afterward.
- Final POC acceptance remains required after candidate freeze and must cover
  the supplied use cases and revenue scenarios from ₹0 through approximately
  ₹1 crore, ₹10 crore, ₹50 crore, and ₹100 crore, across every canonical plan
  after plan-name reconciliation.
- If the 24-hour target expires with any backlog or required evidence open, keep
  the goal active and report the exact gap; never call a partial launch whole
  shipping.

# 2026-10-07 · QUAL-WEB-005 inventory substrate

Web PR #153 records a versioned account-deletion inventory and fail-closed
execution gate as a dependency-ready substrate. It does not satisfy the
operational deletion requirement. Local 22/22 focused tests, typecheck,
database/schema checks, ordered migration validation, diff check, and 38-page
build pass; hosted workflow `37559045448` remained pending at capture. The
private backlog remains **218 checked / 62 unchecked / 280 total**. No
production/database/provider/payment/browser mutation or destructive action
occurred. Durable hold authority, customer-held digest registration, bounded
worker, reconciliation/audit receipt, restore rehearsal, and authenticated
non-production E2E remain required.

# 2026-10-07 · QUAL-WEB-005 hold authority substrate

The active deletion phase now includes a durable, versioned hold authority
contract and explicit release semantics on Web PR #153, with migration `0029`
kept unapplied. Local hold 3/3, combined focus 25/25, serial 846 pass / 22
explicit skips, typecheck/schema/migration/diff/build pass. Hosted checks were
in progress at capture. The backlog remains **218 checked / 62 unchecked /
280 total**; no production or destructive operation occurred. Worker,
customer-held digest proof, reconciliation/audit receipt, restore rehearsal,
and authenticated non-production E2E remain required.

# 2026-10-07 · QUAL-WEB-005 customer-held digest substrate

PR #153 now includes a digest-only registry and exact before/after comparison
contract for held signed `.vgl` identities. Migrations `0029` and `0030` remain
unapplied. Focus 28/28, serial 846 pass / 22 explicit skips,
typecheck/schema/migration/diff/build pass with 31 migrations. Hosted checks
were pending at capture. The backlog remains **218 checked / 62 unchecked /
280 total**; authenticated writing, worker execution, reconciliation, restore,
and non-production E2E remain required.

# 2026-10-07 · QUAL-WEB-005 worker contract

PR #153 now includes a fenced user-scoped deletion worker contract with
bounded retries, per-kind idempotency, hold/inventory gates, digest comparison,
and audit-receipt fencing. Focus 31/31, negative boundary 2/2, serial 846 pass
/ 22 explicit skips, typecheck/diff/build pass. Hosted workflow
`37560432960` was in progress. The backlog remains **218 checked / 62
unchecked / 280 total**; the operational adapter, restore rehearsal,
reconciliation, and non-production E2E remain required.

# 2026-10-07 · QUAL-WEB-005 hosted inventory verification

PR #153 exact head `4656013425c4cadb498f004c1057aa6f1d5931b6` passed hosted
workflow `37562115786` and its Vercel, GitGuardian, and Preview Comments
checks. This is a verified substrate milestone, not whole shipping:
`QUAL-WEB-005` remains unchecked, the inventory gate remains fail-closed, and
supporting retention/ownership, destructive execution, reconciliation/audit,
restore/rollback, runtime wiring, and authenticated E2E remain open. The
authoritative count stays **218 checked / 62 unchecked / 280 total**.

# 2026-10-07 · QUAL-WEB-005 hosted deletion receipt

PR #153 exact head `52be606` passed hosted workflow `37562587132` after adding
the source-only fenced terminal receipt. This is a verified substrate
milestone, not whole shipping: `QUAL-WEB-005` remains unchecked, migration
`0032` is unapplied, and complete ownership/retention mapping, destructive
execution, runtime wiring, reconciliation, restore/rollback, and authenticated
E2E remain open. The authoritative count stays **218 checked / 62 unchecked /
280 total**.

# 2026-10-07 · PLAN-WEB-013 hosted payment catalog

PR #149 exact head `db68157da039d8aab939818f9023f867028e4432` passed hosted
workflow `37563023349`. The server catalog now has a broader hosted-method
contract while remaining fail-closed for unqualified methods. This is not
payment acceptance: account enablement, provider lifecycle/replay evidence,
reconciliation, and the remaining payment plans are still open. The
authoritative backlog remains **218 checked / 62 unchecked / 280 total**; no
production/provider/payment/browser mutation occurred.

# 2026-10-07 · QUAL-WEB-005 per-kind transaction substrate

PR #153 exact head `9476e5d018c9ab18bd09fa6bec4f89e2ff353e92` passed hosted
workflow `37563632682` after adding source-only migration `0033` and fenced
per-kind deletion transactions. This materially advances deletion safety but
does not accept `QUAL-WEB-005`: supporting retention/ownership inventory,
runtime wiring, reconciliation, restore/rollback, and authenticated E2E remain
open. Count remains **218 checked / 62 unchecked / 280 total**; no production
or destructive operation occurred.

# 2026-10-07 · QUAL-WEB-005 bounded runtime runner

PR #153 exact head `1f8571b4a146e9ef78ca9ae25c13b86f8e89665c` passed hosted
Verify `37563987818` / job `112607416147` after adding the bounded deletion
batch runner and authenticated cron route. Local route contract 2/2,
disposable PostgreSQL integration 1/1, negative 2/2, truth registry 25/25,
serial 846/23/0, ordered 34-migration validation, schema/typecheck, diff, and
38-route build all pass. This advances runtime wiring but does not count as
whole shipping: the integration remains blocked by `inventoryComplete=false`,
and supporting ownership/retention dispositions, reconciliation,
restore/rollback, authenticated non-production E2E, provider lifecycle, CLI
release/legal, GitHub organization integration, and credential rotation remain
open. The authoritative count stays **218 checked / 62 unchecked / 280
total**. No production invocation, destructive operation, deployment, payment,
database, or credential write occurred.

# 2026-10-07 · QUAL-WEB-005 supporting disposition registry

PR #153 exact head `f83af5c0bdb9b15ee87ec83ac365e1fc5f91bd26` passed hosted
Verify `37564437899` / job `112608834179` after mapping all 16 supporting
tables to explicit dispositions, rationales, and approval flags. Focused
deletion/hold/inventory tests 11/11, serial 846/23/0, typecheck, schema,
ordered 34-migration validation, diff, and 38-route build all pass. This is
still not whole shipping: the registry is not executable deletion, and
retention/legal approval, reconciliation, restore/rollback, authenticated
non-production E2E, payment lifecycle, CLI release/legal, GitHub organization
integration, and credential rotation remain open. Count stays **218 checked /
62 unchecked / 280 total**. No production or destructive operation occurred.
