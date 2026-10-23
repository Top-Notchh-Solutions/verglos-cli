# PLAN-WEB-014 — Preview isolated Neon gate

Date: 2026-10-09

## Scope

This record proves the isolated Preview database configuration and migration
boundary. It does not prove a Razorpay provider lifecycle or payment webhook.

## Database

- Preview `DATABASE_URL` was added separately from the existing Production
  `DATABASE_URL`.
- The Preview value was read only from the local `.env.test.local` key
  `TEST_DATABASE_URL`; its value was not printed or committed.
- The target was validated as a Neon PostgreSQL URL and was not the local
  Docker database.
- The reviewed empty-database baseline was initialized, followed by all
  ordered Web migrations.
- Database verification: 50 public tables and 38 migration records.
- `pnpm db:migrations:check`: passed, 38 ordered migrations.

## Preview configuration

Metadata-only Vercel audit for project `verglos-web` shows:

```text
DATABASE_URL                         Preview + Production
VERGLOS_PREVIEW_DATABASE_ISOLATED   Preview
RAZORPAY_ENABLED_PAYMENT_METHODS    Production only
```

The Production database value was not changed.

## Deployment

- Deployment: `dpl_2pAGC2xEgpHs62fJBXy2YYAX2og2`
- Preview URL: `https://verglos-k3e92t1bn-anuragyadav20062002s-projects.vercel.app`
- Ready state: `READY`
- Build: passed, 43 pages.
- Read-only `/checkout` probe: HTTP 302 to authentication, expected for the
  protected checkout route.

## Boundary

The isolated Preview database gate is open. The next payment gate still needs
Preview Razorpay Test Mode method configuration, a reachable test webhook, and
the hosted payment lifecycle matrix. No payment order or provider write was
created by this qualification.
