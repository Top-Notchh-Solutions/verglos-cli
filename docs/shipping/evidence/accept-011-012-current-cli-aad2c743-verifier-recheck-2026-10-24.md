# ACCEPT-011/012 current CLI corpus verifier recheck · 2026-10-24

## Execution

The owner-authorized local public-OSS analysis was reverified against CLI
commit `aad2c74395a5c381c955ab9dfab7462295564840` with telemetry disabled,
source upload disabled, and private local derived reports. The run used the
existing exact-commit fixture clones and retained report directory; no source,
customer data, or provider state was changed.

- Verification timestamp: `2026-10-24T00:47:30.278Z` UTC.
- Verification JSON: `.local-evidence/public-oss-corpus-2026-10-24-cli-aad2c743-rerun-v1/verification-aad2c743-recheck-20261024.json`.
- Verification JSON SHA-256: `9fee9eb8f5bdba47317c9a992bccc476490d57a3bb8fe842eec390e8b4c009a2`.
- Triage JSON: `.local-evidence/public-oss-corpus-2026-10-24-cli-aad2c743-rerun-v1/triage-aad2c743-recheck-20261024.json`.
- Triage JSON SHA-256: `036362cfbb0546b869cea8c2aac4f895908d33a2578e698670eef7dd70d96097`.

## Result

- **8/8** exact-commit full clones verified.
- **13,494** files walked across the corpus.
- All required architecture shapes are present: `small`, `multi-user`,
  `multi-tenant-team`, and `enterprise-like`.
- **0** coverage gaps.
- Bounded triage: **351** observations across **23** rule groups.
- Classification is complete; observations remain unadjudicated, customer
  acceptance is not claimed, and independent review remains required.

This recheck advances the implementation/reproducibility inputs for
`ACCEPT-011` and `ACCEPT-012`. It does not close either row and does not create
provider/Production, recipient, legal, human/field, independent AppSec/Hunt,
or final-release evidence. No backlog checkbox changed; the authoritative
score remains **245 checked / 35 open / 280 total (87.5%)**, partitioned as
**13 AppSec-dependent / 22 non-AppSec** rows.
