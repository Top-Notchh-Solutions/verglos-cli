# HUNT-008 A2 adapter failure matrix — PR #103

Date: 2026-10-13  
Public repository: `Top-Notchh-Solutions/verglos-cli`  
Pull request: `#103`  
Current public head under validation: `063b05c5b09b50f4b991ba2766321bbe090c31f2`
Merged into public `main` as: `6ff1bd1ee345c9b0f880bf1dfb85045a14be820f`

## Defect found and corrected

The Docker adapter previously evaluated whether the recipe assertion syntax was
supported before preserving the process status. For an A2 target harness that
timed out or failed before producing output, this could incorrectly become
`not-supported` instead of the operational result.

The adapter now gives non-completed execution status precedence:

- timeout → `inconclusive`, `timed-out`, `not_attemptable`;
- infrastructure/daemon failure → `environment-error`, `failed`,
  `not_attemptable`;
- completed malformed harness output remains `not-supported`.

No source, secret, network, or arbitrary command authority was added.

## Matrix

The regression test enumerates all seven A2 families:

1. SQL/NoSQL injection;
2. command injection;
3. path traversal;
4. SSRF;
5. Agent/MCP boundary;
6. XSS;
7. authorization/tenant/mass assignment.

For each family it exercises both timeout and infrastructure-failure adapter
outcomes, for 14 classification assertions. The existing fixture matrix still
covers positive, negative, and unsupported harness results for all seven
families.

## Verification

Local verification on the exact head passed:

```text
pnpm --filter @verglos/hunt test  PASS (46 passed, 16 explicit Linux-host skips, 0 failed)
pnpm --filter verglos test        PASS
pnpm build                        PASS (8/8)
git diff --check                  PASS
```

The attached protected PR validation passed:

- self-scan run `38326574697` — success;
- platform matrix run `38326574687` — success, including in-toto and all
  Ubuntu/macOS/Windows Node 20/22/24 jobs.

The PR was then squash-merged normally; no failed-check or admin bypass was
used.

## Acceptance limitation

This closes a technical result-classification defect and adds regression
coverage. It does not close HUNT-008. Trusted/licensed recipe provenance,
supported-rule approval, complete target-code qualification, hosted entitlement,
Linux/Docker adversarial host evidence, independent review, and final release
treatment remain separate acceptance requirements.

The private tracker remains at **228 checked / 52 unchecked / 280 total
(81.4%)**. No backlog checkbox changed from this implementation slice.
