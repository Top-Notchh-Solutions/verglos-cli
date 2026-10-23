# Web checkout terminal subscription lifecycle evidence — 2026-10-09

## Scope

- Repository: `anuragyadav-git/verglos-web`
- Branch: `feat/preview-test-auth`
- Pull request: #171
- Implementation commit: `fa1b9f5c50258ef23daaac4bbf32b24bbd590ef5`
- Mapped work: `PLAN-WEB-011`, `PLAN-WEB-012`, `PLAN-WEB-014`,
  `PLAN-WEB-015`, and the Gate 4 subscription lifecycle surface.

The checkout client previously treated every non-paid subscription response as
an indefinitely processing payment. The implementation now reconciles the
authenticated status response and stops polling for provider terminal states
(`cancelled`, `completed`, `expired`, and `halted`). Paid and refunded states
retain precedence, and the customer receives a bounded explanation with a
`Start again` action.

## Verification

- Focused checkout payload/lifecycle tests: **8 passed / 0 failed**.
- TypeScript typecheck: passed.
- Production build: passed.
- Full local serial suite: **896 total / 872 passed / 24 explicit skips / 0
  failed**.
- Hosted workflow `37866290786`: passed, including typecheck, serial tests,
  private-runner E2E, negative-boundary and truth-registry tests, database and
  migration checks, build, public-boundary, dependency, SBOM, license, and
  tracked-secret checks.
- Vercel deployment and Preview Comments checks: passed for the PR commit.
- PR #171 remains open and mergeable; this commit is not merged.

## Boundary and disposition

This is a code-side lifecycle repair. It does not prove provider authorization
or capture, renewal, provider-generated failure/expiry, refund, deployed
provider-to-hosted webhook delivery, or complete provider/ledger/entitlement
reconciliation. The deployed Preview remains protected by Vercel Authentication
before the application route, so no protection bypass was attempted.

Production remains the known READY fail-closed code rollout. This batch made no
Production deploy, plan-ID, provider/payment, database/migration, entitlement,
account, or customer-data write. Score remains **219 checked / 61 unchecked /
280 total (78.2%)**; no backlog checkbox changed.
