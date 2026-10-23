# STUDIO-CLI-001 Production handoff acknowledgement boundary — 2026-10-24

## Scope

This is the hosted/runtime follow-up for `STUDIO-CLI-001`. The handoff
acknowledgement endpoint is the final public recipient boundary for an
implemented client-workspace projection custody flow. The probe uses a forged
opaque UUID and forged token only; it is not a customer handoff and must not
mutate Production state.

## Implementation and promotion

- The prior public-route fix added `/api/v1/handoffs(.*)` to the Clerk public
  matcher so the recipient endpoint reaches its own bounded handler. Web
  commit `7e949f7` merged normally in PR **#266** as
  `5d8d1e5cf2cfc34e829c70c838435e6ef84c7bf1`.
- The first live post-#266 forged POST reached the handler but exposed an
  empty HTML HTTP 500 when the database/provider path failed. Web commit
  `2ef7dbb` adds a fail-closed JSON 503 boundary with `Cache-Control:
  no-store`, while preserving the 400 unavailable response for invalid,
  expired, revoked, already-used, or absent handoffs. PR **#267** merged
  normally into `main` as
  `23267349b417e97d00339abc4a60c34c6e802f11`.

## Local implementation checks

- Public handoff route contract: **5/5** passed, including the no-database
  bounded JSON 503 test.
- Public-release smoke: **12/12** passed.
- Truth registry: **37/37** passed.
- Typecheck passed.
- `git diff --check` passed.

## Production provider receipt

The merged source was promoted through Vercel Production as deployment
`dpl_HL3i3uTvo9EQrjPCvYxvbzS9hDyd` at
`https://verglos-5aepk5ooi-anuragyadav20062002s-projects.vercel.app`. It reported
**READY** and owns the live aliases `https://verglos.com`,
`https://www.verglos.com`, and `https://verglos-web.vercel.app`.

The read-only forged probe ran at `2026-10-23T21:09:20Z` against the live
`https://verglos.com` alias.

| Request | Status | Result |
| --- | ---: | --- |
| `POST /api/v1/handoffs/33333333-3333-4333-8333-333333333333/acknowledge` with `{token:"forged-token",recipientEmail:"recipient@example.invalid"}` | 503 | JSON `{"ok":false,"reason":"handoff service unavailable"}`; `application/json`; `no-store`; no acknowledgement created |

Adjacent forged custody-boundary probes returned `401` JSON `authentication
required` with `private, no-store` for projection GET and handoff collection
GET/POST, `404` JSON `project not found` with `private, no-store` for the
forged projection POST, and `405` with no body for the workspace detail GET
(the route does not implement GET). Vercel logs recorded the public
acknowledgement response as a normal `503` serverless request with no uncaught
error.

The UUID and token are forged test values. The probe must never be treated as
recipient consent, customer acceptance, or a successful handoff. No real
recipient email, customer repository, payment, entitlement, account,
database write, provider mutation, final CLI/npm release, or AppSec action is
part of this evidence.

## Shipping disposition

This records a concrete Production route boundary and a safe provider-failure
response for the implemented Studio custody flow. The `503` also records that
the live provider path is not yet operational for a handoff lookup; no
successful recipient lifecycle is claimed. Keep `STUDIO-CLI-001` unchecked:
the independent authorized recipient/customer acceptance artifact and its
acceptance record remain absent, and this forged probe cannot create that
evidence. Score remains **244 checked / 36 open / 280 total (87.1%)**,
partitioned as **13 AppSec-dependent / 23 non-AppSec** rows. Nothing was
deleted or overwritten.
