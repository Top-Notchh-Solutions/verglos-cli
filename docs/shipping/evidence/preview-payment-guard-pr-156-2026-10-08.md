# Preview payment guard — Web PR #156

- **Public repository:** `anuragyadav-git/verglos-web`
- **Merged commit:** `f75609f14a8c6b385663b768226cf2c0586c0812`
- **Pull request:** #156, “Fail closed on live payment keys in Preview”
- **Scope:** Preview runtime configuration only.

## Change

Preview now rejects a configured payment method set when either Razorpay key is
not a `rzp_test_` key, when the public and server key IDs differ, or when the
server secret/webhook secret is missing. Preview remains payment-disabled when
no method set is configured. The existing production validator is unchanged.

## Verification

- Focused runtime/config tests: 27 pass, 0 fail.
- Hosted Web typecheck, serial suite, negative-boundary suite, truth registry,
  database checks, migration checks, build, boundary audit, dependency and
  license checks: pass.
- Vercel Preview and GitGuardian checks: pass.
- A live-key Preview fixture fails with the expected test-key errors.

## Limitation

This is safety hardening, not payment acceptance evidence. No order, payment,
webhook, entitlement, database, provider, or production write was performed.
PLAN-WEB-014 and PLAN-WEB-015 remain open.
