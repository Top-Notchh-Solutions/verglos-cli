# FINAL-WEB-008 public release smoke · 2026-10-19

**Disposition:** public truth/release-smoke qualification only;
`FINAL-WEB-008` remains unchecked because its dependent final claim and
acceptance rows are not complete.

## Exact qualification

- **Repository:** `anuragyadav-git/verglos-web`
- **Source commit:** `0719074d5a6f83198f5e36c0eeb064f2a12e1b1b`
- **Worktree:** disposable clean qualification worktree
  `/private/tmp/verglos-web-qual-web-005-route-e2e-20261019`
- **Runtime:** macOS Darwin arm64; Node `v26.4.0`; pnpm `10.34.5`
- **Scope:** source-level public route manifest, truth registry, public proof
  asset contract, and stale-claim guard. No deploy, provider write, payment,
  customer data, or AppSec/Hunt execution occurred.

## Commands and results

```text
pnpm test:public-release-smoke       PASS: 2/2, 0 failed, 0 skipped
pnpm public:release-smoke            PASS: exit 0
```

The generated report returned schema
`urn:verglos:public-release-smoke:v1`, status `passed`, 15 public routes, 22
total truth claims, 22 publishable claims, 2 bounded public proof assets, and
an empty issue list. The regression test also injected a stale `$29/mo` claim
into a temporary copy and verified that the smoke guard rejected it.

## Evidence integrity

- Test terminal log SHA-256:
  `2e94168cef036f0c09b25eed6791655070ce96b6d7b8c450c9866890f475eff8`
- Smoke terminal log SHA-256:
  `5251365730983e9b6c2a14d0a38d658c72d35aad5046fc21d2fb00419fe89e66`
- No raw source, private evidence, credentials, or customer data was copied
  into this ledger.

## Acceptance boundary

This qualifies the source-level public claim sweep and release smoke only. It
does not close `FINAL-WEB-008`, which remains dependent on FINAL-WEB-001–007,
ACCEPT-003/009, hosted/field acceptance, and the final release decision.
`TEAM-CLI-001` remains checked; AppSec/Hunt rows were not changed.

**Score:** **235 checked / 45 open / 280 total (83.9%)**.
