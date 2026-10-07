# Goal addendum — 2026-10-07

QUAL-WEB-006 browser continuation: after a fresh reload, authenticated
`/orgs` rendered its directory empty state (“Choose an organization” / “No
organizations yet”). The earlier 404 was stale tab state; successful Production
deployment records were confirmed for merged organization-directory commits
`c1bca533` and `6fccfb26`. The account remains Free with no organization, so
paid/org, human screen-reader, large-data, and field-CWV evidence remain open.
No checkbox changed; backlog remains **218 checked / 62 unchecked / 280 total**.

CLI PR #75 subsequently passed all 11 hosted checks across Ubuntu, macOS, and
Windows Node 20/22/24 plus Verglos self-scan and in-toto release binding. It
merged as `6bde945c60ac34351c02a70f6e7a2cb24f98ae1d`. This is a shipped
packaging correction, not Hunt acceptance: HUNT-008/HUNT-009/QUAL-CLI-004
remain open for provenance, isolation, independent review, and functional
acceptance. No checkbox changed; backlog remains **218 checked / 62 unchecked /
280 total**.

QUAL-WEB-006 browser evidence was captured through the approved Chrome DevTools
session: authenticated Free `/account`, desktop/mobile Accessibility and Best
Practices 100, Tab focus to Overview, clean console, 200/304 navigation,
LCP 1,111ms, CLS 0.00, and no CrUX field data. No organization or paid
entitlement was available, so paid/org runtime, human screen-reader,
large-data, and field-CWV gates remain open. Backlog remains **218 checked /
62 unchecked / 280 total**; no checkbox changed.

CLI PR #75 exact head `c4beecb3525256cd2956660af8e3e6b49292b65f` now removes
the public CLI's static private Hunt dependency and validates an optional,
separately provisioned runtime with fail-closed exit-78 behavior. Hunt build,
CLI typecheck, focused 6/6, complete configured CLI suite, public packaging/
license/surface 17/17, six archives, package-content, and public-boundary
audits pass. PR #75 was OPEN/UNSTABLE with 11 hosted checks pending at capture.
This is packaging progress only; HUNT-008/HUNT-009/QUAL-CLI-004 remain open
for provenance, isolation, independent review, and acceptance. Backlog remains
**218 checked / 62 unchecked / 280 total**; no checkbox changed.

Web PR #153 exact head `250313e` hardened the disposable restore drill. The
existing snapshot restored, 35 migrations and both writer passes ran,
reconciliation returned `reconciled`, and fail-closed simulation passed; RTO
was 3.09s. The report failed the critical RPO gate because the snapshot is
approximately 396h old. This adds recovery-path evidence but does not close
QUAL-WEB-005: current production backup/restore, deployment rollback,
authenticated deletion E2E, and final acceptance remain open. Backlog remains
**218 checked / 62 unchecked / 280 total**; no checkbox changed.

Web PR #153 exact head `2127924e418fdca4094fa88bab02656952f4488b` now proves
supporting deletion transaction rollback and same-binding retry under an
injected PostgreSQL failure. Local serial Web 868/1/0, deletion integration
1/1, typecheck/build/schema/35-migration/diff checks, and hosted Verify
`37567278851` pass. Production backup/deployment rollback and authenticated
non-production E2E remain open; backlog stays **218 checked / 62 unchecked /
280 total** and no checkbox changed.

Web PR #153 exact head `eb785d2e382fc60535c15702fe7ffd8b9ae66610` now adds the
fenced supporting-disposition executor and durable per-table receipts. Worker
tests pass 4/4, disposable PostgreSQL integration 1/1, serial Web 868/1/0,
typecheck/build/schema/35-migration/diff checks pass; hosted Verify
`37566730804`, Vercel, GitGuardian, and Preview Comments pass. The approval-gated channel-credential
case blocks before dependent deletes. QUAL-WEB-005 remains open for
retained-row reconciliation, restore/rollback rehearsal, authenticated
non-production E2E, and hosted completion. Backlog remains **218 checked / 62
unchecked / 280 total**; no production operation or checkbox changed.

Web PR #153 exact head `37c8a07ef2c1d4f914c0ace03864d60fb2649a82` passed hosted
Verify `37564973546` and adds the read-only sixteen-table supporting inventory
contract. Local focused 9/9, disposable PostgreSQL 1/1, serialized Web
846/23/0, typecheck/build/schema/34-migration/diff checks pass. The worker
continues to fail closed with `supportingInventoryComplete=false`; executable
dispositions, receipts, reconciliation, restore/rollback, and authenticated
E2E remain open. Backlog remains **218 checked / 62 unchecked / 280 total**;
no production or provider operation occurred.

The HUNT-009 public execution candidate was requalified locally but stopped at
the hosted public/private boundary. CLI PR #74 exact head
`a2a1335d2a0b69ec56391286a4ba77ef773c0457` passed focused execution tests,
build, typecheck, and the full 13/13-task repository test graph. Hosted runs
`37565750571` and `37565750527` failed closed because the six-package public
packer cannot resolve private/alpha `@verglos/hunt`; PR #74 was closed without
merge. HUNT-009 remains unchecked. The whole-product goal remains active and
the authoritative backlog remains **218 checked / 62 unchecked / 280 total**.
No boundary bypass or production/provider/payment/database/migration/
deployment/credential operation occurred.

The active Verglos V1 goal remains whole-product shipping, not a reduced
release. This batch records the latest PR #153 worker scope-fence correction:
head `ade21b6f4c74b0a27bcf349bded6d9ceb7e39ee0`, local focused 32/32 and
negative-boundary 2/2, hosted workflow `37560704115` green. The authoritative
backlog remains **218 checked / 62 unchecked / 280 total**.

The worker is still a contract, not accepted deletion capability. No production
or provider write, migration, deletion, payment, deployment, or browser
mutation occurred. The goal therefore remains active; the next dependency-ready
batch is the disposable-DB-backed user-scoped deletion job/store with explicit
reconciliation and restore evidence.

## 2026-10-07 batch update

PR #153 head `b91222a8d4d6ffd08f2be71391d89a6dafedab1` now persists the
user-scoped deletion job atomically with the request. Focused 16/16,
disposable PostgreSQL 1/1, full serial 846/23/0, typecheck/schema/migration/
build/diff checks pass. Hosted checks were pending immediately after push;
`QUAL-WEB-005` remains open and migration `0031` is not applied to production.

The next PR #153 step adds only the fenced job-state adapter at head
`654c78c69a44d7b5aad4733ec7cb364d760b76b0`. It passes disposable PostgreSQL
1/1 and the full local qualification set, but inventory/destructive/audit
methods remain fail-closed. The whole-product goal remains active.

PR #153 head `4656013` now reads the seven hosted-kind inventory, holds, and
customer-held digests under the job fence, while deliberately retaining
`inventoryComplete=false`. The whole shipping goal remains active; no product
release or deletion acceptance is implied.
