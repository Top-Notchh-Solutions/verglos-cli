# STUDIO-CLI-001 Production migration and handoff recheck — 2026-10-24

## Provider action

The first Production probe correctly exposed a missing operational handoff
provider path as a bounded JSON 503. The reviewed repository migration set was
then applied through the explicit Vercel build hook:

- Web PR **#268** merged normally as
  `98b5cf652623bf4f000ed93366b67a38154579e1`.
- The hook is inert by default and requires both the Production Vercel target
  and the exact confirmation `I_UNDERSTAND_REVIEWED_PRODUCTION_MIGRATIONS`.
- Vercel build output recorded `pnpm db:migrate` and
  `migrations applied successfully!` before the application build.
- The Production deployment is
  `dpl_37JwVaAw25BoYn4Ase9bn9usm4WL` at
  `https://verglos-26u5hfvn5-anuragyadav20062002s-projects.vercel.app`,
  reported **READY**, and owns `https://verglos.com`,
  `https://www.verglos.com`, and `https://verglos-web.vercel.app`.

This was an additive schema migration only. No customer repository, handoff,
payment, entitlement, account, or acceptance record was inserted or changed.

## Local checks

- Explicit migration-hook contract: **1/1** passed.
- Normal hook execution without the flag: passed and confirmed no database
  write is attempted.
- Public-release smoke: **12/12** passed.
- Handoff route contract: **5/5** passed.
- Truth registry: **37/37** passed.
- Typecheck and `git diff --check`: passed.

## Production recheck

The read-only forged probe ran against the live alias at
`2026-10-23T21:17:33Z`:

| Request | Status | Result |
| --- | ---: | --- |
| `POST /api/v1/handoffs/33333333-3333-4333-8333-333333333333/acknowledge` with `{token:"forged-token",recipientEmail:"recipient@example.invalid"}` | 400 | JSON `{"ok":false,"reason":"handoff unavailable"}`; `application/json`; `no-store`; no acknowledgement created |
| Forged projection POST | 404 | JSON `{"ok":false,"reason":"project not found"}`; `private, no-store`; no projection created |
| Forged handoff collection GET | 401 | JSON `{"ok":false,"reason":"authentication required"}`; `private, no-store` |

The forged UUID, token, project, organization, and recipient address are
synthetic. The 400 is the intended safe absence response after the provider
schema became available; it is not recipient consent and does not claim that
a real handoff exists.

## Shipping disposition

The Production provider boundary for the implemented Studio custody flow is
now operational and the public forged boundary is fail-closed. Keep
`STUDIO-CLI-001` unchecked for a real authorized recipient/customer acceptance
record and its independent acceptance artifact. Score remains **244 checked /
36 open / 280 total (87.1%)**, partitioned as **13 AppSec-dependent / 23
non-AppSec** rows. Nothing was deleted or overwritten.
