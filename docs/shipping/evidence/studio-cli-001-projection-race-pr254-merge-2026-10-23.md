# STUDIO-CLI-001 duplicate projection reservation race merged · 2026-10-23

Web PR #254 merged normally into `main` as merge commit
`0c2b3065efb32525e42af3b2e8c0cd67a91a00d9`, preserving source commit
`c290c9f49c10e47a3f1421f427f76f1fd7607622`. When two identical client-
projection uploads race on the custody uniqueness constraint, the losing
request now releases its already-reserved allowance; if compensation cannot
be confirmed, the route returns bounded service-unavailable instead of
claiming idempotent success.

## Verification

- Focused Studio/client-projection/usage contracts passed **27/27**.
- The full serialized Web suite passed **900**, with **24 documented skips**
  and **0 failures**.
- `pnpm typecheck` passed.
- `pnpm build` passed and generated **49/49** routes.
- `git diff --check` passed.

## Hosted and release boundary

Verify Web run `39899676684` and Private runner qualification run
`39899676731` failed before repository execution with zero steps and no runner
execution. GitGuardian, Vercel, and Vercel Preview Comments passed. No hosted
source qualification result is claimed from the failed runner jobs.

This advances STUDIO-CLI-001 implementation only. The row remains open for
hosted/audit qualification, authorized independent recipient/customer
acceptance, and final release acceptance. No database migration, provider,
Production, customer, deployment, registry publication, tag, or release
action occurred. Nothing was deleted or overwritten. The score remains
**244 checked / 36 open / 280 total (87.1%)**.
