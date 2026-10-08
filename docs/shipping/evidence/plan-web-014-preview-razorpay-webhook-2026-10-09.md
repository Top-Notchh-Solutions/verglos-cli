# PLAN-WEB-014 — Preview Razorpay webhook configuration

Date: 2026-10-09

## Provider configuration

- Razorpay dashboard was verified in Test Mode.
- The isolated Preview webhook is configured and enabled:
  `https://verglos-m0pw6veek-anuragyadav20062002s-projects.vercel.app/api/webhooks/razorpay`
- The Preview webhook reports 26 enabled events.
- The existing production-domain Test Mode webhook is also enabled:
  `https://verglos.com/api/webhooks/razorpay`

## Reachability check

An unauthenticated request to the isolated Preview webhook returned HTTP 302
to Vercel SSO. This means a third-party Razorpay delivery cannot currently
reach the application handler through that URL.

## Boundary

The Razorpay Test Mode configuration is present, but the hosted payment
lifecycle gate remains open. Before running the matrix, the Preview webhook
must be made reachable through a scoped Vercel Deployment Protection bypass or
an equivalent public test deployment. The production-domain webhook must not
be used for isolated payment testing because it can reach the Production
application/database.

No payment order, entitlement write, or production database write was created
by this qualification.
