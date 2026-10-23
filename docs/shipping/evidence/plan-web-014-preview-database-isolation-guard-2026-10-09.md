# PLAN-WEB-014 Preview database-isolation guard — 2026-10-09

## Scope

- Repository: `verglos-web`
- Source PR: #170, `37796165c42654f43eaca44eb6a363657e22298d`
- Merged Web `origin/main`: `be4289f838b4cd53ed243979bfd7623262b69636`
- Changed files: `.env.example`, `src/lib/runtime-config.ts`,
  `src/lib/runtime-config.test.ts`

## Implementation and verification

Preview payment configuration now fails closed unless it has a TLS-safe
`DATABASE_URL` and the explicit
`VERGLOS_PREVIEW_DATABASE_ISOLATED=true` marker. The existing database URL
validation remains active; payment-disabled Preview behavior is unchanged.

Local verification on the clean PR worktree:

- focused runtime/payment tests: **38 passed / 0 failed**;
- configured Web serial suite: **864 passed / 24 skipped / 0 failed**;
- TypeScript typecheck: passed;
- `VERCEL_ENV=preview pnpm build`: passed, **45 pages**;
- `git diff --check`: passed.

Hosted PR verification:

- `typecheck-and-schema`: success;
- GitGuardian: success;
- Vercel Preview: success;
- Vercel Preview Comments: success;
- merge commit: `be4289f838b4cd53ed243979bfd7623262b69636`.

## Boundary and remaining gate

This is configuration safety and local/Preview qualification, not payment
acceptance. The disposable database, migration history/schema verification,
webhook target, provider Test Mode lifecycle, production reconciliation, and
all-method success/capture/refund/renewal evidence remain open. No production
database, migration, payment, provider, entitlement, account, or production
deployment write occurred. No backlog checkbox changed; score remains
**218 checked / 62 unchecked / 280 total (77.9%)**.
