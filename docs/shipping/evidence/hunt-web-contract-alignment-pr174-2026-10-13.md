# Web Hunt/Attest contract-alignment PR #174 — 2026-10-13

## Scope

This packet records the public-safe Web copy and agent-instruction alignment
for the approved Final V1 feature matrix. It does not claim hosted Hunt,
Attest, billing, SCM, or release acceptance.

## Source and change

- Repository: `anuragyadav-git/verglos-web`
- Pull request: [#174](https://github.com/anuragyadav-git/verglos-web/pull/174)
- Three preserved source commits:
  - `58cc5a62b6619f4910f824dcfc53bf9fe53dc877` — Web shipping boundaries
  - `fc036e792fc0fb5085f3db993a52aa7f7b70fb7e` — bounded Hunt copy
  - `e4950caa1ce18229c6bb2feb21c2192c02bd8b18` — portable Attest copy
- Regular merge commit on Web `main`:
  `63de97be6b180c560ef06d9cbccb62eea20beb4a`
- No squash or force-push was used.

## Public changes

- Web instructions now identify bounded signed A1/A2 Hunt execution as an
  implementation path while preserving the hosted qualification gates.
- Hunt, Attest, 2.0.0 direction, homepage plan copy, and `llms.txt` no longer
  describe the public runtime as only an old alpha shell or promise beta
  capabilities as live.
- Copy explicitly avoids claims of autonomous AI attackers, general remote
  DAST, complete customer-code coverage, or host/OS isolation.
- The public page keeps hosted entitlement, provenance, signing, review,
  recipient, and final release evidence qualification-gated.

## Verification

- Local `pnpm typecheck` passed.
- Local production `pnpm build` passed and generated 47 routes.
- Protected typecheck/schema workflow passed, including serial tests,
  private-runner E2E, negative-boundary and truth-registry tests, database and
  migration checks, build, public-boundary audit, dependency audit, SBOM,
  license inventory/tests, and tracked-secret guard.
- Vercel Preview deployment completed successfully.
- GitGuardian passed.

## Acceptance boundary

This is public copy and instruction alignment only. No backlog checkbox,
entitlement, payment, database, Production, customer, or provider state was
written. The private score remains **228 checked / 52 unchecked / 280 total
(81.4%)**.
