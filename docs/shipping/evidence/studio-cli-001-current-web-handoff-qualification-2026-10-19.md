# STUDIO-CLI-001 current Web handoff qualification — 2026-10-19

## Scope

This packet records current implementation and qualification evidence for the
Studio client-handoff portion of `STUDIO-CLI-001`. It does not claim that the
row's external hosted-allowance or authorized recipient/customer acceptance
requirements are satisfied.

## Reviewed implementation

- Repository: `Top-Notchh-Solutions/verglos-web`
- Reviewed source: clean disposable worktree from `origin/main`
- Web commit: `0719074d5a6f83198f5e36c0eeb064f2a12e1b1b`
- Handoff implementation commits: `48e04d5824084002bafb2cec9277fe3c48ebc994`
  and `07160a21d8a2d8ee85c97316f3eff396e8c4b187`
- Related Studio custody implementation: `112d7a954261b37d8122d53f20c9dbb04bc28a5b`

The organization-side issuance/list/revocation routes use the real Web auth
and tenant-boundary logic. The public recipient route deliberately uses the
intended one-time handoff proof and recipient email rather than an owner
session, and stores only the token digest. This is the production contract,
not a placeholder login or test-only bypass.

## Qualification commands and results

Executed from the clean Web worktree on 2026-10-19:

```text
pnpm install --frozen-lockfile
node --import tsx --test src/lib/organizations/handoff-receipt.test.ts src/lib/organizations/handoff-route-contract.test.ts src/lib/organizations/handoff-page-contract.test.ts src/lib/organizations/client-workspace-route-contract.test.ts src/lib/organizations/client-leakage.test.ts src/lib/organizations/studio-e2e.test.ts src/lib/organizations/client-portfolio-page-contract.test.ts
pnpm typecheck
pnpm test:negative-boundary
pnpm db:migrations:check
```

Results:

- Focused Studio/handoff suite: **70 passed, 0 failed, 0 skipped**.
- TypeScript typecheck: **passed**.
- Negative-boundary suite: **8 passed, 0 failed, 0 skipped**.
- Migration check: **42 ordered PostgreSQL migrations verified**.
- The environment reported Node `v26.4.0` / pnpm `10.34.5` while the package
  declares Node 22; this is a qualification-environment limitation, not a
  product acceptance claim.

The tests cover bounded receipt metadata, digest-only token custody,
same-origin issuance and revocation, recipient proof matching, single-use
acknowledgement, expiry, replay refusal, cross-tenant refusal, client-boundary
leakage, portfolio redaction, and the Studio lifecycle from client provisioning
through handoff acknowledgement.

## Disposition

`STUDIO-CLI-001` remains **unchecked**. The code-side implementation and
qualification are evidenced, but the row still requires:

1. a numeric paid/non-production hosted record allowance bound to the real
   organization and plan; and
2. authorized Studio recipient/customer acceptance of the handoff result.

No AppSec/Hunt row was changed. No production, provider, customer-data,
payment, or browser state was mutated by this qualification.

