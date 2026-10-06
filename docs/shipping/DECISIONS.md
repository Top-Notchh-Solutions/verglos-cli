# Verglos shipping decisions

This file is newly created because no tracked `DECISIONS.md` existed in the private shipping worktree when checked on 2026-09-14. It is local-only and must not be pushed to the public CLI or Web repositories.

## HUNT-009 packaging boundary · 2026-10-06

- **Decision:** Keep the public alpha CLI on its beta shell until a reviewed packaging design exists for private Hunt execution. Do not add a private workspace package as a public CLI dependency and do not copy private runtime implementation into public archives as an implicit workaround.
- **Rationale:** The public packer intentionally fails closed on private workspace dependencies. Enabling a command that cannot be installed from the public six-package release would create a false release surface and violate the repository code split.
- **Follow-up:** Resolve the private-runtime distribution boundary only after trusted publisher roots, licensed recipe provenance, bounded execution, isolation/adversarial evidence, and independent review are complete.

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
