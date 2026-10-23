# Production code rollout · lifecycle binding fix · 2026-10-10

## Deployment

- Reviewed Web source `51e07f5` was merged through PR #171 as merge commit
  `b08bb509`.
- Vercel deployment `dpl_ySGLm8Hx7DTjjSZd9Dx4tq7RrMxf` reached READY and was
  aliased to `https://verglos.com`.
- Production configuration validation passed. The rollout contained the
  Razorpay webhook binding/schema fix only; no Production payment plan,
  provider webhook, database, migration, entitlement, account, or customer
  data was changed.

## Read-only smoke

- `/`, `/checkout`, and `/docs`: HTTP 200.
- Unauthenticated `GET /api/razorpay/create-subscription`: HTTP 405.
- Checkout HTML contained no Test Mode marker, provider test key, database URL,
  PostgreSQL URL, or Vercel protection-bypass marker.
- HSTS was present on the public response.

## Decision

Production is moving forward at the code-rollout boundary and remains
fail-closed for billing activation. Payment lifecycle qualification remains an
isolated Preview/Test Mode concern until the complete Gate 4 matrix and its
reconciliation evidence pass. Score remains **219 checked / 61 unchecked / 280
total (78.2%)**; no checkbox changed.
