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

## Whole-shipping POC matrix

- “Complete in 24 hours” means complete the entire authoritative backlog and
  its evidence, not merely the critical path or payment implementation.
- Final POC qualification must use pinned live repositories or explicitly
  authorized customer repositories, with consent, bounded scope, private
  evidence, and retention/deletion handling. Public fixtures are technical
  evidence, not customer acceptance.
- Cover the revenue journey from pre-revenue/₹0 through approximately ₹1 crore,
  ₹10 crore, ₹50 crore, and ₹100 crore annual-revenue scenarios, using the
  operational differences as test dimensions rather than inventing customers,
  revenue, or traction.
- Exercise every canonical plan in the verified catalog—Free, Pro, Team,
  Studio, and Enterprise where canonical after reconciliation—across actual
  entitlements, limits, organization roles, billing state, upgrade/downgrade,
  denials, audit evidence, CLI behavior, and Web behavior.
- Include small-product, multi-user SaaS, multi-tenant/team, and
  large-scale/enterprise-like repository shapes, with held-out scenarios for
  false-positive, false-truth, coverage, and performance review.
- Record exact repository/authorization, commit, license, plan, revenue-band
  scenario, runtime/configuration, findings, resource use, reproducibility,
  adjudication, and limitations privately. Do not publish repository contents,
  customer data, credentials, or competitive intelligence.
- If the 24-hour target expires with any backlog item or matrix evidence open,
  keep the goal active and report the exact gap; never call a partial launch
  whole shipping.
