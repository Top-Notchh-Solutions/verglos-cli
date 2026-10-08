# PLAN-WEB-014 — Preview Razorpay webhook configuration

Date: 2026-10-09

## Provider configuration

- Razorpay dashboard was verified in Test Mode.
- The isolated Preview webhook is configured and enabled on the latest READY
  Preview deployment. The deployment hostname and protection-bypass query are
  intentionally omitted from this evidence record.
- The Preview webhook reports 26 enabled events.
- The old production-domain Test Mode webhook is disabled; isolated payment
  testing is not routed to the Production application or database.

## Reachability check

The Preview webhook was initially observed returning HTTP 302 to Vercel SSO.
After adding a scoped Vercel Deployment Protection bypass to the Test Mode
webhook URL, the application boundary was rechecked through the protected
Preview path and returned an application-level HTTP 405 for an unsupported
GET, rather than SSO. This proves reachability of the route boundary, not a
successful webhook delivery.

The latest Preview checkout then produced:

- hosted Test Mode checkout at the canonical monthly Pro catalog amount;
- `POST /api/razorpay/create-order` HTTP 200;
- `GET /api/razorpay/order-status` HTTP 200 with a read-only `pending` result;
- hosted failure/cancellation observations.

## Boundary

Gate 3 configuration/reachability is satisfied: Test Mode credentials,
isolated Preview database, enabled method catalog, protected webhook target,
and handler reachability are present. The complete hosted payment lifecycle
remains a separate open gate: no successful capture, signed provider webhook,
refund, or entitlement/license reconciliation is claimed here. The browser
simulator currently stalls at Razorpay's own Test Mode OTP/mock step; this is
recorded as an external provider-simulator limitation rather than fabricated
payment evidence.

No production database write or production payment was created by this
qualification.
