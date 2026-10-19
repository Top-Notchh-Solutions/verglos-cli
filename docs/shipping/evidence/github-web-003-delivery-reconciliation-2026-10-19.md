# GITHUB-WEB-003 delivery, replay, and reconciliation qualification · 2026-10-19

## Disposition

`GITHUB-WEB-003` is complete and checked. The current Web implementation
binds delivery identity, installation identity, repository identity, commit,
subject, and artifact digests; the focused contracts cover retry, lease,
tenant, and cross-tenant refusal behavior. The owner-authorized isolated
Preview run proved a real source-free GitHub delivery, durable worker
completion, identical replay idempotency, and provider read-back.

`GITHUB-WEB-004` remains open for the separate complete organization cutover,
including uninstall and recovery evidence. Hunt/AppSec state is unchanged.

## Code and contract verification

- **Repository:** `anuragyadav-git/verglos-web`
- **Source commit:** `0719074d5a6f83198f5e36c0eeb064f2a12e1b1b`
- **Focused contract result:** 25/25 passed, 0 failed, 0 skipped, exit 0
- **Preserved contract log:**
  `docs/shipping/evidence/artifacts/github-web-001-2026-10-19/web-contract-tests.log`
- **Log SHA-256:**
  `4b9f00fc6ceea9867be8fb8ea98eb61d933b250b71eb67e03a13f6c394f68ce2`

The accepted SCM implementation and regression suites cover immutable
installation/account/repository binding, bounded source-free check composition,
digest-based admission and duplicate refusal, fenced delivery leases, retry
and terminal-failure classification, provider response bounds, tenant
authorization, and reconciliation of stale provider bindings. The combined
SCM suite was previously recorded as 22/22, with provider transport 7/7 and
delivery 14/14 slices also passing.

## Live isolated Preview delivery

The existing owner-authorized Preview qualification used only source-free
decision metadata. It did not upload source, secrets, tokens, private keys,
customer data, or browser credentials.

- organization: `bca7f024-3053-4f56-af0a-207bf0138862`
- installation: `172686102`
- repository: `Top-Notchh-Solutions/verglos-cli`
- repository ID: `1310272752`
- commit: `5bf7ae70a0e8169f169750cfc188baf4d13685db`
- delivery ID: `2b0bf9db-02e2-4f9e-a66b-373baa2cad04`
- payload digest:
  `sha256:749537ee0402dde616913209277fcca4d3f2b7d82014f8c324ffad174ce700a7`
- decision: `PASS`
- subject/artifact digest:
  `sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`

The protected SCM worker returned `claimed=1`, `delivered=1`,
`retried=0`, `failed=0`, and `leaseLost=0`. GitHub read-back returned one
completed `Verglos / release decision` check for the bound commit with
conclusion `success`, check ID `117825133730`, the exact record URL, and only
bounded decision/subject/artifact output.

An identical second enqueue returned the same delivered provider state and
`deliveryDecision=noop` for the same delivery and payload digest. The
separate reconciliation qualification also recorded stale archive binding
revocation and one active binding for installation `172686102`, repository
`1310272752`, and the qualification project. Cross-tenant and mismatched
identity attempts are covered by the focused authorization and delivery
contract tests and are refused before provider admission.

## Acceptance boundary

This closes the delivery, duplicate replay, identity binding, retry/lease, and
reconciliation contract in `GITHUB-WEB-003`. It does not close
`GITHUB-WEB-004`, which still requires a bounded authorized organization
cutover with uninstall and recovery evidence. It is not production
certification, customer acceptance, or independent AppSec review.

## Score

This closure changes the private backlog from **237 checked / 43 open / 280
total (84.6%)** to **238 checked / 42 open / 280 total (85.0%)**.
