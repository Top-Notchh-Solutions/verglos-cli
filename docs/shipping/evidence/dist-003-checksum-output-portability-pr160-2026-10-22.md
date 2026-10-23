# DIST-003 checksum-output portability and normal merge — 2026-10-22

## Implementation

CLI commits `97dead55b7fa9ce94da6e85662b719d0ad623dca` and
`6ae6a2a525ecc061e6fef99b91a44fc00504214f` close two code-side portability
gaps. Checksum generation now refuses an existing symlink at `SHA256SUMS`
instead of overwriting its target; the regression proves the sentinel remains
unchanged. Windows upgrade/rollback qualification now retries bounded cleanup
when Node/npm briefly retains a temporary-consumer handle.

PR [#160](https://github.com/Top-Notchh-Solutions/verglos-cli/pull/160)
passed its complete required check set and merged normally as
`56b3535a1feffdac74a202259433d8f8536890e7`. The source branch remains
preserved. No file, branch, record, deployment, registry, provider, customer,
database, or production artifact was deleted or changed by the qualification.

## Verification

- Focused release qualification: **16/16** passed.
- Forced workspace test/typecheck/build graph: **23/23** tasks passed with
  zero failures; existing Hunt Docker/A2 cases remained explicit skips.
- Hosted platform matrix `39783743149`: **9/9** Ubuntu/macOS/Windows ×
  Node 20/22/24 jobs passed.
- Self-scan `39783742975`, standard/provenance validation `39783742882`, and
  in-toto release binding job `119841347844` passed.
- `git diff --check` passed.

This closes the checksum-output portability implementation slice only.
`DIST-003` remains unchecked for protected/trusted publication, immutable
attestation, legal/license clearance, provider action, and final release
acceptance. Score remains **239 checked / 41 open / 280 total (85.4%)**.
