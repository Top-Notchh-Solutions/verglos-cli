# HUNT release-audit contribution evidence — PR #119

## Identity and disposition

- Public PR: https://github.com/Top-Notchh-Solutions/verglos-cli/pull/119
- Public contribution commit: `bd4d9071d71776fda1e590b5a7e950cee0241fb5`
- Normal merge commit: `88e95586e2e04a5d981e7dd928778d3c01468d3b`
- Merge parents: `646bd9748910ebb16079ba8461ff7af6e2500799` and
  `bd4d9071d71776fda1e590b5a7e950cee0241fb5`.
- GitHub API state: PR `MERGED` at `2026-10-13T11:13:23Z`; the merge commit
  message is `Merge pull request #119 ...`; no squash or force-push was used.
- Protected checks: platform/in-toto run `38384524000` and self-scan run
  `38384523502`; all eleven required jobs completed successfully.

## Implementation and evidence-chain mapping

The public implementation adds a versioned
`urn:verglos:schema:hunt-release-evidence` envelope for proof and retest
results. `verglos hunt proof` and `verglos hunt retest` now emit that typed
identity. The shared audit binds the result to the exact complete Release
Record subject, observation, finding, rule, recipe digest, trust-policy
digest, approval request digest, and verification-attempt payload. The CLI
surface is `verglos hunt audit <evidencePath> --record-store <path>`.

The audit fails closed for an incomplete/tampered record, missing exact
verification attempt, mismatched digest or approval, subject/observation
drift, failed negative control, and non-release-grade proof status. It is
read-only and explicitly leaves the Release Record decision unchanged; it
does not sign, publish, or grant release eligibility.

## Qualification commands and results

- `pnpm typecheck` — exit 0; Turbo reported 14 successful tasks.
- `pnpm lint` — exit 0; Turbo reported 6 successful tasks.
- `pnpm build` — exit 0; Turbo reported 8 successful tasks.
- `pnpm --filter @verglos/shared test` — exit 0; shared contract suite passed,
  including typed proof/retest parsing and positive/tampered exact-binding
  audit cases.
- `pnpm --filter @verglos/hunt test` — exit 0; all non-environment-gated
  tests passed. Existing pinned Docker runtime/target-code qualifications
  remained explicit skips on this host and were not counted as passes.
- `pnpm --filter verglos exec tsx --test src/hunt-worker.test.ts src/hunt-retest.test.ts` — exit 0; 4 tests passed, including proof/retest
  output validation against the new contract.
- `git diff --check` — exit 0.

## Boundary and acceptance mapping

Only public-safe source, schemas, and synthetic/reference fixtures were used.
No customer source/data, provider state, hosted target, live MCP server,
credential, database, production system, arbitrary shell, source upload,
private tracker, npm publish, or held-out experiment was used. The private
backlog, ledger, and this evidence packet remain outside the public
repository.

This is the dependency-ready Release Auditor implementation slice for
HUNT-008/HUNT-009. It does not provide complete per-family authorized target
acceptance, supported-rule approval, trusted/licensed release treatment,
hosted entitlement/provider confirmation, required Linux/Docker qualification,
independent review, or final release acceptance. HUNT-008, HUNT-009,
HUNT-010, and HUNT-011 remain unchecked. No score row changed.

## Live score

The live backlog count was recomputed from
`VERGLOS_V1_BACKLOG.md`: **228 checked / 52 unchecked / 280 total (81.4%)**.
