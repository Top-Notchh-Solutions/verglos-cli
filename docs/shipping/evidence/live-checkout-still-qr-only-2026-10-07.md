# Live checkout truth probe — QR-only deployment · 2026-10-07

## Observation

- Same dedicated Chrome CDP page, navigated in-place to `https://verglos.com/checkout`.
- Rendered plan: Pro, monthly `₹2,809.43`; annual cadence was also present.
- Rendered payment copy: `Pay in ₹ via any UPI app (GPay, PhonePe, Paytm…)`.
- Rendered action: `Show UPI QR code`.
- Rendered provider copy: `Powered by Razorpay UPI. Access is granted for 30 days per payment.`
- No hosted card, netbanking, wallet, EMI, Pay Later, or payment-method list was
  rendered in this live observation.

## Boundary

- Only rendered text, button labels, and the current URL were inspected.
- The payment button was not clicked; no order, QR, payment, webhook, database,
  deployment, or provider configuration operation occurred.

## Disposition

The live deployment has not adopted the merged PR #149 hosted-checkout phase.
This is current production truth and keeps `PLAN-WEB-013`, `PLAN-WEB-014`, and
`PLAN-WEB-015` open. The merged code is not evidence of a production cutover.
