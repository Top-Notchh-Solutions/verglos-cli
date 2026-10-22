# QUAL-WEB-006 current-head requalification · 2026-10-22

## Scope

This batch requalifies the merged Web implementation for the repository-owned
accessibility, performance, dashboard-state, and large-dataset contracts. It
does not claim human screen-reader, field Core Web Vitals, customer, provider,
or independent acceptance.

- Repository: `verglos-web`
- Qualification source: `67f8f89be193dff7053d0abd946b288301bf2b87`
- Implementation commits: `3170094` and `dfa417f`
- Promotion: PR #239 merged normally as
  `ba00d5d86fdbcaeeee817c2c66b86f0b3de01987`; the source branch remains
  preserved.
- Qualification worktree: `/private/tmp/verglos-web-build-20261022`
- Runtime: Node 22 package baseline; PostgreSQL 15 local fixture
- Database: local-only `verglos_test`; the remote value in `.env.test.local`
  was not sourced or contacted

## Verification

- Focused accessibility/dashboard/portfolio/recipient contracts: **41/41**
  passed, **0** failed, **0** skipped.
- Web typecheck: passed.
- Ordered migration check: **43/43** migrations verified.
- `git diff --check`: passed on the clean merged worktree.
- Production build from the top-level isolated worktree: passed; Next.js
  compiled, type-checked, and generated **49/49** static pages/routes.
- Large-dataset PostgreSQL integration: **1/1** passed. The current head
  preserved same-tenant monitoring freshness and excluded foreign inventory
  against the preserved local fixture.
- Hosted PR #239 checks: **8/8** successful, including Ubuntu/macOS/Windows
  protocol/client, typecheck/schema, isolated PostgreSQL, Vercel,
  GitGuardian, and Preview Comments.

The nested source worktree build was first attempted and failed before
compilation because Next.js inferred the dirty parent workspace root, whose
unrelated `package.json` contains merge-conflict markers. The exact same source
commit was then built from the top-level isolated worktree above and passed;
the source worktree and parent workspace were not edited.

## Acceptance mapping

This strengthens implementation evidence only. `QUAL-WEB-006` remains
unchecked for authenticated paid/organization browser coverage, human
screen-reader review, supported-browser/large-dataset rendering acceptance,
field-CWV observation, and independent/customer acceptance. No AppSec/Hunt
state changed.

## Safety boundary

The PostgreSQL container `verglos-qual-studio-20261022b` was started only for
the local integration and stopped afterward without removal. The earlier
stopped qualification container was also preserved. No Production database,
provider, payment, customer, legal, publication, deployment, or release
operation occurred. No file, branch, record, deployment, provider, customer,
database, or release artifact was deleted or changed.

The private evidence bundle secret scan passed after this packet was added.

## Current merged-head contract refresh · 2026-10-22

Exact merged Web head `02f5aba95c4172255cc522730c6ffecc1598cbda` also passed
the current accessibility/performance/truth contract set **66/66** with zero
failures. The source public-release smoke passed with **16 routes**, **22/22
publishable claims**, **2 proof assets**, and **0 issues**.

The direct landing qualifier was not claimed as browser evidence: when called
without an explicit browser capture it correctly exited **2** with its usage
guard. Existing browser-produced and hosted evidence remains separately
tracked; no new browser capture, field-CWV result, or human screen-reader
acceptance was invented. The row remains unchecked for supported-environment
coverage, human screen-reader acceptance, large/complete dashboard states,
field CWV, independent review, and final acceptance. Current score remains
**239 checked / 41 open / 280 total (85.4%)**.
