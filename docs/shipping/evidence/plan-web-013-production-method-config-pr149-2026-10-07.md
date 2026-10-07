# PLAN-WEB-013 production payment-method configuration hardening — 2026-10-07

## Batch

Web PR #149: https://github.com/anuragyadav-git/verglos-web/pull/149

- Head pushed: `6b5da26` (`fix(billing): require configured production payment methods`).
- Scope: production validation for `RAZORPAY_ENABLED_PAYMENT_METHODS`.
- No production configuration, database, provider, payment, or browser write.

## Change

Production runtime validation now rejects an unset or blank payment-method
declaration before deployment. QR-only configuration remains rejected; at
least one declared hosted method is required. Preview/runtime behavior still
fails closed when no method is available.

## Verification

- Focused payment-method and runtime-config tests: **8/8 pass, 0 fail, 0 skips**.
- `pnpm typecheck`: pass.
- `pnpm db:check`: pass.
- `VERCEL_ENV=preview NODE_ENV=production pnpm build`: pass; 40 pages generated.
- `git diff --check`: pass.
- Hosted workflow run `37558018780`: pending at evidence capture.
- Vercel preview: pending/deploying at evidence capture.
- GitGuardian and Preview Comments: pass.

## Acceptance boundary

No backlog checkbox changed. This hardens PLAN-WEB-013 but does not close
PLAN-WEB-013, PLAN-WEB-014, or PLAN-WEB-015: account-enabled method truth,
test-mode lifecycle evidence, and production reconciliation remain open.
