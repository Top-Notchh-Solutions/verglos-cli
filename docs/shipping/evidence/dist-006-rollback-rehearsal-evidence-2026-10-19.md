# DIST-006 rollback/revocation rehearsal evidence — 2026-10-19

## Scope

This packet records a bounded local implementation and qualification advance
for `DIST-006`. It exercises the existing immutable rollback decision contract
for the five required release boundaries and emits a source-free JSON report.
It does not execute a provider rollback, registry mutation, signing-key
revocation, Hunt-feed change, or Web deployment change.

## Public source and merge

- Repository: `Top-Notchh-Solutions/verglos-cli`
- Pull request: [#150](https://github.com/Top-Notchh-Solutions/verglos-cli/pull/150)
- Implementation commit: `5dda94f0 feat(release): emit bounded rollback rehearsal evidence`
- Normal merge commit: `31b10613a394fdd229762aba62e6acfb12f53d07`
- Merge method: normal merge; no squash, rebase, or force-push

The public CLI now exposes `release:rollback-evidence` and the
`scripts/release-rollback-evidence.mjs` generator. After a clean build it runs
the canonical five-operation fixture through the CLI rollback-rehearsal
command, validates the machine result, and writes bounded `report.json` and
`run.log` artifacts. The report records operation kinds/actions and compares
the historical-record references before and after the in-memory rehearsal.

## Verification

- New generator test: `node --test scripts/release-rollback-evidence.test.mjs` — **1 pass, 0 fail**.
- Canonical local evidence report: **passed**, 5 operations, 2 historical records, `historicalRecordsPreserved: true`, exit code 0.
- Full CLI package test: `pnpm --filter verglos test` — all executed tests passed; the existing single explicit Hunt A2 integration skip remained unchanged.
- `git diff --check` — passed.
- Hosted matrix run `39183406848` — all Ubuntu/macOS/Windows Node 20/22/24 jobs passed.
- Hosted self-scan run `39183406983` — passed.
- Official standard/provenance validators run `39183406856` — passed.
- In-toto release binding job `117840752558` — passed.

## Boundary and disposition

The fixture uses synthetic immutable references only. The generator does not
call npm, a registry, a signing provider, a Hunt-feed provider, or Vercel, and
does not claim that any real release was revoked or rolled back. Historical
record references remain unchanged in the rehearsal report.

This is a substantive code-side and evidence-generation advance, not row
closure. `DIST-006` remains unchecked pending authenticated rollback/revocation
acceptance for the applicable provider boundaries, release/registry and
signing operational evidence, Web deployment acceptance, and final release
mapping. AppSec/Hunt-held rows were not touched.

## Backlog state

The authoritative private backlog remains **235 checked / 45 open / 280 total
(83.9%)**. The DIST-006 checkbox is intentionally unchanged.
