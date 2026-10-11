
# Hunt A1 utf8-contains fixture results

**Status: PARTIAL — contract run recorded; direct four-case and independent
Linux/Docker evidence remain pending**

## Exact expected cases from the catalog

| Name | Synthetic input shape | Expected verdict | Actual run |
|---|---|---|---|
| positive | value contains the synthetic needle | confirmed | PENDING RUN |
| negative | value does not contain the synthetic needle | not-reproduced | PENDING RUN |
| timeout | bounded probe exceeds declared time | inconclusive | PENDING RUN |
| adapter-failure | restricted adapter is unavailable/fails | environment-error | PENDING RUN |

## Safety rules

- Use synthetic values only.
- Do not use real secrets, customer source, or provider credentials.
- Network must remain denied.
- Record the exact CLI commit, runtime, image digest, command, and exit/result.
- Preserve only redacted output and hashes.
- A timeout or adapter failure must never be recorded as a clean result.

## Run manifest — private shipping workspace recheck

- CLI commit: 73161c06c7a2959760a80a8317aadd0654e956a8
- Worktree: verglos-cli-private-shipping
- Command: pnpm --filter @verglos/hunt test
- Result: 45 focused checks passed, 16 Docker integration checks skipped,
  0 failed; process exited 0
- Docker image/digest: not exercised by this run
- Result file hash: no raw test transcript retained; terminal output was
  reviewed and summarized here
- Redaction check: source tests passed their bounded-output/redaction
  assertions; no customer data or secrets were used
- Reviewer: [PENDING]
- Date UTC: 2026-10-12

## Interpretation

The run confirms the catalog and bounded adapter contracts. The 16 skipped
cases are not passes: they require the pinned Linux/Docker integration fixture
and include non-root, read-only source, network denial, no host socket,
devices, no-new-privileges, output/resource bounds, namespaces, and signal
cleanup. The exact four fixture outcomes still need a retained run manifest
from the supported execution path.

## Decision

This record becomes evidence only after the four cases are actually run and the
manifest is filled. The catalog declaration alone is not a run result.
