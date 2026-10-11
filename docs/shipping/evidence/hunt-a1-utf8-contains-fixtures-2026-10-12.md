
# Hunt A1 utf8-contains fixture results

**Status: DRAFT — fixture contract collected; execution manifest pending**

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

## Run manifest

- CLI commit: [CODE WILL FILL]
- Worktree: [CODE WILL FILL]
- Node/runtime: [CODE WILL FILL]
- Docker image/digest: [CODE WILL FILL OR N/A FOR PURE CASE]
- Commands: [CODE WILL FILL FROM TEST RUN]
- Result file hash: [CODE WILL FILL]
- Redaction check: [CODE WILL FILL]
- Reviewer: [PENDING]
- Date UTC: [PENDING]

## Decision

This record becomes evidence only after the four cases are actually run and the
manifest is filled. The catalog declaration alone is not a run result.

