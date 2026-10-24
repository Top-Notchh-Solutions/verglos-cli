# ACCEPT-005 owner-authorized public-OSS workflow execution — 2026-10-24

## Real bounded execution

The owner-authorized public-OSS path was executed against the exact frozen
`buggy-node` commit:

- Repository: `https://github.com/UtkarshGupta-CS/buggy-node`
- Exact source commit: `b1b9cbc8b86f81a1ecb0b142190d4fa4698518da`
- License: ISC; license/terms digest:
  `sha256:6bb3b6b43b9560a396a2cc760b63cc57cf734ff6a6f8430f31473744426e5cd1`
- Clone archive digest:
  `sha256:a8ac7ebbe847d049804e205cc8504a33769306f74d1b289e26258b2dec8030ab`
- CLI commit/version: `aad2c74395a5c381c955ab9dfab7462295564840` /
  `2.0.0-alpha.4`
- Command: `VERGLOS_TELEMETRY=0 node packages/cli/dist/index.js scan
  --json --quiet --no-telemetry --output <private-output-dir>`
- Result: exit `0`, complete coverage, `7` files walked, `59` findings,
  `1502 ms` scan duration.
- Private report digest:
  `sha256:b0c16b3501645fa832fc898949000793f3ffd9326ac3aaf2f0de4cae0db7f8a7`

The workflow validator returned `workflowStatus: accepted` with zero failures,
`publicOssBenchmark: authorized`, `customerAcceptance: not-claimed`, and
`independentReview: required`. The byte-bound input is
`accept-005-owner-authorized-public-oss-workflow-2026-10-24.json`; the full
private execution, report, license record, validator result, and expiry record
are retained under:
`.local-evidence/authorized-public-oss-workflow-2026-10-24/buggy-node/`.

## Boundary and expiry

Telemetry and source upload were disabled, the scan network policy was denied,
and the output is private local derived evidence. The authorization expires at
`2026-10-25T04:00:00Z`; the expiry record is confirmed. Per the owner's
preservation instruction, no files were deleted. This is not external customer
consent, recipient acceptance, independent review, provider/Production action,
or final release sign-off.

Keep `ACCEPT-005` unchecked for its separate external customer-owner/recipient
POC, independent review, and final acceptance. No checkbox changed; the
authoritative score remains **245 checked / 35 open / 280 total (87.5%)**, split
**13 AppSec-dependent / 22 non-AppSec**. No paid Actions run, payment,
publication, customer data operation, or deletion occurred.
