# Production code-only rollout evidence — 2026-10-09

## Scope

This is the Production deployment record for the reviewed Web source at
`54e6fd0344b2f8b74e2c4d5ff15a0b02c12b51dd`. It qualifies a fail-closed code
rollout and public smoke only. It does not qualify live billing activation,
database writes, migrations, payment writes, entitlement changes, account
changes, or customer-data mutations.

## Preflight

- The Web workspace was clean apart from the existing user-owned `.worktrees/`
  directory.
- Local typecheck passed after the production build completed.
- The configured Web serial suite passed **865**, with **23 explicit skips** and
  **0 failures**.
- The local production build generated all **45 pages**.
- The remote Vercel build passed Production runtime-config validation, type
  validation, compilation, static generation, and serverless output creation.
- No secret value, database URL, payment identifier, customer record, or
  personal data is stored in this evidence.

## Deployment

- Vercel deployment: `dpl_HRbg2hLmHe2WTFxvupkewdw3u9hg`.
- Deployment target: Production; status: READY.
- Deployment URL:
  `https://verglos-og4wus4sa-anuragyadav20062002s-projects.vercel.app`.
- Aliases: `https://verglos.com`, `https://www.verglos.com`, and the linked
  Vercel project aliases.
- The reviewed source commit is the subscription-route implementation commit
  listed above; the new recurring UI remains fail-closed in Production because
  Production plan bindings are intentionally absent.

## Read-only public smoke

- `GET /` — HTTP **200**.
- `GET /checkout` — HTTP **200**.
- `GET /docs` — HTTP **200**.
- `GET /api/razorpay/create-subscription` — HTTP **405**, confirming the
  mutation route is POST-only.
- `GET /api/razorpay/subscription-status` — HTTP **401**, confirming the
  owner-bound status route does not disclose data to an unauthenticated caller.
- Production checkout response contained no Test Mode or provider-plan marker.
- `/checkout` returned `private, no-cache, no-store` cache directives and
  HSTS was present.

## Boundary and disposition

- No Production database, migration, payment, provider, entitlement, account,
  or customer-data write occurred.
- No Test Mode plan ID, Preview database URL, test webhook secret, or test
  credential was copied into Production.
- This closes the Production code-rollout evidence slice only. Gate 4 and the
  payment backlog IDs remain open for complete isolated provider lifecycle and
  provider/ledger/entitlement reconciliation evidence.
- Score remains **219 checked / 61 unchecked / 280 total (78.2%)**; no
  checkbox changed.
- Next Production work is read-only monitoring/reconciliation and rollback
  readiness. Any live billing or database activation requires its own exact
  preflight, backup/restore or recovery evidence, reconciliation criteria, and
  rollback/forward-fix decision.
