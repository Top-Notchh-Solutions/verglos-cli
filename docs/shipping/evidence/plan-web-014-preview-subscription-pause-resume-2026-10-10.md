# PLAN-WEB-014 Preview/Test Mode pause-resume evidence · 2026-10-10

## Scope

This record covers one bounded Razorpay Test Mode subscription pause/resume
slice against the isolated Preview/Test database. It does not authorize or
represent a Production billing, database, entitlement, or customer operation.

The provider credentials and webhook configuration were read from the local
gates-testing environment. No secret, provider identifier, customer value, or
database URL is retained here.

## Provider operation

- A read-only Test Mode inventory returned HTTP 200 and contained 5 active,
  16 cancelled, and 11 created subscriptions.
- One active subscription was selected without recording its provider ID in
  shared evidence.
- `POST pause(pause_at=now)` returned HTTP 200 with provider state `paused`.
- `POST resume(resume_at=now)` returned HTTP 200 with provider state `active`.
- The operation was performed only in Razorpay Test Mode.

## Webhook and database result

- The isolated Preview endpoint accepted one completed
  `subscription.paused` event and one completed `subscription.resumed` event.
- The isolated database had one subscription row updated within the run's
  observation window and projected it to `active`.
- The final isolated subscription aggregate was 5 `active`, 8 `cancelled`,
  and 19 `pending`; this aggregate includes prior test fixtures and is not a
  claim that every provider row is reconciled.
- There were zero payment rows and zero license rows created in the recent
  observation window.
- No manual database edit, entitlement grant, payment capture, or license
  mutation was used.

## Acceptance boundary

This qualifies the provider pause/resume delivery and application projection
slice. It does not close `PLAN-WEB-014` or Gate 4. Renewal, provider-generated
failure/expiry/refund, all enabled payment methods, replay/out-of-order,
timeout/retry, exactly-once across the complete matrix, and full provider /
ledger / entitlement reconciliation remain open. Production remains at the
fail-closed code-rollout boundary and was not touched.

