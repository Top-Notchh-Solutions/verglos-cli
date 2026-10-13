# HUNT MCP/CLI contract contribution evidence — PR #121

## Identity and disposition

- Public PR: https://github.com/Top-Notchh-Solutions/verglos-cli/pull/121
- Public contribution commits: `3eb4defecd8e76601619b276e0509c42a8e6299d`
  and follow-up `d1b189e2458b10394fe956dc2cc84073d429fe1c`.
- Normal merge commit: `95ecf1bad7ff1cee69cf49eee2d0a4946c15bb0b`.
- Merge parents: `fb3d35af0187d852d6bae5dd0795b9fb0d9a7cf7` and
  `d1b189e2458b10394fe956dc2cc84073d429fe1c`.
- GitHub API state: PR `MERGED` at `2026-10-13T11:57:35Z`; `main` points to
  the merge commit. No squash, rebase, or force-push was used.
- Protected verification: platform/in-toto run `38392822867` and self-scan
  run `38392822885`; all eleven required jobs completed successfully,
  including Ubuntu/macOS/Windows Node 20/22/24 and the in-toto binding.

## Implementation and contract mapping

The public CLI Hunt execution projection now carries the same exact binding
needed by the MCP Hunt finding/report bridge: subject, observation, rule,
recipe digest, trust-policy digest, and approval-request digest. Each bounded
runtime outcome is projected into a schema-validated record-native
`VerificationAttemptDocument`, and the outcome carries the exact attempt ID.
The attempt includes runtime identity, bounded usage, canonical verdict,
execution state, and output-evidence digest without placing raw fixture input
or source content in the projection.

The execution preflight also fails closed when an eligible report finding's
rule does not match the requested approved recipe binding. The packed consumer
fixture was updated to declare that exact rule, preserving clean consumer
qualification under the stricter contract. MCP documentation now states the
approval, entitlement, trust, scope, and signed-record boundaries explicitly.

## Qualification commands and results

- `pnpm build` — exit 0; Turbo reported 8 successful tasks.
- `pnpm typecheck` — exit 0; Turbo reported 14 successful tasks.
- `pnpm lint` — exit 0; Turbo reported 6 successful tasks.
- `pnpm --filter @verglos/mcp test` — exit 0; all 48 MCP tests passed.
- `node --import tsx --test --test-concurrency=1 src/hunt-execute.test.ts`
  from `packages/cli` — 6 passed, 1 existing Docker integration skip, 0
  failures.
- `pnpm --filter verglos test` — exit 0; complete CLI suite passed with no
  failures; existing Docker-dependent Hunt qualifications remained explicit
  skips without the integration flag.
- `node --test scripts/verify-clean-consumer.test.mjs` — 1 passed.
- `git diff --check` — exit 0.

The first protected run exposed the packed fixture's missing rule binding and
failed; that failure was corrected in the separate follow-up commit
`d1b189e2`. The complete rerun above is the accepted evidence set.

## Boundary and acceptance mapping

Only public-safe implementation, synthetic/reference fixtures, and the packed
consumer contract were used. No customer source/data, provider state, hosted
target, credential, database, live MCP server, production system, source
upload, npm publish, `.vgl` record, or held-out experiment was used. The MCP/
CLI projection is not itself a signed `.vgl` Release Record. A2 resource
counters that the Docker adapter does not expose remain explicit limitations;
unavailable counters are not claimed as measured consumption.

This advances the HUNT MCP/CLI execution-contract and verification-attempt
implementation layer only. HUNT-008 and HUNT-009 remain unchecked for
complete per-family authorized target acceptance, supported-rule approval,
trusted/licensed treatment, hosted entitlement/provider confirmation, required
Linux/Docker qualification, independent review, `.vgl` binding, and final
release acceptance. HUNT-010 and HUNT-011 also remain unchecked. No score row
changed.

## Live score

The live backlog count remains **228 checked / 52 unchecked / 280 total
(81.4%)**. The score was not updated because the complete row acceptance
criteria did not pass.
