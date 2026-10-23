# HUNT verification-attempt contribution evidence — PR #120

## Identity and disposition

- Public PR: https://github.com/Top-Notchh-Solutions/verglos-cli/pull/120
- Public contribution commit: `5b0f1bacee00d4c5f72e22fa0eeedef782c939be`
- Normal merge commit: `fb3d35af0187d852d6bae5dd0795b9fb0d9a7cf7`
- Merge parents: `88e95586e2e04a5d981e7dd928778d3c01468d3b` and
  `5b0f1bacee00d4c5f72e22fa0eeedef782c939be`.
- GitHub API state: PR `MERGED` at `2026-10-13T11:34:41Z`; `main` points to
  the merge commit. No squash or force-push was used.
- Protected checks: platform/in-toto run `38390079021` and self-scan run
  `38390079002`; all eleven required jobs completed successfully, including
  Ubuntu/macOS/Windows Node 20/22/24 and the in-toto binding.

## Implementation and evidence-chain mapping

The public implementation adds a schema-validated shared producer for a
record-native `VerificationAttemptDocument`. Hunt proof now emits an exact
attempt binding for subject, observation, finding, rule, recipe, trust policy,
approval, runtime, bounded usage, verdict, and output-evidence digest. The
Release Auditor requires the embedded attempt and confirms that the exact
attempt ID is present in the complete Release Record.

A1 records measured worker CPU and peak RSS telemetry. A2 records the pinned
Docker runtime identity and explicit unavailable-counter limitations because
the adapter does not expose container CPU/memory/disk counters. No raw output,
fixture input, customer source, or arbitrary command is placed in the attempt.

## Qualification commands and results

- `pnpm build` — exit 0; Turbo reported 8 successful tasks.
- `pnpm typecheck` — exit 0; Turbo reported 14 successful tasks.
- `pnpm lint` — exit 0; Turbo reported 6 successful tasks.
- `pnpm --filter @verglos/shared test` — exit 0; shared contract and exact
  verification-attempt/release-audit tests passed.
- `pnpm --filter @verglos/hunt test` — exit 0; Hunt core, adapter, and
  attempt-emission tests passed. Existing environment-gated Docker runtime and
  target-code cases remained explicit skips on this macOS host and were not
  counted as passes.
- `pnpm --filter verglos test` — exit 0; no failures. The existing viewer
  loopback-listener case remained an explicit sandbox-policy skip.
- `git diff --check` — exit 0.

## Boundary and acceptance mapping

Only public-safe source, schemas, and synthetic/reference fixtures were used.
No customer source/data, provider state, hosted target, live MCP server,
credential, database, production system, arbitrary shell, source upload,
private tracker, npm publish, or held-out experiment was used. Owner
authorization is not independent review, provider confirmation, customer
acceptance, legal clearance, or final release approval.

This advances the HUNT-008/HUNT-009 producer and Release Record-binding
implementation layer only. It does not complete per-family authorized target
acceptance, supported-rule approval, trusted/licensed release treatment,
hosted entitlement/provider confirmation, required Linux/Docker qualification,
independent review, or final release acceptance. HUNT-008, HUNT-009,
HUNT-010, and HUNT-011 remain unchecked. No `.vgl` record was produced and no
score row changed.

## Live score

The live backlog count remains **228 checked / 52 unchecked / 280 total
(81.4%)**. The score was not updated because the complete HUNT-008 acceptance
criteria did not pass.
