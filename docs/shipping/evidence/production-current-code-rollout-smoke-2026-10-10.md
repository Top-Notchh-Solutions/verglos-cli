# Production current code-rollout smoke · 2026-10-10

## Deployment

- Vercel project: `verglos-web`
- Current READY Production deployment URL:
  `https://verglos-hhortlf1l-anuragyadav20062002s-projects.vercel.app`
- Source commit: Web `6f932d4e48c73d2dd86dbbbadc630b7ffc48534d`
  (`fix(billing): reject lifecycle authorization regression`)
- Branch metadata: `feat/preview-test-auth`
- Production target: READY

## Bounded read-only smoke

- `https://verglos.com/` returned HTTP **200**.
- `https://verglos.com/checkout` returned HTTP **200**.
- `https://verglos.com/docs` returned HTTP **200**.
- Unauthenticated `GET /api/razorpay/create-subscription` returned HTTP
  **405**, confirming the mutation route is not publicly callable by GET.
- The inspected public HTML did not contain a Razorpay key, Test-Mode marker,
  PostgreSQL URL, or database-URL marker.

The smoke was HTTP/read-only only; no cookies, authorization headers, response
bodies containing personal data, provider identifiers, payment, database,
migration, entitlement, account, customer, or deployment write was used.

## Boundary

This qualifies the current fail-closed Production code-rollout and public
route boundary. It does not qualify recurring billing activation, provider
payment lifecycle, Production migrations, reconciliation, monitoring,
backup/restore, rollback rehearsal, or entitlement activation. Those remain
open under the private release gates.
