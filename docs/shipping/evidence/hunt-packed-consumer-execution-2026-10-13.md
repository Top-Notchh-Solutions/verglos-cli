# Packed public-consumer Hunt execution — 2026-10-13

## Scope

Public CLI PR #93 (`a667d568`) was merged to public `main` at
`fe28730da35ec7f626473e00b68ca27faf1b77d2`. The release clean-consumer
verifier now exercises the packed npm artifact through the real `verglos hunt
--execute` path instead of checking only installation/importability.

## What the verifier does

- Packs and installs all seven public archives in a fresh temporary npm
  consumer.
- Creates a synthetic, signed A1 recipe feed and exact human approval receipt
  using an ephemeral Ed25519 key generated inside the verifier.
- Seeds only an isolated, offline Pro capability cache bound to the synthetic
  `capability-fixture.invalid` origin. No hosted entitlement or payment
  authority is represented.
- Executes the installed `verglos` binary with exact report, recipe,
  trust-store, approval, rule, subject, and observation bindings.
- Requires the expected confirmed verdict through the `restricted-process`
  runtime and checks that the synthetic input and license text are absent from
  output.
- Removes the temporary fixture and isolated HOME after the run.

## Results

- Local packed-consumer verification: passed.
- Result: `status=completed`, `executionAuthorized=true`, recipe
  `a1-utf8-contains`, sandbox `restricted-process`.
- Expected process exit: `1`, because the synthetic positive fixture is
  classified as `confirmed`.
- Existing clean-consumer checks also passed: seven archives installed, all
  public libraries imported, and no external engine installation occurred.
- Full local `pnpm typecheck` passed.
- Full local `pnpm test` passed.
- Protected PR checks passed on macOS, Ubuntu, and Windows with Node 20, 22,
  and 24; the scan and in-toto release-binding checks also passed.

## Limits and disposition

This is packed-artifact and public-CLI execution evidence. It does not prove
hosted entitlement, provider billing, licensed third-party recipe provenance,
Linux/Docker namespace coverage, independent AppSec review, legal approval, or
final release acceptance. No provider, database, Production, npm registry,
customer repository, or source-upload write occurred. No backlog checkbox is
closed by this evidence alone.
