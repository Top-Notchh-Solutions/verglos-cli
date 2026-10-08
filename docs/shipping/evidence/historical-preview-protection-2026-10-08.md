# Historical Preview deployment protection — 2026-10-08

## Scope

Read-only sampling of three historical Vercel Preview deployment URLs that
were already listed in the private shipping record. No deployment was
deleted, promoted, opened, or mutated.

## Result

Each sampled deployment returned HTTP `302` and redirected to the Vercel SSO
boundary before exposing the application route:

- `verglos-gmk0axjqb-anuragyadav20062002s-projects.vercel.app/checkout`
- `verglos-2c4u34y6f-anuragyadav20062002s-projects.vercel.app/checkout`
- `verglos-933rag0q5-anuragyadav20062002s-projects.vercel.app/checkout`

Only the redirect origin and path were retained; redirect query values,
cookies, headers, and response bodies were not recorded.

## Limits

This confirms the sampled historical deployments are access-protected from an
unauthenticated request. It does not prove their frozen environment snapshots,
database targets, payment configuration, or behavior after authentication.
The deployments remain undeleted because deletion is destructive and is not
required for the current fail-closed Preview boundary.

## Disposition

No backlog checkbox changed. Current Preview remains payment-disabled and has
no Preview `DATABASE_URL` target. Isolated non-production database and
Razorpay Test Mode lifecycle evidence remain required before enabling payment
testing.
