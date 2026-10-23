# PLAN-WEB-014 — isolated Docker PostgreSQL local gate

Date: 2026-10-09

## Scope

This record proves the local, non-hosted database portion of the payment
qualification path. It does not prove Vercel Preview reachability, Razorpay
provider delivery, or a hosted payment lifecycle.

## Isolation

- Repository tree: `verglos-web` merged main tree at `be4289f838b4cd53ed243979bfd7623262b69636`.
- Container: `verglos-shipping-postgres-20261009`.
- Image: `postgres:15-alpine`.
- Database: `verglos_test`.
- Host binding: `127.0.0.1:55447 -> 5432`.
- No Neon, Vercel, production database, or production credentials were used.
- The connection string was supplied only through the process environment and
  was not written to this record.

## Commands and results

```text
docker run -d --name verglos-shipping-postgres-20261009 \
  --restart=no --cpus=1 --memory=768m \
  -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=<local-test-only> \
  -e POSTGRES_DB=verglos_test \
  -p 127.0.0.1:55447:5432 postgres:15-alpine

DATABASE_URL=<loopback-test-url> \
  VERGLOS_ALLOW_EMPTY_DATABASE_BOOTSTRAP=1 \
  VERGLOS_EMPTY_DATABASE_BOOTSTRAP_CONFIRMATION=I_UNDERSTAND_LEGACY_BASELINE \
  pnpm db:migrate
# migrations applied successfully

DATABASE_URL=<loopback-test-url> pnpm db:migrations:check
# Verified 38 ordered PostgreSQL migrations.

PAYMENT_TEST_DATABASE_URL=<loopback-test-url> \
  pnpm exec node --import tsx --test \
  src/app/api/razorpay/create-order/route.integration.test.ts \
  src/lib/razorpay-webhook-handler.integration.test.ts \
  src/lib/razorpay-webhook-events.integration.test.ts
# 4 passed, 1 intentionally environment-gated skip, 0 failed
```

The migrated database reports 50 public tables and 38 migration records.

## Proven result

The isolated database-backed tests proved server catalog binding, hosted
method projection, webhook capture, replay idempotency, monotonic refunds, and
failed-payment recording without entitlement creation.

## Boundary

This opens only the local database qualification portion of PLAN-WEB-014. It
does not close the backlog item. The next gate requires an isolated database
reachable by the Vercel Preview deployment, a Preview isolation marker, and a
test-mode webhook endpoint.
